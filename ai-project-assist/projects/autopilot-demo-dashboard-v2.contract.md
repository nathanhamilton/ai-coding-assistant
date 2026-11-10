# Autopilot demo contract: Dashboard v2 — throughput and gate insight

> First self-hosted Autopilot project. Launch it with `/launch` (or
> `gh issue create --title "Dashboard v2: throughput and gate insight" --body-file <this file> --label autopilot:contract --label autopilot:approved`).
> Every path it should touch is unprotected, so if the gate passes it merges
> without the owner. That is the point of the demo.

## Problem
The dashboard shows what is happening now, but not how well Autopilot is
performing over time. The owner can't see throughput, where the gate catches
problems, or which reviewer blocks most often. That makes it hard to judge
whether the system is getting better and where its guidance needs work.

## Deliverables
### P0
- A **throughput** panel: PRs merged per ISO week for the last 8 weeks, as a bar chart with a hover tooltip and a table view.
- A **gate insight** panel: for merged and escalated Autopilot PRs in the last 30 days, the number of gate runs blocked by each reviewer role and by CI or coverage, as a bar chart with a table view.
- **Contract filter**: a control above the task board and PR pipeline that limits both to one contract, or "All".

### P1
- Each PR row in the pipeline expands to show its gate attempt history (attempt, passed/failed, changed-line coverage, which reviewers objected).

## Out of scope
- Any change to the gate, workflows, config, charter, or protected scripts
- New data sources beyond issues, PRs, and gate comments already collected
- Authentication or a backend; the dashboard stays static on GitHub Pages

## Constraints
- Zero dependencies: vanilla JS, CSS, and Node built-ins only
- View-model logic lives in `scripts/autopilot/lib/dashboard-data.mjs` (or new unprotected lib files) with unit tests. Changed-line coverage must be at least 90%.
- Mirror every changed shared file into `ai-assist-template/` (lint enforces this)
- Charts follow the existing style tokens: one series color, status colors only with icon and label, a legend or title naming each series, light and dark themes, no horizontal scroll at 375px width

## Acceptance criteria
- [ ] `data.json` includes `throughput: [{ week: "YYYY-Www", merged: n }]` covering exactly the last 8 ISO weeks, with zero-filled weeks, unit-tested across a year boundary
- [ ] `data.json` includes `gateBlocks: [{ source, count }]` sorted by count, derived only from existing gate-record fields: each role in `reviewers` whose value is not `approve` counts once for that role, and a failed run where every reviewer approved counts as `ci-or-coverage`. Unit-tested. (The record format is written by the protected `gate.mjs` and is not changed.)
- [ ] The throughput and gate insight panels render with hover tooltips and "Show table" toggles
- [ ] Selecting a contract filters the task board and PR pipeline; "All" restores them. The selection persists across reloads in localStorage, wrapped in try/catch.
- [ ] `node scripts/autopilot/cli.mjs dashboard --demo` shows all new panels using updated `dashboard/demo-data.json`
- [ ] `node --test scripts/autopilot/test/` and `node scripts/autopilot/lint.mjs` pass

## Edge cases & error handling
- No merges yet → panels show an empty-state message, not an empty chart
- Gate records missing `reviewers` (older comments) → counted under "unknown", never a crash
- A contract with no tasks → the filter still lists it; the board shows empty columns
- Weeks with zero merges → shown as zero, not omitted

## Context
Project file: `ai-project-assist/projects/task-2026-10-14-autopilot.md`
