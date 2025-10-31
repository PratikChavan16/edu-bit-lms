<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use App\Models\College;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class FacultyController extends Controller
{
    /**
     * Get all faculty for a college
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
                action: 'view_faculty_list',
                resourceType: 'Faculty',
                resourceId: $collegeId,
                description: "God Mode: Viewed faculty list for {$college->name}"
            );

            $query = Faculty::where('college_id', $collegeId);

            // Filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('department_id')) {
                $query->where('department_id', $request->department_id);
            }

            if ($request->has('designation')) {
                $query->where('designation', $request->designation);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('employee_id', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            }

            $perPage = $request->get('per_page', 20);
            $faculty = $query->with(['department'])->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $faculty->items(),
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                    'portal' => 'bitflow-admin',
                    'pagination' => [
                        'current_page' => $faculty->currentPage(),
                        'last_page' => $faculty->lastPage(),
                        'per_page' => $faculty->perPage(),
                        'total' => $faculty->total(),
                    ],
                    'god_mode_context' => [
                        'is_god_mode' => true,
                        'viewing_tenant_id' => $universityId,
                        'hierarchy_level' => 'platform',
                    ],
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching faculty', [
                'college_id' => $collegeId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to fetch faculty',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Store a new faculty member
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
                'employee_id' => 'required|string|unique:faculty,employee_id',
                'first_name' => 'required|string|max:100',
                'last_name' => 'required|string|max:100',
                'email' => 'required|email|unique:faculty,email',
                'phone' => 'nullable|string|max:20',
                'department_id' => 'required|exists:departments,id',
                'designation' => 'required|in:professor,associate_professor,assistant_professor,lecturer,visiting_faculty',
                'qualification' => 'nullable|string|max:255',
                'specialization' => 'nullable|string|max:255',
                'status' => 'required|in:active,inactive,on_leave',
                'joining_date' => 'required|date',
            ]);

            $validated['college_id'] = $collegeId;
            $validated['university_id'] = $universityId;

            $faculty = Faculty::create($validated);

            AuditLog::log(
                action: 'create_faculty',
                resourceType: 'Faculty',
                resourceId: $faculty->id,
                changes: ['new' => $validated],
                description: "God Mode: Created faculty {$faculty->employee_id}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Faculty member created successfully',
                'data' => $faculty,
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
            Log::error('Error creating faculty', [
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to create faculty member',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Show a specific faculty member
     */
    public function show(Request $request, string $universityId, string $collegeId, string $facultyId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $faculty = Faculty::where('college_id', $collegeId)
                ->where('id', $facultyId)
                ->with(['department', 'college'])
                ->firstOrFail();

            AuditLog::log(
                action: 'view_faculty',
                resourceType: 'Faculty',
                resourceId: $facultyId,
                description: "God Mode: Viewed faculty {$faculty->employee_id}"
            );

            return response()->json([
                'success' => true,
                'data' => $faculty,
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
                    'message' => 'Faculty member not found',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 404);
        }
    }

    /**
     * Update a faculty member
     */
    public function update(Request $request, string $universityId, string $collegeId, string $facultyId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $faculty = Faculty::where('college_id', $collegeId)
                ->where('id', $facultyId)
                ->firstOrFail();

            $validated = $request->validate([
                'first_name' => 'sometimes|string|max:100',
                'last_name' => 'sometimes|string|max:100',
                'email' => 'sometimes|email|unique:faculty,email,' . $facultyId,
                'phone' => 'nullable|string|max:20',
                'department_id' => 'sometimes|exists:departments,id',
                'designation' => 'sometimes|in:professor,associate_professor,assistant_professor,lecturer,visiting_faculty',
                'qualification' => 'nullable|string|max:255',
                'specialization' => 'nullable|string|max:255',
                'status' => 'sometimes|in:active,inactive,on_leave',
            ]);

            $oldValues = $faculty->only(array_keys($validated));
            $faculty->update($validated);

            AuditLog::log(
                action: 'update_faculty',
                resourceType: 'Faculty',
                resourceId: $facultyId,
                changes: [
                    'old' => $oldValues,
                    'new' => $validated,
                ],
                description: "God Mode: Updated faculty {$faculty->employee_id}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Faculty member updated successfully',
                'data' => $faculty->fresh(),
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
            Log::error('Error updating faculty', [
                'faculty_id' => $facultyId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to update faculty member',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Delete a faculty member (soft delete)
     */
    public function destroy(Request $request, string $universityId, string $collegeId, string $facultyId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $faculty = Faculty::where('college_id', $collegeId)
                ->where('id', $facultyId)
                ->firstOrFail();

            $employeeId = $faculty->employee_id;
            $faculty->delete();

            AuditLog::log(
                action: 'delete_faculty',
                resourceType: 'Faculty',
                resourceId: $facultyId,
                description: "God Mode: Deleted faculty {$employeeId}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Faculty member deleted successfully',
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
            Log::error('Error deleting faculty', [
                'faculty_id' => $facultyId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to delete faculty member',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }
}
