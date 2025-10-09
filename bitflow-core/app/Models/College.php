<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class College extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'university_id',
        'name',
        'slug',
        'type',
        'code',
        'status',
        'branding',
        'motto',
        'storage_quota_gb',
        'student_storage_quota_mb',
    ];

    protected $casts = [
        'branding' => 'array',
    ];

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    public function departments(): HasMany
    {
        return $this->hasMany(Department::class);
    }

    public function students(): HasMany
    {
        return $this->hasMany(Student::class);
    }

    public function faculty(): HasMany
    {
        return $this->hasMany(Faculty::class);
    }

    public function notices(): HasMany
    {
        return $this->hasMany(Notice::class);
    }
}
