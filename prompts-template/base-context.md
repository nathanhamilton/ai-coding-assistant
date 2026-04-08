# AI Coding Assistant

**Repository:** nathanhamilton/ai-coding-assistant  
**Purpose:** A distributable AI project workflow system that turns GitHub Copilot into a repo-aware execution layer with persistent context, lifecycle management, specialist agents, and reusable skills.  
**Team:** Solo developer  
**Last Updated:** 2026-04-08

---

## 🎯 Project Overview

This repo solves the "blank context" problem that makes AI coding assistants inconsistent. Without persistent project knowledge, assistants drift from the repo's real architecture, naming conventions, and testing patterns on every session.

The system provides a distributable template (`ai-assist-template/`) that engineers copy into their own repos as `ai-project-assist/`. Once installed, GitHub Copilot in VS Code can reference repo-specific context files, follow a contract-first lifecycle, and use specialist agents and reusable skills — all versioned alongside the code they guide.

This repo serves two roles: it is the source of the distributable template and it is itself a working installation of that template, making it the reference implementation.

### Key Features

- **Distributable template:** `ai-assist-template/` is the source that target repos copy in and adapt
- **Contract-first lifecycle:** `/project` and `/begin-project` enforce scope definition before implementation
- **Specialist agents:** dedicated agents for project management, contracts, design, engineering, testing, docs, and API work
- **Reusable skills:** scoped skill files (e.g., `implementation-pipeline`) that give Copilot focused workflows
- **Detection-first setup:** SETUP.md instructs Copilot to inspect the repo before asking questions
- **Self-maintaining:** `@ai-tooling-updater` agent syncs template improvements across repos

### Critical Workflows

1. **Template distribution:** copy `ai-assist-template/` into a target repo, run the SETUP.md flow to detect the stack and fill placeholders
2. **Project lifecycle:** `/project` → contract → design → implementation → test → archive
3. **Template evolution:** improve `ai-assist-template/`, sync downstream repos via `@ai-tooling-updater`

---

## 🏗️ Technical Foundation

### Core Technologies

- **[Primary Language]:** [Version] - [What it's used for]
- **[Framework]:** [Version] - [Web framework, etc.]
- **Database:** [Type & Version] - [Primary data store]
- **Cache:** [If applicable] - [Redis, Memcached, etc.]
- **Background Jobs:** [If applicable] - [Sidekiq, Celery, etc.]
- **Authentication:** [System used] - [Devise, Auth0, etc.]
- **Testing:** [Framework] - [RSpec, Pytest, Jest, etc.]

### Key Dependencies

List critical dependencies that developers should know about:

- **[Gem/Package 1]:** [Purpose]
- **[Gem/Package 2]:** [Purpose]
- **[Gem/Package 3]:** [Purpose]

### Development Environment

- **Container:** [Docker/Docker Compose if applicable]
- **Package Manager:** [bundler, npm, pip, etc.]
- **Version Manager:** [rbenv, nvm, pyenv, etc.]
- **Local Setup:** [Brief description or link to docs]

---

## 📁 Repository Structure

```
ai-coding-assistant/
├── ai-assist-template/    # Distributable source template
├── ai-project-assist/     # Installed instance for this repo (reference implementation)
├── .github/
│   ├── agents/            # Specialist agent definitions
│   ├── skills/            # Reusable skill files
│   └── copilot-instructions.md
├── .vscode/
│   └── settings.json
└── README.md
```

### Important Directories

- **`ai-assist-template/`** — The canonical distributable template. Changes here flow to downstream repos via the updater agent.
- **`ai-project-assist/`** — The working installation for this repo. Serves as the reference for how the template should look once set up.
- **`.github/agents/`** — Agent definition files that Copilot loads as specialist modes.
- **`.github/skills/`** — Skill files that encode focused, reusable workflows (e.g., `implementation-pipeline`).
- **`.vscode/`** — VS Code settings that improve the local Copilot experience.

---

## 🎨 Architecture Patterns

### Pattern 1: Template / Instance Separation

The distributable source (`ai-assist-template/`) is always kept generic and placeholder-free after distribution. The installed instance (`ai-project-assist/`) is repo-specific. Improvements flow from the template outward — never the reverse.

### Pattern 2: Detection Before Questions

Setup instructions always ask the AI to inspect the repo's files (manifests, CI configs, directory structure) before prompting the user. This avoids redundant setup questions and ensures the installed system reflects the actual repo.

### Pattern 3: Contract Before Code

No implementation begins without an agreed written contract. The `/project` lifecycle enforces this by routing new work through `@contract-agent` before reaching `@senior-engineer`.

---

## 🔒 Security Considerations

This repo contains no application code, credentials, secrets, or user data. All files are Markdown and configuration.

- Do not embed API keys or tokens in prompt or instruction files.
- Treat any downstream repo's `.github/copilot-instructions.md` as potentially public — avoid hard-coding internal hostnames, org structure, or security policies.
- Agent and skill files should not include real credentials even as examples.

---

## 🧪 Validation

This repo has no automated test suite. Validation is done by inspection:

- **Template correctness:** no placeholder text (`[brackets]`) should remain in a distributed copy after setup runs
- **File references:** verify links between context files (`base-context.md` → `tech-stack.md` → `architecture.md`) resolve correctly
- **Agent/skill loading:** open the repo in VS Code and confirm Copilot can @-mention agents and load skill files

```bash
# Check for unfilled placeholders across ai-project-assist/
grep -r '\[' ai-project-assist/ --include='*.md' | grep -v '^Binary'
# Run all tests
[command]

# Run specific test file
[command]

# Run with coverage
[command]
```

### Coverage Targets

- **New code:** [X]% minimum coverage
- **Overall:** [Y]% target coverage

---

## 🚀 Development Workflow

### Getting Started

1. Clone repository
2. Install dependencies: `[command]`
3. Set up database: `[command]`
4. Run migrations: `[command]`
5. Start server: `[command]`

### Common Commands

```bash
# Start development server
[command]

# Run tests
[command]

# Lint code
[command]

# Format code
[command]

# Database migrations
[command]
```

### Git Workflow

- **Branch naming:** `[JIRA-NUMBER]-description` or `[pattern]`
- **Commit format:** `[JIRA-NUMBER]: Description` or `[pattern]`
- **PR requirements:** [Tests pass, reviews required, etc.]

---

## 🔗 External Integrations

### Service 1: [Name]

- **Purpose:** [What this integration does]
- **Documentation:** [Link]
- **Configuration:** [Where config is stored]

### Service 2: [Name]

- **Purpose:** [What this integration does]
- **Documentation:** [Link]
- **Configuration:** [Where config is stored]

---

## 📊 Monitoring & Observability

### Error Tracking

- **Service:** [Honeybadger, Sentry, etc.]
- **Dashboard:** [Link]

### Performance Monitoring

- **Service:** [New Relic, DataDog, etc.]
- **Dashboard:** [Link]

### Logging

- **Service:** [Where logs are stored/viewed]
- **Key Log Locations:** [Paths or services]

---

## 🌍 Environments

### Development

- **URL:** [Local URL or dev server]
- **Database:** [Where dev data lives]
- **Special Notes:** [Any dev-specific configuration]

### Staging

- **URL:** [Staging URL]
- **Database:** [Staging database info]
- **Deployment:** [How to deploy to staging]

### Production

- **URL:** [Production URL]
- **Database:** [Production database info]
- **Deployment:** [How production deploys happen]
- **Access:** [Who has access, how to request]

---

## 👥 Team & Collaboration

### Team Structure

- **Team Size:** [Number]
- **Roles:** [Backend, Frontend, DevOps, etc.]
- **Working Style:** [Async, sync, timezone distribution]

### Communication Channels

- **Slack:** [Channel names]
- **Email:** [Team aliases]
- **Stand-ups:** [When/how often]
- **Retros:** [When/how often]

### Key Contacts

- **Tech Lead:** [Name]
- **Product Owner:** [Name]
- **DevOps:** [Name/Team]

---

## 📚 Additional Resources

### Documentation

- **Internal Wiki:** [Link]
- **API Documentation:** [Link]
- **Architecture Diagrams:** [Link]

### Onboarding

- **New Developer Guide:** [Link or description]
- **Video Walkthroughs:** [Link if available]

### Related Repositories

- **[Repo 1]:** [Purpose and link]
- **[Repo 2]:** [Purpose and link]

---

## 🔄 This Documentation System

This repository uses a structured documentation system for project management:

- **`prompts/`** - AI-assisted project management documentation
- **`prompts/projects/`** - Active project tracking with session logs
- **`.github/agents/`** - Task-specific AI agents for development
- **Natural language triggers** - Say "begin project" to load context

### Quick Start

```
# Load project context
Say: "begin project"

# Create new project
Say: "new project: JIRA-123-feature-name"

# Use specialized agents
Say: "@test-agent write tests for [module]"
Say: "@api-agent create [endpoint]"
Say: "@docs-agent document [feature]"

# Track progress
Say: "save session"
Say: "end session"
```

See `prompts/project-init-guide.md` for complete documentation system guide.

---

**Version:** 1.0  
**Last Updated:** [YYYY-MM-DD]  
**Maintained by:** [Team name]
