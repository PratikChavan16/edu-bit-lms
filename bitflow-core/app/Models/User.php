<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasUuids, Notifiable, SoftDeletes;

    protected $fillable = [
        'username',
        'email',
        'password',
        'first_name',
        'last_name',
        'phone',
        'date_of_birth',
        'photo_url',
        'status',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'last_login_at' => 'datetime',
    ];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles')
            ->using(UserRole::class)
            ->withPivot(['university_id', 'college_id'])
            ->withTimestamps();
    }

    public function student(): HasOne
    {
        return $this->hasOne(Student::class);
    }

    public function faculty(): HasOne
    {
        return $this->hasOne(Faculty::class);
    }

    public function hasRole(string $roleSlug, ?string $collegeId = null): bool
    {
        $query = $this->roles()->where('slug', $roleSlug);
        
        if ($collegeId) {
            $query->wherePivot('college_id', $collegeId);
        }
        
        return $query->exists();
    }

    public function hasAnyRole(array $roleSlugs, ?string $collegeId = null): bool
    {
        $query = $this->roles()->whereIn('slug', $roleSlugs);
        
        if ($collegeId) {
            $query->wherePivot('college_id', $collegeId);
        }
        
        return $query->exists();
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
