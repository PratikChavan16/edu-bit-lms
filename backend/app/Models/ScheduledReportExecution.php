<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ScheduledReportExecution extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'scheduled_report_id',
        'started_at',
        'completed_at',
        'duration_seconds',
        'status',
        'records_count',
        'pdf_path',
        'pdf_size_kb',
        'recipients',
        'error_message',
        'error_details',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'duration_seconds' => 'integer',
        'records_count' => 'integer',
        'pdf_size_kb' => 'integer',
        'recipients' => 'array',
        'error_details' => 'array',
    ];

    /**
     * Get the scheduled report this execution belongs to
     */
    public function scheduledReport(): BelongsTo
    {
        return $this->belongsTo(ScheduledReport::class);
    }

    /**
     * Mark execution as started
     */
    public function markAsStarted(): void
    {
        $this->update([
            'status' => 'running',
            'started_at' => now(),
        ]);
    }

    /**
     * Mark execution as successful
     */
    public function markAsSuccess(array $data = []): void
    {
        $this->update([
            'status' => 'success',
            'completed_at' => now(),
            'duration_seconds' => now()->diffInSeconds($this->started_at),
            'records_count' => $data['records_count'] ?? null,
            'pdf_path' => $data['pdf_path'] ?? null,
            'pdf_size_kb' => $data['pdf_size_kb'] ?? null,
            'recipients' => $data['recipients'] ?? null,
        ]);
    }

    /**
     * Mark execution as failed
     */
    public function markAsFailed(string $error, array $details = []): void
    {
        $this->update([
            'status' => 'failed',
            'completed_at' => now(),
            'duration_seconds' => now()->diffInSeconds($this->started_at),
            'error_message' => $error,
            'error_details' => $details,
        ]);
    }

    /**
     * Scope to successful executions
     */
    public function scopeSuccessful($query)
    {
        return $query->where('status', 'success');
    }

    /**
     * Scope to failed executions
     */
    public function scopeFailed($query)
    {
        return $query->where('status', 'failed');
    }
}
