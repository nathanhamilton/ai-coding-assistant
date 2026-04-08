# Architecture — AI Coding Assistant

**Repository:** nathanhamilton/ai-coding-assistant  
**Last Updated:** 2026-04-08

---

## 🏗️ System Architecture

This repo has no application runtime, server, or database. Its architecture is a **two-layer file system** that separates the distributable template from the installed instance, with AI integration via `.github/` and editor integration via `.vscode/`.

```
┌─────────────────────────────────────────────────┐
│                ai-coding-assistant/             │
│                                                 │
│  ┌──────────────────────┐  ┌──────────────────┐ │
│  │  ai-assist-template/ │  │ ai-project-assist│ │
│  │  (distributable      │  │ (reference       │ │
│  │   source template)   │  │  installation)   │ │
│  └──────────┬───────────┘  └──────────────────┘ │
│             │ copied into target repos           │
│             ▼                                   │
│  ┌──────────────────────┐                       │
│  │  .github/            │  AI integration layer │
│  │  ├── copilot-instruc │  always-on prompt     │
│  │  ├── agents/         │  specialist agents    │
│  │  ├── skills/         │  reusable workflows   │
│  │  └── prompts/        │  slash commands       │
│  └──────────────────────┘                       │
│  ┌──────────────────────┐                       │
│  │  .vscode/            │  Editor integration   │
│  └──────────────────────┘                       │
└─────────────────────────────────────────────────┘
```

---

## 📁 Directory Structure

```
ai-coding-assistant/
├── ai-assist-template/          # Distributable source template
│   ├── README.md
│   ├── SETUP.md                 # Machine-readable install instructions
│   ├── QUICK-START.md
│   ├── base-context.md          # Template: repo context (fill during setup)
│   ├── tech-stack.md            # Template: stack docs (fill during setup)
│   ├── architecture.md          # Template: architecture docs (fill during setup)
│   ├── standards.md             # Generic engineering standards
│   ├── project-init-guide.md    # How to start tracked work
│   ├── project-lifecycle.md     # Lifecycle stages (contract → archive)
│   ├── emoji-guide.md
│   ├── team-collaboration.md
│   ├── languages/
│   │   └── _template.md         # Template for per-language guides
│   ├── projects/
│   │   ├── _index.md            # Active project index
│   │   ├── _knowledge-base.md   # Cross-project learnings
│   │   ├── TEMPLATE.md          # Project file template
│   │   ├── project.md           # Example project file
│   │   └── archive/
│   │       ├── QUARTER-SUMMARY-TEMPLATE.md
│   │       ├── README.md
│   │       └── sessions/
│   └── .github/                 # Template AI integration files (copy to repo root)
│       ├── copilot-instructions.md
│       ├── agents/
│       ├── prompts/
│       └── skills/
├── ai-project-assist/           # Reference installation (this repo's instance)
│   └── (same structure, filled with repo-specific content)
├── .github/                     # Active AI integration for this repo
│   ├── copilot-instructions.md
│   ├── agents/
│   │   └── ai-tooling-updater-agent.md
│   └── skills/
│       └── implementation-pipeline/
│           └── SKILL.md
├── .vscode/
│   └── settings.json
└── README.md
```

### Directory Conventions

#### `ai-assist-template/` — Canonical distributable source
All files in this directory must remain generic after editing. Content that references specific repos, people, or stacks must be parameterized or documented as "fill during setup." This is what downstream repos receive.

#### `ai-project-assist/` — Reference installation
This is the active AI context folder for *this* repo. It doubles as a reference for what a fully set-up installation looks like. Keep `base-context.md`, `tech-stack.md`, and `architecture.md` accurate for this repo.

#### `.github/agents/*.md`
Each file is a named agent. The filename becomes the `@mention` handle in Copilot Chat. YAML frontmatter defines the `name` and `description` fields that Copilot uses for agent selection.

#### `.github/skills/*.md` or `skills/*/SKILL.md`
Skills are loaded explicitly by agents or users. Each skill folder contains a `SKILL.md` with a YAML frontmatter `name` and `description`, followed by the workflow or guidance content.

---

## 🎨 Key Architectural Patterns

### Template / Instance Separation

The distributable source (`ai-assist-template/`) and the installed instance (`ai-project-assist/`) are always kept as separate directories. The template stays generic; the instance is repo-specific. Improvements flow template → downstream repos via `@ai-tooling-updater`. Never merge repo-specific content back into the template.

### Detection-First Setup

SETUP.md instructs the AI to inspect repository manifests, CI files, and directory structure before asking questions. This prevents generic setup defaults from leaking into installed instances.

### Contract Before Code

The `/project` and `/begin-project` commands route all new work through a contract phase before reaching implementation agents. No agent writes code without an agreed written contract.

### YAML Frontmatter as Configuration

Agents, skills, and prompts use YAML frontmatter to declare their `name`, `description`, `applyTo`, and `alwaysApply` properties. Copilot reads these to decide when to load each file. This is the only "config" layer in this repo.

---

## 🔄 Key Flows

### Template Distribution Flow

```
ai-assist-template/ (edit here)
    ↓  cp -r  (user copies to target repo)
[target-repo]/ai-project-assist/
    ↓  Load SETUP.md in Copilot
Detect stack → Fill placeholders → Done
```

### Template Sync Flow (after template evolves)

```
User: "@ai-tooling-updater sync from nathanhamilton/ai-coding-assistant"
    ↓
Agent fetches source repo via GitHub MCP
    ↓
Merges generic changes into target repo
    ↓
Preserves repo-specific customizations
```

### Project Lifecycle Flow

```
/project or /begin-project
    ↓
@contract-agent (scope, constraints, P0s)
    ↓
@design-agent (if UI involved)
    ↓
@senior-engineer (plan → approval → implementation)
    ↓
@test-agent (tests alongside or after)
    ↓
@docs-agent (if needed)
    ↓
Archive project file
```

---

**Last Reviewed:** 2026-04-08  
**Maintained by:** Solo developer

