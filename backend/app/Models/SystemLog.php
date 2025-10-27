<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class SystemLog extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'timestamp',
        'level',
        'source',
        'message',
        'details',
        'trace',
    ];

    protected $casts = [
        'timestamp' => 'datetime',
    ];

    public $timestamps = false; // We use 'timestamp' field instead
}
