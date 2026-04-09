# AI Project Assist

AI Project Assist turns any modern AI coding tool — VS Code/Copilot, Claude Code, Cursor, or Conductor — from a reactive chat assistant into a repo-aware execution layer.

It gives your AI tool persistent project context, a detection-first setup flow, lifecycle prompts, specialist agents, and reusable skills that live in the repository as plain files. Engineers spend less time rebuilding context and correcting generic suggestions. Engineering managers get a workflow that is easier to standardize, review, and scale across repositories.

This is not about replacing engineering judgment. It is about making repo-defined architecture, testing, review, and delivery rules available to your AI tool at the moment code is being written.

## Quick Links

- [How To Use It](#how-to-use-it-in-a-local-repo)
- [Why It Works](#why-it-works)
- [What You Get](#what-you-get)
- [Daily Workflow](#daily-workflow)
- [Repository Layout](#repository-layout)
- [Start Here](#start-here)

## How To Use It In A Local Repo

### Step 1 — Clone this repo

```bash
git clone https://github.com/nathanhamilton/ai-coding-assistant.git
```

### Step 2 — Copy the template into your target repo

From inside your target repository root, copy the `ai-assist-template/` directory across:

```bash
cp -r /path/to/ai-coding-assistant/ai-assist-template ./ai-assist-template
```

That's the only file operation needed. Do not rename it or copy individual subdirectories — leave it as `ai-assist-template/` at the root.

### Step 3 — Run setup in your AI tool

Open the target repo in your AI tool (VS Code/Copilot, Claude Code, Cursor, or Conductor) and send this message in chat:

```text
Load ai-assist-template/SETUP.md and install this tool into the current repo.
```

SETUP.md takes it from there. It will inspect the codebase, detect the stack, generate the repo-specific config files (`ai-project-assist/`, `.github/`, `CLAUDE.md`, `.claude/`, `.cursor/`, `.vscode/`), and walk you through any decisions it cannot infer automatically.

## Why It Works

- For engineers: it reduces prompt overhead, context loss, and blank-page friction.
- For engineering managers: it makes delivery more repeatable because standards, architecture notes, and workflow rules live in versioned files.
- For both: it moves knowledge out of one-off chat threads and into assets the whole repo can reuse.
- Setup starts with repository inspection, not generic defaults, so the system adapts to the actual stack.
- Output quality improves because your AI tool is constrained by source-of-truth files, testing expectations, and review rules.
- Prompts, instructions, agents, and skills remain inspectable and reviewable like any other project artifact.

Generic AI assistance often fails through variance: plausible code that drifts away from the repo's architecture, naming, testing patterns, and review expectations. AI Project Assist reduces that variance by binding your AI tool to repo-defined guidance before implementation begins.

For engineers, that means less framework drift and fewer off-pattern suggestions. For managers, it means a more defensible operating model for AI adoption: visible inputs, versioned standards, clearer review paths, and a more consistent path from ticket to tested change.

## What You Get

- `ai-project-assist/` holds repo context, architecture notes, lifecycle guides, and project tracking files.
- `.github/` holds the shared core: instructions, slash-command prompts, specialist agents, and skills — the single source of truth for all AI tools.
- `CLAUDE.md` is the entrypoint for Claude Code and Conductor. It imports from `.github/` with no duplication.
- `.claude/commands/` holds slash commands for Claude Code and Conductor, each wrapping the matching `.github/prompts/` file.
- `.cursor/rules/` holds the always-on Cursor rule that imports from `.github/`.
- `.vscode/` holds VS Code editor integration settings.
- `ai-assist-template/` is the distributable source template copied into target repos as `ai-project-assist/`.
- `.github/agents/ai-tooling-updater-agent.md` keeps repos in sync as the template evolves.

This is a practical layer on top of your AI tool, not a black box. The guidance is local, versioned, editable, and compatible with VS Code/Copilot, Claude Code, Cursor, and Conductor out of the box — with no extra configuration per tool.

## Daily Workflow

After setup, the normal flow is:

1. Use `/project` or `/begin-project` to start or resume tracked work.
2. Let contract and design guidance remove ambiguity before implementation.
3. Implement with the repo-specific instructions and generated skills.
4. Use `/save` to record progress and `/end` to close the session cleanly.

## Repository Layout

```text
.
├── ai-assist-template/    # Distributable source template
├── ai-project-assist/     # Installed instance for this repo
├── CLAUDE.md              # Claude Code + Conductor entrypoint
├── .claude/
│   └── commands/          # Slash commands for Claude Code and Conductor
├── .cursor/
│   └── rules/             # Cursor always-on rule
├── .github/               # Shared core — single source of truth for all tools
│   ├── copilot-instructions.md
│   ├── agents/
│   ├── prompts/
│   └── skills/
└── .vscode/               # VS Code editor settings
```

`ai-assist-template/` is the source template. When installed into another repo it becomes that repo's `ai-project-assist/` directory, along with all the tool-specific entrypoints above.

## Start Here

- See [ai-assist-template/README.md](ai-assist-template/README.md) for the full template overview.
- See [ai-assist-template/QUICK-START.md](ai-assist-template/QUICK-START.md) for the fastest install path.
- See [ai-assist-template/SETUP.md](ai-assist-template/SETUP.md) for the stack-detection setup flow.
