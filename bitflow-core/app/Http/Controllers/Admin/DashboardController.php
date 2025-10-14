<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Responses\ApiResponse;
use App\Models\College;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Dashboard controller for Bitflow Central Portal.
 *
 * Exposes summary metrics, activity timelines, and provisioning queue for
 * the admin operations team.
 */
final class DashboardController
{
    /**
     * GET /admin/dashboard
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        // Fetch real metrics from database
        $activeColleges = College::where('status', 'active')->count();
        $totalStudents = Student::whereHas('college', function ($q) {
            $q->where('status', 'active');
        })->count();
        $totalFaculty = Faculty::whereHas('college', function ($q) {
            $q->where('status', 'active');
        })->count();
        $pendingApprovals = College::where('status', 'pending')->count();
        
        // Calculate month-over-month change
        $lastMonthColleges = College::where('status', 'active')
            ->where('created_at', '<', now()->subMonth())
            ->count();
        $collegesDelta = $activeColleges - $lastMonthColleges;
        
        // Get authenticated user
        $user = $request->user();
        $operatorName = $user ? $user->name : 'Admin';
        
        $data = [
            'welcome' => [
                'operatorName' => $operatorName,
                'pendingTasks' => $pendingApprovals,
                'message' => $pendingApprovals > 0 
                    ? "You have {$pendingApprovals} college approval(s) awaiting review."
                    : 'All tasks are up to date.',
            ],
            'metrics' => [
                [
                    'label' => 'Active Colleges', 
                    'value' => (string)$activeColleges, 
                    'delta' => $collegesDelta > 0 ? "+{$collegesDelta} this month" : "{$collegesDelta} this month"
                ],
                [
                    'label' => 'Total Students', 
                    'value' => (string)$totalStudents, 
                    'delta' => 'Active enrollment'
                ],
                [
                    'label' => 'Total Faculty', 
                    'value' => (string)$totalFaculty, 
                    'delta' => 'Teaching staff'
                ],
                [
                    'label' => 'Pending Approvals', 
                    'value' => (string)$pendingApprovals, 
                    'delta' => $pendingApprovals > 3 ? 'Action required' : 'Under review'
                ],
            ],
            'activities' => [
                // Get recent college registrations and status changes
                ...College::with('university')
                    ->latest()
                    ->limit(5)
                    ->get()
                    ->map(function ($college) {
                        $action = $college->status === 'active' ? 'activated' : 'registered';
                        return [
                            'title' => "College {$action}",
                            'description' => "{$college->name} · {$college->created_at->format('H:i')}",
                            'occurredAt' => $college->created_at->toIso8601String(),
                        ];
                    })
                    ->toArray(),
            ],
            'provisioningQueue' => [
                'slaBreached' => College::where('status', 'pending')
                    ->where('created_at', '<', now()->subDays(2))
                    ->count(),
                'items' => College::where('status', 'pending')
                    ->with('university')
                    ->orderBy('created_at')
                    ->limit(10)
                    ->get()
                    ->map(function ($college) {
                        $waitingHours = now()->diffInHours($college->created_at);
                        return [
                            'id' => $college->id,
                            'name' => $college->name,
                            'university' => $college->university->name ?? 'N/A',
                            'requestedAt' => $college->created_at->toIso8601String(),
                            'waitingHours' => $waitingHours,
                            'slaBreached' => $waitingHours > 48,
                        ];
                    })
                    ->toArray(),
            ],
        ];

        return ApiResponse::success($data);
    }
}
