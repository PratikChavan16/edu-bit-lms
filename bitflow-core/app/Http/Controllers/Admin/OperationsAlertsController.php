<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
        // TODO: integrate with monitoring stack
        $alerts = [
            'alerts' => [
                [
                    'id' => '550e8400-e29b-41d4-a716-446655440000',
                    'title' => 'MediaConvert',
                    'severity' => 'success',
                    'description' => 'Encoding queue empty',
                    'source' => 'AWS MediaConvert',
                    'detectedAt' => now()->subMinutes(5)->toIso8601String(),
                ],
                [
                    'id' => '550e8400-e29b-41d4-a716-446655440001',
                    'title' => 'Aurora',
                    'severity' => 'warning',
                    'description' => 'CPU usage 82%',
                    'source' => 'AWS RDS',
                    'detectedAt' => now()->subMinutes(15)->toIso8601String(),
                ],
                [
                    'id' => '550e8400-e29b-41d4-a716-446655440002',
                    'title' => 'Redis',
                    'severity' => 'info',
                    'description' => 'Failover preferred',
                    'source' => 'ElastiCache',
                    'detectedAt' => now()->subHour()->toIso8601String(),
                ],
            ],
        ];

        return response()->json($alerts);
    }
}
