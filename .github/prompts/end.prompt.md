---
agent: "agent"
description: "Ends the current session — writes final log, generates a commit message, and optionally produces a PR description."
tools:
  - codebase
  - editFiles
---

End the current session. Execute immediately.

## Steps

1. Identify the active project file in `ai-project-assist/projects/`. If none found,
   respond: "No active project found."

2. Append a final session log entry under `## 📝 Session Log`:

```markdown
### Session — [TODAY DATE] *(closed)*

**Phase:** [Current phase]

**Accomplished:**
- [Summary of all work done this session]

**Status at Close:**
- [What is complete, what is still in progress]

**Next Steps (next session):**
- [What to pick up next time]
```

3. Update `**Current Phase:**` and `**Status:**` fields in the project header.

4. Output a commit message:

```
[TICKET-XXXX]: [brief description of work done this session]
```

5. Ask: "Would you like a PR description as well?"

   If yes, produce:

```markdown
## Summary
[One paragraph describing what this PR does]

## Changes
- [File or feature changed]

## Testing
- [ ] Tests pass
- [ ] Coverage target met
- [ ] No linting errors

## Notes
[Deployment notes, migration requirements, follow-up tickets]
```

6. Confirm: "✅ Session closed. Commit message is above."
