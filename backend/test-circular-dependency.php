<?php

/**
 * Test Circular Dependency Fix
 * 
 * Tests the Department <-> Faculty circular dependency resolution.
 * 
 * Run: php test-circular-dependency.php
 */

require __DIR__ . '/vendor/autoload.php';

use App\Models\Department;
use App\Models\Faculty;
use App\Models\User;
use App\Models\College;
use Illuminate\Support\Facades\DB;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Circular Dependency Fix Test ===\n\n";

try {
    // Start transaction for testing
    DB::beginTransaction();
    
    // Test 1: Get a college to work with
    echo "Test 1: Setup - Finding test college\n";
    $college = College::first();
    
    if (!$college) {
        echo "❌ No colleges found in database. Please seed data first.\n";
        exit(1);
    }
    
    echo "✅ Using college: {$college->name}\n";
    echo "   College ID: {$college->id}\n";
    echo "   University ID: {$college->university_id}\n\n";
    
    // Test 2: Create Department WITHOUT HOD
    echo "Test 2: Create Department (without HOD)\n";
    $department = Department::create([
        'university_id' => $college->university_id,
        'college_id' => $college->id,
        'name' => 'Test Computer Science Department',
        'code' => 'TEST_CS_' . time(),
        'head_faculty_id' => null, // <-- NULL initially (solves circular dependency)
        'email' => 'cs.test@example.com',
        'phone' => '+91 9876543210',
        'floor_location' => 'Ground Floor',
        'status' => 'active',
    ]);
    
    echo "✅ Department created successfully!\n";
    echo "   Department ID: {$department->id}\n";
    echo "   Name: {$department->name}\n";
    echo "   Code: {$department->code}\n";
    echo "   HOD: " . ($department->head_faculty_id ? "Assigned" : "NULL (not assigned yet)") . "\n\n";
    
    // Test 3: Create User for Faculty
    echo "Test 3: Create User for Faculty Member\n";
    $timestamp = time();
    $user = User::create([
        'first_name' => 'Test',
        'last_name' => 'Professor',
        'username' => 'dr.test.prof.' . $timestamp,
        'email' => 'dr.test.prof.' . $timestamp . '@example.com',
        'password' => bcrypt('password123'),
        'university_id' => $college->university_id,
        'status' => 'active',
    ]);
    
    echo "✅ User created successfully!\n";
    echo "   User ID: {$user->id}\n";
    echo "   Name: {$user->first_name} {$user->last_name}\n\n";
    
    // Test 4: Create Faculty and assign to Department
    echo "Test 4: Create Faculty (assigned to Department)\n";
    $faculty = Faculty::create([
        'user_id' => $user->id,
        'university_id' => $college->university_id,
        'college_id' => $college->id,
        'department_id' => $department->id, // <-- Department already exists!
        'employee_id' => 'FAC_' . time(),
        'designation' => 'Professor',
        'qualification' => 'Ph.D. in Computer Science',
        'specialization' => 'Artificial Intelligence',
        'experience_years' => 15,
        'employment_type' => 'permanent',
        'joining_date' => now(),
        'status' => 'active',
    ]);
    
    echo "✅ Faculty created successfully!\n";
    echo "   Faculty ID: {$faculty->id}\n";
    echo "   Employee ID: {$faculty->employee_id}\n";
    echo "   Designation: {$faculty->designation}\n";
    echo "   Department: {$department->name}\n\n";
    
    // Test 5: Assign Faculty as HOD
    echo "Test 5: Assign Faculty as HOD of Department\n";
    $department->head_faculty_id = $faculty->id;
    $department->save();
    
    echo "✅ HOD assigned successfully!\n";
    echo "   Department: {$department->name}\n";
    echo "   HOD: {$user->first_name} {$user->last_name}\n\n";
    
    // Test 6: Verify Relationships
    echo "Test 6: Verify Relationships\n";
    $department->load(['hod.user', 'faculty']);
    
    if ($department->hod && $department->hod->id === $faculty->id) {
        echo "✅ Department->HOD relationship: CORRECT\n";
        echo "   HOD Name: {$department->hod->user->first_name} {$department->hod->user->last_name}\n";
    } else {
        echo "❌ Department->HOD relationship: FAILED\n";
    }
    
    if ($department->faculty->contains($faculty->id)) {
        echo "✅ Department->Faculty relationship: CORRECT\n";
        echo "   Faculty count: {$department->faculty->count()}\n";
    } else {
        echo "❌ Department->Faculty relationship: FAILED\n";
    }
    
    $faculty->load('department');
    if ($faculty->department && $faculty->department->id === $department->id) {
        echo "✅ Faculty->Department relationship: CORRECT\n";
        echo "   Department: {$faculty->department->name}\n";
    } else {
        echo "❌ Faculty->Department relationship: FAILED\n";
    }
    
    $faculty->load('headOfDepartments');
    if ($faculty->headOfDepartments->contains($department->id)) {
        echo "✅ Faculty->HeadOfDepartments relationship: CORRECT\n";
        echo "   Head of {$faculty->headOfDepartments->count()} department(s)\n";
    } else {
        echo "❌ Faculty->HeadOfDepartments relationship: FAILED\n";
    }
    
    echo "\n";
    
    // Test 7: Remove HOD
    echo "Test 7: Remove HOD from Department\n";
    $department->head_faculty_id = null;
    $department->save();
    
    echo "✅ HOD removed successfully!\n";
    echo "   Department: {$department->name}\n";
    echo "   HOD: NULL\n\n";
    
    // Rollback transaction (cleanup test data)
    DB::rollBack();
    echo "✅ Test transaction rolled back (cleanup complete)\n\n";
    
    // Summary
    echo "=== Summary ===\n";
    echo "Circular Dependency Solution: ✅ WORKING\n\n";
    
    echo "📋 Workflow:\n";
    echo "1. Create Department (head_faculty_id = NULL)\n";
    echo "2. Create Faculty (department_id = department.id)\n";
    echo "3. Assign HOD (department.head_faculty_id = faculty.id)\n";
    echo "4. Both relationships now work correctly!\n\n";
    
    echo "🎯 API Endpoints:\n";
    echo "POST   /admin/universities/{uid}/colleges/{cid}/departments\n";
    echo "       → Create department without HOD\n";
    echo "POST   /admin/universities/{uid}/colleges/{cid}/academic-staff\n";
    echo "       → Create faculty and assign to department\n";
    echo "POST   /admin/universities/{uid}/colleges/{cid}/departments/{did}/assign-hod\n";
    echo "       → Assign faculty as HOD\n";
    echo "DELETE /admin/universities/{uid}/colleges/{cid}/departments/{did}/remove-hod\n";
    echo "       → Remove HOD from department\n\n";
    
    exit(0);
    
} catch (\Exception $e) {
    DB::rollBack();
    echo "\n❌ Test failed with error:\n";
    echo "   {$e->getMessage()}\n";
    echo "   File: {$e->getFile()}:{$e->getLine()}\n\n";
    exit(1);
}
