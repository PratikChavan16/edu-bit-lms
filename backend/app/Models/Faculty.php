<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Faculty extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'faculty';

    protected $fillable = [
        'user_id',
        'university_id',
        'college_id',
        'department_id',
        'employee_id',
        'designation',
        'qualification',
        'specialization',
        'experience_years',
        'employment_type',
        'joining_date',
        'salary',
        'status',
    ];

    protected $casts = [
        'joining_date' => 'date',
        'salary' => 'decimal:2',
        'experience_years' => 'integer',
    ];

    protected $hidden = [
        'salary', // Hide sensitive salary information
    ];

    /**
     * Get the user that owns this faculty profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the university this faculty belongs to.
     */
    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    /**
     * Get the college this faculty belongs to.
     */
    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    /**
     * Get the department this faculty belongs to.
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * Get departments where this faculty is the head.
     */
    public function headOfDepartments(): HasMany
    {
        return $this->hasMany(Department::class, 'head_faculty_id');
    }

    /**
     * Scope a query to only include active faculty.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include faculty on leave.
     */
    public function scopeOnLeave($query)
    {
        return $query->where('status', 'on_leave');
    }

    /**
     * Scope a query to filter by designation.
     */
    public function scopeDesignation($query, string $designation)
    {
        return $query->where('designation', $designation);
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
     * Check if faculty is a department head.
     */
    public function isDepartmentHead(): bool
    {
        return $this->headOfDepartments()->exists();
    }

    /**
     * Get years of service.
     */
    public function getYearsOfServiceAttribute(): int
    {
        return $this->joining_date?->diffInYears(now()) ?? 0;
    }
}
