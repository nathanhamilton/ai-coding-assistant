# [Repository Name]

**Repository:** [org/repo-name]  
**Purpose:** [One-line description of what this application does]  
**Team:** [Team name/size]  
**Last Updated:** [YYYY-MM-DD]

---

## 🎯 Project Overview

[Replace with 2-3 paragraphs describing:
- What problem this application solves
- Who uses it (internal teams, customers, etc.)
- Key business value it provides]

### Key Features

- **Feature 1:** [Description]
- **Feature 2:** [Description]
- **Feature 3:** [Description]
- **Feature 4:** [Description]

### Critical Workflows

1. **Workflow 1:** [Brief description]
2. **Workflow 2:** [Brief description]
3. **Workflow 3:** [Brief description]

---

## 🏗️ Technical Foundation

See [tech-stack.md](tech-stack.md) for the full, authoritative list of
technologies, dependencies, and versions. Populate that file during setup
and reference it here rather than duplicating content.

---

## 📁 Repository Structure

```
[repo-name]/
├── [dir1]/              # Description
│   ├── [subdir]/       # Description
│   └── [file.ext]      # Description
├── [dir2]/              # Description
├── [config-dir]/        # Configuration
├── [test-dir]/          # Tests
└── README.md           # Project documentation
```

### Important Directories

- **`[dir1]/`** - [What this directory contains and its purpose]
- **`[dir2]/`** - [What this directory contains and its purpose]
- **`[config-dir]/`** - [Configuration files]
- **`[test-dir]/`** - [Test suite]

---

## 🎨 Architecture Patterns

### Pattern 1: [Name]

[Brief description of the pattern and when to use it]

**Example:**
```[language]
# Code example showing the pattern
```

### Pattern 2: [Name]

[Brief description of the pattern and when to use it]

**Example:**
```[language]
# Code example showing the pattern
```

### Pattern 3: [Name]

[Brief description of the pattern and when to use it]

---

## 🔒 Security Considerations

### Authentication & Authorization

- **Authentication Method:** [How users/services authenticate]
- **Authorization Pattern:** [RBAC, policies, etc.]
- **Token Management:** [JWT, session-based, etc.]

### Security Best Practices

- [Practice 1]
- [Practice 2]
- [Practice 3]

### Sensitive Data

- **Secrets Management:** [Where secrets are stored - ENV vars, vault, etc.]
- **PII Handling:** [How personally identifiable information is handled]
- **Compliance:** [GDPR, FERPA, SOC2, etc. if applicable]

---

## 🧪 Testing Standards

### Test Types

- **Unit Tests:** [Coverage target, what to test]
- **Integration Tests:** [What they cover]
- **Feature/E2E Tests:** [If applicable]

### Running Tests

```bash
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

- **Branch naming:** `[TICKET-NUMBER]-description` or the repo's documented pattern
- **Commit format:** `[TICKET-NUMBER]: Description` or the repo's documented pattern
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
Say: "new project: TICKET-123-feature-name"

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

## AI Tooling Source

The `@ai-tooling-updater` agent syncs AI agents, skills, and templates from a
source repository.

During a sync, the repo supplied to the updater is the source of truth for
that invocation.

If no repo is supplied, the updater should ask for one before proceeding.

To sync: `@ai-tooling-updater sync from [owner]/[repo]`

---

**Version:** 1.0  
**Last Updated:** [YYYY-MM-DD]  
**Maintained by:** [Team name]
