<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Hostel extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'university_id',
        'college_id',
        'name',
        'hostel_code',
        'hostel_type',
        'warden_name',
        'warden_phone',
        'warden_email',
        'total_floors',
        'total_rooms',
        'capacity',
        'occupied_beds',
        'available_beds',
        'facilities',
        'address',
        'monthly_fee',
        'security_deposit',
        'status',
    ];

    protected $casts = [
        'facilities' => 'array',
        'address' => 'array',
        'monthly_fee' => 'decimal:2',
        'security_deposit' => 'decimal:2',
    ];

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(HostelRoom::class);
    }
}
