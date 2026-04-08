---
description: "Template for a repo-specific Rails skill. Use when: controllers, models, jobs, policies, views, or Rails architecture decisions."
applyTo: "app/**/*.rb"
---

# Rails Skill Template

Replace placeholders before copying this file to `.github/skills/rails/SKILL.md`.

## Runtime

- Rails version: [RAILS VERSION]
- Database: [DATABASE]
- Jobs: [JOB SYSTEM]
- Auth: [AUTH / AUTHZ STACK]

## Layer Responsibilities

- Controllers: [CONTROLLER RESPONSIBILITY]
- Models: [MODEL RESPONSIBILITY]
- Services: [SERVICE RESPONSIBILITY]
- Jobs: [JOB RESPONSIBILITY]
- Views / frontend: [VIEW LAYER RESPONSIBILITY]

## Conventions

- Use framework helpers for params, rendering, redirects, and CSRF protection.
- Keep business logic out of controllers.
- Prefer ActiveRecord APIs over raw SQL.
- Put authorization where the repo expects it.
- Follow the repo's background job and message-consumer patterns.

## Frontend

- Primary frontend tools: [HOTWIRE / REACT / VUE / TAILWIND / ETC]
- Styling rule: [TAILWIND / CSS MODULES / DESIGN SYSTEM]

## Replace With Real Examples

- Controller example: [PATH]
- Service example: [PATH]
- Job example: [PATH]
- Policy example: [PATH]