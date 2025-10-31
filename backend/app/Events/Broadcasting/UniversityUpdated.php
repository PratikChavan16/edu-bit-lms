<?php

namespace App\Events\Broadcasting;

use App\Models\University;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UniversityUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public University $university;

    /**
     * Create a new event instance.
     */
    public function __construct(University $university)
    {
        $this->university = $university;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('universities'),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'university.updated';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->university->id,
            'name' => $this->university->name,
            'slug' => $this->university->slug,
            'domain' => $this->university->domain,
            'email' => $this->university->email,
            'status' => $this->university->status,
            'updated_at' => $this->university->updated_at?->toISOString(),
        ];
    }
}
