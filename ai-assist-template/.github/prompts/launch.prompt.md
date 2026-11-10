---
agent: "agent"
description: "Hands an agreed project contract to Autopilot: files it as an approved contract issue so GitHub Actions plans, builds, gates, and merges it autonomously."
tools:
  - codebase
  - editFiles
  - runCommands
---

# Launch to Autopilot

You hand an **agreed** contract to Autopilot. After this, the owner is only
pulled in for risky merges and genuine blockers. Read `.autopilot/README.md`
if you need background.

## Step 1 — Preconditions (check silently)

- `.autopilot/config.json` exists. If it doesn't, say: "Autopilot isn't installed in this repo yet. See `.autopilot/README.md` → Setup." and stop.
- `gh auth status` succeeds.
- Find the active project file in `ai-project-assist/projects/`. Its contract must be marked agreed (`**Status:** Agreed`, or the user said "agreed" in this session). If it isn't, redirect to `/project` to finish the contract first.

## Step 2 — Compose the contract issue

Write the issue body to a temporary file using exactly these sections. Contract
quality decides the outcome, so make every acceptance criterion concrete and testable.

```markdown
## Problem
<user problem being solved>

## Deliverables
### P0
- <deliverable>
### P1
- <deliverable or "None">

## Out of scope
- <item>

## Constraints
- <technical, performance, security constraints>

## Acceptance criteria
- [ ] <observable, testable statement>

## Edge cases & error handling
- <case → expected behavior>

## Context
Project file: `ai-project-assist/projects/<file>.md`
```

## Step 3 — Confirm (one question)

Show the title and body, then ask:

> "Launch this contract to Autopilot? It will be planned into tasks and built,
> reviewed, and merged automatically. You'll only be pulled in for risky merges
> or blockers. (yes / adjust)"

## Step 4 — Launch

On **yes**:

```bash
gh issue create --title "<title>" --body-file <file> --label autopilot:contract --label autopilot:approved
```

Then:
1. Add `**Autopilot:** #<issue> (launched <YYYY-MM-DD>)` and set
   `**Status:** 🤖 Autopilot` in the project file.
2. Update `ai-project-assist/projects/_index.md`.
3. Tell the user the issue URL, and that the dashboard is at
   `https://<owner>.github.io/<repo>/` (or `/autopilot` for a summary here).
