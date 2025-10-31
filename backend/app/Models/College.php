<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Scopes\UniversityScope;
use App\Traits\OptimizesQueries;

class College extends Model
{
    use HasFactory, HasUuids, SoftDeletes, OptimizesQueries;

    protected $fillable = [
        'university_id',
        'name',
        'code',
        'type',
        'email',
        'phone',
        'address',
        'established_year',
        'status',
        'capacity',
        'current_enrollment',
        'accreditation',
    ];

    protected $casts = [
        'accreditation' => 'array',
        'established_year' => 'integer',
        'capacity' => 'integer',
        'current_enrollment' => 'integer',
        'deleted_at' => 'datetime',
    ];

    public bool $universityScoped = true;

    protected static function booted(): void
    {
        static::addGlobalScope(new UniversityScope());
    }

    /**
     * Get the university that owns the college
     */
    public function university()
    {
        return $this->belongsTo(University::class);
    }

    /**
     * Get all departments in this college
     */
    public function departments()
    {
        return $this->hasMany(Department::class);
    }

    /**
     * Get all students in this college
     */
    public function students()
    {
        return $this->hasMany(Student::class);
    }

    /**
     * Check if college is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Get enrollment percentage
     */
    public function getEnrollmentPercentAttribute(): float
    {
        if ($this->capacity === 0) {
            return 0;
        }
        return ($this->current_enrollment / $this->capacity) * 100;
    }
}
