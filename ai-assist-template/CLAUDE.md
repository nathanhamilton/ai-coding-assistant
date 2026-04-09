# AI Project Assist — Claude Code Instructions

@.github/copilot-instructions.md

---

## Using This System in Claude Code

All shared instructions, working rules, and source-of-truth hierarchy are
defined in \`.github/copilot-instructions.md\` (imported above).

### Slash Commands

The project lifecycle prompts are available as slash commands via \`.claude/commands/\`:

| Command | What it does |
|---|---|
| \`/project\` | Start or resume a project (full lifecycle) |
| \`/begin-project\` | Alias for \`/project\` |
| \`/save\` | Save session progress to the active project file |
| \`/end\` | End session — final log, commit message, PR description |
| \`/review\` | Code review against project standards |

### Skills

Skills live in \`.github/skills/\`. Reference them by name when relevant:
- \`implementation-pipeline\` — end-to-end workflow for scoped changes

### Context Files

\`\`\`
ai-project-assist/base-context.md    ← what this repo is
ai-project-assist/tech-stack.md      ← tooling layer
ai-project-assist/architecture.md    ← structure and patterns
ai-project-assist/standards.md       ← engineering conventions
ai-project-assist/projects/          ← active project tracking
\`\`\`

---

## Unrecognised AI Tool Detection

If you are reading this file from an AI tool that is not VS Code/Copilot,
Claude Code, Cursor, or Conductor — no native config exists for your tool yet.

When this situation arises, notify the user:

> "I don't see a configuration for your AI tool in this repo. Would you like
> me to generate one? I'll create the appropriate entrypoint files so this
> system works natively with [tool name]."
