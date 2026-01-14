# GitHub Copilot Agents

This directory contains specialized agent personas for task-specific work using GitHub Copilot's `agents.md` feature.

## Overview

Agents provide **task-specific expertise** that complements the project documentation system in `/prompts`. Instead of one general assistant, you have a team of specialists.

## Available Agents

### @project-manager
**Role:** Project lifecycle management  
**File:** [project-manager-agent.md](./project-manager-agent.md)

**Use for:**
- Loading project context ("begin project")
- Creating new projects
- Saving session progress
- Ending sessions with summaries
- Monitoring file sizes
- Archiving completed projects

**Example:**
```
User: "begin project"
@project-manager: [Loads context, lists active projects]
```

---

### @test-agent
**Role:** Test writing specialist  
**File:** [test-agent.md](./test-agent.md)

**Use for:**
- Writing RSpec tests (models, services, controllers, features)
- Achieving >90% test coverage
- Using FactoryBot patterns
- Testing happy paths and edge cases

**Example:**
```
User: "@test-agent write comprehensive tests for EnrollmentService"
@test-agent: [Creates spec file with 12+ test cases]
```

---

### @docs-agent
**Role:** Technical documentation writer  
**File:** [docs-agent.md](./docs-agent.md)

**Use for:**
- API endpoint documentation
- Service object guides
- Architecture explanations
- How-to guides for developers

**Example:**
```
User: "@docs-agent document the Enrollments API"
@docs-agent: [Creates comprehensive API docs with examples]
```

---

### @api-agent
**Role:** API endpoint builder  
**File:** [api-agent.md](./api-agent.md)

**Use for:**
- Creating RESTful Rails endpoints
- Implementing authentication/authorization
- Building secure controllers
- Following Rails API patterns

**Example:**
```
User: "@api-agent create webhook handler for PaymentProvider"
@api-agent: [Creates controller, service, routes with security]
```

## How Agents Work Together

### Typical Workflow

```
1. Load Context
   User: "begin project"
   @project-manager: [Loads /prompts context, shows active projects]

2. Select/Create Project
   User: "continue JIRA-1234"
   @project-manager: [Loads project file, ready for work]

3. Execute Tasks
   User: "@api-agent add enrollment endpoint"
   @api-agent: [Creates endpoint with service object]
   
   User: "@test-agent test the new endpoint"
   @test-agent: [Creates request specs]
   
   User: "@docs-agent document the endpoint"
   @docs-agent: [Creates API documentation]

4. Track Progress
   User: "save session"
   @project-manager: [Updates project file with what was done]
```

### Division of Responsibilities

| Aspect | @project-manager | Task Agents (@test/@docs/@api) |
|--------|-----------------|--------------------------------|
| **Scope** | Project-level context & tracking | Task-specific execution |
| **Context** | Loads `/prompts` system | Uses `.github/copilot-instructions.md` |
| **Focus** | What, Why, When | How (implementation) |
| **Duration** | Entire project lifecycle | Single task/feature |
| **Invocation** | "begin project", "save session" | "@agent-name do task" |

## Relationship with Documentation System

### `.github/copilot-instructions.md`
**Always loaded** by Copilot - provides foundational Ruby/Rails standards

- Coding conventions (services, controllers, models)
- Security best practices
- Testing standards
- "Ask First" policy
- Natural language triggers

### `/prompts` Directory
**Loaded on demand** via @project-manager - provides project context

- `base-context.md` - Project overview, architecture
- `standards.md` - Detailed coding standards
- `projects/` - Active project files with session logs
- `languages/` - Language-specific guides

### Agent Files (this directory)
**Invoked by `@agent-name`** - task-specific personas

- Each agent has specialized knowledge
- Agents use copilot-instructions.md for standards
- Agents coordinate with @project-manager for tracking

## Creating New Agents

To add a new agent:

1. **Create agent file:** `.github/agents/new-agent.md`
2. **Add frontmatter:**
   ```yaml
   ---
   name: new_agent
   description: One-sentence description
   ---
   ```
3. **Include sections:**
   - Your Role
   - Project Knowledge
   - Commands You Can Use
   - Patterns/Examples
   - Boundaries (Always/Ask/Never)
4. **Update this README** with agent description
5. **Update copilot-instructions.md** to mention the new agent

### Agent Template Structure

```markdown
---
name: agent_name
description: Brief description of what this agent does
---

You are an expert [role] for this project.

## Your Role
- What you specialize in
- What you create/modify
- What standards you follow

## Project Knowledge
- Tech stack
- File structure
- Key patterns

## Commands You Can Use
- Command 1: `description`
- Command 2: `description`

## Patterns
[Code examples showing good patterns]

## Boundaries
- ✅ **Always do:** [safe operations]
- ⚠️ **Ask first:** [needs approval]
- 🚫 **Never do:** [dangerous operations]
```

## Agent Best Practices

Based on analyzing 2,500+ agent files:

### ✅ What Works
- **Specific persona** - "Expert test engineer" not "helpful assistant"
- **Executable commands** - Real commands with flags, not generic
- **Code examples** - Show patterns, don't just describe
- **Clear boundaries** - Always/Ask/Never keeps agents safe
- **Tech stack details** - "Ruby 3.2.2, Rails" not "Ruby project"

### ❌ What Fails
- Vague descriptions ("You help with code")
- Abstract instructions ("Write good tests")
- No examples of expected output
- Missing boundaries (agent does dangerous things)
- Generic "helpful assistant" persona

## Testing Your Agents

1. **Invoke the agent:** `@agent-name do specific task`
2. **Check behavior:** Does it follow patterns correctly?
3. **Test boundaries:** Try to make it do something it shouldn't
4. **Refine instructions:** Update agent file based on results

## Resources

- [GitHub Blog: How to Write Great agents.md](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)
- [GitHub Copilot Documentation](https://docs.github.com/copilot)
- Main project docs: `/prompts` directory

---

**Last Updated:** 2026-01-05  
**System Version:** 1.0
