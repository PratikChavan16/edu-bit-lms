<?php

namespace App\Jobs;

use App\Models\{User, Notice};
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendNoticeNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $noticeId
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $notice = Notice::with('college')->find($this->noticeId);

        if (!$notice) {
            \Log::error("Notice not found: {$this->noticeId}");
            return;
        }

        try {
            // Get target audience
            $users = $this->getTargetAudience($notice);

            foreach ($users as $user) {
                // Send in-app notification (would integrate with notification system)
                \Log::info("Sending notice '{$notice->title}' to user {$user->id}");
                
                // TODO: Integrate with notification channels (email, SMS, push)
                // - Email: Queue email job
                // - SMS: Queue SMS job (for high priority)
                // - Push: Send push notification
            }

            \Log::info("Notice notifications sent: {$this->noticeId}, {$users->count()} recipients");
        } catch (\Exception $e) {
            \Log::error("Failed to send notice notifications {$this->noticeId}: " . $e->getMessage());
            $this->fail($e);
        }
    }

    private function getTargetAudience(Notice $notice)
    {
        $query = User::query();

        // Filter by audience type
        switch ($notice->audience) {
            case 'students':
                $query->whereHas('student', function ($q) use ($notice) {
                    $q->where('college_id', $notice->college_id)
                        ->where('status', 'active');
                });
                break;

            case 'faculty':
                $query->whereHas('faculty', function ($q) use ($notice) {
                    $q->where('college_id', $notice->college_id)
                        ->where('status', 'active');
                });
                break;

            case 'all':
                $query->whereHas('roles', function ($q) use ($notice) {
                    $q->wherePivot('college_id', $notice->college_id);
                });
                break;

            case 'custom':
                // Apply custom filters from audience_filter JSON
                if ($notice->audience_filter) {
                    // TODO: Implement custom filtering logic
                }
                break;
        }

        return $query->where('status', 'active')->get();
    }
}
