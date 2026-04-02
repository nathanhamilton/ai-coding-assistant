---
name: implementation-pipeline
description: "Use when: moving a change from investigation through implementation, verification, and close-out in this repo."
---

# Implementation Pipeline

Use this skill for maintenance work, bug fixes, and scoped enhancements after
the problem is already understood. If the user is starting brand-new feature
work or a ticket with open scope, redirect to `/project` or
`/begin-project` first and treat the agreed contract as the source of truth.

## End-To-End Flow

1. Intake: inspect the current code, prompts, docs, and surrounding patterns.
2. Questions: close any requirement gaps before planning or editing.
3. Plan: propose the smallest reviewable approach with affected files, risks,
   and validation.
4. Approval: wait when the repo rules or the user require a plan sign-off.
5. Implement: follow existing repo conventions.
6. Test: run the narrowest relevant validation for the changed behavior.
7. Review: self-check for regressions, security gaps, and incomplete coverage.
8. Deliver: report the outcome, what changed, and what remains unverified.

## Intake Checklist

- Read the code before editing it.
- Search for existing patterns before inventing a new one.
- Identify whether the change affects AI tooling, prompts, or documentation.
- Confirm whether the request is a fix, a maintenance task, or actually new
  project work that belongs in the project lifecycle.

## Planning Expectations

Every non-trivial plan should call out:

- Files to create versus files to modify.
- User-visible or operator-visible behavior changes.
- Test strategy and the exact command to run.
- Risks such as prompt drift, broken references, or incorrect template scope.

If the repo already has a contract or project file, align with it instead of
creating a parallel plan.

## Repository Rules

- Preserve repo-specific prompt files.
- Prefer the smallest diff that fixes the root cause.
- Avoid new dependencies unless the user approves them.
- For AI tooling sync work, merge workflow improvements without overwriting
  local repo guidance.

## Validation

- AI tooling or docs change: validate file references, copied paths, and
  placeholder-free content.
- Structural sync work: compare the target paths against the chosen source.

## Self-Review

Before closing out, verify:

- The change matches established repo patterns.
- File references and commands still make sense.
- Unrelated files were not modified.

## Close-Out

- State the user-visible outcome.
- State what was verified and what was not.
- Call out intentionally skipped areas or follow-up risks.