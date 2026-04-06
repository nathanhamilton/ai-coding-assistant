# AI Project Assist

AI Project Assist is a reusable AI tooling kit for developers who want GitHub Copilot in VS Code to work with stronger project context, safer delivery flow, and less session-to-session drift.

Instead of relying on ad hoc chat history, it gives your local repository a lightweight operating layer: repo context files, stack-aware setup instructions, lifecycle prompts, specialist agents, and reusable skills. The result is that Copilot can start with the structure of your repo, detect the stack you are actually using, and guide work through scope, implementation, testing, review, and close-out with less manual prompting.

## Why Use It

- Keep project context in files that live with the repo instead of in one chat session.
- Install a detection-first setup flow that adapts to the target repo's language, framework, package manager, and test runner.
- Add a repeatable project workflow with `/project`, `/save`, and `/end`.
- Use specialist agents for contract definition, design, implementation, testing, docs, review, security, and technical debt.
- Create a cleaner handoff between "what are we building" and "now write the code".

## What You Get

- `ai-assist-template/`:
  the distributable source template you copy into a target repo as
  `ai-project-assist/`
- `ai-assist-template/.github/`:
  reusable Copilot instructions, prompts, agents, and skill templates
- `ai-assist-template/.vscode/`:
  local editor integration, snippets, and chat shortcuts
- `.github/agents/ai-tooling-updater-agent.md`:
  a repo-level agent for syncing template improvements into this source repo
- `.github/skills/implementation-pipeline/SKILL.md`:
  the local workflow skill used to maintain this repo

## How To Use It In A Local Repo

From the target repository root:

```bash
cp -r /path/to/ai-assist-template ai-project-assist
cp -r /path/to/ai-assist-template/.github .
cp -r /path/to/ai-assist-template/.vscode .
```

Then open the target repo in VS Code and tell Copilot:

```text
Load ai-project-assist/SETUP.md and install this documentation system into the current repo.
Detect the language, framework, package manager, test runner, and UI stack from
the codebase before asking follow-up questions.
```

The setup flow should inspect the target repo first, then customize the copied files so they reflect that repo's real conventions instead of a baked-in default stack.

## Daily Workflow

After setup, the normal flow is:

1. Use `/project` or `/begin-project` to start or resume tracked work.
2. Let the contract and design phases clarify non-trivial work before coding.
3. Implement with the repo-specific instructions and generated skills.
4. Use `/save` to record progress and `/end` to close the session cleanly.

## Repository Layout

```text
.
├── ai-assist-template/
├── ai-project-assist/
├── .github/
└── .vscode/
```

`ai-assist-template/` is the source template. When used in another repo, it
should be installed as that repo's `ai-project-assist/` directory.

## Start Here

- See [ai-assist-template/README.md](ai-assist-template/README.md) for the template overview.
- See [ai-assist-template/QUICK-START.md](ai-assist-template/QUICK-START.md) for the shortest install path.
- See [ai-assist-template/SETUP.md](ai-assist-template/SETUP.md) for the stack-detection and customization workflow.