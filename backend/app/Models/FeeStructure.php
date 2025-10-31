<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FeeStructure extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'university_id',
        'college_id',
        'department_id',
        'name',
        'fee_code',
        'fee_type',
        'fee_category',
        'amount',
        'currency',
        'academic_year',
        'semester',
        'year',
        'due_date',
        'late_fee_start_date',
        'late_fee_amount',
        'late_fee_type',
        'is_mandatory',
        'is_refundable',
        'description',
        'payment_schedule',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'late_fee_amount' => 'decimal:2',
        'due_date' => 'date',
        'late_fee_start_date' => 'date',
        'is_mandatory' => 'boolean',
        'is_refundable' => 'boolean',
        'payment_schedule' => 'array',
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

    public function payments(): HasMany
    {
        return $this->hasMany(FeePayment::class);
    }

    public function reminders(): HasMany
    {
        return $this->hasMany(FeeReminder::class);
    }
}
