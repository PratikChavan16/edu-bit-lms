<?php

/**
 * Test PDF Report Generation
 * 
 * This script tests the PDF report generation system
 * 
 * Usage:
 *   php test-pdf-reports.php
 */

require __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\Artisan;

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== PDF Report Generation Test ===\n\n";

// Test 1: Generate Universities Report
echo "Test 1: Generate Universities Report\n";
echo "------------------------------------\n";

try {
    $reportService = new \App\Services\ReportService();
    
    // Test with all universities
    echo "Generating report for all universities...\n";
    $pdf = $reportService->generateUniversityReport([], [
        'paper' => 'a4',
        'orientation' => 'portrait',
        'save' => true
    ]);
    
    echo "✓ PDF saved to: storage/app/{$pdf}\n";
    echo "✓ File size: " . number_format(strlen(file_get_contents(storage_path('app/' . $pdf))) / 1024, 2) . " KB\n";
    
    // Test with filters
    echo "\nGenerating filtered report (active universities only)...\n";
    $pdf2 = $reportService->generateUniversityReport([
        'status' => ['active']
    ], [
        'save' => true
    ]);
    
    echo "✓ Filtered PDF saved to: storage/app/{$pdf2}\n";
    echo "✓ File size: " . number_format(strlen(file_get_contents(storage_path('app/' . $pdf2))) / 1024, 2) . " KB\n";
    
} catch (\Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo "  File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}

echo "\n";

// Test 2: Generate Colleges Report
echo "Test 2: Generate Colleges Report\n";
echo "---------------------------------\n";

try {
    $reportService = new \App\Services\ReportService();
    
    echo "Generating report for all colleges...\n";
    $pdf = $reportService->generateCollegeReport([], [
        'save' => true
    ]);
    
    echo "✓ PDF saved to: storage/app/{$pdf}\n";
    echo "✓ File size: " . number_format(strlen(file_get_contents(storage_path('app/' . $pdf))) / 1024, 2) . " KB\n";
    
} catch (\Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo "  File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}

echo "\n";

// Test 3: Generate Users Report
echo "Test 3: Generate Users Report\n";
echo "------------------------------\n";

try {
    $reportService = new \App\Services\ReportService();
    
    echo "Generating report for all users...\n";
    $pdf = $reportService->generateUsersReport([], [
        'save' => true
    ]);
    
    echo "✓ PDF saved to: storage/app/{$pdf}\n";
    echo "✓ File size: " . number_format(strlen(file_get_contents(storage_path('app/' . $pdf))) / 1024, 2) . " KB\n";
    
    // Test with role filter
    echo "\nGenerating filtered report (super_admin only)...\n";
    $pdf2 = $reportService->generateUsersReport([
        'role' => ['super_admin']
    ], [
        'save' => true
    ]);
    
    echo "✓ Filtered PDF saved to: storage/app/{$pdf2}\n";
    echo "✓ File size: " . number_format(strlen(file_get_contents(storage_path('app/' . $pdf2))) / 1024, 2) . " KB\n";
    
} catch (\Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo "  File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}

echo "\n";

// Test 4: Paper sizes and orientation
echo "Test 4: Paper Size & Orientation\n";
echo "---------------------------------\n";

try {
    $reportService = new \App\Services\ReportService();
    
    // A4 Portrait
    echo "Testing A4 Portrait...\n";
    $pdf = $reportService->generateUniversityReport([], [
        'paper' => 'a4',
        'orientation' => 'portrait',
        'save' => true
    ]);
    echo "✓ A4 Portrait: storage/app/{$pdf}\n";
    
    // A4 Landscape
    echo "Testing A4 Landscape...\n";
    $pdf = $reportService->generateUniversityReport([], [
        'paper' => 'a4',
        'orientation' => 'landscape',
        'save' => true
    ]);
    echo "✓ A4 Landscape: storage/app/{$pdf}\n";
    
    // Letter
    echo "Testing Letter size...\n";
    $pdf = $reportService->generateUniversityReport([], [
        'paper' => 'letter',
        'orientation' => 'portrait',
        'save' => true
    ]);
    echo "✓ Letter: storage/app/{$pdf}\n";
    
} catch (\Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    echo "  File: " . $e->getFile() . ":" . $e->getLine() . "\n";
}

echo "\n";
echo "=== Test Summary ===\n";
echo "All tests completed!\n";
echo "Generated PDFs are in: storage/app/reports/\n";
echo "\nYou can open these PDFs to verify formatting, styling, and content.\n";
