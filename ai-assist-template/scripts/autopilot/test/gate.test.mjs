import { test } from 'node:test';
import assert from 'node:assert/strict';

import { DEFAULTS } from '../lib/config.mjs';
import { blockingFindings, evaluateGate, parseGateRecord, renderGateComment, validateVerdict } from '../lib/gate.mjs';

const config = structuredClone(DEFAULTS);
const ROLES = config.gate.requiredReviewers;

const ci = { lint: { status: 'pass' }, test: { status: 'pass' }, coverage: { status: 'pass' } };
const coverage = { changed: { percent: 95, hit: 19, total: 20, files: [] }, overall: 88, baseline: 88 };
const approveAll = () => ROLES.map((role) => ({ role, decision: 'approve', summary: 'ok', findings: [] }));
const standard = { level: 'standard', requiresOwner: false, reasons: [] };
const risky = { level: 'risky', requiresOwner: true, reasons: [{ file: 'src/auth/a.ts', glob: '**/auth/**', kind: 'risky' }] };

test('gate passes and auto-merges when everything is green', () => {
  const r = evaluateGate({ config, ci, coverage, verdicts: approveAll(), risk: standard });
  assert.equal(r.passed, true);
  assert.deepEqual(r.failures, []);
  assert.equal(r.mergeAction, 'auto-merge');
});

test('gate passes but waits for owner on risky paths', () => {
  const r = evaluateGate({ config, ci, coverage, verdicts: approveAll(), risk: risky });
  assert.equal(r.passed, true);
  assert.equal(r.mergeAction, 'await-owner');
});

test('gate fails closed on missing, skipped, or failed CI', () => {
  assert.match(evaluateGate({ config, ci: {}, coverage, verdicts: approveAll(), risk: standard }).failures[0], /did not report/);
  const skipped = { ...ci, lint: { status: 'skipped' } };
  assert.match(evaluateGate({ config, ci: skipped, coverage, verdicts: approveAll(), risk: standard }).failures[0], /not configured/);
  const failed = { ...ci, test: { status: 'fail' } };
  assert.ok(evaluateGate({ config, ci: failed, coverage, verdicts: approveAll(), risk: standard }).failures.includes('CI: "test" failed'));
  const optionalFail = { ...ci, build: { status: 'fail' } };
  assert.ok(evaluateGate({ config, ci: optionalFail, coverage, verdicts: approveAll(), risk: standard }).failures.includes('CI: "build" failed'));
});

test('gate enforces changed-line coverage and no overall drop', () => {
  const low = { ...coverage, changed: { ...coverage.changed, percent: 89.9 } };
  const r1 = evaluateGate({ config, ci, coverage: low, verdicts: approveAll(), risk: standard });
  assert.equal(r1.passed, false);
  assert.equal(r1.mergeAction, 'fix');
  assert.match(r1.failures[0], /89.9%/);
  const drop = { ...coverage, overall: 87.5 };
  assert.match(evaluateGate({ config, ci, coverage: drop, verdicts: approveAll(), risk: standard }).failures[0], /dropped 0.5/);
  assert.match(evaluateGate({ config, ci, coverage: null, verdicts: approveAll(), risk: standard }).failures[0], /no coverage report/);
  const off = structuredClone(config);
  off.gate.coverage.enabled = false;
  assert.equal(evaluateGate({ config: off, ci, coverage: null, verdicts: approveAll(), risk: standard }).passed, true);
});

test('gate requires every reviewer to approve with a valid verdict', () => {
  const missing = approveAll().filter((v) => v.role !== 'security');
  assert.match(evaluateGate({ config, ci, coverage, verdicts: missing, risk: standard }).failures[0], /security did not return/);

  const rejected = approveAll().map((v) =>
    v.role === 'reviewer'
      ? { ...v, decision: 'request_changes', findings: [{ severity: 'blocking', title: 'Null deref', file: 'a.js', line: 3, detail: 'x' }] }
      : v,
  );
  const r = evaluateGate({ config, ci, coverage, verdicts: rejected, risk: standard });
  assert.match(r.failures[0], /reviewer requested changes \(1 blocking\)/);

  const contradictory = approveAll().map((v) =>
    v.role === 'security' ? { ...v, findings: [{ severity: 'blocking', title: 'SQLi' }] } : v,
  );
  assert.match(evaluateGate({ config, ci, coverage, verdicts: contradictory, risk: standard }).failures[0], /approved but reported 1 blocking/);

  const invalid = approveAll().map((v) => (v.role === 'acceptance' ? { role: 'acceptance', decision: 'lgtm', findings: [] } : v));
  assert.match(evaluateGate({ config, ci, coverage, verdicts: invalid, risk: standard }).failures[0], /invalid verdict/);

  const warn = approveAll().map((v) => (v.role === 'test-quality' ? { ...v, findings: [{ severity: 'warning', title: 'Weak assertion' }] } : v));
  const w = evaluateGate({ config, ci, coverage, verdicts: warn, risk: standard });
  assert.equal(w.passed, true);
  assert.deepEqual(w.warnings, ['test-quality: Weak assertion']);
});

test('validateVerdict rejects malformed input', () => {
  assert.equal(validateVerdict(null), 'not an object');
  assert.match(validateVerdict({ decision: 'approve' }), /findings/);
  assert.match(validateVerdict({ decision: 'approve', findings: [{ severity: 'meh', title: 'x' }] }), /severity/);
  assert.match(validateVerdict({ decision: 'approve', findings: [{ severity: 'note' }] }), /title/);
  assert.equal(validateVerdict({ decision: 'approve', findings: [] }), null);
});

test('gate comment embeds a parseable record', () => {
  const verdicts = approveAll().map((v) =>
    v.role === 'reviewer' ? { ...v, decision: 'request_changes', findings: [{ severity: 'blocking', title: 'Bug', file: 'a.js', line: 2, detail: 'line1\nline2' }] } : v,
  );
  const cov = { ...coverage, changed: { ...coverage.changed, files: [{ file: 'a.js', missed: ['4-6'] }] } };
  const result = evaluateGate({ config, ci, coverage: cov, verdicts, risk: risky });
  const body = renderGateComment({ result, coverage: cov, verdicts, attempt: 2, maxAttempts: 3, sha: 'abcdef1234' });
  assert.match(body, /❌ Autopilot gate — failed/);
  assert.match(body, /\[reviewer\] Bug\*\* — `a.js:2`/);
  assert.match(body, /`a.js`: 4-6/);
  assert.match(body, /Owner-gated paths/);
  const record = parseGateRecord(body);
  assert.equal(record.passed, false);
  assert.equal(record.attempt, 2);
  assert.equal(record.risk, 'risky');
  assert.equal(record.blocking, 1);
  assert.equal(record.reviewers.reviewer, 'request_changes');
  assert.equal(parseGateRecord('nothing'), null);
  assert.equal(parseGateRecord('<!-- autopilot-gate {bad json} -->'), null);

  const pass = evaluateGate({ config, ci, coverage, verdicts: approveAll(), risk: standard });
  assert.match(renderGateComment({ result: pass, coverage: null, verdicts: [], attempt: 1, maxAttempts: 3 }), /Auto-merge enabled/);
  const owner = evaluateGate({ config, ci, coverage, verdicts: approveAll(), risk: risky });
  assert.match(renderGateComment({ result: { ...owner, warnings: ['x'] }, coverage, verdicts: [], attempt: 1, maxAttempts: 3 }), /owner approves/);
});

test('blockingFindings flattens per role', () => {
  assert.deepEqual(blockingFindings(undefined), []);
  assert.deepEqual(
    blockingFindings([{ role: 'a', findings: [{ severity: 'blocking', title: 't' }, { severity: 'note', title: 'n' }] }, { role: 'b' }]),
    [{ role: 'a', severity: 'blocking', title: 't' }],
  );
});
