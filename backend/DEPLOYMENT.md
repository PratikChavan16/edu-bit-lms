# BitFlow Admin Portal - Production Deployment Guide

This guide provides step-by-step instructions for deploying the BitFlow Admin Portal to production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Server Requirements](#server-requirements)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Database Setup](#database-setup)
6. [SSL/HTTPS Configuration](#ssl-https-configuration)
7. [Post-Deployment Tasks](#post-deployment-tasks)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Rollback Procedures](#rollback-procedures)
10. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (`php artisan test` && `npm test`)
- [ ] Code reviewed and approved
- [ ] No debug statements or console.logs
- [ ] Environment files configured (see ENVIRONMENT.md)
- [ ] Database migrations tested
- [ ] API endpoints documented

### Security
- [ ] APP_DEBUG=false in production .env
- [ ] JWT secrets generated and secure
- [ ] Database credentials strong and unique
- [ ] CORS configured with specific origins
- [ ] Rate limiting enabled
- [ ] SSL certificates ready

### Infrastructure
- [ ] Production server provisioned
- [ ] Database server configured
- [ ] Redis/cache server ready
- [ ] File storage configured (S3/Spaces)
- [ ] CDN configured (if applicable)
- [ ] Backup solution implemented

---

## Server Requirements

### Backend Server
- **OS**: Ubuntu 22.04 LTS (recommended) or equivalent
- **PHP**: 8.3+
- **Web Server**: Nginx or Apache
- **Memory**: Minimum 2GB RAM (4GB+ recommended)
- **Storage**: 20GB+ SSD
- **PHP Extensions**:
  - pdo_pgsql
  - mbstring
  - openssl
  - tokenizer
  - xml
  - ctype
  - json
  - bcmath
  - redis

### Database Server
- **PostgreSQL**: 15+ (recommended) or 14+
- **Memory**: Minimum 2GB RAM
- **Storage**: 50GB+ SSD with regular backups

### Frontend Server
- **Node.js**: 20+ LTS
- **Memory**: Minimum 1GB RAM
- **Storage**: 10GB+ SSD

### Optional Services
- **Redis**: For caching, sessions, queues
- **Supervisor**: For queue workers
- **Certbot**: For SSL certificates

---

## Backend Deployment

### Step 1: Clone Repository

```bash
cd /var/www
git clone https://github.com/your-org/bitflow-admin.git
cd bitflow-admin/backend
```

### Step 2: Install Dependencies

```bash
composer install --no-dev --optimize-autoloader
```

### Step 3: Configure Environment

```bash
cp .env.example .env
nano .env  # Edit with production values
```

**Critical .env settings**:
```env
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=pgsql
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis
```

### Step 4: Generate Keys

```bash
php artisan key:generate
php artisan jwt:secret
```

### Step 5: Run Migrations

```bash
php artisan migrate --force
```

### Step 6: Seed Initial Data (if needed)

```bash
php artisan db:seed --class=ProductionSeeder
```

### Step 7: Optimize Application

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

### Step 8: Set Permissions

```bash
sudo chown -R www-data:www-data /var/www/bitflow-admin/backend
sudo chmod -R 755 /var/www/bitflow-admin/backend
sudo chmod -R 775 /var/www/bitflow-admin/backend/storage
sudo chmod -R 775 /var/www/bitflow-admin/backend/bootstrap/cache
```

### Step 9: Configure Nginx

Create `/etc/nginx/sites-available/bitflow-api`:

```nginx
server {
    listen 80;
    server_name api.bitflow.edu;
    root /var/www/bitflow-admin/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/bitflow-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 10: Setup Queue Workers

Create `/etc/supervisor/conf.d/bitflow-worker.conf`:

```ini
[program:bitflow-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/bitflow-admin/backend/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/bitflow-admin/backend/storage/logs/worker.log
stopwaitsecs=3600
```

Start workers:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start bitflow-worker:*
```

### Step 11: Setup Cron

```bash
sudo crontab -e -u www-data
```

Add:
```
* * * * * cd /var/www/bitflow-admin/backend && php artisan schedule:run >> /dev/null 2>&1
```

---

## Frontend Deployment

### Step 1: Build Application

```bash
cd /var/www/bitflow-admin/bitflow-admin
npm ci
npm run build
```

### Step 2: Configure Environment

Create `.env.production`:
```env
NEXT_PUBLIC_API_URL=https://api.bitflow.edu/api/v1
NEXT_PUBLIC_APP_URL=https://app.bitflow.edu
NODE_ENV=production
```

### Step 3: Start Production Server

#### Option A: PM2 (Recommended)

```bash
npm install -g pm2
pm2 start npm --name "bitflow-frontend" -- start
pm2 save
pm2 startup
```

#### Option B: Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t bitflow-frontend .
docker run -d -p 3000:3000 --name bitflow-frontend bitflow-frontend
```

### Step 4: Configure Nginx Reverse Proxy

Create `/etc/nginx/sites-available/bitflow-app`:

```nginx
server {
    listen 80;
    server_name app.bitflow.edu;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable:
```bash
sudo ln -s /etc/nginx/sites-available/bitflow-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Database Setup

### PostgreSQL Configuration

1. **Install PostgreSQL**:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

2. **Create Database and User**:
```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE bitflow_production;
CREATE USER bitflow_admin WITH ENCRYPTED PASSWORD 'STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE bitflow_production TO bitflow_admin;
\c bitflow_production
GRANT ALL ON SCHEMA public TO bitflow_admin;
\q
```

3. **Configure pg_hba.conf** for SSL:
```bash
sudo nano /etc/postgresql/15/main/pg_hba.conf
```

Add:
```
hostssl all all 0.0.0.0/0 md5
```

4. **Enable SSL**:
```bash
sudo nano /etc/postgresql/15/main/postgresql.conf
```

Set:
```
ssl = on
ssl_cert_file = '/path/to/certificate.crt'
ssl_key_file = '/path/to/private.key'
```

5. **Restart PostgreSQL**:
```bash
sudo systemctl restart postgresql
```

### Database Backups

Create `/usr/local/bin/backup-bitflow-db.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/bitflow"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="bitflow_production"
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_$DATE.sql.gz"

mkdir -p $BACKUP_DIR

pg_dump -U bitflow_admin -h localhost $DB_NAME | gzip > $BACKUP_FILE

# Keep only last 30 days
find $BACKUP_DIR -type f -name "*.sql.gz" -mtime +30 -delete

# Upload to S3 (optional)
# aws s3 cp $BACKUP_FILE s3://bitflow-backups/database/
```

Make executable and schedule:
```bash
sudo chmod +x /usr/local/bin/backup-bitflow-db.sh
sudo crontab -e
```

Add:
```
0 2 * * * /usr/local/bin/backup-bitflow-db.sh
```

---

## SSL/HTTPS Configuration

### Using Let's Encrypt (Certbot)

1. **Install Certbot**:
```bash
sudo apt install certbot python3-certbot-nginx
```

2. **Obtain Certificates**:
```bash
sudo certbot --nginx -d api.bitflow.edu -d app.bitflow.edu
```

3. **Auto-Renewal**:
Certbot automatically sets up renewal. Test with:
```bash
sudo certbot renew --dry-run
```

4. **Force HTTPS**:
Certbot updates Nginx config automatically. Verify:
```nginx
server {
    listen 443 ssl;
    # ... SSL configuration added by Certbot
}

server {
    listen 80;
    return 301 https://$host$request_uri;
}
```

---

## Post-Deployment Tasks

### 1. Verify API Endpoints

```bash
curl https://api.bitflow.edu/api/v1/health
# Expected: {"status":"ok"}
```

### 2. Test Authentication

```bash
curl -X POST https://api.bitflow.edu/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

### 3. Check Logs

```bash
tail -f /var/www/bitflow-admin/backend/storage/logs/laravel.log
```

### 4. Monitor Queue Workers

```bash
sudo supervisorctl status
php artisan queue:monitor redis:default,redis:high
```

### 5. Test Frontend

Visit `https://app.bitflow.edu` and verify:
- [ ] Login works
- [ ] API calls successful
- [ ] Navigation functional
- [ ] No console errors

### 6. Setup Monitoring

Configure application monitoring:
- **Error Tracking**: Sentry
- **Performance**: New Relic / Datadog
- **Uptime**: Pingdom / UptimeRobot
- **Logs**: ELK Stack / CloudWatch

---

## Monitoring & Maintenance

### Daily Checks
- [ ] Check error logs
- [ ] Monitor queue status
- [ ] Verify backups completed
- [ ] Check disk space
- [ ] Monitor API response times

### Weekly Tasks
- [ ] Review performance metrics
- [ ] Check security updates
- [ ] Test backup restoration
- [ ] Review user feedback

### Monthly Tasks
- [ ] Update dependencies (test in staging first)
- [ ] Security audit
- [ ] Performance optimization
- [ ] Cost analysis

### Monitoring Commands

```bash
# Check application status
php artisan queue:monitor
php artisan horizon:status  # if using Horizon

# Check server resources
df -h                       # Disk space
free -m                     # Memory
top                         # CPU/processes

# Check logs
tail -f storage/logs/laravel.log
tail -f /var/log/nginx/error.log
```

---

## Rollback Procedures

### Backend Rollback

1. **Stop queue workers**:
```bash
sudo supervisorctl stop bitflow-worker:*
```

2. **Switch to previous version**:
```bash
cd /var/www/bitflow-admin/backend
git fetch --all
git checkout tags/v1.0.0  # or specific commit
composer install --no-dev
```

3. **Rollback database** (if needed):
```bash
php artisan migrate:rollback --step=1
```

4. **Clear caches**:
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

5. **Restart services**:
```bash
sudo supervisorctl start bitflow-worker:*
sudo systemctl reload php8.3-fpm
```

### Frontend Rollback

```bash
cd /var/www/bitflow-admin/bitflow-admin
git checkout tags/v1.0.0
npm ci
npm run build
pm2 restart bitflow-frontend
```

---

## Troubleshooting

### Issue: 500 Internal Server Error

**Check**:
```bash
tail -100 storage/logs/laravel.log
tail -100 /var/log/nginx/error.log
```

**Common causes**:
- Permissions issues
- Missing .env file
- Database connection failed
- PHP extensions missing

**Fix**:
```bash
sudo chown -R www-data:www-data storage bootstrap/cache
php artisan config:clear
```

### Issue: Queue Not Processing

**Check worker status**:
```bash
sudo supervisorctl status bitflow-worker:*
```

**Restart workers**:
```bash
sudo supervisorctl restart bitflow-worker:*
```

**Check Redis**:
```bash
redis-cli ping
# Expected: PONG
```

### Issue: High Memory Usage

**Check processes**:
```bash
ps aux --sort=-%mem | head
```

**Restart PHP-FPM**:
```bash
sudo systemctl restart php8.3-fpm
```

**Optimize cache**:
```bash
php artisan cache:clear
php artisan view:clear
```

### Issue: Slow API Response

**Check database**:
```bash
php artisan telescope:list  # View slow queries
```

**Enable query logging**:
```php
DB::enableQueryLog();
// ... your code
dd(DB::getQueryLog());
```

**Optimize**:
```bash
php artisan route:cache
php artisan config:cache
php artisan optimize
```

### Issue: SSL Certificate Expired

**Renew certificate**:
```bash
sudo certbot renew
sudo systemctl reload nginx
```

**Check expiry**:
```bash
sudo certbot certificates
```

---

## Support & Documentation

- **API Documentation**: https://api.bitflow.edu/docs
- **Technical Support**: support@bitflow.edu
- **Emergency Contact**: +1-XXX-XXX-XXXX

## Version History

- **v1.0.0** - Initial production release
- **v1.1.0** - Added department management features
- **v1.2.0** - Added student enrollment system

---

**Last Updated**: October 2025
**Maintained By**: BitFlow DevOps Team
