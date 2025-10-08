<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

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
        // TODO: implement repository query with filters
        $universities = [
            [
                'id' => '7a6f5e84-1234-5678-90ab-cdef12345678',
                'name' => 'MVP Engineering Group',
                'domain' => 'mvp.bitflow.test',
                'status' => 'live',
                'collegesCount' => 12,
                'storageUsedGb' => 340.5,
                'lastBackupAt' => now()->subHours(2)->toIso8601String(),
                'subscriptionTier' => 'premium',
                'featureFlagsEnabled' => 15,
            ],
            [
                'id' => '8b7f6e95-2345-6789-01bc-def123456789',
                'name' => 'Stellar University',
                'domain' => 'stellar.bitflow.test',
                'status' => 'live',
                'collegesCount' => 5,
                'storageUsedGb' => 180.2,
                'lastBackupAt' => now()->subHours(1)->toIso8601String(),
                'subscriptionTier' => 'standard',
                'featureFlagsEnabled' => 10,
            ],
        ];

        return response()->json($universities)->withHeaders([
            'X-Total-Count' => count($universities),
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
        // TODO: fetch from repository
        $university = [
            'id' => $universityId,
            'name' => 'MVP Engineering Group',
            'domain' => 'mvp.bitflow.test',
            'status' => 'live',
            'region' => 'IN-W',
            'createdAt' => now()->subMonths(6)->toIso8601String(),
            'contacts' => [
                [
                    'name' => 'Dr. Sharma',
                    'email' => 'sharma@mvp.test',
                    'role' => 'CTO',
                    'phone' => '+91 98765 43210',
                ],
            ],
            'stats' => [
                'colleges' => 12,
                'activeUsers' => 3500,
                'monthlySpend' => 420000.0,
                'storageUsedGb' => 340.5,
            ],
            'modules' => [],
            'backups' => [],
            'audit' => [],
        ];

        return response()->json($university);
    }
}
