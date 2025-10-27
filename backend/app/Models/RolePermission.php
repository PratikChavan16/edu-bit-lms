<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Support\Str;

class RolePermission extends Pivot
{
    /**
     * Indicates if the IDs are auto-incrementing.
     */
    public $incrementing = false;

    /**
     * The "type" of the primary key ID.
     */
    protected $keyType = 'string';

    /**
     * The table associated with the model.
     */
    protected $table = 'role_permissions';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'id',
        'role_id',
        'permission_id',
        'granted_at',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'granted_at' => 'datetime',
    ];

    /**
     * Boot function from Laravel.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = Str::uuid()->toString();
            }
        });
    }
}
