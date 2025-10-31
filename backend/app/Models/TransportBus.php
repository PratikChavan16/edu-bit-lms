<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TransportBus extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'university_id',
        'college_id',
        'bus_number',
        'vehicle_number',
        'bus_name',
        'capacity',
        'current_occupancy',
        'driver_name',
        'driver_phone',
        'driver_license_number',
        'conductor_name',
        'conductor_phone',
        'bus_type',
        'registration_date',
        'insurance_expiry',
        'fitness_expiry',
        'status',
    ];

    protected $casts = [
        'registration_date' => 'date',
        'insurance_expiry' => 'date',
        'fitness_expiry' => 'date',
    ];

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function routes(): HasMany
    {
        return $this->hasMany(TransportRoute::class);
    }
}
