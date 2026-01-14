# Documentation System Setup

This file instructs AI on how to customize the documentation system for a new repository.

---

**For AI Assistants:** When a user says "Load prompts-template/SETUP.md and customize for [language/framework]", follow these instructions to set up the documentation system for their specific repository.

---

## 🎯 Purpose

This template provides a complete documentation and project management system that can be customized for any repository in the ecosystem. It includes:

- Project lifecycle management (creation → tracking → archival)
- Session logging and progress tracking
- Knowledge base for cross-project learnings
- GitHub Agents for task-specific work
- VS Code integration with shortcuts

## 📋 Setup Process

### Step 1: Understand the Repository

Ask the user these questions:

1. **Repository name and purpose?**
   - Example: "Analytics API - Data analytics service for reporting"

2. **Primary tech stack and versions?**
   - Example: "Python 3.11, FastAPI 0.104, PostgreSQL 15, Redis"

3. **Key dependencies/frameworks?**
   - Example: "SQLAlchemy, Celery, Pytest, Alembic"

4. **Main programming languages used?**
   - Example: "Python (primary), JavaScript (frontend), SQL"

5. **Existing coding standards or patterns?**
   - Example: "Repository pattern, service layer, API versioning"

6. **Team size and collaboration style?**
   - Example: "5 developers, async work, PR reviews required"

### Step 2: Customize Repository-Specific Files

#### 2.1 Update `prompts/base-context.md`

Replace placeholder content with actual repository information:

```markdown
# [Repository Name]

**Repository:** [org/repo-name]  
**Purpose:** [Brief description]  
**Team:** [Team name/size]  
**Last Updated:** [Current date]

## 🎯 Project Overview

[Detailed description of what this application does]

### Key Features
- Feature 1
- Feature 2
- Feature 3

## 🏗️ Technical Foundation

### Core Technologies
- **[Language]:** [Version] - [Usage]
- **[Framework]:** [Version] - [Usage]
- **Database:** [Type & Version]
- **Cache:** [If applicable]
- **Background Jobs:** [If applicable]

### Architecture Patterns
- Pattern 1: [Description]
- Pattern 2: [Description]

[Continue with repository-specific details...]
```

#### 2.2 Update `prompts/architecture.md`

Document the actual architecture:

```markdown
# Architecture Documentation

## 🏗️ System Architecture

[Describe the actual architecture]

### Directory Structure

```
[Actual directory structure]
```

### Key Architectural Patterns

[Document actual patterns used in this repo]

### Data Flow

[How data flows through the system]
```

#### 2.3 Create/Update Language Files in `prompts/languages/`

Based on the tech stack, create language-specific guides:

**For Python projects:**
- Rename `_template.md` to `python.md`
- Add Python-specific standards (PEP 8, type hints, etc.)

**For Node.js projects:**
- Create `javascript.md` or `typescript.md`
- Add Node/JS-specific standards

**For Rails projects:**
- Create `ruby.md` and `rails.md`
- Add Rails conventions

**Example Python standards:**
```markdown
# Python Coding Standards

## Style Guide
- Follow PEP 8
- Use type hints for all public functions
- Max line length: 120 characters

## Code Organization
- **models/** - SQLAlchemy models
- **services/** - Business logic
- **api/routes/** - FastAPI endpoints
[...]
```

### Step 3: Update `.github/copilot-instructions.md`

Customize the foundational standards for the repo's language/framework:

1. **Update "About This Repository" section** with actual details
2. **Update "Key Technologies" section** with actual stack
3. **Replace Ruby/Rails examples** with language-appropriate examples
4. **Keep the structure** (Ask First policy, Project Work Mode, Agents)

**Example for Python/FastAPI:**
```markdown
### Service Pattern
```python
# services/user_service.py
from typing import Optional
from models.user import User
from database import db_session

class UserService:
    def __init__(self, user_id: int):
        self.user_id = user_id
    
    async def get_user(self) -> Optional[User]:
        return await db_session.get(User, self.user_id)
```
```

### Step 4: Customize GitHub Agents

Update agent files to match the tech stack:

#### 4.1 Update `@test-agent`
- Change testing framework examples (RSpec → Pytest, Jest, etc.)
- Update test file paths
- Update test commands

#### 4.2 Update `@api-agent`
- Change framework examples (Rails → FastAPI, Express, etc.)
- Update endpoint patterns
- Update security practices for the framework

#### 4.3 Update `@docs-agent`
- Keep structure, update code examples for language

#### 4.4 Keep `@project-manager`
- No changes needed (language-agnostic)

### Step 5: Initialize Project Index

Set up `prompts/projects/_index.md`:

```markdown
# Project Index

**Last Updated:** [Current date]

## 📊 Statistics
- **Active Projects:** 0
- **Recently Completed:** 0
- **Total Archived:** 0

## 🟢 Active Projects

[None yet - projects will be added as work begins]

## ✅ Recently Completed (Last 90 Days)

[None yet]

## 📦 Archived Projects

See `archive/` directory for projects older than 90 days.

---

**Naming Convention:** `JIRA-NUMBER-brief-description.md`
```

### Step 6: Verify VS Code Integration

Ensure `.vscode/` files reference the correct paths:

1. **settings.json** - Points to `.github/copilot-instructions.md` ✓
2. **copilot-chat.json** - Slash commands work ✓
3. **documentation.code-snippets** - Ready to use ✓

No changes needed unless custom snippets are required.

## 🔍 Files That Need Customization

| File | Status | Action |
|------|--------|--------|
| `prompts/base-context.md` | ✏️ **Customize** | Update with repo details |
| `prompts/architecture.md` | ✏️ **Customize** | Document actual architecture |
| `prompts/standards.md` | ✅ **Use as-is** | Or customize if needed |
| `prompts/project-init-guide.md` | ✅ **Use as-is** | Language-agnostic |
| `prompts/project-lifecycle.md` | ✅ **Use as-is** | Language-agnostic |
| `prompts/emoji-guide.md` | ✅ **Use as-is** | Universal visual standards |
| `prompts/team-collaboration.md` | ✅ **Use as-is** | Or customize for team |
| `prompts/languages/*.md` | ✏️ **Create** | Add language-specific guides |
| `.github/copilot-instructions.md` | ✏️ **Customize** | Update for tech stack |
| `.github/agents/project-manager-agent.md` | ✅ **Use as-is** | Language-agnostic |
| `.github/agents/test-agent.md` | ✏️ **Customize** | Update testing framework |
| `.github/agents/api-agent.md` | ✏️ **Customize** | Update framework examples |
| `.github/agents/docs-agent.md` | ⚠️ **Minor updates** | Update code examples |
| `.vscode/*` | ✅ **Use as-is** | Ready to use |

## 🚀 Quick Start Commands

After customization, user can immediately:

```bash
# Start first project
User: "begin project"
AI: [Loads customized context]

# Create project
User: "new project: JIRA-123-feature-name"
AI: [Creates project file]

# Use specialized agents
User: "@test-agent write tests for UserService"
AI: [Writes tests using correct framework]
```

## ✅ Setup Checklist

After completing customization, verify:

- [ ] `base-context.md` has actual repo name and tech stack
- [ ] `architecture.md` documents actual architecture
- [ ] Language-specific files created in `languages/`
- [ ] `.github/copilot-instructions.md` updated with correct examples
- [ ] Test agent updated for actual testing framework
- [ ] API agent updated for actual web framework
- [ ] All file paths verified and correct
- [ ] VS Code integration tested ("begin project" works)

## 📝 Example Customization Session

```
User: "Load prompts-template/SETUP.md and customize for Python FastAPI project"

AI: I'll customize the documentation system for your FastAPI project.

    First, let me gather some details:
    
    1. What's the repository name and purpose?
    2. Tech stack versions? (Python, FastAPI, database, etc.)
    3. Key dependencies?
    4. Existing coding standards?
    
    [User provides details]
    
    Great! I'll customize:
    ✓ base-context.md - Add repo details and FastAPI stack
    ✓ architecture.md - Document API architecture
    ✓ languages/python.md - Create Python standards
    ✓ copilot-instructions.md - Update with Python/FastAPI examples
    ✓ @test-agent - Update for Pytest
    ✓ @api-agent - Update for FastAPI patterns
    
    [Performs customization]
    
    ✅ Setup complete! 
    
    Try: "begin project" to start your first project.
```

## 🔄 Keeping Template Updated

When improving the system:

1. **Update template in source repo**
2. **Document changes** in template CHANGELOG
3. **Communicate to team** about available updates
4. **Cherry-pick improvements** to existing repos as needed

Template updates don't auto-propagate - teams pull updates manually.

## 📚 Resources

- **Emoji Guide:** `prompts/emoji-guide.md` - Visual hierarchy standards
- **Project Lifecycle:** `prompts/project-lifecycle.md` - Archival rules
- **Agent Best Practices:** `.github/agents/README.md` - How to use agents
- **GitHub Agents Guide:** https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/

---

**Version:** 1.0  
**Last Updated:** 2026-01-05  
**Source Repository:** AI-LLM Assisted Development Template
