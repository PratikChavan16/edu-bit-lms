<?php

namespace App\Repositories;

use App\Models\TimetableBlock;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;

class TimetableRepository
{
    public function getTodaySchedule(string $collegeId, string $course, int $year, ?string $section = null): Collection
    {
        $today = Carbon::now();
        
        $query = TimetableBlock::where('college_id', $collegeId)
            ->where('course', $course)
            ->where('year', $year)
            ->forDate($today)
            ->with('faculty.user')
            ->orderBy('start_time');

        if ($section) {
            $query->where('section', $section);
        }

        return $query->get();
    }

    public function getUpcomingLectures(string $collegeId, string $course, int $year, ?string $section = null, int $limit = 3): Collection
    {
        $today = Carbon::now();
        $currentTime = $today->format('H:i:s');
        
        $query = TimetableBlock::where('college_id', $collegeId)
            ->where('course', $course)
            ->where('year', $year)
            ->forDate($today)
            ->where('start_time', '>=', $currentTime)
            ->with('faculty.user')
            ->orderBy('start_time')
            ->limit($limit);

        if ($section) {
            $query->where('section', $section);
        }

        return $query->get();
    }

    public function getWeekSchedule(string $collegeId, string $course, int $year, ?string $section = null): Collection
    {
        $query = TimetableBlock::where('college_id', $collegeId)
            ->where('course', $course)
            ->where('year', $year)
            ->where('effective_from', '<=', Carbon::now())
            ->where(function ($q) {
                $q->whereNull('effective_to')
                    ->orWhere('effective_to', '>=', Carbon::now());
            })
            ->with('faculty.user')
            ->orderBy('day_of_week')
            ->orderBy('start_time');

        if ($section) {
            $query->where('section', $section);
        }

        return $query->get();
    }

    public function getFacultyWeekSchedule(string $facultyId, Carbon $referenceDate): Collection
    {
        $startOfWeek = $referenceDate->copy()->startOfWeek();
        $endOfWeek = $referenceDate->copy()->endOfWeek();

        return TimetableBlock::where('faculty_id', $facultyId)
            ->where('effective_from', '<=', $endOfWeek)
            ->where(function ($q) use ($startOfWeek) {
                $q->whereNull('effective_to')
                    ->orWhere('effective_to', '>=', $startOfWeek);
            })
            ->with(['college', 'faculty.user', 'exceptions.alternateFaculty.user'])
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();
    }

    public function findById(string $id): TimetableBlock
    {
        return TimetableBlock::with(['faculty.user', 'college', 'exceptions.alternateFaculty.user'])->findOrFail($id);
    }

    public function createBlock(array $data): TimetableBlock
    {
        return TimetableBlock::create($data)->fresh(['faculty.user', 'exceptions.alternateFaculty.user']);
    }

    public function updateBlock(TimetableBlock $block, array $data): TimetableBlock
    {
        $block->fill($data);
        $block->save();

        return $block->fresh(['faculty.user', 'exceptions.alternateFaculty.user']);
    }

    public function deleteBlock(TimetableBlock $block): void
    {
        $block->delete();
    }

    public function findConflicts(string $collegeId, string $dayOfWeek, string $startTime, string $endTime, array $criteria, ?string $excludeId = null): Collection
    {
        if (empty($criteria['course']) && empty($criteria['faculty_id'])) {
            return collect();
        }

        $query = TimetableBlock::where('college_id', $collegeId)
            ->where('day_of_week', $dayOfWeek)
            ->where(function ($q) use ($startTime, $endTime) {
                $q->whereBetween('start_time', [$startTime, $endTime])
                    ->orWhereBetween('end_time', [$startTime, $endTime])
                    ->orWhere(function ($overlap) use ($startTime, $endTime) {
                        $overlap->where('start_time', '<=', $startTime)
                            ->where('end_time', '>=', $endTime);
                    });
            });

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        $query->where(function ($q) use ($criteria) {
            $applied = false;

            if (!empty($criteria['course']) && !empty($criteria['year'])) {
                $applied = true;

                $q->where(function ($courseQuery) use ($criteria) {
                    $courseQuery->where('course', $criteria['course'])
                        ->where('year', $criteria['year']);

                    if (!empty($criteria['section'])) {
                        $courseQuery->where(function ($sectionQuery) use ($criteria) {
                            $sectionQuery->whereNull('section')
                                ->orWhere('section', $criteria['section']);
                        });
                    }
                });
            }

            if (!empty($criteria['faculty_id'])) {
                if ($applied) {
                    $q->orWhere('faculty_id', $criteria['faculty_id']);
                } else {
                    $q->where('faculty_id', $criteria['faculty_id']);
                }
            }
        });

        return $query->get();
    }
}
