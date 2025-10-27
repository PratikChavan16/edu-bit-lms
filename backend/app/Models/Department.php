<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Scopes\UniversityScope;

class Department extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'university_id',
        'college_id',
        'name',
        'code',
        'head_faculty_id',
        'email',
        'phone',
        'floor_location',
        'status',
    ];

    public bool $universityScoped = true;

    protected static function booted(): void
    {
        static::addGlobalScope(new UniversityScope());
    }

    /**
     * Get the university that owns the department
     */
    public function university()
    {
        return $this->belongsTo(University::class);
    }

    /**
     * Get the college that owns the department
     */
    public function college()
    {
        return $this->belongsTo(College::class);
    }

    /**
     * Get the head of department (faculty member)
     */
    public function hod()
    {
        return $this->belongsTo(Faculty::class, 'head_faculty_id');
    }

    /**
     * Alias for hod() for backward compatibility
     */
    public function head()
    {
        return $this->hod();
    }

    /**
     * Get all faculty members in this department
     */
    public function faculty()
    {
        return $this->hasMany(Faculty::class);
    }

    /**
     * Get all courses in this department
     */
    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    /**
     * Get all students in this department
     */
    public function students()
    {
        return $this->hasMany(Student::class);
    }

    /**
     * Scope a query to only include active departments.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include inactive departments.
     */
    public function scopeInactive($query)
    {
        return $query->where('status', 'inactive');
    }

    /**
     * Scope a query to filter by college.
     */
    public function scopeForCollege($query, string $collegeId)
    {
        return $query->where('college_id', $collegeId);
    }

    /**
     * Get the HOD name.
     */
    public function getHodNameAttribute(): ?string
    {
        return $this->hod?->name;
    }

    /**
     * Get total students count.
     */
    public function getStudentsCountAttribute(): int
    {
        return $this->students()->count();
    }

    /**
     * Get total faculty count.
     */
    public function getFacultyCountAttribute(): int
    {
        return $this->faculty()->count();
    }

    /**
     * Get total courses count.
     */
    public function getCoursesCountAttribute(): int
    {
        return $this->courses()->count();
    }
}
