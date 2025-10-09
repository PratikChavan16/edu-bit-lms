<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssessmentQuestion extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'assessment_id',
        'question_number',
        'question_text',
        'options',
        'correct_answer',
        'marks',
    ];

    protected $casts = [
        'options' => 'array',
        'marks' => 'integer',
    ];

    public function assessment(): BelongsTo
    {
        return $this->belongsTo(Assessment::class);
    }
}
