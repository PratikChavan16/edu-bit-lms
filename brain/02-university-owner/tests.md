# University Owner Portal - Testing Strategy

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## 1. Backend Testing (PHPUnit)

### 1.1 Unit Tests

#### Multi-Tenancy Tests
```php
class UniversityScopingTest extends TestCase
{
    /** @test */
    public function it_only_returns_colleges_from_authenticated_university()
    {
        $user = User::factory()->create(['role' => 'university_owner', 'university_id' => 'uni-1']);
        $this->actingAs($user);
        
        College::factory()->create(['university_id' => 'uni-1', 'name' => 'College A']);
        College::factory()->create(['university_id' => 'uni-2', 'name' => 'College B']);
        
        $colleges = College::all();
        
        $this->assertCount(1, $colleges);
        $this->assertEquals('College A', $colleges->first()->name);
    }
    
    /** @test */
    public function it_auto_sets_university_id_when_creating()
    {
        $user = User::factory()->create(['role' => 'university_owner', 'university_id' => 'uni-1']);
        $this->actingAs($user);
        
        $college = College::create(['name' => 'New College', 'code' => 'NC01']);
        
        $this->assertEquals('uni-1', $college->university_id);
    }
}
```

#### Service Tests
```php
class CollegeServiceTest extends TestCase
{
    /** @test */
    public function it_generates_unique_college_code()
    {
        $service = app(CollegeService::class);
        
        $code = $service->generateCollegeCode('Engineering College');
        
        $this->assertMatchesRegularExpression('/^[A-Z]{4}\d{3}$/', $code);
    }
}
```

---

### 1.2 Feature Tests

#### College Management
```php
class CollegeControllerTest extends TestCase
{
    use RefreshDatabase;
    
    /** @test */
    public function university_owner_can_create_college()
    {
        $user = User::factory()->universityOwner()->create();
        
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/owner/colleges', [
                'name' => 'Science College',
                'code' => 'SCI001',
                'email' => 'science@university.edu',
                // ... other fields
            ]);
        
        $response->assertStatus(201);
        $this->assertDatabaseHas('colleges', [
            'name' => 'Science College',
            'university_id' => $user->university_id,
        ]);
    }
    
    /** @test */
    public function university_owner_cannot_access_other_university_colleges()
    {
        $user = User::factory()->universityOwner()->create(['university_id' => 'uni-1']);
        $otherCollege = College::factory()->create(['university_id' => 'uni-2']);
        
        $response = $this->actingAs($user, 'sanctum')
            ->getJson("/api/owner/colleges/{$otherCollege->id}");
        
        $response->assertStatus(404); // Global scope filters it out
    }
    
    /** @test */
    public function it_assigns_principal_to_college()
    {
        $user = User::factory()->universityOwner()->create();
        $college = College::factory()->create(['university_id' => $user->university_id]);
        $principal = User::factory()->principal()->create(['university_id' => $user->university_id]);
        
        $response = $this->actingAs($user, 'sanctum')
            ->postJson("/api/owner/colleges/{$college->id}/assign-principal", [
                'principal_id' => $principal->id,
            ]);
        
        $response->assertOk();
        $this->assertEquals($principal->id, $college->fresh()->principal_id);
    }
}
```

#### Faculty Management
```php
class FacultyControllerTest extends TestCase
{
    /** @test */
    public function it_hires_faculty_with_user_account()
    {
        $user = User::factory()->universityOwner()->create();
        $college = College::factory()->create(['university_id' => $user->university_id]);
        $department = Department::factory()->create(['college_id' => $college->id]);
        
        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/owner/faculty', [
                'name' => 'Dr. John Doe',
                'email' => 'john@university.edu',
                'college_id' => $college->id,
                'department_id' => $department->id,
                'designation' => 'Professor',
                'qualification' => 'PhD',
                'date_of_joining' => '2025-01-01',
                'employment_type' => 'permanent',
                'salary' => 100000,
            ]);
        
        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'john@university.edu', 'role' => 'faculty']);
        $this->assertDatabaseHas('faculty', ['designation' => 'Professor']);
    }
}
```

---

### 1.3 Authorization Tests

```php
class AuthorizationTest extends TestCase
{
    /** @test */
    public function guest_cannot_access_owner_routes()
    {
        $response = $this->getJson('/api/owner/dashboard');
        
        $response->assertStatus(401);
    }
    
    /** @test */
    public function principal_cannot_access_owner_routes()
    {
        $principal = User::factory()->principal()->create();
        
        $response = $this->actingAs($principal, 'sanctum')
            ->getJson('/api/owner/dashboard');
        
        $response->assertStatus(403);
    }
}
```

---

## 2. Frontend Testing (Jest + React Testing Library)

### 2.1 Component Tests

#### StatCard Component
```typescript
// components/shared/StatCard.test.tsx
import { render, screen } from '@testing-library/react';
import StatCard from './StatCard';

describe('StatCard', () => {
  it('renders title and value', () => {
    render(<StatCard title="Total Students" value="15,247" icon={<div />} />);
    
    expect(screen.getByText('Total Students')).toBeInTheDocument();
    expect(screen.getByText('15,247')).toBeInTheDocument();
  });
  
  it('displays positive trend', () => {
    render(
      <StatCard
        title="Enrollment"
        value="1000"
        icon={<div />}
        trend={{ value: 5.2, isPositive: true }}
      />
    );
    
    expect(screen.getByText('↑ 5.2%')).toHaveClass('text-green-600');
  });
});
```

#### CollegesGrid Component
```typescript
describe('CollegesGrid', () => {
  const mockColleges = [
    { id: '1', name: 'Engineering', students_count: 500 },
    { id: '2', name: 'Science', students_count: 400 },
  ];
  
  it('renders college cards', () => {
    render(<CollegesGrid colleges={mockColleges} />);
    
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('Science')).toBeInTheDocument();
  });
});
```

---

### 2.2 Integration Tests

#### Dashboard Page
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '@/app/page';
import { useDashboardStore } from '@/lib/stores/dashboardStore';

jest.mock('@/lib/stores/dashboardStore');

describe('DashboardPage', () => {
  it('fetches and displays dashboard data', async () => {
    (useDashboardStore as jest.Mock).mockReturnValue({
      data: {
        metrics: {
          total_students: 15247,
          total_faculty: 892,
        },
      },
      loading: false,
      fetchDashboard: jest.fn(),
    });
    
    render(<DashboardPage />);
    
    await waitFor(() => {
      expect(screen.getByText('15247')).toBeInTheDocument();
      expect(screen.getByText('892')).toBeInTheDocument();
    });
  });
});
```

---

### 2.3 Store Tests

```typescript
// lib/stores/authStore.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from './authStore';
import api from '@/lib/api/client';

jest.mock('@/lib/api/client');

describe('authStore', () => {
  it('logs in user successfully', async () => {
    (api.post as jest.Mock).mockResolvedValue({
      data: {
        access_token: 'token123',
        user: { id: '1', name: 'John', role: 'university_owner' },
      },
    });
    
    const { result } = renderHook(() => useAuthStore());
    
    await act(async () => {
      await result.current.login('john@university.edu', 'password');
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.name).toBe('John');
  });
});
```

---

## 3. E2E Testing (Playwright)

### College Creation Flow
```typescript
test('University Owner creates new college', async ({ page }) => {
  // Login
  await page.goto('http://localhost:3002/login');
  await page.fill('input[name="email"]', 'owner@university.edu');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  
  // Navigate to Colleges
  await page.click('a[href="/colleges"]');
  
  // Open create modal
  await page.click('button:has-text("Create College")');
  
  // Fill form
  await page.fill('input[name="name"]', 'Arts College');
  await page.fill('input[name="code"]', 'ART001');
  await page.fill('input[name="email"]', 'arts@university.edu');
  
  // Submit
  await page.click('button:has-text("Save")');
  
  // Verify
  await expect(page.locator('text=Arts College')).toBeVisible();
});
```

---

## 4. Test Coverage Requirements

- **Unit Tests**: 80% coverage
- **Feature Tests**: All API endpoints covered
- **Frontend Components**: 70% coverage
- **E2E Tests**: Critical flows (login, create college, hire faculty, approve expense)

---

## 5. CI/CD Integration

### GitHub Actions Workflow
```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: 8.3
      - name: Install Dependencies
        run: composer install
      - name: Run Tests
        run: php artisan test --parallel --coverage

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 20
      - name: Install Dependencies
        run: pnpm install
      - name: Run Tests
        run: pnpm test --coverage
```

---

**Testing Strategy Complete! Comprehensive test coverage for University Owner Portal.**
