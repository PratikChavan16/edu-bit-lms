<?php

/**
 * Advanced Search API Test Script
 * 
 * Tests the new advanced search endpoints for universities and colleges
 * with multi-field filtering and multi-column sorting.
 * 
 * Run: php test-advanced-search.php
 */

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\Artisan;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "\n";
echo "╔══════════════════════════════════════════════════════════════════════════╗\n";
echo "║          ADVANCED SEARCH API - COMPREHENSIVE TEST SUITE                  ║\n";
echo "╚══════════════════════════════════════════════════════════════════════════╝\n";
echo "\n";

// Test counter
$testsRun = 0;
$testsPassed = 0;
$testsFailed = 0;

/**
 * Helper function to run a test
 */
function runTest($name, $callable) {
    global $testsRun, $testsPassed, $testsFailed;
    
    $testsRun++;
    echo "🧪 Test {$testsRun}: {$name}\n";
    echo str_repeat('-', 78) . "\n";
    
    try {
        $result = $callable();
        
        if ($result === true) {
            $testsPassed++;
            echo "✅ PASSED\n";
        } else {
            $testsFailed++;
            echo "❌ FAILED: " . ($result ?: 'Assertion failed') . "\n";
        }
    } catch (\Exception $e) {
        $testsFailed++;
        echo "❌ EXCEPTION: {$e->getMessage()}\n";
        echo "   File: {$e->getFile()}:{$e->getLine()}\n";
    }
    
    echo "\n";
}

/**
 * Helper function to make API request
 */
function makeSearchRequest($endpoint, $filters = [], $sort = [], $perPage = 20) {
    $user = App\Models\User::where('email', 'admin@bitflow.app')->first();
    
    if (!$user) {
        throw new \Exception('Test user admin@bitflow.app not found');
    }
    
    // Create request
    $request = Request::create(
        "/api/v1/{$endpoint}",
        'POST',
        [
            'filters' => $filters,
            'sort' => $sort,
            'per_page' => $perPage
        ]
    );
    
    // Authenticate request
    auth()->login($user);
    
    // Call controller based on endpoint
    if (str_starts_with($endpoint, 'universities')) {
        $controller = new App\Http\Controllers\Api\V1\UniversityController();
        return $controller->search($request);
    } else if (str_starts_with($endpoint, 'colleges')) {
        $controller = new App\Http\Controllers\Api\V1\CollegeController();
        return $controller->search($request);
    }
    
    throw new \Exception('Invalid endpoint');
}

/**
 * Helper to get JSON data from response
 */
function getResponseData($response) {
    $content = $response->getContent();
    return json_decode($content, true);
}

echo "📋 SETUP: Using existing test data...\n";
echo str_repeat('-', 78) . "\n";

// Check existing data
$universityCount = App\Models\University::count();
$collegeCount = App\Models\College::count();

echo "  ✓ {$universityCount} universities found\n";
echo "  ✓ {$collegeCount} colleges found\n";

if ($universityCount < 2) {
    echo "  ⚠️  WARNING: Limited test data. Results may vary.\n";
}

echo "✅ Setup complete!\n\n";

// ============================================================================
// UNIVERSITY SEARCH TESTS
// ============================================================================

echo "╔══════════════════════════════════════════════════════════════════════════╗\n";
echo "║                    UNIVERSITY SEARCH TESTS                                ║\n";
echo "╚══════════════════════════════════════════════════════════════════════════╝\n";
echo "\n";

// Test 1: Search by name (partial match)
runTest('University search by name (partial match)', function() {
    $response = makeSearchRequest('universities/search', ['name' => 'University']);
    $data = getResponseData($response);
    
    if (!$data['success']) {
        return 'API returned success=false';
    }
    
    if (empty($data['data'])) {
        return 'No results returned';
    }
    
    // All results should contain "University" in name
    foreach ($data['data'] as $uni) {
        if (stripos($uni['name'], 'University') === false) {
            return "Result '{$uni['name']}' doesn't match filter";
        }
    }
    
    echo "  Found {$data['meta']['total']} universities with 'University' in name\n";
    return true;
});

// Test 2: Filter by status (multiple values)
runTest('University filter by multiple statuses', function() {
    $response = makeSearchRequest('universities/search', ['status' => ['active', 'inactive']]);
    $data = getResponseData($response);
    
    if (!$data['success']) {
        return 'API returned success=false';
    }
    
    // All results should have status 'active' or 'inactive'
    foreach ($data['data'] as $uni) {
        if (!in_array($uni['status'], ['active', 'inactive'])) {
            return "Unexpected status: {$uni['status']}";
        }
    }
    
    echo "  Found {$data['meta']['total']} universities with status active/inactive\n";
    return true;
});

// Test 3: Filter by established year range
runTest('University filter by established year range', function() {
    $response = makeSearchRequest('universities/search', [
        'established_year' => ['min' => 1800, 'max' => 1900]
    ]);
    $data = getResponseData($response);
    
    if (!$data['success']) {
        return 'API returned success=false';
    }
    
    // All results should have established_year between 1800 and 1900
    foreach ($data['data'] as $uni) {
        if ($uni['established_year'] < 1800 || $uni['established_year'] > 1900) {
            return "Year {$uni['established_year']} outside range for {$uni['name']}";
        }
    }
    
    echo "  Found {$data['meta']['total']} universities established 1800-1900\n";
    return true;
});

// Test 4: Filter by storage quota range
runTest('University filter by storage quota range', function() {
    $response = makeSearchRequest('universities/search', [
        'storage_quota_gb' => ['min' => 150, 'max' => 300]
    ]);
    $data = getResponseData($response);
    
    if (!$data['success']) {
        return 'API returned success=false';
    }
    
    // All results should have storage_quota_gb between 150 and 300
    foreach ($data['data'] as $uni) {
        if ($uni['storage_quota_gb'] < 150 || $uni['storage_quota_gb'] > 300) {
            return "Quota {$uni['storage_quota_gb']}GB outside range for {$uni['name']}";
        }
    }
    
    echo "  Found {$data['meta']['total']} universities with 150-300GB quota\n";
    return true;
});

// Test 5: Multi-field combined filter
runTest('University multi-field filter (status + year + quota)', function() {
    $response = makeSearchRequest('universities/search', [
        'status' => 'active',
        'established_year' => ['min' => 1850],
        'storage_quota_gb' => ['min' => 100]
    ]);
    $data = getResponseData($response);
    
    if (!$data['success']) {
        return 'API returned success=false';
    }
    
    // Verify all filters applied
    foreach ($data['data'] as $uni) {
        if ($uni['status'] !== 'active') {
            return "Wrong status: {$uni['status']}";
        }
        if ($uni['established_year'] < 1850) {
            return "Year too old: {$uni['established_year']}";
        }
        if ($uni['storage_quota_gb'] < 100) {
            return "Quota too low: {$uni['storage_quota_gb']}";
        }
    }
    
    echo "  Found {$data['meta']['total']} universities matching all criteria\n";
    return true;
});

// Test 6: Multi-column sorting
runTest('University multi-column sorting (status ASC, name DESC)', function() {
    $response = makeSearchRequest('universities/search', [], [
        ['field' => 'status', 'direction' => 'asc'],
        ['field' => 'name', 'direction' => 'desc']
    ]);
    $data = getResponseData($response);
    
    if (!$data['success']) {
        return 'API returned success=false';
    }
    
    if (empty($data['data'])) {
        return 'No results returned';
    }
    
    // Verify sorting
    $prevStatus = null;
    $prevName = null;
    
    foreach ($data['data'] as $uni) {
        if ($prevStatus !== null && $prevStatus !== $uni['status']) {
            // Status changed - should be ascending
            if ($prevStatus > $uni['status']) {
                return "Status not sorted ascending: {$prevStatus} > {$uni['status']}";
            }
        } else if ($prevStatus === $uni['status'] && $prevName !== null) {
            // Same status - name should be descending
            if ($prevName < $uni['name']) {
                return "Name not sorted descending within status: {$prevName} < {$uni['name']}";
            }
        }
        
        $prevStatus = $uni['status'];
        $prevName = $uni['name'];
    }
    
    echo "  Verified sorting: status ASC, name DESC\n";
    return true;
});

// ============================================================================
// COLLEGE SEARCH TESTS
// ============================================================================

echo "╔══════════════════════════════════════════════════════════════════════════╗\n";
echo "║                     COLLEGE SEARCH TESTS                                  ║\n";
echo "╚══════════════════════════════════════════════════════════════════════════╝\n";
echo "\n";

// Test 7: Search colleges by name
runTest('College search by name (partial match)', function() {
    $response = makeSearchRequest('colleges/search', ['name' => 'School']);
    $data = getResponseData($response);
    
    if (!$data['success']) {
        return 'API returned success=false';
    }
    
    if (empty($data['data'])) {
        return 'No results returned';
    }
    
    // All results should contain "School" in name
    foreach ($data['data'] as $college) {
        if (stripos($college['name'], 'School') === false) {
            return "Result '{$college['name']}' doesn't match filter";
        }
    }
    
    echo "  Found {$data['meta']['total']} colleges with 'School' in name\n";
    return true;
});

// Test 8: Filter colleges by type
runTest('College filter by type (engineering, science)', function() {
    $response = makeSearchRequest('colleges/search', ['type' => ['engineering', 'science']]);
    $data = getResponseData($response);
    
    if (!$data['success']) {
        return 'API returned success=false';
    }
    
    // All results should be engineering or science
    foreach ($data['data'] as $college) {
        if (!in_array($college['type'], ['engineering', 'science'])) {
            return "Unexpected type: {$college['type']}";
        }
    }
    
    echo "  Found {$data['meta']['total']} engineering/science colleges\n";
    return true;
});

// Test 9: Filter colleges by university
runTest('College filter by university', function() {
    $mit = App\Models\University::where('domain', 'mit.edu')->first();
    
    $response = makeSearchRequest('colleges/search', ['university_id' => $mit->id]);
    $data = getResponseData($response);
    
    if (!$data['success']) {
        return 'API returned success=false';
    }
    
    // All results should belong to MIT
    foreach ($data['data'] as $college) {
        if ($college['university_id'] !== $mit->id) {
            return "College {$college['name']} belongs to wrong university";
        }
    }
    
    echo "  Found {$data['meta']['total']} colleges at MIT\n";
    return true;
});

// Test 10: Filter colleges by student capacity range
runTest('College filter by student capacity range', function() {
    $response = makeSearchRequest('colleges/search', [
        'student_capacity' => ['min' => 2000, 'max' => 4000]
    ]);
    $data = getResponseData($response);
    
    if (!$data['success']) {
        return 'API returned success=false';
    }
    
    // All results should have capacity between 2000 and 4000
    foreach ($data['data'] as $college) {
        if ($college['student_capacity'] < 2000 || $college['student_capacity'] > 4000) {
            return "Capacity {$college['student_capacity']} outside range for {$college['name']}";
        }
    }
    
    echo "  Found {$data['meta']['total']} colleges with capacity 2000-4000\n";
    return true;
});

// Test 11: College multi-field filter
runTest('College multi-field filter (type + status + capacity)', function() {
    $response = makeSearchRequest('colleges/search', [
        'type' => ['engineering', 'science'],
        'status' => 'active',
        'student_capacity' => ['min' => 3000]
    ]);
    $data = getResponseData($response);
    
    if (!$data['success']) {
        return 'API returned success=false';
    }
    
    // Verify all filters applied
    foreach ($data['data'] as $college) {
        if (!in_array($college['type'], ['engineering', 'science'])) {
            return "Wrong type: {$college['type']}";
        }
        if ($college['status'] !== 'active') {
            return "Wrong status: {$college['status']}";
        }
        if ($college['student_capacity'] < 3000) {
            return "Capacity too low: {$college['student_capacity']}";
        }
    }
    
    echo "  Found {$data['meta']['total']} colleges matching all criteria\n";
    return true;
});

// Test 12: College sorting by capacity DESC
runTest('College sorting by student capacity (descending)', function() {
    $response = makeSearchRequest('colleges/search', [], [
        ['field' => 'student_capacity', 'direction' => 'desc']
    ]);
    $data = getResponseData($response);
    
    if (!$data['success']) {
        return 'API returned success=false';
    }
    
    if (empty($data['data'])) {
        return 'No results returned';
    }
    
    // Verify descending order
    $prevCapacity = PHP_INT_MAX;
    
    foreach ($data['data'] as $college) {
        if ($college['student_capacity'] > $prevCapacity) {
            return "Not sorted descending: {$prevCapacity} < {$college['student_capacity']}";
        }
        $prevCapacity = $college['student_capacity'];
    }
    
    echo "  Verified sorting: capacity DESC\n";
    return true;
});

// ============================================================================
// SUMMARY
// ============================================================================

echo "╔══════════════════════════════════════════════════════════════════════════╗\n";
echo "║                         TEST SUMMARY                                      ║\n";
echo "╚══════════════════════════════════════════════════════════════════════════╝\n";
echo "\n";
echo "  Total Tests:  {$testsRun}\n";
echo "  ✅ Passed:     {$testsPassed}\n";
echo "  ❌ Failed:     {$testsFailed}\n";
echo "\n";

if ($testsFailed === 0) {
    echo "🎉 ALL TESTS PASSED! Advanced search is working perfectly!\n";
    exit(0);
} else {
    $percentage = round(($testsPassed / $testsRun) * 100, 1);
    echo "⚠️  Some tests failed ({$percentage}% pass rate)\n";
    exit(1);
}
