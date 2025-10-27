<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Scopes\UniversityScope;

class Enrollment extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'university_id',
        'student_id',
        'course_id',
        'academic_year_id',
        'semester',
        'enrollment_date',
        'completion_date',
        'status',
        'grade',
    ];

    protected $casts = [
        'enrollment_date' => 'date',
        'completion_date' => 'date',
        'semester' => 'integer',
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
     * Get the student
     */
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    /**
     * Get the course
     */
    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * Get the academic year
     */
    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }
}
