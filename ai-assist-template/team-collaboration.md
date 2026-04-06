# Team Collaboration Guidelines

**How teams can use the documentation system and project files together without tying the workflow to one stack or one ticketing system.**

---

## 🌳 Git Workflow

### Branch Naming Convention

Use the repository's existing branch model if it already has one.

If the repo does not have a documented convention yet, adopt a simple pattern such as:

```text
feature/main/TICKET-123
fix/main/TICKET-456
chore/main/TICKET-789
```

For larger initiatives, teams may also use a project or epic branch when that matches existing practice.

### Principle

- keep ticket or task IDs visible in branches, commits, and PR titles
- prefer the repo's documented default branch instead of assuming `master` or `main`
- do not override an existing release or environment flow with this template

---

## 📝 Working with Project Files

### General Workflow

1. Load the relevant project file.
2. Work on your branch using the repo's normal git workflow.
3. Save progress in the session log at meaningful checkpoints.
4. Open a PR with the project context preserved in the file history.

### Session Log Pattern

```markdown
## 📝 Session Log

### Session: 2026-04-02 (Developer: your-name)

**09:00 - Session Start**
- Working on: [task]
- Goal: [goal]

**11:15 - Progress Save**
- ✅ Completed: [meaningful accomplishment]
- Decisions: [important decision or "None"]
- Files modified: [key files]

**15:40 - Session End**
- Status: [current state]
- Next actions: [next steps]
- Time invested: [rough duration]
```

### Save Commands

You can trigger a save by saying:
- `save session`
- `update session`
- `/save`
- `end session`

---

## 📚 Knowledge Base Contributions

Anyone on the team can add patterns to `ai-project-assist/projects/_knowledge-base.md`.

### Good Entry Characteristics

- describes a real problem
- explains the solution and trade-offs
- references the project where it was learned
- uses examples that match the repo's actual stack

Before adding a new entry, search for an existing one that should be updated instead.

---

## 🔍 Review and Approval Process

### Standard PR Review

Documentation changes should go through the repo's normal PR process.

This includes:
- project files
- shared standards
- language guides
- knowledge base entries
- agent and skill files

### Discuss First When

Use team chat or an equivalent discussion channel before opening a PR for:
- major workflow changes
- restructuring core documentation files
- new conventions that affect the whole team
- changes to naming, branching, or lifecycle rules

Small fixes, examples, and clarifications usually do not need pre-discussion.

---

## 🔐 Ownership Model

The system is team-owned by default unless the repo documents specific ownership.

### Practical Guidance

- big shared changes: discuss first
- small fixes: just open a PR
- when unsure: ask in the team channel

---

## 🎯 Best Practices

### Do

- keep session logs focused and useful
- reference real decisions and real files
- capture reusable learnings in the knowledge base
- align branch, commit, and PR naming with the repo's existing workflow

### Don't

- assume one ticket prefix for every repo
- assume one default branch name for every repo
- let stale examples remain after setup
- skip session logging on long-running work

---

## 🚀 Getting Started

1. Read `ai-project-assist/base-context.md`.
2. Review `ai-project-assist/standards.md`.
3. Review any generated language guides in `ai-project-assist/languages/`.
4. Check `ai-project-assist/projects/_index.md`.
5. Start with `/project` or load the relevant project file.

---

**Last Updated:** 2026-04-02
**Maintained By:** Development Team
