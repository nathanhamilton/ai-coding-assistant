# Documentation System Setup

This file tells AI how to install and customize the documentation system inside
an existing repository.

---

**For AI Assistants:** When a user says "Load ai-project-assist/SETUP.md" or asks to
install this system into the current repo, create or maintain the target
`ai-project-assist/` folder in that repo, detect the stack from the repo first,
and only ask follow-up questions when the codebase is ambiguous.

---

## 🎯 Purpose

This template is meant to be copied into repositories that may use different
languages, frameworks, test runners, and deployment styles. The setup flow must
therefore be:

1. **Repo agnostic by default**
2. **Detection first, questions second**
3. **Placeholder free after installation**

---

## 📋 Setup Workflow

### Step 0: Create or Refresh the Target AI Folder

The target repository should use `ai-project-assist/` as the local AI context
folder name.

- If `ai-project-assist/` does not exist in the target repo, create it first.
- Do not install this system into a generic `prompts/` folder.
- Keep `.github/` and `.vscode/` alongside it at the repo root.

Expected target layout:

```text
[repo-root]/
├── ai-project-assist/
├── .github/
└── .vscode/
```

### Step 1: Inspect the Repository Before Asking Questions

Read the repo and infer as much as possible from files already present.

#### Detection sources

| Signal | What to infer |
|--------|----------------|
| `package.json`, `pnpm-lock.yaml`, `yarn.lock` | JavaScript/TypeScript stack, package manager, scripts |
| `pyproject.toml`, `requirements.txt`, `poetry.lock`, `uv.lock` | Python stack, package manager, test tooling |
| `Gemfile`, `gems.rb` | Ruby/Rails stack |
| `go.mod` | Go stack |
| `Cargo.toml` | Rust stack |
| `pom.xml`, `build.gradle`, `settings.gradle` | JVM stack |
| `composer.json` | PHP stack |
| `*.csproj`, `Directory.Build.props` | .NET stack |
| `Dockerfile`, container orchestration files, CI workflows | runtime, services, test commands |
| `src/`, `app/`, `api/`, `spec/`, `tests/`, `test/` | app structure and test layout |
| existing docs and config files | conventions, branching, architecture, terminology |

#### Required behavior

- Detect the **primary language(s)**.
- Detect the **primary backend and frontend framework**, if present.
- Detect the **test runner**, **package manager**, **lint/format tools**, and
  **common commands**.
- Detect whether the repo is **backend only**, **frontend only**, **full-stack**,
  **library/package**, or **multi-app**.

Do not begin by asking the user to restate information that the repo already
contains.

### Step 2: Ask Only the Missing Questions

If the codebase leaves gaps, ask one question at a time. Typical follow-ups:

- Which directory is the primary app in a multi-app repo?
- What ticket prefix should project files use?
- What review or branching rules does the team follow that are not documented?
- Which of several detected frameworks should be treated as primary?

### Step 3: Write the Repo Context Files

#### 3.1 Update `ai-project-assist/base-context.md`

Fill in:
- repo name
- purpose and problem domain
- team/workflow notes
- high-level overview
- key features
- links to the stack and architecture files

#### 3.2 Update `ai-project-assist/tech-stack.md`

Record:
- detected languages and versions
- framework(s)
- database/cache/queue systems
- auth/authz stack
- test stack
- package manager and runtime tooling
- external integrations already visible in the repo

#### 3.3 Update `ai-project-assist/architecture.md`

Document the actual:
- directory layout
- architectural boundaries
- data flow
- integration points
- deployment/runtime assumptions visible in the repo

#### 3.4 Create language guides in `ai-project-assist/languages/`

Create one guide per detected primary language when it materially affects
coding style or structure.

Examples:
- `python.md`
- `typescript.md`
- `ruby.md`
- `go.md`

Use `languages/_template.md` as a starting point when helpful, but generate the
guide from the repo's real conventions rather than copying a mismatched example.

### Step 4: Update Always-On Instructions

#### 4.1 Update `.github/copilot-instructions.md`

This file must stay framework-neutral until setup fills in repo specifics.
After setup, it should:

- describe the repo accurately
- point to `ai-project-assist/tech-stack.md`, `ai-project-assist/architecture.md`, and
  `ai-project-assist/languages/*.md` as sources of truth
- remove placeholder text
- avoid hard-coding examples from unrelated stacks

#### 4.2 Update agent files only where needed

- `project-manager-agent.md`: ticket prefix and commands
- `design-agent.md`: CSS/UI conventions if the repo has a UI layer
- `senior-engineer-agent.md`: detected language/framework/linter/test commands
- `test-agent.md`: actual test runner, layout, mocks, and helper patterns
- `api-agent.md`: actual API/backend framework if the repo exposes an API
- `docs-agent.md`: actual docs locations and examples

If a repo does not primarily use an agent's domain, keep the file generic rather
than forcing a mismatched framework example into it.

### Step 5: Generate Skills

Create or update `.github/skills/` for the detected stack.

#### 5.1 Keep the universal workflow skill
- Copy `ai-project-assist/.github/skills/implementation-pipeline/SKILL.md` into the root
  `.github/skills/implementation-pipeline/SKILL.md` unchanged.

#### 5.2 Generate stack-specific skills
Create skills for the repo's real needs, for example:
- `safety/SKILL.md`
- `language/SKILL.md` or `python/SKILL.md`, `typescript/SKILL.md`, etc.
- `framework/SKILL.md` or `rails/SKILL.md`, `fastapi/SKILL.md`, etc.
- `testing/SKILL.md`

If `_templates/` contains a close match, adapt it. If not, generate a new skill
from the detected repo patterns. Do not force a Ruby or RSpec template into a
non-Ruby repo.

#### 5.3 Skill requirements
Every generated skill should:
- have valid frontmatter
- contain repo-specific commands and examples
- avoid unrelated framework terminology
- reference real files when giving examples

### Step 6: Initialize Project Tracking Files

Update `ai-project-assist/projects/_index.md` so it reflects the team's chosen ticket
prefix and starts empty but valid.

Ensure naming conventions match the target repo's workflow.

### Step 7: Verify the Installation

Check:

1. No placeholder text remains in customized files.
2. File paths and commands point to real locations.
3. The detected stack appears consistently in `base-context.md`,
   `tech-stack.md`, and agent/skill files.
4. `/project` and related slash commands still reference real files.

---

## 🔍 Files That Must End Up Accurate

| File | Expected state after setup |
|------|----------------------------|
| `ai-project-assist/base-context.md` | Real repo identity and overview |
| `ai-project-assist/tech-stack.md` | Detected stack and tooling |
| `ai-project-assist/architecture.md` | Real app structure |
| `ai-project-assist/languages/*.md` | Guides for detected primary languages |
| `.github/copilot-instructions.md` | Repo-specific, no placeholders |
| `.github/agents/*.md` | Adapted only where relevant |
| `.github/skills/*.md` | Real commands and conventions |

---

## ✅ Setup Checklist

- [ ] Repository inspected before follow-up questions were asked
- [ ] Primary language(s) and framework(s) detected
- [ ] Test runner and package manager detected
- [ ] `base-context.md` updated with real repo details
- [ ] `tech-stack.md` updated with actual tooling
- [ ] `architecture.md` updated with actual structure
- [ ] placeholder text removed from customized files
- [ ] generated skills match the detected stack
- [ ] slash commands and paths verified

---

## 📝 Example Setup Session

```text
User: Load ai-project-assist/SETUP.md and install this system into the current repo.

AI: I’ll make sure the repo has an `ai-project-assist/` folder first, then I’ll
inspect the repository and detect the stack before changing the template files.

[AI reads manifests, config files, test directories, and docs]

AI: I found a TypeScript Node backend with Express, Vitest, pnpm, and a React
frontend in apps/web. I also found GitHub Actions test commands.

AI: Which app should be treated as the primary context for /project?

User: apps/api.

AI: [customizes prompts, instructions, agents, and skills for that stack]

AI: Installation complete. /project is ready to use.
```

---

## 🔄 Keeping the Template Updated

When template improvements are introduced upstream:

1. Sync the generic changes.
2. Preserve target-repo customizations.
3. Re-run the verification checklist.

Recommended command:

```text
@ai-tooling-updater sync from owner/repo
```

---

**Version:** 2.1
**Last Updated:** 2026-04-02
**Source Repository:** [Set when you choose a sync source]
