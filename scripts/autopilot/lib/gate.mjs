// Aggregates every gate signal into one verdict. The gate fails closed:
// a missing, malformed, or skipped required signal is a failure.

export const MARKER = 'autopilot-gate';

export function evaluateGate({ config, ci, coverage, verdicts, risk }) {
  const failures = [];
  const warnings = [];
  const gate = config.gate;

  // 1. CI commands
  for (const name of gate.requiredCommands) {
    const result = ci?.[name];
    if (!result) failures.push(`CI: required command "${name}" did not report`);
    else if (result.status === 'skipped') failures.push(`CI: required command "${name}" is not configured`);
    else if (result.status !== 'pass') failures.push(`CI: "${name}" failed`);
  }
  for (const [name, result] of Object.entries(ci ?? {})) {
    if (!gate.requiredCommands.includes(name) && result.status === 'fail') {
      failures.push(`CI: "${name}" failed`);
    }
  }

  // 2. Coverage
  if (gate.coverage.enabled) {
    if (!coverage) {
      failures.push('Coverage: no coverage report was produced');
    } else {
      if (coverage.changed.percent < gate.coverage.changedLinesMin) {
        failures.push(
          `Coverage: ${coverage.changed.percent}% of changed lines covered (minimum ${gate.coverage.changedLinesMin}%)`,
        );
      }
      if (
        coverage.overall != null &&
        coverage.baseline != null &&
        coverage.baseline - coverage.overall > gate.coverage.maxOverallDrop
      ) {
        failures.push(
          `Coverage: overall coverage dropped ${round(coverage.baseline - coverage.overall)} points (max ${gate.coverage.maxOverallDrop})`,
        );
      }
    }
  }

  // 3. Agent reviewers — every required role must explicitly approve.
  const byRole = new Map((verdicts ?? []).map((v) => [v.role, v]));
  for (const role of gate.requiredReviewers) {
    const v = byRole.get(role);
    if (!v) {
      failures.push(`Review: ${role} did not return a verdict`);
      continue;
    }
    const problem = validateVerdict(v);
    if (problem) {
      failures.push(`Review: ${role} returned an invalid verdict (${problem})`);
      continue;
    }
    const blocking = v.findings.filter((f) => f.severity === 'blocking');
    if (v.decision !== 'approve') {
      failures.push(`Review: ${role} requested changes${blocking.length ? ` (${blocking.length} blocking)` : ''}`);
    } else if (blocking.length) {
      // An "approve" that carries blocking findings is contradictory — fail closed.
      failures.push(`Review: ${role} approved but reported ${blocking.length} blocking finding(s)`);
    }
    for (const f of v.findings.filter((x) => x.severity === 'warning')) {
      warnings.push(`${role}: ${f.title}`);
    }
  }

  const passed = failures.length === 0;
  return {
    passed,
    failures,
    warnings,
    risk,
    mergeAction: !passed ? 'fix' : risk?.requiresOwner ? 'await-owner' : 'auto-merge',
  };
}

export function validateVerdict(v) {
  if (!v || typeof v !== 'object') return 'not an object';
  if (!['approve', 'request_changes'].includes(v.decision)) return 'decision must be approve|request_changes';
  if (!Array.isArray(v.findings)) return 'findings must be an array';
  for (const f of v.findings) {
    if (!['blocking', 'warning', 'note'].includes(f?.severity)) return 'finding has invalid severity';
    if (typeof f.title !== 'string' || !f.title) return 'finding missing title';
  }
  return null;
}

export function blockingFindings(verdicts) {
  return (verdicts ?? []).flatMap((v) =>
    (v.findings ?? []).filter((f) => f.severity === 'blocking').map((f) => ({ role: v.role, ...f })),
  );
}

// Human-readable PR comment with an embedded machine-readable record that the
// dashboard and retrospective agent parse.
export function renderGateComment({ result, coverage, verdicts, attempt, maxAttempts, sha }) {
  const icon = result.passed ? '✅' : '❌';
  const lines = [];
  lines.push(`## ${icon} Autopilot gate — ${result.passed ? 'passed' : 'failed'}`);
  lines.push('');
  lines.push(`**Commit:** \`${(sha ?? '').slice(0, 7)}\` · **Attempt:** ${attempt}/${maxAttempts} · **Risk:** ${result.risk?.level ?? 'unknown'}`);
  lines.push('');
  if (result.passed) {
    lines.push(
      result.mergeAction === 'auto-merge'
        ? 'All checks and reviewers approved. **Auto-merge enabled.**'
        : '**This PR touches owner-gated paths.** All checks passed; it will merge once the owner approves.',
    );
  } else {
    lines.push('### Blocking');
    for (const f of result.failures) lines.push(`- ${f}`);
  }
  if (coverage) {
    lines.push('');
    lines.push(`**Changed-line coverage:** ${coverage.changed.percent}% (${coverage.changed.hit}/${coverage.changed.total})` +
      (coverage.overall != null ? ` · **Overall:** ${coverage.overall}%` : ''));
    const gaps = coverage.changed.files.filter((f) => f.missed.length);
    if (gaps.length) {
      lines.push('<details><summary>Uncovered changed lines</summary>\n');
      for (const f of gaps) lines.push(`- \`${f.file}\`: ${f.missed.join(', ')}`);
      lines.push('\n</details>');
    }
  }
  const findings = blockingFindings(verdicts);
  if (findings.length) {
    lines.push('');
    lines.push('### Reviewer findings (blocking)');
    for (const f of findings) {
      const loc = f.file ? ` — \`${f.file}${f.line ? `:${f.line}` : ''}\`` : '';
      lines.push(`- **[${f.role}] ${f.title}**${loc}\n  ${(f.detail ?? '').replace(/\n/g, '\n  ')}`);
    }
  }
  if (result.warnings.length) {
    lines.push('');
    lines.push('<details><summary>Warnings</summary>\n');
    for (const w of result.warnings) lines.push(`- ${w}`);
    lines.push('\n</details>');
  }
  if (result.risk?.reasons?.length) {
    lines.push('');
    lines.push('<details><summary>Owner-gated paths</summary>\n');
    for (const r of result.risk.reasons) lines.push(`- \`${r.file}\` (${r.kind}: \`${r.glob}\`)`);
    lines.push('\n</details>');
  }
  const record = {
    passed: result.passed,
    mergeAction: result.mergeAction,
    risk: result.risk?.level,
    attempt,
    sha,
    changedCoverage: coverage?.changed.percent ?? null,
    overallCoverage: coverage?.overall ?? null,
    failures: result.failures.length,
    blocking: findings.length,
    reviewers: Object.fromEntries((verdicts ?? []).map((v) => [v.role, v.decision])),
    at: new Date().toISOString(),
  };
  lines.push('');
  lines.push(`<!-- ${MARKER} ${JSON.stringify(record)} -->`);
  return lines.join('\n');
}

export function parseGateRecord(body) {
  const m = new RegExp(`<!-- ${MARKER} (\\{.*\\}) -->`).exec(body ?? '');
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}

function round(n) {
  return Math.round(n * 10) / 10;
}
