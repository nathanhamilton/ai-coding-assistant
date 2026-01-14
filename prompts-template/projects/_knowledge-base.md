# Knowledge Base

Cross-project learnings and reusable patterns discovered during development work.

---

## 📚 Purpose

This file captures:
- Reusable patterns discovered during project work
- Solutions to common problems
- Technical decisions that apply across projects
- Lessons learned from completed work

**Update this file:**
- When completing projects (extract key learnings before archival)
- When discovering new patterns worth sharing
- When solving tricky problems that others might face

---

## 🎯 How to Use

### Adding Entries

When archiving a project, extract key learnings:
1. Identify patterns worth reusing
2. Document solutions to non-obvious problems
3. Note technical decisions that worked well
4. Record what to avoid (anti-patterns)

### Format

```markdown
### Pattern: [Name]
**Context:** [When this applies]
**Solution:** [The pattern/approach]
**Example:** [Link to project or code snippet]
**Trade-offs:** [Pros/cons]
```

---

## 📖 Entries

[Knowledge base entries will be added as projects are completed]

**To add an entry:**
```markdown
### Pattern: [Descriptive Name]
**Context:** [Problem or situation]
**Solution:** [Approach or pattern]
**Example:** [Reference to project file or code]
**Trade-offs:** [Advantages and limitations]
**Related:** [Links to related patterns]
```

---

## 🔍 Finding Patterns

### By Category
- Search for "## Category:" headers (API, Testing, Security, etc.)
- Look for patterns tagged with relevant keywords

### By Problem
- Search for keywords in Context sections
- Look for patterns that solved similar issues

### By Project
- Check "Example:" fields for project references
- Find what patterns were used in specific work

---

## 🏷️ Categories

As patterns are added, they'll be organized into categories:

### 🌐 API Patterns
[Patterns for building APIs, handling requests, error responses]

### 🧪 Testing Patterns
[Patterns for writing tests, mocking, coverage strategies]

### 🔒 Security Patterns
[Authentication, authorization, data protection patterns]

### 🎨 Architecture Patterns
[Design patterns, code organization, separation of concerns]

### 🔧 DevOps Patterns
[Deployment, monitoring, infrastructure patterns]

### 🐛 Debugging Patterns
[Troubleshooting approaches, diagnostic techniques]

### 📊 Performance Patterns
[Optimization strategies, caching, scaling]

---

## 📝 Example Entry Format

```markdown
## 🌐 API Patterns

### Pattern: Service Object for Complex Operations
**Context:** Controller actions that need to coordinate multiple models, 
external API calls, and complex validation logic.

**Solution:** Extract business logic into a dedicated service object with:
- Single responsibility (one operation)
- Transaction wrapping for data consistency
- Custom error classes for domain-specific failures
- Clear interface (initialize with dependencies, call to execute)

**Example:** See JIRA-1234-payment-webhooks.md - WebhookService handles 
signature verification, payload processing, and async notifications.

**Trade-offs:**
- ✅ Testable in isolation
- ✅ Reusable across controllers
- ✅ Clear separation of concerns
- ⚠️ More files to maintain
- ⚠️ Can be over-engineered for simple operations

**When NOT to use:** Simple CRUD operations that only touch one model.

**Related:** See "Query Object Pattern" for read-heavy operations.
```

---

## 🔄 Maintenance

### Regular Review
- Review quarterly during retrospectives
- Remove outdated patterns
- Update examples if code changes
- Consolidate duplicate entries

### Quality Guidelines
- Be specific (not "write good tests" but "use let blocks with FactoryBot")
- Include real examples from projects
- Document trade-offs honestly
- Link to actual code or project files

---

**Last Updated:** [To be set during setup]  
**Entry Count:** 0  
**Template Source:** AI-LLM Assisted Development Template
