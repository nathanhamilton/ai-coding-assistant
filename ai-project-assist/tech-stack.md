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

- **GitHub Copilot:** the primary AI assistant this system targets
- **VS Code:** the editor host; agent and skill files are discovered via `.github/` and `.vscode/`
- **`.github/copilot-instructions.md`:** always-on system prompt that Copilot reads for every session
- **`.github/agents/*.md`:** specialist agent definitions loaded via `@agent-name` in Copilot Chat
- **`.github/skills/*.md`:** skill files loaded on demand by agents or by user instruction
- **`.github/prompts/*.md`:** slash-command prompt files (`/project`, `/begin-project`, etc.)
- **`.vscode/settings.json`:** editor-level Copilot configuration

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
