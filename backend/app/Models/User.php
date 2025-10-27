<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use App\Scopes\UniversityScope;

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasUuids, SoftDeletes;

    protected $fillable = [
        'university_id',
        'username',
        'email',
        'password',
        'first_name',
        'last_name',
        'phone',
        'photo_url',
        'status',
        'email_verified_at',
        'last_login_at',
        'password_changed_at',
        'two_factor_secret',
        'two_factor_enabled',
    ];

    protected $hidden = [
        'password',
        'two_factor_secret',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'password_changed_at' => 'datetime',
        'two_factor_enabled' => 'boolean',
        'deleted_at' => 'datetime',
    ];

    protected $appends = ['full_name'];

    /**
     * Enable tenant isolation
     */
    public bool $universityScoped = true;

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::addGlobalScope(new UniversityScope());
    }

    /**
     * Get the user's full name.
     */
    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    /**
     * Get the university that owns the user
     */
    public function university()
    {
        return $this->belongsTo(University::class);
    }

    /**
     * Get the roles assigned to user
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_user', 'user_id', 'role_id')
            ->withPivot('id', 'assigned_at', 'expires_at', 'assigned_by')
            ->using(RoleUser::class);
    }

    /**
     * Get all permissions through roles
     */
    public function permissions()
    {
        return $this->hasManyThrough(
            Permission::class,
            Role::class,
            'id',
            'id',
            'id',
            'id'
        )->join('role_permissions', 'role_permissions.permission_id', '=', 'permissions.id')
         ->join('role_user', 'role_user.role_id', '=', 'role_permissions.role_id')
         ->where('role_user.user_id', $this->id);
    }

    /**
     * Get the student profile
     */
    public function student()
    {
        return $this->hasOne(Student::class);
    }

    /**
     * Get user's active sessions
     */
    public function sessions()
    {
        return $this->hasMany(Session::class);
    }

    /**
     * Check if user has specific role
     */
    public function hasRole(string $roleSlug): bool
    {
        return $this->roles()->where('slug', $roleSlug)->exists();
    }

    /**
     * Check if user has any of the given roles
     */
    public function hasAnyRole(array $roleSlugs): bool
    {
        return $this->roles()->whereIn('slug', $roleSlugs)->exists();
    }

    /**
     * Check if user has specific permission
     */
    public function hasPermission(string $permissionSlug): bool
    {
        return $this->roles()
            ->whereHas('permissions', function ($query) use ($permissionSlug) {
                $query->where('slug', $permissionSlug);
            })
            ->exists();
    }

    /**
     * Check if user has all of the given permissions
     */
    public function hasAllPermissions(array $permissionSlugs): bool
    {
        $userPermissions = $this->roles()
            ->with('permissions')
            ->get()
            ->pluck('permissions')
            ->flatten()
            ->pluck('slug')
            ->unique();

        return collect($permissionSlugs)->every(function ($slug) use ($userPermissions) {
            return $userPermissions->contains($slug);
        });
    }

    /**
     * Check if user is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if email is verified
     */
    public function hasVerifiedEmail(): bool
    {
        return !is_null($this->email_verified_at);
    }
}
