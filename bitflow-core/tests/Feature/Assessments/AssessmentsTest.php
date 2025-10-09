<?php

namespace Tests\Feature\Assessments;

use App\Models\Assessment;
use App\Models\AssessmentQuestion;
use App\Models\College;
use App\Models\Faculty;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AssessmentsTest extends TestCase
{
    use RefreshDatabase;

    protected User $facultyUser;
    protected User $studentUser;
    protected College $college;
    protected Faculty $faculty;
    protected Student $student;
    protected string $facultyToken;
    protected string $studentToken;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->seed(\Database\Seeders\RBACSeeder::class);
        
        $this->college = College::factory()->create();
        
        // Create faculty user
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
        
        // Create student user
        $this->studentUser = User::factory()->create(['status' => 'active']);
        $this->student = Student::factory()->create([
            'user_id' => $this->studentUser->id,
            'college_id' => $this->college->id,
            'course' => 'BSc Computer Science',
            'year' => 2024,
        ]);
        
        $studentRole = \App\Models\Role::where('name', 'student')->first();
        $this->studentUser->roles()->attach($studentRole->id, [
            'college_id' => $this->college->id,
        ]);
        
        $this->studentToken = $this->studentUser->createToken('test-device')->plainTextToken;
    }

    public function test_faculty_can_create_assessment(): void
    {
        $data = [
            'title' => 'Midterm Exam',
            'type' => 'mcq',
            'subject' => 'Computer Science',
            'course' => 'BSc Computer Science',
            'year' => 2,
            'total_marks' => 100,
            'passing_marks' => 40,
            'duration_minutes' => 120,
            'starts_at' => now()->addDays(7)->toDateTimeString(),
            'ends_at' => now()->addDays(7)->addHours(2)->toDateTimeString(),
            'submission_type' => 'typed',
            'status' => 'scheduled',
            'questions' => [
                [
                    'question_number' => 1,
                    'question_text' => 'What is 2+2?',
                    'options' => ['2', '3', '4', '5'],
                    'correct_answer' => '4',
                    'marks' => 10,
                ],
            ],
        ];

        $response = $this->postJson("/api/faculty/assessments?college_id={$this->college->id}", $data, [
            'Authorization' => 'Bearer ' . $this->facultyToken,
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'title',
                    'type',
                ],
            ]);

        $this->assertDatabaseHas('assessments', [
            'title' => 'Midterm Exam',
            'faculty_id' => $this->faculty->id,
        ]);
    }

    public function test_faculty_can_list_assessments(): void
    {
        Assessment::factory()->count(3)->create([
            'college_id' => $this->college->id,
            'faculty_id' => $this->faculty->id,
        ]);

        $response = $this->getJson("/api/faculty/assessments?college_id={$this->college->id}", [
            'Authorization' => 'Bearer ' . $this->facultyToken,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'data' => [
                        '*' => ['id', 'title', 'type'],
                    ],
                ],
            ]);
    }

    public function test_faculty_can_update_assessment(): void
    {
        $assessment = Assessment::factory()->create([
            'college_id' => $this->college->id,
            'faculty_id' => $this->faculty->id,
            'title' => 'Old Title',
        ]);

        $data = [
            'title' => 'Updated Exam Title',
        ];

        $response = $this->patchJson("/api/faculty/assessments/{$assessment->id}?college_id={$this->college->id}", $data, [
            'Authorization' => 'Bearer ' . $this->facultyToken,
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('assessments', [
            'id' => $assessment->id,
            'title' => 'Updated Exam Title',
        ]);
    }

    public function test_faculty_can_delete_assessment(): void
    {
        $assessment = Assessment::factory()->create([
            'college_id' => $this->college->id,
            'faculty_id' => $this->faculty->id,
        ]);

        $response = $this->deleteJson("/api/faculty/assessments/{$assessment->id}?college_id={$this->college->id}", [], [
            'Authorization' => 'Bearer ' . $this->facultyToken,
        ]);

        $response->assertStatus(200);

        $this->assertSoftDeleted('assessments', [
            'id' => $assessment->id,
        ]);
    }

    public function test_student_can_list_assessments(): void
    {
        Assessment::factory()->count(3)->create([
            'college_id' => $this->college->id,
            'course' => 'BSc Computer Science',
            'year' => 2024,
        ]);

        $response = $this->getJson('/api/learner/assessments', [
            'Authorization' => 'Bearer ' . $this->studentToken,
        ]);

        $response->assertStatus(200);
    }

    public function test_student_can_submit_assessment(): void
    {
        $assessment = Assessment::factory()->create([
            'college_id' => $this->college->id,
            'course' => 'BSc Computer Science',
            'year' => 2024,
            'type' => 'mcq',
        ]);

        AssessmentQuestion::factory()->create([
            'assessment_id' => $assessment->id,
            'question_number' => 1,
            'correct_answer' => 'A',
            'marks' => 10,
        ]);

        $data = [
            'answers' => [
                '1' => 'A',
            ],
        ];

        $response = $this->postJson("/api/learner/assessments/{$assessment->id}/submit", $data, [
            'Authorization' => 'Bearer ' . $this->studentToken,
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'marks_obtained',
                    'status',
                ],
            ]);

        $this->assertDatabaseHas('assessment_submissions', [
            'assessment_id' => $assessment->id,
            'student_id' => $this->student->id,
            'status' => 'graded',
        ]);
    }

    public function test_student_cannot_submit_after_deadline(): void
    {
        $assessment = Assessment::factory()->create([
            'college_id' => $this->college->id,
            'course' => 'BSc Computer Science',
            'year' => 2024,
            'starts_at' => now()->subDays(10),
            'ends_at' => now()->subDays(9),
            'status' => 'completed',
        ]);

        $data = [
            'answers' => ['1' => 'A'],
        ];

        $response = $this->postJson("/api/learner/assessments/{$assessment->id}/submit", $data, [
            'Authorization' => 'Bearer ' . $this->studentToken,
        ]);

        $response->assertStatus(422);
    }

    public function test_mcq_assessment_auto_grades(): void
    {
        $assessment = Assessment::factory()->create([
            'college_id' => $this->college->id,
            'course' => 'BSc Computer Science',
            'year' => 2024,
            'type' => 'mcq',
            'total_marks' => 20,
            'passing_marks' => 10,
        ]);

        AssessmentQuestion::factory()->create([
            'assessment_id' => $assessment->id,
            'question_number' => 1,
            'correct_answer' => 'A',
            'marks' => 10,
        ]);

        AssessmentQuestion::factory()->create([
            'assessment_id' => $assessment->id,
            'question_number' => 2,
            'correct_answer' => 'B',
            'marks' => 10,
        ]);

        $data = [
            'answers' => [
                '1' => 'A', // Correct
                '2' => 'C', // Wrong
            ],
        ];

        $response = $this->postJson("/api/learner/assessments/{$assessment->id}/submit", $data, [
            'Authorization' => 'Bearer ' . $this->studentToken,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'marks_obtained' => 10,
                ],
            ]);
    }

    public function test_requires_authentication(): void
    {
        $response = $this->getJson('/api/learner/assessments');

        $response->assertStatus(401);
    }

    public function test_validates_required_fields_on_create(): void
    {
        $response = $this->postJson("/api/faculty/assessments?college_id={$this->college->id}", [], [
            'Authorization' => 'Bearer ' . $this->facultyToken,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'type']);
    }
}
