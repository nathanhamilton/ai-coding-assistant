# Project Initialization Guide

**Instructions for AI assistants on how to help users start and structure new tracked work.**

---

## 🤝 Ask-First Policy

Always present a plan and get approval before non-trivial implementation work.

### Ask First For

- architecture changes
- new dependencies
- schema or migration changes
- security-sensitive behavior
- broad refactors or file moves
- multiple valid implementation approaches

### Proceed Without Extra Approval For

- obvious bug fixes
- explicitly requested narrow edits
- standard boilerplate that follows an established repo pattern

### Approval Pattern

```markdown
I'll implement this using the following approach:

**Plan:**
1. [step]
2. [step]
3. [step]

**Trade-offs:**
- ✅ [benefit]
- ⚠️ [consideration]

**Files likely affected:**
- [path]
- [path]

Does this approach look right before I proceed?
```

---

## 💬 One Question at a Time

Never ask more than one follow-up question in a single message when defining a project contract or design spec.

### Good Pattern

1. Ask one focused question.
2. Wait for the answer.
3. Clarify only if needed.
4. Move to the next question.
5. Recap every few answers.

---

## 📋 Starting a New Project

When the user starts new tracked work:

1. confirm the work item identifier
2. define the problem and expected outcome
3. capture must-have scope and out-of-scope items
4. identify affected code areas and constraints
5. determine whether UI design is required
6. create the project file from `prompts/projects/TEMPLATE.md`
7. update `prompts/projects/_index.md`

Use a neutral identifier format unless setup already defined a ticket convention:
- `TICKET-1234-short-description`
- `task-YYYY-MM-DD-short-description`

---

## 💾 Session Save Guidance

Prompt for a save when:
- a major work item is completed
- several files changed materially
- an important decision was made
- the user is wrapping up or changing focus

Suggested save prompt:

```markdown
💾 **Session Save Checkpoint**

Would you like me to update the project log with:
- ✅ completed work
- 📁 files changed
- 🎯 current status
```

---

## ✅ End-of-Session Guidance

When the user says `end session`:

1. summarize what changed
2. update current phase and next steps
3. offer a commit message and PR summary if useful
4. identify learnings worth adding to the knowledge base

---

## 🧠 Knowledge Capture

Patterns worth preserving should be added to `prompts/projects/_knowledge-base.md` with:
- the problem
- the solution
- trade-offs
- source project
- date added

Use examples that match the repo's real stack.

---

## 📦 Archival Guidance

When a completed or inactive project becomes archival-eligible:
- confirm with the user
- extract reusable learnings first
- move the file to the correct archive quarter
- update `_index.md`

---

## 🚀 Output Expectations

At the end of project initialization, the repo should have:
- a project file with contract-ready structure
- an updated `_index.md`
- a clear next question or next action
