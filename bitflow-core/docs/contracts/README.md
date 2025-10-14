# API Contracts

This folder contains the contract-first OpenAPI specifications for the Bitflow Nova platform.

## Available Specifications

- `admin-portal.openapi.yaml` — Control-plane endpoints used by Bitflow operations staff within the Bitflow Nova portal (owner/super admin portal).
- `learner-portal.openapi.yaml` — Student-facing endpoints surfaced through the learner portal.
- `auth.openapi.yaml` — Authentication endpoints for login, logout, password management.
- `files.openapi.yaml` — File upload, download, and storage management endpoints.

## Usage

Generate typed clients and server stubs using your preferred toolchain, for example:

- **Backend (Laravel)**: use [`openapi-generator`](https://github.com/OpenAPITools/openapi-generator) with the `php-laravel` generator to scaffold controllers and request validators.
- **Frontend (Next.js)**: use [`openapi-typescript`](https://github.com/drwpow/openapi-typescript) followed by [`orval`](https://github.com/anymaniax/orval) or a custom TanStack Query factory to create typed hooks.

Keep these contracts as the source of truth. Any breaking change must be communicated to both backend and frontend squads and versioned appropriately.
