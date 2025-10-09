<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Services\CollegeAdminService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * College Admin Students controller.
 */
final class StudentsController
{
    public function __construct(
        private CollegeAdminService $adminService
    ) {}

    /**
     * GET /admin/students
     *
     * Returns list of students for the college admin.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $college = app('tenant.college');
            
            if (!$college) {
                return response()->json([
                    'success' => false,
                    'error' => 'College context not found',
                ], 400);
            }

            $filters = [
                'course' => $request->query('course'),
                'year' => $request->query('year'),
                'status' => $request->query('status', 'active'),
            ];

            $data = $this->adminService->getStudentsList($college->id, array_filter($filters));
            
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

    /**
     * GET /admin/students/{id}
     *
     * Returns detailed student profile.
     *
     * @param string $id
     * @return JsonResponse
     */
    public function show(string $id): JsonResponse
    {
        try {
            $data = $this->adminService->getStudentProfile($id);
            
            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 404);
        }
    }
}
