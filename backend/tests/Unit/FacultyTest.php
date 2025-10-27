<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Faculty;
use App\Models\User;
use App\Models\University;
use App\Models\College;
use App\Models\Department;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\QueryException;

class FacultyTest extends TestCase
{
    use RefreshDatabase;

    protected University $university;
    protected College $college;
    protected Department $department;
    protected User $user;
    protected Faculty $faculty;

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
            'description' => 'Computer Science Department',
            'status' => 'active',
        ]);

        // Create test user
        $this->user = User::create([
            'university_id' => $this->university->id,
            'first_name' => 'Dr. John',
            'last_name' => 'Smith',
            'email' => 'john.smith@testuni.edu',
            'phone' => '+1234567892',
            'password' => bcrypt('password'),
            'role' => 'faculty',
            'status' => 'active',
        ]);

        // Create test faculty
        $this->faculty = Faculty::create([
            'user_id' => $this->user->id,
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'department_id' => $this->department->id,
            'employee_id' => 'EMP001',
            'designation' => 'Professor',
            'qualification' => 'Ph.D. Computer Science',
            'specialization' => 'Artificial Intelligence',
            'experience_years' => 15,
            'employment_type' => 'permanent',
            'joining_date' => '2010-08-15',
            'salary' => 75000.00,
            'status' => 'active',
        ]);
    }

    public function test_faculty_belongs_to_user(): void
    {
        $this->assertInstanceOf(User::class, $this->faculty->user);
        $this->assertEquals($this->user->id, $this->faculty->user->id);
    }

    public function test_faculty_belongs_to_university(): void
    {
        $this->assertInstanceOf(University::class, $this->faculty->university);
        $this->assertEquals($this->university->id, $this->faculty->university->id);
    }

    public function test_faculty_belongs_to_college(): void
    {
        $this->assertInstanceOf(College::class, $this->faculty->college);
        $this->assertEquals($this->college->id, $this->faculty->college->id);
    }

    public function test_faculty_belongs_to_department(): void
    {
        $this->assertInstanceOf(Department::class, $this->faculty->department);
        $this->assertEquals($this->department->id, $this->faculty->department->id);
    }

    public function test_faculty_can_be_head_of_departments(): void
    {
        // Assign faculty as HOD
        $this->department->update(['head_faculty_id' => $this->faculty->id]);

        $this->assertEquals(1, $this->faculty->headOfDepartments()->count());
        $this->assertEquals($this->department->id, $this->faculty->headOfDepartments->first()->id);
    }

    public function test_faculty_active_scope(): void
    {
        // Create faculty on leave
        Faculty::create([
            'user_id' => User::create([
                'university_id' => $this->university->id,
                'first_name' => 'Dr. Jane',
                'last_name' => 'Doe',
                'email' => 'jane.doe@testuni.edu',
                'password' => bcrypt('password'),
                'role' => 'faculty',
                'status' => 'active',
            ])->id,
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'department_id' => $this->department->id,
            'employee_id' => 'EMP002',
            'designation' => 'Assistant Professor',
            'qualification' => 'M.Tech',
            'experience_years' => 5,
            'employment_type' => 'permanent',
            'joining_date' => '2019-08-15',
            'status' => 'on_leave',
        ]);

        $activeFaculty = Faculty::active()->get();
        $this->assertEquals(1, $activeFaculty->count());
        $this->assertEquals('active', $activeFaculty->first()->status);
    }

    public function test_faculty_on_leave_scope(): void
    {
        // Create faculty on leave
        $leaveFaculty = Faculty::create([
            'user_id' => User::create([
                'university_id' => $this->university->id,
                'first_name' => 'Dr. Bob',
                'last_name' => 'Johnson',
                'email' => 'bob.johnson@testuni.edu',
                'password' => bcrypt('password'),
                'role' => 'faculty',
                'status' => 'active',
            ])->id,
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'department_id' => $this->department->id,
            'employee_id' => 'EMP003',
            'designation' => 'Lecturer',
            'qualification' => 'M.Sc',
            'experience_years' => 3,
            'employment_type' => 'contract',
            'joining_date' => '2021-08-15',
            'status' => 'on_leave',
        ]);

        $onLeaveFaculty = Faculty::onLeave()->get();
        $this->assertEquals(1, $onLeaveFaculty->count());
        $this->assertEquals($leaveFaculty->id, $onLeaveFaculty->first()->id);
    }

    public function test_faculty_designation_scope(): void
    {
        // Create another faculty with different designation
        Faculty::create([
            'user_id' => User::create([
                'university_id' => $this->university->id,
                'first_name' => 'Dr. Alice',
                'last_name' => 'Williams',
                'email' => 'alice.williams@testuni.edu',
                'password' => bcrypt('password'),
                'role' => 'faculty',
                'status' => 'active',
            ])->id,
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'department_id' => $this->department->id,
            'employee_id' => 'EMP004',
            'designation' => 'Associate Professor',
            'qualification' => 'Ph.D.',
            'experience_years' => 10,
            'employment_type' => 'permanent',
            'joining_date' => '2014-08-15',
            'status' => 'active',
        ]);

        $professors = Faculty::designation('Professor')->get();
        $this->assertEquals(1, $professors->count());
        $this->assertEquals('Professor', $professors->first()->designation);
    }

    public function test_faculty_for_college_scope(): void
    {
        // Create another college
        $otherCollege = College::create([
            'university_id' => $this->university->id,
            'name' => 'Other College',
            'code' => 'OC001',
            'type' => 'autonomous',
            'email' => 'info@othercollege.edu',
            'phone' => '+1234567899',
            'established_year' => 2005,
            'status' => 'active',
        ]);

        // Create faculty in other college
        Faculty::create([
            'user_id' => User::create([
                'university_id' => $this->university->id,
                'first_name' => 'Dr. Charlie',
                'last_name' => 'Brown',
                'email' => 'charlie.brown@testuni.edu',
                'password' => bcrypt('password'),
                'role' => 'faculty',
                'status' => 'active',
            ])->id,
            'university_id' => $this->university->id,
            'college_id' => $otherCollege->id,
            'department_id' => $this->department->id,
            'employee_id' => 'EMP005',
            'designation' => 'Lecturer',
            'qualification' => 'M.Tech',
            'experience_years' => 2,
            'employment_type' => 'contract',
            'joining_date' => '2022-08-15',
            'status' => 'active',
        ]);

        $collegeFaculty = Faculty::forCollege($this->college->id)->get();
        $this->assertEquals(1, $collegeFaculty->count());
        $this->assertEquals($this->college->id, $collegeFaculty->first()->college_id);
    }

    public function test_faculty_for_department_scope(): void
    {
        // Create another department
        $otherDepartment = Department::create([
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'name' => 'Mechanical Engineering',
            'code' => 'ME',
            'description' => 'Mechanical Engineering Department',
            'status' => 'active',
        ]);

        // Create faculty in other department
        Faculty::create([
            'user_id' => User::create([
                'university_id' => $this->university->id,
                'first_name' => 'Dr. Diana',
                'last_name' => 'Prince',
                'email' => 'diana.prince@testuni.edu',
                'password' => bcrypt('password'),
                'role' => 'faculty',
                'status' => 'active',
            ])->id,
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'department_id' => $otherDepartment->id,
            'employee_id' => 'EMP006',
            'designation' => 'Professor',
            'qualification' => 'Ph.D.',
            'experience_years' => 20,
            'employment_type' => 'permanent',
            'joining_date' => '2005-08-15',
            'status' => 'active',
        ]);

        $departmentFaculty = Faculty::forDepartment($this->department->id)->get();
        $this->assertEquals(1, $departmentFaculty->count());
        $this->assertEquals($this->department->id, $departmentFaculty->first()->department_id);
    }

    public function test_faculty_employee_id_is_unique_per_university(): void
    {
        $this->expectException(QueryException::class);

        // Try to create faculty with duplicate employee ID
        Faculty::create([
            'user_id' => User::create([
                'university_id' => $this->university->id,
                'first_name' => 'Duplicate',
                'last_name' => 'Faculty',
                'email' => 'duplicate@testuni.edu',
                'password' => bcrypt('password'),
                'role' => 'faculty',
                'status' => 'active',
            ])->id,
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'department_id' => $this->department->id,
            'employee_id' => 'EMP001', // Duplicate
            'designation' => 'Lecturer',
            'qualification' => 'M.Tech',
            'experience_years' => 1,
            'employment_type' => 'contract',
            'joining_date' => '2024-08-15',
            'status' => 'active',
        ]);
    }

    public function test_faculty_soft_deletes(): void
    {
        $facultyId = $this->faculty->id;
        
        $this->faculty->delete();
        
        $this->assertSoftDeleted('faculty', ['id' => $facultyId]);
        $this->assertNotNull(Faculty::withTrashed()->find($facultyId)->deleted_at);
    }

    public function test_faculty_is_department_head_method(): void
    {
        // Initially not a department head
        $this->assertFalse($this->faculty->isDepartmentHead());

        // Assign as HOD
        $this->department->update(['head_faculty_id' => $this->faculty->id]);
        
        // Refresh faculty instance
        $this->faculty->refresh();
        
        // Now should be department head
        $this->assertTrue($this->faculty->isDepartmentHead());
    }

    public function test_faculty_years_of_service_attribute(): void
    {
        // Faculty joined in 2010, so should have ~14-15 years of service in 2024-2025
        $yearsOfService = $this->faculty->years_of_service;
        
        $this->assertGreaterThanOrEqual(14, $yearsOfService);
        $this->assertLessThanOrEqual(16, $yearsOfService);
    }

    public function test_faculty_name_attribute_from_user(): void
    {
        $this->assertEquals('Dr. John Smith', $this->faculty->name);
    }

    public function test_faculty_email_attribute_from_user(): void
    {
        $this->assertEquals('john.smith@testuni.edu', $this->faculty->email);
    }

    public function test_faculty_phone_attribute_from_user(): void
    {
        $this->assertEquals('+1234567892', $this->faculty->phone);
    }

    public function test_faculty_salary_is_hidden(): void
    {
        $facultyArray = $this->faculty->toArray();
        
        $this->assertArrayNotHasKey('salary', $facultyArray);
    }
}
