<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\College;
use App\Models\Hostel;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class HostelController extends Controller
{
    /**
     * Get all hostels for a college
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
                action: 'view_hostels_list',
                resourceType: 'Hostel',
                resourceId: $collegeId,
                description: "God Mode: Viewed hostels list for {$college->name}"
            );

            $query = Hostel::where('college_id', $collegeId);

            // Filters
            if ($request->has('hostel_type')) {
                $query->where('hostel_type', $request->hostel_type);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('hostel_code', 'like', "%{$search}%")
                        ->orWhere('warden_name', 'like', "%{$search}%");
                });
            }

            $perPage = $request->get('per_page', 20);
            $hostels = $query->with(['rooms'])->orderBy('name')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $hostels->items(),
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                    'portal' => 'bitflow-admin',
                    'pagination' => [
                        'current_page' => $hostels->currentPage(),
                        'last_page' => $hostels->lastPage(),
                        'per_page' => $hostels->perPage(),
                        'total' => $hostels->total(),
                    ],
                    'god_mode_context' => [
                        'is_god_mode' => true,
                        'viewing_tenant_id' => $universityId,
                        'hierarchy_level' => 'platform',
                    ],
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching hostels', [
                'college_id' => $collegeId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to fetch hostels',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Store a new hostel
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
                'hostel_code' => 'required|string|max:50|unique:hostels,hostel_code',
                'hostel_type' => 'required|in:boys,girls,coed',
                'warden_name' => 'required|string|max:255',
                'warden_phone' => 'required|string|max:20',
                'warden_email' => 'nullable|email|max:255',
                'total_rooms' => 'required|integer|min:1',
                'capacity' => 'required|integer|min:1',
                'occupied_beds' => 'nullable|integer|min:0',
                'monthly_fee' => 'nullable|numeric|min:0',
                'security_deposit' => 'nullable|numeric|min:0',
                'facilities' => 'nullable|array',
                'facilities.*' => 'string',
                'address' => 'nullable|array',
                'address.street' => 'nullable|string',
                'address.city' => 'nullable|string',
                'address.state' => 'nullable|string',
                'address.pincode' => 'nullable|string',
                'description' => 'nullable|string',
                'status' => 'required|in:active,inactive,renovation',
            ]);

            $validated['college_id'] = $collegeId;
            $validated['university_id'] = $universityId;

            $hostel = Hostel::create($validated);

            AuditLog::log(
                action: 'create_hostel',
                resourceType: 'Hostel',
                resourceId: $hostel->id,
                changes: ['new' => $validated],
                description: "God Mode: Created hostel {$hostel->name}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Hostel created successfully',
                'data' => $hostel,
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
            Log::error('Error creating hostel', [
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to create hostel',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Show a specific hostel
     */
    public function show(Request $request, string $universityId, string $collegeId, string $hostelId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $hostel = Hostel::where('college_id', $collegeId)
                ->where('id', $hostelId)
                ->with(['rooms.allocations'])
                ->firstOrFail();

            AuditLog::log(
                action: 'view_hostel',
                resourceType: 'Hostel',
                resourceId: $hostelId,
                description: "God Mode: Viewed hostel {$hostel->name}"
            );

            return response()->json([
                'success' => true,
                'data' => $hostel,
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
                    'message' => 'Hostel not found',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 404);
        }
    }

    /**
     * Update a hostel
     */
    public function update(Request $request, string $universityId, string $collegeId, string $hostelId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $hostel = Hostel::where('college_id', $collegeId)
                ->where('id', $hostelId)
                ->firstOrFail();

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'warden_name' => 'sometimes|string|max:255',
                'warden_phone' => 'sometimes|string|max:20',
                'monthly_fee' => 'nullable|numeric|min:0',
                'facilities' => 'nullable|array',
                'status' => 'sometimes|in:active,inactive,renovation',
            ]);

            $oldValues = $hostel->only(array_keys($validated));
            $hostel->update($validated);

            AuditLog::log(
                action: 'update_hostel',
                resourceType: 'Hostel',
                resourceId: $hostelId,
                changes: [
                    'old' => $oldValues,
                    'new' => $validated,
                ],
                description: "God Mode: Updated hostel {$hostel->name}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Hostel updated successfully',
                'data' => $hostel->fresh(),
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
            Log::error('Error updating hostel', [
                'hostel_id' => $hostelId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to update hostel',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Delete a hostel (soft delete)
     */
    public function destroy(Request $request, string $universityId, string $collegeId, string $hostelId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $hostel = Hostel::where('college_id', $collegeId)
                ->where('id', $hostelId)
                ->firstOrFail();

            $hostelName = $hostel->name;
            $hostel->delete();

            AuditLog::log(
                action: 'delete_hostel',
                resourceType: 'Hostel',
                resourceId: $hostelId,
                description: "God Mode: Deleted hostel {$hostelName}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Hostel deleted successfully',
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
            Log::error('Error deleting hostel', [
                'hostel_id' => $hostelId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to delete hostel',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }
}
