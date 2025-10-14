<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ParentStudent extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'parent_student';

    protected $fillable = [
        'parent_id',
        'student_id',
        'relationship_type',
        'is_primary',
        'can_view_grades',
        'can_view_attendance',
        'can_view_fees',
        'receive_notifications',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'can_view_grades' => 'boolean',
        'can_view_attendance' => 'boolean',
        'can_view_fees' => 'boolean',
        'receive_notifications' => 'boolean',
    ];

    /**
     * Get the parent user
     */
    public function parent()
    {
        return $this->belongsTo(User::class, 'parent_id');
    }

    /**
     * Get the student
     */
    public function student()
    {
        return $this->belongsTo(Student::class, 'student_id');
    }

    /**
     * Scope for primary contacts
     */
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    /**
     * Scope for specific relationship type
     */
    public function scopeRelationType($query, string $type)
    {
        return $query->where('relationship_type', $type);
    }
}
