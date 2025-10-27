<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define all permissions by category
        $permissions = [
            // User Management
            'users' => [
                'users.view' => 'View users',
                'users.create' => 'Create users',
                'users.update' => 'Update users',
                'users.delete' => 'Delete users',
                'users.manage-roles' => 'Manage user roles',
            ],
            
            // College Management
            'colleges' => [
                'colleges.view' => 'View colleges',
                'colleges.create' => 'Create colleges',
                'colleges.update' => 'Update colleges',
                'colleges.delete' => 'Delete colleges',
            ],
            
            // Department Management
            'departments' => [
                'departments.view' => 'View departments',
                'departments.create' => 'Create departments',
                'departments.update' => 'Update departments',
                'departments.delete' => 'Delete departments',
            ],
            
            // Course Management
            'courses' => [
                'courses.view' => 'View courses',
                'courses.create' => 'Create courses',
                'courses.update' => 'Update courses',
                'courses.delete' => 'Delete courses',
            ],
            
            // Student Management
            'students' => [
                'students.view' => 'View students',
                'students.create' => 'Create students',
                'students.update' => 'Update students',
                'students.delete' => 'Delete students',
                'students.enroll' => 'Enroll students',
                'students.grades' => 'Manage student grades',
                'students.attendance' => 'Manage student attendance',
            ],
            
            // Faculty Management
            'faculty' => [
                'faculty.view' => 'View faculty',
                'faculty.create' => 'Create faculty',
                'faculty.update' => 'Update faculty',
                'faculty.delete' => 'Delete faculty',
                'faculty.assign-courses' => 'Assign courses to faculty',
            ],
            
            // Attendance Management
            'attendance' => [
                'attendance.view' => 'View attendance',
                'attendance.mark' => 'Mark attendance',
                'attendance.update' => 'Update attendance',
                'attendance.reports' => 'Generate attendance reports',
            ],
            
            // Grades Management
            'grades' => [
                'grades.view' => 'View grades',
                'grades.enter' => 'Enter grades',
                'grades.update' => 'Update grades',
                'grades.approve' => 'Approve grades',
                'grades.reports' => 'Generate grade reports',
            ],
            
            // Assignments Management
            'assignments' => [
                'assignments.view' => 'View assignments',
                'assignments.create' => 'Create assignments',
                'assignments.update' => 'Update assignments',
                'assignments.delete' => 'Delete assignments',
                'assignments.grade' => 'Grade assignments',
            ],
            
            // Fee Management
            'fees' => [
                'fees.view' => 'View fees',
                'fees.create' => 'Create fee structures',
                'fees.update' => 'Update fee structures',
                'fees.delete' => 'Delete fee structures',
                'fees.collect' => 'Collect fees',
                'fees.reports' => 'Generate fee reports',
            ],
            
            // Accounting
            'accounting' => [
                'accounting.view' => 'View accounting',
                'accounting.ledger' => 'Manage ledger',
                'accounting.expenses' => 'Manage expenses',
                'accounting.reports' => 'Generate financial reports',
            ],
            
            // Admission Management
            'admissions' => [
                'admissions.view' => 'View admissions',
                'admissions.create' => 'Create admission applications',
                'admissions.review' => 'Review admission applications',
                'admissions.approve' => 'Approve admissions',
                'admissions.reject' => 'Reject admissions',
            ],
            
            // Timetable Management
            'timetable' => [
                'timetable.view' => 'View timetable',
                'timetable.create' => 'Create timetable',
                'timetable.update' => 'Update timetable',
                'timetable.delete' => 'Delete timetable',
            ],
            
            // Library Management
            'library' => [
                'library.view' => 'View library',
                'library.books.manage' => 'Manage books',
                'library.issue' => 'Issue books',
                'library.return' => 'Return books',
            ],
            
            // Reports
            'reports' => [
                'reports.academic' => 'Generate academic reports',
                'reports.financial' => 'Generate financial reports',
                'reports.administrative' => 'Generate administrative reports',
            ],
            
            // System Settings
            'settings' => [
                'settings.view' => 'View settings',
                'settings.update' => 'Update settings',
                'settings.university' => 'Manage university settings',
            ],
        ];

        // Create all permissions
        foreach ($permissions as $category => $categoryPermissions) {
            foreach ($categoryPermissions as $slug => $name) {
                Permission::create([
                    'name' => $name,
                    'slug' => $slug,
                    'category' => $category,
                    'description' => "Permission to $name",
                ]);
                
                $this->command->info("Created permission: $slug");
            }
        }

        // Assign permissions to roles
        $this->assignPermissionsToRoles();
    }

    /**
     * Assign permissions to roles based on hierarchy
     */
    private function assignPermissionsToRoles(): void
    {
        // Bitflow Owner - All permissions
        $bitflowOwner = Role::where('slug', 'bitflow_owner')->first();
        if ($bitflowOwner) {
            $allPermissions = Permission::pluck('id')->toArray();
            $bitflowOwner->permissions()->sync($allPermissions);
            $this->command->info("Assigned all permissions to Bitflow Owner");
        }

        // University Owner - University-level permissions
        $universityOwner = Role::where('slug', 'university_owner')->first();
        if ($universityOwner) {
            $permissions = Permission::whereIn('category', [
                'users', 'colleges', 'departments', 'courses', 'students', 
                'faculty', 'settings', 'reports'
            ])->pluck('id')->toArray();
            $universityOwner->permissions()->sync($permissions);
            $this->command->info("Assigned permissions to University Owner");
        }

        // Super Admin - College-level permissions
        $superAdmin = Role::where('slug', 'super_admin')->first();
        if ($superAdmin) {
            $permissions = Permission::whereIn('category', [
                'users', 'departments', 'courses', 'students', 'faculty',
                'attendance', 'grades', 'reports'
            ])->pluck('id')->toArray();
            $superAdmin->permissions()->sync($permissions);
            $this->command->info("Assigned permissions to Super Admin");
        }

        // Principal - Department-level permissions
        $principal = Role::where('slug', 'principal')->first();
        if ($principal) {
            $permissions = Permission::whereIn('category', [
                'departments', 'courses', 'students', 'faculty', 
                'attendance', 'grades', 'reports'
            ])->pluck('id')->toArray();
            $principal->permissions()->sync($permissions);
            $this->command->info("Assigned permissions to Principal");
        }

        // Faculty - Teaching permissions
        $faculty = Role::where('slug', 'faculty')->first();
        if ($faculty) {
            $permissions = Permission::whereIn('slug', [
                'students.view', 'attendance.view', 'attendance.mark',
                'grades.view', 'grades.enter', 'assignments.view',
                'assignments.create', 'assignments.grade'
            ])->pluck('id')->toArray();
            $faculty->permissions()->sync($permissions);
            $this->command->info("Assigned permissions to Faculty");
        }

        // Student - Basic permissions
        $student = Role::where('slug', 'student')->first();
        if ($student) {
            $permissions = Permission::whereIn('slug', [
                'courses.view', 'attendance.view', 'grades.view',
                'assignments.view', 'library.view'
            ])->pluck('id')->toArray();
            $student->permissions()->sync($permissions);
            $this->command->info("Assigned permissions to Student");
        }

        $this->command->info("Permission assignment completed!");
    }
}
