import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// Defaults are the strictest reasonable settings; a repo config can only make
// them stricter for gate settings (see enforceFloors).
export const DEFAULTS = {
  version: 1,
  maxConcurrent: 3,
  maxFixAttempts: 3,
  defaultBranch: 'main',
  models: {
    build: 'claude-opus-5-5',
    review: 'claude-opus-5-5',
    secondOpinion: 'claude-sonnet-5-5',
    plan: 'claude-opus-5-5',
    retro: 'claude-opus-5-5',
  },
  commands: { setup: '', lint: '', typecheck: '', test: '', build: '', coverage: '' },
  coverage: { lcovPath: 'coverage/lcov.info', include: [], exclude: [] },
  gate: {
    requiredCommands: ['lint', 'test', 'coverage'],
    requiredReviewers: ['reviewer', 'security', 'test-quality', 'acceptance', 'second-opinion'],
    coverage: { enabled: true, changedLinesMin: 90, maxOverallDrop: 0 },
  },
  protectedPaths: [],
  riskyPaths: [],
  owner: '',
  // Gate-passing PRs authored by humans are not auto-merged unless enabled.
  autoMergeHumanPrs: false,
};

// Floors the gate can never go below, even if the config file says otherwise.
// Changing these requires editing this protected file, which needs the owner.
export const FLOORS = {
  changedLinesMin: 80,
  maxFixAttempts: 5,
  maxConcurrent: 10,
  minReviewers: ['reviewer', 'security'],
};

export function loadConfig(root = process.cwd()) {
  const raw = JSON.parse(readFileSync(join(root, '.autopilot', 'config.json'), 'utf8'));
  return enforceFloors(merge(DEFAULTS, raw));
}

export function enforceFloors(config) {
  const c = structuredClone(config);
  c.gate.coverage.changedLinesMin = Math.max(c.gate.coverage.changedLinesMin, FLOORS.changedLinesMin);
  c.maxFixAttempts = Math.min(Math.max(1, c.maxFixAttempts), FLOORS.maxFixAttempts);
  c.maxConcurrent = Math.min(Math.max(1, c.maxConcurrent), FLOORS.maxConcurrent);
  for (const r of FLOORS.minReviewers) {
    if (!c.gate.requiredReviewers.includes(r)) c.gate.requiredReviewers.push(r);
  }
  return c;
}

function merge(base, over) {
  if (Array.isArray(base) || Array.isArray(over)) return over ?? base;
  if (typeof base !== 'object' || base === null) return over ?? base;
  const out = { ...base };
  for (const [k, v] of Object.entries(over ?? {})) {
    if (k.startsWith('$') || k.startsWith('_')) continue; // $schema, _comment
    out[k] = k in base ? merge(base[k], v) : v;
  }
  return out;
}
