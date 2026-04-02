# Documentation System Template

**Version:** 2.1
**Created:** 2026-01-05
**Updated:** 2026-04-02
**Source:** AI Tooling Template System

---

## 📦 What's Included

This template provides a repo-agnostic documentation and AI-orchestrated
project workflow that can be copied into an existing repository and adapted to
that repository's actual stack.

### Core System
- ✅ Project lifecycle management (creation → contract → design → code → archive)
- ✅ Contract-first workflow before implementation
- ✅ One-question-at-a-time scoping and design interviews
- ✅ Session logging, progress tracking, and knowledge capture
- ✅ 90-day archival policy with quarterly organization
- ✅ File size monitoring for long-running project files

### GitHub Copilot Integration
- ✅ `/project` and `/begin-project` slash commands
- ✅ Auto-orchestrated lifecycle with specialist agents
- ✅ Workflow, safety, language, framework, and testing skills
- ✅ Setup flow that starts by detecting the repo's language, framework,
  package manager, test runner, and UI stack

### Agent Team
| Agent | Role | Setup Mode |
|-------|------|------------|
| `@project-manager` | Orchestrates project lifecycle | Review ticket prefix and commands |
| `@contract-agent` | Scopes work one question at a time | Ready to use |
| `@design-agent` | Defines UI specs before implementation | Adapt to detected UI stack |
| `@senior-engineer` | Implements from an agreed contract | Fill stack-specific placeholders |
| `@test-agent` | Writes and reviews tests | Adapt to detected test framework |
| `@docs-agent` | Documents APIs, services, and architecture | Adapt to repo docs structure |
| `@api-agent` | Builds backend/API endpoints | Adapt to detected backend framework |
| `@ai-tooling-updater` | Syncs generic AI tooling from a source repo | Provide source repo at sync time |

### Structure
```
ai-project-assist/
├── README.md
├── SETUP.md
├── QUICK-START.md
├── base-context.md
├── tech-stack.md
├── architecture.md
├── standards.md
├── project-init-guide.md
├── project-lifecycle.md
├── emoji-guide.md
├── team-collaboration.md
├── languages/
│   └── _template.md
├── projects/
│   ├── _index.md
│   ├── _knowledge-base.md
│   ├── TEMPLATE.md
│   ├── project.md
│   └── archive/
├── .github/
│   ├── copilot-instructions.md
│   ├── agents/
│   ├── prompts/
│   └── skills/
│       ├── implementation-pipeline/
│       └── _templates/
└── .vscode/
```

---

## 🚀 Quick Setup

### Step 1: Copy the Template

```bash
cp -r ai-project-assist /path/to/your-repo/prompts
cp -r ai-project-assist/.github /path/to/your-repo/
cp -r ai-project-assist/.vscode /path/to/your-repo/
```

### Step 2: Let Setup Detect the Stack

In GitHub Copilot Chat, say:

```text
Load prompts/SETUP.md and install this documentation system into the current repo.
Detect the language, framework, package manager, test runner, and UI stack from
the codebase before asking any follow-up questions.
```

The setup flow is expected to inspect the repository first. Typical signals
include files such as `package.json`, `pyproject.toml`, `Gemfile`, `go.mod`,
`Cargo.toml`, `pom.xml`, `build.gradle`, `composer.json`, `*.csproj`,
`requirements.txt`, `Dockerfile`, and CI config.

### Step 3: Review the Generated Customization

After detection, AI should adapt:
- `prompts/base-context.md`
- `prompts/tech-stack.md`
- `prompts/architecture.md`
- `prompts/languages/*.md`
- `.github/copilot-instructions.md`
- stack-specific agent files and skills

The setup should ask follow-up questions only when the repo is ambiguous,
multi-stack, or missing enough signals to infer the right defaults.

---

## 🎯 Design Goal

This template is meant to be copied into repositories with different stacks.
That means:

1. The copied files should not assume Rails, RSpec, Tailwind, or any other
   stack by default.
2. Always-on instructions should point back to detected repo context rather than
   shipping hard-coded framework conventions.
3. Setup should generate or adapt stack-specific guidance from the target repo
   instead of asking the user to manually replace every example.

---

## 📋 What Must Be Customized

| File Group | Required | How It Should Be Customized |
|------------|----------|-----------------------------|
| `prompts/base-context.md` | Yes | Fill with repo identity, goals, team, workflow |
| `prompts/tech-stack.md` | Yes | Record detected stack, versions, tools, dependencies |
| `prompts/architecture.md` | Yes | Document actual app architecture and boundaries |
| `prompts/languages/*.md` | Usually | Create language guides for detected primary languages |
| `.github/copilot-instructions.md` | Yes | Replace placeholders with repo-specific conventions |
| `.github/agents/*.md` | Maybe | Adapt only the agents relevant to the detected stack |
| `.github/skills/*.md` | Yes | Generate stack-specific safety, language, framework, and testing skills |

Files like `project-lifecycle.md`, `project-init-guide.md`, and
`emoji-guide.md` should stay broadly reusable unless the target team has a
different workflow.

---

## 🔍 Detection-First Setup

The installation flow should begin with repository inspection, not a long list
of manual questions.

### Detect Automatically
- Primary languages from source files and manifest files
- Backend framework from dependency manifests and entrypoints
- Frontend framework and styling approach from dependencies and config
- Test framework from test directories, package manifests, and CI commands
- Package manager, version manager, containers, and dev tooling
- Common docs locations and project structure

### Ask Only If Needed
- Which ticket prefix the team uses
- Team-specific review or branching rules not present in the repo
- Ambiguous framework choice in multi-app repos
- Preferred examples when the repo supports multiple patterns

---

## 🧭 Typical Workflow After Setup

1. Developer types `/project`.
2. AI loads repo-specific context from the customized files.
3. Contract and design phases run one question at a time.
4. Engineering uses the detected stack conventions and generated skills.
5. Test, security, tech debt, and docs reviews run before completion.
6. `/save` and `/end` keep project history current.

---

## ✅ Verification Checklist

After setup, verify:

```text
[ ] prompts/base-context.md contains the real repo name and purpose
[ ] prompts/tech-stack.md lists the detected stack and versions
[ ] prompts/languages/ contains guides for the detected primary language(s)
[ ] .github/copilot-instructions.md has no leftover placeholder text
[ ] .github/agents/test-agent.md matches the repo's test runner
[ ] .github/agents/api-agent.md matches the repo's backend/API stack, if any
[ ] .github/skills/ contains repo-specific safety/language/framework/testing skills
[ ] /project works and loads the customized context
```

---

## 🔄 Keeping Systems In Sync

When template improvements are available:

1. Review the new source repo or branch.
2. Use `@ai-tooling-updater` to sync the generic improvements.
3. Preserve repo-specific context in the target repo.
4. Re-run verification after sync.

Recommended sync command:

```text
@ai-tooling-updater sync from owner/repo
```

---

## 🆘 Troubleshooting

### Setup guessed the wrong stack
- Re-run setup and tell it exactly which directory or app to inspect.
- If the repo is multi-app, tell it which app is primary for this template.

### Placeholders remain after setup
- Re-run verification against `.github/`, `prompts/`, and `.vscode/`.
- Search for bracketed placeholders before relying on the template.

### Agents feel framework-biased
- Regenerate the relevant language/framework/testing skills from the detected
  stack.
- Update `prompts/tech-stack.md` first, then refresh the affected agent files.

---

## ⚖️ License

This template can be adapted for any team or organization. Customize it freely
for local workflow needs.

---

**Ready to start?**

```text
1. Copy the template into your repo
2. Load prompts/SETUP.md
3. Let setup inspect the repo and detect the stack
4. Review the generated customization
5. Start with /project
```

---

**Template Version:** 2.1
**Last Updated:** 2026-04-02
**Maintained by:** Your Development Team
