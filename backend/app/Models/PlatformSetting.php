<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class PlatformSetting extends Model
{
    use HasUuids;

    protected $fillable = [
        'category',
        'key',
        'value',
        'description',
        'is_encrypted',
    ];

    protected $casts = [
        'value' => 'array',
        'is_encrypted' => 'boolean',
    ];

    /**
     * Get settings by category
     */
    public static function getByCategory(string $category): array
    {
        return self::where('category', $category)
            ->get()
            ->pluck('value', 'key')
            ->toArray();
    }

    /**
     * Set a setting value
     */
    public static function set(string $category, string $key, mixed $value, ?string $description = null): self
    {
        return self::updateOrCreate(
            ['category' => $category, 'key' => $key],
            [
                'value' => $value,
                'description' => $description,
            ]
        );
    }
}
