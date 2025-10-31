<?php

/**
 * Bulk Import Functionality Test Script
 * 
 * This script tests the bulk import functionality for Universities and Colleges.
 * It creates sample CSV files and tests the import API endpoints.
 * 
 * Usage: php test-bulk-import.php
 */

require __DIR__.'/vendor/autoload.php';

use Illuminate\Support\Facades\Artisan;
use App\Models\University;
use App\Models\College;
use Illuminate\Support\Facades\Storage;

// Bootstrap Laravel
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Bulk Import Functionality Test ===\n\n";

// Create imports directory if it doesn't exist
$importDir = storage_path('app/imports');
if (!file_exists($importDir)) {
    mkdir($importDir, 0755, true);
    echo "✅ Created imports directory: $importDir\n\n";
}

$testsPassed = 0;
$testsFailed = 0;
$testsSkipped = 0;

/**
 * Test 1: Create Sample University CSV File
 */
echo "Test 1: Create Sample University CSV File\n";
echo str_repeat("━", 50) . "\n";

try {
    $universityCSV = $importDir . '/test_universities_import.csv';
    $file = fopen($universityCSV, 'w');
    
    // Add UTF-8 BOM for Excel compatibility
    fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
    
    // Headers
    $headers = [
        'University Name',
        'University Code',
        'Domain',
        'Email Address',
        'Phone Number',
        'Address',
        'Established Year',
        'Status',
        'Storage Quota (GB)',
        'Storage Used (MB)'
    ];
    fputcsv($file, $headers);
    
    // Sample data rows
    $universities = [
        [
            'Test University Alpha',
            'TUA',
            'alpha.test.edu',
            'admin@alpha.test.edu',
            '+1234567890',
            '123 University Ave, Test City',
            '1990',
            'active',
            '500',
            '0'
        ],
        [
            'Test University Beta',
            'TUB',
            'beta.test.edu',
            'admin@beta.test.edu',
            '+1234567891',
            '456 College St, Test Town',
            '1995',
            'active',
            '1000',
            '100'
        ],
        [
            'Test University Gamma',
            'TUG',
            'gamma.test.edu',
            'admin@gamma.test.edu',
            '+1234567892',
            '789 Campus Rd, Test Village',
            '2000',
            'inactive',
            '250',
            '50'
        ],
    ];
    
    foreach ($universities as $uni) {
        fputcsv($file, $uni);
    }
    
    fclose($file);
    
    $fileSize = filesize($universityCSV);
    echo "✅ CSV file created: test_universities_import.csv\n";
    echo "   Location: $universityCSV\n";
    echo "   Size: " . number_format($fileSize / 1024, 2) . " KB\n";
    echo "   Rows: " . count($universities) . " (excluding header)\n\n";
    $testsPassed++;
    
} catch (Exception $e) {
    echo "❌ Failed to create CSV: " . $e->getMessage() . "\n\n";
    $testsFailed++;
}

/**
 * Test 2: Test ImportService CSV Parsing
 */
echo "Test 2: Test ImportService CSV Parsing\n";
echo str_repeat("━", 50) . "\n";

try {
    $importService = new App\Services\ImportService();
    
    // Create a mock UploadedFile
    $uploadedFile = new Illuminate\Http\UploadedFile(
        $universityCSV,
        'test_universities_import.csv',
        'text/csv',
        null,
        true
    );
    
    $expectedHeaders = ['University Name', 'Domain', 'Email Address'];
    $result = $importService->parseCsv($uploadedFile, $expectedHeaders);
    
    if ($result['success']) {
        echo "✅ CSV parsing successful\n";
        echo "   Total rows: " . $result['stats']['total'] . "\n";
        echo "   Valid rows: " . $result['stats']['valid'] . "\n";
        echo "   Skipped rows: " . $result['stats']['skipped'] . "\n";
        echo "   First row sample:\n";
        if (!empty($result['data'])) {
            $firstRow = $result['data'][0]['data'];
            echo "   - Name: " . $firstRow['University Name'] . "\n";
            echo "   - Domain: " . $firstRow['Domain'] . "\n";
            echo "   - Email: " . $firstRow['Email Address'] . "\n";
        }
        echo "\n";
        $testsPassed++;
    } else {
        echo "❌ CSV parsing failed: " . implode(', ', $result['errors']) . "\n";
        
        // Debug: Re-read CSV to see what headers are actually there
        $handle = fopen($universityCSV, 'r');
        $headers = fgetcsv($handle);
        fclose($handle);
        
        echo "   Debug - Actual headers found:\n";
        foreach ($headers as $i => $header) {
            $cleanHeader = str_replace("\xEF\xBB\xBF", '', trim($header));
            echo "   [$i] '$cleanHeader' (raw: '" . bin2hex($header) . "')\n";
        }
        echo "\n";
        $testsFailed++;
    }
    
} catch (Exception $e) {
    echo "❌ Test failed: " . $e->getMessage() . "\n\n";
    $testsFailed++;
}

/**
 * Test 3: Test Row Validation (Valid Data)
 */
echo "Test 3: Test Row Validation (Valid Data)\n";
echo str_repeat("━", 50) . "\n";

try {
    $importService = new App\Services\ImportService();
    
    $validData = [
        'name' => 'Test University',
        'domain' => 'test-unique-' . time() . '.edu',
        'email' => 'admin-' . time() . '@test.edu',
        'status' => 'active',
        'storage_quota_gb' => 100,
    ];
    
    $rules = [
        'name' => 'required|string|max:255',
        'domain' => 'required|string|max:255|unique:universities,domain',
        'email' => 'required|email|max:255|unique:universities,email',
        'status' => 'in:active,inactive,suspended',
        'storage_quota_gb' => 'integer|min:1',
    ];
    
    $result = $importService->validateRow($validData, $rules, 1);
    
    if ($result['valid']) {
        echo "✅ Validation passed for valid data\n";
        echo "   Validated fields: " . count($result['data']) . "\n\n";
        $testsPassed++;
    } else {
        echo "❌ Validation failed unexpectedly\n";
        echo "   Errors: " . implode(', ', $result['errors']) . "\n\n";
        $testsFailed++;
    }
    
} catch (Exception $e) {
    echo "❌ Test failed: " . $e->getMessage() . "\n\n";
    $testsFailed++;
}

/**
 * Test 4: Test Row Validation (Invalid Data)
 */
echo "Test 4: Test Row Validation (Invalid Data)\n";
echo str_repeat("━", 50) . "\n";

try {
    $importService = new App\Services\ImportService();
    
    $invalidData = [
        'name' => '', // Required field missing
        'domain' => 'invalid domain with spaces',
        'email' => 'not-an-email',
        'status' => 'unknown-status',
    ];
    
    $rules = [
        'name' => 'required|string|max:255',
        'domain' => 'required|string|max:255',
        'email' => 'required|email',
        'status' => 'in:active,inactive,suspended',
    ];
    
    $result = $importService->validateRow($invalidData, $rules, 2);
    
    if (!$result['valid']) {
        echo "✅ Validation correctly rejected invalid data\n";
        echo "   Errors found:\n";
        foreach ($result['errors'] as $error) {
            echo "   - $error\n";
        }
        echo "\n";
        $testsPassed++;
    } else {
        echo "❌ Validation passed when it should have failed\n\n";
        $testsFailed++;
    }
    
} catch (Exception $e) {
    echo "❌ Test failed: " . $e->getMessage() . "\n\n";
    $testsFailed++;
}

/**
 * Test 5: Test Status Normalization
 */
echo "Test 5: Test Status Normalization\n";
echo str_repeat("━", 50) . "\n";

try {
    $importService = new App\Services\ImportService();
    
    $testCases = [
        'Active' => 'active',
        'INACTIVE' => 'inactive',
        'enabled' => 'active',
        'disabled' => 'inactive',
        '1' => 'active',
        '0' => 'inactive',
        'yes' => 'active',
        'no' => 'inactive',
        'unknown' => 'active', // Default
    ];
    
    $allPassed = true;
    foreach ($testCases as $input => $expected) {
        $result = $importService->normalizeStatus($input);
        if ($result === $expected) {
            echo "✅ '$input' → '$result' (expected: '$expected')\n";
        } else {
            echo "❌ '$input' → '$result' (expected: '$expected')\n";
            $allPassed = false;
        }
    }
    
    if ($allPassed) {
        echo "\n✅ All status normalization tests passed\n\n";
        $testsPassed++;
    } else {
        echo "\n❌ Some status normalization tests failed\n\n";
        $testsFailed++;
    }
    
} catch (Exception $e) {
    echo "❌ Test failed: " . $e->getMessage() . "\n\n";
    $testsFailed++;
}

/**
 * Test 6: Create Sample College CSV File
 */
echo "Test 6: Create Sample College CSV File\n";
echo str_repeat("━", 50) . "\n";

try {
    // Get a test university for the import
    $testUniversity = University::first();
    
    if (!$testUniversity) {
        echo "⚠️  No universities found in database. Skipping college import test.\n\n";
        $testsSkipped++;
    } else {
        $collegeCSV = $importDir . '/test_colleges_import.csv';
        $file = fopen($collegeCSV, 'w');
        
        // Add UTF-8 BOM
        fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));
        
        // Headers
        $headers = [
            'College Name',
            'College Code',
            'University',
            'Domain',
            'Email',
            'Phone',
            'Address',
            'Type',
            'Accreditation',
            'Capacity',
            'Current Enrollment',
            'Status'
        ];
        fputcsv($file, $headers);
        
        // Sample data rows
        $colleges = [
            [
                'Test College of Engineering',
                'TCE',
                $testUniversity->name,
                'engineering.test.edu',
                'admin@engineering.test.edu',
                '+1111111111',
                '100 Engineering Dr',
                'engineering',
                'NAAC A+',
                '500',
                '450',
                'active'
            ],
            [
                'Test College of Science',
                'TCS',
                $testUniversity->name,
                'science.test.edu',
                'admin@science.test.edu',
                '+2222222222',
                '200 Science Blvd',
                'science',
                'NAAC A',
                '300',
                '280',
                'active'
            ],
        ];
        
        foreach ($colleges as $college) {
            fputcsv($file, $college);
        }
        
        fclose($file);
        
        $fileSize = filesize($collegeCSV);
        echo "✅ CSV file created: test_colleges_import.csv\n";
        echo "   Location: $collegeCSV\n";
        echo "   Size: " . number_format($fileSize / 1024, 2) . " KB\n";
        echo "   Rows: " . count($colleges) . " (excluding header)\n";
        echo "   University: " . $testUniversity->name . "\n\n";
        $testsPassed++;
    }
    
} catch (Exception $e) {
    echo "❌ Failed to create CSV: " . $e->getMessage() . "\n\n";
    $testsFailed++;
}

/**
 * Test 7: Test Type Normalization
 */
echo "Test 7: Test Type Normalization\n";
echo str_repeat("━", 50) . "\n";

try {
    $importService = new App\Services\ImportService();
    
    $testCases = [
        'Engineering' => 'engineering',
        'MEDICAL' => 'medical',
        'Arts' => 'arts',
        'commerce' => 'commerce',
        'Science' => 'science',
        'unknown-type' => null, // Invalid type
        '' => null, // Empty
    ];
    
    $allPassed = true;
    foreach ($testCases as $input => $expected) {
        $result = $importService->normalizeType($input);
        $resultStr = $result === null ? 'null' : "'$result'";
        $expectedStr = $expected === null ? 'null' : "'$expected'";
        
        if ($result === $expected) {
            echo "✅ '$input' → $resultStr (expected: $expectedStr)\n";
        } else {
            echo "❌ '$input' → $resultStr (expected: $expectedStr)\n";
            $allPassed = false;
        }
    }
    
    if ($allPassed) {
        echo "\n✅ All type normalization tests passed\n\n";
        $testsPassed++;
    } else {
        echo "\n❌ Some type normalization tests failed\n\n";
        $testsFailed++;
    }
    
} catch (Exception $e) {
    echo "❌ Test failed: " . $e->getMessage() . "\n\n";
    $testsFailed++;
}

/**
 * Summary
 */
echo str_repeat("━", 50) . "\n";
echo "📊 Test Summary\n";
echo str_repeat("━", 50) . "\n\n";

$totalTests = $testsPassed + $testsFailed + $testsSkipped;

echo "Total Tests: $totalTests\n";
echo "Passed: $testsPassed\n";
echo "Failed: $testsFailed\n";
echo "Skipped: $testsSkipped\n\n";

if ($testsFailed === 0) {
    echo "✅ All executed tests PASSED!\n\n";
    echo "📁 Sample CSV files created in: $importDir\n";
    echo "   - test_universities_import.csv (3 universities)\n";
    if ($testsSkipped === 0) {
        echo "   - test_colleges_import.csv (2 colleges)\n";
    }
    echo "\n📝 Next Steps:\n";
    echo "   1. Test import API endpoints using Postman or curl\n";
    echo "   2. Verify transaction rollback on validation errors\n";
    echo "   3. Test import with large CSV files (100+ rows)\n";
    echo "   4. Test duplicate detection and error reporting\n\n";
    exit(0);
} else {
    echo "❌ Some tests FAILED!\n\n";
    exit(1);
}
