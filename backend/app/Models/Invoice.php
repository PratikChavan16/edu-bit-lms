<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Invoice extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'university_id',
        'subscription_id',
        'amount',
        'status',
        'due_date',
        'paid_at',
        'stripe_invoice_id',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'due_date' => 'datetime',
        'paid_at' => 'datetime',
    ];

    public function university()
    {
        return $this->belongsTo(University::class);
    }

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }
}
