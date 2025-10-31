<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TransportRoute extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'college_id',
        'transport_bus_id',
        'route_name',
        'route_number',
        'departure_time',
        'arrival_time',
        'distance_km',
        'fare_amount',
        'stops',
        'route_type',
        'status',
    ];

    protected $casts = [
        'distance_km' => 'decimal:2',
        'fare_amount' => 'decimal:2',
        'stops' => 'array',
    ];

    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function bus(): BelongsTo
    {
        return $this->belongsTo(TransportBus::class, 'transport_bus_id');
    }

    public function allocations(): HasMany
    {
        return $this->hasMany(TransportAllocation::class);
    }
}
