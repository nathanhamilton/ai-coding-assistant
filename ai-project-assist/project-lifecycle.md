# Project Lifecycle & Archive Management

**How projects flow from creation to archival while staying maintainable over time.**

---

## 🎯 Core Principles

**One tracked work item = one project file**

Whether it is a feature, bug fix, refactor, or operational task, each scoped effort gets its own markdown file.

**Contract before code. Design before UI.**

No implementation begins without an agreed contract. No UI implementation begins without an approved design spec.

**One question at a time.**

During contract and design phases, ask one question per message.

---

## 📁 File Structure

```text
prompts/projects/
├── _index.md
├── _knowledge-base.md
├── TEMPLATE.md
├── TICKET-1234-example-project.md
└── archive/
    ├── 2026-Q2/
    └── sessions/
```

---

## 🔄 Lifecycle Stages

### Stage 1: Project Selection

Triggered by `/project`, `/begin-project`, or a request to continue tracked work.

### Stage 2: Contract Definition

Capture:
- problem to solve
- P0 deliverables
- secondary scope
- out-of-scope items
- technical constraints
- UI involvement

### Stage 3: Design Specification

If UI changes are involved, define and approve a design spec before implementation.

### Stage 4: Engineering

Present an implementation plan, get approval, then implement within the agreed scope.

### Stage 5: Review

Validate tests, security, documentation, and technical debt before marking work complete.

### Stage 6: Completion

Mark the project complete, update `_index.md`, and capture reusable learnings.

### Stage 7: Archival

Archive completed or inactive projects after 90 days.

---

## 📊 File Size Management

Warning thresholds:
- 7MB: warn
- 9MB: recommend moving old sessions out
- 9.5MB: archive old sessions immediately

Keep recent activity in the main file and move older session logs into `archive/sessions/`.

---

## 📋 Index Management

`_index.md` should track:
- active projects
- recently completed projects
- archived quarters

Use the repo's chosen ticket or task identifier format consistently.

---

## 🗄️ Archive Organization

Store archived projects by quarter, for example:

```text
archive/
├── 2026-Q1/
├── 2026-Q2/
└── sessions/
```

Each archive quarter may include a summary file if the team finds it useful.

---

## 🤖 AI Automation Expectations

The AI assistant should:
- update `_index.md` as project status changes
- warn when project files become too large
- prompt for archival when eligibility rules are met
- suggest knowledge-base extraction before archive

---

## 🔗 Related Documentation

- `base-context.md`
- `standards.md`
- `project-init-guide.md`
- `projects/TEMPLATE.md`
- `projects/_knowledge-base.md`

---

**Last Updated:** 2026-04-02
**Maintainer:** Development Team
