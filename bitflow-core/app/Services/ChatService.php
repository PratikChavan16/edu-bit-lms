<?php

namespace App\Services;

use App\Models\Conversation;
use App\Models\ConversationParticipant;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ChatService
{
    /**
     * Create a new conversation
     */
    public function createConversation(array $data): Conversation
    {
        return DB::transaction(function () use ($data) {
            $conversation = Conversation::create([
                'college_id' => $data['college_id'],
                'type' => $data['type'] ?? 'direct',
                'name' => $data['name'] ?? null,
                'description' => $data['description'] ?? null,
                'created_by' => $data['created_by'],
            ]);

            // Add participants
            if (isset($data['participant_ids'])) {
                foreach ($data['participant_ids'] as $userId) {
                    ConversationParticipant::create([
                        'conversation_id' => $conversation->id,
                        'user_id' => $userId,
                        'role' => $userId === $data['created_by'] ? 'admin' : 'member',
                    ]);
                }
            }

            return $conversation->load('participants.user');
        });
    }

    /**
     * Get or create a direct conversation between two users
     */
    public function getOrCreateDirectConversation(string $collegeId, string $userId1, string $userId2): Conversation
    {
        // Check if a direct conversation already exists
        $conversation = Conversation::where('college_id', $collegeId)
            ->where('type', 'direct')
            ->whereHas('participants', function ($query) use ($userId1) {
                $query->where('user_id', $userId1);
            })
            ->whereHas('participants', function ($query) use ($userId2) {
                $query->where('user_id', $userId2);
            })
            ->whereDoesntHave('participants', function ($query) use ($userId1, $userId2) {
                $query->whereNotIn('user_id', [$userId1, $userId2]);
            })
            ->first();

        if ($conversation) {
            return $conversation->load('participants.user');
        }

        // Create new conversation
        return $this->createConversation([
            'college_id' => $collegeId,
            'type' => 'direct',
            'created_by' => $userId1,
            'participant_ids' => [$userId1, $userId2],
        ]);
    }

    /**
     * Send a message
     */
    public function sendMessage(array $data): Message
    {
        return DB::transaction(function () use ($data) {
            $message = Message::create([
                'conversation_id' => $data['conversation_id'],
                'sender_id' => $data['sender_id'],
                'content' => $data['content'] ?? null,
                'type' => $data['type'] ?? 'text',
                'reply_to_message_id' => $data['reply_to_message_id'] ?? null,
            ]);

            // Update conversation's last_message_at
            $message->conversation->update([
                'last_message_at' => now(),
            ]);

            // Handle file attachments
            if (isset($data['files']) && count($data['files']) > 0) {
                foreach ($data['files'] as $file) {
                    $path = $file->store('chat-attachments', 'public');
                    
                    MessageAttachment::create([
                        'message_id' => $message->id,
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $path,
                        'file_type' => $this->getFileType($file->getMimeType()),
                        'mime_type' => $file->getMimeType(),
                        'file_size' => $file->getSize(),
                    ]);
                }
            }

            return $message->load(['sender', 'attachments', 'replyTo']);
        });
    }

    /**
     * Get conversations for a user
     */
    public function getUserConversations(string $userId, string $collegeId, array $filters = [])
    {
        $query = Conversation::where('college_id', $collegeId)
            ->whereHas('participants', function ($q) use ($userId) {
                $q->where('user_id', $userId);
            })
            ->with(['participants.user', 'latestMessage.sender'])
            ->orderBy('last_message_at', 'desc');

        // Apply filters
        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['archived'])) {
            $query->where('is_archived', $filters['archived']);
        } else {
            $query->where('is_archived', false);
        }

        if (isset($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%")
                  ->orWhereHas('participants.user', function ($q) use ($filters) {
                      $q->where('name', 'like', "%{$filters['search']}%");
                  });
            });
        }

        return $query->paginate($filters['per_page'] ?? 20);
    }

    /**
     * Get messages for a conversation
     */
    public function getConversationMessages(string $conversationId, array $filters = [])
    {
        $query = Message::where('conversation_id', $conversationId)
            ->where('is_deleted', false)
            ->with(['sender', 'attachments', 'replyTo.sender'])
            ->orderBy('created_at', 'desc');

        if (isset($filters['before_message_id'])) {
            $beforeMessage = Message::find($filters['before_message_id']);
            if ($beforeMessage) {
                $query->where('created_at', '<', $beforeMessage->created_at);
            }
        }

        if (isset($filters['search'])) {
            $query->where('content', 'like', "%{$filters['search']}%");
        }

        return $query->paginate($filters['per_page'] ?? 50);
    }

    /**
     * Mark conversation as read for a user
     */
    public function markAsRead(string $conversationId, string $userId): void
    {
        ConversationParticipant::where('conversation_id', $conversationId)
            ->where('user_id', $userId)
            ->update(['last_read_at' => now()]);
    }

    /**
     * Update a message
     */
    public function updateMessage(string $messageId, string $content): Message
    {
        $message = Message::findOrFail($messageId);
        
        $message->update([
            'content' => $content,
            'is_edited' => true,
            'edited_at' => now(),
        ]);

        return $message->load(['sender', 'attachments']);
    }

    /**
     * Delete a message
     */
    public function deleteMessage(string $messageId): bool
    {
        $message = Message::findOrFail($messageId);
        
        // Delete attachments from storage
        foreach ($message->attachments as $attachment) {
            Storage::disk('public')->delete($attachment->file_path);
            $attachment->delete();
        }

        $message->update([
            'content' => null,
            'is_deleted' => true,
            'deleted_at' => now(),
        ]);

        return true;
    }

    /**
     * Add participants to a conversation
     */
    public function addParticipants(string $conversationId, array $userIds): array
    {
        $conversation = Conversation::findOrFail($conversationId);
        $addedParticipants = [];

        foreach ($userIds as $userId) {
            // Check if already a participant
            $exists = ConversationParticipant::where('conversation_id', $conversationId)
                ->where('user_id', $userId)
                ->exists();

            if (!$exists) {
                $participant = ConversationParticipant::create([
                    'conversation_id' => $conversationId,
                    'user_id' => $userId,
                    'role' => 'member',
                ]);
                $addedParticipants[] = $participant->load('user');
            }
        }

        return $addedParticipants;
    }

    /**
     * Remove participant from conversation
     */
    public function removeParticipant(string $conversationId, string $userId): bool
    {
        return ConversationParticipant::where('conversation_id', $conversationId)
            ->where('user_id', $userId)
            ->delete() > 0;
    }

    /**
     * Mute/unmute a conversation for a user
     */
    public function toggleMute(string $conversationId, string $userId): bool
    {
        $participant = ConversationParticipant::where('conversation_id', $conversationId)
            ->where('user_id', $userId)
            ->firstOrFail();

        $participant->update([
            'is_muted' => !$participant->is_muted,
        ]);

        return $participant->is_muted;
    }

    /**
     * Pin/unpin a conversation for a user
     */
    public function togglePin(string $conversationId, string $userId): bool
    {
        $participant = ConversationParticipant::where('conversation_id', $conversationId)
            ->where('user_id', $userId)
            ->firstOrFail();

        $participant->update([
            'is_pinned' => !$participant->is_pinned,
        ]);

        return $participant->is_pinned;
    }

    /**
     * Archive/unarchive a conversation
     */
    public function toggleArchive(string $conversationId): bool
    {
        $conversation = Conversation::findOrFail($conversationId);

        $conversation->update([
            'is_archived' => !$conversation->is_archived,
        ]);

        return $conversation->is_archived;
    }

    /**
     * Get unread count for a user
     */
    public function getUnreadCount(string $userId, string $collegeId): int
    {
        $participants = ConversationParticipant::where('user_id', $userId)
            ->whereHas('conversation', function ($q) use ($collegeId) {
                $q->where('college_id', $collegeId)
                  ->where('is_archived', false);
            })
            ->get();

        $totalUnread = 0;
        foreach ($participants as $participant) {
            $totalUnread += $participant->unreadCount;
        }

        return $totalUnread;
    }

    /**
     * Search messages across all conversations
     */
    public function searchMessages(string $userId, string $collegeId, string $query)
    {
        return Message::whereHas('conversation', function ($q) use ($userId, $collegeId) {
                $q->where('college_id', $collegeId)
                  ->whereHas('participants', function ($q) use ($userId) {
                      $q->where('user_id', $userId);
                  });
            })
            ->where('is_deleted', false)
            ->where('content', 'like', "%{$query}%")
            ->with(['sender', 'conversation'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);
    }

    /**
     * Determine file type from MIME type
     */
    private function getFileType(string $mimeType): string
    {
        if (str_starts_with($mimeType, 'image/')) {
            return 'image';
        } elseif (str_starts_with($mimeType, 'video/')) {
            return 'video';
        } elseif (str_starts_with($mimeType, 'audio/')) {
            return 'audio';
        } else {
            return 'document';
        }
    }
}
