<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\University;
use App\Models\College;
use App\Models\Department;
use App\Models\Faculty;
use App\Models\Student;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ComprehensiveDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * This seeder creates:
     * - 2 Universities
     * - 2-3 Colleges per University (scoped to their university)
     * - 3-5 Departments per College (scoped to their college)
     * - Faculty members for each department
     * - Students for each department
     * - Administrative and Non-Teaching staff
     */
    public function run(): void
    {
        $this->command->info('🚀 Starting Comprehensive Data Seeding...');
        
        // Clear existing data (except roles and permissions)
        $this->command->info('🗑️  Clearing existing data...');
        
        // Disable foreign key constraints
        \DB::statement('PRAGMA foreign_keys = OFF');
        
        \DB::table('role_user')->truncate();
        \DB::table('users')->truncate();
        \DB::table('departments')->truncate();
        \DB::table('colleges')->truncate();
        \DB::table('universities')->truncate();
        
        // Re-enable foreign key constraints
        \DB::statement('PRAGMA foreign_keys = ON');
        
        $this->command->info('✅ Existing data cleared');
        
        // Create Universities
        $universities = $this->createUniversities();
        
        // Create Colleges for each University
        $colleges = [];
        foreach ($universities as $university) {
            $colleges[$university->id] = $this->createColleges($university);
        }
        
        // Create Departments for each College
        $departments = [];
        foreach ($colleges as $universityId => $universityColleges) {
            foreach ($universityColleges as $college) {
                $departments[$college->id] = $this->createDepartments($college);
            }
        }
        
        // Create Users for each University/College/Department
        foreach ($universities as $university) {
            $this->createUniversityUsers($university, $colleges[$university->id] ?? [], $departments);
        }
        
        $this->command->info('');
        $this->command->info('🎉 ============================================');
        $this->command->info('🎉 Comprehensive Data Seeding Complete!');
        $this->command->info('🎉 ============================================');
        $this->command->info('');
        $this->displayLoginCredentials();
    }
    
    /**
     * Create universities
     */
    private function createUniversities(): array
    {
        $this->command->info('');
        $this->command->info('🏛️  Creating Universities...');
        
        $universitiesData = [
            [
                'name' => 'Massachusetts Institute of Technology',
                'slug' => 'mit',
                'domain' => 'mit.bitflow.edu',
                'email' => 'admin@mit.bitflow.edu',
                'phone' => '+1-617-253-1000',
                'address' => '77 Massachusetts Ave, Cambridge, MA 02139',
                'established_year' => 1861,
                'timezone' => 'America/New_York',
                'status' => 'active',
                'storage_quota_gb' => 500,
                'branding' => [
                    'logo_url' => '/images/mit-logo.png',
                    'primary_color' => '#A31F34',
                    'secondary_color' => '#8A8B8C',
                ],
                'settings' => [
                    'academic_year_start_month' => 'September',
                    'working_days' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    'class_start_time' => '08:00',
                    'class_end_time' => '18:00',
                ],
            ],
            [
                'name' => 'Stanford University',
                'slug' => 'stanford',
                'domain' => 'stanford.bitflow.edu',
                'email' => 'admin@stanford.bitflow.edu',
                'phone' => '+1-650-723-2300',
                'address' => '450 Serra Mall, Stanford, CA 94305',
                'established_year' => 1885,
                'timezone' => 'America/Los_Angeles',
                'status' => 'active',
                'storage_quota_gb' => 500,
                'branding' => [
                    'logo_url' => '/images/stanford-logo.png',
                    'primary_color' => '#8C1515',
                    'secondary_color' => '#4D4F53',
                ],
                'settings' => [
                    'academic_year_start_month' => 'September',
                    'working_days' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                    'class_start_time' => '08:30',
                    'class_end_time' => '17:30',
                ],
            ],
        ];
        
        $universities = [];
        foreach ($universitiesData as $data) {
            $university = University::create($data);
            $universities[] = $university;
            $this->command->info("  ✓ Created: {$university->name}");
        }
        
        return $universities;
    }
    
    /**
     * Create colleges for a university
     */
    private function createColleges(University $university): array
    {
        $this->command->info("  📚 Creating Colleges for {$university->name}...");
        
        $collegesData = [
            'mit' => [
                [
                    'name' => 'School of Engineering',
                    'code' => 'ENG',
                    'type' => 'Engineering',
                    'email' => 'engineering@mit.bitflow.edu',
                    'phone' => '+1-617-253-3291',
                    'address' => '77 Massachusetts Ave, Building 1, Cambridge, MA 02139',
                    'established_year' => 1932,
                    'status' => 'active',
                    'capacity' => 5000,
                ],
                [
                    'name' => 'School of Science',
                    'code' => 'SCI',
                    'type' => 'Science',
                    'email' => 'science@mit.bitflow.edu',
                    'phone' => '+1-617-253-2800',
                    'address' => '77 Massachusetts Ave, Building 4, Cambridge, MA 02139',
                    'established_year' => 1932,
                    'status' => 'active',
                    'capacity' => 3000,
                ],
                [
                    'name' => 'Sloan School of Management',
                    'code' => 'MGT',
                    'type' => 'Management',
                    'email' => 'sloan@mit.bitflow.edu',
                    'phone' => '+1-617-253-3730',
                    'address' => '100 Main Street, Cambridge, MA 02142',
                    'established_year' => 1914,
                    'status' => 'active',
                    'capacity' => 2000,
                ],
            ],
            'stanford' => [
                [
                    'name' => 'School of Engineering',
                    'code' => 'ENG',
                    'type' => 'Engineering',
                    'email' => 'engineering@stanford.bitflow.edu',
                    'phone' => '+1-650-723-2273',
                    'address' => 'Huang Engineering Center, Stanford, CA 94305',
                    'established_year' => 1925,
                    'status' => 'active',
                    'capacity' => 4500,
                ],
                [
                    'name' => 'School of Humanities and Sciences',
                    'code' => 'H&S',
                    'type' => 'Humanities',
                    'email' => 'humsci@stanford.bitflow.edu',
                    'phone' => '+1-650-723-2275',
                    'address' => 'Building 1, Stanford, CA 94305',
                    'established_year' => 1891,
                    'status' => 'active',
                    'capacity' => 3500,
                ],
            ],
        ];
        
        $colleges = [];
        $slug = $university->slug;
        
        if (isset($collegesData[$slug])) {
            foreach ($collegesData[$slug] as $data) {
                $data['university_id'] = $university->id;
                $college = College::create($data);
                $colleges[] = $college;
                $this->command->info("    ✓ {$college->name}");
            }
        }
        
        return $colleges;
    }
    
    /**
     * Create departments for a college
     */
    private function createDepartments(College $college): array
    {
        $this->command->info("    🏢 Creating Departments for {$college->name}...");
        
        // Map by college code instead of slug
        $collegeCodeMap = [
            'ENG' => 'engineering',
            'SCI' => 'science',
            'MGT' => 'management',
            'H&S' => 'humanities',
        ];
        
        $departmentsData = [
            'engineering' => [
                [
                    'name' => 'Computer Science',
                    'code' => 'CS',
                    'status' => 'active',
                ],
                [
                    'name' => 'Electrical Engineering',
                    'code' => 'EE',
                    'status' => 'active',
                ],
                [
                    'name' => 'Mechanical Engineering',
                    'code' => 'ME',
                    'status' => 'active',
                ],
                [
                    'name' => 'Civil Engineering',
                    'code' => 'CE',
                    'status' => 'active',
                ],
            ],
            'science' => [
                [
                    'name' => 'Physics',
                    'code' => 'PHY',
                    'status' => 'active',
                ],
                [
                    'name' => 'Chemistry',
                    'code' => 'CHEM',
                    'status' => 'active',
                ],
                [
                    'name' => 'Mathematics',
                    'code' => 'MATH',
                    'status' => 'active',
                ],
            ],
            'management' => [
                [
                    'name' => 'Business Administration',
                    'code' => 'BA',
                    'status' => 'active',
                ],
                [
                    'name' => 'Finance',
                    'code' => 'FIN',
                    'status' => 'active',
                ],
            ],
            'humanities' => [
                [
                    'name' => 'English Literature',
                    'code' => 'ENG',
                    'status' => 'active',
                ],
                [
                    'name' => 'History',
                    'code' => 'HIST',
                    'status' => 'active',
                ],
                [
                    'name' => 'Philosophy',
                    'code' => 'PHIL',
                    'status' => 'active',
                ],
            ],
        ];
        
        $departments = [];
        $categorySlug = $collegeCodeMap[$college->code] ?? null;
        
        if ($categorySlug && isset($departmentsData[$categorySlug])) {
            foreach ($departmentsData[$categorySlug] as $data) {
                $data['college_id'] = $college->id;
                $data['university_id'] = $college->university_id;
                $department = Department::create($data);
                $departments[] = $department;
                $this->command->info("      ✓ {$department->name} ({$department->code})");
            }
        }
        
        return $departments;
    }
    
    /**
     * Create users for a university
     */
    private function createUniversityUsers(University $university, array $colleges, array $allDepartments): void
    {
        $this->command->info("  👥 Creating Users for {$university->name}...");
        
        // Get roles
        $bitflowOwnerRole = Role::where('slug', 'bitflow_owner')->first();
        $universityOwnerRole = Role::where('slug', 'university_owner')->first();
        $superAdminRole = Role::where('slug', 'super_admin')->first();
        $principalRole = Role::where('slug', 'principal')->first();
        $collegeAdminRole = Role::where('slug', 'college_admin')->first();
        $facultyRole = Role::where('slug', 'faculty')->first();
        $studentRole = Role::where('slug', 'student')->first();
        $admissionAdminRole = Role::where('slug', 'admission_admin')->first();
        $accountsAdminRole = Role::where('slug', 'college_accounts_admin')->first();
        
        $shortName = $university->slug;  // Use the university slug (e.g., 'mit', 'stanford')
        
        // Use a numeric index based on university name for phone numbers
        $uniIndex = $university->slug === 'mit' ? 1 : 2;
        
        // 1. Bitflow Owner (only for first university)
        if ($university->id === University::first()->id) {
            $bitflowOwner = User::create([
                'university_id' => $university->id,
                'username' => 'bitflow_admin',
                'email' => 'admin@bitflow.app',
                'password' => Hash::make('Bitflow@2025'),
                'first_name' => 'Bitflow',
                'last_name' => 'Administrator',
                'phone' => '+1-555-0001',
                'status' => 'active',
                'email_verified_at' => now(),
            ]);
            if ($bitflowOwnerRole) {
                $bitflowOwner->roles()->attach($bitflowOwnerRole->id);
                $this->command->info("    ✓ Bitflow Owner (admin@bitflow.app)");
            }
        }
        
        // 2. University Owner
        $universityOwner = User::create([
            'university_id' => $university->id,
            'username' => "{$shortName}_owner",
            'email' => "owner@{$university->domain}",
            'password' => Hash::make('University@2025'),
            'first_name' => 'University',
            'last_name' => 'Owner',
            'phone' => '+1-555-' . str_pad($uniIndex * 100 + 10, 4, '0', STR_PAD_LEFT),
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
        if ($universityOwnerRole) {
            $universityOwner->roles()->attach($universityOwnerRole->id);
            $this->command->info("    ✓ University Owner (owner@{$university->domain})");
        }
        
        // 3. Super Admin
        $superAdmin = User::create([
            'university_id' => $university->id,
            'username' => "{$shortName}_superadmin",
            'email' => "superadmin@{$university->domain}",
            'password' => Hash::make('SuperAdmin@2025'),
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'phone' => '+1-555-' . str_pad($uniIndex * 100 + 20, 4, '0', STR_PAD_LEFT),
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
        if ($superAdminRole) {
            $superAdmin->roles()->attach($superAdminRole->id);
            $this->command->info("    ✓ Super Admin (superadmin@{$university->domain})");
        }
        
        // 4. College-level users
        foreach ($colleges as $index => $college) {
            $collegeShort = strtolower($college->code);
            $collegeNum = $index + 1;
            
            // Principal
            $principal = User::create([
                'university_id' => $university->id,
                'college_id' => $college->id,
                'username' => "{$shortName}_{$collegeShort}_principal",
                'email' => "principal.{$collegeShort}@{$university->domain}",
                'password' => Hash::make('Principal@2025'),
                'first_name' => 'Principal',
                'last_name' => $college->name,
                'phone' => '+1-555-' . str_pad(($uniIndex * 1000) + ($collegeNum * 100), 4, '0', STR_PAD_LEFT),
                'status' => 'active',
                'email_verified_at' => now(),
            ]);
            if ($principalRole) {
                $principal->roles()->attach($principalRole->id);
                $this->command->info("    ✓ Principal for {$college->name}");
            }
            
            // College Admin
            $collegeAdmin = User::create([
                'university_id' => $university->id,
                'college_id' => $college->id,
                'username' => "{$shortName}_{$collegeShort}_admin",
                'email' => "admin.{$collegeShort}@{$university->domain}",
                'password' => Hash::make('CollegeAdmin@2025'),
                'first_name' => 'College',
                'last_name' => 'Admin',
                'phone' => '+1-555-' . str_pad(($uniIndex * 1000) + ($collegeNum * 100) + 10, 4, '0', STR_PAD_LEFT),
                'status' => 'active',
                'email_verified_at' => now(),
            ]);
            if ($collegeAdminRole) {
                $collegeAdmin->roles()->attach($collegeAdminRole->id);
                $this->command->info("    ✓ College Admin for {$college->name}");
            }
            
            // Administrative Staff
            // Admission Admin
            $admissionAdmin = User::create([
                'university_id' => $university->id,
                'college_id' => $college->id,
                'username' => "{$shortName}_{$collegeShort}_admission",
                'email' => "admission.{$collegeShort}@{$university->domain}",
                'password' => Hash::make('Admission@2025'),
                'first_name' => 'Admission',
                'last_name' => 'Officer',
                'employee_id' => "ADM-{$shortName}-{$college->code}-001",
                'designation' => 'Admission Officer',
                'employee_type' => 'Administrative',
                'phone' => '+1-555-' . str_pad(($uniIndex * 1000) + ($collegeNum * 100) + 20, 4, '0', STR_PAD_LEFT),
                'status' => 'active',
                'email_verified_at' => now(),
            ]);
            if ($admissionAdminRole) {
                $admissionAdmin->roles()->attach($admissionAdminRole->id);
                $this->command->info("    ✓ Admission Admin for {$college->name}");
            }
            
            // Accounts Admin
            $accountsAdmin = User::create([
                'university_id' => $university->id,
                'college_id' => $college->id,
                'username' => "{$shortName}_{$collegeShort}_accounts",
                'email' => "accounts.{$collegeShort}@{$university->domain}",
                'password' => Hash::make('Accounts@2025'),
                'first_name' => 'Accounts',
                'last_name' => 'Manager',
                'employee_id' => "ACC-{$shortName}-{$college->code}-001",
                'designation' => 'Accounts Manager',
                'employee_type' => 'Administrative',
                'phone' => '+1-555-' . str_pad(($uniIndex * 1000) + ($collegeNum * 100) + 30, 4, '0', STR_PAD_LEFT),
                'status' => 'active',
                'email_verified_at' => now(),
            ]);
            if ($accountsAdminRole) {
                $accountsAdmin->roles()->attach($accountsAdminRole->id);
                $this->command->info("    ✓ Accounts Admin for {$college->name}");
            }
            
            // Department-level users
            $collegeDepartments = $allDepartments[$college->id] ?? [];
            foreach ($collegeDepartments as $deptIndex => $department) {
                $deptShort = strtolower($department->code);
                $deptNum = $deptIndex + 1;
                
                // Faculty (2 per department)
                for ($i = 1; $i <= 2; $i++) {
                    $employeeId = "FAC-{$shortName}-{$college->code}-{$department->code}-" . str_pad($i, 2, '0', STR_PAD_LEFT);
                    $facultyUser = User::create([
                        'university_id' => $university->id,
                        'college_id' => $college->id,
                        'department_id' => $department->id,
                        'username' => "{$shortName}_{$collegeShort}_{$deptShort}_faculty{$i}",
                        'email' => "faculty{$i}.{$deptShort}.{$collegeShort}@{$university->domain}",
                        'password' => Hash::make('Faculty@2025'),
                        'first_name' => "Faculty{$i}",
                        'last_name' => $department->name,
                        'employee_id' => $employeeId,
                        'designation' => $i === 1 ? 'Professor' : 'Assistant Professor',
                        'employee_type' => 'Faculty',
                        'phone' => '+1-555-' . str_pad(($uniIndex * 1000) + ($collegeNum * 100) + ($deptNum * 10) + $i, 4, '0', STR_PAD_LEFT),
                        'status' => 'active',
                        'email_verified_at' => now(),
                    ]);
                    
                    // Create faculty record
                    Faculty::create([
                        'user_id' => $facultyUser->id,
                        'university_id' => $university->id,
                        'college_id' => $college->id,
                        'department_id' => $department->id,
                        'employee_id' => $employeeId,
                        'designation' => $facultyUser->designation,
                        'qualification' => $i === 1 ? 'Ph.D.' : 'M.Tech',
                        'specialization' => $department->name,
                        'experience_years' => $i === 1 ? 10 : 3,
                        'employment_type' => 'full-time',
                        'joining_date' => now()->subYears($i === 1 ? 5 : 2)->format('Y-m-d'),
                        'status' => 'active',
                    ]);
                    
                    if ($facultyRole) {
                        $facultyUser->roles()->attach($facultyRole->id);
                    }
                }
                
                // Students (3 per department)
                for ($i = 1; $i <= 3; $i++) {
                    $studentUser = User::create([
                        'university_id' => $university->id,
                        'college_id' => $college->id,
                        'department_id' => $department->id,
                        'username' => "{$shortName}_{$collegeShort}_{$deptShort}_student{$i}",
                        'email' => "student{$i}.{$deptShort}.{$collegeShort}@{$university->domain}",
                        'password' => Hash::make('Student@2025'),
                        'first_name' => "Student{$i}",
                        'last_name' => $department->name,
                        'phone' => '+1-555-' . str_pad(($uniIndex * 10000) + ($collegeNum * 1000) + ($deptNum * 100) + $i, 4, '0', STR_PAD_LEFT),
                        'status' => 'active',
                        'email_verified_at' => now(),
                    ]);
                    
                    // Create student record
                    $admissionNumber = "2024{$shortName}{$college->code}{$department->code}" . str_pad($i, 3, '0', STR_PAD_LEFT);
                    $rollNumber = "{$college->code}/{$department->code}/2024/" . str_pad($i, 3, '0', STR_PAD_LEFT);
                    
                    Student::create([
                        'user_id' => $studentUser->id,
                        'university_id' => $university->id,
                        'college_id' => $college->id,
                        'department_id' => $department->id,
                        'admission_number' => $admissionNumber,
                        'admission_date' => now()->subMonths(6)->format('Y-m-d'),
                        'roll_number' => $rollNumber,
                        'year' => 1,
                        'section' => 'A',
                        'status' => 'active',
                    ]);
                    
                    if ($studentRole) {
                        $studentUser->roles()->attach($studentRole->id);
                    }
                }
                
                $this->command->info("      ✓ 2 Faculty + 3 Students for {$department->name}");
            }
        }
    }
    
    /**
     * Display login credentials
     */
    private function displayLoginCredentials(): void
    {
        $universities = University::all();
        
        $this->command->info('📋 Login Credentials:');
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('');
        $this->command->info('🔐 System Administrator:');
        $this->command->info('   Email: admin@bitflow.app');
        $this->command->info('   Password: Bitflow@2025');
        $this->command->info('   Role: Bitflow Owner (Full System Access)');
        $this->command->info('');
        
        foreach ($universities as $university) {
            $this->command->info("🏛️  {$university->name}:");
            $this->command->info("   University Owner: owner@{$university->domain} / University@2025");
            $this->command->info("   Super Admin: superadmin@{$university->domain} / SuperAdmin@2025");
            
            $colleges = College::where('university_id', $university->id)->get();
            foreach ($colleges as $college) {
                $collegeShort = strtolower(str_replace(' ', '', explode(' ', $college->name)[0]));
                $this->command->info("   📚 {$college->name}:");
                $this->command->info("      Principal: principal.{$collegeShort}@{$university->domain} / Principal@2025");
                $this->command->info("      College Admin: admin.{$collegeShort}@{$university->domain} / CollegeAdmin@2025");
                $this->command->info("      Admission Admin: admission.{$collegeShort}@{$university->domain} / Admission@2025");
                $this->command->info("      Accounts Admin: accounts.{$collegeShort}@{$university->domain} / Accounts@2025");
                
                $departments = Department::where('college_id', $college->id)->get();
                $this->command->info("      Departments: " . $departments->pluck('name')->join(', '));
            }
            $this->command->info('');
        }
        
        $this->command->info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->command->info('');
        $this->command->info('📊 Summary:');
        $this->command->info('   Universities: ' . University::count());
        $this->command->info('   Colleges: ' . College::count());
        $this->command->info('   Departments: ' . Department::count());
        $this->command->info('   Total Users: ' . User::count());
        $this->command->info('   - Faculty: ' . User::whereHas('roles', fn($q) => $q->where('slug', 'faculty'))->count());
        $this->command->info('   - Students: ' . User::whereHas('roles', fn($q) => $q->where('slug', 'student'))->count());
        $this->command->info('   - Staff: ' . User::whereHas('roles', fn($q) => $q->whereIn('slug', ['admission_admin', 'college_accounts_admin']))->count());
        $this->command->info('');
    }
}
