<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class TicketMessage extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'ticket_id',
        'user_id',
        'user_name',
        'message',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the ticket that owns this message
     */
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(SupportTicket::class);
    }
}
