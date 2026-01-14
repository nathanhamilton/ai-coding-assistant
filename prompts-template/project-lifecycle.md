# Project Lifecycle & Archive Management

**How projects flow from creation to archival, keeping the system maintainable over time.**

---

## 🎯 Core Principle

**One Jira ticket = One project file**

Whether it's a bug fix, feature, or enhancement - each Jira ticket gets its own project markdown file.

---

## 📁 File Structure

```
prompts/projects/
├── _index.md                    # Master index (auto-updated)
├── _knowledge-base.md          # Cross-project learnings
├── TEMPLATE.md                 # Template for new projects
├── project.md                  # Universal entry point
│
├── JIRA-1234-feature-implementation.md      # Active project
├── JIRA-1235-csv-export-feature.md       # Active project
├── JIRA-1236-dashboard-performance.md    # Active project
│
└── archive/
    ├── 2025-Q4/
    │   ├── JIRA-1100-student-onboarding.md
    │   ├── JIRA-1101-auth-update.md
    │   └── _quarter-summary.md
    ├── 2025-Q3/
    │   ├── JIRA-1050-grade-export.md
    │   └── _quarter-summary.md
    └── sessions/                           # Overflow sessions
        ├── JIRA-1234-sessions-2025-Q4.md
        └── JIRA-1235-sessions-2025-Q3.md
```

---

## 🔄 Project Lifecycle

### Stage 1: Creation

**When**: Starting work on a new Jira ticket

**Command**:
```
Load prompts/projects/project.md
New: JIRA-1234-short-description
```

**Result**: Creates `JIRA-1234-short-description.md` in `prompts/projects/`

**Naming Convention**:
- Format: `JIRA-NUMBER-brief-description.md`
- Example: `JIRA-1234-feature-implementation.md`
- Keep description short (3-5 words max)
- Use lowercase with hyphens

---

### Stage 2: Active Development

**Status**: File lives in `prompts/projects/` (root folder)

**Characteristics**:
- Work is ongoing
- Regular session updates
- Decisions being made
- File actively referenced

**Maintenance**:
- AI monitors file size during sessions
- Warns at 7MB: "Approaching size limit, consider archiving old sessions"
- Auto-archives sessions at 9.5MB

---

### Stage 3: Completion

**When**: Jira ticket marked complete/deployed

**Actions**:
1. Mark project status as "Completed"
2. Add completion date
3. Extract key learnings to knowledge base
4. Update _index.md (moved to completed section)

**File stays in root folder for 90 days** (for easy reference)

---

### Stage 4: Archival

**Automatic archival after:**
- ✅ 90 days since project completion
- ✅ 90 days since last session (if abandoned)
- ✅ Manual archival (if team decides)

**Process**:
1. AI detects project eligible for archival
2. Prompts: "Project JIRA-1234 completed 90 days ago. Archive?"
3. Moves to `archive/YYYY-QQ/`
4. Updates _index.md with archive location
5. Extracts any remaining learnings to knowledge base

---

## 📊 File Size Management

### Session Archival (9.5MB Threshold)

When a project file approaches 9.5MB:

**What happens:**
1. Keep most recent 10-15 sessions in main file
2. Move older sessions to `archive/sessions/[project]-sessions-[quarter].md`
3. Add link in main file to archived sessions

**Updated project file structure:**
```markdown
## 📝 Session Log

> **File Size**: 8.2MB / 9.5MB threshold
> **Sessions**: 45 total (15 shown, 30 archived)
> **Archived Sessions**: [archive/sessions/JIRA-1234-sessions-2025-Q3.md](../archive/sessions/JIRA-1234-sessions-2025-Q3.md)

### Session: 2025-12-30 (Recent)
[Current sessions only]
```

### Why 9.5MB?

- GitHub limit: 20MB per file
- 9.5MB gives 50% safety buffer
- Allows for future growth
- Triggers before becoming a problem

---

## 📋 Index Management

### _index.md Structure

```markdown
# Project Index

## Active Projects (Last 90 Days)

| Project | Jira | Status | Started | Last Updated |
|---------|------|--------|---------|--------------|
| Feature Implementation | JIRA-1234 | In Progress (60%) | 2025-12-15 | 2025-12-30 |
| CSV Export Feature | JIRA-1235 | Completed | 2025-12-01 | 2025-12-20 |

## Recently Completed (Last 90 Days)

| Project | Jira | Completed | Summary |
|---------|------|-----------|---------|
| Dashboard Performance | JIRA-1236 | 2025-11-15 | Reduced load time by 40% |

## Archived (90+ Days Old)

See archive folders by quarter:
- [2025-Q4](archive/2025-Q4/_quarter-summary.md) - 12 projects
- [2025-Q3](archive/2025-Q3/_quarter-summary.md) - 8 projects
- [2025-Q2](archive/2025-Q2/_quarter-summary.md) - 10 projects
```

**Index automatically updated by AI** when:
- New project created
- Project status changes
- Project completed
- Project archived

---

## 🗄️ Archive Organization

### Quarterly Archives

```
archive/
├── 2025-Q4/
│   ├── JIRA-1200-feature-a.md
│   ├── JIRA-1201-feature-b.md
│   ├── JIRA-1202-bug-fix.md
│   └── _quarter-summary.md          # Overview of Q4 work
├── 2025-Q3/
│   └── ...
└── sessions/
    ├── JIRA-1234-sessions-2025-Q4.md
    └── JIRA-1235-sessions-2025-Q3.md
```

### Quarter Summary File

Each quarter gets a summary for quick reference:

```markdown
# 2025-Q4 Archive Summary

**Period**: October 1 - December 31, 2025  
**Projects**: 12 completed  
**Key Achievements**:
- Payment system overhaul (JIRA-1200)
- Dashboard performance improvements (JIRA-1236)
- Export features (JIRA-1235, JIRA-1240)

## Projects in This Archive

| Jira | Title | Completed | Key Learning |
|------|-------|-----------|--------------|
| JIRA-1200 | Payment Overhaul | 2025-10-15 | Service objects for complex workflows |
| JIRA-1201 | CSV Export | 2025-10-20 | Background jobs for large exports |
| ... | ... | ... | ... |

## Major Patterns Discovered

- [Link to KB entries added this quarter]
```

---

## 🔍 Finding Archived Projects

### By Jira Number

Use VS Code search (Cmd/Ctrl + Shift + F):
```
JIRA-1234
```

Searches across all files including archives.

### By Topic/Keywords

Use grep_search or semantic_search:
```
Search for: payment webhook integration
```

### By Quarter

Navigate to `archive/YYYY-QQ/_quarter-summary.md` for overview.

---

## 🤖 AI Automation

The AI assistant automatically handles:

### File Size Monitoring
- Checks size during each session save
- Warns at 7MB
- Suggests archiving at 9MB
- Auto-archives sessions at 9.5MB

### Archival Eligibility
- Tracks completion dates
- Tracks last activity dates
- Prompts for archival at 90 days

### Index Updates
- Adds new projects
- Updates status changes
- Moves to completed section
- Links to archived projects

### Knowledge Base Extraction
- Prompts to extract learnings before archival
- Suggests patterns discovered
- Links archived project in KB entries

---

## 📝 Manual Archive Process

If you need to manually archive a project:

**Command**:
```
Archive project: JIRA-1234
```

**AI will**:
1. Confirm the archival
2. Extract learnings to knowledge base
3. Move file to appropriate quarter folder
4. Update _index.md
5. Add entry to quarter summary
6. Confirm completion

---

## 🎯 Best Practices

### During Development

- ✅ Use clear Jira-based naming
- ✅ Regular session saves (don't let context build up)
- ✅ Extract learnings as you go
- ✅ Mark completion status when done

### Before Archival

- ✅ Ensure key decisions documented
- ✅ Verify learnings extracted to KB
- ✅ Check if patterns should be shared with team
- ✅ Update final status and summary

### Archive Hygiene

- ✅ Review archives quarterly
- ✅ Update quarter summaries
- ✅ Consolidate redundant learnings in KB
- ✅ Consider deleting truly trivial fixes (with team agreement)

---

## ⚠️ Warning Signs

**Action needed if:**

- 🚨 Project file > 10MB (immediate session archival needed)
- ⚠️ 20+ active projects in root folder (archive old ones)
- ⚠️ Archive folders > 2 years old (consider pruning or compressing)
- ⚠️ Quarter summary missing (create it for navigation)

---

## 🔗 Related Documentation

- [Base Context](base-context.md) - Project overview
- [Team Collaboration](team-collaboration.md) - Git workflow
- [Project Template](projects/TEMPLATE.md) - New project structure
- [Knowledge Base](projects/_knowledge-base.md) - Extracted learnings

---

**Last Updated**: 2025-12-30  
**Maintainer**: Development Team

_This lifecycle keeps the system maintainable as it grows. Archive aggressively to keep active work manageable._
