<?php

namespace App\Repositories;

use App\Models\{Assessment, AssessmentQuestion, AssessmentSubmission, Student};
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AssessmentRepository
{
    public function listForCollege(string $collegeId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Assessment::query()
            ->where('college_id', $collegeId)
            ->with(['faculty.user'])
            ->orderByDesc('starts_at');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['subject'])) {
            $query->where('subject', 'like', "%{$filters['subject']}%");
        }

        if (!empty($filters['course'])) {
            $query->where('course', $filters['course']);
        }

        if (!empty($filters['year'])) {
            $query->where('year', (int) $filters['year']);
        }

        return $query->paginate($perPage);
    }

    public function listForStudent(Student $student, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Assessment::query()
            ->where('college_id', $student->college_id)
            ->where('course', $student->course)
            ->where('year', $student->year)
            ->whereIn('status', ['scheduled', 'active', 'completed'])
            ->withCount(['submissions as has_submitted' => function ($q) use ($student) {
                $q->where('student_id', $student->id);
            }])
            ->orderByDesc('starts_at');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->paginate($perPage);
    }

    public function getById(string $assessmentId): Assessment
    {
        $assessment = Assessment::with(['questions'])->find($assessmentId);

        if (!$assessment) {
            throw new ModelNotFoundException('Assessment not found');
        }

        return $assessment;
    }

    public function create(array $data, array $questions = []): Assessment
    {
        return DB::transaction(function () use ($data, $questions) {
            $assessment = Assessment::create($data);

            foreach ($questions as $index => $question) {
                AssessmentQuestion::create([
                    'assessment_id' => $assessment->id,
                    'question_number' => $question['question_number'] ?? ($index + 1),
                    'question_text' => $question['question_text'],
                    'options' => $question['options'] ?? null,
                    'correct_answer' => $question['correct_answer'] ?? null,
                    'marks' => $question['marks'] ?? 1,
                ]);
            }

            return $assessment->load('questions');
        });
    }

    public function update(Assessment $assessment, array $data, array $questions = null): Assessment
    {
        return DB::transaction(function () use ($assessment, $data, $questions) {
            $assessment->fill($data);
            $assessment->save();

            if ($questions !== null) {
                $assessment->questions()->delete();

                foreach ($questions as $index => $question) {
                    AssessmentQuestion::create([
                        'assessment_id' => $assessment->id,
                        'question_number' => $question['question_number'] ?? ($index + 1),
                        'question_text' => $question['question_text'],
                        'options' => $question['options'] ?? null,
                        'correct_answer' => $question['correct_answer'] ?? null,
                        'marks' => $question['marks'] ?? 1,
                    ]);
                }
            }

            return $assessment->load('questions');
        });
    }

    public function delete(Assessment $assessment): void
    {
        $assessment->delete();
    }

    public function recordSubmission(array $data): AssessmentSubmission
    {
        return AssessmentSubmission::create($data);
    }

    public function updateSubmission(AssessmentSubmission $submission, array $data): AssessmentSubmission
    {
        $submission->fill($data);
        $submission->save();

        return $submission->refresh();
    }

    public function getSubmission(string $assessmentId, string $studentId): ?AssessmentSubmission
    {
        return AssessmentSubmission::where('assessment_id', $assessmentId)
            ->where('student_id', $studentId)
            ->first();
    }

    public function listSubmissions(string $assessmentId): Collection
    {
        return AssessmentSubmission::with(['student.user'])
            ->where('assessment_id', $assessmentId)
            ->orderByDesc('submitted_at')
            ->get();
    }
}
