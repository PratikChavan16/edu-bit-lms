# College Fee Admin Portal - Build & Deployment Steps

**Version**: 1.0.0  
**CI/CD**: GitHub Actions + AWS CodeDeploy  
**Environments**: Local, Staging, Production

---

## Quick Start

```bash
# Clone repository
git clone https://github.com/college/edu-bit-lms.git
cd edu-bit-lms

# Backend setup
cd backend/college-fee-admin
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=8013

# Frontend setup
cd ../../frontend/college-fee-admin
npm install
cp .env.example .env.local
npm run dev
```

---

## Environment Setup

### 1. Local Development

#### Backend (.env)
```env
APP_NAME="College Fee Admin"
APP_ENV=local
APP_PORT=8013
APP_DEBUG=true
APP_URL=http://localhost:8013

DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=fee_admin_local
DB_USERNAME=postgres
DB_PASSWORD=password

REDIS_HOST=localhost
REDIS_PORT=6379

RAZORPAY_KEY=rzp_test_XXXXXXXX
RAZORPAY_SECRET=XXXXXXXXXXXXXXXX

AWS_ACCESS_KEY_ID=local_key
AWS_SECRET_ACCESS_KEY=local_secret
AWS_DEFAULT_REGION=ap-south-1
AWS_BUCKET=fee-receipts-local

MSG91_AUTH_KEY=test_key
MSG91_SENDER_ID=STXAVR
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8013/api/v1
NEXT_PUBLIC_APP_NAME="College Fee Admin"
NEXT_PUBLIC_RAZORPAY_KEY=rzp_test_XXXXXXXX
```

### 2. Staging Environment

```env
APP_ENV=staging
APP_URL=https://staging-fees.college.edu.in

DB_DATABASE=fee_admin_staging
REDIS_HOST=staging-redis.college.internal

RAZORPAY_KEY=rzp_test_STAGING_KEY
AWS_BUCKET=fee-receipts-staging
```

### 3. Production Environment

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://fees.college.edu.in

DB_DATABASE=fee_admin_production
REDIS_HOST=prod-redis.college.internal

RAZORPAY_KEY=rzp_live_PRODUCTION_KEY
AWS_BUCKET=fee-receipts-production
```

---

## Build Process

### Backend Build

#### Step 1: Install Dependencies
```bash
cd backend/college-fee-admin
composer install --no-dev --optimize-autoloader
```

#### Step 2: Generate Autoload Files
```bash
composer dump-autoload --optimize
```

#### Step 3: Cache Configuration
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### Step 4: Run Migrations
```bash
php artisan migrate --force
```

#### Step 5: Clear Old Caches
```bash
php artisan cache:clear
php artisan queue:restart
```

### Frontend Build

#### Step 1: Install Dependencies
```bash
cd frontend/college-fee-admin
npm ci --production
```

#### Step 2: Build Next.js App
```bash
npm run build
```

#### Step 3: Verify Build
```bash
# Check build output
ls -la .next/

# Test production build locally
npm run start
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

#### .github/workflows/deploy.yml
```yaml
name: Deploy College Fee Admin

on:
  push:
    branches:
      - main
      - staging
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          extensions: pgsql, redis, mbstring
      
      - name: Install Dependencies
        run: composer install
      
      - name: Run Tests
        run: ./vendor/bin/phpunit
      
      - name: Code Quality Check
        run: ./vendor/bin/phpstan analyse

  build-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Backend
        run: |
          composer install --no-dev --optimize-autoloader
          php artisan config:cache
          php artisan route:cache
      
      - name: Upload Artifact
        uses: actions/upload-artifact@v3
        with:
          name: backend-build
          path: backend/

  build-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Build Frontend
        run: npm run build
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
      
      - name: Upload Artifact
        uses: actions/upload-artifact@v3
        with:
          name: frontend-build
          path: frontend/.next/

  deploy-staging:
    needs: [build-backend, build-frontend]
    if: github.ref == 'refs/heads/staging'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Staging
        uses: aws-actions/aws-codedeploy@v1
        with:
          application-name: college-fee-admin-staging
          deployment-group: staging-servers

  deploy-production:
    needs: [build-backend, build-frontend]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to Production
        uses: aws-actions/aws-codedeploy@v1
        with:
          application-name: college-fee-admin-prod
          deployment-group: production-servers
```

---

## AWS CodeDeploy Configuration

### appspec.yml
```yaml
version: 0.0
os: linux

files:
  - source: /backend
    destination: /var/www/college-fee-admin/backend
  - source: /frontend/.next
    destination: /var/www/college-fee-admin/frontend/.next

hooks:
  BeforeInstall:
    - location: scripts/stop_services.sh
      timeout: 60
  
  AfterInstall:
    - location: scripts/install_dependencies.sh
      timeout: 300
  
  ApplicationStart:
    - location: scripts/start_services.sh
      timeout: 120
  
  ValidateService:
    - location: scripts/health_check.sh
      timeout: 60
```

### Deployment Scripts

#### scripts/stop_services.sh
```bash
#!/bin/bash
# Stop Laravel queue workers
sudo supervisorctl stop college-fee-worker:*

# Stop Nginx
sudo systemctl stop nginx
```

#### scripts/install_dependencies.sh
```bash
#!/bin/bash
cd /var/www/college-fee-admin/backend

# Install Composer dependencies
composer install --no-dev --optimize-autoloader

# Run migrations
php artisan migrate --force

# Clear caches
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### scripts/start_services.sh
```bash
#!/bin/bash
# Start Laravel queue workers
sudo supervisorctl start college-fee-worker:*

# Start Nginx
sudo systemctl start nginx

# Restart PHP-FPM
sudo systemctl restart php8.2-fpm
```

#### scripts/health_check.sh
```bash
#!/bin/bash
# Check backend health
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8013/api/health)
if [ $response -ne 200 ]; then
  echo "Backend health check failed"
  exit 1
fi

# Check frontend health
response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3013)
if [ $response -ne 200 ]; then
  echo "Frontend health check failed"
  exit 1
fi

echo "Health check passed"
exit 0
```

---

## Database Migration Strategy

### Zero-Downtime Migration
```bash
# Step 1: Deploy new code (with backward-compatible changes)
php artisan migrate

# Step 2: Run data migrations (if needed)
php artisan migrate:data

# Step 3: Clean up old code/tables (after verification)
php artisan migrate:cleanup
```

### Rollback Plan
```bash
# Rollback last migration batch
php artisan migrate:rollback

# Rollback to specific batch
php artisan migrate:rollback --batch=3

# Reset and re-run all migrations (DEV ONLY)
php artisan migrate:fresh --seed
```

---

## Server Configuration

### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name fees.college.edu.in;

    ssl_certificate /etc/ssl/certs/college.crt;
    ssl_certificate_key /etc/ssl/private/college.key;

    root /var/www/college-fee-admin/frontend;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3013;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API (Laravel)
    location /api {
        proxy_pass http://localhost:8013;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Supervisor Configuration
```ini
[program:college-fee-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/college-fee-admin/backend/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/var/log/college-fee-worker.log
```

---

## Monitoring Setup

### Uptime Monitoring (UptimeRobot)
```
Monitor 1: Backend API Health
URL: https://fees.college.edu.in/api/health
Interval: 5 minutes
Alert: Email + SMS

Monitor 2: Frontend Health
URL: https://fees.college.edu.in
Interval: 5 minutes
Alert: Email + SMS
```

### Application Performance Monitoring (New Relic)
```php
// config/newrelic.php
return [
    'app_name' => 'College Fee Admin - Production',
    'license_key' => env('NEW_RELIC_LICENSE_KEY'),
    'transaction_tracer' => [
        'enabled' => true,
        'threshold' => 500, // ms
    ],
];
```

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (`composer test`)
- [ ] Code review approved
- [ ] Staging deployment successful
- [ ] Database backup completed
- [ ] Deployment plan reviewed

### Deployment
- [ ] Maintenance mode enabled (`php artisan down`)
- [ ] Git pull latest code
- [ ] Composer install (`--no-dev`)
- [ ] Run migrations (`php artisan migrate --force`)
- [ ] Clear caches (`php artisan cache:clear`)
- [ ] Restart queue workers (`supervisorctl restart all`)
- [ ] Maintenance mode disabled (`php artisan up`)

### Post-Deployment
- [ ] Health check passed
- [ ] Critical workflows tested (payment, receipt)
- [ ] Error logs monitored (first 30 minutes)
- [ ] Performance metrics normal

---

## Rollback Procedure

### Quick Rollback (< 5 minutes)
```bash
# Step 1: Enable maintenance mode
php artisan down

# Step 2: Revert to previous release
cd /var/www/college-fee-admin
git checkout tags/v1.2.3  # Previous stable version

# Step 3: Rollback database
php artisan migrate:rollback --batch=1

# Step 4: Clear caches
php artisan cache:clear
php artisan config:clear

# Step 5: Restart services
sudo supervisorctl restart all
sudo systemctl restart nginx

# Step 6: Disable maintenance mode
php artisan up
```

---

**Deployment Frequency**: Weekly (Fridays 10 PM IST)  
**Average Deployment Time**: 15 minutes  
**Rollback Time**: < 5 minutes
