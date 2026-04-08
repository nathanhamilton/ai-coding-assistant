---
description: "Template for an RSpec testing skill. Use when: writing specs, factories, WebMock/VCR, system tests, or improving coverage."
applyTo: "spec/**/*_spec.rb"
---

# RSpec Testing Skill Template

Replace placeholders before copying this file to `.github/skills/testing/SKILL.md`.

## Test Command

- Main command: [TEST COMMAND]

## Test Stack

- RSpec: [VERSION]
- Factories: [FACTORY LIBRARY]
- Matchers: [MATCHER LIBRARIES]
- HTTP stubbing: [WEBMOCK / VCR / OTHER]
- Browser tests: [CAPYBARA / SELENIUM / OTHER]

## Conventions

- Use `rails_helper` for Rails-integrated specs.
- Mirror the production file structure in `spec/`.
- Cover happy path, invalid input, and edge cases.
- Prefer factories and helper modules already present in the repo.
- Keep stubs narrow and deterministic.

## Replace With Real Examples

- Service spec example: [PATH]
- Request or controller spec example: [PATH]
- Feature or system spec example: [PATH]
- Factory directory: [PATH]

## Common Gotchas

- [GOTCHA 1]
- [GOTCHA 2]
- [GOTCHA 3]