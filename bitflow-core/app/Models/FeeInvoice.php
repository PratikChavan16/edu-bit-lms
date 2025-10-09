<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FeeInvoice extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'invoice_number',
        'student_id',
        'college_id',
        'academic_year',
        'term',
        'total_amount',
        'paid_amount',
        'discount',
        'due_date',
        'status',
        'components',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'discount' => 'decimal:2',
        'due_date' => 'date',
        'components' => 'array',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(FeePayment::class, 'invoice_id');
    }
}
