# Template Quick Reference

**For installing this system into an existing repository with minimal manual work**

---

## 🚀 30-Second Setup

```bash
# In your target repo
cp -r /path/to/ai-project-assist prompts
cp -r /path/to/ai-project-assist/.github .
cp -r /path/to/ai-project-assist/.vscode .
```

Then in VS Code Copilot Chat:

```text
Load prompts/SETUP.md and install this documentation system into the current repo.
Detect the language, framework, package manager, test runner, and UI stack from
the codebase before asking follow-up questions.
```

---

## 📋 What Setup Should Do

### Detect First
- Inspect manifests such as `package.json`, `pyproject.toml`, `Gemfile`,
  `go.mod`, `Cargo.toml`, `pom.xml`, `build.gradle`, `composer.json`,
  `*.csproj`, and `requirements.txt`
- Inspect repo structure, CI files, container files, and test directories
- Infer primary languages, frameworks, package manager, test runner, and UI
  stack before changing template files

### Customize Next
- `prompts/base-context.md`
- `prompts/tech-stack.md`
- `prompts/architecture.md`
- `prompts/languages/*.md`
- `.github/copilot-instructions.md`
- relevant agent files and generated skills

### Ask Only If Ambiguous
- Ticket prefix
- Team review or branching rules
- Multi-app repo scope
- Conflicting framework signals

---

## ✅ Ready-to-Use Files

- `README.md`
- `SETUP.md`
- `project-init-guide.md`
- `project-lifecycle.md`
- `emoji-guide.md`
- `projects/*`
- `.github/prompts/*`
- `.github/skills/implementation-pipeline/SKILL.md`
- `.vscode/*`

These files are intended to stay generic. Setup should adapt the files that
carry repo-specific conventions.

---

## 🔧 Files That Should Become Repo-Specific

| Priority | File Group | Expected Result |
|----------|------------|-----------------|
| 🔴 Must | `prompts/base-context.md` | Real repo identity, purpose, team, workflow |
| 🔴 Must | `prompts/tech-stack.md` | Detected stack, versions, dependencies |
| 🔴 Must | `prompts/architecture.md` | Actual architecture and boundaries |
| 🔴 Must | `.github/copilot-instructions.md` | Repo-specific conventions with no placeholders |
| 🔴 Must | `.github/skills/*.md` | Safety, language, framework, and testing guidance for the detected stack |
| 🟡 Should | `prompts/languages/*.md` | Guides for detected primary language(s) |
| 🟡 Should | `.github/agents/test-agent.md` | Correct test runner and patterns |
| 🟡 Should | `.github/agents/api-agent.md` | Correct backend/API framework, if applicable |
| 🟢 Optional | `.github/agents/docs-agent.md` | Repo docs structure and examples |

---

## 🔍 File Locations Cheat Sheet

```
[repo-root]/
├── prompts/
│   ├── SETUP.md
│   ├── README.md
│   ├── QUICK-START.md
│   ├── base-context.md
│   ├── tech-stack.md
│   ├── architecture.md
│   ├── standards.md
│   ├── project-init-guide.md
│   ├── project-lifecycle.md
│   ├── emoji-guide.md
│   ├── team-collaboration.md
│   ├── languages/
│   └── projects/
├── .github/
│   ├── copilot-instructions.md
│   ├── agents/
│   ├── prompts/
│   └── skills/
│       ├── implementation-pipeline/
│       ├── _templates/
│       └── [generated stack-specific skills]
└── .vscode/
```

---

## ✅ Verification Checklist

```text
[ ] base-context.md has real repo details
[ ] tech-stack.md matches the detected stack
[ ] architecture.md reflects the real app structure
[ ] no placeholders remain in .github/copilot-instructions.md
[ ] test-agent matches the repo test runner
[ ] api-agent matches the repo backend or is intentionally left generic
[ ] generated skills exist for the detected stack
[ ] /project works and loads the customized context
```

---

## 🎓 First Commands To Try

```text
1. /project
2. new project: TICKET-123-example
3. @test-agent write a small test for an existing component
4. /save
5. /end
```

---

## 🔄 Updates

When the template improves:

1. Pull the generic updates from the source repo.
2. Merge them without overwriting repo-specific context.
3. Re-run the verification checklist.

---

**Template Version:** 2.1
**Last Updated:** 2026-04-02
