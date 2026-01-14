# Template Quick Reference

**For rapid deployment to new repositories**

---

## 🚀 30-Second Setup

```bash
# In your new repo
cp -r /path/to/prompts-template prompts
cp -r /path/to/prompts-template/.github .
cp -r /path/to/prompts-template/.vscode .

# Then in VS Code
"Load prompts/SETUP.md and customize for Python FastAPI"
# (or your stack)
```

---

## 📋 What Needs Customization

| Priority | File | Time | What to Update |
|----------|------|------|----------------|
| 🔴 **Must** | `base-context.md` | 5 min | Repo name, tech stack, team |
| 🔴 **Must** | `copilot-instructions.md` | 10 min | Code examples for your language |
| 🔴 **Must** | `languages/*.md` | 10 min | Create language-specific guide |
| 🟡 **Should** | `architecture.md` | 15 min | Document architecture |
| 🟡 **Should** | `@test-agent.md` | 5 min | Update testing framework |
| 🟡 **Should** | `@api-agent.md` | 5 min | Update web framework |
| 🟢 **Optional** | `standards.md` | 5 min | Add project-specific standards |

**Total time:** 30-60 minutes for complete setup

---

## ✅ Ready-to-Use Files (No Changes Needed)

- `README.md` - Template documentation
- `SETUP.md` - AI customization instructions
- `standards.md` - General coding standards
- `project-init-guide.md` - AI instructions
- `project-lifecycle.md` - Archival rules
- `emoji-guide.md` - Visual hierarchy
- `team-collaboration.md` - Collaboration guide
- `@project-manager-agent.md` - Language-agnostic
- `.vscode/*` - VS Code integration
- `projects/*` - Empty but structured

---

## 🎯 By Language/Framework

### Python + FastAPI

**Customize:**
1. `base-context.md` - Update tech stack
2. `copilot-instructions.md` - Replace Ruby examples with Python
3. `languages/python.md` - Create from `_template.md`, add PEP 8
4. `@test-agent.md` - Update for Pytest
5. `@api-agent.md` - Update for FastAPI patterns

**Example time:** 35 minutes

---

### Node.js + Express

**Customize:**
1. `base-context.md` - Update tech stack
2. `copilot-instructions.md` - Replace Ruby examples with JavaScript/TypeScript
3. `languages/javascript.md` or `typescript.md` - Create from template
4. `@test-agent.md` - Update for Jest/Mocha
5. `@api-agent.md` - Update for Express patterns

**Example time:** 35 minutes

---

### Ruby on Rails (Already Done!)

**Customize:**
1. `base-context.md` - Update repo-specific details
2. Optional: Adjust `copilot-instructions.md` for your conventions

**Example time:** 10 minutes

---

## 🔍 File Locations Cheat Sheet

```
prompts/
├── SETUP.md                    ← Start here for AI-assisted setup
├── README.md                   ← Template documentation
├── base-context.md             ← 🔴 MUST customize (repo details)
├── architecture.md             ← 🟡 Should customize
├── standards.md                ← ✅ Ready to use
├── project-init-guide.md       ← ✅ Ready to use
├── project-lifecycle.md        ← ✅ Ready to use
├── emoji-guide.md              ← ✅ Ready to use
├── team-collaboration.md       ← ✅ Ready to use
├── languages/
│   └── _template.md            ← 🔴 Create language-specific from this
├── projects/
│   ├── _index.md               ← ✅ Ready (will fill as you work)
│   ├── _knowledge-base.md      ← ✅ Ready (will fill as you work)
│   └── archive/
│       ├── README.md           ← ✅ Ready to use
│       ├── QUARTER-SUMMARY-TEMPLATE.md ← ✅ Ready to use
│       └── sessions/           ← For overflow (auto-created)
├── .github/
│   ├── copilot-instructions.md ← 🔴 MUST customize (code examples)
│   └── agents/
│       ├── README.md           ← ✅ Ready to use
│       ├── project-manager-agent.md ← ✅ Ready to use
│       ├── test-agent.md       ← 🟡 Should customize (testing framework)
│       ├── docs-agent.md       ← 🟢 Optional customization
│       └── api-agent.md        ← 🟡 Should customize (web framework)
└── .vscode/
    ├── settings.json           ← ✅ Ready to use
    ├── copilot-chat.json       ← ✅ Ready to use
    ├── documentation.code-snippets ← ✅ Ready to use
    └── README.md               ← ✅ Ready to use
```

---

## 🤖 AI-Assisted Setup Commands

### Option 1: All at Once
```
"Load prompts/SETUP.md and customize this documentation system for a Python 3.11 
FastAPI project with PostgreSQL, Redis, and Celery for background jobs"
```

### Option 2: Step by Step
```
1. "Load prompts/SETUP.md"
2. Answer AI questions about your stack
3. AI customizes all files
4. "begin project" to test
```

---

## ✅ Verification Checklist

After setup, verify:

```
[ ] base-context.md has actual repo name (not [Repository Name])
[ ] base-context.md lists actual tech stack
[ ] copilot-instructions.md has code examples in your language
[ ] languages/ has file for your primary language
[ ] @test-agent mentions your testing framework
[ ] @api-agent mentions your web framework
[ ] .vscode/settings.json exists
[ ] Say "begin project" - does it load context?
[ ] Try "@test-agent" - does it respond?
```

---

## 🎓 First Commands to Try

After setup:

```
1. "begin project"
   → Should load your customized context

2. "new project: TICKET-123-test-setup"
   → Creates first project file

3. "@test-agent write a simple test"
   → Tests agent with your framework

4. "save session"
   → Logs work to project file

5. "end session"
   → Completes session with summary
```

---

## 📊 Template Statistics

- **Total files:** 21 markdown files + 4 VS Code files
- **Ready to use:** 15 files (71%)
- **Need customization:** 6 files (29%)
- **Setup time:** 30-60 minutes
- **Maintenance:** Minimal (quarterly reviews)

---

## 🔄 Updates

When template improves:

1. Check source repo for changes
2. Review what's new
3. Copy improved files
4. Test before full adoption

---

## 📚 Resources

- **Full docs:** `prompts/README.md`
- **Setup guide:** `prompts/SETUP.md`
- **Agent docs:** `prompts/.github/agents/README.md`
- **VS Code docs:** `prompts/.vscode/README.md`
- **GitHub guide:** https://github.blog/.../how-to-write-a-great-agents-md.../

---

**Template Version:** 1.0  
**Last Updated:** 2026-01-05
