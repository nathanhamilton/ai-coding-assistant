---
description: "Template for a repo-specific Ruby skill. Use when: writing Ruby code, organizing service objects, or applying Ruby style rules."
applyTo: "**/*.rb"
---

# Ruby Skill Template

Replace placeholders before copying this file to `.github/skills/ruby/SKILL.md`.

## Runtime

- Ruby version: [RUBY VERSION]
- Lint command: [LINT COMMAND]

## Style

- Indentation: 2 spaces
- Naming: `snake_case` methods and variables, `CamelCase` constants and classes
- Prefer meaningful names over short abbreviations
- Keep comments for non-obvious logic only

## Patterns

- Service objects live in [SERVICE DIRECTORY]
- Presentation objects live in [PRESENTER DIRECTORY]
- Authorization objects live in [POLICY DIRECTORY]
- Use guard clauses to keep flow shallow
- Extract private helpers when public methods become too long

## Testing Expectations

- Public methods should have direct coverage
- Prefer factories over fixtures when the repo supports them
- Use the repository's standard test command: [TEST COMMAND]

## Replace With Real Examples

- Service example: [PATH]
- Controller or boundary example: [PATH]
- Spec example: [PATH]