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

class AdministrativeStaffController extends Controller
{
    /**
     * Get all administrative staff for a college
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

            // Build query for administrative staff
            $query = User::where('college_id', $collegeId)
                ->whereIn('role', ['admission_admin', 'college_accounts_admin', 'college_fee_admin'])
                ->with(['department', 'college']);

            // Apply filters
            if ($request->has('role')) {
                $query->where('role', $request->role);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('department_id')) {
                $query->where('department_id', $request->department_id);
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
                action: 'view_administrative_staff_list',
                resourceType: 'AdministrativeStaff',
                resourceId: null,
                description: "God Mode: Viewed administrative staff list for college {$collegeId}"
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
            Log::error('Error fetching administrative staff', [
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to fetch administrative staff',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Create a new administrative staff member
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
                'role' => 'required|in:admission_admin,college_accounts_admin,college_fee_admin',
                'department_id' => 'nullable|exists:departments,id',
                'designation' => 'nullable|string|max:100',
                'joining_date' => 'nullable|date',
                'status' => 'nullable|in:active,inactive,on_leave',
            ]);

            // Add context IDs
            $validated['college_id'] = $collegeId;
            $validated['university_id'] = $universityId;
            $validated['status'] = $validated['status'] ?? 'active';

            // Generate a default password (should be changed on first login)
            $validated['password'] = Hash::make('DefaultPassword123!');

            // Create administrative staff member
            $staff = User::create($validated);

            // Audit log
            AuditLog::log(
                action: 'create_administrative_staff',
                resourceType: 'AdministrativeStaff',
                resourceId: $staff->id,
                changes: [
                    'new' => $validated,
                ],
                description: "God Mode: Created administrative staff {$staff->employee_id} with role {$staff->role}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Administrative staff member created successfully',
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
            Log::error('Error creating administrative staff', [
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to create administrative staff member',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Show a specific administrative staff member
     */
    public function show(Request $request, string $universityId, string $collegeId, string $staffId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $staff = User::where('college_id', $collegeId)
                ->where('id', $staffId)
                ->whereIn('role', ['admission_admin', 'college_accounts_admin', 'college_fee_admin'])
                ->with(['department', 'college'])
                ->firstOrFail();

            AuditLog::log(
                action: 'view_administrative_staff',
                resourceType: 'AdministrativeStaff',
                resourceId: $staffId,
                description: "God Mode: Viewed administrative staff {$staff->employee_id}"
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
                    'message' => 'Administrative staff member not found',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 404);
        }
    }

    /**
     * Update an administrative staff member
     */
    public function update(Request $request, string $universityId, string $collegeId, string $staffId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $staff = User::where('college_id', $collegeId)
                ->where('id', $staffId)
                ->whereIn('role', ['admission_admin', 'college_accounts_admin', 'college_fee_admin'])
                ->firstOrFail();

            $validated = $request->validate([
                'first_name' => 'sometimes|string|max:100',
                'last_name' => 'sometimes|string|max:100',
                'email' => 'sometimes|email|unique:users,email,' . $staffId,
                'phone' => 'nullable|string|max:20',
                'role' => 'sometimes|in:admission_admin,college_accounts_admin,college_fee_admin',
                'department_id' => 'nullable|exists:departments,id',
                'designation' => 'nullable|string|max:100',
                'joining_date' => 'nullable|date',
                'status' => 'sometimes|in:active,inactive,on_leave',
            ]);

            $oldValues = $staff->only(array_keys($validated));
            $staff->update($validated);

            AuditLog::log(
                action: 'update_administrative_staff',
                resourceType: 'AdministrativeStaff',
                resourceId: $staffId,
                changes: [
                    'old' => $oldValues,
                    'new' => $validated,
                ],
                description: "God Mode: Updated administrative staff {$staff->employee_id}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Administrative staff member updated successfully',
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
            Log::error('Error updating administrative staff', [
                'staff_id' => $staffId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to update administrative staff member',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Delete an administrative staff member (soft delete)
     */
    public function destroy(Request $request, string $universityId, string $collegeId, string $staffId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $staff = User::where('college_id', $collegeId)
                ->where('id', $staffId)
                ->whereIn('role', ['admission_admin', 'college_accounts_admin', 'college_fee_admin'])
                ->firstOrFail();

            $employeeId = $staff->employee_id;
            $staff->delete();

            AuditLog::log(
                action: 'delete_administrative_staff',
                resourceType: 'AdministrativeStaff',
                resourceId: $staffId,
                description: "God Mode: Deleted administrative staff {$employeeId}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Administrative staff member deleted successfully',
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
            Log::error('Error deleting administrative staff', [
                'staff_id' => $staffId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to delete administrative staff member',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }
}
