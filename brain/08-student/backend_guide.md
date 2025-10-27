# Student Portal - Backend Implementation Guide

**Version**: 2.0  
**Framework**: Laravel 11 + PHP 8.3  
**Last Updated**: October 25, 2025

---

## Directory Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Student/
│   │       ├── StudentController.php
│   │       ├── CourseController.php
│   │       ├── AttendanceController.php
│   │       ├── GradeController.php
│   │       ├── AssignmentController.php
│   │       ├── TimetableController.php
│   │       ├── FeeController.php
│   │       ├── NotificationController.php
│   │       └── SupportController.php
│   ├── Requests/
│   │   └── Student/
│   │       ├── UpdateProfileRequest.php
│   │       ├── SubmitAssignmentRequest.php
│   │       ├── ChangePasswordRequest.php
│   │       └── CreateTicketRequest.php
│   ├── Resources/
│   │   ├── StudentResource.php
│   │   ├── CourseResource.php
│   │   ├── EnrollmentResource.php
│   │   ├── AttendanceResource.php
│   │   ├── GradeResource.php
│   │   ├── AssignmentResource.php
│   │   ├── SubmissionResource.php
│   │   ├── FeeStructureResource.php
│   │   ├── InvoiceResource.php
│   │   ├── FeePaymentResource.php
│   │   └── NotificationResource.php
│   └── Middleware/
│       ├── EnsureStudentRole.php
│       └── CheckStudentOwnership.php
├── Models/
│   ├── Student.php
│   ├── Enrollment.php
│   ├── Attendance.php
│   ├── Grade.php
│   ├── Assignment.php
│   ├── Submission.php
│   ├── FeeStructure.php
│   ├── Invoice.php
│   ├── FeePayment.php
│   └── Notification.php
├── Services/
│   ├── StudentService.php
│   ├── AttendanceService.php
│   ├── GradeService.php
│   ├── AssignmentService.php
│   ├── FeeService.php
│   └── PaymentService.php
├── Policies/
│   ├── StudentPolicy.php
│   ├── AttendancePolicy.php
│   ├── GradePolicy.php
│   ├── AssignmentPolicy.php
│   └── SubmissionPolicy.php
└── Events/
    ├── AssignmentSubmitted.php
    ├── GradePosted.php
    └── FeePaymentCompleted.php
```

---

## Models

### app/Models/Student.php

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Student extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'college_id',
        'department_id',
        'university_id',
        'roll_number',
        'enrollment_year',
        'current_semester',
        'status',
        'dob',
        'gender',
        'blood_group',
        'address',
        'guardian_name',
        'guardian_phone',
        'guardian_relationship',
    ];

    protected $casts = [
        'dob' => 'date',
        'enrollment_year' => 'integer',
        'current_semester' => 'integer',
    ];

    protected $with = ['user', 'college', 'department'];

    // Relationships
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

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function attendance(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(FeePayment::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeForUniversity($query, $universityId)
    {
        return $query->where('university_id', $universityId);
    }

    // Accessors & Mutators
    public function getCgpaAttribute()
    {
        return $this->calculateCGPA();
    }

    public function getAttendancePercentageAttribute()
    {
        $totalClasses = $this->attendance()->count();
        if ($totalClasses === 0) return 0;

        $presentClasses = $this->attendance()->where('status', 'present')->count();
        return round(($presentClasses / $totalClasses) * 100, 2);
    }

    // Helper Methods
    public function calculateCGPA(): float
    {
        $enrollments = $this->enrollments()
            ->where('status', 'completed')
            ->whereNotNull('grade_points')
            ->with('course')
            ->get();

        if ($enrollments->isEmpty()) return 0.0;

        $totalCredits = 0;
        $weightedSum = 0;

        foreach ($enrollments as $enrollment) {
            $credits = $enrollment->course->credits;
            $totalCredits += $credits;
            $weightedSum += $credits * $enrollment->grade_points;
        }

        return $totalCredits > 0 ? round($weightedSum / $totalCredits, 2) : 0.0;
    }

    public function getPendingAssignmentsCount(): int
    {
        $courseIds = $this->enrollments()
            ->where('status', 'enrolled')
            ->pluck('course_id');

        $submittedAssignmentIds = $this->submissions()->pluck('assignment_id');

        return Assignment::whereIn('course_id', $courseIds)
            ->whereNotIn('id', $submittedAssignmentIds)
            ->where('due_date', '>', now())
            ->count();
    }

    public function getOutstandingFees()
    {
        return $this->invoices()
            ->whereIn('status', ['pending', 'partial', 'overdue'])
            ->sum('balance');
    }
}
```

---

## Controllers

### app/Http/Controllers/Student/StudentController.php

```php
<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\UpdateProfileRequest;
use App\Http\Resources\StudentResource;
use App\Models\Student;
use App\Services\StudentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function __construct(
        private StudentService $studentService
    ) {}

    public function me(Request $request): JsonResponse
    {
        $student = Student::where('user_id', $request->user()->id)
            ->firstOrFail();

        $this->authorize('view', $student);

        return response()->json([
            'data' => new StudentResource($student),
        ]);
    }

    public function dashboard(Student $student): JsonResponse
    {
        $this->authorize('view', $student);

        $data = [
            'student' => new StudentResource($student),
            'stats' => [
                'current_semester' => $student->current_semester,
                'cgpa' => $student->cgpa,
                'attendance_percentage' => $student->attendance_percentage,
                'pending_assignments' => $student->getPendingAssignmentsCount(),
                'outstanding_fees' => $student->getOutstandingFees(),
            ],
            'upcoming_deadlines' => $this->studentService->getUpcomingDeadlines($student),
            'recent_grades' => $this->studentService->getRecentGrades($student, 5),
            'today_classes' => $this->studentService->getTodayClasses($student),
            'announcements' => $this->studentService->getRecentAnnouncements($student, 3),
        ];

        return response()->json(['data' => $data]);
    }

    public function update(UpdateProfileRequest $request, Student $student): JsonResponse
    {
        $this->authorize('update', $student);

        $student->update($request->validated());

        // Log the update in audit logs
        activity()
            ->performedOn($student)
            ->causedBy($request->user())
            ->withProperties(['changes' => $request->validated()])
            ->log('Student profile updated');

        return response()->json([
            'data' => new StudentResource($student->fresh()),
            'message' => 'Profile updated successfully',
        ]);
    }

    public function uploadPhoto(Request $request, Student $student): JsonResponse
    {
        $this->authorize('update', $student);

        $request->validate([
            'photo' => 'required|image|max:2048', // 2MB
        ]);

        $path = $request->file('photo')->store('student-photos', 's3');
        $url = Storage::disk('s3')->url($path);

        $student->user->update(['avatar_url' => $url]);

        return response()->json([
            'data' => ['avatar_url' => $url],
            'message' => 'Photo uploaded successfully',
        ]);
    }
}
```

### app/Http/Controllers/Student/AssignmentController.php

```php
<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\SubmitAssignmentRequest;
use App\Http\Resources\AssignmentResource;
use App\Http\Resources\SubmissionResource;
use App\Models\Assignment;
use App\Models\Student;
use App\Models\Submission;
use App\Events\AssignmentSubmitted;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AssignmentController extends Controller
{
    public function index(Request $request, Student $student): JsonResponse
    {
        $this->authorize('view', $student);

        $query = Assignment::query()
            ->whereIn('course_id', $student->enrollments()
                ->where('status', 'enrolled')
                ->pluck('course_id'))
            ->with(['course', 'submissions' => function ($q) use ($student) {
                $q->where('student_id', $student->id);
            }]);

        // Filters
        if ($request->has('status')) {
            switch ($request->status) {
                case 'pending':
                    $query->doesntHave('submissions')
                        ->where('due_date', '>', now());
                    break;
                case 'submitted':
                    $query->whereHas('submissions', function ($q) use ($student) {
                        $q->where('student_id', $student->id);
                    });
                    break;
                case 'graded':
                    $query->whereHas('submissions', function ($q) use ($student) {
                        $q->where('student_id', $student->id)
                          ->whereNotNull('graded_at');
                    });
                    break;
            }
        }

        if ($request->has('course_id')) {
            $query->where('course_id', $request->course_id);
        }

        $assignments = $query->orderBy('due_date', 'asc')->paginate(20);

        return response()->json([
            'data' => AssignmentResource::collection($assignments),
            'meta' => [
                'current_page' => $assignments->currentPage(),
                'per_page' => $assignments->perPage(),
                'total' => $assignments->total(),
            ],
        ]);
    }

    public function show(Assignment $assignment): JsonResponse
    {
        $student = Student::where('user_id', auth()->id())->firstOrFail();

        // Check if student is enrolled in the course
        $enrolled = $student->enrollments()
            ->where('course_id', $assignment->course_id)
            ->where('status', 'enrolled')
            ->exists();

        if (!$enrolled) {
            abort(403, 'You are not enrolled in this course');
        }

        $assignment->load(['course', 'submissions' => function ($q) use ($student) {
            $q->where('student_id', $student->id);
        }]);

        return response()->json([
            'data' => new AssignmentResource($assignment),
        ]);
    }

    public function submit(SubmitAssignmentRequest $request, Assignment $assignment): JsonResponse
    {
        $student = Student::where('user_id', auth()->id())->firstOrFail();

        // Check if student is enrolled
        $enrolled = $student->enrollments()
            ->where('course_id', $assignment->course_id)
            ->where('status', 'enrolled')
            ->exists();

        if (!$enrolled) {
            abort(403, 'You are not enrolled in this course');
        }

        // Check if already submitted
        $existingSubmission = Submission::where('assignment_id', $assignment->id)
            ->where('student_id', $student->id)
            ->first();

        if ($existingSubmission) {
            return response()->json([
                'message' => 'You have already submitted this assignment',
            ], 422);
        }

        // Upload file to S3
        $file = $request->file('file');
        $path = $file->store("submissions/{$assignment->id}", 's3');
        $url = Storage::disk('s3')->url($path);

        // Check if late submission
        $isLate = now()->gt($assignment->due_date);

        // Create submission
        $submission = Submission::create([
            'assignment_id' => $assignment->id,
            'student_id' => $student->id,
            'university_id' => $student->university_id,
            'file_url' => $url,
            'file_name' => $file->getClientOriginalName(),
            'file_size' => $file->getSize(),
            'file_type' => $file->getMimeType(),
            'is_late' => $isLate,
            'comments' => $request->comments,
            'status' => 'submitted',
        ]);

        // Dispatch event
        event(new AssignmentSubmitted($submission));

        // Log activity
        activity()
            ->performedOn($submission)
            ->causedBy($student->user)
            ->log('Assignment submitted');

        return response()->json([
            'data' => new SubmissionResource($submission),
            'message' => 'Assignment submitted successfully',
        ], 201);
    }
}
```

---

## Services

### app/Services/StudentService.php

```php
<?php

namespace App\Services;

use App\Models\Student;
use App\Models\Assignment;
use App\Models\Announcement;
use App\Models\ClassSchedule;
use Carbon\Carbon;

class StudentService
{
    public function getUpcomingDeadlines(Student $student, int $limit = 5): array
    {
        $courseIds = $student->enrollments()
            ->where('status', 'enrolled')
            ->pluck('course_id');

        $submittedAssignmentIds = $student->submissions()->pluck('assignment_id');

        $assignments = Assignment::whereIn('course_id', $courseIds)
            ->whereNotIn('id', $submittedAssignmentIds)
            ->where('due_date', '>', now())
            ->orderBy('due_date', 'asc')
            ->limit($limit)
            ->with('course')
            ->get();

        return $assignments->map(function ($assignment) {
            return [
                'id' => $assignment->id,
                'title' => $assignment->title,
                'course' => $assignment->course->code . ' - ' . $assignment->course->name,
                'due_date' => $assignment->due_date,
                'days_remaining' => now()->diffInDays($assignment->due_date),
            ];
        })->toArray();
    }

    public function getRecentGrades(Student $student, int $limit = 5): array
    {
        return $student->grades()
            ->with('course')
            ->orderBy('graded_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($grade) {
                return [
                    'id' => $grade->id,
                    'course' => $grade->course->code . ' - ' . $grade->course->name,
                    'component' => $grade->component_name,
                    'marks' => $grade->marks_obtained . '/' . $grade->max_marks,
                    'percentage' => round(($grade->marks_obtained / $grade->max_marks) * 100, 2),
                    'grade' => $grade->grade,
                    'graded_at' => $grade->graded_at,
                ];
            })
            ->toArray();
    }

    public function getTodayClasses(Student $student): array
    {
        $today = Carbon::today();
        $dayOfWeek = $today->dayOfWeek; // 0 = Sunday, 6 = Saturday

        $enrollments = $student->enrollments()
            ->where('status', 'enrolled')
            ->with('course.timetables.classSchedules')
            ->get();

        $classes = [];

        foreach ($enrollments as $enrollment) {
            foreach ($enrollment->course->timetables as $timetable) {
                if ($timetable->is_active && $today->between($timetable->effective_from, $timetable->effective_to)) {
                    foreach ($timetable->classSchedules->where('day_of_week', $dayOfWeek) as $schedule) {
                        $classes[] = [
                            'course_code' => $enrollment->course->code,
                            'course_name' => $enrollment->course->name,
                            'start_time' => $schedule->start_time,
                            'end_time' => $schedule->end_time,
                            'room_number' => $schedule->room_number,
                            'building' => $schedule->building,
                            'faculty_name' => $schedule->faculty?->user->name,
                        ];
                    }
                }
            }
        }

        // Sort by start time
        usort($classes, function ($a, $b) {
            return strcmp($a['start_time'], $b['start_time']);
        });

        return $classes;
    }

    public function getRecentAnnouncements(Student $student, int $limit = 3): array
    {
        return Announcement::where('university_id', $student->university_id)
            ->where(function ($query) use ($student) {
                $query->whereNull('college_id')
                    ->orWhere('college_id', $student->college_id);
            })
            ->where(function ($query) {
                $query->whereJsonContains('target_roles', 'student')
                    ->orWhereNull('target_roles');
            })
            ->where('published_at', '<=', now())
            ->where(function ($query) {
                $query->where('expires_at', '>', now())
                    ->orWhereNull('expires_at');
            })
            ->orderBy('published_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($announcement) {
                return [
                    'id' => $announcement->id,
                    'title' => $announcement->title,
                    'content' => $announcement->content,
                    'published_at' => $announcement->published_at,
                ];
            })
            ->toArray();
    }
}
```

---

## Policies

### app/Policies/StudentPolicy.php

```php
<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Student;

class StudentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('students.read');
    }

    public function view(User $user, Student $student): bool
    {
        // Students can only view their own data
        if ($user->hasRole('student')) {
            return $student->user_id === $user->id;
        }

        // Other roles with permission can view
        return $user->hasPermissionTo('students.read');
    }

    public function update(User $user, Student $student): bool
    {
        // Students can only update their own profile
        if ($user->hasRole('student')) {
            return $student->user_id === $user->id;
        }

        return $user->hasPermissionTo('students.update');
    }
}
```

---

## API Routes

### routes/api.php (Student Portal routes)

```php
Route::prefix('students')->middleware(['auth:sanctum', 'role:student'])->group(function () {
    // Student Profile
    Route::get('/me', [StudentController::class, 'me']);
    Route::get('/{student}/dashboard', [StudentController::class, 'dashboard']);
    Route::put('/{student}', [StudentController::class, 'update']);
    Route::post('/{student}/photo', [StudentController::class, 'uploadPhoto']);

    // Courses
    Route::get('/{student}/courses', [CourseController::class, 'index']);
    
    // Attendance
    Route::get('/{student}/attendance', [AttendanceController::class, 'index']);
    Route::get('/{student}/attendance/summary', [AttendanceController::class, 'summary']);
    
    // Grades
    Route::get('/{student}/grades', [GradeController::class, 'index']);
    Route::get('/{student}/grades/cgpa', [GradeController::class, 'cgpa']);
    
    // Assignments
    Route::get('/{student}/assignments', [AssignmentController::class, 'index']);
    Route::get('/assignments/{assignment}', [AssignmentController::class, 'show']);
    Route::post('/assignments/{assignment}/submit', [AssignmentController::class, 'submit']);
    
    // Timetable
    Route::get('/{student}/timetable', [TimetableController::class, 'index']);
    
    // Fees
    Route::get('/{student}/fees', [FeeController::class, 'index']);
    Route::get('/{student}/invoices', [FeeController::class, 'invoices']);
    Route::get('/{student}/payments', [FeeController::class, 'payments']);
    Route::post('/payments/initiate', [FeeController::class, 'initiatePayment']);
    
    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::put('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
});
```

---

**🚀 This backend guide provides the complete Laravel implementation for the Student Portal API.**
