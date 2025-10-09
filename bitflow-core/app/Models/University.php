<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class University extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'domain',
        'status',
        'timezone',
        'branding',
        'storage_quota_gb',
        'storage_used_mb',
        'last_backup_at',
    ];

    protected $casts = [
        'branding' => 'array',
        'last_backup_at' => 'datetime',
    ];

    public function colleges(): HasMany
    {
        return $this->hasMany(College::class);
    }

    public function featureToggles(): HasMany
    {
        return $this->hasMany(FeatureToggle::class);
    }
}
