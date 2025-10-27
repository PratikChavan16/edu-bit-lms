# Super Academics Portal - Build & Deployment Guide

## Overview
Complete guide for building, testing, and deploying the Super Academics portal from local development to production environments using Docker, CI/CD pipelines, and modern DevOps practices.

---

## Table of Contents
1. [Local Development Setup](#1-local-development-setup)
2. [Docker Configuration](#2-docker-configuration)
3. [Build Process](#3-build-process)
4. [Testing Pipeline](#4-testing-pipeline)
5. [CI/CD Configuration](#5-cicd-configuration)
6. [Deployment Strategies](#6-deployment-strategies)
7. [Environment Management](#7-environment-management)
8. [Monitoring & Observability](#8-monitoring--observability)

---

## 1. Local Development Setup

### 1.1 Prerequisites

**Required Software**:
- **PHP**: 8.2 or higher
- **Composer**: 2.6+
- **Node.js**: 18.x or 20.x LTS
- **PostgreSQL**: 16.x
- **Redis**: 7.2+
- **Git**: Latest version
- **Docker Desktop**: 24.x (optional but recommended)

**System Requirements**:
- RAM: 8GB minimum, 16GB recommended
- Disk Space: 20GB free
- OS: Windows 10/11, macOS, or Linux

### 1.2 Backend Setup (Laravel)

**Step 1: Clone Repository**
```bash
git clone https://github.com/your-org/edu-bit-lms.git
cd edu-bit-lms/backend
```

**Step 2: Install Dependencies**
```bash
composer install
```

**Step 3: Environment Configuration**
```bash
cp .env.example .env
```

**Edit `.env` file**:
```env
APP_NAME="Super Academics Portal"
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=super_academics_dev
DB_USERNAME=postgres
DB_PASSWORD=your_password

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost

MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=

ELASTICSEARCH_HOST=localhost
ELASTICSEARCH_PORT=9200
```

**Step 4: Generate Application Key**
```bash
php artisan key:generate
```

**Step 5: Run Database Migrations**
```bash
php artisan migrate
```

**Step 6: Seed Database**
```bash
php artisan db:seed --class=RolePermissionSeeder
php artisan db:seed --class=SuperAcademicsSeeder
```

**Step 7: Create Storage Link**
```bash
php artisan storage:link
```

**Step 8: Start Development Server**
```bash
php artisan serve
```

Backend now running at: `http://localhost:8000`

**Step 9: Start Queue Worker**
```bash
php artisan queue:work
```

### 1.3 Frontend Setup (Next.js)

**Step 1: Navigate to Frontend Directory**
```bash
cd ../frontend
```

**Step 2: Install Dependencies**
```bash
npm install
```

**Step 3: Environment Configuration**
```bash
cp .env.example .env.local
```

**Edit `.env.local` file**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME=Super Academics Portal
NEXT_PUBLIC_APP_ENV=development

NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_SENTRY_DSN=

# Auth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

**Step 4: Start Development Server**
```bash
npm run dev
```

Frontend now running at: `http://localhost:3000`

### 1.4 Database Setup

**PostgreSQL Installation (Windows)**:
```powershell
# Using Chocolatey
choco install postgresql16

# Or download from: https://www.postgresql.org/download/windows/
```

**Create Database**:
```sql
CREATE DATABASE super_academics_dev;
CREATE USER super_academics WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE super_academics_dev TO super_academics;
```

**Redis Installation (Windows)**:
```powershell
# Using Chocolatey
choco install redis-64

# Or use Docker
docker run -d --name redis -p 6379:6379 redis:7.2-alpine
```

---

## 2. Docker Configuration

### 2.1 Docker Compose Setup

**File**: `docker-compose.yml`

```yaml
version: '3.9'

services:
  # Backend - Laravel API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: development
    container_name: super-academics-backend
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/var/www/html
      - backend-vendor:/var/www/html/vendor
    environment:
      - APP_ENV=local
      - APP_DEBUG=true
      - DB_HOST=postgres
      - DB_DATABASE=super_academics
      - DB_USERNAME=super_academics
      - DB_PASSWORD=secure_password
      - REDIS_HOST=redis
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_started
    networks:
      - super-academics-network
    command: php artisan serve --host=0.0.0.0 --port=8000

  # Queue Worker
  queue-worker:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: development
    container_name: super-academics-queue
    volumes:
      - ./backend:/var/www/html
      - backend-vendor:/var/www/html/vendor
    environment:
      - APP_ENV=local
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - backend
      - redis
    networks:
      - super-academics-network
    command: php artisan queue:work --sleep=3 --tries=3

  # Frontend - Next.js
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: development
    container_name: super-academics-frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - frontend-node-modules:/app/node_modules
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000/api/v1
      - NODE_ENV=development
    depends_on:
      - backend
    networks:
      - super-academics-network
    command: npm run dev

  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: super-academics-postgres
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=super_academics
      - POSTGRES_USER=super_academics
      - POSTGRES_PASSWORD=secure_password
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U super_academics"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - super-academics-network

  # Redis Cache & Queue
  redis:
    image: redis:7.2-alpine
    container_name: super-academics-redis
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - super-academics-network
    command: redis-server --appendonly yes

  # Elasticsearch
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.11.0
    container_name: super-academics-elasticsearch
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data
    networks:
      - super-academics-network

  # MailHog (Email Testing)
  mailhog:
    image: mailhog/mailhog:latest
    container_name: super-academics-mailhog
    ports:
      - "1025:1025" # SMTP
      - "8025:8025" # Web UI
    networks:
      - super-academics-network

  # Nginx (Production-like setup)
  nginx:
    image: nginx:alpine
    container_name: super-academics-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./docker/nginx/ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend
    networks:
      - super-academics-network

volumes:
  postgres-data:
  redis-data:
  elasticsearch-data:
  backend-vendor:
  frontend-node-modules:

networks:
  super-academics-network:
    driver: bridge
```

### 2.2 Backend Dockerfile

**File**: `backend/Dockerfile`

```dockerfile
# Multi-stage build for Laravel

# Stage 1: Base image
FROM php:8.2-fpm-alpine AS base

# Install system dependencies
RUN apk add --no-cache \
    postgresql-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    libzip-dev \
    git \
    curl \
    redis

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        pdo \
        pdo_pgsql \
        gd \
        zip \
        bcmath \
        opcache \
        pcntl

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files
COPY composer.json composer.lock ./

# Stage 2: Development
FROM base AS development

# Install development dependencies
RUN composer install --no-scripts --no-autoloader

# Copy application code
COPY . .

# Generate autoload files
RUN composer dump-autoload --optimize

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage

USER www-data

EXPOSE 8000

# Stage 3: Production
FROM base AS production

# Copy only necessary files
COPY --chown=www-data:www-data . .

# Install production dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Optimize Laravel
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage

USER www-data

EXPOSE 9000

CMD ["php-fpm"]
```

### 2.3 Frontend Dockerfile

**File**: `frontend/Dockerfile`

```dockerfile
# Multi-stage build for Next.js

# Stage 1: Dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build application
RUN npm run build

# Stage 3: Development
FROM node:20-alpine AS development

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Stage 4: Production
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy built assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Create non-root user
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nextjs -u 1001

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
```

### 2.4 Starting Docker Environment

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (fresh start)
docker-compose down -v
```

---

## 3. Build Process

### 3.1 Backend Build Script

**File**: `backend/scripts/build.sh`

```bash
#!/bin/bash

echo "🔨 Building Super Academics Backend..."

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Install dependencies
composer install --optimize-autoloader --no-dev

# Run migrations
php artisan migrate --force

# Seed roles and permissions
php artisan db:seed --class=RolePermissionSeeder --force

# Cache configurations
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Generate API documentation
php artisan l5-swagger:generate

echo "✅ Backend build complete!"
```

### 3.2 Frontend Build Script

**File**: `frontend/scripts/build.sh`

```bash
#!/bin/bash

echo "🔨 Building Super Academics Frontend..."

# Install dependencies
npm ci

# Run linter
npm run lint

# Run type checking
npm run type-check

# Build application
npm run build

# Generate static export (if needed)
# npm run export

echo "✅ Frontend build complete!"
```

### 3.3 Build Optimization

**Laravel Optimization**:
```bash
# Optimize autoloader
composer dump-autoload --optimize --classmap-authoritative

# Enable OPcache in production
# Edit php.ini:
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
```

**Next.js Optimization**:
```javascript
// next.config.js
module.exports = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  images: {
    domains: ['s3.amazonaws.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};
```

---

## 4. Testing Pipeline

### 4.1 Backend Testing

```bash
# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature

# Run with coverage
php artisan test --coverage --min=80

# Parallel testing
php artisan test --parallel
```

### 4.2 Frontend Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --coverage

# Run E2E tests
npx playwright test

# Run specific test file
npx playwright test tests/e2e/curriculum.spec.ts
```

### 4.3 Pre-commit Hooks

**File**: `.husky/pre-commit`

```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Backend checks
cd backend
composer validate --no-check-publish
vendor/bin/phpstan analyse --level=7
vendor/bin/php-cs-fixer fix --dry-run --diff

# Frontend checks
cd ../frontend
npm run lint
npm run type-check

echo "✅ Pre-commit checks passed!"
```

---

## 5. CI/CD Configuration

### 5.1 GitHub Actions Workflow

**File**: `.github/workflows/deploy.yml`

```yaml
name: Build and Deploy

on:
  push:
    branches: [main, staging, develop]
  pull_request:
    branches: [main, staging]

env:
  PHP_VERSION: '8.2'
  NODE_VERSION: '20'

jobs:
  # Backend Tests
  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_pass
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7.2-alpine
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
          php-version: ${{ env.PHP_VERSION }}
          extensions: mbstring, pdo, pdo_pgsql, redis
          coverage: xdebug
      
      - name: Cache Composer dependencies
        uses: actions/cache@v3
        with:
          path: backend/vendor
          key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
      
      - name: Install dependencies
        working-directory: ./backend
        run: composer install --prefer-dist --no-progress
      
      - name: Copy .env
        working-directory: ./backend
        run: cp .env.example .env
      
      - name: Generate key
        working-directory: ./backend
        run: php artisan key:generate
      
      - name: Run migrations
        working-directory: ./backend
        env:
          DB_CONNECTION: pgsql
          DB_HOST: localhost
          DB_PORT: 5432
          DB_DATABASE: test_db
          DB_USERNAME: test_user
          DB_PASSWORD: test_pass
        run: php artisan migrate
      
      - name: Run tests
        working-directory: ./backend
        run: php artisan test --coverage-clover=coverage.xml
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage.xml

  # Frontend Tests
  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        working-directory: ./frontend
        run: npm ci
      
      - name: Run linter
        working-directory: ./frontend
        run: npm run lint
      
      - name: Run type check
        working-directory: ./frontend
        run: npm run type-check
      
      - name: Run tests
        working-directory: ./frontend
        run: npm test -- --coverage
      
      - name: Install Playwright
        working-directory: ./frontend
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        working-directory: ./frontend
        run: npx playwright test
      
      - name: Upload Playwright results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: frontend/playwright-report/

  # Build Docker Images
  build-images:
    needs: [backend-tests, frontend-tests]
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: |
            your-org/super-academics-backend:${{ github.sha }}
            your-org/super-academics-backend:latest
          cache-from: type=registry,ref=your-org/super-academics-backend:latest
          cache-to: type=inline
      
      - name: Build and push frontend
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: |
            your-org/super-academics-frontend:${{ github.sha }}
            your-org/super-academics-frontend:latest
          cache-from: type=registry,ref=your-org/super-academics-frontend:latest
          cache-to: type=inline

  # Deploy to Staging
  deploy-staging:
    needs: build-images
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/staging'
    environment: staging
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to staging
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USERNAME }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /var/www/super-academics
            docker-compose pull
            docker-compose up -d
            docker-compose exec -T backend php artisan migrate --force
            docker-compose exec -T backend php artisan config:cache

  # Deploy to Production
  deploy-production:
    needs: build-images
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Deploy to production
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USERNAME }}
          key: ${{ secrets.PRODUCTION_SSH_KEY }}
          script: |
            cd /var/www/super-academics
            docker-compose pull
            docker-compose up -d --no-deps backend frontend
            docker-compose exec -T backend php artisan migrate --force
            docker-compose exec -T backend php artisan config:cache
            docker-compose exec -T backend php artisan queue:restart
```

---

## 6. Deployment Strategies

### 6.1 Blue-Green Deployment

```yaml
# docker-compose.blue-green.yml
version: '3.9'

services:
  backend-blue:
    image: your-org/super-academics-backend:blue
    container_name: backend-blue
    # ... configuration

  backend-green:
    image: your-org/super-academics-backend:green
    container_name: backend-green
    # ... configuration

  nginx-lb:
    image: nginx:alpine
    volumes:
      - ./nginx-lb.conf:/etc/nginx/nginx.conf
    depends_on:
      - backend-blue
      - backend-green
```

**Nginx Load Balancer Config**:
```nginx
upstream backend {
    server backend-blue:8000 weight=100;
    server backend-green:8000 weight=0;
}

server {
    listen 80;
    
    location / {
        proxy_pass http://backend;
    }
}
```

**Switching Traffic**:
```bash
# Test green deployment
curl http://backend-green:8000/health

# Switch traffic to green
# Update nginx config: green weight=100, blue weight=0
docker-compose exec nginx-lb nginx -s reload

# Verify and remove blue
docker-compose stop backend-blue
```

### 6.2 Rolling Deployment

```yaml
# docker-compose.rolling.yml
services:
  backend:
    image: your-org/super-academics-backend:latest
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
        order: start-first
      rollback_config:
        parallelism: 1
        delay: 5s
```

### 6.3 Canary Deployment

```bash
# Deploy canary (10% traffic)
kubectl apply -f k8s/canary-deployment.yml

# Monitor metrics for 30 minutes
# If successful, increase to 50%
kubectl patch deployment backend-canary -p '{"spec":{"replicas":5}}'

# Full rollout
kubectl apply -f k8s/production-deployment.yml
```

---

## 7. Environment Management

### 7.1 Environment Variables

**Development** (`.env.development`):
```env
APP_ENV=development
APP_DEBUG=true
LOG_LEVEL=debug
QUEUE_CONNECTION=sync
```

**Staging** (`.env.staging`):
```env
APP_ENV=staging
APP_DEBUG=true
LOG_LEVEL=info
QUEUE_CONNECTION=redis
SENTRY_ENABLE=true
```

**Production** (`.env.production`):
```env
APP_ENV=production
APP_DEBUG=false
LOG_LEVEL=warning
QUEUE_CONNECTION=redis
CACHE_DRIVER=redis
SESSION_DRIVER=redis
```

### 7.2 Secrets Management

**Using AWS Secrets Manager**:
```bash
# Store secret
aws secretsmanager create-secret \
    --name super-academics/production/db-password \
    --secret-string "super_secure_password"

# Retrieve in application
APP_KEY=$(aws secretsmanager get-secret-value \
    --secret-id super-academics/production/app-key \
    --query SecretString --output text)
```

**Using Docker Secrets**:
```yaml
services:
  backend:
    secrets:
      - db_password
      - jwt_secret

secrets:
  db_password:
    external: true
  jwt_secret:
    external: true
```

---

## 8. Monitoring & Observability

### 8.1 Health Check Endpoints

```php
// routes/api.php
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now(),
        'checks' => [
            'database' => DB::connection()->getPdo() ? 'ok' : 'fail',
            'redis' => Redis::ping() ? 'ok' : 'fail',
            'elasticsearch' => // ES health check
        ],
    ]);
});
```

### 8.2 Logging

**Laravel Logging**:
```php
// config/logging.php
'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['daily', 'sentry'],
    ],
    'sentry' => [
        'driver' => 'sentry',
        'level' => 'error',
    ],
],
```

### 8.3 Metrics Collection

**Prometheus Integration**:
```yaml
# docker-compose.monitoring.yml
services:
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    depends_on:
      - prometheus
```

---

## Quick Reference Commands

```bash
# Local Development
npm run dev              # Start frontend dev server
php artisan serve        # Start backend dev server
php artisan queue:work   # Start queue worker

# Docker
docker-compose up -d           # Start all services
docker-compose logs -f backend # View backend logs
docker-compose exec backend php artisan migrate # Run migrations

# Testing
php artisan test                # Backend tests
npm test                        # Frontend tests
npx playwright test             # E2E tests

# Build
composer install --optimize-autoloader --no-dev  # Backend production build
npm run build                                     # Frontend production build

# Deployment
git push origin main            # Triggers CI/CD pipeline
kubectl rollout status deployment/backend  # Check deployment status
```

---

*This comprehensive build and deployment guide ensures smooth development workflow and reliable production deployments for the Super Academics portal.*
