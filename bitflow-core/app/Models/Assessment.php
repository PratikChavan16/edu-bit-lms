<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Assessment extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'college_id',
        'faculty_id',
        'title',
        'description',
        'type',
        'subject',
        'course',
        'year',
        'total_marks',
        'passing_marks',
        'duration_minutes',
        'starts_at',
        'ends_at',
        'submission_type',
        'status',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'year' => 'integer',
        'total_marks' => 'integer',
        'passing_marks' => 'integer',
        'duration_minutes' => 'integer',
    ];

    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(AssessmentQuestion::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(AssessmentSubmission::class);
    }
}
