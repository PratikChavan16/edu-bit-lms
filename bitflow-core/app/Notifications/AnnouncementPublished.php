<?php

namespace App\Notifications;

use App\Models\Announcement;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AnnouncementPublished extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(private Announcement $announcement)
    {
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $priority = $this->announcement->priority === 'high' ? '🔴 URGENT: ' : '';
        
        return (new MailMessage)
            ->subject($priority . $this->announcement->title)
            ->greeting('Hello ' . $notifiable->first_name . '!')
            ->line('A new announcement has been published:')
            ->line('**' . $this->announcement->title . '**')
            ->line($this->announcement->content)
            ->action('View Announcement', url('/announcements/' . $this->announcement->id))
            ->line('Thank you for using BitFlow Nova LMS!');
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'announcement_id' => $this->announcement->id,
            'title' => $this->announcement->title,
            'content' => $this->announcement->content,
            'type' => $this->announcement->type,
            'priority' => $this->announcement->priority,
            'url' => url('/announcements/' . $this->announcement->id),
        ];
    }
}
