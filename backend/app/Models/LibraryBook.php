<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LibraryBook extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'university_id',
        'college_id',
        'department_id',
        'title',
        'author',
        'isbn',
        'publisher',
        'publication_year',
        'edition',
        'resource_type',
        'category',
        'language',
        'total_copies',
        'available_copies',
        'issued_copies',
        'price',
        'purchase_date',
        'shelf_location',
        'description',
        'cover_image_url',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'purchase_date' => 'date',
    ];

    public function university(): BelongsTo
    {
        return $this->belongsTo(University::class);
    }

    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function issues(): HasMany
    {
        return $this->hasMany(LibraryIssue::class);
    }
}
