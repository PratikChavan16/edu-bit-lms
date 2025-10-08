# Frontend Development Process

## Branching

- Trunk-based: feature branches `feat/<area>-<summary>` off `main`.
- Rebase daily and keep PRs under 400 LOC.
- Release branches only when preparing client-specific deployments.

## Coding standards

- TypeScript strict mode, no implicit `any`.
- Prefer functional components with hooks over class components.
- Styling via Tailwind CSS with design tokens from `@bitflow/ui`.
- Accessibility: WCAG 2.1 AA baseline; run axe checks before merge.

## Definition of done

- [ ] Acceptance criteria met with responsive behavior verified (desktop, tablet, mobile).
- [ ] Storybook story added/updated for each shared component.
- [ ] Unit tests (React Testing Library) and integration tests (Playwright) updated.
- [ ] Lint (`pnpm lint`) and format checks pass.
- [ ] Visual regression snapshot reviewed if component changed.
- [ ] Text copy reviewed for clarity and localization readiness.

## Pull request checklist

- Link to Jira ticket and design file.
- Include before/after screenshots or Loom for UI changes.
- Ensure feature flags documented in PR description.
- Request review from second frontend engineer; ping backend when API contracts changed.

## Testing strategy

- Unit tests: React Testing Library + Jest.
- Integration tests: Playwright focusing on critical workflows.
- Visual regression: Chromatic on Storybook stories (to be wired).
- Performance budget: Largest Contentful Paint < 1.5s on standard test device (record via Lighthouse). 
