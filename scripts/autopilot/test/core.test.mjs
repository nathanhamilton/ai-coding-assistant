import { test } from 'node:test';
import assert from 'node:assert/strict';

import { globToRegExp, matchesAny } from '../lib/glob.mjs';
import { classifyRisk, uncoveredByCodeowners } from '../lib/risk.mjs';
import { changedLineCoverage, overallCoverage, parseDiffAddedLines, parseLcov } from '../lib/coverage.mjs';
import { DEFAULTS, enforceFloors } from '../lib/config.mjs';

test('glob: ** spans directories, * stays in a segment', () => {
  assert.ok(matchesAny('src/auth/login.ts', ['**/auth/**']));
  assert.ok(matchesAny('auth/login.ts', ['**/auth/**']));
  assert.ok(!matchesAny('src/authors.ts', ['**/auth/**']));
  assert.ok(matchesAny('db/migrate/001.rb', ['db/migrate/']));
  assert.ok(matchesAny('.github/workflows/ci.yml', ['.github/workflows/*.yml']));
  assert.ok(!matchesAny('.github/workflows/nested/ci.yml', ['.github/workflows/*.yml']));
  assert.ok(matchesAny('a/b.test.mjs', ['**/*.test.mjs']));
  assert.ok(matchesAny('file1.js', ['file?.js']));
  assert.ok(globToRegExp('./x.md').test('x.md'));
  assert.ok(globToRegExp('/x.md').test('x.md'));
});

test('risk: protected beats risky, standard otherwise', () => {
  const config = { protectedPaths: ['.autopilot/config.json'], riskyPaths: ['**/auth/**'] };
  assert.equal(classifyRisk(['src/a.ts'], config).level, 'standard');
  assert.equal(classifyRisk(['src/a.ts'], config).requiresOwner, false);
  const r = classifyRisk(['src/auth/x.ts', 'src/a.ts'], config);
  assert.equal(r.level, 'risky');
  assert.deepEqual(r.reasons, [{ file: 'src/auth/x.ts', glob: '**/auth/**', kind: 'risky' }]);
  const p = classifyRisk(['src/auth/x.ts', '.autopilot/config.json'], config);
  assert.equal(p.level, 'protected');
  assert.equal(p.requiresOwner, true);
  assert.equal(classifyRisk([], {}).level, 'standard');
});

test('risk: CODEOWNERS must cover every owner-gated glob', () => {
  const config = { protectedPaths: ['.autopilot/config.json'], riskyPaths: ['**/auth/**', 'db/'] };
  const text = '# comment\n/.autopilot/config.json @me\n**/auth/** @me\n';
  assert.deepEqual(uncoveredByCodeowners(config, text), ['db/']);
  assert.deepEqual(uncoveredByCodeowners(config, text + 'db/ @me'), []);
  assert.deepEqual(uncoveredByCodeowners({}, ''), []);
});

const LCOV = `TN:
SF:/repo/src/a.js
DA:1,1
DA:2,0
DA:3,4
DA:5,0
end_of_record
SF:/repo/src/b.js
DA:1,1
DA:1,0
end_of_record
`;

test('coverage: parses lcov and strips root', () => {
  const files = parseLcov(LCOV, { root: '/repo/' });
  assert.deepEqual([...files.keys()], ['src/a.js', 'src/b.js']);
  assert.equal(files.get('src/a.js').get(2), 0);
  assert.equal(files.get('src/b.js').get(1), 1, 'duplicate DA keeps the max');
  assert.equal(overallCoverage(LCOV), 60);
  assert.equal(overallCoverage(''), null);
});

const DIFF = `diff --git a/src/a.js b/src/a.js
--- a/src/a.js
+++ b/src/a.js
@@ -1,0 +1,3 @@
+line1
+line2
+line3
@@ -9 +5,2 @@
-old
+line5
+line6
diff --git a/src/new.js b/src/new.js
--- /dev/null
+++ b/src/new.js
@@ -0,0 +1,2 @@
+x
+y
diff --git a/README.md b/README.md
--- a/README.md
+++ b/README.md
@@ -1 +1 @@
-a
+b
diff --git a/gone.js b/gone.js
--- a/gone.js
+++ /dev/null
@@ -1 +0,0 @@
-z
`;

test('coverage: parses added lines from a -U0 diff', () => {
  const added = parseDiffAddedLines(DIFF);
  assert.deepEqual([...added.get('src/a.js')], [1, 2, 3, 5, 6]);
  assert.deepEqual([...added.get('src/new.js')], [1, 2]);
  assert.ok(!added.has('gone.js'));
});

test('coverage: parses context lines when diff has context', () => {
  const diff = '+++ b/x.js\n@@ -1,3 +1,4 @@\n ctx\n+added\n ctx2\n-removed\n+added2\n';
  assert.deepEqual([...parseDiffAddedLines(diff).get('x.js')], [2, 4]);
});

test('coverage: changed-line coverage counts only executable lines; unloaded sources count as missed', () => {
  const result = changedLineCoverage({
    lcov: { text: LCOV, root: '/repo/' },
    diff: DIFF,
    include: ['src/**'],
    exclude: ['**/*.test.js'],
  });
  // a.js: added lines 1,2,3,5,6 → executable 1(hit),2(miss),3(hit),5(miss); 6 not executable.
  // new.js: never loaded → 2 missed.
  assert.equal(result.total, 6);
  assert.equal(result.hit, 2);
  assert.equal(result.percent, 33.3);
  const a = result.files.find((f) => f.file === 'src/a.js');
  assert.deepEqual(a.missed, ['2', '5']);
  assert.deepEqual(result.files.find((f) => f.file === 'src/new.js').missed, ['1-2']);
  assert.ok(!result.files.some((f) => f.file === 'README.md'));
});

test('coverage: no executable changes is 100%', () => {
  const r = changedLineCoverage({ lcov: { text: LCOV, root: '/repo/' }, diff: '+++ b/README.md\n@@ -0,0 +1 @@\n+x\n', include: ['src/**'] });
  assert.equal(r.percent, 100);
  assert.equal(r.total, 0);
});

test('coverage: exclude globs drop files', () => {
  const r = changedLineCoverage({ lcov: { text: LCOV, root: '/repo/' }, diff: DIFF, exclude: ['src/new.js', 'README.md'] });
  assert.ok(!r.files.some((f) => f.file === 'src/new.js'));
});

test('config: floors cannot be lowered by repo config', () => {
  const weak = structuredClone(DEFAULTS);
  weak.gate.coverage.changedLinesMin = 10;
  weak.maxFixAttempts = 50;
  weak.maxConcurrent = 0;
  weak.gate.requiredReviewers = ['acceptance'];
  const c = enforceFloors(weak);
  assert.equal(c.gate.coverage.changedLinesMin, 80);
  assert.equal(c.maxFixAttempts, 5);
  assert.equal(c.maxConcurrent, 1);
  assert.deepEqual(c.gate.requiredReviewers, ['acceptance', 'reviewer', 'security']);
  const strict = enforceFloors(structuredClone(DEFAULTS));
  assert.equal(strict.gate.coverage.changedLinesMin, 90, 'stricter values pass through');
});

test('config: loadConfig merges file over defaults, ignoring $/_ keys', async () => {
  const { mkdtempSync, mkdirSync, writeFileSync } = await import('node:fs');
  const { tmpdir } = await import('node:os');
  const { join } = await import('node:path');
  const { loadConfig } = await import('../lib/config.mjs');
  const dir = mkdtempSync(join(tmpdir(), 'autopilot-'));
  mkdirSync(join(dir, '.autopilot'));
  writeFileSync(join(dir, '.autopilot', 'config.json'), JSON.stringify({
    $schema: 'x', _comment: 'y', maxConcurrent: 2, riskyPaths: ['a/'], gate: { coverage: { changedLinesMin: 95 } }, extra: true,
  }));
  const c = loadConfig(dir);
  assert.equal(c.maxConcurrent, 2);
  assert.equal(c.gate.coverage.changedLinesMin, 95);
  assert.equal(c.gate.coverage.maxOverallDrop, 0, 'nested default kept');
  assert.deepEqual(c.riskyPaths, ['a/']);
  assert.equal(c.extra, true);
  assert.ok(!('$schema' in c) && !('_comment' in c));
  assert.equal(c.models.build, DEFAULTS.models.build);
});
