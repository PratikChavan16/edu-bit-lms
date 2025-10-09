<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TimetableBlock extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'college_id',
        'subject',
        'course',
        'year',
        'section',
        'faculty_id',
        'day_of_week',
        'start_time',
        'end_time',
        'location',
        'type',
        'effective_from',
        'effective_to',
    ];

    protected $casts = [
        'effective_from' => 'date',
        'effective_to' => 'date',
    ];

    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function faculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class);
    }

    public function exceptions(): HasMany
    {
        return $this->hasMany(TimetableBlockException::class);
    }

    public function scopeForDate($query, $date)
    {
        $dayOfWeek = strtolower($date->format('l'));
        
        return $query->where('day_of_week', $dayOfWeek)
            ->where('effective_from', '<=', $date)
            ->where(function ($q) use ($date) {
                $q->whereNull('effective_to')
                    ->orWhere('effective_to', '>=', $date);
            });
    }
}
