# API Client Package

Typed client library for consuming Bitflow Nova APIs from Next.js applications.

## What's included

- TanStack Query hooks for admin and learner endpoints.
- TypeScript types derived from the OpenAPI specs.
- Environment-aware base URL resolution (`NEXT_PUBLIC_API_BASE_URL`).

## Usage

```tsx
import { useAdminDashboard, useOperationsAlerts } from '@bitflow/api-client/admin';
import { useLearnerDashboard } from '@bitflow/api-client/learner';

function AdminDashboard() {
  const { data, isLoading } = useAdminDashboard();
  const { data: alerts } = useOperationsAlerts();
  
  if (isLoading) return <p>Loading...</p>;
  return <div>{data.welcome.operatorName}</div>;
}
```

## Scripts

```bash
pnpm --filter @bitflow/api-client build   # bundle with tsup
pnpm --filter @bitflow/api-client lint    # lint TypeScript sources
pnpm --filter @bitflow/api-client test    # run unit tests
```

## Next steps

- Generate types directly from OpenAPI specs using `openapi-typescript`.
- Add mutation hooks for POST/PATCH/DELETE operations.
- Wire error boundaries and retry policies.
