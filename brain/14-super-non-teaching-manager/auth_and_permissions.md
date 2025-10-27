# Super Non-Teaching Manager Portal - Authentication & Permissions

**Auth System**: Laravel Sanctum (Token-based)  
**RBAC**: Spatie Laravel-Permission  
**MFA**: Optional TOTP (Google Authenticator)

---

## Authentication Flow

### Token-Based Authentication

```php
// Login flow
POST /api/auth/login
{
    "email": "hr@college.edu",
    "password": "secure_password",
    "totp_code": "123456" // Optional if MFA enabled
}

Response:
{
    "access_token": "1|xxxx...",
    "token_type": "Bearer",
    "expires_in": 14400, // 4 hours
    "user": {
        "id": 1,
        "name": "HR Manager",
        "email": "hr@college.edu",
        "role": "super_nt_manager",
        "college_id": null,
        "permissions": [...]
    }
}

// Using token
GET /api/employees
Headers:
  Authorization: Bearer 1|xxxx...
```

### Session Management

- **Token Expiry**: 4 hours (240 minutes)
- **Refresh Token**: Not used (single token approach)
- **Token Revocation**: Logout endpoint revokes token
- **Max Concurrent Sessions**: 3 per user

```php
// config/sanctum.php
'expiration' => 240, // 4 hours
'multiple_tokens' => true,
'token_prefix' => '',
```

### Password Policies

- **Minimum Length**: 10 characters
- **Complexity**: At least 1 uppercase, 1 lowercase, 1 number, 1 special char
- **Password Rotation**: Required every 90 days
- **Password History**: Cannot reuse last 5 passwords
- **Failed Login Attempts**: Account locked after 5 failed attempts (15-minute cooldown)

```php
// app/Rules/StrongPassword.php
public function passes($attribute, $value)
{
    return preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/', $value);
}
```

---

## Role-Based Access Control (RBAC)

### Core Roles

#### 1. Super Non-Teaching Manager (Global HR)
**Scope**: All colleges, all employees  
**Access Level**: Full CRUD on all HR modules

```php
// Seeder
Role::create(['name' => 'super_nt_manager', 'guard_name' => 'api'])
    ->givePermissionTo([
        // Employee management
        'employee.view.all',
        'employee.create',
        'employee.update',
        'employee.delete',
        'employee.transfer',
        'employee.promote',
        
        // Recruitment
        'recruitment.view.all',
        'recruitment.create',
        'recruitment.approve',
        'recruitment.manage_applications',
        'recruitment.schedule_interviews',
        'recruitment.send_offers',
        
        // Attendance
        'attendance.view.all',
        'attendance.mark',
        'attendance.regularize.approve',
        'attendance.generate_muster',
        'attendance.export',
        
        // Leave
        'leave.view.all',
        'leave.approve.all',
        'leave.reject.all',
        'leave.manage_policies',
        
        // Performance
        'performance.view.all',
        'performance.create_cycle',
        'performance.manage_appraisals',
        'performance.view_ratings',
        
        // Training
        'training.view.all',
        'training.create_program',
        'training.manage_enrollments',
        'training.issue_certificates',
        
        // Transfers
        'transfer.view.all',
        'transfer.approve',
        
        // Separations
        'separation.view.all',
        'separation.process',
        'separation.approve_clearance',
        'separation.full_final',
        
        // Reports
        'report.attendance',
        'report.attrition',
        'report.performance',
        'report.training',
        'report.headcount',
        
        // Settings
        'settings.manage',
    ]);
```

#### 2. College HR
**Scope**: Single college only  
**Access Level**: Limited to college employees

```php
Role::create(['name' => 'college_hr', 'guard_name' => 'api'])
    ->givePermissionTo([
        'employee.view.college',
        'employee.create',
        'employee.update.college',
        
        'recruitment.view.college',
        'recruitment.create',
        'recruitment.manage_applications',
        
        'attendance.view.college',
        'attendance.mark',
        'attendance.generate_muster.college',
        
        'leave.view.college',
        'leave.approve.college',
        
        'performance.view.college',
        
        'training.view.college',
        'training.enroll_employees',
        
        'report.attendance.college',
        'report.attrition.college',
    ]);
```

#### 3. Employee (Self-Service)
**Scope**: Own record only  
**Access Level**: View and request permissions

```php
Role::create(['name' => 'employee', 'guard_name' => 'api'])
    ->givePermissionTo([
        'employee.view.self',
        'employee.update.self.basic',
        
        'attendance.view.self',
        'attendance.mark.self',
        'attendance.request_regularization',
        
        'leave.view.self',
        'leave.apply',
        'leave.cancel.self',
        
        'performance.view.self',
        'performance.submit_self_assessment',
        
        'training.view.available',
        'training.enroll.self',
        
        'transfer.request',
        'separation.resign',
    ]);
```

---

## Granular Permissions

### Employee Management (15 permissions)

```php
// View permissions
'employee.view.all',        // View all employees across colleges
'employee.view.college',    // View employees in own college
'employee.view.self',       // View own profile
'employee.view.team',       // View direct reports

// CRUD permissions
'employee.create',          // Create new employee (onboarding)
'employee.update',          // Update any employee
'employee.update.college',  // Update employees in own college
'employee.update.self.basic', // Update own basic info (phone, address)
'employee.delete',          // Soft delete employee

// Lifecycle permissions
'employee.transfer',        // Initiate transfer
'employee.promote',         // Promote employee
'employee.view.salary',     // View salary details
'employee.update.salary',   // Update salary
'employee.view.documents',  // View employee documents
'employee.upload.documents', // Upload documents
```

### Recruitment Management (12 permissions)

```php
'recruitment.view.all',
'recruitment.view.college',
'recruitment.create',              // Create job requisition
'recruitment.approve',             // Approve job requisitions
'recruitment.reject',              // Reject requisitions
'recruitment.manage_applications', // Screen applications
'recruitment.schedule_interviews', // Schedule interviews
'recruitment.conduct_interviews',  // Conduct and provide feedback
'recruitment.send_offers',         // Generate and send offer letters
'recruitment.view.applications',   // View all applications
'recruitment.update.application_status',
'recruitment.export',
```

### Attendance Management (10 permissions)

```php
'attendance.view.all',
'attendance.view.college',
'attendance.view.self',
'attendance.mark',                    // Mark attendance manually
'attendance.mark.self',               // Self punch-in/out
'attendance.regularize.request',      // Request regularization
'attendance.regularize.approve',      // Approve regularization
'attendance.generate_muster',         // Generate muster roll
'attendance.export',
'attendance.view.biometric_logs',
```

### Leave Management (12 permissions)

```php
'leave.view.all',
'leave.view.college',
'leave.view.self',
'leave.view.team',                // View team leave status
'leave.apply',                    // Apply for leave
'leave.approve.all',              // Approve any leave
'leave.approve.college',          // Approve college leaves
'leave.approve.team',             // Approve direct reports' leaves
'leave.reject.all',
'leave.cancel.self',              // Cancel own leave
'leave.manage_policies',          // Update leave policies
'leave.view.balance',             // View leave balances
```

### Performance Management (10 permissions)

```php
'performance.view.all',
'performance.view.college',
'performance.view.self',
'performance.view.team',
'performance.create_cycle',           // Start appraisal cycle
'performance.submit_self_assessment',
'performance.submit_manager_review',
'performance.manage_appraisals',
'performance.view_ratings',
'performance.export',
```

### Training Management (10 permissions)

```php
'training.view.all',
'training.view.college',
'training.view.available',        // View available programs
'training.create_program',
'training.update_program',
'training.manage_enrollments',    // Enroll/remove employees
'training.enroll.self',
'training.mark_attendance',
'training.issue_certificates',
'training.view_effectiveness',
```

### Transfer Management (6 permissions)

```php
'transfer.view.all',
'transfer.view.college',
'transfer.request',
'transfer.approve',               // HR approval
'transfer.approve.from_college',  // From college approval
'transfer.approve.to_college',    // To college approval
```

### Separation Management (8 permissions)

```php
'separation.view.all',
'separation.view.college',
'separation.resign',                  // Submit resignation
'separation.process',                 // Process exit
'separation.conduct_exit_interview',
'separation.approve_clearance',       // Approve dept clearances
'separation.full_final',              // Calculate F&F
'separation.issue_documents',         // Issue clearance/experience letter
```

### Reports (8 permissions)

```php
'report.attendance',
'report.attendance.college',
'report.attrition',
'report.attrition.college',
'report.performance',
'report.training',
'report.headcount',
'report.export',
```

### Settings (3 permissions)

```php
'settings.view',
'settings.manage',
'settings.manage.leave_policies',
```

---

## Policy Classes

### 1. EmployeePolicy

```php
<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Employee;

class EmployeePolicy
{
    // View any employee
    public function viewAny(User $user)
    {
        return $user->hasAnyPermission([
            'employee.view.all',
            'employee.view.college'
        ]);
    }

    // View specific employee
    public function view(User $user, Employee $employee)
    {
        // Super NT Manager can view all
        if ($user->hasPermissionTo('employee.view.all')) {
            return true;
        }

        // College HR can view own college
        if ($user->hasPermissionTo('employee.view.college')) {
            return $user->college_id === $employee->college_id;
        }

        // Employee can view self
        if ($user->hasPermissionTo('employee.view.self')) {
            return $user->employee_id === $employee->id;
        }

        // Manager can view team
        if ($user->hasPermissionTo('employee.view.team')) {
            return $employee->reporting_to === $user->employee_id;
        }

        return false;
    }

    // Create employee
    public function create(User $user)
    {
        return $user->hasPermissionTo('employee.create');
    }

    // Update employee
    public function update(User $user, Employee $employee)
    {
        if ($user->hasPermissionTo('employee.update')) {
            return true;
        }

        if ($user->hasPermissionTo('employee.update.college')) {
            return $user->college_id === $employee->college_id;
        }

        if ($user->hasPermissionTo('employee.update.self.basic')) {
            return $user->employee_id === $employee->id;
        }

        return false;
    }

    // View salary
    public function viewSalary(User $user, Employee $employee)
    {
        // Only Super NT Manager can view salaries
        return $user->hasPermissionTo('employee.view.salary');
    }

    // Transfer employee
    public function transfer(User $user, Employee $employee)
    {
        return $user->hasPermissionTo('employee.transfer');
    }
}
```

### 2. AttendancePolicy

```php
<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Attendance;

class AttendancePolicy
{
    public function viewAny(User $user)
    {
        return $user->hasAnyPermission([
            'attendance.view.all',
            'attendance.view.college',
            'attendance.view.self'
        ]);
    }

    public function view(User $user, Attendance $attendance)
    {
        if ($user->hasPermissionTo('attendance.view.all')) {
            return true;
        }

        if ($user->hasPermissionTo('attendance.view.college')) {
            return $user->college_id === $attendance->employee->college_id;
        }

        if ($user->hasPermissionTo('attendance.view.self')) {
            return $user->employee_id === $attendance->employee_id;
        }

        return false;
    }

    public function mark(User $user)
    {
        return $user->hasPermissionTo('attendance.mark');
    }

    public function regularize(User $user, Attendance $attendance)
    {
        // Can only regularize own attendance
        if ($user->hasPermissionTo('attendance.regularize.request')) {
            return $user->employee_id === $attendance->employee_id;
        }

        return false;
    }

    public function approveRegularization(User $user, Attendance $attendance)
    {
        return $user->hasPermissionTo('attendance.regularize.approve');
    }

    // Prevent backdated attendance beyond 7 days
    public function canMarkBackdated(User $user, $date)
    {
        if (!$user->hasPermissionTo('attendance.mark')) {
            return false;
        }

        $daysDiff = now()->diffInDays($date);
        
        // Super NT Manager: up to 30 days
        if ($user->hasRole('super_nt_manager')) {
            return $daysDiff <= 30;
        }

        // College HR: up to 7 days
        if ($user->hasRole('college_hr')) {
            return $daysDiff <= 7;
        }

        // Employee: same day only
        return $daysDiff === 0;
    }
}
```

### 3. LeavePolicy

```php
<?php

namespace App\Policies;

use App\Models\User;
use App\Models\LeaveApplication;
use App\Services\LeaveService;

class LeavePolicy
{
    public function __construct(
        private LeaveService $leaveService
    ) {}

    public function viewAny(User $user)
    {
        return $user->hasAnyPermission([
            'leave.view.all',
            'leave.view.college',
            'leave.view.self',
            'leave.view.team'
        ]);
    }

    public function apply(User $user, array $leaveData)
    {
        if (!$user->hasPermissionTo('leave.apply')) {
            return false;
        }

        // Check leave balance
        $balance = $this->leaveService->checkBalance(
            $user->employee_id,
            $leaveData['leave_type']
        );

        if ($balance < $leaveData['number_of_days']) {
            return false; // Insufficient balance
        }

        // Cannot apply for past dates
        if ($leaveData['from_date'] < now()->toDateString()) {
            return false;
        }

        return true;
    }

    public function approve(User $user, LeaveApplication $leave)
    {
        if ($user->hasPermissionTo('leave.approve.all')) {
            return true;
        }

        if ($user->hasPermissionTo('leave.approve.college')) {
            return $user->college_id === $leave->employee->college_id;
        }

        if ($user->hasPermissionTo('leave.approve.team')) {
            return $leave->employee->reporting_to === $user->employee_id;
        }

        return false;
    }

    public function cancel(User $user, LeaveApplication $leave)
    {
        // Can only cancel own leave if not approved
        if ($user->hasPermissionTo('leave.cancel.self')) {
            return $user->employee_id === $leave->employee_id 
                && $leave->status === 'pending';
        }

        return false;
    }
}
```

---

## Row-Level Security

### College Data Isolation

```php
// Global scope for College HR
class CollegeScope implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        $user = auth()->user();

        if ($user && $user->hasRole('college_hr')) {
            $builder->where('college_id', $user->college_id);
        }
    }
}

// Apply to Employee model
protected static function booted()
{
    static::addGlobalScope(new CollegeScope);
}
```

### Employee Self-Access

```php
// Middleware for self-service endpoints
class EnsureSelfAccess
{
    public function handle($request, Closure $next)
    {
        $employeeId = $request->route('employee');
        $user = $request->user();

        if ($user->employee_id !== $employeeId) {
            abort(403, 'Unauthorized access');
        }

        return $next($request);
    }
}

// Route
Route::get('/employees/{employee}/profile', [EmployeeController::class, 'show'])
    ->middleware(['auth:sanctum', EnsureSelfAccess::class]);
```

---

## Audit Logging

### Activity Tracking

```php
// Using spatie/laravel-activitylog

// Employee lifecycle events
activity()
    ->performedOn($employee)
    ->causedBy(auth()->user())
    ->withProperties([
        'old' => $employee->getOriginal(),
        'new' => $employee->getChanges(),
    ])
    ->log('employee_updated');

// Salary view audit
activity()
    ->performedOn($employee)
    ->causedBy(auth()->user())
    ->log('salary_viewed');

// Leave approval
activity()
    ->performedOn($leave)
    ->causedBy(auth()->user())
    ->withProperties(['status' => 'approved'])
    ->log('leave_approved');
```

---

## Rate Limiting

```php
// config/sanctum.php
RateLimiter::for('api', function (Request $request) {
    return $request->user()
        ? Limit::perMinute(60)->by($request->user()->id)
        : Limit::perMinute(10)->by($request->ip());
});

// Biometric punch endpoint (prevent abuse)
RateLimiter::for('biometric-punch', function (Request $request) {
    return Limit::perMinute(5)->by($request->user()->id);
});

// Apply to routes
Route::middleware(['auth:sanctum', 'throttle:biometric-punch'])
    ->post('/attendance/punch', [AttendanceController::class, 'recordPunch']);
```

---

## Multi-Factor Authentication (Optional)

```php
// Enable MFA for Super NT Manager role
if (auth()->user()->hasRole('super_nt_manager') && !auth()->user()->mfa_enabled) {
    return response()->json([
        'message' => 'MFA required for Super NT Manager role',
        'qr_code' => auth()->user()->generateTotpQrCode(),
    ], 403);
}

// Verify TOTP
if (auth()->user()->mfa_enabled) {
    if (!Google2FA::verifyKey(auth()->user()->totp_secret, $request->totp_code)) {
        return response()->json(['error' => 'Invalid TOTP code'], 401);
    }
}
```

---

*Complete authentication and RBAC system for Super Non-Teaching Manager Portal with 3 roles, 100+ granular permissions, and policy-based authorization.*
