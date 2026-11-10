#!/usr/bin/env node
// Autopilot CLI — the deterministic glue the GitHub workflows call.
// Usage: node scripts/autopilot/cli.mjs <command> [--flag value ...]

import { execFileSync } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync, cpSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadConfig } from './lib/config.mjs';
import { changedLineCoverage, overallCoverage } from './lib/coverage.mjs';
import { evaluateGate, renderGateComment } from './lib/gate.mjs';
import { createClient } from './lib/github.mjs';
import { classifyRisk, uncoveredByCodeowners } from './lib/risk.mjs';
import { attemptFromLabels, LABELS, labelNames, renderTaskBody, selectReadyTasks, topoSort } from './lib/tasks.mjs';
import { collectDashboardData } from './lib/dashboard-collect.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..', '..');

const [, , command, ...rest] = process.argv;
const args = parseArgs(rest);
// Config and gate logic always come from ROOT (the trusted checkout this script
// lives in). The code being judged may live elsewhere: --repo-dir.
const REPO = resolve(args['repo-dir'] ?? ROOT);

const commands = {
  ci, risk, coverage, gate, 'next-step': nextStep, 'open-pr': openPr, dispatch, 'create-tasks': createTasks,
  dashboard, labels: ensureLabels, 'check-codeowners': checkCodeowners, codeowners: writeCodeowners,
};

if (!commands[command]) {
  console.error(`Unknown command "${command}". Commands: ${Object.keys(commands).join(', ')}`);
  process.exit(2);
}
await commands[command]();

// ---------------------------------------------------------------------------

// Runs the configured commands in REPO and records pass/fail/skipped for each.
async function ci() {
  const config = loadConfig(ROOT);
  const only = args.only ? String(args.only).split(',') : ['setup', 'lint', 'typecheck', 'test', 'build', 'coverage'];
  const results = {};
  for (const name of only) {
    const cmd = config.commands[name];
    if (!cmd) {
      results[name] = { status: 'skipped' };
      continue;
    }
    console.log(`\n::group::${name}: ${cmd}`);
    const started = Date.now();
    let status = 'pass';
    try {
      execFileSync('bash', ['-o', 'pipefail', '-c', cmd], { cwd: REPO, stdio: 'inherit', env: { ...process.env, CI: 'true' } });
    } catch {
      status = 'fail';
    }
    console.log('::endgroup::');
    results[name] = { status, seconds: Math.round((Date.now() - started) / 1000) };
    console.log(`${status === 'pass' ? '✔' : '✖'} ${name}`);
    if (name === 'setup' && status === 'fail') break;
  }
  write(args.out, results);
}

async function risk() {
  const config = loadConfig(ROOT);
  const files = git(['diff', '--name-only', `${args.base}...HEAD`]).split('\n').filter(Boolean);
  const result = { files, ...classifyRisk(files, config) };
  write(args.out, result);
  output('level', result.level);
  output('requires_owner', String(result.requiresOwner));
  console.log(`Risk: ${result.level} (${files.length} files changed)`);
}

async function coverage() {
  const config = loadConfig(ROOT);
  const lcovPath = join(REPO, config.coverage.lcovPath);
  if (!existsSync(lcovPath)) {
    write(args.out, null);
    console.log(`No LCOV report at ${config.coverage.lcovPath}`);
    return;
  }
  const lcovText = readFileSync(lcovPath, 'utf8');
  const diff = git(['diff', '-U0', '--no-color', `${args.base}...HEAD`]);
  const changed = changedLineCoverage({
    lcov: { text: lcovText, root: REPO + '/' },
    diff,
    include: config.coverage.include,
    exclude: config.coverage.exclude,
  });
  const baselineText = args.baseline && existsSync(args.baseline) ? readFileSync(args.baseline, 'utf8') : null;
  const result = {
    changed,
    overall: overallCoverage(lcovText),
    baseline: baselineText ? overallCoverage(baselineText) : null,
  };
  write(args.out, result);
  console.log(`Changed lines: ${changed.percent}% · overall: ${result.overall}% · baseline: ${result.baseline ?? 'n/a'}`);
}

async function gate() {
  const config = loadConfig(ROOT);
  const ci = readJson(args.ci, {});
  const cov = readJson(args.coverage, null);
  const riskResult = readJson(args.risk, null);
  const verdicts = [];
  if (args.verdicts && existsSync(args.verdicts)) {
    for (const f of walk(args.verdicts).filter((p) => p.endsWith('.json'))) {
      const v = readJson(f, null);
      if (v) verdicts.push(v);
    }
  }
  const attempt = Number(args.attempt ?? 1);
  const result = evaluateGate({ config, ci, coverage: cov, verdicts, risk: riskResult });
  const comment = renderGateComment({ result, coverage: cov, verdicts, attempt, maxAttempts: config.maxFixAttempts, sha: args.sha });
  write(args.result, { ...result, attempt, verdicts });
  if (args.comment) writeFileSync(args.comment, comment);
  output('passed', String(result.passed));
  output('merge_action', result.mergeAction);
  console.log(comment);
  // Exit code drives the required status check.
  process.exitCode = result.passed ? 0 : 1;
}

// Decides what happens after the gate: auto-merge, wait for owner, fix, or escalate.
async function nextStep() {
  const config = loadConfig(ROOT);
  const gh = createClient();
  const pr = Number(args.pr);
  const result = readJson(args.result);
  const prData = await gh.get(`/repos/{repo}/pulls/${pr}`);
  const labels = labelNames(prData);
  const attempt = attemptFromLabels(labels);
  const isAutopilot = labels.includes(LABELS.pr);
  const taskNumber = Number(/(?:closes|fixes|resolves)\s+#(\d+)/i.exec(prData.body ?? '')?.[1]) || null;

  await removeLabel(gh, pr, LABELS.awaitingOwner);

  if (result.mergeAction === 'auto-merge') {
    if (!isAutopilot && !config.autoMergeHumanPrs) {
      console.log('Gate passed; human-authored PR, leaving merge to the author.');
      return;
    }
    sh('gh', ['pr', 'merge', String(pr), '--auto', '--squash', '--delete-branch']);
    console.log(`PR #${pr}: auto-merge enabled.`);
    return;
  }

  if (result.mergeAction === 'await-owner') {
    await addLabels(gh, pr, [LABELS.awaitingOwner]);
    console.log(`PR #${pr}: passed, awaiting owner approval (risk: ${result.risk?.level}).`);
    return;
  }

  // Gate failed.
  if (!isAutopilot) {
    console.log('Gate failed on a human-authored PR; findings posted, no automated fix.');
    return;
  }
  if (attempt < config.maxFixAttempts) {
    const next = attempt + 1;
    await removeLabel(gh, pr, `${LABELS.attemptPrefix}${attempt}`);
    await addLabels(gh, pr, [`${LABELS.attemptPrefix}${next}`]);
    sh('gh', ['workflow', 'run', 'autopilot-fix.yml', '-f', `pr=${pr}`, '-f', 'mode=fix', '-f', `attempt=${next}`]);
    console.log(`PR #${pr}: dispatched fixer (attempt ${next}/${config.maxFixAttempts}).`);
  } else {
    await addLabels(gh, pr, [LABELS.needsHuman]);
    if (taskNumber) {
      await removeLabel(gh, taskNumber, LABELS.review);
      await addLabels(gh, taskNumber, [LABELS.needsHuman]);
    }
    sh('gh', ['workflow', 'run', 'autopilot-fix.yml', '-f', `pr=${pr}`, '-f', 'mode=diagnose', '-f', `attempt=${attempt}`]);
    console.log(`PR #${pr}: attempts exhausted — escalated to owner, diagnosis requested.`);
  }
}

// Starts ready tasks, keeps open PRs current, and plans approved contracts.
async function dispatch() {
  const config = loadConfig(ROOT);
  const gh = createClient();
  const dryRun = Boolean(args['dry-run']);

  // Approved contracts with no tasks yet → plan them (backstop for missed events).
  const contracts = await gh.paginate(`/repos/{repo}/issues?state=open&labels=${enc(LABELS.contract)},${enc(LABELS.approved)}`);
  const tasks = await gh.paginate(`/repos/{repo}/issues?state=all&labels=${enc(LABELS.task)}`);
  for (const c of contracts.filter((c) => !c.pull_request)) {
    const hasTasks = tasks.some((t) => new RegExp(`\\*\\*Contract:\\*\\* #${c.number}\\b`).test(t.body ?? ''));
    const planning = labelNames(c).includes('autopilot:planning');
    if (!hasTasks && !planning) {
      console.log(`Contract #${c.number}: approved with no tasks → planning`);
      if (!dryRun) {
        await addLabels(gh, c.number, ['autopilot:planning']);
        sh('gh', ['workflow', 'run', 'autopilot-plan.yml', '-f', `contract=${c.number}`]);
      }
    }
  }

  // Close contracts whose tasks are all done.
  for (const c of contracts.filter((c) => !c.pull_request)) {
    const own = tasks.filter((t) => new RegExp(`\\*\\*Contract:\\*\\* #${c.number}\\b`).test(t.body ?? ''));
    if (own.length && own.every((t) => t.state === 'closed')) {
      console.log(`Contract #${c.number}: all ${own.length} tasks done → completing`);
      if (!dryRun) {
        await gh.post(`/repos/{repo}/issues/${c.number}/comments`, {
          body: `✅ All ${own.length} tasks merged. Contract complete — the retrospective agent will review this project.`,
        });
        await gh.patch(`/repos/{repo}/issues/${c.number}`, { state: 'closed', state_reason: 'completed' });
        sh('gh', ['workflow', 'run', 'autopilot-retro.yml', '-f', `contract=${c.number}`]);
      }
    }
  }

  // Start ready tasks within the concurrency limit.
  const open = tasks.filter((t) => !t.pull_request);
  const { ready, blocked, active, slots } = selectReadyTasks(open, { maxConcurrent: config.maxConcurrent });
  console.log(`Active: ${active}/${config.maxConcurrent} · free slots: ${slots} · ready: ${ready.join(', ') || 'none'}`);
  for (const b of blocked) console.log(`  #${b.number} waiting on ${b.waitingOn.map((n) => '#' + n).join(', ')}`);
  for (const n of ready) {
    if (dryRun) continue;
    await removeLabel(gh, n, LABELS.queued);
    await addLabels(gh, n, [LABELS.building]);
    sh('gh', ['workflow', 'run', 'autopilot-build.yml', '-f', `task=${n}`]);
    console.log(`Task #${n}: build dispatched`);
  }

  // Keep open Autopilot PRs mergeable as the base branch moves.
  const pulls = await gh.paginate(`/repos/{repo}/pulls?state=open`);
  for (const p of pulls.filter((p) => labelNames(p).includes(LABELS.pr))) {
    const full = await gh.get(`/repos/{repo}/pulls/${p.number}`);
    if (full.mergeable_state === 'behind') {
      console.log(`PR #${p.number}: behind base → updating branch`);
      if (!dryRun) await gh.put(`/repos/{repo}/pulls/${p.number}/update-branch`, {}).catch((e) => console.log(`  ${e.message}`));
    } else if (full.mergeable_state === 'dirty' && !labelNames(full).includes(LABELS.needsHuman)) {
      console.log(`PR #${p.number}: merge conflict → dispatching fixer to resolve`);
      if (!dryRun) sh('gh', ['workflow', 'run', 'autopilot-fix.yml', '-f', `pr=${p.number}`, '-f', 'mode=conflict', '-f', `attempt=${attemptFromLabels(labelNames(full))}`]);
    }
  }
}

// Pushes the current branch and opens (or reuses) an Autopilot PR.
async function openPr() {
  const config = loadConfig(ROOT);
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD']).trim();
  const base = config.defaultBranch;
  const ahead = Number(git(['rev-list', '--count', `origin/${base}..HEAD`]).trim());
  if (ahead === 0) {
    output('opened', 'false');
    console.log(`No commits on ${branch} beyond ${base}; nothing to open.`);
    return;
  }
  sh('git', ['push', '-u', 'origin', branch]);
  const existing = execFileSync('gh', ['pr', 'list', '--head', branch, '--state', 'open', '--json', 'number', '-q', '.[0].number'], { cwd: REPO, encoding: 'utf8' }).trim();
  let number = existing;
  if (!existing) {
    const bodyFile = args['body-file'] && existsSync(args['body-file']) ? args['body-file'] : null;
    const fallback = join(REPO, '.git', 'autopilot-pr-body.md');
    if (!bodyFile) writeFileSync(fallback, args.task ? `Closes #${args.task}\n` : 'Opened by Autopilot.\n');
    let body = readFileSync(bodyFile ?? fallback, 'utf8');
    if (args.task && !new RegExp(`(closes|fixes|resolves)\\s+#${args.task}\\b`, 'i').test(body)) body = `Closes #${args.task}\n\n${body}`;
    writeFileSync(fallback, body);
    const url = execFileSync('gh', ['pr', 'create', '--base', base, '--head', branch, '--title', args.title, '--body-file', fallback, '--label', LABELS.pr, '--label', `${LABELS.attemptPrefix}1`], { cwd: REPO, encoding: 'utf8' }).trim();
    number = url.split('/').pop();
    console.log(`Opened ${url}`);
  } else {
    console.log(`PR #${existing} already open for ${branch}; pushed new commits.`);
  }
  output('opened', 'true');
  output('pr', number);
}

// Turns the planner's structured plan into dependency-ordered task issues.
async function createTasks() {
  const gh = createClient();
  const contract = Number(args.contract);
  const plan = readJson(args.plan);
  if (!Array.isArray(plan?.tasks) || plan.tasks.length === 0) throw new Error('Plan has no tasks');
  const ordered = topoSort(plan.tasks);
  const numbers = new Map();
  for (const task of ordered) {
    const issue = await gh.post('/repos/{repo}/issues', {
      title: task.title,
      body: renderTaskBody(task, { contractNumber: contract, issueNumbersById: numbers }),
      labels: [LABELS.task, LABELS.queued],
    });
    numbers.set(task.id, issue.number);
    console.log(`Created #${issue.number}: ${task.title}`);
  }
  const list = ordered.map((t) => `- [ ] #${numbers.get(t.id)} ${t.title}`).join('\n');
  await gh.post(`/repos/{repo}/issues/${contract}/comments`, {
    body: `## 🗺️ Plan\n\n${plan.summary ?? ''}\n\n${list}\n\nTasks run in dependency order, up to ${loadConfig(ROOT).maxConcurrent} at a time.`,
  });
  await removeLabel(gh, contract, 'autopilot:planning');
}

async function dashboard() {
  const out = resolve(args.out ?? join(ROOT, '_site'));
  mkdirSync(out, { recursive: true });
  cpSync(join(ROOT, 'dashboard'), out, { recursive: true });

  let model;
  if (args.demo) {
    model = JSON.parse(readFileSync(join(ROOT, 'dashboard', 'demo-data.json'), 'utf8'));
  } else {
    model = await collectDashboardData(createClient(), loadConfig(ROOT));
  }
  writeFileSync(join(out, 'data.json'), JSON.stringify(model, null, 2));
  console.log(`Dashboard written to ${out} (${model.summary.tasksTotal} tasks, ${model.needsYou.length} need you)`);
  if (args.serve) await serve(out, Number(args.port ?? 8765));
}

// Minimal static server for previewing the dashboard locally.
async function serve(dir, port) {
  const { createServer } = await import('node:http');
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
  createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    const file = resolve(dir, '.' + (path === '/' ? '/index.html' : path));
    if (!file.startsWith(dir) || !existsSync(file)) {
      res.writeHead(404).end('Not found');
      return;
    }
    res.writeHead(200, { 'content-type': types[file.slice(file.lastIndexOf('.'))] ?? 'application/octet-stream' });
    res.end(readFileSync(file));
  }).listen(port, () => console.log(`Serving http://localhost:${port}`));
}

async function ensureLabels() {
  const gh = createClient();
  const wanted = [
    [LABELS.contract, '5319e7', 'Autopilot: a scoped contract (unit of approval)'],
    [LABELS.approved, '0e8a16', 'Autopilot: contract approved by owner'],
    ['autopilot:planning', 'c5def5', 'Autopilot: planner is breaking the contract into tasks'],
    [LABELS.task, '1d76db', 'Autopilot: a task planned from a contract'],
    [LABELS.queued, 'bfdadc', 'Autopilot: task waiting for dependencies / a free slot'],
    [LABELS.building, 'fbca04', 'Autopilot: builder agent is implementing'],
    [LABELS.review, '0052cc', 'Autopilot: PR open and going through the gate'],
    [LABELS.needsHuman, 'b60205', 'Autopilot: blocked — needs the owner'],
    [LABELS.awaitingOwner, 'd93f0b', 'Autopilot: passed gate, touches owner-gated paths'],
    [LABELS.pr, '5319e7', 'Autopilot-managed pull request'],
    ...[1, 2, 3, 4, 5].map((n) => [`${LABELS.attemptPrefix}${n}`, 'ededed', `Autopilot: gate attempt ${n}`]),
  ];
  const existing = new Set((await gh.paginate('/repos/{repo}/labels')).map((l) => l.name));
  for (const [name, color, description] of wanted) {
    if (existing.has(name)) continue;
    await gh.post('/repos/{repo}/labels', { name, color, description });
    console.log(`Created label ${name}`);
  }
  console.log('Labels ready.');
}

async function checkCodeowners() {
  const config = loadConfig(ROOT);
  const path = join(ROOT, '.github', 'CODEOWNERS');
  const text = existsSync(path) ? readFileSync(path, 'utf8') : '';
  const missing = uncoveredByCodeowners(config, text);
  if (missing.length) {
    console.error(`CODEOWNERS does not cover these owner-gated globs:\n${missing.map((m) => '  ' + m).join('\n')}`);
    console.error('Run: node scripts/autopilot/cli.mjs codeowners');
    process.exit(1);
  }
  console.log('CODEOWNERS covers every protected and risky path.');
}

async function writeCodeowners() {
  const config = loadConfig(ROOT);
  const owner = args.owner ?? config.owner;
  if (!owner) throw new Error('Set "owner" in .autopilot/config.json or pass --owner <github-user>');
  const lines = [
    '# Generated by `node scripts/autopilot/cli.mjs codeowners` from .autopilot/config.json.',
    '# Protected paths define the gate itself; risky paths are high blast radius.',
    '# With "Require review from Code Owners" enabled, GitHub blocks merging these without the owner.',
    '',
    '# Protected',
    ...config.protectedPaths.map((g) => `${g} @${owner}`),
    '',
    '# Risky',
    ...config.riskyPaths.map((g) => `${g} @${owner}`),
    '',
  ];
  writeFileSync(join(ROOT, '.github', 'CODEOWNERS'), lines.join('\n'));
  console.log('Wrote .github/CODEOWNERS');
}

// ---------------------------------------------------------------------------

async function addLabels(gh, number, labels) {
  await gh.post(`/repos/{repo}/issues/${number}/labels`, { labels });
}

async function removeLabel(gh, number, label) {
  await gh.del(`/repos/{repo}/issues/${number}/labels/${enc(label)}`).catch((e) => {
    if (e.status !== 404) throw e;
  });
}

function parseArgs(list) {
  const out = {};
  for (let i = 0; i < list.length; i++) {
    if (!list[i].startsWith('--')) continue;
    const key = list[i].slice(2);
    const next = list[i + 1];
    if (next === undefined || next.startsWith('--')) out[key] = true;
    else {
      out[key] = next;
      i++;
    }
  }
  return out;
}

function git(argv) {
  return execFileSync('git', argv, { cwd: REPO, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
}

function sh(cmd, argv) {
  execFileSync(cmd, argv, { cwd: REPO, stdio: 'inherit' });
}

function readJson(path, fallback) {
  if (!path || !existsSync(path)) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing file: ${path}`);
  }
  const text = readFileSync(path, 'utf8').trim();
  if (!text) return fallback ?? null;
  return JSON.parse(text);
}

function write(path, data) {
  const text = JSON.stringify(data, null, 2);
  if (path) writeFileSync(path, text);
  else console.log(text);
}

function output(key, value) {
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)],
  );
}

function enc(s) {
  return encodeURIComponent(s);
}
