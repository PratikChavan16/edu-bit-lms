# Faculty/Teacher Portal - Testing Strategy

**Version**: 2.0  
**Last Updated**: October 25, 2025  
**Test Coverage Target**: 85% minimum

---

## Table of Contents

1. [Testing Overview](#testing-overview)
2. [Backend Testing (Laravel)](#backend-testing-laravel)
3. [Frontend Testing (Next.js/React)](#frontend-testing-nextjsreact)
4. [End-to-End Testing](#end-to-end-testing)
5. [API Testing](#api-testing)
6. [Security Testing](#security-testing)
7. [Performance Testing](#performance-testing)
8. [Offline Sync Testing](#offline-sync-testing)
9. [Accessibility Testing](#accessibility-testing)
10. [Test Data Management](#test-data-management)
11. [CI/CD Integration](#cicd-integration)
12. [Test Reports](#test-reports)

---

## Testing Overview

### Testing Pyramid

```
           ╱╲
          ╱E2E╲         Manual Testing (10%)
         ╱────╲         - Exploratory testing
        ╱ Integ╲        - User acceptance testing
       ╱────────╲
      ╱   Unit   ╲      Integration Tests (20%)
     ╱────────────╲     - API tests
    ╱              ╲    - Component integration
   ╱________________╲   Unit Tests (70%)
                        - Functions, services, components
```

### Testing Frameworks

**Backend**:
- PHPUnit 10.x (unit + integration tests)
- Pest (alternative, more readable syntax)
- Laravel Dusk (browser tests)

**Frontend**:
- Jest 29.x (unit tests)
- React Testing Library (component tests)
- Playwright (E2E tests)

**API Testing**:
- Postman/Newman (API collection tests)
- Artillery (load testing)

### Test Coverage Goals

| Layer | Coverage Target |
|-------|----------------|
| Backend Unit | ≥ 90% |
| Backend Integration | ≥ 80% |
| Frontend Unit | ≥ 85% |
| Frontend Component | ≥ 80% |
| E2E Critical Paths | 100% |
| API Endpoints | 100% |

---

## Backend Testing (Laravel)

### Unit Tests

#### 1. Model Tests

```php
// tests/Unit/Models/AttendanceTest.php
namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Attendance;
use App\Models\Student;
use App\Models\Course;
use Carbon\Carbon;

class AttendanceTest extends TestCase
{
    /** @test */
    public function it_belongs_to_a_student()
    {
        $attendance = Attendance::factory()->create();
        
        $this->assertInstanceOf(Student::class, $attendance->student);
    }
    
    /** @test */
    public function it_belongs_to_a_course()
    {
        $attendance = Attendance::factory()->create();
        
        $this->assertInstanceOf(Course::class, $attendance->course);
    }
    
    /** @test */
    public function it_calculates_attendance_percentage_correctly()
    {
        $course = Course::factory()->create();
        $student = Student::factory()->create();
        
        // Create 10 attendance records: 8 present, 2 absent
        Attendance::factory()->count(8)->create([
            'course_id' => $course->id,
            'student_id' => $student->id,
            'status' => 'present'
        ]);
        
        Attendance::factory()->count(2)->create([
            'course_id' => $course->id,
            'student_id' => $student->id,
            'status' => 'absent'
        ]);
        
        $percentage = $student->attendancePercentage($course);
        
        $this->assertEquals(80.0, $percentage);
    }
    
    /** @test */
    public function it_checks_if_within_edit_window()
    {
        $attendance = Attendance::factory()->create([
            'marked_at' => Carbon::now()->subHours(12)
        ]);
        
        $this->assertTrue($attendance->isWithinEditWindow());
        
        $oldAttendance = Attendance::factory()->create([
            'marked_at' => Carbon::now()->subHours(30)
        ]);
        
        $this->assertFalse($oldAttendance->isWithinEditWindow());
    }
}
```

#### 2. Service/Business Logic Tests

```php
// tests/Unit/Services/GradeCalculatorTest.php
namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\GradeCalculator;
use App\Models\Assessment;
use App\Models\Grade;

class GradeCalculatorTest extends TestCase
{
    private GradeCalculator $calculator;
    
    protected function setUp(): void
    {
        parent::setUp();
        $this->calculator = new GradeCalculator();
    }
    
    /** @test */
    public function it_calculates_weighted_total_correctly()
    {
        $grades = [
            ['score' => 18, 'max' => 20, 'weight' => 10], // Quiz: 90% * 10% = 9%
            ['score' => 26, 'max' => 30, 'weight' => 20], // Assignment: 86.67% * 20% = 17.33%
            ['score' => 42, 'max' => 50, 'weight' => 30], // Midterm: 84% * 30% = 25.2%
        ];
        
        $total = $this->calculator->calculateWeightedTotal($grades);
        
        $this->assertEquals(51.53, round($total, 2));
    }
    
    /** @test */
    public function it_applies_curve_correctly()
    {
        $grades = [65, 70, 75, 80, 85];
        
        $curvedGrades = $this->calculator->applyCurve($grades, 5, 100);
        
        $this->assertEquals([70, 75, 80, 85, 90], $curvedGrades);
    }
    
    /** @test */
    public function it_caps_grades_at_maximum()
    {
        $grades = [95, 98, 100];
        
        $curvedGrades = $this->calculator->applyCurve($grades, 5, 100);
        
        $this->assertEquals([100, 100, 100], $curvedGrades);
    }
    
    /** @test */
    public function it_assigns_letter_grades_correctly()
    {
        $testCases = [
            95 => 'A+',
            85 => 'A',
            75 => 'B+',
            65 => 'B',
            55 => 'C',
            45 => 'F'
        ];
        
        foreach ($testCases as $score => $expectedGrade) {
            $letterGrade = $this->calculator->getLetterGrade($score);
            $this->assertEquals($expectedGrade, $letterGrade);
        }
    }
}
```

#### 3. Policy Tests

```php
// tests/Unit/Policies/AttendancePolicyTest.php
namespace Tests\Unit\Policies;

use Tests\TestCase;
use App\Models\User;
use App\Models\Attendance;
use App\Models\Course;
use App\Policies\AttendancePolicy;
use Carbon\Carbon;

class AttendancePolicyTest extends TestCase
{
    private AttendancePolicy $policy;
    
    protected function setUp(): void
    {
        parent::setUp();
        $this->policy = new AttendancePolicy();
    }
    
    /** @test */
    public function faculty_can_mark_attendance_for_their_courses()
    {
        $faculty = User::factory()->faculty()->create();
        $course = Course::factory()->create();
        $course->assignments()->create(['faculty_id' => $faculty->id]);
        
        $attendance = Attendance::factory()->make([
            'course_id' => $course->id
        ]);
        
        $this->assertTrue($this->policy->create($faculty, $attendance));
    }
    
    /** @test */
    public function faculty_cannot_mark_attendance_for_other_courses()
    {
        $faculty = User::factory()->faculty()->create();
        $otherCourse = Course::factory()->create();
        
        $attendance = Attendance::factory()->make([
            'course_id' => $otherCourse->id
        ]);
        
        $this->assertFalse($this->policy->create($faculty, $attendance));
    }
    
    /** @test */
    public function faculty_can_edit_attendance_within_24_hour_window()
    {
        $faculty = User::factory()->faculty()->create();
        $attendance = Attendance::factory()->create([
            'marked_at' => Carbon::now()->subHours(12),
            'marked_by' => $faculty->id
        ]);
        
        $this->assertTrue($this->policy->update($faculty, $attendance));
    }
    
    /** @test */
    public function faculty_cannot_edit_attendance_beyond_24_hour_window()
    {
        $faculty = User::factory()->faculty()->create();
        $attendance = Attendance::factory()->create([
            'marked_at' => Carbon::now()->subHours(30),
            'marked_by' => $faculty->id
        ]);
        
        $this->assertFalse($this->policy->update($faculty, $attendance));
    }
    
    /** @test */
    public function hod_can_edit_attendance_beyond_window()
    {
        $hod = User::factory()->hod()->create();
        $attendance = Attendance::factory()->create([
            'marked_at' => Carbon::now()->subHours(30)
        ]);
        
        $this->assertTrue($this->policy->update($hod, $attendance));
    }
}
```

### Integration Tests

#### 1. API Endpoint Tests

```php
// tests/Feature/AttendanceControllerTest.php
namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Course;
use App\Models\Student;
use App\Models\Attendance;
use Laravel\Sanctum\Sanctum;

class AttendanceControllerTest extends TestCase
{
    /** @test */
    public function faculty_can_mark_attendance_for_their_course()
    {
        $faculty = User::factory()->faculty()->create();
        $course = Course::factory()->create();
        $course->assignments()->create(['faculty_id' => $faculty->id]);
        $students = Student::factory()->count(3)->create();
        
        foreach ($students as $student) {
            $course->enrollments()->create(['student_id' => $student->id]);
        }
        
        Sanctum::actingAs($faculty);
        
        $response = $this->postJson('/api/faculty/attendance', [
            'course_id' => $course->id,
            'date' => now()->toDateString(),
            'records' => [
                ['student_id' => $students[0]->id, 'status' => 'present'],
                ['student_id' => $students[1]->id, 'status' => 'absent'],
                ['student_id' => $students[2]->id, 'status' => 'present'],
            ]
        ]);
        
        $response->assertStatus(201);
        $response->assertJson(['message' => 'Attendance marked successfully']);
        
        $this->assertDatabaseHas('attendance', [
            'course_id' => $course->id,
            'student_id' => $students[0]->id,
            'status' => 'present'
        ]);
    }
    
    /** @test */
    public function faculty_cannot_mark_attendance_for_other_courses()
    {
        $faculty = User::factory()->faculty()->create();
        $otherCourse = Course::factory()->create();
        $student = Student::factory()->create();
        
        Sanctum::actingAs($faculty);
        
        $response = $this->postJson('/api/faculty/attendance', [
            'course_id' => $otherCourse->id,
            'date' => now()->toDateString(),
            'records' => [
                ['student_id' => $student->id, 'status' => 'present']
            ]
        ]);
        
        $response->assertStatus(403);
    }
    
    /** @test */
    public function it_validates_required_fields()
    {
        $faculty = User::factory()->faculty()->create();
        Sanctum::actingAs($faculty);
        
        $response = $this->postJson('/api/faculty/attendance', []);
        
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['course_id', 'date', 'records']);
    }
    
    /** @test */
    public function it_prevents_duplicate_attendance_for_same_date()
    {
        $faculty = User::factory()->faculty()->create();
        $course = Course::factory()->create();
        $course->assignments()->create(['faculty_id' => $faculty->id]);
        $student = Student::factory()->create();
        
        Attendance::factory()->create([
            'course_id' => $course->id,
            'student_id' => $student->id,
            'date' => now()->toDateString()
        ]);
        
        Sanctum::actingAs($faculty);
        
        $response = $this->postJson('/api/faculty/attendance', [
            'course_id' => $course->id,
            'date' => now()->toDateString(),
            'records' => [
                ['student_id' => $student->id, 'status' => 'present']
            ]
        ]);
        
        $response->assertStatus(422);
        $response->assertJson(['error' => 'Attendance already marked for this date']);
    }
}
```

#### 2. Grade Publishing Tests

```php
// tests/Feature/GradeControllerTest.php
namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Course;
use App\Models\Assessment;
use App\Models\Grade;
use App\Models\Student;
use Laravel\Sanctum\Sanctum;
use Illuminate\Support\Facades\Notification;
use App\Notifications\GradePublished;

class GradeControllerTest extends TestCase
{
    /** @test */
    public function faculty_can_publish_grades_with_2fa_verification()
    {
        Notification::fake();
        
        $faculty = User::factory()->faculty()->create(['2fa_verified' => true]);
        $course = Course::factory()->create();
        $course->assignments()->create(['faculty_id' => $faculty->id]);
        $assessment = Assessment::factory()->create(['course_id' => $course->id]);
        $students = Student::factory()->count(3)->create();
        
        foreach ($students as $student) {
            Grade::factory()->create([
                'assessment_id' => $assessment->id,
                'student_id' => $student->id,
                'score' => 85,
                'status' => 'draft'
            ]);
        }
        
        Sanctum::actingAs($faculty);
        
        $response = $this->postJson("/api/faculty/assessments/{$assessment->id}/publish-grades", [
            '2fa_code' => '123456' // Mock 2FA verification
        ]);
        
        $response->assertStatus(200);
        $response->assertJson(['message' => 'Grades published successfully']);
        
        // Verify grades are published
        $this->assertDatabaseHas('grades', [
            'assessment_id' => $assessment->id,
            'status' => 'published'
        ]);
        
        // Verify notifications sent
        Notification::assertSentTo($students, GradePublished::class);
    }
    
    /** @test */
    public function it_requires_2fa_verification_for_grade_publishing()
    {
        $faculty = User::factory()->faculty()->create(['2fa_verified' => false]);
        $assessment = Assessment::factory()->create();
        
        Sanctum::actingAs($faculty);
        
        $response = $this->postJson("/api/faculty/assessments/{$assessment->id}/publish-grades");
        
        $response->assertStatus(403);
        $response->assertJson(['error' => '2FA verification required']);
    }
    
    /** @test */
    public function it_logs_grade_publication_in_audit_trail()
    {
        $faculty = User::factory()->faculty()->create(['2fa_verified' => true]);
        $assessment = Assessment::factory()->create();
        
        Sanctum::actingAs($faculty);
        
        $this->postJson("/api/faculty/assessments/{$assessment->id}/publish-grades", [
            '2fa_code' => '123456'
        ]);
        
        $this->assertDatabaseHas('audit_logs', [
            'event_type' => 'grade.published',
            'actor_id' => $faculty->id,
            'target_id' => $assessment->id
        ]);
    }
}
```

### Database Tests

```php
// tests/Feature/Database/RowLevelSecurityTest.php
namespace Tests\Feature\Database;

use Tests\TestCase;
use App\Models\User;
use App\Models\Course;
use App\Models\Attendance;
use Illuminate\Support\Facades\DB;

class RowLevelSecurityTest extends TestCase
{
    /** @test */
    public function row_level_security_restricts_attendance_access()
    {
        $faculty1 = User::factory()->faculty()->create();
        $faculty2 = User::factory()->faculty()->create();
        
        $course1 = Course::factory()->create();
        $course2 = Course::factory()->create();
        
        $course1->assignments()->create(['faculty_id' => $faculty1->id]);
        $course2->assignments()->create(['faculty_id' => $faculty2->id]);
        
        $attendance1 = Attendance::factory()->create(['course_id' => $course1->id]);
        $attendance2 = Attendance::factory()->create(['course_id' => $course2->id]);
        
        // Set RLS context for faculty1
        DB::statement("SET app.faculty_id = ?", [$faculty1->id]);
        
        $visibleAttendance = Attendance::all();
        
        $this->assertTrue($visibleAttendance->contains($attendance1));
        $this->assertFalse($visibleAttendance->contains($attendance2));
    }
}
```

---

## Frontend Testing (Next.js/React)

### Component Unit Tests

```typescript
// __tests__/components/AttendanceGrid.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AttendanceGrid } from '@/components/AttendanceGrid';
import '@testing-library/jest-dom';

describe('AttendanceGrid', () => {
  const mockStudents = [
    { id: '1', roll_no: '001', name: 'John Doe', status: 'unmarked' },
    { id: '2', roll_no: '002', name: 'Jane Smith', status: 'unmarked' },
  ];
  
  const mockOnChange = jest.fn();
  
  beforeEach(() => {
    mockOnChange.mockClear();
  });
  
  it('renders student list correctly', () => {
    render(<AttendanceGrid students={mockStudents} onChange={mockOnChange} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });
  
  it('allows marking student as present', async () => {
    render(<AttendanceGrid students={mockStudents} onChange={mockOnChange} />);
    
    const presentButton = screen.getAllByRole('button', { name: /present/i })[0];
    fireEvent.click(presentButton);
    
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('1', 'present');
    });
  });
  
  it('supports keyboard shortcuts', async () => {
    render(<AttendanceGrid students={mockStudents} onChange={mockOnChange} keyboardEnabled={true} />);
    
    const firstRow = screen.getByTestId('student-row-1');
    firstRow.focus();
    
    fireEvent.keyDown(firstRow, { key: 'p', code: 'KeyP' });
    
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('1', 'present');
    });
  });
  
  it('displays offline indicator when offline', () => {
    render(<AttendanceGrid students={mockStudents} onChange={mockOnChange} isOnline={false} />);
    
    expect(screen.getByText(/offline mode/i)).toBeInTheDocument();
  });
  
  it('applies bulk action to all students', async () => {
    render(<AttendanceGrid students={mockStudents} onChange={mockOnChange} />);
    
    const markAllPresentButton = screen.getByRole('button', { name: /present all/i });
    fireEvent.click(markAllPresentButton);
    
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledTimes(2);
      expect(mockOnChange).toHaveBeenCalledWith('1', 'present');
      expect(mockOnChange).toHaveBeenCalledWith('2', 'present');
    });
  });
});
```

### Integration Tests (Component + API)

```typescript
// __tests__/integration/AttendancePage.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AttendancePage } from '@/app/attendance/mark/page';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import '@testing-library/jest-dom';

const server = setupServer(
  rest.get('/api/faculty/courses/:courseId/roster', (req, res, ctx) => {
    return res(ctx.json({
      students: [
        { id: '1', roll_no: '001', name: 'John Doe' },
        { id: '2', roll_no: '002', name: 'Jane Smith' },
      ]
    }));
  }),
  
  rest.post('/api/faculty/attendance', (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ message: 'Success' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('AttendancePage Integration', () => {
  it('loads students and allows marking attendance', async () => {
    render(<AttendancePage courseId="CS101" date="2025-10-25" />);
    
    // Wait for students to load
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    // Mark attendance
    const presentButtons = screen.getAllByRole('button', { name: /present/i });
    fireEvent.click(presentButtons[0]);
    fireEvent.click(presentButtons[1]);
    
    // Submit attendance
    const submitButton = screen.getByRole('button', { name: /save & publish/i });
    fireEvent.click(submitButton);
    
    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/attendance marked successfully/i)).toBeInTheDocument();
    });
  });
  
  it('handles API errors gracefully', async () => {
    server.use(
      rest.post('/api/faculty/attendance', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );
    
    render(<AttendancePage courseId="CS101" date="2025-10-25" />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    const submitButton = screen.getByRole('button', { name: /save & publish/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/error saving attendance/i)).toBeInTheDocument();
    });
  });
});
```

### State Management Tests (Zustand)

```typescript
// __tests__/stores/attendanceStore.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAttendanceStore } from '@/stores/attendanceStore';

describe('AttendanceStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAttendanceStore());
    act(() => {
      result.current.reset();
    });
  });
  
  it('initializes with empty state', () => {
    const { result } = renderHook(() => useAttendanceStore());
    
    expect(result.current.records).toEqual([]);
    expect(result.current.offlineQueue).toEqual([]);
  });
  
  it('adds attendance record', () => {
    const { result } = renderHook(() => useAttendanceStore());
    
    act(() => {
      result.current.markAttendance({
        studentId: '1',
        status: 'present',
        date: '2025-10-25'
      });
    });
    
    expect(result.current.records).toHaveLength(1);
    expect(result.current.records[0].status).toBe('present');
  });
  
  it('queues operations when offline', () => {
    const { result } = renderHook(() => useAttendanceStore());
    
    act(() => {
      result.current.setOnline(false);
      result.current.markAttendance({
        studentId: '1',
        status: 'present',
        date: '2025-10-25'
      });
    });
    
    expect(result.current.offlineQueue).toHaveLength(1);
  });
  
  it('syncs offline queue when coming online', async () => {
    const { result } = renderHook(() => useAttendanceStore());
    
    // Mock API
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => ({ success: true })
      })
    ) as jest.Mock;
    
    act(() => {
      result.current.setOnline(false);
      result.current.markAttendance({
        studentId: '1',
        status: 'present',
        date: '2025-10-25'
      });
    });
    
    await act(async () => {
      result.current.setOnline(true);
      await result.current.syncOfflineQueue();
    });
    
    expect(result.current.offlineQueue).toHaveLength(0);
  });
});
```

---

## End-to-End Testing

### Playwright E2E Tests

```typescript
// e2e/attendance.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Attendance Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="username"]', 'faculty001@test.edu');
    await page.fill('[name="password"]', 'Test@1234');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });
  
  test('complete attendance marking workflow', async ({ page }) => {
    // Navigate to attendance page
    await page.click('text=Mark Attendance');
    await page.selectOption('[name="course"]', 'CS101');
    await page.click('button:has-text("Continue")');
    
    // Wait for student list
    await expect(page.locator('[data-testid="student-row"]')).toHaveCount(60, { timeout: 5000 });
    
    // Mark all as present
    await page.click('button:has-text("Present All")');
    
    // Mark two students as absent
    await page.locator('[data-testid="student-row"]').nth(5).click();
    await page.locator('[data-testid="status-dropdown"]').selectOption('absent');
    
    await page.locator('[data-testid="student-row"]').nth(10).click();
    await page.locator('[data-testid="status-dropdown"]').selectOption('absent');
    
    // Add notes for absent student
    await page.locator('[data-testid="student-row"]').nth(5)
      .locator('[name="notes"]').fill('Sick leave');
    
    // Save and publish
    await page.click('button:has-text("Save & Publish")');
    
    // Confirm dialog
    await page.click('button:has-text("Confirm")');
    
    // Wait for success message
    await expect(page.locator('.toast-success')).toContainText('Attendance marked successfully');
    
    // Verify navigation to success page
    await expect(page).toHaveURL(/\/attendance\/success/);
  });
  
  test('offline mode workflow', async ({ page, context }) => {
    // Navigate to attendance page
    await page.goto('/attendance/mark?course=CS101');
    
    // Wait for page load
    await expect(page.locator('[data-testid="student-row"]')).toHaveCount(60);
    
    // Go offline
    await context.setOffline(true);
    
    // Verify offline indicator
    await expect(page.locator('.offline-banner')).toBeVisible();
    
    // Mark attendance
    await page.click('button:has-text("Present All")');
    
    // Save locally
    await page.click('button:has-text("Save Locally")');
    
    // Verify saved to IndexedDB (check sync queue)
    const queueCount = await page.evaluate(() => {
      return new Promise((resolve) => {
        const request = indexedDB.open('faculty-portal');
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['offline_queue'], 'readonly');
          const store = transaction.objectStore('offline_queue');
          const countRequest = store.count();
          countRequest.onsuccess = () => resolve(countRequest.result);
        };
      });
    });
    
    expect(queueCount).toBeGreaterThan(0);
    
    // Go back online
    await context.setOffline(false);
    
    // Click sync
    await page.click('button:has-text("Sync Now")');
    
    // Wait for sync completion
    await expect(page.locator('.toast-success')).toContainText('Synced successfully');
  });
  
  test('grade publishing with 2FA', async ({ page }) => {
    await page.goto('/gradebook?course=CS101');
    
    // Enter some grades
    await page.fill('[data-testid="grade-input-1"]', '85');
    await page.fill('[data-testid="grade-input-2"]', '90');
    await page.fill('[data-testid="grade-input-3"]', '78');
    
    // Click publish
    await page.click('button:has-text("Publish Grades")');
    
    // 2FA modal appears
    await expect(page.locator('[data-testid="2fa-modal"]')).toBeVisible();
    
    // Enter 2FA code
    await page.fill('[name="2fa_code"]', '123456');
    await page.click('button:has-text("Verify & Publish")');
    
    // Wait for success
    await expect(page.locator('.toast-success')).toContainText('Grades published');
    
    // Verify grades are locked
    await expect(page.locator('[data-testid="grade-input-1"]')).toBeDisabled();
  });
});
```

### Visual Regression Tests

```typescript
// e2e/visual/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression Tests', () => {
  test('dashboard matches baseline', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Wait for all content to load
    await page.waitForLoadState('networkidle');
    
    // Take screenshot
    await expect(page).toHaveScreenshot('dashboard.png', {
      fullPage: true,
      maxDiffPixels: 100
    });
  });
  
  test('attendance grid matches baseline', async ({ page }) => {
    await page.goto('/attendance/mark?course=CS101&date=2025-10-25');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('attendance-grid.png', {
      maxDiffPixels: 100
    });
  });
});
```

---

## API Testing

### Postman Collection Tests

```json
{
  "info": {
    "name": "Faculty Portal API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login - Success",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status is 200', () => {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test('Returns access token', () => {",
                  "    const json = pm.response.json();",
                  "    pm.expect(json).to.have.property('access_token');",
                  "    pm.environment.set('access_token', json.access_token);",
                  "});",
                  "",
                  "pm.test('Token is JWT format', () => {",
                  "    const token = pm.response.json().access_token;",
                  "    pm.expect(token.split('.')).to.have.lengthOf(3);",
                  "});"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\"username\": \"faculty001@test.edu\", \"password\": \"Test@1234\"}",
              "options": { "raw": { "language": "json" } }
            }
          }
        },
        {
          "name": "Login - Invalid Credentials",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status is 401', () => {",
                  "    pm.response.to.have.status(401);",
                  "});",
                  "",
                  "pm.test('Returns error message', () => {",
                  "    const json = pm.response.json();",
                  "    pm.expect(json).to.have.property('error');",
                  "});"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\"username\": \"invalid@test.edu\", \"password\": \"wrongpass\"}",
              "options": { "raw": { "language": "json" } }
            }
          }
        }
      ]
    },
    {
      "name": "Attendance",
      "item": [
        {
          "name": "Mark Attendance - Success",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status is 201', () => {",
                  "    pm.response.to.have.status(201);",
                  "});",
                  "",
                  "pm.test('Response time < 500ms', () => {",
                  "    pm.expect(pm.response.responseTime).to.be.below(500);",
                  "});"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/faculty/attendance",
            "header": [
              { "key": "Authorization", "value": "Bearer {{access_token}}" }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"course_id\": \"CS101\", \"date\": \"2025-10-25\", \"records\": [{\"student_id\": \"1\", \"status\": \"present\"}]}",
              "options": { "raw": { "language": "json" } }
            }
          }
        }
      ]
    }
  ]
}
```

### Load Testing (Artillery)

```yaml
# load-tests/attendance-api.yml
config:
  target: "https://faculty.institution.edu"
  phases:
    - duration: 60
      arrivalRate: 10  # 10 requests per second
      name: "Warm up"
    - duration: 120
      arrivalRate: 50  # 50 requests per second
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100 # 100 requests per second
      name: "Peak load"
  processor: "./load-test-processor.js"
  
scenarios:
  - name: "Mark Attendance"
    flow:
      - post:
          url: "/api/auth/login"
          json:
            username: "{{ $randomString() }}@test.edu"
            password: "Test@1234"
          capture:
            - json: "$.access_token"
              as: "token"
      
      - post:
          url: "/api/faculty/attendance"
          headers:
            Authorization: "Bearer {{ token }}"
          json:
            course_id: "CS101"
            date: "2025-10-25"
            records: "{{ generateRecords() }}"
          
      - think: 2  # Wait 2 seconds between requests

  - name: "View Gradebook"
    flow:
      - get:
          url: "/api/faculty/gradebook?course=CS101"
          headers:
            Authorization: "Bearer {{ token }}"
```

---

## Offline Sync Testing

### Offline Queue Tests

```typescript
// __tests__/offline/syncEngine.test.ts
import { SyncEngine } from '@/lib/syncEngine';
import { openDB } from 'idb';

describe('Offline Sync Engine', () => {
  let syncEngine: SyncEngine;
  let db: any;
  
  beforeEach(async () => {
    db = await openDB('test-db', 1, {
      upgrade(db) {
        db.createObjectStore('offline_queue', { keyPath: 'id', autoIncrement: true });
      }
    });
    syncEngine = new SyncEngine(db);
  });
  
  afterEach(async () => {
    await db.clear('offline_queue');
    await db.close();
  });
  
  it('queues operation when offline', async () => {
    const operation = {
      type: 'POST',
      url: '/api/attendance',
      data: { student_id: '1', status: 'present' },
      timestamp: Date.now()
    };
    
    await syncEngine.queueOperation(operation);
    
    const queue = await db.getAll('offline_queue');
    expect(queue).toHaveLength(1);
    expect(queue[0].data.student_id).toBe('1');
  });
  
  it('syncs queue in order when online', async () => {
    const operations = [
      { type: 'POST', url: '/api/attendance', data: { id: 1 }, timestamp: 1000 },
      { type: 'POST', url: '/api/attendance', data: { id: 2 }, timestamp: 2000 },
      { type: 'POST', url: '/api/attendance', data: { id: 3 }, timestamp: 3000 }
    ];
    
    for (const op of operations) {
      await syncEngine.queueOperation(op);
    }
    
    const syncOrder: number[] = [];
    global.fetch = jest.fn((url, options) => {
      const data = JSON.parse(options?.body as string);
      syncOrder.push(data.id);
      return Promise.resolve({ ok: true, json: async () => ({}) });
    }) as jest.Mock;
    
    await syncEngine.syncAll();
    
    expect(syncOrder).toEqual([1, 2, 3]);
  });
  
  it('handles conflicts during sync', async () => {
    const localOperation = {
      type: 'PUT',
      url: '/api/attendance/123',
      data: { student_id: '1', status: 'absent', updated_at: 1000 },
      timestamp: 1000
    };
    
    await syncEngine.queueOperation(localOperation);
    
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 409,
        json: async () => ({
          conflict: true,
          server_data: { student_id: '1', status: 'present', updated_at: 2000 }
        })
      })
    ) as jest.Mock;
    
    const conflicts = await syncEngine.syncAll();
    
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].local.status).toBe('absent');
    expect(conflicts[0].server.status).toBe('present');
  });
  
  it('retries failed operations with exponential backoff', async () => {
    const operation = {
      type: 'POST',
      url: '/api/attendance',
      data: { id: 1 },
      timestamp: Date.now(),
      retryCount: 0
    };
    
    await syncEngine.queueOperation(operation);
    
    let attempts = 0;
    global.fetch = jest.fn(() => {
      attempts++;
      if (attempts < 3) {
        return Promise.reject(new Error('Network error'));
      }
      return Promise.resolve({ ok: true, json: async () => ({}) });
    }) as jest.Mock;
    
    await syncEngine.syncAll();
    
    expect(attempts).toBe(3);
    
    const queue = await db.getAll('offline_queue');
    expect(queue).toHaveLength(0); // Successfully synced
  });
});
```

---

## Test Data Management

### Factories (Laravel)

```php
// database/factories/UserFactory.php
namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    protected $model = User::class;
    
    public function definition()
    {
        return [
            'name' => $this->faker->name(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => bcrypt('password'),
            'role' => 'faculty',
            'faculty_id' => 'FAC' . $this->faker->unique()->numberBetween(1000, 9999),
            'college_id' => 'CLG001',
            'department_id' => 'CSE',
        ];
    }
    
    public function faculty()
    {
        return $this->state(function (array $attributes) {
            return ['role' => 'faculty'];
        });
    }
    
    public function hod()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'hod',
                'permissions' => ['attendance:override', 'grade:moderate']
            ];
        });
    }
}
```

### Seeders

```php
// database/seeders/TestDataSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Course;
use App\Models\Student;
use App\Models\Assessment;

class TestDataSeeder extends Seeder
{
    public function run()
    {
        // Create test faculty
        $faculty = User::factory()->faculty()->create([
            'email' => 'faculty.test@institution.edu',
            'faculty_id' => 'FAC001'
        ]);
        
        // Create courses
        $courses = Course::factory()->count(3)->create();
        
        foreach ($courses as $course) {
            // Assign faculty to course
            $course->assignments()->create(['faculty_id' => $faculty->id]);
            
            // Create students and enroll
            $students = Student::factory()->count(60)->create();
            foreach ($students as $student) {
                $course->enrollments()->create(['student_id' => $student->id]);
            }
            
            // Create assessments
            Assessment::factory()->count(5)->create(['course_id' => $course->id]);
        }
    }
}
```

---

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/tests.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          extensions: mbstring, pdo_pgsql, redis
          coverage: xdebug
      
      - name: Install dependencies
        run: composer install --prefer-dist --no-progress
      
      - name: Run PHPUnit tests
        env:
          DB_CONNECTION: pgsql
          DB_HOST: localhost
          DB_PORT: 5432
          DB_DATABASE: test_db
          DB_USERNAME: postgres
          DB_PASSWORD: postgres
        run: vendor/bin/phpunit --coverage-clover coverage.xml
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml
  
  frontend-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Jest tests
        run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
  
  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install Playwright
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Test Reports

### Coverage Report Example

```
Faculty Portal - Test Coverage Report
Generated: October 25, 2025

Backend Coverage (Laravel):
-----------------------------
Lines:    4,250 / 4,800 (88.5%)
Functions: 520 / 580 (89.7%)
Branches:  385 / 450 (85.6%)

Top Coverage:
- Models: 95.2%
- Controllers: 91.3%
- Services: 87.8%

Low Coverage (needs attention):
- FileUploadService: 72.1% ⚠️
- NotificationService: 68.3% ⚠️

Frontend Coverage (React):
-----------------------------
Lines:    3,100 / 3,500 (88.6%)
Components: 45 / 48 (93.8%)

Top Coverage:
- AttendanceGrid: 96.5%
- Dashboard: 92.1%

Low Coverage:
- OfflineSyncManager: 75.2% ⚠️

E2E Test Results:
-----------------------------
Total: 42 tests
Passed: 41 ✅
Failed: 1 ❌
Flaky: 0

Failed Tests:
- Grade publishing with network interruption (investigating)

Performance Metrics:
-----------------------------
Average API response time: 120ms
P95 response time: 350ms
Slowest endpoint: /api/gradebook (580ms) ⚠️
```

---

**Last Updated**: October 25, 2025  
**Test Coverage**: 88.5% (Backend), 88.6% (Frontend)  
**Maintained By**: QA Team + Development Team
