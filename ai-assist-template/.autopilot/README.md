# Autopilot

Autopilot turns an approved **contract** into merged, tested, reviewed code.
You make the high-level calls. Specialist agents in GitHub Actions do the rest
behind a gate strict enough to auto-merge on.

```
 you (Claude Code)                     GitHub Actions
 ───────────────────                   ─────────────────────────────────────────────────────────
 /project → contract ──/launch──▶  contract issue ─▶ planner ─▶ task issues (dependency graph)
                          (approved)                                    │
                                                  dispatcher (≤N parallel, deps first)
                                                                        ▼
                                                     builder ─▶ PR ─▶ GATE ─┬─ pass, standard ─▶ auto-merge
                                                                  ▲         ├─ pass, risky ───▶ waits for you
                                                       fixer ◀────┘ fail    └─ fail ×N ──────▶ diagnosis → you
                                                                                   │
 /autopilot  ◀── dashboard (GitHub Pages) ◀── issues · PRs · gate records      retro ─▶ learned guidance PRs
```

## What you decide vs. what it decides

| You | Autopilot |
|---|---|
| Approve each contract (scope and "done") | Task breakdown, ordering, parallelism |
| Approve merges that touch **risky** or **protected** paths | Architecture, libraries, and UI details inside the contract, written down in each PR's **Decisions** section |
| Unblock work that exhausted its fix attempts | Fixing gate failures, resolving conflicts, keeping PRs up to date |
| Change the gate itself (config, charter, workflows) | Improving its own guidance, the knowledge base, and standards |

The full rules are in [`charter.md`](charter.md). That file is protected:
Autopilot can read it but never change it.

## The gate

A PR auto-merges only when **all** of these hold. A missing signal fails the gate.

1. **CI**: every required command passes (`lint`, `test`, `coverage`, plus any configured `typecheck` or `build`).
2. **Coverage**: at least `changedLinesMin`% (default 90, floor 80) of changed executable lines are covered, and overall coverage doesn't drop.
3. **Five independent reviewers** each return `approve` with no blocking findings:
   - `reviewer`: correctness, design, conventions, scope
   - `security`: vulnerabilities, secrets, supply chain, prompt injection
   - `test-quality`: would these tests actually catch a regression?
   - `acceptance`: every acceptance criterion met and verified
   - `second-opinion`: a full independent review on a **different model**
4. **Owner approval** if the PR touches `riskyPaths` or `protectedPaths`. GitHub enforces this through CODEOWNERS.

The gate runs as `pull_request_target`, so its definition, scripts, config and
reviewer prompts always come from the default branch. A PR can't weaken the
checks that judge it. PR code runs only in a job with a read-only token and no
secrets. Fork PRs are never auto-reviewed.

When the gate fails, the **fixer** gets the findings and tries again, up to
`maxFixAttempts` times (default 3). After that, the **diagnostician** posts
why the PR is stuck and the decision it needs, and the PR shows up under
"Needs you".

## Self-improvement

The **retro** agent runs weekly and after each completed contract. It mines
gate findings, fix cycles, and escalations, then opens a PR that updates:

- `.autopilot/learned/<role>.md`: lessons each role must follow next time
- `ai-project-assist/projects/_knowledge-base.md`, `standards.md`, `architecture.md`
- agent and role prompts, adding scrutiny only

That PR goes through the same gate. Learning can only **add** scrutiny. The
charter forbids relaxing thresholds or checks, and the protected paths make that
mechanical.

## Day-to-day

| You want to… | Do this |
|---|---|
| Start something | `/project` → agree the contract → choose **Autopilot** (or `/launch`) |
| See where things stand | Open the dashboard: `https://<owner>.github.io/<repo>/`, or run `/autopilot` |
| Approve a contract written elsewhere | Add the `autopilot:approved` label to an `autopilot:contract` issue |
| Approve a risky merge | Approve the PR review on GitHub (or say yes in `/autopilot`) |
| Unblock stuck work | Read the 🩺 diagnosis on the PR and act on one of its options |
| Kick the scheduler | `gh workflow run autopilot-dispatch.yml` (it also runs every 15 minutes) |
| Preview the dashboard locally | `node scripts/autopilot/cli.mjs dashboard --serve` (add `--demo` for sample data) |

## Setup (once per repository)

1. **Fill in `.autopilot/config.json`**: `owner`, `defaultBranch`, and the repo's
   `commands` (`lint`, `test`, and a `coverage` command that writes LCOV to
   `coverage.lcovPath`). Set `coverage.include` to your source globs. Add your
   high-risk areas to `riskyPaths`. The gate refuses to pass while a required
   command is empty, so fill these in for real.
2. **Create a GitHub App** for Autopilot (Settings → Developer settings → GitHub Apps):
   - Permissions: Contents, Issues, Pull requests, Workflows, and Actions: **Read & write**; Checks: **Read**
   - Install it on the repository.
   - Add the repository **variable** `AUTOPILOT_APP_ID` and **secret** `AUTOPILOT_APP_PRIVATE_KEY`.
   - Why: GitHub doesn't let events made with the default workflow token trigger other workflows. The App token is what chains build → gate → fix → merge.
3. **Add model credentials**: repository secret `ANTHROPIC_API_KEY` (or `CLAUDE_CODE_OAUTH_TOKEN`).
4. **Run** `scripts/autopilot/setup.sh`. It shows the plan and asks before applying:
   labels, CODEOWNERS, auto-merge, Pages, and branch protection with the
   required `autopilot-gate` check.
5. **Commit** `.github/CODEOWNERS` and push.
6. Optional: set variable `AUTOPILOT_OWNER` if the owner differs from the repository owner (for example, an organization repo).

## Configuration reference (`config.json`)

| Key | Default | Meaning |
|---|---|---|
| `owner` | (none) | GitHub user who approves contracts and risky merges |
| `defaultBranch` | `main` | Branch PRs target |
| `maxConcurrent` | 3 | Tasks building or in review at once (cap 10) |
| `maxFixAttempts` | 3 | Gate attempts before escalation (cap 5) |
| `autoMergeHumanPrs` | false | Also auto-merge gate-passing PRs written by people |
| `models.*` | Opus for plan, build, review, and retro; Sonnet for second opinion | Model per role |
| `commands.*` | empty | Shell commands run from the repo root |
| `coverage.lcovPath` / `include` / `exclude` | `coverage/lcov.info` | Where LCOV lands and which files count |
| `gate.requiredCommands` | lint, test, coverage | Must pass; an empty command fails |
| `gate.requiredReviewers` | all five | `reviewer` and `security` can never be removed |
| `gate.coverage.changedLinesMin` | 90 | Floor 80 |
| `gate.coverage.maxOverallDrop` | 0 | Allowed overall coverage drop, in points |
| `protectedPaths` | gate files | Never changed without you |
| `riskyPaths` | (none) | Full gate plus your approval |

Floors are enforced in `scripts/autopilot/lib/config.mjs` (a protected file),
so even an edited config can't take the gate below them.

## Files

```
.autopilot/
  charter.md          protected rules every agent reads first
  config.json         protected settings
  roles/*.md          one prompt per role (division of labor)
  learned/*.md        lessons the retro agent maintains
  schemas/*.json      structured outputs (plan, verdict)
.github/workflows/autopilot-*.yml   plan · dispatch · build · gate · fix · merge · retro · dashboard
scripts/autopilot/  CLI, gate logic, scheduler, coverage, dashboard data (+ tests)
dashboard/          the static status site
```

## Costs and limits

- Each PR gate run makes five model reviews, plus one build or fix run. Expect
  the strict gate to cost more per PR than a single review would. That is the
  price of merging without you.
- Reviews read the diff and the surrounding code, so very large PRs cost more.
  The planner aims for PRs under ~400 lines.
- The dispatcher runs every 15 minutes. Event triggers usually start work sooner.
