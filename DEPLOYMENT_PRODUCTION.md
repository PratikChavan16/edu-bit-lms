# Production Deployment Guide

**Bitflow Owner Portal - Educational Institution Management System**

Version: 1.0  
Last Updated: October 31, 2025  
Status: Production Ready

---

## Table of Contents

1. [Server Requirements](#server-requirements)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Backend Deployment](#backend-deployment)
6. [Frontend Deployment](#frontend-deployment)
7. [SSL/TLS Configuration](#ssltls-configuration)
8. [Domain Setup](#domain-setup)
9. [Docker Production Deployment](#docker-production-deployment)
10. [CI/CD Pipeline](#cicd-pipeline)
11. [Post-Deployment Verification](#post-deployment-verification)
12. [Rollback Procedures](#rollback-procedures)
13. [Production Checklist](#production-checklist)

---

## Server Requirements

### Minimum Hardware Specifications

**Application Server:**
- **CPU:** 4 cores (8 recommended for high traffic)
- **RAM:** 8 GB (16 GB recommended)
- **Storage:** 100 GB SSD
- **Network:** 1 Gbps connection

**Database Server:**
- **CPU:** 4 cores
- **RAM:** 16 GB (for MySQL with proper buffer pool)
- **Storage:** 500 GB SSD (RAID 10 recommended)

**Redis Server:**
- **CPU:** 2 cores
- **RAM:** 4 GB
- **Storage:** 20 GB SSD

### Software Requirements

**Operating System:**
- Ubuntu 22.04 LTS or 24.04 LTS (recommended)
- CentOS/RHEL 8+ (alternative)
- Debian 11+ (alternative)

**Backend Stack:**
- **PHP:** 8.2 or higher
- **Composer:** 2.x
- **Nginx:** 1.24+ or Apache 2.4+
- **MySQL:** 8.0+
- **Redis:** 7.0+

**Frontend Stack:**
- **Node.js:** 18.x LTS or 20.x LTS
- **npm/pnpm:** Latest stable

**Additional Tools:**
- **Git:** 2.x
- **Supervisor:** (for queue workers)
- **Certbot:** (for SSL certificates)

---

## Pre-Deployment Checklist

### Code Preparation

- [ ] All features tested in staging environment
- [ ] E2E tests passing (70+ tests)
- [ ] Security audit completed (OWASP Top 10 compliance)
- [ ] Performance testing completed
- [ ] Code reviewed and approved
- [ ] Version tagged in Git (e.g., `v1.0.0`)
- [ ] Documentation updated

### Infrastructure Preparation

- [ ] Production servers provisioned
- [ ] Database server configured with backups
- [ ] Redis server configured
- [ ] DNS records configured
- [ ] SSL certificates obtained
- [ ] Firewall rules configured
- [ ] Load balancer configured (if applicable)
- [ ] CDN configured (if applicable)

### Access & Credentials

- [ ] SSH keys configured for deployment
- [ ] Database credentials secured
- [ ] API keys and secrets generated
- [ ] JWT RSA keys generated (4096-bit)
- [ ] Email SMTP credentials configured
- [ ] Monitoring tools access configured

---

## Environment Configuration

### Backend Configuration (.env)

Create `/var/www/bitflow-backend/.env`:

```env
# Application
APP_NAME="Bitflow Owner Portal"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.bitflow.com
APP_TIMEZONE=UTC

# Database
DB_CONNECTION=mysql
DB_HOST=db.bitflow.internal
DB_PORT=3306
DB_DATABASE=bitflow_production
DB_USERNAME=bitflow_app
DB_PASSWORD=<STRONG_PASSWORD_HERE>

# Redis
REDIS_HOST=redis.bitflow.internal
REDIS_PASSWORD=<REDIS_PASSWORD_HERE>
REDIS_PORT=6379
REDIS_DB=0
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# JWT Configuration
JWT_PRIVATE_KEY=storage/keys/private.pem
JWT_PUBLIC_KEY=storage/keys/public.pem
JWT_ACCESS_TOKEN_TTL=15
JWT_REFRESH_TOKEN_TTL=10080

# CORS
CORS_ALLOWED_ORIGINS=https://admin.bitflow.com

# Email
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=<SMTP_USERNAME>
MAIL_PASSWORD=<SMTP_PASSWORD>
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@bitflow.com
MAIL_FROM_NAME="${APP_NAME}"

# Logging
LOG_CHANNEL=daily
LOG_LEVEL=warning
LOG_DAYS=14

# Queue
QUEUE_CONNECTION=redis

# Rate Limiting
RATE_LIMIT_LOGIN=5
RATE_LIMIT_PASSWORD_RESET=3
RATE_LIMIT_REGISTRATION=3

# File Storage
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=<AWS_KEY>
AWS_SECRET_ACCESS_KEY=<AWS_SECRET>
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=bitflow-production
AWS_USE_PATH_STYLE_ENDPOINT=false

# Monitoring
TELESCOPE_ENABLED=false
```

### Frontend Configuration (.env.production)

Create `/var/www/bitflow-admin/.env.production`:

```env
NEXT_PUBLIC_API_URL=https://api.bitflow.com
NEXT_PUBLIC_APP_NAME="Bitflow Owner Portal"
NEXT_PUBLIC_APP_ENV=production

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Database Setup

### 1. Create Database and User

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE bitflow_production CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create application user with limited privileges
CREATE USER 'bitflow_app'@'%' IDENTIFIED BY '<STRONG_PASSWORD_HERE>';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX, ALTER, DROP, REFERENCES 
ON bitflow_production.* TO 'bitflow_app'@'%';
FLUSH PRIVILEGES;
```

### 2. Optimize MySQL Configuration

Edit `/etc/mysql/mysql.conf.d/mysqld.cnf`:

```ini
[mysqld]
# Buffer pool size (70-80% of available RAM on dedicated DB server)
innodb_buffer_pool_size = 12G

# Log file size
innodb_log_file_size = 1G

# Connection settings
max_connections = 500
max_allowed_packet = 64M

# Query cache (disabled in MySQL 8.0+)
# query_cache_type = 0
# query_cache_size = 0

# Performance settings
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT
innodb_file_per_table = 1

# Binary logging (for replication and point-in-time recovery)
server-id = 1
log_bin = /var/log/mysql/mysql-bin.log
binlog_expire_logs_seconds = 604800
max_binlog_size = 100M
```

Restart MySQL:

```bash
sudo systemctl restart mysql
```

### 3. Run Migrations

```bash
cd /var/www/bitflow-backend
php artisan migrate --force
```

### 4. Seed Initial Data (First Deployment Only)

```bash
php artisan db:seed --class=RolesAndPermissionsSeeder --force
php artisan db:seed --class=DefaultUsersSeeder --force
```

### 5. Create Database Backups

```bash
# Install backup script
sudo nano /usr/local/bin/backup-bitflow-db.sh
```

Add:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="bitflow_production"
DB_USER="bitflow_app"
DB_PASS="<PASSWORD>"

mkdir -p $BACKUP_DIR
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME | gzip > $BACKUP_DIR/bitflow_$DATE.sql.gz

# Keep only last 30 days of backups
find $BACKUP_DIR -name "bitflow_*.sql.gz" -mtime +30 -delete
```

```bash
sudo chmod +x /usr/local/bin/backup-bitflow-db.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
0 2 * * * /usr/local/bin/backup-bitflow-db.sh
```

---

## Backend Deployment

### 1. Clone Repository

```bash
sudo mkdir -p /var/www
cd /var/www
sudo git clone https://github.com/PratikChavan16/edu-bit-lms.git bitflow-backend
cd bitflow-backend/backend
```

### 2. Install Dependencies

```bash
composer install --no-dev --optimize-autoloader
```

### 3. Set Permissions

```bash
sudo chown -R www-data:www-data /var/www/bitflow-backend
sudo chmod -R 755 /var/www/bitflow-backend
sudo chmod -R 775 /var/www/bitflow-backend/backend/storage
sudo chmod -R 775 /var/www/bitflow-backend/backend/bootstrap/cache
```

### 4. Generate Application Key

```bash
php artisan key:generate --force
```

### 5. Generate JWT Keys

```bash
mkdir -p storage/keys
openssl genrsa -out storage/keys/private.pem 4096
openssl rsa -in storage/keys/private.pem -pubout -out storage/keys/public.pem
chmod 600 storage/keys/private.pem
chmod 644 storage/keys/public.pem
```

### 6. Cache Configuration

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 7. Configure Nginx

Create `/etc/nginx/sites-available/bitflow-api`:

```nginx
server {
    listen 80;
    server_name api.bitflow.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.bitflow.com;
    
    root /var/www/bitflow-backend/backend/public;
    index index.php;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.bitflow.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.bitflow.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Logging
    access_log /var/log/nginx/bitflow-api-access.log;
    error_log /var/log/nginx/bitflow-api-error.log;
    
    # Gzip
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Rate limiting zone
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        
        # PHP settings
        fastcgi_buffer_size 128k;
        fastcgi_buffers 4 256k;
        fastcgi_busy_buffers_size 256k;
        fastcgi_read_timeout 300;
    }
    
    location ~ /\.(?!well-known).* {
        deny all;
    }
    
    # File upload limit
    client_max_body_size 20M;
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/bitflow-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 8. Configure Queue Workers with Supervisor

Create `/etc/supervisor/conf.d/bitflow-worker.conf`:

```ini
[program:bitflow-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/bitflow-backend/backend/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/var/www/bitflow-backend/backend/storage/logs/worker.log
stopwaitsecs=3600
```

Start workers:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start bitflow-worker:*
```

### 9. Configure Scheduled Tasks

```bash
sudo crontab -e -u www-data
```

Add:

```
* * * * * cd /var/www/bitflow-backend/backend && php artisan schedule:run >> /dev/null 2>&1
```

---

## Frontend Deployment

### 1. Clone and Build

```bash
cd /var/www
sudo git clone https://github.com/PratikChavan16/edu-bit-lms.git bitflow-frontend
cd bitflow-frontend/bitflow-admin

# Install dependencies
npm install --production=false

# Build production bundle
npm run build
```

### 2. Start with PM2

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start Next.js application
pm2 start npm --name "bitflow-admin" -- start

# Configure auto-restart on server reboot
pm2 startup
pm2 save
```

### 3. Configure Nginx for Frontend

Create `/etc/nginx/sites-available/bitflow-admin`:

```nginx
server {
    listen 80;
    server_name admin.bitflow.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.bitflow.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/admin.bitflow.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.bitflow.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Security Headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Logging
    access_log /var/log/nginx/bitflow-admin-access.log;
    error_log /var/log/nginx/bitflow-admin-error.log;
    
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
    
    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/bitflow-admin /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## SSL/TLS Configuration

### Using Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtain certificates
sudo certbot --nginx -d api.bitflow.com -d admin.bitflow.com

# Certificates will auto-renew via cron
# Test renewal
sudo certbot renew --dry-run
```

---

## Domain Setup

### DNS Records

Configure the following DNS records with your DNS provider:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | api.bitflow.com | `<SERVER_IP>` | 300 |
| A | admin.bitflow.com | `<SERVER_IP>` | 300 |
| AAAA | api.bitflow.com | `<IPv6_IF_AVAILABLE>` | 300 |
| AAAA | admin.bitflow.com | `<IPv6_IF_AVAILABLE>` | 300 |

---

## Docker Production Deployment

### Docker Compose Configuration

Create `docker-compose.production.yml`:

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: bitflow-backend
    restart: unless-stopped
    environment:
      - APP_ENV=production
      - APP_DEBUG=false
    volumes:
      - ./backend:/var/www
      - ./backend/.env:/var/www/.env
    ports:
      - "8000:8000"
    depends_on:
      - mysql
      - redis
    networks:
      - bitflow-network

  frontend:
    build:
      context: ./bitflow-admin
      dockerfile: Dockerfile
    container_name: bitflow-frontend
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - bitflow-network

  mysql:
    image: mysql:8.0
    container_name: bitflow-mysql
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: bitflow_production
      MYSQL_USER: bitflow_app
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
    volumes:
      - mysql-data:/var/lib/mysql
      - ./mysql/production.cnf:/etc/mysql/conf.d/production.cnf
    ports:
      - "3306:3306"
    networks:
      - bitflow-network

  redis:
    image: redis:7-alpine
    container_name: bitflow-redis
    restart: unless-stopped
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data
    ports:
      - "6379:6379"
    networks:
      - bitflow-network

  nginx:
    image: nginx:alpine
    container_name: bitflow-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/production.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
      - /etc/letsencrypt:/etc/letsencrypt
    depends_on:
      - backend
      - frontend
    networks:
      - bitflow-network

volumes:
  mysql-data:
  redis-data:

networks:
  bitflow-network:
    driver: bridge
```

### Deploy with Docker

```bash
# Build and start containers
docker-compose -f docker-compose.production.yml up -d --build

# Run migrations
docker-compose -f docker-compose.production.yml exec backend php artisan migrate --force

# Check status
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy-production.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          extensions: mbstring, xml, ctype, iconv, intl, pdo_mysql, dom, filter, gd, json, zip
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install Backend Dependencies
        working-directory: ./backend
        run: composer install --no-dev --optimize-autoloader
      
      - name: Run Backend Tests
        working-directory: ./backend
        run: php artisan test
      
      - name: Install Frontend Dependencies
        working-directory: ./bitflow-admin
        run: npm ci
      
      - name: Build Frontend
        working-directory: ./bitflow-admin
        run: npm run build
      
      - name: Run Frontend Tests
        working-directory: ./bitflow-admin
        run: npm run test:e2e
      
      - name: Deploy to Server
        uses: appleboy/ssh-action@v0.1.7
        with:
          host: ${{ secrets.PRODUCTION_HOST }}
          username: ${{ secrets.PRODUCTION_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /var/www/bitflow-backend
            git pull origin main
            cd backend
            composer install --no-dev --optimize-autoloader
            php artisan migrate --force
            php artisan config:cache
            php artisan route:cache
            php artisan view:cache
            sudo supervisorctl restart bitflow-worker:*
            
            cd /var/www/bitflow-frontend/bitflow-admin
            git pull origin main
            npm ci --production=false
            npm run build
            pm2 restart bitflow-admin
      
      - name: Notify Deployment
        if: success()
        run: echo "Deployment successful!"
```

---

## Post-Deployment Verification

### 1. Health Checks

```bash
# Backend health check
curl https://api.bitflow.com/up

# Expected response: {"status":"ok"}

# Frontend health check
curl -I https://admin.bitflow.com

# Expected: HTTP/2 200
```

### 2. Database Connectivity

```bash
cd /var/www/bitflow-backend/backend
php artisan tinker

# In tinker:
DB::connection()->getPdo();
# Should not throw error
```

### 3. Redis Connectivity

```bash
redis-cli -h redis.bitflow.internal -a <REDIS_PASSWORD>
PING
# Expected: PONG
```

### 4. Queue Workers

```bash
sudo supervisorctl status
# All bitflow-worker processes should be RUNNING
```

### 5. SSL Certificate

```bash
curl -vI https://api.bitflow.com 2>&1 | grep "SSL certificate"
# Should show valid certificate
```

### 6. Scheduled Tasks

```bash
# Check cron is configured
sudo crontab -l -u www-data

# Manually trigger scheduler to verify
cd /var/www/bitflow-backend/backend
php artisan schedule:run -v
```

### 7. API Functionality Test

```bash
# Test login endpoint
curl -X POST https://api.bitflow.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"bitflow@example.com","password":"<PASSWORD>"}'

# Expected: {"token":"eyJ...","user":{...}}
```

### 8. Performance Test

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test API performance
ab -n 1000 -c 10 https://api.bitflow.com/up

# Check response times (should be < 200ms P95)
```

---

## Rollback Procedures

### Quick Rollback (Docker)

```bash
# Stop current containers
docker-compose -f docker-compose.production.yml down

# Checkout previous version
cd /var/www/bitflow-backend
git checkout v1.0.0  # Previous stable version

cd /var/www/bitflow-frontend
git checkout v1.0.0

# Rebuild and start
docker-compose -f docker-compose.production.yml up -d --build
```

### Database Rollback

```bash
# Restore from backup
cd /var/backups/mysql
gunzip < bitflow_20251030_020000.sql.gz | mysql -u bitflow_app -p bitflow_production

# Or use Laravel migration rollback (if applicable)
php artisan migrate:rollback --step=1
```

### Application Rollback (Non-Docker)

```bash
# Backend rollback
cd /var/www/bitflow-backend
git checkout v1.0.0
composer install --no-dev --optimize-autoloader
php artisan config:cache
php artisan route:cache
sudo supervisorctl restart bitflow-worker:*

# Frontend rollback
cd /var/www/bitflow-frontend/bitflow-admin
git checkout v1.0.0
npm ci --production=false
npm run build
pm2 restart bitflow-admin
```

---

## Production Checklist

### Security

- [x] `APP_DEBUG=false` in production
- [x] Strong passwords for all accounts
- [x] JWT keys generated with 4096-bit encryption
- [x] CORS configured with specific allowed origins (no `*`)
- [x] Security headers configured
- [x] Rate limiting enabled
- [x] SSL/TLS certificates installed
- [x] Firewall rules configured
- [x] Database user has minimal required permissions
- [x] All secrets stored securely (not in version control)

### Performance

- [x] MySQL buffer pool optimized
- [x] Redis configured for sessions and cache
- [x] Nginx gzip compression enabled
- [x] Static asset caching configured
- [x] Queue workers running (4 processes minimum)
- [x] PHP-FPM pool optimized
- [x] Next.js production build created

### Monitoring

- [x] Application logs configured
- [x] Nginx access/error logs configured
- [x] Database slow query log enabled
- [x] Uptime monitoring configured
- [x] Error tracking configured
- [x] Performance monitoring configured

### Backup & Recovery

- [x] Daily database backups scheduled
- [x] Backup retention policy configured (30 days)
- [x] Backup restoration tested
- [x] File storage backups configured (if using local storage)

### Deployment

- [x] CI/CD pipeline configured
- [x] Deployment process documented
- [x] Rollback procedure tested
- [x] Health check endpoints verified
- [x] DNS records configured
- [x] Email delivery tested

---

## Support & Troubleshooting

**Common Issues:**

1. **502 Bad Gateway:** Check PHP-FPM is running (`systemctl status php8.2-fpm`)
2. **Queue jobs not processing:** Check Supervisor workers (`supervisorctl status`)
3. **Database connection failed:** Verify credentials and firewall rules
4. **High memory usage:** Check MySQL buffer pool size and query performance

**Logs Location:**
- Application: `/var/www/bitflow-backend/backend/storage/logs/laravel.log`
- Nginx: `/var/log/nginx/`
- MySQL: `/var/log/mysql/`
- Queue workers: `/var/www/bitflow-backend/backend/storage/logs/worker.log`

**Emergency Contacts:**
- DevOps Team: devops@bitflow.com
- System Administrator: admin@bitflow.com

---

**Document Version:** 1.0  
**Last Reviewed:** October 31, 2025  
**Next Review:** November 30, 2025

For monitoring and observability, see **[MONITORING.md](MONITORING.md)**