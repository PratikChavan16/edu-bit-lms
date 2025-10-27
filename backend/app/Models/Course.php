<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Scopes\UniversityScope;

class Course extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'university_id',
        'department_id',
        'code',
        'name',
        'description',
        'credits',
        'type',
        'duration_years',
        'status',
    ];

    protected $casts = [
        'credits' => 'integer',
        'duration_years' => 'integer',
    ];

    public bool $universityScoped = true;

    protected static function booted(): void
    {
        static::addGlobalScope(new UniversityScope());
    }

    /**
     * Get the university that owns the course
     */
    public function university()
    {
        return $this->belongsTo(University::class);
    }

    /**
     * Get the department that owns the course
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get all students enrolled in this course
     */
    public function students()
    {
        return $this->hasManyThrough(
            Student::class,
            Enrollment::class,
            'course_id',
            'id',
            'id',
            'student_id'
        );
    }

    /**
     * Get all enrollments for this course
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
}
