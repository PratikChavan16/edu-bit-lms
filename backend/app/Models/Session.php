<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'refresh_token',
        'access_token_jti',
        'ip_address',
        'user_agent',
        'last_activity_at',
        'expires_at',
    ];

    protected $casts = [
        'last_activity_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public $timestamps = false;

    protected $dates = [
        'created_at',
        'last_activity_at',
        'expires_at',
    ];

    /**
     * Get the user that owns the session
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if session is expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at < now();
    }

    /**
     * Check if session is active
     */
    public function isActive(): bool
    {
        return !$this->isExpired();
    }
}
