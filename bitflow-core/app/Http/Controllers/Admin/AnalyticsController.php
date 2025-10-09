<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\AnalyticsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function __construct(
        private AnalyticsService $analyticsService
    ) {}

    /**
     * Get overall dashboard statistics
     */
    public function dashboard(Request $request): JsonResponse
    {
        $collegeId = $request->user()->college_id;
        
        $data = $this->analyticsService->getDashboardStatistics($collegeId, [
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
        ]);

        return response()->json($data);
    }

    /**
     * Get student performance analytics
     */
    public function studentPerformance(Request $request): JsonResponse
    {
        $request->validate([
            'course_id' => 'nullable|uuid|exists:courses,id',
            'year' => 'nullable|integer|min:1|max:4',
            'semester' => 'nullable|integer|min:1|max:2',
        ]);

        $collegeId = $request->user()->college_id;
        
        $data = $this->analyticsService->getStudentPerformanceAnalytics($collegeId, [
            'course_id' => $request->input('course_id'),
            'year' => $request->input('year'),
            'semester' => $request->input('semester'),
        ]);

        return response()->json($data);
    }

    /**
     * Get attendance analytics
     */
    public function attendance(Request $request): JsonResponse
    {
        $request->validate([
            'course_id' => 'nullable|uuid|exists:courses,id',
            'year' => 'nullable|integer|min:1|max:4',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $collegeId = $request->user()->college_id;
        
        $data = $this->analyticsService->getAttendanceAnalytics($collegeId, [
            'course_id' => $request->input('course_id'),
            'year' => $request->input('year'),
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
        ]);

        return response()->json($data);
    }

    /**
     * Get fee collection analytics
     */
    public function feeCollection(Request $request): JsonResponse
    {
        $request->validate([
            'academic_year' => 'nullable|string',
            'course_id' => 'nullable|uuid|exists:courses,id',
        ]);

        $collegeId = $request->user()->college_id;
        
        $data = $this->analyticsService->getFeeCollectionAnalytics($collegeId, [
            'academic_year' => $request->input('academic_year'),
            'course_id' => $request->input('course_id'),
        ]);

        return response()->json($data);
    }

    /**
     * Get library usage analytics
     */
    public function libraryUsage(Request $request): JsonResponse
    {
        $collegeId = $request->user()->college_id;
        
        $data = $this->analyticsService->getLibraryUsageAnalytics($collegeId, [
            'start_date' => $request->input('start_date'),
            'end_date' => $request->input('end_date'),
        ]);

        return response()->json($data);
    }

    /**
     * Get assessment analytics
     */
    public function assessments(Request $request): JsonResponse
    {
        $request->validate([
            'course_id' => 'nullable|uuid|exists:courses,id',
            'subject_id' => 'nullable|uuid|exists:subjects,id',
        ]);

        $collegeId = $request->user()->college_id;
        
        $data = $this->analyticsService->getAssessmentAnalytics($collegeId, [
            'course_id' => $request->input('course_id'),
            'subject_id' => $request->input('subject_id'),
        ]);

        return response()->json($data);
    }

    /**
     * Export analytics report as PDF
     */
    public function exportPdf(Request $request): mixed
    {
        $request->validate([
            'report_type' => 'required|in:dashboard,student_performance,attendance,fee_collection,library,assessments',
            'filters' => 'nullable|array',
        ]);

        $collegeId = $request->user()->college_id;
        $reportType = $request->input('report_type');
        $filters = $request->input('filters', []);

        return $this->analyticsService->exportToPdf($collegeId, $reportType, $filters);
    }

    /**
     * Export analytics report as Excel
     */
    public function exportExcel(Request $request): mixed
    {
        $request->validate([
            'report_type' => 'required|in:dashboard,student_performance,attendance,fee_collection,library,assessments',
            'filters' => 'nullable|array',
        ]);

        $collegeId = $request->user()->college_id;
        $reportType = $request->input('report_type');
        $filters = $request->input('filters', []);

        return $this->analyticsService->exportToExcel($collegeId, $reportType, $filters);
    }
}
