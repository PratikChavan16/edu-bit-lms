# Contributing to Bitflow Core

## Branching model

- `main`: always releasable, protected.
- `develop`: integration branch (optional if we adopt trunk-based).
- Feature branches: `feature/<short-description>`.
- Hotfix branches: `hotfix/<ticket-id>`.

## Commit conventions

Follow Conventional Commits:

```
feat(core): add tenant middleware skeleton
fix(auth): prevent inactive users from logging in
chore(ci): bump php version
```

## Pull request checklist

- [ ] Linked ticket / ADR reference.
- [ ] Unit tests covering new behavior.
- [ ] Lint (`composer lint`) and static analysis pass locally.
- [ ] Relevant docs updated (README, ADR, API contract).
- [ ] Screenshots / cURL samples included for API changes.

## Code review guidelines

- Request review from at least one backend peer and one frontend peer when APIs change.
- Block merges on failing CI, critical comments, or missing tests.
- Prefer small, incremental PRs (<500 LOC diff) with clear context.

## Local setup

See `docs/environment/local-setup.md` (to be authored during environment scaffolding) for prerequisites and common commands.
