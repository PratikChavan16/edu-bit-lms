<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class LibraryResource extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $fillable = [
        'college_id',
        'title',
        'description',
        'type',
        'subject',
        'course',
        'year',
        'file_path',
        'file_url',
        'file_size_bytes',
        'mime_type',
        'tags',
        'uploaded_by',
        'approval_status',
        'approved_by',
        'approved_at',
    ];

    protected $casts = [
        'tags' => 'array',
        'approved_at' => 'datetime',
        'year' => 'integer',
        'file_size_bytes' => 'integer',
    ];

    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function bookmarks(): HasMany
    {
        return $this->hasMany(LibraryBookmark::class, 'resource_id');
    }
}
