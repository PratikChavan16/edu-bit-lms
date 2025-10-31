<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            
            $query = Notification::where('user_id', $user->id);

            // Filter by read status
            if ($request->has('is_read')) {
                $isRead = filter_var($request->is_read, FILTER_VALIDATE_BOOLEAN);
                $query->where('is_read', $isRead);
            }

            // Filter by category
            if ($request->has('category') && $request->category !== '') {
                $query->where('category', $request->category);
            }

            // Filter by type
            if ($request->has('type') && $request->type !== '') {
                $query->where('type', $request->type);
            }

            // Pagination
            $perPage = $request->per_page ?? 20;
            $notifications = $query->orderBy('created_at', 'desc')->paginate($perPage);

            // Get unread count
            $unreadCount = Notification::where('user_id', $user->id)
                ->unread()
                ->count();

            return $this->success([
                'notifications' => $notifications,
                'unread_count' => $unreadCount,
            ], 'Notifications retrieved');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch notifications: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get unread notification count
     */
    public function unreadCount(): JsonResponse
    {
        try {
            $user = auth()->user();
            $count = Notification::where('user_id', $user->id)
                ->unread()
                ->count();

            return $this->success(['count' => $count], 'Unread count retrieved');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch unread count: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get recent notifications (last 10)
     */
    public function recent(): JsonResponse
    {
        try {
            $user = auth()->user();
            $notifications = Notification::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get();

            $unreadCount = Notification::where('user_id', $user->id)
                ->unread()
                ->count();

            return $this->success([
                'notifications' => $notifications,
                'unread_count' => $unreadCount,
            ], 'Recent notifications retrieved');
        } catch (\Exception $e) {
            return $this->error('Failed to fetch recent notifications: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Mark a notification as read
     */
    public function markAsRead(string $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $notification = Notification::where('id', $id)
                ->where('user_id', $user->id)
                ->firstOrFail();

            $notification->markAsRead();

            return $this->success($notification, 'Notification marked as read');
        } catch (\Exception $e) {
            return $this->error('Failed to mark notification as read: ' . $e->getMessage(), 404);
        }
    }

    /**
     * Mark a notification as unread
     */
    public function markAsUnread(string $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $notification = Notification::where('id', $id)
                ->where('user_id', $user->id)
                ->firstOrFail();

            $notification->markAsUnread();

            return $this->success($notification, 'Notification marked as unread');
        } catch (\Exception $e) {
            return $this->error('Failed to mark notification as unread: ' . $e->getMessage(), 404);
        }
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead(): JsonResponse
    {
        try {
            $user = auth()->user();
            
            Notification::where('user_id', $user->id)
                ->where('is_read', false)
                ->update([
                    'is_read' => true,
                    'read_at' => now(),
                ]);

            return $this->success(null, 'All notifications marked as read');
        } catch (\Exception $e) {
            return $this->error('Failed to mark all as read: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete a notification
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $notification = Notification::where('id', $id)
                ->where('user_id', $user->id)
                ->firstOrFail();

            $notification->delete();

            return $this->success(null, 'Notification deleted');
        } catch (\Exception $e) {
            return $this->error('Failed to delete notification: ' . $e->getMessage(), 404);
        }
    }

    /**
     * Delete all read notifications
     */
    public function deleteAllRead(): JsonResponse
    {
        try {
            $user = auth()->user();
            
            Notification::where('user_id', $user->id)
                ->where('is_read', true)
                ->delete();

            return $this->success(null, 'All read notifications deleted');
        } catch (\Exception $e) {
            return $this->error('Failed to delete notifications: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Create a notification (Admin only)
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|uuid|exists:users,id',
                'type' => 'required|in:info,success,warning,error',
                'title' => 'required|string|max:255',
                'message' => 'required|string',
                'category' => 'nullable|string|max:50',
                'action_url' => 'nullable|string|max:500',
                'action_text' => 'nullable|string|max:100',
                'data' => 'nullable|array',
                'related_id' => 'nullable|uuid',
                'related_type' => 'nullable|string|max:50',
            ]);

            if ($validator->fails()) {
                return $this->error('Validation failed', 422, $validator->errors()->toArray());
            }

            $notification = Notification::create($validator->validated());

            return $this->success($notification, 'Notification created', 201);
        } catch (\Exception $e) {
            return $this->error('Failed to create notification: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Broadcast notification to all users in a university (Admin only)
     */
    public function broadcastToUniversity(Request $request, string $universityId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'type' => 'required|in:info,success,warning,error',
                'title' => 'required|string|max:255',
                'message' => 'required|string',
                'category' => 'nullable|string|max:50',
                'action_url' => 'nullable|string|max:500',
                'action_text' => 'nullable|string|max:100',
                'data' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return $this->error('Validation failed', 422, $validator->errors()->toArray());
            }

            $data = $validator->validated();
            
            $count = Notification::createForUniversity(
                $universityId,
                $data['type'],
                $data['title'],
                $data['message'],
                $data['category'] ?? null,
                $data['action_url'] ?? null,
                $data['action_text'] ?? null,
                $data['data'] ?? null
            );

            return $this->success([
                'count' => $count,
                'university_id' => $universityId,
            ], "Notification sent to {$count} users");
        } catch (\Exception $e) {
            return $this->error('Failed to broadcast notification: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Broadcast notification to all users in a college (Admin only)
     */
    public function broadcastToCollege(Request $request, string $collegeId): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'type' => 'required|in:info,success,warning,error',
                'title' => 'required|string|max:255',
                'message' => 'required|string',
                'category' => 'nullable|string|max:50',
                'action_url' => 'nullable|string|max:500',
                'action_text' => 'nullable|string|max:100',
                'data' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return $this->error('Validation failed', 422, $validator->errors()->toArray());
            }

            $data = $validator->validated();
            
            $count = Notification::createForCollege(
                $collegeId,
                $data['type'],
                $data['title'],
                $data['message'],
                $data['category'] ?? null,
                $data['action_url'] ?? null,
                $data['action_text'] ?? null,
                $data['data'] ?? null
            );

            return $this->success([
                'count' => $count,
                'college_id' => $collegeId,
            ], "Notification sent to {$count} users");
        } catch (\Exception $e) {
            return $this->error('Failed to broadcast notification: ' . $e->getMessage(), 500);
        }
    }
}
