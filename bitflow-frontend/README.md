# Bitflow Frontend Monorepo

PNPM-powered workspace hosting the admin and learner-facing web applications for Bitflow Nova.

## Workspace layout

- `apps/admin` – Bitflow Portal, University/College administration experience.
- `apps/learner` – Student, parent, and faculty portals.
- `packages/ui` – Shared component library, tokens, and utilities.

## Getting started

1. Install Node.js 20+, PNPM 9+, Docker, and Playwright (for e2e tests).
2. Run `pnpm install` at the repo root.
3. Copy `.env.example` to `.env` inside each app and fill API endpoints.
4. Launch the dev servers: `pnpm --filter admin dev` and `pnpm --filter learner dev`.
5. Run linting and tests before committing: `pnpm lint` + `pnpm test`.

Documentation for design systems, accessibility checklist, and UX specs live in `docs/`.
