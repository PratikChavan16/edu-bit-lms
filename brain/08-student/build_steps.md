# Student Portal - Build & Deployment Steps

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Development Setup

### Prerequisites

```powershell
# Check versions
node --version   # v20.10.0+
pnpm --version   # v8.15.0+
php --version    # 8.3+
composer --version  # 2.7+
docker --version    # 24.0+
```

### 1. Create Project Structure

```powershell
# Create main directory
mkdir bitflow-lms
cd bitflow-lms

# Create backend directory
mkdir bitflow-core

# Create frontend monorepo structure
mkdir -p bitflow-frontend/apps/student
mkdir -p bitflow-frontend/packages
```

### 2. Backend Setup (Laravel) - Create from Scratch

### 2. Backend Setup (Laravel) - Create from Scratch

```powershell
cd bitflow-core

# Create new Laravel project
composer create-project laravel/laravel .

# Install required packages
composer require tymon/jwt-auth
composer require spatie/laravel-permission
composer require predis/predis
composer require aws/aws-sdk-php

# Install development packages
composer require --dev phpunit/phpunit
composer require --dev laravel/pint
composer require --dev pestphp/pest

# Configure environment
copy .env.example .env

# Edit .env file
# APP_NAME="Bitflow LMS"
# APP_URL=http://localhost:8000
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=bitflow_lms
# DB_USERNAME=postgres
# DB_PASSWORD=secret

# Generate application key
php artisan key:generate

# Generate JWT secret
php artisan jwt:secret

# Create database
# Open pgAdmin or psql and run:
# CREATE DATABASE bitflow_lms;

# Create migrations
php artisan make:migration create_students_table
php artisan make:migration create_enrollments_table
php artisan make:migration create_attendance_table
php artisan make:migration create_grades_table
php artisan make:migration create_assignments_table
php artisan make:migration create_submissions_table
php artisan make:migration create_fee_payments_table

# Create models
php artisan make:model Student
php artisan make:model Enrollment
php artisan make:model Attendance
php artisan make:model Grade
php artisan make:model Assignment
php artisan make:model Submission
php artisan make:model FeePayment

# Create controllers
php artisan make:controller Api/StudentController --api
php artisan make:controller Api/AttendanceController --api
php artisan make:controller Api/GradeController --api
php artisan make:controller Api/AssignmentController --api

# Create requests (validation)
php artisan make:request StudentRequest
php artisan make:request SubmitAssignmentRequest

# Create resources (API responses)
php artisan make:resource StudentResource
php artisan make:resource EnrollmentResource
php artisan make:resource AttendanceResource
php artisan make:resource GradeResource

# Create policies (authorization)
php artisan make:policy StudentPolicy --model=Student
php artisan make:policy AttendancePolicy --model=Attendance

# Create services
mkdir app/Services
# Create app/Services/StudentService.php manually

# Run migrations
php artisan migrate

# Create seeder
php artisan make:seeder StudentSeeder
php artisan make:seeder CourseSeeder

# Run seeders
php artisan db:seed

# Start development server
php artisan serve
# Running on http://localhost:8000
```

### 3. Frontend Setup (Next.js) - Create from Scratch

```powershell
cd bitflow-frontend/apps/student

# Create Next.js app with TypeScript
pnpm create next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"

# Install dependencies
pnpm add zustand
pnpm add axios
pnpm add react-hook-form
pnpm add zod
pnpm add @hookform/resolvers
pnpm add date-fns
pnpm add lucide-react
pnpm add clsx tailwind-merge
pnpm add recharts
pnpm add @radix-ui/react-dialog
pnpm add @radix-ui/react-dropdown-menu
pnpm add @radix-ui/react-select
pnpm add @radix-ui/react-tabs

# Install dev dependencies
pnpm add -D @types/node
pnpm add -D @types/react
pnpm add -D @types/react-dom
pnpm add -D vitest
pnpm add -D @testing-library/react
pnpm add -D @testing-library/jest-dom
pnpm add -D @playwright/test

# Create project structure
mkdir -p src/app/(dashboard)
mkdir -p src/components/dashboard
mkdir -p src/components/ui
mkdir -p src/lib
mkdir -p src/store
mkdir -p src/types
mkdir -p src/hooks
mkdir -p src/services

# Create environment file
New-Item .env.local

# Edit .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
# NEXT_PUBLIC_WS_URL=ws://localhost:8000
# NEXT_PUBLIC_APP_NAME=Student Portal

# Create configuration files

# 1. Create src/lib/api.ts (API client)
@"
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});
"@ | Out-File -FilePath src/lib/api.ts -Encoding UTF8

# 2. Create src/types/index.ts (TypeScript types)
@"
export interface Student {
  id: string;
  user_id: string;
  name: string;
  email: string;
  roll_number: string;
  college_id: string;
  department_id: string;
  current_semester: number;
  status: 'active' | 'inactive' | 'suspended' | 'graduated';
}

export interface Enrollment {
  id: string;
  course_id: string;
  course_name: string;
  course_code: string;
  enrolled_at: string;
  status: string;
}

export interface Attendance {
  id: string;
  course_id: string;
  course_name: string;
  date: string;
  status: 'present' | 'absent' | 'late';
}

export interface Grade {
  id: string;
  course_id: string;
  course_name: string;
  exam_type: string;
  marks: number;
  max_marks: number;
  graded_at: string;
}
"@ | Out-File -FilePath src/types/index.ts -Encoding UTF8

# 3. Create src/store/authStore.ts (Zustand state)
@"
import { create } from 'zustand';

interface AuthState {
  user: any | null;
  token: string | null;
  login: (token: string, user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (token, user) => {
    localStorage.setItem('token', token);
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },
}));
"@ | Out-File -FilePath src/store/authStore.ts -Encoding UTF8

# 4. Create src/app/(dashboard)/page.tsx (Dashboard)
@"
import { GraduationCap, BookOpen, Calendar, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>Student Dashboard</h1>
      
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <StatCard icon={BookOpen} label='Enrolled Courses' value={6} />
        <StatCard icon={Calendar} label='Attendance' value='85%' />
        <StatCard icon={GraduationCap} label='Average Grade' value='A' />
        <StatCard icon={DollarSign} label='Fees Due' value='\$1,200' />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: any) {
  return (
    <div className='bg-white p-6 rounded-lg shadow'>
      <Icon className='w-8 h-8 text-blue-600 mb-2' />
      <p className='text-gray-600 text-sm'>{label}</p>
      <p className='text-2xl font-bold'>{value}</p>
    </div>
  );
}
"@ | Out-File -FilePath src/app/page.tsx -Encoding UTF8

# Start development server
pnpm dev
# Running on http://localhost:3008
```

### 4. Database Setup

```powershell
# PostgreSQL via Docker
docker run --name bitflow-postgres `
  -e POSTGRES_PASSWORD=secret `
  -e POSTGRES_DB=bitflow_lms `
  -p 5432:5432 `
  -d postgres:16

# Redis via Docker
docker run --name bitflow-redis `
  -p 6379:6379 `
  -d redis:7-alpine
```

---

## Testing

### Backend Tests

```powershell
cd bitflow-core

# Run all tests
php artisan test

# Run specific test suite
php artisan test --testsuite=Feature

# Run tests with coverage
php artisan test --coverage

# Run specific test class
php artisan test tests/Feature/StudentControllerTest.php
```

### Frontend Tests

```powershell
cd bitflow-frontend/apps/student

# Run unit tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run E2E tests (Playwright)
pnpm test:e2e

# Run specific test file
pnpm test src/components/dashboard/StatCard.test.tsx
```

### Integration Tests

```powershell
# Start test environment
docker-compose -f docker-compose.test.yml up -d

# Run integration tests
pnpm test:integration

# Cleanup
docker-compose -f docker-compose.test.yml down
```

---

## Build for Production

### Backend Build

```powershell
cd bitflow-core

# Optimize autoloader
composer install --optimize-autoloader --no-dev

# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Cache events
php artisan event:cache

# Optimize database queries
php artisan optimize
```

### Frontend Build

```powershell
cd bitflow-frontend/apps/student

# Build for production
pnpm build

# Output in .next/ directory

# Test production build locally
pnpm start
```

---

## Docker Build

### Dockerfile (Backend)

```dockerfile
# bitflow-core/Dockerfile
FROM php:8.3-fpm-alpine

# Install dependencies
RUN apk add --no-cache \
    postgresql-dev \
    libzip-dev \
    zip \
    unzip \
    git

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql zip

# Install Composer
COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy application
COPY . .

# Install dependencies
RUN composer install --optimize-autoloader --no-dev

# Cache Laravel
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# Set permissions
RUN chown -R www-data:www-data storage bootstrap/cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
```

### Dockerfile (Frontend)

```dockerfile
# bitflow-frontend/apps/student/Dockerfile
FROM node:20-alpine AS deps

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build application
RUN npm install -g pnpm && pnpm build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Copy built application
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3008

ENV PORT 3008

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_USER: bitflow
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: bitflow_lms
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - bitflow

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    networks:
      - bitflow

  backend:
    build:
      context: ./bitflow-core
      dockerfile: Dockerfile
    environment:
      DB_HOST: postgres
      DB_DATABASE: bitflow_lms
      DB_USERNAME: bitflow
      DB_PASSWORD: ${DB_PASSWORD}
      REDIS_HOST: redis
    depends_on:
      - postgres
      - redis
    ports:
      - "8000:8000"
    networks:
      - bitflow

  student-portal:
    build:
      context: ./bitflow-frontend/apps/student
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_API_URL: http://backend:8000/api
    depends_on:
      - backend
    ports:
      - "3008:3008"
    networks:
      - bitflow

volumes:
  postgres_data:

networks:
  bitflow:
    driver: bridge
```

### Build & Run with Docker

```powershell
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f student-portal

# Stop services
docker-compose down

# Cleanup volumes
docker-compose down -v
```

---

## Deployment to Production

### Prerequisites

- AWS Account with IAM credentials
- Domain name configured
- SSL certificate (Let's Encrypt or AWS Certificate Manager)

### 1. Prepare Environment

```powershell
# Set production environment variables
$env:ENVIRONMENT = "production"
$env:DB_HOST = "production-db.amazonaws.com"
$env:REDIS_HOST = "production-redis.amazonaws.com"
$env:AWS_BUCKET = "bitflow-production-uploads"
```

### 2. Deploy Backend (AWS Elastic Beanstalk)

```powershell
cd bitflow-core

# Install EB CLI
pip install awsebcli

# Initialize EB
eb init bitflow-backend --platform php-8.3 --region us-east-1

# Create environment
eb create production --instance-type t3.medium

# Set environment variables
eb setenv `
  APP_ENV=production `
  APP_DEBUG=false `
  DB_HOST=production-db.amazonaws.com `
  DB_DATABASE=bitflow_lms `
  DB_USERNAME=bitflow `
  DB_PASSWORD=secure_password

# Deploy
eb deploy

# Check status
eb status

# View logs
eb logs
```

### 3. Deploy Frontend (AWS Amplify / Vercel)

#### Option A: Vercel

```powershell
cd bitflow-frontend/apps/student

# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to production
vercel --prod

# Set environment variables via Vercel dashboard
# NEXT_PUBLIC_API_URL=https://api.bitflow.edu/api
```

#### Option B: AWS Amplify

```powershell
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Initialize
amplify init

# Add hosting
amplify add hosting

# Publish
amplify publish
```

### 4. Database Migration

```powershell
# SSH into production backend
ssh -i your-key.pem ec2-user@backend-server

# Navigate to application
cd /var/www/html

# Run migrations
php artisan migrate --force

# Seed if needed
php artisan db:seed --class=ProductionSeeder
```

### 5. Configure Reverse Proxy (Nginx)

```nginx
# /etc/nginx/sites-available/student.bitflow.edu

upstream backend {
    server localhost:8000;
}

upstream frontend {
    server localhost:3008;
}

server {
    listen 80;
    server_name student.bitflow.edu;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name student.bitflow.edu;

    ssl_certificate /etc/letsencrypt/live/student.bitflow.edu/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/student.bitflow.edu/privkey.pem;

    ssl_protocols TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```powershell
# Enable site
sudo ln -s /etc/nginx/sites-available/student.bitflow.edu /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 6. SSL Certificate (Let's Encrypt)

```powershell
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d student.bitflow.edu

# Auto-renewal (cron job)
sudo crontab -e
# Add: 0 0 * * * certbot renew --quiet
```

---

## Continuous Integration / Continuous Deployment (CI/CD)

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy-student-portal.yml
name: Deploy Student Portal

on:
  push:
    branches: [main]
    paths:
      - 'bitflow-frontend/apps/student/**'
      - 'bitflow-core/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
      
      - name: Install Backend Dependencies
        working-directory: bitflow-core
        run: composer install
      
      - name: Run Backend Tests
        working-directory: bitflow-core
        run: php artisan test
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install Frontend Dependencies
        working-directory: bitflow-frontend/apps/student
        run: pnpm install
      
      - name: Run Frontend Tests
        working-directory: bitflow-frontend/apps/student
        run: pnpm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to AWS
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          # Deploy backend
          cd bitflow-core
          eb deploy production
          
          # Deploy frontend
          cd ../bitflow-frontend/apps/student
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## Monitoring & Health Checks

### Health Check Endpoints

```php
// Backend: /api/health
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'database' => DB::connection()->getPdo() ? 'connected' : 'disconnected',
        'redis' => Redis::ping() ? 'connected' : 'disconnected',
        'timestamp' => now(),
    ]);
});
```

```typescript
// Frontend: /api/health
export async function GET() {
  return Response.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
}
```

### Monitoring Setup

```powershell
# Install monitoring agent (Datadog)
sudo sh -c "$(curl -L https://s3.amazonaws.com/dd-agent/scripts/install_script.sh)"

# Configure Datadog
sudo nano /etc/datadog-agent/datadog.yaml
# Set API key and enable integrations

# Start agent
sudo systemctl start datadog-agent
```

---

## Rollback Procedure

### 1. Identify Issue
```powershell
# Check logs
eb logs
vercel logs

# Check error rate
# Monitor dashboard (Grafana/Datadog)
```

### 2. Rollback Backend
```powershell
cd bitflow-core

# List deployments
eb appversion lifecycle --print

# Rollback to previous version
eb deploy --version v1.2.3
```

### 3. Rollback Frontend
```powershell
# Vercel rollback
vercel rollback

# Or redeploy specific version
vercel deploy --prod --prebuilt
```

---

**🚀 These build and deployment steps ensure smooth releases and easy rollbacks.**
