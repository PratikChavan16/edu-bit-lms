<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\College;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Hash;

class NonTeachingStaffController extends Controller
{
    /**
     * Get all non-teaching staff for a college
     */
    public function index(Request $request, string $universityId, string $collegeId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            // Verify college exists (God Mode - bypass UniversityScope)
            $college = College::withoutGlobalScope(\App\Scopes\UniversityScope::class)
                ->where('university_id', $universityId)
                ->where('id', $collegeId)
                ->firstOrFail();

            // Build query for non-teaching staff
            $query = User::where('college_id', $collegeId)
                ->where('role', 'non_teaching_staff')
                ->with(['department', 'college']);

            // Apply filters
            if ($request->has('employee_type')) {
                $query->where('employee_type', $request->employee_type);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('department_id')) {
                $query->where('department_id', $request->department_id);
            }

            if ($request->has('shift')) {
                $query->where('shift', $request->shift);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('employee_id', 'like', "%{$search}%");
                });
            }

            // Pagination
            $perPage = $request->input('per_page', 15);
            $staff = $query->paginate($perPage);

            // Audit log
            AuditLog::log(
                action: 'view_non_teaching_staff_list',
                resourceType: 'NonTeachingStaff',
                resourceId: null,
                description: "God Mode: Viewed non-teaching staff list for college {$collegeId}"
            );

            return response()->json([
                'success' => true,
                'data' => $staff->items(),
                'pagination' => [
                    'current_page' => $staff->currentPage(),
                    'per_page' => $staff->perPage(),
                    'total' => $staff->total(),
                    'last_page' => $staff->lastPage(),
                ],
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
            Log::error('Error fetching non-teaching staff', [
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to fetch non-teaching staff',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Create a new non-teaching staff member
     */
    public function store(Request $request, string $universityId, string $collegeId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            // Verify college exists (God Mode)
            $college = College::withoutGlobalScope(\App\Scopes\UniversityScope::class)
                ->where('university_id', $universityId)
                ->where('id', $collegeId)
                ->firstOrFail();

            // Validate request
            $validated = $request->validate([
                'employee_id' => 'required|string|unique:users,employee_id',
                'first_name' => 'required|string|max:100',
                'last_name' => 'required|string|max:100',
                'email' => 'required|email|unique:users,email',
                'phone' => 'nullable|string|max:20',
                'employee_type' => 'required|in:lab_assistant,peon,maintenance,security,clerical,other',
                'designation' => 'nullable|string|max:100',
                'department_id' => 'nullable|exists:departments,id',
                'joining_date' => 'nullable|date',
                'shift' => 'nullable|in:morning,evening,night,rotational',
                'supervisor_name' => 'nullable|string|max:100',
                'status' => 'nullable|in:active,inactive,on_leave',
            ]);

            // Add context IDs and role
            $validated['college_id'] = $collegeId;
            $validated['university_id'] = $universityId;
            $validated['role'] = 'non_teaching_staff';
            $validated['status'] = $validated['status'] ?? 'active';

            // Generate a default password (should be changed on first login)
            $validated['password'] = Hash::make('DefaultPassword123!');

            // Create non-teaching staff member
            $staff = User::create($validated);

            // Audit log
            AuditLog::log(
                action: 'create_non_teaching_staff',
                resourceType: 'NonTeachingStaff',
                resourceId: $staff->id,
                changes: [
                    'new' => $validated,
                ],
                description: "God Mode: Created non-teaching staff {$staff->employee_id} of type {$staff->employee_type}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Non-teaching staff member created successfully',
                'data' => $staff,
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
            Log::error('Error creating non-teaching staff', [
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to create non-teaching staff member',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Show a specific non-teaching staff member
     */
    public function show(Request $request, string $universityId, string $collegeId, string $staffId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $staff = User::where('college_id', $collegeId)
                ->where('id', $staffId)
                ->where('role', 'non_teaching_staff')
                ->with(['department', 'college'])
                ->firstOrFail();

            AuditLog::log(
                action: 'view_non_teaching_staff',
                resourceType: 'NonTeachingStaff',
                resourceId: $staffId,
                description: "God Mode: Viewed non-teaching staff {$staff->employee_id}"
            );

            return response()->json([
                'success' => true,
                'data' => $staff,
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
                    'message' => 'Non-teaching staff member not found',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 404);
        }
    }

    /**
     * Update a non-teaching staff member
     */
    public function update(Request $request, string $universityId, string $collegeId, string $staffId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $staff = User::where('college_id', $collegeId)
                ->where('id', $staffId)
                ->where('role', 'non_teaching_staff')
                ->firstOrFail();

            $validated = $request->validate([
                'first_name' => 'sometimes|string|max:100',
                'last_name' => 'sometimes|string|max:100',
                'email' => 'sometimes|email|unique:users,email,' . $staffId,
                'phone' => 'nullable|string|max:20',
                'employee_type' => 'sometimes|in:lab_assistant,peon,maintenance,security,clerical,other',
                'designation' => 'nullable|string|max:100',
                'department_id' => 'nullable|exists:departments,id',
                'joining_date' => 'nullable|date',
                'shift' => 'nullable|in:morning,evening,night,rotational',
                'supervisor_name' => 'nullable|string|max:100',
                'status' => 'sometimes|in:active,inactive,on_leave',
            ]);

            $oldValues = $staff->only(array_keys($validated));
            $staff->update($validated);

            AuditLog::log(
                action: 'update_non_teaching_staff',
                resourceType: 'NonTeachingStaff',
                resourceId: $staffId,
                changes: [
                    'old' => $oldValues,
                    'new' => $validated,
                ],
                description: "God Mode: Updated non-teaching staff {$staff->employee_id}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Non-teaching staff member updated successfully',
                'data' => $staff->fresh(),
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
            Log::error('Error updating non-teaching staff', [
                'staff_id' => $staffId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to update non-teaching staff member',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Delete a non-teaching staff member (soft delete)
     */
    public function destroy(Request $request, string $universityId, string $collegeId, string $staffId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $staff = User::where('college_id', $collegeId)
                ->where('id', $staffId)
                ->where('role', 'non_teaching_staff')
                ->firstOrFail();

            $employeeId = $staff->employee_id;
            $staff->delete();

            AuditLog::log(
                action: 'delete_non_teaching_staff',
                resourceType: 'NonTeachingStaff',
                resourceId: $staffId,
                description: "God Mode: Deleted non-teaching staff {$employeeId}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Non-teaching staff member deleted successfully',
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
            Log::error('Error deleting non-teaching staff', [
                'staff_id' => $staffId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to delete non-teaching staff member',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }
}
