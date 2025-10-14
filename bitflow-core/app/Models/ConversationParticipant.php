<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConversationParticipant extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'conversation_id',
        'user_id',
        'role',
        'last_read_at',
        'is_muted',
        'is_pinned',
    ];

    protected $casts = [
        'last_read_at' => 'datetime',
        'is_muted' => 'boolean',
        'is_pinned' => 'boolean',
    ];

    /**
     * Get the conversation
     */
    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    /**
     * Get the user
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get unread messages count for this participant
     */
    public function getUnreadCountAttribute()
    {
        return $this->conversation->messages()
            ->where('sender_id', '!=', $this->user_id)
            ->when($this->last_read_at, function ($query) {
                $query->where('created_at', '>', $this->last_read_at);
            })
            ->count();
    }

    /**
     * Mark all messages as read
     */
    public function markAsRead()
    {
        $this->update(['last_read_at' => now()]);
    }

    /**
     * Scope for admin participants
     */
    public function scopeAdmins($query)
    {
        return $query->where('role', 'admin');
    }

    /**
     * Scope for member participants
     */
    public function scopeMembers($query)
    {
        return $query->where('role', 'member');
    }

    /**
     * Scope for muted participants
     */
    public function scopeMuted($query)
    {
        return $query->where('is_muted', true);
    }

    /**
     * Scope for pinned conversations
     */
    public function scopePinned($query)
    {
        return $query->where('is_pinned', true);
    }
}
