# Admin App

Next.js application powering the Bitflow Portal and administrator experiences.

## Tech stack

- Next.js 15 canary (App Router, server components)
- React 19 canary + TanStack Query for data access
- Tailwind CSS with shared preset from `@bitflow/ui`
- Component kit sourced from `packages/ui`
- Zod (planned) for runtime validation

## Available scripts

```bash
pnpm --filter @bitflow/admin-app dev      # start dev server on http://localhost:3000
pnpm --filter @bitflow/admin-app build    # create production build
pnpm --filter @bitflow/admin-app start    # run production build
pnpm --filter @bitflow/admin-app lint     # run lint checks
```

## Current structure

- `app/layout.tsx` – Root layout with shared shell, theme, and query providers.
- `components/app-shell.tsx` – Sidebar + header navigation shared across admin flows.
- `app/(routes)` – Placeholder pages for dashboard, feature toggles, change requests, billing, invoices, audit log, and backups per design spec.
- `app/globals.css` – Theme tokens and Tailwind base layer.

## Next steps

- Connect to live APIs once backend endpoints & feature flags are ready.
- Replace placeholder data with TanStack Query hooks hitting real services.
- Add Storybook stories for shared UI and page-level smoke tests (Playwright).
