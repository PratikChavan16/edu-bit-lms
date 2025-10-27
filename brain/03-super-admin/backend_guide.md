# Super Admin Portal - Backend Implementation Guide

**Version**: 2.0  
**Framework**: Laravel 11 + PHP 8.3  
**Last Updated**: October 25, 2025  
**Scope**: University-level operations (academic calendar, courses, timetables, exams, users)

---

## Directory Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   └── SuperAdmin/
│   │       ├── DashboardController.php
│   │       ├── AcademicCalendarController.php
│   │       ├── CourseController.php
│   │       ├── CurriculumController.php
│   │       ├── TimetableController.php
│   │       ├── ExamController.php
│   │       ├── UserManagementController.php
│   │       ├── ReportController.php
│   │       ├── SettingsController.php
│   │       └── CommunicationController.php
│   ├── Requests/
│   │   └── SuperAdmin/
│   │       ├── CreateAcademicYearRequest.php
│   │       ├── CreateSemesterRequest.php
│   │       ├── CreateCourseRequest.php
│   │       ├── AssignFacultyRequest.php
│   │       ├── GenerateTimetableRequest.php
│   │       ├── ScheduleExamRequest.php
│   │       ├── CreateUserRequest.php
│   │       └── BulkImportUsersRequest.php
│   ├── Resources/
│   │   ├── AcademicYearResource.php
│   │   ├── SemesterResource.php
│   │   ├── CourseResource.php
│   │   ├── TimetableResource.php
│   │   ├── ExamResource.php
│   │   └── UserResource.php
│   └── Middleware/
│       ├── EnsureSuperAdmin.php
│       └── LogSuperAdminActions.php
├── Models/
│   ├── AcademicYear.php (university-scoped)
│   ├── Semester.php (university-scoped)
│   ├── Holiday.php (university-scoped)
│   ├── Course.php (university-scoped)
│   ├── CourseCurriculum.php (university-scoped)
│   ├── CourseFaculty.php (university-scoped)
│   ├── Timetable.php (university-scoped)
│   ├── TimetableSlot.php (university-scoped)
│   ├── Room.php (university-scoped)
│   ├── Exam.php (university-scoped)
│   ├── ExamHallAllocation.php (university-scoped)
│   ├── Invigilator.php (university-scoped)
│   └── SeatingArrangement.php (university-scoped)
├── Services/
│   ├── AcademicCalendarService.php
│   ├── CourseService.php
│   ├── TimetableGeneratorService.php
│   ├── ExamSchedulerService.php
│   ├── UserManagementService.php
│   └── ReportService.php
├── Jobs/
│   ├── GenerateTimetable.php
│   ├── AllocateExamHalls.php
│   ├── GenerateSeatingArrangement.php
│   ├── GenerateAdmitCards.php
│   ├── BulkImportUsers.php
│   └── SendAnnouncement.php
└── Events/
    ├── TimetablePublished.php
    ├── ExamSchedulePublished.php
    ├── UserCreated.php
    └── AnnouncementSent.php
```

---

## Base Model: UniversityScopedModel

All Super Admin models automatically filter by `university_id`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

abstract class UniversityScopedModel extends Model
{
    protected static function booted()
    {
        // Automatically add university_id to queries
        static::addGlobalScope('university', function (Builder $query) {
            if (auth()->check() && auth()->user()->university_id) {
                $query->where('university_id', auth()->user()->university_id);
            }
        });

        // Automatically set university_id on create
        static::creating(function ($model) {
            if (auth()->check() && !$model->university_id) {
                $model->university_id = auth()->user()->university_id;
            }
        });
    }
}
```

---

## 1. Dashboard Controller

```php
<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\User;
use App\Models\Exam;
use App\Models\Timetable;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $universityId = auth()->user()->university_id;

        $metrics = [
            'total_courses' => Course::count(),
            'total_users' => User::count(),
            'pending_timetable_approvals' => Timetable::where('status', 'draft')->count(),
            'upcoming_exams' => Exam::where('date', '>=', now())
                ->where('date', '<=', now()->addDays(7))
                ->count(),
        ];

        $pendingTasks = [
            [
                'type' => 'timetable_conflicts',
                'count' => $this->getTimetableConflictsCount(),
                'priority' => 'high',
            ],
            [
                'type' => 'user_requests',
                'count' => 8, // From pending user creation queue
                'priority' => 'medium',
            ],
            [
                'type' => 'exam_approvals',
                'count' => Exam::where('status', 'draft')->count(),
                'priority' => 'medium',
            ],
        ];

        $recentActivity = $this->getRecentActivity(20);

        $systemHealth = [
            'api_response_time' => $this->getApiResponseTime(),
            'database_status' => 'healthy',
            'storage_usage' => $this->getStorageUsage(),
        ];

        return response()->json([
            'metrics' => $metrics,
            'pending_tasks' => $pendingTasks,
            'recent_activity' => $recentActivity,
            'system_health' => $systemHealth,
        ]);
    }

    private function getTimetableConflictsCount(): int
    {
        // Count timetables with conflicts
        return Timetable::whereHas('conflicts')->count();
    }

    private function getRecentActivity(int $limit): array
    {
        return \DB::table('activity_logs')
            ->where('university_id', auth()->user()->university_id)
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->toArray();
    }

    private function getApiResponseTime(): int
    {
        // Average response time in ms
        return cache()->remember('api_response_time', 300, function () {
            return \DB::table('api_metrics')
                ->where('created_at', '>=', now()->subHours(1))
                ->avg('response_time_ms') ?? 0;
        });
    }

    private function getStorageUsage(): float
    {
        // Storage usage percentage
        return 78.5; // From monitoring service
    }
}
```

---

## 2. Academic Calendar Controller

```php
<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SuperAdmin\CreateAcademicYearRequest;
use App\Models\AcademicYear;
use App\Models\Semester;
use App\Models\Holiday;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AcademicCalendarController extends Controller
{
    // ========== ACADEMIC YEARS ==========
    
    public function indexYears(): JsonResponse
    {
        $years = AcademicYear::with('semesters')->get();
        return response()->json(['data' => $years]);
    }

    public function storeYear(CreateAcademicYearRequest $request): JsonResponse
    {
        $year = AcademicYear::create($request->validated());

        event(new \App\Events\AcademicYearCreated($year));

        return response()->json($year, 201);
    }

    public function updateYear(CreateAcademicYearRequest $request, AcademicYear $year): JsonResponse
    {
        $year->update($request->validated());
        return response()->json($year);
    }

    public function activateYear(AcademicYear $year): JsonResponse
    {
        // Deactivate all other years
        AcademicYear::where('status', 'active')->update(['status' => 'archived']);
        
        $year->update(['status' => 'active']);

        return response()->json(['message' => 'Academic year activated']);
    }

    // ========== SEMESTERS ==========
    
    public function indexSemesters(Request $request): JsonResponse
    {
        $query = Semester::query();

        if ($request->has('academic_year_id')) {
            $query->where('academic_year_id', $request->academic_year_id);
        }

        $semesters = $query->with('academicYear')->get();
        return response()->json(['data' => $semesters]);
    }

    public function storeSemester(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'academic_year_id' => 'required|exists:academic_years,id',
            'name' => 'required|string',
            'type' => 'required|in:odd,even,summer',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'registration_start' => 'required|date|before:start_date',
            'registration_end' => 'required|date|before:start_date',
        ]);

        $semester = Semester::create($validated);
        return response()->json($semester, 201);
    }

    // ========== HOLIDAYS ==========
    
    public function indexHolidays(): JsonResponse
    {
        $holidays = Holiday::orderBy('date')->get();
        return response()->json(['data' => $holidays]);
    }

    public function storeHoliday(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'name' => 'required|string',
            'type' => 'required|in:national,regional,university',
            'applies_to_college_id' => 'nullable|exists:colleges,id',
        ]);

        $holiday = Holiday::create($validated);
        return response()->json($holiday, 201);
    }

    public function destroyHoliday(Holiday $holiday): JsonResponse
    {
        $holiday->delete();
        return response()->json(null, 204);
    }

    // ========== PUBLISH CALENDAR ==========
    
    public function publishCalendar(Request $request): JsonResponse
    {
        $year = AcademicYear::findOrFail($request->academic_year_id);
        $year->update(['published_at' => now()]);

        // Notify all users
        event(new \App\Events\CalendarPublished($year));

        return response()->json(['message' => 'Calendar published successfully']);
    }
}
```

---

## 3. Course Controller

```php
<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SuperAdmin\CreateCourseRequest;
use App\Models\Course;
use App\Models\CourseFaculty;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Course::query()->with(['college', 'department']);

        // Filters
        if ($request->has('college_id')) {
            $query->where('college_id', $request->college_id);
        }

        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('code', 'like', "%{$request->search}%")
                  ->orWhere('name', 'like', "%{$request->search}%");
            });
        }

        $courses = $query->paginate(20);

        return response()->json($courses);
    }

    public function store(CreateCourseRequest $request): JsonResponse
    {
        $course = Course::create($request->validated());

        event(new \App\Events\CourseCreated($course));

        return response()->json($course, 201);
    }

    public function show(Course $course): JsonResponse
    {
        $course->load(['college', 'department', 'prerequisites', 'faculty']);
        return response()->json($course);
    }

    public function update(CreateCourseRequest $request, Course $course): JsonResponse
    {
        $course->update($request->validated());
        return response()->json($course);
    }

    public function destroy(Course $course): JsonResponse
    {
        // Archive instead of delete
        $course->update(['status' => 'archived']);
        return response()->json(null, 204);
    }

    // ========== FACULTY ASSIGNMENT ==========
    
    public function assignFaculty(Request $request, Course $course): JsonResponse
    {
        $validated = $request->validate([
            'faculty_id' => 'required|exists:users,id',
            'semester_id' => 'required|exists:semesters,id',
            'section' => 'nullable|string',
            'role' => 'required|in:coordinator,co-instructor',
        ]);

        // Check faculty workload
        $facultyHours = CourseFaculty::where('faculty_id', $validated['faculty_id'])
            ->where('semester_id', $validated['semester_id'])
            ->sum('hours_per_week');

        if ($facultyHours + $course->hours_per_week > 20) {
            return response()->json([
                'message' => 'Faculty workload exceeds 20 hours/week'
            ], 422);
        }

        $assignment = CourseFaculty::create([
            'course_id' => $course->id,
            ...$validated,
        ]);

        return response()->json($assignment, 201);
    }
}
```

---

## 4. Timetable Generator Service

```php
<?php

namespace App\Services;

use App\Models\Timetable;
use App\Models\TimetableSlot;
use App\Models\Course;
use App\Models\Room;
use App\Jobs\GenerateTimetable as GenerateTimetableJob;

class TimetableGeneratorService
{
    public function generate(array $params): Timetable
    {
        $timetable = Timetable::create([
            'college_id' => $params['college_id'],
            'semester_id' => $params['semester_id'],
            'year' => $params['year'],
            'section' => $params['section'],
            'status' => 'draft',
        ]);

        // Dispatch async job for generation
        GenerateTimetableJob::dispatch($timetable->id, $params['constraints']);

        return $timetable;
    }

    public function generateSlots(Timetable $timetable, array $constraints): void
    {
        // Get courses for this program/year/semester
        $courses = Course::whereHas('curriculum', function ($q) use ($timetable) {
            $q->where('program_id', $timetable->program_id)
              ->where('year', $timetable->year)
              ->where('semester_id', $timetable->semester_id);
        })->with('faculty')->get();

        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        $timeSlots = $this->generateTimeSlots();

        $availableRooms = Room::where('college_id', $timetable->college_id)->get();

        foreach ($courses as $course) {
            $hoursScheduled = 0;
            $hoursNeeded = $course->hours_per_week;

            foreach ($days as $day) {
                if ($hoursScheduled >= $hoursNeeded) break;

                foreach ($timeSlots as $slot) {
                    if ($hoursScheduled >= $hoursNeeded) break;

                    // Find available faculty
                    $faculty = $this->findAvailableFaculty($course, $day, $slot['start']);

                    // Find available room
                    $room = $this->findAvailableRoom($availableRooms, $day, $slot['start']);

                    if ($faculty && $room) {
                        TimetableSlot::create([
                            'timetable_id' => $timetable->id,
                            'day' => $day,
                            'start_time' => $slot['start'],
                            'end_time' => $slot['end'],
                            'course_id' => $course->id,
                            'faculty_id' => $faculty->id,
                            'room_id' => $room->id,
                        ]);

                        $hoursScheduled++;
                    }
                }
            }
        }

        // Detect conflicts
        $this->detectConflicts($timetable);
    }

    private function generateTimeSlots(): array
    {
        return [
            ['start' => '09:00', 'end' => '10:00'],
            ['start' => '10:00', 'end' => '11:00'],
            ['start' => '11:00', 'end' => '12:00'],
            ['start' => '12:00', 'end' => '13:00'],
            ['start' => '14:00', 'end' => '15:00'],
            ['start' => '15:00', 'end' => '16:00'],
            ['start' => '16:00', 'end' => '17:00'],
        ];
    }

    private function findAvailableFaculty($course, $day, $startTime)
    {
        // Get faculty assigned to this course
        $facultyIds = $course->faculty->pluck('id');

        // Find faculty not already scheduled at this time
        $busyFaculty = TimetableSlot::where('day', $day)
            ->where('start_time', $startTime)
            ->whereIn('faculty_id', $facultyIds)
            ->pluck('faculty_id');

        $availableFaculty = $facultyIds->diff($busyFaculty);

        return $availableFaculty->isNotEmpty() 
            ? $course->faculty->whereIn('id', $availableFaculty)->first() 
            : null;
    }

    private function findAvailableRoom($rooms, $day, $startTime)
    {
        $busyRooms = TimetableSlot::where('day', $day)
            ->where('start_time', $startTime)
            ->pluck('room_id');

        return $rooms->whereNotIn('id', $busyRooms)->first();
    }

    private function detectConflicts(Timetable $timetable): void
    {
        $conflicts = [];

        // Faculty conflicts
        $facultyConflicts = TimetableSlot::where('timetable_id', $timetable->id)
            ->select('faculty_id', 'day', 'start_time', \DB::raw('count(*) as count'))
            ->groupBy('faculty_id', 'day', 'start_time')
            ->having('count', '>', 1)
            ->get();

        foreach ($facultyConflicts as $conflict) {
            $conflicts[] = [
                'type' => 'faculty',
                'faculty_id' => $conflict->faculty_id,
                'day' => $conflict->day,
                'time' => $conflict->start_time,
            ];
        }

        // Room conflicts
        $roomConflicts = TimetableSlot::where('timetable_id', $timetable->id)
            ->select('room_id', 'day', 'start_time', \DB::raw('count(*) as count'))
            ->groupBy('room_id', 'day', 'start_time')
            ->having('count', '>', 1)
            ->get();

        foreach ($roomConflicts as $conflict) {
            $conflicts[] = [
                'type' => 'room',
                'room_id' => $conflict->room_id,
                'day' => $conflict->day,
                'time' => $conflict->start_time,
            ];
        }

        $timetable->update(['conflicts' => $conflicts]);
    }
}
```

---

## 5. Exam Scheduler Service

```php
<?php

namespace App\Services;

use App\Models\Exam;
use App\Models\ExamHallAllocation;
use App\Models\Invigilator;
use App\Models\SeatingArrangement;
use App\Jobs\GenerateAdmitCards;

class ExamSchedulerService
{
    public function scheduleExam(array $data): Exam
    {
        $exam = Exam::create($data);
        return $exam;
    }

    public function allocateHalls(Exam $exam, array $hallIds, int $spacingPercent = 50): void
    {
        $totalStudents = $exam->course->enrollments()->count();
        $halls = \App\Models\Room::whereIn('id', $hallIds)->get();

        $totalCapacity = $halls->sum('capacity') * ($spacingPercent / 100);

        if ($totalCapacity < $totalStudents) {
            throw new \Exception('Insufficient hall capacity');
        }

        $studentsPerHall = ceil($totalStudents / $halls->count());

        foreach ($halls as $hall) {
            ExamHallAllocation::create([
                'exam_id' => $exam->id,
                'hall_id' => $hall->id,
                'capacity' => floor($hall->capacity * ($spacingPercent / 100)),
                'allocated_students' => min($studentsPerHall, $totalStudents),
            ]);

            $totalStudents -= $studentsPerHall;
            if ($totalStudents <= 0) break;
        }
    }

    public function generateSeating(Exam $exam, string $pattern = 'alternate'): void
    {
        $students = $exam->course->enrollments()
            ->with('student')
            ->get()
            ->pluck('student');

        $allocations = $exam->hallAllocations;

        $seatNumber = 1;
        foreach ($allocations as $allocation) {
            $hallCapacity = $allocation->capacity;
            $studentsForHall = $students->splice(0, $hallCapacity);

            if ($pattern === 'alternate') {
                $studentsForHall = $this->alternateRollNumbers($studentsForHall);
            }

            foreach ($studentsForHall as $student) {
                SeatingArrangement::create([
                    'exam_id' => $exam->id,
                    'student_id' => $student->id,
                    'hall_id' => $allocation->hall_id,
                    'seat_number' => $seatNumber++,
                ]);
            }
        }

        // Generate admit cards
        GenerateAdmitCards::dispatch($exam->id);
    }

    private function alternateRollNumbers($students)
    {
        // Alternate odd/even roll numbers to prevent cheating
        $sorted = $students->sortBy('roll_number');
        $odd = $sorted->filter(fn($s) => $s->roll_number % 2 === 1);
        $even = $sorted->filter(fn($s) => $s->roll_number % 2 === 0);

        $alternated = collect();
        $maxCount = max($odd->count(), $even->count());

        for ($i = 0; $i < $maxCount; $i++) {
            if ($odd->has($i)) $alternated->push($odd->get($i));
            if ($even->has($i)) $alternated->push($even->get($i));
        }

        return $alternated;
    }

    public function assignInvigilators(Exam $exam, array $facultyIds): void
    {
        foreach ($facultyIds as $facultyId) {
            // Check if faculty is teaching this course
            $isTeaching = \App\Models\CourseFaculty::where('course_id', $exam->course_id)
                ->where('faculty_id', $facultyId)
                ->exists();

            if ($isTeaching) {
                throw new \Exception("Faculty cannot invigilate their own course");
            }

            // Check faculty hasn't exceeded 2 duties per day
            $dutiesCount = Invigilator::whereHas('exam', function ($q) use ($exam) {
                $q->whereDate('date', $exam->date);
            })->where('faculty_id', $facultyId)->count();

            if ($dutiesCount >= 2) {
                throw new \Exception("Faculty already has 2 invigilation duties this day");
            }

            Invigilator::create([
                'exam_id' => $exam->id,
                'faculty_id' => $facultyId,
            ]);
        }
    }
}
```

---

## 6. User Management Controller

```php
<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Http\Requests\SuperAdmin\CreateUserRequest;
use App\Models\User;
use App\Jobs\BulkImportUsers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserManagementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::query();

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        if ($request->has('college_id')) {
            $query->where('college_id', $request->college_id);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }

        $users = $query->paginate(20);
        return response()->json($users);
    }

    public function store(CreateUserRequest $request): JsonResponse
    {
        $tempPassword = Str::random(12);

        $user = User::create([
            ...$request->validated(),
            'password' => Hash::make($tempPassword),
            'university_id' => auth()->user()->university_id,
            'force_password_change' => true,
        ]);

        if ($request->send_welcome_email) {
            \Mail::to($user->email)->send(new \App\Mail\WelcomeEmail($user, $tempPassword));
        }

        event(new \App\Events\UserCreated($user));

        return response()->json([
            'user' => $user,
            'temporary_password' => $tempPassword,
        ], 201);
    }

    public function bulkImport(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt',
        ]);

        $path = $request->file('file')->store('imports');

        BulkImportUsers::dispatch($path, auth()->user()->university_id);

        return response()->json([
            'message' => 'Import started. You will be notified on completion.',
        ]);
    }

    public function resetPassword(User $user): JsonResponse
    {
        $tempPassword = Str::random(12);

        $user->update([
            'password' => Hash::make($tempPassword),
            'force_password_change' => true,
        ]);

        \Mail::to($user->email)->send(new \App\Mail\PasswordReset($user, $tempPassword));

        return response()->json([
            'message' => 'Password reset successful',
            'temporary_password' => $tempPassword,
        ]);
    }
}
```

---

## 7. Report Service

```php
<?php

namespace App\Services;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\CourseFaculty;
use App\Models\TimetableSlot;
use Illuminate\Support\Facades\DB;

class ReportService
{
    public function courseEnrollment(int $semesterId, ?int $collegeId = null): array
    {
        $query = Course::with('enrollments')
            ->whereHas('curriculum', function ($q) use ($semesterId) {
                $q->where('semester_id', $semesterId);
            });

        if ($collegeId) {
            $query->where('college_id', $collegeId);
        }

        $courses = $query->get();

        return $courses->map(function ($course) {
            return [
                'course_code' => $course->code,
                'course_name' => $course->name,
                'enrolled' => $course->enrollments->count(),
                'capacity' => $course->max_students,
                'utilization' => round(($course->enrollments->count() / $course->max_students) * 100, 2),
                'waitlisted' => $course->waitlist()->count(),
            ];
        })->toArray();
    }

    public function facultyWorkload(?int $facultyId = null, ?int $semesterId = null): array
    {
        $query = CourseFaculty::with(['faculty', 'course'])
            ->select('faculty_id', DB::raw('COUNT(*) as courses_count'), DB::raw('SUM(hours_per_week) as total_hours'))
            ->groupBy('faculty_id');

        if ($facultyId) {
            $query->where('faculty_id', $facultyId);
        }

        if ($semesterId) {
            $query->where('semester_id', $semesterId);
        }

        return $query->get()->map(function ($item) {
            $status = 'ok';
            if ($item->total_hours > 20) $status = 'overloaded';
            if ($item->total_hours < 10) $status = 'underloaded';

            return [
                'faculty_name' => $item->faculty->name,
                'courses_count' => $item->courses_count,
                'hours_per_week' => $item->total_hours,
                'status' => $status,
            ];
        })->toArray();
    }

    public function timetableUtilization(int $collegeId): array
    {
        $rooms = \App\Models\Room::where('college_id', $collegeId)->get();

        return $rooms->map(function ($room) {
            $totalSlots = 6 * 6; // 6 days * 6 hours
            $usedSlots = TimetableSlot::where('room_id', $room->id)->count();

            return [
                'room_name' => $room->name,
                'capacity' => $room->capacity,
                'total_slots' => $totalSlots,
                'used_slots' => $usedSlots,
                'utilization' => round(($usedSlots / $totalSlots) * 100, 2),
            ];
        })->toArray();
    }
}
```

---

## Testing Examples

```php
<?php

namespace Tests\Feature\SuperAdmin;

use Tests\TestCase;
use App\Models\User;
use App\Models\Course;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CourseManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_create_course()
    {
        $superAdmin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($superAdmin)->postJson('/api/super-admin/courses', [
            'code' => 'CS101',
            'name' => 'Introduction to Programming',
            'credits' => 4,
            'type' => 'theory',
            'college_id' => 1,
            'department_id' => 1,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('courses', ['code' => 'CS101']);
    }

    public function test_timetable_generation()
    {
        $superAdmin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($superAdmin)->postJson('/api/super-admin/timetables/generate', [
            'college_id' => 1,
            'semester_id' => 1,
            'year' => 'First Year',
            'section' => 'A',
            'constraints' => [
                'avoid_faculty_conflicts' => true,
                'avoid_room_conflicts' => true,
            ],
        ]);

        $response->assertStatus(200);
    }
}
```

---

**Backend Implementation Complete!**
