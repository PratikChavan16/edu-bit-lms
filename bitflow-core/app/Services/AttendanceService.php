<?php

namespace App\Services;

use App\Models\AttendanceCorrection;
use App\Models\Student;
use App\Models\TimetableBlock;
use App\Repositories\AttendanceRepository;
use Carbon\Carbon;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AttendanceService
{
    public const ALLOWED_STATUSES = ['present', 'absent', 'late', 'excused'];

    public function __construct(private AttendanceRepository $attendanceRepository)
    {
    }

    public function markAttendance(TimetableBlock $block, Carbon $date, string $markerId, array $entries): Collection
    {
        if (empty($entries)) {
            throw ValidationException::withMessages([
                'entries' => 'At least one attendance entry must be provided.',
            ]);
        }

        $this->assertDateAssignable($block, $date);

        $payload = [];

        foreach ($entries as $entry) {
            $studentId = $entry['student_id'] ?? null;
            $status = $entry['status'] ?? null;

            if (!$studentId || !$status) {
                throw ValidationException::withMessages([
                    'entries' => 'Each entry requires student_id and status.',
                ]);
            }

            if (!in_array($status, self::ALLOWED_STATUSES, true)) {
                throw ValidationException::withMessages([
                    'status' => sprintf('Status %s is not allowed.', $status),
                ]);
            }

            $payload[] = [
                'student_id' => $studentId,
                'timetable_block_id' => $block->id,
                'date' => $date->toDateString(),
                'status' => $status,
                'marked_by' => $markerId,
                'notes' => $entry['notes'] ?? null,
            ];
        }

        return $this->attendanceRepository->upsertAttendance($payload);
    }

    public function getBlockAttendance(TimetableBlock $block, Carbon $date): Collection
    {
        $this->assertDateAssignable($block, $date);

        return $this->attendanceRepository->getBlockAttendance($block->id, $date);
    }

    public function getStudentAttendance(Student $student, Carbon $from, Carbon $to): Collection
    {
        return $this->attendanceRepository->getStudentAttendance($student->id, $from, $to);
    }

    public function getStudentAttendancePaginated(Student $student, int $perPage = 25): LengthAwarePaginator
    {
        return $this->attendanceRepository->getStudentAttendancePaginated($student->id, $perPage);
    }

    public function requestCorrection(string $attendanceId, string $requesterId, string $desiredStatus, ?string $reason = null): AttendanceCorrection
    {
        if (!in_array($desiredStatus, self::ALLOWED_STATUSES, true)) {
            throw ValidationException::withMessages([
                'requested_status' => 'Requested status is not valid.',
            ]);
        }

        $attendance = $this->attendanceRepository->findAttendance($attendanceId);

        if ($attendance->corrections()->where('status', 'pending')->exists()) {
            throw ValidationException::withMessages([
                'correction' => 'A pending correction already exists for this attendance record.',
            ]);
        }

        return $this->attendanceRepository->createCorrection([
            'attendance_id' => $attendance->id,
            'original_status' => $attendance->status,
            'requested_status' => $desiredStatus,
            'reason' => $reason,
            'requested_by' => $requesterId,
            'status' => 'pending',
        ]);
    }

    public function listCorrections(array $filters = [], int $perPage = 20): LengthAwarePaginator
    {
        return $this->attendanceRepository->listCorrections($filters, $perPage);
    }

    public function getCorrection(string $correctionId): AttendanceCorrection
    {
        return $this->attendanceRepository->findCorrection($correctionId);
    }

    public function reviewCorrection(string $correctionId, string $reviewerId, string $status, ?string $notes = null): AttendanceCorrection
    {
    if (!in_array($status, ['approved', 'rejected'], true)) {
            throw ValidationException::withMessages([
                'status' => 'Review decision must be approved or rejected.',
            ]);
        }

        return DB::transaction(function () use ($correctionId, $reviewerId, $status, $notes) {
            $correction = $this->attendanceRepository->findCorrection($correctionId);

            if ($correction->status !== 'pending') {
                throw ValidationException::withMessages([
                    'status' => 'Only pending corrections can be reviewed.',
                ]);
            }

            $attendance = $correction->attendance ?? $this->attendanceRepository->findAttendance($correction->attendance_id);

            $updatedCorrection = $this->attendanceRepository->updateCorrection($correction, [
                'status' => $status,
                'review_notes' => $notes,
                'reviewed_by' => $reviewerId,
                'reviewed_at' => Carbon::now(),
            ]);

            if ($status === 'approved') {
                $this->attendanceRepository->updateAttendance($attendance, [
                    'status' => $updatedCorrection->requested_status,
                ]);
            }

            return $updatedCorrection;
        });
    }

    private function assertDateAssignable(TimetableBlock $block, Carbon $date): void
    {
        $dayOfWeek = strtolower($date->englishDayOfWeek);

        if ($dayOfWeek !== $block->day_of_week) {
            throw ValidationException::withMessages([
                'date' => 'Attendance date must align with the timetable block day.',
            ]);
        }

        $effectiveFrom = Carbon::parse($block->effective_from);
        $effectiveTo = $block->effective_to ? Carbon::parse($block->effective_to) : null;

        if ($date->lt($effectiveFrom) || ($effectiveTo && $date->gt($effectiveTo))) {
            throw ValidationException::withMessages([
                'date' => 'Attendance date is outside the active range for this block.',
            ]);
        }
    }
}
