<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Scopes\UniversityScope;

class Student extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'user_id',
        'university_id',
        'college_id',
        'department_id',
        'admission_number',
        'admission_date',
        'course',
        'year',
        'section',
        'roll_number',
        'blood_group',
        'date_of_birth',
        'gender',
        'nationality',
        'emergency_contact',
        'guardian_name',
        'guardian_phone',
        'guardian_email',
        'guardian_relation',
        'status',
    ];

    protected $casts = [
        'emergency_contact' => 'array',
        'admission_date' => 'date',
        'date_of_birth' => 'date',
        'year' => 'integer',
    ];

    public bool $universityScoped = true;

    protected static function booted(): void
    {
        static::addGlobalScope(new UniversityScope());
    }

    /**
     * Get the user account for this student
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the university
     */
    public function university()
    {
        return $this->belongsTo(University::class);
    }

    /**
     * Get the college
     */
    public function college()
    {
        return $this->belongsTo(College::class);
    }

    /**
     * Get the department
     */
    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get all course enrollments
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }

    /**
     * Get active enrollments
     */
    public function activeEnrollments()
    {
        return $this->enrollments()->where('status', 'active');
    }

    /**
     * Get the attendance records for this student.
     */
    public function attendance()
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Scope a query to only include active students.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include suspended students.
     */
    public function scopeSuspended($query)
    {
        return $query->where('status', 'suspended');
    }

    /**
     * Scope a query to only include graduated students.
     */
    public function scopeGraduated($query)
    {
        return $query->where('status', 'graduated');
    }

    /**
     * Scope a query to filter by year.
     */
    public function scopeYear($query, int $year)
    {
        return $query->where('year', $year);
    }

    /**
     * Scope a query to filter by college.
     */
    public function scopeForCollege($query, string $collegeId)
    {
        return $query->where('college_id', $collegeId);
    }

    /**
     * Scope a query to filter by department.
     */
    public function scopeForDepartment($query, string $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }

    /**
     * Get the full name from the related user.
     */
    public function getNameAttribute(): ?string
    {
        return $this->user?->name;
    }

    /**
     * Get the email from the related user.
     */
    public function getEmailAttribute(): ?string
    {
        return $this->user?->email;
    }

    /**
     * Get the phone from the related user.
     */
    public function getPhoneAttribute(): ?string
    {
        return $this->user?->phone;
    }

    /**
     * Get the photo URL from the related user.
     */
    public function getPhotoUrlAttribute(): ?string
    {
        return $this->user?->photo_url;
    }

    /**
     * Get the age of the student.
     */
    public function getAgeAttribute(): ?int
    {
        return $this->date_of_birth?->age;
    }

    /**
     * Calculate GPA from enrollments.
     */
    public function calculateGpa(): float
    {
        $completedEnrollments = $this->enrollments()
            ->where('status', 'completed')
            ->whereNotNull('grade_points')
            ->get();

        if ($completedEnrollments->isEmpty()) {
            return 0.0;
        }

        $totalGradePoints = $completedEnrollments->sum('grade_points');
        $totalCredits = $completedEnrollments->sum('credits_earned');

        return $totalCredits > 0 ? round($totalGradePoints / $totalCredits, 2) : 0.0;
    }

    /**
     * Calculate attendance percentage.
     */
    public function calculateAttendancePercentage(): float
    {
        $totalClasses = $this->attendance()->count();

        if ($totalClasses === 0) {
            return 0.0;
        }

        $presentClasses = $this->attendance()
            ->whereIn('status', ['present', 'late'])
            ->count();

        return round(($presentClasses / $totalClasses) * 100, 2);
    }
}
