# UI Package

Shared component library for Bitflow Nova frontends. Ships design tokens, Tailwind preset, primitive components, and providers consumed by the admin and learner apps.

## What’s included

- Tailwind preset (`@bitflow/ui/tailwind-preset`) defining colour tokens, radii, shadows, and animation utilities.
- Primitive components: buttons, badges, cards, tables, inputs, switches, timeline, chart preview stub, and layout helpers.
- Utility helpers (`cn`) + lightweight `ThemeProvider` with system/light/dark toggling.

## Scripts

```bash
pnpm --filter @bitflow/ui build   # generate dist/ bundle via tsup
pnpm --filter @bitflow/ui lint    # lint TypeScript sources
pnpm --filter @bitflow/ui test    # run component unit tests (placeholder)
```

## Next steps

- Add Storybook for visual documentation and snapshot testing.
- Expand component coverage (forms, modals, charts) and share tokens via CSS variables per tenant.
- Publish to internal registry or consume via workspace protocol in CI.
