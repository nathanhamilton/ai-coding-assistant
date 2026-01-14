# Documentation System Template

**Version:** 1.0
**Created:** 2026-01-05
**Source:** AI-LLM Assisted Development Template

---

## 📦 What's Included

This template provides a complete documentation and project management system for your repository:

### Core System
- ✅ Project lifecycle management (creation → tracking → archival)
- ✅ Session logging and progress tracking
- ✅ Knowledge base for cross-project learnings
- ✅ 90-day archival policy with quarterly organization
- ✅ File size monitoring (9.5MB threshold)
- ✅ Emoji visual hierarchy for consistency

### GitHub Copilot Integration
- ✅ Always-available foundational standards (`.github/copilot-instructions.md`)
- ✅ Natural language triggers ("begin project", "save session")
- ✅ Task-specific AI agents (@test-agent, @docs-agent, @api-agent, @project-manager)
- ✅ VS Code shortcuts and snippets

### Structure
```
prompts-template/
├── SETUP.md                           # 👈 AI customization instructions
├── README.md                          # This file
├── base-context.md                    # Template - needs customization
├── architecture.md                    # Template - needs customization
├── standards.md                       # ✅ Ready to use
├── project-init-guide.md             # ✅ Ready to use
├── project-lifecycle.md              # ✅ Ready to use
├── emoji-guide.md                    # ✅ Ready to use
├── team-collaboration.md             # ✅ Ready to use
├── languages/
│   └── _template.md                  # Template for language-specific standards
├── projects/
│   ├── _index.md                     # Empty but structured
│   ├── _knowledge-base.md            # Empty but structured
│   └── archive/
│       ├── README.md                 # Archive documentation
│       └── QUARTER-SUMMARY-TEMPLATE.md
├── .github/
│   ├── copilot-instructions.md       # Needs language customization
│   └── agents/
│       ├── README.md                 # Agent system documentation
│       ├── project-manager-agent.md  # ✅ Ready to use
│       ├── test-agent.md             # Needs testing framework update
│       ├── docs-agent.md             # Needs minor customization
│       └── api-agent.md              # Needs framework customization
└── .vscode/
    ├── settings.json                 # ✅ Ready to use
    ├── copilot-chat.json            # ✅ Ready to use
    ├── documentation.code-snippets  # ✅ Ready to use
    └── README.md                     # VS Code docs
```

---

## 🚀 Quick Setup (5-10 minutes)

### Option 1: AI-Assisted Setup (Recommended)

1. **Copy template to your repo:**
   ```bash
   cp -r prompts-template /path/to/your-repo/prompts
   cp -r prompts-template/.github /path/to/your-repo/
   cp -r prompts-template/.vscode /path/to/your-repo/
   ```

2. **Load setup instructions:**
   ```
   In GitHub Copilot Chat, say:
   "Load prompts/SETUP.md and customize for [Python FastAPI / Node.js Express / etc.]"
   ```

3. **Answer AI questions:**
   - Repository name and purpose
   - Tech stack and versions
   - Key dependencies
   - Coding standards

4. **AI customizes these files:**
   - `prompts/base-context.md`
   - `prompts/architecture.md`
   - `prompts/languages/[language].md`
   - `.github/copilot-instructions.md`
   - `.github/agents/test-agent.md`
   - `.github/agents/api-agent.md`

5. **Start using:**
   ```
   Say: "begin project"
   ```

### Option 2: Manual Setup

1. **Copy template** (same as above)

2. **Customize these files manually:**
   - `prompts/base-context.md` - Add repo details, tech stack
   - `prompts/architecture.md` - Document architecture
   - `prompts/languages/` - Create language-specific guides
   - `.github/copilot-instructions.md` - Update code examples
   - `.github/agents/test-agent.md` - Update testing framework
   - `.github/agents/api-agent.md` - Update web framework

3. **See SETUP.md** for detailed instructions

---

## 📋 Files That Need Customization

| File | Required? | What to Update |
|------|-----------|----------------|
| `base-context.md` | ✏️ **Yes** | Repo name, tech stack, team info |
| `architecture.md` | ✏️ **Yes** | System architecture, patterns |
| `languages/*.md` | ✏️ **Yes** | Create for your languages |
| `copilot-instructions.md` | ✏️ **Yes** | Update code examples for your stack |
| `@test-agent` | ✏️ **Yes** | Update testing framework (RSpec→Pytest, etc.) |
| `@api-agent` | ✏️ **Yes** | Update web framework (Rails→FastAPI, etc.) |
| `@docs-agent` | ⚠️ Optional | Update code examples |
| All other files | ✅ **No** | Ready to use as-is |

---

## 🎯 What You Get

### For Developers
- 📝 **Structured project tracking** - Never lose context between sessions
- 🤖 **AI-assisted development** - Specialized agents for testing, docs, APIs
- 🔍 **Knowledge base** - Capture learnings across projects
- 📊 **Progress visibility** - Clear session logs and status tracking

### For Teams
- 📚 **Consistent documentation** - Same structure across all repos
- 🎨 **Visual consistency** - Emoji hierarchy for quick scanning
- 🔄 **Project lifecycle** - Automatic archival after 90 days
- 📈 **Historical tracking** - Quarterly summaries of work

### For AI Assistants
- 🧠 **Rich context** - Complete project history and architecture
- 🎭 **Task-specific personas** - Specialized agents for different work types
- 📐 **Coding standards** - Clear examples of good patterns
- 🔒 **Safety boundaries** - "Ask First" policy prevents mistakes

---

## 💡 Usage Examples

### Starting a New Project
```
User: "begin project"
AI: [Loads context, shows active projects]

User: "new project: TICKET-123-add-user-api"
AI: [Creates project file with structure]
```

### Using Specialized Agents
```
User: "@api-agent create user registration endpoint"
AI: [Creates endpoint with proper patterns, security, tests]

User: "@test-agent write tests for user registration"
AI: [Creates comprehensive test suite]

User: "@docs-agent document the user API"
AI: [Creates API documentation]
```

### Tracking Progress
```
User: "save session"
AI: [Updates project file with session log]

User: "end session"
AI: [Complete session summary, ready for commit]
```

---

## 📊 System Features

### Project Lifecycle
1. **Creation** - Natural language project creation
2. **Active Work** - Session logging with timestamps
3. **Completion** - Status tracking and summaries
4. **Archival** - Automatic after 90 days

### File Size Management
- **Warning at 7MB** - "File getting large"
- **Urgent at 9MB** - "Archive sessions soon"
- **Critical at 9.5MB** - "Must archive now"
- **Auto-archive** - Old sessions moved to `archive/sessions/`

### Knowledge Base
- Extract learnings before archival
- Pattern library grows over time
- Cross-project insights
- Searchable repository

### GitHub Agents
- **@project-manager** - Coordinates everything
- **@test-agent** - Writes comprehensive tests
- **@docs-agent** - Creates documentation
- **@api-agent** - Builds secure endpoints

---

## 🔄 Keeping Systems in Sync

This template evolves over time. To get updates:

1. **Check source repo** for template changes
2. **Review changelog** for what's new
3. **Selective updates** - Cherry-pick improvements you want
4. **Test before adopting** - Verify in one repo first

Template updates don't auto-propagate - pull updates manually.

---

## 🆘 Troubleshooting

### "begin project" doesn't load context
- Verify `.vscode/settings.json` exists and points to `.github/copilot-instructions.md`
- Check that `prompts/base-context.md` is customized (not template placeholders)
- Restart VS Code to reload Copilot settings

### Agents not working
- Verify `.github/agents/` directory exists
- Check agent files have proper frontmatter (name, description)
- Invoke with `@agent-name` not just "agent-name"

### File size warnings
- This is normal for long-running projects
- Archive old sessions to `projects/archive/sessions/`
- Keep recent 3 months in main file

---

## 📚 Additional Resources

### Documentation
- **SETUP.md** - AI-assisted customization guide
- **project-init-guide.md** - Complete AI instructions
- **project-lifecycle.md** - Archival rules and process
- **emoji-guide.md** - Visual hierarchy standards
- **.github/agents/README.md** - Agent system documentation

### External Resources
- [GitHub Agents Guide](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/)
- [GitHub Copilot Documentation](https://docs.github.com/copilot)

---

## 🎓 Philosophy

This system is designed around these principles:

1. **Context is King** - AI works best with rich, structured context
2. **Capture Everything** - Sessions logs prevent context loss
3. **Make it Searchable** - Markdown + git = searchable history
4. **Learn Over Time** - Knowledge base grows with each project
5. **Stay Organized** - Archival prevents overwhelming clutter
6. **Use Specialized Tools** - Right agent for each task type

---

## 📝 Feedback

This template was created from real project work. It will continue to evolve based on:
- Team feedback
- New Copilot features
- Better patterns discovered
- Pain points identified

Share improvements back to the source repo!

---

## ⚖️ License

This template is open for any project or organization. Customize freely for your team's needs.

---

**Questions?**
Check SETUP.md or ask in your team channel.

**Ready to start?**
```
1. Copy template to your repo
2. Say: "Load prompts/SETUP.md and customize for [your stack]"
3. Answer AI questions
4. Say: "begin project"
```

---

**Template Version:** 1.0
**Last Updated:** 2026-01-05
**Maintained by:** Your Development Team
