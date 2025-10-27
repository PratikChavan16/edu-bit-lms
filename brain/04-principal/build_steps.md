# Principal Portal - Build & Setup Guide

Version: 2.0  
Last Updated: October 25, 2025

---

## Prerequisites

- Node.js 20+ (Next.js frontend)
- PHP 8.3+ (Laravel backend)
- PostgreSQL 16+
- Redis 7+ (cache, queues)
- Composer 2.7+
- npm/yarn/pnpm

---

## Step 1: Backend Setup (Laravel)

### 1.1 Clone Repository
```bash
git clone https://github.com/your-org/edu-bit-lms.git
cd edu-bit-lms/apps/backend
```

### 1.2 Install Dependencies
```bash
composer install
```

### 1.3 Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` (principal scope):
```env
APP_NAME="Principal Portal"
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=edu_bit_lms
DB_USERNAME=postgres
DB_PASSWORD=your_password

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

JWT_PUBLIC_KEY=storage/app/keys/jwt.key.pub
JWT_PRIVATE_KEY=storage/app/keys/jwt.key

# Observability
SENTRY_DSN=
OTEL_EXPORTER_OTLP_ENDPOINT=
```

### 1.4 Generate Keys
```bash
php artisan key:generate

# Generate RS256 key pair for JWT (if not provided by identity svc)
mkdir -p storage/app/keys
ssh-keygen -t rsa -b 4096 -m PEM -f storage/app/keys/jwt.key -N ""
openssl rsa -in storage/app/keys/jwt.key -pubout -outform PEM -out storage/app/keys/jwt.key.pub
```

### 1.5 Database Setup
```bash
# Create database (if not exists)
createdb edu_bit_lms

# Run migrations (core + principal tables)
php artisan migrate

# Seed sample data (departments, programs, sample faculty/students)
php artisan db:seed --class=PrincipalSeeder
```

### 1.6 Storage & Cache
```bash
php artisan storage:link
php artisan cache:clear && php artisan config:clear
```

### 1.7 Queue & Scheduler
```bash
# Terminal 1: queue worker
php artisan queue:work --queue=high,default,low

# Terminal 2: scheduler
php artisan schedule:work
```

### 1.8 Start Backend Server
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

Backend available at: http://localhost:8000

---

## Step 2: Frontend Setup (Next.js)

### 2.1 Navigate to Frontend
```bash
cd ../principal
```

### 2.2 Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2.3 Environment Configuration
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/principal
NEXT_PUBLIC_PORT=3004
NEXT_PUBLIC_UNIVERSITY_SLUG=prestigious-university

# Optional Analytics
NEXT_PUBLIC_GA_ID=
```

### 2.4 Start Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Frontend available at: http://localhost:3004

---

## Step 3: Initial Login

Use a principal-scoped user (issued by Identity service or seeded):
```
Email: principal@college.edu
Password: Principal@123
```

Change the password and enable 2FA on first login.

---

## Step 4: Production Build

### 4.1 Backend (Laravel)
```bash
cd apps/backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
composer dump-autoload --optimize
chmod -R 755 storage bootstrap/cache
```

### 4.2 Frontend (Next.js)
```bash
cd apps/principal
npm run build
npm run start
```

---

## Step 5: Testing

### Backend Tests
```bash
cd apps/backend
php artisan test --testsuite=Feature
```

### Frontend Tests
```bash
cd apps/principal
npm run test
npm run test:e2e
```

---

## Step 6: CI/CD (reference)

- Lint + test on PR
- Build docker images: `backend:principal`, `frontend:principal`
- Run DB migrations on deploy
- Run smoke tests (dashboard summary, finance list returns 200)

GitHub Actions matrix (pseudo):
```yaml
jobs:
	backend:
		runs-on: ubuntu-latest
		steps: [checkout, setup-php, composer install, php artisan test]
	frontend:
		runs-on: ubuntu-latest
		steps: [checkout, setup-node, npm ci, npm run build, npm run test]
```

---

## Troubleshooting

- 401 Unauthorized: verify JWT and X-University-Id/X-College-Id headers
- Empty lists: ensure seeders ran and scope (university_id/college_id) is set
- Queue jobs not running: check Redis and horizon/queue worker logs
- CORS: configure allowed origins for http://localhost:3004
