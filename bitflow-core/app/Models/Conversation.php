<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Conversation extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'college_id',
        'type',
        'name',
        'description',
        'created_by',
        'last_message_at',
        'is_archived',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
        'is_archived' => 'boolean',
    ];

    /**
     * Get the college that owns the conversation
     */
    public function college()
    {
        return $this->belongsTo(College::class);
    }

    /**
     * Get the user who created the conversation
     */
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the participants in the conversation
     */
    public function participants()
    {
        return $this->hasMany(ConversationParticipant::class);
    }

    /**
     * Get the users participating in the conversation
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'conversation_participants')
            ->withPivot('role', 'last_read_at', 'is_muted', 'is_pinned')
            ->withTimestamps();
    }

    /**
     * Get the messages in the conversation
     */
    public function messages()
    {
        return $this->hasMany(Message::class)->orderBy('created_at', 'desc');
    }

    /**
     * Get the latest message in the conversation
     */
    public function latestMessage()
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }

    /**
     * Scope for direct conversations
     */
    public function scopeDirect($query)
    {
        return $query->where('type', 'direct');
    }

    /**
     * Scope for group conversations
     */
    public function scopeGroup($query)
    {
        return $query->where('type', 'group');
    }

    /**
     * Scope for announcement channels
     */
    public function scopeAnnouncement($query)
    {
        return $query->where('type', 'announcement');
    }

    /**
     * Scope for archived conversations
     */
    public function scopeArchived($query)
    {
        return $query->where('is_archived', true);
    }

    /**
     * Scope for active (non-archived) conversations
     */
    public function scopeActive($query)
    {
        return $query->where('is_archived', false);
    }
}
