<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use Illuminate\Support\Str;

class RBACSeeder extends Seeder
{
    /**
     * Seed roles and permissions for Bitflow Nova.
     */
    public function run(): void
    {
        // Define permissions by module
        $permissions = [
            // User Management
            ['name' => 'View Users', 'slug' => 'users.view', 'module' => 'users'],
            ['name' => 'Create Users', 'slug' => 'users.create', 'module' => 'users'],
            ['name' => 'Edit Users', 'slug' => 'users.edit', 'module' => 'users'],
            ['name' => 'Delete Users', 'slug' => 'users.delete', 'module' => 'users'],
            
            // College Management
            ['name' => 'View Colleges', 'slug' => 'colleges.view', 'module' => 'colleges'],
            ['name' => 'Create Colleges', 'slug' => 'colleges.create', 'module' => 'colleges'],
            ['name' => 'Edit Colleges', 'slug' => 'colleges.edit', 'module' => 'colleges'],
            
            // Finance
            ['name' => 'View Fees', 'slug' => 'fees.view', 'module' => 'finance'],
            ['name' => 'Manage Fees', 'slug' => 'fees.manage', 'module' => 'finance'],
            ['name' => 'View Payroll', 'slug' => 'payroll.view', 'module' => 'finance'],
            ['name' => 'Manage Payroll', 'slug' => 'payroll.manage', 'module' => 'finance'],
            ['name' => 'Approve Payroll', 'slug' => 'payroll.approve', 'module' => 'finance'],
            
            // Academics
            ['name' => 'View Curriculum', 'slug' => 'curriculum.view', 'module' => 'academics'],
            ['name' => 'Manage Curriculum', 'slug' => 'curriculum.manage', 'module' => 'academics'],
            ['name' => 'View Timetable', 'slug' => 'timetable.view', 'module' => 'academics'],
            ['name' => 'Manage Timetable', 'slug' => 'timetable.manage', 'module' => 'academics'],
            
            // Library
            ['name' => 'View Library', 'slug' => 'library.view', 'module' => 'library'],
            ['name' => 'Upload Resources', 'slug' => 'library.upload', 'module' => 'library'],
            ['name' => 'Approve Resources', 'slug' => 'library.approve', 'module' => 'library'],
            
            // Assessments
            ['name' => 'View Assessments', 'slug' => 'assessments.view', 'module' => 'assessments'],
            ['name' => 'Create Assessments', 'slug' => 'assessments.create', 'module' => 'assessments'],
            ['name' => 'Grade Assessments', 'slug' => 'assessments.grade', 'module' => 'assessments'],
            ['name' => 'Approve Results', 'slug' => 'results.approve', 'module' => 'assessments'],
            
            // Attendance
            ['name' => 'Mark Attendance', 'slug' => 'attendance.mark', 'module' => 'attendance'],
            ['name' => 'View Attendance', 'slug' => 'attendance.view', 'module' => 'attendance'],
            ['name' => 'Approve Corrections', 'slug' => 'attendance.approve_corrections', 'module' => 'attendance'],
            
            // Documents
            ['name' => 'View Documents', 'slug' => 'documents.view', 'module' => 'documents'],
            ['name' => 'Upload Documents', 'slug' => 'documents.upload', 'module' => 'documents'],
            ['name' => 'Verify Documents', 'slug' => 'documents.verify', 'module' => 'documents'],
            
            // Notices
            ['name' => 'View Notices', 'slug' => 'notices.view', 'module' => 'notices'],
            ['name' => 'Create Notices', 'slug' => 'notices.create', 'module' => 'notices'],
            ['name' => 'Create Important Notices', 'slug' => 'notices.create_important', 'module' => 'notices'],
            
            // Feature Toggles
            ['name' => 'View Features', 'slug' => 'features.view', 'module' => 'features'],
            ['name' => 'Request Feature Changes', 'slug' => 'features.request', 'module' => 'features'],
            ['name' => 'Approve Features', 'slug' => 'features.approve', 'module' => 'features'],
        ];

        // Create permissions
        $createdPermissions = [];
        foreach ($permissions as $permission) {
            $createdPermissions[$permission['slug']] = Permission::firstOrCreate(
                ['slug' => $permission['slug']],
                $permission
            );
        }

        // Define roles and their permissions
        $roles = [
            [
                'name' => 'Bitflow Owner',
                'slug' => 'bitflow_owner',
                'scope' => 'system',
                'description' => 'Full system access for Bitflow Nova team',
                'permissions' => array_keys($createdPermissions), // All permissions
            ],
            [
                'name' => 'University Owner',
                'slug' => 'university_owner',
                'scope' => 'university',
                'description' => 'Full access to all colleges in university',
                'permissions' => array_keys($createdPermissions), // All permissions
            ],
            [
                'name' => 'Super Admin',
                'slug' => 'super_admin',
                'scope' => 'university',
                'description' => 'Manages all departments across colleges',
                'permissions' => [
                    'users.view', 'users.create', 'users.edit',
                    'colleges.view', 'colleges.create', 'colleges.edit',
                    'fees.view', 'fees.manage',
                    'curriculum.view', 'curriculum.manage',
                    'timetable.view', 'timetable.manage',
                    'library.view', 'library.approve',
                    'notices.create', 'notices.create_important',
                    'features.view', 'features.request',
                ],
            ],
            [
                'name' => 'College Admin',
                'slug' => 'college_admin',
                'scope' => 'college',
                'description' => 'Manages single college operations',
                'permissions' => [
                    'users.view', 'users.create', 'users.edit',
                    'fees.view', 'fees.manage',
                    'timetable.view', 'timetable.manage',
                    'library.view', 'library.approve',
                    'assessments.view', 'results.approve',
                    'attendance.view', 'attendance.approve_corrections',
                    'documents.view', 'documents.verify',
                    'notices.create', 'notices.create_important',
                ],
            ],
            [
                'name' => 'Super Accountant',
                'slug' => 'super_accountant',
                'scope' => 'university',
                'description' => 'Manages finance across all colleges',
                'permissions' => [
                    'fees.view', 'fees.manage',
                    'payroll.view', 'payroll.manage', 'payroll.approve',
                ],
            ],
            [
                'name' => 'College Accountant',
                'slug' => 'college_accountant',
                'scope' => 'college',
                'description' => 'Manages college-level finance',
                'permissions' => [
                    'fees.view', 'fees.manage',
                    'payroll.view',
                ],
            ],
            [
                'name' => 'College Fee Admin',
                'slug' => 'college_fee_admin',
                'scope' => 'college',
                'description' => 'Manages fee structures and payments',
                'permissions' => [
                    'fees.view', 'fees.manage',
                ],
            ],
            [
                'name' => 'Super Academics',
                'slug' => 'super_academics',
                'scope' => 'university',
                'description' => 'Manages academics across all colleges',
                'permissions' => [
                    'curriculum.view', 'curriculum.manage',
                    'timetable.view', 'timetable.manage',
                    'assessments.view', 'assessments.create', 'results.approve',
                ],
            ],
            [
                'name' => 'Faculty',
                'slug' => 'faculty',
                'scope' => 'college',
                'description' => 'Teacher with class and content management',
                'permissions' => [
                    'library.view', 'library.upload',
                    'assessments.view', 'assessments.create', 'assessments.grade',
                    'attendance.mark', 'attendance.view',
                    'notices.view',
                ],
            ],
            [
                'name' => 'Student',
                'slug' => 'student',
                'scope' => 'college',
                'description' => 'Student portal access',
                'permissions' => [
                    'library.view',
                    'assessments.view',
                    'attendance.view',
                    'documents.view', 'documents.upload',
                    'notices.view',
                ],
            ],
            [
                'name' => 'Parent',
                'slug' => 'parent',
                'scope' => 'college',
                'description' => 'Parent portal access',
                'permissions' => [
                    'attendance.view',
                    'assessments.view',
                    'fees.view',
                    'notices.view',
                ],
            ],
        ];

        // Create roles and attach permissions
        foreach ($roles as $roleData) {
            $permissionSlugs = $roleData['permissions'];
            unset($roleData['permissions']);

            $roleData['name'] = Str::of($roleData['slug'])
                ->replace('_', '-')
                ->lower();

            $role = Role::firstOrCreate(
                ['slug' => $roleData['slug']],
                $roleData
            );

            // Attach permissions
            $permissionIds = collect($permissionSlugs)
                ->map(fn($slug) => $createdPermissions[$slug]->id)
                ->toArray();

            $role->permissions()->sync($permissionIds);
        }

        $this->command->info('✓ RBAC seeded: ' . count($roles) . ' roles, ' . count($permissions) . ' permissions');
    }
}
