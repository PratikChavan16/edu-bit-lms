<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TimetableBlockException extends Model
{
    use HasUuids;

    protected $fillable = [
        'timetable_block_id',
        'date',
        'action',
        'reason',
        'alternate_faculty_id',
        'alternate_location',
        'start_time',
        'end_time',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function timetableBlock(): BelongsTo
    {
        return $this->belongsTo(TimetableBlock::class);
    }

    public function alternateFaculty(): BelongsTo
    {
        return $this->belongsTo(Faculty::class, 'alternate_faculty_id');
    }
}
