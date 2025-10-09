<?php

namespace App\Services;

use App\Repositories\StudentRepository;
use Illuminate\Support\Collection;

class CollegeAdminService
{
    public function __construct(
        private StudentRepository $studentRepository
    ) {}

    public function getStudentsList(string $collegeId, array $filters = []): array
    {
        $students = $this->studentRepository->getStudentsByCollege($collegeId);

        // Apply filters if provided
        if (!empty($filters['course'])) {
            $students = $students->where('course', $filters['course']);
        }

        if (!empty($filters['year'])) {
            $students = $students->where('year', $filters['year']);
        }

        if (!empty($filters['status'])) {
            $students = $students->where('status', $filters['status']);
        }

        return [
            'total' => $students->count(),
            'students' => $students->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->user->full_name,
                    'roll_number' => $student->roll_number,
                    'course' => $student->course,
                    'year' => $student->year,
                    'section' => $student->section,
                    'email' => $student->user->email,
                    'phone' => $student->user->phone,
                    'photo_url' => $student->user->photo_url,
                    'status' => $student->status,
                    'attendance_percentage' => 0, // TODO: Calculate from attendance records
                    'fee_status' => 'pending', // TODO: Get from fee invoices
                    'documents_pending' => 0, // TODO: Get from documents
                ];
            })->values(),
        ];
    }

    public function getStudentProfile(string $studentId): array
    {
        $student = $this->studentRepository->getStudentProfile($studentId);

        if (!$student) {
            throw new \Exception('Student not found');
        }

        return [
            'id' => $student->id,
            'personal_info' => [
                'name' => $student->user->full_name,
                'email' => $student->user->email,
                'phone' => $student->user->phone,
                'date_of_birth' => $student->user->date_of_birth?->format('Y-m-d'),
                'photo_url' => $student->user->photo_url,
            ],
            'academic_info' => [
                'roll_number' => $student->roll_number,
                'admission_number' => $student->admission_number,
                'course' => $student->course,
                'year' => $student->year,
                'section' => $student->section,
                'admission_date' => $student->admission_date->format('Y-m-d'),
                'status' => $student->status,
            ],
            'emergency_contact' => $student->emergency_contact,
            'college' => [
                'id' => $student->college->id,
                'name' => $student->college->name,
            ],
            'attendance_summary' => [], // TODO: Calculate from attendance
            'fee_summary' => [], // TODO: Get from fee invoices
            'storage_info' => [
                'used_mb' => $student->storage_used_mb,
                'quota_mb' => $student->college->student_storage_quota_mb,
                'usage_percentage' => round(($student->storage_used_mb / $student->college->student_storage_quota_mb) * 100, 2),
            ],
        ];
    }
}
