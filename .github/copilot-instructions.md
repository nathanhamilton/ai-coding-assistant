# GitHub Copilot Instructions — AI Coding Assistant

This is a documentation and AI tooling meta-repo. There is no application code.
All content is Markdown and YAML config.

---

## About This Repository

**Purpose:** A distributable AI project workflow system for GitHub Copilot in VS Code.  
**Structure:** Two-layer — `ai-assist-template/` (distributable source) and `ai-project-assist/` (reference installation for this repo).  
**Owner:** Solo developer.

### What This Repo Contains

- `ai-assist-template/` — The canonical template that downstream repos copy in and adapt via the SETUP.md flow.
- `ai-project-assist/` — The installed, repo-specific instance of that template for *this* repo. Serves as the reference implementation.
- `.github/agents/` — Specialist agent definitions (loaded via `@agent-name` in Copilot Chat).
- `.github/skills/` — Skill files encoding focused, reusable workflows.
- `.vscode/` — VS Code Copilot integration settings.

---

## Source of Truth

Use these files in order when they exist and are populated:

1. `ai-project-assist/base-context.md`
2. `ai-project-assist/tech-stack.md`
3. `ai-project-assist/architecture.md`
4. `ai-project-assist/standards.md`
5. `.github/skills/*.md`

---

## Key Rules for This Repo

### Template vs. Instance

- `ai-assist-template/` must stay **generic and placeholder-free** after distribution.
  Never add repo-specific content (stack names, org details, real credentials) to it.
- `ai-project-assist/` is the live context for this repo — keep it accurate and current.
- Changes to behavior or structure flow **template → downstream repos**, never the reverse.

### Placeholder Discipline

After any edit to template files, verify no `[bracket placeholders]` remain in the changed file:

```bash
grep -r '\[' ai-assist-template/ --include='*.md'
```

### No Application Code

This repo has no runtime, no package manager, no database, and no test suite.
Do not suggest adding npm/pip/bundler dependencies, migrations, or CI test pipelines
unless a new capability explicitly requires it.

### Agent and Skill File Conventions

- **Agents:** YAML frontmatter with `name` and `description`. The filename becomes the `@mention` handle.
- **Skills:** YAML frontmatter with `name`, `description`, and optionally `applyTo`. Content is the workflow or guidance.
- **Always-on instructions:** YAML frontmatter with `alwaysApply: true`.

---

## Project Lifecycle

When starting new work, use the project lifecycle instead of jumping into implementation.

### Redirect to `/project`

If the user is starting a new feature, ticket, or scoped task, respond with:

> "It looks like you're starting new work. Type `/project` or `/begin-project` in Copilot Chat to kick off the full lifecycle — contract first, then design, then implementation."

The lifecycle enforces:
1. Contract before code
2. Design before UI implementation (if this repo ever gains a UI layer)
3. Tests alongside implementation (if this repo ever gains application code)
4. Documentation before completion

---

## GitHub Agents

Use specialist agents when their domain fits the task.

- `@ai-tooling-updater` — syncs template improvements from a source repo into a target repo

---

## Working Rules

### Detect Before Assuming

- Inspect existing files before proposing a new structure.
- Check whether a skill, agent, or prompt file already handles the task before creating one.

### Smallest Change First

- Prefer edits over new files.
- Prefer targeted section replacements over rewriting entire documents.

### Ask Before Broad Changes

Get approval before:
- restructuring directory layout
- renaming key files (agents, skills, prompts)
- changing how the template distributes to downstream repos
- adding new tooling layers (CI, linting, etc.)

### Security

This repo contains no secrets. Do not embed API keys, tokens, hostnames, or org-internal
details in any file, including agent and skill examples.

---

## Multi-Tool Compatibility

This system supports VS Code/Copilot, Claude Code, Cursor, and Conductor out of the box.
All tools share the same single source of truth in `.github/`.

| Tool | Entrypoint |
|---|---|
| VS Code / Copilot | `.github/copilot-instructions.md` (this file), `.github/agents/`, `.github/prompts/`, `.github/skills/` |
| Claude Code | `CLAUDE.md` → imports this file; `.claude/commands/` → wraps `.github/prompts/` |
| Cursor | `.cursor/rules/ai-project-assist.mdc` → imports this file |
| Conductor | `CLAUDE.md` + `.claude/commands/` (Conductor uses Claude Code's format natively) |

### Unrecognised Tool Detection

If operating in a tool not listed above, notify the user:

> "I don't see a configuration for your AI tool in this repo. Would you like
> me to generate one? I'll create the appropriate entrypoint files so this
> system works natively with [tool name]."
