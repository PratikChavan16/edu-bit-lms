<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\College;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class DepartmentController extends Controller
{
    /**
     * Get all departments for a college
     *
     * @param Request $request
     * @param string $universityId
     * @param string $collegeId
     * @return JsonResponse
     */
    public function index(Request $request, string $universityId, string $collegeId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            // Verify college exists and belongs to university
            // Disable global scope for Bitflow Admin
            $college = College::withoutGlobalScope(\App\Scopes\UniversityScope::class)
                ->where('university_id', $universityId)
                ->where('id', $collegeId)
                ->firstOrFail();

            // God Mode Audit Log
            AuditLog::log(
                action: 'view_departments_list',
                resourceType: 'Department',
                resourceId: $collegeId,
                description: "God Mode: Viewed departments list for {$college->name}"
            );

            $query = Department::where('college_id', $collegeId);

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

            // Pagination
            $perPage = $request->get('per_page', 15);
            $departments = $query->orderBy('name')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $departments->items(),
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                    'portal' => 'bitflow-admin',
                    'pagination' => [
                        'current_page' => $departments->currentPage(),
                        'last_page' => $departments->lastPage(),
                        'per_page' => $departments->perPage(),
                        'total' => $departments->total(),
                    ],
                    'god_mode_context' => [
                        'is_god_mode' => true,
                        'viewing_tenant_id' => $universityId,
                        'hierarchy_level' => 'platform',
                    ],
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching departments', [
                'college_id' => $collegeId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to fetch departments',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Store a new department
     *
     * @param Request $request
     * @param string $universityId
     * @param string $collegeId
     * @return JsonResponse
     */
    public function store(Request $request, string $universityId, string $collegeId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            // Verify college exists
            // Disable global scope for Bitflow Admin
            $college = College::withoutGlobalScope(\App\Scopes\UniversityScope::class)
                ->where('university_id', $universityId)
                ->where('id', $collegeId)
                ->firstOrFail();

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:50|unique:departments,code',
                'description' => 'nullable|string',
                'head_faculty_id' => 'nullable|exists:faculty,id',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:20',
                'floor_location' => 'nullable|string|max:100',
                'status' => 'required|in:active,inactive',
            ]);

            $validated['college_id'] = $collegeId;
            $validated['university_id'] = $universityId;

            $department = Department::create($validated);

            // God Mode Audit Log
            AuditLog::log(
                action: 'create_department',
                resourceType: 'Department',
                resourceId: $department->id,
                changes: ['new' => $validated],
                description: "God Mode: Created department {$department->name} in {$college->name}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Department created successfully',
                'data' => $department,
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
            Log::error('Error creating department', [
                'college_id' => $collegeId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to create department',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Show a specific department
     *
     * @param Request $request
     * @param string $universityId
     * @param string $collegeId
     * @param string $departmentId
     * @return JsonResponse
     */
    public function show(Request $request, string $universityId, string $collegeId, string $departmentId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $department = Department::where('college_id', $collegeId)
                ->where('id', $departmentId)
                ->with(['hod'])
                ->firstOrFail();

            // God Mode Audit Log
            AuditLog::log(
                action: 'view_department',
                resourceType: 'Department',
                resourceId: $departmentId,
                description: "God Mode: Viewed department {$department->name}"
            );

            return response()->json([
                'success' => true,
                'data' => $department,
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
            Log::error('Error fetching department', [
                'department_id' => $departmentId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_RESOURCE_NOT_FOUND',
                    'message' => 'Department not found',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 404);
        }
    }

    /**
     * Update a department
     *
     * @param Request $request
     * @param string $universityId
     * @param string $collegeId
     * @param string $departmentId
     * @return JsonResponse
     */
    public function update(Request $request, string $universityId, string $collegeId, string $departmentId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $department = Department::where('college_id', $collegeId)
                ->where('id', $departmentId)
                ->firstOrFail();

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'code' => 'sometimes|string|max:50|unique:departments,code,' . $departmentId,
                'description' => 'nullable|string',
                'head_faculty_id' => 'nullable|exists:faculty,id',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:20',
                'floor_location' => 'nullable|string|max:100',
                'status' => 'sometimes|in:active,inactive',
            ]);

            $oldValues = $department->only(array_keys($validated));
            $department->update($validated);

            // God Mode Audit Log
            AuditLog::log(
                action: 'update_department',
                resourceType: 'Department',
                resourceId: $departmentId,
                changes: [
                    'old' => $oldValues,
                    'new' => $validated,
                ],
                description: "God Mode: Updated department {$department->name}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Department updated successfully',
                'data' => $department->fresh(),
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
            Log::error('Error updating department', [
                'department_id' => $departmentId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to update department',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Delete a department (soft delete)
     *
     * @param Request $request
     * @param string $universityId
     * @param string $collegeId
     * @param string $departmentId
     * @return JsonResponse
     */
    public function destroy(Request $request, string $universityId, string $collegeId, string $departmentId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $department = Department::where('college_id', $collegeId)
                ->where('id', $departmentId)
                ->firstOrFail();

            $departmentName = $department->name;
            $department->delete();

            // God Mode Audit Log
            AuditLog::log(
                action: 'delete_department',
                resourceType: 'Department',
                resourceId: $departmentId,
                description: "God Mode: Deleted department {$departmentName}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Department deleted successfully',
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
            Log::error('Error deleting department', [
                'department_id' => $departmentId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to delete department',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Assign Head of Department (HOD)
     * 
     * This endpoint solves the circular dependency issue:
     * - Department requires HOD (a Faculty member)
     * - Faculty requires Department assignment
     * 
     * Workflow:
     * 1. Create Department without HOD (head_faculty_id = null)
     * 2. Create Faculty members and assign to Department
     * 3. Use this endpoint to assign one Faculty as HOD
     *
     * @param Request $request
     * @param string $universityId
     * @param string $collegeId
     * @param string $departmentId
     * @return JsonResponse
     */
    public function assignHod(Request $request, string $universityId, string $collegeId, string $departmentId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            // Verify college exists and belongs to university
            $college = College::withoutGlobalScope(\App\Scopes\UniversityScope::class)
                ->where('university_id', $universityId)
                ->where('id', $collegeId)
                ->firstOrFail();

            // Find department
            $department = Department::where('college_id', $collegeId)
                ->where('id', $departmentId)
                ->firstOrFail();

            // Validate request
            $validated = $request->validate([
                'faculty_id' => 'required|exists:faculty,id',
            ]);

            // Verify faculty exists and belongs to this department
            $faculty = \App\Models\Faculty::where('id', $validated['faculty_id'])
                ->where('department_id', $departmentId)
                ->where('college_id', $collegeId)
                ->where('university_id', $universityId)
                ->firstOrFail();

            // Check if faculty is active
            if ($faculty->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'error' => [
                        'code' => 'ERR_INVALID_FACULTY_STATUS',
                        'message' => 'Cannot assign inactive faculty as HOD',
                    ],
                    'metadata' => [
                        'timestamp' => now()->toIso8601String(),
                        'request_id' => $requestId,
                    ],
                ], 400);
            }

            // Store old HOD for audit log
            $oldHod = $department->head_faculty_id;

            // Assign HOD
            $department->head_faculty_id = $validated['faculty_id'];
            $department->save();

            // Load relationships for response
            $department->load(['hod.user', 'faculty', 'college', 'university']);

            // God Mode Audit Log
            AuditLog::log(
                action: 'assign_department_hod',
                resourceType: 'Department',
                resourceId: $departmentId,
                changes: [
                    'old' => ['head_faculty_id' => $oldHod],
                    'new' => ['head_faculty_id' => $validated['faculty_id']],
                ],
                description: "God Mode: Assigned {$faculty->user->name} as HOD of {$department->name}"
            );

            return response()->json([
                'success' => true,
                'message' => 'HOD assigned successfully',
                'data' => $department,
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

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_NOT_FOUND',
                    'message' => 'Department or faculty not found',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 404);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_VALIDATION_FAILED',
                    'message' => 'Validation failed',
                    'details' => $e->errors(),
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 422);

        } catch (\Exception $e) {
            Log::error('Error assigning HOD', [
                'department_id' => $departmentId,
                'faculty_id' => $validated['faculty_id'] ?? null,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to assign HOD',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Remove Head of Department (HOD)
     *
     * @param Request $request
     * @param string $universityId
     * @param string $collegeId
     * @param string $departmentId
     * @return JsonResponse
     */
    public function removeHod(Request $request, string $universityId, string $collegeId, string $departmentId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            // Find department
            $department = Department::where('college_id', $collegeId)
                ->where('id', $departmentId)
                ->firstOrFail();

            // Store old HOD for audit log
            $oldHod = $department->head_faculty_id;

            if (!$oldHod) {
                return response()->json([
                    'success' => false,
                    'error' => [
                        'code' => 'ERR_NO_HOD',
                        'message' => 'Department does not have a HOD assigned',
                    ],
                    'metadata' => [
                        'timestamp' => now()->toIso8601String(),
                        'request_id' => $requestId,
                    ],
                ], 400);
            }

            // Remove HOD
            $department->head_faculty_id = null;
            $department->save();

            // God Mode Audit Log
            AuditLog::log(
                action: 'remove_department_hod',
                resourceType: 'Department',
                resourceId: $departmentId,
                changes: [
                    'old' => ['head_faculty_id' => $oldHod],
                    'new' => ['head_faculty_id' => null],
                ],
                description: "God Mode: Removed HOD from {$department->name}"
            );

            return response()->json([
                'success' => true,
                'message' => 'HOD removed successfully',
                'data' => $department,
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error removing HOD', [
                'department_id' => $departmentId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to remove HOD',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }
}
