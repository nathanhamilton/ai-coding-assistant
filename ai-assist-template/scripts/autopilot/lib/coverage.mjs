// Changed-line coverage: of the executable lines added or modified in a diff,
// what fraction did the test suite execute?

import { matchesAny } from './glob.mjs';

// Parses LCOV into Map<file, Map<line, hits>>.
export function parseLcov(text, { root = '' } = {}) {
  const files = new Map();
  let current = null;
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (line.startsWith('SF:')) {
      let file = line.slice(3);
      if (root && file.startsWith(root)) file = file.slice(root.length);
      file = file.replace(/^\/+/, '');
      current = files.get(file) ?? new Map();
      files.set(file, current);
    } else if (line.startsWith('DA:') && current) {
      const [ln, hits] = line.slice(3).split(',');
      const n = Number(ln);
      current.set(n, Math.max(current.get(n) ?? 0, Number(hits)));
    } else if (line === 'end_of_record') {
      current = null;
    }
  }
  return files;
}

// Parses a unified diff (git diff -U0 style) into Map<file, Set<addedLine>>.
export function parseDiffAddedLines(diff) {
  const files = new Map();
  let file = null;
  let newLine = 0;
  for (const line of diff.split('\n')) {
    if (line.startsWith('+++ ')) {
      const target = line.slice(4).trim();
      file = target === '/dev/null' ? null : target.replace(/^b\//, '');
      if (file && !files.has(file)) files.set(file, new Set());
    } else if (line.startsWith('@@')) {
      const m = /\+(\d+)(?:,(\d+))?/.exec(line);
      newLine = m ? Number(m[1]) : 0;
    } else if (file && line.startsWith('+')) {
      files.get(file).add(newLine);
      newLine += 1;
    } else if (file && line.startsWith(' ')) {
      newLine += 1;
    }
    // '-' lines don't advance the new-file counter.
  }
  return files;
}

export function changedLineCoverage({ lcov, diff, include = [], exclude = [] }) {
  const covered = parseLcov(lcov.text, { root: lcov.root });
  const added = parseDiffAddedLines(diff);
  const perFile = [];
  let total = 0;
  let hit = 0;

  for (const [file, lines] of added) {
    if (include.length && !matchesAny(file, include)) continue;
    if (matchesAny(file, exclude)) continue;
    const fileCov = covered.get(file);
    let fTotal = 0;
    let fHit = 0;
    const missed = [];
    for (const ln of lines) {
      if (fileCov) {
        if (!fileCov.has(ln)) continue; // not an executable line
        fTotal += 1;
        if (fileCov.get(ln) > 0) fHit += 1;
        else missed.push(ln);
      } else {
        // Source file the suite never loaded: every added line counts as missed.
        fTotal += 1;
        missed.push(ln);
      }
    }
    if (fTotal === 0) continue;
    total += fTotal;
    hit += fHit;
    perFile.push({ file, total: fTotal, hit: fHit, missed: compressRanges(missed) });
  }

  return {
    total,
    hit,
    percent: total === 0 ? 100 : round((hit / total) * 100),
    files: perFile,
  };
}

export function overallCoverage(lcovText) {
  let total = 0;
  let hit = 0;
  for (const lines of parseLcov(lcovText).values()) {
    for (const hits of lines.values()) {
      total += 1;
      if (hits > 0) hit += 1;
    }
  }
  return total === 0 ? null : round((hit / total) * 100);
}

function compressRanges(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const out = [];
  for (const n of sorted) {
    const last = out[out.length - 1];
    if (last && n === last[1] + 1) last[1] = n;
    else out.push([n, n]);
  }
  return out.map(([a, b]) => (a === b ? `${a}` : `${a}-${b}`));
}

function round(n) {
  return Math.round(n * 10) / 10;
}
