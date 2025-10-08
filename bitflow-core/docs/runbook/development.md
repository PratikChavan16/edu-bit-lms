# Development Runbook

## Branching strategy

We will start with trunk-based development while the team is small:

- `main` stays stable and releasable. All feature branches are short-lived.
- Feature branches use the pattern `feat/<area>-<summary>` and rebase onto `main` daily.
- Use draft PRs early; convert to ready once CI passes and reviews are addressed.
- Hotfixes branch from `main` with `hotfix/<ticket>` and are merged back into `main` (and release branches if created later).

If velocity or stability requires, we can introduce a `release/<version>` branch per client deployment.

## Coding standards

- Follow PSR-12 with additional Slevomat rules (see `phpcs.xml.dist`).
- Require typed properties, nullable types where appropriate, and no facades in domain services.
- Keep controllers thin; domain logic belongs in service classes or actions.
- Write integration tests for critical flows and unit tests for pure logic.

## Definition of done (backend)

- [ ] Acceptance criteria satisfied and demoed locally.
- [ ] Unit/integration tests added; coverage of new logic >80%.
- [ ] CI pipeline green (lint, tests, build).
- [ ] API contract updated (`docs/product/api-contracts.md`).
- [ ] Relevant ADR updated or new ADR filed.
- [ ] Observability hooks added (logs, metrics) for new features.
- [ ] Feature flag / configuration documented if applicable.

## PR process

1. Open draft PR linked to Jira ticket.
2. Ensure pre-commit hooks run clean (`composer lint`, `composer test`).
3. Request review from at least one backend engineer and one frontend engineer when API changes occur.
4. Address comments promptly; re-request review after major changes.
5. Squash & merge once approved and CI passes.

## Release checklist (backend)

- [ ] Migrations reviewed and reversible.
- [ ] Feature flags defaulted safely.
- [ ] Secrets present in target Secrets Manager path.
- [ ] Rollback plan documented (DB snapshot, toggle to disable feature).
