<?php

namespace App\Http\Controllers\Faculty;

use App\Http\Controllers\Controller;
use App\Models\Assessment;
use App\Models\AssessmentSubmission;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class GradingController extends Controller
{
    /**
     * Get assessments created by the faculty
     */
    public function getAssessments(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $faculty = Faculty::where('user_id', $userId)->firstOrFail();

        $filters = [
            'subject' => $request->query('subject'),
            'type' => $request->query('type'),
            'status' => $request->query('status'),
        ];

        $query = Assessment::where('faculty_id', $faculty->id)
            ->with(['college', 'faculty', 'questions', 'submissions']);

        if ($filters['subject']) {
            $query->where('subject', $filters['subject']);
        }

        if ($filters['type']) {
            $query->where('type', $filters['type']);
        }

        if ($filters['status']) {
            if ($filters['status'] === 'active') {
                $query->where('ends_at', '>=', now());
            } elseif ($filters['status'] === 'past') {
                $query->where('ends_at', '<', now());
            }
        }

        $assessments = $query->orderBy('ends_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $assessments,
        ]);
    }

    /**
     * Get submissions for an assessment
     */
    public function getSubmissions(Request $request, string $assessmentId): JsonResponse
    {
        $userId = $request->user()->id;
        $faculty = Faculty::where('user_id', $userId)->firstOrFail();

        // Verify faculty owns this assessment
        $assessment = Assessment::where('id', $assessmentId)
            ->where('faculty_id', $faculty->id)
            ->firstOrFail();

        $filters = [
            'status' => $request->query('status'), // pending, graded
            'search' => $request->query('search'),
        ];

        $query = AssessmentSubmission::where('assessment_id', $assessmentId)
            ->with(['student.user', 'gradedBy']);

        if ($filters['status']) {
            if ($filters['status'] === 'graded') {
                $query->whereNotNull('marks_obtained');
            } elseif ($filters['status'] === 'pending') {
                $query->whereNull('marks_obtained');
            }
        }

        if ($filters['search']) {
            $query->whereHas('student.user', function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%");
            });
        }

        $submissions = $query->orderBy('submitted_at', 'desc')->paginate(50);

        // Calculate statistics
        $stats = [
            'total_submissions' => AssessmentSubmission::where('assessment_id', $assessmentId)->count(),
            'graded' => AssessmentSubmission::where('assessment_id', $assessmentId)->whereNotNull('marks_obtained')->count(),
            'pending' => AssessmentSubmission::where('assessment_id', $assessmentId)->whereNull('marks_obtained')->count(),
            'average_marks' => AssessmentSubmission::where('assessment_id', $assessmentId)
                ->whereNotNull('marks_obtained')
                ->avg('marks_obtained'),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'assessment' => $assessment,
                'submissions' => $submissions,
                'statistics' => $stats,
            ],
        ]);
    }

    /**
     * Grade a single submission
     */
    public function gradeSubmission(Request $request, string $submissionId): JsonResponse
    {
        $userId = $request->user()->id;
        $faculty = Faculty::where('user_id', $userId)->firstOrFail();

        $validator = Validator::make($request->all(), [
            'marks_obtained' => 'required|numeric|min:0',
            'grade' => 'nullable|string|in:A+,A,B+,B,C+,C,D,F',
            'feedback' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $submission = AssessmentSubmission::with('assessment')
            ->findOrFail($submissionId);

        // Verify faculty owns the assessment
        if ($submission->assessment->faculty_id !== $faculty->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to grade this submission',
            ], 403);
        }

        // Validate marks don't exceed total
        if ($request->input('marks_obtained') > $submission->assessment->total_marks) {
            return response()->json([
                'success' => false,
                'message' => 'Marks obtained cannot exceed total marks',
            ], 422);
        }

        // Calculate grade if not provided
        $grade = $request->input('grade');
        if (!$grade) {
            $percentage = ($request->input('marks_obtained') / $submission->assessment->total_marks) * 100;
            $grade = $this->calculateGrade($percentage);
        }

        $submission->update([
            'marks_obtained' => $request->input('marks_obtained'),
            'grade' => $grade,
            'feedback' => $request->input('feedback'),
            'graded_by' => $userId,
            'graded_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $submission->load(['student.user', 'gradedBy']),
            'message' => 'Submission graded successfully',
        ]);
    }

    /**
     * Bulk grade submissions
     */
    public function bulkGrade(Request $request, string $assessmentId): JsonResponse
    {
        $userId = $request->user()->id;
        $faculty = Faculty::where('user_id', $userId)->firstOrFail();

        // Verify faculty owns the assessment
        $assessment = Assessment::where('id', $assessmentId)
            ->where('faculty_id', $faculty->id)
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'grades' => 'required|array|min:1',
            'grades.*.submission_id' => 'required|exists:assessment_submissions,id',
            'grades.*.marks_obtained' => 'required|numeric|min:0',
            'grades.*.grade' => 'nullable|string|in:A+,A,B+,B,C+,C,D,F',
            'grades.*.feedback' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $grades = $request->input('grades');
        $successCount = 0;
        $errors = [];

        DB::beginTransaction();
        try {
            foreach ($grades as $gradeData) {
                $submission = AssessmentSubmission::find($gradeData['submission_id']);

                if (!$submission || $submission->assessment_id !== $assessmentId) {
                    $errors[] = [
                        'submission_id' => $gradeData['submission_id'],
                        'error' => 'Invalid submission',
                    ];
                    continue;
                }

                if ($gradeData['marks_obtained'] > $assessment->total_marks) {
                    $errors[] = [
                        'submission_id' => $gradeData['submission_id'],
                        'error' => 'Marks exceed total marks',
                    ];
                    continue;
                }

                $grade = $gradeData['grade'] ?? $this->calculateGrade(
                    ($gradeData['marks_obtained'] / $assessment->total_marks) * 100
                );

                $submission->update([
                    'marks_obtained' => $gradeData['marks_obtained'],
                    'grade' => $grade,
                    'feedback' => $gradeData['feedback'] ?? null,
                    'graded_by' => $userId,
                    'graded_at' => now(),
                ]);

                $successCount++;
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'data' => [
                    'success_count' => $successCount,
                    'error_count' => count($errors),
                    'errors' => $errors,
                ],
                'message' => "Successfully graded {$successCount} submissions",
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to bulk grade submissions',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get grading statistics for faculty
     */
    public function getStatistics(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $faculty = Faculty::where('user_id', $userId)->firstOrFail();

        $totalAssessments = Assessment::where('faculty_id', $faculty->id)->count();
        
        $totalSubmissions = AssessmentSubmission::whereHas('assessment', function ($q) use ($faculty) {
            $q->where('faculty_id', $faculty->id);
        })->count();

        $gradedSubmissions = AssessmentSubmission::whereHas('assessment', function ($q) use ($faculty) {
            $q->where('faculty_id', $faculty->id);
        })->whereNotNull('marks_obtained')->count();

        $pendingSubmissions = $totalSubmissions - $gradedSubmissions;

        $averageMarks = AssessmentSubmission::whereHas('assessment', function ($q) use ($faculty) {
            $q->where('faculty_id', $faculty->id);
        })->whereNotNull('marks_obtained')->avg('marks_obtained');

        return response()->json([
            'success' => true,
            'data' => [
                'total_assessments' => $totalAssessments,
                'total_submissions' => $totalSubmissions,
                'graded_submissions' => $gradedSubmissions,
                'pending_submissions' => $pendingSubmissions,
                'average_marks' => round($averageMarks, 2),
                'grading_percentage' => $totalSubmissions > 0 
                    ? round(($gradedSubmissions / $totalSubmissions) * 100, 2)
                    : 0,
            ],
        ]);
    }

    /**
     * Helper: Calculate grade from percentage
     */
    private function calculateGrade(float $percentage): string
    {
        if ($percentage >= 90) return 'A+';
        if ($percentage >= 80) return 'A';
        if ($percentage >= 70) return 'B+';
        if ($percentage >= 60) return 'B';
        if ($percentage >= 50) return 'C+';
        if ($percentage >= 40) return 'C';
        if ($percentage >= 33) return 'D';
        return 'F';
    }
}
