<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Services\AssessmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

final class AssessmentsController
{
    public function __construct(private AssessmentService $assessmentService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $college = app('tenant.college');

        if (!$college) {
            return response()->json([
                'success' => false,
                'error' => 'College context not found',
            ], 400);
        }

        $filters = $request->only(['status', 'subject', 'course', 'year']);
        $perPage = (int) $request->query('per_page', 15);

        $assessments = $this->assessmentService->listAssessmentsForCollege($college->id, $filters, $perPage);

        return response()->json([
            'success' => true,
            'data' => $assessments->items(),
            'meta' => [
                'current_page' => $assessments->currentPage(),
                'per_page' => $assessments->perPage(),
                'total' => $assessments->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $college = app('tenant.college');

        if (!$college) {
            return response()->json([
                'success' => false,
                'error' => 'College context not found',
            ], 400);
        }

        $validated = $request->validate([
            'faculty_id' => ['required', 'uuid', 'exists:faculty,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', Rule::in(['mcq', 'saq', 'laq', 'practical', 'project'])],
            'subject' => ['required', 'string', 'max:120'],
            'course' => ['required', 'string', 'max:120'],
            'year' => ['required', 'integer', 'min:1', 'max:6'],
            'total_marks' => ['required', 'integer', 'min:1'],
            'passing_marks' => ['required', 'integer', 'min:1'],
            'duration_minutes' => ['nullable', 'integer', 'min:10'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'submission_type' => ['required', Rule::in(['typed', 'upload', 'both'])],
            'status' => ['required', Rule::in(['draft', 'scheduled', 'active', 'completed', 'archived'])],
            'questions' => ['nullable', 'array', 'min:1'],
            'questions.*.question_text' => ['required_with:questions', 'string'],
            'questions.*.question_number' => ['nullable', 'integer', 'min:1'],
            'questions.*.options' => ['nullable', 'array'],
            'questions.*.correct_answer' => ['nullable', 'string'],
            'questions.*.marks' => ['nullable', 'integer', 'min:1'],
        ]);

        $questions = $validated['questions'] ?? [];
        unset($validated['questions']);

        $assessment = $this->assessmentService->createAssessment(
            $college->id,
            $validated['faculty_id'],
            $validated,
            $questions
        );

        return response()->json([
            'success' => true,
            'data' => $assessment,
        ], 201);
    }

    public function show(string $assessmentId): JsonResponse
    {
        $assessment = $this->assessmentService->getAssessment($assessmentId);

        return response()->json([
            'success' => true,
            'data' => $assessment,
        ]);
    }

    public function update(Request $request, string $assessmentId): JsonResponse
    {
        $validated = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['sometimes', Rule::in(['mcq', 'saq', 'laq', 'practical', 'project'])],
            'subject' => ['sometimes', 'string', 'max:120'],
            'course' => ['sometimes', 'string', 'max:120'],
            'year' => ['sometimes', 'integer', 'min:1', 'max:6'],
            'total_marks' => ['sometimes', 'integer', 'min:1'],
            'passing_marks' => ['sometimes', 'integer', 'min:1'],
            'duration_minutes' => ['nullable', 'integer', 'min:10'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'submission_type' => ['sometimes', Rule::in(['typed', 'upload', 'both'])],
            'status' => ['sometimes', Rule::in(['draft', 'scheduled', 'active', 'completed', 'archived'])],
            'questions' => ['nullable', 'array'],
            'questions.*.question_text' => ['required_with:questions', 'string'],
            'questions.*.question_number' => ['nullable', 'integer', 'min:1'],
            'questions.*.options' => ['nullable', 'array'],
            'questions.*.correct_answer' => ['nullable', 'string'],
            'questions.*.marks' => ['nullable', 'integer', 'min:1'],
        ]);

        $questions = $validated['questions'] ?? null;
        unset($validated['questions']);

        $assessment = $this->assessmentService->updateAssessment($assessmentId, $validated, $questions);

        return response()->json([
            'success' => true,
            'data' => $assessment,
        ]);
    }

    public function destroy(string $assessmentId): JsonResponse
    {
        $this->assessmentService->deleteAssessment($assessmentId);

        return response()->json([
            'success' => true,
            'message' => 'Assessment deleted',
        ]);
    }

    public function submissions(string $assessmentId): JsonResponse
    {
        $submissions = $this->assessmentService->listSubmissions($assessmentId);

        return response()->json([
            'success' => true,
            'data' => $submissions,
        ]);
    }
}
