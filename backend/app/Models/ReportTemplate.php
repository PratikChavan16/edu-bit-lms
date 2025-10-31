<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReportTemplate extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'university_id',
        'created_by',
        'name',
        'description',
        'category',
        'report_type',
        'filters',
        'options',
        'icon',
        'color',
        'is_public',
        'is_system',
        'usage_count',
        'last_used_at',
    ];

    protected $casts = [
        'filters' => 'array',
        'options' => 'array',
        'is_public' => 'boolean',
        'is_system' => 'boolean',
        'usage_count' => 'integer',
        'last_used_at' => 'datetime',
    ];

    /**
     * Get the university that owns this template
     */
    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    /**
     * Get the user who created this template
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all reports generated from this template
     */
    public function reports(): HasMany
    {
        return $this->hasMany(ReportHistory::class, 'template_id');
    }

    /**
     * Increment usage count
     */
    public function incrementUsage(): void
    {
        $this->increment('usage_count');
        $this->update(['last_used_at' => now()]);
    }

    /**
     * Scope to public templates
     */
    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    /**
     * Scope to system templates
     */
    public function scopeSystem($query)
    {
        return $query->where('is_system', true);
    }

    /**
     * Scope to custom templates
     */
    public function scopeCustom($query)
    {
        return $query->where('is_system', false);
    }

    /**
     * Scope to templates by category
     */
    public function scopeCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope to templates by report type
     */
    public function scopeReportType($query, string $type)
    {
        return $query->where('report_type', $type);
    }

    /**
     * Scope to popular templates (most used)
     */
    public function scopePopular($query, int $limit = 10)
    {
        return $query->orderBy('usage_count', 'desc')->limit($limit);
    }

    /**
     * Scope to recently used templates
     */
    public function scopeRecentlyUsed($query, int $limit = 10)
    {
        return $query->whereNotNull('last_used_at')
            ->orderBy('last_used_at', 'desc')
            ->limit($limit);
    }
}
