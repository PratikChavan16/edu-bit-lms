<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ReportHistory extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'report_history';

    protected $fillable = [
        'university_id',
        'generated_by',
        'template_id',
        'name',
        'report_type',
        'filters',
        'options',
        'file_path',
        'file_name',
        'file_size_kb',
        'paper_size',
        'orientation',
        'records_count',
        'generated_at',
        'download_count',
        'last_downloaded_at',
    ];

    protected $casts = [
        'filters' => 'array',
        'options' => 'array',
        'file_size_kb' => 'integer',
        'records_count' => 'integer',
        'download_count' => 'integer',
        'generated_at' => 'datetime',
        'last_downloaded_at' => 'datetime',
    ];

    /**
     * Get the university that owns this report
     */
    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    /**
     * Get the user who generated this report
     */
    public function generator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    /**
     * Get the template used for this report
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(ReportTemplate::class);
    }

    /**
     * Increment download count
     */
    public function incrementDownloads(): void
    {
        $this->increment('download_count');
        $this->update(['last_downloaded_at' => now()]);
    }

    /**
     * Check if file exists
     */
    public function fileExists(): bool
    {
        return Storage::disk('local')->exists($this->file_path);
    }

    /**
     * Get file URL for download
     */
    public function getFileUrl(): ?string
    {
        if (!$this->fileExists()) {
            return null;
        }

        return Storage::disk('local')->url($this->file_path);
    }

    /**
     * Delete the associated file
     */
    public function deleteFile(): bool
    {
        if ($this->fileExists()) {
            return Storage::disk('local')->delete($this->file_path);
        }

        return false;
    }

    /**
     * Scope to reports by type
     */
    public function scopeReportType($query, string $type)
    {
        return $query->where('report_type', $type);
    }

    /**
     * Scope to recent reports
     */
    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('generated_at', '>=', now()->subDays($days));
    }

    /**
     * Scope to reports from template
     */
    public function scopeFromTemplate($query, string $templateId)
    {
        return $query->where('template_id', $templateId);
    }

    /**
     * Boot method to handle model events
     */
    protected static function boot()
    {
        parent::boot();

        // Delete file when model is force deleted
        static::forceDeleted(function ($history) {
            $history->deleteFile();
        });
    }
}
