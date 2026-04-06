# Archive Directory

This directory contains projects that have been completed or inactive for 90+ days.

---

## 📁 Structure

```
archive/
├── 2026-Q1/                    # Q1 2026 archived projects
│   ├── PROJECT-123-name.md
│   └── QUARTER-SUMMARY.md      # Summary of all Q1 projects
├── 2025-Q4/                    # Q4 2025 archived projects
│   ├── PROJECT-456-name.md
│   └── QUARTER-SUMMARY.md
└── sessions/                   # Overflow session logs
    ├── PROJECT-789-2025-10.md  # Sessions from Oct 2025
    └── PROJECT-789-2025-11.md  # Sessions from Nov 2025
```

---

## 🗂️ Quarterly Organization

Projects are archived into quarterly folders based on completion/last activity date:

- **Q1:** January - March
- **Q2:** April - June
- **Q3:** July - September
- **Q4:** October - December

---

## 📊 Quarter Summaries

Each quarter has a `QUARTER-SUMMARY.md` file documenting:
- All projects archived that quarter
- Key outcomes and learnings
- Statistics (lines changed, features shipped)
- Links to individual project files

See `QUARTER-SUMMARY-TEMPLATE.md` for the standard format.

---

## 🔍 Finding Archived Projects

### By Identifier
```bash
grep -r "TICKET-1234" ai-project-assist/projects/archive/
```

### By Quarter
```bash
ls ai-project-assist/projects/archive/2025-Q4/
```

### By Topic
```bash
grep -r "payment" ai-project-assist/projects/archive/
```

---

## 📅 Archival Rules

Projects are archived when:

1. **Completed projects** older than 90 days
2. **Inactive projects** with no updates for 90+ days

Before archiving:
1. Extract key learnings to `_knowledge-base.md`
2. Create quarter summary if it doesn't exist
3. Move project file to appropriate quarter folder
4. Update `_index.md` (remove from active, add to archived)

See `project-lifecycle.md` for complete archival process.

---

## 💾 Session Overflow

Large project files (approaching 9.5MB) have their older sessions archived to `sessions/`:

**Naming:** `PROJECT-NUMBER-YYYY-MM.md`

**Contains:** Sessions from that project for that month

**Example:**
- Main: `TICKET-1234-payment-webhooks.md` (recent 3 months)
- Archive: `sessions/TICKET-1234-2025-10.md` (October sessions)
- Archive: `sessions/TICKET-1234-2025-11.md` (November sessions)

---

## 🔄 Accessing Archived Projects

Archived projects remain fully searchable and readable. They're just organized separately to keep the main `projects/` directory focused on active work.

**To reference an archived project:**
```markdown
See archived project: [TICKET-1234](archive/2025-Q4/TICKET-1234-payment-webhooks.md)
```

---

## 📈 Archive Statistics

Archive statistics are tracked in quarterly summaries:
- Total projects archived
- Total lines of code changed
- Features shipped
- Technologies used

---

**Last Updated:** [To be set during setup]  
**Template Source:** AI Tooling Template System
