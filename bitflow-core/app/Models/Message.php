<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'conversation_id',
        'sender_id',
        'content',
        'type',
        'reply_to_message_id',
        'is_edited',
        'edited_at',
        'is_deleted',
        'deleted_at',
    ];

    protected $casts = [
        'is_edited' => 'boolean',
        'edited_at' => 'datetime',
        'is_deleted' => 'boolean',
        'deleted_at' => 'datetime',
    ];

    /**
     * Get the conversation
     */
    public function conversation()
    {
        return $this->belongsTo(Conversation::class);
    }

    /**
     * Get the sender
     */
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    /**
     * Get the message this is replying to
     */
    public function replyTo()
    {
        return $this->belongsTo(Message::class, 'reply_to_message_id');
    }

    /**
     * Get replies to this message
     */
    public function replies()
    {
        return $this->hasMany(Message::class, 'reply_to_message_id');
    }

    /**
     * Get the attachments
     */
    public function attachments()
    {
        return $this->hasMany(MessageAttachment::class);
    }

    /**
     * Scope for text messages
     */
    public function scopeText($query)
    {
        return $query->where('type', 'text');
    }

    /**
     * Scope for image messages
     */
    public function scopeImages($query)
    {
        return $query->where('type', 'image');
    }

    /**
     * Scope for file messages
     */
    public function scopeFiles($query)
    {
        return $query->where('type', 'file');
    }

    /**
     * Scope for voice messages
     */
    public function scopeVoice($query)
    {
        return $query->where('type', 'voice');
    }

    /**
     * Scope for non-deleted messages
     */
    public function scopeActive($query)
    {
        return $query->where('is_deleted', false);
    }

    /**
     * Scope for deleted messages
     */
    public function scopeDeleted($query)
    {
        return $query->where('is_deleted', true);
    }

    /**
     * Mark message as edited
     */
    public function markAsEdited()
    {
        $this->update([
            'is_edited' => true,
            'edited_at' => now(),
        ]);
    }

    /**
     * Soft delete the message
     */
    public function softDelete()
    {
        $this->update([
            'is_deleted' => true,
            'deleted_at' => now(),
            'content' => null,
        ]);
    }
}
