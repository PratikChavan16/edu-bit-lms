<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\University;
use App\Models\College;
use App\Models\Department;
use App\Models\Student;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\AcademicYear;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class ModelRelationshipTest extends TestCase
{
    use RefreshDatabase;

    protected University $university;
    protected College $college;
    protected Department $department;
    protected User $user;
    protected Student $student;
    protected Course $course;
    protected AcademicYear $academicYear;
    protected Enrollment $enrollment;

    protected function setUp(): void
    {
        parent::setUp();

        $this->university = University::create([
            'name' => 'Test University',
            'slug' => 'test-university',
            'domain' => 'test.bitflow.edu',
            'email' => 'admin@test.bitflow.edu',
            'phone' => '+1-555-0100',
            'status' => 'active',
            'storage_quota_gb' => 100,
        ]);

        $this->college = College::create([
            'university_id' => $this->university->id,
            'name' => 'Test College',
            'code' => 'TC',
            'type' => 'government',
            'status' => 'active',
            'capacity' => 1000,
            'current_enrollment' => 0,
        ]);

        $this->user = User::create([
            'university_id' => $this->university->id,
            'username' => 'testuser',
            'email' => 'test@test.bitflow.edu',
            'password' => Hash::make('Password@123'),
            'first_name' => 'Test',
            'last_name' => 'User',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        $this->department = Department::create([
            'university_id' => $this->university->id,
            'college_id' => $this->college->id,
            'name' => 'Computer Science',
            'code' => 'CS',
            'head_user_id' => $this->user->id,
            'status' => 'active',
        ]);

        $this->course = Course::create([
            'university_id' => $this->university->id,
            'department_id' => $this->department->id,
            'code' => 'CS101',
            'name' => 'Introduction to Programming',
            'credits' => 4,
            'duration_weeks' => 16,
            'status' => 'active',
        ]);

        $this->academicYear = AcademicYear::create([
            'university_id' => $this->university->id,
            'name' => '2024-2025',
            'code' => 'AY2425',
            'start_date' => now(),
            'end_date' => now()->addYear(),
            'status' => 'active',
        ]);

        $this->student = Student::create([
            'university_id' => $this->university->id,
            'user_id' => $this->user->id,
            'college_id' => $this->college->id,
            'department_id' => $this->department->id,
            'student_id' => 'STU001',
            'enrollment_year' => 2024,
            'status' => 'active',
        ]);

        $this->enrollment = Enrollment::create([
            'university_id' => $this->university->id,
            'student_id' => $this->student->id,
            'course_id' => $this->course->id,
            'academic_year_id' => $this->academicYear->id,
            'enrollment_date' => now(),
            'status' => 'active',
        ]);
    }

    public function test_university_has_colleges(): void
    {
        $this->assertInstanceOf(College::class, $this->university->colleges->first());
        $this->assertCount(1, $this->university->colleges);
    }

    public function test_university_has_users(): void
    {
        $this->assertInstanceOf(User::class, $this->university->users->first());
        $this->assertCount(1, $this->university->users);
    }

    public function test_college_belongs_to_university(): void
    {
        $this->assertInstanceOf(University::class, $this->college->university);
        $this->assertEquals($this->university->id, $this->college->university->id);
    }

    public function test_college_has_departments(): void
    {
        $this->assertInstanceOf(Department::class, $this->college->departments->first());
        $this->assertCount(1, $this->college->departments);
    }

    public function test_college_has_students(): void
    {
        $this->assertInstanceOf(Student::class, $this->college->students->first());
        $this->assertCount(1, $this->college->students);
    }

    public function test_department_belongs_to_college(): void
    {
        $this->assertInstanceOf(College::class, $this->department->college);
        $this->assertEquals($this->college->id, $this->department->college->id);
    }

    public function test_department_has_head_user(): void
    {
        $this->assertInstanceOf(User::class, $this->department->head);
        $this->assertEquals($this->user->id, $this->department->head->id);
    }

    public function test_department_has_courses(): void
    {
        $this->assertInstanceOf(Course::class, $this->department->courses->first());
        $this->assertCount(1, $this->department->courses);
    }

    public function test_course_belongs_to_department(): void
    {
        $this->assertInstanceOf(Department::class, $this->course->department);
        $this->assertEquals($this->department->id, $this->course->department->id);
    }

    public function test_course_has_enrollments(): void
    {
        $this->assertInstanceOf(Enrollment::class, $this->course->enrollments->first());
        $this->assertCount(1, $this->course->enrollments);
    }

    public function test_student_belongs_to_user(): void
    {
        $this->assertInstanceOf(User::class, $this->student->user);
        $this->assertEquals($this->user->id, $this->student->user->id);
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

    public function test_student_has_enrollments(): void
    {
        $this->assertInstanceOf(Enrollment::class, $this->student->enrollments->first());
        $this->assertCount(1, $this->student->enrollments);
    }

    public function test_enrollment_belongs_to_student(): void
    {
        $this->assertInstanceOf(Student::class, $this->enrollment->student);
        $this->assertEquals($this->student->id, $this->enrollment->student->id);
    }

    public function test_enrollment_belongs_to_course(): void
    {
        $this->assertInstanceOf(Course::class, $this->enrollment->course);
        $this->assertEquals($this->course->id, $this->enrollment->course->id);
    }

    public function test_enrollment_belongs_to_academic_year(): void
    {
        $this->assertInstanceOf(AcademicYear::class, $this->enrollment->academicYear);
        $this->assertEquals($this->academicYear->id, $this->enrollment->academicYear->id);
    }

    public function test_user_has_student_relationship(): void
    {
        $this->assertInstanceOf(Student::class, $this->user->student);
        $this->assertEquals($this->student->id, $this->user->student->id);
    }

    public function test_eager_loading_works(): void
    {
        $university = University::with(['colleges.departments.courses'])->find($this->university->id);

        $this->assertNotNull($university->colleges);
        $this->assertNotNull($university->colleges->first()->departments);
        $this->assertNotNull($university->colleges->first()->departments->first()->courses);
    }

    public function test_student_active_enrollments_scope(): void
    {
        $activeEnrollments = $this->student->activeEnrollments;

        $this->assertCount(1, $activeEnrollments);
        $this->assertEquals('active', $activeEnrollments->first()->status);
    }

    public function test_university_is_active_helper(): void
    {
        $this->assertTrue($this->university->isActive());

        $this->university->update(['status' => 'suspended']);
        $this->assertFalse($this->university->isActive());
    }

    public function test_college_is_active_helper(): void
    {
        $this->assertTrue($this->college->isActive());

        $this->college->update(['status' => 'inactive']);
        $this->assertFalse($this->college->isActive());
    }

    public function test_college_enrollment_percent_attribute(): void
    {
        $this->college->update([
            'capacity' => 1000,
            'current_enrollment' => 500,
        ]);

        $this->assertEquals(50, $this->college->enrollment_percent);
    }
}
