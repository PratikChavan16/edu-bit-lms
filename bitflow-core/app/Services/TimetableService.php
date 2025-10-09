<?php

namespace App\Services;

use App\Models\Faculty;
use App\Models\TimetableBlock;
use App\Models\TimetableBlockException;
use App\Repositories\TimetableRepository;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class TimetableService
{
    public function __construct(private TimetableRepository $repository)
    {
    }

    public function listForCourse(string $collegeId, string $course, int $year, ?string $section = null): Collection
    {
        return $this->repository->getWeekSchedule($collegeId, $course, $year, $section);
    }

    public function getFacultyWeekSchedule(Faculty $faculty, ?Carbon $referenceDate = null): Collection
    {
        $referenceDate ??= Carbon::now($faculty->college?->time_zone ?? config('app.timezone'));

        return $this->repository->getFacultyWeekSchedule($faculty->id, $referenceDate);
    }

    public function getBlock(string $blockId): TimetableBlock
    {
        return $this->repository->findById($blockId);
    }

    public function createBlock(string $collegeId, array $data): TimetableBlock
    {
        $this->assertNoConflicts($collegeId, $data);

        $payload = array_merge($data, [
            'college_id' => $collegeId,
        ]);

        return $this->repository->createBlock($payload);
    }

    public function updateBlock(string $blockId, array $data): TimetableBlock
    {
        $block = $this->repository->findById($blockId);
        $payload = array_merge($block->getAttributes(), $data);

        $this->assertNoConflicts($block->college_id, $payload, $block->id);

        return $this->repository->updateBlock($block, $data);
    }

    public function deleteBlock(string $blockId): void
    {
        $block = $this->repository->findById($blockId);
        $this->repository->deleteBlock($block);
    }

    public function createException(TimetableBlock $block, array $data): TimetableBlockException
    {
        $date = Carbon::parse($data['date']);
        $this->assertDateMatchesBlock($block, $date);

        $startTime = $data['start_time'] ?? $block->start_time;
        $endTime = $data['end_time'] ?? $block->end_time;

        if ((isset($data['start_time']) xor isset($data['end_time']))) {
            throw ValidationException::withMessages([
                'start_time' => 'Both start_time and end_time must be provided when overriding timings.',
            ]);
        }

            if (Carbon::parse($endTime) <= Carbon::parse($startTime)) {
            throw ValidationException::withMessages([
                'end_time' => 'Exception end time must be after the start time.',
            ]);
        }

        return $block->exceptions()->create([
            'date' => $date->toDateString(),
            'action' => $data['action'],
            'reason' => $data['reason'] ?? null,
            'alternate_faculty_id' => $data['alternate_faculty_id'] ?? null,
            'alternate_location' => $data['alternate_location'] ?? null,
            'start_time' => $startTime,
            'end_time' => $endTime,
        ])->fresh(['alternateFaculty.user']);
    }

    public function deleteException(TimetableBlockException $exception): void
    {
        $exception->delete();
    }

    /**
     * @param array<string, mixed> $data
     */
    private function assertNoConflicts(string $collegeId, array $data, ?string $excludeId = null): void
    {
        $startTime = $data['start_time'] ?? null;
        $endTime = $data['end_time'] ?? null;

        $dayOfWeek = $data['day_of_week'] ?? null;

        if (!$startTime || !$endTime || !$dayOfWeek) {
            throw ValidationException::withMessages([
                'start_time' => 'Timetable day, start and end time are required to evaluate conflicts.',
            ]);
        }

            if (Carbon::parse($endTime) <= Carbon::parse($startTime)) {
            throw ValidationException::withMessages([
                'end_time' => 'End time must be after the start time.',
            ]);
        }

        $conflicts = $this->repository->findConflicts(
            $collegeId,
            $dayOfWeek,
            $startTime,
            $endTime,
            [
                'course' => $data['course'] ?? null,
                'year' => $data['year'] ?? null,
                'section' => $data['section'] ?? null,
                'faculty_id' => $data['faculty_id'] ?? null,
            ],
            $excludeId
        );

        if ($conflicts->isNotEmpty()) {
            throw ValidationException::withMessages([
                'conflicts' => 'The timetable block overlaps with existing entries.',
            ]);
        }
    }

    private function assertDateMatchesBlock(TimetableBlock $block, Carbon $date): void
    {
        $dayOfWeek = strtolower($date->englishDayOfWeek);

        $effectiveFrom = Carbon::parse($block->effective_from);
        $effectiveTo = $block->effective_to ? Carbon::parse($block->effective_to) : null;

        if ($dayOfWeek !== $block->day_of_week) {
            throw ValidationException::withMessages([
                'date' => 'Selected date does not match the timetable block day.',
            ]);
        }

        if ($date->lt($effectiveFrom) || ($effectiveTo && $date->gt($effectiveTo))) {
            throw ValidationException::withMessages([
                'date' => 'Selected date is outside the active range of this timetable block.',
            ]);
        }
    }
}
