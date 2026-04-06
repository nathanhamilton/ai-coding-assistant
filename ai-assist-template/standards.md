# Coding Standards & Conventions

**Reference this file for repo-agnostic engineering principles. Put language-specific and framework-specific rules in `ai-project-assist/languages/*.md` and `.github/skills/*.md`.**

---

## 🤝 Collaboration Principle: Ask First

### Core Philosophy

The AI assistant is a collaborator, not an automation tool. Before making non-trivial changes, present the plan, name the trade-offs, and get approval.

### Ask Before Acting On

- architecture or layering changes
- new dependencies or services
- schema or migration changes
- security-sensitive logic
- public API changes
- broad refactors or file moves
- any task with multiple reasonable approaches

### Approval Pattern

```markdown
I'll implement this using the following approach:

**Plan:**
- [step]
- [step]

**Trade-offs:**
- ✅ [benefit]
- ⚠️ [consideration]

**Files likely affected:**
- [path]
- [path]

Does this approach work for you, or would you like it adjusted?
```

---

## 🧭 Source of Truth Hierarchy

When project-specific guidance exists, prefer it over generic advice.

1. `ai-project-assist/base-context.md`
2. `ai-project-assist/tech-stack.md`
3. `ai-project-assist/architecture.md`
4. `ai-project-assist/languages/*.md`
5. `.github/skills/*.md`

If those files are missing or stale, inspect the repo before assuming patterns.

---

## 🏗️ General Engineering Standards

### Organization

- Keep responsibilities separated by layer or module.
- Put complex workflows in a dedicated abstraction rather than burying them in boundary code.
- Prefer small, composable units over large multi-purpose files.

### Naming

- Use descriptive names for files, types, functions, and variables.
- Match the naming conventions of the language or framework in use.
- Keep generated project file names aligned with the team's ticket convention.

### Readability

- Prefer shallow control flow and clear guard clauses.
- Break long expressions or chains meaningfully.
- Keep public entry points easy to scan.

### Comments

- Do not comment routine code.
- Add comments only for constraints, unusual behavior, or non-obvious decisions.

---

## 🧪 Testing Standards

- Use the repo's real test framework and test directories.
- Test behavior, not internal implementation details.
- Cover happy paths, validation failures, authorization failures, and relevant edge cases.
- Reuse existing fixtures, factories, or helpers when available.
- Do not remove failing tests to make a change pass.

---

## 🔒 Security Standards

- Validate external and user-controlled input.
- Enforce authentication and authorization wherever required.
- Keep secrets out of source files and logs.
- Use safe query, rendering, and command execution patterns for the actual stack.
- Treat framework-specific safety guidance in `.github/skills/` as binding when present.

---

## 📚 Documentation Standards

- Update docs when APIs, important workflows, or architectural boundaries change.
- Keep examples aligned with the actual stack in the repo.
- Avoid copying examples from unrelated stacks into downstream repo docs.
- Prefer references to real files and real commands.

---

## ⚙️ Performance and Operability

- Watch for unnecessary repeated work, N+1-style access patterns, and avoidable heavy operations.
- Use the repo's real background processing, caching, or streaming patterns when needed.
- Keep commands and tooling examples aligned with the repo's package manager, task runner, and local development flow.

---

## ✅ What This File Should Not Do

This file should not hard-code one language or framework as the default for all repos. Stack-specific conventions belong in:

- `ai-project-assist/languages/*.md`
- `.github/skills/*.md`
- repo-specific `.github/copilot-instructions.md` after setup
