<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    use HasUuids;

    const UPDATED_AT = null; // Only created_at, no updated_at

    protected $fillable = [
        'user_id',
        'user_email',
        'user_role',
        'action',
        'resource_type',
        'resource_id',
        'changes',
        'description',
        'ip_address',
        'user_agent',
        'request_id',
    ];

    protected $casts = [
        'changes' => 'array',
        'created_at' => 'datetime',
    ];

    /**
     * Get the user who performed the action
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Create an audit log entry
     */
    public static function log(
        string $action,
        string $resourceType,
        ?string $resourceId = null,
        ?array $changes = null,
        ?string $description = null
    ): self {
        $user = auth()->user();
        
        return self::create([
            'user_id' => $user?->id,
            'user_email' => $user?->email,
            'user_role' => $user?->role,
            'action' => $action,
            'resource_type' => $resourceType,
            'resource_id' => $resourceId,
            'changes' => $changes,
            'description' => $description,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'request_id' => request()->header('X-Request-ID'),
        ]);
    }
}
