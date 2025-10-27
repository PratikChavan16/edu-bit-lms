<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Student;
use App\Models\User;
use App\Models\University;
use App\Models\College;
use App\Models\Department;
use App\Models\Enrollment;
use App\Models\Attendance;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Database\QueryException;

class StudentTest extends TestCase
{
    use RefreshDatabase;

    protected University $university;
    protected College $college;
    protected Department $department;
    protected User $user;
    protected Student $student;

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
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@testuni.edu',
            'password' => bcrypt('password'),
            'role' => 'student',
            'status' => 'active',
        ]);

        // Create test student
        $this->student = Student::create([
            'user_id' => $this->user->id,
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'department_id' => $this->department->id,
            'admission_number' => 'ADM001',
            'admission_date' => '2024-01-15',
            'course' => 'B.Tech Computer Science',
            'year' => 1,
            'section' => 'A',
            'roll_number' => 'CS001',
            'blood_group' => 'O+',
            'date_of_birth' => '2005-06-10',
            'gender' => 'male',
            'nationality' => 'Indian',
            'guardian_name' => 'Jane Doe',
            'guardian_phone' => '+1234567892',
            'guardian_email' => 'jane.doe@example.com',
            'guardian_relation' => 'mother',
            'status' => 'active',
        ]);
    }

    public function test_student_belongs_to_user(): void
    {
        $this->assertInstanceOf(User::class, $this->student->user);
        $this->assertEquals($this->user->id, $this->student->user->id);
    }

    public function test_student_belongs_to_university(): void
    {
        $this->assertInstanceOf(University::class, $this->student->university);
        $this->assertEquals($this->university->id, $this->student->university->id);
    }

    public function test_student_belongs_to_college(): void
    {
        $this->assertInstanceOf(College::class, $this->student->college);
        $this->assertEquals($this->college->id, $this->student->college->id);
    }

    public function test_student_belongs_to_department(): void
    {
        $this->assertInstanceOf(Department::class, $this->student->department);
        $this->assertEquals($this->department->id, $this->student->department->id);
    }

    public function test_student_has_many_enrollments(): void
    {
        // Create test enrollment
        $enrollment = Enrollment::create([
            'student_id' => $this->student->id,
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'department_id' => $this->department->id,
            'academic_year' => '2024-2025',
            'semester' => 1,
            'status' => 'active',
        ]);

        $this->assertEquals(1, $this->student->enrollments()->count());
        $this->assertEquals($enrollment->id, $this->student->enrollments->first()->id);
    }

    public function test_student_has_active_enrollments(): void
    {
        // Create active enrollment
        Enrollment::create([
            'student_id' => $this->student->id,
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'department_id' => $this->department->id,
            'academic_year' => '2024-2025',
            'semester' => 1,
            'status' => 'active',
        ]);

        // Create inactive enrollment
        Enrollment::create([
            'student_id' => $this->student->id,
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'department_id' => $this->department->id,
            'academic_year' => '2023-2024',
            'semester' => 2,
            'status' => 'completed',
        ]);

        $this->assertEquals(1, $this->student->activeEnrollments()->count());
        $this->assertEquals('active', $this->student->activeEnrollments->first()->status);
    }

    public function test_student_has_many_attendance_records(): void
    {
        // Create test attendance record
        $attendance = Attendance::create([
            'student_id' => $this->student->id,
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'department_id' => $this->department->id,
            'date' => '2024-10-27',
            'status' => 'present',
        ]);

        $this->assertEquals(1, $this->student->attendance()->count());
        $this->assertEquals($attendance->id, $this->student->attendance->first()->id);
    }

    public function test_student_active_scope(): void
    {
        // Create suspended student
        Student::create([
            'user_id' => User::create([
                'university_id' => $this->university->id,
                'first_name' => 'Jane',
                'last_name' => 'Smith',
                'email' => 'jane.smith@testuni.edu',
                'password' => bcrypt('password'),
                'role' => 'student',
                'status' => 'active',
            ])->id,
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'department_id' => $this->department->id,
            'admission_number' => 'ADM002',
            'admission_date' => '2024-01-15',
            'course' => 'B.Tech Computer Science',
            'year' => 1,
            'status' => 'suspended',
        ]);

        $activeStudents = Student::active()->get();
        $this->assertEquals(1, $activeStudents->count());
        $this->assertEquals('active', $activeStudents->first()->status);
    }

    public function test_student_suspended_scope(): void
    {
        // Create suspended student
        $suspendedStudent = Student::create([
            'user_id' => User::create([
                'university_id' => $this->university->id,
                'first_name' => 'Bob',
                'last_name' => 'Johnson',
                'email' => 'bob.johnson@testuni.edu',
                'password' => bcrypt('password'),
                'role' => 'student',
                'status' => 'active',
            ])->id,
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'department_id' => $this->department->id,
            'admission_number' => 'ADM003',
            'admission_date' => '2024-01-15',
            'course' => 'B.Tech Computer Science',
            'year' => 1,
            'status' => 'suspended',
        ]);

        $suspendedStudents = Student::suspended()->get();
        $this->assertEquals(1, $suspendedStudents->count());
        $this->assertEquals($suspendedStudent->id, $suspendedStudents->first()->id);
    }

    public function test_student_graduated_scope(): void
    {
        // Create graduated student
        $graduatedStudent = Student::create([
            'user_id' => User::create([
                'university_id' => $this->university->id,
                'first_name' => 'Alice',
                'last_name' => 'Williams',
                'email' => 'alice.williams@testuni.edu',
                'password' => bcrypt('password'),
                'role' => 'student',
                'status' => 'active',
            ])->id,
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'department_id' => $this->department->id,
            'admission_number' => 'ADM004',
            'admission_date' => '2020-01-15',
            'course' => 'B.Tech Computer Science',
            'year' => 4,
            'status' => 'graduated',
        ]);

        $graduatedStudents = Student::graduated()->get();
        $this->assertEquals(1, $graduatedStudents->count());
        $this->assertEquals($graduatedStudent->id, $graduatedStudents->first()->id);
    }

    public function test_student_year_scope(): void
    {
        // Create second year student
        Student::create([
            'user_id' => User::create([
                'university_id' => $this->university->id,
                'first_name' => 'Charlie',
                'last_name' => 'Brown',
                'email' => 'charlie.brown@testuni.edu',
                'password' => bcrypt('password'),
                'role' => 'student',
                'status' => 'active',
            ])->id,
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'department_id' => $this->department->id,
            'admission_number' => 'ADM005',
            'admission_date' => '2023-01-15',
            'course' => 'B.Tech Computer Science',
            'year' => 2,
            'status' => 'active',
        ]);

        $firstYearStudents = Student::year(1)->get();
        $this->assertEquals(1, $firstYearStudents->count());
        $this->assertEquals(1, $firstYearStudents->first()->year);
    }

    public function test_student_for_college_scope(): void
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

        // Create student in other college
        Student::create([
            'user_id' => User::create([
                'university_id' => $this->university->id,
                'first_name' => 'Diana',
                'last_name' => 'Prince',
                'email' => 'diana.prince@testuni.edu',
                'password' => bcrypt('password'),
                'role' => 'student',
                'status' => 'active',
            ])->id,
            'university_id' => $this->university->id,
            'college_id' => $otherCollege->id,
            'department_id' => $this->department->id,
            'admission_number' => 'ADM006',
            'admission_date' => '2024-01-15',
            'course' => 'B.Tech Computer Science',
            'year' => 1,
            'status' => 'active',
        ]);

        $collegeStudents = Student::forCollege($this->college->id)->get();
        $this->assertEquals(1, $collegeStudents->count());
        $this->assertEquals($this->college->id, $collegeStudents->first()->college_id);
    }

    public function test_student_admission_number_is_unique_per_university(): void
    {
        $this->expectException(QueryException::class);

        // Try to create student with duplicate admission number
        Student::create([
            'user_id' => User::create([
                'university_id' => $this->university->id,
                'first_name' => 'Duplicate',
                'last_name' => 'Student',
                'email' => 'duplicate@testuni.edu',
                'password' => bcrypt('password'),
                'role' => 'student',
                'status' => 'active',
            ])->id,
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'department_id' => $this->department->id,
            'admission_number' => 'ADM001', // Duplicate
            'admission_date' => '2024-01-15',
            'course' => 'B.Tech Computer Science',
            'year' => 1,
            'status' => 'active',
        ]);
    }

    public function test_student_soft_deletes(): void
    {
        $studentId = $this->student->id;
        
        $this->student->delete();
        
        $this->assertSoftDeleted('students', ['id' => $studentId]);
        $this->assertNotNull(Student::withTrashed()->find($studentId)->deleted_at);
    }
}
