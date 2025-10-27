# Faculty/Teacher Portal - Build & Deployment Guide

**Version**: 2.0  
**Last Updated**: October 25, 2025  
**Environments**: Local, Staging, Production

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Backend Build](#backend-build)
6. [Frontend Build](#frontend-build)
7. [Docker Setup](#docker-setup)
8. [CI/CD Pipeline](#cicd-pipeline)
9. [Deployment Steps](#deployment-steps)
10. [Health Checks](#health-checks)
11. [Rollback Procedures](#rollback-procedures)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Tool | Version | Purpose |
|------|---------|---------|
| **PHP** | 8.3+ | Backend runtime |
| **Composer** | 2.7+ | PHP dependency management |
| **Node.js** | 20 LTS | Frontend runtime |
| **npm** | 10+ | Node package management |
| **PostgreSQL** | 16+ | Primary database |
| **Redis** | 7+ | Caching & queues |
| **Docker** | 24+ | Containerization |
| **Docker Compose** | 2.23+ | Multi-container orchestration |
| **Git** | 2.40+ | Version control |

### Optional Tools

- **Make**: Task automation (recommended)
- **pgAdmin**: Database management GUI
- **Redis Commander**: Redis management GUI
- **Postman**: API testing
- **VS Code**: Recommended IDE with extensions:
  - PHP Intelephense
  - Laravel Extension Pack
  - ES7+ React/Redux/React-Native snippets
  - Prettier
  - ESLint

### System Requirements

**Development Machine**:
- CPU: 4+ cores (8+ recommended)
- RAM: 8GB minimum (16GB recommended)
- Disk: 20GB free space
- OS: Windows 10/11, macOS 12+, Ubuntu 22.04+

**Production Server**:
- CPU: 8+ cores
- RAM: 32GB minimum
- Disk: 500GB SSD
- OS: Ubuntu 22.04 LTS

---

## Local Development Setup

### 1. Clone Repository

```bash
# Clone the main repository
git clone https://github.com/institution/edu-bit-lms.git
cd edu-bit-lms

# Navigate to faculty portal
cd portals/07-faculty-teacher

# Create a new branch for your work
git checkout -b feature/your-feature-name
```

### 2. Install Dependencies

#### Backend Dependencies

```bash
cd backend

# Install PHP dependencies
composer install

# Install development dependencies
composer install --dev

# Verify installation
composer check-platform-reqs
php artisan --version
```

#### Frontend Dependencies

```bash
cd frontend

# Install npm packages
npm install

# Verify installation
npm list --depth=0
node --version
npm --version
```

### 3. Start Development Servers

#### Option A: Using Docker (Recommended)

```bash
# From project root
docker-compose up -d

# Check container status
docker-compose ps

# View logs
docker-compose logs -f faculty-backend
docker-compose logs -f faculty-frontend
```

#### Option B: Manual Setup

**Terminal 1: Backend**
```bash
cd backend
php artisan serve --host=0.0.0.0 --port=3007
```

**Terminal 2: Frontend**
```bash
cd frontend
npm run dev
```

**Terminal 3: Queue Worker**
```bash
cd backend
php artisan queue:work --queue=default,emails,notifications
```

### 4. Access Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3007
- **API Docs**: http://localhost:3007/api/documentation
- **Horizon (Queue Dashboard)**: http://localhost:3007/horizon
- **Telescope (Debug)**: http://localhost:3007/telescope

---

## Environment Configuration

### Backend (.env)

```bash
# Copy example environment file
cd backend
cp .env.example .env

# Generate application key
php artisan key:generate

# Generate JWT keys
php artisan jwt:secret
```

**backend/.env Configuration**:

```env
# Application
APP_NAME="Faculty Portal"
APP_ENV=local
APP_KEY=base64:generated_key_here
APP_DEBUG=true
APP_URL=http://localhost:3007
APP_PORT=3007

# Database
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=faculty_portal_dev
DB_USERNAME=postgres
DB_PASSWORD=your_secure_password

# Redis
REDIS_HOST=localhost
REDIS_PASSWORD=null
REDIS_PORT=6379
REDIS_DB=0
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# JWT Authentication
JWT_SECRET=generated_jwt_secret
JWT_ALGO=RS256
JWT_PUBLIC_KEY_PATH=storage/oauth-public.key
JWT_PRIVATE_KEY_PATH=storage/oauth-private.key
JWT_TTL=60  # minutes

# Mail
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=noreply@institution.edu
MAIL_FROM_NAME="${APP_NAME}"

# AWS S3 (for file storage)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=faculty-portal-dev
AWS_URL=https://s3.amazonaws.com

# 2FA
TWOFACTOR_ISSUER="Institution Faculty Portal"
TWOFACTOR_ENABLED=true

# Logging
LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

# Telescope & Horizon
TELESCOPE_ENABLED=true
HORIZON_ENABLED=true
```

### Frontend (.env.local)

```bash
cd frontend
cp .env.example .env.local
```

**frontend/.env.local Configuration**:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3007/api/v1
NEXT_PUBLIC_API_TIMEOUT=30000

# Authentication
NEXT_PUBLIC_JWT_REFRESH_INTERVAL=300000  # 5 minutes in ms

# Feature Flags
NEXT_PUBLIC_OFFLINE_MODE_ENABLED=true
NEXT_PUBLIC_2FA_REQUIRED=true
NEXT_PUBLIC_FILE_UPLOAD_MAX_SIZE=10485760  # 10MB in bytes

# Analytics (optional)
NEXT_PUBLIC_GA_TRACKING_ID=UA-XXXXXXXXX-X

# Sentry (optional)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
SENTRY_AUTH_TOKEN=your_sentry_token

# Development
NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1
```

---

## Database Setup

### 1. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE faculty_portal_dev;

# Create user (if needed)
CREATE USER faculty_dev WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE faculty_portal_dev TO faculty_dev;

# Exit psql
\q
```

### 2. Run Migrations

```bash
cd backend

# Run all migrations
php artisan migrate

# Check migration status
php artisan migrate:status

# Rollback last migration (if needed)
php artisan migrate:rollback

# Fresh migration (caution: drops all tables)
php artisan migrate:fresh
```

### 3. Seed Database

```bash
# Run all seeders
php artisan db:seed

# Run specific seeder
php artisan db:seed --class=FacultySeeder

# Fresh migration + seeding
php artisan migrate:fresh --seed
```

### 4. Enable Row-Level Security (RLS)

```sql
-- Connect to database
psql -U postgres -d faculty_portal_dev

-- Enable RLS on attendance table
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Create policy for faculty access
CREATE POLICY faculty_attendance_access ON attendance
  FOR ALL
  TO faculty_role
  USING (
    EXISTS (
      SELECT 1 FROM course_assignments ca
      WHERE ca.course_id = attendance.course_id
      AND ca.faculty_id = current_setting('app.faculty_id')::varchar
    )
  );

-- Repeat for other tables (grades, materials, etc.)
```

### 5. Create Database Indexes

```sql
-- Performance indexes
CREATE INDEX idx_attendance_course_date ON attendance(course_id, date);
CREATE INDEX idx_grades_assessment_student ON grades(assessment_id, student_id);
CREATE INDEX idx_materials_course_created ON materials(course_id, created_at DESC);

-- Full-text search indexes
CREATE INDEX idx_students_name_search ON students USING gin(to_tsvector('english', name));
```

---

## Backend Build

### Development Mode

```bash
cd backend

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Optimize autoloader
composer dump-autoload -o

# Generate IDE helper files (optional)
php artisan ide-helper:generate
php artisan ide-helper:models
php artisan ide-helper:meta
```

### Production Build

```bash
cd backend

# Install production dependencies only
composer install --no-dev --optimize-autoloader

# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Cache events
php artisan event:cache

# Optimize
php artisan optimize

# Link storage
php artisan storage:link
```

### Run Tests

```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Unit
php artisan test --testsuite=Feature

# Run with coverage
php artisan test --coverage

# Run parallel tests (faster)
php artisan test --parallel
```

---

## Frontend Build

### Development Mode

```bash
cd frontend

# Start dev server with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Fix lint errors
npm run lint:fix
```

### Production Build

```bash
cd frontend

# Build for production
npm run build

# Analyze bundle size
npm run analyze

# Start production server (for testing)
npm run start
```

### Build Output

```
frontend/.next/
├── static/
│   ├── chunks/          # JavaScript chunks
│   ├── css/             # Compiled CSS
│   └── media/           # Optimized images
├── server/
│   ├── pages/           # Server-rendered pages
│   └── chunks/          # Server chunks
└── cache/               # Build cache
```

### Optimize Build

```typescript
// next.config.js optimization
module.exports = {
  swcMinify: true,
  compress: true,
  
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@mui/material', 'lodash'],
  },
};
```

---

## Docker Setup

### Docker Compose Configuration

**docker-compose.yml**:

```yaml
version: '3.9'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: faculty-postgres
    environment:
      POSTGRES_DB: faculty_portal_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./database/init:/docker-entrypoint-initdb.d
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - faculty-network

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: faculty-redis
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    networks:
      - faculty-network

  # Laravel Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: development
    container_name: faculty-backend
    volumes:
      - ./backend:/var/www/html
      - backend-vendor:/var/www/html/vendor
    ports:
      - "3007:3007"
    environment:
      - APP_ENV=local
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - faculty-network
    command: php artisan serve --host=0.0.0.0 --port=3007

  # Queue Worker
  queue:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: development
    container_name: faculty-queue
    volumes:
      - ./backend:/var/www/html
    environment:
      - APP_ENV=local
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis
      - backend
    networks:
      - faculty-network
    command: php artisan queue:work --tries=3 --timeout=90

  # Next.js Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: development
    container_name: faculty-frontend
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - NEXT_PUBLIC_API_URL=http://localhost:3007/api/v1
    depends_on:
      - backend
    networks:
      - faculty-network
    command: npm run dev

  # MailHog (Email testing)
  mailhog:
    image: mailhog/mailhog:latest
    container_name: faculty-mailhog
    ports:
      - "1025:1025"  # SMTP
      - "8025:8025"  # Web UI
    networks:
      - faculty-network

volumes:
  postgres-data:
  redis-data:
  backend-vendor:

networks:
  faculty-network:
    driver: bridge
```

### Backend Dockerfile

**backend/Dockerfile**:

```dockerfile
# Base stage
FROM php:8.3-fpm-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    postgresql-dev \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl

# Install PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    gd \
    zip \
    opcache

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Development stage
FROM base AS development

# Install Xdebug
RUN pecl install xdebug && docker-php-ext-enable xdebug

# Copy application
COPY . .

# Install dependencies
RUN composer install --no-interaction --no-scripts

# Set permissions
RUN chown -R www-data:www-data /var/www/html

# Production stage
FROM base AS production

# Copy application
COPY . .

# Install production dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Cache Laravel config
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# Set permissions
RUN chown -R www-data:www-data /var/www/html

# Optimize PHP for production
COPY docker/php.ini /usr/local/etc/php/conf.d/custom.ini

EXPOSE 3007

CMD ["php-fpm"]
```

### Frontend Dockerfile

**frontend/Dockerfile**:

```dockerfile
# Base stage
FROM node:20-alpine AS base

WORKDIR /app

# Dependencies stage
FROM base AS deps

COPY package*.json ./
RUN npm ci

# Development stage
FROM base AS development

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Build stage
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

RUN npm run build

# Production stage
FROM base AS production

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Commands

```bash
# Build containers
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f [service-name]

# Execute commands in container
docker-compose exec backend php artisan migrate
docker-compose exec frontend npm run build

# Stop all services
docker-compose down

# Remove volumes (caution: deletes data)
docker-compose down -v

# Rebuild specific service
docker-compose up -d --build backend
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

**.github/workflows/faculty-portal-ci.yml**:

```yaml
name: Faculty Portal CI/CD

on:
  push:
    branches: [main, develop]
    paths:
      - 'portals/07-faculty-teacher/**'
  pull_request:
    branches: [main, develop]
    paths:
      - 'portals/07-faculty-teacher/**'

env:
  BACKEND_DIR: portals/07-faculty-teacher/backend
  FRONTEND_DIR: portals/07-faculty-teacher/frontend

jobs:
  # Backend Tests
  backend-test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          extensions: mbstring, pdo_pgsql, redis, zip
          coverage: xdebug
      
      - name: Cache Composer dependencies
        uses: actions/cache@v3
        with:
          path: ${{ env.BACKEND_DIR }}/vendor
          key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
      
      - name: Install dependencies
        working-directory: ${{ env.BACKEND_DIR }}
        run: composer install --prefer-dist --no-progress
      
      - name: Copy .env
        working-directory: ${{ env.BACKEND_DIR }}
        run: cp .env.ci .env
      
      - name: Generate key
        working-directory: ${{ env.BACKEND_DIR }}
        run: php artisan key:generate
      
      - name: Run migrations
        working-directory: ${{ env.BACKEND_DIR }}
        env:
          DB_HOST: localhost
        run: php artisan migrate --force
      
      - name: Run tests
        working-directory: ${{ env.BACKEND_DIR }}
        run: php artisan test --coverage-clover coverage.xml
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ${{ env.BACKEND_DIR }}/coverage.xml
          flags: backend

  # Frontend Tests
  frontend-test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: ${{ env.FRONTEND_DIR }}/package-lock.json
      
      - name: Install dependencies
        working-directory: ${{ env.FRONTEND_DIR }}
        run: npm ci
      
      - name: Type check
        working-directory: ${{ env.FRONTEND_DIR }}
        run: npm run type-check
      
      - name: Lint
        working-directory: ${{ env.FRONTEND_DIR }}
        run: npm run lint
      
      - name: Run tests
        working-directory: ${{ env.FRONTEND_DIR }}
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ${{ env.FRONTEND_DIR }}/coverage/lcov.info
          flags: frontend
      
      - name: Build
        working-directory: ${{ env.FRONTEND_DIR }}
        run: npm run build

  # Deploy to Staging
  deploy-staging:
    needs: [backend-test, frontend-test]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2
      
      - name: Build and push Backend image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: faculty-portal-backend
          IMAGE_TAG: staging-${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG \
            -f ${{ env.BACKEND_DIR }}/Dockerfile \
            --target production \
            ${{ env.BACKEND_DIR }}
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
      
      - name: Build and push Frontend image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: faculty-portal-frontend
          IMAGE_TAG: staging-${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG \
            -f ${{ env.FRONTEND_DIR }}/Dockerfile \
            --target production \
            ${{ env.FRONTEND_DIR }}
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster faculty-portal-staging \
            --service faculty-backend \
            --force-new-deployment
          
          aws ecs update-service \
            --cluster faculty-portal-staging \
            --service faculty-frontend \
            --force-new-deployment

  # Deploy to Production
  deploy-production:
    needs: [backend-test, frontend-test]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://faculty.institution.edu
    
    steps:
      # Similar to staging deployment
      # but with production cluster and manual approval
      - uses: actions/checkout@v4
      
      # ... (similar steps as staging)
```

---

## Deployment Steps

### Staging Deployment

```bash
# 1. Pull latest code
git pull origin develop

# 2. Run migrations (with backup)
php artisan backup:run
php artisan migrate --force

# 3. Build and deploy backend
cd backend
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache
sudo systemctl restart faculty-backend.service

# 4. Build and deploy frontend
cd frontend
npm ci --production
npm run build
pm2 restart faculty-frontend

# 5. Clear caches
php artisan cache:clear
php artisan queue:restart

# 6. Run health checks
curl -f http://staging.faculty.institution.edu/api/health || exit 1
```

### Production Deployment

```bash
# Pre-deployment checklist
✓ All tests passing
✓ Code review approved
✓ Staging tested
✓ Database backup completed
✓ Rollback plan ready
✓ Stakeholders notified

# 1. Enable maintenance mode
php artisan down --message="Upgrading to v2.1.0" --retry=60

# 2. Pull latest code
git pull origin main

# 3. Install dependencies
composer install --no-dev --optimize-autoloader
npm ci --production

# 4. Run migrations
php artisan migrate --force

# 5. Build assets
npm run build

# 6. Cache everything
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# 7. Restart services
sudo systemctl restart faculty-backend.service
pm2 restart faculty-frontend

# 8. Disable maintenance mode
php artisan up

# 9. Monitor logs
tail -f storage/logs/laravel.log
pm2 logs faculty-frontend

# 10. Verify deployment
curl -f https://faculty.institution.edu/api/health
```

---

## Health Checks

### Backend Health Check Endpoint

```php
// routes/api.php
Route::get('/health', function () {
    $checks = [
        'database' => checkDatabase(),
        'redis' => checkRedis(),
        'storage' => checkStorage(),
        'queue' => checkQueue(),
    ];
    
    $healthy = collect($checks)->every(fn($check) => $check['status'] === 'ok');
    
    return response()->json([
        'status' => $healthy ? 'healthy' : 'unhealthy',
        'timestamp' => now()->toIso8601String(),
        'checks' => $checks
    ], $healthy ? 200 : 503);
});

function checkDatabase() {
    try {
        DB::connection()->getPdo();
        return ['status' => 'ok', 'latency_ms' => 5];
    } catch (\Exception $e) {
        return ['status' => 'error', 'message' => $e->getMessage()];
    }
}
```

### Frontend Health Check

```typescript
// app/api/health/route.ts
export async function GET() {
  const checks = {
    api: await checkAPI(),
    build: checkBuild(),
  };
  
  const healthy = Object.values(checks).every(c => c.status === 'ok');
  
  return Response.json({
    status: healthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    checks
  }, { status: healthy ? 200 : 503 });
}
```

---

## Rollback Procedures

### Quick Rollback

```bash
# 1. Enable maintenance mode
php artisan down

# 2. Checkout previous version
git checkout tags/v2.0.5

# 3. Rollback database (if needed)
php artisan migrate:rollback --step=1

# 4. Restore dependencies
composer install --no-dev
npm ci --production

# 5. Rebuild
php artisan config:cache
npm run build

# 6. Restart services
sudo systemctl restart faculty-backend.service
pm2 restart faculty-frontend

# 7. Disable maintenance mode
php artisan up
```

### Database Rollback

```bash
# View migration history
php artisan migrate:status

# Rollback last batch
php artisan migrate:rollback

# Rollback specific steps
php artisan migrate:rollback --step=2

# Restore from backup (if rollback fails)
pg_restore -U postgres -d faculty_portal faculty_backup_20251025.dump
```

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -U postgres -h localhost -d faculty_portal_dev

# Check .env configuration
grep DB_ .env

# Clear config cache
php artisan config:clear
```

#### 2. Redis Connection Failed

```bash
# Check Redis status
sudo systemctl status redis

# Test connection
redis-cli ping

# Check Redis configuration
redis-cli CONFIG GET maxmemory
```

#### 3. Permission Issues

```bash
# Fix storage permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

#### 4. Queue Not Processing

```bash
# Check queue status
php artisan queue:work --once

# Restart queue workers
php artisan queue:restart
sudo systemctl restart faculty-queue.service
```

#### 5. Frontend Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run type-check
```

---

**Last Updated**: October 25, 2025  
**Maintained By**: DevOps Team + Development Team  
**Support**: devops@institution.edu
