<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\College;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class CollegeSettingsController extends Controller
{
    /**
     * Get college settings
     *
     * @param Request $request
     * @param string $universityId
     * @param string $collegeId
     * @return JsonResponse
     */
    public function show(Request $request, string $universityId, string $collegeId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            // Disable global scope for Bitflow Admin
            $college = College::withoutGlobalScope(\App\Scopes\UniversityScope::class)
                ->where('university_id', $universityId)
                ->where('id', $collegeId)
                ->firstOrFail();

            // God Mode Audit Log
            AuditLog::log(
                action: 'view_college_settings',
                resourceType: 'College',
                resourceId: $collegeId,
                description: "God Mode: Viewed settings for {$college->name}"
            );

            $settings = [
                'basic_info' => [
                    'name' => $college->name,
                    'code' => $college->code,
                    'email' => $college->email,
                    'phone' => $college->phone,
                    'website' => $college->website,
                ],
                'address' => $college->address,
                'accreditation' => [
                    'grade' => $college->accreditation_grade,
                    'body' => $college->accreditation_body,
                    'valid_until' => $college->accreditation_valid_until,
                ],
                'configuration' => [
                    'status' => $college->status,
                    'established_year' => $college->established_year,
                    'type' => $college->college_type,
                    'affiliation_number' => $college->affiliation_number,
                ],
                'features' => [
                    'library_enabled' => $college->library_enabled ?? true,
                    'hostel_enabled' => $college->hostel_enabled ?? true,
                    'transport_enabled' => $college->transport_enabled ?? true,
                    'canteen_enabled' => $college->canteen_enabled ?? true,
                ],
                'branding' => [
                    'logo_url' => $college->logo_url,
                    'banner_url' => $college->banner_url,
                    'primary_color' => $college->primary_color,
                    'secondary_color' => $college->secondary_color,
                ],
            ];

            return response()->json([
                'success' => true,
                'data' => $settings,
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
            Log::error('Error fetching college settings', [
                'college_id' => $collegeId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to fetch college settings',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Update college settings (God Mode only)
     *
     * @param Request $request
     * @param string $universityId
     * @param string $collegeId
     * @return JsonResponse
     */
    public function update(Request $request, string $universityId, string $collegeId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            // Disable global scope for Bitflow Admin
            $college = College::withoutGlobalScope(\App\Scopes\UniversityScope::class)
                ->where('university_id', $universityId)
                ->where('id', $collegeId)
                ->firstOrFail();

            $validated = $request->validate([
                // Basic Info
                'name' => 'sometimes|string|max:255',
                'code' => 'sometimes|string|max:50|unique:colleges,code,' . $collegeId,
                'email' => 'sometimes|email|max:255',
                'phone' => 'nullable|string|max:20',
                'website' => 'nullable|url|max:255',
                
                // Address
                'address' => 'nullable|array',
                'address.line1' => 'nullable|string|max:255',
                'address.line2' => 'nullable|string|max:255',
                'address.city' => 'nullable|string|max:100',
                'address.state' => 'nullable|string|max:100',
                'address.postal_code' => 'nullable|string|max:20',
                'address.country' => 'nullable|string|max:100',
                
                // Accreditation
                'accreditation_grade' => 'nullable|string|max:10',
                'accreditation_body' => 'nullable|string|max:100',
                'accreditation_valid_until' => 'nullable|date',
                
                // Configuration
                'status' => 'sometimes|in:active,inactive,suspended',
                'college_type' => 'nullable|in:autonomous,affiliated,deemed',
                'affiliation_number' => 'nullable|string|max:100',
                
                // Features
                'library_enabled' => 'sometimes|boolean',
                'hostel_enabled' => 'sometimes|boolean',
                'transport_enabled' => 'sometimes|boolean',
                'canteen_enabled' => 'sometimes|boolean',
                
                // Branding
                'logo_url' => 'nullable|url',
                'banner_url' => 'nullable|url',
                'primary_color' => 'nullable|string|max:7',
                'secondary_color' => 'nullable|string|max:7',
            ]);

            $oldValues = $college->only(array_keys($validated));
            $college->update($validated);

            // God Mode Audit Log
            AuditLog::log(
                action: 'update_college_settings',
                resourceType: 'College',
                resourceId: $collegeId,
                changes: [
                    'old' => $oldValues,
                    'new' => $validated,
                ],
                description: "God Mode: Updated settings for {$college->name}"
            );

            return response()->json([
                'success' => true,
                'message' => 'College settings updated successfully',
                'data' => $college->fresh(),
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
            Log::error('Error updating college settings', [
                'college_id' => $collegeId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to update college settings',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }
}
