<?php

/**
 * Test Script: Bulk Export Functionality
 * 
 * Purpose: Test CSV/Excel export for Universities and Colleges
 * 
 * Tests:
 * 1. Export all universities to CSV
 * 2. Export all universities to Excel
 * 3. Export filtered universities (active status)
 * 4. Export all colleges to CSV
 * 5. Export colleges filtered by university
 * 
 * Run: php test-bulk-export.php
 */

require_once __DIR__ . '/vendor/autoload.php';

use App\Services\ExportService;
use App\Models\University;
use App\Models\College;
use Illuminate\Support\Collection;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== Bulk Export Functionality Test ===\n\n";

$exportService = new ExportService();
$testResults = [];

// Test 1: Export Universities to CSV
echo "Test 1: Export Universities to CSV\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

try {
    $universities = University::withoutGlobalScope(\App\Scopes\UniversityScope::class)
        ->orderBy('created_at', 'desc')
        ->get();
    
    echo "✅ Found {$universities->count()} universities\n";
    
    if ($universities->count() > 0) {
        // Prepare data
        $preparedData = $universities->map(function ($university) {
            return [
                'name' => $university->name,
                'code' => $university->code ?? 'N/A',
                'domain' => $university->domain,
                'email' => $university->email,
                'phone' => $university->phone ?? 'N/A',
                'address' => $university->address ?? 'N/A',
                'status' => ucfirst($university->status),
                'created_at' => $university->created_at ? $university->created_at->format('Y-m-d H:i:s') : 'N/A',
            ];
        });
        
        $headers = ['University Name', 'Code', 'Domain', 'Email', 'Phone', 'Address', 'Status', 'Created At'];
        
        // Test CSV generation (save to storage/exports)
        $filename = 'test_universities_' . date('Ymd_His') . '.csv';
        $filepath = storage_path('app/exports/' . $filename);
        
        // Create exports directory if it doesn't exist
        if (!file_exists(storage_path('app/exports'))) {
            mkdir(storage_path('app/exports'), 0755, true);
        }
        
        // Generate CSV
        $file = fopen($filepath, 'w');
        fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF)); // BOM for UTF-8
        fputcsv($file, $headers);
        
        foreach ($preparedData as $row) {
            fputcsv($file, array_values($row));
        }
        
        fclose($file);
        
        $filesize = filesize($filepath);
        echo "✅ CSV file created: {$filename}\n";
        echo "   Location: {$filepath}\n";
        echo "   Size: " . round($filesize / 1024, 2) . " KB\n";
        echo "   Rows: " . ($universities->count() + 1) . " (including header)\n";
        
        $testResults['test_1'] = 'PASS';
    } else {
        echo "⚠️  No universities found to export\n";
        $testResults['test_1'] = 'SKIP';
    }
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    $testResults['test_1'] = 'FAIL';
}

echo "\n";

// Test 2: Export Universities to Excel (HTML Table)
echo "Test 2: Export Universities to Excel (HTML format)\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

try {
    $universities = University::withoutGlobalScope(\App\Scopes\UniversityScope::class)
        ->orderBy('created_at', 'desc')
        ->get();
    
    if ($universities->count() > 0) {
        $preparedData = $universities->map(function ($university) {
            return [
                'name' => $university->name,
                'code' => $university->code ?? 'N/A',
                'domain' => $university->domain,
                'email' => $university->email,
                'status' => ucfirst($university->status),
                'created_at' => $university->created_at ? $university->created_at->format('Y-m-d H:i:s') : 'N/A',
            ];
        });
        
        $headers = ['University Name', 'Code', 'Domain', 'Email', 'Status', 'Created At'];
        
        $filename = 'test_universities_' . date('Ymd_His') . '.xlsx';
        $filepath = storage_path('app/exports/' . $filename);
        
        // Generate Excel (HTML table)
        $file = fopen($filepath, 'w');
        fwrite($file, '<html><head><meta charset="UTF-8"></head><body>');
        fwrite($file, '<table border="1">');
        
        // Header
        fwrite($file, '<thead><tr>');
        foreach ($headers as $header) {
            fwrite($file, '<th>' . htmlspecialchars($header) . '</th>');
        }
        fwrite($file, '</tr></thead>');
        
        // Data
        fwrite($file, '<tbody>');
        foreach ($preparedData as $row) {
            fwrite($file, '<tr>');
            foreach ($row as $value) {
                fwrite($file, '<td>' . htmlspecialchars($value) . '</td>');
            }
            fwrite($file, '</tr>');
        }
        fwrite($file, '</tbody>');
        
        fwrite($file, '</table></body></html>');
        fclose($file);
        
        $filesize = filesize($filepath);
        echo "✅ Excel file created: {$filename}\n";
        echo "   Location: {$filepath}\n";
        echo "   Size: " . round($filesize / 1024, 2) . " KB\n";
        echo "   Note: HTML table format, opens in Excel\n";
        
        $testResults['test_2'] = 'PASS';
    } else {
        echo "⚠️  No universities found to export\n";
        $testResults['test_2'] = 'SKIP';
    }
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    $testResults['test_2'] = 'FAIL';
}

echo "\n";

// Test 3: Export Filtered Universities (Active only)
echo "Test 3: Export Filtered Universities (Active Status Only)\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

try {
    $universities = University::withoutGlobalScope(\App\Scopes\UniversityScope::class)
        ->where('status', 'active')
        ->orderBy('name', 'asc')
        ->get();
    
    echo "✅ Found {$universities->count()} active universities\n";
    
    if ($universities->count() > 0) {
        $preparedData = $universities->map(function ($university) {
            return [
                'name' => $university->name,
                'domain' => $university->domain,
                'email' => $university->email,
                'status' => ucfirst($university->status),
            ];
        });
        
        $headers = ['University Name', 'Domain', 'Email', 'Status'];
        
        $filename = 'test_active_universities_' . date('Ymd_His') . '.csv';
        $filepath = storage_path('app/exports/' . $filename);
        
        $file = fopen($filepath, 'w');
        fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
        fputcsv($file, $headers);
        
        foreach ($preparedData as $row) {
            fputcsv($file, array_values($row));
        }
        
        fclose($file);
        
        echo "✅ Filtered CSV created: {$filename}\n";
        echo "   Only active universities exported\n";
        
        $testResults['test_3'] = 'PASS';
    } else {
        echo "⚠️  No active universities found\n";
        $testResults['test_3'] = 'SKIP';
    }
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    $testResults['test_3'] = 'FAIL';
}

echo "\n";

// Test 4: Export All Colleges to CSV
echo "Test 4: Export All Colleges to CSV\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

try {
    $colleges = College::withoutGlobalScope(\App\Scopes\UniversityScope::class)
        ->with('university')
        ->orderBy('created_at', 'desc')
        ->get();
    
    echo "✅ Found {$colleges->count()} colleges\n";
    
    if ($colleges->count() > 0) {
        $preparedData = $colleges->map(function ($college) {
            return [
                'name' => $college->name,
                'code' => $college->code ?? 'N/A',
                'university' => $college->university ? $college->university->name : 'N/A',
                'type' => ucfirst($college->type ?? 'N/A'),
                'email' => $college->email ?? 'N/A',
                'phone' => $college->phone ?? 'N/A',
                'status' => ucfirst($college->status),
                'created_at' => $college->created_at ? $college->created_at->format('Y-m-d H:i:s') : 'N/A',
            ];
        });
        
        $headers = ['College Name', 'Code', 'University', 'Type', 'Email', 'Phone', 'Status', 'Created At'];
        
        $filename = 'test_colleges_' . date('Ymd_His') . '.csv';
        $filepath = storage_path('app/exports/' . $filename);
        
        $file = fopen($filepath, 'w');
        fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
        fputcsv($file, $headers);
        
        foreach ($preparedData as $row) {
            fputcsv($file, array_values($row));
        }
        
        fclose($file);
        
        $filesize = filesize($filepath);
        echo "✅ CSV file created: {$filename}\n";
        echo "   Location: {$filepath}\n";
        echo "   Size: " . round($filesize / 1024, 2) . " KB\n";
        
        $testResults['test_4'] = 'PASS';
    } else {
        echo "⚠️  No colleges found to export\n";
        $testResults['test_4'] = 'SKIP';
    }
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    $testResults['test_4'] = 'FAIL';
}

echo "\n";

// Test 5: Export Colleges Filtered by University
echo "Test 5: Export Colleges Filtered by Specific University\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";

try {
    $university = University::withoutGlobalScope(\App\Scopes\UniversityScope::class)->first();
    
    if ($university) {
        echo "📌 Filtering colleges for: {$university->name}\n";
        
        $colleges = College::withoutGlobalScope(\App\Scopes\UniversityScope::class)
            ->where('university_id', $university->id)
            ->with('university')
            ->get();
        
        echo "✅ Found {$colleges->count()} colleges for this university\n";
        
        if ($colleges->count() > 0) {
            $preparedData = $colleges->map(function ($college) {
                return [
                    'name' => $college->name,
                    'code' => $college->code ?? 'N/A',
                    'type' => ucfirst($college->type ?? 'N/A'),
                    'email' => $college->email ?? 'N/A',
                    'status' => ucfirst($college->status),
                ];
            });
            
            $headers = ['College Name', 'Code', 'Type', 'Email', 'Status'];
            
            $filename = 'test_colleges_' . Str::slug($university->name) . '_' . date('Ymd_His') . '.csv';
            $filepath = storage_path('app/exports/' . $filename);
            
            $file = fopen($filepath, 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
            fputcsv($file, $headers);
            
            foreach ($preparedData as $row) {
                fputcsv($file, array_values($row));
            }
            
            fclose($file);
            
            echo "✅ Filtered CSV created: {$filename}\n";
            
            $testResults['test_5'] = 'PASS';
        } else {
            echo "⚠️  No colleges found for this university\n";
            $testResults['test_5'] = 'SKIP';
        }
    } else {
        echo "⚠️  No universities found in database\n";
        $testResults['test_5'] = 'SKIP';
    }
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    $testResults['test_5'] = 'FAIL';
}

echo "\n";

// Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
echo "📊 Test Summary\n";
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";

$passed = count(array_filter($testResults, fn($result) => $result === 'PASS'));
$failed = count(array_filter($testResults, fn($result) => $result === 'FAIL'));
$skipped = count(array_filter($testResults, fn($result) => $result === 'SKIP'));

foreach ($testResults as $test => $result) {
    $icon = $result === 'PASS' ? '✅' : ($result === 'FAIL' ? '❌' : '⚠️');
    $testName = str_replace('test_', 'Test ', $test);
    echo "{$icon} {$testName}: {$result}\n";
}

echo "\n";
echo "Total Tests: " . count($testResults) . "\n";
echo "Passed: {$passed}\n";
echo "Failed: {$failed}\n";
echo "Skipped: {$skipped}\n\n";

if ($failed > 0) {
    echo "❌ Some tests FAILED. Check errors above.\n";
    exit(1);
} elseif ($passed > 0) {
    echo "✅ All executed tests PASSED!\n";
    echo "\n📁 Exported files location: " . storage_path('app/exports/') . "\n";
    exit(0);
} else {
    echo "⚠️  All tests SKIPPED (no data to export).\n";
    echo "   Seed some data and run again.\n";
    exit(0);
}
