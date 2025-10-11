<?php

namespace Tests\Feature\Attendance;

use App\Models\Attendance;
use App\Models\AttendanceCorrection;
use App\Models\College;
use App\Models\Faculty;
use App\Models\Student;
use App\Models\TimetableBlock;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AttendanceTest extends TestCase
{
    use RefreshDatabase;

    protected User $facultyUser;
    protected User $adminUser;
    protected College $college;
    protected Faculty $faculty;
    protected Student $student;
    protected TimetableBlock $block;
    protected string $facultyToken;
    protected string $adminToken;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->seed(\Database\Seeders\RBACSeeder::class);
        
        $this->college = College::factory()->create();
        
        // Faculty user
        $this->facultyUser = User::factory()->create(['status' => 'active']);
        $this->faculty = Faculty::factory()->create([
            'user_id' => $this->facultyUser->id,
            'college_id' => $this->college->id,
        ]);
        $facultyRole = \App\Models\Role::where('name', 'faculty')->first();
        $this->facultyUser->roles()->attach($facultyRole->id, [
            'college_id' => $this->college->id,
        ]);
        $this->facultyToken = $this->facultyUser->createToken('test-device')->plainTextToken;
        
        // Admin user
        $this->adminUser = User::factory()->create(['status' => 'active']);
        $adminRole = \App\Models\Role::where('name', 'college-admin')->first();
        $this->adminUser->roles()->attach($adminRole->id, [
            'college_id' => $this->college->id,
        ]);
        $this->adminToken = $this->adminUser->createToken('test-device')->plainTextToken;
        
        // Student
        $studentUser = User::factory()->create(['status' => 'active']);
        $this->student = Student::factory()->create([
            'user_id' => $studentUser->id,
            'college_id' => $this->college->id,
        ]);
        
        // Timetable block
        $this->block = TimetableBlock::factory()->create([
            'college_id' => $this->college->id,
            'faculty_id' => $this->faculty->id,
        ]);
    }

    public function test_faculty_can_mark_attendance(): void
    {
        // Get the next date that matches the timetable block's day_of_week
        $targetDate = now()->next($this->block->day_of_week);
        
        $data = [
            'date' => $targetDate->toDateString(),
            'entries' => [
                [
                    'student_id' => $this->student->id,
                    'status' => 'present',
                ],
            ],
        ];

        $response = $this->postJson("/api/faculty/timetable/{$this->block->id}/attendance", $data, [
            'Authorization' => 'Bearer ' . $this->facultyToken,
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('attendance', [
            'timetable_block_id' => $this->block->id,
            'student_id' => $this->student->id,
            'status' => 'present',
        ]);
    }

    public function test_faculty_can_view_attendance(): void
    {
        // Get the next date that matches the timetable block's day_of_week
        $targetDate = now()->next($this->block->day_of_week);
        
        Attendance::factory()->create([
            'timetable_block_id' => $this->block->id,
            'student_id' => $this->student->id,
            'date' => $targetDate->toDateString(),
        ]);

        $response = $this->getJson("/api/faculty/timetable/{$this->block->id}/attendance?date=" . $targetDate->toDateString(), [
            'Authorization' => 'Bearer ' . $this->facultyToken,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'date',
                    'entries' => [
                        '*' => ['student_id', 'status'],
                    ],
                ],
            ]);
    }

    public function test_faculty_can_request_correction(): void
    {
        $attendance = Attendance::factory()->create([
            'timetable_block_id' => $this->block->id,
            'student_id' => $this->student->id,
            'status' => 'present',
        ]);

        $data = [
            'requested_status' => 'absent',
            'reason' => 'Marked incorrectly',
        ];

        $response = $this->postJson("/api/faculty/attendance/{$attendance->id}/corrections", $data, [
            'Authorization' => 'Bearer ' . $this->facultyToken,
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('attendance_corrections', [
            'attendance_id' => $attendance->id,
            'requested_by' => $this->facultyUser->id,
            'requested_status' => 'absent',
        ]);
    }

    public function test_admin_can_list_corrections(): void
    {
        $attendance = Attendance::factory()->create([
            'timetable_block_id' => $this->block->id,
            'student_id' => $this->student->id,
        ]);

        AttendanceCorrection::factory()->count(3)->create([
            'attendance_id' => $attendance->id,
            'requested_by' => $this->facultyUser->id,
        ]);

        $response = $this->getJson("/api/admin/attendance/corrections?college_id={$this->college->id}", [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(200);
    }

    public function test_admin_can_approve_correction(): void
    {
        $attendance = Attendance::factory()->create([
            'timetable_block_id' => $this->block->id,
            'student_id' => $this->student->id,
            'status' => 'present',
        ]);

        $correction = AttendanceCorrection::factory()->create([
            'attendance_id' => $attendance->id,
            'requested_by' => $this->facultyUser->id,
            'requested_status' => 'absent',
            'status' => 'pending',
        ]);

        $data = [
            'status' => 'approved',
        ];

        $response = $this->patchJson("/api/admin/attendance/corrections/{$correction->id}?college_id={$this->college->id}", $data, [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('attendance_corrections', [
            'id' => $correction->id,
            'status' => 'approved',
            'reviewed_by' => $this->adminUser->id,
        ]);

        $this->assertDatabaseHas('attendance', [
            'id' => $attendance->id,
            'status' => 'absent',
        ]);
    }

    public function test_admin_can_reject_correction(): void
    {
        $attendance = Attendance::factory()->create([
            'timetable_block_id' => $this->block->id,
            'student_id' => $this->student->id,
            'status' => 'present',
        ]);

        $correction = AttendanceCorrection::factory()->create([
            'attendance_id' => $attendance->id,
            'requested_by' => $this->facultyUser->id,
            'requested_status' => 'absent',
            'status' => 'pending',
        ]);

        $data = [
            'status' => 'rejected',
            'review_notes' => 'Insufficient evidence',
        ];

        $response = $this->patchJson("/api/admin/attendance/corrections/{$correction->id}?college_id={$this->college->id}", $data, [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('attendance_corrections', [
            'id' => $correction->id,
            'status' => 'rejected',
        ]);

        // Original attendance should remain unchanged
        $this->assertDatabaseHas('attendance', [
            'id' => $attendance->id,
            'status' => 'present',
        ]);
    }

    public function test_validates_attendance_status(): void
    {
        $data = [
            'date' => now()->toDateString(),
            'attendance' => [
                [
                    'student_id' => $this->student->id,
                    'status' => 'invalid_status',
                ],
            ],
        ];

        $response = $this->postJson("/api/faculty/timetable/{$this->block->id}/attendance", $data, [
            'Authorization' => 'Bearer ' . $this->facultyToken,
        ]);

        $response->assertStatus(422);
    }

    public function test_requires_authentication(): void
    {
        $response = $this->getJson("/api/faculty/timetable/{$this->block->id}/attendance");

        $response->assertStatus(401);
    }

    public function test_bulk_attendance_marking(): void
    {
        $student2 = Student::factory()->create([
            'user_id' => User::factory()->create()->id,
            'college_id' => $this->college->id,
        ]);

        // Get the next date that matches the timetable block's day_of_week
        $targetDate = now()->next($this->block->day_of_week);

        $data = [
            'date' => $targetDate->toDateString(),
            'entries' => [
                [
                    'student_id' => $this->student->id,
                    'status' => 'present',
                ],
                [
                    'student_id' => $student2->id,
                    'status' => 'absent',
                ],
            ],
        ];

        $response = $this->postJson("/api/faculty/timetable/{$this->block->id}/attendance", $data, [
            'Authorization' => 'Bearer ' . $this->facultyToken,
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('attendance', [
            'student_id' => $this->student->id,
            'status' => 'present',
        ]);

        $this->assertDatabaseHas('attendance', [
            'student_id' => $student2->id,
            'status' => 'absent',
        ]);
    }
}
