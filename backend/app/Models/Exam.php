<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Exam extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'university_id',
        'college_id',
        'department_id',
        'name',
        'exam_code',
        'exam_type',
        'semester',
        'year',
        'description',
        'start_date',
        'end_date',
        'start_time',
        'duration_minutes',
        'total_marks',
        'passing_marks',
        'status',
        'exam_pattern',
        'instructions',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'exam_pattern' => 'array',
        'instructions' => 'array',
    ];

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(ExamSchedule::class);
    }

    public function results(): HasMany
    {
        return $this->hasMany(ExamResult::class);
    }
}
