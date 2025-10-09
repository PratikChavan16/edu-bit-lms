<?php

declare(strict_types=1);

namespace App\Http\Controllers\Faculty;

use App\Services\TimetableService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class TimetableController
{
    public function __construct(private TimetableService $timetableService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $faculty = $user?->faculty;

        if (!$user || !$faculty) {
            return response()->json([
                'success' => false,
                'error' => 'Faculty context not found for the authenticated user.',
            ], 403);
        }

        $weekStartInput = $request->query('week_start');
        $weekStart = $weekStartInput ? Carbon::parse($weekStartInput) : Carbon::now();

        $schedule = $this->timetableService->getFacultyWeekSchedule($faculty, $weekStart);
        $grouped = $schedule->groupBy('day_of_week')->map(fn ($blocks) => $blocks->values());

        return response()->json([
            'success' => true,
            'data' => [
                'week_start' => $weekStart->startOfWeek()->toDateString(),
                'week_end' => $weekStart->copy()->endOfWeek()->toDateString(),
                'days' => $grouped,
            ],
        ]);
    }

    public function show(Request $request, string $blockId): JsonResponse
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

        return response()->json([
            'success' => true,
            'data' => $block,
        ]);
    }
}
