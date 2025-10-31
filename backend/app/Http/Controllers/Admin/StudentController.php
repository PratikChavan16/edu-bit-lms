<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\College;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class StudentController extends Controller
{
    /**
     * Get all students for a college
     */
    public function index(Request $request, string $universityId, string $collegeId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            // Disable global scope for Bitflow Admin
            $college = College::withoutGlobalScope(\App\Scopes\UniversityScope::class)
                ->where('university_id', $universityId)
                ->where('id', $collegeId)
                ->firstOrFail();

            AuditLog::log(
                action: 'view_students_list',
                resourceType: 'Student',
                resourceId: $collegeId,
                description: "God Mode: Viewed students list for {$college->name}"
            );

            $query = Student::where('college_id', $collegeId);

            // Filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('department_id')) {
                $query->where('department_id', $request->department_id);
            }

            if ($request->has('year')) {
                $query->where('year', $request->year);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('enrollment_number', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            }

            $perPage = $request->get('per_page', 20);
            $students = $query->with(['department'])->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $students->items(),
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                    'portal' => 'bitflow-admin',
                    'pagination' => [
                        'current_page' => $students->currentPage(),
                        'last_page' => $students->lastPage(),
                        'per_page' => $students->perPage(),
                        'total' => $students->total(),
                    ],
                    'god_mode_context' => [
                        'is_god_mode' => true,
                        'viewing_tenant_id' => $universityId,
                        'hierarchy_level' => 'platform',
                    ],
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching students', [
                'college_id' => $collegeId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to fetch students',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Store a new student
     */
    public function store(Request $request, string $universityId, string $collegeId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            // Disable global scope for Bitflow Admin
            $college = College::withoutGlobalScope(\App\Scopes\UniversityScope::class)
                ->where('university_id', $universityId)
                ->where('id', $collegeId)
                ->firstOrFail();

            $validated = $request->validate([
                'enrollment_number' => 'required|string|unique:students,enrollment_number',
                'first_name' => 'required|string|max:100',
                'last_name' => 'required|string|max:100',
                'email' => 'required|email|unique:students,email',
                'phone' => 'nullable|string|max:20',
                'department_id' => 'required|exists:departments,id',
                'year' => 'required|integer|between:1,4',
                'semester' => 'required|integer|between:1,8',
                'status' => 'required|in:active,inactive,graduated,dropped',
                'admission_date' => 'required|date',
            ]);

            $validated['college_id'] = $collegeId;
            $validated['university_id'] = $universityId;

            $student = Student::create($validated);

            AuditLog::log(
                action: 'create_student',
                resourceType: 'Student',
                resourceId: $student->id,
                changes: ['new' => $validated],
                description: "God Mode: Created student {$student->enrollment_number}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Student created successfully',
                'data' => $student,
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                    'portal' => 'bitflow-admin',
                    'god_mode_context' => [
                        'is_god_mode' => true,
                        'viewing_tenant_id' => $universityId,
                        'hierarchy_level' => 'platform',
                    ],
                ],
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_VALIDATION_FAILED',
                    'message' => 'Validation failed',
                    'field_errors' => collect($e->errors())->map(fn($errors, $field) => [
                        'field' => $field,
                        'message' => $errors[0],
                    ])->values(),
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 422);

        } catch (\Exception $e) {
            Log::error('Error creating student', [
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to create student',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Show a specific student
     */
    public function show(Request $request, string $universityId, string $collegeId, string $studentId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $student = Student::where('college_id', $collegeId)
                ->where('id', $studentId)
                ->with(['department', 'college'])
                ->firstOrFail();

            AuditLog::log(
                action: 'view_student',
                resourceType: 'Student',
                resourceId: $studentId,
                description: "God Mode: Viewed student {$student->enrollment_number}"
            );

            return response()->json([
                'success' => true,
                'data' => $student,
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                    'portal' => 'bitflow-admin',
                    'god_mode_context' => [
                        'is_god_mode' => true,
                        'viewing_tenant_id' => $universityId,
                        'hierarchy_level' => 'platform',
                    ],
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_RESOURCE_NOT_FOUND',
                    'message' => 'Student not found',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 404);
        }
    }

    /**
     * Update a student
     */
    public function update(Request $request, string $universityId, string $collegeId, string $studentId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $student = Student::where('college_id', $collegeId)
                ->where('id', $studentId)
                ->firstOrFail();

            $validated = $request->validate([
                'first_name' => 'sometimes|string|max:100',
                'last_name' => 'sometimes|string|max:100',
                'email' => 'sometimes|email|unique:students,email,' . $studentId,
                'phone' => 'nullable|string|max:20',
                'department_id' => 'sometimes|exists:departments,id',
                'year' => 'sometimes|integer|between:1,4',
                'semester' => 'sometimes|integer|between:1,8',
                'status' => 'sometimes|in:active,inactive,graduated,dropped',
            ]);

            $oldValues = $student->only(array_keys($validated));
            $student->update($validated);

            AuditLog::log(
                action: 'update_student',
                resourceType: 'Student',
                resourceId: $studentId,
                changes: [
                    'old' => $oldValues,
                    'new' => $validated,
                ],
                description: "God Mode: Updated student {$student->enrollment_number}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Student updated successfully',
                'data' => $student->fresh(),
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                    'portal' => 'bitflow-admin',
                    'god_mode_context' => [
                        'is_god_mode' => true,
                        'viewing_tenant_id' => $universityId,
                        'hierarchy_level' => 'platform',
                    ],
                ],
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_VALIDATION_FAILED',
                    'message' => 'Validation failed',
                    'field_errors' => collect($e->errors())->map(fn($errors, $field) => [
                        'field' => $field,
                        'message' => $errors[0],
                    ])->values(),
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 422);

        } catch (\Exception $e) {
            Log::error('Error updating student', [
                'student_id' => $studentId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to update student',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Delete a student (soft delete)
     */
    public function destroy(Request $request, string $universityId, string $collegeId, string $studentId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $student = Student::where('college_id', $collegeId)
                ->where('id', $studentId)
                ->firstOrFail();

            $enrollmentNumber = $student->enrollment_number;
            $student->delete();

            AuditLog::log(
                action: 'delete_student',
                resourceType: 'Student',
                resourceId: $studentId,
                description: "God Mode: Deleted student {$enrollmentNumber}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Student deleted successfully',
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                    'portal' => 'bitflow-admin',
                    'god_mode_context' => [
                        'is_god_mode' => true,
                        'viewing_tenant_id' => $universityId,
                        'hierarchy_level' => 'platform',
                    ],
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error deleting student', [
                'student_id' => $studentId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to delete student',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }
}
