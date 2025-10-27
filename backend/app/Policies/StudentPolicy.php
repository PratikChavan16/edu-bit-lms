<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Student;

class StudentPolicy
{
    /**
     * Determine if the user can view any students.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole([
            'bitflow_owner',
            'university_owner',
            'super_admin',
            'principal',
            'college_admin',
            'super_academics',
            'faculty',
            'admission_admin'
        ]);
    }

    /**
     * Determine if the user can view the student.
     */
    public function view(User $user, Student $student): bool
    {
        // User must have access to the same university
        if ($user->university_id !== $student->university_id) {
            return false;
        }

        // Student can view their own profile
        if ($user->id === $student->user_id) {
            return true;
        }

        return $user->hasAnyRole([
            'bitflow_owner',
            'university_owner',
            'super_admin',
            'principal',
            'college_admin',
            'super_academics',
            'faculty',
            'admission_admin'
        ]);
    }

    /**
     * Determine if the user can create students.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyRole([
            'bitflow_owner',
            'university_owner',
            'super_admin',
            'principal',
            'college_admin',
            'admission_admin'
        ]);
    }

    /**
     * Determine if the user can update the student.
     */
    public function update(User $user, Student $student): bool
    {
        // User must have access to the same university
        if ($user->university_id !== $student->university_id) {
            return false;
        }

        return $user->hasAnyRole([
            'bitflow_owner',
            'university_owner',
            'super_admin',
            'principal',
            'college_admin',
            'admission_admin'
        ]);
    }

    /**
     * Determine if the user can delete the student.
     */
    public function delete(User $user, Student $student): bool
    {
        // User must have access to the same university
        if ($user->university_id !== $student->university_id) {
            return false;
        }

        return $user->hasAnyRole([
            'bitflow_owner',
            'university_owner',
            'super_admin',
            'principal'
        ]);
    }
}
