<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Notice extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = [
        'college_id',
        'title',
        'content',
        'priority',
        'audience',
        'audience_filter',
        'created_by',
        'published_at',
        'expires_at',
        'is_important',
    ];

    protected $casts = [
        'audience_filter' => 'array',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_important' => 'boolean',
    ];

    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeActive($query)
    {
        return $query->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
    }

    public function scopeImportant($query)
    {
        return $query->where('is_important', true);
    }
}
