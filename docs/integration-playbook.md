# Bitflow Nova Integration Playbook

This playbook documents the end-to-end integration between frontend and backend services for the Bitflow Nova platform.

## Architecture Overview

### Components

- **Backend (`bitflow-core`)**: Laravel 11 API server exposing RESTful endpoints defined in OpenAPI contracts.
- **Frontend (`bitflow-frontend`)**: PNPM monorepo with two Next.js 15 applications (admin, learner) and shared packages (UI, API client).
- **Contracts (`bitflow-core/docs/contracts`)**: OpenAPI 3.1 specifications serving as the source of truth for API interfaces.

### Data Flow

1. **API Request**: Frontend initiates request via TanStack Query hook (`@bitflow/api-client`).
2. **Authentication**: JWT bearer token passed in `Authorization` header (to be wired).
3. **Backend Processing**: Laravel controller validates input, invokes service layer, queries repositories.
4. **Response**: JSON payload conforming to OpenAPI schema returned to frontend.
5. **State Management**: TanStack Query caches response and manages loading/error states.

## Development Workflow

### Backend Development

1. **Contract First**: Start by authoring or updating OpenAPI spec in `bitflow-core/docs/contracts/`.
2. **Generate Types**: (Future) Use `openapi-generator` to scaffold request validators and response DTOs.
3. **Implement Controller**: Add controller method under `app/Http/Controllers/Admin` or `app/Http/Controllers/Learner`.
4. **Register Route**: Update `routes/api.php` to wire the endpoint.
5. **Write Tests**: Add feature test in `tests/Feature/` directory.
6. **Run Tests**: Execute `composer test` (or `phpunit`) to validate.

### Frontend Development

1. **Update Types**: Synchronize `@bitflow/api-client/src/types.ts` with backend contract changes.
2. **Create Hook**: Add TanStack Query hook in `packages/api-client/src/admin/` or `learner/`.
3. **Consume Hook**: Import hook in Next.js page component and render UI based on query state.
4. **Add Tests**: Write component tests using React Testing Library.
5. **Lint & Format**: Run `pnpm lint` and `pnpm format` before committing.

## Local Environment Setup

### Prerequisites

- **Node.js**: 22.20.0 (portable install under `D:\LMS\.tools\node-v22.20.0\node-v22.20.0-win-x64`; added to user PATH).
- **PNPM**: 9.0.0+ (enabled via Corepack).
- **PHP**: 8.3+ with Composer (for backend).
- **Docker**: (Optional) For local database and Redis stack.

### Backend Setup

```bash
cd D:\LMS\bitflow-core
composer install
cp .env.example .env  # Configure database & secrets
# php artisan migrate  # Once Laravel skeleton fully wired
composer test
```

### Frontend Setup

```bash
cd D:\LMS\bitflow-frontend
pnpm install
pnpm lint
pnpm --filter @bitflow/ui test
```

### Running Development Servers

**Backend:**
```bash
cd D:\LMS\bitflow-core
php artisan serve  # Starts at http://localhost:8000
```

**Frontend (Admin Portal):**
```bash
cd D:\LMS\bitflow-frontend
pnpm --filter @bitflow/admin-app dev  # Starts at http://localhost:3000
```

**Frontend (Learner Portal):**
```bash
pnpm --filter @bitflow/learner-app dev  # Starts at http://localhost:3001
```

## API Endpoint Inventory

### Admin Portal

| Method | Endpoint | Controller | Status |
|--------|----------|------------|--------|
| GET | `/admin/dashboard` | `Admin\DashboardController::index` | ✅ Implemented |
| GET | `/admin/operations/alerts` | `Admin\OperationsAlertsController::index` | ✅ Implemented |
| GET | `/admin/universities` | `Admin\UniversitiesController::index` | ✅ Implemented |
| GET | `/admin/universities/{id}` | `Admin\UniversitiesController::show` | ✅ Implemented |
| GET | `/admin/feature-toggles` | `Admin\FeatureTogglesController::index` | ✅ Implemented |
| POST | `/admin/feature-toggles` | `Admin\FeatureTogglesController::store` | ✅ Implemented |
| PATCH | `/admin/feature-toggles/{code}` | `Admin\FeatureTogglesController::update` | ✅ Implemented |

*(Additional endpoints tracked in `bitflow-core/docs/backend-implementation.md`.)*

### Learner Portal

| Method | Endpoint | Controller | Status |
|--------|----------|------------|--------|
| GET | `/learner/dashboard` | `Learner\DashboardController::index` | ✅ Implemented |

*(Additional endpoints tracked in `bitflow-core/docs/backend-implementation.md`.)*

## Testing Strategy

### Backend Tests

- **Unit Tests**: Service layer logic with mocked repositories.
- **Feature Tests**: HTTP request/response validation using `TestCase::getJson()`.
- **Integration Tests**: End-to-end flows with seeded database.

**Run:**
```bash
cd bitflow-core
composer test
```

### Frontend Tests

- **Component Tests**: React Testing Library for UI component behavior.
- **Unit Tests**: Vitest for utility functions and hooks.
- **E2E Tests**: (Planned) Playwright for critical user journeys.

**Run:**
```bash
cd bitflow-frontend
pnpm test
```

## Deployment Checklist

- [ ] Contracts reviewed and approved by both squads.
- [ ] Backend tests passing (`composer test`).
- [ ] Frontend linting passing (`pnpm lint`).
- [ ] Frontend tests passing (`pnpm test`).
- [ ] Environment variables configured for staging/production.
- [ ] Database migrations executed on target environment.
- [ ] API endpoints smoke-tested via Postman/Insomnia.
- [ ] Frontend build succeeds (`pnpm build`).
- [ ] Deployment logs reviewed for errors.
- [ ] Monitoring alerts configured (CloudWatch, Sentry).

## Troubleshooting

### Backend Issues

**500 Internal Server Error:**
- Check Laravel logs in `storage/logs/laravel.log`.
- Verify `.env` database credentials.
- Ensure migrations have run.

**404 Not Found:**
- Confirm route is registered in `routes/api.php`.
- Check HTTP method matches OpenAPI spec.

### Frontend Issues

**TypeScript Errors:**
- Run `pnpm install` to sync dependencies.
- Ensure `@bitflow/api-client` types match backend responses.

**API Request Failing:**
- Verify `NEXT_PUBLIC_API_BASE_URL` in `.env.local`.
- Check CORS headers on backend (allow frontend origin).
- Inspect Network tab in browser DevTools.

## Communication & Handoff

### Squad Responsibilities

- **Backend Squad**: Owns `bitflow-core`, maintains OpenAPI contracts, implements controllers/services, writes PHPUnit tests.
- **Frontend Squad**: Owns `bitflow-frontend`, consumes contracts via `@bitflow/api-client`, builds UI components, writes Vitest/Playwright tests.

### Change Protocol

1. **Breaking Changes**: Must be communicated 48 hours in advance with migration guide.
2. **Contract Updates**: Backend squad updates OpenAPI spec → Frontend squad syncs types.
3. **Code Reviews**: Require approval from one engineer from each squad for cross-stack PRs.
4. **Demo Sessions**: Weekly sync to showcase integrated features and unblock dependencies.

## Next Steps

- [ ] Wire authentication middleware and JWT validation.
- [ ] Add Storybook for shared UI component catalog.
- [ ] Configure Playwright E2E test suite.
- [ ] Set up CI/CD pipelines (GitHub Actions).
- [ ] Implement feature flag service integration.
- [ ] Add monitoring dashboards (APM, error tracking).

---

**Document Version**: 1.0  
**Last Updated**: October 7, 2025  
**Maintainers**: Platform Team
