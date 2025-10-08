# Local Development Setup

## Prerequisites

- PHP 8.3+
- Composer 2.7+
- Node.js 20+ and PNPM 9+
- Docker Desktop 4+
- mkcert (for HTTPS locally)
- GNU Make (optional but recommended)

## Steps

1. Copy `.env.example` to `.env` and adjust the values for your machine.
2. Start infrastructure dependencies:
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```
3. Install PHP dependencies:
   ```bash
   composer install
   ```
4. Run database migrations once the Laravel skeleton is added:
   ```bash
   php artisan migrate --seed
   ```
5. Boot the application server:
   ```bash
   php artisan serve
   ```
6. Optionally run the queue worker and scheduler in separate terminals.

## Troubleshooting

- **MySQL connection refused** – ensure the container is healthy and that the `.env` DB credentials match `docker-compose.dev.yml`.
- **Queue jobs stuck** – confirm Redis is reachable and queue workers are running (`php artisan horizon`).
- **File uploads fail** – set `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY` to the local MinIO credentials.
