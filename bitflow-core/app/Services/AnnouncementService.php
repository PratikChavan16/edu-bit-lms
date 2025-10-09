<?php

namespace App\Services;

use App\Models\Announcement;
use App\Models\AnnouncementRead;
use App\Notifications\AnnouncementPublished;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Notification;

class AnnouncementService
{
    public function listAnnouncements(string $collegeId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Announcement::where('college_id', $collegeId)
            ->with('creator');

        if (isset($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['priority'])) {
            $query->where('priority', $filters['priority']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('priority', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function createAnnouncement(string $collegeId, string $userId, array $data): Announcement
    {
        $announcement = Announcement::create([
            'college_id' => $collegeId,
            'created_by' => $userId,
            'title' => $data['title'],
            'content' => $data['content'],
            'type' => $data['type'],
            'priority' => $data['priority'],
            'target_audience' => $data['target_audience'],
            'course' => $data['course'] ?? null,
            'year' => $data['year'] ?? null,
            'scheduled_at' => $data['scheduled_at'] ?? now(),
            'expires_at' => $data['expires_at'] ?? null,
            'status' => 'draft',
        ]);

        return $announcement;
    }

    public function getAnnouncement(string $id): Announcement
    {
        return Announcement::with(['creator', 'reads'])->findOrFail($id);
    }

    public function updateAnnouncement(string $id, array $data): Announcement
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->update($data);

        return $announcement->fresh();
    }

    public function deleteAnnouncement(string $id): void
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->delete();
    }

    public function publishAnnouncement(string $id): Announcement
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        // Send notifications to target audience
        $this->sendAnnouncementNotifications($announcement);

        return $announcement->fresh();
    }

    public function archiveAnnouncement(string $id): Announcement
    {
        $announcement = Announcement::findOrFail($id);
        $announcement->update(['status' => 'archived']);

        return $announcement->fresh();
    }

    public function markAsRead(string $announcementId, string $userId): void
    {
        AnnouncementRead::firstOrCreate([
            'announcement_id' => $announcementId,
            'user_id' => $userId,
        ], [
            'read_at' => now(),
        ]);
    }

    public function getUnreadCount(string $userId): int
    {
        $readIds = AnnouncementRead::where('user_id', $userId)
            ->pluck('announcement_id');

        return Announcement::where('status', 'published')
            ->where('scheduled_at', '<=', now())
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>=', now());
            })
            ->whereNotIn('id', $readIds)
            ->count();
    }

    private function sendAnnouncementNotifications(Announcement $announcement): void
    {
        // Get target users based on audience
        $users = collect();

        foreach ($announcement->target_audience as $audience) {
            switch ($audience) {
                case 'all':
                    $users = $users->merge(
                        \App\Models\User::where('college_id', $announcement->college_id)
                            ->where('status', 'active')
                            ->get()
                    );
                    break;

                case 'students':
                    $users = $users->merge(
                        \App\Models\User::whereHas('student', function ($q) use ($announcement) {
                            $q->where('college_id', $announcement->college_id);
                            if ($announcement->course) {
                                $q->where('course', $announcement->course);
                            }
                            if ($announcement->year) {
                                $q->where('year', $announcement->year);
                            }
                        })->where('status', 'active')->get()
                    );
                    break;

                case 'faculty':
                    $users = $users->merge(
                        \App\Models\User::whereHas('faculty', function ($q) use ($announcement) {
                            $q->where('college_id', $announcement->college_id);
                        })->where('status', 'active')->get()
                    );
                    break;
            }
        }

        // Send notifications
        Notification::send($users->unique('id'), new AnnouncementPublished($announcement));
    }
}
