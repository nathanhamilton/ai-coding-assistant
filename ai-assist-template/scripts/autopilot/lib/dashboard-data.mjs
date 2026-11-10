// Turns raw GitHub data into the dashboard view model. Pure: no I/O.

import { LABELS, labelNames, parseContractRef, parseDependencies, taskState } from './tasks.mjs';

const DAY = 24 * 60 * 60 * 1000;

export function buildViewModel({ repo, issues, pulls, gateRecords, learningCommits, maxAttempts = 3, now = new Date() }) {
  const contractIssues = issues.filter((i) => labelNames(i).includes(LABELS.contract));
  const taskIssues = issues.filter((i) => labelNames(i).includes(LABELS.task));

  const tasks = taskIssues.map((i) => ({
    number: i.number,
    title: i.title,
    url: i.html_url,
    state: taskState(i),
    contract: parseContractRef(i.body),
    dependsOn: parseDependencies(i.body),
    updatedAt: i.updated_at,
  }));

  const contracts = contractIssues
    .map((i) => {
      const own = tasks.filter((t) => t.contract === i.number);
      const approved = labelNames(i).includes(LABELS.approved);
      return {
        number: i.number,
        title: i.title,
        url: i.html_url,
        state: i.state === 'closed' ? 'complete' : !approved ? 'awaiting-approval' : own.length ? 'building' : 'planning',
        progress: { done: own.filter((t) => t.state === 'done').length, total: own.length },
        tasks: own.map((t) => t.number),
        createdAt: i.created_at,
      };
    })
    .sort((a, b) => b.number - a.number);

  const board = { queued: [], building: [], 'in-review': [], 'needs-human': [], done: [] };
  for (const t of tasks) if (board[t.state]) board[t.state].push(t);
  board.done.sort((a, b) => (b.updatedAt ?? '').localeCompare(a.updatedAt ?? ''));
  board.done = board.done.slice(0, 15);

  const autopilotPulls = pulls.filter((p) => labelNames(p).includes(LABELS.pr));
  const pipeline = autopilotPulls
    .filter((p) => p.state === 'open')
    .map((p) => {
      const records = gateRecords[p.number] ?? [];
      const latest = records[records.length - 1] ?? null;
      const labels = labelNames(p);
      return {
        number: p.number,
        title: p.title,
        url: p.html_url,
        task: linkedTask(p.body),
        stage: prStage(p, labels, latest),
        attempt: latest?.attempt ?? 1,
        risk: latest?.risk ?? null,
        gate: latest,
        updatedAt: p.updated_at,
      };
    });

  const merged = autopilotPulls
    .filter((p) => p.merged_at)
    .map((p) => {
      const records = gateRecords[p.number] ?? [];
      const final = records[records.length - 1] ?? null;
      return {
        number: p.number,
        title: p.title,
        url: p.html_url,
        mergedAt: p.merged_at,
        gateRuns: records.length,
        firstPass: records.length > 0 && records[0].passed === true,
        changedCoverage: final?.changedCoverage ?? null,
        overallCoverage: final?.overallCoverage ?? null,
      };
    })
    .sort((a, b) => b.mergedAt.localeCompare(a.mergedAt));

  const needsYou = [];
  for (const c of contracts.filter((c) => c.state === 'awaiting-approval')) {
    needsYou.push({ kind: 'approve-contract', number: c.number, title: c.title, url: c.url, reason: 'Contract waiting for your approval' });
  }
  for (const p of pipeline) {
    if (p.stage === 'awaiting-owner') {
      needsYou.push({ kind: 'approve-merge', number: p.number, title: p.title, url: p.url, reason: `Passed the gate; touches ${p.risk ?? 'owner-gated'} paths` });
    } else if (p.stage === 'needs-human') {
      needsYou.push({ kind: 'unblock', number: p.number, title: p.title, url: p.url, reason: 'Exhausted fix attempts — see diagnosis comment' });
    }
  }
  const coveredTasks = new Set(pipeline.filter((p) => p.stage === 'needs-human').map((p) => p.task));
  for (const t of board['needs-human']) {
    if (!coveredTasks.has(t.number)) {
      needsYou.push({ kind: 'unblock', number: t.number, title: t.title, url: t.url, reason: 'Task blocked — needs a decision' });
    }
  }

  const recentMerged = merged.filter((m) => now - new Date(m.mergedAt) <= 7 * DAY);
  const gated = merged.filter((m) => m.gateRuns > 0);
  const coverageTrend = merged
    .filter((m) => m.overallCoverage != null)
    .map((m) => ({ at: m.mergedAt, overall: m.overallCoverage, number: m.number }))
    .reverse();

  return {
    generatedAt: now.toISOString(),
    repo,
    maxAttempts,
    summary: {
      contractsActive: contracts.filter((c) => c.state !== 'complete').length,
      tasksDone: tasks.filter((t) => t.state === 'done').length,
      tasksTotal: tasks.length,
      prsOpen: pipeline.length,
      mergedLast7d: recentMerged.length,
      firstPassRate: gated.length ? Math.round((gated.filter((m) => m.firstPass).length / gated.length) * 100) : null,
      avgGateRuns: gated.length ? Math.round((gated.reduce((s, m) => s + m.gateRuns, 0) / gated.length) * 10) / 10 : null,
      latestCoverage: coverageTrend.length ? coverageTrend[coverageTrend.length - 1].overall : null,
      needsYou: needsYou.length,
    },
    needsYou,
    contracts,
    board,
    pipeline,
    merged: merged.slice(0, 25),
    coverageTrend,
    learning: learningCommits ?? [],
  };
}

export function linkedTask(body) {
  const m = /(?:closes|fixes|resolves)\s+#(\d+)/i.exec(body ?? '');
  return m ? Number(m[1]) : null;
}

function prStage(pr, labels, latest) {
  if (labels.includes(LABELS.needsHuman)) return 'needs-human';
  if (labels.includes(LABELS.awaitingOwner)) return 'awaiting-owner';
  if (!latest || latest.sha !== pr.head?.sha) return 'gating';
  if (latest.passed) return 'merging';
  return 'fixing';
}
