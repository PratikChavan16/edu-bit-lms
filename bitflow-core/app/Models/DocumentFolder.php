<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocumentFolder extends Model
{
    use HasFactory;
    use HasUuids;
    use SoftDeletes;

    protected $fillable = [
        'college_id',
        'name',
        'description',
        'owner_type',
        'owner_id',
        'required_file_types',
        'due_date',
        'is_required',
    ];

    protected $casts = [
        'required_file_types' => 'array',
        'due_date' => 'date',
        'is_required' => 'boolean',
    ];

    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class, 'folder_id');
    }
}
