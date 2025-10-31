<?php

/**
 * God Mode Test Script
 * 
 * This script tests that the UniversityScope correctly bypasses filtering
 * for users with the bitflow_owner role (God Mode).
 * 
 * Usage: php test-god-mode.php
 */

require __DIR__ . '/vendor/autoload.php';

use Illuminate\Foundation\Application;
use App\Models\User;
use App\Models\University;
use App\Models\Role;

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "\n";
echo "==============================================\n";
echo "   GOD MODE TEST - UniversityScope Bypass\n";
echo "==============================================\n\n";

try {
    // Test 1: Count total universities in database
    echo "📊 Test 1: Total Universities in Database\n";
    $totalUniversities = University::withoutGlobalScope(App\Scopes\UniversityScope::class)->count();
    echo "   Total universities (no scope): {$totalUniversities}\n\n";

    // Test 2: Get bitflow_owner user
    echo "👑 Test 2: Finding Bitflow Owner User\n";
    $bitflowOwnerRole = Role::where('slug', 'bitflow_owner')->first();
    
    if (!$bitflowOwnerRole) {
        echo "   ❌ ERROR: bitflow_owner role not found!\n";
        echo "   Please run: php artisan db:seed --class=RoleSeeder\n\n";
        exit(1);
    }
    
    $bitflowOwner = User::withoutGlobalScope(App\Scopes\UniversityScope::class)
        ->whereHas('roles', function($q) {
            $q->where('slug', 'bitflow_owner');
        })
        ->first();

    if (!$bitflowOwner) {
        echo "   ⚠️  WARNING: No user with bitflow_owner role exists\n";
        echo "   Creating test Bitflow Owner user...\n";
        
        $bitflowOwner = User::withoutGlobalScope(App\Scopes\UniversityScope::class)->create([
            'username' => 'bitflow_admin',
            'first_name' => 'Bitflow',
            'last_name' => 'Owner',
            'email' => 'admin@bitflow.com',
            'password' => Hash::make('password'),
            'university_id' => null, // Platform-level user
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
        
        $bitflowOwner->roles()->attach($bitflowOwnerRole->id, [
            'id' => (string) Illuminate\Support\Str::uuid(),
            'assigned_at' => now(),
        ]);
        
        echo "   ✅ Created test user: {$bitflowOwner->email} (password: password)\n";
    } else {
        echo "   ✅ Found bitflow_owner: {$bitflowOwner->email}\n";
    }
    echo "\n";

    // Test 3: Authenticate as Bitflow Owner and test scope
    echo "🔐 Test 3: Testing God Mode Scope Bypass\n";
    auth()->login($bitflowOwner);
    echo "   Authenticated as: {$bitflowOwner->full_name}\n";
    
    $universitiesSeenByGodMode = University::count();
    echo "   Universities visible to God Mode: {$universitiesSeenByGodMode}\n";
    
    if ($universitiesSeenByGodMode === $totalUniversities) {
        echo "   ✅ SUCCESS: God Mode sees ALL universities!\n";
    } else {
        echo "   ❌ FAILED: God Mode should see {$totalUniversities} but sees {$universitiesSeenByGodMode}\n";
    }
    echo "\n";

    // Test 4: Get a regular university user and test scoped model
    echo "👤 Test 4: Testing Regular User Scoping (College Model)\n";
    $universityOwnerRole = Role::where('slug', 'university_owner')->first();
    
    $universityUser = User::withoutGlobalScope(App\Scopes\UniversityScope::class)
        ->whereHas('roles', function($q) {
            $q->where('slug', 'university_owner');
        })
        ->whereNotNull('university_id')
        ->first();

    if (!$universityUser) {
        echo "   ⚠️  WARNING: No university_owner user found\n";
        echo "   Skipping regular user test\n\n";
    } else {
        auth()->login($universityUser);
        echo "   Authenticated as: {$universityUser->full_name}\n";
        echo "   University ID: {$universityUser->university_id}\n";
        
        // Test with College model (which has UniversityScope applied)
        $totalColleges = App\Models\College::withoutGlobalScope(App\Scopes\UniversityScope::class)->count();
        $collegesSeenByRegularUser = App\Models\College::count();
        
        echo "   Total colleges in database: {$totalColleges}\n";
        echo "   Colleges visible to regular user: {$collegesSeenByRegularUser}\n";
        
        $expectedColleges = App\Models\College::withoutGlobalScope(App\Scopes\UniversityScope::class)
            ->where('university_id', $universityUser->university_id)
            ->count();
        
        echo "   Expected colleges for this university: {$expectedColleges}\n";
        
        if ($collegesSeenByRegularUser === $expectedColleges && $collegesSeenByRegularUser < $totalColleges) {
            echo "   ✅ SUCCESS: Regular user sees only their university's colleges!\n";
        } else {
            echo "   ❌ FAILED: Regular user should see {$expectedColleges} but sees {$collegesSeenByRegularUser}\n";
        }
        echo "\n";
    }

    // Test 5: Re-authenticate as God Mode and test College scoping
    echo "👑 Test 5: Re-testing God Mode with College Model\n";
    auth()->login($bitflowOwner);
    echo "   Authenticated as: {$bitflowOwner->full_name}\n";
    
    $totalColleges = App\Models\College::withoutGlobalScope(App\Scopes\UniversityScope::class)->count();
    $collegesSeenByGodMode = App\Models\College::count();
    
    echo "   Total colleges in database: {$totalColleges}\n";
    echo "   Colleges visible to God Mode: {$collegesSeenByGodMode}\n";
    
    if ($collegesSeenByGodMode === $totalColleges) {
        echo "   ✅ SUCCESS: God Mode sees ALL colleges!\n";
    } else {
        echo "   ❌ FAILED: God Mode should see {$totalColleges} but sees {$collegesSeenByGodMode}\n";
    }
    echo "\n";

    // Summary
    echo "==============================================\n";
    echo "   TEST SUMMARY\n";
    echo "==============================================\n";
    echo "Total Universities: {$totalUniversities}\n";
    echo "Total Colleges: {$totalColleges}\n";
    echo "God Mode Access (Universities): " . ($universitiesSeenByGodMode === $totalUniversities ? "✅ WORKING" : "❌ FAILED") . "\n";
    echo "God Mode Access (Colleges): " . ($collegesSeenByGodMode === $totalColleges ? "✅ WORKING" : "❌ FAILED") . "\n";
    if ($universityUser) {
        echo "Regular User Scoping (Colleges): " . (($collegesSeenByRegularUser === $expectedColleges && $collegesSeenByRegularUser < $totalColleges) ? "✅ WORKING" : "❌ FAILED") . "\n";
    }
    echo "\n";
    
    echo "🎉 God Mode implementation test complete!\n\n";

} catch (\Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace:\n";
    echo $e->getTraceAsString() . "\n\n";
    exit(1);
}
