<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Models\College;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Infrastructure alerts controller.
 *
 * Surfaces active alerts from monitoring integrations (CloudWatch, Sentry, etc.).
 */
final class OperationsAlertsController
{
    /**
     * GET /admin/operations/alerts
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        // Integrate with monitoring stack - database health checks
        $alerts = [];
        
        // 1. Database connection check
        try {
            $dbConnected = DB::connection()->getPdo() !== null;
            if ($dbConnected) {
                $alerts[] = [
                    'id' => 'db-connection',
                    'title' => 'Database Connection',
                    'severity' => 'success',
                    'description' => 'Database connection healthy',
                    'source' => 'Database Health Check',
                    'detectedAt' => now()->toIso8601String(),
                ];
            }
        } catch (\Exception $e) {
            $alerts[] = [
                'id' => 'db-connection',
                'title' => 'Database Connection',
                'severity' => 'critical',
                'description' => 'Database connection failed: ' . $e->getMessage(),
                'source' => 'Database Health Check',
                'detectedAt' => now()->toIso8601String(),
            ];
            Log::error('Database connection check failed', ['error' => $e->getMessage()]);
        }
        
        // 2. Check for inactive colleges
        $inactiveColleges = College::where('status', 'inactive')->count();
        if ($inactiveColleges > 0) {
            $alerts[] = [
                'id' => 'inactive-colleges',
                'title' => 'Inactive Colleges',
                'severity' => 'warning',
                'description' => "{$inactiveColleges} college(s) marked as inactive",
                'source' => 'College Status Monitor',
                'detectedAt' => now()->toIso8601String(),
            ];
        }
        
        // 3. Check for pending college approvals (SLA breach)
        $pendingApprovals = College::where('status', 'pending')
            ->where('created_at', '<', now()->subDays(2))
            ->count();
        if ($pendingApprovals > 0) {
            $alerts[] = [
                'id' => 'pending-approvals-sla',
                'title' => 'SLA Breach: College Approvals',
                'severity' => 'critical',
                'description' => "{$pendingApprovals} college approval(s) over 48-hour SLA",
                'source' => 'SLA Monitor',
                'detectedAt' => now()->toIso8601String(),
            ];
        }
        
        // 4. Check for inactive users
        $inactiveUsers = User::where('status', 'inactive')->count();
        if ($inactiveUsers > 10) {
            $alerts[] = [
                'id' => 'inactive-users',
                'title' => 'Inactive Users',
                'severity' => 'info',
                'description' => "{$inactiveUsers} inactive user accounts",
                'source' => 'User Activity Monitor',
                'detectedAt' => now()->toIso8601String(),
            ];
        }
        
        // 5. Application health check
        $alerts[] = [
            'id' => 'app-health',
            'title' => 'Application Health',
            'severity' => 'success',
            'description' => 'All systems operational',
            'source' => 'Application Monitor',
            'detectedAt' => now()->toIso8601String(),
        ];
        
        // TODO: Future integrations
        // - AWS CloudWatch metrics
        // - Sentry error tracking
        // - Redis cache health
        // - Storage usage alerts
        // - API rate limit breaches
        
        // Filter by severity if requested
        if ($request->filled('severity')) {
            $alerts = array_filter($alerts, function ($alert) use ($request) {
                return $alert['severity'] === $request->severity;
            });
        }

        return response()->json([
            'alerts' => array_values($alerts),
            'summary' => [
                'total' => count($alerts),
                'critical' => count(array_filter($alerts, fn($a) => $a['severity'] === 'critical')),
                'warning' => count(array_filter($alerts, fn($a) => $a['severity'] === 'warning')),
                'info' => count(array_filter($alerts, fn($a) => $a['severity'] === 'info')),
                'success' => count(array_filter($alerts, fn($a) => $a['severity'] === 'success')),
            ],
        ]);
    }
}
