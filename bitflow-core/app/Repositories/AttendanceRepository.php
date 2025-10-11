<?php

namespace App\Repositories;

use App\Models\Attendance;
use App\Models\AttendanceCorrection;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class AttendanceRepository
{
    /**
     * @param array<int, array<string, mixed>> $entries
     * @return Collection<int, Attendance>
     */
    public function upsertAttendance(array $entries): Collection
    {
        $records = [];

        foreach ($entries as $entry) {
            $attendance = Attendance::updateOrCreate(
                [
                    'student_id' => $entry['student_id'],
                    'timetable_block_id' => $entry['timetable_block_id'],
                    'date' => $entry['date'],
                ],
                [
                    'status' => $entry['status'],
                    'marked_by' => $entry['marked_by'],
                    'notes' => $entry['notes'] ?? null,
                ]
            );

            $records[] = $attendance->fresh(['student.user', 'timetableBlock']);
        }

        return new Collection($records);
    }

    public function getStudentAttendance(string $studentId, Carbon $from, Carbon $to): Collection
    {
        return Attendance::with(['timetableBlock', 'marker'])
            ->where('student_id', $studentId)
            ->whereBetween('date', [$from->toDateString(), $to->toDateString()])
            ->orderByDesc('date')
            ->get();
    }

    public function getStudentAttendancePaginated(string $studentId, int $perPage = 25): LengthAwarePaginator
    {
        return Attendance::with(['timetableBlock', 'marker'])
            ->where('student_id', $studentId)
            ->orderByDesc('date')
            ->paginate($perPage);
    }

    public function getBlockAttendance(string $blockId, Carbon $date): Collection
    {
        return Attendance::with(['student.user'])
            ->where('timetable_block_id', $blockId)
            ->whereDate('date', $date->toDateString())
            ->get();
    }

    public function findAttendance(string $attendanceId): Attendance
    {
        return Attendance::with(['student.user', 'timetableBlock'])->findOrFail($attendanceId);
    }

    public function updateAttendance(Attendance $attendance, array $data): Attendance
    {
        $attendance->fill($data);
        $attendance->save();

        return $attendance->fresh(['student.user', 'timetableBlock']);
    }

    public function createCorrection(array $data): AttendanceCorrection
    {
        return AttendanceCorrection::create($data)->fresh(['attendance.timetableBlock', 'requester']);
    }

    public function updateCorrection(AttendanceCorrection $correction, array $data): AttendanceCorrection
    {
        $correction->fill($data);
        $correction->save();

        return $correction->fresh(['attendance.student.user', 'attendance.timetableBlock', 'requester', 'reviewer']);
    }

    public function listCorrections(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        $query = AttendanceCorrection::with(['attendance.student.user', 'attendance.timetableBlock', 'requester', 'reviewer'])
            ->orderByDesc('created_at');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['student_id'])) {
            $query->whereHas('attendance', function ($q) use ($filters) {
                $q->where('student_id', $filters['student_id']);
            });
        }

        return $query->paginate($perPage);
    }

    public function findCorrection(string $correctionId): AttendanceCorrection
    {
        return AttendanceCorrection::with(['attendance', 'requester', 'reviewer'])->findOrFail($correctionId);
    }
}
