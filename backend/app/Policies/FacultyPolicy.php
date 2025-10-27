<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Faculty;

class FacultyPolicy
{
    /**
     * Determine if the user can view any faculty.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole([
            'bitflow_owner',
            'university_owner',
            'super_admin',
            'principal',
            'college_admin',
            'super_academics'
        ]);
    }

    /**
     * Determine if the user can view the faculty.
     */
    public function view(User $user, Faculty $faculty): bool
    {
        // User must have access to the same university
        if ($user->university_id !== $faculty->university_id) {
            return false;
        }

        // Faculty can view their own profile
        if ($user->id === $faculty->user_id) {
            return true;
        }

        return $user->hasAnyRole([
            'bitflow_owner',
            'university_owner',
            'super_admin',
            'principal',
            'college_admin',
            'super_academics',
            'faculty'
        ]);
    }

    /**
     * Determine if the user can create faculty.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyRole([
            'bitflow_owner',
            'university_owner',
            'super_admin',
            'principal',
            'super_academics'
        ]);
    }

    /**
     * Determine if the user can update the faculty.
     */
    public function update(User $user, Faculty $faculty): bool
    {
        // User must have access to the same university
        if ($user->university_id !== $faculty->university_id) {
            return false;
        }

        return $user->hasAnyRole([
            'bitflow_owner',
            'university_owner',
            'super_admin',
            'principal',
            'super_academics'
        ]);
    }

    /**
     * Determine if the user can delete the faculty.
     */
    public function delete(User $user, Faculty $faculty): bool
    {
        // User must have access to the same university
        if ($user->university_id !== $faculty->university_id) {
            return false;
        }

        return $user->hasAnyRole([
            'bitflow_owner',
            'university_owner',
            'super_admin'
        ]);
    }
}
