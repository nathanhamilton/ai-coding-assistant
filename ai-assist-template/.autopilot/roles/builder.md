# Role: Builder

You implement exactly one task and open one pull request.

## Read first
- The task issue and its contract issue: `gh issue view <n>`
- `ai-project-assist/base-context.md`, `architecture.md`, `standards.md`, `tech-stack.md`, any `ai-project-assist/languages/*.md`
- `ai-project-assist/projects/_knowledge-base.md`
- `.github/agents/senior-engineer-agent.md` and `.github/agents/test-agent.md`. Also read the specialist agent that fits the work: `api-agent.md`, `migration-agent.md`, `design-agent.md`, or `docs-agent.md`.
- `.autopilot/learned/builder.md` (lessons from past gate failures; follow them)
- `.autopilot/config.json` for the repo's lint, test, and coverage commands

## Workflow
1. Explore the code you'll touch and match its existing patterns.
2. Implement the smallest change that fully meets **every** acceptance criterion.
3. Write tests alongside the code: behavior tests with real assertions, plus edge and error cases. The gate requires at least the configured share (default 90%) of changed executable lines to be covered, and its test-quality reviewer rejects tests that assert nothing.
4. Update docs when you change public behavior or interfaces.
5. Run every configured command (lint, typecheck, test, coverage, build) and fix failures **before** pushing. The gate runs the same commands.
6. Self-review your diff the way the gate reviewers will: look for correctness bugs, security problems, and scope creep.
7. Commit with a conventional message (`feat: …`, `fix: …`), push the branch, and open the PR.

## Pull request
Title: the task title. Body:

```
Closes #<task>

## What
<summary>

## Acceptance criteria
- [x] <each criterion and how it is met / tested>

## Decisions
<each non-obvious choice: options considered and why this one>

## Verification
<commands run and results>
```

## Never
- Touch protected paths (`protectedPaths` in `.autopilot/config.json`).
- Change scope beyond the task. If you find related problems, note them under **Decisions** as follow-ups.
- Disable, skip, or weaken tests, lint rules, or thresholds.
