# Sprint Zero Backlog

## Epics

1. **Tenant Core Foundation**
   - Tenant context middleware
   - Role & permission seeding
   - Audit logging skeleton

2. **RBAC Seed & Security Guardrails**
   - Permission catalog CSV
   - Seeder commands
   - Policy scaffolding and middleware tests

3. **Feature Toggle MVP**
   - Feature catalog models
   - Change request endpoints
   - Config distribution API stub

4. **University Super Admin UI Skeleton**
   - Dashboard layout + widgets with mock data
   - Colleges management pages
   - Approvals queue view

5. **College Admin & Student Dashboards**
   - College admin layout shell
   - Student dashboard components (notices, upcoming lectures, quick links)
   - Shared component primitives (cards, tables)

## User stories

### Tenant context middleware
- **As** a backend engineer
- **I want** every request to resolve university and college scope automatically
- **So that** data isolation is enforced without duplicating filters.
- **Acceptance criteria:**
  - Middleware extracts tenant from host header or request header.
  - Requests without valid tenant return 404.
  - Unit tests cover success, missing tenant, inactive tenant.

### Permission seeding command
- **As** a deployment engineer
- **I want** a command to seed default roles and permissions
- **So that** new environments are ready with one command.
- **Acceptance criteria:**
  - `php artisan bitflow:seed-permissions` seeds roles, permissions, role->permission mapping.
  - Command is idempotent.
  - CSV import path configurable.

### Feature change request API
- **As** a university super admin
- **I want** to submit feature toggle changes for approval
- **So that** admin workflows are audited.
- **Acceptance criteria:**
  - POST `/api/features/change-request` stores request with pending status.
  - Validation ensures dependencies satisfied.
  - Audit log records actor and payload.

### University Super Admin dashboard skeleton
- **As** a frontend developer
- **I want** a dashboard layout with widgets bound to mock data
- **So that** we can iterate with backend later.
- **Acceptance criteria:**
  - Layout uses design tokens (grid, typography).
  - Widgets render placeholder metrics from mocked API client.
  - Unit tests assert widgets render expected labels.

### Student dashboard quick links
- **As** a student
- **I want** quick links to notes and video lectures from the dashboard
- **So that** I can immediately access critical resources.
- **Acceptance criteria:**
  - Quick link component accepts subject name, resource count, CTA.
  - Grid responsive for desktop/tablet/mobile.
  - A/B tests behind feature flag stub.

## API definition drafts

- `GET /api/tenants/me` → returns university + college metadata for current session.
- `POST /api/features/change-request` → creates a feature toggle request (schema TBD after ADR).
- `GET /api/feature-config/current` → returns effective feature states for the session (used by frontend).

API payload schemas live in `docs/product/api-contracts.md`.

## UI assets

- University Super Admin dashboard wireframe → `docs/design/admin-dashboard-v1.png` (to upload from Figma).
- Student dashboard wireframe → `docs/design/student-dashboard-v1.png`.
