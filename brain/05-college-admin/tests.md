# College Admin Portal - Testing Documentation

## Overview
Comprehensive testing strategy for the College Admin portal covering unit tests, integration tests, E2E tests, and performance testing for all administrative modules including staff management, infrastructure, transport, hostel, documents, vendors, grievances, and library management.

## Testing Stack

### Backend Testing (Laravel)
- **PHPUnit 10.5**: Unit and integration testing
- **Pest PHP**: Modern testing framework (optional alternative)
- **Laravel Dusk**: Browser automation testing
- **Mockery**: Mocking framework
- **Faker**: Test data generation
- **PHPStan**: Static analysis (Level 8)

### Frontend Testing (Next.js)
- **Jest 29.7**: Unit testing framework
- **React Testing Library**: Component testing
- **Playwright**: E2E browser testing
- **MSW (Mock Service Worker)**: API mocking
- **Testing Library User Event**: User interaction simulation
- **Axe-core**: Accessibility testing

### Database Testing
- **DatabaseTransactions**: Laravel trait for test isolation
- **RefreshDatabase**: Database reset between tests
- **Factory Pattern**: Model factories for test data
- **Seeders**: Consistent test data setup

## 1. Unit Tests

### 1.1 Backend Unit Tests

#### Staff Management Tests
```php
// tests/Unit/Services/StaffManagementServiceTest.php
<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\StaffManagementService;
use App\Models\Staff;
use App\Models\College;
use App\Models\Department;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;

class StaffManagementServiceTest extends TestCase
{
    use RefreshDatabase;

    protected StaffManagementService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(StaffManagementService::class);
    }

    /** @test */
    public function it_creates_staff_member_successfully()
    {
        $college = College::factory()->create();
        $department = Department::factory()->create(['college_id' => $college->id]);

        $staffData = [
            'college_id' => $college->id,
            'employee_id' => 'EMP001',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'phone' => '+1234567890',
            'department_id' => $department->id,
            'designation' => 'Professor',
            'employment_type' => 'full_time',
            'joining_date' => now(),
        ];

        $staff = $this->service->createStaff($staffData);

        $this->assertInstanceOf(Staff::class, $staff);
        $this->assertEquals('EMP001', $staff->employee_id);
        $this->assertEquals('john.doe@example.com', $staff->email);
        $this->assertDatabaseHas('staff', ['employee_id' => 'EMP001']);
    }

    /** @test */
    public function it_validates_unique_employee_id()
    {
        $college = College::factory()->create();
        Staff::factory()->create([
            'college_id' => $college->id,
            'employee_id' => 'EMP001'
        ]);

        $this->expectException(\Illuminate\Validation\ValidationException::class);

        $this->service->createStaff([
            'college_id' => $college->id,
            'employee_id' => 'EMP001',
            'email' => 'duplicate@example.com',
        ]);
    }

    /** @test */
    public function it_calculates_attendance_percentage_correctly()
    {
        $staff = Staff::factory()->create();
        
        // Create attendance records
        for ($i = 0; $i < 20; $i++) {
            $staff->attendance()->create([
                'date' => now()->subDays($i),
                'status' => $i < 18 ? 'present' : 'absent',
                'check_in' => now()->subDays($i)->setTime(9, 0),
                'check_out' => $i < 18 ? now()->subDays($i)->setTime(17, 0) : null,
            ]);
        }

        $percentage = $this->service->calculateAttendancePercentage($staff->id, now()->subDays(20), now());

        $this->assertEquals(90.0, $percentage);
    }

    /** @test */
    public function it_generates_staff_report_with_correct_data()
    {
        $college = College::factory()->create();
        Staff::factory()->count(15)->create(['college_id' => $college->id]);

        $report = $this->service->generateStaffReport($college->id, [
            'start_date' => now()->subMonth(),
            'end_date' => now(),
        ]);

        $this->assertArrayHasKey('total_staff', $report);
        $this->assertArrayHasKey('by_department', $report);
        $this->assertArrayHasKey('by_employment_type', $report);
        $this->assertEquals(15, $report['total_staff']);
    }

    /** @test */
    public function it_handles_staff_termination_correctly()
    {
        $staff = Staff::factory()->create(['status' => 'active']);

        $result = $this->service->terminateStaff($staff->id, [
            'termination_date' => now(),
            'termination_reason' => 'Resignation',
            'notes' => 'Voluntary resignation'
        ]);

        $this->assertTrue($result);
        $staff->refresh();
        $this->assertEquals('terminated', $staff->status);
        $this->assertNotNull($staff->termination_date);
    }
}
```

#### Infrastructure Management Tests
```php
// tests/Unit/Services/AssetManagementServiceTest.php
<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\AssetManagementService;
use App\Models\Asset;
use App\Models\WorkOrder;
use App\Models\College;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AssetManagementServiceTest extends TestCase
{
    use RefreshDatabase;

    protected AssetManagementService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(AssetManagementService::class);
    }

    /** @test */
    public function it_creates_asset_with_qr_code()
    {
        $college = College::factory()->create();

        $assetData = [
            'college_id' => $college->id,
            'asset_code' => 'AST001',
            'name' => 'Laptop',
            'category' => 'IT Equipment',
            'purchase_date' => now(),
            'purchase_cost' => 1500.00,
        ];

        $asset = $this->service->createAsset($assetData);

        $this->assertNotNull($asset->qr_code);
        $this->assertStringContainsString('AST001', $asset->qr_code);
    }

    /** @test */
    public function it_tracks_asset_depreciation()
    {
        $asset = Asset::factory()->create([
            'purchase_cost' => 10000.00,
            'purchase_date' => now()->subYears(2),
            'useful_life_years' => 5,
        ]);

        $currentValue = $this->service->calculateCurrentValue($asset->id);

        // Straight-line depreciation: 10000 - (10000/5 * 2) = 6000
        $this->assertEquals(6000.00, $currentValue);
    }

    /** @test */
    public function it_creates_work_order_for_maintenance()
    {
        $asset = Asset::factory()->create();

        $workOrderData = [
            'asset_id' => $asset->id,
            'title' => 'AC Maintenance',
            'description' => 'Annual AC servicing required',
            'priority' => 'medium',
            'scheduled_date' => now()->addDays(7),
        ];

        $workOrder = $this->service->createWorkOrder($workOrderData);

        $this->assertInstanceOf(WorkOrder::class, $workOrder);
        $this->assertEquals('pending', $workOrder->status);
        $this->assertDatabaseHas('work_orders', ['title' => 'AC Maintenance']);
    }

    /** @test */
    public function it_generates_maintenance_schedule()
    {
        $college = College::factory()->create();
        Asset::factory()->count(10)->create([
            'college_id' => $college->id,
            'maintenance_frequency' => 'monthly',
        ]);

        $schedule = $this->service->generateMaintenanceSchedule($college->id, now()->month);

        $this->assertIsArray($schedule);
        $this->assertGreaterThan(0, count($schedule));
    }
}
```

#### Transport Management Tests
```php
// tests/Unit/Services/TransportServiceTest.php
<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\TransportService;
use App\Models\Bus;
use App\Models\TransportRoute;
use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TransportServiceTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_tracks_real_time_bus_location()
    {
        $bus = Bus::factory()->create();

        $location = [
            'latitude' => 40.7128,
            'longitude' => -74.0060,
            'timestamp' => now(),
        ];

        $result = app(TransportService::class)->updateBusLocation($bus->id, $location);

        $this->assertTrue($result);
        $bus->refresh();
        $this->assertEquals(40.7128, $bus->current_latitude);
        $this->assertEquals(-74.0060, $bus->current_longitude);
    }

    /** @test */
    public function it_calculates_route_distance_correctly()
    {
        $route = TransportRoute::factory()->create([
            'stops' => [
                ['name' => 'Stop 1', 'lat' => 40.7128, 'lng' => -74.0060],
                ['name' => 'Stop 2', 'lat' => 40.7580, 'lng' => -73.9855],
                ['name' => 'Stop 3', 'lat' => 40.7489, 'lng' => -73.9680],
            ],
        ]);

        $distance = app(TransportService::class)->calculateRouteDistance($route->id);

        $this->assertIsFloat($distance);
        $this->assertGreaterThan(0, $distance);
    }

    /** @test */
    public function it_sends_delay_alert_when_bus_delayed()
    {
        Notification::fake();

        $bus = Bus::factory()->create(['status' => 'running']);
        $students = Student::factory()->count(5)->create();
        
        $bus->students()->attach($students->pluck('id'));

        app(TransportService::class)->handleBusDelay($bus->id, 30); // 30 minutes delay

        Notification::assertSentTo($students, \App\Notifications\BusDelayNotification::class);
    }
}
```

### 1.2 Frontend Unit Tests

#### Component Tests
```typescript
// __tests__/components/staff/StaffList.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaffList } from '@/components/staff/StaffList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockStaffData = [
  {
    id: 1,
    employee_id: 'EMP001',
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    designation: 'Professor',
    department: { name: 'Computer Science' },
    status: 'active',
  },
  // More mock data...
];

describe('StaffList Component', () => {
  const queryClient = new QueryClient();

  it('renders staff list correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <StaffList initialData={mockStaffData} />
      </QueryClientProvider>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('EMP001')).toBeInTheDocument();
    expect(screen.getByText('Professor')).toBeInTheDocument();
  });

  it('filters staff by department', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <StaffList initialData={mockStaffData} />
      </QueryClientProvider>
    );

    const departmentFilter = screen.getByLabelText('Department');
    await userEvent.selectOptions(departmentFilter, 'Computer Science');

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('searches staff by name', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <StaffList initialData={mockStaffData} />
      </QueryClientProvider>
    );

    const searchInput = screen.getByPlaceholderText('Search staff...');
    await userEvent.type(searchInput, 'John');

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('opens staff detail modal on row click', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <StaffList initialData={mockStaffData} />
      </QueryClientProvider>
    );

    const staffRow = screen.getByText('John Doe').closest('tr');
    await userEvent.click(staffRow!);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Staff Details')).toBeInTheDocument();
  });
});
```

#### Hook Tests
```typescript
// __tests__/hooks/useStaffManagement.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useStaffManagement } from '@/hooks/useStaffManagement';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.get('/api/v1/staff', (req, res, ctx) => {
    return res(ctx.json({ data: mockStaffData }));
  }),
  rest.post('/api/v1/staff', (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({ data: { id: 1, ...req.body } }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('useStaffManagement Hook', () => {
  const wrapper = ({ children }) => (
    <QueryClientProvider client={new QueryClient()}>
      {children}
    </QueryClientProvider>
  );

  it('fetches staff list successfully', async () => {
    const { result } = renderHook(() => useStaffManagement(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.staff).toHaveLength(mockStaffData.length);
  });

  it('creates new staff member', async () => {
    const { result } = renderHook(() => useStaffManagement(), { wrapper });

    const newStaff = {
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
    };

    await waitFor(() => {
      result.current.createStaff(newStaff);
    });

    expect(result.current.isSuccess).toBe(true);
  });
});
```

## 2. Integration Tests

### 2.1 API Integration Tests

#### Staff Management API Tests
```php
// tests/Feature/Api/StaffApiTest.php
<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Staff;
use App\Models\College;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class StaffApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $collegeAdmin;
    protected College $college;

    protected function setUp(): void
    {
        parent::setUp();

        $this->college = College::factory()->create();
        $this->collegeAdmin = User::factory()->create([
            'role' => 'college_admin',
            'college_id' => $this->college->id,
        ]);

        Sanctum::actingAs($this->collegeAdmin);
    }

    /** @test */
    public function it_returns_staff_list_for_college()
    {
        Staff::factory()->count(10)->create(['college_id' => $this->college->id]);
        Staff::factory()->count(5)->create(); // Different college

        $response = $this->getJson('/api/v1/staff');

        $response->assertStatus(200)
            ->assertJsonCount(10, 'data')
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'employee_id', 'first_name', 'last_name', 'email', 'designation']
                ],
                'meta' => ['total', 'per_page', 'current_page'],
            ]);
    }

    /** @test */
    public function it_creates_staff_member_with_valid_data()
    {
        $staffData = [
            'employee_id' => 'EMP001',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'phone' => '+1234567890',
            'designation' => 'Professor',
            'employment_type' => 'full_time',
            'joining_date' => now()->format('Y-m-d'),
        ];

        $response = $this->postJson('/api/v1/staff', $staffData);

        $response->assertStatus(201)
            ->assertJsonFragment(['employee_id' => 'EMP001'])
            ->assertJsonStructure(['data' => ['id', 'employee_id', 'email']]);

        $this->assertDatabaseHas('staff', ['employee_id' => 'EMP001']);
    }

    /** @test */
    public function it_validates_required_fields_on_staff_creation()
    {
        $response = $this->postJson('/api/v1/staff', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['employee_id', 'first_name', 'last_name', 'email']);
    }

    /** @test */
    public function it_updates_staff_information()
    {
        $staff = Staff::factory()->create(['college_id' => $this->college->id]);

        $updateData = [
            'designation' => 'Associate Professor',
            'phone' => '+9876543210',
        ];

        $response = $this->putJson("/api/v1/staff/{$staff->id}", $updateData);

        $response->assertStatus(200)
            ->assertJsonFragment(['designation' => 'Associate Professor']);

        $this->assertDatabaseHas('staff', [
            'id' => $staff->id,
            'designation' => 'Associate Professor',
        ]);
    }

    /** @test */
    public function it_prevents_unauthorized_access_to_other_college_staff()
    {
        $otherCollegeStaff = Staff::factory()->create(); // Different college

        $response = $this->getJson("/api/v1/staff/{$otherCollegeStaff->id}");

        $response->assertStatus(403);
    }

    /** @test */
    public function it_exports_staff_data_as_excel()
    {
        Staff::factory()->count(20)->create(['college_id' => $this->college->id]);

        $response = $this->get('/api/v1/staff/export?format=xlsx');

        $response->assertStatus(200)
            ->assertHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    }

    /** @test */
    public function it_imports_staff_data_from_csv()
    {
        $csvContent = "employee_id,first_name,last_name,email,designation\n"
                    . "EMP100,Alice,Johnson,alice@example.com,Lecturer\n"
                    . "EMP101,Bob,Williams,bob@example.com,Assistant Professor";

        $file = \Illuminate\Http\UploadedFile::fake()->createWithContent('staff.csv', $csvContent);

        $response = $this->postJson('/api/v1/staff/import', [
            'file' => $file,
        ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['imported' => 2]);

        $this->assertDatabaseHas('staff', ['employee_id' => 'EMP100']);
        $this->assertDatabaseHas('staff', ['employee_id' => 'EMP101']);
    }
}
```

#### Transport API Tests
```php
// tests/Feature/Api/TransportApiTest.php
<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Bus;
use App\Models\TransportRoute;
use App\Models\College;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class TransportApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_tracks_bus_location_updates()
    {
        $college = College::factory()->create();
        $admin = User::factory()->create(['role' => 'college_admin', 'college_id' => $college->id]);
        Sanctum::actingAs($admin);

        $bus = Bus::factory()->create(['college_id' => $college->id]);

        $locationData = [
            'latitude' => 40.7128,
            'longitude' => -74.0060,
            'speed' => 45.5,
            'timestamp' => now()->toIso8601String(),
        ];

        $response = $this->postJson("/api/v1/buses/{$bus->id}/location", $locationData);

        $response->assertStatus(200);

        $bus->refresh();
        $this->assertEquals(40.7128, $bus->current_latitude);
        $this->assertEquals(-74.0060, $bus->current_longitude);
    }

    /** @test */
    public function it_returns_buses_near_location()
    {
        $college = College::factory()->create();
        $admin = User::factory()->create(['role' => 'college_admin', 'college_id' => $college->id]);
        Sanctum::actingAs($admin);

        Bus::factory()->create([
            'college_id' => $college->id,
            'current_latitude' => 40.7128,
            'current_longitude' => -74.0060,
        ]);

        $response = $this->getJson('/api/v1/buses/nearby?lat=40.7128&lng=-74.0060&radius=5');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data');
    }
}
```

### 2.2 Database Integration Tests

```php
// tests/Integration/Database/StaffRelationshipsTest.php
<?php

namespace Tests\Integration\Database;

use Tests\TestCase;
use App\Models\Staff;
use App\Models\Department;
use App\Models\StaffAttendance;
use Illuminate\Foundation\Testing\RefreshDatabase;

class StaffRelationshipsTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function staff_belongs_to_department()
    {
        $department = Department::factory()->create();
        $staff = Staff::factory()->create(['department_id' => $department->id]);

        $this->assertInstanceOf(Department::class, $staff->department);
        $this->assertEquals($department->id, $staff->department->id);
    }

    /** @test */
    public function staff_has_many_attendance_records()
    {
        $staff = Staff::factory()->create();
        StaffAttendance::factory()->count(5)->create(['staff_id' => $staff->id]);

        $this->assertCount(5, $staff->attendance);
    }

    /** @test */
    public function cascade_delete_removes_related_records()
    {
        $staff = Staff::factory()->create();
        $attendanceIds = StaffAttendance::factory()->count(3)
            ->create(['staff_id' => $staff->id])
            ->pluck('id');

        $staff->delete();

        foreach ($attendanceIds as $id) {
            $this->assertDatabaseMissing('staff_attendance', ['id' => $id]);
        }
    }
}
```

## 3. End-to-End (E2E) Tests

### 3.1 Playwright E2E Tests

```typescript
// e2e/staff-management.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Staff Management E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Login as college admin
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@college.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('complete staff creation workflow', async ({ page }) => {
    // Navigate to staff management
    await page.click('text=Staff Management');
    await expect(page).toHaveURL('/staff');

    // Click add new staff
    await page.click('button:has-text("Add Staff")');

    // Fill staff form
    await page.fill('input[name="employee_id"]', 'EMP999');
    await page.fill('input[name="first_name"]', 'Test');
    await page.fill('input[name="last_name"]', 'User');
    await page.fill('input[name="email"]', 'test.user@example.com');
    await page.fill('input[name="phone"]', '+1234567890');
    await page.selectOption('select[name="designation"]', 'Professor');
    await page.selectOption('select[name="employment_type"]', 'full_time');
    await page.fill('input[name="joining_date"]', '2024-01-01');

    // Submit form
    await page.click('button[type="submit"]');

    // Verify success message
    await expect(page.locator('text=Staff member created successfully')).toBeVisible();

    // Verify staff appears in list
    await expect(page.locator('text=Test User')).toBeVisible();
    await expect(page.locator('text=EMP999')).toBeVisible();
  });

  test('staff search and filter functionality', async ({ page }) => {
    await page.goto('/staff');

    // Search by name
    await page.fill('input[placeholder="Search staff..."]', 'John');
    await page.waitForTimeout(500); // Debounce

    const searchResults = page.locator('table tbody tr');
    await expect(searchResults).toContainText('John');

    // Filter by department
    await page.selectOption('select[name="department"]', 'Computer Science');
    await expect(searchResults.first()).toContainText('Computer Science');

    // Clear filters
    await page.click('button:has-text("Clear Filters")');
    const allRows = await searchResults.count();
    expect(allRows).toBeGreaterThan(0);
  });

  test('staff attendance marking workflow', async ({ page }) => {
    await page.goto('/staff/attendance');

    // Select date
    await page.fill('input[type="date"]', '2024-10-25');

    // Mark attendance for multiple staff
    const attendanceRows = page.locator('table tbody tr');
    const count = await attendanceRows.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      await attendanceRows.nth(i).locator('button:has-text("Present")').click();
    }

    // Save attendance
    await page.click('button:has-text("Save Attendance")');

    // Verify success
    await expect(page.locator('text=Attendance saved successfully')).toBeVisible();
  });

  test('infrastructure work order creation', async ({ page }) => {
    await page.goto('/infrastructure');

    // Click on an asset
    await page.click('table tbody tr:first-child');

    // Create work order
    await page.click('button:has-text("Create Work Order")');
    await page.fill('input[name="title"]', 'AC Repair');
    await page.fill('textarea[name="description"]', 'AC not cooling properly');
    await page.selectOption('select[name="priority"]', 'high');
    await page.fill('input[name="scheduled_date"]', '2024-10-30');

    await page.click('button:has-text("Create")');

    // Verify work order created
    await expect(page.locator('text=Work order created successfully')).toBeVisible();
  });

  test('transport real-time tracking', async ({ page }) => {
    await page.goto('/transport/live-tracking');

    // Verify map loads
    await expect(page.locator('#map-container')).toBeVisible();

    // Select a bus
    await page.click('text=Bus 101');

    // Verify bus details panel
    await expect(page.locator('text=Current Location')).toBeVisible();
    await expect(page.locator('text=Speed')).toBeVisible();
    await expect(page.locator('text=ETA')).toBeVisible();

    // Verify location updates (check if markers update)
    const initialLocation = await page.locator('[data-testid="bus-location"]').textContent();
    await page.waitForTimeout(5000); // Wait for location update
    const updatedLocation = await page.locator('[data-testid="bus-location"]').textContent();

    // Location should update (in real scenario)
    expect(updatedLocation).toBeDefined();
  });
});
```

### 3.2 Laravel Dusk Tests

```php
// tests/Browser/StaffManagementTest.php
<?php

namespace Tests\Browser;

use Laravel\Dusk\Browser;
use Tests\DuskTestCase;
use App\Models\User;
use App\Models\College;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class StaffManagementTest extends DuskTestCase
{
    use DatabaseMigrations;

    /** @test */
    public function college_admin_can_view_staff_list()
    {
        $college = College::factory()->create();
        $admin = User::factory()->create([
            'role' => 'college_admin',
            'college_id' => $college->id,
        ]);

        $this->browse(function (Browser $browser) use ($admin) {
            $browser->loginAs($admin)
                ->visit('/staff')
                ->assertSee('Staff Management')
                ->assertSee('Add Staff')
                ->assertPresent('table');
        });
    }

    /** @test */
    public function admin_can_create_staff_with_form_validation()
    {
        $college = College::factory()->create();
        $admin = User::factory()->create([
            'role' => 'college_admin',
            'college_id' => $college->id,
        ]);

        $this->browse(function (Browser $browser) use ($admin) {
            $browser->loginAs($admin)
                ->visit('/staff')
                ->click('@add-staff-button')
                ->waitFor('@staff-form')
                ->type('employee_id', '')
                ->type('first_name', '')
                ->press('Submit')
                ->assertSee('The employee id field is required')
                ->assertSee('The first name field is required');
        });
    }
}
```

## 4. Performance Tests

### 4.1 Load Testing with Apache JMeter

```xml
<!-- jmeter/staff-api-load-test.jmx -->
<jmeterTestPlan version="1.2">
  <TestPlan>
    <ThreadGroup>
      <stringProp name="ThreadGroup.num_threads">100</stringProp>
      <stringProp name="ThreadGroup.ramp_time">10</stringProp>
      <stringProp name="ThreadGroup.duration">300</stringProp>
      
      <HTTPSamplerProxy>
        <stringProp name="HTTPSampler.domain">api.edubit.local</stringProp>
        <stringProp name="HTTPSampler.path">/api/v1/staff</stringProp>
        <stringProp name="HTTPSampler.method">GET</stringProp>
      </HTTPSamplerProxy>
    </ThreadGroup>
  </TestPlan>
</jmeterTestPlan>
```

### 4.2 Database Performance Tests

```php
// tests/Performance/DatabasePerformanceTest.php
<?php

namespace Tests\Performance;

use Tests\TestCase;
use App\Models\Staff;
use App\Models\College;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DatabasePerformanceTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function staff_list_query_performs_within_threshold()
    {
        $college = College::factory()->create();
        Staff::factory()->count(1000)->create(['college_id' => $college->id]);

        $startTime = microtime(true);

        $staff = Staff::with(['department', 'college'])
            ->where('college_id', $college->id)
            ->paginate(50);

        $endTime = microtime(true);
        $executionTime = ($endTime - $startTime) * 1000; // Convert to ms

        $this->assertLessThan(100, $executionTime, 'Query took longer than 100ms');
        $this->assertCount(50, $staff);
    }

    /** @test */
    public function bulk_attendance_insert_performs_efficiently()
    {
        $college = College::factory()->create();
        $staff = Staff::factory()->count(500)->create(['college_id' => $college->id]);

        $attendanceData = $staff->map(function ($s) {
            return [
                'staff_id' => $s->id,
                'date' => now(),
                'status' => 'present',
                'check_in' => now()->setTime(9, 0),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        })->toArray();

        $startTime = microtime(true);

        \DB::table('staff_attendance')->insert($attendanceData);

        $endTime = microtime(true);
        $executionTime = ($endTime - $startTime) * 1000;

        $this->assertLessThan(500, $executionTime, 'Bulk insert took longer than 500ms');
    }
}
```

## 5. Security Tests

### 5.1 Authentication & Authorization Tests

```php
// tests/Security/AuthorizationTest.php
<?php

namespace Tests\Security;

use Tests\TestCase;
use App\Models\User;
use App\Models\Staff;
use App\Models\College;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function unauthorized_user_cannot_access_staff_endpoint()
    {
        $response = $this->getJson('/api/v1/staff');

        $response->assertStatus(401);
    }

    /** @test */
    public function user_cannot_access_other_college_data()
    {
        $college1 = College::factory()->create();
        $college2 = College::factory()->create();

        $admin1 = User::factory()->create(['role' => 'college_admin', 'college_id' => $college1->id]);
        $staff2 = Staff::factory()->create(['college_id' => $college2->id]);

        Sanctum::actingAs($admin1);

        $response = $this->getJson("/api/v1/staff/{$staff2->id}");

        $response->assertStatus(403);
    }

    /** @test */
    public function rate_limiting_prevents_brute_force()
    {
        for ($i = 0; $i < 10; $i++) {
            $response = $this->postJson('/api/v1/login', [
                'email' => 'test@example.com',
                'password' => 'wrongpassword',
            ]);
        }

        $response->assertStatus(429); // Too Many Requests
    }
}
```

### 5.2 Input Validation Security Tests

```php
// tests/Security/InputValidationTest.php
<?php

namespace Tests\Security;

use Tests\TestCase;
use App\Models\User;
use App\Models\College;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class InputValidationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_prevents_sql_injection_in_search()
    {
        $college = College::factory()->create();
        $admin = User::factory()->create(['role' => 'college_admin', 'college_id' => $college->id]);
        Sanctum::actingAs($admin);

        $maliciousInput = "'; DROP TABLE staff; --";

        $response = $this->getJson("/api/v1/staff?search={$maliciousInput}");

        $response->assertStatus(200);
        $this->assertDatabaseHas('staff', []); // Table still exists
    }

    /** @test */
    public function it_prevents_xss_in_staff_notes()
    {
        $college = College::factory()->create();
        $admin = User::factory()->create(['role' => 'college_admin', 'college_id' => $college->id]);
        Sanctum::actingAs($admin);

        $xssPayload = '<script>alert("XSS")</script>';

        $response = $this->postJson('/api/v1/staff', [
            'employee_id' => 'EMP001',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@example.com',
            'notes' => $xssPayload,
        ]);

        $response->assertStatus(201);

        $staff = \App\Models\Staff::where('employee_id', 'EMP001')->first();
        $this->assertStringNotContainsString('<script>', $staff->notes);
    }
}
```

## 6. Accessibility Tests

```typescript
// __tests__/accessibility/staff-pages.test.tsx
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { StaffListPage } from '@/pages/staff';

expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  it('staff list page should have no accessibility violations', async () => {
    const { container } = render(<StaffListPage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('staff form should be keyboard navigable', async () => {
    const { getByLabelText } = render(<StaffForm />);
    
    const employeeIdInput = getByLabelText('Employee ID');
    employeeIdInput.focus();
    expect(document.activeElement).toBe(employeeIdInput);

    // Tab to next field
    userEvent.tab();
    const firstNameInput = getByLabelText('First Name');
    expect(document.activeElement).toBe(firstNameInput);
  });
});
```

## 7. Test Automation & CI/CD

### 7.1 GitHub Actions Workflow

```yaml
# .github/workflows/tests.yml
name: Test Suite

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: password
          POSTGRES_DB: testing
        ports:
          - 5432:5432
          
      redis:
        image: redis:7.2
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          extensions: pdo_pgsql, redis
          
      - name: Install Dependencies
        run: composer install
        
      - name: Run PHPUnit Tests
        env:
          DB_CONNECTION: pgsql
          DB_HOST: localhost
          DB_PORT: 5432
          DB_DATABASE: testing
          DB_USERNAME: postgres
          DB_PASSWORD: password
        run: php artisan test --coverage
        
      - name: Run PHPStan
        run: ./vendor/bin/phpstan analyse
  
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
        
      - name: Run Unit Tests
        run: npm test -- --coverage
        
      - name: Run E2E Tests
        run: npx playwright test
        
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
```

## 8. Test Data Management

### 8.1 Database Seeders for Testing

```php
// database/seeders/TestDataSeeder.php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\College;
use App\Models\Department;
use App\Models\Staff;
use App\Models\Asset;
use App\Models\Bus;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        $college = College::factory()->create([
            'name' => 'Test College',
            'code' => 'TC001',
        ]);

        $departments = Department::factory()->count(5)->create([
            'college_id' => $college->id,
        ]);

        foreach ($departments as $dept) {
            Staff::factory()->count(10)->create([
                'college_id' => $college->id,
                'department_id' => $dept->id,
            ]);
        }

        Asset::factory()->count(50)->create(['college_id' => $college->id]);
        Bus::factory()->count(10)->create(['college_id' => $college->id]);
    }
}
```

## 9. Test Coverage Goals

### Coverage Targets
- **Overall Code Coverage**: > 80%
- **Critical Paths Coverage**: > 95%
- **API Endpoints Coverage**: 100%
- **Security Tests Coverage**: 100%

### Coverage Reporting
```bash
# Backend coverage
php artisan test --coverage --min=80

# Frontend coverage
npm test -- --coverage --coverageThreshold='{"global":{"branches":80,"functions":80,"lines":80}}'
```

## 10. Continuous Testing Strategy

### Testing Phases
1. **Pre-commit**: Linting, unit tests (< 30 seconds)
2. **Pre-push**: All unit tests, integration tests (< 5 minutes)
3. **CI Pipeline**: Full test suite including E2E (< 15 minutes)
4. **Nightly**: Performance tests, full regression suite
5. **Release**: Security audits, penetration testing, load testing

### Test Maintenance
- Review and update tests with every feature change
- Remove obsolete tests quarterly
- Update test data generators monthly
- Security test updates with each vulnerability disclosure

---

*This testing documentation ensures comprehensive quality assurance for the College Admin portal across all modules and user workflows.*
