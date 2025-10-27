# Super Non-Teaching Manager Portal - Build & Deployment Guide

**Infrastructure**: Docker + Kubernetes  
**CI/CD**: GitHub Actions  
**Cloud**: AWS (ECS/RDS/ElastiCache)

---

## Local Development Setup

### Prerequisites

```bash
# Required software
- PHP 8.2+
- Composer 2.6+
- Node.js 20 LTS
- PostgreSQL 16
- Redis 7.2
- Docker Desktop 24+
- ZKTeco SDK (optional for biometric simulation)
```

### Backend Setup (Laravel)

```bash
# Clone repository
git clone https://github.com/college/super-nt-manager.git
cd super-nt-manager/backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate app key
php artisan key:generate

# Configure database in .env
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=nt_manager_db
DB_USERNAME=postgres
DB_PASSWORD=password

# Configure Redis
REDIS_HOST=localhost
REDIS_PASSWORD=null
REDIS_PORT=6379

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed --class=RolesAndPermissionsSeeder
php artisan db:seed --class=DemoDataSeeder

# Install Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate

# Start local server
php artisan serve # http://localhost:8000

# Start queue worker (separate terminal)
php artisan queue:work redis --tries=3

# Start scheduler (separate terminal)
php artisan schedule:work
```

### Frontend Setup (Next.js)

```bash
cd ../frontend

# Install dependencies
npm ci

# Copy environment file
cp .env.example .env.local

# Configure API endpoint
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:6001

# Start development server
npm run dev # http://localhost:3000
```

### Biometric Device Simulator (Optional)

```bash
cd ../biometric-simulator

# Install Python dependencies
pip install -r requirements.txt

# Run simulator
python simulator.py --port 4370 --devices 3

# Test punch
curl -X POST http://localhost:4370/punch \
  -H "Content-Type: application/json" \
  -d '{"employee_id": 1, "punch_type": "in"}'
```

---

## Docker Configuration

### docker-compose.yml

```yaml
version: '3.8'

services:
  # Backend (Laravel)
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: nt-manager-backend
    ports:
      - "8000:8000"
    environment:
      - APP_ENV=local
      - APP_DEBUG=true
      - DB_HOST=postgres
      - REDIS_HOST=redis
    volumes:
      - ./backend:/var/www/html
      - ./storage:/var/www/html/storage
    depends_on:
      - postgres
      - redis
    networks:
      - nt-manager-network
    command: php artisan serve --host=0.0.0.0 --port=8000

  # Queue Worker
  queue-worker:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: nt-manager-queue
    environment:
      - APP_ENV=local
      - DB_HOST=postgres
      - REDIS_HOST=redis
    volumes:
      - ./backend:/var/www/html
    depends_on:
      - postgres
      - redis
    networks:
      - nt-manager-network
    command: php artisan queue:work redis --tries=3 --timeout=60
    restart: unless-stopped

  # Scheduler
  scheduler:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: nt-manager-scheduler
    environment:
      - APP_ENV=local
      - DB_HOST=postgres
      - REDIS_HOST=redis
    volumes:
      - ./backend:/var/www/html
    depends_on:
      - postgres
      - redis
    networks:
      - nt-manager-network
    command: php artisan schedule:work
    restart: unless-stopped

  # Frontend (Next.js)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: nt-manager-frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000/api
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    depends_on:
      - backend
    networks:
      - nt-manager-network
    command: npm run dev

  # PostgreSQL 16
  postgres:
    image: postgres:16-alpine
    container_name: nt-manager-postgres
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: nt_manager_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    networks:
      - nt-manager-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis 7.2
  redis:
    image: redis:7.2-alpine
    container_name: nt-manager-redis
    ports:
      - "6379:6379"
    command: redis-server --appendonly yes --requirepass redis_password
    volumes:
      - redis_data:/data
    networks:
      - nt-manager-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # Biometric Device Simulator
  biometric-simulator:
    build:
      context: ./biometric-simulator
      dockerfile: Dockerfile
    container_name: nt-manager-biometric
    ports:
      - "4370:4370"
    environment:
      - NUM_DEVICES=3
    networks:
      - nt-manager-network

  # Nginx (Production proxy)
  nginx:
    image: nginx:alpine
    container_name: nt-manager-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend
    networks:
      - nt-manager-network

networks:
  nt-manager-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
```

### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM php:8.2-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    postgresql-dev \
    oniguruma-dev

# Install PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    mbstring \
    zip \
    gd \
    bcmath

# Install Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port
EXPOSE 8000

# Start PHP-FPM
CMD ["php-fpm"]
```

### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Build Next.js app
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "start"]
```

---

## Build Process

### Build Scripts

```bash
# build.sh
#!/bin/bash

set -e

echo "Building Super NT Manager Portal..."

# Backend build
echo "Building backend..."
cd backend
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Frontend build
echo "Building frontend..."
cd ../frontend
npm ci
npm run build

# Build Docker images
echo "Building Docker images..."
cd ..
docker-compose build --no-cache

echo "Build complete!"
```

### Production Build

```bash
# Build for production
docker build -t nt-manager-backend:latest -f backend/Dockerfile.prod backend/
docker build -t nt-manager-frontend:latest -f frontend/Dockerfile.prod frontend/

# Tag for registry
docker tag nt-manager-backend:latest registry.college.edu/nt-manager-backend:v1.0.0
docker tag nt-manager-frontend:latest registry.college.edu/nt-manager-frontend:v1.0.0

# Push to registry
docker push registry.college.edu/nt-manager-backend:v1.0.0
docker push registry.college.edu/nt-manager-frontend:v1.0.0
```

---

## Testing Pipeline

### Run Tests Locally

```bash
# Backend tests
cd backend
php artisan test --coverage --min=85

# Frontend tests
cd ../frontend
npm run test
npm run test:e2e

# Load tests
k6 run tests/load/biometric-punch.js
```

---

## CI/CD Pipeline (GitHub Actions)

### .github/workflows/ci.yml

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  # Backend Tests
  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: password
          POSTGRES_DB: nt_manager_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7.2-alpine
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          extensions: pdo, pgsql, mbstring, zip, bcmath, redis
          coverage: xdebug
      
      - name: Cache Composer dependencies
        uses: actions/cache@v3
        with:
          path: backend/vendor
          key: ${{ runner.os }}-composer-${{ hashFiles('**/composer.lock') }}
      
      - name: Install dependencies
        working-directory: backend
        run: composer install --prefer-dist --no-progress
      
      - name: Copy .env
        working-directory: backend
        run: cp .env.example .env
      
      - name: Generate key
        working-directory: backend
        run: php artisan key:generate
      
      - name: Run migrations
        working-directory: backend
        env:
          DB_CONNECTION: pgsql
          DB_HOST: localhost
          DB_PORT: 5432
          DB_DATABASE: nt_manager_test
          DB_USERNAME: postgres
          DB_PASSWORD: password
        run: php artisan migrate --force
      
      - name: Run tests with coverage
        working-directory: backend
        run: php artisan test --coverage --min=85
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: backend/coverage.xml

  # Frontend Tests
  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      
      - name: Install dependencies
        working-directory: frontend
        run: npm ci
      
      - name: Run linter
        working-directory: frontend
        run: npm run lint
      
      - name: Run unit tests
        working-directory: frontend
        run: npm run test
      
      - name: Run E2E tests
        working-directory: frontend
        run: npm run test:e2e

  # Security Scan
  security-scan:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload Trivy results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

  # Build Docker Images
  build-images:
    needs: [backend-tests, frontend-tests, security-scan]
    runs-on: ubuntu-latest
    if: github.event_name == 'push'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ secrets.REGISTRY_URL }}
          username: ${{ secrets.REGISTRY_USERNAME }}
          password: ${{ secrets.REGISTRY_PASSWORD }}
      
      - name: Build and push backend image
        uses: docker/build-push-action@v4
        with:
          context: backend
          push: true
          tags: |
            ${{ secrets.REGISTRY_URL }}/nt-manager-backend:${{ github.sha }}
            ${{ secrets.REGISTRY_URL }}/nt-manager-backend:latest
          cache-from: type=gha
          cache-to: type=gha,mode=max
      
      - name: Build and push frontend image
        uses: docker/build-push-action@v4
        with:
          context: frontend
          push: true
          tags: |
            ${{ secrets.REGISTRY_URL }}/nt-manager-frontend:${{ github.sha }}
            ${{ secrets.REGISTRY_URL }}/nt-manager-frontend:latest

  # Deploy to Staging
  deploy-staging:
    needs: build-images
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster nt-manager-staging \
            --service backend \
            --force-new-deployment
          
          aws ecs update-service \
            --cluster nt-manager-staging \
            --service frontend \
            --force-new-deployment

  # Deploy to Production
  deploy-production:
    needs: build-images
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster nt-manager-production \
            --service backend \
            --force-new-deployment \
            --desired-count 3
          
          aws ecs update-service \
            --cluster nt-manager-production \
            --service frontend \
            --force-new-deployment \
            --desired-count 3
```

---

## Deployment Strategies

### Blue-Green Deployment

```bash
# Deploy new version (green)
aws ecs create-service \
  --cluster nt-manager-production \
  --service-name backend-green \
  --task-definition nt-manager-backend:v2 \
  --desired-count 3 \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=backend,containerPort=8000

# Wait for health checks
aws ecs wait services-stable \
  --cluster nt-manager-production \
  --services backend-green

# Switch traffic (update ALB target group)
aws elbv2 modify-listener \
  --listener-arn arn:aws:elasticloadbalancing:... \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:.../backend-green

# Scale down old version (blue)
aws ecs update-service \
  --cluster nt-manager-production \
  --service backend-blue \
  --desired-count 0
```

### Canary Deployment

```bash
# Deploy canary (10% traffic)
aws ecs update-service \
  --cluster nt-manager-production \
  --service backend-canary \
  --task-definition nt-manager-backend:v2 \
  --desired-count 1

# Monitor metrics for 30 minutes
# If metrics good, promote canary to 100%
aws ecs update-service \
  --cluster nt-manager-production \
  --service backend \
  --task-definition nt-manager-backend:v2 \
  --desired-count 3
```

---

## Environment Management

### Development (.env.development)

```bash
APP_ENV=development
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=nt_manager_dev

REDIS_HOST=localhost
REDIS_PORT=6379

BIOMETRIC_SIMULATOR=true
```

### Staging (.env.staging)

```bash
APP_ENV=staging
APP_DEBUG=false
APP_URL=https://staging-nt.college.edu

DB_CONNECTION=pgsql
DB_HOST=staging-db.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_DATABASE=nt_manager_staging

REDIS_HOST=staging-redis.cache.amazonaws.com
REDIS_PORT=6379

AWS_BUCKET=nt-manager-staging-assets
```

### Production (.env.production)

```bash
APP_ENV=production
APP_DEBUG=false
APP_URL=https://nt.college.edu

DB_CONNECTION=pgsql
DB_HOST=prod-db.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_DATABASE=nt_manager_production
DB_USERNAME=${AWS_SECRETS_DB_USER}
DB_PASSWORD=${AWS_SECRETS_DB_PASSWORD}

REDIS_HOST=prod-redis.cache.amazonaws.com
REDIS_PORT=6379
REDIS_PASSWORD=${AWS_SECRETS_REDIS_PASSWORD}

AWS_BUCKET=nt-manager-production-assets
```

---

## Monitoring & Logging

### CloudWatch Logs

```bash
# Create log groups
aws logs create-log-group --log-group-name /ecs/nt-manager-backend
aws logs create-log-group --log-group-name /ecs/nt-manager-frontend
aws logs create-log-group --log-group-name /ecs/nt-manager-queue
```

### Prometheus Metrics

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'nt-manager-backend'
    static_configs:
      - targets: ['backend:8000']
    metrics_path: '/metrics'
```

### Grafana Dashboard

```json
{
  "dashboard": {
    "title": "NT Manager Portal",
    "panels": [
      {
        "title": "API Request Rate",
        "targets": [{"expr": "rate(http_requests_total[5m])"}]
      },
      {
        "title": "Biometric Punch Latency",
        "targets": [{"expr": "histogram_quantile(0.95, biometric_punch_duration_seconds)"}]
      },
      {
        "title": "Queue Depth",
        "targets": [{"expr": "redis_queue_size"}]
      }
    ]
  }
}
```

---

## Rollback Procedure

```bash
# Rollback to previous version
aws ecs update-service \
  --cluster nt-manager-production \
  --service backend \
  --task-definition nt-manager-backend:v1.5.0 \
  --force-new-deployment

# Database rollback
php artisan migrate:rollback --step=1

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

---

*Complete build and deployment guide for Super NT Manager Portal with Docker, CI/CD pipelines, and AWS infrastructure.*
