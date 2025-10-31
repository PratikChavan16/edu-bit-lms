<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\College;
use App\Models\Exam;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class ExamController extends Controller
{
    /**
     * Get all exams for a college
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
                action: 'view_exams_list',
                resourceType: 'Exam',
                resourceId: $collegeId,
                description: "God Mode: Viewed exams list for {$college->name}"
            );

            $query = Exam::where('college_id', $collegeId);

            // Filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('exam_type')) {
                $query->where('exam_type', $request->exam_type);
            }

            if ($request->has('semester')) {
                $query->where('semester', $request->semester);
            }

            if ($request->has('year')) {
                $query->where('year', $request->year);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('exam_code', 'like', "%{$search}%");
                });
            }

            $perPage = $request->get('per_page', 20);
            $exams = $query->with(['department'])->orderBy('start_date', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $exams->items(),
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                    'portal' => 'bitflow-admin',
                    'pagination' => [
                        'current_page' => $exams->currentPage(),
                        'last_page' => $exams->lastPage(),
                        'per_page' => $exams->perPage(),
                        'total' => $exams->total(),
                    ],
                    'god_mode_context' => [
                        'is_god_mode' => true,
                        'viewing_tenant_id' => $universityId,
                        'hierarchy_level' => 'platform',
                    ],
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching exams', [
                'college_id' => $collegeId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to fetch exams',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Store a new exam
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
                'name' => 'required|string|max:255',
                'exam_code' => 'required|string|max:50|unique:exams,exam_code',
                'exam_type' => 'required|in:mid_term,end_term,internal,external,practical',
                'department_id' => 'nullable|exists:departments,id',
                'semester' => 'nullable|integer|between:1,8',
                'year' => 'nullable|integer|between:1,4',
                'description' => 'nullable|string',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
                'start_time' => 'nullable|date_format:H:i',
                'duration_minutes' => 'nullable|integer|min:30',
                'total_marks' => 'required|integer|min:1',
                'passing_marks' => 'required|integer|min:1',
                'status' => 'required|in:scheduled,ongoing,completed,cancelled',
                'exam_pattern' => 'nullable|array',
                'instructions' => 'nullable|array',
            ]);

            $validated['college_id'] = $collegeId;
            $validated['university_id'] = $universityId;

            $exam = Exam::create($validated);

            AuditLog::log(
                action: 'create_exam',
                resourceType: 'Exam',
                resourceId: $exam->id,
                changes: ['new' => $validated],
                description: "God Mode: Created exam {$exam->exam_code}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Exam created successfully',
                'data' => $exam,
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
            Log::error('Error creating exam', [
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to create exam',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Show a specific exam
     */
    public function show(Request $request, string $universityId, string $collegeId, string $examId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $exam = Exam::where('college_id', $collegeId)
                ->where('id', $examId)
                ->with(['department', 'schedules', 'results'])
                ->firstOrFail();

            AuditLog::log(
                action: 'view_exam',
                resourceType: 'Exam',
                resourceId: $examId,
                description: "God Mode: Viewed exam {$exam->exam_code}"
            );

            return response()->json([
                'success' => true,
                'data' => $exam,
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
                    'message' => 'Exam not found',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 404);
        }
    }

    /**
     * Update an exam
     */
    public function update(Request $request, string $universityId, string $collegeId, string $examId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $exam = Exam::where('college_id', $collegeId)
                ->where('id', $examId)
                ->firstOrFail();

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'exam_code' => 'sometimes|string|max:50|unique:exams,exam_code,' . $examId,
                'exam_type' => 'sometimes|in:mid_term,end_term,internal,external,practical',
                'semester' => 'nullable|integer|between:1,8',
                'year' => 'nullable|integer|between:1,4',
                'description' => 'nullable|string',
                'start_date' => 'sometimes|date',
                'end_date' => 'sometimes|date|after:start_date',
                'total_marks' => 'sometimes|integer|min:1',
                'passing_marks' => 'sometimes|integer|min:1',
                'status' => 'sometimes|in:scheduled,ongoing,completed,cancelled',
            ]);

            $oldValues = $exam->only(array_keys($validated));
            $exam->update($validated);

            AuditLog::log(
                action: 'update_exam',
                resourceType: 'Exam',
                resourceId: $examId,
                changes: [
                    'old' => $oldValues,
                    'new' => $validated,
                ],
                description: "God Mode: Updated exam {$exam->exam_code}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Exam updated successfully',
                'data' => $exam->fresh(),
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
            Log::error('Error updating exam', [
                'exam_id' => $examId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to update exam',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Delete an exam (soft delete)
     */
    public function destroy(Request $request, string $universityId, string $collegeId, string $examId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $exam = Exam::where('college_id', $collegeId)
                ->where('id', $examId)
                ->firstOrFail();

            $examCode = $exam->exam_code;
            $exam->delete();

            AuditLog::log(
                action: 'delete_exam',
                resourceType: 'Exam',
                resourceId: $examId,
                description: "God Mode: Deleted exam {$examCode}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Exam deleted successfully',
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
            Log::error('Error deleting exam', [
                'exam_id' => $examId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to delete exam',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }
}
