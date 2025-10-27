# Student Portal - Testing Strategy

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Testing Pyramid

```
        /\
       /E2E\      5% - End-to-End Tests (Playwright)
      /------\
     /  Intg  \   15% - Integration Tests
    /----------\
   /    Unit    \ 80% - Unit Tests (Vitest/Jest + PHPUnit)
  /--------------\
```

---

## Backend Tests (PHPUnit)

### Unit Tests

#### 1. StudentService Test

```php
// tests/Unit/StudentServiceTest.php
<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\StudentService;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class StudentServiceTest extends TestCase
{
    use RefreshDatabase;

    private StudentService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new StudentService();
    }

    /** @test */
    public function it_can_get_student_profile()
    {
        $student = Student::factory()->create();
        
        $profile = $this->service->getProfile($student->id);
        
        $this->assertNotNull($profile);
        $this->assertEquals($student->id, $profile->id);
    }

    /** @test */
    public function it_calculates_attendance_percentage_correctly()
    {
        $student = Student::factory()->create();
        
        // Create attendance records
        $student->attendances()->create([
            'course_id' => 'course-1',
            'date' => now(),
            'status' => 'present',
        ]);
        
        $student->attendances()->create([
            'course_id' => 'course-1',
            'date' => now()->subDay(),
            'status' => 'absent',
        ]);
        
        $percentage = $this->service->calculateAttendancePercentage($student->id);
        
        $this->assertEquals(50.0, $percentage);
    }

    /** @test */
    public function it_calculates_gpa_correctly()
    {
        $student = Student::factory()->create();
        
        // Create grade records
        $student->grades()->create([
            'course_id' => 'course-1',
            'marks' => 85,
            'max_marks' => 100,
            'exam_type' => 'final',
        ]);
        
        $student->grades()->create([
            'course_id' => 'course-2',
            'marks' => 75,
            'max_marks' => 100,
            'exam_type' => 'final',
        ]);
        
        $gpa = $this->service->calculateGPA($student->id);
        
        $this->assertEquals(3.5, $gpa); // Average of A- and B
    }
}
```

#### 2. Student Model Test

```php
// tests/Unit/StudentModelTest.php
<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Student;
use App\Models\Course;
use Illuminate\Foundation\Testing\RefreshDatabase;

class StudentModelTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_has_correct_fillable_attributes()
    {
        $fillable = [
            'user_id', 'college_id', 'department_id', 'roll_number',
            'enrollment_year', 'current_semester', 'status'
        ];
        
        $student = new Student();
        
        $this->assertEquals($fillable, $student->getFillable());
    }

    /** @test */
    public function it_belongs_to_user()
    {
        $student = Student::factory()->create();
        
        $this->assertInstanceOf('App\Models\User', $student->user);
    }

    /** @test */
    public function it_has_many_enrollments()
    {
        $student = Student::factory()->create();
        $course = Course::factory()->create();
        
        $student->enrollments()->create([
            'course_id' => $course->id,
            'academic_year_id' => 'year-1',
            'enrolled_at' => now(),
        ]);
        
        $this->assertCount(1, $student->enrollments);
    }

    /** @test */
    public function it_scopes_active_students()
    {
        Student::factory()->count(5)->create(['status' => 'active']);
        Student::factory()->count(3)->create(['status' => 'inactive']);
        
        $activeStudents = Student::active()->get();
        
        $this->assertCount(5, $activeStudents);
    }
}
```

### Feature Tests

#### 1. Student API Test

```php
// tests/Feature/StudentControllerTest.php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class StudentControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_returns_authenticated_student_profile()
    {
        $student = Student::factory()->create();
        Sanctum::actingAs($student->user, ['*']);
        
        $response = $this->getJson('/api/students/me');
        
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    'id',
                    'name',
                    'email',
                    'roll_number',
                    'college_id',
                    'department_id',
                    'current_semester',
                    'status',
                ]
            ]);
    }

    /** @test */
    public function it_returns_student_courses()
    {
        $student = Student::factory()->create();
        Sanctum::actingAs($student->user, ['*']);
        
        $response = $this->getJson("/api/students/{$student->id}/courses");
        
        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'course_code',
                        'course_name',
                        'credits',
                        'enrolled_at',
                    ]
                ]
            ]);
    }

    /** @test */
    public function it_prevents_unauthorized_access_to_other_student_data()
    {
        $student1 = Student::factory()->create();
        $student2 = Student::factory()->create();
        
        Sanctum::actingAs($student1->user, ['*']);
        
        $response = $this->getJson("/api/students/{$student2->id}");
        
        $response->assertForbidden();
    }

    /** @test */
    public function it_validates_assignment_submission()
    {
        $student = Student::factory()->create();
        Sanctum::actingAs($student->user, ['*']);
        
        $response = $this->postJson('/api/assignments/assignment-1/submit', [
            'file_url' => '', // Empty file
        ]);
        
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['file_url']);
    }
}
```

#### 2. Attendance Test

```php
// tests/Feature/AttendanceControllerTest.php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Student;
use App\Models\Attendance;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class AttendanceControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function student_can_view_own_attendance()
    {
        $student = Student::factory()->create();
        Sanctum::actingAs($student->user, ['*']);
        
        Attendance::factory()->count(10)->create([
            'student_id' => $student->id,
        ]);
        
        $response = $this->getJson("/api/students/{$student->id}/attendance");
        
        $response->assertOk()
            ->assertJsonCount(10, 'data');
    }

    /** @test */
    public function student_cannot_view_other_student_attendance()
    {
        $student1 = Student::factory()->create();
        $student2 = Student::factory()->create();
        
        Sanctum::actingAs($student1->user, ['*']);
        
        $response = $this->getJson("/api/students/{$student2->id}/attendance");
        
        $response->assertForbidden();
    }
}
```

### Test Coverage Goals

```powershell
# Run tests with coverage
php artisan test --coverage

# Minimum coverage requirements
- Overall: 80%
- Controllers: 85%
- Models: 90%
- Services: 85%
- Policies: 95%
```

---

## Frontend Tests (Vitest + React Testing Library)

### Unit Tests

#### 1. Component Tests

```typescript
// src/components/dashboard/StatCard.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatCard } from './StatCard';
import { BookOpen } from 'lucide-react';

describe('StatCard', () => {
  it('renders the stat card with correct values', () => {
    render(
      <StatCard
        icon={BookOpen}
        label="Enrolled Courses"
        value={6}
      />
    );
    
    expect(screen.getByText('Enrolled Courses')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('renders with string value', () => {
    render(
      <StatCard
        icon={BookOpen}
        label="Attendance"
        value="85%"
      />
    );
    
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <StatCard
        icon={BookOpen}
        label="Test"
        value={10}
        className="custom-class"
      />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
```

#### 2. Hook Tests

```typescript
// src/hooks/useStudent.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useStudent } from './useStudent';
import { api } from '@/lib/api';

vi.mock('@/lib/api');

describe('useStudent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches student data successfully', async () => {
    const mockStudent = {
      id: 'student-1',
      name: 'John Doe',
      roll_number: 'STU001',
    };
    
    vi.mocked(api.get).mockResolvedValue({ data: { data: mockStudent } });
    
    const { result } = renderHook(() => useStudent('student-1'));
    
    await waitFor(() => {
      expect(result.current.student).toEqual(mockStudent);
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('handles error when fetching student data', async () => {
    const errorMessage = 'Student not found';
    vi.mocked(api.get).mockRejectedValue(new Error(errorMessage));
    
    const { result } = renderHook(() => useStudent('student-1'));
    
    await waitFor(() => {
      expect(result.current.error).toBe(errorMessage);
      expect(result.current.isLoading).toBe(false);
    });
  });
});
```

#### 3. Store Tests

```typescript
// src/store/authStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';

describe('authStore', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, token: null });
  });

  it('logs in user and stores token', () => {
    const store = useAuthStore.getState();
    const mockToken = 'mock-token';
    const mockUser = { id: '1', name: 'John' };
    
    store.login(mockToken, mockUser);
    
    expect(useAuthStore.getState().token).toBe(mockToken);
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(localStorage.getItem('token')).toBe(mockToken);
  });

  it('logs out user and clears token', () => {
    const store = useAuthStore.getState();
    store.login('token', { id: '1' });
    
    store.logout();
    
    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
```

#### 4. Utility Tests

```typescript
// src/lib/formatters.test.ts
import { describe, it, expect } from 'vitest';
import { formatGrade, formatAttendance, formatCurrency } from './formatters';

describe('formatters', () => {
  describe('formatGrade', () => {
    it('converts marks to letter grade', () => {
      expect(formatGrade(95)).toBe('A+');
      expect(formatGrade(85)).toBe('A');
      expect(formatGrade(75)).toBe('B');
      expect(formatGrade(65)).toBe('C');
      expect(formatGrade(55)).toBe('D');
      expect(formatGrade(45)).toBe('F');
    });
  });

  describe('formatAttendance', () => {
    it('formats attendance percentage', () => {
      expect(formatAttendance(85.5)).toBe('85.5%');
      expect(formatAttendance(100)).toBe('100.0%');
    });
  });

  describe('formatCurrency', () => {
    it('formats currency with symbol', () => {
      expect(formatCurrency(1200.50)).toBe('$1,200.50');
      expect(formatCurrency(0)).toBe('$0.00');
    });
  });
});
```

### Integration Tests

```typescript
// src/app/(dashboard)/grades/page.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import GradesPage from './page';
import { api } from '@/lib/api';

vi.mock('@/lib/api');

describe('GradesPage', () => {
  it('displays grades after loading', async () => {
    const mockGrades = [
      { id: '1', course_name: 'Math', marks: 85, max_marks: 100 },
      { id: '2', course_name: 'Physics', marks: 90, max_marks: 100 },
    ];
    
    vi.mocked(api.get).mockResolvedValue({ data: { data: mockGrades } });
    
    render(<GradesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Math')).toBeInTheDocument();
      expect(screen.getByText('Physics')).toBeInTheDocument();
      expect(screen.getByText('85')).toBeInTheDocument();
      expect(screen.getByText('90')).toBeInTheDocument();
    });
  });

  it('displays error message when API fails', async () => {
    vi.mocked(api.get).mockRejectedValue(new Error('API Error'));
    
    render(<GradesPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

---

## E2E Tests (Playwright)

### Test Setup

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3008',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3008',
    reuseExistingServer: !process.env.CI,
  },
});
```

### E2E Test Cases

#### 1. Login Flow

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('student can login successfully', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[name="email"]', 'student@test.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.locator('h1')).toContainText('Student Dashboard');
  });

  test('displays error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('[name="email"]', 'invalid@test.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.error-message')).toContainText('Invalid credentials');
  });

  test('student can logout', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[name="email"]', 'student@test.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('[data-testid="logout-button"]');
    
    await expect(page).toHaveURL('/login');
  });
});
```

#### 2. Dashboard Flow

```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Student Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'student@test.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('displays student statistics', async ({ page }) => {
    await expect(page.locator('[data-testid="enrolled-courses"]')).toBeVisible();
    await expect(page.locator('[data-testid="attendance-rate"]')).toBeVisible();
    await expect(page.locator('[data-testid="average-grade"]')).toBeVisible();
    await expect(page.locator('[data-testid="fees-due"]')).toBeVisible();
  });

  test('navigates to grades page', async ({ page }) => {
    await page.click('[href="/grades"]');
    await expect(page).toHaveURL('/grades');
    await expect(page.locator('h1')).toContainText('My Grades');
  });
});
```

#### 3. Assignment Submission Flow

```typescript
// e2e/assignments.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Assignment Submission', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'student@test.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('student can submit assignment', async ({ page }) => {
    await page.goto('/assignments');
    
    await page.click('[data-testid="assignment-1"]');
    
    // Upload file
    await page.setInputFiles('[name="file"]', 'test-files/assignment.pdf');
    
    await page.fill('[name="comments"]', 'My submission');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.success-message')).toContainText('Assignment submitted successfully');
  });

  test('prevents duplicate submission', async ({ page }) => {
    await page.goto('/assignments/submitted-assignment');
    
    await expect(page.locator('[data-testid="submit-button"]')).toBeDisabled();
    await expect(page.locator('.info-message')).toContainText('Already submitted');
  });
});
```

#### 4. Attendance View Flow

```typescript
// e2e/attendance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Attendance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'student@test.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('displays attendance records', async ({ page }) => {
    await page.goto('/attendance');
    
    await expect(page.locator('h1')).toContainText('My Attendance');
    await expect(page.locator('[data-testid="attendance-table"]')).toBeVisible();
    await expect(page.locator('[data-testid="attendance-percentage"]')).toBeVisible();
  });

  test('filters attendance by course', async ({ page }) => {
    await page.goto('/attendance');
    
    await page.selectOption('[name="course"]', 'Math 101');
    
    await expect(page.locator('[data-testid="course-name"]')).toContainText('Math 101');
  });
});
```

---

## Performance Tests

```typescript
// e2e/performance.spec.ts
import { test, expect } from '@playwright/test';

test('dashboard loads within 2 seconds', async ({ page }) => {
  const startTime = Date.now();
  
  await page.goto('/dashboard');
  await page.waitForLoadState('networkidle');
  
  const loadTime = Date.now() - startTime;
  
  expect(loadTime).toBeLessThan(2000);
});

test('API calls complete within 500ms', async ({ page }) => {
  await page.goto('/dashboard');
  
  const response = await page.waitForResponse(
    (response) => response.url().includes('/api/students/me')
  );
  
  const timing = JSON.parse(await response.headerValue('Server-Timing') || '{}');
  expect(timing.total).toBeLessThan(500);
});
```

---

## Test Execution

### Run All Tests

```powershell
# Backend tests
cd bitflow-core
php artisan test

# Frontend unit tests
cd bitflow-frontend/apps/student
pnpm test

# Frontend E2E tests
pnpm test:e2e

# All tests with coverage
pnpm test:all
```

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Run Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Backend Tests
        run: |
          cd bitflow-core
          composer install
          php artisan test --coverage
  
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Frontend Tests
        run: |
          cd bitflow-frontend/apps/student
          pnpm install
          pnpm test
          pnpm test:e2e
```

---

**✅ Comprehensive testing ensures code quality and prevents regressions.**
