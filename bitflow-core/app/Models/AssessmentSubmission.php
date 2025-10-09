<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssessmentSubmission extends Model
{
    use HasUuids;

    protected $fillable = [
        'assessment_id',
        'student_id',
        'answers',
        'uploaded_files',
        'marks_obtained',
        'status',
        'started_at',
        'submitted_at',
        'graded_at',
        'graded_by',
        'feedback',
    ];

    protected $casts = [
        'answers' => 'array',
        'uploaded_files' => 'array',
        'marks_obtained' => 'integer',
        'started_at' => 'datetime',
        'submitted_at' => 'datetime',
        'graded_at' => 'datetime',
    ];

    public function assessment(): BelongsTo
    {
        return $this->belongsTo(Assessment::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function grader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'graded_by');
    }
}
