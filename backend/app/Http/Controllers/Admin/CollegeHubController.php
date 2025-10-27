<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\University;
use App\Models\College;
use App\Models\Department;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Course;
use App\Models\User;
use App\Http\Requests\StoreDepartmentRequest;
use App\Http\Requests\UpdateDepartmentRequest;
use App\Http\Requests\EnrollStudentRequest;
use App\Http\Requests\UpdateStudentRequest;
use App\Http\Requests\StoreFacultyRequest;
use App\Http\Requests\UpdateFacultyRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CollegeHubController extends Controller
{
    /**
     * Get college hub data (overview with stats)
     *
     * @param string $universityId
     * @param string $collegeId
     * @return JsonResponse
     */
    public function show(string $universityId, string $collegeId): JsonResponse
    {
        $college = College::where('university_id', $universityId)
            ->where('id', $collegeId)
            ->firstOrFail();

        // Get statistics
        $stats = [
            'departments_count' => Department::where('college_id', $collegeId)->count(),
            'students_count' => Student::where('college_id', $collegeId)->count(),
            'faculty_count' => Faculty::where('college_id', $collegeId)->count(),
            'courses_count' => Course::where('college_id', $collegeId)->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $college->id,
                'university_id' => $college->university_id,
                'name' => $college->name,
                'code' => $college->code,
                'type' => $college->type,
                'email' => $college->email,
                'phone' => $college->phone,
                'address' => $college->address,
                'established_year' => $college->established_year,
                'accreditation' => $college->accreditation,
                'status' => $college->status,
                'stats' => $stats,
            ],
        ]);
    }

    /**
     * Get leadership team for a college (Principal, College Admin, etc.)
     *
     * @param string $universityId
     * @param string $collegeId
     * @return JsonResponse
     */
    public function getLeadership(string $universityId, string $collegeId): JsonResponse
    {
        College::where('university_id', $universityId)
            ->where('id', $collegeId)
            ->firstOrFail();

        $leadershipUsers = User::where('college_id', $collegeId)
            ->whereHas('roles', function ($query) {
                $query->whereIn('name', ['principal', 'college_admin']);
            })
            ->with(['roles'])
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->roles->first()->name ?? 'N/A',
                    'status' => $user->status,
                    'last_login_at' => $user->last_login_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $leadershipUsers,
        ]);
    }

    /**
     * Get departments for a college
     *
     * @param Request $request
     * @param string $universityId
     * @param string $collegeId
     * @return JsonResponse
     */
    public function getDepartments(Request $request, string $universityId, string $collegeId): JsonResponse
    {
        College::where('university_id', $universityId)
            ->where('id', $collegeId)
            ->firstOrFail();

        $query = Department::where('college_id', $collegeId)
            ->where('university_id', $universityId);

        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $departments = $query->with(['hod'])->get();

        return response()->json([
            'success' => true,
            'data' => $departments->map(function ($dept) {
                return [
                    'id' => $dept->id,
                    'university_id' => $dept->university_id,
                    'college_id' => $dept->college_id,
                    'name' => $dept->name,
                    'code' => $dept->code,
                    'hod_name' => $dept->hod->name ?? null,
                    'established_year' => $dept->established_year,
                    'status' => $dept->status,
                ];
            }),
        ]);
    }

    /**
     * Get academic staff (faculty) for a college
     *
     * @param Request $request
     * @param string $universityId
     * @param string $collegeId
     * @return JsonResponse
     */
    public function getAcademicStaff(Request $request, string $universityId, string $collegeId): JsonResponse
    {
        College::where('university_id', $universityId)
            ->where('id', $collegeId)
            ->firstOrFail();

        $query = Faculty::where('college_id', $collegeId)
            ->where('university_id', $universityId)
            ->with(['user', 'department']);

        // Apply filters
        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->has('designation')) {
            $query->where('designation', $request->designation);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $perPage = $request->get('per_page', 15);
        $faculty = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $faculty->map(function ($f) {
                return [
                    'id' => $f->id,
                    'user_id' => $f->user_id,
                    'name' => $f->user->name ?? 'N/A',
                    'email' => $f->user->email ?? 'N/A',
                    'phone' => $f->user->phone ?? 'N/A',
                    'designation' => $f->designation,
                    'department' => $f->department->name ?? 'N/A',
                    'qualification' => $f->qualification,
                    'experience_years' => $f->experience_years,
                    'status' => $f->status,
                ];
            }),
            'meta' => [
                'current_page' => $faculty->currentPage(),
                'last_page' => $faculty->lastPage(),
                'per_page' => $faculty->perPage(),
                'total' => $faculty->total(),
            ],
        ]);
    }

    /**
     * Get students for a college
     *
     * @param Request $request
     * @param string $universityId
     * @param string $collegeId
     * @return JsonResponse
     */
    public function getStudents(Request $request, string $universityId, string $collegeId): JsonResponse
    {
        College::where('university_id', $universityId)
            ->where('id', $collegeId)
            ->firstOrFail();

        $query = Student::where('college_id', $collegeId)
            ->where('university_id', $universityId)
            ->with(['user', 'department']);

        // Apply filters
        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        if ($request->has('current_year')) {
            $query->where('current_year', $request->current_year);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('enrollment_number', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($query) use ($search) {
                        $query->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        $perPage = $request->get('per_page', 15);
        $students = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $students->map(function ($student) {
                return [
                    'id' => $student->id,
                    'user_id' => $student->user_id,
                    'enrollment_number' => $student->enrollment_number,
                    'name' => $student->user->name ?? 'N/A',
                    'email' => $student->user->email ?? 'N/A',
                    'phone' => $student->user->phone ?? 'N/A',
                    'department' => $student->department->name ?? 'N/A',
                    'current_year' => $student->current_year,
                    'status' => $student->status,
                    'admission_date' => $student->admission_date,
                ];
            }),
            'meta' => [
                'current_page' => $students->currentPage(),
                'last_page' => $students->lastPage(),
                'per_page' => $students->perPage(),
                'total' => $students->total(),
            ],
        ]);
    }

    /**
     * Get college settings
     *
     * @param string $universityId
     * @param string $collegeId
     * @return JsonResponse
     */
    public function getSettings(string $universityId, string $collegeId): JsonResponse
    {
        $college = College::where('university_id', $universityId)
            ->where('id', $collegeId)
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $college->id,
                'name' => $college->name,
                'code' => $college->code,
                'type' => $college->type,
                'email' => $college->email,
                'phone' => $college->phone,
                'address' => $college->address,
                'website' => $college->website,
                'established_year' => $college->established_year,
                'accreditation' => $college->accreditation,
                'status' => $college->status,
                'settings' => $college->settings ?? [],
            ],
        ]);
    }

    /**
     * Update college settings
     *
     * @param Request $request
     * @param string $universityId
     * @param string $collegeId
     * @return JsonResponse
     */
    public function updateSettings(Request $request, string $universityId, string $collegeId): JsonResponse
    {
        $college = College::where('university_id', $universityId)
            ->where('id', $collegeId)
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|max:50',
            'type' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|max:255',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string',
            'website' => 'sometimes|url|max:255',
            'settings' => 'sometimes|array',
        ]);

        $college->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'College settings updated successfully',
            'data' => $college,
        ]);
    }

    /**
     * Create a new department
     *
     * @param StoreDepartmentRequest $request
     * @param string $universityId
     * @param string $collegeId
     * @return JsonResponse
     */
    public function createDepartment(StoreDepartmentRequest $request, string $universityId, string $collegeId): JsonResponse
    {
        $this->authorize('create', Department::class);

        College::where('university_id', $universityId)
            ->where('id', $collegeId)
            ->firstOrFail();

        $department = Department::create([
            'university_id' => $universityId,
            'college_id' => $collegeId,
            ...$request->validated(),
            'status' => 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Department created successfully',
            'data' => $department->load('hod'),
        ], 201);
    }

    /**
     * Get a single department
     *
     * @param string $universityId
     * @param string $collegeId
     * @param string $departmentId
     * @return JsonResponse
     */
    public function getDepartment(string $universityId, string $collegeId, string $departmentId): JsonResponse
    {
        $department = Department::where('university_id', $universityId)
            ->where('college_id', $collegeId)
            ->where('id', $departmentId)
            ->with(['hod.user', 'university', 'college'])
            ->firstOrFail();

        $this->authorize('view', $department);

        $stats = [
            'students_count' => $department->students()->count(),
            'faculty_count' => $department->faculty()->count(),
            'courses_count' => $department->courses()->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $department->id,
                'university_id' => $department->university_id,
                'college_id' => $department->college_id,
                'name' => $department->name,
                'code' => $department->code,
                'head_faculty_id' => $department->head_faculty_id,
                'hod_name' => $department->hod?->user?->name,
                'email' => $department->email,
                'phone' => $department->phone,
                'floor_location' => $department->floor_location,
                'status' => $department->status,
                'stats' => $stats,
                'created_at' => $department->created_at,
                'updated_at' => $department->updated_at,
            ],
        ]);
    }

    /**
     * Update a department
     *
     * @param UpdateDepartmentRequest $request
     * @param string $universityId
     * @param string $collegeId
     * @param string $departmentId
     * @return JsonResponse
     */
    public function updateDepartment(UpdateDepartmentRequest $request, string $universityId, string $collegeId, string $departmentId): JsonResponse
    {
        $department = Department::where('university_id', $universityId)
            ->where('college_id', $collegeId)
            ->where('id', $departmentId)
            ->firstOrFail();

        $this->authorize('update', $department);

        $department->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Department updated successfully',
            'data' => $department->load('hod.user'),
        ]);
    }

    /**
     * Delete a department
     *
     * @param string $universityId
     * @param string $collegeId
     * @param string $departmentId
     * @return JsonResponse
     */
    public function deleteDepartment(string $universityId, string $collegeId, string $departmentId): JsonResponse
    {
        $department = Department::where('university_id', $universityId)
            ->where('college_id', $collegeId)
            ->where('id', $departmentId)
            ->firstOrFail();

        $this->authorize('delete', $department);

        // Check if department has students or faculty
        $studentsCount = $department->students()->count();
        $facultyCount = $department->faculty()->count();

        if ($studentsCount > 0 || $facultyCount > 0) {
            return response()->json([
                'success' => false,
                'message' => "Cannot delete department. It has {$studentsCount} students and {$facultyCount} faculty members.",
            ], 400);
        }

        $department->delete();

        return response()->json([
            'success' => true,
            'message' => 'Department deleted successfully',
        ]);
    }

    /**
     * Enroll a new student
     *
     * @param EnrollStudentRequest $request
     * @param string $universityId
     * @param string $collegeId
     * @return JsonResponse
     */
    public function enrollStudent(EnrollStudentRequest $request, string $universityId, string $collegeId): JsonResponse
    {
        $this->authorize('create', Student::class);

        College::where('university_id', $universityId)
            ->where('id', $collegeId)
            ->firstOrFail();

        $student = Student::create([
            'university_id' => $universityId,
            'college_id' => $collegeId,
            ...$request->validated(),
            'status' => 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Student enrolled successfully',
            'data' => $student->load(['user', 'department']),
        ], 201);
    }

    /**
     * Get a single student
     *
     * @param string $universityId
     * @param string $collegeId
     * @param string $studentId
     * @return JsonResponse
     */
    public function getStudent(string $universityId, string $collegeId, string $studentId): JsonResponse
    {
        $student = Student::where('university_id', $universityId)
            ->where('college_id', $collegeId)
            ->where('id', $studentId)
            ->with(['user', 'department', 'college', 'enrollments.course'])
            ->firstOrFail();

        $this->authorize('view', $student);

        $gpa = $student->calculateGpa();
        $attendance = $student->calculateAttendancePercentage();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $student->id,
                'user_id' => $student->user_id,
                'university_id' => $student->university_id,
                'college_id' => $student->college_id,
                'department_id' => $student->department_id,
                'admission_number' => $student->admission_number,
                'admission_date' => $student->admission_date,
                'course' => $student->course,
                'year' => $student->year,
                'section' => $student->section,
                'roll_number' => $student->roll_number,
                'blood_group' => $student->blood_group,
                'date_of_birth' => $student->date_of_birth,
                'gender' => $student->gender,
                'nationality' => $student->nationality,
                'emergency_contact' => $student->emergency_contact,
                'guardian_name' => $student->guardian_name,
                'guardian_phone' => $student->guardian_phone,
                'guardian_email' => $student->guardian_email,
                'status' => $student->status,
                'gpa' => $gpa,
                'attendance_percentage' => $attendance,
                'user' => $student->user,
                'department' => $student->department,
                'college' => $student->college,
                'enrollments' => $student->enrollments,
                'created_at' => $student->created_at,
                'updated_at' => $student->updated_at,
            ],
        ]);
    }

    /**
     * Update a student
     *
     * @param UpdateStudentRequest $request
     * @param string $universityId
     * @param string $collegeId
     * @param string $studentId
     * @return JsonResponse
     */
    public function updateStudent(UpdateStudentRequest $request, string $universityId, string $collegeId, string $studentId): JsonResponse
    {
        $student = Student::where('university_id', $universityId)
            ->where('college_id', $collegeId)
            ->where('id', $studentId)
            ->firstOrFail();

        $this->authorize('update', $student);

        $student->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Student updated successfully',
            'data' => $student->load(['user', 'department']),
        ]);
    }

    /**
     * Delete a student
     *
     * @param string $universityId
     * @param string $collegeId
     * @param string $studentId
     * @return JsonResponse
     */
    public function deleteStudent(string $universityId, string $collegeId, string $studentId): JsonResponse
    {
        $student = Student::where('university_id', $universityId)
            ->where('college_id', $collegeId)
            ->where('id', $studentId)
            ->firstOrFail();

        $this->authorize('delete', $student);

        $student->delete();

        return response()->json([
            'success' => true,
            'message' => 'Student deleted successfully',
        ]);
    }

    /**
     * Create a new faculty member
     *
     * @param StoreFacultyRequest $request
     * @param string $universityId
     * @param string $collegeId
     * @return JsonResponse
     */
    public function createFaculty(StoreFacultyRequest $request, string $universityId, string $collegeId): JsonResponse
    {
        $this->authorize('create', Faculty::class);

        College::where('university_id', $universityId)
            ->where('id', $collegeId)
            ->firstOrFail();

        $faculty = Faculty::create([
            'university_id' => $universityId,
            'college_id' => $collegeId,
            ...$request->validated(),
            'status' => 'active',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Faculty member created successfully',
            'data' => $faculty->load(['user', 'department']),
        ], 201);
    }

    /**
     * Get a single faculty member
     *
     * @param string $universityId
     * @param string $collegeId
     * @param string $staffId
     * @return JsonResponse
     */
    public function getFaculty(string $universityId, string $collegeId, string $staffId): JsonResponse
    {
        $faculty = Faculty::where('university_id', $universityId)
            ->where('college_id', $collegeId)
            ->where('id', $staffId)
            ->with(['user', 'department', 'college'])
            ->firstOrFail();

        $this->authorize('view', $faculty);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $faculty->id,
                'user_id' => $faculty->user_id,
                'university_id' => $faculty->university_id,
                'college_id' => $faculty->college_id,
                'department_id' => $faculty->department_id,
                'employee_id' => $faculty->employee_id,
                'designation' => $faculty->designation,
                'qualification' => $faculty->qualification,
                'specialization' => $faculty->specialization,
                'experience_years' => $faculty->experience_years,
                'employment_type' => $faculty->employment_type,
                'joining_date' => $faculty->joining_date,
                'status' => $faculty->status,
                'user' => $faculty->user,
                'department' => $faculty->department,
                'college' => $faculty->college,
                'is_department_head' => $faculty->isDepartmentHead(),
                'years_of_service' => $faculty->years_of_service,
                'created_at' => $faculty->created_at,
                'updated_at' => $faculty->updated_at,
            ],
        ]);
    }

    /**
     * Update a faculty member
     *
     * @param UpdateFacultyRequest $request
     * @param string $universityId
     * @param string $collegeId
     * @param string $staffId
     * @return JsonResponse
     */
    public function updateFaculty(UpdateFacultyRequest $request, string $universityId, string $collegeId, string $staffId): JsonResponse
    {
        $faculty = Faculty::where('university_id', $universityId)
            ->where('college_id', $collegeId)
            ->where('id', $staffId)
            ->firstOrFail();

        $this->authorize('update', $faculty);

        $faculty->update($request->validated());

        return response()->json([
            'success' => true,
            'message' => 'Faculty member updated successfully',
            'data' => $faculty->load(['user', 'department']),
        ]);
    }

    /**
     * Delete a faculty member
     *
     * @param string $universityId
     * @param string $collegeId
     * @param string $staffId
     * @return JsonResponse
     */
    public function deleteFaculty(string $universityId, string $collegeId, string $staffId): JsonResponse
    {
        $faculty = Faculty::where('university_id', $universityId)
            ->where('college_id', $collegeId)
            ->where('id', $staffId)
            ->firstOrFail();

        $this->authorize('delete', $faculty);

        // Check if faculty is a department head
        if ($faculty->isDepartmentHead()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete faculty member. They are currently a department head. Please reassign the position first.',
            ], 400);
        }

        $faculty->delete();

        return response()->json([
            'success' => true,
            'message' => 'Faculty member deleted successfully',
        ]);
    }
}
