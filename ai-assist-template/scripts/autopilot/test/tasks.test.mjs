import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  attemptFromLabels, findCycle, LABELS, parseContractRef, parseDependencies,
  renderTaskBody, selectReadyTasks, taskState, topoSort,
} from '../lib/tasks.mjs';
import { buildViewModel } from '../lib/dashboard-data.mjs';

const issue = (number, labels, { state = 'open', deps = [], contract = 1 } = {}) => ({
  number,
  state,
  title: `Task ${number}`,
  html_url: `https://x/${number}`,
  labels: labels.map((name) => ({ name })),
  body: `**Contract:** #${contract}\n**Depends on:** ${deps.length ? deps.map((d) => '#' + d).join(', ') : 'none'}`,
  updated_at: `2026-10-0${number % 9}T00:00:00Z`,
});

test('parses dependencies and contract refs', () => {
  assert.deepEqual(parseDependencies('**Depends on:** #3, #12'), [3, 12]);
  assert.deepEqual(parseDependencies('Depends on: none'), []);
  assert.deepEqual(parseDependencies(''), []);
  assert.deepEqual(parseDependencies(undefined), []);
  assert.equal(parseContractRef('**Contract:** #42'), 42);
  assert.equal(parseContractRef('nope'), null);
});

test('task state comes from labels and issue state', () => {
  assert.equal(taskState(issue(1, [LABELS.queued])), 'queued');
  assert.equal(taskState(issue(1, [LABELS.building])), 'building');
  assert.equal(taskState(issue(1, [LABELS.review])), 'in-review');
  assert.equal(taskState(issue(1, [LABELS.review, LABELS.needsHuman])), 'needs-human');
  assert.equal(taskState(issue(1, [LABELS.queued], { state: 'closed' })), 'done');
  assert.equal(taskState(issue(1, [])), 'unscheduled');
  assert.equal(taskState({ state: 'open', labels: ['autopilot:queued'] }), 'queued', 'string labels');
});

test('attempt is the highest attempt label, default 1', () => {
  assert.equal(attemptFromLabels([]), 1);
  assert.equal(attemptFromLabels(['autopilot:attempt-2', 'autopilot:attempt-3', 'x']), 3);
});

test('scheduler respects dependencies, order, and concurrency', () => {
  const issues = [
    issue(10, [LABELS.queued], { state: 'closed' }),
    issue(11, [LABELS.queued], { deps: [10] }),
    issue(12, [LABELS.queued], { deps: [11] }),
    issue(13, [LABELS.queued]),
    issue(14, [LABELS.queued], { deps: [99] }),
    issue(15, [LABELS.queued]),
    issue(16, [LABELS.building]),
  ];
  const r = selectReadyTasks(issues, { maxConcurrent: 3 });
  assert.equal(r.active, 1);
  assert.equal(r.slots, 2);
  assert.deepEqual(r.ready, [11, 13]);
  assert.deepEqual(r.blocked, [{ number: 12, waitingOn: [11] }, { number: 14, waitingOn: [99] }]);

  const full = selectReadyTasks([...issues, issue(17, [LABELS.review]), issue(18, [LABELS.building])], { maxConcurrent: 3 });
  assert.deepEqual(full.ready, []);
  assert.equal(full.slots, 0);
});

test('plans: cycles are rejected, topo order puts dependencies first', () => {
  const plan = [
    { id: 'c', dependsOn: ['a', 'b'] },
    { id: 'a' },
    { id: 'b', dependsOn: ['a'] },
  ];
  assert.deepEqual(topoSort(plan).map((t) => t.id), ['a', 'b', 'c']);
  assert.deepEqual(findCycle([{ id: 'a', dependsOn: ['b'] }, { id: 'b', dependsOn: ['a'] }]), ['a', 'b', 'a']);
  assert.throws(() => topoSort([{ id: 'a', dependsOn: ['a'] }]), /cycle/);
  assert.throws(() => topoSort([{ id: 'a', dependsOn: ['zzz'] }]), /unknown task "zzz"/);
  assert.equal(findCycle([{ id: 'a', dependsOn: ['ext'] }]), null);
});

test('renders a task body the scheduler can read back', () => {
  const body = renderTaskBody(
    { id: 'b', goal: 'Do B', acceptanceCriteria: ['B works'], dependsOn: ['a'] },
    { contractNumber: 7, issueNumbersById: new Map([['a', 20]]) },
  );
  assert.equal(parseContractRef(body), 7);
  assert.deepEqual(parseDependencies(body), [20]);
  assert.match(body, /- \[ \] B works/);
  assert.match(body, /_Builder decides._/);
  assert.match(body, /\*\*Size:\*\* m/);
  const noDeps = renderTaskBody({ id: 'a', goal: 'g', acceptanceCriteria: [], notes: 'n', size: 's' }, { contractNumber: 7, issueNumbersById: new Map() });
  assert.deepEqual(parseDependencies(noDeps), []);
});

test('dashboard view model: board, pipeline, needs-you, metrics', () => {
  const now = new Date('2026-10-14T00:00:00Z');
  const contract = (n, labels, state = 'open') => ({ number: n, state, title: `C${n}`, html_url: `u${n}`, labels: labels.map((name) => ({ name })), body: '', created_at: '2026-10-01' });
  const issues = [
    contract(1, [LABELS.contract, LABELS.approved]),
    contract(2, [LABELS.contract]),
    contract(3, [LABELS.contract, LABELS.approved], 'closed'),
    contract(4, [LABELS.contract, LABELS.approved]),
    issue(10, [LABELS.task], { state: 'closed' }),
    issue(11, [LABELS.task, LABELS.review]),
    issue(12, [LABELS.task, LABELS.needsHuman]),
    issue(13, [LABELS.task, LABELS.queued]),
  ];
  const pr = (number, labels, extra = {}) => ({ number, title: `PR${number}`, html_url: `p${number}`, labels: labels.map((name) => ({ name })), state: 'open', head: { sha: 'aaa' }, ...extra });
  const pulls = [
    pr(20, [LABELS.pr]),
    pr(21, [LABELS.pr, LABELS.awaitingOwner]),
    pr(22, [LABELS.pr, LABELS.needsHuman], { body: 'Closes #99' }),
    pr(25, [LABELS.pr, LABELS.needsHuman], { body: 'Fixes #12' }),
    pr(23, [LABELS.pr]),
    pr(24, [LABELS.pr]),
    pr(30, [LABELS.pr], { state: 'closed', merged_at: '2026-10-12T00:00:00Z' }),
    pr(31, [LABELS.pr], { state: 'closed', merged_at: '2026-09-01T00:00:00Z' }),
    pr(32, ['other'], { state: 'closed', merged_at: '2026-10-12T00:00:00Z' }),
  ];
  const gateRecords = {
    20: [{ passed: false, sha: 'old' }],
    23: [{ passed: true, sha: 'aaa', attempt: 1, risk: 'standard' }],
    24: [{ passed: false, sha: 'aaa', attempt: 2 }],
    30: [{ passed: true, overallCoverage: 91, changedCoverage: 100 }],
    31: [{ passed: false }, { passed: true, overallCoverage: 90 }],
  };
  const vm = buildViewModel({ repo: 'o/r', issues, pulls, gateRecords, learningCommits: [], now });

  assert.deepEqual(vm.contracts.map((c) => [c.number, c.state]), [[4, 'planning'], [3, 'complete'], [2, 'awaiting-approval'], [1, 'building']]);
  assert.deepEqual(vm.contracts.find((c) => c.number === 1).progress, { done: 1, total: 4 });
  assert.deepEqual(Object.fromEntries(Object.entries(vm.board).map(([k, v]) => [k, v.map((t) => t.number)])), {
    queued: [13], building: [], 'in-review': [11], 'needs-human': [12], done: [10],
  });
  assert.deepEqual(vm.pipeline.map((p) => [p.number, p.stage]), [[20, 'gating'], [21, 'awaiting-owner'], [22, 'needs-human'], [25, 'needs-human'], [23, 'merging'], [24, 'fixing']]);
  assert.equal(vm.pipeline.find((p) => p.number === 25).task, 12);
  assert.equal(vm.pipeline.find((p) => p.number === 20).task, null);
  // Task #12 is blocked by PR #25, so it's listed once (as the PR), not twice.
  assert.deepEqual(vm.needsYou.map((n) => [n.kind, n.number]), [['approve-contract', 2], ['approve-merge', 21], ['unblock', 22], ['unblock', 25]]);
  assert.equal(vm.summary.mergedLast7d, 1);
  assert.equal(vm.summary.firstPassRate, 50);
  assert.equal(vm.summary.avgGateRuns, 1.5);
  assert.equal(vm.summary.latestCoverage, 91);
  assert.deepEqual(vm.coverageTrend.map((c) => c.number), [31, 30]);
  assert.equal(vm.merged.length, 2, 'non-autopilot PRs excluded');

  const empty = buildViewModel({ repo: 'o/r', issues: [], pulls: [], gateRecords: {} });
  assert.equal(empty.summary.firstPassRate, null);
  assert.equal(empty.summary.latestCoverage, null);
  assert.deepEqual(empty.learning, []);
});
