<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeatureToggle extends Model
{
    use HasUuids;

    protected $fillable = [
        'feature_id',
        'scope',
        'university_id',
        'college_id',
        'enabled',
        'parameters',
        'approval_status',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'parameters' => 'array',
        'approved_at' => 'datetime',
    ];

    public function feature(): BelongsTo
    {
        return $this->belongsTo(FeatureCatalog::class, 'feature_id');
    }

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
