---
name: implementation-pipeline
description: "Use when: carrying work from plan to implementation to validation, or when creating a new repo's baseline delivery workflow."
---

# Implementation Pipeline

This skill is intentionally generic. Copy it into the target repository's
`.github/skills/implementation-pipeline/` directory as-is.

## Workflow

1. Understand the request and inspect the existing code or documentation first.
2. Prefer the smallest change that solves the real problem.
3. Preserve repository-specific conventions and instructions.
4. Add or update tests when behavior changes.
5. Validate the result with the narrowest relevant command.
6. Summarize what changed, what was verified, and what remains risky.

## Guardrails

- Do not replace repo-specific context files with generic template content.
- Do not introduce new dependencies without explicit approval.
- Do not skip verification if a relevant check is available.
- Do not treat a sync source as globally canonical unless the target repo says so.

## Verification Pattern

- Read the affected files before editing.
- Update only the files required for the task.
- Run targeted lint, test, or static checks.
- Confirm file references and instructions still point to real files.

## Output Pattern

- What changed
- What was intentionally not changed
- What was verified
- Any remaining follow-up or risk