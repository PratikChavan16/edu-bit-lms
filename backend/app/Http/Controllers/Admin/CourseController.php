<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\College;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class CourseController extends Controller
{
    /**
     * Get all courses for a college
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
                action: 'view_courses_list',
                resourceType: 'Course',
                resourceId: $collegeId,
                description: "God Mode: Viewed courses list for {$college->name}"
            );

            $query = Course::where('college_id', $collegeId);

            // Filters
            if ($request->has('department_id')) {
                $query->where('department_id', $request->department_id);
            }

            if ($request->has('semester')) {
                $query->where('semester', $request->semester);
            }

            if ($request->has('year')) {
                $query->where('year', $request->year);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('course_code', 'like', "%{$search}%")
                        ->orWhere('name', 'like', "%{$search}%");
                });
            }

            $perPage = $request->get('per_page', 20);
            $courses = $query->with(['department'])->orderBy('course_code')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $courses->items(),
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                    'portal' => 'bitflow-admin',
                    'pagination' => [
                        'current_page' => $courses->currentPage(),
                        'last_page' => $courses->lastPage(),
                        'per_page' => $courses->perPage(),
                        'total' => $courses->total(),
                    ],
                    'god_mode_context' => [
                        'is_god_mode' => true,
                        'viewing_tenant_id' => $universityId,
                        'hierarchy_level' => 'platform',
                    ],
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching courses', [
                'college_id' => $collegeId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to fetch courses',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Store a new course
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
                'course_code' => 'required|string|max:50|unique:courses,course_code',
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'department_id' => 'required|exists:departments,id',
                'credits' => 'required|integer|min:1|max:10',
                'semester' => 'required|integer|between:1,8',
                'year' => 'required|integer|between:1,4',
                'course_type' => 'required|in:core,elective,optional',
                'status' => 'required|in:active,inactive,archived',
            ]);

            $validated['college_id'] = $collegeId;
            $validated['university_id'] = $universityId;

            $course = Course::create($validated);

            AuditLog::log(
                action: 'create_course',
                resourceType: 'Course',
                resourceId: $course->id,
                changes: ['new' => $validated],
                description: "God Mode: Created course {$course->course_code}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Course created successfully',
                'data' => $course,
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
            Log::error('Error creating course', [
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to create course',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Show a specific course
     */
    public function show(Request $request, string $universityId, string $collegeId, string $courseId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $course = Course::where('college_id', $collegeId)
                ->where('id', $courseId)
                ->with(['department', 'college'])
                ->firstOrFail();

            AuditLog::log(
                action: 'view_course',
                resourceType: 'Course',
                resourceId: $courseId,
                description: "God Mode: Viewed course {$course->course_code}"
            );

            return response()->json([
                'success' => true,
                'data' => $course,
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
                    'message' => 'Course not found',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 404);
        }
    }

    /**
     * Update a course
     */
    public function update(Request $request, string $universityId, string $collegeId, string $courseId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $course = Course::where('college_id', $collegeId)
                ->where('id', $courseId)
                ->firstOrFail();

            $validated = $request->validate([
                'course_code' => 'sometimes|string|max:50|unique:courses,course_code,' . $courseId,
                'name' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'department_id' => 'sometimes|exists:departments,id',
                'credits' => 'sometimes|integer|min:1|max:10',
                'semester' => 'sometimes|integer|between:1,8',
                'year' => 'sometimes|integer|between:1,4',
                'course_type' => 'sometimes|in:core,elective,optional',
                'status' => 'sometimes|in:active,inactive,archived',
            ]);

            $oldValues = $course->only(array_keys($validated));
            $course->update($validated);

            AuditLog::log(
                action: 'update_course',
                resourceType: 'Course',
                resourceId: $courseId,
                changes: [
                    'old' => $oldValues,
                    'new' => $validated,
                ],
                description: "God Mode: Updated course {$course->course_code}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Course updated successfully',
                'data' => $course->fresh(),
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
            Log::error('Error updating course', [
                'course_id' => $courseId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to update course',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Delete a course (soft delete)
     */
    public function destroy(Request $request, string $universityId, string $collegeId, string $courseId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $course = Course::where('college_id', $collegeId)
                ->where('id', $courseId)
                ->firstOrFail();

            $courseCode = $course->course_code;
            $course->delete();

            AuditLog::log(
                action: 'delete_course',
                resourceType: 'Course',
                resourceId: $courseId,
                description: "God Mode: Deleted course {$courseCode}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Course deleted successfully',
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
            Log::error('Error deleting course', [
                'course_id' => $courseId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to delete course',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }
}
