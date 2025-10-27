<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Department;
use App\Models\University;
use App\Models\College;
use App\Models\Faculty;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DepartmentTest extends TestCase
{
    use RefreshDatabase;

    protected University $university;
    protected College $college;
    protected Department $department;

    protected function setUp(): void
    {
        parent::setUp();

        // Create test university
        $this->university = University::create([
            'name' => 'Test University',
            'slug' => 'test-university',
            'domain' => 'testuni.edu',
            'email' => 'admin@testuni.edu',
            'phone' => '+1234567890',
            'status' => 'active',
        ]);

        // Create test college
        $this->college = College::create([
            'university_id' => $this->university->id,
            'name' => 'Test College',
            'code' => 'TC001',
            'type' => 'autonomous',
            'email' => 'info@testcollege.edu',
            'phone' => '+1234567891',
            'established_year' => 2000,
            'status' => 'active',
        ]);

        // Create test department
        $this->department = Department::create([
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'name' => 'Computer Science',
            'code' => 'CS',
            'status' => 'active',
        ]);
    }

    public function test_department_belongs_to_university()
    {
        $this->assertInstanceOf(University::class, $this->department->university);
        $this->assertEquals($this->university->id, $this->department->university->id);
    }

    public function test_department_belongs_to_college()
    {
        $this->assertInstanceOf(College::class, $this->department->college);
        $this->assertEquals($this->college->id, $this->department->college->id);
    }

    public function test_department_has_many_students()
    {
        // Create test user
        $user = User::create([
            'name' => 'Test Student',
            'email' => 'student@test.com',
            'password' => bcrypt('password'),
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'role' => 'student',
            'status' => 'active',
        ]);

        // Create student
        $student = Student::create([
            'user_id' => $user->id,
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'department_id' => $this->department->id,
            'admission_number' => 'ADM001',
            'admission_date' => now(),
            'course' => 'B.Tech Computer Science',
            'year' => 1,
            'status' => 'active',
        ]);

        $this->assertCount(1, $this->department->students);
        $this->assertEquals($student->id, $this->department->students->first()->id);
    }

    public function test_department_has_many_faculty()
    {
        // Create test user
        $user = User::create([
            'name' => 'Test Faculty',
            'email' => 'faculty@test.com',
            'password' => bcrypt('password'),
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'role' => 'faculty',
            'status' => 'active',
        ]);

        // Create faculty
        $faculty = Faculty::create([
            'user_id' => $user->id,
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'department_id' => $this->department->id,
            'employee_id' => 'EMP001',
            'designation' => 'Professor',
            'employment_type' => 'full-time',
            'joining_date' => now(),
            'status' => 'active',
        ]);

        $this->assertCount(1, $this->department->faculty);
        $this->assertEquals($faculty->id, $this->department->faculty->first()->id);
    }

    public function test_department_can_have_hod()
    {
        // Create HOD user
        $user = User::create([
            'name' => 'HOD',
            'email' => 'hod@test.com',
            'password' => bcrypt('password'),
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'role' => 'faculty',
            'status' => 'active',
        ]);

        // Create faculty
        $faculty = Faculty::create([
            'user_id' => $user->id,
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'department_id' => $this->department->id,
            'employee_id' => 'EMP002',
            'designation' => 'Professor',
            'employment_type' => 'full-time',
            'joining_date' => now(),
            'status' => 'active',
        ]);

        // Assign HOD
        $this->department->update(['head_faculty_id' => $faculty->id]);

        $this->assertInstanceOf(Faculty::class, $this->department->hod);
        $this->assertEquals($faculty->id, $this->department->hod->id);
    }

    public function test_department_active_scope()
    {
        // Create inactive department
        Department::create([
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'name' => 'Inactive Department',
            'code' => 'ID',
            'status' => 'inactive',
        ]);

        $activeDepartments = Department::active()->get();
        
        $this->assertCount(1, $activeDepartments);
        $this->assertEquals('active', $activeDepartments->first()->status);
    }

    public function test_department_inactive_scope()
    {
        // Create inactive department
        Department::create([
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'name' => 'Inactive Department',
            'code' => 'ID',
            'status' => 'inactive',
        ]);

        $inactiveDepartments = Department::inactive()->get();
        
        $this->assertCount(1, $inactiveDepartments);
        $this->assertEquals('inactive', $inactiveDepartments->first()->status);
    }

    public function test_department_for_college_scope()
    {
        // Create another college
        $otherCollege = College::create([
            'university_id' => $this->university->id,
            'name' => 'Other College',
            'code' => 'OC001',
            'type' => 'autonomous',
            'email' => 'info@othercollege.edu',
            'phone' => '+1234567892',
            'established_year' => 2000,
            'status' => 'active',
        ]);

        // Create department in other college
        Department::create([
            'university_id' => $this->university->id,
            'college_id' => $otherCollege->id,
            'name' => 'Other Department',
            'code' => 'OD',
            'status' => 'active',
        ]);

        $collegeDepartments = Department::forCollege($this->college->id)->get();
        
        $this->assertCount(1, $collegeDepartments);
        $this->assertEquals($this->college->id, $collegeDepartments->first()->college_id);
    }

    public function test_department_code_is_unique_per_college()
    {
        $this->expectException(\Illuminate\Database\QueryException::class);

        // Try to create department with same code in same college
        Department::create([
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'name' => 'Duplicate Department',
            'code' => 'CS', // Same as existing department
            'status' => 'active',
        ]);
    }

    public function test_department_soft_deletes()
    {
        $departmentId = $this->department->id;
        
        $this->department->delete();
        
        $this->assertSoftDeleted('departments', ['id' => $departmentId]);
        
        // Can still find with trashed
        $deleted = Department::withTrashed()->find($departmentId);
        $this->assertNotNull($deleted);
        $this->assertNotNull($deleted->deleted_at);
    }
}
