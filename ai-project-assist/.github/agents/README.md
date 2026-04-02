# GitHub Copilot Agents

This directory contains specialized agent personas for task-specific work using GitHub Copilot's custom agents feature.

## Overview

These agents are meant to be copied into different repositories. The template versions stay generic, and setup should adapt the relevant ones to the detected stack in the target repo.

Use the project-manager for lifecycle orchestration. Use specialist agents for focused execution when their domain applies.

## Quick Start

Type `/project` or `/begin-project` in Copilot Chat to start the orchestrated project workflow.

---

## Orchestrator

### @project-manager
**Role:** Full project lifecycle orchestrator
**File:** [project-manager-agent.md](./project-manager-agent.md)

Coordinates:
- contract definition
- design review when UI is involved
- engineering handoff
- test, security, debt, and docs review
- session tracking and close-out

---

## Specialist Agents

### @contract-agent
Defines project scope one question at a time before implementation begins.

### @design-agent
Defines UI/UX specs before implementation. Setup should adapt it to the repo's actual UI stack and styling conventions.

### @senior-engineer
Implements from an agreed contract. Setup should fill stack-specific placeholders such as language, framework, test command, package manager, and linter.

### @test-agent
Writes and reviews tests. Setup should adapt it to the repo's actual test runner, folder layout, helpers, and mocking approach.

### @docs-agent
Documents APIs, services, architecture decisions, and developer workflows. Setup should adapt it to the repo's real docs locations and examples.

### @api-agent
Handles backend or API endpoint work. Setup should adapt it to the repo's actual backend framework or keep it generic if the repo does not expose an API.

### @ai-tooling-updater
Syncs generic AI tooling improvements from a user-specified source repo while preserving target-repo customizations.

### @debug-agent, @review-agent, @migration-agent, @security-agent, @tech-debt-agent
Cross-cutting specialist agents used during implementation and review.

---

## Stack Adaptation Rule

After this template is copied into another repo, setup should:

1. inspect the target repo first
2. detect the language, framework, package manager, test runner, and UI stack
3. adapt only the relevant agent files
4. avoid leaving unrelated framework examples behind

This directory should never assume Rails, RSpec, or any other stack by default.

---

## Slash Commands

| Command | File | Purpose |
|---------|------|---------|
| `/project` | `prompts/project.prompt.md` | Start or resume a project |
| `/begin-project` | `prompts/begin-project.prompt.md` | Alias for `/project` |
| `/save` | `prompts/save.prompt.md` | Save session progress |
| `/end` | `prompts/end.prompt.md` | Close session and summarize |
| `/review` | `prompts/review.prompt.md` | Run a standards-based review |

---

## Example Usage

```text
User: /project
@project-manager: [loads context and starts lifecycle]

User: @api-agent add a new endpoint to the current service
@api-agent: [uses the repo's actual backend conventions]

User: @test-agent add coverage for the new behavior
@test-agent: [uses the repo's actual test runner and helpers]
```

---

## Creating New Agents

When adding a new agent:

1. create the file in `.github/agents/`
2. include valid frontmatter with a strong `description`
3. keep the base instructions generic unless the repo itself is the only intended target
4. update this README if the agent is meant to be part of the shared template

---

## Best Practices

- Use specific descriptions so Copilot can discover the right agent.
- Put stack-specific detail in repo setup, not in the generic template by default.
- Prefer clear boundaries over long persona prose.
- Use real commands and real paths once the target repo has been customized.
