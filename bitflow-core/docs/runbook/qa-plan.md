# QA Strategy – Sprint Zero

## Levels of testing

1. **Unit tests** – PHPUnit for services, policies, helpers.
2. **Feature tests** – Laravel HTTP tests for key endpoints (tenant resolution, feature requests).
3. **Contract tests** – Dredd or custom checks to ensure backend matches OpenAPI spec.
4. **Integration tests** – Queue workers with Redis, S3 interactions (using MinIO).
5. **Manual smoke tests** – Checklist executed on sandbox after each deploy.

## Tooling

- PHPUnit, Pest (optional) for backend.
- Playwright/Cypress for frontend (configured later).
- k6 for basic load testing (Phase 2).

## Smoke test checklist (per deploy)

- [ ] Login as Bitflow admin succeeds.
- [ ] University Super Admin dashboard loads with mock metrics.
- [ ] Feature toggle change request can be submitted and appears in approvals queue.
- [ ] College Admin dashboard renders student list from seed data.
- [ ] Student dashboard shows notices and upcoming lectures (mocked).
- [ ] API `/api/tenants/me` returns correct tenant info.
- [ ] Queue worker processes a dummy job without errors.

## Defect triage

- Severity P0 (system down) – fix immediately, hotfix branch.
- Severity P1 (major feature broken) – fix within same sprint.
- Severity P2 (minor) – schedule in backlog.

## Reporting

- Run automated test suite in CI (required to merge).
- Maintain QA dashboard in Notion/Jira with pass/fail status per build.
