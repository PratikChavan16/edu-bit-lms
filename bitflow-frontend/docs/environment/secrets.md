# Handling Secrets

Frontend applications consume public environment variables at build time. Sensitive keys (e.g., analytics tokens) must be stored in the deployment platform (Vercel, Amplify, or custom CI) and never checked into source control.

## Naming conventions

Use the `NEXT_PUBLIC_` prefix for variables that can be exposed to the browser. Private variables (without the prefix) are only available on the server components / API routes.

## Deployment workflow

1. Store secrets in the deployment platform vault.
2. Reference them in the CI pipeline (`pnpm build`) via environment injection.
3. Rotate analytics keys every 90 days or when staff changes.
