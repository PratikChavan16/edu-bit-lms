<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use App\Http\Responses\ApiResponse;
use App\Exceptions\ApiException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReportController extends Controller
{
    protected ReportService $reportService;
    
    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }
    
    /**
     * Generate a university report
     */
    public function generateUniversityReport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'filters' => 'array',
            'filters.status' => 'array',
            'filters.status.*' => 'in:active,inactive,suspended',
            'filters.established_year.min' => 'integer|min:1800',
            'filters.established_year.max' => 'integer|max:' . date('Y'),
            'filters.name' => 'string|max:255',
            'options.paper' => 'in:a4,letter,legal',
            'options.orientation' => 'in:portrait,landscape',
            'options.download' => 'boolean',
        ]);
        
        if ($validator->fails()) {
            throw ApiException::validation($validator->errors()->toArray());
        }
        
        try {
            $filters = $request->input('filters', []);
            $options = $request->input('options', []);
            
            $pdfContent = $this->reportService->generateUniversityReport($filters, $options);
            
            if ($request->input('options.download', true)) {
                return response()->streamDownload(
                    fn () => print($pdfContent),
                    'universities_report_' . now()->format('Y-m-d_His') . '.pdf',
                    ['Content-Type' => 'application/pdf']
                );
            }
            
            return response($pdfContent, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="universities_report.pdf"',
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to generate university report: ' . $e->getMessage());
            throw ApiException::serverError('Failed to generate report');
        }
    }
    
    /**
     * Generate a college report
     */
    public function generateCollegeReport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'filters' => 'array',
            'filters.university_id' => 'uuid|exists:universities,id',
            'filters.type' => 'array',
            'filters.type.*' => 'in:engineering,medical,arts,science,commerce,law,other',
            'filters.status' => 'array',
            'filters.status.*' => 'in:active,inactive,suspended',
            'filters.name' => 'string|max:255',
            'options.paper' => 'in:a4,letter,legal',
            'options.orientation' => 'in:portrait,landscape',
            'options.download' => 'boolean',
        ]);
        
        if ($validator->fails()) {
            throw ApiException::validation($validator->errors()->toArray());
        }
        
        try {
            $filters = $request->input('filters', []);
            $options = $request->input('options', []);
            
            $pdfContent = $this->reportService->generateCollegeReport($filters, $options);
            
            if ($request->input('options.download', true)) {
                return response()->streamDownload(
                    fn () => print($pdfContent),
                    'colleges_report_' . now()->format('Y-m-d_His') . '.pdf',
                    ['Content-Type' => 'application/pdf']
                );
            }
            
            return response($pdfContent, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="colleges_report.pdf"',
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to generate college report: ' . $e->getMessage());
            throw ApiException::serverError('Failed to generate report');
        }
    }
    
    /**
     * Generate a users report
     */
    public function generateUsersReport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'filters' => 'array',
            'filters.role' => 'array',
            'filters.role.*' => 'in:super_admin,university_owner,college_admin,teacher,student',
            'filters.status' => 'array',
            'filters.status.*' => 'in:active,inactive,suspended',
            'filters.created_at.from' => 'date',
            'filters.created_at.to' => 'date|after_or_equal:filters.created_at.from',
            'options.paper' => 'in:a4,letter,legal',
            'options.orientation' => 'in:portrait,landscape',
            'options.download' => 'boolean',
        ]);
        
        if ($validator->fails()) {
            throw ApiException::validation($validator->errors()->toArray());
        }
        
        try {
            $filters = $request->input('filters', []);
            $options = $request->input('options', []);
            
            $pdfContent = $this->reportService->generateUsersReport($filters, $options);
            
            if ($request->input('options.download', true)) {
                return response()->streamDownload(
                    fn () => print($pdfContent),
                    'users_report_' . now()->format('Y-m-d_His') . '.pdf',
                    ['Content-Type' => 'application/pdf']
                );
            }
            
            return response($pdfContent, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="users_report.pdf"',
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to generate users report: ' . $e->getMessage());
            throw ApiException::serverError('Failed to generate report');
        }
    }
    
    /**
     * Generate a custom report
     */
    public function generateCustomReport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'template' => 'required|string|max:100',
            'data' => 'required|array',
            'options.paper' => 'in:a4,letter,legal',
            'options.orientation' => 'in:portrait,landscape',
            'options.download' => 'boolean',
        ]);
        
        if ($validator->fails()) {
            throw ApiException::validation($validator->errors()->toArray());
        }
        
        try {
            $template = $request->input('template');
            $data = $request->input('data', []);
            $options = $request->input('options', []);
            
            $pdfContent = $this->reportService->generateCustomReport($template, $data, $options);
            
            if ($request->input('options.download', true)) {
                return response()->streamDownload(
                    fn () => print($pdfContent),
                    "{$template}_report_" . now()->format('Y-m-d_His') . '.pdf',
                    ['Content-Type' => 'application/pdf']
                );
            }
            
            return response($pdfContent, 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="custom_report.pdf"',
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to generate custom report: ' . $e->getMessage());
            throw ApiException::serverError('Failed to generate custom report');
        }
    }
}
