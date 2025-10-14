<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\BulkUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

/**
 * Bulk Upload Controller
 * Handles CSV file uploads for students, faculty, and other entities
 */
class BulkUploadController extends Controller
{
    public function __construct(private BulkUploadService $bulkUploadService)
    {
    }

    /**
     * Get available upload templates
     */
    public function templates(): JsonResponse
    {
        $templates = [
            [
                'type' => 'students',
                'name' => 'Student Bulk Upload',
                'description' => 'Upload multiple students at once',
                'template_url' => '/templates/students-import.sample.csv',
                'required_fields' => ['university_code', 'college_code', 'student_id', 'first_name', 'last_name', 'email'],
                'optional_fields' => ['phone', 'course_code', 'year', 'section', 'roll_no'],
            ],
            [
                'type' => 'faculty',
                'name' => 'Faculty Bulk Upload',
                'description' => 'Upload multiple faculty members at once',
                'template_url' => '/templates/faculty-import.sample.csv',
                'required_fields' => ['university_code', 'college_code', 'faculty_id', 'first_name', 'last_name', 'email'],
                'optional_fields' => ['phone', 'department_code', 'designation', 'joining_date'],
            ],
            [
                'type' => 'assessments',
                'name' => 'Assessment Questions Bulk Upload',
                'description' => 'Upload assessment questions in bulk',
                'template_url' => '/templates/assessment-questions.sample.csv',
                'required_fields' => ['question_text', 'question_type', 'marks'],
                'optional_fields' => ['option_a', 'option_b', 'option_c', 'option_d', 'correct_answer'],
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $templates,
        ]);
    }

    /**
     * Download a template file
     */
    public function downloadTemplate(string $type): JsonResponse
    {
        $templateFiles = [
            'students' => 'students-import.sample.csv',
            'faculty' => 'faculty-import.sample.csv',
            'assessments' => 'assessment-questions.sample.csv',
        ];

        if (!isset($templateFiles[$type])) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid template type',
            ], 404);
        }

        $filePath = base_path("docs/templates/{$templateFiles[$type]}");

        if (!file_exists($filePath)) {
            return response()->json([
                'success' => false,
                'message' => 'Template file not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'url' => asset("templates/{$templateFiles[$type]}"),
                'filename' => $templateFiles[$type],
            ],
        ]);
    }

    /**
     * Validate uploaded CSV file
     */
    public function validateCsv(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:csv,txt|max:10240', // 10MB max
            'type' => 'required|string|in:students,faculty,assessments',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $file = $request->file('file');
        $type = $request->input('type');

        // Store file temporarily
        $path = $file->store('temp-uploads');

        // Validate CSV content
        $result = $this->bulkUploadService->validateCsv(Storage::path($path), $type);

        // Clean up temp file
        Storage::delete($path);

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Process bulk upload
     */
    public function upload(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:csv,txt|max:10240',
            'type' => 'required|string|in:students,faculty,assessments',
            'college_id' => 'required|uuid|exists:colleges,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $file = $request->file('file');
        $type = $request->input('type');
        $collegeId = $request->input('college_id');

        // Store file temporarily
        $path = $file->store('temp-uploads');
        $filePath = Storage::path($path);

        try {
            // Process the upload
            $result = $this->bulkUploadService->processBulkUpload(
                $filePath,
                $type,
                $collegeId,
                auth()->user()
            );

            // Clean up temp file
            Storage::delete($path);

            return response()->json([
                'success' => true,
                'data' => $result,
                'message' => "Successfully processed {$result['success_count']} records",
            ]);
        } catch (\Exception $e) {
            // Clean up temp file
            Storage::delete($path);

            return response()->json([
                'success' => false,
                'message' => 'Upload failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get upload history
     */
    public function history(Request $request): JsonResponse
    {
        $perPage = (int) $request->query('per_page', 15);
        
        $uploads = $this->bulkUploadService->getUploadHistory(
            auth()->user()->id,
            $perPage
        );

        return response()->json([
            'success' => true,
            'data' => $uploads->items(),
            'meta' => [
                'current_page' => $uploads->currentPage(),
                'per_page' => $uploads->perPage(),
                'total' => $uploads->total(),
            ],
        ]);
    }
}
