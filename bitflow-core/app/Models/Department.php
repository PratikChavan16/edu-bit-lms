<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'college_id',
        'name',
        'code',
        'type',
        'status',
        'head_user_id',
    ];

    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function head(): BelongsTo
    {
        return $this->belongsTo(User::class, 'head_user_id');
    }
}
