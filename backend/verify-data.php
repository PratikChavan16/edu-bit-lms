#!/usr/bin/env php
<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\University;
use App\Models\College;
use App\Models\Department;

echo "\n🔍 Verifying Data Scoping...\n";
echo "============================\n\n";

// Check Universities and their colleges
echo "📚 COLLEGES BY UNIVERSITY:\n";
foreach (University::with('colleges')->get() as $uni) {
    echo "\n✓ {$uni->name}:\n";
    foreach ($uni->colleges as $college) {
        echo "  - {$college->name} (code: {$college->code})\n";
    }
}

// Check Colleges and their departments
echo "\n\n🏢 DEPARTMENTS BY COLLEGE:\n";
foreach (College::with(['departments', 'university'])->get() as $college) {
    echo "\n✓ {$college->name} ({$college->university->name}):\n";
    foreach ($college->departments as $dept) {
        echo "  - {$dept->name} (code: {$dept->code})\n";
    }
}

// Check for any mismatched data
echo "\n\n🔍 DATA INTEGRITY CHECK:\n";
$mismatchedDepts = Department::whereRaw('university_id != (SELECT university_id FROM colleges WHERE id = departments.college_id)')->count();
echo "Mismatched departments (university_id != college's university_id): {$mismatchedDepts}\n";

if ($mismatchedDepts === 0) {
    echo "\n✅ All departments are properly scoped to their colleges!\n";
} else {
    echo "\n⚠️  Found {$mismatchedDepts} departments with incorrect university_id!\n";
}

echo "\n📊 SUMMARY:\n";
echo "Universities: " . University::count() . "\n";
echo "Colleges: " . College::count() . "\n";
echo "Departments: " . Department::count() . "\n";
echo "Users: " . \App\Models\User::count() . "\n";
echo "Faculty: " . \App\Models\Faculty::count() . "\n";
echo "Students: " . \App\Models\Student::count() . "\n";

echo "\n✅ Data verification complete!\n\n";
