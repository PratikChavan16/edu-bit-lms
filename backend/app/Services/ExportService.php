<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Response;

class ExportService
{
    /**
     * Export data to CSV format
     *
     * @param Collection $data
     * @param array $headers Column headers
     * @param string $filename
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function exportToCsv(Collection $data, array $headers, string $filename = 'export.csv')
    {
        $callback = function() use ($data, $headers) {
            $file = fopen('php://output', 'w');
            
            // Add BOM for UTF-8 Excel compatibility
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            
            // Write headers
            fputcsv($file, $headers);
            
            // Write data rows
            foreach ($data as $row) {
                $rowData = [];
                foreach ($headers as $header) {
                    // Convert header to snake_case key
                    $key = $this->headerToKey($header);
                    $rowData[] = $row[$key] ?? '';
                }
                fputcsv($file, $rowData);
            }
            
            fclose($file);
        };

        return Response::stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }

    /**
     * Export data to Excel format (XLSX)
     * Note: This creates a simple HTML table that Excel can open
     * For true XLSX format, use maatwebsite/excel package
     *
     * @param Collection $data
     * @param array $headers
     * @param string $filename
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function exportToExcel(Collection $data, array $headers, string $filename = 'export.xlsx')
    {
        $callback = function() use ($data, $headers) {
            echo '<html><head><meta charset="UTF-8"></head><body>';
            echo '<table border="1">';
            
            // Header row
            echo '<thead><tr>';
            foreach ($headers as $header) {
                echo '<th>' . htmlspecialchars($header) . '</th>';
            }
            echo '</tr></thead>';
            
            // Data rows
            echo '<tbody>';
            foreach ($data as $row) {
                echo '<tr>';
                foreach ($headers as $header) {
                    $key = $this->headerToKey($header);
                    $value = $row[$key] ?? '';
                    echo '<td>' . htmlspecialchars($value) . '</td>';
                }
                echo '</tr>';
            }
            echo '</tbody>';
            
            echo '</table></body></html>';
        };

        return Response::stream($callback, 200, [
            'Content-Type' => 'application/vnd.ms-excel',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ]);
    }

    /**
     * Convert header text to database key
     *
     * @param string $header
     * @return string
     */
    protected function headerToKey(string $header): string
    {
        // Simple conversion: "University Name" -> "name", "Email Address" -> "email"
        $map = [
            'University Name' => 'name',
            'University Code' => 'code',
            'Domain' => 'domain',
            'Email' => 'email',
            'Email Address' => 'email',
            'Phone' => 'phone',
            'Phone Number' => 'phone',
            'Address' => 'address',
            'Status' => 'status',
            'Created At' => 'created_at',
            'Updated At' => 'updated_at',
            'College Name' => 'name',
            'College Code' => 'code',
            'Type' => 'type',
            'Accreditation' => 'accreditation',
            'Capacity' => 'capacity',
            'First Name' => 'first_name',
            'Last Name' => 'last_name',
            'Username' => 'username',
            'Role' => 'role',
            'User Type' => 'user_type',
        ];

        return $map[$header] ?? strtolower(str_replace(' ', '_', $header));
    }

    /**
     * Prepare data for export (format dates, booleans, etc.)
     *
     * @param Collection $data
     * @param array $fields Fields to include in export
     * @return Collection
     */
    public function prepareData(Collection $data, array $fields = []): Collection
    {
        return $data->map(function ($item) use ($fields) {
            $prepared = [];
            
            // If specific fields are requested, only include those
            $dataArray = is_array($item) ? $item : $item->toArray();
            
            if (!empty($fields)) {
                foreach ($fields as $field) {
                    $prepared[$field] = $dataArray[$field] ?? null;
                }
            } else {
                $prepared = $dataArray;
            }
            
            // Format dates
            foreach ($prepared as $key => $value) {
                if ($value instanceof \DateTime) {
                    $prepared[$key] = $value->format('Y-m-d H:i:s');
                } elseif (is_bool($value)) {
                    $prepared[$key] = $value ? 'Yes' : 'No';
                } elseif (is_array($value)) {
                    $prepared[$key] = json_encode($value);
                }
            }
            
            return $prepared;
        });
    }
}
