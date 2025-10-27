# Super Admin Portal - Build & Setup Guide

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Prerequisites

- Node.js 20+ (for Next.js frontend)
- PHP 8.3+ (for Laravel backend)
- PostgreSQL 16+
- Redis 7+ (for caching, queues)
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

Edit `.env`:
```env
APP_NAME="Super Admin Portal"
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

JWT_SECRET=your-secret-key
JWT_PUBLIC_KEY=path/to/public.key
JWT_PRIVATE_KEY=path/to/private.key

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=

TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
```

### 1.4 Generate Keys
```bash
php artisan key:generate
php artisan jwt:secret

# Generate RS256 key pair for JWT
ssh-keygen -t rsa -b 4096 -m PEM -f storage/app/keys/jwt.key
openssl rsa -in storage/app/keys/jwt.key -pubout -outform PEM -out storage/app/keys/jwt.key.pub
```

### 1.5 Database Setup
```bash
# Create database
createdb edu_bit_lms

# Run migrations
php artisan migrate

# Seed sample data
php artisan db:seed --class=SuperAdminSeeder
```

### 1.6 Storage Setup
```bash
php artisan storage:link
```

### 1.7 Queue Worker
```bash
# Terminal 1: Start queue worker
php artisan queue:work

# Terminal 2: Start scheduler (for cron jobs)
php artisan schedule:work
```

### 1.8 Start Backend Server
```bash
php artisan serve --host=0.0.0.0 --port=8000
```

Backend now running at: http://localhost:8000

---

## Step 2: Frontend Setup (Next.js)

### 2.1 Navigate to Frontend
```bash
cd ../super-admin
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
NEXT_PUBLIC_API_URL=http://localhost:8000/api/super-admin
NEXT_PUBLIC_PORT=3003
NEXT_PUBLIC_UNIVERSITY_SLUG=prestigious-university

# Optional: Analytics
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

Frontend now running at: http://localhost:3003

---

## Step 3: Initial Login

### Default Super Admin Credentials
```
Email: superadmin@university.edu
Password: Admin@123
```

**Important**: Change password on first login!

---

## Step 4: Production Build

### 4.1 Backend (Laravel)

```bash
cd apps/backend

# Install production dependencies
composer install --optimize-autoloader --no-dev

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimize autoloader
composer dump-autoload --optimize

# Set permissions
chmod -R 755 storage bootstrap/cache
```

### 4.2 Frontend (Next.js)

```bash
cd apps/super-admin

# Build for production
npm run build

# Start production server
npm run start
```

---

## Step 5: Testing

### Backend Tests
```bash
cd apps/backend

# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature

# Run with coverage
php artisan test --coverage
```

### Frontend Tests
```bash
cd apps/super-admin

# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run with coverage
npm run test:coverage
```

---

## Step 6: Docker Deployment (Optional)

### 6.1 Docker Compose Setup

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: edu_bit_lms
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secret
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build:
      context: ./apps/backend
      dockerfile: Dockerfile
    environment:
      DB_HOST: postgres
      REDIS_HOST: redis
    volumes:
      - ./apps/backend:/var/www
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis

  frontend:
    build:
      context: ./apps/super-admin
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: http://backend:8000/api/super-admin
    ports:
      - "3003:3003"
    depends_on:
      - backend

volumes:
  postgres_data:
```

### 6.2 Build & Run
```bash
docker-compose up -d --build
```

---

## Step 7: Monitoring Setup

### 7.1 Laravel Telescope (Development)
```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

Access at: http://localhost:8000/telescope

### 7.2 Laravel Horizon (Queue Monitoring)
```bash
composer require laravel/horizon
php artisan horizon:install
php artisan migrate
```

Access at: http://localhost:8000/horizon

### 7.3 Sentry (Error Tracking - Production)
```bash
composer require sentry/sentry-laravel
php artisan sentry:publish --dsn=your-sentry-dsn
```

---

## Step 8: Backup Configuration

### 8.1 Database Backup Script

Create `scripts/backup-db.sh`:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="edu_bit_lms"

pg_dump -U postgres $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete
```

### 8.2 Cron Job
```bash
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/scripts/backup-db.sh
```

---

## Step 9: Performance Optimization

### 9.1 Laravel Optimization
```bash
# Enable OPcache in php.ini
opcache.enable=1
opcache.memory_consumption=256

# Redis cache driver
php artisan cache:clear
php artisan config:clear
php artisan config:cache
```

### 9.2 Next.js Optimization
```bash
# Build with production mode
NODE_ENV=production npm run build

# Enable compression
npm install compression
```

---

## Step 10: Security Checklist

- [ ] Change default passwords
- [ ] Enable 2FA for Super Admin
- [ ] Configure HTTPS (SSL/TLS)
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Enable CSRF protection
- [ ] Implement CSP headers
- [ ] Regular security audits

---

## Troubleshooting

### Issue: Database connection failed
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U postgres -h localhost -d edu_bit_lms
```

### Issue: Redis connection failed
```bash
# Check Redis is running
redis-cli ping
# Should return "PONG"

# Restart Redis
sudo systemctl restart redis
```

### Issue: Permission denied on storage
```bash
sudo chmod -R 775 storage bootstrap/cache
sudo chown -R www-data:www-data storage bootstrap/cache
```

### Issue: Port already in use
```bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 <PID>
```

---

## Quick Commands Reference

```bash
# Backend
php artisan serve                    # Start dev server
php artisan migrate                  # Run migrations
php artisan queue:work              # Start queue worker
php artisan test                     # Run tests

# Frontend
npm run dev                          # Start dev server
npm run build                        # Build for production
npm run start                        # Start production server
npm run test                         # Run tests

# Database
php artisan migrate:fresh --seed    # Fresh migration with seed
php artisan db:seed                  # Seed only

# Cache
php artisan cache:clear             # Clear cache
php artisan config:clear            # Clear config cache
php artisan route:clear             # Clear route cache
```

---

**Setup Complete! 🎉**

Access Super Admin Portal at: http://localhost:3003
