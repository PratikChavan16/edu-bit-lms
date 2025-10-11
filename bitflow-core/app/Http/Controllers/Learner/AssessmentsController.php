<?php

declare(strict_types=1);

namespace App\Http\Controllers\Learner;

use App\Models\Student;
use App\Services\AssessmentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

final class AssessmentsController
{
    public function __construct(private AssessmentService $assessmentService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $student = $this->resolveStudent();

        if (!$student) {
            return response()->json([
                'success' => false,
                'error' => 'Student profile not found',
            ], 404);
        }

        $filters = $request->only(['status']);
        $perPage = (int) $request->query('per_page', 15);

        $assessments = $this->assessmentService->listAssessmentsForStudent($student, $filters, $perPage);

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

    public function show(string $assessmentId): JsonResponse
    {
        $assessment = $this->assessmentService->getAssessment($assessmentId);

        return response()->json([
            'success' => true,
            'data' => $assessment,
        ]);
    }

    public function submit(Request $request, string $assessmentId): JsonResponse
    {
        $student = $this->resolveStudent();

        if (!$student) {
            return response()->json([
                'success' => false,
                'error' => 'Student profile not found',
            ], 404);
        }

        // Check if assessment exists and is submittable
        $assessment = \App\Models\Assessment::find($assessmentId);
        if (!$assessment) {
            return response()->json([
                'success' => false,
                'error' => 'Assessment not found',
            ], 404);
        }

        // Check deadline
        if ($assessment->ends_at && now()->isAfter($assessment->ends_at)) {
            return response()->json([
                'success' => false,
                'error' => 'Assessment submission deadline has passed',
            ], 422);
        }

        $validated = $request->validate([
            'answers' => ['required', 'array'],
            'uploaded_files' => ['nullable', 'array'],
        ]);

        $submission = $this->assessmentService->submitAssessment(
            $student,
            $assessmentId,
            $validated['answers'],
            $validated['uploaded_files'] ?? null
        );

        return response()->json([
            'success' => true,
            'data' => $submission,
        ]);
    }

    private function resolveStudent(): ?Student
    {
        $user = Auth::user();

        if (!$user) {
            return null;
        }

        return Student::with('college')->where('user_id', $user->id)->first();
    }
}
