<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeeReminder extends Model
{
    use HasFactory;

    protected $fillable = [
        'fee_structure_id',
        'student_id',
        'reminder_date',
        'reminder_type',
        'pending_amount',
        'days_overdue',
        'is_sent',
        'sent_at',
    ];

    protected $casts = [
        'reminder_date' => 'date',
        'pending_amount' => 'decimal:2',
        'is_sent' => 'boolean',
        'sent_at' => 'datetime',
    ];

    public function feeStructure(): BelongsTo
    {
        return $this->belongsTo(FeeStructure::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
