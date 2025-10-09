<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Services\AttendanceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

final class AttendanceCorrectionsController
{
    public function __construct(private AttendanceService $attendanceService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $filters = $request->only(['status', 'student_id']);
        $perPage = (int) $request->query('per_page', 20);

        $corrections = $this->attendanceService->listCorrections($filters, $perPage);

        return response()->json([
            'success' => true,
            'data' => $corrections->items(),
            'meta' => [
                'current_page' => $corrections->currentPage(),
                'per_page' => $corrections->perPage(),
                'total' => $corrections->total(),
            ],
        ]);
    }

    public function show(string $correctionId): JsonResponse
    {
        $correction = $this->attendanceService->getCorrection($correctionId);

        return response()->json([
            'success' => true,
            'data' => $correction,
        ]);
    }

    public function update(Request $request, string $correctionId): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'User context missing.',
            ], 401);
        }

        $data = $request->validate([
            'status' => ['required', Rule::in(['approved', 'rejected'])],
            'review_notes' => ['nullable', 'string'],
        ]);

        $correction = $this->attendanceService->reviewCorrection(
            $correctionId,
            $user->id,
            $data['status'],
            $data['review_notes'] ?? null
        );

        return response()->json([
            'success' => true,
            'data' => $correction,
        ]);
    }
}
