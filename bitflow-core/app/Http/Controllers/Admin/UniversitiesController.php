<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Requests\Admin\StoreUniversityRequest;
use App\Http\Requests\Admin\UpdateUniversityRequest;
use App\Http\Responses\ApiResponse;
use App\Models\University;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Universities list and provisioning controller.
 */
final class UniversitiesController
{
    /**
     * GET /admin/universities
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        // Implement repository query with filters
        $query = University::query()->withCount('colleges');
        
        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('code', 'like', "%{$request->search}%");
            });
        }
        
        // Pagination
        $perPage = $request->get('per_page', 15);
        $universities = $query->latest()->paginate($perPage);
        
        $data = $universities->getCollection()->map(function ($university) {
            return [
                'id' => $university->id,
                'name' => $university->name,
                'code' => $university->code,
                'domain' => $university->code . '.bitflow.test',
                'status' => $university->status ?? 'active',
                'collegesCount' => $university->colleges_count ?? 0,
                'storageUsedGb' => 0, // TODO: Implement storage tracking
                'lastBackupAt' => $university->updated_at?->toIso8601String(),
                'subscriptionTier' => 'standard', // TODO: Implement subscription model
                'createdAt' => $university->created_at?->toIso8601String(),
            ];
        });

        return ApiResponse::success(
            $data,
            null,
            [
                'current_page' => $universities->currentPage(),
                'per_page' => $universities->perPage(),
                'total' => $universities->total(),
                'last_page' => $universities->lastPage(),
            ]
        )->withHeaders([
            'X-Total-Count' => (string)$universities->total(),
        ]);
    }

    /**
     * GET /admin/universities/{universityId}
     *
     * @param string $universityId
     * @return JsonResponse
     */
    public function show(string $universityId): JsonResponse
    {
        // Fetch from repository with relationships
        $university = University::with(['colleges.students', 'colleges.faculty'])
            ->withCount('colleges')
            ->findOrFail($universityId);
        
        // Calculate statistics
        $totalStudents = $university->colleges->sum(function ($college) {
            return $college->students->count();
        });
        
        $totalFaculty = $university->colleges->sum(function ($college) {
            return $college->faculty->count();
        });
        
        $activeUsers = $totalStudents + $totalFaculty;
        
        return ApiResponse::success([
            'id' => $university->id,
            'name' => $university->name,
            'slug' => $university->slug,
            'domain' => $university->domain,
            'status' => $university->status,
            'timezone' => $university->timezone,
            'branding' => $university->branding,
            'storage_quota_gb' => $university->storage_quota_gb,
            'storage_used_mb' => $university->storage_used_mb,
            'last_backup_at' => $university->last_backup_at?->toIso8601String(),
            'created_at' => $university->created_at?->toIso8601String(),
            'updated_at' => $university->updated_at?->toIso8601String(),
            'colleges_count' => $university->colleges_count ?? 0,
            'students_count' => $totalStudents,
            'faculty_count' => $totalFaculty,
            'stats' => [
                'colleges' => $university->colleges_count ?? 0,
                'students' => $totalStudents,
                'faculty' => $totalFaculty,
                'activeUsers' => $activeUsers,
                'storageUsedGb' => round($university->storage_used_mb / 1024, 2),
            ],
            'colleges' => $university->colleges->map(function ($college) {
                return [
                    'id' => $college->id,
                    'name' => $college->name,
                    'code' => $college->code,
                    'status' => $college->status,
                    'students_count' => $college->students->count(),
                    'faculty_count' => $college->faculty->count(),
                ];
            }),
        ]);
    }

    /**
     * POST /admin/universities
     *
     * @param StoreUniversityRequest $request
     * @return JsonResponse
     */
    public function store(StoreUniversityRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Generate slug from name
        $slug = \Illuminate\Support\Str::slug($validated['name']);
        
        // Check if slug is unique, if not, append a number
        $baseSlug = $slug;
        $counter = 1;
        while (University::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        // Generate domain from code
        $domain = strtolower($validated['code']) . '.bitflow.local';

        $university = University::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'domain' => $domain,
            'status' => $validated['status'],
            'timezone' => $validated['timezone'] ?? 'Asia/Kolkata',
            'storage_quota_gb' => $validated['storage_quota_gb'] ?? 100,
            'storage_used_mb' => 0,
        ]);

        return ApiResponse::created([
            'id' => $university->id,
            'name' => $university->name,
            'slug' => $university->slug,
            'domain' => $university->domain,
            'status' => $university->status,
            'timezone' => $university->timezone,
            'storage_quota_gb' => $university->storage_quota_gb,
            'created_at' => $university->created_at?->toIso8601String(),
        ], 'University created successfully');
    }

    /**
     * PUT/PATCH /admin/universities/{universityId}
     *
     * @param UpdateUniversityRequest $request
     * @param string $universityId
     * @return JsonResponse
     */
    public function update(UpdateUniversityRequest $request, string $universityId): JsonResponse
    {
        $university = University::findOrFail($universityId);

        $validated = $request->validated();

        // Update slug if name changed
        if (isset($validated['name']) && $validated['name'] !== $university->name) {
            $slug = \Illuminate\Support\Str::slug($validated['name']);
            $baseSlug = $slug;
            $counter = 1;
            while (University::where('slug', $slug)->where('id', '!=', $universityId)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }
            $validated['slug'] = $slug;
        }

        $university->update($validated);

        return ApiResponse::updated([
            'id' => $university->id,
            'name' => $university->name,
            'slug' => $university->slug,
            'domain' => $university->domain,
            'status' => $university->status,
            'timezone' => $university->timezone,
            'storage_quota_gb' => $university->storage_quota_gb,
            'branding' => $university->branding,
            'updated_at' => $university->updated_at?->toIso8601String(),
        ], 'University updated successfully');
    }

    /**
     * DELETE /admin/universities/{universityId}
     *
     * @param string $universityId
     * @return JsonResponse
     */
    public function destroy(string $universityId): JsonResponse
    {
        $university = University::findOrFail($universityId);

        // Check if university has colleges
        if ($university->colleges()->count() > 0) {
            return ApiResponse::error(
                'Cannot delete university with existing colleges. Please delete or reassign colleges first.',
                [],
                400,
                'DELETE_FAILED'
            );
        }

        $university->delete();

        return ApiResponse::deleted('University deleted successfully');
    }
}
