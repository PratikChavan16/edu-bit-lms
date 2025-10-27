# Super Non-Teaching Manager Portal - Testing Guide

**Testing Framework**: PHPUnit 10.5, Pest 2.x (optional)  
**E2E Testing**: Playwright  
**Load Testing**: K6  
**Coverage Target**: 85%+

---

## Testing Pyramid

```
           ╱▔▔▔▔▔▔▔▔▔▔╲
          ╱  E2E (10%)  ╲        ~50 tests
         ╱▔▔▔▔▔▔▔▔▔▔▔▔▔▔╲
        ╱ Integration(30%) ╲      ~150 tests
       ╱▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔╲
      ╱    Unit (60%)       ╲     ~300 tests
     ╱▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔╲
```

**Total Test Suite**: ~500 tests  
**Execution Time**: <5 minutes

---

## 1. Unit Tests (300 tests)

### Model Tests

#### EmployeeTest (15 tests)

```php
<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Employee;
use App\Models\College;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EmployeeTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_generates_employee_code_on_creation()
    {
        $employee = Employee::factory()->create();

        $this->assertMatchesRegularExpression('/^EMP-\d{5}$/', $employee->employee_code);
    }

    /** @test */
    public function it_returns_full_name_attribute()
    {
        $employee = Employee::factory()->create([
            'first_name' => 'John',
            'last_name' => 'Doe',
        ]);

        $this->assertEquals('John Doe', $employee->full_name);
    }

    /** @test */
    public function it_calculates_years_of_service()
    {
        $employee = Employee::factory()->create([
            'date_of_joining' => now()->subYears(3)->subMonths(6),
        ]);

        $this->assertEquals(3.5, $employee->years_of_service);
    }

    /** @test */
    public function it_determines_probation_status()
    {
        $probationEmployee = Employee::factory()->create([
            'probation_end_date' => now()->addMonths(2),
        ]);

        $permanentEmployee = Employee::factory()->create([
            'probation_end_date' => now()->subMonths(1),
        ]);

        $this->assertEquals('active', $probationEmployee->probation_status);
        $this->assertEquals('completed', $permanentEmployee->probation_status);
    }

    /** @test */
    public function it_belongs_to_college()
    {
        $employee = Employee::factory()->create();

        $this->assertInstanceOf(College::class, $employee->college);
    }

    /** @test */
    public function it_has_reporting_manager_relationship()
    {
        $manager = Employee::factory()->create();
        $employee = Employee::factory()->create(['reporting_to' => $manager->id]);

        $this->assertEquals($manager->id, $employee->reportingManager->id);
    }

    /** @test */
    public function it_has_subordinates_relationship()
    {
        $manager = Employee::factory()->create();
        $subordinate1 = Employee::factory()->create(['reporting_to' => $manager->id]);
        $subordinate2 = Employee::factory()->create(['reporting_to' => $manager->id]);

        $this->assertCount(2, $manager->subordinates);
    }

    /** @test */
    public function it_filters_active_employees()
    {
        Employee::factory()->count(5)->create(['status' => 'active']);
        Employee::factory()->count(3)->create(['status' => 'resigned']);

        $activeCount = Employee::active()->count();

        $this->assertEquals(5, $activeCount);
    }

    /** @test */
    public function it_filters_by_college()
    {
        $college1 = College::factory()->create();
        $college2 = College::factory()->create();

        Employee::factory()->count(4)->create(['college_id' => $college1->id]);
        Employee::factory()->count(2)->create(['college_id' => $college2->id]);

        $this->assertEquals(4, Employee::byCollege($college1->id)->count());
    }

    /** @test */
    public function it_encrypts_salary()
    {
        $employee = Employee::factory()->create(['salary' => 50000]);

        $this->assertNotEquals(50000, $employee->getRawOriginal('salary'));
        $this->assertEquals(50000, $employee->salary);
    }

    /** @test */
    public function it_creates_transfer_request()
    {
        $employee = Employee::factory()->create();
        $toCollege = College::factory()->create();

        $employee->transfer($toCollege->id, 'Family relocation', now()->addMonth());

        $this->assertDatabaseHas('transfers', [
            'employee_id' => $employee->id,
            'to_college_id' => $toCollege->id,
            'status' => 'pending',
        ]);
    }

    /** @test */
    public function it_promotes_employee()
    {
        $employee = Employee::factory()->create([
            'designation' => 'Clerk',
            'salary' => 30000,
        ]);

        $employee->promote('Senior Clerk', 40000, now());

        $this->assertEquals('Senior Clerk', $employee->fresh()->designation);
        $this->assertEquals(40000, $employee->fresh()->salary);
    }

    /** @test */
    public function it_creates_separation_record()
    {
        $employee = Employee::factory()->create(['status' => 'active']);

        $employee->separate('resignation', now()->addMonth(), 'Personal reasons');

        $this->assertDatabaseHas('separations', [
            'employee_id' => $employee->id,
            'separation_type' => 'resignation',
        ]);
        $this->assertEquals('resigned', $employee->fresh()->status);
    }

    /** @test */
    public function it_validates_email_format()
    {
        $this->expectException(\Exception::class);

        Employee::factory()->create(['email' => 'invalid-email']);
    }

    /** @test */
    public function it_requires_positive_salary()
    {
        $this->expectException(\Exception::class);

        Employee::factory()->create(['salary' => -5000]);
    }
}
```

#### AttendanceTest (12 tests)

```php
<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AttendanceTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_calculates_work_hours()
    {
        $attendance = Attendance::factory()->create([
            'punch_in' => now()->setTime(9, 0),
            'punch_out' => now()->setTime(18, 0),
        ]);

        $attendance->calculateWorkHours();

        $this->assertEquals(9.0, $attendance->work_hours);
    }

    /** @test */
    public function it_calculates_late_minutes()
    {
        $attendance = Attendance::factory()->create([
            'attendance_date' => now(),
            'punch_in' => now()->setTime(9, 30), // 30 min late
        ]);

        $attendance->calculateLateMark();

        $this->assertEquals(30, $attendance->late_minutes);
        $this->assertEquals('late', $attendance->status);
    }

    /** @test */
    public function it_marks_present_if_late_within_15_minutes()
    {
        $attendance = Attendance::factory()->create([
            'attendance_date' => now(),
            'punch_in' => now()->setTime(9, 10), // 10 min late
        ]);

        $attendance->calculateLateMark();

        $this->assertEquals(10, $attendance->late_minutes);
        $this->assertEquals('present', $attendance->status);
    }

    /** @test */
    public function it_calculates_overtime_hours()
    {
        $attendance = Attendance::factory()->create([
            'punch_in' => now()->setTime(9, 0),
            'punch_out' => now()->setTime(20, 0), // 11 hours
        ]);

        $attendance->calculateWorkHours();
        $attendance->calculateOvertime();

        $this->assertEquals(2.0, $attendance->overtime_hours); // 11 - 9 = 2
    }

    /** @test */
    public function it_prevents_duplicate_attendance_for_same_date()
    {
        $employee = Employee::factory()->create();
        
        Attendance::factory()->create([
            'employee_id' => $employee->id,
            'attendance_date' => today(),
        ]);

        $this->expectException(\Exception::class);

        Attendance::factory()->create([
            'employee_id' => $employee->id,
            'attendance_date' => today(),
        ]);
    }

    /** @test */
    public function it_validates_punch_out_after_punch_in()
    {
        $this->expectException(\Exception::class);

        Attendance::factory()->create([
            'punch_in' => now()->setTime(18, 0),
            'punch_out' => now()->setTime(9, 0), // Invalid: out before in
        ]);
    }

    /** @test */
    public function it_prevents_future_dated_attendance()
    {
        $this->expectException(\Exception::class);

        Attendance::factory()->create([
            'attendance_date' => now()->addDay(),
        ]);
    }

    /** @test */
    public function it_stores_biometric_device_id()
    {
        $attendance = Attendance::factory()->create([
            'device_id' => 'DEVICE-001',
        ]);

        $this->assertEquals('DEVICE-001', $attendance->device_id);
    }

    /** @test */
    public function it_regularizes_attendance()
    {
        $attendance = Attendance::factory()->create([
            'status' => 'absent',
            'regularized' => false,
        ]);

        $attendance->update([
            'regularized' => true,
            'regularization_reason' => 'Forgot to punch',
            'status' => 'present',
        ]);

        $this->assertTrue($attendance->fresh()->regularized);
        $this->assertEquals('present', $attendance->fresh()->status);
    }

    // Additional 3 tests...
}
```

#### LeaveApplicationTest (10 tests)

```php
<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\LeaveApplication;
use App\Models\Employee;
use App\Models\LeaveBalance;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LeaveApplicationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_auto_calculates_number_of_days()
    {
        $leave = new LeaveApplication([
            'from_date' => '2024-02-01',
            'to_date' => '2024-02-05',
        ]);

        $leave->save();

        $this->assertEquals(5, $leave->number_of_days);
    }

    /** @test */
    public function it_validates_to_date_after_from_date()
    {
        $this->expectException(\Exception::class);

        LeaveApplication::factory()->create([
            'from_date' => '2024-02-10',
            'to_date' => '2024-02-05', // Invalid
        ]);
    }

    /** @test */
    public function it_requires_positive_number_of_days()
    {
        $this->expectException(\Exception::class);

        LeaveApplication::factory()->create([
            'number_of_days' => -2,
        ]);
    }

    /** @test */
    public function it_approves_leave_application()
    {
        $leave = LeaveApplication::factory()->create(['status' => 'pending']);
        $approver = Employee::factory()->create();

        $leave->approve($approver->id);

        $this->assertEquals('approved', $leave->fresh()->status);
        $this->assertEquals($approver->id, $leave->fresh()->approved_by);
        $this->assertNotNull($leave->fresh()->approved_at);
    }

    /** @test */
    public function it_deducts_leave_balance_on_approval()
    {
        $employee = Employee::factory()->create();
        
        LeaveBalance::factory()->create([
            'employee_id' => $employee->id,
            'financial_year' => now()->year,
            'casual_leave' => 12,
        ]);

        $leave = LeaveApplication::factory()->create([
            'employee_id' => $employee->id,
            'leave_type' => 'casual',
            'number_of_days' => 3,
            'status' => 'pending',
        ]);

        $approver = Employee::factory()->create();
        $leave->approve($approver->id);

        $balance = LeaveBalance::where('employee_id', $employee->id)->first();
        $this->assertEquals(9, $balance->casual_leave); // 12 - 3
    }

    /** @test */
    public function it_rejects_leave_application()
    {
        $leave = LeaveApplication::factory()->create(['status' => 'pending']);

        $leave->reject('Staffing shortage');

        $this->assertEquals('rejected', $leave->fresh()->status);
        $this->assertEquals('Staffing shortage', $leave->fresh()->rejection_reason);
    }

    // Additional 4 tests...
}
```

### Service Tests (60 tests)

#### EmployeeServiceTest (10 tests)

```php
<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\EmployeeService;
use App\Models\Employee;
use App\Models\LeaveBalance;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EmployeeServiceTest extends TestCase
{
    use RefreshDatabase;

    private EmployeeService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(EmployeeService::class);
    }

    /** @test */
    public function it_onboards_new_employee()
    {
        $data = [
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john@college.edu',
            'phone' => '+919876543210',
            'college_id' => College::factory()->create()->id,
            'designation' => 'Clerk',
            'department' => 'Admin',
            'date_of_joining' => now(),
            'date_of_birth' => now()->subYears(30),
            'salary' => 30000,
        ];

        $employee = $this->service->onboard($data);

        $this->assertDatabaseHas('employees', ['email' => 'john@college.edu']);
        
        // Check leave balance created
        $this->assertDatabaseHas('leave_balances', [
            'employee_id' => $employee->id,
            'casual_leave' => 12,
            'sick_leave' => 10,
            'earned_leave' => 20,
        ]);
    }

    /** @test */
    public function it_transfers_employee()
    {
        $employee = Employee::factory()->create();
        $toCollege = College::factory()->create();

        $transfer = $this->service->transfer(
            $employee,
            $toCollege->id,
            'Family relocation',
            now()->addMonth()
        );

        $this->assertDatabaseHas('transfers', [
            'employee_id' => $employee->id,
            'to_college_id' => $toCollege->id,
        ]);
    }

    /** @test */
    public function it_promotes_employee()
    {
        $employee = Employee::factory()->create([
            'designation' => 'Junior Clerk',
            'salary' => 25000,
        ]);

        $this->service->promote($employee, 'Senior Clerk', 35000, now());

        $this->assertEquals('Senior Clerk', $employee->fresh()->designation);
        $this->assertEquals(35000, $employee->fresh()->salary);
    }

    /** @test */
    public function it_processes_employee_separation()
    {
        $employee = Employee::factory()->create(['status' => 'active']);

        $separation = $this->service->separate(
            $employee,
            'resignation',
            now()->addMonth(),
            'Higher studies'
        );

        $this->assertDatabaseHas('separations', [
            'employee_id' => $employee->id,
            'separation_type' => 'resignation',
        ]);

        $this->assertEquals('resigned', $employee->fresh()->status);
    }

    // Additional 6 tests...
}
```

#### AttendanceServiceTest (12 tests)

```php
<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\AttendanceService;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\College;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AttendanceServiceTest extends TestCase
{
    use RefreshDatabase;

    private AttendanceService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(AttendanceService::class);
    }

    /** @test */
    public function it_records_punch_in()
    {
        $employee = Employee::factory()->create();

        $attendance = $this->service->recordPunch(
            $employee->id,
            'in',
            'DEVICE-001'
        );

        $this->assertNotNull($attendance->punch_in);
        $this->assertEquals('DEVICE-001', $attendance->device_id);
    }

    /** @test */
    public function it_records_punch_out()
    {
        $employee = Employee::factory()->create();

        // Punch in first
        $attendance = $this->service->recordPunch($employee->id, 'in');

        // Then punch out
        $attendance = $this->service->recordPunch($employee->id, 'out');

        $this->assertNotNull($attendance->punch_out);
        $this->assertGreaterThan(0, $attendance->work_hours);
    }

    /** @test */
    public function it_calculates_late_mark_on_punch_in()
    {
        $employee = Employee::factory()->create();

        // Simulate late punch at 9:30 AM
        $this->travel(today()->setTime(9, 30));

        $attendance = $this->service->recordPunch($employee->id, 'in');

        $this->assertEquals('late', $attendance->status);
        $this->assertGreaterThan(15, $attendance->late_minutes);
    }

    /** @test */
    public function it_generates_muster_roll()
    {
        $college = College::factory()->create();
        $employees = Employee::factory()->count(5)->create(['college_id' => $college->id]);

        foreach ($employees as $employee) {
            Attendance::factory()->create([
                'employee_id' => $employee->id,
                'attendance_date' => today(),
                'status' => 'present',
            ]);
        }

        $musterRoll = $this->service->generateMusterRoll($college->id, today());

        $this->assertArrayHasKey('present', $musterRoll);
        $this->assertCount(5, $musterRoll['present']);
    }

    /** @test */
    public function it_regularizes_attendance()
    {
        $attendance = Attendance::factory()->create([
            'status' => 'absent',
            'regularized' => false,
        ]);

        $approver = Employee::factory()->create();

        $regularized = $this->service->regularizeAttendance(
            $attendance->id,
            'Forgot to punch',
            $approver->id
        );

        $this->assertTrue($regularized->regularized);
        $this->assertEquals('present', $regularized->status);
    }

    /** @test */
    public function it_processes_bulk_biometric_data()
    {
        $employees = Employee::factory()->count(3)->create();

        $biometricData = $employees->map(fn($emp) => [
            'employee_id' => $emp->id,
            'punch_type' => 'in',
            'device_id' => 'DEVICE-001',
        ])->toArray();

        $this->service->processBiometricData($biometricData);

        $this->assertEquals(3, Attendance::whereDate('attendance_date', today())->count());
    }

    // Additional 6 tests...
}
```

#### LeaveServiceTest (10 tests)

```php
<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\LeaveService;
use App\Models\Employee;
use App\Models\LeaveApplication;
use App\Models\LeaveBalance;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LeaveServiceTest extends TestCase
{
    use RefreshDatabase;

    private LeaveService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(LeaveService::class);
    }

    /** @test */
    public function it_checks_leave_balance()
    {
        $employee = Employee::factory()->create();

        LeaveBalance::factory()->create([
            'employee_id' => $employee->id,
            'financial_year' => now()->year,
            'casual_leave' => 8,
        ]);

        $balance = $this->service->checkBalance($employee->id, 'casual');

        $this->assertEquals(8, $balance);
    }

    /** @test */
    public function it_applies_leave_when_balance_sufficient()
    {
        $employee = Employee::factory()->create();

        LeaveBalance::factory()->create([
            'employee_id' => $employee->id,
            'financial_year' => now()->year,
            'casual_leave' => 10,
        ]);

        $leave = $this->service->applyLeave([
            'employee_id' => $employee->id,
            'leave_type' => 'casual',
            'from_date' => now()->addDay(),
            'to_date' => now()->addDays(3),
            'number_of_days' => 3,
            'reason' => 'Personal work',
        ]);

        $this->assertDatabaseHas('leave_applications', [
            'employee_id' => $employee->id,
            'status' => 'pending',
        ]);
    }

    /** @test */
    public function it_throws_exception_when_balance_insufficient()
    {
        $employee = Employee::factory()->create();

        LeaveBalance::factory()->create([
            'employee_id' => $employee->id,
            'financial_year' => now()->year,
            'casual_leave' => 2,
        ]);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Insufficient leave balance');

        $this->service->applyLeave([
            'employee_id' => $employee->id,
            'leave_type' => 'casual',
            'from_date' => now()->addDay(),
            'to_date' => now()->addDays(5),
            'number_of_days' => 5,
            'reason' => 'Personal work',
        ]);
    }

    /** @test */
    public function it_approves_leave_application()
    {
        $leave = LeaveApplication::factory()->create([
            'status' => 'pending',
            'leave_type' => 'casual',
            'number_of_days' => 2,
        ]);

        LeaveBalance::factory()->create([
            'employee_id' => $leave->employee_id,
            'financial_year' => now()->year,
            'casual_leave' => 10,
        ]);

        $approver = Employee::factory()->create();

        $approved = $this->service->approveLeave($leave->id, $approver->id);

        $this->assertEquals('approved', $approved->status);
        
        // Check balance deducted
        $balance = LeaveBalance::where('employee_id', $leave->employee_id)->first();
        $this->assertEquals(8, $balance->casual_leave);
    }

    // Additional 6 tests...
}
```

---

## 2. Integration Tests (150 tests)

### API Integration Tests

#### EmployeeApiTest (20 tests)

```php
<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Employee;
use App\Models\College;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class EmployeeApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_lists_all_employees_for_super_nt_manager()
    {
        $user = User::factory()->superNTManager()->create();
        Sanctum::actingAs($user);

        Employee::factory()->count(10)->create();

        $response = $this->getJson('/api/employees');

        $response->assertOk()
            ->assertJsonCount(10, 'data');
    }

    /** @test */
    public function it_filters_employees_by_college_for_college_hr()
    {
        $college = College::factory()->create();
        $user = User::factory()->collegeHR()->create(['college_id' => $college->id]);
        Sanctum::actingAs($user);

        Employee::factory()->count(5)->create(['college_id' => $college->id]);
        Employee::factory()->count(3)->create(); // Other colleges

        $response = $this->getJson('/api/employees');

        $response->assertOk()
            ->assertJsonCount(5, 'data'); // Only own college
    }

    /** @test */
    public function it_creates_new_employee()
    {
        $user = User::factory()->superNTManager()->create();
        Sanctum::actingAs($user);

        $college = College::factory()->create();

        $data = [
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'email' => 'jane@college.edu',
            'phone' => '+919876543210',
            'college_id' => $college->id,
            'designation' => 'Lab Assistant',
            'department' => 'Science',
            'date_of_joining' => now()->toDateString(),
            'date_of_birth' => now()->subYears(28)->toDateString(),
            'salary' => 28000,
        ];

        $response = $this->postJson('/api/employees', $data);

        $response->assertCreated()
            ->assertJsonPath('data.email', 'jane@college.edu');

        $this->assertDatabaseHas('employees', ['email' => 'jane@college.edu']);
    }

    /** @test */
    public function it_validates_required_fields()
    {
        $user = User::factory()->superNTManager()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/employees', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['first_name', 'last_name', 'email', 'college_id']);
    }

    /** @test */
    public function it_prevents_duplicate_email()
    {
        $user = User::factory()->superNTManager()->create();
        Sanctum::actingAs($user);

        $employee = Employee::factory()->create();

        $data = Employee::factory()->make(['email' => $employee->email])->toArray();

        $response = $this->postJson('/api/employees', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function it_updates_employee_details()
    {
        $user = User::factory()->superNTManager()->create();
        Sanctum::actingAs($user);

        $employee = Employee::factory()->create();

        $response = $this->putJson("/api/employees/{$employee->id}", [
            'phone' => '+919999999999',
            'designation' => 'Senior Clerk',
        ]);

        $response->assertOk();
        $this->assertEquals('+919999999999', $employee->fresh()->phone);
    }

    /** @test */
    public function it_prevents_college_hr_from_updating_other_college_employees()
    {
        $college1 = College::factory()->create();
        $college2 = College::factory()->create();

        $user = User::factory()->collegeHR()->create(['college_id' => $college1->id]);
        Sanctum::actingAs($user);

        $employee = Employee::factory()->create(['college_id' => $college2->id]);

        $response = $this->putJson("/api/employees/{$employee->id}", [
            'phone' => '+919999999999',
        ]);

        $response->assertForbidden();
    }

    /** @test */
    public function it_filters_employees_by_status()
    {
        $user = User::factory()->superNTManager()->create();
        Sanctum::actingAs($user);

        Employee::factory()->count(7)->create(['status' => 'active']);
        Employee::factory()->count(3)->create(['status' => 'resigned']);

        $response = $this->getJson('/api/employees?status=active');

        $response->assertOk()
            ->assertJsonCount(7, 'data');
    }

    /** @test */
    public function it_searches_employees_by_name()
    {
        $user = User::factory()->superNTManager()->create();
        Sanctum::actingAs($user);

        Employee::factory()->create(['first_name' => 'John', 'last_name' => 'Doe']);
        Employee::factory()->create(['first_name' => 'Jane', 'last_name' => 'Smith']);

        $response = $this->getJson('/api/employees?search=John');

        $response->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.first_name', 'John');
    }

    /** @test */
    public function it_requires_authentication()
    {
        $response = $this->getJson('/api/employees');

        $response->assertUnauthorized();
    }

    // Additional 10 tests for transfers, promotions, separations...
}
```

#### AttendanceApiTest (18 tests)

```php
<?php

namespace Tests\Feature\Api;

use Tests\TestCase;
use App\Models\User;
use App\Models\Employee;
use App\Models\Attendance;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AttendanceApiTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_records_punch_in()
    {
        $employee = Employee::factory()->create();
        $user = User::factory()->employee()->create(['employee_id' => $employee->id]);
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/attendance/punch', [
            'punch_type' => 'in',
            'device_id' => 'DEVICE-001',
        ]);

        $response->assertCreated();
        
        $this->assertDatabaseHas('attendance_records', [
            'employee_id' => $employee->id,
            'attendance_date' => today(),
        ]);
    }

    /** @test */
    public function it_records_punch_out()
    {
        $employee = Employee::factory()->create();
        $user = User::factory()->employee()->create(['employee_id' => $employee->id]);
        Sanctum::actingAs($user);

        // Punch in first
        Attendance::factory()->create([
            'employee_id' => $employee->id,
            'attendance_date' => today(),
            'punch_in' => now()->subHours(8),
        ]);

        $response = $this->postJson('/api/attendance/punch', [
            'punch_type' => 'out',
        ]);

        $response->assertOk();
        
        $attendance = Attendance::where('employee_id', $employee->id)->first();
        $this->assertNotNull($attendance->punch_out);
    }

    /** @test */
    public function it_generates_muster_roll()
    {
        $user = User::factory()->superNTManager()->create();
        Sanctum::actingAs($user);

        $college = College::factory()->create();
        $employees = Employee::factory()->count(5)->create(['college_id' => $college->id]);

        foreach ($employees as $employee) {
            Attendance::factory()->create([
                'employee_id' => $employee->id,
                'attendance_date' => today(),
                'status' => 'present',
            ]);
        }

        $response = $this->getJson("/api/attendance/muster-roll?college_id={$college->id}&date=" . today());

        $response->assertOk()
            ->assertJsonStructure(['present', 'absent', 'late']);
    }

    /** @test */
    public function it_requests_regularization()
    {
        $employee = Employee::factory()->create();
        $user = User::factory()->employee()->create(['employee_id' => $employee->id]);
        Sanctum::actingAs($user);

        $attendance = Attendance::factory()->create([
            'employee_id' => $employee->id,
            'attendance_date' => today()->subDay(),
            'status' => 'absent',
        ]);

        $response = $this->postJson('/api/attendance/regularize', [
            'attendance_id' => $attendance->id,
            'reason' => 'Forgot to punch',
        ]);

        $response->assertOk();
    }

    /** @test */
    public function it_prevents_future_date_attendance()
    {
        $employee = Employee::factory()->create();
        $user = User::factory()->superNTManager()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/attendance/mark', [
            'employee_id' => $employee->id,
            'attendance_date' => now()->addDay()->toDateString(),
            'status' => 'present',
        ]);

        $response->assertStatus(422);
    }

    /** @test */
    public function it_rate_limits_punch_requests()
    {
        $employee = Employee::factory()->create();
        $user = User::factory()->employee()->create(['employee_id' => $employee->id]);
        Sanctum::actingAs($user);

        // Make 6 punch requests (rate limit is 5/minute)
        for ($i = 0; $i < 6; $i++) {
            $response = $this->postJson('/api/attendance/punch', [
                'punch_type' => 'in',
            ]);
        }

        $response->assertStatus(429); // Too Many Requests
    }

    // Additional 12 tests...
}
```

---

## 3. E2E Tests (50 tests)

### Playwright Tests

#### Complete Recruitment Workflow (10 tests)

```javascript
// tests/e2e/recruitment.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Recruitment Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'hr@college.edu');
    await page.fill('[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('should create job requisition', async ({ page }) => {
    await page.click('text=Recruitment');
    await page.click('button:has-text("New Job Requisition")');
    
    await page.fill('[name="position_title"]', 'Lab Assistant');
    await page.fill('[name="department"]', 'Science');
    await page.fill('[name="number_of_positions"]', '2');
    await page.fill('[name="job_description"]', 'Assist in lab activities');
    await page.fill('[name="salary_min"]', '25000');
    await page.fill('[name="salary_max"]', '30000');
    
    await page.click('button:has-text("Submit")');
    
    await expect(page.locator('text=Job requisition created')).toBeVisible();
  });

  test('should screen job applications', async ({ page }) => {
    // Navigate to applications
    await page.goto('/recruitment/applications');
    
    // Click on first application
    await page.click('.application-card:first-child');
    
    // Add screening score
    await page.fill('[name="screening_score"]', '85');
    await page.fill('[name="screening_notes"]', 'Good candidate');
    await page.click('button:has-text("Shortlist")');
    
    await expect(page.locator('text=Application shortlisted')).toBeVisible();
  });

  test('should schedule interview', async ({ page }) => {
    await page.goto('/recruitment/applications?status=shortlisted');
    
    await page.click('.application-card:first-child');
    await page.click('button:has-text("Schedule Interview")');
    
    await page.fill('[name="interview_date"]', '2024-03-15');
    await page.fill('[name="interview_time"]', '10:00');
    await page.selectOption('[name="interview_type"]', 'technical');
    
    await page.click('button:has-text("Schedule")');
    
    await expect(page.locator('text=Interview scheduled')).toBeVisible();
  });

  // Additional 7 tests for complete recruitment flow...
});
```

#### Leave Application Workflow (8 tests)

```javascript
// tests/e2e/leave.spec.ts
test.describe('Leave Management', () => {
  test('should apply for leave with sufficient balance', async ({ page }) => {
    await loginAsEmployee(page);
    
    await page.goto('/leave');
    await page.click('button:has-text("Apply Leave")');
    
    await page.selectOption('[name="leave_type"]', 'casual');
    await page.fill('[name="from_date"]', '2024-03-20');
    await page.fill('[name="to_date"]', '2024-03-22');
    await page.fill('[name="reason"]', 'Family function');
    
    // Check balance display
    await expect(page.locator('text=Available: 12 days')).toBeVisible();
    
    await page.click('button:has-text("Submit")');
    
    await expect(page.locator('text=Leave application submitted')).toBeVisible();
  });

  test('should prevent leave application with insufficient balance', async ({ page }) => {
    // Apply for 15 days when only 10 available
    await page.selectOption('[name="leave_type"]', 'casual');
    await page.fill('[name="from_date"]', '2024-03-01');
    await page.fill('[name="to_date"]', '2024-03-15');
    
    await page.click('button:has-text("Submit")');
    
    await expect(page.locator('text=Insufficient leave balance')).toBeVisible();
  });

  test('manager should approve leave', async ({ page }) => {
    await loginAsManager(page);
    
    await page.goto('/leave?status=pending');
    await page.click('.leave-card:first-child');
    
    await page.click('button:has-text("Approve")');
    
    await expect(page.locator('text=Leave approved')).toBeVisible();
  });

  // Additional 5 tests...
});
```

---

## 4. Load Tests (K6)

### Biometric Punch Load Test

```javascript
// tests/load/biometric-punch.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp up to 50 users
    { duration: '3m', target: 50 },  // Stay at 50 users
    { duration: '1m', target: 100 }, // Spike to 100 users
    { duration: '2m', target: 100 }, // Maintain spike
    { duration: '1m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests < 2s
    http_req_failed: ['rate<0.01'],    // Error rate < 1%
  },
};

export default function () {
  const url = 'https://api.college.edu/api/attendance/punch';
  
  const payload = JSON.stringify({
    employee_id: Math.floor(Math.random() * 2000) + 1,
    punch_type: 'in',
    device_id: `DEVICE-${Math.floor(Math.random() * 10) + 1}`,
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${__ENV.API_TOKEN}`,
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 201': (r) => r.status === 201,
    'response time < 2000ms': (r) => r.timings.duration < 2000,
  });

  sleep(1);
}
```

### Muster Roll Generation Load Test

```javascript
// tests/load/muster-roll.js
export const options = {
  vus: 10,
  duration: '5m',
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% < 3s
  },
};

export default function () {
  const collegeId = Math.floor(Math.random() * 15) + 1;
  const date = '2024-02-20';
  
  const res = http.get(
    `https://api.college.edu/api/attendance/muster-roll?college_id=${collegeId}&date=${date}`,
    { headers: { 'Authorization': `Bearer ${__ENV.API_TOKEN}` } }
  );

  check(res, {
    'muster roll generated': (r) => r.status === 200,
    'contains present count': (r) => r.json('present') !== undefined,
  });

  sleep(2);
}
```

---

## 5. Security Tests (20 tests)

### Unauthorized Access Tests

```php
/** @test */
public function it_prevents_unauthorized_salary_access()
{
    $collegeHR = User::factory()->collegeHR()->create();
    Sanctum::actingAs($collegeHR);

    $employee = Employee::factory()->create();

    $response = $this->getJson("/api/employees/{$employee->id}?include=salary");

    $response->assertForbidden();
}

/** @test */
public function it_prevents_cross_college_data_access()
{
    $college1 = College::factory()->create();
    $college2 = College::factory()->create();

    $user = User::factory()->collegeHR()->create(['college_id' => $college1->id]);
    Sanctum::actingAs($user);

    $employee = Employee::factory()->create(['college_id' => $college2->id]);

    $response = $this->getJson("/api/employees/{$employee->id}");

    $response->assertForbidden();
}
```

---

## Test Execution

### Run All Tests
```bash
# Unit + Integration tests
php artisan test

# With coverage
php artisan test --coverage --min=85

# Specific suite
php artisan test --testsuite=Feature

# E2E tests
npx playwright test

# Load tests
k6 run tests/load/biometric-punch.js
```

### CI/CD Pipeline (GitHub Actions)

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
      
      redis:
        image: redis:7.2-alpine
        options: >-
          --health-cmd "redis-cli ping"
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          extensions: pgsql, redis
      
      - name: Install dependencies
        run: composer install --prefer-dist --no-progress
      
      - name: Run tests
        run: php artisan test --coverage --min=85
```

---

*Complete testing guide with 500+ tests covering unit, integration, E2E, load, and security testing for Super Non-Teaching Manager Portal.*
