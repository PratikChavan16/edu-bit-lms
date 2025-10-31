<?php

namespace App\Console\Commands;

use App\Models\ScheduledReport;
use App\Models\ScheduledReportExecution;
use App\Services\ReportService;
use App\Mail\ScheduledReportMail;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class GenerateScheduledReports extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'reports:generate-scheduled
                            {--schedule-id= : Run a specific schedule by ID}
                            {--force : Force run even if not due}';

    /**
     * The console command description.
     */
    protected $description = 'Generate and email scheduled reports that are due';

    protected ReportService $reportService;

    public function __construct(ReportService $reportService)
    {
        parent::__construct();
        $this->reportService = $reportService;
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('🔄 Checking for scheduled reports...');

        // Get schedules to process
        $schedules = $this->getSchedules();

        if ($schedules->isEmpty()) {
            $this->info('✅ No scheduled reports due.');
            return Command::SUCCESS;
        }

        $this->info("📊 Found {$schedules->count()} scheduled report(s) to process.");

        $successCount = 0;
        $failureCount = 0;

        foreach ($schedules as $schedule) {
            $this->info("\n⏳ Processing: {$schedule->name}");

            try {
                $this->processSchedule($schedule);
                $successCount++;
                $this->info("✅ Success: {$schedule->name}");
            } catch (\Exception $e) {
                $failureCount++;
                $this->error("❌ Failed: {$schedule->name}");
                $this->error("   Error: {$e->getMessage()}");
                \Log::error("Scheduled report failed: {$schedule->id}", [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
            }
        }

        $this->newLine();
        $this->info("📈 Summary: {$successCount} succeeded, {$failureCount} failed");

        return Command::SUCCESS;
    }

    /**
     * Get schedules to process
     */
    protected function getSchedules()
    {
        $scheduleId = $this->option('schedule-id');
        $force = $this->option('force');

        if ($scheduleId) {
            $schedule = ScheduledReport::find($scheduleId);
            if (!$schedule) {
                $this->error("Schedule not found: {$scheduleId}");
                return collect();
            }
            return collect([$schedule]);
        }

        if ($force) {
            return ScheduledReport::active()->get();
        }

        return ScheduledReport::due()->get();
    }

    /**
     * Process a single schedule
     */
    protected function processSchedule(ScheduledReport $schedule): void
    {
        // Create execution record
        $execution = ScheduledReportExecution::create([
            'scheduled_report_id' => $schedule->id,
            'started_at' => now(),
            'status' => 'running',
        ]);

        try {
            // Generate the PDF report
            $this->info("   📄 Generating PDF...");
            $pdfContent = $this->generateReport($schedule);

            // Save PDF to storage
            $fileName = $this->generateFileName($schedule);
            $filePath = "reports/scheduled/{$fileName}";
            Storage::disk('local')->put($filePath, $pdfContent);
            $fileSize = strlen($pdfContent) / 1024; // KB

            $this->info("   💾 Saved: {$filePath} ({$fileSize} KB)");

            // Send emails
            $this->info("   📧 Sending emails to " . count($schedule->recipients) . " recipient(s)...");
            $this->sendEmails($schedule, $pdfContent, $fileName);

            // Mark execution as successful
            $execution->markAsSuccess([
                'pdf_path' => $filePath,
                'pdf_size_kb' => (int) $fileSize,
                'recipients' => $schedule->recipients,
                'records_count' => 0, // Can be extracted from report if needed
            ]);

            // Update schedule
            $schedule->markAsExecuted();
            $schedule->incrementSuccess();

        } catch (\Exception $e) {
            // Mark execution as failed
            $execution->markAsFailed($e->getMessage(), [
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            $schedule->incrementFailure();

            throw $e;
        }
    }

    /**
     * Generate the PDF report
     */
    protected function generateReport(ScheduledReport $schedule): string
    {
        $filters = $schedule->filters ?? [];
        $options = array_merge($schedule->options ?? [], [
            'save' => false, // Return binary instead of saving
        ]);

        return match ($schedule->report_type) {
            'universities' => $this->reportService->generateUniversityReport($filters, $options),
            'colleges' => $this->reportService->generateCollegeReport($filters, $options),
            'users' => $this->reportService->generateUsersReport($filters, $options),
            default => throw new \Exception("Unknown report type: {$schedule->report_type}"),
        };
    }

    /**
     * Send emails to recipients
     */
    protected function sendEmails(ScheduledReport $schedule, string $pdfContent, string $fileName): void
    {
        $subject = $schedule->email_subject ?: "{$schedule->name} - " . now()->format('M d, Y');
        $message = $schedule->email_message ?: "Please find attached the scheduled report: {$schedule->name}";

        foreach ($schedule->recipients as $recipient) {
            try {
                Mail::to($recipient)->send(new ScheduledReportMail(
                    $schedule,
                    $pdfContent,
                    $fileName,
                    $subject,
                    $message
                ));
                $this->info("      ✓ Sent to: {$recipient}");
            } catch (\Exception $e) {
                $this->error("      ✗ Failed to send to: {$recipient}");
                \Log::error("Failed to send scheduled report email", [
                    'schedule_id' => $schedule->id,
                    'recipient' => $recipient,
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }

    /**
     * Generate file name for PDF
     */
    protected function generateFileName(ScheduledReport $schedule): string
    {
        $date = now()->format('Y-m-d_His');
        $type = $schedule->report_type;
        $sanitized = preg_replace('/[^A-Za-z0-9_-]/', '_', $schedule->name);
        return "{$type}_{$sanitized}_{$date}.pdf";
    }
}
