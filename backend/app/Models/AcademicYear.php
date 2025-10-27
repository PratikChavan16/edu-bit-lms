<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Scopes\UniversityScope;

class AcademicYear extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'university_id',
        'name',
        'start_date',
        'end_date',
        'is_current',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
    ];

    public bool $universityScoped = true;

    protected static function booted(): void
    {
        static::addGlobalScope(new UniversityScope());
    }

    /**
     * Get the university
     */
    public function university()
    {
        return $this->belongsTo(University::class);
    }

    /**
     * Get all enrollments in this academic year
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
}
