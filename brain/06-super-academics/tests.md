# Super Academics Portal - Testing Guide

## Overview
Comprehensive testing strategy for the Super Academics portal covering unit tests, integration tests, end-to-end tests, performance tests, security tests, and continuous integration automation.

---

## Table of Contents
1. [Testing Strategy](#1-testing-strategy)
2. [Unit Tests](#2-unit-tests)
3. [Integration Tests](#3-integration-tests)
4. [End-to-End Tests](#4-end-to-end-tests)
5. [Performance Tests](#5-performance-tests)
6. [Security Tests](#6-security-tests)
7. [Accessibility Tests](#7-accessibility-tests)
8. [CI/CD Integration](#8-cicd-integration)

---

## 1. Testing Strategy

### 1.1 Testing Pyramid
```
         /\
        /E2E\      <- 10% (Critical user journeys)
       /------\
      /  API  \    <- 30% (Integration tests)
     /--------\
    /   Unit   \   <- 60% (Business logic)
   /------------\
```

### 1.2 Testing Tools

**Backend (Laravel)**:
- **PHPUnit**: Unit and feature tests
- **Pest** (optional): Modern testing framework
- **Laravel Dusk**: Browser automation
- **Mockery**: Mocking dependencies

**Frontend (Next.js)**:
- **Jest**: Unit tests
- **React Testing Library**: Component tests
- **Playwright**: E2E tests
- **MSW (Mock Service Worker)**: API mocking

**Performance**:
- **Apache JMeter**: Load testing
- **K6**: Modern load testing
- **Laravel Telescope**: Profiling

### 1.3 Test Coverage Goals
- **Overall**: 80%+
- **Models & Services**: 90%+
- **Controllers**: 75%+
- **Frontend Components**: 70%+

---

## 2. Unit Tests

### 2.1 Model Tests

**Test File**: `tests/Unit/Models/CurriculumTest.php`

```php
<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Curriculum;
use App\Models\Course;
use App\Models\College;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CurriculumTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_has_courses_relationship()
    {
        $curriculum = Curriculum::factory()->create();
        $course = Course::factory()->create(['curriculum_id' => $curriculum->id]);

        $this->assertTrue($curriculum->courses->contains($course));
    }

    /** @test */
    public function it_can_check_if_active()
    {
        $activeCurriculum = Curriculum::factory()->create([
            'status' => 'active',
            'effective_from' => now()->subMonth(),
            'effective_to' => now()->addYear(),
        ]);

        $this->assertTrue($activeCurriculum->isActive());
    }

    /** @test */
    public function it_returns_false_for_inactive_curriculum()
    {
        $inactiveCurriculum = Curriculum::factory()->create([
            'status' => 'draft',
        ]);

        $this->assertFalse($inactiveCurriculum->isActive());
    }

    /** @test */
    public function it_calculates_credit_distribution()
    {
        $curriculum = Curriculum::factory()->create();
        
        Course::factory()->create([
            'curriculum_id' => $curriculum->id,
            'course_type' => 'theory',
            'credits' => 4,
        ]);

        Course::factory()->create([
            'curriculum_id' => $curriculum->id,
            'course_type' => 'lab',
            'credits' => 2,
        ]);

        $distribution = $curriculum->getCreditDistribution();

        $this->assertEquals(4, $distribution['theory']);
        $this->assertEquals(2, $distribution['lab']);
    }

    /** @test */
    public function it_counts_adopting_colleges()
    {
        $curriculum = Curriculum::factory()->create();
        $colleges = College::factory()->count(3)->create();

        $curriculum->colleges()->attach($colleges->pluck('id'), [
            'adopted_at' => now(),
            'status' => 'active',
        ]);

        $this->assertEquals(3, $curriculum->college_count);
    }
}
```

### 2.2 Service Tests

**Test File**: `tests/Unit/Services/CurriculumServiceTest.php`

```php
<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\CurriculumService;
use App\Models\Curriculum;
use App\Models\Course;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;

class CurriculumServiceTest extends TestCase
{
    use RefreshDatabase;

    private CurriculumService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new CurriculumService();
    }

    /** @test */
    public function it_can_create_curriculum_with_courses()
    {
        $data = [
            'program_name' => 'Bachelor of Science',
            'degree_type' => 'bachelor',
            'duration_years' => 4,
            'total_credits' => 180,
            'version' => '1.0',
            'effective_from' => now(),
            'courses' => [
                [
                    'course_code' => 'CS101',
                    'course_name' => 'Intro to Programming',
                    'credits' => 4,
                    'course_type' => 'theory',
                    'semester' => 1,
                ],
            ],
        ];

        $this->actingAs($this->createUser());

        $curriculum = $this->service->createCurriculum($data);

        $this->assertInstanceOf(Curriculum::class, $curriculum);
        $this->assertEquals('Bachelor of Science', $curriculum->program_name);
        $this->assertCount(1, $curriculum->courses);
        $this->assertEquals('CS101', $curriculum->courses->first()->course_code);
    }

    /** @test */
    public function it_clears_cache_when_creating_curriculum()
    {
        Cache::shouldReceive('forget')
            ->once()
            ->with('curricula_active');

        $this->actingAs($this->createUser());

        $this->service->createCurriculum([
            'program_name' => 'Test Program',
            'degree_type' => 'bachelor',
            'duration_years' => 4,
            'total_credits' => 180,
            'version' => '1.0',
            'effective_from' => now(),
        ]);
    }

    /** @test */
    public function it_can_add_course_to_curriculum()
    {
        $curriculum = Curriculum::factory()->create();

        $courseData = [
            'course_code' => 'MATH101',
            'course_name' => 'Calculus I',
            'credits' => 3,
            'course_type' => 'theory',
            'semester' => 1,
        ];

        $course = $this->service->addCourse($curriculum->id, $courseData);

        $this->assertInstanceOf(Course::class, $course);
        $this->assertEquals('MATH101', $course->course_code);
        $this->assertEquals($curriculum->id, $course->curriculum_id);
    }

    /** @test */
    public function it_can_publish_curriculum_to_colleges()
    {
        $curriculum = Curriculum::factory()->create(['status' => 'draft']);
        $colleges = College::factory()->count(2)->create();

        $this->actingAs($this->createUser());

        $this->service->publishCurriculum($curriculum->id, $colleges->pluck('id')->toArray());

        $curriculum->refresh();

        $this->assertEquals('active', $curriculum->status);
        $this->assertNotNull($curriculum->approved_at);
        $this->assertCount(2, $curriculum->colleges);
    }

    /** @test */
    public function it_can_compare_two_curricula()
    {
        $curriculum1 = Curriculum::factory()->create();
        $curriculum2 = Curriculum::factory()->create();

        Course::factory()->create([
            'curriculum_id' => $curriculum1->id,
            'course_code' => 'SHARED101',
            'credits' => 4,
        ]);

        Course::factory()->create([
            'curriculum_id' => $curriculum1->id,
            'course_code' => 'ONLY_IN_CURR1',
            'credits' => 3,
        ]);

        Course::factory()->create([
            'curriculum_id' => $curriculum2->id,
            'course_code' => 'SHARED101',
            'credits' => 5, // Different credits
        ]);

        Course::factory()->create([
            'curriculum_id' => $curriculum2->id,
            'course_code' => 'ONLY_IN_CURR2',
            'credits' => 2,
        ]);

        $comparison = $this->service->compareCurricula($curriculum1->id, $curriculum2->id);

        $this->assertArrayHasKey('added', $comparison);
        $this->assertArrayHasKey('removed', $comparison);
        $this->assertArrayHasKey('modified', $comparison);
        $this->assertCount(1, $comparison['added']);
        $this->assertCount(1, $comparison['removed']);
        $this->assertCount(1, $comparison['modified']);
    }

    private function createUser()
    {
        return User::factory()->create();
    }
}
```

### 2.3 Repository Tests

**Test File**: `tests/Unit/Repositories/CurriculumRepositoryTest.php`

```php
<?php

namespace Tests\Unit\Repositories;

use Tests\TestCase;
use App\Repositories\CurriculumRepository;
use App\Models\Curriculum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CurriculumRepositoryTest extends TestCase
{
    use RefreshDatabase;

    private CurriculumRepository $repository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->repository = new CurriculumRepository();
    }

    /** @test */
    public function it_can_find_active_curricula()
    {
        Curriculum::factory()->count(3)->create(['status' => 'active']);
        Curriculum::factory()->count(2)->create(['status' => 'draft']);

        $active = $this->repository->findActive();

        $this->assertCount(3, $active);
    }

    /** @test */
    public function it_can_filter_by_degree_type()
    {
        Curriculum::factory()->count(2)->create(['degree_type' => 'bachelor']);
        Curriculum::factory()->create(['degree_type' => 'master']);

        $bachelors = $this->repository->filterByDegreeType('bachelor');

        $this->assertCount(2, $bachelors);
    }
}
```

---

## 3. Integration Tests

### 3.1 API Tests

**Test File**: `tests/Feature/Api/CurriculumApiTest.php`

```php
<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Curriculum;
use App\Models\Course;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class CurriculumApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_requires_authentication()
    {
        $response = $this->getJson('/api/v1/curriculum');

        $response->assertStatus(401);
    }

    /** @test */
    public function it_can_list_curricula()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('view:curricula');
        Sanctum::actingAs($user);

        Curriculum::factory()->count(5)->create();

        $response = $this->getJson('/api/v1/curriculum');

        $response->assertStatus(200)
                 ->assertJsonCount(5, 'data')
                 ->assertJsonStructure([
                     'data' => [
                         '*' => [
                             'id',
                             'program_name',
                             'degree_type',
                             'total_credits',
                             'status',
                         ]
                     ],
                     'meta' => ['current_page', 'last_page', 'per_page', 'total'],
                 ]);
    }

    /** @test */
    public function it_can_create_curriculum_with_permission()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('create:curricula');
        Sanctum::actingAs($user);

        $data = [
            'program_name' => 'Bachelor of Arts',
            'degree_type' => 'bachelor',
            'duration_years' => 3,
            'total_credits' => 120,
            'version' => '1.0',
            'effective_from' => now()->format('Y-m-d'),
        ];

        $response = $this->postJson('/api/v1/curriculum', $data);

        $response->assertStatus(201)
                 ->assertJsonPath('data.program_name', 'Bachelor of Arts')
                 ->assertJsonPath('data.status', 'draft');

        $this->assertDatabaseHas('curricula', [
            'program_name' => 'Bachelor of Arts',
            'degree_type' => 'bachelor',
        ]);
    }

    /** @test */
    public function it_cannot_create_curriculum_without_permission()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $data = [
            'program_name' => 'Test Program',
            'degree_type' => 'bachelor',
            'duration_years' => 4,
            'total_credits' => 180,
        ];

        $response = $this->postJson('/api/v1/curriculum', $data);

        $response->assertStatus(403);
    }

    /** @test */
    public function it_validates_curriculum_creation_data()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('create:curricula');
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/curriculum', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors([
                     'program_name',
                     'degree_type',
                     'duration_years',
                     'total_credits',
                 ]);
    }

    /** @test */
    public function it_can_update_draft_curriculum()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('edit:curricula');
        Sanctum::actingAs($user);

        $curriculum = Curriculum::factory()->create(['status' => 'draft']);

        $response = $this->putJson("/api/v1/curriculum/{$curriculum->id}", [
            'program_name' => 'Updated Program Name',
            'degree_type' => $curriculum->degree_type,
            'duration_years' => $curriculum->duration_years,
            'total_credits' => 200,
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.program_name', 'Updated Program Name')
                 ->assertJsonPath('data.total_credits', 200);
    }

    /** @test */
    public function it_cannot_update_published_curriculum()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('edit:curricula');
        Sanctum::actingAs($user);

        $curriculum = Curriculum::factory()->create(['status' => 'active']);

        $response = $this->putJson("/api/v1/curriculum/{$curriculum->id}", [
            'program_name' => 'Trying to Update',
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function it_can_publish_curriculum_to_colleges()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('publish:curricula');
        Sanctum::actingAs($user);

        $curriculum = Curriculum::factory()->create(['status' => 'draft']);
        $colleges = College::factory()->count(3)->create();

        $response = $this->postJson("/api/v1/curriculum/{$curriculum->id}/publish", [
            'college_ids' => $colleges->pluck('id')->toArray(),
        ]);

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Curriculum published successfully']);

        $curriculum->refresh();
        $this->assertEquals('active', $curriculum->status);
        $this->assertCount(3, $curriculum->colleges);
    }

    /** @test */
    public function it_can_get_curriculum_statistics()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('view:curricula');
        Sanctum::actingAs($user);

        $curriculum = Curriculum::factory()->create();
        Course::factory()->count(10)->create(['curriculum_id' => $curriculum->id]);

        $response = $this->getJson("/api/v1/curriculum/{$curriculum->id}/stats");

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         'total_colleges',
                         'active_colleges',
                         'total_courses',
                         'total_credits',
                         'credit_distribution',
                         'adoption_rate',
                     ],
                 ]);
    }

    /** @test */
    public function it_can_compare_curricula()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('view:curricula');
        Sanctum::actingAs($user);

        $curriculum1 = Curriculum::factory()->create();
        $curriculum2 = Curriculum::factory()->create();

        $response = $this->postJson('/api/v1/curriculum/compare', [
            'curriculum_id_1' => $curriculum1->id,
            'curriculum_id_2' => $curriculum2->id,
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         'added',
                         'removed',
                         'modified',
                         'credit_difference',
                     ],
                 ]);
    }

    /** @test */
    public function it_paginates_results()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('view:curricula');
        Sanctum::actingAs($user);

        Curriculum::factory()->count(30)->create();

        $response = $this->getJson('/api/v1/curriculum?per_page=10');

        $response->assertStatus(200)
                 ->assertJsonCount(10, 'data')
                 ->assertJsonPath('meta.per_page', 10)
                 ->assertJsonPath('meta.last_page', 3);
    }
}
```

### 3.2 Database Tests

**Test File**: `tests/Feature/Database/CurriculumDatabaseTest.php`

```php
<?php

namespace Tests\Feature\Database;

use Tests\TestCase;
use App\Models\Curriculum;
use App\Models\Course;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CurriculumDatabaseTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_soft_deletes_curriculum()
    {
        $curriculum = Curriculum::factory()->create();

        $curriculum->delete();

        $this->assertSoftDeleted('curricula', ['id' => $curriculum->id]);
    }

    /** @test */
    public function it_cascades_deletes_to_courses()
    {
        $curriculum = Curriculum::factory()->create();
        $course = Course::factory()->create(['curriculum_id' => $curriculum->id]);

        $curriculum->delete();

        $this->assertDatabaseMissing('courses', ['id' => $course->id]);
    }

    /** @test */
    public function it_enforces_unique_constraint_on_active_curriculum_college()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);

        $curriculum = Curriculum::factory()->create();
        $college = College::factory()->create();

        // First attachment - should work
        $curriculum->colleges()->attach($college->id, [
            'adopted_at' => now(),
            'status' => 'active',
        ]);

        // Second attachment with same status - should fail
        $curriculum->colleges()->attach($college->id, [
            'adopted_at' => now(),
            'status' => 'active',
        ]);
    }

    /** @test */
    public function it_updates_timestamp_automatically()
    {
        $curriculum = Curriculum::factory()->create();
        $oldUpdatedAt = $curriculum->updated_at;

        sleep(1);

        $curriculum->update(['program_name' => 'Updated Name']);

        $this->assertNotEquals($oldUpdatedAt, $curriculum->fresh()->updated_at);
    }
}
```

---

## 4. End-to-End Tests

### 4.1 Playwright E2E Tests (Frontend)

**Test File**: `tests/e2e/curriculum.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Curriculum Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as super academics admin
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('can view curriculum list', async ({ page }) => {
    await page.goto('/curriculum');

    await expect(page.locator('h1')).toContainText('Curriculum Management');
    await expect(page.locator('table tbody tr')).toHaveCount(5); // Assuming 5 seed records
  });

  test('can create new curriculum', async ({ page }) => {
    await page.goto('/curriculum');
    await page.click('button:has-text("Create Curriculum")');

    await page.fill('input[name="program_name"]', 'Bachelor of Engineering');
    await page.selectOption('select[name="degree_type"]', 'bachelor');
    await page.fill('input[name="duration_years"]', '4');
    await page.fill('input[name="total_credits"]', '180');

    await page.click('button[type="submit"]');

    await expect(page.locator('.toast')).toContainText('Curriculum created successfully');
    await expect(page).toHaveURL(/\/curriculum\/\d+/);
  });

  test('can add course to curriculum', async ({ page }) => {
    await page.goto('/curriculum/1'); // Assuming curriculum with ID 1 exists

    await page.click('button:has-text("Add Course")');

    await page.fill('input[name="course_code"]', 'ENG101');
    await page.fill('input[name="course_name"]', 'Engineering Basics');
    await page.fill('input[name="credits"]', '4');
    await page.selectOption('select[name="course_type"]', 'theory');
    await page.fill('input[name="semester"]', '1');

    await page.click('button:has-text("Save Course")');

    await expect(page.locator('.toast')).toContainText('Course added successfully');
    await expect(page.locator('table')).toContainText('ENG101');
  });

  test('can publish curriculum to colleges', async ({ page }) => {
    await page.goto('/curriculum/1');

    await page.click('button:has-text("Publish")');

    // Select colleges
    await page.check('input[type="checkbox"][value="1"]'); // College 1
    await page.check('input[type="checkbox"][value="2"]'); // College 2

    await page.click('button:has-text("Confirm Publish")');

    await expect(page.locator('.toast')).toContainText('Curriculum published successfully');
    await expect(page.locator('.badge')).toContainText('Active');
  });

  test('cannot edit published curriculum', async ({ page }) => {
    await page.goto('/curriculum/1'); // Assuming curriculum 1 is published

    const editButton = page.locator('button:has-text("Edit")');
    await expect(editButton).toBeDisabled();
  });

  test('can compare two curricula', async ({ page }) => {
    await page.goto('/curriculum/compare');

    await page.selectOption('select[name="curriculum_1"]', '1');
    await page.selectOption('select[name="curriculum_2"]', '2');

    await page.click('button:has-text("Compare")');

    await expect(page.locator('.comparison-table')).toBeVisible();
    await expect(page.locator('.added-courses')).toBeVisible();
    await expect(page.locator('.removed-courses')).toBeVisible();
    await expect(page.locator('.modified-courses')).toBeVisible();
  });
});

test.describe('Examination Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
  });

  test('can create exam schedule', async ({ page }) => {
    await page.goto('/examinations');
    await page.click('button:has-text("Create Schedule")');

    await page.fill('input[name="academic_year"]', '2024-2025');
    await page.fill('input[name="semester"]', '1');
    await page.selectOption('select[name="exam_type"]', 'end_term');
    await page.fill('input[name="start_date"]', '2024-12-01');
    await page.fill('input[name="end_date"]', '2024-12-15');

    await page.click('button[type="submit"]');

    await expect(page.locator('.toast')).toContainText('Exam schedule created');
  });

  test('can add exams to schedule', async ({ page }) => {
    await page.goto('/examinations/schedules/1');

    await page.click('button:has-text("Add Exam")');

    await page.selectOption('select[name="course_id"]', '1');
    await page.fill('input[name="exam_date"]', '2024-12-05');
    await page.fill('input[name="start_time"]', '10:00');
    await page.fill('input[name="duration_minutes"]', '180');
    await page.fill('input[name="total_marks"]', '100');

    await page.click('button:has-text("Save Exam")');

    await expect(page.locator('.toast')).toContainText('Exam added successfully');
  });
});
```

### 4.2 Laravel Dusk Tests

**Test File**: `tests/Browser/CurriculumTest.php`

```php
<?php

namespace Tests\Browser;

use Tests\DuskTestCase;
use Laravel\Dusk\Browser;
use App\Models\User;
use App\Models\Curriculum;

class CurriculumTest extends DuskTestCase
{
    /** @test */
    public function user_can_navigate_to_curriculum_page()
    {
        $this->browse(function (Browser $browser) {
            $user = User::factory()->create();
            $user->givePermissionTo('view:curricula');

            $browser->loginAs($user)
                    ->visit('/curriculum')
                    ->assertSee('Curriculum Management')
                    ->assertSee('Create Curriculum');
        });
    }

    /** @test */
    public function user_can_filter_curricula_by_status()
    {
        $this->browse(function (Browser $browser) {
            $user = User::factory()->create();
            $user->givePermissionTo('view:curricula');

            Curriculum::factory()->create(['status' => 'active', 'program_name' => 'Active Program']);
            Curriculum::factory()->create(['status' => 'draft', 'program_name' => 'Draft Program']);

            $browser->loginAs($user)
                    ->visit('/curriculum')
                    ->select('status', 'active')
                    ->pause(500)
                    ->assertSee('Active Program')
                    ->assertDontSee('Draft Program');
        });
    }
}
```

---

## 5. Performance Tests

### 5.1 Load Testing with K6

**Test File**: `tests/performance/curriculum-load-test.js`

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 200 }, // Ramp up to 200 users
    { duration: '5m', target: 200 }, // Stay at 200 users
    { duration: '2m', target: 0 },   // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate must be below 1%
  },
};

const BASE_URL = 'https://api.example.com/api/v1';
const TOKEN = 'YOUR_AUTH_TOKEN';

export default function () {
  // Test listing curricula
  let listResponse = http.get(`${BASE_URL}/curriculum`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  check(listResponse, {
    'list status is 200': (r) => r.status === 200,
    'list response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // Test getting single curriculum
  let detailResponse = http.get(`${BASE_URL}/curriculum/1`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  check(detailResponse, {
    'detail status is 200': (r) => r.status === 200,
    'detail response time < 300ms': (r) => r.timings.duration < 300,
  });

  sleep(1);
}
```

### 5.2 Database Query Performance

**Test File**: `tests/Performance/QueryPerformanceTest.php`

```php
<?php

namespace Tests\Performance;

use Tests\TestCase;
use App\Models\Curriculum;
use App\Models\Course;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

class QueryPerformanceTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function curriculum_listing_query_is_optimized()
    {
        Curriculum::factory()->count(100)->create();

        DB::enableQueryLog();

        Curriculum::with('courses')->get();

        $queries = DB::getQueryLog();

        // Should use eager loading (2 queries max: curricula + courses)
        $this->assertLessThanOrEqual(2, count($queries));
    }

    /** @test */
    public function cross_college_performance_query_completes_quickly()
    {
        // Seed large dataset
        Curriculum::factory()->count(50)->create();
        College::factory()->count(100)->create();

        $start = microtime(true);

        DB::table('colleges')
            ->join('exam_results', 'colleges.id', '=', 'exam_results.college_id')
            ->select(
                'colleges.id',
                'colleges.name',
                DB::raw('AVG(exam_results.marks_obtained) as avg_score')
            )
            ->groupBy('colleges.id', 'colleges.name')
            ->get();

        $duration = microtime(true) - $start;

        // Query should complete in under 500ms
        $this->assertLessThan(0.5, $duration);
    }
}
```

---

## 6. Security Tests

### 6.1 Authorization Tests

**Test File**: `tests/Security/AuthorizationTest.php`

```php
<?php

namespace Tests\Security;

use Tests\TestCase;
use App\Models\User;
use App\Models\Curriculum;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function unauthorized_user_cannot_create_curriculum()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/curriculum', [
            'program_name' => 'Unauthorized Program',
            'degree_type' => 'bachelor',
            'duration_years' => 4,
            'total_credits' => 180,
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function user_cannot_approve_own_curriculum()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('approve:curricula');
        Sanctum::actingAs($user);

        $curriculum = Curriculum::factory()->create(['created_by' => $user->id]);

        $response = $this->postJson("/api/v1/curriculum/{$curriculum->id}/approve");

        $response->assertStatus(403);
    }

    /** @test */
    public function user_cannot_edit_published_curriculum()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('edit:curricula');
        Sanctum::actingAs($user);

        $curriculum = Curriculum::factory()->create(['status' => 'active']);

        $response = $this->putJson("/api/v1/curriculum/{$curriculum->id}", [
            'program_name' => 'Trying to Update',
        ]);

        $response->assertStatus(403);
    }
}
```

### 6.2 Input Validation Security

**Test File**: `tests/Security/InputValidationTest.php`

```php
<?php

namespace Tests\Security;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

class InputValidationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_prevents_sql_injection_in_search()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('view:curricula');
        Sanctum::actingAs($user);

        $maliciousInput = "'; DROP TABLE curricula; --";

        $response = $this->getJson("/api/v1/curriculum?program_name={$maliciousInput}");

        $response->assertStatus(200);
        $this->assertDatabaseHas('curricula', ['id' => 1]); // Table still exists
    }

    /** @test */
    public function it_rejects_invalid_degree_type()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('create:curricula');
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/v1/curriculum', [
            'program_name' => 'Test',
            'degree_type' => 'invalid_degree',
            'duration_years' => 4,
            'total_credits' => 180,
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors('degree_type');
    }

    /** @test */
    public function it_sanitizes_xss_in_program_name()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('create:curricula');
        Sanctum::actingAs($user);

        $xssPayload = '<script>alert("XSS")</script>';

        $response = $this->postJson('/api/v1/curriculum', [
            'program_name' => $xssPayload,
            'degree_type' => 'bachelor',
            'duration_years' => 4,
            'total_credits' => 180,
        ]);

        // Should be rejected or sanitized
        $response->assertStatus(422);
    }
}
```

---

## 7. Accessibility Tests

### 7.1 Axe Accessibility Tests

**Test File**: `tests/e2e/accessibility.spec.ts`

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('curriculum list page should not have accessibility violations', async ({ page }) => {
    await page.goto('/curriculum');

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('curriculum create form should be keyboard accessible', async ({ page }) => {
    await page.goto('/curriculum/create');

    // Tab through form fields
    await page.keyboard.press('Tab'); // Focus program_name
    await page.keyboard.type('Bachelor of Science');

    await page.keyboard.press('Tab'); // Focus degree_type
    await page.keyboard.press('Enter'); // Open dropdown
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter'); // Select option

    // Verify form can be submitted with keyboard
    await page.keyboard.press('Tab'); // Move to submit button
    await page.keyboard.press('Enter'); // Submit form

    await expect(page.locator('.toast')).toBeVisible();
  });
});
```

---

## 8. CI/CD Integration

### 8.1 GitHub Actions Workflow

**File**: `.github/workflows/tests.yml`

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  backend-tests:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: test_db
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7.2-alpine
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
          php-version: '8.2'
          extensions: mbstring, pdo, pdo_pgsql, redis
          coverage: xdebug

      - name: Install dependencies
        run: composer install --prefer-dist --no-progress

      - name: Run PHPUnit tests
        env:
          DB_CONNECTION: pgsql
          DB_HOST: localhost
          DB_PORT: 5432
          DB_DATABASE: test_db
          DB_USERNAME: test_user
          DB_PASSWORD: test_password
        run: vendor/bin/phpunit --coverage-clover=coverage.xml

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
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run Jest tests
        run: npm test -- --coverage

      - name: Run Playwright E2E tests
        run: npx playwright test

      - name: Upload Playwright results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Test Coverage Report Example

```
------------------------------------------------------------
Code Coverage Report:
------------------------------------------------------------
Models:           92.5% (37/40 files)
Services:         89.3% (25/28 files)
Controllers:      78.2% (18/23 files)
Frontend:         71.5% (120/168 files)
------------------------------------------------------------
Overall:          82.4%
------------------------------------------------------------
```

---

*This comprehensive testing guide ensures the Super Academics portal is production-ready with high code quality, security, and reliability.*
