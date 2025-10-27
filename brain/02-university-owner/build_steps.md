# University Owner Portal - Build & Deployment Steps

**Version**: 2.0  
**Last Updated**: October 25, 2025  
**Portal**: University Owner (University-level Management)  
**Port**: 3002

---

## Prerequisites

```powershell
# Required versions
node --version   # v20.10.0+
pnpm --version   # v8.15.0+
php --version    # 8.3+
composer --version  # 2.7+
postgresql --version # 16+
redis-server --version # 7+
```

---

## Part 1: Backend Setup (Laravel 11)

### Step 1: Ensure Core Backend Exists

```powershell
cd D:\LMS\edu-bit-lms\bitflow-core

# The core Laravel backend is shared across all portals
# It should already exist from Bitflow Admin setup
```

### Step 2: Create University Owner Controllers

```powershell
# Generate controllers for University Owner Portal
php artisan make:controller Owner/DashboardController
php artisan make:controller Owner/CollegeController --resource
php artisan make:controller Owner/ProgramController --resource
php artisan make:controller Owner/FacultyController --resource
php artisan make:controller Owner/StudentController
php artisan make:controller Owner/AdmissionController
php artisan make:controller Owner/FinancialController
php artisan make:controller Owner/FeeStructureController --resource
php artisan make:controller Owner/ExpenseController
php artisan make:controller Owner/ReportController
php artisan make:controller Owner/SettingsController
php artisan make:controller Owner/AuthController
```

### Step 3: Create Models

```powershell
# Generate university-scoped models
php artisan make:model College -m
php artisan make:model Department -m
php artisan make:model Program -m
php artisan make:model Faculty -m
php artisan make:model Student -m
php artisan make:model AdmissionApplication -m
php artisan make:model MeritList -m
php artisan make:model FeeStructure -m
php artisan make:model FeePayment -m
php artisan make:model Expense -m
php artisan make:model Scholarship -m
php artisan make:model Leave -m
```

### Step 4: Create Base University Scoped Model

Create `app/Models/UniversityScopedModel.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

abstract class UniversityScopedModel extends Model
{
    protected static function booted()
    {
        static::addGlobalScope('university', function (Builder $builder) {
            if (auth()->check() && auth()->user()->university_id) {
                $builder->where($builder->getModel()->getTable() . '.university_id', auth()->user()->university_id);
            }
        });
        
        static::creating(function ($model) {
            if (auth()->check() && !$model->university_id) {
                $model->university_id = auth()->user()->university_id;
            }
        });
    }
}
```

### Step 5: Update Models to Extend UniversityScopedModel

Edit each model (College, Program, Faculty, etc.):

```php
<?php

namespace App\Models;

class College extends UniversityScopedModel
{
    use HasUuids;
    
    protected $fillable = [
        'university_id',
        'name',
        'code',
        // ... other fields
    ];
}
```

### Step 6: Run Migrations

```powershell
# Create and run migrations for university-scoped tables
php artisan migrate

# Seed sample data (optional)
php artisan db:seed --class=UniversityOwnerSeeder
```

### Step 7: Create Middleware

```powershell
php artisan make:middleware EnsureUniversityOwner
php artisan make:middleware EnsureUniversityActive
php artisan make:middleware LogOwnerActions
```

Edit `app/Http/Middleware/EnsureUniversityOwner.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUniversityOwner
{
    public function handle(Request $request, Closure $next)
    {
        if (!$request->user() || $request->user()->role !== 'university_owner') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        if (!$request->user()->university_id) {
            return response()->json(['error' => 'No university assigned'], 403);
        }
        
        if ($request->user()->university->status !== 'active') {
            return response()->json(['error' => 'University is not active'], 403);
        }
        
        return $next($request);
    }
}
```

Register middleware in `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'university-owner' => \App\Http\Middleware\EnsureUniversityOwner::class,
    ]);
})
```

### Step 8: Define Routes

Add to `routes/api.php`:

```php
Route::prefix('owner')->group(function () {
    Route::post('/auth/login', [Owner\AuthController::class, 'login']);
    Route::post('/auth/refresh', [Owner\AuthController::class, 'refresh']);
    
    Route::middleware(['auth:sanctum', 'university-owner'])->group(function () {
        Route::get('/dashboard', [Owner\DashboardController::class, 'index']);
        
        Route::apiResource('colleges', Owner\CollegeController::class);
        Route::post('/colleges/{college}/assign-principal', [Owner\CollegeController::class, 'assignPrincipal']);
        
        Route::apiResource('programs', Owner\ProgramController::class);
        Route::post('/programs/{program}/curriculum', [Owner\ProgramController::class, 'manageCurriculum']);
        
        Route::apiResource('faculty', Owner\FacultyController::class);
        Route::get('/faculty/{faculty}/leaves', [Owner\FacultyController::class, 'leaves']);
        Route::post('/faculty/leaves/{leave}/approve', [Owner\FacultyController::class, 'approveLeave']);
        
        Route::get('/students', [Owner\StudentController::class, 'index']);
        Route::get('/students/{student}', [Owner\StudentController::class, 'show']);
        Route::post('/students/{student}/transfer', [Owner\StudentController::class, 'transfer']);
        Route::post('/students/bulk-import', [Owner\StudentController::class, 'bulkImport']);
        
        Route::prefix('admissions')->group(function () {
            Route::get('/applications', [Owner\AdmissionController::class, 'applications']);
            Route::post('/applications/{application}/review', [Owner\AdmissionController::class, 'review']);
            Route::get('/merit-lists', [Owner\AdmissionController::class, 'meritLists']);
            Route::post('/merit-lists/{list}/approve', [Owner\AdmissionController::class, 'approveMeritList']);
        });
        
        Route::prefix('financial')->group(function () {
            Route::get('/dashboard', [Owner\FinancialController::class, 'dashboard']);
            Route::apiResource('fee-structures', Owner\FeeStructureController::class);
            Route::get('/expenses/pending', [Owner\ExpenseController::class, 'pending']);
            Route::post('/expenses/{expense}/approve', [Owner\ExpenseController::class, 'approve']);
        });
        
        Route::post('/reports/generate', [Owner\ReportController::class, 'generate']);
        
        Route::prefix('settings')->group(function () {
            Route::get('/profile', [Owner\SettingsController::class, 'profile']);
            Route::patch('/profile', [Owner\SettingsController::class, 'updateProfile']);
            Route::get('/academic-calendar', [Owner\SettingsController::class, 'calendar']);
            Route::post('/academic-calendar', [Owner\SettingsController::class, 'configureCalendar']);
        });
    });
});
```

### Step 9: Test Backend API

```powershell
# Start Laravel server
php artisan serve --port=8000

# Test login endpoint
curl -X POST http://localhost:8000/api/owner/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"owner@mit.edu","password":"password"}'

# Test dashboard (with token)
curl -X GET http://localhost:8000/api/owner/dashboard `
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Part 2: Frontend Setup (Next.js 16)

### Step 1: Create Next.js App

```powershell
cd D:\LMS\edu-bit-lms

# Create Next.js 16 app with TypeScript
pnpm create next-app@latest apps/university-owner --typescript --tailwind --app --src-dir --import-alias "@/*"

cd apps/university-owner
```

### Step 2: Install Dependencies

```powershell
# Core dependencies
pnpm add zustand axios
pnpm add @tanstack/react-query
pnpm add date-fns zod
pnpm add recharts
pnpm add react-hook-form @hookform/resolvers

# UI components (Radix UI)
pnpm add @radix-ui/react-dialog
pnpm add @radix-ui/react-dropdown-menu
pnpm add @radix-ui/react-select
pnpm add @radix-ui/react-toast
pnpm add @radix-ui/react-tabs

# Icons
pnpm add @heroicons/react lucide-react

# Development
pnpm add -D @types/node @types/react
```

### Step 3: Configure Environment

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=University Owner Portal
NEXT_PUBLIC_APP_PORT=3002
```

### Step 4: Update next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'bitflow.edu'],
  },
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

### Step 5: Create API Client & Auth Store

(See frontend_guide.md for complete implementation)

### Step 6: Start Development Server

```powershell
# Start Next.js dev server
pnpm dev --port 3002

# Open browser
start http://localhost:3002
```

---

## Part 3: Database Setup

### Step 1: Connect to PostgreSQL

```powershell
psql -U postgres
```

### Step 2: Run Schema

```sql
-- Create database (if not exists)
CREATE DATABASE bitflow_lms;

-- Connect
\c bitflow_lms;

-- Run university-scoped schema
\i D:/LMS/edu-bit-lms/brain/02-university-owner/db_schema.sql
```

### Step 3: Seed Sample Data

```powershell
# Create seeder
php artisan make:seeder UniversityOwnerSeeder

# Run seeder
php artisan db:seed --class=UniversityOwnerSeeder
```

---

## Part 4: Testing

### Backend Tests

```powershell
# Run PHPUnit tests
php artisan test --filter UniversityOwner
```

### Frontend Tests

```powershell
# Run Jest tests
pnpm test
```

---

## Part 5: Production Deployment

### Build Frontend

```powershell
cd apps/university-owner
pnpm build

# Start production server
pnpm start --port 3002
```

### Optimize Backend

```powershell
cd bitflow-core

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimize autoloader
composer install --optimize-autoloader --no-dev
```

---

**Build Steps Complete! University Owner Portal ready for development.**
