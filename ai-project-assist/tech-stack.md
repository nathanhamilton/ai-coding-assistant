# AI Coding Assistant — Tech Stack

**Last Updated:** 2026-04-08

---

## 🏗️ Core "Stack"

This repo contains no application code. It is a documentation and AI tooling system.

- **Content format:** Markdown (`.md`) — all context files, templates, agents, skills, prompts
- **Config format:** JSON (`.vscode/settings.json`) and YAML frontmatter in agent/skill/prompt files
- **Primary AI tool:** GitHub Copilot in VS Code
- **No runtime, no package manager, no database, no test runner**

---

## 🤖 AI Tooling Layer

This system is **multi-tool compatible** out of the box. All tools share a single source of truth in `.github/`; tool-specific entrypoints import from it rather than duplicating content.

| Tool | Entrypoint | Format |
|---|---|---|
| VS Code / Copilot | `.github/copilot-instructions.md` | Always-on instructions |
| VS Code / Copilot | `.github/agents/*.md` | `@agent-name` mentions |
| VS Code / Copilot | `.github/prompts/*.md` | `/slash-command` prompts |
| VS Code / Copilot | `.github/skills/` | On-demand skill files |
| Claude Code | `CLAUDE.md` | `@`-imports `.github/copilot-instructions.md` |
| Claude Code | `.claude/commands/*.md` | `@`-wraps `.github/prompts/` files |
| Cursor | `.cursor/rules/ai-project-assist.mdc` | `alwaysApply: true`, imports `.github/copilot-instructions.md` |
| Conductor | `CLAUDE.md` + `.claude/commands/` | Uses Claude Code format natively |

---

## 📦 Key Files

- **`ai-assist-template/SETUP.md`:** the machine-readable setup instruction file for downstream installs
- **`ai-assist-template/base-context.md`:** template for repo-specific context; filled during setup
- **`ai-assist-template/tech-stack.md`:** template for stack documentation; filled during setup
- **`ai-assist-template/architecture.md`:** template for architectural boundaries; filled during setup
- **`.github/skills/implementation-pipeline/SKILL.md`:** workflow skill for scoped implementation work
- **`.github/agents/ai-tooling-updater-agent.md`:** agent for syncing this template to downstream repos

---

## ⚙️ Development Environment

- **OS:** macOS (solo developer)
- **Editor:** VS Code with GitHub Copilot Chat extension
- **No install step required** — clone the repo and open in VS Code
- **Validation:** manual inspection; grep for `[` to find unfilled placeholders

---

**Note:** Keep this file updated when the AI tooling layer gains new components (new tools, new config files, new agent types).
