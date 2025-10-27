# Bitflow Admin Portal - Backend Implementation Guide

**Version**: 2.0  
**Framework**: Laravel 11 + PHP 8.3  
**Last Updated**: October 25, 2025  
**Scope**: Platform-level administration (cross-tenant)

---

## Directory Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Admin/  (Bitflow Admin)
│   │       ├── PlatformController.php
│   │       ├── UniversityController.php
│   │       ├── GlobalUserController.php
│   │       ├── AnalyticsController.php
│   │       ├── BillingController.php
│   │       ├── GlobalSettingsController.php
│   │       ├── AuditLogController.php
│   │       ├── SupportTicketController.php
│   │       └── SystemLogController.php
│   ├── Requests/
│   │   └── Admin/
│   │       ├── CreateUniversityRequest.php
│   │       ├── UpdateUniversityRequest.php
│   │       ├── UpdateGlobalSettingsRequest.php
│   │       └── UpdateSubscriptionRequest.php
│   ├── Resources/
│   │   ├── UniversityResource.php
│   │   ├── UniversityDetailsResource.php
│   │   ├── GlobalUserResource.php
│   │   ├── AnalyticsResource.php
│   │   ├── BillingResource.php
│   │   ├── InvoiceResource.php
│   │   ├── AuditLogResource.php
│   │   ├── SupportTicketResource.php
│   │   └── SystemLogResource.php
│   └── Middleware/
│       ├── EnsureBitflowOwner.php
│       ├── CheckIPWhitelist.php
│       └── LogBitflowActions.php
├── Models/
│   ├── University.php
│   ├── Subscription.php
│   ├── Invoice.php
│   ├── Payment.php
│   ├── GlobalSetting.php
│   ├── AuditLog.php
│   ├── SupportTicket.php
│   ├── SystemLog.php
│   └── Alert.php
├── Services/
│   ├── UniversityService.php
│   ├── BillingService.php
│   ├── AnalyticsService.php
│   ├── StorageService.php
│   ├── StripeService.php
│   └── MonitoringService.php
├── Jobs/
│   ├── ProcessSubscriptionRenewal.php
│   ├── GenerateMonthlyInvoices.php
│   ├── BackupUniversityData.php
│   ├── CheckStorageUsage.php
│   └── SendSystemAlerts.php
└── Events/
    ├── UniversityCreated.php
    ├── UniversitySuspended.php
    ├── PaymentProcessed.php
    └── CriticalAlertRaised.php
```

---

## Controllers

### app/Http/Controllers/Admin/UniversityController.php

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CreateUniversityRequest;
use App\Http\Requests\Admin\UpdateUniversityRequest;
use App\Http\Resources\UniversityResource;
use App\Http\Resources\UniversityDetailsResource;
use App\Models\University;
use App\Services\UniversityService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UniversityController extends Controller
{
    public function __construct(
        private UniversityService $universityService
    ) {}

    /**
     * List all universities (paginated, filtered, sorted)
     * 
     * GET /api/admin/universities
     */
    public function index(Request $request)
    {
        $query = University::query();

        // Search
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('domain', 'like', "%{$search}%")
                  ->orWhere('primary_email', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($status = $request->input('status')) {
            $query->where('status', $status);
        }

        // Sort
        $sortBy = $request->input('sort_by', 'created_at');
        $sortOrder = $request->input('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Paginate
        $universities = $query->paginate($request->input('per_page', 10));

        return UniversityResource::collection($universities);
    }

    /**
     * Create new university
     * 
     * POST /api/admin/universities
     */
    public function store(CreateUniversityRequest $request)
    {
        $validated = $request->validated();

        // Auto-generate domain and slug
        $validated['slug'] = Str::slug($validated['name']);
        $validated['domain'] = $validated['slug'] . '.bitflow.edu';
        
        // Default values
        $validated['status'] = 'active';
        $validated['storage_quota_gb'] = $validated['storage_quota_gb'] ?? 500;
        $validated['storage_used_gb'] = 0;
        $validated['api_rate_limit'] = 10000;

        $university = $this->universityService->create($validated);

        return new UniversityResource($university);
    }

    /**
     * Get university details
     * 
     * GET /api/admin/universities/{id}
     */
    public function show(string $id)
    {
        $university = University::with([
            'owner',
            'subscription',
            'recentInvoices',
            'recentActivities'
        ])->findOrFail($id);

        // Fetch usage statistics
        $usage = $this->universityService->getUsageStatistics($id);
        $university->usage = $usage;

        return new UniversityDetailsResource($university);
    }

    /**
     * Update university
     * 
     * PATCH /api/admin/universities/{id}
     */
    public function update(UpdateUniversityRequest $request, string $id)
    {
        $university = University::findOrFail($id);
        $validated = $request->validated();

        $university->update($validated);

        return new UniversityResource($university);
    }

    /**
     * Delete university
     * 
     * DELETE /api/admin/universities/{id}?confirmation=DELETE
     */
    public function destroy(Request $request, string $id)
    {
        // Require confirmation
        if ($request->input('confirmation') !== 'DELETE') {
            return response()->json([
                'message' => 'Must provide confirmation=DELETE to delete university'
            ], 400);
        }

        $university = University::findOrFail($id);

        // Check if university has active users
        $userCount = $university->users()->count();
        if ($userCount > 0) {
            return response()->json([
                'message' => "Cannot delete university with {$userCount} active users"
            ], 400);
        }

        $this->universityService->delete($university);

        return response()->json(['message' => 'University deleted successfully'], 204);
    }

    /**
     * Change university status
     * 
     * PATCH /api/admin/universities/{id}/status
     */
    public function changeStatus(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|in:active,inactive,suspended,limited',
            'reason' => 'nullable|string|max:500'
        ]);

        $university = University::findOrFail($id);
        $university->update(['status' => $request->status]);

        // Log action
        activity()
            ->causedBy(auth()->user())
            ->performedOn($university)
            ->withProperties(['reason' => $request->reason])
            ->log("University status changed to {$request->status}");

        return new UniversityResource($university);
    }

    /**
     * Get university usage statistics
     * 
     * GET /api/admin/universities/{id}/usage
     */
    public function usage(string $id)
    {
        $usage = $this->universityService->getUsageStatistics($id);

        return response()->json($usage);
    }

    /**
     * Get university activity history
     * 
     * GET /api/admin/universities/{id}/activities
     */
    public function activities(Request $request, string $id)
    {
        $limit = $request->input('limit', 50);

        $activities = Activity::where('subject_type', University::class)
            ->where('subject_id', $id)
            ->with('causer')
            ->latest()
            ->limit($limit)
            ->get();

        return response()->json($activities);
    }
}
```

---

### app/Http/Controllers/Admin/PlatformController.php

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\University;
use App\Models\User;
use App\Models\Alert;
use App\Services\AnalyticsService;
use App\Services\MonitoringService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;

class PlatformController extends Controller
{
    public function __construct(
        private AnalyticsService $analyticsService,
        private MonitoringService $monitoringService
    ) {}

    /**
     * Platform dashboard with all metrics
     * 
     * GET /api/admin/dashboard
     */
    public function dashboard()
    {
        return response()->json([
            'stats' => $this->getStats(),
            'recent_activity' => $this->getRecentActivity(),
            'system_performance' => $this->getSystemPerformance(),
            'alerts' => $this->getAlerts(),
            'revenue' => $this->getRevenueOverview(),
        ]);
    }

    /**
     * Real-time system health
     * 
     * GET /api/admin/system/health
     */
    public function systemHealth()
    {
        $health = $this->monitoringService->getSystemHealth();

        return response()->json($health);
    }

    /**
     * Active alerts
     * 
     * GET /api/admin/alerts
     */
    public function alerts()
    {
        $alerts = Alert::where('status', 'active')
            ->orderByRaw("FIELD(severity, 'critical', 'error', 'warning', 'info')")
            ->get();

        return response()->json($alerts);
    }

    // Private helper methods
    private function getStats()
    {
        return [
            'total_universities' => University::count(),
            'active_universities' => University::where('status', 'active')->count(),
            'total_users' => User::count(),
            'api_requests_today' => $this->analyticsService->getApiRequestsToday(),
            'storage_used_gb' => University::sum('storage_used_gb'),
            'storage_total_gb' => University::sum('storage_quota_gb'),
        ];
    }

    private function getRecentActivity()
    {
        return DB::table('university_activities')
            ->join('universities', 'university_activities.university_id', '=', 'universities.id')
            ->select('university_activities.*', 'universities.name as university_name')
            ->orderBy('university_activities.created_at', 'desc')
            ->limit(10)
            ->get();
    }

    private function getSystemPerformance()
    {
        return [
            'api_latency_ms' => $this->monitoringService->getAverageLatency(),
            'db_response_time_ms' => $this->monitoringService->getDbResponseTime(),
            'redis_hit_rate' => $this->monitoringService->getRedisHitRate(),
            'uptime_percentage' => 99.98, // From monitoring service
        ];
    }

    private function getAlerts()
    {
        return Alert::where('status', 'active')->limit(5)->get();
    }

    private function getRevenueOverview()
    {
        return $this->analyticsService->getRevenueOverview();
    }
}
```

---

## Hierarchical Navigation Controllers

The Bitflow Admin Portal includes specialized controllers for hierarchical navigation through University → College → Sections.

### app/Http/Controllers/Admin/UniversityHubController.php

Handles university-level hub data and nested resources.

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\University;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UniversityHubController extends Controller
{
    /**
     * Get university hub data
     * 
     * Endpoint: GET /api/admin/universities/{universityId}
     */
    public function show(string $universityId): JsonResponse
    {
        $university = University::with([
            'colleges:id,name,status',
            'owner:id,name,email'
        ])->findOrFail($universityId);

        $stats = [
            'total_colleges' => $university->colleges()->count(),
            'total_students' => $university->students()->count(),
            'total_faculty' => $university->faculty()->count(),
            'total_staff' => $university->staff()->count(),
        ];

        return response()->json([
            'university' => [
                'id' => $university->id,
                'name' => $university->name,
                'domain' => $university->domain,
                'logo_url' => $university->logo_url,
                'status' => $university->status,
                'primary_email' => $university->primary_email,
                'primary_phone' => $university->primary_phone,
            ],
            'stats' => $stats,
            'quick_actions' => [
                ['title' => 'Management Team', 'icon' => 'users', 'link' => "/universities/{$universityId}/management"],
                ['title' => 'Colleges', 'icon' => 'building', 'link' => "/universities/{$universityId}/colleges"],
                ['title' => 'Settings', 'icon' => 'settings', 'link' => "/universities/{$universityId}/settings"],
            ],
        ]);
    }

    /**
     * Get university management team
     * 
     * Endpoint: GET /api/admin/universities/{universityId}/management
     */
    public function management(string $universityId): JsonResponse
    {
        $university = University::findOrFail($universityId);
        
        $managementTeam = $university->users()
            ->whereIn('role', ['university_owner', 'super_admin'])
            ->get()
            ->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'photo_url' => $user->photo_url,
                'status' => $user->status,
            ]);

        return response()->json([
            'data' => $managementTeam,
        ]);
    }

    /**
     * Get university colleges
     * 
     * Endpoint: GET /api/admin/universities/{universityId}/colleges
     */
    public function colleges(string $universityId, Request $request): JsonResponse
    {
        $university = University::findOrFail($universityId);

        $query = $university->colleges();

        // Apply filters
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $colleges = $query->withCount(['students', 'faculty', 'departments'])
            ->get()
            ->map(fn($college) => [
                'id' => $college->id,
                'name' => $college->name,
                'code' => $college->code,
                'status' => $college->status,
                'established_year' => $college->established_year,
                'students_count' => $college->students_count,
                'faculty_count' => $college->faculty_count,
                'departments_count' => $college->departments_count,
            ]);

        return response()->json([
            'data' => $colleges,
        ]);
    }

    /**
     * Get university settings
     * 
     * Endpoint: GET /api/admin/universities/{universityId}/settings
     */
    public function getSettings(string $universityId): JsonResponse
    {
        $university = University::with('settings')->findOrFail($universityId);

        return response()->json([
            'general' => [
                'name' => $university->name,
                'primary_email' => $university->primary_email,
                'primary_phone' => $university->primary_phone,
                'logo_url' => $university->logo_url,
            ],
            'security' => [
                'two_factor_required' => $university->two_factor_required,
                'session_timeout_minutes' => $university->session_timeout_minutes ?? 60,
                'password_expiry_days' => $university->password_expiry_days ?? 90,
            ],
            'preferences' => [
                'timezone' => $university->timezone ?? 'UTC',
                'date_format' => $university->date_format ?? 'Y-m-d',
                'language' => $university->language ?? 'en',
            ],
        ]);
    }

    /**
     * Update university settings
     * 
     * Endpoint: PUT /api/admin/universities/{universityId}/settings
     */
    public function updateSettings(string $universityId, Request $request): JsonResponse
    {
        $university = University::findOrFail($universityId);

        $validated = $request->validate([
            'general.name' => 'sometimes|string|max:200',
            'general.primary_email' => 'sometimes|email',
            'general.primary_phone' => 'sometimes|string',
            'security.two_factor_required' => 'sometimes|boolean',
            'security.session_timeout_minutes' => 'sometimes|integer|min:15|max:480',
            'preferences.timezone' => 'sometimes|string',
        ]);

        // Update general settings
        if (isset($validated['general'])) {
            $university->update($validated['general']);
        }

        // Update security settings
        if (isset($validated['security'])) {
            $university->update($validated['security']);
        }

        // Update preferences
        if (isset($validated['preferences'])) {
            $university->update($validated['preferences']);
        }

        return response()->json([
            'message' => 'Settings updated successfully',
        ]);
    }
}
```

### app/Http/Controllers/Admin/CollegeHubController.php

Handles college-level hub data and all college subsections.

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\University;
use App\Models\College;
use App\Models\Department;
use App\Models\Student;
use App\Models\Faculty;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CollegeHubController extends Controller
{
    /**
     * Get college hub data
     * 
     * Endpoint: GET /api/admin/universities/{universityId}/colleges/{collegeId}
     */
    public function show(string $universityId, string $collegeId): JsonResponse
    {
        $university = University::findOrFail($universityId);
        $college = $university->colleges()->findOrFail($collegeId);

        $stats = [
            'total_departments' => $college->departments()->count(),
            'total_students' => $college->students()->count(),
            'total_faculty' => $college->faculty()->count(),
            'total_courses' => $college->courses()->count(),
            'library_books' => $college->libraryBooks()->count(),
            'transport_routes' => $college->transportRoutes()->count(),
            'hostel_rooms' => $college->hostelRooms()->count(),
            'leadership_count' => $college->users()->whereIn('role', ['principal', 'college_admin'])->count(),
        ];

        $sections = [
            ['id' => 'leadership', 'title' => 'Leadership', 'icon' => 'users', 'count' => $stats['leadership_count']],
            ['id' => 'departments', 'title' => 'Departments', 'icon' => 'building', 'count' => $stats['total_departments']],
            ['id' => 'academic-staff', 'title' => 'Academic Staff', 'icon' => 'graduation-cap', 'count' => $stats['total_faculty']],
            ['id' => 'students', 'title' => 'Students', 'icon' => 'users', 'count' => $stats['total_students']],
            ['id' => 'curriculum', 'title' => 'Curriculum', 'icon' => 'book-open', 'count' => $stats['total_courses']],
            ['id' => 'library', 'title' => 'Library', 'icon' => 'library', 'count' => $stats['library_books']],
            ['id' => 'transport', 'title' => 'Transport', 'icon' => 'bus', 'count' => $stats['transport_routes']],
            ['id' => 'hostel', 'title' => 'Hostel', 'icon' => 'home', 'count' => $stats['hostel_rooms']],
            ['id' => 'attendance', 'title' => 'Attendance', 'icon' => 'calendar'],
            ['id' => 'settings', 'title' => 'Settings', 'icon' => 'settings'],
        ];

        return response()->json([
            'college' => [
                'id' => $college->id,
                'name' => $college->name,
                'code' => $college->code,
                'status' => $college->status,
                'established_year' => $college->established_year,
            ],
            'stats' => $stats,
            'sections' => array_map(fn($section) => array_merge($section, [
                'link' => "/universities/{$universityId}/colleges/{$collegeId}/{$section['id']}"
            ]), $sections),
        ]);
    }

    /**
     * Get college leadership
     * 
     * Endpoint: GET /api/admin/universities/{universityId}/colleges/{collegeId}/leadership
     */
    public function leadership(string $universityId, string $collegeId): JsonResponse
    {
        $university = University::findOrFail($universityId);
        $college = $university->colleges()->findOrFail($collegeId);

        $leadership = $college->users()
            ->whereIn('role', ['principal', 'college_admin'])
            ->get();

        return response()->json([
            'principal' => $leadership->firstWhere('role', 'principal'),
            'admins' => $leadership->where('role', 'college_admin')->values(),
        ]);
    }

    /**
     * Get college departments
     * 
     * Endpoint: GET /api/admin/universities/{universityId}/colleges/{collegeId}/departments
     */
    public function departments(string $universityId, string $collegeId, Request $request): JsonResponse
    {
        $university = University::findOrFail($universityId);
        $college = $university->colleges()->findOrFail($collegeId);

        $query = $college->departments()->with('hod:id,name');

        // Filters
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%");
            });
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $departments = $query->withCount(['students', 'faculty', 'courses'])->get();

        return response()->json([
            'data' => $departments->map(fn($dept) => [
                'id' => $dept->id,
                'name' => $dept->name,
                'code' => $dept->code,
                'hod_id' => $dept->hod_id,
                'hod_name' => $dept->hod?->name,
                'status' => $dept->status,
                'students_count' => $dept->students_count,
                'faculty_count' => $dept->faculty_count,
                'courses_count' => $dept->courses_count,
                'created_at' => $dept->created_at,
            ]),
        ]);
    }

    /**
     * Create department
     * 
     * Endpoint: POST /api/admin/universities/{universityId}/colleges/{collegeId}/departments
     */
    public function createDepartment(string $universityId, string $collegeId, Request $request): JsonResponse
    {
        $university = University::findOrFail($universityId);
        $college = $university->colleges()->findOrFail($collegeId);

        $validated = $request->validate([
            'name' => 'required|string|max:200',
            'code' => 'required|string|max:10',
            'hod_id' => 'nullable|exists:users,id',
        ]);

        $department = $college->departments()->create($validated);

        return response()->json($department, 201);
    }

    /**
     * Get college students
     * 
     * Endpoint: GET /api/admin/universities/{universityId}/colleges/{collegeId}/students
     */
    public function students(string $universityId, string $collegeId, Request $request): JsonResponse
    {
        $university = University::findOrFail($universityId);
        $college = $university->colleges()->findOrFail($collegeId);

        $query = $college->students()->with('department:id,name');

        // Filters
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('enrollment_number', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('department')) {
            $query->where('department_id', $request->input('department'));
        }

        if ($request->has('year')) {
            $query->where('year', $request->input('year'));
        }

        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        $students = $query->paginate($request->input('per_page', 20));

        return response()->json([
            'data' => $students->items(),
            'pagination' => [
                'current_page' => $students->currentPage(),
                'per_page' => $students->perPage(),
                'total' => $students->total(),
                'last_page' => $students->lastPage(),
            ],
        ]);
    }

    /**
     * Get student profile
     * 
     * Endpoint: GET /api/admin/universities/{universityId}/colleges/{collegeId}/students/{studentId}
     */
    public function student(string $universityId, string $collegeId, string $studentId): JsonResponse
    {
        $university = University::findOrFail($universityId);
        $college = $university->colleges()->findOrFail($collegeId);
        $student = $college->students()->with(['department', 'enrolledCourses'])->findOrFail($studentId);

        return response()->json([
            'id' => $student->id,
            'enrollment_number' => $student->enrollment_number,
            'name' => $student->name,
            'email' => $student->email,
            'phone' => $student->phone,
            'photo_url' => $student->photo_url,
            'department_id' => $student->department_id,
            'department_name' => $student->department->name,
            'year' => $student->year,
            'status' => $student->status,
            'gpa' => $student->gpa,
            'attendance_percentage' => $student->attendance_percentage,
            'personal_info' => [
                'date_of_birth' => $student->date_of_birth,
                'gender' => $student->gender,
                'blood_group' => $student->blood_group,
                'address' => $student->address,
            ],
            'academic_info' => [
                'admission_date' => $student->admission_date,
                'current_semester' => $student->current_semester,
                'program' => $student->program,
                'enrolled_courses' => $student->enrolledCourses,
            ],
            'fees_info' => [
                'total_fees' => $student->total_fees,
                'paid_amount' => $student->paid_amount,
                'pending_amount' => $student->pending_amount,
                'last_payment_date' => $student->last_payment_date,
            ],
        ]);
    }

    /**
     * Get academic staff
     * 
     * Endpoint: GET /api/admin/universities/{universityId}/colleges/{collegeId}/academic-staff
     */
    public function academicStaff(string $universityId, string $collegeId, Request $request): JsonResponse
    {
        $university = University::findOrFail($universityId);
        $college = $university->colleges()->findOrFail($collegeId);

        $query = $college->faculty()->with('department:id,name');

        // Filters
        if ($request->has('department')) {
            $query->where('department_id', $request->input('department'));
        }

        if ($request->has('designation')) {
            $query->where('designation', $request->input('designation'));
        }

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('employee_id', 'like', "%{$search}%");
            });
        }

        $faculty = $query->withCount('assignedCourses')->get();

        return response()->json([
            'data' => $faculty->map(fn($f) => [
                'id' => $f->id,
                'employee_id' => $f->employee_id,
                'name' => $f->name,
                'email' => $f->email,
                'photo_url' => $f->photo_url,
                'department_id' => $f->department_id,
                'department_name' => $f->department->name,
                'designation' => $f->designation,
                'specialization' => $f->specialization,
                'experience_years' => $f->experience_years,
                'courses_assigned' => $f->assigned_courses_count,
                'status' => $f->status,
            ]),
        ]);
    }
}
```

### Routing for Hierarchical Controllers

Add these routes to `routes/api.php`:

```php
// Hierarchical Navigation Routes
Route::middleware(['auth:sanctum', 'role:bitflow_owner'])->prefix('admin')->group(function () {
    // University Hub
    Route::get('universities/{universityId}', [UniversityHubController::class, 'show']);
    Route::get('universities/{universityId}/management', [UniversityHubController::class, 'management']);
    Route::get('universities/{universityId}/colleges', [UniversityHubController::class, 'colleges']);
    Route::get('universities/{universityId}/settings', [UniversityHubController::class, 'getSettings']);
    Route::put('universities/{universityId}/settings', [UniversityHubController::class, 'updateSettings']);

    // College Hub
    Route::get('universities/{universityId}/colleges/{collegeId}', [CollegeHubController::class, 'show']);
    Route::get('universities/{universityId}/colleges/{collegeId}/leadership', [CollegeHubController::class, 'leadership']);
    
    // Departments
    Route::get('universities/{universityId}/colleges/{collegeId}/departments', [CollegeHubController::class, 'departments']);
    Route::post('universities/{universityId}/colleges/{collegeId}/departments', [CollegeHubController::class, 'createDepartment']);
    
    // Students
    Route::get('universities/{universityId}/colleges/{collegeId}/students', [CollegeHubController::class, 'students']);
    Route::get('universities/{universityId}/colleges/{collegeId}/students/{studentId}', [CollegeHubController::class, 'student']);
    
    // Faculty
    Route::get('universities/{universityId}/colleges/{collegeId}/academic-staff', [CollegeHubController::class, 'academicStaff']);
    
    // Additional sections can be added here...
});
```

### Validation Middleware for Hierarchical Routes

Create a middleware to validate university → college hierarchy:

**Location**: `app/Http/Middleware/ValidateHierarchy.php`

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\University;
use App\Models\College;

class ValidateHierarchy
{
    public function handle(Request $request, Closure $next)
    {
        $universityId = $request->route('universityId');
        $collegeId = $request->route('collegeId');

        // Validate university exists
        $university = University::find($universityId);
        if (!$university) {
            return response()->json(['message' => 'University not found'], 404);
        }

        // If college ID is present, validate it belongs to the university
        if ($collegeId) {
            $college = College::where('id', $collegeId)
                ->where('university_id', $universityId)
                ->first();
                
            if (!$college) {
                return response()->json(['message' => 'College not found or does not belong to this university'], 404);
            }
        }

        return $next($request);
    }
}
```

Apply this middleware to hierarchical routes:

```php
Route::middleware(['auth:sanctum', 'role:bitflow_owner', 'validate.hierarchy'])
    ->prefix('admin')
    ->group(function () {
        // All hierarchical routes...
    });
```

### Best Practices for Hierarchical Controllers

1. **Always validate the hierarchy** - Ensure child resources belong to parent resources
2. **Use route model binding** - Let Laravel automatically resolve models from route parameters
3. **Eager load relationships** - Use `with()` to prevent N+1 queries
4. **Use consistent response formats** - All hierarchical endpoints should return data in the same structure
5. **Add query scopes** - Create reusable query scopes for common filters (by status, search, etc.)
6. **Cache hub data** - University and college hub data can be cached for performance
7. **Log hierarchical access** - Track which admins are accessing which universities/colleges

---

## Request Validation

### app/Http/Requests/Admin/CreateUniversityRequest.php

```php
<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CreateUniversityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->user()->role === 'bitflow_owner';
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|min:3|max:200|unique:universities,name',
            'primary_email' => 'required|email|unique:universities,primary_email',
            'primary_phone' => 'required|string|regex:/^\+?[1-9]\d{1,14}$/',
            'logo_url' => 'nullable|url',
            'storage_quota_gb' => 'required|integer|min:50|max:10000',
            'subscription_plan' => 'required|in:basic,pro,enterprise',
        ];
    }

    public function messages(): array
    {
        return [
            'name.unique' => 'A university with this name already exists.',
            'primary_email.unique' => 'This email is already registered to another university.',
            'primary_phone.regex' => 'Phone number must be in international format (e.g., +1-555-1234).',
            'storage_quota_gb.min' => 'Minimum storage quota is 50 GB.',
            'storage_quota_gb.max' => 'Maximum storage quota is 10,000 GB.',
        ];
    }
}
```

---

## API Resources (DTOs)

### app/Http/Resources/UniversityResource.php

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UniversityResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'domain' => $this->domain,
            'slug' => $this->slug,
            'primary_email' => $this->primary_email,
            'primary_phone' => $this->primary_phone,
            'logo_url' => $this->logo_url,
            'status' => $this->status,
            'storage_quota_gb' => $this->storage_quota_gb,
            'storage_used_gb' => $this->storage_used_gb,
            'storage_percentage' => round(($this->storage_used_gb / $this->storage_quota_gb) * 100, 2),
            'api_rate_limit' => $this->api_rate_limit,
            'total_users' => $this->total_users ?? $this->users()->count(),
            'subscription_plan' => $this->subscription_plan,
            'subscription_status' => $this->subscription_status,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
            'last_activity_at' => $this->last_activity_at?->toISOString(),
        ];
    }
}
```

---

## Models

### app/Models/University.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Spatie\Activitylog\LogsActivity;
use Spatie\Activitylog\Traits\LogsActivity as LogsActivityTrait;

class University extends Model
{
    use HasUuids, LogsActivityTrait;

    protected $fillable = [
        'name',
        'domain',
        'slug',
        'primary_email',
        'primary_phone',
        'logo_url',
        'status',
        'storage_quota_gb',
        'storage_used_gb',
        'api_rate_limit',
        'subscription_plan',
        'subscription_status',
        'last_activity_at',
    ];

    protected $casts = [
        'storage_quota_gb' => 'integer',
        'storage_used_gb' => 'float',
        'api_rate_limit' => 'integer',
        'last_activity_at' => 'datetime',
    ];

    protected static $logAttributes = ['*'];
    protected static $logOnlyDirty = true;

    // Relationships
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function colleges(): HasMany
    {
        return $this->hasMany(College::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeOverStorageLimit($query)
    {
        return $query->whereRaw('storage_used_gb >= storage_quota_gb * 0.9');
    }

    // Accessors
    public function getStoragePercentageAttribute(): float
    {
        if ($this->storage_quota_gb == 0) return 0;
        return round(($this->storage_used_gb / $this->storage_quota_gb) * 100, 2);
    }
}
```

---

## Services

### app/Services/UniversityService.php

```php
<?php

namespace App\Services;

use App\Models\University;
use App\Models\User;
use App\Events\UniversityCreated;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UniversityService
{
    /**
     * Create new university with initial setup
     */
    public function create(array $data): University
    {
        return DB::transaction(function () use ($data) {
            // Create university
            $university = University::create($data);

            // Create subscription record
            $university->subscription()->create([
                'plan' => $data['subscription_plan'],
                'status' => 'trial',
                'trial_ends_at' => now()->addDays(30),
            ]);

            // Create default university owner user
            $owner = User::create([
                'name' => 'University Admin',
                'email' => $data['primary_email'],
                'password' => Hash::make(Str::random(16)), // Temporary password
                'university_id' => $university->id,
                'role' => 'university_owner',
                'status' => 'active',
            ]);

            // Send welcome email
            event(new UniversityCreated($university, $owner));

            return $university;
        });
    }

    /**
     * Get usage statistics for a university
     */
    public function getUsageStatistics(string $universityId): array
    {
        $university = University::findOrFail($universityId);

        return [
            'total_users' => $university->users()->count(),
            'active_today' => $university->users()->where('last_login_at', '>=', now()->startOfDay())->count(),
            'storage_used_gb' => $university->storage_used_gb,
            'api_calls_24h' => $this->getApiCalls24h($universityId),
            'colleges_count' => $university->colleges()->count(),
            'programs_count' => $university->programs()->count(),
            'students_count' => $university->students()->count(),
            'faculty_count' => $university->faculty()->count(),
            'user_growth' => $this->getUserGrowthData($universityId),
            'storage_breakdown' => $this->getStorageBreakdown($universityId),
        ];
    }

    /**
     * Delete university and all associated data
     */
    public function delete(University $university): void
    {
        DB::transaction(function () use ($university) {
            // Delete all related data
            $university->users()->delete();
            $university->colleges()->delete();
            $university->subscription()->delete();
            $university->invoices()->delete();
            
            // Delete university
            $university->delete();
        });
    }

    // Private helper methods
    private function getApiCalls24h(string $universityId): int
    {
        // Query from API logs or Redis
        return DB::table('api_logs')
            ->where('university_id', $universityId)
            ->where('created_at', '>=', now()->subDay())
            ->count();
    }

    private function getUserGrowthData(string $universityId): array
    {
        // Get user count by month for last 6 months
        return DB::table('users')
            ->where('university_id', $universityId)
            ->select(DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'), DB::raw('COUNT(*) as count'))
            ->groupBy('month')
            ->orderBy('month')
            ->limit(6)
            ->get()
            ->toArray();
    }

    private function getStorageBreakdown(string $universityId): array
    {
        // Calculate storage by module
        return [
            ['module' => 'Documents', 'size' => 150],
            ['module' => 'Media', 'size' => 320],
            ['module' => 'Assignments', 'size' => 80],
            ['module' => 'Backups', 'size' => 200],
        ];
    }
}
```

---

## Middleware

### app/Http/Middleware/EnsureBitflowOwner.php

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureBitflowOwner
{
    public function handle(Request $request, Closure $next)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        if (auth()->user()->role !== 'bitflow_owner') {
            return response()->json([
                'message' => 'Forbidden. Bitflow Owner role required.'
            ], 403);
        }

        return $next($request);
    }
}
```

---

## Jobs (Background Processing)

### app/Jobs/GenerateMonthlyInvoices.php

```php
<?php

namespace App\Jobs;

use App\Models\University;
use App\Models\Invoice;
use App\Services\BillingService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class GenerateMonthlyInvoices implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function handle(BillingService $billingService): void
    {
        $universities = University::where('subscription_status', 'active')->get();

        foreach ($universities as $university) {
            $billingService->generateInvoice($university);
        }
    }
}
```

---

## Error Handling

### Custom Error Codes

```php
// config/error_codes.php
return [
    'UNIVERSITY_NOT_FOUND' => 'UNV001',
    'UNIVERSITY_NAME_EXISTS' => 'UNV002',
    'UNIVERSITY_HAS_ACTIVE_USERS' => 'UNV003',
    'STORAGE_QUOTA_EXCEEDED' => 'UNV004',
    'INVALID_SUBSCRIPTION_PLAN' => 'BIL001',
    'PAYMENT_FAILED' => 'BIL002',
    'INVOICE_NOT_FOUND' => 'BIL003',
];
```

### Exception Handler

```php
// app/Exceptions/Handler.php
public function render($request, Throwable $exception)
{
    if ($exception instanceof ModelNotFoundException) {
        return response()->json([
            'message' => 'Resource not found',
            'code' => 'NOT_FOUND'
        ], 404);
    }

    if ($exception instanceof ValidationException) {
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $exception->errors()
        ], 422);
    }

    return parent::render($request, $exception);
}
```

---

## Testing

### Feature Test Example

```php
// tests/Feature/Admin/UniversityControllerTest.php
namespace Tests\Feature\Admin;

use Tests\TestCase;
use App\Models\User;
use App\Models\University;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UniversityControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_bitflow_owner_can_create_university()
    {
        $owner = User::factory()->bitflowOwner()->create();

        $response = $this->actingAs($owner)->postJson('/api/admin/universities', [
            'name' => 'Test University',
            'primary_email' => 'admin@test.edu',
            'primary_phone' => '+1-555-1234',
            'storage_quota_gb' => 500,
            'subscription_plan' => 'pro',
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure(['id', 'name', 'domain', 'slug']);
        $this->assertDatabaseHas('universities', ['name' => 'Test University']);
    }

    public function test_non_owner_cannot_create_university()
    {
        $admin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($admin)->postJson('/api/admin/universities', [
            'name' => 'Test University',
            'primary_email' => 'admin@test.edu',
            'primary_phone' => '+1-555-1234',
            'storage_quota_gb' => 500,
            'subscription_plan' => 'pro',
        ]);

        $response->assertStatus(403);
    }
}
```

---

## Performance Optimization

### Query Optimization

```php
// Use eager loading
University::with(['subscription', 'owner'])->get();

// Use select to fetch only needed columns
University::select('id', 'name', 'status')->get();

// Use chunk for large datasets
University::chunk(100, function ($universities) {
    foreach ($universities as $university) {
        // Process
    }
});
```

### Caching

```php
// Cache expensive queries
$stats = Cache::remember('platform.stats', 300, function () {
    return [
        'total_universities' => University::count(),
        'total_users' => User::count(),
    ];
});
```

---

**End of Backend Guide**
