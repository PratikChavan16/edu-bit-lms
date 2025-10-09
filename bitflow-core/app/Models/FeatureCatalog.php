<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class FeatureCatalog extends Model
{
    use HasUuids;

    protected $table = 'feature_catalog';

    protected $fillable = [
        'code',
        'name',
        'category',
        'description',
        'dependencies',
        'impact_level',
        'default_enabled',
        'billing_model',
    ];

    protected $casts = [
        'dependencies' => 'array',
        'default_enabled' => 'boolean',
    ];
}
