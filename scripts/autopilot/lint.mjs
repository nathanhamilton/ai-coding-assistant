#!/usr/bin/env node
// Autopilot lint: syntax, JSON validity, CODEOWNERS coverage, and
// (in the source repo) template drift. Exits non-zero on any problem.

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadConfig } from './lib/config.mjs';
import { uncoveredByCodeowners } from './lib/risk.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const problems = [];

// Files shared verbatim between this repo and the distributable template.
// Repo-specific files (.autopilot/config.json, .autopilot/learned/, CODEOWNERS)
// are intentionally excluded.
const MIRRORED = [
  '.autopilot/charter.md',
  '.autopilot/README.md',
  '.autopilot/roles',
  '.autopilot/schemas',
  '.github/workflows',
  'scripts/autopilot/cli.mjs',
  'scripts/autopilot/lint.mjs',
  'scripts/autopilot/setup.sh',
  'scripts/autopilot/lib',
  'scripts/autopilot/test',
  'dashboard',
  '.claude/commands/autopilot.md',
  '.claude/commands/launch.md',
  '.github/prompts/launch.prompt.md',
  '.github/prompts/autopilot.prompt.md',
  '.github/prompts/project.prompt.md',
];

const files = (dir) =>
  existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
        d.isDirectory() ? files(join(dir, d.name)) : [join(dir, d.name)],
      )
    : [];

// 1. JavaScript syntax
for (const f of [...files(join(ROOT, 'scripts/autopilot')), ...files(join(ROOT, 'dashboard'))]) {
  if (!/\.(mjs|js)$/.test(f)) continue;
  try {
    execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' });
  } catch (e) {
    problems.push(`Syntax error in ${relative(ROOT, f)}: ${e.stderr?.toString().split('\n').slice(0, 4).join(' ')}`);
  }
}

// 2. JSON validity
for (const f of [...files(join(ROOT, '.autopilot')), ...files(join(ROOT, 'dashboard'))]) {
  if (!f.endsWith('.json')) continue;
  try {
    JSON.parse(readFileSync(f, 'utf8'));
  } catch (e) {
    problems.push(`Invalid JSON in ${relative(ROOT, f)}: ${e.message}`);
  }
}

// 2b. Schemas are passed inside single quotes on the CLI; they must not contain one.
for (const f of files(join(ROOT, '.autopilot/schemas'))) {
  if (readFileSync(f, 'utf8').includes("'")) problems.push(`${relative(ROOT, f)} must not contain single quotes (breaks --json-schema quoting)`);
}

// 3. Config loads and every role referenced by the gate has a prompt.
let config;
try {
  config = loadConfig(ROOT);
  for (const role of config.gate.requiredReviewers) {
    if (!existsSync(join(ROOT, '.autopilot/roles', `${role}.md`))) problems.push(`Missing role prompt .autopilot/roles/${role}.md`);
  }
} catch (e) {
  problems.push(`.autopilot/config.json does not load: ${e.message}`);
}

// 4. CODEOWNERS must enforce every owner-gated path.
if (config && (config.protectedPaths.length || config.riskyPaths.length)) {
  const path = join(ROOT, '.github/CODEOWNERS');
  if (!existsSync(path)) problems.push('Missing .github/CODEOWNERS (run: node scripts/autopilot/cli.mjs codeowners)');
  else {
    for (const g of uncoveredByCodeowners(config, readFileSync(path, 'utf8'))) {
      problems.push(`CODEOWNERS does not cover owner-gated path: ${g}`);
    }
  }
}

// 5. Template drift (only in the repo that ships the template).
const TEMPLATE = join(ROOT, 'ai-assist-template');
if (existsSync(TEMPLATE)) {
  for (const entry of MIRRORED) {
    const src = join(ROOT, entry);
    const dst = join(TEMPLATE, entry);
    if (!existsSync(src)) continue;
    const srcFiles = statSync(src).isDirectory() ? files(src) : [src];
    for (const f of srcFiles) {
      const rel = relative(ROOT, f);
      const copy = join(TEMPLATE, rel);
      if (!existsSync(copy)) problems.push(`Template missing ${rel} (copy it to ai-assist-template/${rel})`);
      else if (!readFileSync(f).equals(readFileSync(copy))) problems.push(`Template drift: ai-assist-template/${rel} differs from ${rel}`);
    }
    if (existsSync(dst) && statSync(dst).isDirectory()) {
      for (const f of files(dst)) {
        const rel = relative(TEMPLATE, f);
        if (!existsSync(join(ROOT, rel))) problems.push(`Template has stale file ai-assist-template/${rel}`);
      }
    }
  }
}

if (problems.length) {
  console.error(`✖ ${problems.length} problem(s):\n` + problems.map((p) => `  - ${p}`).join('\n'));
  process.exit(1);
}
console.log('✔ Autopilot lint passed');
