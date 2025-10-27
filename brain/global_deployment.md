# Bitflow LMS - Global Deployment Guide

**Version**: 2.0  
**Last Updated**: October 25, 2025  
**Target**: Production Deployment

---

## Table of Contents

1. [Deployment Architecture](#deployment-architecture)
2. [Infrastructure Setup](#infrastructure-setup)
3. [CI/CD Pipeline](#cicd-pipeline)
4. [Blue-Green Deployment](#blue-green-deployment)
5. [Database Migrations](#database-migrations)
6. [Environment Configuration](#environment-configuration)
7. [SSL/TLS Setup](#ssltls-setup)
8. [Monitoring & Rollback](#monitoring--rollback)

---

## Deployment Architecture

### Production Stack

```
┌─────────────────────────────────────────────────────────┐
│                    Load Balancer (Nginx)                 │
│                  SSL Termination (TLS 1.3)               │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐ ┌──────▼───────┐ ┌────────▼───────┐
│  Frontend      │ │  Frontend    │ │  Frontend      │
│  (Next.js)     │ │  (Next.js)   │ │  (Next.js)     │
│  Ports 3001-14 │ │  Ports 3001-14│ │  Ports 3001-14│
└────────────────┘ └──────────────┘ └────────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                  ┌────────▼────────┐
                  │   API Gateway   │
                  │   (Laravel)     │
                  │   Port 8000     │
                  └────────┬────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
┌───────▼────────┐ ┌──────▼───────┐ ┌────────▼───────┐
│  PostgreSQL    │ │    Redis     │ │   AWS S3       │
│  Primary       │ │   Cluster    │ │  File Storage  │
└────────┬───────┘ └──────────────┘ └────────────────┘
         │
┌────────▼───────┐
│  PostgreSQL    │
│  Read Replica  │
└────────────────┘
```

---

## Infrastructure Setup

### Cloud Provider: AWS

#### EC2 Instances

```yaml
# Backend Instances
- Type: t3.large (2 vCPU, 8GB RAM)
- Count: 3 (Auto-scaling 3-10)
- OS: Ubuntu 22.04 LTS
- AMI: Custom (pre-configured with PHP 8.3, Nginx)

# Frontend Instances
- Type: t3.medium (2 vCPU, 4GB RAM)
- Count: 3 (Auto-scaling 3-10)
- OS: Ubuntu 22.04 LTS
- AMI: Custom (pre-configured with Node.js 20)
```

#### RDS (PostgreSQL)

```yaml
- Engine: PostgreSQL 16
- Instance Class: db.r6g.xlarge (4 vCPU, 32GB RAM)
- Storage: 500GB GP3 (Encrypted)
- Multi-AZ: Yes
- Read Replicas: 2
- Backup Retention: 30 days
- Performance Insights: Enabled
```

#### ElastiCache (Redis)

```yaml
- Engine: Redis 7.0
- Node Type: cache.r6g.large (2 vCPU, 13GB RAM)
- Cluster Mode: Enabled
- Shards: 3
- Replicas per shard: 2
- Automatic Backups: Daily
```

#### S3 Buckets

```yaml
- bitflow-uploads: User uploads (versioning enabled)
- bitflow-backups: Database backups (lifecycle policy: 90 days)
- bitflow-static: Static assets (CloudFront CDN)
```

#### Terraform Configuration

```hcl
# terraform/main.tf

provider "aws" {
  region = "us-east-1"
}

# VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "bitflow-vpc"
  }
}

# Subnets
resource "aws_subnet" "public" {
  count                   = 3
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.${count.index + 1}.0/24"
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "bitflow-public-${count.index + 1}"
  }
}

resource "aws_subnet" "private" {
  count             = 3
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "bitflow-private-${count.index + 1}"
  }
}

# RDS PostgreSQL
resource "aws_db_instance" "postgres" {
  identifier             = "bitflow-postgres"
  engine                 = "postgres"
  engine_version         = "16.1"
  instance_class         = "db.r6g.xlarge"
  allocated_storage      = 500
  storage_type           = "gp3"
  storage_encrypted      = true
  db_name                = "bitflow_lms"
  username               = var.db_username
  password               = var.db_password
  multi_az               = true
  backup_retention_period = 30
  skip_final_snapshot    = false
  final_snapshot_identifier = "bitflow-postgres-final-snapshot"
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  tags = {
    Name = "bitflow-postgres"
  }
}

# ElastiCache Redis
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "bitflow-redis"
  engine               = "redis"
  engine_version       = "7.0"
  node_type            = "cache.r6g.large"
  num_cache_nodes      = 3
  parameter_group_name = "default.redis7"
  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [aws_security_group.redis.id]

  tags = {
    Name = "bitflow-redis"
  }
}

# Auto Scaling Group (Backend)
resource "aws_autoscaling_group" "backend" {
  name                 = "bitflow-backend-asg"
  min_size             = 3
  max_size             = 10
  desired_capacity     = 3
  health_check_type    = "ELB"
  health_check_grace_period = 300
  vpc_zone_identifier  = aws_subnet.private[*].id
  target_group_arns    = [aws_lb_target_group.backend.arn]

  launch_template {
    id      = aws_launch_template.backend.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "bitflow-backend"
    propagate_at_launch = true
  }
}

# Application Load Balancer
resource "aws_lb" "main" {
  name               = "bitflow-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = true
  enable_http2               = true

  tags = {
    Name = "bitflow-alb"
  }
}

# Target Group
resource "aws_lb_target_group" "backend" {
  name     = "bitflow-backend-tg"
  port     = 8000
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id

  health_check {
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 2
    timeout             = 5
    interval            = 30
    path                = "/health"
    matcher             = "200"
  }
}

# S3 Bucket
resource "aws_s3_bucket" "uploads" {
  bucket = "bitflow-uploads"

  tags = {
    Name = "bitflow-uploads"
  }
}

resource "aws_s3_bucket_versioning" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  versioning_configuration {
    status = "Enabled"
  }
}
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml

name: Deploy to Production

on:
  push:
    branches:
      - main
  workflow_dispatch:

env:
  AWS_REGION: us-east-1
  ECR_REGISTRY: 123456789012.dkr.ecr.us-east-1.amazonaws.com

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
      
      - name: Install backend dependencies
        run: |
          cd bitflow-core
          composer install --no-dev --optimize-autoloader
      
      - name: Run backend tests
        run: |
          cd bitflow-core
          php artisan test --parallel
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install frontend dependencies
        run: |
          cd bitflow-frontend
          pnpm install
      
      - name: Run frontend tests
        run: |
          cd bitflow-frontend
          pnpm test
      
      - name: Security audit
        run: |
          cd bitflow-core && composer audit
          cd ../bitflow-frontend && pnpm audit

  build-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push backend image
        run: |
          cd bitflow-core
          docker build -t $ECR_REGISTRY/bitflow-backend:${{ github.sha }} .
          docker push $ECR_REGISTRY/bitflow-backend:${{ github.sha }}
          docker tag $ECR_REGISTRY/bitflow-backend:${{ github.sha }} $ECR_REGISTRY/bitflow-backend:latest
          docker push $ECR_REGISTRY/bitflow-backend:latest

  build-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push frontend images
        run: |
          cd bitflow-frontend
          for app in bitflow-admin university-owner super-admin principal college-admin super-academics faculty-teacher student parent admission-admin super-accountant college-accounts-admin college-fee-admin super-non-teaching-manager; do
            docker build -f apps/$app/Dockerfile -t $ECR_REGISTRY/bitflow-$app:${{ github.sha }} .
            docker push $ECR_REGISTRY/bitflow-$app:${{ github.sha }}
            docker tag $ECR_REGISTRY/bitflow-$app:${{ github.sha }} $ECR_REGISTRY/bitflow-$app:latest
            docker push $ECR_REGISTRY/bitflow-$app:latest
          done

  deploy:
    needs: [build-backend, build-frontend]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster bitflow-cluster --service bitflow-backend --force-new-deployment
          aws ecs update-service --cluster bitflow-cluster --service bitflow-frontend --force-new-deployment
      
      - name: Wait for deployment
        run: |
          aws ecs wait services-stable --cluster bitflow-cluster --services bitflow-backend bitflow-frontend
      
      - name: Run database migrations
        run: |
          aws ecs run-task \
            --cluster bitflow-cluster \
            --task-definition bitflow-migration \
            --launch-type FARGATE \
            --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=DISABLED}"
      
      - name: Notify Slack
        if: always()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployment to production: ${{ job.status }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Blue-Green Deployment

### Strategy

1. **Blue Environment**: Current production (v1.0)
2. **Green Environment**: New version (v2.0)
3. **Traffic Switch**: Route 100% traffic to Green after validation
4. **Rollback**: Keep Blue active for 24h for quick rollback

### Implementation

```bash
#!/bin/bash
# deploy-blue-green.sh

# Variables
CLUSTER="bitflow-cluster"
SERVICE="bitflow-backend"
GREEN_TASK_DEFINITION="bitflow-backend:$BUILD_NUMBER"
BLUE_TASK_DEFINITION=$(aws ecs describe-services --cluster $CLUSTER --services $SERVICE --query 'services[0].taskDefinition' --output text)

# Step 1: Deploy Green environment
echo "Deploying Green environment..."
aws ecs update-service \
  --cluster $CLUSTER \
  --service $SERVICE-green \
  --task-definition $GREEN_TASK_DEFINITION \
  --desired-count 3

# Step 2: Wait for Green to stabilize
echo "Waiting for Green environment to stabilize..."
aws ecs wait services-stable --cluster $CLUSTER --services $SERVICE-green

# Step 3: Run health checks
echo "Running health checks on Green..."
for i in {1..10}; do
  HEALTH=$(curl -s -o /dev/null -w "%{http_code}" https://green.bitflow.edu/health)
  if [ "$HEALTH" == "200" ]; then
    echo "Health check passed"
    break
  fi
  echo "Health check failed, retrying... ($i/10)"
  sleep 30
done

if [ "$HEALTH" != "200" ]; then
  echo "Health checks failed, aborting deployment"
  exit 1
fi

# Step 4: Switch traffic to Green
echo "Switching traffic to Green environment..."
aws elbv2 modify-listener \
  --listener-arn $LISTENER_ARN \
  --default-actions Type=forward,TargetGroupArn=$GREEN_TARGET_GROUP_ARN

# Step 5: Monitor for 10 minutes
echo "Monitoring Green environment..."
sleep 600

# Step 6: Scale down Blue (but keep it running)
echo "Scaling down Blue environment..."
aws ecs update-service \
  --cluster $CLUSTER \
  --service $SERVICE-blue \
  --desired-count 1

echo "Deployment complete! Blue environment kept for rollback."
```

---

## Database Migrations

### Migration Strategy

```php
// Zero-downtime migrations

// Step 1: Add new column (nullable)
Schema::table('students', function (Blueprint $table) {
    $table->string('new_field')->nullable()->after('existing_field');
});

// Step 2: Deploy code that writes to both old and new fields
// (Dual-write period - 1 week)

// Step 3: Backfill data
DB::table('students')->whereNull('new_field')->chunkById(1000, function ($students) {
    foreach ($students as $student) {
        DB::table('students')
            ->where('id', $student->id)
            ->update(['new_field' => $student->old_field]);
    }
});

// Step 4: Make new field NOT NULL
Schema::table('students', function (Blueprint $table) {
    $table->string('new_field')->nullable(false)->change();
});

// Step 5: Remove old field (after 1 month)
Schema::table('students', function (Blueprint $table) {
    $table->dropColumn('old_field');
});
```

---

## Environment Configuration

### Production `.env`

```env
APP_NAME="Bitflow LMS"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.bitflow.edu

DB_CONNECTION=pgsql
DB_HOST=bitflow-postgres.xxxxx.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_DATABASE=bitflow_lms
DB_USERNAME=bitflow_admin
DB_PASSWORD=<stored-in-aws-secrets-manager>

REDIS_HOST=bitflow-redis.xxxxx.cache.amazonaws.com
REDIS_PORT=6379

AWS_ACCESS_KEY_ID=<stored-in-aws-secrets-manager>
AWS_SECRET_ACCESS_KEY=<stored-in-aws-secrets-manager>
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=bitflow-uploads

MAIL_MAILER=ses
MAIL_FROM_ADDRESS=noreply@bitflow.edu

FRONTEND_URL=https://bitflow.edu

LOG_CHANNEL=stack
LOG_LEVEL=info

SESSION_DRIVER=redis
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
```

---

## SSL/TLS Setup

### Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d bitflow.edu -d www.bitflow.edu -d api.bitflow.edu

# Auto-renewal (cron job)
0 0 * * * certbot renew --quiet
```

### Nginx SSL Configuration

```nginx
server {
    listen 443 ssl http2;
    server_name api.bitflow.edu;

    ssl_certificate /etc/letsencrypt/live/api.bitflow.edu/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.bitflow.edu/privkey.pem;
    ssl_protocols TLSv1.3 TLSv1.2;
    ssl_ciphers 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Monitoring & Rollback

### Rollback Procedure

```bash
#!/bin/bash
# rollback.sh

echo "🔄 Rolling back to Blue environment..."

# Switch traffic back to Blue
aws elbv2 modify-listener \
  --listener-arn $LISTENER_ARN \
  --default-actions Type=forward,TargetGroupArn=$BLUE_TARGET_GROUP_ARN

# Scale up Blue
aws ecs update-service \
  --cluster bitflow-cluster \
  --service bitflow-backend-blue \
  --desired-count 3

# Wait for stabilization
aws ecs wait services-stable --cluster bitflow-cluster --services bitflow-backend-blue

echo "✅ Rollback complete!"
```

---

**🚀 Production deployment requires careful planning and execution. Always test in staging first!**
