# Project Entry Point

Use this file when starting or resuming tracked work in `ai-project-assist/projects/`.

---

## Starting New Work

When the user says `new project:` or describes a new tracked task:

1. confirm the work item identifier
2. ask focused scoping questions
3. review `base-context.md`, `standards.md`, `project-init-guide.md`, and `_knowledge-base.md`
4. create the project file from `TEMPLATE.md`
5. update `_index.md`
6. show the proposed scope and next step

### Identifier Format

Prefer the repo's configured convention. If none exists yet, use one of:
- `TICKET-1234-short-description`
- `task-YYYY-MM-DD-short-description`

---

## Continuing Existing Work

When the user says `begin project`, `continue`, `save session`, or `end session`:

1. check `_index.md`
2. load the relevant project file
3. update session logs and status as work progresses
4. follow the lifecycle in `project-lifecycle.md`

---

## Ask-First Rules

Before implementation, confirm the plan when work involves:
- architecture changes
- new dependencies
- schema changes
- security-sensitive behavior
- multiple reasonable approaches

Proceed without extra approval only for narrow, obvious fixes or explicitly directed edits.

---

## Quick Commands

- Start: `Load ai-project-assist/projects/project.md`
- New project: `New: TICKET-1234-short-description`
- Resume: `continue TICKET-1234`
- Save progress: `save session`
- Close out: `end session`
