<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use Exception;

class ImportService
{
    /**
     * Parse and validate CSV file
     *
     * @param UploadedFile $file
     * @param array $expectedHeaders
     * @return array ['success' => bool, 'data' => array, 'errors' => array, 'stats' => array]
     */
    public function parseCsv(UploadedFile $file, array $expectedHeaders = []): array
    {
        $errors = [];
        $validRows = [];
        $totalRows = 0;
        $skippedRows = 0;

        try {
            // Validate file
            if (!$file->isValid()) {
                return [
                    'success' => false,
                    'data' => [],
                    'errors' => ['File upload failed or file is corrupted.'],
                    'stats' => ['total' => 0, 'valid' => 0, 'errors' => 0]
                ];
            }

            // Check file extension
            $extension = strtolower($file->getClientOriginalExtension());
            if (!in_array($extension, ['csv', 'txt'])) {
                return [
                    'success' => false,
                    'data' => [],
                    'errors' => ['Invalid file format. Only CSV files are allowed.'],
                    'stats' => ['total' => 0, 'valid' => 0, 'errors' => 0]
                ];
            }

            // Open file
            $handle = fopen($file->getRealPath(), 'r');
            if (!$handle) {
                return [
                    'success' => false,
                    'data' => [],
                    'errors' => ['Failed to open CSV file.'],
                    'stats' => ['total' => 0, 'valid' => 0, 'errors' => 0]
                ];
            }

            // Read header row
            $headers = fgetcsv($handle);
            if (!$headers) {
                fclose($handle);
                return [
                    'success' => false,
                    'data' => [],
                    'errors' => ['CSV file is empty or has no header row.'],
                    'stats' => ['total' => 0, 'valid' => 0, 'errors' => 0]
                ];
            }

            // Clean headers (trim whitespace, remove BOM, remove quotes, normalize)
            $headers = array_map(function($header) {
                // Remove UTF-8 BOM if present
                $header = str_replace("\xEF\xBB\xBF", '', $header);
                // Remove surrounding quotes if present
                $header = trim($header, '"\'');
                return trim($header);
            }, $headers);

            // Validate headers if expected headers provided
            if (!empty($expectedHeaders)) {
                $missingHeaders = array_diff($expectedHeaders, $headers);
                if (!empty($missingHeaders)) {
                    fclose($handle);
                    return [
                        'success' => false,
                        'data' => [],
                        'errors' => ['Missing required headers: ' . implode(', ', $missingHeaders)],
                        'stats' => ['total' => 0, 'valid' => 0, 'errors' => 0]
                    ];
                }
            }

            // Read data rows
            $rowNumber = 1; // Start at 1 (header is row 0)
            while (($row = fgetcsv($handle)) !== false) {
                $rowNumber++;
                $totalRows++;

                // Skip empty rows
                if (empty(array_filter($row))) {
                    $skippedRows++;
                    continue;
                }

                // Map row to associative array
                $rowData = [];
                foreach ($headers as $index => $header) {
                    $rowData[$header] = isset($row[$index]) ? trim($row[$index]) : null;
                }

                $validRows[] = [
                    'row_number' => $rowNumber,
                    'data' => $rowData
                ];
            }

            fclose($handle);

            return [
                'success' => true,
                'data' => $validRows,
                'errors' => [],
                'stats' => [
                    'total' => $totalRows,
                    'valid' => count($validRows),
                    'errors' => 0,
                    'skipped' => $skippedRows
                ]
            ];

        } catch (Exception $e) {
            return [
                'success' => false,
                'data' => [],
                'errors' => ['Failed to parse CSV: ' . $e->getMessage()],
                'stats' => ['total' => $totalRows, 'valid' => count($validRows), 'errors' => 1]
            ];
        }
    }

    /**
     * Parse Excel file (HTML table format)
     *
     * @param UploadedFile $file
     * @param array $expectedHeaders
     * @return array
     */
    public function parseExcel(UploadedFile $file, array $expectedHeaders = []): array
    {
        // For now, we'll use the same CSV parsing logic
        // In the future, this can be extended to parse true XLSX files using PhpSpreadsheet
        return $this->parseCsv($file, $expectedHeaders);
    }

    /**
     * Validate row data against rules
     *
     * @param array $data Row data
     * @param array $rules Validation rules
     * @param int $rowNumber Row number for error reporting
     * @return array ['valid' => bool, 'data' => array, 'errors' => array]
     */
    public function validateRow(array $data, array $rules, int $rowNumber = 0): array
    {
        $validator = Validator::make($data, $rules);

        if ($validator->fails()) {
            return [
                'valid' => false,
                'data' => $data,
                'errors' => $this->formatValidationErrors($validator->errors()->toArray(), $rowNumber)
            ];
        }

        return [
            'valid' => true,
            'data' => $validator->validated(),
            'errors' => []
        ];
    }

    /**
     * Format validation errors with row number
     *
     * @param array $errors
     * @param int $rowNumber
     * @return array
     */
    private function formatValidationErrors(array $errors, int $rowNumber): array
    {
        $formatted = [];
        foreach ($errors as $field => $messages) {
            foreach ($messages as $message) {
                $formatted[] = "Row {$rowNumber}: {$field} - {$message}";
            }
        }
        return $formatted;
    }

    /**
     * Map header names to database field names
     *
     * @param string $header
     * @return string
     */
    public function headerToField(string $header): string
    {
        $mappings = [
            // University fields
            'University Name' => 'name',
            'University Code' => 'code',
            'Domain' => 'domain',
            'Email Address' => 'email',
            'Phone Number' => 'phone',
            'Address' => 'address',
            'Established Year' => 'established_year',
            'Status' => 'status',
            'Storage Quota (GB)' => 'storage_quota_gb',
            'Storage Used (MB)' => 'storage_used_mb',
            
            // College fields
            'College Name' => 'name',
            'College Code' => 'code',
            'University' => 'university_name',
            'University ID' => 'university_id',
            'Type' => 'type',
            'Accreditation' => 'accreditation',
            'Capacity' => 'capacity',
            'Current Enrollment' => 'current_enrollment',
            
            // Common fields
            'Email' => 'email',
            'Phone' => 'phone',
            'Created At' => 'created_at',
        ];

        return $mappings[$header] ?? strtolower(str_replace(' ', '_', $header));
    }

    /**
     * Process import results and generate summary
     *
     * @param array $results Array of import results
     * @return array Summary with counts and error details
     */
    public function generateImportSummary(array $results): array
    {
        $summary = [
            'total_rows' => count($results),
            'successful' => 0,
            'failed' => 0,
            'errors' => [],
            'created_ids' => []
        ];

        foreach ($results as $result) {
            if ($result['success']) {
                $summary['successful']++;
                if (isset($result['id'])) {
                    $summary['created_ids'][] = $result['id'];
                }
            } else {
                $summary['failed']++;
                if (isset($result['errors'])) {
                    $summary['errors'] = array_merge($summary['errors'], $result['errors']);
                }
            }
        }

        return $summary;
    }

    /**
     * Convert status string to valid enum value
     *
     * @param string|null $status
     * @return string
     */
    public function normalizeStatus(?string $status): string
    {
        if ($status === null || $status === '') {
            return 'active';
        }

        $status = strtolower(trim($status));
        $validStatuses = ['active', 'inactive', 'suspended'];

        if (in_array($status, $validStatuses)) {
            return $status;
        }

        // Map common variations
        $statusMappings = [
            'enabled' => 'active',
            'disabled' => 'inactive',
            'blocked' => 'suspended',
            'banned' => 'suspended',
            '1' => 'active',
            '0' => 'inactive',
            'true' => 'active',
            'false' => 'inactive',
            'yes' => 'active',
            'no' => 'inactive',
        ];

        return $statusMappings[$status] ?? 'active';
    }

    /**
     * Convert type string to valid enum value
     *
     * @param string|null $type
     * @return string|null
     */
    public function normalizeType(?string $type): ?string
    {
        if (!$type) {
            return null;
        }

        $type = strtolower(trim($type));
        $validTypes = ['engineering', 'medical', 'arts', 'commerce', 'science', 'law', 'management'];

        if (in_array($type, $validTypes)) {
            return $type;
        }

        return null;
    }
}
