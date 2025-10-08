# Learner App

Next.js application serving student, parent, and faculty portals.

## Tech stack

- Next.js 15 canary (App Router)
- React 19 canary + TanStack Query for data access
- Tailwind CSS with shared preset from `@bitflow/ui`
- Reusable component kit in `packages/ui`
- Future enhancements: localization + feature flags

## Available scripts

```bash
pnpm --filter @bitflow/learner-app dev      # start dev server on http://localhost:3100
pnpm --filter @bitflow/learner-app build    # production build
pnpm --filter @bitflow/learner-app start    # run built app
pnpm --filter @bitflow/learner-app lint     # lint checks
```

## Current structure

- `components/site-shell.tsx` – Responsive header/navigation shared across learner-facing portals.
- `app/dashboard` – Student dashboard with notices, timetable preview, library shortcuts, and results table.
- `app/library`, `app/documents`, `app/results`, `app/help`, `app/settings` – Placeholder flows aligned with the design spec.
- `app/providers.tsx` – TanStack Query provider hook-up.
- `app/globals.css` – Theme tokens + Tailwind base layer.

## Next steps

- Wire pages to real APIs and feature flags.
- Add localized copy + multi-tenant branding tokens.
- Introduce Playwright smoke tests per portal.
