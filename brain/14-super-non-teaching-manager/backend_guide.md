# Super Non-Teaching Manager Portal - Backend Implementation Guide

**Framework**: Laravel 11.x  
**Database**: PostgreSQL 16  
**Cache**: Redis 7.2  
**Queue**: Redis Queue

---

## Architecture Overview

### Service-Oriented Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Routes)                      │
├─────────────────────────────────────────────────────────────┤
│                   Controllers (HTTP)                         │
├─────────────────────────────────────────────────────────────┤
│              Services (Business Logic)                       │
│  EmployeeService | RecruitmentService | AttendanceService   │
│  LeaveService | PerformanceService | TrainingService        │
├─────────────────────────────────────────────────────────────┤
│                   Repositories (Data)                        │
├─────────────────────────────────────────────────────────────┤
│                 Models (Eloquent ORM)                        │
├─────────────────────────────────────────────────────────────┤
│              Database (PostgreSQL 16)                        │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── EmployeeController.php
│   │   ├── RecruitmentController.php
│   │   ├── AttendanceController.php
│   │   ├── LeaveController.php
│   │   ├── PerformanceController.php
│   │   ├── TrainingController.php
│   │   ├── TransferController.php
│   │   └── SeparationController.php
│   ├── Requests/
│   │   ├── StoreEmployeeRequest.php
│   │   ├── UpdateEmployeeRequest.php
│   │   ├── LeaveApplicationRequest.php
│   │   └── ...
│   ├── Resources/
│   │   ├── EmployeeResource.php
│   │   ├── AttendanceResource.php
│   │   └── ...
│   └── Middleware/
│       ├── CheckCollegeAccess.php
│       └── CheckEmployeeStatus.php
├── Models/
│   ├── Employee.php
│   ├── JobRequisition.php
│   ├── Attendance.php
│   ├── LeaveApplication.php
│   ├── Appraisal.php
│   ├── TrainingProgram.php
│   ├── Transfer.php
│   └── Separation.php
├── Services/
│   ├── EmployeeService.php
│   ├── RecruitmentService.php
│   ├── AttendanceService.php
│   ├── LeaveService.php
│   ├── PerformanceService.php
│   └── TrainingService.php
├── Repositories/
│   ├── EmployeeRepository.php
│   └── ...
├── Jobs/
│   ├── ProcessBiometricData.php
│   ├── GenerateMusterRoll.php
│   └── SendLeaveReminders.php
├── Events/
│   ├── EmployeeOnboarded.php
│   ├── EmployeeTransferred.php
│   └── EmployeeSeparated.php
└── Listeners/
    ├── NotifyHROnOnboarding.php
    └── UpdatePayrollOnTransfer.php
```

---

## Core Models

### 1. Employee Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'employee_code',
        'first_name',
        'last_name',
        'email',
        'phone',
        'college_id',
        'designation',
        'department',
        'date_of_joining',
        'date_of_birth',
        'status',
        'reporting_to',
        'salary',
        'probation_end_date',
        'permanent_date',
    ];

    protected $casts = [
        'date_of_joining' => 'date',
        'date_of_birth' => 'date',
        'probation_end_date' => 'date',
        'permanent_date' => 'date',
        'salary' => 'encrypted',
    ];

    protected $appends = ['full_name', 'years_of_service'];

    // Relationships
    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function reportingManager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'reporting_to');
    }

    public function subordinates(): HasMany
    {
        return $this->hasMany(Employee::class, 'reporting_to');
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function leaveApplications(): HasMany
    {
        return $this->hasMany(LeaveApplication::class);
    }

    public function appraisals(): HasMany
    {
        return $this->hasMany(Appraisal::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByCollege($query, $collegeId)
    {
        return $query->where('college_id', $collegeId);
    }

    public function scopeByDesignation($query, $designation)
    {
        return $query->where('designation', $designation);
    }

    // Accessors
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getYearsOfServiceAttribute(): float
    {
        return $this->date_of_joining->diffInYears(now());
    }

    public function getProbationStatusAttribute(): string
    {
        if (!$this->probation_end_date) {
            return 'permanent';
        }
        
        return now()->greaterThan($this->probation_end_date) 
            ? 'completed' 
            : 'active';
    }

    // Methods
    public function transfer($toCollegeId, $reason, $effectiveDate)
    {
        Transfer::create([
            'employee_id' => $this->id,
            'from_college_id' => $this->college_id,
            'to_college_id' => $toCollegeId,
            'reason' => $reason,
            'effective_date' => $effectiveDate,
            'status' => 'pending',
        ]);

        event(new EmployeeTransferred($this, $toCollegeId));
    }

    public function promote($newDesignation, $newSalary, $effectiveDate)
    {
        $this->update([
            'designation' => $newDesignation,
            'salary' => $newSalary,
        ]);

        event(new EmployeePromoted($this));
    }

    public function separate($separationType, $lastWorkingDay, $reason)
    {
        Separation::create([
            'employee_id' => $this->id,
            'separation_type' => $separationType,
            'last_working_day' => $lastWorkingDay,
            'reason' => $reason,
            'status' => 'initiated',
        ]);

        $this->update(['status' => 'resigned']);
        event(new EmployeeSeparated($this));
    }

    // Boot method for auto-generating employee_code
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($employee) {
            $employee->employee_code = self::generateEmployeeCode();
        });
    }

    private static function generateEmployeeCode(): string
    {
        $lastEmployee = self::orderBy('id', 'desc')->first();
        $nextId = $lastEmployee ? $lastEmployee->id + 1 : 1;
        return 'EMP-' . str_pad($nextId, 5, '0', STR_PAD_LEFT);
    }
}
```

### 2. JobRequisition Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobRequisition extends Model
{
    protected $fillable = [
        'requisition_number',
        'college_id',
        'position_title',
        'department',
        'number_of_positions',
        'job_description',
        'required_qualifications',
        'salary_range',
        'urgency',
        'status',
        'requested_by',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    // Relationships
    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeUrgent($query)
    {
        return $query->where('urgency', 'urgent');
    }

    // Methods
    public function approve($approverId)
    {
        $this->update([
            'status' => 'approved',
            'approved_by' => $approverId,
            'approved_at' => now(),
        ]);
    }

    public function reject($reason)
    {
        $this->update([
            'status' => 'rejected',
            'rejection_reason' => $reason,
        ]);
    }
}
```

### 3. Attendance Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    protected $fillable = [
        'employee_id',
        'attendance_date',
        'punch_in',
        'punch_out',
        'work_hours',
        'late_minutes',
        'overtime_hours',
        'status',
        'device_id',
        'regularized',
        'regularization_reason',
    ];

    protected $casts = [
        'attendance_date' => 'date',
        'punch_in' => 'datetime',
        'punch_out' => 'datetime',
        'work_hours' => 'float',
        'late_minutes' => 'integer',
        'overtime_hours' => 'float',
        'regularized' => 'boolean',
    ];

    // Relationships
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    // Scopes
    public function scopeForDate($query, $date)
    {
        return $query->whereDate('attendance_date', $date);
    }

    public function scopeLate($query)
    {
        return $query->where('late_minutes', '>', 15);
    }

    // Methods
    public function calculateWorkHours()
    {
        if ($this->punch_in && $this->punch_out) {
            $this->work_hours = $this->punch_in->diffInHours($this->punch_out);
            $this->save();
        }
    }

    public function calculateLateMark()
    {
        $standardTime = $this->attendance_date->setTime(9, 0, 0);
        if ($this->punch_in->greaterThan($standardTime)) {
            $this->late_minutes = $this->punch_in->diffInMinutes($standardTime);
            $this->status = $this->late_minutes > 15 ? 'late' : 'present';
            $this->save();
        }
    }

    public function calculateOvertime()
    {
        if ($this->work_hours > 9) {
            $this->overtime_hours = $this->work_hours - 9;
            $this->save();
        }
    }
}
```

### 4. LeaveApplication Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeaveApplication extends Model
{
    protected $fillable = [
        'employee_id',
        'leave_type',
        'from_date',
        'to_date',
        'number_of_days',
        'reason',
        'supporting_document',
        'status',
        'approved_by',
        'approved_at',
        'rejection_reason',
    ];

    protected $casts = [
        'from_date' => 'date',
        'to_date' => 'date',
        'number_of_days' => 'float',
        'approved_at' => 'datetime',
    ];

    // Relationships
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'approved_by');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    // Methods
    public function approve($approverId)
    {
        $this->update([
            'status' => 'approved',
            'approved_by' => $approverId,
            'approved_at' => now(),
        ]);

        // Deduct from leave balance
        LeaveBalance::deductBalance(
            $this->employee_id,
            $this->leave_type,
            $this->number_of_days
        );
    }

    public function reject($reason)
    {
        $this->update([
            'status' => 'rejected',
            'rejection_reason' => $reason,
        ]);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($leave) {
            $leave->number_of_days = $leave->from_date->diffInDays($leave->to_date) + 1;
        });
    }
}
```

### 5. Appraisal Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appraisal extends Model
{
    protected $fillable = [
        'employee_id',
        'appraisal_year',
        'goals',
        'self_rating',
        'self_comments',
        'manager_rating',
        'manager_comments',
        'overall_rating',
        'status',
        'submitted_at',
        'completed_at',
    ];

    protected $casts = [
        'goals' => 'array',
        'self_rating' => 'float',
        'manager_rating' => 'float',
        'overall_rating' => 'float',
        'submitted_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    // Relationships
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    // Methods
    public function submitSelfAssessment($rating, $comments, $goals)
    {
        $this->update([
            'self_rating' => $rating,
            'self_comments' => $comments,
            'goals' => $goals,
            'status' => 'pending_manager_review',
            'submitted_at' => now(),
        ]);
    }

    public function submitManagerReview($rating, $comments)
    {
        $this->update([
            'manager_rating' => $rating,
            'manager_comments' => $comments,
            'overall_rating' => ($this->self_rating + $rating) / 2,
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }
}
```

---

## Services Layer

### 1. EmployeeService

```php
<?php

namespace App\Services;

use App\Models\Employee;
use App\Events\EmployeeOnboarded;
use Illuminate\Support\Facades\DB;

class EmployeeService
{
    public function onboard(array $data): Employee
    {
        return DB::transaction(function () use ($data) {
            $employee = Employee::create($data);

            // Create leave balance
            LeaveBalance::create([
                'employee_id' => $employee->id,
                'financial_year' => now()->year,
                'casual_leave' => 12,
                'sick_leave' => 10,
                'earned_leave' => 20,
            ]);

            event(new EmployeeOnboarded($employee));

            return $employee;
        });
    }

    public function transfer(Employee $employee, int $toCollegeId, string $reason, $effectiveDate)
    {
        return DB::transaction(function () use ($employee, $toCollegeId, $reason, $effectiveDate) {
            $transfer = $employee->transfer($toCollegeId, $reason, $effectiveDate);

            // Update employee college after approval
            if ($transfer->status === 'approved') {
                $employee->update(['college_id' => $toCollegeId]);
            }

            return $transfer;
        });
    }

    public function promote(Employee $employee, string $newDesignation, float $newSalary, $effectiveDate)
    {
        return $employee->promote($newDesignation, $newSalary, $effectiveDate);
    }

    public function separate(Employee $employee, string $separationType, $lastWorkingDay, string $reason)
    {
        return $employee->separate($separationType, $lastWorkingDay, $reason);
    }
}
```

### 2. AttendanceService

```php
<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\Employee;
use Illuminate\Support\Facades\Cache;

class AttendanceService
{
    public function recordPunch(int $employeeId, string $punchType, $deviceId = null)
    {
        $today = now()->toDateString();
        $attendance = Attendance::firstOrCreate(
            [
                'employee_id' => $employeeId,
                'attendance_date' => $today,
            ],
            [
                'device_id' => $deviceId,
            ]
        );

        if ($punchType === 'in') {
            $attendance->punch_in = now();
            $attendance->calculateLateMark();
        } else {
            $attendance->punch_out = now();
            $attendance->calculateWorkHours();
            $attendance->calculateOvertime();
        }

        $attendance->save();

        return $attendance;
    }

    public function generateMusterRoll($collegeId, $date)
    {
        return Attendance::with('employee')
            ->whereHas('employee', fn($q) => $q->where('college_id', $collegeId))
            ->forDate($date)
            ->get()
            ->groupBy('status');
    }

    public function regularizeAttendance(int $attendanceId, string $reason, $approvedBy)
    {
        $attendance = Attendance::findOrFail($attendanceId);
        
        $attendance->update([
            'regularized' => true,
            'regularization_reason' => $reason,
            'status' => 'present',
        ]);

        return $attendance;
    }

    public function processBiometricData(array $biometricData)
    {
        foreach ($biometricData as $record) {
            $this->recordPunch(
                $record['employee_id'],
                $record['punch_type'],
                $record['device_id']
            );
        }
    }
}
```

### 3. LeaveService

```php
<?php

namespace App\Services;

use App\Models\LeaveApplication;
use App\Models\LeaveBalance;
use Illuminate\Support\Facades\DB;

class LeaveService
{
    public function applyLeave(array $data): LeaveApplication
    {
        // Check balance
        $balance = $this->checkBalance($data['employee_id'], $data['leave_type']);
        
        if ($balance < $data['number_of_days']) {
            throw new \Exception('Insufficient leave balance');
        }

        return LeaveApplication::create($data);
    }

    public function approveLeave(int $leaveId, int $approverId)
    {
        return DB::transaction(function () use ($leaveId, $approverId) {
            $leave = LeaveApplication::findOrFail($leaveId);
            $leave->approve($approverId);
            return $leave;
        });
    }

    public function checkBalance(int $employeeId, string $leaveType): float
    {
        $balance = LeaveBalance::where('employee_id', $employeeId)
            ->where('financial_year', now()->year)
            ->first();

        return match($leaveType) {
            'casual' => $balance->casual_leave,
            'sick' => $balance->sick_leave,
            'earned' => $balance->earned_leave,
            default => 0,
        };
    }

    public function calculateBalance(int $employeeId)
    {
        $balance = LeaveBalance::where('employee_id', $employeeId)
            ->where('financial_year', now()->year)
            ->first();

        $approved = LeaveApplication::where('employee_id', $employeeId)
            ->where('status', 'approved')
            ->whereYear('from_date', now()->year)
            ->get()
            ->groupBy('leave_type')
            ->map(fn($leaves) => $leaves->sum('number_of_days'));

        return [
            'casual' => $balance->casual_leave - ($approved['casual'] ?? 0),
            'sick' => $balance->sick_leave - ($approved['sick'] ?? 0),
            'earned' => $balance->earned_leave - ($approved['earned'] ?? 0),
        ];
    }
}
```

---

## Controllers

### EmployeeController

```php
<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Services\EmployeeService;
use App\Http\Requests\StoreEmployeeRequest;
use App\Http\Resources\EmployeeResource;

class EmployeeController extends Controller
{
    public function __construct(
        private EmployeeService $employeeService
    ) {}

    public function index(Request $request)
    {
        $employees = Employee::query()
            ->when($request->college_id, fn($q) => $q->byCollege($request->college_id))
            ->when($request->designation, fn($q) => $q->byDesignation($request->designation))
            ->when($request->status, fn($q) => $q->where('status', $request->status))
            ->when($request->search, fn($q) => 
                $q->where('first_name', 'like', "%{$request->search}%")
                  ->orWhere('last_name', 'like', "%{$request->search}%")
                  ->orWhere('employee_code', 'like', "%{$request->search}%")
            )
            ->with(['college', 'reportingManager'])
            ->paginate(20);

        return EmployeeResource::collection($employees);
    }

    public function store(StoreEmployeeRequest $request)
    {
        $employee = $this->employeeService->onboard($request->validated());

        return new EmployeeResource($employee);
    }

    public function show(Employee $employee)
    {
        return new EmployeeResource($employee->load([
            'college',
            'reportingManager',
            'attendances',
            'leaveApplications',
            'appraisals'
        ]));
    }

    public function update(UpdateEmployeeRequest $request, Employee $employee)
    {
        $employee->update($request->validated());

        return new EmployeeResource($employee);
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();

        return response()->json(['message' => 'Employee deleted successfully']);
    }
}
```

---

## Background Jobs

### ProcessBiometricData

```php
<?php

namespace App\Jobs;

use App\Services\AttendanceService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class ProcessBiometricData implements ShouldQueue
{
    use InteractsWithQueue, Queueable;

    public function __construct(
        private array $biometricData
    ) {}

    public function handle(AttendanceService $attendanceService)
    {
        $attendanceService->processBiometricData($this->biometricData);
    }
}
```

### GenerateMusterRoll

```php
<?php

namespace App\Jobs;

use App\Services\AttendanceService;
use Illuminate\Console\Scheduling\Schedule;

class GenerateMusterRoll
{
    public function schedule(Schedule $schedule)
    {
        $schedule->call(function () {
            $colleges = College::all();
            
            foreach ($colleges as $college) {
                $musterRoll = app(AttendanceService::class)
                    ->generateMusterRoll($college->id, now()->subDay());
                
                // Store or email muster roll
            }
        })->dailyAt('05:00');
    }
}
```

---

## API Resources

### EmployeeResource

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EmployeeResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'employee_code' => $this->employee_code,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'college' => [
                'id' => $this->college->id,
                'name' => $this->college->name,
            ],
            'designation' => $this->designation,
            'department' => $this->department,
            'date_of_joining' => $this->date_of_joining->format('Y-m-d'),
            'status' => $this->status,
            'years_of_service' => $this->years_of_service,
            'probation_status' => $this->probation_status,
            'reporting_to' => $this->reportingManager ? [
                'id' => $this->reportingManager->id,
                'name' => $this->reportingManager->full_name,
            ] : null,
            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}
```

---

## Middleware

### CheckCollegeAccess

```php
<?php

namespace App\Http\Middleware;

use Closure;

class CheckCollegeAccess
{
    public function handle($request, Closure $next)
    {
        $user = $request->user();
        $collegeId = $request->route('college_id') ?? $request->input('college_id');

        if ($user->role === 'college_hr' && $user->college_id !== $collegeId) {
            abort(403, 'Access denied to this college data');
        }

        return $next($request);
    }
}
```

---

*Complete Laravel 11 backend implementation guide for Super Non-Teaching Manager Portal with models, services, controllers, jobs, and middleware.*
