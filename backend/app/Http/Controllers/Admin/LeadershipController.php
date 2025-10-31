<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\College;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class LeadershipController extends Controller
{
    /**
     * Get leadership team (Principal + College Admin) for a college
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
            $college = College::where('university_id', $universityId)
                ->where('id', $collegeId)
                ->firstOrFail();

            // God Mode Audit Log
            AuditLog::log(
                action: 'view_leadership_team',
                resourceType: 'Leadership',
                resourceId: $collegeId,
                description: "God Mode: Viewed leadership team for {$college->name}"
            );

            // Get Principal (role: principal)
            $principal = User::whereHas('roles', function ($query) {
                    $query->where('name', 'principal');
                })
                ->where('college_id', $collegeId)
                ->with(['roles'])
                ->first();

            // Get College Admin (role: college_admin)
            $collegeAdmin = User::whereHas('roles', function ($query) {
                    $query->where('name', 'college_admin');
                })
                ->where('college_id', $collegeId)
                ->with(['roles'])
                ->first();

            // Get other leadership members (super_academics, etc.)
            $otherLeaders = User::whereHas('roles', function ($query) {
                    $query->whereIn('name', ['super_academics', 'college_accounts_admin', 'admission_admin']);
                })
                ->where('college_id', $collegeId)
                ->with(['roles'])
                ->get();

            $data = [
                'college' => [
                    'id' => $college->id,
                    'name' => $college->name,
                    'code' => $college->code,
                ],
                'principal' => $principal ? [
                    'id' => $principal->id,
                    'name' => $principal->name,
                    'email' => $principal->email,
                    'phone' => $principal->phone,
                    'role' => 'Principal',
                    'status' => $principal->status,
                ] : null,
                'college_admin' => $collegeAdmin ? [
                    'id' => $collegeAdmin->id,
                    'name' => $collegeAdmin->name,
                    'email' => $collegeAdmin->email,
                    'phone' => $collegeAdmin->phone,
                    'role' => 'College Admin',
                    'status' => $collegeAdmin->status,
                ] : null,
                'other_leaders' => $otherLeaders->map(function ($user) {
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'role' => $user->roles->pluck('name')->first(),
                        'status' => $user->status,
                    ];
                }),
            ];

            return response()->json([
                'success' => true,
                'data' => $data,
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
            Log::error('Error fetching leadership team', [
                'college_id' => $collegeId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to fetch leadership team',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Show a specific leadership member
     *
     * @param Request $request
     * @param string $universityId
     * @param string $collegeId
     * @param string $userId
     * @return JsonResponse
     */
    public function show(Request $request, string $universityId, string $collegeId, string $userId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $user = User::where('id', $userId)
                ->with(['roles', 'roleUser'])
                ->firstOrFail();

            // Verify user is associated with this college
            $hasCollegeRole = $user->roleUser->where('college_id', $collegeId)->isNotEmpty();

            if (!$hasCollegeRole) {
                return response()->json([
                    'success' => false,
                    'error' => [
                        'code' => 'ERR_UNAUTHORIZED',
                        'message' => 'User is not part of this college leadership',
                    ],
                    'metadata' => [
                        'timestamp' => now()->toIso8601String(),
                        'request_id' => $requestId,
                    ],
                ], 403);
            }

            AuditLog::log(
                action: 'view_leadership_member',
                resourceType: 'User',
                resourceId: $userId,
                description: "God Mode: Viewed leadership member {$user->name}"
            );

            return response()->json([
                'success' => true,
                'data' => $user,
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
            Log::error('Error fetching leadership member', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_RESOURCE_NOT_FOUND',
                    'message' => 'Leadership member not found',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 404);
        }
    }

    /**
     * Update a leadership member (God Mode only - limited fields)
     *
     * @param Request $request
     * @param string $universityId
     * @param string $collegeId
     * @param string $userId
     * @return JsonResponse
     */
    public function update(Request $request, string $universityId, string $collegeId, string $userId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $user = User::where('id', $userId)->firstOrFail();

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'phone' => 'nullable|string|max:20',
                'status' => 'sometimes|in:active,inactive',
            ]);

            $oldValues = $user->only(array_keys($validated));
            $user->update($validated);

            AuditLog::log(
                action: 'update_leadership_member',
                resourceType: 'User',
                resourceId: $userId,
                changes: [
                    'old' => $oldValues,
                    'new' => $validated,
                ],
                description: "God Mode: Updated leadership member {$user->name}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Leadership member updated successfully',
                'data' => $user->fresh(),
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
            Log::error('Error updating leadership member', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to update leadership member',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Assign a leadership role to a user
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
            $validated = $request->validate([
                'user_id' => 'required|uuid|exists:users,id',
                'role' => 'required|in:principal,vice_principal,college_admin,hod',
                'department_id' => 'required_if:role,hod|uuid|exists:departments,id',
            ]);

            $college = College::where('university_id', $universityId)
                ->where('id', $collegeId)
                ->firstOrFail();

            $user = User::findOrFail($validated['user_id']);
            
            // Check if user belongs to this college
            if ($user->college_id && $user->college_id !== $collegeId) {
                return response()->json([
                    'success' => false,
                    'error' => [
                        'code' => 'ERR_USER_DIFFERENT_COLLEGE',
                        'message' => 'User belongs to a different college',
                    ],
                    'metadata' => [
                        'timestamp' => now()->toIso8601String(),
                        'request_id' => $requestId,
                    ],
                ], 422);
            }
            
            // Check if user already has this role
            $existingRole = \DB::table('role_user')
                ->join('roles', 'role_user.role_id', '=', 'roles.id')
                ->where('role_user.user_id', $user->id)
                ->where('roles.name', $validated['role'])
                ->exists();

            if ($existingRole) {
                return response()->json([
                    'success' => false,
                    'error' => [
                        'code' => 'ERR_DUPLICATE_ROLE',
                        'message' => 'User already has this role',
                    ],
                    'metadata' => [
                        'timestamp' => now()->toIso8601String(),
                        'request_id' => $requestId,
                    ],
                ], 422);
            }

            // For principal, check if one already exists for this college
            if ($validated['role'] === 'principal') {
                $existingPrincipal = User::whereHas('roles', function ($query) {
                        $query->where('name', 'principal');
                    })
                    ->where('college_id', $collegeId)
                    ->exists();

                if ($existingPrincipal) {
                    return response()->json([
                        'success' => false,
                        'error' => [
                            'code' => 'ERR_PRINCIPAL_EXISTS',
                            'message' => 'A principal already exists for this college. Please remove the existing principal first.',
                        ],
                        'metadata' => [
                            'timestamp' => now()->toIso8601String(),
                            'request_id' => $requestId,
                        ],
                    ], 422);
                }
            }

            // Find the role
            $role = \App\Models\Role::where('name', $validated['role'])->firstOrFail();

            // Attach role with metadata
            $pivotData = [
                'assigned_at' => now(),
            ];

            if ($validated['role'] === 'hod' && isset($validated['department_id'])) {
                // Check if department already has a HOD
                $department = \App\Models\Department::find($validated['department_id']);
                if ($department) {
                    if ($department->head_faculty_id) {
                        return response()->json([
                            'success' => false,
                            'error' => [
                                'code' => 'ERR_HOD_EXISTS',
                                'message' => 'This department already has a HOD. Please remove the existing HOD first.',
                            ],
                            'metadata' => [
                                'timestamp' => now()->toIso8601String(),
                                'request_id' => $requestId,
                            ],
                        ], 422);
                    }
                    
                    $department->update(['head_faculty_id' => $user->id]);
                }
            }

            $user->roles()->attach($role->id, $pivotData);

            // Update user's college_id if not set
            if (empty($user->college_id)) {
                $user->update(['college_id' => $collegeId]);
            }

            AuditLog::log(
                action: 'assign_leadership_role',
                resourceType: 'Leadership',
                resourceId: $user->id,
                changes: [
                    'role' => $validated['role'],
                    'college_id' => $collegeId,
                    'department_id' => $validated['department_id'] ?? null,
                ],
                description: "God Mode: Assigned {$validated['role']} role to {$user->name} for {$college->name}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Leadership role assigned successfully',
                'data' => $user->fresh()->load('roles'),
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                    'portal' => 'bitflow-admin',
                ],
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_VALIDATION_FAILED',
                    'message' => 'Validation failed',
                    'errors' => $e->errors(),
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error assigning leadership role', [
                'college_id' => $collegeId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to assign leadership role',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Remove a leadership role from a user
     *
     * @param Request $request
     * @param string $universityId
     * @param string $collegeId
     * @param string $userId
     * @return JsonResponse
     */
    public function destroy(Request $request, string $universityId, string $collegeId, string $userId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $user = User::where('id', $userId)
                ->where('college_id', $collegeId)
                ->firstOrFail();
            
            // Get the leadership roles for this user
            $leadershipRoles = $user->roles()
                ->whereIn('name', ['principal', 'vice_principal', 'college_admin', 'hod'])
                ->get();

            if ($leadershipRoles->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'error' => [
                        'code' => 'ERR_RESOURCE_NOT_FOUND',
                        'message' => 'Leadership role not found for this user',
                    ],
                    'metadata' => [
                        'timestamp' => now()->toIso8601String(),
                        'request_id' => $requestId,
                    ],
                ], 404);
            }

            // Detach all leadership roles
            $roleIds = $leadershipRoles->pluck('id')->toArray();
            $user->roles()->detach($roleIds);
            
            // If removing HOD role, also clear department's head_faculty_id
            $hodRole = $leadershipRoles->firstWhere('name', 'hod');
            if ($hodRole) {
                \App\Models\Department::where('head_faculty_id', $userId)
                    ->where('college_id', $collegeId)
                    ->update(['head_faculty_id' => null]);
            }

            AuditLog::log(
                action: 'remove_leadership_role',
                resourceType: 'Leadership',
                resourceId: $userId,
                changes: [
                    'roles' => $leadershipRoles->pluck('name')->toArray(),
                    'college_id' => $collegeId,
                ],
                description: "God Mode: Removed leadership role(s) from {$user->name}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Leadership role removed successfully',
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                    'portal' => 'bitflow-admin',
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error removing leadership role', [
                'user_id' => $userId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to remove leadership role',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }
}
