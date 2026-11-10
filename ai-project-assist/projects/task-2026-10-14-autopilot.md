# task-2026-10-14-autopilot: Autopilot — self-managing build, gate, and merge system

**Status:** In Progress — built and verified locally; awaiting owner setup (GitHub App, secrets, branch protection) and first live run
**Created:** 2026-10-14
**Last Updated:** 2026-10-14
**Branch:** `claude/automated-code-management-647938`

---

## Contract

**Status:** ✅ Agreed 2026-10-14 (via interview)

### Problem

The `/project` lifecycle produces good outcomes, but the owner has to drive every
step. The owner wants to make only the high-level decisions and have a system
plan, build, review, test, merge, and keep improving itself, with checks strict
enough to trust auto-merge. That system should install into any repository.

### Decisions from the interview

| Question | Owner's answer |
|---|---|
| Where autonomous work runs | **Hybrid**: plan and approve locally with `/project`; GitHub Actions runs build → gate → merge |
| Owner-gated decisions | **Contract/scope** and **risky merges**. Architecture, dependencies, and UI details inside a contract are autonomous and recorded. |
| Merge gate | **Maximum strict**: CI + ≥90% changed-line coverage with no overall drop + reviewer, security, and test-quality agents + acceptance verification + second opinion from a different model |
| Dashboard | **GitHub Pages** site rebuilt automatically |
| Self-improvement | **Fully autonomous**, but the gate and the owner's approval points can never be weakened without the owner |
| Stuck work | **3 fix attempts**, then a diagnosis and escalation to "Needs you" |
| Concurrency | **Dependency-aware, max 3** parallel tasks |
| Demo | **Self-host**: install into this repo; its first contract improves its own dashboard |

### P0 Deliverables

- [x] Contract → planner → dependency-ordered task issues
- [x] Dispatcher with dependency resolution and a concurrency limit
- [x] Builder → PR; fixer (3 attempts) → diagnostician → owner
- [x] Fail-closed gate: CI, changed-line coverage, 5 reviewer roles, risk classification, owner approval for risky/protected paths
- [x] Tamper-resistant gate (`pull_request_target`, trusted checkout, CODEOWNERS, config floors)
- [x] Self-improvement loop (retro agent → learned guidance, knowledge base, standards)
- [x] GitHub Pages dashboard ("Needs you", contracts, task board, PR pipeline, coverage trend, learning log)
- [x] `/launch` and `/autopilot` commands; `/project` hands off to Autopilot
- [x] Distributable through `ai-assist-template/` with SETUP.md step 6b and drift-checking lint

### Out of scope

- Hosting outside GitHub (GitLab, Bitbucket)
- Non-Claude model providers for agents (the action supports Bedrock/Vertex; not wired up)

---

## Architecture

See `.autopilot/README.md` for the full picture. Key choices:

- **State lives in GitHub** (labels on issues and PRs, plus machine-readable gate records embedded in PR comments). Nothing is hidden: the owner can inspect or override everything in GitHub's UI, and the dashboard is a pure read model.
- **Deterministic glue, AI judgment.** Scheduling, coverage maths, risk classification, and the merge decision are tested Node code (`scripts/autopilot/lib`). Models are used only for planning, building, fixing, reviewing, diagnosing, and learning.
- **Division of labor.** Ten roles in `.autopilot/roles/`, each with one responsibility. They reuse `.github/agents/*.md` as domain guidance.
- **Charter over everything.** `.autopilot/charter.md` is protected and read first by every agent. Learned guidance may only add scrutiny.
- **Three layers enforce owner-gated changes.** Autopilot's risk classifier, GitHub CODEOWNERS with required code-owner review, and config floors hard-coded in a protected file.

## 💡 Technical Decisions

- **`pull_request_target` for the gate.** The gate definition, scripts, and prompts come from the default branch, so a PR can't weaken its own gate. PR code runs only in the `ci` job, which has a read-only token and no secrets. Fork PRs are never auto-reviewed.
- **GitHub App token.** Events created with the default `GITHUB_TOKEN` don't trigger workflows, so a GitHub App token chains build → gate → fix and lets the owner approve bot-authored PRs.
- **Changed-line coverage from LCOV and the diff.** This is stack-agnostic: any test runner that emits LCOV works. Source files the suite never loads count as uncovered.
- **Dashboard data collection lives outside the protected CLI**, so the system can improve its own dashboard without owner approval.
- **Zero dependencies.** Node built-ins only (`node:test`, `fetch`), keeping with this repo's "no package manager" rule.

---

## Testing

- [x] 35 unit tests (`node --test scripts/autopilot/test/`), all passing
- [x] Lint: syntax, JSON, schema quoting, CODEOWNERS coverage, template drift (`node scripts/autopilot/lint.mjs`)
- [x] Local gate dry run on this branch: all CI green; changed-line coverage 100% (879/879); risk = protected; no verdicts → fails closed; five approvals → `await-owner`
- [x] Dispatcher dry run against the live repo (read-only)
- [x] Dashboard rendered and checked at desktop and phone widths, in light and dark themes
- [ ] Live end-to-end run in GitHub Actions (needs the owner's App and secrets)

**Test command:** `node --test scripts/autopilot/test/ && node scripts/autopilot/lint.mjs`

---

## Session Log

### Session: 2026-10-14

- Interviewed the owner (8 decisions above), then designed and built Autopilot.
- Coverage tooling caught untested code in the new GitHub client. Tests were added, and they exposed an inconsistent 204 response that is now fixed.
- **Next actions (owner):** finish the setup in `.autopilot/README.md`, merge this branch, then `/launch` the demo contract in `autopilot-demo-dashboard-v2.contract.md`.

---

## Learnings

- Never reassign `process.env` in tests: it detaches from the environment that child processes inherit. Restore keys one by one.
- `node --test --test-reporter-destination=<file>` does not create parent directories.
