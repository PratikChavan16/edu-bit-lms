<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\University;
use App\Models\College;
use App\Models\Department;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\Course;
use App\Models\User;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CollegeHubController extends Controller
{
    /**
     * Get college hub data (overview with stats)
     * 
     * God Mode: Bitflow Owner accessing any college
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
            // Verify college belongs to university
            $college = College::where('university_id', $universityId)
                ->where('id', $collegeId)
                ->with(['university'])
                ->firstOrFail();

            // God Mode Audit Log
            AuditLog::log(
                action: 'view_college_hub',
                resourceType: 'College',
                resourceId: $collegeId,
                description: "God Mode: Bitflow Owner viewed college hub for {$college->name}"
            );

            // Get statistics
            $stats = [
                'departments_count' => Department::where('college_id', $collegeId)->count(),
                'students_count' => Student::where('college_id', $collegeId)->count(),
                'faculty_count' => Faculty::where('college_id', $collegeId)->count(),
                'courses_count' => Course::where('college_id', $collegeId)->count(),
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $college->id,
                    'university_id' => $college->university_id,
                    'name' => $college->name,
                    'code' => $college->code,
                    'type' => $college->type,
                    'email' => $college->email,
                    'phone' => $college->phone,
                    'address' => $college->address,
                    'established_year' => $college->established_year,
                    'accreditation' => $college->accreditation,
                    'status' => $college->status,
                    'stats' => $stats,
                    'created_at' => $college->created_at,
                    'updated_at' => $college->updated_at,
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                    'portal' => 'bitflow-admin',
                    'god_mode_context' => [
                        'is_god_mode' => true,
                        'original_tenant_id' => auth()->user()->university_id ?? null,
                        'viewing_tenant_id' => $universityId,
                        'hierarchy_level' => 'platform',
                    ],
                ],
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::warning('College not found', [
                'university_id' => $universityId,
                'college_id' => $collegeId,
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_RESOURCE_NOT_FOUND',
                    'message' => 'College not found',
                    'details' => [
                        'resource_type' => 'College',
                        'resource_id' => $collegeId,
                    ],
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 404);

        } catch (\Exception $e) {
            Log::error('Error fetching college hub', [
                'university_id' => $universityId,
                'college_id' => $collegeId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'An error occurred while fetching college data',
                    'details' => config('app.debug') ? ['exception' => $e->getMessage()] : null,
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Get leadership team for a college (Principal, College Admin, etc.)
     *
     * @param Request $request
     * @param string $universityId
     * @param string $collegeId
     * @return JsonResponse
     */
    public function getLeadership(Request $request, string $universityId, string $collegeId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $college = College::where('university_id', $universityId)
                ->where('id', $collegeId)
                ->firstOrFail();

            // God Mode Audit Log
            AuditLog::log(
                action: 'view_college_leadership',
                resourceType: 'College',
                resourceId: $collegeId,
                description: "God Mode: Viewed leadership team for {$college->name}"
            );

            $leadershipUsers = User::where('college_id', $collegeId)
                ->whereHas('roles', function ($query) {
                    $query->whereIn('name', ['principal', 'college_admin']);
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
                        'created_at' => $user->created_at,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $leadershipUsers,
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
            Log::error('Error fetching college leadership', [
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
     * Get college statistics (detailed)
     *
     * @param Request $request
     * @param string $universityId
     * @param string $collegeId
     * @return JsonResponse
     */
    public function getStatistics(Request $request, string $universityId, string $collegeId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $college = College::where('university_id', $universityId)
                ->where('id', $collegeId)
                ->firstOrFail();

            // God Mode Audit Log
            AuditLog::log(
                action: 'view_college_statistics',
                resourceType: 'College',
                resourceId: $collegeId,
                description: "God Mode: Viewed detailed statistics for {$college->name}"
            );

            $stats = [
                'overview' => [
                    'departments_count' => Department::where('college_id', $collegeId)->count(),
                    'students_count' => Student::where('college_id', $collegeId)->count(),
                    'faculty_count' => Faculty::where('college_id', $collegeId)->count(),
                    'courses_count' => Course::where('college_id', $collegeId)->count(),
                ],
                'departments' => Department::where('college_id', $collegeId)
                    ->select('name', 'code', DB::raw('(SELECT COUNT(*) FROM students WHERE students.department_id = departments.id) as students_count'))
                    ->get(),
                'students_by_year' => Student::where('college_id', $collegeId)
                    ->select('academic_year', DB::raw('count(*) as count'))
                    ->groupBy('academic_year')
                    ->get(),
                'students_by_status' => Student::where('college_id', $collegeId)
                    ->select('status', DB::raw('count(*) as count'))
                    ->groupBy('status')
                    ->get(),
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
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
            Log::error('Error fetching college statistics', [
                'college_id' => $collegeId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to fetch statistics',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }
}
