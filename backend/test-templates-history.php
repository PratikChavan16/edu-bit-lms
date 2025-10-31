<?php

require __DIR__.'/vendor/autoload.php';

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\DB;
use App\Models\ReportTemplate;
use App\Models\ReportHistory;
use App\Models\User;

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Report Templates & History Test ===\n\n";

try {
    // Test 1: Database tables exist
    echo "Test 1: Database Tables\n";
    echo "------------------------------------\n";
    
    // Check if tables exist using INFORMATION_SCHEMA or direct query
    try {
        DB::table('report_templates')->limit(1)->get();
        echo "✓ report_templates table exists\n";
    } catch (\Exception $e) {
        echo "✗ report_templates table missing\n";
        exit(1);
    }
    
    try {
        DB::table('report_history')->limit(1)->get();
        echo "✓ report_history table exists\n";
    } catch (\Exception $e) {
        echo "✗ report_history table missing\n";
        exit(1);
    }
    
    echo "\n";
    
    // Test 2: System templates seeded
    echo "Test 2: System Templates\n";
    echo "------------------------------------\n";
    
    $systemTemplates = ReportTemplate::where('is_system', true)->get();
    echo "✓ System templates found: " . $systemTemplates->count() . "\n";
    
    foreach ($systemTemplates as $template) {
        echo "  - {$template->name} ({$template->report_type})\n";
    }
    
    if ($systemTemplates->count() < 6) {
        echo "✗ Missing system templates (expected 6)\n";
        exit(1);
    }
    
    echo "\n";
    
    // Test 3: Create custom template
    echo "Test 3: Create Custom Template\n";
    echo "------------------------------------\n";
    
    $user = User::where('email', 'admin@bitflow.app')->first();
    if (!$user) {
        echo "✗ Test user not found\n";
        exit(1);
    }
    
    $customTemplate = ReportTemplate::create([
        'university_id' => null,
        'created_by' => $user->id,
        'name' => 'My Active Universities',
        'description' => 'Custom template for tracking active universities',
        'report_type' => 'universities',
        'filters' => ['status' => ['active']],
        'options' => ['paper' => 'a4', 'orientation' => 'portrait'],
        'is_system' => false,
        'is_public' => false,
    ]);
    
    echo "✓ Custom template created: {$customTemplate->id}\n";
    echo "  Name: {$customTemplate->name}\n";
    echo "  Type: {$customTemplate->report_type}\n";
    echo "  System: " . ($customTemplate->is_system ? 'Yes' : 'No') . "\n";
    echo "  Public: " . ($customTemplate->is_public ? 'Yes' : 'No') . "\n";
    
    echo "\n";
    
    // Test 4: Template scopes
    echo "Test 4: Template Scopes\n";
    echo "------------------------------------\n";
    
    $systemCount = ReportTemplate::system()->count();
    echo "✓ System templates: {$systemCount}\n";
    
    $customCount = ReportTemplate::custom()->count();
    echo "✓ Custom templates: {$customCount}\n";
    
    $publicCount = ReportTemplate::public()->count();
    echo "✓ Public templates: {$publicCount}\n";
    
    $universitiesCount = ReportTemplate::reportType('universities')->count();
    echo "✓ Universities templates: {$universitiesCount}\n";
    
    echo "\n";
    
    // Test 5: Create report history
    echo "Test 5: Create Report History\n";
    echo "------------------------------------\n";
    
    $history = ReportHistory::create([
        'university_id' => null,
        'generated_by' => $user->id,
        'template_id' => $customTemplate->id,
        'name' => 'Test Active Universities Report',
        'report_type' => 'universities',
        'filters' => ['status' => ['active']],
        'options' => ['paper' => 'a4', 'orientation' => 'portrait'],
        'file_path' => 'reports/history/test_report_' . now()->format('YmdHis') . '.pdf',
        'file_name' => 'test_report_' . now()->format('YmdHis') . '.pdf',
        'file_size_kb' => 856,
        'records_count' => 4,
        'generated_at' => now(),
    ]);
    
    echo "✓ History record created: {$history->id}\n";
    echo "  Report type: {$history->report_type}\n";
    echo "  File path: {$history->file_path}\n";
    echo "  File size: {$history->file_size_kb} KB\n";
    echo "  Records: {$history->records_count}\n";
    echo "  Template used: " . ($history->template ? 'Yes' : 'No') . "\n";
    
    echo "\n";
    
    // Test 6: History relationships
    echo "Test 6: History Relationships\n";
    echo "------------------------------------\n";
    
    $history->load(['generator', 'template']);
    echo "✓ Generator: {$history->generator->name}\n";
    echo "✓ Template: {$history->template->name}\n";
    
    echo "\n";
    
    // Test 7: Template usage count
    echo "Test 7: Template Usage Count\n";
    echo "------------------------------------\n";
    
    $customTemplate->increment('usage_count');
    $customTemplate->refresh();
    
    echo "✓ Template usage count: {$customTemplate->usage_count}\n";
    
    echo "\n";
    
    // Test 8: History scopes
    echo "Test 8: History Scopes\n";
    echo "------------------------------------\n";
    
    $recentHistory = ReportHistory::recent()->count();
    echo "✓ Recent history (30 days): {$recentHistory}\n";
    
    $universitiesHistory = ReportHistory::reportType('universities')->count();
    echo "✓ Universities history: {$universitiesHistory}\n";
    
    echo "\n";
    
    // Test 9: Multiple report types
    echo "Test 9: Multiple Report Types\n";
    echo "------------------------------------\n";
    
    $reportTypes = ['universities', 'colleges', 'users'];
    foreach ($reportTypes as $type) {
        $templates = ReportTemplate::reportType($type)->count();
        echo "✓ {$type} templates: {$templates}\n";
    }
    
    echo "\n";
    
    // Test 10: Template with filters
    echo "Test 10: Template Filters\n";
    echo "------------------------------------\n";
    
    $templateWithFilters = ReportTemplate::create([
        'university_id' => null,
        'created_by' => $user->id,
        'name' => 'Engineering Colleges Report',
        'description' => 'All engineering colleges',
        'report_type' => 'colleges',
        'filters' => [
            'type' => ['engineering'],
            'status' => ['active'],
        ],
        'options' => ['paper' => 'letter', 'orientation' => 'landscape'],
        'is_system' => false,
        'is_public' => true,
    ]);
    
    echo "✓ Template with filters created\n";
    echo "  Filters: " . json_encode($templateWithFilters->filters) . "\n";
    echo "  Options: " . json_encode($templateWithFilters->options) . "\n";
    
    echo "\n";
    
    // Test 11: Cleanup
    echo "Test 11: Cleanup\n";
    echo "------------------------------------\n";
    
    $customTemplate->delete();
    $templateWithFilters->delete();
    $history->delete();
    
    echo "✓ Test templates deleted\n";
    echo "✓ Test history deleted\n";
    
    echo "\n";
    
    echo "=== Test Summary ===\n";
    echo "All tests PASSED ✓\n";
    echo "\nReport Templates & History system is working correctly!\n";
    echo "\nSystem Templates Available:\n";
    
    $templates = ReportTemplate::system()->get();
    foreach ($templates as $template) {
        echo "  - {$template->name}\n";
        echo "    Type: {$template->report_type}\n";
        echo "    Description: {$template->description}\n";
        echo "    Usage: {$template->usage_count} times\n\n";
    }
    
} catch (Exception $e) {
    echo "\n✗ Test failed: {$e->getMessage()}\n";
    echo "Stack trace:\n{$e->getTraceAsString()}\n";
    exit(1);
}
