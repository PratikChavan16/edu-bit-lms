<?php

namespace App\Events\Broadcasting;

use App\Models\College;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CollegeUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public College $college;

    /**
     * Create a new event instance.
     */
    public function __construct(College $college)
    {
        $this->college = $college;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new Channel('colleges'),
            new Channel('universities.' . $this->college->university_id),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'college.updated';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->college->id,
            'university_id' => $this->college->university_id,
            'name' => $this->college->name,
            'code' => $this->college->code,
            'email' => $this->college->email,
            'status' => $this->college->status,
            'updated_at' => $this->college->updated_at?->toISOString(),
        ];
    }
}
