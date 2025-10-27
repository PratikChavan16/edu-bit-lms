<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\University;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class UniversityController extends Controller
{
    /**
     * Display a listing of universities.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = University::query();

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Search by name or domain
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('domain', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $universities = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Universities retrieved successfully',
                'data' => $universities->items(),
                'meta' => [
                    'current_page' => $universities->currentPage(),
                    'last_page' => $universities->lastPage(),
                    'per_page' => $universities->perPage(),
                    'total' => $universities->total(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve universities',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created university.
     * Creates university + auto-generates University Owner user
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'slug' => 'nullable|string|max:255|unique:universities,slug',
                'domain' => 'required|string|max:255|unique:universities,domain',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string',
                'established_year' => 'nullable|integer|min:1800|max:' . date('Y'),
                'timezone' => 'nullable|string|max:50',
                'status' => 'nullable|in:active,inactive,suspended',
                'storage_quota_gb' => 'nullable|integer|min:1',
                'branding' => 'nullable|array',
                'settings' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();

            // Auto-generate slug if not provided
            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }

            // Set defaults
            $data['status'] = $data['status'] ?? 'active';
            $data['storage_quota_gb'] = $data['storage_quota_gb'] ?? 100;
            $data['storage_used_mb'] = 0;

            // Use transaction to create university + owner
            $result = \DB::transaction(function () use ($data) {
                // 1. Create university
                $university = University::create($data);

                // 2. Generate temporary password for University Owner
                $tempPassword = Str::random(16);

                // 3. Generate username from email
                $emailUsername = explode('@', $data['email'])[0];
                $username = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $emailUsername));
                
                // Ensure username is unique
                $baseUsername = $username;
                $counter = 1;
                while (\App\Models\User::withoutGlobalScope(\App\Scopes\UniversityScope::class)
                    ->where('username', $username)->exists()) {
                    $username = $baseUsername . $counter;
                    $counter++;
                }

                // 4. Create University Owner user
                $owner = \App\Models\User::withoutGlobalScope(\App\Scopes\UniversityScope::class)->create([
                    'username' => $username,
                    'first_name' => 'University',
                    'last_name' => 'Owner',
                    'email' => $data['email'],
                    'password' => \Hash::make($tempPassword),
                    'university_id' => $university->id,
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]);

                // 5. Attach University Owner role
                $ownerRole = \App\Models\Role::where('slug', 'university_owner')->first();
                if ($ownerRole) {
                    $owner->roles()->attach($ownerRole->id, [
                        'id' => (string) Str::uuid(),
                        'assigned_at' => now(),
                        'assigned_by' => auth()->id(),
                    ]);
                }

                return [
                    'university' => $university,
                    'owner' => [
                        'id' => $owner->id,
                        'name' => $owner->full_name,
                        'email' => $owner->email,
                        'username' => $owner->username,
                        'password' => $tempPassword, // Return plain password only once
                        'role' => 'university_owner',
                    ]
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'University and owner account created successfully',
                'data' => $result,
                'note' => 'Please save the owner credentials. Password will not be shown again.'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create university',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified university.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $university = University::with(['colleges'])->findOrFail($id);

            // Get statistics
            $stats = [
                'total_colleges' => $university->colleges()->count(),
                'total_users' => $university->users()->count(),
                'storage_usage_percentage' => $university->storage_quota_gb > 0 
                    ? round(($university->storage_used_mb / ($university->storage_quota_gb * 1024)) * 100, 2)
                    : 0,
            ];

            return response()->json([
                'success' => true,
                'message' => 'University retrieved successfully',
                'data' => array_merge($university->toArray(), ['stats' => $stats])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'University not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified university.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $university = University::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'slug' => 'sometimes|required|string|max:255|unique:universities,slug,' . $id,
                'domain' => 'sometimes|required|string|max:255|unique:universities,domain,' . $id,
                'email' => 'sometimes|required|email|max:255',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string',
                'established_year' => 'nullable|integer|min:1800|max:' . date('Y'),
                'timezone' => 'nullable|string|max:50',
                'status' => 'nullable|in:active,inactive,suspended',
                'storage_quota_gb' => 'nullable|integer|min:1',
                'branding' => 'nullable|array',
                'settings' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $university->update($validator->validated());

            return response()->json([
                'success' => true,
                'message' => 'University updated successfully',
                'data' => $university->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update university',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified university (soft delete).
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $university = University::findOrFail($id);

            // Prevent deletion if university has active colleges
            $activeCollegesCount = $university->colleges()->where('status', 'active')->count();
            if ($activeCollegesCount > 0) {
                return response()->json([
                    'success' => false,
                    'message' => "Cannot delete university with {$activeCollegesCount} active college(s). Please deactivate colleges first."
                ], 422);
            }

            $university->delete();

            return response()->json([
                'success' => true,
                'message' => 'University deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete university',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restore a soft-deleted university.
     */
    public function restore(string $id): JsonResponse
    {
        try {
            $university = University::withTrashed()->findOrFail($id);
            $university->restore();

            return response()->json([
                'success' => true,
                'message' => 'University restored successfully',
                'data' => $university
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to restore university',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
