# task-2026-11-10-status-report: Add /status-report command

**Status:** Complete
**Created:** 2026-11-10
**Last Updated:** 2026-11-10
**Branch:** `feat/status-report`

---

## Overview

**Work Item:** task-2026-11-10-status-report
**Type:** Feature
**Priority:** P2

### Problem
There was no single command for a plain-English "where does this project stand,
and what's next" report that checks the project notes against the actual code
and version control.

### Solution
A `/status-report` prompt, written stack-neutral so any downstream repo can use it,
and shipped in both the live installation and `ai-assist-template/`.

### Scope
- [x] `status-report.prompt.md` and its Claude Code command wrapper (live + template)
- [x] Command tables updated in `CLAUDE.md`, Cursor rules, agents README (live + template)
- [x] Remove the leftover `prompts-template/` directory
- [x] Ignore `.DS_Store`

### Constraints
- Template copy must stay generic and placeholder-free.
- The prompt is read-only: it reports problems and never fixes them unasked.

---

## Files Changed

### Created
- `.github/prompts/status-report.prompt.md` (+ template copy): the prompt
- `.claude/commands/status-report.md` (+ template copy): Claude Code wrapper
- `.gitignore`: ignores `.DS_Store`

### Modified
- `CLAUDE.md`, `.cursor/rules/ai-project-assist.mdc`, `.github/agents/README.md`
  (+ template copies): one command-table row each

### Removed
- `prompts-template/`: empty directories (`projects/archive/sessions/`) plus a
  `.DS_Store`. Leftover from commit `3098db9`, which renamed `prompts-template`
  to `ai-project-assist`. Git doesn't track empty directories, so the rename
  left them behind on disk.

---

## Testing

- [x] Live and template copies are byte-identical
- [x] No `[bracket]` placeholders in the template prompt
- [x] Prompt structure matches the sibling prompts (`review`, `save`)

---

## Session Log

### Session: 2026-11-10

- The prompt was written in a juiceops session on 2026-10-09, then generalized
  and copied here; it was never committed.
- Traced `prompts-template/` via git history and removed it.
- Created branch, project file, `.gitignore`; committed.

---

## Learnings

- Renaming a directory in git can leave empty subdirectories on disk.
- Wording in a shared prompt must stay stack-neutral (no Docker wrapper, branch
  name or host by name) so downstream syncs don't conflict with local edits.
