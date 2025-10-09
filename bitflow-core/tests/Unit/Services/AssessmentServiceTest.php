<?php

namespace Tests\Unit\Services;

use App\Models\Assessment;
use App\Models\AssessmentSubmission;
use App\Models\Student;
use App\Models\User;
use App\Repositories\AssessmentRepository;
use App\Services\AssessmentService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Mockery;
use Tests\TestCase;

class AssessmentServiceTest extends TestCase
{
    private AssessmentRepository $repositoryMock;
    private AssessmentService $service;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->repositoryMock = Mockery::mock(AssessmentRepository::class);
        $this->service = new AssessmentService($this->repositoryMock);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_list_assessments_for_college(): void
    {
        $collegeId = 'college-123';
        $filters = ['type' => 'mcq'];
        $perPage = 20;
        
        $paginatorMock = Mockery::mock(LengthAwarePaginator::class);
        
        $this->repositoryMock
            ->shouldReceive('listForCollege')
            ->once()
            ->with($collegeId, $filters, $perPage)
            ->andReturn($paginatorMock);

        $result = $this->service->listAssessmentsForCollege($collegeId, $filters, $perPage);

        $this->assertSame($paginatorMock, $result);
    }

    public function test_list_assessments_for_student(): void
    {
        $student = Mockery::mock(Student::class);
        $filters = ['status' => 'active'];
        
        $paginatorMock = Mockery::mock(LengthAwarePaginator::class);
        
        $this->repositoryMock
            ->shouldReceive('listForStudent')
            ->once()
            ->with($student, $filters, 15)
            ->andReturn($paginatorMock);

        $result = $this->service->listAssessmentsForStudent($student, $filters);

        $this->assertSame($paginatorMock, $result);
    }

    public function test_create_assessment_adds_college_and_faculty(): void
    {
        $collegeId = 'college-123';
        $facultyId = 'faculty-456';
        $data = [
            'title' => 'Midterm Exam',
            'type' => 'mcq',
        ];
        $questions = [
            ['question' => 'What is 2+2?', 'correct_answer' => '4'],
        ];
        
        $expectedPayload = [
            'title' => 'Midterm Exam',
            'type' => 'mcq',
            'college_id' => $collegeId,
            'faculty_id' => $facultyId,
        ];
        
        $assessmentMock = Mockery::mock(Assessment::class);
        
        $this->repositoryMock
            ->shouldReceive('create')
            ->once()
            ->with($expectedPayload, $questions)
            ->andReturn($assessmentMock);

        $result = $this->service->createAssessment($collegeId, $facultyId, $data, $questions);

        $this->assertSame($assessmentMock, $result);
    }

    public function test_update_assessment_retrieves_and_updates(): void
    {
        $assessmentId = 'assessment-123';
        $data = ['title' => 'Updated Title'];
        $questions = [['question' => 'Updated question?']];
        
        $assessmentMock = Mockery::mock(Assessment::class);
        
        $this->repositoryMock
            ->shouldReceive('getById')
            ->once()
            ->with($assessmentId)
            ->andReturn($assessmentMock);
        
        $this->repositoryMock
            ->shouldReceive('update')
            ->once()
            ->with($assessmentMock, $data, $questions)
            ->andReturn($assessmentMock);

        $result = $this->service->updateAssessment($assessmentId, $data, $questions);

        $this->assertSame($assessmentMock, $result);
    }

    public function test_delete_assessment_retrieves_and_deletes(): void
    {
        $assessmentId = 'assessment-123';
        
        $assessmentMock = Mockery::mock(Assessment::class);
        
        $this->repositoryMock
            ->shouldReceive('getById')
            ->once()
            ->with($assessmentId)
            ->andReturn($assessmentMock);
        
        $this->repositoryMock
            ->shouldReceive('delete')
            ->once()
            ->with($assessmentMock);

        $this->service->deleteAssessment($assessmentId);
    }

    public function test_get_assessment_calls_repository(): void
    {
        $assessmentId = 'assessment-123';
        
        $assessmentMock = Mockery::mock(Assessment::class);
        
        $this->repositoryMock
            ->shouldReceive('getById')
            ->once()
            ->with($assessmentId)
            ->andReturn($assessmentMock);

        $result = $this->service->getAssessment($assessmentId);

        $this->assertSame($assessmentMock, $result);
    }

    public function test_submit_assessment_creates_new_submission(): void
    {
        Carbon::setTestNow('2024-01-15 10:30:00');
        
        $student = Mockery::mock(Student::class);
        $student->id = 'student-123';
        $student->user = Mockery::mock(User::class);
        
        $assessmentId = 'assessment-456';
        $answers = ['1' => 'A', '2' => 'B'];
        $files = ['file1.pdf'];
        
        $assessmentMock = Mockery::mock(Assessment::class);
        $assessmentMock->id = $assessmentId;
        $assessmentMock->type = 'descriptive';
        
        $submissionMock = Mockery::mock(AssessmentSubmission::class);
        
        $this->repositoryMock
            ->shouldReceive('getById')
            ->with($assessmentId)
            ->andReturn($assessmentMock);
        
        $this->repositoryMock
            ->shouldReceive('getSubmission')
            ->with($assessmentId, 'student-123')
            ->andReturn(null);
        
        $expectedPayload = [
            'assessment_id' => $assessmentId,
            'student_id' => 'student-123',
            'answers' => $answers,
            'uploaded_files' => $files,
            'status' => 'submitted',
            'submitted_at' => Carbon::now(),
        ];
        
        $this->repositoryMock
            ->shouldReceive('recordSubmission')
            ->once()
            ->with($expectedPayload)
            ->andReturn($submissionMock);
        
        $submissionMock
            ->shouldReceive('load')
            ->with('assessment')
            ->andReturn($submissionMock);

        $result = $this->service->submitAssessment($student, $assessmentId, $answers, $files);

        $this->assertSame($submissionMock, $result);
        
        Carbon::setTestNow();
    }

    public function test_submit_assessment_auto_grades_mcq(): void
    {
        Carbon::setTestNow('2024-01-15 10:30:00');
        
        $student = Mockery::mock(Student::class);
        $student->id = 'student-123';
        $student->user = Mockery::mock(User::class);
        
        $assessmentId = 'assessment-456';
        $answers = ['1' => 'A', '2' => 'B'];
        
        $assessmentMock = Mockery::mock(Assessment::class);
        $assessmentMock->id = $assessmentId;
        $assessmentMock->type = 'mcq';
        $assessmentMock->questions = collect([
            (object)['question_number' => 1, 'correct_answer' => 'A', 'marks' => 5],
            (object)['question_number' => 2, 'correct_answer' => 'C', 'marks' => 5],
        ]);
        $assessmentMock->passing_marks = 5;
        
        $submissionMock = Mockery::mock(AssessmentSubmission::class);
        $submissionMock->answers = $answers;
        
        $this->repositoryMock->shouldReceive('getById')->andReturn($assessmentMock);
        $this->repositoryMock->shouldReceive('getSubmission')->andReturn(null);
        $this->repositoryMock->shouldReceive('recordSubmission')->andReturn($submissionMock);
        
        // Auto-grade expectation
        $this->repositoryMock
            ->shouldReceive('updateSubmission')
            ->once()
            ->with($submissionMock, Mockery::on(function ($payload) {
                return $payload['marks_obtained'] === 5
                    && $payload['status'] === 'graded';
            }))
            ->andReturn($submissionMock);
        
        $submissionMock->shouldReceive('load')->with('assessment')->andReturn($submissionMock);

        $this->service->submitAssessment($student, $assessmentId, $answers);
        
        Carbon::setTestNow();
    }
}
