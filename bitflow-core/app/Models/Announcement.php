<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Announcement extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'college_id',
        'created_by',
        'title',
        'content',
        'type',
        'priority',
        'target_audience',
        'course',
        'year',
        'status',
        'scheduled_at',
        'published_at',
        'expires_at',
    ];

    protected $casts = [
        'target_audience' => 'array',
        'scheduled_at' => 'datetime',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function reads(): HasMany
    {
        return $this->hasMany(AnnouncementRead::class);
    }

    public function isPublished(): bool
    {
        return $this->status === 'published';
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function isActive(): bool
    {
        return $this->isPublished() && !$this->isExpired();
    }
}
