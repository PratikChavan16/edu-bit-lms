# 🛠️ BitFlow LMS - Complete Implementation Guide

## 📖 **TABLE OF CONTENTS**

1. [Getting Started](#getting-started)
2. [Development Setup](#development-setup)
3. [Authentication System](#authentication-system)
4. [Adding New Features](#adding-new-features)
5. [Component Library Usage](#component-library-usage)
6. [API Integration Patterns](#api-integration-patterns)
7. [Testing Guide](#testing-guide)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 **GETTING STARTED**

### Prerequisites
- **PHP:** 8.2 or higher
- **Composer:** 2.x
- **Node.js:** 20.x or higher
- **pnpm:** 8.x or higher
- **MySQL:** 8.0 or higher
- **Git:** Latest version

### Quick Start (5 minutes)

```bash
# 1. Clone repository
git clone https://github.com/PratikChavan16/edu-bit-lms.git
cd edu-bit-lms

# 2. Setup Backend
cd bitflow-core
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve &

# 3. Setup Frontend
cd ../bitflow-frontend
pnpm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
pnpm dev

# 4. Open in browser
# Admin: http://localhost:3000
# Faculty: http://localhost:3001
# Learner: http://localhost:3002
```

---

## 💻 **DEVELOPMENT SETUP**

### Backend (Laravel)

#### 1. Environment Configuration
```bash
# .env file
APP_NAME="BitFlow LMS"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bitflow_lms
DB_USERNAME=root
DB_PASSWORD=

# For Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:3001,localhost:3002
SESSION_DOMAIN=localhost
```

#### 2. Database Setup
```bash
# Create database
mysql -u root -p
CREATE DATABASE bitflow_lms;
exit;

# Run migrations
php artisan migrate

# Seed sample data
php artisan db:seed

# Or combined
php artisan migrate:fresh --seed
```

#### 3. Run Development Server
```bash
php artisan serve
# Runs on http://localhost:8000
```

### Frontend (Next.js)

#### 1. Environment Configuration
```bash
# bitflow-frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME="BitFlow LMS"

# Optional
NEXT_PUBLIC_ENABLE_ANALYTICS=false
```

#### 2. Install Dependencies
```bash
cd bitflow-frontend
pnpm install
```

#### 3. Run Development Servers

**Run all apps:**
```bash
pnpm dev
```

**Run specific app:**
```bash
pnpm dev --filter @bitflow/admin-app
pnpm dev --filter @bitflow/faculty-app
pnpm dev --filter @bitflow/learner-app
```

**Default ports:**
- Admin: 3000
- Faculty: 3001
- Learner: 3002

---

## 🔐 **AUTHENTICATION SYSTEM**

### Overview
BitFlow uses **Laravel Sanctum** for token-based authentication with **Zustand** for frontend state management.

### Backend (Laravel Sanctum)

#### AuthController Endpoints
```php
POST   /api/auth/login           # Login with username/password
POST   /api/auth/logout          # Logout (revoke current token)
POST   /api/auth/logout-all      # Logout from all devices
GET    /api/auth/me              # Get authenticated user
POST   /api/auth/refresh         # Refresh token
POST   /api/auth/forgot-password # Send reset link
POST   /api/auth/reset-password  # Reset with token
POST   /api/auth/change-password # Change password (authenticated)
```

#### RoleMiddleware Usage
```php
// In routes/api.php
Route::middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [DashboardController::class, 'index']);
});

Route::middleware(['auth:sanctum', 'role:faculty,admin'])->group(function () {
    Route::get('/faculty/courses', [CourseController::class, 'index']);
});
```

#### Creating Protected Controller
```php
namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MyController extends Controller
{
    public function __construct()
    {
        // Require authentication
        $this->middleware('auth:sanctum');
        
        // Require admin role
        $this->middleware('role:admin');
    }
    
    public function index(Request $request)
    {
        $user = $request->user(); // Get authenticated user
        
        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                // ... your data
            ]
        ]);
    }
}
```

### Frontend (Zustand Auth Store)

#### Using the Auth Hook
```typescript
'use client';
import { useAuth } from '@bitflow/api-client/auth/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const { token, user, isAuthenticated, login, logout, fetchUser } = useAuth();
  const router = useRouter();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  // Fetch user profile on mount
  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchUser();
    }
  }, [isAuthenticated, user]);
  
  const handleLogin = async (username: string, password: string) => {
    const success = await login(username, password);
    if (success) {
      router.push('/dashboard');
    }
  };
  
  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

#### Login Form Example
```typescript
'use client';
import { useState } from 'react';
import { useAuth } from '@bitflow/api-client/auth/useAuth';
import { Button } from '@bitflow/ui/components/button';
import { Input } from '@bitflow/ui/components/input';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      window.location.href = '/dashboard';
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        placeholder="Username or Email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="text-red-600">{error}</p>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
```

---

## 🎨 **ADDING NEW FEATURES**

### Backend (Laravel Controller)

#### Step 1: Create Controller
```bash
php artisan make:controller Admin/UniversityController
```

#### Step 2: Implement Methods
```php
namespace App\Http\Controllers\Admin;

use App\Models\University;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class UniversityController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('role:admin');
    }
    
    // GET /api/admin/universities
    public function index(Request $request)
    {
        $query = University::query()
            ->withCount('colleges')
            ->with(['state', 'createdBy']);
        
        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        // Pagination
        $universities = $query->paginate($request->per_page ?? 15);
        
        return response()->json([
            'success' => true,
            'data' => $universities
        ]);
    }
    
    // GET /api/admin/universities/{id}
    public function show($id)
    {
        $university = University::with([
            'state',
            'colleges.courses',
            'createdBy'
        ])->withCount(['colleges', 'students'])->findOrFail($id);
        
        return response()->json([
            'success' => true,
            'data' => $university
        ]);
    }
    
    // POST /api/admin/universities
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:universities',
            'state_id' => 'required|exists:states,id',
            'accreditation_level' => 'required|in:A+,A,B,C',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }
        
        $university = University::create(array_merge(
            $validator->validated(),
            ['created_by' => $request->user()->id]
        ));
        
        return response()->json([
            'success' => true,
            'data' => $university,
            'message' => 'University created successfully'
        ], 201);
    }
    
    // PATCH /api/admin/universities/{id}
    public function update(Request $request, $id)
    {
        $university = University::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|max:50|unique:universities,code,' . $id,
            'status' => 'sometimes|in:active,inactive',
        ]);
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
        
        $university->update($validator->validated());
        
        return response()->json([
            'success' => true,
            'data' => $university,
            'message' => 'University updated successfully'
        ]);
    }
    
    // DELETE /api/admin/universities/{id}
    public function destroy($id)
    {
        $university = University::findOrFail($id);
        $university->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'University deleted successfully'
        ]);
    }
}
```

#### Step 3: Add Routes
```php
// routes/api.php
Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::apiResource('universities', UniversityController::class);
});
```

#### Step 4: Write Tests
```php
namespace Tests\Feature\Admin;

use Tests\TestCase;
use App\Models\User;
use App\Models\University;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UniversityControllerTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_admin_can_list_universities()
    {
        $admin = User::factory()->create(['role' => 'admin']);
        University::factory()->count(3)->create();
        
        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/universities');
        
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data' => [
                        '*' => ['id', 'name', 'code', 'colleges_count']
                    ]
                ]
            ]);
    }
}
```

### Frontend (Next.js Page)

#### Step 1: Create Page Component
```bash
# Create file: apps/admin/app/universities/page.tsx
```

#### Step 2: Implement List View
```typescript
'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@bitflow/api-client/auth/useAuth';
import { Card } from '@bitflow/ui/components/card';
import { Button } from '@bitflow/ui/components/button';
import { Input } from '@bitflow/ui/components/input';
import { Badge } from '@bitflow/ui/components/badge';
import Link from 'next/link';
import { Loader2, Search, Plus } from 'lucide-react';

interface University {
  id: number;
  name: string;
  code: string;
  status: string;
  colleges_count: number;
  accreditation_level: string;
}

export default function UniversitiesPage() {
  const { token, isAuthenticated } = useAuth();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    fetchUniversities();
  }, [isAuthenticated, search, statusFilter]);
  
  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/universities?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        }
      );
      
      const result = await response.json();
      if (result.success) {
        setUniversities(result.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch universities:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Universities</h1>
        <Link href="/universities/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add University
          </Button>
        </Link>
      </div>
      
      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search universities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefix={<Search className="h-4 w-4" />}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      
      {/* Universities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {universities.map((university) => (
          <Link key={university.id} href={`/universities/${university.id}`}>
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{university.name}</h3>
                  <p className="text-sm text-gray-500">{university.code}</p>
                </div>
                <Badge variant={university.status === 'active' ? 'success' : 'secondary'}>
                  {university.status}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Colleges:</span>
                  <span className="font-medium">{university.colleges_count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accreditation:</span>
                  <span className="font-medium">{university.accreditation_level}</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      
      {universities.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No universities found
        </div>
      )}
    </div>
  );
}
```

---

## 🧩 **COMPONENT LIBRARY USAGE**

### Available Components (@bitflow/ui)

#### Button
```typescript
import { Button } from '@bitflow/ui/components/button';

<Button variant="primary" size="lg">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button disabled>Disabled</Button>
```

#### Card
```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@bitflow/ui/components/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

#### Badge
```typescript
import { Badge } from '@bitflow/ui/components/badge';

<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Error</Badge>
<Badge variant="info">Info</Badge>
```

#### Modal
```typescript
import { Modal } from '@bitflow/ui/components/modal';

<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  <p>Are you sure?</p>
  <div className="flex gap-2 mt-4">
    <Button onClick={handleConfirm}>Confirm</Button>
    <Button variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
  </div>
</Modal>
```

#### DataTable
```typescript
import { DataTable } from '@bitflow/ui/components/data-table';

<DataTable
  columns={[
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Status', accessor: 'status', cell: (row) => <Badge>{row.status}</Badge> }
  ]}
  data={users}
  sortable
  pagination
  onRowClick={(row) => console.log(row)}
/>
```

---

## 🧪 **TESTING GUIDE**

### Backend Testing (PHPUnit)

#### Run All Tests
```bash
cd bitflow-core
./vendor/bin/phpunit
```

#### Run Specific Test
```bash
./vendor/bin/phpunit tests/Feature/Admin/DashboardControllerTest.php
```

#### Run With Coverage
```bash
./vendor/bin/phpunit --coverage-html coverage
```

#### Writing Tests
```php
namespace Tests\Feature\Admin;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class MyTest extends TestCase
{
    use RefreshDatabase;
    
    protected $admin;
    
    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
    }
    
    public function test_endpoint_requires_authentication()
    {
        $response = $this->getJson('/api/admin/dashboard');
        $response->assertStatus(401);
    }
    
    public function test_endpoint_requires_admin_role()
    {
        $student = User::factory()->create(['role' => 'student']);
        
        $response = $this->actingAs($student, 'sanctum')
            ->getJson('/api/admin/dashboard');
            
        $response->assertStatus(403);
    }
    
    public function test_admin_can_access_endpoint()
    {
        $response = $this->actingAs($this->admin, 'sanctum')
            ->getJson('/api/admin/dashboard');
            
        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => ['metrics', 'activities']
            ]);
    }
}
```

### Frontend Testing (Vitest - Coming Soon)

```typescript
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import LoginPage from './page';

vi.mock('@bitflow/api-client/auth/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn(),
    isLoading: false,
    error: null
  })
}));

test('renders login form', () => {
  render(<LoginPage />);
  expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
});
```

---

## 🚢 **DEPLOYMENT**

### Production Environment Setup

#### Backend (Laravel)
```bash
# 1. Set production environment
APP_ENV=production
APP_DEBUG=false

# 2. Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 3. Run migrations
php artisan migrate --force

# 4. Setup supervisor for queues (optional)
php artisan queue:work --daemon
```

#### Frontend (Next.js)
```bash
# 1. Build
cd bitflow-frontend
pnpm build

# 2. Start production server
pnpm start

# Or use PM2
pm2 start pnpm --name "bitflow-admin" -- start --filter @bitflow/admin-app
```

### Docker Deployment (Coming Soon)
```bash
docker-compose up -d
```

---

## 🔧 **TROUBLESHOOTING**

### Common Issues

#### "CORS Error" in Browser
**Solution:** Update `config/cors.php` in Laravel:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
'supports_credentials' => true,
```

#### "Token Mismatch" Error
**Solution:** Clear tokens and re-login:
```javascript
localStorage.clear();
window.location.href = '/login';
```

#### TypeScript Errors
**Solution:** Restart TS server:
```bash
# In VS Code: Ctrl+Shift+P → TypeScript: Restart TS Server
```

#### Database Connection Failed
**Solution:** Check `.env` credentials and create database:
```bash
mysql -u root -p
CREATE DATABASE bitflow_lms;
```

---

## 📚 **ADDITIONAL RESOURCES**

- **Laravel Sanctum:** https://laravel.com/docs/sanctum
- **Next.js App Router:** https://nextjs.org/docs/app
- **Zustand:** https://docs.pmnd.rs/zustand
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Radix UI:** https://www.radix-ui.com/primitives

---

**Last Updated:** October 12, 2025
