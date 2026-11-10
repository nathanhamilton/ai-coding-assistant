// Classifies a set of changed files.
//
// - protected: files that define the gate itself (thresholds, workflows,
//   charter, CODEOWNERS). Autopilot may never change these without the owner.
// - risky: high-blast-radius areas (auth, payments, migrations, infra, CI).
//   Gate still runs in full, but merge waits for owner approval.

import { firstMatch } from './glob.mjs';

export function classifyRisk(files, config) {
  const protectedGlobs = config.protectedPaths ?? [];
  const riskyGlobs = config.riskyPaths ?? [];
  const reasons = [];
  let isProtected = false;
  let isRisky = false;

  for (const file of files) {
    const p = firstMatch(file, protectedGlobs);
    if (p) {
      isProtected = true;
      reasons.push({ file, glob: p, kind: 'protected' });
      continue;
    }
    const r = firstMatch(file, riskyGlobs);
    if (r) {
      isRisky = true;
      reasons.push({ file, glob: r, kind: 'risky' });
    }
  }

  // Protected implies risky: both require the owner.
  return {
    level: isProtected ? 'protected' : isRisky ? 'risky' : 'standard',
    requiresOwner: isProtected || isRisky,
    reasons,
  };
}

// Every protected and risky glob must be owned in CODEOWNERS, so GitHub itself
// (not just Autopilot) enforces owner review. Returns globs that are missing.
export function uncoveredByCodeowners(config, codeownersText) {
  const owned = new Set(
    codeownersText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('#'))
      .map((l) => normalize(l.split(/\s+/)[0])),
  );
  const required = [...(config.protectedPaths ?? []), ...(config.riskyPaths ?? [])];
  return required.filter((g) => !owned.has(normalize(g)));
}

function normalize(glob) {
  return glob.replace(/^\.?\//, '');
}
