# Bitflow Core

Backend foundation for the Bitflow Nova campus operating system. This repository hosts the Laravel-based APIs, multi-tenant RBAC services, background workers, and integration adapters that power every university deployment.

## Getting started

1. Install PHP 8.3+, Composer, Node.js 20+, PNPM, Docker, and Make.
2. Duplicate `.env.example` to `.env` and supply local secrets (see `docs/environment/local-setup.md`).
3. Run `composer install` and `pnpm install` (for shared tooling).
4. Boot the local stack with `docker compose -f docker-compose.dev.yml up -d`.
5. Execute database migrations once Laravel skeleton is pulled (`php artisan migrate`).

Additional architectural context and operational runbooks live under `docs/`.
