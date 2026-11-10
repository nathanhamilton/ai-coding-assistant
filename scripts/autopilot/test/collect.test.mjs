import { test } from 'node:test';
import assert from 'node:assert/strict';

import { collectDashboardData, LEARNING_PATHS } from '../lib/dashboard-collect.mjs';
import { renderGateComment } from '../lib/gate.mjs';

function fakeClient(routes) {
  const calls = [];
  const lookup = (path) => {
    calls.push(path);
    const key = Object.keys(routes).find((k) => path.startsWith(k));
    if (!key) throw new Error(`unexpected ${path}`);
    const v = routes[key];
    if (v instanceof Error) throw v;
    return typeof v === 'function' ? v(path) : v;
  };
  return { repo: 'o/r', calls, get: async (p) => lookup(p), paginate: async (p) => lookup(p) };
}

const gateBody = (passed, extra = {}) =>
  renderGateComment({
    result: { passed, failures: passed ? [] : ['x'], warnings: [], mergeAction: passed ? 'auto-merge' : 'fix', risk: { level: 'standard' } },
    coverage: { changed: { percent: 95, hit: 19, total: 20, files: [] }, overall: 88, ...extra },
    verdicts: [],
    attempt: 1,
    maxAttempts: 3,
    sha: 'abc',
  });

test('collects issues, PR gate records, and learning commits into a view model', async () => {
  const gh = fakeClient({
    '/repos/{repo}/issues?state=all': [
      { number: 1, title: 'C', state: 'open', html_url: 'u1', labels: [{ name: 'autopilot:contract' }, { name: 'autopilot:approved' }], body: '' },
      { number: 2, title: 'T', state: 'closed', html_url: 'u2', labels: [{ name: 'autopilot:task' }], body: '**Contract:** #1\n**Depends on:** none' },
      { number: 3, title: 'PR shadow', pull_request: {}, labels: [], body: '' },
    ],
    '/repos/{repo}/pulls?state=all': [
      { number: 3, title: 'PR', state: 'closed', merged_at: '2026-10-10T00:00:00Z', html_url: 'p3', labels: [{ name: 'autopilot' }], body: 'Closes #2' },
      { number: 4, title: 'Human', state: 'open', html_url: 'p4', labels: [], body: '' },
    ],
    '/repos/{repo}/issues/3/comments': [{ body: 'hi' }, { body: gateBody(false) }, { body: gateBody(true) }],
    '/repos/{repo}/commits?path=.autopilot': [{ sha: 'aaaaaaa111', html_url: 'c1', commit: { message: 'learned: x\n\nbody', author: { date: '2026-10-09T00:00:00Z' } } }],
    '/repos/{repo}/commits?path=ai-project-assist%2Fprojects': [
      { sha: 'aaaaaaa111', html_url: 'c1', commit: { message: 'learned: x', author: { date: '2026-10-09T00:00:00Z' } } },
      { sha: 'bbbbbbb222', html_url: 'c2', commit: { message: 'kb: y', author: { date: '2026-10-11T00:00:00Z' } } },
    ],
    '/repos/{repo}/commits?path=ai-project-assist%2Fstandards': new Error('404'),
  });

  const vm = await collectDashboardData(gh, { maxFixAttempts: 4 }, { now: new Date('2026-10-12T00:00:00Z') });
  assert.equal(vm.repo, 'o/r');
  assert.equal(vm.maxAttempts, 4);
  assert.deepEqual(vm.contracts.map((c) => [c.number, c.progress]), [[1, { done: 1, total: 1 }]]);
  assert.equal(vm.merged.length, 1);
  assert.equal(vm.merged[0].gateRuns, 2);
  assert.equal(vm.merged[0].firstPass, false);
  assert.equal(vm.merged[0].overallCoverage, 88);
  assert.deepEqual(vm.learning.map((l) => [l.sha, l.message]), [['bbbbbbb', 'kb: y'], ['aaaaaaa', 'learned: x']]);
  assert.ok(!gh.calls.includes('/repos/{repo}/issues/4/comments'), 'non-autopilot PR comments are not fetched');
  assert.equal(LEARNING_PATHS.length, 3);
});

test('tolerates empty commit listings', async () => {
  const gh = fakeClient({
    '/repos/{repo}/issues?state=all': [],
    '/repos/{repo}/pulls?state=all': [],
    '/repos/{repo}/commits': null,
  });
  const vm = await collectDashboardData(gh, { maxFixAttempts: 3 });
  assert.deepEqual(vm.learning, []);
  assert.equal(vm.summary.tasksTotal, 0);
});
