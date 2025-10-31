<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FilterPreset extends Model
{
    use HasFactory, HasUuid, SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'entity_type',
        'filters',
        'sort',
        'is_default',
        'order',
    ];

    protected $casts = [
        'filters' => 'array',
        'sort' => 'array',
        'is_default' => 'boolean',
        'order' => 'integer',
    ];

    /**
     * Get the user that owns the preset.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope to filter by entity type.
     */
    public function scopeForEntity($query, string $entityType)
    {
        return $query->where('entity_type', $entityType);
    }

    /**
     * Scope to get default presets.
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    /**
     * Set this preset as default and unset others for the same entity type.
     */
    public function setAsDefault(): void
    {
        // Unset all other defaults for this user and entity type
        self::where('user_id', $this->user_id)
            ->where('entity_type', $this->entity_type)
            ->where('id', '!=', $this->id)
            ->update(['is_default' => false]);

        // Set this one as default
        $this->update(['is_default' => true]);
    }
}
