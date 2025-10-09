<?php

namespace Tests\Feature\Timetable;

use App\Models\College;
use App\Models\Faculty;
use App\Models\TimetableBlock;
use App\Models\TimetableBlockException;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TimetableTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected User $facultyUser;
    protected College $college;
    protected Faculty $faculty;
    protected string $adminToken;
    protected string $facultyToken;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->seed(\Database\Seeders\RBACSeeder::class);
        
        $this->college = College::factory()->create();
        
        // Admin user
        $this->adminUser = User::factory()->create(['status' => 'active']);
        $adminRole = \App\Models\Role::where('name', 'college-admin')->first();
        $this->adminUser->roles()->attach($adminRole->id, [
            'college_id' => $this->college->id,
        ]);
        $this->adminToken = $this->adminUser->createToken('test-device')->plainTextToken;
        
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
    }

    public function test_admin_can_create_timetable_block(): void
    {
        $data = [
            'subject' => 'Data Structures',
            'course' => 'BSc Computer Science',
            'year' => 2,
            'section' => 'A',
            'day_of_week' => 'monday',
            'start_time' => '09:00',
            'end_time' => '10:00',
            'location' => 'Lab 101',
            'type' => 'lecture',
            'effective_from' => now()->toDateString(),
            'faculty_id' => $this->faculty->id,
        ];

        $response = $this->postJson("/api/admin/timetable?college_id={$this->college->id}", $data, [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => ['id', 'subject', 'day_of_week'],
            ]);

        $this->assertDatabaseHas('timetable_blocks', [
            'subject' => 'Data Structures',
            'college_id' => $this->college->id,
        ]);
    }

    public function test_admin_can_list_timetable(): void
    {
        TimetableBlock::factory()->count(5)->create([
            'college_id' => $this->college->id,
            'faculty_id' => $this->faculty->id,
            'course' => 'BSc Computer Science',
        ]);

        $response = $this->getJson("/api/admin/timetable?college_id={$this->college->id}&course=BSc Computer Science", [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(200);
    }

    public function test_admin_can_update_timetable_block(): void
    {
        $block = TimetableBlock::factory()->create([
            'college_id' => $this->college->id,
            'faculty_id' => $this->faculty->id,
            'subject' => 'Old Subject',
        ]);

        $data = ['subject' => 'New Subject'];

        $response = $this->patchJson("/api/admin/timetable/{$block->id}?college_id={$this->college->id}", $data, [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('timetable_blocks', [
            'id' => $block->id,
            'subject' => 'New Subject',
        ]);
    }

    public function test_admin_can_delete_timetable_block(): void
    {
        $block = TimetableBlock::factory()->create([
            'college_id' => $this->college->id,
            'faculty_id' => $this->faculty->id,
        ]);

        $response = $this->deleteJson("/api/admin/timetable/{$block->id}?college_id={$this->college->id}", [], [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(200);

        $this->assertSoftDeleted('timetable_blocks', [
            'id' => $block->id,
        ]);
    }

    public function test_admin_can_create_exception(): void
    {
        $block = TimetableBlock::factory()->create([
            'college_id' => $this->college->id,
            'faculty_id' => $this->faculty->id,
        ]);

        $data = [
            'date' => now()->addDays(3)->toDateString(),
            'type' => 'cancelled',
            'reason' => 'Faculty unavailable',
        ];

        $response = $this->postJson("/api/admin/timetable/{$block->id}/exceptions?college_id={$this->college->id}", $data, [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('timetable_block_exceptions', [
            'timetable_block_id' => $block->id,
            'type' => 'cancelled',
        ]);
    }

    public function test_faculty_can_view_own_timetable(): void
    {
        TimetableBlock::factory()->count(3)->create([
            'college_id' => $this->college->id,
            'faculty_id' => $this->faculty->id,
        ]);

        $response = $this->getJson('/api/faculty/timetable', [
            'Authorization' => 'Bearer ' . $this->facultyToken,
        ]);

        $response->assertStatus(200);
    }

    public function test_detects_time_conflict(): void
    {
        TimetableBlock::factory()->create([
            'college_id' => $this->college->id,
            'faculty_id' => $this->faculty->id,
            'day_of_week' => 1,
            'start_time' => '09:00',
            'end_time' => '10:00',
            'room' => 'Room 101',
        ]);

        $data = [
            'subject' => 'Another Subject',
            'course' => 'BSc Computer Science',
            'year' => 2024,
            'section' => 'A',
            'day_of_week' => 1,
            'start_time' => '09:30',
            'end_time' => '10:30',
            'room' => 'Room 101', // Same room, overlapping time
            'faculty_id' => $this->faculty->id,
        ];

        $response = $this->postJson("/api/admin/timetable?college_id={$this->college->id}", $data, [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(422)
            ->assertJsonFragment(['message' => 'Time slot conflict detected']);
    }

    public function test_requires_authentication(): void
    {
        $response = $this->getJson('/api/faculty/timetable');

        $response->assertStatus(401);
    }

    public function test_validates_time_format(): void
    {
        $data = [
            'subject' => 'Test Subject',
            'course' => 'BSc Computer Science',
            'day_of_week' => 1,
            'start_time' => 'invalid',
            'end_time' => '10:00',
            'faculty_id' => $this->faculty->id,
        ];

        $response = $this->postJson("/api/admin/timetable?college_id={$this->college->id}", $data, [
            'Authorization' => 'Bearer ' . $this->adminToken,
        ]);

        $response->assertStatus(422);
    }
}
