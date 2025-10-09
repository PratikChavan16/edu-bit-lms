<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class AnalyticsExport implements FromArray, WithHeadings, WithStyles, WithTitle
{
    public function __construct(
        private string $reportType,
        private array $data
    ) {}

    /**
     * Return the array data for the export
     */
    public function array(): array
    {
        return $this->formatDataForExport();
    }

    /**
     * Set the headings for the export
     */
    public function headings(): array
    {
        return match($this->reportType) {
            'dashboard' => ['Metric', 'Value'],
            'student_performance' => ['Student ID', 'Name', 'Roll Number', 'Total Assessments', 'Average %', 'Grade'],
            'attendance' => ['Metric', 'Count', 'Percentage'],
            'fee_collection' => ['Metric', 'Amount (₹)'],
            'library' => ['Metric', 'Count'],
            'assessments' => ['Assessment ID', 'Title', 'Type', 'Average Score', 'Difficulty'],
            default => ['Data'],
        };
    }

    /**
     * Apply styles to the worksheet
     */
    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 12], 'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => 'E2E8F0']]],
        ];
    }

    /**
     * Set the title of the worksheet
     */
    public function title(): string
    {
        return ucfirst(str_replace('_', ' ', $this->reportType));
    }

    /**
     * Format data based on report type
     */
    private function formatDataForExport(): array
    {
        return match($this->reportType) {
            'dashboard' => $this->formatDashboardData(),
            'student_performance' => $this->formatStudentPerformanceData(),
            'attendance' => $this->formatAttendanceData(),
            'fee_collection' => $this->formatFeeCollectionData(),
            'library' => $this->formatLibraryData(),
            'assessments' => $this->formatAssessmentsData(),
            default => [],
        };
    }

    private function formatDashboardData(): array
    {
        return [
            ['Total Students', $this->data['total_students'] ?? 0],
            ['Active Students', $this->data['active_students'] ?? 0],
            ['Total Assessments', $this->data['total_assessments'] ?? 0],
            ['Average Attendance %', $this->data['average_attendance'] ?? 0],
            ['Fee Collection - Expected', $this->data['fee_collection']['total_expected'] ?? 0],
            ['Fee Collection - Collected', $this->data['fee_collection']['total_collected'] ?? 0],
            ['Library - Total Resources', $this->data['library_stats']['total_resources'] ?? 0],
            ['Library - Issued Resources', $this->data['library_stats']['issued_resources'] ?? 0],
        ];
    }

    private function formatStudentPerformanceData(): array
    {
        $rows = [];
        foreach (($this->data['top_performers'] ?? []) as $student) {
            $rows[] = [
                $student['student_id'],
                $student['student_name'],
                $student['roll_number'],
                $student['total_assessments'],
                $student['average_percentage'],
                $student['grade'],
            ];
        }
        return $rows;
    }

    private function formatAttendanceData(): array
    {
        return [
            ['Overall Attendance', '', $this->data['overall_percentage'] ?? 0],
            ['Total Records', $this->data['total_records'] ?? 0, ''],
            ['Present', $this->data['status_breakdown']['present'] ?? 0, ''],
            ['Absent', $this->data['status_breakdown']['absent'] ?? 0, ''],
            ['Late', $this->data['status_breakdown']['late'] ?? 0, ''],
            ['Excused', $this->data['status_breakdown']['excused'] ?? 0, ''],
        ];
    }

    private function formatFeeCollectionData(): array
    {
        return [
            ['Total Expected', $this->data['total_expected'] ?? 0],
            ['Total Collected', $this->data['total_collected'] ?? 0],
            ['Total Pending', $this->data['total_pending'] ?? 0],
            ['Collection Rate %', $this->data['collection_rate'] ?? 0],
            ['Paid Invoices', $this->data['status_breakdown']['paid'] ?? 0],
            ['Partially Paid', $this->data['status_breakdown']['partially_paid'] ?? 0],
            ['Pending Invoices', $this->data['status_breakdown']['pending'] ?? 0],
            ['Overdue Invoices', $this->data['status_breakdown']['overdue'] ?? 0],
        ];
    }

    private function formatLibraryData(): array
    {
        return [
            ['Total Resources', $this->data['total_resources'] ?? 0],
            ['Available', $this->data['available'] ?? 0],
            ['Issued', $this->data['issued'] ?? 0],
            ['Reserved', $this->data['reserved'] ?? 0],
            ['Overdue', $this->data['overdue_resources'] ?? 0],
        ];
    }

    private function formatAssessmentsData(): array
    {
        $rows = [];
        foreach (($this->data['difficulty_analysis'] ?? []) as $assessment) {
            $rows[] = [
                $assessment['assessment_id'],
                $assessment['title'],
                '',
                $assessment['average_score'],
                $assessment['difficulty'],
            ];
        }
        return $rows;
    }
}
