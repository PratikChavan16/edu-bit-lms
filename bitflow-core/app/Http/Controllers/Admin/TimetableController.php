<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Models\TimetableBlockException;
use App\Services\TimetableService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

final class TimetableController
{
    public function __construct(private TimetableService $timetableService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $college = null;

        // Check if bound (production) before accessing
        if (app()->bound('tenant.college')) {
            $college = app('tenant.college');
        }

        // Fallback to query parameter in tests or when tenant context not available
        if (!$college && $request->has('college_id')) {
            $college = \App\Models\College::find($request->input('college_id'));
        }

        if (!$college) {
            return response()->json([
                'success' => false,
                'error' => 'College context not resolved.',
            ], 400);
        }

        $data = $request->validate([
            'course' => ['required', 'string', 'max:120'],
            'year' => ['required', 'integer', 'min:1', 'max:6'],
            'section' => ['nullable', 'string', 'max:10'],
        ]);

        $blocks = $this->timetableService->listForCourse($college->id, $data['course'], (int) $data['year'], $data['section'] ?? null);

        return response()->json([
            'success' => true,
            'data' => $blocks,
        ]);
    }

    public function show(string $blockId): JsonResponse
    {
        $block = $this->timetableService->getBlock($blockId);

        return response()->json([
            'success' => true,
            'data' => $block,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $college = null;

        // Check if bound (production) before accessing
        if (app()->bound('tenant.college')) {
            $college = app('tenant.college');
        }

        // Fallback to query parameter in tests or when tenant context not available
        if (!$college && $request->has('college_id')) {
            $college = \App\Models\College::find($request->input('college_id'));
        }

        if (!$college) {
            return response()->json([
                'success' => false,
                'error' => 'College context not resolved.',
            ], 400);
        }

        $data = $request->validate([
            'subject' => ['required', 'string', 'max:150'],
            'course' => ['required', 'string', 'max:120'],
            'year' => ['required', 'integer', 'min:1', 'max:6'],
            'section' => ['nullable', 'string', 'max:10'],
            'faculty_id' => ['required', 'uuid', 'exists:faculty,id'],
            'day_of_week' => ['required', Rule::in(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'])],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
            'location' => ['nullable', 'string', 'max:120'],
            'type' => ['nullable', Rule::in(['lecture', 'lab', 'tutorial', 'practical'])],
            'effective_from' => ['required', 'date'],
            'effective_to' => ['nullable', 'date', 'after_or_equal:effective_from'],
        ]);

        $block = $this->timetableService->createBlock($college->id, $data);

        return response()->json([
            'success' => true,
            'data' => $block,
        ], 201);
    }

    public function update(Request $request, string $blockId): JsonResponse
    {
        $data = $request->validate([
            'subject' => ['sometimes', 'string', 'max:150'],
            'course' => ['sometimes', 'string', 'max:120'],
            'year' => ['sometimes', 'integer', 'min:1', 'max:6'],
            'section' => ['nullable', 'string', 'max:10'],
            'faculty_id' => ['sometimes', 'uuid', 'exists:faculty,id'],
            'day_of_week' => ['sometimes', Rule::in(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'])],
            'start_time' => ['sometimes', 'date_format:H:i'],
            'end_time' => ['sometimes', 'date_format:H:i'],
            'location' => ['nullable', 'string', 'max:120'],
            'type' => ['nullable', Rule::in(['lecture', 'lab', 'tutorial', 'practical'])],
            'effective_from' => ['sometimes', 'date'],
            'effective_to' => ['nullable', 'date', 'after_or_equal:effective_from'],
        ]);

        $block = $this->timetableService->updateBlock($blockId, $data);

        return response()->json([
            'success' => true,
            'data' => $block,
        ]);
    }

    public function destroy(string $blockId): JsonResponse
    {
        $this->timetableService->deleteBlock($blockId);

        return response()->json([
            'success' => true,
            'message' => 'Timetable block removed.',
        ]);
    }

    public function storeException(Request $request, string $blockId): JsonResponse
    {
        $block = $this->timetableService->getBlock($blockId);

        $data = $request->validate([
            'date' => ['required', 'date'],
            'action' => ['required', Rule::in(['cancelled', 'rescheduled', 'substitution'])],
            'reason' => ['nullable', 'string'],
            'alternate_faculty_id' => ['nullable', 'uuid', 'exists:faculty,id'],
            'alternate_location' => ['nullable', 'string', 'max:120'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i'],
        ]);

        $exception = $this->timetableService->createException($block, $data);

        return response()->json([
            'success' => true,
            'data' => $exception,
        ], 201);
    }

    public function destroyException(string $exceptionId): JsonResponse
    {
        $exception = TimetableBlockException::findOrFail($exceptionId);
        $this->timetableService->deleteException($exception);

        return response()->json([
            'success' => true,
            'message' => 'Timetable exception removed.',
        ]);
    }
}
