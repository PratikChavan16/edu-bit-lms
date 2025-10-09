<?php
/**
 * API Test Script
 * Run: php test-api.php
 */

$baseUrl = 'http://127.0.0.1:8000/api';

function testEndpoint($url, $name) {
    echo "\n" . str_repeat('=', 60) . "\n";
    echo "Testing: $name\n";
    echo "URL: $url\n";
    echo str_repeat('-', 60) . "\n";
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Accept: application/json',
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if (curl_errno($ch)) {
        echo "❌ ERROR: " . curl_error($ch) . "\n";
        curl_close($ch);
        return false;
    }
    
    curl_close($ch);
    
    echo "Status Code: $httpCode\n";
    
    if ($httpCode >= 200 && $httpCode < 300) {
        echo "✅ SUCCESS\n";
        $json = json_decode($response, true);
        echo "Response:\n";
        echo json_encode($json, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . "\n";
        return true;
    } else {
        echo "❌ FAILED\n";
        echo "Response: $response\n";
        return false;
    }
}

echo "\n";
echo "╔═══════════════════════════════════════════════════════════╗\n";
echo "║           Bitflow Nova - API Testing Suite               ║\n";
echo "╚═══════════════════════════════════════════════════════════╝\n";

// Test endpoints
$tests = [
    ['url' => "$baseUrl/test/health", 'name' => 'Health Check'],
    ['url' => "$baseUrl/test/users", 'name' => 'Users List'],
    ['url' => "$baseUrl/test/students", 'name' => 'Students List'],
    ['url' => "$baseUrl/test/student-dashboard", 'name' => 'Student Dashboard (simulated auth)'],
    ['url' => "$baseUrl/test/admin-students", 'name' => 'Admin Students List (simulated auth)'],
    ['url' => "$baseUrl/test/library-resources", 'name' => 'Library Resources (learner view)'],
    ['url' => "$baseUrl/test/assessments", 'name' => 'Assessments (learner view)'],
    ['url' => "$baseUrl/test/documents", 'name' => 'Document Workflows (learner view)'],
    ['url' => "$baseUrl/test/fees", 'name' => 'Fee Invoices (learner view)'],
];

$passed = 0;
$failed = 0;

foreach ($tests as $test) {
    if (testEndpoint($test['url'], $test['name'])) {
        $passed++;
    } else {
        $failed++;
    }
    sleep(1); // Brief pause between requests
}

echo "\n" . str_repeat('=', 60) . "\n";
echo "Test Summary:\n";
echo "✅ Passed: $passed\n";
echo "❌ Failed: $failed\n";
echo str_repeat('=', 60) . "\n\n";
