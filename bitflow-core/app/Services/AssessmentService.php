<?php

namespace App\Services;

use App\Models\{Assessment, AssessmentSubmission, Student, User};
use App\Repositories\AssessmentRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;

class AssessmentService
{
    public function __construct(private AssessmentRepository $repository)
    {
    }

    public function listAssessmentsForCollege(string $collegeId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->listForCollege($collegeId, $filters, $perPage);
    }

    public function listAssessmentsForStudent(Student $student, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->listForStudent($student, $filters, $perPage);
    }

    public function createAssessment(string $collegeId, string $facultyId, array $data, array $questions = []): Assessment
    {
        $payload = array_merge($data, [
            'college_id' => $collegeId,
            'faculty_id' => $facultyId,
        ]);

        return $this->repository->create($payload, $questions);
    }

    public function updateAssessment(string $assessmentId, array $data, ?array $questions = null): Assessment
    {
        $assessment = $this->repository->getById($assessmentId);

        return $this->repository->update($assessment, $data, $questions);
    }

    public function deleteAssessment(string $assessmentId): void
    {
        $assessment = $this->repository->getById($assessmentId);
        $this->repository->delete($assessment);
    }

    public function getAssessment(string $assessmentId): Assessment
    {
        return $this->repository->getById($assessmentId);
    }

    public function submitAssessment(Student $student, string $assessmentId, array $answers, ?array $uploadedFiles = null): AssessmentSubmission
    {
        $assessment = $this->repository->getById($assessmentId);
        $submission = $this->repository->getSubmission($assessmentId, $student->id);

        $payload = [
            'assessment_id' => $assessment->id,
            'student_id' => $student->id,
            'answers' => $answers,
            'uploaded_files' => $uploadedFiles,
            'status' => 'submitted',
            'submitted_at' => Carbon::now(),
        ];

        if ($submission) {
            $this->repository->updateSubmission($submission, $payload);
            $submission = $submission->refresh();
        } else {
            $submission = $this->repository->recordSubmission($payload);
        }

        if ($assessment->type === 'mcq') {
            $submission = $this->autoGradeSubmission($assessment, $submission, $student->user);
        }

        return $submission->load('assessment');
    }

    public function autoGradeSubmission(Assessment $assessment, AssessmentSubmission $submission, ?User $grader = null): AssessmentSubmission
    {
        $answers = $submission->answers ?? [];
        $total = 0;

        foreach ($assessment->questions as $question) {
            $given = Arr::get($answers, (string) $question->question_number);
            if ($given !== null && strcasecmp(trim($given), trim((string) $question->correct_answer)) === 0) {
                $total += $question->marks;
            }
        }

        $status = $total >= $assessment->passing_marks ? 'graded' : 'graded';

        return $this->repository->updateSubmission($submission, [
            'marks_obtained' => $total,
            'status' => $status,
            'graded_at' => Carbon::now(),
            'graded_by' => $grader?->id,
            'feedback' => $total >= $assessment->passing_marks ? 'Pass' : 'Fail',
        ]);
    }

    public function listSubmissions(string $assessmentId): Collection
    {
        return $this->repository->listSubmissions($assessmentId);
    }
}
