<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\University;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the demo university
        $university = University::where('slug', 'demo-university')->first();

        if (!$university) {
            $this->command->error('Demo university not found. Run UniversitySeeder first.');
            return;
        }

        // Create Bitflow Owner (System Super Admin)
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

        $bitflowOwnerRole = Role::where('slug', 'bitflow_owner')->first();
        if ($bitflowOwnerRole) {
            $bitflowOwner->roles()->attach($bitflowOwnerRole->id);
            $this->command->info("Created Bitflow Owner: admin@bitflow.app / Bitflow@2025");
        }

        // Create University Owner
        $universityOwner = User::create([
            'university_id' => $university->id,
            'username' => 'university_owner',
            'email' => 'owner@demo.bitflow.edu',
            'password' => Hash::make('University@2025'),
            'first_name' => 'University',
            'last_name' => 'Owner',
            'phone' => '+1-555-0002',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        $universityOwnerRole = Role::where('slug', 'university_owner')->first();
        if ($universityOwnerRole) {
            $universityOwner->roles()->attach($universityOwnerRole->id);
            $this->command->info("Created University Owner: owner@demo.bitflow.edu / University@2025");
        }

        // Create Super Admin
        $superAdmin = User::create([
            'university_id' => $university->id,
            'username' => 'super_admin',
            'email' => 'superadmin@demo.bitflow.edu',
            'password' => Hash::make('SuperAdmin@2025'),
            'first_name' => 'Super',
            'last_name' => 'Admin',
            'phone' => '+1-555-0003',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        $superAdminRole = Role::where('slug', 'super_admin')->first();
        if ($superAdminRole) {
            $superAdmin->roles()->attach($superAdminRole->id);
            $this->command->info("Created Super Admin: superadmin@demo.bitflow.edu / SuperAdmin@2025");
        }

        // Create test faculty user
        $faculty = User::create([
            'university_id' => $university->id,
            'username' => 'faculty_test',
            'email' => 'faculty@demo.bitflow.edu',
            'password' => Hash::make('Faculty@2025'),
            'first_name' => 'Test',
            'last_name' => 'Faculty',
            'phone' => '+1-555-0004',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        $facultyRole = Role::where('slug', 'faculty')->first();
        if ($facultyRole) {
            $faculty->roles()->attach($facultyRole->id);
            $this->command->info("Created Faculty: faculty@demo.bitflow.edu / Faculty@2025");
        }

        // Create test student user
        $student = User::create([
            'university_id' => $university->id,
            'username' => 'student_test',
            'email' => 'student@demo.bitflow.edu',
            'password' => Hash::make('Student@2025'),
            'first_name' => 'Test',
            'last_name' => 'Student',
            'phone' => '+1-555-0005',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        $studentRole = Role::where('slug', 'student')->first();
        if ($studentRole) {
            $student->roles()->attach($studentRole->id);
            $this->command->info("Created Student: student@demo.bitflow.edu / Student@2025");
        }

        $this->command->info("\n=== Test Credentials Created ===");
        $this->command->info("Bitflow Owner: admin@bitflow.app / Bitflow@2025");
        $this->command->info("University Owner: owner@demo.bitflow.edu / University@2025");
        $this->command->info("Super Admin: superadmin@demo.bitflow.edu / SuperAdmin@2025");
        $this->command->info("Faculty: faculty@demo.bitflow.edu / Faculty@2025");
        $this->command->info("Student: student@demo.bitflow.edu / Student@2025");
    }
}
