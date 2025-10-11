<?php

declare(strict_types=1);

namespace App\Http\Controllers\Faculty;

use App\Services\AttendanceService;
use App\Services\TimetableService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

final class AttendanceController
{
    public function __construct(
        private AttendanceService $attendanceService,
        private TimetableService $timetableService
    ) {
    }

    public function index(Request $request, string $blockId): JsonResponse
    {
        $user = $request->user();
        $faculty = $user?->faculty;

        if (!$user || !$faculty) {
            return response()->json([
                'success' => false,
                'error' => 'Faculty context not found for the authenticated user.',
            ], 403);
        }

        $block = $this->timetableService->getBlock($blockId);

        if ($block->faculty_id !== $faculty->id) {
            return response()->json([
                'success' => false,
                'error' => 'You do not have access to this timetable block.',
            ], 403);
        }

        $dateInput = $request->query('date');
        $date = $dateInput ? Carbon::parse($dateInput) : Carbon::now();

        $attendance = $this->attendanceService->getBlockAttendance($block, $date);

        return response()->json([
            'success' => true,
            'data' => [
                'date' => $date->toDateString(),
                'entries' => $attendance,
            ],
        ]);
    }

    public function store(Request $request, string $blockId): JsonResponse
    {
        $user = $request->user();
        $faculty = $user?->faculty;

        if (!$user || !$faculty) {
            return response()->json([
                'success' => false,
                'error' => 'Faculty context not found for the authenticated user.',
            ], 403);
        }

        $block = $this->timetableService->getBlock($blockId);

        if ($block->faculty_id !== $faculty->id) {
            return response()->json([
                'success' => false,
                'error' => 'You do not have access to this timetable block.',
            ], 403);
        }

        $data = $request->validate([
            'date' => ['required', 'date'],
            'entries' => ['required', 'array', 'min:1'],
            'entries.*.student_id' => ['required', 'uuid'],
            'entries.*.status' => ['required', Rule::in(AttendanceService::ALLOWED_STATUSES)],
            'entries.*.notes' => ['nullable', 'string'],
        ]);

        $date = Carbon::parse($data['date']);
        $entries = $this->attendanceService->markAttendance($block, $date, $user->id, $data['entries']);

        return response()->json([
            'success' => true,
            'data' => $entries,
        ], 201);
    }

    public function requestCorrection(Request $request, string $attendanceId): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'Authentication required.',
            ], 401);
        }

        $data = $request->validate([
            'requested_status' => ['required', Rule::in(AttendanceService::ALLOWED_STATUSES)],
            'reason' => ['nullable', 'string'],
        ]);

        $correction = $this->attendanceService->requestCorrection(
            $attendanceId,
            $user->id,
            $data['requested_status'],
            $data['reason'] ?? null
        );

        return response()->json([
            'success' => true,
            'data' => $correction,
        ], 201);
    }
}
