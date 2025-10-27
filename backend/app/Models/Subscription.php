<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Subscription extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'university_id',
        'plan',
        'status',
        'mrr',
        'next_billing_date',
        'trial_ends_at',
        'canceled_at',
    ];

    protected $casts = [
        'mrr' => 'decimal:2',
        'next_billing_date' => 'datetime',
        'trial_ends_at' => 'datetime',
        'canceled_at' => 'datetime',
    ];

    public function university()
    {
        return $this->belongsTo(University::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
