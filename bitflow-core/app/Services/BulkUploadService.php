<?php

namespace App\Services;

use App\Models\BulkUpload;
use App\Models\College;
use App\Models\Student;
use App\Models\Faculty;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Bulk Upload Service
 * Handles CSV parsing and bulk data imports
 */
class BulkUploadService
{
    /**
     * Validate CSV file structure and content
     */
    public function validateCsv(string $filePath, string $type): array
    {
        $rows = $this->parseCsv($filePath);
        
        if (count($rows) === 0) {
            return [
                'valid' => false,
                'message' => 'CSV file is empty or invalid',
                'errors' => [],
            ];
        }

        $requiredFields = $this->getRequiredFields($type);
        $header = array_shift($rows); // First row is header
        
        // Check if all required fields are present
        $missingFields = array_diff($requiredFields, $header);
        
        if (!empty($missingFields)) {
            return [
                'valid' => false,
                'message' => 'Missing required fields',
                'errors' => $missingFields,
            ];
        }

        return [
            'valid' => true,
            'message' => 'CSV structure is valid',
            'row_count' => count($rows),
            'columns' => $header,
        ];
    }

    /**
     * Process bulk upload
     */
    public function processBulkUpload(string $filePath, string $type, string $collegeId, User $uploadedBy): array
    {
        $rows = $this->parseCsv($filePath);
        $header = array_shift($rows);
        
        $successCount = 0;
        $failureCount = 0;
        $errors = [];

        // Create bulk upload record
        $bulkUpload = BulkUpload::create([
            'college_id' => $collegeId,
            'type' => $type,
            'uploaded_by' => $uploadedBy->id,
            'total_rows' => count($rows),
            'status' => 'processing',
        ]);

        DB::beginTransaction();
        
        try {
            foreach ($rows as $index => $row) {
                $data = array_combine($header, $row);
                
                try {
                    if ($type === 'students') {
                        $this->createStudent($data, $collegeId);
                    } elseif ($type === 'faculty') {
                        $this->createFaculty($data, $collegeId);
                    }
                    
                    $successCount++;
                } catch (\Exception $e) {
                    $failureCount++;
                    $errors[] = [
                        'row' => $index + 2, // +2 because: array is 0-indexed and header is row 1
                        'error' => $e->getMessage(),
                        'data' => $data,
                    ];
                }
            }

            // Update bulk upload record
            $bulkUpload->update([
                'success_count' => $successCount,
                'failure_count' => $failureCount,
                'errors' => $errors,
                'status' => $failureCount > 0 ? 'completed_with_errors' : 'completed',
            ]);

            DB::commit();
            
            return [
                'success_count' => $successCount,
                'failure_count' => $failureCount,
                'errors' => $errors,
                'upload_id' => $bulkUpload->id,
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            
            $bulkUpload->update([
                'status' => 'failed',
                'errors' => [['error' => $e->getMessage()]],
            ]);
            
            throw $e;
        }
    }

    /**
     * Get upload history
     */
    public function getUploadHistory(string $userId, int $perPage = 15)
    {
        return BulkUpload::where('uploaded_by', $userId)
            ->with(['college', 'uploader'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Parse CSV file into array
     */
    private function parseCsv(string $filePath): array
    {
        $rows = [];
        
        if (($handle = fopen($filePath, 'r')) !== false) {
            while (($data = fgetcsv($handle)) !== false) {
                $rows[] = $data;
            }
            fclose($handle);
        }
        
        return $rows;
    }

    /**
     * Get required fields for upload type
     */
    private function getRequiredFields(string $type): array
    {
        return match ($type) {
            'students' => ['university_code', 'college_code', 'student_id', 'first_name', 'last_name', 'email'],
            'faculty' => ['university_code', 'college_code', 'faculty_id', 'first_name', 'last_name', 'email'],
            'assessments' => ['question_text', 'question_type', 'marks'],
            default => [],
        };
    }

    /**
     * Create student from CSV data
     */
    private function createStudent(array $data, string $collegeId): void
    {
        // Create user account
        $user = User::create([
            'username' => strtolower($data['student_id']),
            'email' => $data['email'],
            'password' => Hash::make('password123'), // Default password
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'phone' => $data['phone'] ?? null,
        ]);

        // Create student record
        Student::create([
            'user_id' => $user->id,
            'college_id' => $collegeId,
            'student_id' => $data['student_id'],
            'roll_no' => $data['roll_no'] ?? null,
            'course' => $data['course_code'] ?? null,
            'year' => $data['year'] ?? null,
            'section' => $data['section'] ?? null,
        ]);
    }

    /**
     * Create faculty from CSV data
     */
    private function createFaculty(array $data, string $collegeId): void
    {
        // Create user account
        $user = User::create([
            'username' => strtolower($data['faculty_id']),
            'email' => $data['email'],
            'password' => Hash::make('password123'), // Default password
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'phone' => $data['phone'] ?? null,
        ]);

        // Create faculty record
        Faculty::create([
            'user_id' => $user->id,
            'college_id' => $collegeId,
            'faculty_id' => $data['faculty_id'],
            'designation' => $data['designation'] ?? null,
            'joining_date' => $data['joining_date'] ?? null,
            'department_code' => $data['department_code'] ?? null,
        ]);
    }
}
