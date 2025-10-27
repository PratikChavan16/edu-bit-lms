<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\University;
use App\Models\User;
use App\Models\College;
use App\Models\Invoice;
use App\Models\Subscription;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get platform dashboard statistics
     */
    public function index(): JsonResponse
    {
        try {
            $stats = Cache::remember('platform_dashboard_stats', 300, function () {
                return [
                    'total_universities' => University::count(),
                    'active_universities' => University::where('status', 'active')->count(),
                    'total_colleges' => College::count(),
                    'total_users' => User::count(),
                    'active_users_30d' => User::where('last_login_at', '>=', now()->subDays(30))->count(),
                    'storage_used_gb' => University::sum(DB::raw('storage_used_mb / 1024')),
                    'storage_total_gb' => University::sum('storage_quota_gb'),
                    'suspended_universities' => University::where('status', 'suspended')->count(),
                ];
            });

            return $this->success($stats, 'Dashboard statistics retrieved');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch dashboard statistics: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get system health metrics
     */
    public function health(): JsonResponse
    {
        try {
            $health = [
                'api_latency' => $this->getApiLatency(),
                'db_response_time' => $this->getDatabaseResponseTime(),
                'redis_hit_rate' => $this->getRedisHitRate(),
                'uptime' => 99.98,
                'status' => 'healthy',
                'timestamp' => now()->toIso8601String(),
            ];

            // Determine overall health status
            if ($health['api_latency'] > 500 || $health['db_response_time'] > 100) {
                $health['status'] = 'critical';
            } elseif ($health['api_latency'] > 200 || $health['db_response_time'] > 50) {
                $health['status'] = 'warning';
            }

            return $this->success($health, 'System health retrieved');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch system health: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get active alerts
     */
    public function alerts(): JsonResponse
    {
        try {
            $alerts = [];

            // Check for universities near storage limit
            $storageWarnings = University::whereRaw('(storage_used_mb / 1024 / storage_quota_gb) > 0.9')
                ->where('status', 'active')
                ->count();

            if ($storageWarnings > 0) {
                $alerts[] = [
                    'id' => 'storage_warning',
                    'type' => 'warning',
                    'message' => "{$storageWarnings} universities near storage limit",
                    'action' => 'View Details',
                    'severity' => 'warning',
                    'timestamp' => now()->toIso8601String(),
                ];
            }

            // Check for suspended universities
            $suspended = University::where('status', 'suspended')->count();
            if ($suspended > 0) {
                $alerts[] = [
                    'id' => 'suspended_unis',
                    'type' => 'error',
                    'message' => "{$suspended} universities are currently suspended",
                    'action' => 'Review Suspensions',
                    'severity' => 'error',
                    'timestamp' => now()->toIso8601String(),
                ];
            }

            // Check for inactive universities
            $inactive = University::where('status', 'inactive')->count();
            if ($inactive > 0) {
                $alerts[] = [
                    'id' => 'inactive_unis',
                    'type' => 'info',
                    'message' => "{$inactive} universities are inactive",
                    'action' => 'View Inactive',
                    'severity' => 'info',
                    'timestamp' => now()->toIso8601String(),
                ];
            }

            return $this->success($alerts, 'Alerts retrieved');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch alerts: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get recent activity
     */
    public function activity(): JsonResponse
    {
        try {
            $activities = [];

            // Get recently created universities
            $recentUniversities = University::orderBy('created_at', 'desc')
                ->limit(5)
                ->get(['id', 'name', 'created_at']);

            foreach ($recentUniversities as $uni) {
                $activities[] = [
                    'id' => 'uni_' . $uni->id,
                    'type' => 'university_created',
                    'message' => "{$uni->name} - New university added to platform",
                    'timestamp' => $uni->created_at->toIso8601String(),
                    'severity' => 'success',
                ];
            }

            // Get recently created colleges
            $recentColleges = College::with('university')
                ->orderBy('created_at', 'desc')
                ->limit(3)
                ->get(['id', 'name', 'university_id', 'created_at']);

            foreach ($recentColleges as $college) {
                $activities[] = [
                    'id' => 'college_' . $college->id,
                    'type' => 'college_created',
                    'message' => "{$college->name} ({$college->university->name}) - New college added",
                    'timestamp' => $college->created_at->toIso8601String(),
                    'severity' => 'info',
                ];
            }

            // Sort by timestamp descending
            usort($activities, function ($a, $b) {
                return strtotime($b['timestamp']) - strtotime($a['timestamp']);
            });

            return $this->success(array_slice($activities, 0, 10), 'Activity feed retrieved');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch activity: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get API latency (simulated)
     */
    private function getApiLatency(): float
    {
        $start = microtime(true);
        DB::connection()->getPdo();
        $end = microtime(true);
        return round(($end - $start) * 1000, 2); // Convert to milliseconds
    }

    /**
     * Get database response time
     */
    private function getDatabaseResponseTime(): float
    {
        $start = microtime(true);
        DB::select('SELECT 1');
        $end = microtime(true);
        return round(($end - $start) * 1000, 2); // Convert to milliseconds
    }

    /**
     * Get Redis hit rate (simulated)
     */
    private function getRedisHitRate(): float
    {
        // In production, you would calculate actual Redis hit rate
        // For now, return a simulated value
        return 98.5;
    }

    /**
     * Get revenue overview with real data
     */
    public function revenue(): JsonResponse
    {
        try {
            $revenue = Cache::remember('platform_revenue_overview', 300, function () {
                $currentMonth = now()->format('Y-m');
                $lastMonth = now()->subMonth()->format('Y-m');

                // Calculate MRR (Monthly Recurring Revenue)
                $mrr = Subscription::where('status', 'active')
                    ->sum('mrr');

                // Calculate ARR (Annual Recurring Revenue)
                $arr = $mrr * 12;

                // New sales this month (first time payments)
                $newSales = Invoice::whereYear('created_at', now()->year)
                    ->whereMonth('created_at', now()->month)
                    ->where('status', 'paid')
                    ->whereDoesntHave('subscription', function ($query) {
                        $query->where('created_at', '<', now()->startOfMonth());
                    })
                    ->sum('amount');

                // Renewals this month (recurring payments)
                $renewals = Invoice::whereYear('created_at', now()->year)
                    ->whereMonth('created_at', now()->month)
                    ->where('status', 'paid')
                    ->whereHas('subscription', function ($query) {
                        $query->where('created_at', '<', now()->startOfMonth());
                    })
                    ->sum('amount');

                // Revenue trend for last 6 months
                $trend = [];
                for ($i = 5; $i >= 0; $i--) {
                    $month = now()->subMonths($i);
                    $monthKey = $month->format('Y-m');
                    
                    $monthRevenue = Invoice::whereYear('created_at', $month->year)
                        ->whereMonth('created_at', $month->month)
                        ->where('status', 'paid')
                        ->sum('amount');

                    $trend[] = [
                        'month' => $month->format('M Y'),
                        'revenue' => (float) $monthRevenue,
                        'date' => $monthKey,
                    ];
                }

                // Calculate growth rate
                $currentMonthRevenue = Invoice::whereYear('created_at', now()->year)
                    ->whereMonth('created_at', now()->month)
                    ->where('status', 'paid')
                    ->sum('amount');

                $lastMonthRevenue = Invoice::whereYear('created_at', now()->subMonth()->year)
                    ->whereMonth('created_at', now()->subMonth()->month)
                    ->where('status', 'paid')
                    ->sum('amount');

                $growthRate = 0;
                if ($lastMonthRevenue > 0) {
                    $growthRate = (($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100;
                }

                // Failed payments count
                $failedPayments = Invoice::where('status', 'failed')
                    ->whereMonth('created_at', now()->month)
                    ->count();

                // Average revenue per university
                $avgRevenuePerUni = 0;
                $activeSubscriptions = Subscription::where('status', 'active')->count();
                if ($activeSubscriptions > 0) {
                    $avgRevenuePerUni = $mrr / $activeSubscriptions;
                }

                return [
                    'mrr' => (float) $mrr,
                    'arr' => (float) $arr,
                    'new_sales' => (float) $newSales,
                    'renewals' => (float) $renewals,
                    'trend' => $trend,
                    'growth_rate' => round($growthRate, 2),
                    'failed_payments' => $failedPayments,
                    'active_subscriptions' => $activeSubscriptions,
                    'avg_revenue_per_uni' => round($avgRevenuePerUni, 2),
                ];
            });

            return $this->success($revenue, 'Revenue overview retrieved');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch revenue data: ' . $e->getMessage(), 500);
        }
    }
}
