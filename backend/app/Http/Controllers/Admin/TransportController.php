<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\College;
use App\Models\TransportRoute;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class TransportController extends Controller
{
    /**
     * Get all transport routes for a college
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
                action: 'view_transport_routes',
                resourceType: 'Transport',
                resourceId: $collegeId,
                description: "God Mode: Viewed transport routes for {$college->name}"
            );

            $query = TransportRoute::where('college_id', $collegeId);

            // Filters
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('route_type')) {
                $query->where('route_type', $request->route_type);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('route_name', 'like', "%{$search}%")
                        ->orWhere('route_number', 'like', "%{$search}%");
                });
            }

            $perPage = $request->get('per_page', 20);
            $routes = $query->with(['bus', 'allocations'])->orderBy('route_number')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $routes->items(),
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                    'portal' => 'bitflow-admin',
                    'pagination' => [
                        'current_page' => $routes->currentPage(),
                        'last_page' => $routes->lastPage(),
                        'per_page' => $routes->perPage(),
                        'total' => $routes->total(),
                    ],
                    'god_mode_context' => [
                        'is_god_mode' => true,
                        'viewing_tenant_id' => $universityId,
                        'hierarchy_level' => 'platform',
                    ],
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching transport routes', [
                'college_id' => $collegeId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to fetch transport routes',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Store a new transport route
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
                'route_name' => 'required|string|max:255',
                'route_number' => 'required|string|max:50',
                'route_type' => 'required|in:morning,evening,both',
                'transport_bus_id' => 'nullable|exists:transport_buses,id',
                'departure_time' => 'nullable|date_format:H:i',
                'return_time' => 'nullable|date_format:H:i',
                'distance_km' => 'nullable|numeric|min:0',
                'fare_amount' => 'required|numeric|min:0',
                'stops' => 'nullable|array',
                'stops.*.name' => 'required|string|max:255',
                'stops.*.arrival_time' => 'required|date_format:H:i',
                'stops.*.latitude' => 'nullable|numeric',
                'stops.*.longitude' => 'nullable|numeric',
                'status' => 'required|in:active,inactive,maintenance',
            ]);

            $validated['college_id'] = $collegeId;

            $route = TransportRoute::create($validated);

            AuditLog::log(
                action: 'create_transport_route',
                resourceType: 'TransportRoute',
                resourceId: $route->id,
                changes: ['new' => $validated],
                description: "God Mode: Created transport route {$route->route_name}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Transport route created successfully',
                'data' => $route,
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
            Log::error('Error creating transport route', [
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to create transport route',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Show a specific transport route
     */
    public function show(Request $request, string $universityId, string $collegeId, string $routeId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $route = TransportRoute::where('college_id', $collegeId)
                ->where('id', $routeId)
                ->with(['bus', 'allocations.student'])
                ->firstOrFail();

            AuditLog::log(
                action: 'view_transport_route',
                resourceType: 'TransportRoute',
                resourceId: $routeId,
                description: "God Mode: Viewed transport route {$route->route_name}"
            );

            return response()->json([
                'success' => true,
                'data' => $route,
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
                    'message' => 'Transport route not found',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 404);
        }
    }

    /**
     * Update a transport route
     */
    public function update(Request $request, string $universityId, string $collegeId, string $routeId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $route = TransportRoute::where('college_id', $collegeId)
                ->where('id', $routeId)
                ->firstOrFail();

            $validated = $request->validate([
                'route_name' => 'sometimes|string|max:255',
                'route_type' => 'sometimes|in:morning,evening,both',
                'departure_time' => 'nullable|date_format:H:i',
                'return_time' => 'nullable|date_format:H:i',
                'fare_amount' => 'sometimes|numeric|min:0',
                'stops' => 'nullable|array',
                'status' => 'sometimes|in:active,inactive,maintenance',
            ]);

            $oldValues = $route->only(array_keys($validated));
            $route->update($validated);

            AuditLog::log(
                action: 'update_transport_route',
                resourceType: 'TransportRoute',
                resourceId: $routeId,
                changes: [
                    'old' => $oldValues,
                    'new' => $validated,
                ],
                description: "God Mode: Updated transport route {$route->route_name}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Transport route updated successfully',
                'data' => $route->fresh(),
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
            Log::error('Error updating transport route', [
                'route_id' => $routeId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to update transport route',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Delete a transport route (soft delete)
     */
    public function destroy(Request $request, string $universityId, string $collegeId, string $routeId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $route = TransportRoute::where('college_id', $collegeId)
                ->where('id', $routeId)
                ->firstOrFail();

            $routeName = $route->route_name;
            $route->delete();

            AuditLog::log(
                action: 'delete_transport_route',
                resourceType: 'TransportRoute',
                resourceId: $routeId,
                description: "God Mode: Deleted transport route {$routeName}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Transport route deleted successfully',
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
            Log::error('Error deleting transport route', [
                'route_id' => $routeId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to delete transport route',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }
}
