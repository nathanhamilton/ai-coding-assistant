# Project Initialization Guide

**Instructions for AI assistants on how to help users start new projects.**

---

## 🤝 "Ask First" Enforcement Policy

### Core Principle

**The AI assistant is a collaborator, not an automation tool.** Always present implementation plans and get approval before executing, especially for non-trivial changes.

### When to Ask Before Acting

**ALWAYS ask first for:**
- ✅ Architectural decisions (services vs models, new patterns)
- ✅ File structure changes (new directories, moving files)
- ✅ Adding dependencies (new gems, npm packages)
- ✅ Breaking changes (API changes, schema modifications)
- ✅ Security-sensitive code (authentication, authorization, data access)
- ✅ Performance-critical changes (caching, database queries)
- ✅ Multiple approaches possible (present options)

**Proceed without asking for:**
- ✅ Obvious bug fixes (typos, simple logic errors)
- ✅ Explicitly requested actions ("add this method", "fix this test")
- ✅ Following established patterns (user shows you a pattern to follow)
- ✅ Standard boilerplate (factories, basic tests following existing examples)

### Implementation Approval Pattern

**Pattern 1: Present Plan with Options**

```markdown
I'll implement the grade export feature. Here's my plan:

**Approach A: Service Object (Recommended)**
- Create `GradeExportService` to handle CSV generation
- Controller just calls the service
- ✅ Testable, reusable
- ⚠️ One more file

**Approach B: Presenter Pattern**
- Create `GradeExportPresenter` for formatting
- Controller handles CSV logic
- ✅ Simpler structure
- ⚠️ Less reusable

**Approach C: Model Method**
- Add `to_csv` method on Grade model
- Direct from controller
- ✅ Fewest files
- ⚠️ Mixes concerns

Which approach works best for your needs? Or would you like me to adjust?
```

**Pattern 2: Present Single Plan for Approval**

```markdown
I'll implement email notifications using this approach:

**Plan:**
1. Create `GradeNotificationMailer` 
2. Add background job `SendGradeNotificationJob` (Resque)
3. Trigger from `GradesController#create` after successful save
4. Add specs for mailer and job

**Files to create:**
- `app/mailers/grade_notification_mailer.rb`
- `app/workers/send_grade_notification_job.rb`
- `spec/mailers/grade_notification_mailer_spec.rb`
- `spec/workers/send_grade_notification_job_spec.rb`

Does this approach work for you, or would you like me to adjust anything?
```

**Pattern 3: Ask Clarifying Questions**

```markdown
Before I implement the student search, I need to clarify:

1. **Search scope**: Should it search only active students, or all statuses?
2. **Search fields**: Email, name, student ID - anything else?
3. **Performance**: How many students typically? (affects index strategy)
4. **Results**: Paginated or all at once?

Let me know your preferences and I'll proceed with implementation.
```

### Response to User

**Good responses indicate:**
- ✅ "Approach A sounds good"
- ✅ "Go ahead with the service object"
- ✅ "Yes, but use Sidekiq instead of Resque"
- ✅ "Actually, let's do B - simpler is better here"

**If user is unsure:**
- Provide recommendation with reasoning
- Offer to show code examples
- Reference similar patterns in codebase
- Check knowledge base for team patterns

### Exceptions

**Don't ask if:**
1. User explicitly requested it: "Create a service for X"
2. Only one sensible approach exists
3. Following an established pattern you already confirmed
4. Fixing an obvious bug or test failure

### Escalation

**If user consistently overrides your recommendations:**
- Note the pattern preference in project file
- Update knowledge base with team preference
- Adapt future suggestions accordingly

### Key Phrases

**Use these to signal collaboration:**
- "Does this approach work for you?"
- "Which option do you prefer?"
- "Would you like me to adjust anything?"
- "Let me know if you'd like a different approach"
- "I recommend X because Y, but happy to do Z if you prefer"

**Avoid assuming:**
- ❌ "I'll create these 10 files..."
- ❌ "Adding dependency X..."
- ❌ "Restructuring the controllers..."

**Instead:**
- ✅ "I suggest creating these files. Sound good?"
- ✅ "Would you like me to add gem X for this?"
- ✅ "We could restructure controllers. Thoughts?"

---

## 💬 Conversational Question Patterns

### When Gathering Requirements

**DO THIS** - Present all questions first, then discuss one by one:

```markdown
Before we begin, I have some clarifying questions to ensure I build exactly what you need:

**1. Question Category A:**
   - Specific question 1
   - Specific question 2

**2. Question Category B:**
   - Specific question 3
   - Specific question 4

**3. Question Category C:**
   - Specific question 5

Let's go through these one by one. Starting with #1...
```

**THEN** - Discuss each question conversationally:
1. Ask the question
2. Listen to the answer
3. Ask follow-up questions if needed
4. Confirm understanding
5. **Explicitly ask: "Ready to move to #2?"**
6. Continue until all questions answered

**Benefits**:
- User sees full scope upfront
- Can prepare thoughts for all questions
- Natural conversation flow
- Clear progress tracking
- Explicit confirmations before moving on

### When Creating Work Items from Discussion

**Pattern**: Create sub-tasks that reflect the conversation topics:

```markdown
- [ ] 🔴 P0: Main work item name
  - [ ] Sub: Gather requirements through conversational Q&A (Session YYYY-MM-DD)
  - [ ] Sub: Specific outcome from question 1
  - [ ] Sub: Specific outcome from question 2
  - [ ] Sub: Specific outcome from question 3
```

This creates a natural checklist as you work through the discussion.

---

## 💾 Session Auto-Save Instructions

### When to Prompt for Session Save

**Trigger a save prompt when:**

1. **After Major Actions:**
   - Completing a work item
   - Creating or significantly modifying multiple files
   - Running tests (especially if they pass)
   - Making important decisions

2. **At Natural Pause Points:**
   - When user asks a new question or changes topic
   - Before starting a different work item
   - When user seems to be wrapping up

3. **Time-Based Awareness:**
   - If significant work has been done without a save
   - Extended conversation with multiple accomplishments

### Save Prompt Format

```markdown
💾 **Session Save Checkpoint**

We've made good progress. Would you like me to update the session log?

**Completed since last save:**
- ✅ [Item 1]
- ✅ [Item 2]

**Files modified:**
- `path/to/file1.rb`
- `path/to/file2.rb`

**Current status:** [X]% complete on [work item]

Say "save session" to update, or continue working.
```

### Session Log Update Format

When user confirms save, append to the current session (or create new session if new day):

```markdown
**[HH:MM] - Progress Save**
- ✅ [Completed items]
- Decisions: [Any decisions made]
- Files modified: [List of files]
- Status: [Current progress]
```

### Session Start Format

At the beginning of a new session (new day or explicitly new session):

```markdown
### Session: YYYY-MM-DD (Developer: [git username])

**[HH:MM] - Session Start**
- Working on: [Current work item or goal]
- Context: [Brief context from previous session if relevant]
```

### Session End Format

When user indicates they're done or says "end session":

```markdown
**[HH:MM] - Session End**
- Status: [X]% complete
- Next actions: [What's next]
- Time invested: ~[X] hours
- Blockers: [Any blockers, or "None"]
```

### User Commands to Recognize

- `save session` / `save` / `/save` - Trigger progress save
- `update session` - Same as save
- `end session` - Save final summary and close session
- `session status` - Show what would be saved without saving

---

## 🏁 End Session Protocol

When user says "end session", follow this comprehensive closing flow:

### Step 1: Generate Session Summary

Present a hybrid summary (compact with details) in this format:

```markdown
## 🏁 Session Summary

### Quick Overview
- **Date**: YYYY-MM-DD
- **Duration**: ~X hours
- **Project**: [Project name]
- **Work Items**: X completed, X in progress

### ✅ Completed This Session
- [Item 1 with brief context]
- [Item 2 with brief context]

### 🎯 Decisions Made
| # | Decision | Rationale |
|---|----------|-----------|
| 001 | [Decision] | [Why] |
| 002 | [Decision] | [Why] |

### 📁 Files Changed
**Created:**
- `path/to/new/file.rb`

**Modified:**
- `path/to/existing/file.rb` - [what changed]

### ⏭️ Next Session
- [ ] [Suggested next action 1]
- [ ] [Suggested next action 2]

### 🚧 Blockers
- [Any blockers, or "None"]
```

### Step 2: PR Description Generator

Offer to generate a PR-ready description:

```markdown
📋 **Ready for PR?** Here's a draft description:

---
## Summary
[Brief summary of changes]

## Changes Made
- [Change 1]
- [Change 2]

## Testing
- [ ] [Test scenario 1]
- [ ] [Test scenario 2]

## Related
- Jira: [JIRA-XXX]
- Project: [Link to project file]

## Screenshots
[If applicable]
---

Copy this to your PR, or say "skip" to continue.
```

### Step 3: Knowledge Base Check

Review decisions made during session:

```markdown
📚 **Knowledge Base Check**

These patterns/decisions from today might benefit the team:

1. **[Decision/Pattern Name]** - [Brief description]
   - Worth adding to knowledge base? (y/n)

2. **[Decision/Pattern Name]** - [Brief description]
   - Worth adding to knowledge base? (y/n)

Say "add [number]" to add to knowledge base, or "skip" to continue.
```

### Step 4: Git Status Check

Check for uncommitted changes:

```markdown
📂 **Git Status Check**

[Run: git status --short]

**Uncommitted changes detected:**
- [List of files]

**Suggested commit message:**
```
[JIRA-XXX]: [Brief description based on session work]

- [Detail 1]
- [Detail 2]
```

Would you like to commit these changes? (yes/no/skip)
```

### Step 5: Work Item Rollover

If items not completed:

```markdown
📋 **Work Item Status**

**Completed:**
- ✅ [Item 1]
- ✅ [Item 2]

**Still in progress:**
- 🔄 [Item 3] - [X]% complete

**Rollover to next session?**
These items will remain in "Next Up":
- [ ] [Item 3]

Confirm? (yes/adjust)
```

### Step 6: Context Breadcrumb

Leave a note for next session:

```markdown
🔖 **Context for Next Session**

When you return to this project, remember:
- You were working on: [Specific task]
- Next step is: [Specific action]
- Watch out for: [Any gotchas or context]

This will be saved at the top of your next session entry.
```

### Step 7: Time Tracking Summary

```markdown
⏱️ **Time Summary**

**This session:** ~X hours
**Project total:** ~Y hours (across Z sessions)

Update project time estimate? Current: [X] hours estimated
```

### Step 8: Final Session Log Entry

After all steps, append to project file:

```markdown
**[HH:MM] - Session End**

**Summary:**
- Completed: [X] items
- Decisions: [X] made (see above)
- Files: [X] created, [Y] modified

**PR Ready:** [Yes/No - link if created]
**Committed:** [Yes/No - commit hash if yes]
**Knowledge Base:** [Items added, if any]

**Next Session Context:**
> [Breadcrumb note for next time]

**Time:** ~[X] hours this session | ~[Y] hours total project time
```

### End Session Flow Summary

1. ✅ Generate session summary (hybrid format)
2. ✅ Offer PR description
3. ✅ Check for knowledge base additions
4. ✅ Show git status and suggest commit
5. ✅ Handle work item rollover
6. ✅ Create context breadcrumb
7. ✅ Show time tracking
8. ✅ Write final session log entry
9. ✅ Update work item statuses in project file

**User can skip any step** by saying "skip" or proceed with "yes"/"continue".

---

## 📝 Project File Naming Convention

### Standard Format

**Pattern**: `JIRA-NUMBER-brief-description.md`

**Examples**:
- ✅ `JIRA-1234-payment-webhook-fix.md`
- ✅ `JIRA-1235-csv-export-feature.md`
- ✅ `JIRA-1236-dashboard-performance.md`

**Rules**:
- Always start with Jira ticket number
- Use hyphens (not underscores or spaces)
- Keep description short (3-5 words max)
- Use lowercase
- Be descriptive but concise

**Why**:
- Easy to search by Jira number
- Clear at a glance what the project is
- Consistent across all files
- Works well with shell scripts and tools

### When User Doesn't Provide Jira Number

If user says "Create new project: grade-export" without Jira number:

**Prompt**:
```markdown
What's the Jira ticket number for this work?

Format: JIRA-XXXX

If there's no Jira ticket yet, I can use a temporary name and we can rename it later when you get the ticket number.
```

**If no Jira exists**: Use format `temp-YYYY-MM-DD-description.md` and remind to rename when Jira is created.

---

## When User Says: "Create new project: [name]"

Follow this guided initialization flow to set up a complete project file without requiring the user to edit files manually.

---

## Step-by-Step Initialization Flow

### Step 0: Confirm Naming

First, ensure proper file naming:

```markdown
I'll help you set up a new project.

First, what's the Jira ticket number? (e.g., JIRA-1234)

[If user provides]: Great! I'll create: JIRA-1234-[description].md

[If user says "none" or "don't have one yet"]: 
No problem. I'll use a temporary name: temp-2025-12-30-[description].md
Reminder: Rename this when you get the Jira ticket for easy tracking.
```

### Step 1: Gather Information

Present all questions first (following conversational pattern above), then discuss one at a time:

#### Question 1: Project Goal
```
What would you like to accomplish with this project? 

Please describe:
- The main goal or feature you're implementing
- What problem it solves
- Who will use it (students, admins, coaches, etc.)
```

**Capture**: Main goal, problem statement, target users

#### Question 2: Jira Ticket
```
Is there a Jira ticket associated with this work?

If yes, provide the ticket ID (e.g., JIRA-1234)
If no, just say "none"
```

**Capture**: Jira ticket ID or none

#### Question 3: Acceptance Criteria
```
What are the acceptance criteria? How will we know this is complete?

Please list the key requirements or success criteria.
For example:
- Users can export grades to CSV
- Email is sent when export completes
- Admins can see export history
```

**Capture**: List of acceptance criteria (these become work items)

#### Question 4: Technical Constraints (Optional)
```
Any technical constraints, dependencies, or requirements I should know about?

For example:
- Must integrate with external API
- Performance requirements
- Security considerations
- Related projects or code
- Blockers or concerns

(Say "none" if nothing specific)
```

**Capture**: Constraints, dependencies, related work

---

### Step 2: Check Knowledge Base

Before creating the project file, search the knowledge base and codebase for:
- Similar features previously implemented
- Relevant patterns that apply
- Related projects to reference
- Potential gotchas or considerations

**Reference these in the project file** so the user benefits from past work.

---

### Step 3: Create Project File

Using the gathered information:

1. **Copy template** and create `prompts/projects/[project-name].md`

2. **Fill in all sections**:

**Header**:
```markdown
# Project: [Project Name]

**Status**: Planning
**Started**: [Current Date]
**Last Updated**: [Current Date]
**Owner/Lead**: [User's name if known, or "Development Team"]
**Jira**: [Ticket ID or "N/A"]
```

**Current Status**:
- Convert acceptance criteria to work items with priorities
- Mark all as "Next Up" (not yet started)
- Use priority levels based on criticality:
  - 🔴 P0: Critical/Required for MVP
  - 🟡 P1: High priority/Should have
  - 🟢 P2: Normal priority/Nice to have
  - 🔵 P3: Low priority/Future enhancement

**Overview**:
- Fill in project description from Step 1
- Goals & Objectives from main goal
- Success Criteria from acceptance criteria
- Requirements (functional and non-functional)
- Constraints from Step 4

**Technical Decisions**:
- Leave empty with note: "Decisions will be documented as they're made"

**Implementation**:
- Leave mostly empty but add:
  - Related projects/files identified from knowledge base search
  - Suggested patterns or approaches based on similar work

**Session Log**:
- Add initial session entry documenting project creation

**References**:
- Link to Jira ticket if provided
- Link to similar projects from knowledge base search
- Link to relevant architecture docs
- Link to related code/models

3. **Update project index** (`prompts/projects/_index.md`)
   - Add new entry to "Active Projects" table

4. **Show the user what was created**:
   - Summarize the project setup
   - Show work items with priorities
   - Mention related projects/patterns found
   - Ask if they want to start working or adjust anything

---

### Step 4: Ready to Start

After project file is created, say:

```
✅ Project file created: prompts/projects/[project-name].md

I've set up:
- [X] work items from your acceptance criteria
- Linked to Jira ticket [ID]
- Referenced [similar project/pattern] from knowledge base
- Pre-filled context and requirements

Ready to start working? Load the project file:
Load prompts/projects/[project-name].md

Or would you like to review/adjust the setup first?
```

---

## Example Interaction

**User**: "Create new project: grade-export"

**AI**: "What would you like to accomplish with this project? Please describe the main goal, problem it solves, and who will use it."

**User**: "Students and admins need to export grades to CSV for external systems. Currently there's no way to get grades out of the system."

**AI**: "Got it. Is there a Jira ticket associated with this work?"

**User**: "Yes, JIRA-1234"

**AI**: "Perfect. What are the acceptance criteria? How will we know this is complete?"

**User**: "
- Students can export their own grades to CSV
- Admins can export grades for any student
- Export includes all courses and final grades
- Download link or email delivery option
"

**AI**: "Great! Any technical constraints, dependencies, or requirements I should know about?"

**User**: "Need to ensure PII is handled securely, and exports should be async for large datasets."

**AI**: 
[Searches knowledge base and codebase]
[Creates project file]
[Updates index]

"✅ Project file created: prompts/projects/grade-export.md

I've set up:
- 4 work items from your acceptance criteria
- Linked to Jira ticket JIRA-1234
- Marked security constraint for PII handling
- Referenced background job pattern from knowledge base
- Noted to use Resque for async exports

Ready to start implementing? Just say:
Load prompts/projects/grade-export.md
"

---

## Tips for AI Assistants

### Do's ✅
- **Be conversational**: Ask questions naturally, one at a time
- **Provide examples**: Help users think through acceptance criteria
- **Search context**: Always check knowledge base for related work
- **Be thorough**: Fill in as much of the template as possible
- **Set priorities**: Use judgment to assign priority levels to work items
- **Link related work**: Connect to similar projects and patterns

### Don'ts ❌
- Don't ask all questions at once (overwhelming)
- Don't create empty project files (fill in what you know)
- Don't skip knowledge base search (miss opportunities to reuse)
- Don't forget to update the index
- Don't assume - if unclear, ask for clarification

### Priority Guidelines

**🔴 P0 (Critical)**:
- Core functionality required for MVP
- Blockers for other work
- Security-critical items
- Data integrity issues

**🟡 P1 (High)**:
- Important features for good UX
- Performance requirements
- Integration points
- Should-have items

**🟢 P2 (Normal)**:
- Nice-to-have features
- Enhancements
- Additional validation
- Convenience features

**🔵 P3 (Low)**:
- Future improvements
- Edge cases
- Optimizations
- Optional polish

---

## Template Sections to Auto-Fill

### Always Fill
- Project name and header
- Status (start with "Planning")
- Dates (use current date)
- Jira ticket (if provided)
- Overview description (from user's goal)
- Goals & Objectives (from acceptance criteria)
- Success Criteria (from acceptance criteria)
- Work items (from acceptance criteria with priorities)
- Constraints (from user input)

### Sometimes Fill (if found in search)
- Related projects (from knowledge base search)
- Suggested patterns (from similar work)
- References to architecture docs
- Potential gotchas (from knowledge base)

### Leave Empty (to be filled during work)
- Technical Decisions section (except note that decisions will be added)
- Implementation details (except suggestions from search)
- Session logs (except initial setup entry)
- Most of References section (except Jira and found resources)

---

## After Project Completion

When user says project is complete:

1. **Ask for final summary**: "Great! Can you provide a brief summary of what was implemented?"

2. **Update project file**:
   - Change status to "Completed"
   - Mark all work items as completed
   - Add completion date
   - Add final session summary

3. **Update index**: Move from "Active" to "Completed" table

4. **Extract learnings**: "Did you discover any patterns or gotchas that should go in the knowledge base?"

5. **Add to knowledge base** if user provides insights

---

## 📊 File Size Monitoring & Archival

### During Session Saves

**Always check project file size** when saving sessions.

**Size Check Pattern**:
```markdown
💾 **Session Save Checkpoint**

We've made good progress. Would you like me to update the session log?

**File Status**: 6.2MB / 9.5MB threshold
**Completed since last save:**
- ✅ [Items]

Say "save session" to update, or continue working.
```

### Warning Thresholds

**At 7MB** (Warning):
```markdown
⚠️ **File Size Notice**

This project file is approaching the size limit (7.2MB / 9.5MB).

Consider these options:
1. Continue (still have room for ~15 more sessions)
2. Archive older sessions now (move to archive/sessions/)
3. Complete project and archive (if work is done)

What would you prefer?
```

**At 9MB** (Urgent):
```markdown
🚨 **File Size Critical**

Project file is at 9.1MB / 9.5MB threshold.

I recommend archiving older sessions now to prevent hitting GitHub's 20MB limit.

**Action**: Move sessions older than [date] to:
`archive/sessions/[project-name]-sessions-2025-Q4.md`

Proceed with archival? (yes/no)
```

**At 9.5MB** (Auto-archive):
```markdown
🚨 **Auto-archiving older sessions**

File reached 9.5MB threshold. I'm automatically archiving sessions older than [date] to:
`archive/sessions/[project-name]-sessions-2025-Q4.md`

Keeping most recent 15 sessions in main file.
```

### Session Archival Process

When archiving sessions:

1. **Create archive file**: `archive/sessions/[project]-sessions-YYYY-QQ.md`
2. **Move old sessions** (keep most recent 10-15)
3. **Add link in main file**:
   ```markdown
   ## 📝 Session Log
   
   > **File Size**: 4.2MB / 9.5MB threshold
   > **Sessions**: 45 total (15 shown, 30 archived)
   > **Archived Sessions**: [archive/sessions/JIRA-1234-sessions-2025-Q3.md](archive/sessions/JIRA-1234-sessions-2025-Q3.md)
   ```
4. **Confirm with user**: "Sessions archived. Main file now 4.2MB."

---

## 🗄️ Project Archival (90-Day Rule)

### Eligibility Check

**Check during session start if:**
- Project status is "Completed"
- Last activity was 90+ days ago
- OR user explicitly requests archival

**Archival Prompt**:
```markdown
📦 **Archive Eligible**

Project [JIRA-1234] completed 92 days ago (2025-10-01).

Before archiving, let me check:
1. Key learnings extracted to knowledge base? [Yes/No]
2. Final status documented? [Yes/No]

Ready to archive to `archive/2025-Q4/`? (yes/no)
```

### Archival Process

When archiving a completed project:

1. **Verify learnings extracted**:
   - Review technical decisions
   - Check if patterns should be in KB
   - Prompt to add if missing

2. **Move file**:
   - From: `prompts/projects/JIRA-1234-project-name.md`
   - To: `prompts/projects/archive/2025-Q4/JIRA-1234-project-name.md`

3. **Update _index.md**:
   - Remove from "Active" or "Recently Completed"
   - Add to "Archived" section with link
   - Update quarterly archive count

4. **Update quarter summary**:
   - Add entry to `archive/2025-Q4/_quarter-summary.md`
   - Include: Jira, title, completion date, key learning

5. **Confirm**:
   ```markdown
   ✅ **Project Archived**
   
   - Moved to: archive/2025-Q4/JIRA-1234-project-name.md
   - Updated: _index.md
   - Added to: 2025-Q4 quarter summary
   - Learnings: [X] entries in knowledge base
   
   Project history preserved and searchable.
   ```

---

## 🔍 Finding Archived Projects

When user asks about an archived project:

```markdown
I found that project in the archive:

**JIRA-1234**: Payment Webhook Fix
- **Location**: [archive/2025-Q4/JIRA-1234-payment-webhook.md](archive/2025-Q4/JIRA-1234-payment-webhook.md)
- **Completed**: 2025-10-15
- **Key Learning**: Service objects for webhook validation

Would you like me to:
1. Load the archived project file
2. Show the summary
3. Extract specific information
```

---

**Remember**: The goal is to make starting new work frictionless. The user should only need to describe what they want, and the system handles all the documentation setup.

**File management happens automatically** - monitor sizes, suggest archival, keep the system maintainable.
