<?php

namespace App\Repositories;

use App\Models\Student;
use Illuminate\Database\Eloquent\Collection;

class StudentRepository
{
    public function findByUserId(string $userId): ?Student
    {
        return Student::with(['college', 'user'])
            ->where('user_id', $userId)
            ->first();
    }

    public function getStudentsByCollege(string $collegeId): Collection
    {
        return Student::with(['user'])
            ->where('college_id', $collegeId)
            ->where('status', 'active')
            ->get();
    }

    public function getStudentProfile(string $studentId): ?Student
    {
        return Student::with(['user', 'college'])
            ->find($studentId);
    }
}
