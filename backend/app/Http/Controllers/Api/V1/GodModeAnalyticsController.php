<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\University;
use App\Models\College;
use App\Models\User;
use App\Models\ScheduledReport;
use App\Models\ReportHistory;
use App\Http\Responses\ApiResponse;
use App\Exceptions\ApiException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

/**
 * God Mode Analytics Controller
 * 
 * Provides aggregated analytics across ALL universities for Bitflow Owners.
 * All endpoints require 'bitflow_owner' or 'bitflow_admin' role.
 */
class GodModeAnalyticsController extends Controller
{
    /**
     * Get comprehensive God Mode dashboard statistics
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getDashboardStats(Request $request)
    {
        // Verify God Mode access
        if (!auth()->user()->hasAnyRole(['bitflow_owner', 'bitflow_admin'])) {
            throw ApiException::forbidden('God Mode access required');
        }

        // Cache for 5 minutes to reduce database load
        $stats = University::cacheQuery('god_mode_dashboard_stats', function () {
            return [
                'overview' => $this->getOverviewStats(),
                'universities' => $this->getUniversityStats(),
                'colleges' => $this->getCollegeStats(),
                'users' => $this->getUserStats(),
                'storage' => $this->getStorageStats(),
                'reports' => $this->getReportStats(),
                'activity' => $this->getActivityStats(),
                'trends' => $this->getTrendStats(),
            ];
        }, 300);

        return ApiResponse::success($stats, 'God Mode analytics retrieved successfully');
    }

    /**
     * Get overview statistics
     * Uses cached counts for better performance
     */
    private function getOverviewStats(): array
    {
        return [
            'total_universities' => University::cachedCount('all', 300),
            'active_universities' => University::cachedCount('active', 300),
            'total_colleges' => College::cachedCount('all', 300),
            'active_colleges' => College::cachedCount('active', 300),
            'total_users' => User::cachedCount('all', 300),
            'active_users' => User::cachedCount('active', 300),
            'total_scheduled_reports' => ScheduledReport::count(),
            'active_schedules' => ScheduledReport::where('is_active', true)->count(),
        ];
    }

    /**
     * Get university statistics
     * Uses eager loading to prevent N+1 queries
     */
    private function getUniversityStats(): array
    {
        $universities = University::withUniversityRelations()
            ->selectOptimized(['id', 'name', 'status', 'established_year', 'storage_quota_gb', 'storage_used_gb'])
            ->get();

        return [
            'total' => $universities->count(),
            'by_status' => [
                'active' => $universities->where('status', 'active')->count(),
                'inactive' => $universities->where('status', 'inactive')->count(),
                'suspended' => $universities->where('status', 'suspended')->count(),
            ],
            'top_by_colleges' => $universities->sortByDesc('colleges_count')->take(5)->map(function ($uni) {
                return [
                    'id' => $uni->id,
                    'name' => $uni->name,
                    'colleges_count' => $uni->colleges_count,
                    'users_count' => $uni->users_count,
                    'status' => $uni->status,
                ];
            })->values(),
            'top_by_users' => $universities->sortByDesc('users_count')->take(5)->map(function ($uni) {
                return [
                    'id' => $uni->id,
                    'name' => $uni->name,
                    'users_count' => $uni->users_count,
                    'colleges_count' => $uni->colleges_count,
                    'status' => $uni->status,
                ];
            })->values(),
            'storage_critical' => $universities->filter(function ($uni) {
                if ($uni->storage_quota_gb == 0) return false;
                $usage_percent = ($uni->storage_used_gb / $uni->storage_quota_gb) * 100;
                return $usage_percent >= 90;
            })->map(function ($uni) {
                return [
                    'id' => $uni->id,
                    'name' => $uni->name,
                    'storage_used_gb' => $uni->storage_used_gb,
                    'storage_quota_gb' => $uni->storage_quota_gb,
                    'usage_percent' => round(($uni->storage_used_gb / $uni->storage_quota_gb) * 100, 1),
                ];
            })->values(),
        ];
    }

    /**
     * Get college statistics
     */
    private function getCollegeStats(): array
    {
        $colleges = College::select('id', 'name', 'type', 'status', 'university_id')
            ->with('university:id,name')
            ->get();

        $typeDistribution = $colleges->groupBy('type')->map(function ($group) {
            return [
                'count' => $group->count(),
                'active' => $group->where('status', 'active')->count(),
            ];
        });

        return [
            'total' => $colleges->count(),
            'by_status' => [
                'active' => $colleges->where('status', 'active')->count(),
                'inactive' => $colleges->where('status', 'inactive')->count(),
                'suspended' => $colleges->where('status', 'suspended')->count(),
            ],
            'by_type' => $typeDistribution,
            'by_university' => $colleges->groupBy('university_id')->map(function ($group) {
                return [
                    'university_name' => $group->first()->university->name ?? 'Unknown',
                    'count' => $group->count(),
                    'active' => $group->where('status', 'active')->count(),
                ];
            })->sortByDesc('count')->take(10)->values(),
        ];
    }

    /**
     * Get user statistics
     */
    private function getUserStats(): array
    {
        $users = User::select('id', 'name', 'email', 'status', 'university_id', 'created_at')
            ->with('roles')
            ->get();

        $roleDistribution = [];
        foreach ($users as $user) {
            foreach ($user->roles as $role) {
                if (!isset($roleDistribution[$role->name])) {
                    $roleDistribution[$role->name] = 0;
                }
                $roleDistribution[$role->name]++;
            }
        }

        return [
            'total' => $users->count(),
            'by_status' => [
                'active' => $users->where('status', 'active')->count(),
                'inactive' => $users->where('status', 'inactive')->count(),
            ],
            'by_role' => $roleDistribution,
            'recent_registrations' => $users->sortByDesc('created_at')->take(10)->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name'),
                    'created_at' => $user->created_at->toISOString(),
                ];
            })->values(),
        ];
    }

    /**
     * Get storage statistics
     */
    private function getStorageStats(): array
    {
        $universities = University::select('storage_quota_gb', 'storage_used_gb')->get();

        $totalQuota = $universities->sum('storage_quota_gb');
        $totalUsed = $universities->sum('storage_used_gb');
        $usagePercent = $totalQuota > 0 ? ($totalUsed / $totalQuota) * 100 : 0;

        return [
            'total_quota_gb' => $totalQuota,
            'total_used_gb' => round($totalUsed, 2),
            'total_available_gb' => round($totalQuota - $totalUsed, 2),
            'usage_percent' => round($usagePercent, 1),
            'by_university' => $universities->map(function ($uni) {
                $usage = $uni->storage_quota_gb > 0 
                    ? ($uni->storage_used_gb / $uni->storage_quota_gb) * 100 
                    : 0;
                return [
                    'quota_gb' => $uni->storage_quota_gb,
                    'used_gb' => $uni->storage_used_gb,
                    'usage_percent' => round($usage, 1),
                ];
            }),
        ];
    }

    /**
     * Get report generation statistics
     */
    private function getReportStats(): array
    {
        $schedules = ScheduledReport::withCount('executions')->get();
        $history = ReportHistory::all();

        return [
            'total_schedules' => $schedules->count(),
            'active_schedules' => $schedules->where('is_active', true)->count(),
            'total_executions' => $schedules->sum('executions_count'),
            'total_reports_generated' => $history->count(),
            'by_type' => [
                'universities' => $history->where('report_type', 'universities')->count(),
                'colleges' => $history->where('report_type', 'colleges')->count(),
                'users' => $history->where('report_type', 'users')->count(),
            ],
            'success_rate' => $schedules->count() > 0 
                ? round(($schedules->sum('success_count') / max($schedules->sum('run_count'), 1)) * 100, 1)
                : 100,
            'recent_reports' => $history->sortByDesc('generated_at')->take(10)->map(function ($report) {
                return [
                    'id' => $report->id,
                    'name' => $report->name,
                    'report_type' => $report->report_type,
                    'records_count' => $report->records_count,
                    'file_size_kb' => $report->file_size_kb,
                    'generated_at' => $report->generated_at->toISOString(),
                ];
            })->values(),
        ];
    }

    /**
     * Get recent activity statistics
     */
    private function getActivityStats(): array
    {
        $now = now();
        $last24h = $now->copy()->subDay();
        $last7d = $now->copy()->subWeek();
        $last30d = $now->copy()->subMonth();

        return [
            'last_24h' => [
                'universities_created' => University::where('created_at', '>=', $last24h)->count(),
                'colleges_created' => College::where('created_at', '>=', $last24h)->count(),
                'users_created' => User::where('created_at', '>=', $last24h)->count(),
                'reports_generated' => ReportHistory::where('generated_at', '>=', $last24h)->count(),
            ],
            'last_7d' => [
                'universities_created' => University::where('created_at', '>=', $last7d)->count(),
                'colleges_created' => College::where('created_at', '>=', $last7d)->count(),
                'users_created' => User::where('created_at', '>=', $last7d)->count(),
                'reports_generated' => ReportHistory::where('generated_at', '>=', $last7d)->count(),
            ],
            'last_30d' => [
                'universities_created' => University::where('created_at', '>=', $last30d)->count(),
                'colleges_created' => College::where('created_at', '>=', $last30d)->count(),
                'users_created' => User::where('created_at', '>=', $last30d)->count(),
                'reports_generated' => ReportHistory::where('generated_at', '>=', $last30d)->count(),
            ],
        ];
    }

    /**
     * Get trend statistics (last 30 days)
     */
    private function getTrendStats(): array
    {
        $days = 30;
        $startDate = now()->subDays($days);

        // Get daily counts for the last 30 days
        $universitiesTrend = [];
        $collegesTrend = [];
        $usersTrend = [];
        $reportsTrend = [];

        for ($i = 0; $i < $days; $i++) {
            $date = now()->subDays($days - $i - 1)->format('Y-m-d');
            
            $universitiesTrend[] = [
                'date' => $date,
                'count' => University::whereDate('created_at', $date)->count(),
            ];
            
            $collegesTrend[] = [
                'date' => $date,
                'count' => College::whereDate('created_at', $date)->count(),
            ];
            
            $usersTrend[] = [
                'date' => $date,
                'count' => User::whereDate('created_at', $date)->count(),
            ];
            
            $reportsTrend[] = [
                'date' => $date,
                'count' => ReportHistory::whereDate('generated_at', $date)->count(),
            ];
        }

        return [
            'universities' => $universitiesTrend,
            'colleges' => $collegesTrend,
            'users' => $usersTrend,
            'reports' => $reportsTrend,
        ];
    }

    /**
     * Get university comparison data
     */
    public function getUniversityComparison(Request $request)
    {
        if (!auth()->user()->hasAnyRole(['bitflow_owner', 'bitflow_admin'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $universities = University::with(['colleges', 'users'])
            ->withCount(['colleges', 'users'])
            ->get()
            ->map(function ($uni) {
                return [
                    'id' => $uni->id,
                    'name' => $uni->name,
                    'code' => $uni->code,
                    'status' => $uni->status,
                    'established_year' => $uni->established_year,
                    'colleges_count' => $uni->colleges_count,
                    'users_count' => $uni->users_count,
                    'storage_used_gb' => $uni->storage_used_gb,
                    'storage_quota_gb' => $uni->storage_quota_gb,
                    'storage_usage_percent' => $uni->storage_quota_gb > 0 
                        ? round(($uni->storage_used_gb / $uni->storage_quota_gb) * 100, 1)
                        : 0,
                ];
            });

        return ApiResponse::success(['universities' => $universities]);
    }

    /**
     * Clear God Mode analytics cache
     */
    public function clearCache(Request $request)
    {
        if (!auth()->user()->hasRole('bitflow_owner')) {
            throw ApiException::forbidden('Owner access required');
        }

        University::invalidateCache('god_mode_dashboard_stats');

        return ApiResponse::success([
            'cleared_at' => now()->toISOString(),
        ], 'Cache cleared successfully');
    }
}
