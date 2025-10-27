# College Admin Portal - Build & Deployment Guide

## Overview
Comprehensive guide for building, testing, and deploying the College Admin portal across development, staging, and production environments. Includes Docker containerization, CI/CD pipeline setup, and infrastructure configuration.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Configuration](#docker-configuration)
4. [Build Process](#build-process)
5. [Testing Pipeline](#testing-pipeline)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Deployment Strategy](#deployment-strategy)
8. [Environment Configuration](#environment-configuration)
9. [Monitoring & Logging](#monitoring--logging)
10. [Troubleshooting](#troubleshooting)

---

## 1. Prerequisites

### Required Software

#### Backend Development
```bash
# PHP 8.2 or higher
php --version  # Should be >= 8.2

# Composer 2.6+
composer --version

# PostgreSQL 16
psql --version

# Redis 7.2
redis-cli --version
```

#### Frontend Development
```bash
# Node.js 20.x LTS
node --version  # Should be v20.x

# npm 10.x
npm --version

# pnpm (recommended)
npm install -g pnpm
pnpm --version
```

#### DevOps Tools
```bash
# Docker 24.x
docker --version

# Docker Compose 2.x
docker-compose --version

# Git 2.40+
git --version
```

### System Requirements

**Development Machine**:
- CPU: 4 cores minimum (8 cores recommended)
- RAM: 8GB minimum (16GB recommended)
- Storage: 50GB free space
- OS: Linux (Ubuntu 22.04), macOS (Ventura+), or Windows 11 with WSL2

**Production Server**:
- CPU: 8 cores minimum
- RAM: 32GB minimum
- Storage: 500GB SSD
- OS: Ubuntu 22.04 LTS

---

## 2. Local Development Setup

### 2.1 Clone Repository

```bash
# Clone the repository
git clone https://github.com/your-org/edu-bit-lms.git
cd edu-bit-lms

# Checkout the correct branch
git checkout main

# Pull latest changes
git pull origin main
```

### 2.2 Backend Setup (Laravel)

```bash
# Navigate to backend directory
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
# DB_CONNECTION=pgsql
# DB_HOST=localhost
# DB_PORT=5432
# DB_DATABASE=edubit_college_admin_dev
# DB_USERNAME=postgres
# DB_PASSWORD=your_password

# Create database
createdb edubit_college_admin_dev

# Run migrations
php artisan migrate

# Seed database with test data
php artisan db:seed --class=DevelopmentSeeder

# Install Passport for OAuth
php artisan passport:install

# Generate IDE helper (optional but recommended)
php artisan ide-helper:generate
php artisan ide-helper:models --nowrite
```

### 2.3 Frontend Setup (Next.js)

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env.local

# Configure API endpoint
# NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
# NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Run development server
pnpm dev
```

### 2.4 Start Development Servers

**Terminal 1 - Backend**:
```bash
cd backend
php artisan serve --host=localhost --port=8000
```

**Terminal 2 - Queue Worker**:
```bash
cd backend
php artisan queue:work --tries=3
```

**Terminal 3 - Frontend**:
```bash
cd frontend
pnpm dev
```

**Access Applications**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

---

## 3. Docker Configuration

### 3.1 Docker Compose Setup

**File**: `docker-compose.yml`

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: edubit_postgres
    environment:
      POSTGRES_DB: edubit_college_admin
      POSTGRES_USER: edubit_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      PGDATA: /var/lib/postgresql/data/pgdata
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - edubit_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U edubit_user -d edubit_college_admin"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7.2-alpine
    container_name: edubit_redis
    command: redis-server --requirepass ${REDIS_PASSWORD} --appendonly yes
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - edubit_network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # Laravel Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      args:
        - PHP_VERSION=8.2
    container_name: edubit_backend
    working_dir: /var/www/html
    environment:
      - APP_ENV=${APP_ENV}
      - APP_DEBUG=${APP_DEBUG}
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_DATABASE=edubit_college_admin
      - DB_USERNAME=edubit_user
      - DB_PASSWORD=${DB_PASSWORD}
      - REDIS_HOST=redis
      - REDIS_PASSWORD=${REDIS_PASSWORD}
    ports:
      - "8000:8000"
    volumes:
      - ./backend:/var/www/html
      - ./backend/storage:/var/www/html/storage
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - edubit_network
    command: php artisan serve --host=0.0.0.0 --port=8000

  # Queue Worker
  queue:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: edubit_queue
    working_dir: /var/www/html
    environment:
      - APP_ENV=${APP_ENV}
      - DB_HOST=postgres
      - REDIS_HOST=redis
    volumes:
      - ./backend:/var/www/html
    depends_on:
      - backend
      - redis
    networks:
      - edubit_network
    command: php artisan queue:work --tries=3 --timeout=90

  # Next.js Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        - NODE_VERSION=20
    container_name: edubit_frontend
    working_dir: /app
    environment:
      - NODE_ENV=${NODE_ENV}
      - NEXT_PUBLIC_API_URL=http://backend:8000/api/v1
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    depends_on:
      - backend
    networks:
      - edubit_network
    command: npm run dev

  # Nginx Reverse Proxy
  nginx:
    image: nginx:1.25-alpine
    container_name: edubit_nginx
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
      - edubit_network

volumes:
  postgres_data:
  redis_data:

networks:
  edubit_network:
    driver: bridge
```

### 3.2 Backend Dockerfile

**File**: `backend/Dockerfile`

```dockerfile
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    postgresql-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    zip \
    unzip \
    git \
    curl \
    icu-dev \
    oniguruma-dev \
    libxml2-dev \
    bash

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
    pdo \
    pdo_pgsql \
    gd \
    mbstring \
    xml \
    intl \
    opcache \
    pcntl \
    bcmath

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install dependencies
RUN composer install --optimize-autoloader --no-dev

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Optimize for production
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
```

### 3.3 Frontend Dockerfile

**File**: `frontend/Dockerfile`

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

RUN corepack enable pnpm && pnpm build

# Production image
FROM base AS runner
WORKDIR /app

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

### 3.4 Start Docker Environment

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (clean slate)
docker-compose down -v
```

---

## 4. Build Process

### 4.1 Backend Build

```bash
# Navigate to backend directory
cd backend

# Install production dependencies
composer install --optimize-autoloader --no-dev

# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Generate optimized autoload files
composer dump-autoload --optimize

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations (production)
php artisan migrate --force

# Generate API documentation
php artisan l5-swagger:generate
```

### 4.2 Frontend Build

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
pnpm install --frozen-lockfile

# Run type checking
pnpm tsc --noEmit

# Run linting
pnpm lint

# Build for production
pnpm build

# Test production build locally
pnpm start
```

### 4.3 Asset Optimization

```bash
# Backend: Optimize images
cd backend/public
find . -name "*.png" -exec optipng -o7 {} \;
find . -name "*.jpg" -exec jpegoptim --max=85 {} \;

# Frontend: Already optimized by Next.js Image component
# Verify build output
cd frontend
ls -lh .next/static

# Check bundle size
pnpm analyze
```

---

## 5. Testing Pipeline

### 5.1 Backend Testing

```bash
cd backend

# Run unit tests
php artisan test --testsuite=Unit

# Run feature tests
php artisan test --testsuite=Feature

# Run all tests with coverage
php artisan test --coverage --min=80

# Run PHPStan static analysis
./vendor/bin/phpstan analyse --level=8

# Run PHP CS Fixer
./vendor/bin/php-cs-fixer fix --dry-run --diff

# Run security check
composer audit
```

### 5.2 Frontend Testing

```bash
cd frontend

# Run unit tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run E2E tests
pnpm playwright test

# Run E2E tests with UI
pnpm playwright test --ui

# Run type checking
pnpm type-check

# Run linting
pnpm lint

# Run security audit
pnpm audit
```

### 5.3 Integration Testing

```bash
# Start test environment
docker-compose -f docker-compose.test.yml up -d

# Run integration tests
cd backend
php artisan test --testsuite=Integration

# Run API tests with Postman/Newman
newman run tests/postman/college-admin-api.json \
  --environment tests/postman/test-environment.json

# Cleanup
docker-compose -f docker-compose.test.yml down
```

---

## 6. CI/CD Pipeline

### 6.1 GitHub Actions Workflow

**File**: `.github/workflows/deploy.yml`

```yaml
name: Build and Deploy

on:
  push:
    branches: [main, staging, develop]
  pull_request:
    branches: [main]

env:
  PHP_VERSION: '8.2'
  NODE_VERSION: '20'

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testing
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7.2
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: ${{ env.PHP_VERSION }}
          extensions: pdo, pdo_pgsql, redis, mbstring, xml, bcmath
          coverage: xdebug

      - name: Cache Composer dependencies
        uses: actions/cache@v3
        with:
          path: backend/vendor
          key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
          restore-keys: ${{ runner.os }}-composer-

      - name: Install dependencies
        working-directory: ./backend
        run: composer install --prefer-dist --no-progress

      - name: Copy .env
        working-directory: ./backend
        run: |
          cp .env.testing .env
          php artisan key:generate

      - name: Run tests
        working-directory: ./backend
        env:
          DB_CONNECTION: pgsql
          DB_HOST: localhost
          DB_PORT: 5432
          DB_DATABASE: testing
          DB_USERNAME: postgres
          DB_PASSWORD: postgres
        run: php artisan test --coverage --min=80

      - name: Run PHPStan
        working-directory: ./backend
        run: ./vendor/bin/phpstan analyse --error-format=github

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage.xml
          flags: backend

  frontend-tests:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'
          cache-dependency-path: frontend/pnpm-lock.yaml

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        working-directory: ./frontend
        run: pnpm install --frozen-lockfile

      - name: Run type check
        working-directory: ./frontend
        run: pnpm type-check

      - name: Run linter
        working-directory: ./frontend
        run: pnpm lint

      - name: Run tests
        working-directory: ./frontend
        run: pnpm test:coverage

      - name: Build application
        working-directory: ./frontend
        run: pnpm build

      - name: Upload coverage reports
        uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/coverage-final.json
          flags: frontend

  build-and-push:
    needs: [backend-tests, frontend-tests]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push backend image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: |
            edubit/college-admin-backend:latest
            edubit/college-admin-backend:${{ github.sha }}
          cache-from: type=registry,ref=edubit/college-admin-backend:buildcache
          cache-to: type=registry,ref=edubit/college-admin-backend:buildcache,mode=max

      - name: Build and push frontend image
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: |
            edubit/college-admin-frontend:latest
            edubit/college-admin-frontend:${{ github.sha }}
          cache-from: type=registry,ref=edubit/college-admin-frontend:buildcache
          cache-to: type=registry,ref=edubit/college-admin-frontend:buildcache,mode=max

  deploy-production:
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USERNAME }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /opt/edubit/college-admin
            docker-compose pull
            docker-compose up -d --no-build
            docker-compose exec -T backend php artisan migrate --force
            docker-compose exec -T backend php artisan config:cache
            docker-compose exec -T backend php artisan route:cache
            docker-compose exec -T backend php artisan view:cache

      - name: Health check
        run: |
          sleep 30
          curl -f https://college-admin.edubit.com/api/health || exit 1

      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'College Admin Portal deployed to production'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 6.2 GitLab CI/CD Pipeline

**File**: `.gitlab-ci.yml`

```yaml
stages:
  - test
  - build
  - deploy

variables:
  POSTGRES_DB: testing
  POSTGRES_USER: postgres
  POSTGRES_PASSWORD: postgres
  POSTGRES_HOST_AUTH_METHOD: trust

backend-test:
  stage: test
  image: php:8.2-cli
  services:
    - postgres:16
    - redis:7.2
  before_script:
    - apt-get update -yqq
    - apt-get install -yqq git libpq-dev libzip-dev unzip
    - docker-php-ext-install pdo_pgsql zip
    - curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
    - cd backend
    - composer install
    - cp .env.testing .env
    - php artisan key:generate
  script:
    - php artisan test --coverage --min=80
  coverage: '/^\s*Lines:\s*\d+\.\d+\%/'

frontend-test:
  stage: test
  image: node:20-alpine
  before_script:
    - cd frontend
    - npm install -g pnpm
    - pnpm install --frozen-lockfile
  script:
    - pnpm lint
    - pnpm type-check
    - pnpm test:coverage
    - pnpm build

build-docker:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  only:
    - main
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker build -t $CI_REGISTRY/edubit/college-admin-backend:$CI_COMMIT_SHA ./backend
    - docker build -t $CI_REGISTRY/edubit/college-admin-frontend:$CI_COMMIT_SHA ./frontend
    - docker push $CI_REGISTRY/edubit/college-admin-backend:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY/edubit/college-admin-frontend:$CI_COMMIT_SHA

deploy-production:
  stage: deploy
  image: alpine:latest
  only:
    - main
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
  script:
    - ssh -o StrictHostKeyChecking=no $PROD_USER@$PROD_HOST "cd /opt/edubit && docker-compose pull && docker-compose up -d"
```

---

## 7. Deployment Strategy

### 7.1 Blue-Green Deployment

```bash
# Deploy to green environment
kubectl apply -f k8s/green-deployment.yml

# Wait for green to be healthy
kubectl rollout status deployment/college-admin-green

# Switch traffic to green
kubectl patch service college-admin -p '{"spec":{"selector":{"version":"green"}}}'

# Monitor for issues (5 minutes)
sleep 300

# If successful, scale down blue
kubectl scale deployment college-admin-blue --replicas=0

# If issues, rollback to blue
kubectl patch service college-admin -p '{"spec":{"selector":{"version":"blue"}}}'
```

### 7.2 Rolling Deployment

```bash
# Update deployment with new image
kubectl set image deployment/college-admin-backend \
  backend=edubit/college-admin-backend:$NEW_VERSION

# Monitor rollout
kubectl rollout status deployment/college-admin-backend

# If issues, rollback
kubectl rollout undo deployment/college-admin-backend
```

### 7.3 Canary Deployment

```bash
# Deploy canary (10% traffic)
kubectl apply -f k8s/canary-deployment.yml

# Monitor metrics for 10 minutes
# If successful, increase to 50%
kubectl scale deployment/college-admin-canary --replicas=5

# Monitor for another 10 minutes
# If successful, full rollout
kubectl apply -f k8s/production-deployment.yml
kubectl delete deployment college-admin-canary
```

---

## 8. Environment Configuration

### 8.1 Development Environment

```bash
# backend/.env.development
APP_NAME="EduBit College Admin"
APP_ENV=development
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=edubit_dev
DB_USERNAME=postgres
DB_PASSWORD=password

REDIS_HOST=localhost
REDIS_PASSWORD=null
REDIS_PORT=6379

QUEUE_CONNECTION=redis
CACHE_DRIVER=redis
SESSION_DRIVER=redis
```

### 8.2 Staging Environment

```bash
# backend/.env.staging
APP_ENV=staging
APP_DEBUG=false
APP_URL=https://staging-college-admin.edubit.com

DB_CONNECTION=pgsql
DB_HOST=staging-postgres.internal
DB_PORT=5432
DB_DATABASE=edubit_staging
DB_USERNAME=edubit_staging
DB_PASSWORD=${DB_PASSWORD}

LOG_CHANNEL=stack
LOG_LEVEL=info
```

### 8.3 Production Environment

```bash
# backend/.env.production
APP_ENV=production
APP_DEBUG=false
APP_URL=https://college-admin.edubit.com

DB_CONNECTION=pgsql
DB_HOST=prod-postgres-primary.internal
DB_PORT=5432
DB_DATABASE=edubit_production
DB_USERNAME=edubit_prod
DB_PASSWORD=${DB_PASSWORD}

REDIS_HOST=prod-redis-cluster.internal
REDIS_PASSWORD=${REDIS_PASSWORD}

LOG_CHANNEL=stack
LOG_LEVEL=error

SENTRY_LARAVEL_DSN=${SENTRY_DSN}
```

---

## 9. Monitoring & Logging

### 9.1 Application Monitoring

```bash
# Install Laravel Telescope (development only)
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate

# Install Sentry (production)
composer require sentry/sentry-laravel
php artisan sentry:publish --dsn=${SENTRY_DSN}
```

### 9.2 Infrastructure Monitoring

```yaml
# Prometheus configuration
scrape_configs:
  - job_name: 'college-admin-backend'
    static_configs:
      - targets: ['backend:9090']
  
  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:9187']
  
  - job_name: 'redis'
    static_configs:
      - targets: ['redis:9121']
```

### 9.3 Log Aggregation

```bash
# Filebeat configuration for ELK stack
filebeat.inputs:
  - type: log
    enabled: true
    paths:
      - /var/www/html/storage/logs/*.log
    fields:
      service: college-admin-backend
      environment: production

output.elasticsearch:
  hosts: ["elasticsearch:9200"]
  index: "college-admin-%{+yyyy.MM.dd}"
```

---

## 10. Troubleshooting

### 10.1 Common Build Issues

**Issue**: Composer dependencies fail to install
```bash
# Solution: Clear Composer cache
composer clear-cache
composer install --no-cache

# Check PHP extensions
php -m | grep -E 'pdo|pgsql|redis'
```

**Issue**: Frontend build fails with memory error
```bash
# Solution: Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" pnpm build
```

**Issue**: Docker build fails
```bash
# Solution: Clear Docker cache
docker system prune -a
docker-compose build --no-cache
```

### 10.2 Deployment Issues

**Issue**: Database migration fails
```bash
# Solution: Check connection and rollback if needed
php artisan migrate:status
php artisan migrate:rollback
php artisan migrate --force
```

**Issue**: Zero-downtime deployment fails
```bash
# Solution: Check health endpoint
curl https://college-admin.edubit.com/api/health

# Check pod logs
kubectl logs -l app=college-admin --tail=100
```

### 10.3 Performance Issues

**Issue**: Slow API responses
```bash
# Solution: Clear and rebuild caches
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

**Issue**: Database query performance
```bash
# Solution: Enable query logging and analyze
php artisan debugbar:publish
# Or use Laravel Telescope in development
```

---

## Build Checklist

### Pre-Build
- [ ] All tests passing
- [ ] Code reviewed and approved
- [ ] Security scan completed
- [ ] Dependencies updated
- [ ] Environment variables configured
- [ ] Database migrations verified

### Build Process
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend build successful
- [ ] Frontend build successful
- [ ] Docker images built
- [ ] Images pushed to registry

### Deployment
- [ ] Staging deployment successful
- [ ] Smoke tests passed
- [ ] Production deployment initiated
- [ ] Health checks passing
- [ ] Monitoring active
- [ ] Rollback plan ready

### Post-Deployment
- [ ] Application accessible
- [ ] All features working
- [ ] Performance metrics normal
- [ ] No error spikes
- [ ] Stakeholders notified
- [ ] Documentation updated

---

*This build and deployment guide ensures consistent, reliable deployments across all environments with minimal downtime and maximum reliability.*
