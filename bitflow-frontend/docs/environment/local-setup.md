# Frontend Local Setup

## Prerequisites

- Node.js 20+
- PNPM 9+
- Docker (optional, for backend API proxy)
- Browserslist-compatible browsers for testing

## Steps

1. Install dependencies at the repo root:
   ```bash
   pnpm install
   ```
2. Copy `.env.example` to `.env` in each app directory you plan to run (`apps/admin`, `apps/learner`).
3. Start the admin app:
   ```bash
   pnpm --filter admin dev
   ```
4. Start the learner app in another terminal:
   ```bash
   pnpm --filter learner dev
   ```
5. Point both apps at the backend dev server (default `http://localhost:8000`). Use the mock server (to be added) until API endpoints exist.

## Testing

- Run unit tests: `pnpm test`
- Run linting: `pnpm lint`
- Storybook (coming soon): `pnpm --filter @bitflow/ui storybook`

## Troubleshooting

- Delete `.next` caches if components fail to hot reload.
- Use `pnpm dev --turbo` once we enable Turborepo pipelines.
