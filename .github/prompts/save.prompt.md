---
agent: "agent"
description: "Saves current session progress to the active project file."
tools:
  - codebase
  - editFiles
---

Save the current session progress. Execute immediately.

## Steps

1. Identify the active project file in `ai-project-assist/projects/`. If none exists,
   respond: "No active project found. Use `/project` to start or resume one."

2. Append a new entry under `## 📝 Session Log`:

```markdown
### Session — [TODAY DATE]

**Phase:** [Current phase]

**Accomplished:**
- [What was done this session]

**Decisions Made:**
- [Key decisions, or "None"]

**Next Steps:**
- [What remains to be done]
```

3. Update `**Current Phase:**` in the project header if the phase changed.

4. If there are more than 6 session log entries, suggest running `/end` to
   close the session and start fresh context.

5. Confirm: "✅ Session saved to **[project filename]**."
