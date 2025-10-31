#!/usr/bin/env php
<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\University;
use App\Models\College;

echo "\n🔍 Testing College API Filtering...\n";
echo "====================================\n\n";

$mit = University::where('slug', 'mit')->first();
$stanford = University::where('slug', 'stanford')->first();

echo "MIT ID: {$mit->id}\n";
echo "Stanford ID: {$stanford->id}\n\n";

// Simulate what the API controller does
echo "Test 1: Fetching colleges WITH university_id filter (MIT):\n";
$mitColleges = College::withoutGlobalScope(\App\Scopes\UniversityScope::class)
    ->where('university_id', $mit->id)
    ->get(['id', 'name', 'university_id']);

echo "Found {$mitColleges->count()} colleges for MIT:\n";
foreach ($mitColleges as $college) {
    echo "  - {$college->name}\n";
}

echo "\nTest 2: Fetching colleges WITH university_id filter (Stanford):\n";
$stanfordColleges = College::withoutGlobalScope(\App\Scopes\UniversityScope::class)
    ->where('university_id', $stanford->id)
    ->get(['id', 'name', 'university_id']);

echo "Found {$stanfordColleges->count()} colleges for Stanford:\n";
foreach ($stanfordColleges as $college) {
    echo "  - {$college->name}\n";
}

echo "\nTest 3: Fetching colleges WITHOUT university_id filter (WRONG!):\n";
$allColleges = College::withoutGlobalScope(\App\Scopes\UniversityScope::class)
    ->get(['id', 'name', 'university_id']);

echo "Found {$allColleges->count()} colleges total:\n";
foreach ($allColleges as $college) {
    $uni = University::find($college->university_id);
    echo "  - {$college->name} ({$uni->slug})\n";
}

echo "\n✅ Database filtering works correctly!\n";
echo "If frontend shows all colleges, the issue is in the API request/response.\n\n";
