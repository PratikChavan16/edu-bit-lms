# Admission Admin Portal - Build & Deployment Guide

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Prerequisites

### Development Environment
```bash
# Required Software
- PHP 8.2+
- Composer 2.6+
- Node.js 20 LTS
- npm 10+
- PostgreSQL 16
- Redis 7.2
- Elasticsearch 8.11
```

### AWS Services
- AWS S3 (Document storage)
- AWS Textract (OCR service)
- AWS SES (Email service)
- AWS CloudWatch (Monitoring)

### Third-Party Services
- Razorpay/HDFC Payment Gateway
- Twilio/MSG91 SMS Gateway
- JEE/CET Exam API credentials

---

## 1. Backend Setup (Laravel 11)

### 1.1 Clone Repository
```bash
git clone https://github.com/institution/admission-portal.git
cd admission-portal/backend
```

### 1.2 Install Dependencies
```bash
composer install
cp .env.example .env
php artisan key:generate
```

### 1.3 Configure Environment
**Edit `.env`**:
```env
APP_NAME="Admission Admin Portal"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8010

# Database
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=admission_db
DB_USERNAME=postgres
DB_PASSWORD=secret

# Redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DEFAULT_REGION=ap-south-1
AWS_BUCKET=admission-documents-dev

# AWS Textract
AWS_TEXTRACT_REGION=ap-south-1

# AWS SES
MAIL_MAILER=ses
MAIL_FROM_ADDRESS=admission@institution.edu
MAIL_FROM_NAME="Admission Office"

# Razorpay
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx

# Twilio
TWILIO_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_FROM=+91XXXXXXXXXX

# JEE API
JEE_API_URL=https://api.nta.ac.in/v2/jee-mains
JEE_API_KEY=xxxxx
JEE_OAUTH_CLIENT_ID=xxxxx
JEE_OAUTH_CLIENT_SECRET=xxxxx

# Elasticsearch
ELASTICSEARCH_HOST=localhost:9200
ELASTICSEARCH_USER=elastic
ELASTICSEARCH_PASSWORD=changeme

# Queue
QUEUE_CONNECTION=redis

# Session
SESSION_DRIVER=redis
SESSION_LIFETIME=480
```

---

### 1.4 Database Setup

#### Run Migrations
```bash
php artisan migrate --seed
```

#### Database Schema Created
- applications (42 columns)
- documents (18 columns)
- document_assignments (8 columns)
- document_verification_log (10 columns)
- merit_lists (15 columns)
- merit_list_applicants (12 columns)
- seat_allocations (14 columns)
- counseling_rounds (9 columns)
- choice_fillings (10 columns)
- payments (16 columns)
- staff (14 columns)
- audit_logs (11 columns)

#### Seed Admin Users
```bash
php artisan db:seed --class=StaffSeeder
```

**Default Admin Credentials**:
```
Email: admin@institution.edu
Password: Admin@12345
Role: Senior Admission Officer
```

---

### 1.5 Configure Row-Level Security (RLS)

**Run RLS migration**:
```bash
php artisan migrate --path=database/migrations/rls
```

**RLS Policies Created**:
```sql
-- Document verifiers can only access assigned applications
CREATE POLICY verifier_access ON applications
    FOR SELECT
    USING (
        id IN (
            SELECT application_id FROM document_assignments 
            WHERE staff_id = current_setting('app.current_staff_id')
        )
    );

-- Coordinators can access all applications
CREATE POLICY coordinator_access ON applications
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM staff 
            WHERE staff_id = current_setting('app.current_staff_id')
            AND role IN ('senior_admission_officer', 'document_verification_coordinator')
        )
    );
```

---

### 1.6 Setup Queue Workers

**Start queue workers (10 workers for document processing)**:
```bash
php artisan queue:work --queue=documents,emails,sms --tries=3 --timeout=300 &
php artisan queue:work --queue=documents,emails,sms --tries=3 --timeout=300 &
# ... repeat for 10 workers
```

**Or use Supervisor**:
```ini
[program:admission-queue-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/admission-portal/artisan queue:work redis --queue=documents,emails,sms --tries=3 --timeout=300
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=10
redirect_stderr=true
stdout_logfile=/var/www/admission-portal/storage/logs/worker.log
stopwaitsecs=3600
```

---

### 1.7 Setup Scheduled Tasks

**Add to crontab**:
```bash
* * * * * cd /var/www/admission-portal && php artisan schedule:run >> /dev/null 2>&1
```

**Scheduled Jobs**:
```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    // Daily payment reconciliation at 2 AM
    $schedule->command('payment:reconcile')->dailyAt('02:00');
    
    // Process pending OCR jobs every 5 minutes
    $schedule->command('ocr:process')->everyFiveMinutes();
    
    // Send counseling reminders (during admission season)
    $schedule->command('counseling:remind')->dailyAt('09:00');
    
    // Generate daily reports at 11 PM
    $schedule->command('reports:generate')->dailyAt('23:00');
    
    // Cleanup expired sessions hourly
    $schedule->command('session:cleanup')->hourly();
}
```

---

### 1.8 Start Development Server
```bash
php artisan serve --host=0.0.0.0 --port=8010
```

**Backend running at**: `http://localhost:8010`

---

## 2. Frontend Setup (Next.js 15)

### 2.1 Setup Frontend
```bash
cd ../frontend
npm install
cp .env.example .env.local
```

### 2.2 Configure Environment
**Edit `.env.local`**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8010/api
NEXT_PUBLIC_APP_NAME="Admission Admin Portal"
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
NEXT_PUBLIC_WS_URL=ws://localhost:6001

# Auth
NEXTAUTH_URL=http://localhost:3010
NEXTAUTH_SECRET=your_secret_here

# AWS S3 (for pre-signed URLs)
NEXT_PUBLIC_S3_BUCKET=admission-documents-dev
NEXT_PUBLIC_S3_REGION=ap-south-1
```

---

### 2.3 Install UI Dependencies
```bash
npm install @tanstack/react-table recharts
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install react-hook-form zod
npm install react-hot-toast
npm install lucide-react
```

---

### 2.4 Start Development Server
```bash
npm run dev
```

**Frontend running at**: `http://localhost:3010`

---

## 3. Elasticsearch Setup

### 3.1 Install Elasticsearch
```bash
# Using Docker
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=true" \
  -e "ELASTIC_PASSWORD=changeme" \
  docker.elastic.co/elasticsearch/elasticsearch:8.11.0
```

---

### 3.2 Create Index Mapping
```bash
php artisan elasticsearch:create-index
```

**Index mapping**:
```json
{
  "mappings": {
    "properties": {
      "application_id": {"type": "keyword"},
      "name": {"type": "text", "analyzer": "standard"},
      "email": {"type": "keyword"},
      "mobile": {"type": "keyword"},
      "program": {"type": "keyword"},
      "category": {"type": "keyword"},
      "status": {"type": "keyword"},
      "entrance_score": {"type": "float"},
      "hsc_percentage": {"type": "float"},
      "merit_score": {"type": "float"},
      "created_at": {"type": "date"}
    }
  }
}
```

---

### 3.3 Index Existing Applications
```bash
php artisan elasticsearch:reindex
```

---

## 4. Redis Setup

### 4.1 Install Redis
```bash
# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis-server

# Or using Docker
docker run -d --name redis -p 6379:6379 redis:7.2-alpine
```

---

### 4.2 Configure Redis for Sessions & Queues
```bash
# Test connection
redis-cli ping
# Expected: PONG
```

---

## 5. AWS Services Setup

### 5.1 S3 Bucket Configuration

**Create bucket**:
```bash
aws s3 mb s3://admission-documents-prod --region ap-south-1
```

**Enable encryption**:
```bash
aws s3api put-bucket-encryption \
  --bucket admission-documents-prod \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
```

**Enable versioning**:
```bash
aws s3api put-bucket-versioning \
  --bucket admission-documents-prod \
  --versioning-configuration Status=Enabled
```

**Setup lifecycle policy** (Archive to Glacier after 2 years):
```bash
aws s3api put-bucket-lifecycle-configuration \
  --bucket admission-documents-prod \
  --lifecycle-configuration file://lifecycle.json
```

**lifecycle.json**:
```json
{
  "Rules": [{
    "Id": "TransitionToGlacier",
    "Status": "Enabled",
    "Prefix": "applications/",
    "Transitions": [{
      "Days": 730,
      "StorageClass": "GLACIER"
    }],
    "Expiration": {
      "Days": 2555
    }
  }]
}
```

---

### 5.2 AWS Textract IAM Role

**Create IAM role** with policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": [
      "textract:AnalyzeDocument",
      "textract:DetectDocumentText"
    ],
    "Resource": "*"
  }, {
    "Effect": "Allow",
    "Action": [
      "s3:GetObject"
    ],
    "Resource": "arn:aws:s3:::admission-documents-prod/*"
  }]
}
```

---

### 5.3 AWS SES Email Verification

**Verify domain**:
```bash
aws ses verify-domain-identity --domain institution.edu --region ap-south-1
```

**Add DNS records** (provided by AWS):
```
TXT record: _amazonses.institution.edu → "verification_token"
DKIM records (3 CNAME records)
```

**Request production access** (remove 200 emails/day limit):
```bash
# Submit request via AWS Console → SES → Account Dashboard → Request Production Access
# Typically approved within 24 hours
```

---

## 6. Payment Gateway Setup

### 6.1 Razorpay Configuration

**Test Credentials** (for development):
```
Key ID: rzp_test_xxxxxxxxxxxx
Key Secret: xxxxxxxxxxxxxxxxx
```

**Webhook Setup**:
1. Go to Razorpay Dashboard → Webhooks
2. Add webhook URL: `https://admission.institution.edu/api/webhooks/razorpay`
3. Select events: `payment.captured`, `payment.failed`, `refund.processed`
4. Copy webhook secret

---

### 6.2 HDFC Payment Gateway

**Merchant ID**: Provided by HDFC  
**Access Code**: Provided by HDFC  
**Working Key**: Provided by HDFC

**Test URL**: `https://test.ccavenue.com/`  
**Production URL**: `https://secure.ccavenue.com/`

---

## 7. SMS Gateway Setup

### 7.1 Twilio Configuration

**Account SID**: ACxxxxxxxxxxxxxxxx  
**Auth Token**: xxxxxxxxxxxxxxxx  
**From Number**: +91XXXXXXXXXX

**Test sending**:
```bash
php artisan sms:test +919876543210 "Test message from Admission Portal"
```

---

### 7.2 MSG91 Configuration (Alternative)

**Auth Key**: xxxxxxxxxxxxxxxx  
**Flow ID**: 6234567890abcdef (for templates)

---

## 8. Production Deployment

### 8.1 Server Requirements

**Minimum**:
- 2 vCPUs, 4GB RAM (handles 500 concurrent users)

**Recommended** (production):
- 5 app servers (4 vCPUs, 8GB RAM each)
- 1 database server (8 vCPUs, 16GB RAM)
- 1 Redis server (2 vCPUs, 4GB RAM)
- 1 Elasticsearch server (4 vCPUs, 8GB RAM)
- Load balancer (AWS ALB or Nginx)

---

### 8.2 Backend Deployment

**Build for production**:
```bash
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

**Setup permissions**:
```bash
chown -R www-data:www-data /var/www/admission-portal
chmod -R 755 /var/www/admission-portal
chmod -R 775 /var/www/admission-portal/storage
chmod -R 775 /var/www/admission-portal/bootstrap/cache
```

**Nginx configuration**:
```nginx
server {
    listen 80;
    server_name admission-api.institution.edu;
    root /var/www/admission-portal/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

---

### 8.3 Frontend Deployment

**Build for production**:
```bash
npm run build
npm run start
```

**Or deploy to Vercel**:
```bash
npm install -g vercel
vercel --prod
```

**Or use PM2**:
```bash
npm install -g pm2
pm2 start npm --name "admission-frontend" -- start
pm2 save
pm2 startup
```

---

### 8.4 SSL Certificate (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d admission.institution.edu -d admission-api.institution.edu
```

---

### 8.5 Load Balancer Configuration (AWS ALB)

**Target Groups**:
- Backend: 5 app servers on port 8010
- Frontend: 3 Next.js servers on port 3010

**Health Checks**:
- Backend: `GET /api/health`
- Frontend: `GET /api/health`

**Auto Scaling**:
- Min instances: 2
- Max instances: 10
- Scale up at 70% CPU
- Scale down at 30% CPU

---

## 9. CI/CD Pipeline (GitHub Actions)

**.github/workflows/deploy.yml**:
```yaml
name: Deploy Admission Portal

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          composer install
          php artisan test --parallel
          
  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to production
        run: |
          ssh user@server "cd /var/www/admission-portal && git pull"
          ssh user@server "cd /var/www/admission-portal && composer install --no-dev"
          ssh user@server "cd /var/www/admission-portal && php artisan migrate --force"
          ssh user@server "sudo systemctl reload php8.2-fpm"
          
  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 10. Monitoring & Logging

### 10.1 AWS CloudWatch

**Application logs**:
```bash
# Install CloudWatch agent
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb

# Configure
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard
```

**Log groups**:
- `/aws/admission/application`
- `/aws/admission/nginx`
- `/aws/admission/php-fpm`

---

### 10.2 Sentry (Error Tracking)

**Install**:
```bash
composer require sentry/sentry-laravel
php artisan sentry:publish --dsn=https://xxxxx@sentry.io/xxxxx
```

---

### 10.3 Grafana Dashboard

**Metrics tracked**:
- Application requests/second
- API latency (P50, P95, P99)
- Database query time
- Queue jobs processed/minute
- Error rate
- Payment success rate

---

## 11. Backup Strategy

### 11.1 Database Backups

**Daily automated backups**:
```bash
#!/bin/bash
# /usr/local/bin/backup-db.sh

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="/backups/admission_db_$TIMESTAMP.sql.gz"

pg_dump -h localhost -U postgres admission_db | gzip > $BACKUP_FILE

# Upload to S3
aws s3 cp $BACKUP_FILE s3://admission-backups/database/

# Keep only last 30 days
find /backups -type f -mtime +30 -delete
```

**Cron**:
```bash
0 2 * * * /usr/local/bin/backup-db.sh
```

---

### 11.2 S3 Cross-Region Replication

**Replicate documents to backup region**:
```bash
aws s3api put-bucket-replication \
  --bucket admission-documents-prod \
  --replication-configuration file://replication.json
```

**replication.json**:
```json
{
  "Role": "arn:aws:iam::ACCOUNT-ID:role/s3-replication-role",
  "Rules": [{
    "Status": "Enabled",
    "Priority": 1,
    "Filter": {"Prefix": ""},
    "Destination": {
      "Bucket": "arn:aws:s3:::admission-documents-backup-singapore"
    }
  }]
}
```

---

## 12. Testing Deployment

### 12.1 Smoke Tests

```bash
# Backend health check
curl https://admission-api.institution.edu/api/health
# Expected: {"status": "ok", "version": "2.0"}

# Frontend health check
curl https://admission.institution.edu/api/health
# Expected: {"status": "ok"}

# Database connectivity
php artisan db:monitor
# Expected: Database connected successfully

# Redis connectivity
redis-cli -h production-redis.internal ping
# Expected: PONG

# S3 connectivity
aws s3 ls s3://admission-documents-prod/
# Expected: List of folders

# Payment gateway test
curl https://admission-api.institution.edu/api/payment/test
# Expected: {"razorpay": "ok", "hdfc": "ok"}
```

---

## 13. Performance Optimization

### 13.1 Enable OPcache
**php.ini**:
```ini
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
```

### 13.2 Enable Redis Cache
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 13.3 CDN for Static Assets
- CloudFlare CDN for frontend assets
- S3 + CloudFront for document delivery

---

**Deployment Status**: ✅ Production Ready  
**Uptime SLA**: 99.8%  
**Deployment Time**: ~30 minutes  
**Rollback Time**: ~5 minutes
