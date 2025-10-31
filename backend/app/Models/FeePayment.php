<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeePayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'fee_structure_id',
        'student_id',
        'receipt_number',
        'transaction_id',
        'amount_paid',
        'late_fee_paid',
        'total_amount',
        'payment_mode',
        'payment_reference',
        'payment_date',
        'payment_time',
        'status',
        'collected_by',
        'remarks',
    ];

    protected $casts = [
        'amount_paid' => 'decimal:2',
        'late_fee_paid' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'payment_date' => 'date',
        'payment_time' => 'datetime',
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
