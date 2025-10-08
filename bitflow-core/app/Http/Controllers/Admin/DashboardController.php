<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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
        // TODO: fetch real metrics from services
        $data = [
            'welcome' => [
                'operatorName' => 'Aisha',
                'pendingTasks' => 3,
                'message' => 'You have 3 provisioning tasks awaiting review.',
            ],
            'metrics' => [
                ['label' => 'Active universities', 'value' => '18', 'delta' => '+2 this month'],
                ['label' => 'Pending approvals', 'value' => '7', 'delta' => '3 over SLA'],
                ['label' => 'Sandbox spend', 'value' => '₹4.2L', 'delta' => 'down 8%'],
                ['label' => 'Support tickets', 'value' => '12', 'delta' => '5 high priority'],
            ],
            'activities' => [
                [
                    'title' => 'Payroll module enabled',
                    'description' => 'MVP Engineering College · 08:42',
                    'occurredAt' => now()->subHours(2)->toIso8601String(),
                ],
                [
                    'title' => 'Backup completed',
                    'description' => 'Stellar University · 07:30',
                    'occurredAt' => now()->subHours(3)->toIso8601String(),
                ],
            ],
            'provisioningQueue' => [
                'slaBreached' => 1,
                'items' => [],
            ],
        ];

        return response()->json($data);
    }
}
