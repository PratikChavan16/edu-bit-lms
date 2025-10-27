# College Accounts Admin Portal - Build & Deployment Guide

**Build System**: Docker + CI/CD (GitHub Actions)  
**Environments**: Local → Development → Staging → Production  
**Zero-Downtime Deployment**: Blue-Green strategy

---

## Table of Contents
1. [Local Development Setup](#1-local-development-setup)
2. [Docker Configuration](#2-docker-configuration)
3. [Build Process](#3-build-process)
4. [CI/CD Pipeline](#4-cicd-pipeline)
5. [Deployment Strategies](#5-deployment-strategies)
6. [Environment Management](#6-environment-management)
7. [Monitoring & Health Checks](#7-monitoring--health-checks)

---

## 1. Local Development Setup

### 1.1 Prerequisites

**Required Software**:
```bash
# Backend
PHP 8.2+
Composer 2.6+
PostgreSQL 16+
Redis 7.2+

# Frontend
Node.js 20+
npm 10+

# Tools
Docker 24+ & Docker Compose 2.20+
Git 2.40+
```

### 1.2 Backend Setup

**Step 1: Clone Repository**
```bash
git clone https://github.com/your-org/edu-bit-lms.git
cd edu-bit-lms/portals/college-accounts-admin
```

**Step 2: Install Dependencies**
```bash
composer install
```

**Step 3: Environment Configuration**
```bash
cp .env.example .env
```

**`.env` Configuration**:
```env
APP_NAME="College Accounts Admin"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=lms_accounts_dev
DB_USERNAME=postgres
DB_PASSWORD=postgres

REDIS_HOST=localhost
REDIS_PASSWORD=null
REDIS_PORT=6379

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

# Payment Gateway (Sandbox)
PAYMENT_GATEWAY_URL=https://sandbox.razorpay.com
PAYMENT_GATEWAY_KEY=rzp_test_xxxxx
PAYMENT_GATEWAY_SECRET=xxxxx

# AWS S3 for Receipts
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=ap-south-1
AWS_BUCKET=lms-receipts-dev

# Mail
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_ENCRYPTION=null
```

**Step 4: Generate Application Key**
```bash
php artisan key:generate
```

**Step 5: Run Migrations & Seeders**
```bash
php artisan migrate:fresh --seed
```

**Step 6: Start Development Server**
```bash
php artisan serve
# Server running at http://localhost:8000
```

**Step 7: Start Queue Worker (separate terminal)**
```bash
php artisan queue:work --tries=3 --timeout=60
```

### 1.3 Frontend Setup

**Step 1: Navigate to Frontend Directory**
```bash
cd frontend
```

**Step 2: Install Dependencies**
```bash
npm install
```

**Step 3: Environment Configuration**
```bash
cp .env.local.example .env.local
```

**`.env.local` Configuration**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME=College Accounts Admin
NEXT_PUBLIC_ENV=development
```

**Step 4: Start Development Server**
```bash
npm run dev
# Server running at http://localhost:3000
```

### 1.4 Database Setup with Docker (Alternative)

**docker-compose.dev.yml**:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    container_name: lms-postgres-dev
    environment:
      POSTGRES_DB: lms_accounts_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7.2-alpine
    container_name: lms-redis-dev
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  mailhog:
    image: mailhog/mailhog:latest
    container_name: lms-mailhog
    ports:
      - "1025:1025" # SMTP
      - "8025:8025" # Web UI
    logging:
      driver: none

volumes:
  postgres_data:
```

**Start Services**:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

---

## 2. Docker Configuration

### 2.1 Backend Dockerfile

**File**: `Dockerfile.backend`

```dockerfile
# Multi-stage build for optimized production image

# Stage 1: Dependencies
FROM php:8.2-fpm-alpine AS dependencies

RUN apk add --no-cache \
    postgresql-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    unzip \
    git

RUN docker-php-ext-install pdo pdo_pgsql pgsql gd

COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Stage 2: Application
FROM php:8.2-fpm-alpine

RUN apk add --no-cache \
    postgresql-libs \
    libpng \
    libjpeg-turbo \
    freetype

RUN docker-php-ext-install pdo pdo_pgsql pgsql gd opcache

WORKDIR /app

COPY --from=dependencies /app/vendor /app/vendor
COPY . .

RUN composer dump-autoload --optimize --no-dev

# Optimize Laravel
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# Set permissions
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache

USER www-data

EXPOSE 9000

CMD ["php-fpm"]
```

### 2.2 Frontend Dockerfile

**File**: `Dockerfile.frontend`

```dockerfile
# Multi-stage build

# Stage 1: Dependencies
FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

# Stage 3: Production
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

USER node

EXPOSE 3000

CMD ["npm", "start"]
```

### 2.3 Docker Compose for Production

**File**: `docker-compose.yml`

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    container_name: accounts-backend
    restart: unless-stopped
    environment:
      - APP_ENV=production
      - DB_HOST=postgres
      - REDIS_HOST=redis
    volumes:
      - storage:/app/storage
    depends_on:
      - postgres
      - redis
    networks:
      - lms-network
    healthcheck:
      test: ["CMD", "php", "artisan", "health:check"]
      interval: 30s
      timeout: 10s
      retries: 3

  queue-worker:
    build:
      context: .
      dockerfile: Dockerfile.backend
    container_name: accounts-queue-worker
    restart: unless-stopped
    command: php artisan queue:work --sleep=3 --tries=3 --max-time=3600
    environment:
      - APP_ENV=production
      - DB_HOST=postgres
      - REDIS_HOST=redis
    volumes:
      - storage:/app/storage
    depends_on:
      - postgres
      - redis
    networks:
      - lms-network

  scheduler:
    build:
      context: .
      dockerfile: Dockerfile.backend
    container_name: accounts-scheduler
    restart: unless-stopped
    command: sh -c "while true; do php artisan schedule:run --verbose --no-interaction & sleep 60; done"
    environment:
      - APP_ENV=production
    depends_on:
      - postgres
      - redis
    networks:
      - lms-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.frontend
      args:
        NEXT_PUBLIC_API_URL: https://api.edubit.com
    container_name: accounts-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    networks:
      - lms-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgres:16-alpine
    container_name: accounts-postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${DB_DATABASE}
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - lms-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USERNAME}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7.2-alpine
    container_name: accounts-redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    networks:
      - lms-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  nginx:
    image: nginx:1.25-alpine
    container_name: accounts-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - storage:/app/storage:ro
    depends_on:
      - backend
      - frontend
    networks:
      - lms-network

volumes:
  postgres_data:
  redis_data:
  storage:

networks:
  lms-network:
    driver: bridge
```

---

## 3. Build Process

### 3.1 Backend Build Script

**File**: `scripts/build-backend.sh`

```bash
#!/bin/bash
set -e

echo "🔨 Building College Accounts Admin Backend..."

# Install dependencies
echo "📦 Installing dependencies..."
composer install --optimize-autoloader --no-dev --prefer-dist

# Clear caches
echo "🧹 Clearing caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Optimize
echo "⚡ Optimizing..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Static analysis
echo "🔍 Running static analysis..."
./vendor/bin/phpstan analyse --level=8 --memory-limit=1G

# Tests
echo "🧪 Running tests..."
./vendor/bin/phpunit --coverage-text --coverage-clover=coverage.xml

echo "✅ Backend build complete!"
```

### 3.2 Frontend Build Script

**File**: `frontend/scripts/build.sh`

```bash
#!/bin/bash
set -e

echo "🔨 Building College Accounts Admin Frontend..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Lint
echo "🔍 Linting..."
npm run lint

# Type check
echo "📝 Type checking..."
npm run type-check

# Build
echo "🏗️ Building..."
npm run build

echo "✅ Frontend build complete!"
```

---

## 4. CI/CD Pipeline

### 4.1 GitHub Actions Workflow

**File**: `.github/workflows/deploy.yml`

```yaml
name: Build and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test-backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: lms_test
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
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
          php-version: '8.2'
          extensions: pgsql, pdo_pgsql, redis
          coverage: xdebug

      - name: Install Dependencies
        run: composer install --prefer-dist --no-progress

      - name: Copy .env
        run: cp .env.testing .env

      - name: Generate Key
        run: php artisan key:generate

      - name: Run Migrations
        run: php artisan migrate --seed

      - name: Run Tests
        run: vendor/bin/phpunit --coverage-clover=coverage.xml

      - name: Upload Coverage
        uses: codecov/codecov-action@v3

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install Dependencies
        working-directory: ./frontend
        run: npm ci

      - name: Lint
        working-directory: ./frontend
        run: npm run lint

      - name: Type Check
        working-directory: ./frontend
        run: npm run type-check

      - name: Build
        working-directory: ./frontend
        run: npm run build

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Snyk Security Scan
        uses: snyk/actions/php@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  build-and-push:
    needs: [test-backend, test-frontend, security-scan]
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract Metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}

      - name: Build and Push Backend
        uses: docker/build-push-action@v5
        with:
          context: .
          file: Dockerfile.backend
          push: true
          tags: ${{ steps.meta.outputs.tags }}-backend
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build and Push Frontend
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          file: Dockerfile.frontend
          push: true
          tags: ${{ steps.meta.outputs.tags }}-frontend
          build-args: |
            NEXT_PUBLIC_API_URL=${{ secrets.API_URL }}

  deploy-staging:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
      - name: Deploy to Staging
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /var/www/college-accounts-admin
            docker-compose pull
            docker-compose up -d
            docker-compose exec backend php artisan migrate --force

  deploy-production:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Deploy to Production (Blue-Green)
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /var/www/college-accounts-admin
            ./scripts/blue-green-deploy.sh
```

---

## 5. Deployment Strategies

### 5.1 Blue-Green Deployment

**Script**: `scripts/blue-green-deploy.sh`

```bash
#!/bin/bash
set -e

BLUE_PORT=8000
GREEN_PORT=8001
HEALTH_CHECK_URL="http://localhost"

# Determine current active environment
CURRENT=$(curl -s http://localhost/health | jq -r '.environment')

if [ "$CURRENT" == "blue" ]; then
  DEPLOY_TO="green"
  DEPLOY_PORT=$GREEN_PORT
  SWITCH_FROM="blue"
else
  DEPLOY_TO="blue"
  DEPLOY_PORT=$BLUE_PORT
  SWITCH_FROM="green"
fi

echo "🚀 Deploying to $DEPLOY_TO environment..."

# Pull latest images
docker-compose -f docker-compose.$DEPLOY_TO.yml pull

# Start new environment
docker-compose -f docker-compose.$DEPLOY_TO.yml up -d

# Wait for health check
echo "⏳ Waiting for $DEPLOY_TO to be healthy..."
for i in {1..30}; do
  if curl -sf $HEALTH_CHECK_URL:$DEPLOY_PORT/health > /dev/null; then
    echo "✅ $DEPLOY_TO is healthy!"
    break
  fi
  sleep 2
done

# Run migrations
docker-compose -f docker-compose.$DEPLOY_TO.yml exec backend php artisan migrate --force

# Switch traffic (update load balancer)
echo "🔄 Switching traffic to $DEPLOY_TO..."
aws elbv2 modify-target-group --target-group-arn $TG_ARN --port $DEPLOY_PORT

# Wait for traffic drain
sleep 30

# Stop old environment
echo "🛑 Stopping $SWITCH_FROM environment..."
docker-compose -f docker-compose.$SWITCH_FROM.yml down

echo "✅ Deployment complete! Active environment: $DEPLOY_TO"
```

---

## 6. Environment Management

### 6.1 Environment Variables by Environment

**Development**:
```env
APP_ENV=local
APP_DEBUG=true
LOG_LEVEL=debug
CACHE_DRIVER=array
QUEUE_CONNECTION=sync
```

**Staging**:
```env
APP_ENV=staging
APP_DEBUG=true
LOG_LEVEL=info
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
PAYMENT_GATEWAY_URL=https://sandbox.razorpay.com
```

**Production**:
```env
APP_ENV=production
APP_DEBUG=false
LOG_LEVEL=error
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
PAYMENT_GATEWAY_URL=https://api.razorpay.com
```

### 6.2 Secrets Management (AWS Secrets Manager)

```bash
# Retrieve secrets
aws secretsmanager get-secret-value \
  --secret-id prod/college-accounts/db \
  --query SecretString \
  --output text | jq -r '.password'
```

---

## 7. Monitoring & Health Checks

### 7.1 Health Check Endpoint

**File**: `routes/api.php`

```php
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'environment' => config('app.env'),
        'timestamp' => now()->toIso8601String(),
        'checks' => [
            'database' => DB::connection()->getPdo() ? 'ok' : 'fail',
            'redis' => Redis::ping() === '+PONG' ? 'ok' : 'fail',
        ],
    ]);
});
```

---

*Complete build and deployment guide for College Accounts Admin portal with zero-downtime deployment strategy.*
