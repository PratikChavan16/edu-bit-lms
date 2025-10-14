<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Complete Role Hierarchy Seeder based on Project_details.txt specifications
 * 
 * Implements all 12 roles with proper hierarchy:
 * 1. Owner US (Bitflow Nova) - System Owner
 * 2. Owner of the college - College Owner
 * 3. Super Admin Department - Highest authority
 * 4. Super Accountant Department - Global finance
 * 5. Principal of the College - College-level authority
 * 6. College Admins (multiple types)
 * 7. Vice Principal - Second-in-command
 * 8. Accounts Department - College-level finance
 * 9. Super Non-Teaching Staff - Non-teaching management
 * 10. Teachers / Faculty - Teaching staff
 * 11. Parents - Guardian access
 * 12. Students - Learner access
 */
class CompleteRoleHierarchySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define all roles with their hierarchy and permissions
        $roles = [
            // Level 1: System Owner
            [
                'name' => 'Bitflow Nova Owner',
                'slug' => 'bitflow-nova-owner',
                'description' => 'System owner with full control over all universities, colleges, and system settings',
                'level' => 1,
                'permissions' => ['*'], // All permissions
            ],
            
            // Level 2: College Owner
            [
                'name' => 'College Owner',
                'slug' => 'college-owner',
                'description' => 'Owner of a college with full control over their institution',
                'level' => 2,
                'permissions' => [
                    'college:*',
                    'users:manage',
                    'roles:assign',
                    'departments:manage',
                    'finance:view',
                    'reports:generate',
                ],
            ],
            
            // Level 3: Super Admins
            [
                'name' => 'Super Admin',
                'slug' => 'super-admin',
                'description' => 'Highest administrative authority with control over multiple colleges',
                'level' => 3,
                'permissions' => [
                    'colleges:manage',
                    'users:manage',
                    'departments:manage',
                    'roles:manage',
                    'settings:manage',
                    'reports:generate',
                    'audit-logs:view',
                ],
            ],
            
            [
                'name' => 'Super Accountant',
                'slug' => 'super-accountant',
                'description' => 'Head of accounts for entire system with global financial control',
                'level' => 3,
                'permissions' => [
                    'finance:*',
                    'payroll:manage',
                    'fees:manage',
                    'expenses:manage',
                    'reports:financial',
                    'accounts:approve',
                    'budget:manage',
                ],
            ],
            
            [
                'name' => 'Super Non-Teaching Staff Manager',
                'slug' => 'super-non-teaching-manager',
                'description' => 'Head of non-teaching staff management',
                'level' => 3,
                'permissions' => [
                    'non-teaching-staff:manage',
                    'attendance:manage',
                    'leaves:manage',
                    'performance:track',
                    'reports:staff',
                ],
            ],
            
            // Level 4: College-Level Leadership
            [
                'name' => 'Principal',
                'slug' => 'principal',
                'description' => 'Principal of a college with full authority over college operations',
                'level' => 4,
                'permissions' => [
                    'college:manage',
                    'users:manage',
                    'departments:manage',
                    'admissions:approve',
                    'academics:manage',
                    'staff:manage',
                    'notices:create',
                    'reports:view',
                ],
            ],
            
            [
                'name' => 'Vice Principal',
                'slug' => 'vice-principal',
                'description' => 'Second-in-command to Principal',
                'level' => 4,
                'permissions' => [
                    'college:view',
                    'users:view',
                    'departments:view',
                    'academics:manage',
                    'staff:view',
                    'notices:create',
                    'reports:view',
                ],
            ],
            
            // Level 5: College Department Admins
            [
                'name' => 'College Admission Admin',
                'slug' => 'college-admission-admin',
                'description' => 'Manages student admissions and enrollment',
                'level' => 5,
                'permissions' => [
                    'admissions:manage',
                    'students:create',
                    'students:view',
                    'documents:verify',
                    'reports:admissions',
                ],
            ],
            
            [
                'name' => 'College Accounts Admin',
                'slug' => 'college-accounts-admin',
                'description' => 'Manages college-level finances',
                'level' => 5,
                'permissions' => [
                    'fees:manage',
                    'expenses:create',
                    'vouchers:create',
                    'receipts:generate',
                    'reports:financial',
                ],
            ],
            
            [
                'name' => 'College Fee Admin',
                'slug' => 'college-fee-admin',
                'description' => 'Manages student fee collection and tracking',
                'level' => 5,
                'permissions' => [
                    'fees:collect',
                    'fees:view',
                    'receipts:generate',
                    'defaulters:track',
                    'reports:fees',
                ],
            ],
            
            [
                'name' => 'College Admin (Non-Teaching)',
                'slug' => 'college-admin-non-teaching',
                'description' => 'Manages non-teaching staff',
                'level' => 5,
                'permissions' => [
                    'non-teaching-staff:manage',
                    'attendance:track',
                    'leaves:approve',
                    'reports:staff',
                ],
            ],
            
            // Level 6: Faculty/Teaching Staff
            [
                'name' => 'Faculty',
                'slug' => 'faculty',
                'description' => 'Teaching staff with access to academic resources',
                'level' => 6,
                'permissions' => [
                    'courses:manage',
                    'notes:upload',
                    'videos:upload',
                    'assessments:create',
                    'attendance:mark',
                    'results:enter',
                    'students:view',
                    'timetable:view',
                    'salary-slips:view',
                ],
            ],
            
            [
                'name' => 'Head of Department (HOD)',
                'slug' => 'hod',
                'description' => 'Department head with additional management permissions',
                'level' => 5,
                'permissions' => [
                    'department:manage',
                    'faculty:view',
                    'courses:manage',
                    'timetable:manage',
                    'assessments:manage',
                    'notes:upload',
                    'videos:upload',
                    'attendance:mark',
                    'results:approve',
                    'reports:department',
                ],
            ],
            
            // Level 7: Parents
            [
                'name' => 'Parent',
                'slug' => 'parent',
                'description' => 'Parent/guardian with access to student information',
                'level' => 7,
                'permissions' => [
                    'student:view',
                    'attendance:view',
                    'results:view',
                    'fees:view',
                    'notices:view',
                    'timetable:view',
                ],
            ],
            
            // Level 8: Students
            [
                'name' => 'Student',
                'slug' => 'student',
                'description' => 'Student with access to learning resources',
                'level' => 8,
                'permissions' => [
                    'dashboard:view',
                    'library:access',
                    'notes:view',
                    'videos:view',
                    'assessments:take',
                    'results:view',
                    'documents:upload',
                    'attendance:view',
                    'timetable:view',
                    'profile:manage',
                ],
            ],
        ];

        // Create or update roles
        foreach ($roles as $roleData) {
            $role = Role::updateOrCreate(
                ['slug' => $roleData['slug']],
                [
                    'name' => $roleData['name'],
                    'description' => $roleData['description'],
                    'level' => $roleData['level'],
                ]
            );

            // Create and attach permissions
            foreach ($roleData['permissions'] as $permissionName) {
                if ($permissionName === '*') {
                    // All permissions - will be handled separately
                    continue;
                }

                // Extract module from permission name (e.g., 'users:manage' => 'users')
                $parts = explode(':', $permissionName);
                $module = $parts[0] ?? 'general';

                $permission = Permission::firstOrCreate(
                    [
                        'slug' => Str::slug($permissionName),
                    ],
                    [
                        'name' => $permissionName,
                        'module' => $module,
                        'description' => "Permission to $permissionName",
                    ]
                );

                $role->permissions()->attach($permission->id);
            }
        }

        $this->command->info('✅ Complete role hierarchy created successfully with all 15 roles!');
        $this->command->info('📊 Role levels: 1 (Highest) → 8 (Lowest)');
        $this->command->info('🔐 Permissions matrix established for all roles');
    }
}
