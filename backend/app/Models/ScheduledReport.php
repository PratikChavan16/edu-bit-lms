<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Cron\CronExpression;

class ScheduledReport extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'university_id',
        'created_by',
        'name',
        'description',
        'report_type',
        'filters',
        'options',
        'cron_expression',
        'frequency_label',
        'next_run_at',
        'last_run_at',
        'recipients',
        'email_subject',
        'email_message',
        'is_active',
        'run_count',
        'success_count',
        'failure_count',
    ];

    protected $casts = [
        'filters' => 'array',
        'options' => 'array',
        'recipients' => 'array',
        'is_active' => 'boolean',
        'next_run_at' => 'datetime',
        'last_run_at' => 'datetime',
        'run_count' => 'integer',
        'success_count' => 'integer',
        'failure_count' => 'integer',
    ];

    /**
     * Get the university that owns this scheduled report
     */
    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    /**
     * Get the user who created this schedule
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all executions for this schedule
     */
    public function executions(): HasMany
    {
        return $this->hasMany(ScheduledReportExecution::class);
    }

    /**
     * Get the most recent execution
     */
    public function latestExecution()
    {
        return $this->hasOne(ScheduledReportExecution::class)->latestOfMany();
    }

    /**
     * Calculate next run time based on cron expression
     */
    public function calculateNextRun(): void
    {
        try {
            $cron = new CronExpression($this->cron_expression);
            $this->next_run_at = $cron->getNextRunDate();
            $this->save();
        } catch (\Exception $e) {
            \Log::error("Failed to calculate next run for scheduled report {$this->id}: " . $e->getMessage());
        }
    }

    /**
     * Check if this schedule is due to run
     */
    public function isDue(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        if (!$this->next_run_at) {
            return false;
        }

        return $this->next_run_at->isPast();
    }

    /**
     * Mark schedule as executed
     */
    public function markAsExecuted(): void
    {
        $this->increment('run_count');
        $this->last_run_at = now();
        $this->calculateNextRun();
    }

    /**
     * Increment success count
     */
    public function incrementSuccess(): void
    {
        $this->increment('success_count');
    }

    /**
     * Increment failure count
     */
    public function incrementFailure(): void
    {
        $this->increment('failure_count');
    }

    /**
     * Scope to active schedules only
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to due schedules
     */
    public function scopeDue($query)
    {
        return $query->active()
            ->whereNotNull('next_run_at')
            ->where('next_run_at', '<=', now());
    }
}
