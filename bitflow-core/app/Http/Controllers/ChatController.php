<?php

namespace App\Http\Controllers;

use App\Services\ChatService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
    protected ChatService $chatService;

    public function __construct(ChatService $chatService)
    {
        $this->chatService = $chatService;
    }

    /**
     * Get user's conversations
     */
    public function getConversations(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $collegeId = $request->header('X-College-ID');

        $filters = [
            'type' => $request->query('type'),
            'archived' => $request->query('archived') === 'true',
            'search' => $request->query('search'),
            'per_page' => $request->query('per_page', 20),
        ];

        $conversations = $this->chatService->getUserConversations($userId, $collegeId, $filters);

        return response()->json([
            'success' => true,
            'data' => $conversations,
        ]);
    }

    /**
     * Create a new conversation
     */
    public function createConversation(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:direct,group,announcement',
            'name' => 'required_if:type,group,announcement|string|max:255',
            'description' => 'nullable|string',
            'participant_ids' => 'required|array|min:1',
            'participant_ids.*' => 'exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = array_merge($validator->validated(), [
            'college_id' => $request->header('X-College-ID'),
            'created_by' => $request->user()->id,
        ]);

        $conversation = $this->chatService->createConversation($data);

        return response()->json([
            'success' => true,
            'data' => $conversation,
            'message' => 'Conversation created successfully',
        ], 201);
    }

    /**
     * Get or create direct conversation
     */
    public function getOrCreateDirectConversation(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $collegeId = $request->header('X-College-ID');
        $currentUserId = $request->user()->id;
        $targetUserId = $request->input('user_id');

        if ($currentUserId === $targetUserId) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot create conversation with yourself',
            ], 400);
        }

        $conversation = $this->chatService->getOrCreateDirectConversation(
            $collegeId,
            $currentUserId,
            $targetUserId
        );

        return response()->json([
            'success' => true,
            'data' => $conversation,
        ]);
    }

    /**
     * Get messages for a conversation
     */
    public function getMessages(Request $request, string $conversationId): JsonResponse
    {
        $filters = [
            'before_message_id' => $request->query('before'),
            'search' => $request->query('search'),
            'per_page' => $request->query('per_page', 50),
        ];

        $messages = $this->chatService->getConversationMessages($conversationId, $filters);

        return response()->json([
            'success' => true,
            'data' => $messages,
        ]);
    }

    /**
     * Send a message
     */
    public function sendMessage(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'conversation_id' => 'required|exists:conversations,id',
            'content' => 'required_without:files|string|max:5000',
            'type' => 'nullable|in:text,image,file,voice,video',
            'reply_to_message_id' => 'nullable|exists:messages,id',
            'files' => 'nullable|array|max:5',
            'files.*' => 'file|max:10240', // 10MB max per file
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = array_merge($validator->validated(), [
            'sender_id' => $request->user()->id,
        ]);

        if ($request->hasFile('files')) {
            $data['files'] = $request->file('files');
        }

        $message = $this->chatService->sendMessage($data);

        return response()->json([
            'success' => true,
            'data' => $message,
            'message' => 'Message sent successfully',
        ], 201);
    }

    /**
     * Update a message
     */
    public function updateMessage(Request $request, string $messageId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:5000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $message = $this->chatService->updateMessage($messageId, $request->input('content'));

        return response()->json([
            'success' => true,
            'data' => $message,
            'message' => 'Message updated successfully',
        ]);
    }

    /**
     * Delete a message
     */
    public function deleteMessage(string $messageId): JsonResponse
    {
        $this->chatService->deleteMessage($messageId);

        return response()->json([
            'success' => true,
            'message' => 'Message deleted successfully',
        ]);
    }

    /**
     * Mark conversation as read
     */
    public function markAsRead(Request $request, string $conversationId): JsonResponse
    {
        $userId = $request->user()->id;
        $this->chatService->markAsRead($conversationId, $userId);

        return response()->json([
            'success' => true,
            'message' => 'Conversation marked as read',
        ]);
    }

    /**
     * Add participants to conversation
     */
    public function addParticipants(Request $request, string $conversationId): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_ids' => 'required|array|min:1',
            'user_ids.*' => 'exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $participants = $this->chatService->addParticipants(
            $conversationId,
            $request->input('user_ids')
        );

        return response()->json([
            'success' => true,
            'data' => $participants,
            'message' => 'Participants added successfully',
        ]);
    }

    /**
     * Remove participant from conversation
     */
    public function removeParticipant(Request $request, string $conversationId, string $userId): JsonResponse
    {
        $removed = $this->chatService->removeParticipant($conversationId, $userId);

        if ($removed) {
            return response()->json([
                'success' => true,
                'message' => 'Participant removed successfully',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Participant not found',
        ], 404);
    }

    /**
     * Mute/unmute conversation
     */
    public function toggleMute(Request $request, string $conversationId): JsonResponse
    {
        $userId = $request->user()->id;
        $isMuted = $this->chatService->toggleMute($conversationId, $userId);

        return response()->json([
            'success' => true,
            'data' => ['is_muted' => $isMuted],
            'message' => $isMuted ? 'Conversation muted' : 'Conversation unmuted',
        ]);
    }

    /**
     * Pin/unpin conversation
     */
    public function togglePin(Request $request, string $conversationId): JsonResponse
    {
        $userId = $request->user()->id;
        $isPinned = $this->chatService->togglePin($conversationId, $userId);

        return response()->json([
            'success' => true,
            'data' => ['is_pinned' => $isPinned],
            'message' => $isPinned ? 'Conversation pinned' : 'Conversation unpinned',
        ]);
    }

    /**
     * Archive/unarchive conversation
     */
    public function toggleArchive(string $conversationId): JsonResponse
    {
        $isArchived = $this->chatService->toggleArchive($conversationId);

        return response()->json([
            'success' => true,
            'data' => ['is_archived' => $isArchived],
            'message' => $isArchived ? 'Conversation archived' : 'Conversation unarchived',
        ]);
    }

    /**
     * Get unread count
     */
    public function getUnreadCount(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $collegeId = $request->header('X-College-ID');

        $count = $this->chatService->getUnreadCount($userId, $collegeId);

        return response()->json([
            'success' => true,
            'data' => ['unread_count' => $count],
        ]);
    }

    /**
     * Search messages
     */
    public function searchMessages(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'query' => 'required|string|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $userId = $request->user()->id;
        $collegeId = $request->header('X-College-ID');
        $query = $request->input('query');

        $results = $this->chatService->searchMessages($userId, $collegeId, $query);

        return response()->json([
            'success' => true,
            'data' => $results,
        ]);
    }
}
