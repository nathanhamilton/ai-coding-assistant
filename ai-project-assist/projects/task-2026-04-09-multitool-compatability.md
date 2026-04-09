# task-2026-04-09-multitool-compatability: Cross-platform AI tooling compatibility

**Status:** Planning
**Created:** 2026-04-09
**Last Updated:** 2026-04-09
**Branch:** `ai-updates`

---

## Contract

**Status:** Awaiting approval

---

### Problem

Any individual using a modern AI coding tool (VS Code / Copilot, Claude Code, Cursor, Conductor) should be able to install this project assistant and use it immediately — no manual configuration, no tool detection step, no customization required before first use.

### User Story

As a developer on a team where members use different AI tools, I want a single installation of this system to work for everyone out of the box — so one team member using VS Code is just as productive as another using Claude Code, with no divergence in available guidance or workflow.

### P0 Deliverables

- [ ] Out-of-the-box support for **VS Code / Copilot** (already partially exists — validate and complete)
- [ ] Out-of-the-box support for **Claude Code**
- [ ] Out-of-the-box support for **Cursor**
- [ ] A single canonical source for all shared instructions, skills, and agents — no duplication across tool configurations
- [ ] The installation process is **tool-agnostic**: does not detect or ask what AI tool the user has; all supported configurations ship together

### P1 Deliverables (nice to have)

- [ ] Out-of-the-box support for **Conductor** (multi-agent orchestration)

### Out of Scope

- Nothing explicitly excluded at this time

### Technical Constraints

- Architecture must be **extremely performant** — prefer symlinks or single-source references over file copies; no duplication of content
- Tool-specific entrypoints must feel native to each tool (correct file locations, correct config format) while reading from the shared core
- The `ai-assist-template/` structure must be updated so downstream repos inherit multi-tool support automatically

### Affected Areas

- `.github/` (agents, skills, prompts, copilot-instructions)
- Repo root (tool-specific config files/directories for Claude Code, Cursor, Conductor)
- `ai-assist-template/` (so the multi-tool layout distributes to target repos)

### Definition of Done

A single `cp -r ai-assist-template/ ai-project-assist/` installation results in:
1. VS Code / Copilot can use all agents, skills, and prompts natively
2. Claude Code can use all shared instructions and skills natively
3. Cursor can use all shared instructions and skills natively
4. No skill, agent, or instruction file is duplicated — all tool configs point to a single source of truth
5. If a user is running an unrecognised AI tool, the system detects the missing config and offers to generate it for them

### Edge Cases

- **Unknown tool:** if a user opens the repo in an AI tool that has no config present, the system detects the gap and prompts the user to generate a configuration for that tool
- **Team heterogeneity:** members using different tools must get equivalent workflow quality with no per-member setup

---

## Overview

**Work Item:** task-2026-04-09-multitool-compatability
**Type:** Feature
**Priority:** P0

### Solution
Single-source shared core (skills, agents, instructions) with thin, tool-native entrypoint layers per AI tool. All tool configs are installed together — no detection step, no optional installs.

### Scope
- [ ] P0: VS Code / Copilot support (validate + complete)
- [ ] P0: Claude Code support
- [ ] P0: Cursor support
- [ ] P0: Single canonical source, no duplication
- [ ] P0: Tool-agnostic installation
- [ ] P1: Conductor support
- [ ] Edge: Unknown-tool detection and config generation prompt

### Constraints
- Shared core must not be duplicated across tool configs
- Tool-specific files must use each tool's native config format and location
- `ai-assist-template/` must ship the full multi-tool layout so downstream repos inherit it

---

## Implementation Plan

### Phase 1: Discovery / Design
- [ ] Confirm scope, risks, and acceptance criteria
- [ ] Identify the shared-core versus tool-specific boundaries

### Phase 2: Implementation
- [ ] Pending contract approval

### Phase 3: Validation
- [ ] Pending implementation plan

---

## Files Changed

### Created
- `ai-project-assist/projects/task-2026-04-09-multitool-compatability.md` — Project contract and execution log

### Modified
- `ai-project-assist/projects/_index.md` — Registered the active project

---

## Testing

- [ ] Relevant validation complete
- [ ] Manual verification complete
- [ ] Documentation updated if behavior changed

**Test command:** `N/A for contract phase`

---

## Session Log

### Session: 2026-04-09

**Session Start**
- Working on: Cross-platform AI tooling compatibility
- Goal: Define the contract for a DRY, multi-tool AI workflow system

---

## Learnings

- None yet

---

## References

- Related docs: `ai-project-assist/base-context.md`
- Related docs: `ai-project-assist/standards.md`
- Related docs: `ai-project-assist/projects/_knowledge-base.md`