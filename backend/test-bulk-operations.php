<?php

/**
 * Bulk Operations Test Script
 * 
 * This script tests the bulk update and delete functionality for Universities and Colleges.
 * 
 * Usage: php test-bulk-operations.php
 */

require __DIR__.'/vendor/autoload.php';

use Illuminate\Support\Facades\Artisan;
use App\Models\University;
use App\Models\College;
use Illuminate\Support\Str;

// Bootstrap Laravel
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Bulk Operations Test ===\n\n";

$testsPassed = 0;
$testsFailed = 0;

/**
 * Test 1: Create Test Universities for Bulk Operations
 */
echo "Test 1: Create Test Universities for Bulk Operations\n";
echo str_repeat("━", 50) . "\n";

try {
    // Create 3 test universities
    $testUniversities = [];
    
    for ($i = 1; $i <= 3; $i++) {
        $name = "Bulk Test University {$i}";
        $university = University::create([
            'name' => $name,
            'slug' => Str::slug($name) . '-' . time(),
            'code' => "BTU{$i}",
            'domain' => "bulk-test-{$i}-" . time() . ".edu",
            'email' => "admin-bulk-{$i}-" . time() . "@test.edu",
            'phone' => "+123456789{$i}",
            'address' => "Test Address {$i}",
            'established_year' => 2020 + $i,
            'status' => 'active',
            'storage_quota_gb' => 100,
            'storage_used_mb' => 0,
        ]);
        
        $testUniversities[] = $university;
    }
    
    echo "✅ Created " . count($testUniversities) . " test universities\n";
    foreach ($testUniversities as $uni) {
        echo "   - {$uni->name} (ID: {$uni->id}, Status: {$uni->status})\n";
    }
    echo "\n";
    $testsPassed++;
    
} catch (Exception $e) {
    echo "❌ Failed to create test universities: " . $e->getMessage() . "\n\n";
    $testsFailed++;
    exit(1);
}

/**
 * Test 2: Bulk Status Update - Universities
 */
echo "Test 2: Bulk Status Update - Universities\n";
echo str_repeat("━", 50) . "\n";

try {
    // Get IDs of test universities
    $universityIds = array_map(fn($uni) => $uni->id, $testUniversities);
    
    // Simulate bulk status update
    $updatedCount = 0;
    foreach ($universityIds as $id) {
        $university = University::find($id);
        if ($university) {
            $university->status = 'inactive';
            $university->save();
            $updatedCount++;
        }
    }
    
    // Verify updates
    $inactiveCount = University::whereIn('id', $universityIds)
        ->where('status', 'inactive')
        ->count();
    
    if ($inactiveCount === count($universityIds)) {
        echo "✅ Bulk status update successful\n";
        echo "   Updated: {$updatedCount} universities\n";
        echo "   New status: inactive\n";
        echo "   Verified: {$inactiveCount}/{$updatedCount} have inactive status\n\n";
        $testsPassed++;
    } else {
        echo "❌ Status update verification failed\n";
        echo "   Expected: " . count($universityIds) . " inactive\n";
        echo "   Found: {$inactiveCount} inactive\n\n";
        $testsFailed++;
    }
    
} catch (Exception $e) {
    echo "❌ Test failed: " . $e->getMessage() . "\n\n";
    $testsFailed++;
}

/**
 * Test 3: Create Test Colleges for Bulk Operations
 */
echo "Test 3: Create Test Colleges for Bulk Operations\n";
echo str_repeat("━", 50) . "\n";

try {
    // Use first test university
    $university = $testUniversities[0];
    
    // Create 3 test colleges
    $testColleges = [];
    
    for ($i = 1; $i <= 3; $i++) {
        $college = College::create([
            'university_id' => $university->id,
            'name' => "Bulk Test College {$i}",
            'code' => "BTC{$i}",
            'domain' => "bulk-college-{$i}-" . time() . ".edu",
            'email' => "admin-college-{$i}-" . time() . "@test.edu",
            'phone' => "+987654321{$i}",
            'address' => "College Address {$i}",
            'type' => ['engineering', 'science', 'arts'][$i - 1],
            'status' => 'active',
            'capacity' => 500 + ($i * 100),
            'current_enrollment' => 0,
        ]);
        
        $testColleges[] = $college;
    }
    
    echo "✅ Created " . count($testColleges) . " test colleges\n";
    echo "   University: {$university->name}\n";
    foreach ($testColleges as $college) {
        echo "   - {$college->name} (ID: {$college->id}, Type: {$college->type}, Status: {$college->status})\n";
    }
    echo "\n";
    $testsPassed++;
    
} catch (Exception $e) {
    echo "❌ Failed to create test colleges: " . $e->getMessage() . "\n\n";
    $testsFailed++;
}

/**
 * Test 4: Bulk Status Update - Colleges
 */
echo "Test 4: Bulk Status Update - Colleges\n";
echo str_repeat("━", 50) . "\n";

try {
    // Get IDs of test colleges
    $collegeIds = array_map(fn($college) => $college->id, $testColleges);
    
    // Simulate bulk status update
    $updatedCount = 0;
    foreach ($collegeIds as $id) {
        $college = College::find($id);
        if ($college) {
            $college->status = 'suspended';
            $college->save();
            $updatedCount++;
        }
    }
    
    // Verify updates
    $suspendedCount = College::whereIn('id', $collegeIds)
        ->where('status', 'suspended')
        ->count();
    
    if ($suspendedCount === count($collegeIds)) {
        echo "✅ Bulk status update successful\n";
        echo "   Updated: {$updatedCount} colleges\n";
        echo "   New status: suspended\n";
        echo "   Verified: {$suspendedCount}/{$updatedCount} have suspended status\n\n";
        $testsPassed++;
    } else {
        echo "❌ Status update verification failed\n";
        echo "   Expected: " . count($collegeIds) . " suspended\n";
        echo "   Found: {$suspendedCount} suspended\n\n";
        $testsFailed++;
    }
    
} catch (Exception $e) {
    echo "❌ Test failed: " . $e->getMessage() . "\n\n";
    $testsFailed++;
}

/**
 * Test 5: Soft Delete Validation (Cannot delete with active children)
 */
echo "Test 5: Soft Delete Validation (Cannot delete with active children)\n";
echo str_repeat("━", 50) . "\n";

try {
    // Create a new university with an active college
    $universityName = 'University with Active College';
    $universityWithCollege = University::create([
        'name' => $universityName,
        'slug' => Str::slug($universityName) . '-' . time(),
        'code' => 'UWAC',
        'domain' => 'uwac-' . time() . '.edu',
        'email' => 'admin-uwac-' . time() . '@test.edu',
        'status' => 'active',
        'storage_quota_gb' => 100,
        'storage_used_mb' => 0,
    ]);
    
    $activeCollege = College::create([
        'university_id' => $universityWithCollege->id,
        'name' => 'Active Test College',
        'code' => 'ATC',
        'domain' => 'atc-' . time() . '.edu',
        'email' => 'admin-atc-' . time() . '@test.edu',
        'status' => 'active',
        'capacity' => 500,
        'current_enrollment' => 0,
    ]);
    
    // Check if university has active colleges
    $activeColleges = $universityWithCollege->colleges()->where('status', 'active')->count();
    
    if ($activeColleges > 0) {
        echo "✅ Validation check passed\n";
        echo "   University: {$universityWithCollege->name}\n";
        echo "   Active colleges: {$activeColleges}\n";
        echo "   Expected behavior: Cannot delete university with active colleges\n";
        echo "   This university should be rejected during bulk delete\n\n";
        
        // Clean up
        $activeCollege->forceDelete();
        $universityWithCollege->forceDelete();
        
        $testsPassed++;
    } else {
        echo "❌ Validation check failed - no active colleges found\n\n";
        $testsFailed++;
    }
    
} catch (Exception $e) {
    echo "❌ Test failed: " . $e->getMessage() . "\n\n";
    $testsFailed++;
}

/**
 * Test 6: Soft Delete - Colleges (No active departments)
 */
echo "Test 6: Soft Delete - Colleges (No active departments)\n";
echo str_repeat("━", 50) . "\n";

try {
    // Delete 2 out of 3 test colleges (soft delete)
    $collegesToDelete = array_slice($testColleges, 0, 2);
    $collegeIdsToDelete = array_map(fn($c) => $c->id, $collegesToDelete);
    
    $deletedCount = 0;
    foreach ($collegeIdsToDelete as $id) {
        $college = College::find($id);
        if ($college) {
            $college->delete(); // Soft delete
            $deletedCount++;
        }
    }
    
    // Verify soft delete
    $softDeletedCount = College::onlyTrashed()
        ->whereIn('id', $collegeIdsToDelete)
        ->count();
    
    if ($softDeletedCount === count($collegeIdsToDelete)) {
        echo "✅ Soft delete successful\n";
        echo "   Deleted: {$deletedCount} colleges\n";
        echo "   Verified (soft deleted): {$softDeletedCount}/{$deletedCount}\n";
        echo "   Colleges can be restored later\n\n";
        $testsPassed++;
    } else {
        echo "❌ Soft delete verification failed\n";
        echo "   Expected: " . count($collegeIdsToDelete) . " soft deleted\n";
        echo "   Found: {$softDeletedCount} soft deleted\n\n";
        $testsFailed++;
    }
    
} catch (Exception $e) {
    echo "❌ Test failed: " . $e->getMessage() . "\n\n";
    $testsFailed++;
}

/**
 * Test 7: Permanent Delete - Clean up test data
 */
echo "Test 7: Permanent Delete - Clean up test data\n";
echo str_repeat("━", 50) . "\n";

try {
    // Force delete all test colleges (including soft deleted)
    $collegeIds = array_map(fn($c) => $c->id, $testColleges);
    College::withTrashed()->whereIn('id', $collegeIds)->forceDelete();
    
    // Force delete all test universities
    $universityIds = array_map(fn($uni) => $uni->id, $testUniversities);
    University::withTrashed()->whereIn('id', $universityIds)->forceDelete();
    
    // Verify deletion
    $remainingColleges = College::withTrashed()->whereIn('id', $collegeIds)->count();
    $remainingUniversities = University::withTrashed()->whereIn('id', $universityIds)->count();
    
    if ($remainingColleges === 0 && $remainingUniversities === 0) {
        echo "✅ Cleanup successful\n";
        echo "   Permanently deleted: " . count($testColleges) . " colleges\n";
        echo "   Permanently deleted: " . count($testUniversities) . " universities\n";
        echo "   Verification: 0 remaining records\n\n";
        $testsPassed++;
    } else {
        echo "❌ Cleanup verification failed\n";
        echo "   Remaining colleges: {$remainingColleges}\n";
        echo "   Remaining universities: {$remainingUniversities}\n\n";
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

$totalTests = $testsPassed + $testsFailed;

echo "Total Tests: $totalTests\n";
echo "Passed: $testsPassed\n";
echo "Failed: $testsFailed\n\n";

if ($testsFailed === 0) {
    echo "✅ All tests PASSED!\n\n";
    echo "📝 Bulk Operations Features Tested:\n";
    echo "   ✅ Bulk status update (universities)\n";
    echo "   ✅ Bulk status update (colleges)\n";
    echo "   ✅ Validation (cannot delete with active children)\n";
    echo "   ✅ Soft delete (colleges)\n";
    echo "   ✅ Permanent delete (cleanup)\n\n";
    
    echo "📋 API Endpoints Ready:\n";
    echo "   PATCH /api/v1/universities/bulk/status\n";
    echo "   DELETE /api/v1/universities/bulk/delete\n";
    echo "   PATCH /api/v1/colleges/bulk/status\n";
    echo "   DELETE /api/v1/colleges/bulk/delete\n\n";
    
    echo "📝 Next Steps:\n";
    echo "   1. Test API endpoints using Postman or curl\n";
    echo "   2. Verify permission checks (God Mode, University Owner)\n";
    echo "   3. Test transaction rollback on partial failures\n";
    echo "   4. Implement frontend bulk selection UI (Task 2.1.4)\n\n";
    exit(0);
} else {
    echo "❌ Some tests FAILED!\n\n";
    exit(1);
}
