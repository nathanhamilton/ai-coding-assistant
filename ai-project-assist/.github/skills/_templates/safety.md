---
description: "Template for a repo-specific safety skill. Use when: auth, authorization, input validation, secrets, PII, external requests, or OWASP review."
---

# Safety Skill Template

Replace the placeholders below with repository-specific guidance before copying
this file to `.github/skills/safety/SKILL.md`.

## Core Rules

- Authentication: [AUTH STRATEGY]
- Authorization: [AUTHORIZATION STRATEGY]
- Secrets source: [CREDENTIALS / ENV / VAULT]
- Sensitive data: [PII / FINANCIAL / EDUCATION DATA TYPES]

## Review Checklist

- Validate all user input.
- Use parameterized queries or ORM APIs.
- Escape or sanitize rendered user content.
- Enforce authorization on every privileged action.
- Avoid hardcoded secrets, tokens, or credentials.
- Avoid logging protected data.

## Repository-Specific Checks

- [SECURITY RULE 1]
- [SECURITY RULE 2]
- [SECURITY RULE 3]

## External Integrations

- Route outbound requests through [SERVICE LAYER / CLIENT WRAPPERS].
- Keep credentials out of request code paths.
- Validate payloads or schemas before processing external input.

## Common Failure Modes

- [Example insecure pattern to avoid]
- [Example authorization bug to avoid]
- [Example logging or secrets bug to avoid]