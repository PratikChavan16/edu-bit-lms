<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'message',
        'data',
        'is_read',
        'read_at',
        'category',
        'action_url',
        'action_text',
        'related_id',
        'related_type',
    ];

    protected $casts = [
        'data' => 'array',
        'is_read' => 'boolean',
        'read_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the notification
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to filter unread notifications
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope to filter read notifications
     */
    public function scopeRead($query)
    {
        return $query->where('is_read', true);
    }

    /**
     * Scope to filter by category
     */
    public function scopeCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope to filter by type
     */
    public function scopeType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(): bool
    {
        return $this->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    /**
     * Mark notification as unread
     */
    public function markAsUnread(): bool
    {
        return $this->update([
            'is_read' => false,
            'read_at' => null,
        ]);
    }

    /**
     * Create a notification for a user
     */
    public static function createForUser(
        string $userId,
        string $type,
        string $title,
        string $message,
        ?string $category = null,
        ?string $actionUrl = null,
        ?string $actionText = null,
        ?array $data = null,
        ?string $relatedId = null,
        ?string $relatedType = null
    ): self {
        return self::create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'message' => $message,
            'category' => $category,
            'action_url' => $actionUrl,
            'action_text' => $actionText,
            'data' => $data,
            'related_id' => $relatedId,
            'related_type' => $relatedType,
        ]);
    }

    /**
     * Create notification for all users in a university
     */
    public static function createForUniversity(
        string $universityId,
        string $type,
        string $title,
        string $message,
        ?string $category = null,
        ?string $actionUrl = null,
        ?string $actionText = null,
        ?array $data = null
    ): int {
        $users = User::where('university_id', $universityId)->pluck('id');
        $count = 0;

        foreach ($users as $userId) {
            self::createForUser(
                $userId,
                $type,
                $title,
                $message,
                $category,
                $actionUrl,
                $actionText,
                $data,
                $universityId,
                'university'
            );
            $count++;
        }

        return $count;
    }

    /**
     * Create notification for all users in a college
     */
    public static function createForCollege(
        string $collegeId,
        string $type,
        string $title,
        string $message,
        ?string $category = null,
        ?string $actionUrl = null,
        ?string $actionText = null,
        ?array $data = null
    ): int {
        $users = User::where('college_id', $collegeId)->pluck('id');
        $count = 0;

        foreach ($users as $userId) {
            self::createForUser(
                $userId,
                $type,
                $title,
                $message,
                $category,
                $actionUrl,
                $actionText,
                $data,
                $collegeId,
                'college'
            );
            $count++;
        }

        return $count;
    }
}
