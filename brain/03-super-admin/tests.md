# Super Admin Portal - Testing Strategy

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Testing Pyramid

```
        /\
       /E2E\         10% - End-to-End (Playwright)
      /------\
     /Integration\   20% - Integration Tests
    /------------\
   /  Unit Tests  \  70% - Unit Tests (PHPUnit, Jest)
  /----------------\
```

**Coverage Targets**:
- Backend: ≥80%
- Frontend: ≥70%
- Critical Paths: 100%

---

## 1. Backend Testing (PHPUnit)

### 1.1 Unit Tests

#### Controller Tests

**File**: `tests/Unit/Controllers/CourseControllerTest.php`

```php
<?php

namespace Tests\Unit\Controllers;

use Tests\TestCase;
use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CourseControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $superAdmin;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->superAdmin = User::factory()->create([
            'role' => 'super_admin',
            'university_id' => 'uuid-123',
        ]);
    }

    /** @test */
    public function it_can_list_courses()
    {
        Course::factory()->count(5)->create(['university_id' => 'uuid-123']);
        
        $response = $this->actingAs($this->superAdmin)
            ->getJson('/api/super-admin/courses');
        
        $response->assertStatus(200)
            ->assertJsonCount(5, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'code', 'name', 'credits', 'type']
                ]
            ]);
    }

    /** @test */
    public function it_can_create_course()
    {
        $courseData = [
            'code' => 'CS301',
            'name' => 'Data Structures',
            'credits' => 4,
            'type' => 'theory',
            'department_id' => 'dept-uuid',
            'min_students' => 20,
            'max_students' => 60,
        ];

        $response = $this->actingAs($this->superAdmin)
            ->postJson('/api/super-admin/courses', $courseData);

        $response->assertStatus(201)
            ->assertJson(['data' => ['code' => 'CS301']]);

        $this->assertDatabaseHas('courses', [
            'code' => 'CS301',
            'university_id' => 'uuid-123',
        ]);
    }

    /** @test */
    public function it_enforces_multi_tenancy()
    {
        $otherUniversityCourse = Course::factory()->create([
            'university_id' => 'other-uuid',
        ]);

        $response = $this->actingAs($this->superAdmin)
            ->getJson("/api/super-admin/courses/{$otherUniversityCourse->id}");

        $response->assertStatus(404); // Hidden by RLS
    }

    /** @test */
    public function it_validates_required_fields()
    {
        $response = $this->actingAs($this->superAdmin)
            ->postJson('/api/super-admin/courses', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code', 'name', 'credits']);
    }

    /** @test */
    public function it_prevents_duplicate_course_codes()
    {
        Course::factory()->create(['code' => 'CS301', 'university_id' => 'uuid-123']);

        $response = $this->actingAs($this->superAdmin)
            ->postJson('/api/super-admin/courses', [
                'code' => 'CS301',
                'name' => 'Another Course',
                'credits' => 3,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['code']);
    }
}
```

#### Service Tests

**File**: `tests/Unit/Services/TimetableGeneratorServiceTest.php`

```php
<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\TimetableGeneratorService;
use App\Models\Course;
use App\Models\Faculty;
use App\Models\Room;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TimetableGeneratorServiceTest extends TestCase
{
    use RefreshDatabase;

    protected TimetableGeneratorService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(TimetableGeneratorService::class);
    }

    /** @test */
    public function it_generates_conflict_free_timetable()
    {
        $courses = Course::factory()->count(10)->create();
        $faculty = Faculty::factory()->count(5)->create();
        $rooms = Room::factory()->count(8)->create();

        $timetable = $this->service->generate([
            'semester_id' => 'sem-uuid',
            'program_id' => 'prog-uuid',
            'year' => 2,
            'section' => 'A',
        ]);

        $this->assertNotNull($timetable);
        $this->assertEmpty($timetable->conflicts);
        $this->assertGreaterThan(0, $timetable->slots->count());
    }

    /** @test */
    public function it_detects_faculty_conflicts()
    {
        $faculty = Faculty::factory()->create();
        $courses = Course::factory()->count(2)->create([
            'faculty_id' => $faculty->id,
        ]);

        $conflicts = $this->service->detectConflicts([
            [
                'day' => 'monday',
                'start_time' => '09:00',
                'end_time' => '10:00',
                'faculty_id' => $faculty->id,
            ],
            [
                'day' => 'monday',
                'start_time' => '09:00',
                'end_time' => '10:00',
                'faculty_id' => $faculty->id,
            ],
        ]);

        $this->assertCount(1, $conflicts);
        $this->assertEquals('faculty_conflict', $conflicts[0]['type']);
    }

    /** @test */
    public function it_respects_room_capacity()
    {
        $room = Room::factory()->create(['capacity' => 30]);
        $course = Course::factory()->create(['max_students' => 60]);

        $canAllocate = $this->service->canAllocateRoom($course, $room);

        $this->assertFalse($canAllocate);
    }

    /** @test */
    public function it_enforces_faculty_workload_limits()
    {
        $faculty = Faculty::factory()->create();
        
        // Assign 20 hours (overload)
        $courses = Course::factory()->count(4)->create([
            'faculty_id' => $faculty->id,
            'hours_per_week' => 5,
        ]);

        $workload = $this->service->calculateWorkload($faculty);

        $this->assertEquals(20, $workload['total_hours']);
        $this->assertEquals('overload', $workload['status']);
    }
}
```

#### Model Tests

**File**: `tests/Unit/Models/CourseTest.php`

```php
<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Course;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CourseTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_has_prerequisites_relationship()
    {
        $course = Course::factory()->create();
        $prerequisite = Course::factory()->create();
        
        $course->prerequisites()->attach($prerequisite->id);

        $this->assertTrue($course->prerequisites->contains($prerequisite));
    }

    /** @test */
    public function it_calculates_available_seats()
    {
        $course = Course::factory()->create([
            'max_students' => 60,
        ]);

        $course->enrollments()->create(['student_id' => 'student-1']);
        $course->enrollments()->create(['student_id' => 'student-2']);

        $this->assertEquals(58, $course->availableSeats);
    }

    /** @test */
    public function it_automatically_scopes_by_university()
    {
        config(['app.current_university_id' => 'uuid-123']);
        
        Course::factory()->create(['university_id' => 'uuid-123']);
        Course::factory()->create(['university_id' => 'other-uuid']);

        $courses = Course::all();

        $this->assertCount(1, $courses);
        $this->assertEquals('uuid-123', $courses->first()->university_id);
    }
}
```

---

### 1.2 Integration Tests

#### API Integration Tests

**File**: `tests/Feature/TimetableIntegrationTest.php`

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Course;
use App\Models\Faculty;
use App\Models\Room;
use App\Jobs\GenerateTimetable;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;

class TimetableIntegrationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function complete_timetable_generation_workflow()
    {
        Queue::fake();

        $superAdmin = User::factory()->create(['role' => 'super_admin']);
        
        Course::factory()->count(10)->create();
        Faculty::factory()->count(5)->create();
        Room::factory()->count(8)->create();

        // Step 1: Initiate generation
        $response = $this->actingAs($superAdmin)
            ->postJson('/api/super-admin/timetables/generate', [
                'semester_id' => 'sem-uuid',
                'program_id' => 'prog-uuid',
                'year' => 2,
                'section' => 'A',
            ]);

        $response->assertStatus(202)
            ->assertJson(['message' => 'Timetable generation started']);

        Queue::assertPushed(GenerateTimetable::class);

        // Step 2: Check status
        $timetableId = $response->json('data.id');

        $statusResponse = $this->actingAs($superAdmin)
            ->getJson("/api/super-admin/timetables/{$timetableId}");

        $statusResponse->assertStatus(200)
            ->assertJson(['data' => ['status' => 'draft']]);

        // Step 3: Publish timetable
        $publishResponse = $this->actingAs($superAdmin)
            ->postJson("/api/super-admin/timetables/{$timetableId}/publish");

        $publishResponse->assertStatus(200);

        $this->assertDatabaseHas('timetables', [
            'id' => $timetableId,
            'status' => 'published',
        ]);
    }
}
```

---

### 1.3 Database Tests

**File**: `tests/Unit/Database/MultiTenancyTest.php`

```php
<?php

namespace Tests\Unit\Database;

use Tests\TestCase;
use App\Models\Course;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

class MultiTenancyTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function row_level_security_enforces_university_isolation()
    {
        DB::statement("SET app.current_university_id = 'uuid-123'");

        Course::factory()->create(['university_id' => 'uuid-123']);
        Course::factory()->create(['university_id' => 'other-uuid']);

        $courses = Course::all();

        $this->assertCount(1, $courses);
    }

    /** @test */
    public function global_scope_filters_by_university()
    {
        config(['app.current_university_id' => 'uuid-123']);

        Course::factory()->create(['university_id' => 'uuid-123']);
        Course::factory()->create(['university_id' => 'other-uuid']);

        $courses = Course::withoutGlobalScopes()->get();
        $this->assertCount(2, $courses); // Without scope

        $filteredCourses = Course::all();
        $this->assertCount(1, $filteredCourses); // With scope
    }
}
```

---

## 2. Frontend Testing (Jest + React Testing Library)

### 2.1 Component Tests

**File**: `__tests__/components/CourseForm.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CourseForm from '@/components/courses/CourseForm';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post('http://localhost:8000/api/super-admin/courses', (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ data: { id: 'course-uuid', ...req.body } }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('CourseForm', () => {
  it('renders all form fields', () => {
    render(<CourseForm />);

    expect(screen.getByLabelText(/Course Code/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Course Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Credits/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Type/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<CourseForm />);

    const submitButton = screen.getByRole('button', { name: /Create Course/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Course code is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Course name is required/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();
    render(<CourseForm onSuccess={onSuccess} />);

    await user.type(screen.getByLabelText(/Course Code/i), 'CS301');
    await user.type(screen.getByLabelText(/Course Name/i), 'Data Structures');
    await user.type(screen.getByLabelText(/Credits/i), '4');
    await user.selectOptions(screen.getByLabelText(/Type/i), 'theory');

    await user.click(screen.getByRole('button', { name: /Create Course/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(expect.objectContaining({
        id: 'course-uuid',
        code: 'CS301',
      }));
    });
  });

  it('displays error message on API failure', async () => {
    server.use(
      rest.post('http://localhost:8000/api/super-admin/courses', (req, res, ctx) => {
        return res(ctx.status(422), ctx.json({ errors: { code: ['Code already exists'] } }));
      })
    );

    const user = userEvent.setup();
    render(<CourseForm />);

    await user.type(screen.getByLabelText(/Course Code/i), 'CS301');
    await user.click(screen.getByRole('button', { name: /Create Course/i }));

    await waitFor(() => {
      expect(screen.getByText(/Code already exists/i)).toBeInTheDocument();
    });
  });
});
```

---

### 2.2 Hook Tests

**File**: `__tests__/hooks/useCourses.test.tsx`

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { useCourses } from '@/hooks/useCourses';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('http://localhost:8000/api/super-admin/courses', (req, res, ctx) => {
    return res(ctx.json({
      data: [
        { id: '1', code: 'CS301', name: 'Data Structures' },
        { id: '2', code: 'CS302', name: 'Algorithms' },
      ],
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useCourses', () => {
  it('fetches courses on mount', async () => {
    const { result } = renderHook(() => useCourses());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.courses).toHaveLength(2);
    });
  });

  it('handles API errors', async () => {
    server.use(
      rest.get('http://localhost:8000/api/super-admin/courses', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ message: 'Server error' }));
      })
    );

    const { result } = renderHook(() => useCourses());

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to fetch courses');
    });
  });
});
```

---

### 2.3 Store Tests (Zustand)

**File**: `__tests__/stores/authStore.test.ts`

```typescript
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '@/stores/authStore';

describe('authStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.logout(); // Reset store
    });
  });

  it('sets user on login', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.login({
        user: { id: '1', email: 'admin@test.com', role: 'super_admin' },
        token: 'jwt-token',
        permissions: ['courses.manage', 'timetable.generate'],
      });
    });

    expect(result.current.user).toEqual({
      id: '1',
      email: 'admin@test.com',
      role: 'super_admin',
    });
    expect(result.current.token).toBe('jwt-token');
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('checks permissions correctly', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.login({
        user: { id: '1', email: 'admin@test.com', role: 'super_admin' },
        token: 'jwt-token',
        permissions: ['courses.manage'],
      });
    });

    expect(result.current.can('courses.manage')).toBe(true);
    expect(result.current.can('financial.manage')).toBe(false);
  });

  it('clears state on logout', () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.login({
        user: { id: '1', email: 'admin@test.com', role: 'super_admin' },
        token: 'jwt-token',
        permissions: [],
      });
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

---

## 3. End-to-End Testing (Playwright)

### 3.1 E2E Tests

**File**: `e2e/timetable-generation.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Timetable Generation Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as Super Admin
    await page.goto('http://localhost:3003/login');
    await page.fill('input[name="email"]', 'superadmin@university.edu');
    await page.fill('input[name="password"]', 'Admin@123');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:3003/dashboard');
  });

  test('should generate timetable successfully', async ({ page }) => {
    // Navigate to Timetable page
    await page.click('text=Timetables');
    await page.waitForURL('http://localhost:3003/timetables');

    // Click "Generate New Timetable"
    await page.click('button:has-text("Generate New Timetable")');

    // Step 1: Select scope
    await page.selectOption('select[name="semester"]', 'Odd Semester 2025-26');
    await page.selectOption('select[name="program"]', 'B.Tech Computer Science');
    await page.selectOption('select[name="year"]', '2');
    await page.selectOption('select[name="section"]', 'A');
    await page.click('button:has-text("Next")');

    // Step 2: Set constraints
    await page.fill('input[name="max_hours_per_day"]', '6');
    await page.check('input[name="avoid_consecutive_labs"]');
    await page.click('button:has-text("Next")');

    // Step 3: Generate
    await page.click('button:has-text("Generate Timetable")');

    // Wait for generation to complete
    await page.waitForSelector('text=Timetable generated successfully', { timeout: 60000 });

    // Verify timetable appears
    await expect(page.locator('table.timetable-grid')).toBeVisible();
    await expect(page.locator('td.time-slot')).toHaveCount(30); // 5 days × 6 hours

    // Publish timetable
    await page.click('button:has-text("Publish Timetable")');
    await page.waitForSelector('text=Timetable published successfully');

    // Verify status changed
    await expect(page.locator('span.status-badge')).toHaveText('Published');
  });

  test('should detect conflicts', async ({ page }) => {
    await page.goto('http://localhost:3003/timetables/draft-timetable-id');

    // Manually edit slot to create conflict
    await page.click('td[data-day="monday"][data-time="09:00"]');
    await page.selectOption('select[name="faculty"]', 'Dr. Smith');
    await page.click('button:has-text("Save Slot")');

    // Edit another slot with same faculty/time
    await page.click('td[data-day="monday"][data-time="09:00"][data-section="B"]');
    await page.selectOption('select[name="faculty"]', 'Dr. Smith');
    await page.click('button:has-text("Save Slot")');

    // Verify conflict detection
    await expect(page.locator('div.conflict-alert')).toBeVisible();
    await expect(page.locator('div.conflict-alert')).toContainText('Faculty conflict detected');
  });
});
```

**File**: `e2e/course-management.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Course Management', () => {
  test('CRUD operations on courses', async ({ page }) => {
    await page.goto('http://localhost:3003/login');
    await page.fill('input[name="email"]', 'superadmin@university.edu');
    await page.fill('input[name="password"]', 'Admin@123');
    await page.click('button[type="submit"]');

    // CREATE
    await page.click('text=Courses');
    await page.click('button:has-text("Add Course")');
    await page.fill('input[name="code"]', 'CS401');
    await page.fill('input[name="name"]', 'Machine Learning');
    await page.fill('input[name="credits"]', '4');
    await page.selectOption('select[name="type"]', 'theory');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Course created successfully')).toBeVisible();

    // READ
    await page.fill('input[placeholder="Search courses"]', 'CS401');
    await expect(page.locator('tr:has-text("CS401")')).toBeVisible();

    // UPDATE
    await page.click('tr:has-text("CS401") button[aria-label="Edit"]');
    await page.fill('input[name="name"]', 'Advanced Machine Learning');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Course updated successfully')).toBeVisible();

    // DELETE
    await page.click('tr:has-text("CS401") button[aria-label="Delete"]');
    await page.click('button:has-text("Confirm Delete")');
    await expect(page.locator('text=Course deleted successfully')).toBeVisible();
  });
});
```

---

## 4. Performance Testing

### Load Testing with Apache JMeter

**Test Plan**: `tests/performance/timetable-generation.jmx`

```xml
<jmeterTestPlan>
  <hashTree>
    <TestPlan>
      <stringProp name="TestPlan.test_name">Timetable Generation Load Test</stringProp>
    </TestPlan>
    <hashTree>
      <ThreadGroup>
        <stringProp name="ThreadGroup.num_threads">50</stringProp>
        <stringProp name="ThreadGroup.ramp_time">10</stringProp>
        <stringProp name="ThreadGroup.loops">1</stringProp>
      </ThreadGroup>
      <HTTPSamplerProxy>
        <stringProp name="HTTPSampler.domain">localhost</stringProp>
        <stringProp name="HTTPSampler.port">8000</stringProp>
        <stringProp name="HTTPSampler.path">/api/super-admin/timetables/generate</stringProp>
        <stringProp name="HTTPSampler.method">POST</stringProp>
      </HTTPSamplerProxy>
    </hashTree>
  </hashTree>
</jmeterTestPlan>
```

**Expected Results**:
- 95th percentile response time: <5s
- Throughput: ≥10 requests/second
- Error rate: <1%

---

## 5. Coverage Reports

### Backend Coverage (PHPUnit)

```bash
php artisan test --coverage --min=80
```

**Report**:
```
Code Coverage Report:
  Summary:
    Classes: 85.71% (24/28)
    Methods: 82.35% (140/170)
    Lines:   81.23% (2756/3392)
```

### Frontend Coverage (Jest)

```bash
npm run test:coverage
```

**Report**:
```
File                  | % Stmts | % Branch | % Funcs | % Lines
----------------------|---------|----------|---------|--------
All files             |   74.21 |    68.52 |   70.83 |   74.92
 components           |   78.45 |    72.15 |   75.00 |   79.12
 hooks                |   81.25 |    75.00 |   80.00 |   82.14
 stores               |   85.71 |    81.25 |   87.50 |   86.36
 pages                |   65.43 |    60.00 |   62.50 |   66.18
```

---

## 6. CI/CD Integration

### GitHub Actions Workflow

**File**: `.github/workflows/tests.yml`

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
      
      - name: Install Dependencies
        run: composer install
      
      - name: Run Tests
        run: php artisan test --coverage --min=80

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Run Tests
        run: npm run test:coverage

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E Tests
        run: npm run test:e2e
      
      - name: Upload Test Results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 7. Testing Commands Reference

```bash
# Backend
php artisan test                          # Run all tests
php artisan test --filter CourseTest     # Run specific test
php artisan test --coverage              # With coverage
php artisan test --parallel              # Parallel execution

# Frontend
npm run test                             # Run Jest tests
npm run test:watch                       # Watch mode
npm run test:coverage                    # With coverage
npm run test:e2e                         # Playwright E2E

# Linting
composer run lint                        # PHP CS Fixer
npm run lint                             # ESLint
npm run type-check                       # TypeScript
```

---

**Testing is critical for reliability. Aim for high coverage! 🧪**
