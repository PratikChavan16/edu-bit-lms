<?php

declare(strict_types=1);

namespace App\Http\Controllers\Faculty;

use App\Models\College;
use App\Services\AssessmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

final class AssessmentsController
{
    public function __construct(private AssessmentService $assessmentService)
    {
    }

    /**
     * Resolve college from tenant context or query parameter.
     */
    private function resolveCollege(Request $request): ?College
    {
        $college = null;
        
        // Try to get from container binding (set by middleware in production)
        if (app()->bound('tenant.college')) {
            $college = app('tenant.college');
        }

        // Fallback to query parameter (used in tests and API calls)
        if (!$college && $request->has('college_id')) {
            $college = College::find($request->input('college_id'));
        }

        return $college;
    }

    public function index(Request $request): JsonResponse
    {
        $college = $this->resolveCollege($request);

        if (!$college) {
            return response()->json([
                'success' => false,
                'error' => 'College context not found',
            ], 400);
        }

        $user = $request->user();
        $faculty = $user->faculty;

        if (!$faculty) {
            return response()->json([
                'success' => false,
                'error' => 'Faculty profile not found',
            ], 404);
        }

        $filters = $request->only(['status', 'subject', 'course', 'year']);
        $filters['faculty_id'] = $faculty->id;
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
        $college = $this->resolveCollege($request);

        if (!$college) {
            return response()->json([
                'success' => false,
                'error' => 'College context not found',
            ], 400);
        }

        $user = $request->user();
        $faculty = $user->faculty;

        if (!$faculty) {
            return response()->json([
                'success' => false,
                'error' => 'Faculty profile not found',
            ], 404);
        }

        $validated = $request->validate([
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
            $faculty->id,
            $validated,
            $questions
        );

        return response()->json([
            'success' => true,
            'data' => $assessment,
        ], 201);
    }

    public function show(Request $request, string $assessmentId): JsonResponse
    {
        $assessment = $this->assessmentService->getAssessment($assessmentId);

        return response()->json([
            'success' => true,
            'data' => $assessment,
        ]);
    }

    public function update(Request $request, string $assessmentId): JsonResponse
    {
        $college = $this->resolveCollege($request);

        if (!$college) {
            return response()->json([
                'success' => false,
                'error' => 'College context not found',
            ], 400);
        }

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
        ]);

        $assessment = $this->assessmentService->updateAssessment($assessmentId, $validated);

        return response()->json([
            'success' => true,
            'data' => $assessment,
        ]);
    }

    public function destroy(Request $request, string $assessmentId): JsonResponse
    {
        $this->assessmentService->deleteAssessment($assessmentId);

        return response()->json([
            'success' => true,
            'message' => 'Assessment deleted successfully',
        ]);
    }

    public function submissions(Request $request, string $assessmentId): JsonResponse
    {
        $assessment = $this->assessmentService->getAssessment($assessmentId);
        $submissions = $assessment->submissions()->with('student.user')->get();

        return response()->json([
            'success' => true,
            'data' => $submissions,
        ]);
    }

    public function gradeSubmission(Request $request, string $assessmentId, string $submissionId): JsonResponse
    {
        $validated = $request->validate([
            'marks' => ['required', 'numeric', 'min:0'],
            'feedback' => ['nullable', 'string'],
        ]);

        $submission = $this->assessmentService->gradeSubmission($submissionId, $validated);

        return response()->json([
            'success' => true,
            'data' => $submission,
        ]);
    }
}
