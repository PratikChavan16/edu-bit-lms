<?php

declare(strict_types=1);

namespace App\Http\Controllers\Learner;

use App\Services\StudentDashboardService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Learner dashboard controller.
 */
final class DashboardController
{
    public function __construct(
        private StudentDashboardService $dashboardService
    ) {}

    /**
     * GET /learner/dashboard
     *
     * Returns personalized dashboard data for the authenticated student.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $data = $this->dashboardService->getDashboardData();
            
            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
