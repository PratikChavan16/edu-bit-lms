<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HostelAllocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'hostel_room_id',
        'student_id',
        'allocation_number',
        'bed_number',
        'check_in_date',
        'check_out_date',
        'expected_check_out_date',
        'monthly_fee',
        'security_deposit_paid',
        'payment_status',
        'status',
        'remarks',
    ];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
        'expected_check_out_date' => 'date',
        'monthly_fee' => 'decimal:2',
        'security_deposit_paid' => 'decimal:2',
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(HostelRoom::class, 'hostel_room_id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
