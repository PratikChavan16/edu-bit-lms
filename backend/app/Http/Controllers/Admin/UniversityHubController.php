<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\University;
use App\Models\College;
use App\Models\User;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Staff;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UniversityHubController extends Controller
{
    /**
     * Get university hub data (overview with stats)
     *
     * @param string $universityId
     * @return JsonResponse
     */
    public function show(string $universityId): JsonResponse
    {
        $university = University::with(['owner'])->findOrFail($universityId);

        // Get statistics
        $stats = [
            'colleges_count' => College::where('university_id', $universityId)->count(),
            'students_count' => Student::where('university_id', $universityId)->count(),
            'faculty_count' => Faculty::where('university_id', $universityId)->count(),
            'staff_count' => Staff::where('university_id', $universityId)->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $university->id,
                'name' => $university->name,
                'email' => $university->email,
                'phone' => $university->phone,
                'address' => $university->address,
                'logo_url' => $university->logo_url,
                'website' => $university->website,
                'status' => $university->status,
                'subscription_tier' => $university->subscription_tier,
                'subscription_status' => $university->subscription_status,
                'stats' => $stats,
            ],
        ]);
    }

    /**
     * Get management team for a university
     *
     * @param string $universityId
     * @return JsonResponse
     */
    public function getManagementTeam(string $universityId): JsonResponse
    {
        University::findOrFail($universityId); // Verify university exists

        $managementUsers = User::where('university_id', $universityId)
            ->whereHas('roles', function ($query) {
                $query->whereIn('name', ['university_owner', 'super_admin']);
            })
            ->with(['roles'])
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'role' => $user->roles->first()->name ?? 'N/A',
                    'status' => $user->status,
                    'last_login_at' => $user->last_login_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $managementUsers,
        ]);
    }

    /**
     * Get colleges list for a university
     *
     * @param Request $request
     * @param string $universityId
     * @return JsonResponse
     */
    public function getColleges(Request $request, string $universityId): JsonResponse
    {
        University::findOrFail($universityId); // Verify university exists

        $query = College::where('university_id', $universityId);

        // Apply filters
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('type')) {
            $query->where('type', $request->type);
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
        $colleges = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $colleges->map(function ($college) {
                return [
                    'id' => $college->id,
                    'university_id' => $college->university_id,
                    'name' => $college->name,
                    'code' => $college->code,
                    'type' => $college->type,
                    'email' => $college->email,
                    'phone' => $college->phone,
                    'status' => $college->status,
                    'established_year' => $college->established_year,
                    'accreditation' => $college->accreditation,
                ];
            }),
            'meta' => [
                'current_page' => $colleges->currentPage(),
                'last_page' => $colleges->lastPage(),
                'per_page' => $colleges->perPage(),
                'total' => $colleges->total(),
            ],
        ]);
    }

    /**
     * Get university settings
     *
     * @param string $universityId
     * @return JsonResponse
     */
    public function getSettings(string $universityId): JsonResponse
    {
        $university = University::findOrFail($universityId);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $university->id,
                'name' => $university->name,
                'email' => $university->email,
                'phone' => $university->phone,
                'address' => $university->address,
                'website' => $university->website,
                'logo_url' => $university->logo_url,
                'status' => $university->status,
                'subscription_tier' => $university->subscription_tier,
                'subscription_status' => $university->subscription_status,
                'settings' => $university->settings ?? [],
            ],
        ]);
    }

    /**
     * Update university settings
     *
     * @param Request $request
     * @param string $universityId
     * @return JsonResponse
     */
    public function updateSettings(Request $request, string $universityId): JsonResponse
    {
        $university = University::findOrFail($universityId);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|max:255',
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string',
            'website' => 'sometimes|url|max:255',
            'settings' => 'sometimes|array',
        ]);

        $university->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'University settings updated successfully',
            'data' => $university,
        ]);
    }
}
