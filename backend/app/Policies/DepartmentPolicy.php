<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Department;

class DepartmentPolicy
{
    /**
     * Determine if the user can view any departments.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['bitflow_owner', 'university_owner', 'super_admin', 'principal', 'college_admin']);
    }

    /**
     * Determine if the user can view the department.
     */
    public function view(User $user, Department $department): bool
    {
        // User must have access to the same university
        if ($user->university_id !== $department->university_id) {
            return false;
        }

        return $user->hasAnyRole(['bitflow_owner', 'university_owner', 'super_admin', 'principal', 'college_admin', 'faculty']);
    }

    /**
     * Determine if the user can create departments.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyRole(['bitflow_owner', 'university_owner', 'super_admin', 'principal']);
    }

    /**
     * Determine if the user can update the department.
     */
    public function update(User $user, Department $department): bool
    {
        // User must have access to the same university
        if ($user->university_id !== $department->university_id) {
            return false;
        }

        return $user->hasAnyRole(['bitflow_owner', 'university_owner', 'super_admin', 'principal']);
    }

    /**
     * Determine if the user can delete the department.
     */
    public function delete(User $user, Department $department): bool
    {
        // User must have access to the same university
        if ($user->university_id !== $department->university_id) {
            return false;
        }

        return $user->hasAnyRole(['bitflow_owner', 'university_owner', 'super_admin']);
    }
}
