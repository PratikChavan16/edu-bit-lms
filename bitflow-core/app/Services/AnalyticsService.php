<?php

namespace App\Services;

use App\Models\Student;
use App\Models\Attendance;
use App\Models\FeeInvoice;
use App\Models\LibraryResource;
use App\Models\Assessment;
use App\Models\AssessmentSubmission;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\AnalyticsExport;

class AnalyticsService
{
    /**
     * Get overall dashboard statistics
     */
    public function getDashboardStatistics(string $collegeId, array $filters = []): array
    {
        $startDate = $filters['start_date'] ?? now()->startOfMonth();
        $endDate = $filters['end_date'] ?? now()->endOfMonth();

        return [
            'total_students' => Student::where('college_id', $collegeId)->count(),
            'active_students' => Student::where('college_id', $collegeId)
                ->where('status', 'active')
                ->count(),
            'total_assessments' => Assessment::where('college_id', $collegeId)
                ->whereBetween('created_at', [$startDate, $endDate])
                ->count(),
            'average_attendance' => $this->calculateAverageAttendance($collegeId, $startDate, $endDate),
            'fee_collection' => [
                'total_expected' => FeeInvoice::whereHas('student', fn($q) => $q->where('college_id', $collegeId))
                    ->sum('total_amount'),
                'total_collected' => FeeInvoice::whereHas('student', fn($q) => $q->where('college_id', $collegeId))
                    ->sum('paid_amount'),
                'pending' => FeeInvoice::whereHas('student', fn($q) => $q->where('college_id', $collegeId))
                    ->whereIn('status', ['pending', 'partially_paid'])
                    ->count(),
            ],
            'library_stats' => [
                'total_resources' => LibraryResource::where('college_id', $collegeId)->count(),
                'issued_resources' => LibraryResource::where('college_id', $collegeId)
                    ->where('status', 'issued')
                    ->count(),
            ],
            'recent_activities' => $this->getRecentActivities($collegeId),
        ];
    }

    /**
     * Get student performance analytics
     */
    public function getStudentPerformanceAnalytics(string $collegeId, array $filters = []): array
    {
        $query = Student::where('college_id', $collegeId);

        if (!empty($filters['course_id'])) {
            $query->where('course_id', $filters['course_id']);
        }

        if (!empty($filters['year'])) {
            $query->where('year', $filters['year']);
        }

        $students = $query->with(['assessmentSubmissions.assessment'])->get();

        $performanceData = $students->map(function ($student) {
            $submissions = $student->assessmentSubmissions;
            $totalMarks = $submissions->sum('marks_obtained');
            $maxMarks = $submissions->sum(fn($s) => $s->assessment->total_marks);
            $percentage = $maxMarks > 0 ? ($totalMarks / $maxMarks) * 100 : 0;

            return [
                'student_id' => $student->id,
                'student_name' => $student->user->name,
                'roll_number' => $student->roll_number,
                'total_assessments' => $submissions->count(),
                'average_percentage' => round($percentage, 2),
                'grade' => $this->calculateGrade($percentage),
            ];
        });

        return [
            'total_students' => $students->count(),
            'class_average' => round($performanceData->avg('average_percentage'), 2),
            'top_performers' => $performanceData->sortByDesc('average_percentage')->take(10)->values(),
            'grade_distribution' => $this->calculateGradeDistribution($performanceData),
            'performance_trends' => $this->calculatePerformanceTrends($collegeId, $filters),
        ];
    }

    /**
     * Get attendance analytics
     */
    public function getAttendanceAnalytics(string $collegeId, array $filters = []): array
    {
        $startDate = $filters['start_date'] ?? now()->startOfMonth();
        $endDate = $filters['end_date'] ?? now()->endOfMonth();

        $query = Attendance::whereHas('student', fn($q) => $q->where('college_id', $collegeId))
            ->whereBetween('date', [$startDate, $endDate]);

        if (!empty($filters['course_id'])) {
            $query->whereHas('student', fn($q) => $q->where('course_id', $filters['course_id']));
        }

        if (!empty($filters['year'])) {
            $query->whereHas('student', fn($q) => $q->where('year', $filters['year']));
        }

        $attendanceRecords = $query->get();

        $totalRecords = $attendanceRecords->count();
        $presentCount = $attendanceRecords->where('status', 'present')->count();
        $absentCount = $attendanceRecords->where('status', 'absent')->count();
        $lateCount = $attendanceRecords->where('status', 'late')->count();

        return [
            'overall_percentage' => $totalRecords > 0 ? round(($presentCount / $totalRecords) * 100, 2) : 0,
            'total_records' => $totalRecords,
            'status_breakdown' => [
                'present' => $presentCount,
                'absent' => $absentCount,
                'late' => $lateCount,
                'excused' => $attendanceRecords->where('status', 'excused')->count(),
            ],
            'daily_trends' => $this->calculateDailyAttendanceTrends($attendanceRecords),
            'low_attendance_students' => $this->getLowAttendanceStudents($collegeId, $startDate, $endDate),
        ];
    }

    /**
     * Get fee collection analytics
     */
    public function getFeeCollectionAnalytics(string $collegeId, array $filters = []): array
    {
        $query = FeeInvoice::whereHas('student', fn($q) => $q->where('college_id', $collegeId));

        if (!empty($filters['academic_year'])) {
            $query->whereHas('feeStructure', fn($q) => $q->where('academic_year', $filters['academic_year']));
        }

        if (!empty($filters['course_id'])) {
            $query->whereHas('student', fn($q) => $q->where('course_id', $filters['course_id']));
        }

        $invoices = $query->get();

        $totalExpected = $invoices->sum('total_amount');
        $totalCollected = $invoices->sum('paid_amount');
        $collectionRate = $totalExpected > 0 ? ($totalCollected / $totalExpected) * 100 : 0;

        return [
            'total_expected' => $totalExpected,
            'total_collected' => $totalCollected,
            'total_pending' => $totalExpected - $totalCollected,
            'collection_rate' => round($collectionRate, 2),
            'status_breakdown' => [
                'paid' => $invoices->where('status', 'paid')->count(),
                'partially_paid' => $invoices->where('status', 'partially_paid')->count(),
                'pending' => $invoices->where('status', 'pending')->count(),
                'overdue' => $invoices->where('status', 'overdue')->count(),
            ],
            'monthly_collection' => $this->calculateMonthlyCollection($invoices),
            'defaulters' => $this->getDefaulters($collegeId),
        ];
    }

    /**
     * Get library usage analytics
     */
    public function getLibraryUsageAnalytics(string $collegeId, array $filters = []): array
    {
        $startDate = $filters['start_date'] ?? now()->startOfMonth();
        $endDate = $filters['end_date'] ?? now()->endOfMonth();

        $resources = LibraryResource::where('college_id', $collegeId)->get();

        return [
            'total_resources' => $resources->count(),
            'available' => $resources->where('status', 'available')->count(),
            'issued' => $resources->where('status', 'issued')->count(),
            'reserved' => $resources->where('status', 'reserved')->count(),
            'resource_type_distribution' => $resources->groupBy('type')->map->count(),
            'most_issued_resources' => $this->getMostIssuedResources($collegeId, $startDate, $endDate),
            'overdue_resources' => LibraryResource::where('college_id', $collegeId)
                ->where('status', 'issued')
                ->where('due_date', '<', now())
                ->count(),
        ];
    }

    /**
     * Get assessment analytics
     */
    public function getAssessmentAnalytics(string $collegeId, array $filters = []): array
    {
        $query = Assessment::where('college_id', $collegeId);

        if (!empty($filters['course_id'])) {
            $query->where('course_id', $filters['course_id']);
        }

        if (!empty($filters['subject_id'])) {
            $query->where('subject_id', $filters['subject_id']);
        }

        $assessments = $query->with('submissions')->get();

        return [
            'total_assessments' => $assessments->count(),
            'total_submissions' => $assessments->sum(fn($a) => $a->submissions->count()),
            'average_score' => $this->calculateAverageAssessmentScore($assessments),
            'type_distribution' => $assessments->groupBy('type')->map->count(),
            'difficulty_analysis' => $this->analyzeDifficulty($assessments),
            'submission_trends' => $this->calculateSubmissionTrends($assessments),
        ];
    }

    /**
     * Export analytics to PDF
     */
    public function exportToPdf(string $collegeId, string $reportType, array $filters = []): mixed
    {
        $data = $this->getReportData($collegeId, $reportType, $filters);
        
        $pdf = Pdf::loadView('reports.analytics-pdf', [
            'report_type' => $reportType,
            'data' => $data,
            'generated_at' => now(),
        ]);

        return $pdf->download('analytics-report-' . $reportType . '-' . now()->format('Y-m-d') . '.pdf');
    }

    /**
     * Export analytics to Excel
     */
    public function exportToExcel(string $collegeId, string $reportType, array $filters = []): mixed
    {
        $data = $this->getReportData($collegeId, $reportType, $filters);
        
        return Excel::download(
            new AnalyticsExport($reportType, $data),
            'analytics-report-' . $reportType . '-' . now()->format('Y-m-d') . '.xlsx'
        );
    }

    // Helper methods

    private function calculateAverageAttendance(string $collegeId, $startDate, $endDate): float
    {
        $attendance = Attendance::whereHas('student', fn($q) => $q->where('college_id', $collegeId))
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        $total = $attendance->count();
        $present = $attendance->whereIn('status', ['present', 'late'])->count();

        return $total > 0 ? round(($present / $total) * 100, 2) : 0;
    }

    private function getRecentActivities(string $collegeId): array
    {
        // Placeholder for recent activities
        return [];
    }

    private function calculateGrade(float $percentage): string
    {
        return match(true) {
            $percentage >= 90 => 'A+',
            $percentage >= 80 => 'A',
            $percentage >= 70 => 'B+',
            $percentage >= 60 => 'B',
            $percentage >= 50 => 'C',
            $percentage >= 40 => 'D',
            default => 'F',
        };
    }

    private function calculateGradeDistribution($performanceData): array
    {
        return [
            'A+' => $performanceData->where('grade', 'A+')->count(),
            'A' => $performanceData->where('grade', 'A')->count(),
            'B+' => $performanceData->where('grade', 'B+')->count(),
            'B' => $performanceData->where('grade', 'B')->count(),
            'C' => $performanceData->where('grade', 'C')->count(),
            'D' => $performanceData->where('grade', 'D')->count(),
            'F' => $performanceData->where('grade', 'F')->count(),
        ];
    }

    private function calculatePerformanceTrends(string $collegeId, array $filters): array
    {
        // Placeholder for performance trends calculation
        return [];
    }

    private function calculateDailyAttendanceTrends($attendanceRecords): array
    {
        return $attendanceRecords->groupBy(fn($record) => $record->date->format('Y-m-d'))
            ->map(function ($dayRecords) {
                $total = $dayRecords->count();
                $present = $dayRecords->where('status', 'present')->count();
                return [
                    'total' => $total,
                    'present' => $present,
                    'percentage' => $total > 0 ? round(($present / $total) * 100, 2) : 0,
                ];
            })
            ->toArray();
    }

    private function getLowAttendanceStudents(string $collegeId, $startDate, $endDate): array
    {
        // Students with < 75% attendance
        return Student::where('college_id', $collegeId)
            ->with('attendances')
            ->get()
            ->map(function ($student) use ($startDate, $endDate) {
                $records = $student->attendances()
                    ->whereBetween('date', [$startDate, $endDate])
                    ->get();
                $total = $records->count();
                $present = $records->where('status', 'present')->count();
                $percentage = $total > 0 ? ($present / $total) * 100 : 0;

                return [
                    'student_id' => $student->id,
                    'name' => $student->user->name,
                    'attendance_percentage' => round($percentage, 2),
                ];
            })
            ->filter(fn($s) => $s['attendance_percentage'] < 75)
            ->values()
            ->toArray();
    }

    private function calculateMonthlyCollection($invoices): array
    {
        return $invoices->groupBy(fn($invoice) => $invoice->created_at->format('Y-m'))
            ->map(fn($monthInvoices) => [
                'expected' => $monthInvoices->sum('total_amount'),
                'collected' => $monthInvoices->sum('paid_amount'),
            ])
            ->toArray();
    }

    private function getDefaulters(string $collegeId): array
    {
        return FeeInvoice::whereHas('student', fn($q) => $q->where('college_id', $collegeId))
            ->where('status', 'overdue')
            ->with('student.user')
            ->get()
            ->map(fn($invoice) => [
                'student_id' => $invoice->student_id,
                'name' => $invoice->student->user->name,
                'amount_pending' => $invoice->total_amount - $invoice->paid_amount,
                'due_date' => $invoice->due_date,
            ])
            ->toArray();
    }

    private function getMostIssuedResources(string $collegeId, $startDate, $endDate): array
    {
        // Placeholder - would need issue history table
        return [];
    }

    private function calculateAverageAssessmentScore($assessments): float
    {
        $totalSubmissions = $assessments->sum(fn($a) => $a->submissions->count());
        if ($totalSubmissions == 0) return 0;

        $totalPercentage = $assessments->sum(function ($assessment) {
            return $assessment->submissions->sum(function ($submission) use ($assessment) {
                return $assessment->total_marks > 0 
                    ? ($submission->marks_obtained / $assessment->total_marks) * 100 
                    : 0;
            });
        });

        return round($totalPercentage / $totalSubmissions, 2);
    }

    private function analyzeDifficulty($assessments): array
    {
        return $assessments->map(function ($assessment) {
            $avgScore = $assessment->submissions->avg('marks_obtained');
            $percentage = $assessment->total_marks > 0 ? ($avgScore / $assessment->total_marks) * 100 : 0;

            return [
                'assessment_id' => $assessment->id,
                'title' => $assessment->title,
                'average_score' => round($percentage, 2),
                'difficulty' => match(true) {
                    $percentage >= 80 => 'Easy',
                    $percentage >= 60 => 'Medium',
                    default => 'Hard',
                },
            ];
        })->toArray();
    }

    private function calculateSubmissionTrends($assessments): array
    {
        return $assessments->map(function ($assessment) {
            return [
                'assessment_id' => $assessment->id,
                'title' => $assessment->title,
                'total_submissions' => $assessment->submissions->count(),
                'on_time' => $assessment->submissions->where('submitted_at', '<=', $assessment->due_date)->count(),
                'late' => $assessment->submissions->where('submitted_at', '>', $assessment->due_date)->count(),
            ];
        })->toArray();
    }

    private function getReportData(string $collegeId, string $reportType, array $filters): array
    {
        return match($reportType) {
            'dashboard' => $this->getDashboardStatistics($collegeId, $filters),
            'student_performance' => $this->getStudentPerformanceAnalytics($collegeId, $filters),
            'attendance' => $this->getAttendanceAnalytics($collegeId, $filters),
            'fee_collection' => $this->getFeeCollectionAnalytics($collegeId, $filters),
            'library' => $this->getLibraryUsageAnalytics($collegeId, $filters),
            'assessments' => $this->getAssessmentAnalytics($collegeId, $filters),
            default => [],
        };
    }
}
