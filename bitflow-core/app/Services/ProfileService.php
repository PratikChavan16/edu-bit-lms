<?php

namespace App\Services;

use App\Models\Student;
use App\Models\Attendance;
use App\Models\FeeInvoice;
use App\Models\AssessmentSubmission;
use App\Models\TimetableBlock;
use App\Models\LibraryResource;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class ProfileService
{
    /**
     * Get complete student profile with all data
     */
    public function getCompleteProfile(string $studentId): array
    {
        $student = Student::with([
            'user',
            'course',
            'attendances',
            'feeInvoices',
            'assessmentSubmissions.assessment',
        ])->findOrFail($studentId);

        // Calculate attendance percentage
        $totalAttendance = $student->attendances->count();
        $presentCount = $student->attendances->whereIn('status', ['present', 'late'])->count();
        $attendancePercentage = $totalAttendance > 0 ? round(($presentCount / $totalAttendance) * 100, 2) : 0;

        // Calculate fee status
        $totalFees = $student->feeInvoices->sum('total_amount');
        $paidFees = $student->feeInvoices->sum('paid_amount');
        $pendingFees = $totalFees - $paidFees;

        // Calculate academic performance
        $submissions = $student->assessmentSubmissions;
        $totalMarks = $submissions->sum('marks_obtained');
        $maxMarks = $submissions->sum(fn($s) => $s->assessment->total_marks ?? 0);
        $averagePercentage = $maxMarks > 0 ? round(($totalMarks / $maxMarks) * 100, 2) : 0;

        return [
            'id' => $student->id,
            'user' => [
                'name' => $student->user->name,
                'email' => $student->user->email,
                'profile_picture' => $student->profile_picture_url ?? null,
            ],
            'roll_number' => $student->roll_number,
            'admission_number' => $student->admission_number,
            'course' => [
                'id' => $student->course->id,
                'name' => $student->course->name,
            ],
            'year' => $student->year,
            'semester' => $student->semester,
            'batch' => $student->batch,
            'status' => $student->status,
            'phone' => $student->phone,
            'emergency_contact' => $student->emergency_contact,
            'address' => $student->address,
            'bio' => $student->bio,
            'quick_stats' => [
                'attendance_percentage' => $attendancePercentage,
                'pending_fees' => $pendingFees,
                'average_performance' => $averagePercentage,
                'total_assessments' => $submissions->count(),
            ],
        ];
    }

    /**
     * Get attendance data with graph data points
     */
    public function getAttendanceData(string $studentId, array $filters = []): array
    {
        $startDate = $filters['start_date'] ?? now()->startOfMonth();
        $endDate = $filters['end_date'] ?? now()->endOfMonth();

        $query = Attendance::where('student_id', $studentId)
            ->whereBetween('date', [$startDate, $endDate]);

        if (!empty($filters['subject_id'])) {
            $query->where('subject_id', $filters['subject_id']);
        }

        $attendances = $query->with('subject')->orderBy('date')->get();

        // Overall statistics
        $totalDays = $attendances->count();
        $presentDays = $attendances->whereIn('status', ['present', 'late'])->count();
        $absentDays = $attendances->where('status', 'absent')->count();
        $excusedDays = $attendances->where('status', 'excused')->count();
        $percentage = $totalDays > 0 ? round(($presentDays / $totalDays) * 100, 2) : 0;

        // Graph data - daily attendance
        $dailyData = $attendances->groupBy(fn($a) => $a->date->format('Y-m-d'))
            ->map(function ($dayAttendances, $date) {
                $present = $dayAttendances->whereIn('status', ['present', 'late'])->count();
                $total = $dayAttendances->count();
                
                return [
                    'date' => $date,
                    'total' => $total,
                    'present' => $present,
                    'absent' => $dayAttendances->where('status', 'absent')->count(),
                    'percentage' => $total > 0 ? round(($present / $total) * 100, 2) : 0,
                ];
            })
            ->values();

        // Subject-wise breakdown
        $subjectWise = $attendances->groupBy('subject_id')
            ->map(function ($subjectAttendances) {
                $total = $subjectAttendances->count();
                $present = $subjectAttendances->whereIn('status', ['present', 'late'])->count();
                
                return [
                    'subject_id' => $subjectAttendances->first()->subject_id,
                    'subject_name' => $subjectAttendances->first()->subject->name ?? 'Unknown',
                    'total' => $total,
                    'present' => $present,
                    'absent' => $subjectAttendances->where('status', 'absent')->count(),
                    'percentage' => $total > 0 ? round(($present / $total) * 100, 2) : 0,
                ];
            })
            ->values();

        // Status color coding for graph
        $statusColors = [
            'present' => '#10b981',
            'absent' => '#ef4444',
            'late' => '#f59e0b',
            'excused' => '#6366f1',
        ];

        return [
            'summary' => [
                'total_days' => $totalDays,
                'present_days' => $presentDays,
                'absent_days' => $absentDays,
                'excused_days' => $excusedDays,
                'attendance_percentage' => $percentage,
                'status' => $this->getAttendanceStatus($percentage),
            ],
            'graph_data' => [
                'daily' => $dailyData,
                'colors' => $statusColors,
            ],
            'subject_wise' => $subjectWise,
            'recent_records' => $attendances->take(10)->map(fn($a) => [
                'date' => $a->date->format('Y-m-d'),
                'subject' => $a->subject->name ?? 'Unknown',
                'status' => $a->status,
                'remarks' => $a->remarks,
            ]),
        ];
    }

    /**
     * Get fee status with detailed breakdown
     */
    public function getFeeStatus(string $studentId): array
    {
        $student = Student::with('feeInvoices.feeStructure')->findOrFail($studentId);
        $invoices = $student->feeInvoices;

        $totalAmount = $invoices->sum('total_amount');
        $paidAmount = $invoices->sum('paid_amount');
        $pendingAmount = $totalAmount - $paidAmount;
        $discountAmount = $invoices->sum('discount_amount');
        $lateFeeAmount = $invoices->sum('late_fee_amount');

        // Payment progress percentage
        $paymentProgress = $totalAmount > 0 ? round(($paidAmount / $totalAmount) * 100, 2) : 0;

        // Invoice breakdown
        $invoiceList = $invoices->map(fn($invoice) => [
            'id' => $invoice->id,
            'invoice_number' => $invoice->invoice_number,
            'fee_structure' => $invoice->feeStructure->name ?? 'N/A',
            'academic_year' => $invoice->feeStructure->academic_year ?? 'N/A',
            'total_amount' => $invoice->total_amount,
            'paid_amount' => $invoice->paid_amount,
            'pending_amount' => $invoice->total_amount - $invoice->paid_amount,
            'discount_amount' => $invoice->discount_amount,
            'late_fee_amount' => $invoice->late_fee_amount,
            'due_date' => $invoice->due_date->format('Y-m-d'),
            'status' => $invoice->status,
            'is_overdue' => $invoice->due_date->isPast() && $invoice->status !== 'paid',
        ]);

        // Upcoming payments (next 30 days)
        $upcomingPayments = $invoices
            ->where('status', '!=', 'paid')
            ->filter(fn($invoice) => $invoice->due_date->isFuture() && $invoice->due_date->diffInDays(now()) <= 30)
            ->map(fn($invoice) => [
                'invoice_number' => $invoice->invoice_number,
                'amount_due' => $invoice->total_amount - $invoice->paid_amount,
                'due_date' => $invoice->due_date->format('Y-m-d'),
                'days_remaining' => $invoice->due_date->diffInDays(now()),
            ]);

        // Overdue invoices
        $overdueInvoices = $invoices
            ->where('status', '!=', 'paid')
            ->filter(fn($invoice) => $invoice->due_date->isPast())
            ->map(fn($invoice) => [
                'invoice_number' => $invoice->invoice_number,
                'amount_due' => $invoice->total_amount - $invoice->paid_amount,
                'due_date' => $invoice->due_date->format('Y-m-d'),
                'days_overdue' => now()->diffInDays($invoice->due_date),
                'late_fee' => $invoice->late_fee_amount,
            ]);

        return [
            'summary' => [
                'total_amount' => $totalAmount,
                'paid_amount' => $paidAmount,
                'pending_amount' => $pendingAmount,
                'discount_amount' => $discountAmount,
                'late_fee_amount' => $lateFeeAmount,
                'payment_progress' => $paymentProgress,
                'status' => $this->getFeePaymentStatus($paymentProgress),
            ],
            'widget_data' => [
                'progress_percentage' => $paymentProgress,
                'amount_paid' => $paidAmount,
                'amount_pending' => $pendingAmount,
                'next_due_date' => $upcomingPayments->first()['due_date'] ?? null,
            ],
            'invoices' => $invoiceList,
            'upcoming_payments' => $upcomingPayments->values(),
            'overdue_invoices' => $overdueInvoices->values(),
        ];
    }

    /**
     * Get academic performance summary
     */
    public function getPerformanceSummary(string $studentId): array
    {
        $student = Student::with('assessmentSubmissions.assessment.subject')->findOrFail($studentId);
        $submissions = $student->assessmentSubmissions;

        $totalSubmissions = $submissions->count();
        $totalMarks = $submissions->sum('marks_obtained');
        $maxMarks = $submissions->sum(fn($s) => $s->assessment->total_marks ?? 0);
        $averagePercentage = $maxMarks > 0 ? round(($totalMarks / $maxMarks) * 100, 2) : 0;

        // Subject-wise performance
        $subjectWise = $submissions->groupBy(fn($s) => $s->assessment->subject_id)
            ->map(function ($subjectSubmissions) {
                $totalMarks = $subjectSubmissions->sum('marks_obtained');
                $maxMarks = $subjectSubmissions->sum(fn($s) => $s->assessment->total_marks ?? 0);
                $percentage = $maxMarks > 0 ? round(($totalMarks / $maxMarks) * 100, 2) : 0;

                return [
                    'subject_name' => $subjectSubmissions->first()->assessment->subject->name ?? 'Unknown',
                    'total_assessments' => $subjectSubmissions->count(),
                    'average_percentage' => $percentage,
                    'grade' => $this->calculateGrade($percentage),
                ];
            })
            ->values();

        return [
            'overall' => [
                'total_assessments' => $totalSubmissions,
                'average_percentage' => $averagePercentage,
                'grade' => $this->calculateGrade($averagePercentage),
            ],
            'subject_wise' => $subjectWise,
            'recent_submissions' => $submissions->sortByDesc('submitted_at')->take(5)->map(fn($s) => [
                'assessment_title' => $s->assessment->title,
                'subject' => $s->assessment->subject->name ?? 'Unknown',
                'marks_obtained' => $s->marks_obtained,
                'total_marks' => $s->assessment->total_marks,
                'percentage' => $s->assessment->total_marks > 0 
                    ? round(($s->marks_obtained / $s->assessment->total_marks) * 100, 2) 
                    : 0,
                'submitted_at' => $s->submitted_at->format('Y-m-d H:i:s'),
            ]),
        ];
    }

    /**
     * Get student's timetable
     */
    public function getTimetable(string $studentId): array
    {
        $student = Student::findOrFail($studentId);

        $timetable = TimetableBlock::where('college_id', $student->college_id)
            ->where('course_id', $student->course_id)
            ->where('year', $student->year)
            ->where('semester', $student->semester)
            ->where('is_active', true)
            ->where('effective_from', '<=', now())
            ->where('effective_to', '>=', now())
            ->with(['subject', 'faculty.user'])
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        $groupedByDay = $timetable->groupBy('day_of_week')
            ->map(fn($blocks) => $blocks->map(fn($block) => [
                'id' => $block->id,
                'subject' => $block->subject->name ?? 'Unknown',
                'faculty' => $block->faculty->user->name ?? 'Unknown',
                'start_time' => $block->start_time,
                'end_time' => $block->end_time,
                'room_number' => $block->room_number,
                'type' => $block->type,
            ]));

        return [
            'current_week' => $groupedByDay,
            'total_classes' => $timetable->count(),
        ];
    }

    /**
     * Get library resources issued to student
     */
    public function getLibraryResources(string $studentId): array
    {
        $student = Student::findOrFail($studentId);

        $resources = LibraryResource::where('issued_to_id', $student->user_id)
            ->where('issued_to_type', 'student')
            ->with('category')
            ->get();

        return [
            'total_issued' => $resources->count(),
            'overdue' => $resources->where('status', 'issued')
                ->filter(fn($r) => $r->due_date && $r->due_date->isPast())
                ->count(),
            'resources' => $resources->map(fn($r) => [
                'id' => $r->id,
                'title' => $r->title,
                'author' => $r->author,
                'type' => $r->type,
                'isbn' => $r->isbn,
                'issued_at' => $r->issued_at?->format('Y-m-d'),
                'due_date' => $r->due_date?->format('Y-m-d'),
                'status' => $r->status,
                'is_overdue' => $r->due_date && $r->due_date->isPast() && $r->status === 'issued',
            ]),
        ];
    }

    /**
     * Update student profile
     */
    public function updateProfile(string $studentId, array $data): array
    {
        $student = Student::findOrFail($studentId);
        $student->update($data);

        return $this->getCompleteProfile($studentId);
    }

    /**
     * Upload profile picture
     */
    public function uploadProfilePicture(string $studentId, UploadedFile $file): string
    {
        $student = Student::findOrFail($studentId);

        // Delete old profile picture if exists
        if ($student->profile_picture) {
            Storage::disk('public')->delete($student->profile_picture);
        }

        $path = $file->store('profile-pictures', 'public');
        
        $student->update(['profile_picture' => $path]);

        return Storage::url($path);
    }

    // Helper methods

    private function getAttendanceStatus(float $percentage): string
    {
        return match(true) {
            $percentage >= 75 => 'good',
            $percentage >= 60 => 'average',
            default => 'low',
        };
    }

    private function getFeePaymentStatus(float $progress): string
    {
        return match(true) {
            $progress >= 100 => 'paid',
            $progress >= 50 => 'partial',
            $progress > 0 => 'pending',
            default => 'unpaid',
        };
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
}
