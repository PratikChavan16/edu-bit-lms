# Bitflow Admin Portal - Build & Deployment Steps

**Version**: 2.0  
**Last Updated**: October 25, 2025  
**Portal**: Bitflow Admin (Platform Management)  
**Port**: 3001

---

## Prerequisites

### Required Software

```powershell
# Check versions
node --version   # v20.10.0+
pnpm --version   # v8.15.0+
php --version    # 8.3+
composer --version  # 2.7+
postgresql --version # 16+
redis-server --version # 7+
```

---

## Part 1: Backend Setup (Laravel 11)

### Step 1: Create Laravel Project

```powershell
# Navigate to project root
cd D:\LMS\edu-bit-lms

# Create backend directory if not exists
mkdir bitflow-core
cd bitflow-core

# Create new Laravel 11 project from scratch
composer create-project laravel/laravel .

# Install required packages
composer require laravel/sanctum
composer require spatie/laravel-activitylog
composer require spatie/laravel-permission
composer require predis/predis
composer require stripe/stripe-php
composer require aws/aws-sdk-php
composer require maatwebsite/excel

# Install development packages
composer require --dev phpunit/phpunit
composer require --dev laravel/pint
composer require --dev barryvdh/laravel-debugbar
```

### Step 2: Configure Environment

```powershell
# Copy environment file
copy .env.example .env

# Generate application key
php artisan key:generate
```

Edit `.env` file:

```env
APP_NAME="Bitflow LMS"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=bitflow_lms
DB_USERNAME=postgres
DB_PASSWORD=your_password

BROADCAST_DRIVER=log
CACHE_DRIVER=redis
FILESYSTEM_DISK=local
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# Stripe Configuration
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AWS S3 (for file storage)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=

# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@bitflow.edu"
MAIL_FROM_NAME="${APP_NAME}"
```

### Step 3: Create Database

```sql
-- Open pgAdmin or run psql
CREATE DATABASE bitflow_lms;

-- Connect to database
\c bitflow_lms;

-- Verify connection
SELECT version();
```

### Step 4: Run Migrations

```powershell
# Run all migrations from master_db_schema.sql
# Copy SQL from brain/master_db_schema.sql

# Or run Laravel migrations if created
php artisan migrate

# Run seeders (optional)
php artisan db:seed
```

### Step 5: Create Controllers

```powershell
# Create Admin namespace controllers
php artisan make:controller Admin/PlatformController
php artisan make:controller Admin/UniversityController --api
php artisan make:controller Admin/GlobalUserController
php artisan make:controller Admin/AnalyticsController
php artisan make:controller Admin/BillingController
php artisan make:controller Admin/GlobalSettingsController
php artisan make:controller Admin/AuditLogController
php artisan make:controller Admin/SupportTicketController
php artisan make:controller Admin/SystemLogController
```

### Step 6: Create Models

```powershell
php artisan make:model University -m
php artisan make:model Subscription -m
php artisan make:model Invoice -m
php artisan make:model Payment -m
php artisan make:model GlobalSetting -m
php artisan make:model AuditLog
php artisan make:model SupportTicket -m
php artisan make:model SystemLog
php artisan make:model Alert -m
```

### Step 7: Create Middleware

```powershell
php artisan make:middleware EnsureBitflowOwner
php artisan make:middleware CheckIPWhitelist
php artisan make:middleware LogBitflowActions
```

Edit `app/Http/Kernel.php` to register middleware:

```php
protected $routeMiddleware = [
    // ... existing middleware
    'bitflow.owner' => \App\Http\Middleware\EnsureBitflowOwner::class,
    'bitflow.ip' => \App\Http\Middleware\CheckIPWhitelist::class,
    'bitflow.log' => \App\Http\Middleware\LogBitflowActions::class,
];
```

### Step 8: Define API Routes

Edit `routes/api.php`:

```php
use App\Http\Controllers\Admin\PlatformController;
use App\Http\Controllers\Admin\UniversityController;
use App\Http\Controllers\Admin\GlobalUserController;
use App\Http\Controllers\Admin\AnalyticsController;
use App\Http\Controllers\Admin\BillingController;
use App\Http\Controllers\Admin\GlobalSettingsController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\SupportTicketController;
use App\Http\Controllers\Admin\SystemLogController;

Route::prefix('admin')->middleware(['auth:sanctum', 'bitflow.owner'])->group(function () {
    // Platform Dashboard
    Route::get('/dashboard', [PlatformController::class, 'dashboard']);
    Route::get('/system/health', [PlatformController::class, 'systemHealth']);
    Route::get('/alerts', [PlatformController::class, 'alerts']);
    
    // Universities
    Route::apiResource('universities', UniversityController::class);
    Route::patch('universities/{id}/status', [UniversityController::class, 'changeStatus']);
    Route::get('universities/{id}/usage', [UniversityController::class, 'usage']);
    Route::get('universities/{id}/activities', [UniversityController::class, 'activities']);
    
    // Global Users
    Route::get('users', [GlobalUserController::class, 'index']);
    Route::post('users/{id}/reset-password', [GlobalUserController::class, 'resetPassword']);
    Route::patch('users/{id}/status', [GlobalUserController::class, 'changeStatus']);
    
    // Analytics
    Route::get('analytics', [AnalyticsController::class, 'index']);
    Route::get('analytics/export', [AnalyticsController::class, 'export']);
    
    // Billing
    Route::get('billing', [BillingController::class, 'index']);
    Route::get('invoices/{id}/pdf', [BillingController::class, 'downloadInvoice']);
    Route::post('invoices/{id}/retry', [BillingController::class, 'retryPayment']);
    
    // Settings
    Route::get('settings', [GlobalSettingsController::class, 'index']);
    Route::patch('settings/{category}', [GlobalSettingsController::class, 'update']);
    
    // Audit Logs
    Route::get('audit-logs', [AuditLogController::class, 'index']);
    Route::get('audit-logs/export', [AuditLogController::class, 'export']);
    
    // Support
    Route::get('support/tickets', [SupportTicketController::class, 'index']);
    Route::get('support/tickets/{id}', [SupportTicketController::class, 'show']);
    Route::post('support/tickets/{id}/reply', [SupportTicketController::class, 'reply']);
    Route::patch('support/tickets/{id}/status', [SupportTicketController::class, 'updateStatus']);
    
    // System Logs
    Route::get('system/logs', [SystemLogController::class, 'index']);
});
```

### Step 9: Configure CORS

Edit `config/cors.php`:

```php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['http://localhost:3001'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
```

### Step 10: Start Backend Server

```powershell
# Development server
php artisan serve

# Or specify port
php artisan serve --port=8000

# Backend will be available at http://localhost:8000
```

---

## Part 2: Frontend Setup (Next.js 16)

### Step 1: Create Next.js App

```powershell
# Navigate to frontend directory
cd D:\LMS\edu-bit-lms\bitflow-frontend

# If monorepo doesn't exist, initialize it
pnpm init

# Create workspace config
# Create pnpm-workspace.yaml:
# packages:
#   - 'apps/*'
#   - 'packages/*'

# Navigate to apps directory
cd apps

# Create Bitflow Admin app from scratch
pnpm create next-app bitflow-admin --typescript --tailwind --app --src-dir --import-alias "@/*"

cd bitflow-admin
```

### Step 2: Install Dependencies

```powershell
# Install core dependencies
pnpm add zustand axios react-hook-form @hookform/resolvers zod
pnpm add @tanstack/react-query @tanstack/react-table
pnpm add recharts date-fns
pnpm add sonner

# Install UI components (optional - use shadcn/ui)
pnpm add @radix-ui/react-dropdown-menu
pnpm add @radix-ui/react-dialog
pnpm add @radix-ui/react-select
pnpm add @radix-ui/react-toast

# Install dev dependencies
pnpm add -D @types/node @types/react @types/react-dom
```

### Step 3: Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/admin
NEXT_PUBLIC_APP_NAME=Bitflow Admin
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Step 4: Update Next.js Config

Edit `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

### Step 5: Update Tailwind Config

Edit `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

### Step 6: Create Directory Structure

```powershell
# Create required directories
mkdir -p src/app/universities
mkdir -p src/app/users
mkdir -p src/app/analytics
mkdir -p src/app/billing
mkdir -p src/app/settings
mkdir -p src/app/audit-logs
mkdir -p src/app/support
mkdir -p src/app/system-logs

mkdir -p src/components/platform
mkdir -p src/components/universities
mkdir -p src/components/shared

mkdir -p src/lib/api
mkdir -p src/lib/store
mkdir -p src/lib/hooks
mkdir -p src/lib/types
mkdir -p src/lib/utils
```

### Step 7: Create Core Files

Copy the TypeScript types, API clients, stores, and components from the `frontend_guide.md` file in the brain directory.

### Step 8: Create Main Layout

Edit `src/app/layout.tsx`:

```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bitflow Admin - Platform Management',
  description: 'Multi-tenant LMS platform administration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
```

### Step 9: Create Dashboard Page

Edit `src/app/page.tsx`:

```typescript
import { PlatformDashboard } from '@/components/platform/Dashboard';

export default function Home() {
  return <PlatformDashboard />;
}
```

### Step 10: Start Frontend Server

```powershell
# Development mode
pnpm dev

# Or specify port
pnpm dev -p 3001

# Frontend will be available at http://localhost:3001
```

---

## Part 3: Database Setup

### Step 1: Import Schema

```powershell
# Using psql
psql -U postgres -d bitflow_lms -f brain/master_db_schema.sql

# Or using pgAdmin
# 1. Open pgAdmin
# 2. Right-click on bitflow_lms database
# 3. Select "Restore" or "Query Tool"
# 4. Execute the SQL from master_db_schema.sql
```

### Step 2: Verify Tables

```sql
-- Check tables created
\dt

-- Check specific platform tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('universities', 'subscriptions', 'invoices', 'audit_logs');
```

### Step 3: Create Test Data

```sql
-- Create a Bitflow Owner user
INSERT INTO users (id, name, email, password, role, status, university_id) 
VALUES (
    gen_random_uuid(),
    'Bitflow Owner',
    'owner@bitflow.edu',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    'bitflow_owner',
    'active',
    NULL
);

-- Create a test university
INSERT INTO universities (name, domain, slug, primary_email, primary_phone, status, storage_quota_gb, subscription_plan)
VALUES (
    'Test University',
    'test.bitflow.edu',
    'test-university',
    'admin@test.edu',
    '+1-555-0100',
    'active',
    500,
    'pro'
);
```

---

## Part 4: Redis Setup

### Step 1: Install Redis

```powershell
# Windows: Use WSL or download Redis for Windows
# Or use Docker
docker run --name redis -p 6379:6379 -d redis:7-alpine

# Verify Redis is running
redis-cli ping
# Should return: PONG
```

### Step 2: Configure Laravel

Already configured in `.env`:
```env
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

### Step 3: Test Connection

```powershell
php artisan tinker

# In tinker:
Cache::put('test', 'value', 60);
Cache::get('test'); // Should return 'value'
```

---

## Part 5: Running Both Servers

### Terminal 1: Backend

```powershell
cd D:\LMS\edu-bit-lms\bitflow-core
php artisan serve --port=8000
```

### Terminal 2: Frontend

```powershell
cd D:\LMS\edu-bit-lms\bitflow-frontend\apps\bitflow-admin
pnpm dev -p 3001
```

### Access Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:8000/api/admin
- **API Documentation**: http://localhost:8000/docs (if setup)

---

## Part 6: Testing

### Backend Tests

```powershell
cd bitflow-core

# Run all tests
php artisan test

# Run specific test
php artisan test --filter UniversityControllerTest

# With coverage
php artisan test --coverage
```

### Frontend Tests

```powershell
cd bitflow-frontend/apps/bitflow-admin

# Run tests (if configured)
pnpm test

# Run E2E tests with Playwright
pnpm test:e2e
```

---

## Part 7: Production Build

### Backend

```powershell
# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

# Set environment to production
# Edit .env: APP_ENV=production
# APP_DEBUG=false
```

### Frontend

```powershell
# Build for production
pnpm build

# Test production build
pnpm start

# Output will be in .next/ directory
```

---

## Part 8: Deployment

### Option 1: Docker

```dockerfile
# Dockerfile for backend
FROM php:8.3-fpm
WORKDIR /app
COPY . .
RUN composer install --no-dev --optimize-autoloader
CMD php artisan serve --host=0.0.0.0 --port=8000
```

```dockerfile
# Dockerfile for frontend
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
CMD pnpm start
```

### Option 2: Traditional Server

1. **Backend**: Deploy to VPS with Nginx + PHP-FPM
2. **Frontend**: Build static files and serve with Nginx
3. **Database**: PostgreSQL on managed service (AWS RDS, DigitalOcean)
4. **Redis**: Redis on managed service (AWS ElastiCache)

---

## Troubleshooting

### Backend Issues

```powershell
# Clear all caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Check logs
tail -f storage/logs/laravel.log

# Database connection issues
php artisan db:show
```

### Frontend Issues

```powershell
# Clear Next.js cache
rm -rf .next
pnpm build

# Check for TypeScript errors
pnpm tsc --noEmit

# Port already in use
# Find and kill process on port 3001
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process -Force
```

---

## Next Steps

1. ✅ Complete authentication setup (JWT tokens, MFA)
2. ✅ Implement all controllers and API endpoints
3. ✅ Build all frontend pages and components
4. ✅ Set up Stripe webhooks for billing
5. ✅ Configure email notifications
6. ✅ Set up monitoring and alerting
7. ✅ Implement backup strategy
8. ✅ Security audit and penetration testing
9. ✅ Performance optimization
10. ✅ Deploy to production

---

**Build Steps Complete!**
