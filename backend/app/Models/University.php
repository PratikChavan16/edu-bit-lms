<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\OptimizesQueries;

class University extends Model
{
    use HasFactory, HasUuids, SoftDeletes, OptimizesQueries;

    protected $table = 'universities';

    protected $fillable = [
        'name',
        'slug',
        'domain',
        'email',
        'phone',
        'address',
        'established_year',
        'timezone',
        'status',
        'storage_quota_gb',
        'storage_used_mb',
        'branding',
        'settings',
    ];

    protected $casts = [
        'branding' => 'array',
        'settings' => 'array',
        'established_year' => 'integer',
        'storage_quota_gb' => 'integer',
        'storage_used_mb' => 'integer',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get all colleges belonging to this university
     */
    public function colleges()
    {
        return $this->hasMany(College::class);
    }

    /**
     * Get all users belonging to this university
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get all departments across all colleges
     */
    public function departments()
    {
        return $this->hasManyThrough(Department::class, College::class);
    }

    /**
     * Check if university is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Get storage usage percentage
     */
    public function getStorageUsagePercentAttribute(): float
    {
        if ($this->storage_quota_gb === 0) {
            return 0;
        }
        return ($this->storage_used_mb / ($this->storage_quota_gb * 1024)) * 100;
    }
}
