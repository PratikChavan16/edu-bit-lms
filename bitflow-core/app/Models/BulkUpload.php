<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BulkUpload extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'college_id',
        'type',
        'uploaded_by',
        'file_name',
        'total_rows',
        'success_count',
        'failure_count',
        'errors',
        'status',
    ];

    protected $casts = [
        'errors' => 'array',
        'total_rows' => 'integer',
        'success_count' => 'integer',
        'failure_count' => 'integer',
    ];

    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
