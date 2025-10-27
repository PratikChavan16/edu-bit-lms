# Bitflow LMS - Global Build Guide

**Version**: 2.0  
**Last Updated**: October 25, 2025  
**Target Audience**: Developers, DevOps Engineers

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Development Environment Setup](#development-environment-setup)
3. [Backend Setup (Laravel)](#backend-setup-laravel)
4. [Frontend Setup (Next.js Monorepo)](#frontend-setup-nextjs-monorepo)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [Building for Production](#building-for-production)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

| Software | Version | Download |
|----------|---------|----------|
| **PHP** | 8.3+ | https://www.php.net/downloads |
| **Composer** | 2.7+ | https://getcomposer.org/ |
| **Node.js** | 20.x LTS | https://nodejs.org/ |
| **pnpm** | 9.x | `npm install -g pnpm` |
| **PostgreSQL** | 16+ | https://www.postgresql.org/ |
| **Redis** | 7+ | https://redis.io/ |
| **Git** | 2.40+ | https://git-scm.com/ |

### Optional Tools

- **Docker** (for containerized development)
- **pgAdmin 4** (PostgreSQL GUI)
- **Redis Commander** (Redis GUI)
- **Postman** (API testing)

### System Requirements

- **OS**: Windows 10/11, macOS 12+, or Linux (Ubuntu 22.04+)
- **RAM**: 8GB minimum, 16GB recommended
- **Disk Space**: 10GB free space
- **CPU**: Quad-core processor

---

## Development Environment Setup

### 1. Install PHP Extensions

```bash
# Windows (via php.ini)
extension=pdo_pgsql
extension=pgsql
extension=mbstring
extension=openssl
extension=fileinfo
extension=curl
extension=redis


### 2. Verify Installations

```bash
# Check PHP version
php -v
# Expected: PHP 8.3.x

# Check Composer
composer --version
# Expected: Composer version 2.7.x

# Check Node.js
node --version
# Expected: v20.x.x

# Check pnpm
pnpm --version
# Expected: 9.x.x

# Check PostgreSQL
psql --version
# Expected: psql (PostgreSQL) 16.x

# Check Redis
redis-cli --version
# Expected: redis-cli 7.x.x
```

---

## Backend Setup (Laravel)

### Step 1: Clone Repository

```bash
git clone https://github.com/PratikChavan16/edu-bit-lms.git
cd edu-bit-lms
```

### Step 2: Install Backend Dependencies

```bash
cd bitflow-core
composer install
```

### Step 3: Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### Step 4: Configure `.env` File

```env
# Application
APP_NAME="Bitflow LMS"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=bitflow_lms
DB_USERNAME=postgres
DB_PASSWORD=your_password

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Session & Cache
SESSION_DRIVER=redis
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis

# JWT Keys (Generate RSA keys - see Step 5)
JWT_PRIVATE_KEY_PATH=storage/keys/private.pem
JWT_PUBLIC_KEY_PATH=storage/keys/public.pem

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

# Mail
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@bitflow.edu
MAIL_FROM_NAME="${APP_NAME}"

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3006
```

### Step 5: Generate JWT Keys

```bash
# Create keys directory
mkdir -p storage/keys

# Generate private key (RSA 4096-bit)
openssl genrsa -out storage/keys/private.pem 4096

# Generate public key from private key
openssl rsa -in storage/keys/private.pem -pubout -out storage/keys/public.pem

# Set permissions (Linux/macOS)
chmod 600 storage/keys/private.pem
chmod 644 storage/keys/public.pem
```

### Step 6: Run Migrations

```bash
# Run all migrations
php artisan migrate

# Seed database with sample data (optional)
php artisan db:seed
```

### Step 7: Create Storage Symlink

```bash
php artisan storage:link
```

### Step 8: Clear Caches

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## Frontend Setup (Next.js Monorepo)

### Step 1: Navigate to Frontend Directory

```bash
cd ../bitflow-frontend
```

### Step 2: Install Dependencies

```bash
pnpm install
```

This will install dependencies for all 14 portal apps in the monorepo.

### Step 3: Environment Configuration

Create `.env.local` files for each portal:

```bash
# Bitflow Admin (.env.local)
cd apps/bitflow-admin
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME="Bitflow Admin"
NEXT_PUBLIC_PORTAL_NAME="bitflow-admin"
EOF

# Repeat for other portals:
# - university-owner (port 3002)
# - super-admin (port 3003)
# - principal (port 3004)
# - college-admin (port 3005)
# - super-academics (port 3006)
# - faculty-teacher (port 3007)
# - student (port 3008)
# - parent (port 3009)
# - admission-admin (port 3010)
# - super-accountant (port 3011)
# - college-accounts-admin (port 3012)
# - college-fee-admin (port 3013)
# - super-non-teaching-manager (port 3014)
```

### Step 4: TypeScript Configuration

```bash
# Verify TypeScript config is valid
pnpm tsc --noEmit
```

---

## Database Setup

### Step 1: Create Database

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE bitflow_lms;

-- Create user (optional)
CREATE USER bitflow_user WITH ENCRYPTED PASSWORD 'secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE bitflow_lms TO bitflow_user;

-- Connect to database
\c bitflow_lms

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Exit
\q
```

### Step 2: Import Master Schema (Optional)

```bash
# If you have the master schema SQL file
psql -U postgres -d bitflow_lms -f brain/master_db_schema.sql
```

---

## Running the Application

### Backend (Laravel)

```bash
# Navigate to backend directory
cd bitflow-core

# Start development server
php artisan serve
# Server running at: http://localhost:8000

# Or use specific port
php artisan serve --port=8000

# In separate terminal, start queue worker
php artisan queue:work

# In another terminal, start Redis
redis-server
```

### Frontend (All Portals)

#### Option 1: Run All Portals Simultaneously

```bash
cd bitflow-frontend
pnpm dev
```

This starts all 14 portals on ports 3001-3014.

#### Option 2: Run Individual Portal

```bash
# Bitflow Admin (port 3001)
cd apps/bitflow-admin
pnpm dev

# Student Portal (port 3008)
cd apps/student
pnpm dev

# Faculty Portal (port 3007)
cd apps/faculty-teacher
pnpm dev
```

### Access URLs

| Portal | URL |
|--------|-----|
| Bitflow Admin | http://localhost:3001 |
| University Owner | http://localhost:3002 |
| Super Admin | http://localhost:3003 |
| Principal | http://localhost:3004 |
| College Admin | http://localhost:3005 |
| Super Academics | http://localhost:3006 |
| Faculty | http://localhost:3007 |
| Student | http://localhost:3008 |
| Parent | http://localhost:3009 |
| Admission Admin | http://localhost:3010 |
| Super Accountant | http://localhost:3011 |
| College Accounts Admin | http://localhost:3012 |
| College Fee Admin | http://localhost:3013 |
| Super NT Manager | http://localhost:3014 |
| **Backend API** | http://localhost:8000/api |

---

## Building for Production

### Backend Build

```bash
cd bitflow-core

# Clear all caches
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Optimize for production
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run migrations (production database)
php artisan migrate --force

# Set permissions
chmod -R 755 storage bootstrap/cache
```

### Frontend Build

```bash
cd bitflow-frontend

# Build all portals
pnpm build

# Build specific portal
cd apps/bitflow-admin
pnpm build

# Output directory: .next/
```

### Production Environment Variables

```env
# Backend (.env)
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.bitflow.edu

DB_HOST=production-db-host
DB_PASSWORD=strong_production_password

REDIS_HOST=production-redis-host

# Frontend (.env.production)
NEXT_PUBLIC_API_URL=https://api.bitflow.edu/api
NODE_ENV=production
```

---

## Testing

### Backend Tests

```bash
cd bitflow-core

# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature
php artisan test --testsuite=Unit

# Run with coverage
php artisan test --coverage

# Run specific test file
php artisan test tests/Feature/Auth/LoginTest.php
```

### Frontend Tests

```bash
cd bitflow-frontend

# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests (Playwright)
pnpm test:e2e

# Run tests for specific portal
cd apps/student
pnpm test
```

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/macOS
lsof -ti:8000 | xargs kill -9
```

#### 2. Database Connection Failed

```bash
# Check PostgreSQL service
# Windows
sc query postgresql-x64-16

# Linux
sudo systemctl status postgresql

# macOS
brew services list

# Test connection
psql -U postgres -h localhost -d bitflow_lms
```

#### 3. Redis Connection Failed

```bash
# Check Redis service
redis-cli ping
# Expected: PONG

# Start Redis
# Windows: Start Redis service
# Linux: sudo systemctl start redis
# macOS: brew services start redis
```

#### 4. Composer Install Fails

```bash
# Clear Composer cache
composer clear-cache

# Update Composer
composer self-update

# Install with verbose output
composer install -vvv
```

#### 5. pnpm Install Fails

```bash
# Clear pnpm cache
pnpm store prune

# Delete node_modules and lock file
rm -rf node_modules pnpm-lock.yaml

# Reinstall
pnpm install
```

#### 6. Migration Fails

```bash
# Reset database (⚠️ DESTROYS ALL DATA)
php artisan migrate:fresh

# Rollback last migration
php artisan migrate:rollback

# Check migration status
php artisan migrate:status
```

#### 7. JWT Token Issues

```bash
# Regenerate JWT keys
rm storage/keys/*.pem
openssl genrsa -out storage/keys/private.pem 4096
openssl rsa -in storage/keys/private.pem -pubout -out storage/keys/public.pem

# Clear config cache
php artisan config:clear
```

### Performance Issues

```bash
# Backend optimization
composer dump-autoload --optimize
php artisan optimize

# Frontend optimization
pnpm build
# Check bundle size: pnpm analyze
```

### Debugging

```bash
# Enable Laravel debug bar (development only)
composer require barryvdh/laravel-debugbar --dev

# Check logs
tail -f storage/logs/laravel.log

# Frontend debugging (browser console)
console.log(process.env.NEXT_PUBLIC_API_URL)
```

---

## Quick Start Script

Create a `start.sh` (Linux/macOS) or `start.bat` (Windows) file:

```bash
#!/bin/bash
# start.sh

echo "🚀 Starting Bitflow LMS..."

# Start Redis
echo "📦 Starting Redis..."
redis-server &

# Start PostgreSQL (if not running)
echo "🗄️  Checking PostgreSQL..."
# Add your PostgreSQL start command here

# Start Backend
echo "🔧 Starting Laravel backend..."
cd bitflow-core
php artisan serve &

# Start Queue Worker
php artisan queue:work &

# Start Frontend
echo "🎨 Starting Next.js frontend..."
cd ../bitflow-frontend
pnpm dev

echo "✅ All services started!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3001-3014"
```

Make executable:

```bash
chmod +x start.sh
./start.sh
```

---

**🎉 You're ready to develop Bitflow LMS!**
