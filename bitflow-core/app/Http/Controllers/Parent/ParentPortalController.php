<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\ParentStudent;
use App\Models\Student;
use App\Models\Attendance;
use App\Models\AssessmentSubmission;
use App\Models\FeePayment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ParentPortalController extends Controller
{
    /**
     * Get all children for the logged-in parent
     */
    public function getChildren(Request $request): JsonResponse
    {
        $parentId = $request->user()->id;

        $children = ParentStudent::where('parent_id', $parentId)
            ->with(['student.user'])
            ->get()
            ->map(function ($relation) {
                return [
                    'id' => $relation->student->id,
                    'roll_number' => $relation->student->roll_number,
                    'name' => $relation->student->user->full_name,
                    'email' => $relation->student->user->email,
                    'course' => $relation->student->course,
                    'year' => $relation->student->year,
                    'relationship_type' => $relation->relationship_type,
                    'is_primary' => $relation->is_primary,
                    'permissions' => [
                        'can_view_grades' => $relation->can_view_grades,
                        'can_view_attendance' => $relation->can_view_attendance,
                        'can_view_fees' => $relation->can_view_fees,
                    ],
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $children,
        ]);
    }

    /**
     * Get dashboard data for a specific child
     */
    public function getDashboard(Request $request, string $studentId): JsonResponse
    {
        $parentId = $request->user()->id;

        // Verify parent has access to this student
        $relation = ParentStudent::where('parent_id', $parentId)
            ->where('student_id', $studentId)
            ->firstOrFail();

        $student = Student::with(['user', 'course', 'year', 'college'])
            ->findOrFail($studentId);

        // Calculate attendance percentage
        $attendanceStats = $this->getAttendanceStats($studentId);

        // Get recent grades
        $recentGrades = $this->getRecentGrades($studentId, 5);

        // Get fee status
        $feeStatus = $this->getFeeStatus($studentId);

        // Get upcoming assessments
        $upcomingAssessments = $this->getUpcomingAssessments($studentId);

        return response()->json([
            'success' => true,
            'data' => [
                'student' => [
                    'id' => $student->id,
                    'student_id' => $student->student_id,
                    'name' => $student->user->name,
                    'email' => $student->user->email,
                    'phone' => $student->user->phone,
                    'course' => $student->course->name ?? null,
                    'year' => $student->year->name ?? null,
                    'college' => $student->college->name ?? null,
                ],
                'attendance' => $attendanceStats,
                'recent_grades' => $recentGrades,
                'fee_status' => $feeStatus,
                'upcoming_assessments' => $upcomingAssessments,
            ],
        ]);
    }

    /**
     * Get detailed attendance for a student
     */
    public function getAttendance(Request $request, string $studentId): JsonResponse
    {
        $parentId = $request->user()->id;

        // Verify parent has access and permission
        $relation = ParentStudent::where('parent_id', $parentId)
            ->where('student_id', $studentId)
            ->where('can_view_attendance', true)
            ->firstOrFail();

        $filters = [
            'from_date' => $request->query('from_date'),
            'to_date' => $request->query('to_date'),
            'subject_id' => $request->query('subject_id'),
            'status' => $request->query('status'), // present, absent, late
        ];

        $query = Attendance::where('student_id', $studentId)
            ->with(['timetableBlock.subject', 'timetableBlock.faculty.user']);

        if ($filters['from_date']) {
            $query->where('date', '>=', $filters['from_date']);
        }

        if ($filters['to_date']) {
            $query->where('date', '<=', $filters['to_date']);
        }

        if ($filters['subject_id']) {
            $query->whereHas('timetableBlock', function ($q) use ($filters) {
                $q->where('subject_id', $filters['subject_id']);
            });
        }

        if ($filters['status']) {
            $query->where('status', $filters['status']);
        }

        $attendance = $query->orderBy('date', 'desc')->paginate(50);

        // Calculate statistics
        $stats = $this->getAttendanceStats($studentId, $filters);

        return response()->json([
            'success' => true,
            'data' => [
                'attendance' => $attendance,
                'statistics' => $stats,
            ],
        ]);
    }

    /**
     * Get grades/results for a student
     */
    public function getGrades(Request $request, string $studentId): JsonResponse
    {
        $parentId = $request->user()->id;

        // Verify parent has access and permission
        $relation = ParentStudent::where('parent_id', $parentId)
            ->where('student_id', $studentId)
            ->where('can_view_grades', true)
            ->firstOrFail();

        $filters = [
            'subject_id' => $request->query('subject_id'),
            'assessment_type' => $request->query('assessment_type'),
            'from_date' => $request->query('from_date'),
            'to_date' => $request->query('to_date'),
        ];

        $query = AssessmentSubmission::where('student_id', $studentId)
            ->whereNotNull('marks_obtained')
            ->with(['assessment.subject', 'assessment.faculty.user', 'gradedBy']);

        if ($filters['subject_id']) {
            $query->whereHas('assessment', function ($q) use ($filters) {
                $q->where('subject_id', $filters['subject_id']);
            });
        }

        if ($filters['assessment_type']) {
            $query->whereHas('assessment', function ($q) use ($filters) {
                $q->where('type', $filters['assessment_type']);
            });
        }

        if ($filters['from_date']) {
            $query->where('submitted_at', '>=', $filters['from_date']);
        }

        if ($filters['to_date']) {
            $query->where('submitted_at', '<=', $filters['to_date']);
        }

        $submissions = $query->orderBy('submitted_at', 'desc')->paginate(20);

        // Calculate grade statistics
        $gradeStats = $this->getGradeStatistics($studentId, $filters);

        return response()->json([
            'success' => true,
            'data' => [
                'grades' => $submissions,
                'statistics' => $gradeStats,
            ],
        ]);
    }

    /**
     * Get fee status and payment history
     */
    public function getFees(Request $request, string $studentId): JsonResponse
    {
        $parentId = $request->user()->id;

        // Verify parent has access and permission
        $relation = ParentStudent::where('parent_id', $parentId)
            ->where('student_id', $studentId)
            ->where('can_view_fees', true)
            ->firstOrFail();

        $student = Student::findOrFail($studentId);

        // Get fee structure
        $feeStructure = DB::table('fee_structures')
            ->where('course_id', $student->course_id)
            ->where('year_id', $student->year_id)
            ->where('academic_year', date('Y'))
            ->first();

        // Get payments
        $payments = FeePayment::where('student_id', $studentId)
            ->orderBy('payment_date', 'desc')
            ->paginate(20);

        // Calculate totals
        $totalFees = $feeStructure->total_amount ?? 0;
        $totalPaid = FeePayment::where('student_id', $studentId)
            ->where('status', 'completed')
            ->sum('amount');
        $totalDue = $totalFees - $totalPaid;

        return response()->json([
            'success' => true,
            'data' => [
                'summary' => [
                    'total_fees' => $totalFees,
                    'total_paid' => $totalPaid,
                    'total_due' => $totalDue,
                    'payment_status' => $totalDue <= 0 ? 'paid' : 'pending',
                ],
                'payments' => $payments,
                'fee_structure' => $feeStructure,
            ],
        ]);
    }

    /**
     * Get timetable for a student
     */
    public function getTimetable(Request $request, string $studentId): JsonResponse
    {
        $parentId = $request->user()->id;

        // Verify parent has access
        ParentStudent::where('parent_id', $parentId)
            ->where('student_id', $studentId)
            ->firstOrFail();

        $student = Student::findOrFail($studentId);

        $timetable = DB::table('timetable_blocks')
            ->where('course_id', $student->course_id)
            ->where('year_id', $student->year_id)
            ->where('college_id', $student->college_id)
            ->where('is_active', true)
            ->whereNull('deleted_at')
            ->join('subjects', 'timetable_blocks.subject_id', '=', 'subjects.id')
            ->join('faculty', 'timetable_blocks.faculty_id', '=', 'faculty.id')
            ->join('users', 'faculty.user_id', '=', 'users.id')
            ->select(
                'timetable_blocks.*',
                'subjects.name as subject_name',
                'users.name as faculty_name'
            )
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get()
            ->groupBy('day_of_week');

        return response()->json([
            'success' => true,
            'data' => $timetable,
        ]);
    }

    /**
     * Helper: Calculate attendance statistics
     */
    private function getAttendanceStats(string $studentId, array $filters = []): array
    {
        $query = Attendance::where('student_id', $studentId);

        if (!empty($filters['from_date'])) {
            $query->where('date', '>=', $filters['from_date']);
        }

        if (!empty($filters['to_date'])) {
            $query->where('date', '<=', $filters['to_date']);
        }

        if (!empty($filters['subject_id'])) {
            $query->whereHas('timetableBlock', function ($q) use ($filters) {
                $q->where('subject_id', $filters['subject_id']);
            });
        }

        $total = $query->count();
        $present = (clone $query)->where('status', 'present')->count();
        $absent = (clone $query)->where('status', 'absent')->count();
        $late = (clone $query)->where('status', 'late')->count();

        $percentage = $total > 0 ? round(($present / $total) * 100, 2) : 0;

        return [
            'total_classes' => $total,
            'present' => $present,
            'absent' => $absent,
            'late' => $late,
            'percentage' => $percentage,
            'status' => $percentage >= 75 ? 'good' : 'warning',
        ];
    }

    /**
     * Helper: Get recent grades
     */
    private function getRecentGrades(string $studentId, int $limit = 5): array
    {
        return AssessmentSubmission::where('student_id', $studentId)
            ->whereNotNull('marks_obtained')
            ->with(['assessment.subject'])
            ->orderBy('submitted_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($submission) {
                return [
                    'subject' => $submission->assessment->subject->name ?? 'N/A',
                    'assessment_title' => $submission->assessment->title,
                    'marks_obtained' => $submission->marks_obtained,
                    'total_marks' => $submission->assessment->total_marks,
                    'percentage' => round(($submission->marks_obtained / $submission->assessment->total_marks) * 100, 2),
                    'grade' => $submission->grade,
                    'date' => $submission->submitted_at,
                ];
            })
            ->toArray();
    }

    /**
     * Helper: Get fee status
     */
    private function getFeeStatus(string $studentId): array
    {
        $student = Student::findOrFail($studentId);

        $feeStructure = DB::table('fee_structures')
            ->where('course_id', $student->course_id)
            ->where('year_id', $student->year_id)
            ->where('academic_year', date('Y'))
            ->first();

        $totalPaid = FeePayment::where('student_id', $studentId)
            ->where('status', 'completed')
            ->sum('amount');

        $totalFees = $feeStructure->total_amount ?? 0;
        $totalDue = $totalFees - $totalPaid;

        return [
            'total_fees' => $totalFees,
            'paid' => $totalPaid,
            'due' => $totalDue,
            'status' => $totalDue <= 0 ? 'paid' : 'pending',
        ];
    }

    /**
     * Helper: Get upcoming assessments
     */
    private function getUpcomingAssessments(string $studentId): array
    {
        $student = Student::findOrFail($studentId);

        return DB::table('assessments')
            ->where('course_id', $student->course_id)
            ->where('year_id', $student->year_id)
            ->where('due_date', '>=', now())
            ->whereNull('deleted_at')
            ->join('subjects', 'assessments.subject_id', '=', 'subjects.id')
            ->select(
                'assessments.id',
                'assessments.title',
                'assessments.type',
                'assessments.total_marks',
                'assessments.due_date',
                'subjects.name as subject_name'
            )
            ->orderBy('assessments.due_date')
            ->limit(5)
            ->get()
            ->toArray();
    }

    /**
     * Helper: Calculate grade statistics
     */
    private function getGradeStatistics(string $studentId, array $filters = []): array
    {
        $query = AssessmentSubmission::where('student_id', $studentId)
            ->whereNotNull('marks_obtained');

        if (!empty($filters['subject_id'])) {
            $query->whereHas('assessment', function ($q) use ($filters) {
                $q->where('subject_id', $filters['subject_id']);
            });
        }

        if (!empty($filters['from_date'])) {
            $query->where('submitted_at', '>=', $filters['from_date']);
        }

        if (!empty($filters['to_date'])) {
            $query->where('submitted_at', '<=', $filters['to_date']);
        }

        $submissions = $query->with('assessment')->get();

        if ($submissions->isEmpty()) {
            return [
                'average_percentage' => 0,
                'highest_score' => 0,
                'lowest_score' => 0,
                'total_assessments' => 0,
            ];
        }

        $percentages = $submissions->map(function ($submission) {
            return ($submission->marks_obtained / $submission->assessment->total_marks) * 100;
        });

        return [
            'average_percentage' => round($percentages->avg(), 2),
            'highest_score' => round($percentages->max(), 2),
            'lowest_score' => round($percentages->min(), 2),
            'total_assessments' => $submissions->count(),
        ];
    }
}
