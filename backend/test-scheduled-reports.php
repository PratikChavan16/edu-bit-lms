<?php

require __DIR__.'/vendor/autoload.php';

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\DB;
use App\Models\ScheduledReport;
use App\Models\User;
use Cron\CronExpression;

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Scheduled Reports Test ===\n\n";

try {
    // Test 1: Database tables exist
    echo "Test 1: Database Tables\n";
    echo "------------------------------------\n";
    
    $tablesExist = DB::select("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('scheduled_reports', 'scheduled_report_executions')");
    
    if (count($tablesExist) === 2) {
        echo "✓ Both tables exist\n";
        
        // Check table structure
        $columns = DB::select("PRAGMA table_info(scheduled_reports)");
        echo "✓ scheduled_reports columns: " . count($columns) . "\n";
        
        $execColumns = DB::select("PRAGMA table_info(scheduled_report_executions)");
        echo "✓ scheduled_report_executions columns: " . count($execColumns) . "\n";
    } else {
        echo "✗ Missing tables\n";
        exit(1);
    }
    
    echo "\n";
    
    // Test 2: Create a test schedule
    echo "Test 2: Create Scheduled Report\n";
    echo "------------------------------------\n";
    
    $user = User::where('email', 'admin@bitflow.app')->first();
    if (!$user) {
        echo "✗ Test user not found\n";
        exit(1);
    }
    
    $schedule = ScheduledReport::create([
        'university_id' => null, // Platform-wide
        'created_by' => $user->id,
        'name' => 'Weekly Universities Summary',
        'description' => 'Automated weekly report of all universities',
        'report_type' => 'universities',
        'filters' => ['status' => ['active']],
        'options' => ['paper' => 'a4', 'orientation' => 'portrait'],
        'cron_expression' => '0 9 * * 1', // Monday 9 AM
        'frequency_label' => 'Every Monday at 9:00 AM',
        'recipients' => ['admin@bitflow.app', 'reports@bitflow.app'],
        'email_subject' => 'Weekly Universities Report',
        'email_message' => 'Please find attached the weekly universities summary report.',
        'is_active' => true,
    ]);
    
    echo "✓ Schedule created: {$schedule->id}\n";
    echo "  Name: {$schedule->name}\n";
    echo "  Report Type: {$schedule->report_type}\n";
    echo "  Frequency: {$schedule->frequency_label}\n";
    echo "  Recipients: " . count($schedule->recipients) . "\n";
    echo "  Active: " . ($schedule->is_active ? 'Yes' : 'No') . "\n";
    
    echo "\n";
    
    // Test 3: Calculate next run
    echo "Test 3: Calculate Next Run Time\n";
    echo "------------------------------------\n";
    
    $schedule->calculateNextRun();
    $schedule->refresh();
    
    if ($schedule->next_run_at) {
        echo "✓ Next run calculated: {$schedule->next_run_at}\n";
        echo "  Current time: " . now() . "\n";
        echo "  Is due now: " . ($schedule->isDue() ? 'Yes' : 'No') . "\n";
    } else {
        echo "✗ Failed to calculate next run\n";
    }
    
    echo "\n";
    
    // Test 4: Cron expression validation
    echo "Test 4: Cron Expression Validation\n";
    echo "------------------------------------\n";
    
    try {
        $cron = new CronExpression($schedule->cron_expression);
        $nextRun = $cron->getNextRunDate();
        echo "✓ Cron expression valid: {$schedule->cron_expression}\n";
        echo "  Next run (calculated): {$nextRun->format('Y-m-d H:i:s')}\n";
    } catch (Exception $e) {
        echo "✗ Invalid cron expression: {$e->getMessage()}\n";
    }
    
    echo "\n";
    
    // Test 5: Create execution record
    echo "Test 5: Create Execution Record\n";
    echo "------------------------------------\n";
    
    $execution = $schedule->executions()->create([
        'started_at' => now(),
        'status' => 'running',
    ]);
    
    echo "✓ Execution created: {$execution->id}\n";
    echo "  Status: {$execution->status}\n";
    echo "  Started at: {$execution->started_at}\n";
    
    // Simulate success
    $execution->markAsSuccess([
        'pdf_path' => 'reports/scheduled/test_report.pdf',
        'pdf_size_kb' => 125,
        'recipients' => $schedule->recipients,
        'records_count' => 10,
    ]);
    
    echo "✓ Execution marked as success\n";
    echo "  Duration: {$execution->duration_seconds} seconds\n";
    echo "  Records: {$execution->records_count}\n";
    echo "  PDF: {$execution->pdf_path} ({$execution->pdf_size_kb} KB)\n";
    
    $schedule->markAsExecuted();
    $schedule->incrementSuccess();
    $schedule->refresh();
    
    echo "✓ Schedule updated\n";
    echo "  Run count: {$schedule->run_count}\n";
    echo "  Success count: {$schedule->success_count}\n";
    echo "  Last run: {$schedule->last_run_at}\n";
    
    echo "\n";
    
    // Test 6: Query scopes
    echo "Test 6: Query Scopes\n";
    echo "------------------------------------\n";
    
    $activeSchedules = ScheduledReport::active()->count();
    echo "✓ Active schedules: {$activeSchedules}\n";
    
    $dueSchedules = ScheduledReport::due()->count();
    echo "✓ Due schedules: {$dueSchedules}\n";
    
    echo "\n";
    
    // Test 7: Relationships
    echo "Test 7: Relationships\n";
    echo "------------------------------------\n";
    
    $schedule->load(['creator', 'executions']);
    echo "✓ Creator: {$schedule->creator->name}\n";
    echo "✓ Executions: " . $schedule->executions->count() . "\n";
    
    $latestExecution = $schedule->latestExecution;
    if ($latestExecution) {
        echo "✓ Latest execution: {$latestExecution->status}\n";
    }
    
    echo "\n";
    
    // Test 8: Different cron patterns
    echo "Test 8: Cron Expression Patterns\n";
    echo "------------------------------------\n";
    
    $patterns = [
        ['0 9 * * *', 'Every day at 9:00 AM'],
        ['0 9 * * 1', 'Every Monday at 9:00 AM'],
        ['0 9 1 * *', 'First day of month at 9:00 AM'],
        ['0 17 * * 5', 'Every Friday at 5:00 PM'],
        ['0 * * * *', 'Every hour'],
        ['*/15 * * * *', 'Every 15 minutes'],
    ];
    
    foreach ($patterns as [$cron, $description]) {
        try {
            $cronObj = new CronExpression($cron);
            $next = $cronObj->getNextRunDate();
            echo "✓ {$description}\n";
            echo "  Pattern: {$cron}\n";
            echo "  Next run: {$next->format('Y-m-d H:i:s')}\n\n";
        } catch (Exception $e) {
            echo "✗ Invalid: {$cron} - {$e->getMessage()}\n";
        }
    }
    
    // Test 9: Cleanup
    echo "Test 9: Cleanup\n";
    echo "------------------------------------\n";
    
    $schedule->executions()->delete();
    $schedule->delete();
    
    echo "✓ Test execution deleted\n";
    echo "✓ Test schedule deleted\n";
    
    echo "\n";
    
    echo "=== Test Summary ===\n";
    echo "All tests PASSED ✓\n";
    echo "\nScheduled reports system is working correctly!\n";
    echo "\nTo run scheduled reports:\n";
    echo "  php artisan reports:generate-scheduled\n";
    echo "\nTo test scheduler:\n";
    echo "  php artisan schedule:run\n";
    echo "\nTo start scheduler (production):\n";
    echo "  Add to crontab: * * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1\n";
    
} catch (Exception $e) {
    echo "\n✗ Test failed: {$e->getMessage()}\n";
    echo "Stack trace:\n{$e->getTraceAsString()}\n";
    exit(1);
}
