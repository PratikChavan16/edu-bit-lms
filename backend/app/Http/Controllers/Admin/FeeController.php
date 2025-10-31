<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\College;
use App\Models\FeeStructure;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class FeeController extends Controller
{
    /**
     * Get all fee structures for a college
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
                action: 'view_fee_structures',
                resourceType: 'Fee',
                resourceId: $collegeId,
                description: "God Mode: Viewed fee structures for {$college->name}"
            );

            $query = FeeStructure::where('college_id', $collegeId);

            // Filters
            if ($request->has('fee_type')) {
                $query->where('fee_type', $request->fee_type);
            }

            if ($request->has('academic_year')) {
                $query->where('academic_year', $request->academic_year);
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
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('fee_code', 'like', "%{$search}%");
                });
            }

            $perPage = $request->get('per_page', 20);
            $feeStructures = $query->with(['department', 'payments', 'reminders'])->orderBy('name')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $feeStructures->items(),
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                    'portal' => 'bitflow-admin',
                    'pagination' => [
                        'current_page' => $feeStructures->currentPage(),
                        'last_page' => $feeStructures->lastPage(),
                        'per_page' => $feeStructures->perPage(),
                        'total' => $feeStructures->total(),
                    ],
                    'god_mode_context' => [
                        'is_god_mode' => true,
                        'viewing_tenant_id' => $universityId,
                        'hierarchy_level' => 'platform',
                    ],
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching fee structures', [
                'college_id' => $collegeId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to fetch fee structures',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Store a new fee structure
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
                'fee_code' => 'required|string|max:50|unique:fee_structures,fee_code',
                'fee_type' => 'required|in:tuition,library,lab,hostel,transport,exam,sports,development,misc',
                'amount' => 'required|numeric|min:0',
                'currency' => 'nullable|string|max:3',
                'academic_year' => 'required|string|max:20',
                'semester' => 'nullable|integer|between:1,8',
                'department_id' => 'nullable|exists:departments,id',
                'year' => 'nullable|integer|between:1,4',
                'due_date' => 'required|date',
                'late_fee_applicable' => 'nullable|boolean',
                'late_fee_amount' => 'nullable|numeric|min:0',
                'late_fee_type' => 'nullable|in:flat,percentage',
                'is_mandatory' => 'nullable|boolean',
                'is_refundable' => 'nullable|boolean',
                'payment_schedule' => 'nullable|array',
                'description' => 'nullable|string',
                'status' => 'required|in:active,inactive,archived',
            ]);

            $validated['college_id'] = $collegeId;
            $validated['university_id'] = $universityId;

            $feeStructure = FeeStructure::create($validated);

            AuditLog::log(
                action: 'create_fee_structure',
                resourceType: 'FeeStructure',
                resourceId: $feeStructure->id,
                changes: ['new' => $validated],
                description: "God Mode: Created fee structure {$feeStructure->name}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Fee structure created successfully',
                'data' => $feeStructure,
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
            Log::error('Error creating fee structure', [
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to create fee structure',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Show a specific fee structure
     */
    public function show(Request $request, string $universityId, string $collegeId, string $feeId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $feeStructure = FeeStructure::where('college_id', $collegeId)
                ->where('id', $feeId)
                ->with(['department', 'payments', 'reminders'])
                ->firstOrFail();

            AuditLog::log(
                action: 'view_fee_structure',
                resourceType: 'FeeStructure',
                resourceId: $feeId,
                description: "God Mode: Viewed fee structure {$feeStructure->name}"
            );

            return response()->json([
                'success' => true,
                'data' => $feeStructure,
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
                    'message' => 'Fee structure not found',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 404);
        }
    }

    /**
     * Update a fee structure
     */
    public function update(Request $request, string $universityId, string $collegeId, string $feeId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $feeStructure = FeeStructure::where('college_id', $collegeId)
                ->where('id', $feeId)
                ->firstOrFail();

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'amount' => 'sometimes|numeric|min:0',
                'due_date' => 'sometimes|date',
                'late_fee_amount' => 'nullable|numeric|min:0',
                'late_fee_type' => 'nullable|in:flat,percentage',
                'status' => 'sometimes|in:active,inactive,archived',
            ]);

            $oldValues = $feeStructure->only(array_keys($validated));
            $feeStructure->update($validated);

            AuditLog::log(
                action: 'update_fee_structure',
                resourceType: 'FeeStructure',
                resourceId: $feeId,
                changes: [
                    'old' => $oldValues,
                    'new' => $validated,
                ],
                description: "God Mode: Updated fee structure {$feeStructure->name}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Fee structure updated successfully',
                'data' => $feeStructure->fresh(),
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
            Log::error('Error updating fee structure', [
                'fee_id' => $feeId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to update fee structure',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Delete a fee structure (soft delete)
     */
    public function destroy(Request $request, string $universityId, string $collegeId, string $feeId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $feeStructure = FeeStructure::where('college_id', $collegeId)
                ->where('id', $feeId)
                ->firstOrFail();

            $feeName = $feeStructure->name;
            $feeStructure->delete();

            AuditLog::log(
                action: 'delete_fee_structure',
                resourceType: 'FeeStructure',
                resourceId: $feeId,
                description: "God Mode: Deleted fee structure {$feeName}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Fee structure deleted successfully',
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
            Log::error('Error deleting fee structure', [
                'fee_id' => $feeId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to delete fee structure',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }
}
