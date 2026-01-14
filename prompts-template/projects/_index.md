# Project Index

**Last Updated:** [To be set during setup]

---

## 📊 Statistics

- **Active Projects:** 0
- **Recently Completed:** 0
- **Total Archived:** 0

---

## 🟢 Active Projects

[No projects yet - projects will be added as work begins]

**To create your first project:**
```
Say: "new project: JIRA-123-brief-description"
```

---

## ✅ Recently Completed (Last 90 Days)

[No completed projects yet]

---

## 📦 Archived Projects

See `archive/` directory for projects completed/inactive for 90+ days.

**Archive Structure:**
- `archive/YYYY-QX/` - Projects archived in that quarter
- `archive/sessions/` - Overflow session logs from large projects

---

## 📝 Naming Convention

All project files follow this pattern:

```
JIRA-NUMBER-brief-description.md
```

**Examples:**
- `JIRA-1234-payment-webhooks.md`
- `JIRA-5678-grade-export-api.md`
- `DEVOPS-999-upgrade-postgres.md`

**Rules:**
- Use your actual Jira prefix (PROJ, JIRA, DEVOPS, etc.)
- Keep description brief (3-5 words)
- Use hyphens, not underscores or spaces
- Lowercase for description

---

## 🔍 Finding Projects

### By Status
- **Active:** This section (currently worked on)
- **Recent:** Recently Completed section (< 90 days old)
- **Archived:** `archive/` directory (> 90 days old)

### By Jira Number
```bash
# Search all projects
grep -r "JIRA-1234" prompts/projects/

# Search active only
grep "JIRA-1234" prompts/projects/JIRA-*.md

# Search archived
grep -r "JIRA-1234" prompts/projects/archive/
```

### By Topic
```bash
# Find projects about a topic
grep -r "payment" prompts/projects/*.md
```

---

## 📋 Project Lifecycle

1. **Creation** → File created in `projects/`
2. **Active Development** → Listed in "Active Projects"
3. **Completion** → Moved to "Recently Completed"
4. **Archival (90 days)** → Moved to `archive/YYYY-QX/`

See `project-lifecycle.md` for complete details.

---

## 🎯 Quick Reference

### Create New Project
```
Say: "new project: JIRA-123-feature-name"
```

### Load Project
```
Say: "continue JIRA-123" or "begin project"
```

### Save Progress
```
Say: "save session"
```

### End Session
```
Say: "end session"
```

---

**System Version:** 1.0  
**Template Source:** AI-LLM Assisted Development Template
