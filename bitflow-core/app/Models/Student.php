<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'user_id',
        'college_id',
        'roll_number',
        'admission_number',
        'course',
        'year',
        'section',
        'admission_date',
        'status',
        'emergency_contact',
        'storage_used_mb',
    ];

    protected $casts = [
        'emergency_contact' => 'array',
        'admission_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function assessmentSubmissions(): HasMany
    {
        return $this->hasMany(AssessmentSubmission::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function feeInvoices(): HasMany
    {
        return $this->hasMany(FeeInvoice::class);
    }
}
