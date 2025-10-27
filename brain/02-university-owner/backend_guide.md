# University Owner Portal - Backend Implementation Guide

**Version**: 2.0  
**Framework**: Laravel 11 + PHP 8.3  
**Last Updated**: October 25, 2025  
**Scope**: University-level administration (single university, multi-college)

---

## Directory Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Owner/  (University Owner)
│   │       ├── DashboardController.php
│   │       ├── CollegeController.php
│   │       ├── ProgramController.php
│   │       ├── FacultyController.php
│   │       ├── StudentController.php
│   │       ├── AdmissionController.php
│   │       ├── FinancialController.php
│   │       ├── FeeStructureController.php
│   │       ├── ExpenseController.php
│   │       ├── ReportController.php
│   │       ├── SettingsController.php
│   │       └── AuthController.php
│   ├── Requests/
│   │   └── Owner/
│   │       ├── CreateCollegeRequest.php
│   │       ├── UpdateCollegeRequest.php
│   │       ├── AssignPrincipalRequest.php
│   │       ├── CreateProgramRequest.php
│   │       ├── HireFacultyRequest.php
│   │       ├── TransferStudentRequest.php
│   │       ├── CreateFeeStructureRequest.php
│   │       └── ApproveExpenseRequest.php
│   ├── Resources/
│   │   ├── CollegeResource.php
│   │   ├── CollegeDetailsResource.php
│   │   ├── ProgramResource.php
│   │   ├── FacultyResource.php
│   │   ├── FacultyProfileResource.php
│   │   ├── StudentResource.php
│   │   ├── StudentProfileResource.php
│   │   ├── AdmissionApplicationResource.php
│   │   ├── FeeStructureResource.php
│   │   └── ExpenseResource.php
│   └── Middleware/
│       ├── EnsureUniversityOwner.php
│       ├── EnsureUniversityActive.php
│       └── LogOwnerActions.php
├── Models/
│   ├── College.php (university-scoped)
│   ├── Program.php (university-scoped)
│   ├── Department.php (university-scoped)
│   ├── Faculty.php (university-scoped)
│   ├── Student.php (university-scoped)
│   ├── Enrollment.php (university-scoped)
│   ├── AdmissionApplication.php (university-scoped)
│   ├── MeritList.php (university-scoped)
│   ├── FeeStructure.php (university-scoped)
│   ├── FeePayment.php (university-scoped)
│   ├── Expense.php (university-scoped)
│   └── Scholarship.php (university-scoped)
├── Services/
│   ├── CollegeService.php
│   ├── ProgramService.php
│   ├── FacultyService.php
│   ├── StudentService.php
│   ├── AdmissionService.php
│   ├── FeeService.php
│   └── ReportService.php
├── Jobs/
│   ├── ProcessBulkStudentImport.php
│   ├── GenerateFeeReports.php
│   ├── SendAdmissionNotifications.php
│   └── CalculateMeritLists.php
└── Events/
    ├── CollegeCreated.php
    ├── PrincipalAssigned.php
    ├── ProgramCreated.php
    ├── FacultyHired.php
    └── StudentTransferred.php
```

---

## Base Model: UniversityScopedModel

**Critical**: All university-scoped models extend this base class for automatic tenant isolation.

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use App\Exceptions\UniversityMismatchException;

abstract class UniversityScopedModel extends Model
{
    /**
     * Boot the university scoped model.
     */
    protected static function booted()
    {
        // Global scope: Auto-filter by university_id
        static::addGlobalScope('university', function (Builder $builder) {
            if (auth()->check() && auth()->user()->university_id) {
                $builder->where($builder->getModel()->getTable() . '.university_id', auth()->user()->university_id);
            }
        });
        
        // Auto-set university_id when creating
        static::creating(function ($model) {
            if (auth()->check() && !$model->university_id) {
                $model->university_id = auth()->user()->university_id;
            }
            
            // Prevent creating records for wrong university
            if (auth()->check() && $model->university_id !== auth()->user()->university_id) {
                throw new UniversityMismatchException(
                    'Cannot create record for different university'
                );
            }
        });
        
        // Prevent updating university_id
        static::updating(function ($model) {
            if ($model->isDirty('university_id') && auth()->user()->role !== 'bitflow_owner') {
                throw new UniversityMismatchException(
                    'Cannot change university_id'
                );
            }
        });
    }
    
    /**
     * Scope query to specific university (admin only).
     */
    public function scopeForUniversity(Builder $query, string $universityId): Builder
    {
        return $query->withoutGlobalScope('university')
            ->where('university_id', $universityId);
    }
}
```

---

## Controllers

### app/Http/Controllers/Owner/DashboardController.php

```php
<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Models\College;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\FeePayment;
use App\Models\Activity;
use App\Models\AdmissionApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get university dashboard data.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $university = $user->university;
        
        // Key metrics
        $metrics = [
            'total_colleges' => College::count(),
            'total_students' => Student::where('status', 'active')->count(),
            'total_faculty' => Faculty::where('status', 'active')->count(),
            'active_programs' => DB::table('programs')
                ->where('university_id', $university->id)
                ->where('status', 'active')
                ->count(),
        ];
        
        // Enrollment trend (last 6 months)
        $enrollmentTrend = Student::selectRaw('
                DATE_FORMAT(created_at, "%Y-%m") as month,
                COUNT(*) as count
            ')
            ->where('created_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();
        
        // Fee collection by college (current month)
        $feeCollection = FeePayment::selectRaw('
                colleges.id,
                colleges.name,
                SUM(fee_payments.amount) as collected,
                SUM(CASE WHEN fee_payments.status = "paid" THEN fee_payments.amount ELSE 0 END) as paid,
                SUM(CASE WHEN fee_payments.status = "pending" THEN fee_payments.amount ELSE 0 END) as pending
            ')
            ->join('students', 'fee_payments.student_id', '=', 'students.id')
            ->join('colleges', 'students.college_id', '=', 'colleges.id')
            ->whereMonth('fee_payments.created_at', now()->month)
            ->whereYear('fee_payments.created_at', now()->year)
            ->groupBy('colleges.id', 'colleges.name')
            ->get();
        
        // Recent activities
        $activities = Activity::with(['causer'])
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        
        // Pending approvals
        $pendingApprovals = [
            'merit_lists' => DB::table('merit_lists')
                ->where('university_id', $university->id)
                ->where('status', 'pending')
                ->count(),
            'faculty_leaves' => DB::table('leaves')
                ->join('faculty', 'leaves.faculty_id', '=', 'faculty.id')
                ->where('faculty.university_id', $university->id)
                ->where('leaves.status', 'pending')
                ->count(),
            'expenses' => DB::table('expenses')
                ->where('university_id', $university->id)
                ->where('status', 'pending')
                ->count(),
        ];
        
        return response()->json([
            'metrics' => $metrics,
            'enrollment_trend' => $enrollmentTrend,
            'fee_collection' => $feeCollection,
            'recent_activities' => $activities,
            'pending_approvals' => $pendingApprovals,
        ]);
    }
}
```

### app/Http/Controllers/Owner/CollegeController.php

```php
<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Owner\CreateCollegeRequest;
use App\Http\Requests\Owner\UpdateCollegeRequest;
use App\Http\Requests\Owner\AssignPrincipalRequest;
use App\Http\Resources\CollegeResource;
use App\Http\Resources\CollegeDetailsResource;
use App\Models\College;
use App\Models\User;
use App\Services\CollegeService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CollegeController extends Controller
{
    public function __construct(
        private CollegeService $collegeService
    ) {}
    
    /**
     * List all colleges in the university.
     */
    public function index(Request $request)
    {
        $query = College::with(['principal', 'students', 'faculty']);
        
        // Search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }
        
        // Sort
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);
        
        // Paginate
        $colleges = $query->paginate($request->input('per_page', 15));
        
        return CollegeResource::collection($colleges);
    }
    
    /**
     * Create a new college.
     */
    public function store(CreateCollegeRequest $request)
    {
        $data = $request->validated();
        
        // Generate unique code
        $data['code'] = $this->collegeService->generateCollegeCode($data['name']);
        $data['status'] = 'active';
        
        $college = College::create($data);
        
        // Create initial departments if provided
        if (isset($data['departments'])) {
            foreach ($data['departments'] as $dept) {
                $college->departments()->create([
                    'name' => $dept['name'],
                    'code' => Str::upper(Str::substr($dept['name'], 0, 4)),
                    'university_id' => auth()->user()->university_id,
                ]);
            }
        }
        
        // Log activity
        activity('college')
            ->performedOn($college)
            ->causedBy(auth()->user())
            ->log('Created college: ' . $college->name);
        
        return new CollegeDetailsResource($college->load(['departments', 'principal']));
    }
    
    /**
     * Show college details.
     */
    public function show(College $college)
    {
        $college->load([
            'principal',
            'departments.faculty',
            'programs',
            'students' => function ($query) {
                $query->where('status', 'active');
            },
            'faculty' => function ($query) {
                $query->where('status', 'active');
            },
        ]);
        
        // Add computed metrics
        $college->metrics = [
            'total_students' => $college->students->count(),
            'total_faculty' => $college->faculty->count(),
            'active_programs' => $college->programs()->where('status', 'active')->count(),
            'departments_count' => $college->departments->count(),
            'average_attendance' => $this->collegeService->calculateAverageAttendance($college),
            'fee_collection_rate' => $this->collegeService->calculateFeeCollectionRate($college),
        ];
        
        return new CollegeDetailsResource($college);
    }
    
    /**
     * Update college.
     */
    public function update(UpdateCollegeRequest $request, College $college)
    {
        $college->update($request->validated());
        
        activity('college')
            ->performedOn($college)
            ->causedBy(auth()->user())
            ->log('Updated college: ' . $college->name);
        
        return new CollegeResource($college);
    }
    
    /**
     * Delete college.
     */
    public function destroy(College $college)
    {
        // Check if college has active students
        if ($college->students()->where('status', 'active')->exists()) {
            return response()->json([
                'error' => 'Cannot delete college with active students'
            ], 422);
        }
        
        // Soft delete
        $college->update(['status' => 'inactive']);
        
        activity('college')
            ->performedOn($college)
            ->causedBy(auth()->user())
            ->log('Deactivated college: ' . $college->name);
        
        return response()->json(['message' => 'College deactivated'], 204);
    }
    
    /**
     * Assign or change principal for college.
     */
    public function assignPrincipal(AssignPrincipalRequest $request, College $college)
    {
        $data = $request->validated();
        
        $principal = User::findOrFail($data['principal_id']);
        
        // Validate principal belongs to same university
        if ($principal->university_id !== auth()->user()->university_id) {
            return response()->json(['error' => 'Principal must belong to the same university'], 422);
        }
        
        // Validate role
        if ($principal->role !== 'principal') {
            return response()->json(['error' => 'User must have principal role'], 422);
        }
        
        // Remove from previous college if assigned
        if ($principal->college_id) {
            $oldCollege = College::find($principal->college_id);
            $oldCollege->update(['principal_id' => null]);
        }
        
        // Assign to new college
        $college->update(['principal_id' => $principal->id]);
        $principal->update(['college_id' => $college->id]);
        
        activity('college')
            ->performedOn($college)
            ->causedBy(auth()->user())
            ->log("Assigned principal {$principal->name} to {$college->name}");
        
        return new CollegeDetailsResource($college->load('principal'));
    }
}
```

### app/Http/Controllers/Owner/FacultyController.php

```php
<?php

namespace App\Http\Controllers\Owner;

use App\Http\Controllers\Controller;
use App\Http\Requests\Owner\HireFacultyRequest;
use App\Http\Resources\FacultyResource;
use App\Http\Resources\FacultyProfileResource;
use App\Models\Faculty;
use App\Models\User;
use App\Models\Leave;
use App\Services\FacultyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class FacultyController extends Controller
{
    public function __construct(
        private FacultyService $facultyService
    ) {}
    
    /**
     * List all faculty across all colleges.
     */
    public function index(Request $request)
    {
        $query = Faculty::with(['user', 'college', 'department']);
        
        // Search
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        // Filter by college
        if ($request->has('college_id')) {
            $query->where('college_id', $request->input('college_id'));
        }
        
        // Filter by department
        if ($request->has('department_id')) {
            $query->where('department_id', $request->input('department_id'));
        }
        
        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }
        
        $faculty = $query->paginate($request->input('per_page', 20));
        
        return FacultyResource::collection($faculty);
    }
    
    /**
     * Hire new faculty (3-step wizard).
     */
    public function store(HireFacultyRequest $request)
    {
        $data = $request->validated();
        
        // Step 1: Create user account
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password'] ?? Str::random(12)),
            'role' => 'faculty',
            'university_id' => auth()->user()->university_id,
            'college_id' => $data['college_id'],
            'status' => 'active',
        ]);
        
        // Step 2: Create faculty profile
        $faculty = Faculty::create([
            'user_id' => $user->id,
            'university_id' => auth()->user()->university_id,
            'college_id' => $data['college_id'],
            'department_id' => $data['department_id'],
            'designation' => $data['designation'],
            'qualification' => $data['qualification'],
            'specialization' => $data['specialization'] ?? null,
            'experience_years' => $data['experience_years'] ?? 0,
            'date_of_joining' => $data['date_of_joining'],
            'employment_type' => $data['employment_type'],
            'salary' => $data['salary'],
            'phone' => $data['phone'] ?? null,
            'status' => 'active',
        ]);
        
        // Step 3: Send welcome email
        // Mail::to($user->email)->send(new FacultyWelcome($faculty));
        
        activity('faculty')
            ->performedOn($faculty)
            ->causedBy(auth()->user())
            ->log("Hired faculty: {$user->name}");
        
        return new FacultyProfileResource($faculty->load(['user', 'college', 'department']));
    }
    
    /**
     * Get faculty profile.
     */
    public function show(Faculty $faculty)
    {
        $faculty->load(['user', 'college', 'department', 'courses', 'leaves']);
        
        // Add metrics
        $faculty->metrics = [
            'courses_assigned' => $faculty->courses()->count(),
            'students_taught' => $this->facultyService->getTotalStudentsTaught($faculty),
            'leaves_taken' => $faculty->leaves()->where('status', 'approved')->count(),
            'leaves_balance' => $this->facultyService->getLeaveBalance($faculty),
        ];
        
        return new FacultyProfileResource($faculty);
    }
    
    /**
     * Get faculty leave requests.
     */
    public function leaves(Faculty $faculty)
    {
        $leaves = $faculty->leaves()
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($leaves);
    }
    
    /**
     * Approve/reject leave request.
     */
    public function approveLeave(Request $request, int $leaveId)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'remarks' => 'nullable|string|max:500',
        ]);
        
        $leave = Leave::findOrFail($leaveId);
        
        // Verify leave belongs to university
        if ($leave->faculty->university_id !== auth()->user()->university_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        $leave->update([
            'status' => $request->input('status'),
            'approved_by' => auth()->user()->id,
            'approved_at' => now(),
            'remarks' => $request->input('remarks'),
        ]);
        
        activity('leave')
            ->performedOn($leave)
            ->causedBy(auth()->user())
            ->log("Leave {$request->input('status')} for {$leave->faculty->user->name}");
        
        return response()->json($leave);
    }
}
```

---

## Form Requests

### app/Http/Requests/Owner/CreateCollegeRequest.php

```php
<?php

namespace App\Http\Requests\Owner;

use Illuminate\Foundation\Http\FormRequest;

class CreateCollegeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'university_owner';
    }
    
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'code' => 'nullable|string|max:10|unique:colleges,code',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'state' => 'required|string|max:100',
            'pincode' => 'required|string|size:6',
            'phone' => 'nullable|string|max:15',
            'email' => 'required|email|max:255',
            'website' => 'nullable|url|max:255',
            'established_year' => 'required|integer|min:1800|max:' . date('Y'),
            'student_capacity' => 'required|integer|min:1',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'departments' => 'nullable|array',
            'departments.*.name' => 'required|string|max:255',
        ];
    }
}
```

### app/Http/Requests/Owner/HireFacultyRequest.php

```php
<?php

namespace App\Http\Requests\Owner;

use Illuminate\Foundation\Http\FormRequest;

class HireFacultyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->role === 'university_owner';
    }
    
    public function rules(): array
    {
        return [
            // Personal Info
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:15',
            'password' => 'nullable|string|min:8',
            
            // Employment Details
            'college_id' => 'required|uuid|exists:colleges,id',
            'department_id' => 'required|uuid|exists:departments,id',
            'designation' => 'required|in:Professor,Associate Professor,Assistant Professor,Lecturer,Lab Assistant',
            'employment_type' => 'required|in:permanent,contract,visiting',
            'date_of_joining' => 'required|date',
            'salary' => 'required|numeric|min:0',
            
            // Qualifications
            'qualification' => 'required|string|max:255',
            'specialization' => 'nullable|string|max:255',
            'experience_years' => 'nullable|integer|min:0|max:50',
        ];
    }
}
```

---

## Services

### app/Services/CollegeService.php

```php
<?php

namespace App\Services;

use App\Models\College;
use App\Models\Student;
use App\Models\FeePayment;
use Illuminate\Support\Str;

class CollegeService
{
    /**
     * Generate unique college code.
     */
    public function generateCollegeCode(string $name): string
    {
        $prefix = Str::upper(Str::substr(preg_replace('/[^A-Za-z]/', '', $name), 0, 4));
        $suffix = str_pad(College::count() + 1, 3, '0', STR_PAD_LEFT);
        
        return $prefix . $suffix;
    }
    
    /**
     * Calculate average attendance for college.
     */
    public function calculateAverageAttendance(College $college): float
    {
        $totalAttendance = $college->students()
            ->where('status', 'active')
            ->avg('attendance_percentage');
        
        return round($totalAttendance ?? 0, 2);
    }
    
    /**
     * Calculate fee collection rate.
     */
    public function calculateFeeCollectionRate(College $college): float
    {
        $totalFees = FeePayment::whereHas('student', function ($query) use ($college) {
                $query->where('college_id', $college->id);
            })
            ->whereYear('created_at', now()->year)
            ->sum('amount');
        
        $paidFees = FeePayment::whereHas('student', function ($query) use ($college) {
                $query->where('college_id', $college->id);
            })
            ->where('status', 'paid')
            ->whereYear('created_at', now()->year)
            ->sum('amount');
        
        return $totalFees > 0 ? round(($paidFees / $totalFees) * 100, 2) : 0;
    }
}
```

### app/Services/FacultyService.php

```php
<?php

namespace App\Services;

use App\Models\Faculty;

class FacultyService
{
    /**
     * Get total students taught by faculty.
     */
    public function getTotalStudentsTaught(Faculty $faculty): int
    {
        return $faculty->courses()
            ->withCount('students')
            ->get()
            ->sum('students_count');
    }
    
    /**
     * Calculate leave balance.
     */
    public function getLeaveBalance(Faculty $faculty): array
    {
        $currentYear = now()->year;
        
        $totalAllowed = [
            'casual' => 12,
            'sick' => 12,
            'earned' => 15,
        ];
        
        $taken = $faculty->leaves()
            ->where('status', 'approved')
            ->whereYear('start_date', $currentYear)
            ->selectRaw('leave_type, SUM(DATEDIFF(end_date, start_date) + 1) as days')
            ->groupBy('leave_type')
            ->pluck('days', 'leave_type')
            ->toArray();
        
        return [
            'casual' => $totalAllowed['casual'] - ($taken['casual'] ?? 0),
            'sick' => $totalAllowed['sick'] - ($taken['sick'] ?? 0),
            'earned' => $totalAllowed['earned'] - ($taken['earned'] ?? 0),
        ];
    }
}
```

---

## Models

### app/Models/College.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class College extends UniversityScopedModel
{
    use HasUuids;
    
    protected $fillable = [
        'university_id',
        'name',
        'code',
        'address',
        'city',
        'state',
        'pincode',
        'phone',
        'email',
        'website',
        'logo',
        'established_year',
        'student_capacity',
        'principal_id',
        'status',
    ];
    
    protected $casts = [
        'established_year' => 'integer',
        'student_capacity' => 'integer',
    ];
    
    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }
    
    public function principal(): BelongsTo
    {
        return $this->belongsTo(User::class, 'principal_id');
    }
    
    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }
    
    public function programs(): HasMany
    {
        return $this->hasMany(Program::class);
    }
    
    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }
    
    public function faculty(): HasMany
    {
        return $this->hasMany(Faculty::class);
    }
}
```

### app/Models/Faculty.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Faculty extends UniversityScopedModel
{
    use HasUuids;
    
    protected $table = 'faculty';
    
    protected $fillable = [
        'user_id',
        'university_id',
        'college_id',
        'department_id',
        'designation',
        'qualification',
        'specialization',
        'experience_years',
        'date_of_joining',
        'employment_type',
        'salary',
        'phone',
        'status',
    ];
    
    protected $casts = [
        'experience_years' => 'integer',
        'date_of_joining' => 'date',
        'salary' => 'decimal:2',
    ];
    
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
    
    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }
    
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }
    
    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'course_faculty')
            ->withPivot('role', 'semester', 'academic_year')
            ->withTimestamps();
    }
    
    public function leaves(): HasMany
    {
        return $this->hasMany(Leave::class);
    }
}
```

---

## Middleware

### app/Http/Middleware/EnsureUniversityOwner.php

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUniversityOwner
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        
        if ($user->role !== 'university_owner') {
            return response()->json(['error' => 'Unauthorized. University Owner access required.'], 403);
        }
        
        if (!$user->university_id) {
            return response()->json(['error' => 'No university assigned'], 403);
        }
        
        if ($user->university->status !== 'active') {
            return response()->json([
                'error' => 'University is not active',
                'university_status' => $user->university->status
            ], 403);
        }
        
        return $next($request);
    }
}
```

---

## Database Queries - Multi-Tenancy Examples

```php
// ✅ CORRECT: Global scope auto-applied
$colleges = College::all(); // Only returns colleges for authenticated user's university

// ✅ CORRECT: Creating automatically sets university_id
$college = College::create([
    'name' => 'Engineering College',
    // university_id auto-set from auth()->user()->university_id
]);

// ✅ CORRECT: Relationships are also scoped
$students = $college->students; // Only students from this university

// ❌ WRONG: Trying to access another university's data
$college = College::find('other-university-college-id'); // Returns NULL

// ✅ CORRECT: Bitflow Admin can bypass scope
if (auth()->user()->role === 'bitflow_owner') {
    $allColleges = College::withoutGlobalScope('university')->get();
}
```

---

**Backend Guide Complete! University-scoped Laravel controllers, services, and models with automatic tenant isolation.**
