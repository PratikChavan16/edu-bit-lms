<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeeStructure extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'college_id',
        'course',
        'year',
        'component_name',
        'amount',
        'frequency',
        'effective_from',
        'effective_to',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'effective_from' => 'date',
        'effective_to' => 'date',
        'year' => 'integer',
    ];

    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }
}
