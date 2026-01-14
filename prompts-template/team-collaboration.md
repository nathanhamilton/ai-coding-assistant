# Team Collaboration Guidelines 👥

**How our team works together on documentation and project tracking.**

---

## 🌳 Git Workflow

### Branch Naming Convention

**Format**: `purpose/target/JIRA#`

#### Individual Tasks (Direct to Master)
Tasks not associated with a project go directly to master:

```bash
feature/master/JIRA-554
fix/master/JIRA-665
```

#### Project Tasks (Feature → Project → Master)
Tasks that are part of a larger project:

```bash
# Feature branches merge into project branch
feature/project_name/JIRA-9545
fix/project_name/JIRA-8556

# Project branch (contains the Epic)
project/project_name/JIRA-7776
```

#### Documentation Changes
Follow the same pattern:

```bash
# Individual documentation improvement
feature/master/JIRA-1234

# Part of larger documentation project
feature/doc_system/JIRA-5678
project/doc_system/JIRA-9999  # Epic
```

### Deployment Flow

**Individual Changes:**
1. Create feature branch: `feature/master/JIRA-XXX`
2. Deploy to DEV for testing
3. Create PR to master
4. After approval, merge to master
5. Deploy to PROD

**Project Changes:**
1. Create project branch: `project/project_name/JIRA-EPIC`
2. Create feature branches: `feature/project_name/JIRA-XXX`
3. Deploy project branch to DEV as features merge in
4. When project complete, PR project branch to master
5. Deploy to PROD

**Note**: We no longer use STG environment - it's DEV → PROD only.

---

## 📝 Working with Project Files

### General Workflow

1. **Load project**: `Load prompts/projects/project-name.md`
2. **Work on your feature branch** using standard git workflow
3. **Add session log entries** as you work (see pattern below)
4. **Commit directly to your feature branch**
5. **Handle merge conflicts** if they arise (rare due to session log pattern)
6. **Create PR** when ready - team sees full context in session log

### No Check-In/Check-Out Required

- ✅ Just load the project and start working
- ✅ Your work stays in your feature branch until PR
- ✅ Session logs provide context when you return to work
- ✅ Team sees complete history when reviewing PR
- ❌ No need to update "active developers" sections

### Session Log Pattern

**Format**: Include git username and date, with sub-timestamps for progress saves

```markdown
## 📝 Session Log

### Session: 2025-12-08 (Developer: johndoe)

**09:00 - Session Start**
- Working on: User authentication feature
- Goal: Complete auth flow with tests

**10:30 - Progress Save**
- ✅ Implemented user authentication controller
- ✅ Added Devise configuration
- Decisions: Chose Devise over custom auth (faster, well-tested)
- Files modified: `app/controllers/auth_controller.rb`, `config/initializers/devise.rb`

**14:00 - Progress Save**
- ✅ Added RSpec tests for auth flow
- ✅ Updated documentation
- Decisions: Using Pundit for authorization (team standard)
- Files modified: `spec/controllers/auth_controller_spec.rb`

**16:30 - Session End**
- Status: 80% complete
- Next actions: Add password reset flow
- Time invested: ~5 hours
```

**Key Points**:
- One session entry per day (or working period)
- Sub-timestamps for each progress save
- AI prompts you to save at natural points
- Append new sessions to bottom (chronological order)
- Session logs rarely conflict due to different timestamps

### When AI Prompts to Save

The AI will suggest saving session progress:
- **After major actions**: Completing work items, significant file changes
- **At natural pauses**: When you ask for something new or switch context
- **Time-based**: Extended periods without a save

**Example AI prompt:**
```
💾 It's been a while since our last save, and we've made good progress.
Would you like me to update the session log with:
- ✅ Completed: [items done]
- 📁 Files modified: [list]
- 🎯 Current status: [progress]

Just say "save session" or "yes" to update, or continue working.
```

### Save Commands

You can trigger a save anytime by saying:
- `save session` - Save current progress
- `update session` - Same as save
- `/save` - Quick command
- `end session` - Complete session with full summary (see below)

### End Session Command

When you're done working, say `end session` to trigger a comprehensive closing flow:

1. **Session Summary** - Hybrid format (compact + detailed) ready for PR
2. **PR Description Generator** - Copy-paste ready GitHub PR description
3. **Knowledge Base Check** - Review decisions for team learnings
4. **Git Status Check** - Show uncommitted changes, suggest commit message
5. **Work Item Rollover** - Update status, move incomplete items
6. **Context Breadcrumb** - Leave note for your next session
7. **Time Tracking** - Session time and project totals
8. **Final Log Entry** - Complete record in project file

**You can skip any step** - just say "skip" to move to the next one.

See `prompts/project-init-guide.md` for full End Session Protocol details.

### Getting Git Username

AI can automatically detect via:
```bash
git config user.name
```

---

## 📚 Knowledge Base Contributions

### Who Can Contribute?

**Anyone on the team!** We encourage knowledge sharing.

### Template Required

When adding entries to `prompts/projects/_knowledge-base.md`, use this format:

```markdown
### Pattern: [Descriptive Name]

**Problem**: What issue does this solve?

**Solution**: The pattern or approach

**Example**:
```ruby
# Code snippet demonstrating the pattern
class ExampleService
  def call
    # Implementation
  end
end
```

**Trade-offs**:
- ✅ When to use this pattern
- ⚠️ When NOT to use this pattern
- ⚠️ Potential drawbacks

**Source**: Project where discovered, developer who found it

**Date Added**: YYYY-MM-DD
```

### Preventing Duplicates

Before adding a pattern:
1. Search `_knowledge-base.md` for similar patterns
2. If similar pattern exists, consider updating it instead
3. If truly different, add as new entry
4. PR review will catch duplicates naturally

### Growing the Knowledge Base

- Add patterns as you discover them (don't wait)
- Small insights are valuable too
- Reference patterns in project files when you use them
- Update patterns if you find better approaches

---

## 🔍 Review & Approval Process

### Standard PR Review for Everything

**All documentation changes go through standard PR process:**
- Project files (`build-out-documentation-system.md`)
- Shared standards (`base-context.md`, `standards.md`, `rails.md`)
- Knowledge base entries (`_knowledge-base.md`)

**Requirements:**
- ✅ One approval required (same as code)
- ✅ Standard PR review process
- ✅ No special ceremony for different file types

### When to Discuss First

**Discuss in MS Teams BEFORE creating PR for:**

**Big Changes to Core Documentation:**
- Major refactoring of `base-context.md`
- Significant changes to `standards.md` or language files
- Restructuring the documentation system itself
- Changes that affect everyone's workflow

**Examples:**
- ✅ Discuss first: "I want to reorganize base-context.md into 3 separate files"
- ❌ No discussion needed: "Fixed typo in rails.md"
- ✅ Discuss first: "I think we should change our session log format"
- ❌ No discussion needed: "Added example for service objects in knowledge base"

**Small Fixes - Just PR It:**
- Typos and grammar fixes
- Adding examples to existing patterns
- Updating outdated code snippets
- Clarifying confusing sections
- Adding new knowledge base entries (using template)

### Merge Conflicts

Handle merge conflicts through standard git workflow:
1. Pull latest from target branch
2. Resolve conflicts locally
3. Test that documentation still makes sense
4. Commit resolution
5. Continue with PR

**Note**: Session log conflicts are rare due to timestamp + username pattern, but if they happen, keep both entries in chronological order.

---

## 🔐 File Ownership & Permissions

### No Formal Ownership

All documentation files are **team-owned** and **collaboratively maintained**.

### Communication Guidelines

**General Principle**: 
- **Big changes** → Discuss in MS Teams first
- **Small fixes** → Just create PR
- **When in doubt** → Quick message in Teams

### File Categories

**Core Documentation** (discuss big changes):
- `prompts/base-context.md` - Universal session starter
- `prompts/standards.md` - Coding conventions
- `prompts/architecture.md` - System architecture
- `prompts/languages/*.md` - Language-specific standards
- `prompts/project-init-guide.md` - AI initialization instructions

**Project Files** (standard PR review):
- `prompts/projects/*.md` - Individual project files
- Anyone can work on any project
- Session logs show who worked when

**Shared Resources** (open contribution):
- `prompts/projects/_knowledge-base.md` - Team learnings
- `prompts/projects/_index.md` - Project registry
- Add freely using templates

### Resolving Disagreements

If team members disagree on a documentation change:

1. **Discussion**: Talk it through in MS Teams
2. **Evidence**: Reference existing patterns or external standards
3. **Consensus**: Small team = aim for agreement
4. **Document**: Record decision in relevant project file
5. **Iterate**: Can always improve later

---

## 🎯 Best Practices

### Do's ✅

- **Do** commit session logs as you work
- **Do** use meaningful commit messages for documentation
- **Do** add knowledge base entries when you discover patterns
- **Do** reference project files in PR descriptions
- **Do** ask in MS Teams if unsure about a change
- **Do** keep session logs focused and actionable
- **Do** update work item status as you progress

### Don'ts ❌

- **Don't** skip session logs - they provide critical context
- **Don't** make big changes to core docs without discussion
- **Don't** let knowledge base entries be vague or template-less
- **Don't** worry about perfect formatting - PRs catch issues
- **Don't** create project files manually - use guided initialization
- **Don't** commit directly to master - always use feature branches

### Time-Saving Tips ⚡

1. **Use AI to generate session logs**: Just describe what you did
2. **Reference decision numbers**: "Following Decision 003 from build-out-docs"
3. **Link to knowledge base**: "Using Service Object pattern (see _knowledge-base.md)"
4. **Copy session log format**: Use previous sessions as templates
5. **Batch documentation updates**: Don't interrupt flow, commit at natural stopping points

---

## 🚀 Getting Started

### First Time Using the System

1. **Read base context**: `Load prompts/base-context.md`
2. **Review standards**: `Load prompts/standards.md`
3. **Check language docs**: `Load prompts/languages/ruby.md` and `prompts/languages/rails.md`
4. **Browse projects**: Look at `prompts/projects/_index.md`
5. **Start working**: `Load prompts/projects/project.md` and tell AI what you want to do

### Starting a New Project

1. **Load universal entry point**: `Load prompts/projects/project.md`
2. **Tell AI your goal**: "New: implement grade export feature"
3. **Answer guided questions**: AI will walk you through setup
4. **Create feature branch**: `feature/master/JIRA-XXX` or `feature/project/JIRA-XXX`
5. **Work and commit**: Session logs capture your progress
6. **Create PR**: Team reviews complete context

### Continuing Existing Work

1. **Checkout your branch**: `git checkout feature/master/JIRA-XXX`
2. **Load project**: `Load prompts/projects/your-project.md`
3. **Read last session log**: See where you left off
4. **Continue working**: Add new session log entry
5. **Commit progress**: Keep session logs updated

---

## 📞 Questions?

If you're unsure about:
- **Git workflow**: Ask in MS Teams #engineering channel
- **Documentation changes**: Post proposed change in Teams for discussion
- **System usage**: Reference this guide or ask AI assistant
- **Process improvements**: Create a project file to discuss and track

---

**Last Updated**: 2025-12-05  
**Maintained By**: Development Team  
**Source**: Built from team discussion in `build-out-documentation-system` project

_This document is a living guide. Suggest improvements via PR with discussion in MS Teams._
