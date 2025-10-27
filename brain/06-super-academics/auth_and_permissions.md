# Super Academics Portal - Authentication & Permissions

## Overview
Comprehensive authentication and authorization system for the Super Academics portal using Laravel Sanctum for API authentication and Spatie Laravel Permission for role-based access control (RBAC).

---

## Table of Contents
1. [Authentication System](#authentication-system)
2. [Roles & Permissions](#roles--permissions)
3. [Authorization Policies](#authorization-policies)
4. [Middleware Configuration](#middleware-configuration)
5. [API Token Management](#api-token-management)
6. [Row-Level Security](#row-level-security)
7. [Security Best Practices](#security-best-practices)

---

## 1. Authentication System

### 1.1 Laravel Sanctum Setup

**Configuration**: `config/sanctum.php`

```php
<?php

return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
        env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
    ))),

    'guard' => ['web'],

    'expiration' => env('SANCTUM_TOKEN_EXPIRATION', 525600), // 1 year in minutes

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
        'validate_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
    ],
];
```

### 1.2 Authentication Controller

**File**: `app/Http/Controllers/AuthController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login user and create token
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'device_name' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if user has super_academics role
        if (!$user->hasRole(['super_academics_admin', 'super_academics_analyst'])) {
            throw ValidationException::withMessages([
                'email' => ['You do not have access to this portal.'],
            ]);
        }

        // Create token with abilities based on role
        $abilities = $this->getAbilitiesForUser($user);

        $token = $user->createToken(
            $request->device_name,
            $abilities,
            now()->addMinutes(config('sanctum.expiration'))
        )->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->roles->pluck('name'),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
        ]);
    }

    /**
     * Logout user (revoke token)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out',
        ]);
    }

    /**
     * Get current user
     */
    public function me(Request $request)
    {
        return response()->json([
            'user' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'roles' => $request->user()->roles->pluck('name'),
                'permissions' => $request->user()->getAllPermissions()->pluck('name'),
            ],
        ]);
    }

    /**
     * Get abilities based on user role
     */
    private function getAbilitiesForUser(User $user): array
    {
        if ($user->hasRole('super_academics_admin')) {
            return ['*']; // All abilities
        }

        if ($user->hasRole('super_academics_analyst')) {
            return [
                'view:curricula',
                'view:exams',
                'view:analytics',
                'view:compliance',
            ];
        }

        return [];
    }
}
```

### 1.3 Multi-Factor Authentication (MFA)

**File**: `app/Http/Controllers/MfaController.php`

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PragmaRX\Google2FA\Google2FA;

class MfaController extends Controller
{
    /**
     * Enable MFA for user
     */
    public function enable(Request $request)
    {
        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        $request->user()->update([
            'two_factor_secret' => encrypt($secret),
        ]);

        $qrCodeUrl = $google2fa->getQRCodeUrl(
            config('app.name'),
            $request->user()->email,
            $secret
        );

        return response()->json([
            'secret' => $secret,
            'qr_code_url' => $qrCodeUrl,
        ]);
    }

    /**
     * Verify MFA code
     */
    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|numeric',
        ]);

        $google2fa = new Google2FA();
        $secret = decrypt($request->user()->two_factor_secret);

        $valid = $google2fa->verifyKey($secret, $request->code);

        if (!$valid) {
            return response()->json([
                'message' => 'Invalid verification code',
            ], 422);
        }

        $request->user()->update([
            'two_factor_confirmed_at' => now(),
        ]);

        return response()->json([
            'message' => 'MFA enabled successfully',
        ]);
    }

    /**
     * Disable MFA
     */
    public function disable(Request $request)
    {
        $request->user()->update([
            'two_factor_secret' => null,
            'two_factor_confirmed_at' => null,
        ]);

        return response()->json([
            'message' => 'MFA disabled successfully',
        ]);
    }
}
```

---

## 2. Roles & Permissions

### 2.1 Role Definitions

**File**: `database/seeders/RolePermissionSeeder.php`

```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions for Curriculum Management
        $curriculumPermissions = [
            'view:curricula',
            'create:curricula',
            'edit:curricula',
            'delete:curricula',
            'publish:curricula',
            'approve:curricula',
        ];

        // Create permissions for Examination Management
        $examPermissions = [
            'view:exams',
            'create:exams',
            'edit:exams',
            'delete:exams',
            'publish:exams',
            'manage:question-bank',
        ];

        // Create permissions for Analytics
        $analyticsPermissions = [
            'view:analytics',
            'export:reports',
            'view:compliance',
            'manage:compliance',
        ];

        // Create permissions for Approvals
        $approvalPermissions = [
            'view:approvals',
            'approve:requests',
            'reject:requests',
            'request:changes',
        ];

        // Create permissions for Audit
        $auditPermissions = [
            'view:audit-logs',
            'export:audit-logs',
        ];

        // Combine all permissions
        $allPermissions = array_merge(
            $curriculumPermissions,
            $examPermissions,
            $analyticsPermissions,
            $approvalPermissions,
            $auditPermissions
        );

        // Create all permissions
        foreach ($allPermissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'sanctum']);
        }

        // Create Super Academics Admin role
        $adminRole = Role::create(['name' => 'super_academics_admin', 'guard_name' => 'sanctum']);
        $adminRole->givePermissionTo(Permission::all());

        // Create Super Academics Analyst role (read-only + reporting)
        $analystRole = Role::create(['name' => 'super_academics_analyst', 'guard_name' => 'sanctum']);
        $analystRole->givePermissionTo([
            'view:curricula',
            'view:exams',
            'view:analytics',
            'export:reports',
            'view:compliance',
            'view:approvals',
            'view:audit-logs',
        ]);

        // Create Curriculum Manager role
        $curriculumManagerRole = Role::create(['name' => 'curriculum_manager', 'guard_name' => 'sanctum']);
        $curriculumManagerRole->givePermissionTo([
            'view:curricula',
            'create:curricula',
            'edit:curricula',
            'publish:curricula',
        ]);

        // Create Examination Coordinator role
        $examCoordinatorRole = Role::create(['name' => 'examination_coordinator', 'guard_name' => 'sanctum']);
        $examCoordinatorRole->givePermissionTo([
            'view:exams',
            'create:exams',
            'edit:exams',
            'publish:exams',
            'manage:question-bank',
        ]);

        // Create Compliance Officer role
        $complianceOfficerRole = Role::create(['name' => 'compliance_officer', 'guard_name' => 'sanctum']);
        $complianceOfficerRole->givePermissionTo([
            'view:curricula',
            'view:exams',
            'view:compliance',
            'manage:compliance',
            'view:approvals',
        ]);

        $this->command->info('Roles and permissions created successfully!');
    }
}
```

### 2.2 User Model Configuration

**File**: `app/Models/User.php`

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'two_factor_secret',
        'two_factor_confirmed_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'two_factor_confirmed_at' => 'datetime',
    ];

    /**
     * Check if user requires MFA
     */
    public function requiresMfa(): bool
    {
        return !is_null($this->two_factor_secret) && !is_null($this->two_factor_confirmed_at);
    }

    /**
     * Check if user can access Super Academics portal
     */
    public function canAccessSuperAcademics(): bool
    {
        return $this->hasAnyRole([
            'super_academics_admin',
            'super_academics_analyst',
            'curriculum_manager',
            'examination_coordinator',
            'compliance_officer',
        ]);
    }
}
```

---

## 3. Authorization Policies

### 3.1 Curriculum Policy

**File**: `app/Policies/CurriculumPolicy.php`

```php
<?php

namespace App\Policies;

use App\Models\Curriculum;
use App\Models\User;

class CurriculumPolicy
{
    /**
     * View any curricula
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view:curricula');
    }

    /**
     * View single curriculum
     */
    public function view(User $user, Curriculum $curriculum): bool
    {
        return $user->can('view:curricula');
    }

    /**
     * Create curriculum
     */
    public function create(User $user): bool
    {
        return $user->can('create:curricula');
    }

    /**
     * Update curriculum
     */
    public function update(User $user, Curriculum $curriculum): bool
    {
        // Only allow editing draft curricula
        if ($curriculum->status !== 'draft') {
            return false;
        }

        return $user->can('edit:curricula');
    }

    /**
     * Delete curriculum
     */
    public function delete(User $user, Curriculum $curriculum): bool
    {
        // Only allow deleting draft curricula
        if ($curriculum->status !== 'draft') {
            return false;
        }

        return $user->can('delete:curricula');
    }

    /**
     * Publish curriculum
     */
    public function publish(User $user, Curriculum $curriculum): bool
    {
        return $user->can('publish:curricula');
    }

    /**
     * Approve curriculum
     */
    public function approve(User $user, Curriculum $curriculum): bool
    {
        // User cannot approve their own curriculum
        if ($curriculum->created_by === $user->id) {
            return false;
        }

        return $user->can('approve:curricula');
    }
}
```

### 3.2 Exam Policy

**File**: `app/Policies/ExamSchedulePolicy.php`

```php
<?php

namespace App\Policies;

use App\Models\ExamSchedule;
use App\Models\User;

class ExamSchedulePolicy
{
    /**
     * View any exam schedules
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view:exams');
    }

    /**
     * View single exam schedule
     */
    public function view(User $user, ExamSchedule $examSchedule): bool
    {
        return $user->can('view:exams');
    }

    /**
     * Create exam schedule
     */
    public function create(User $user): bool
    {
        return $user->can('create:exams');
    }

    /**
     * Update exam schedule
     */
    public function update(User $user, ExamSchedule $examSchedule): bool
    {
        // Cannot edit published schedules
        if ($examSchedule->status === 'published') {
            return false;
        }

        return $user->can('edit:exams');
    }

    /**
     * Delete exam schedule
     */
    public function delete(User $user, ExamSchedule $examSchedule): bool
    {
        // Cannot delete published schedules
        if ($examSchedule->status === 'published') {
            return false;
        }

        return $user->can('delete:exams');
    }

    /**
     * Publish exam schedule
     */
    public function publish(User $user, ExamSchedule $examSchedule): bool
    {
        return $user->can('publish:exams');
    }
}
```

### 3.3 Policy Registration

**File**: `app/Providers/AuthServiceProvider.php`

```php
<?php

namespace App\Providers;

use App\Models\Curriculum;
use App\Models\ExamSchedule;
use App\Models\Approval;
use App\Policies\CurriculumPolicy;
use App\Policies\ExamSchedulePolicy;
use App\Policies\ApprovalPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Curriculum::class => CurriculumPolicy::class,
        ExamSchedule::class => ExamSchedulePolicy::class,
        Approval::class => ApprovalPolicy::class,
    ];

    public function boot()
    {
        $this->registerPolicies();
    }
}
```

---

## 4. Middleware Configuration

### 4.1 Permission Middleware

**File**: `app/Http/Kernel.php`

```php
protected $middlewareAliases = [
    'auth' => \App\Http\Middleware\Authenticate::class,
    'auth.sanctum' => \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    'permission' => \Spatie\Permission\Middlewares\PermissionMiddleware::class,
    'role' => \Spatie\Permission\Middlewares\RoleMiddleware::class,
    'role_or_permission' => \Spatie\Permission\Middlewares\RoleOrPermissionMiddleware::class,
    'mfa.verify' => \App\Http\Middleware\VerifyMfa::class,
];
```

### 4.2 MFA Verification Middleware

**File**: `app/Http/Middleware/VerifyMfa.php`

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerifyMfa
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user && $user->requiresMfa()) {
            if (!session('mfa_verified')) {
                return response()->json([
                    'message' => 'MFA verification required',
                    'requires_mfa' => true,
                ], 403);
            }
        }

        return $next($request);
    }
}
```

### 4.3 Route Middleware Application

**File**: `routes/api.php`

```php
Route::prefix('v1')->middleware(['auth:sanctum', 'mfa.verify'])->group(function () {
    
    // Curriculum Management - requires specific permissions
    Route::prefix('curriculum')->group(function () {
        Route::get('/', [CurriculumController::class, 'index'])
            ->middleware('permission:view:curricula');
        
        Route::post('/', [CurriculumController::class, 'store'])
            ->middleware('permission:create:curricula');
        
        Route::put('/{id}', [CurriculumController::class, 'update'])
            ->middleware('permission:edit:curricula');
        
        Route::post('/{id}/publish', [CurriculumController::class, 'publish'])
            ->middleware('permission:publish:curricula');
        
        Route::post('/{id}/approve', [CurriculumController::class, 'approve'])
            ->middleware('permission:approve:curricula');
    });

    // Analytics - requires specific roles
    Route::prefix('analytics')->middleware('role:super_academics_admin|super_academics_analyst')->group(function () {
        Route::get('/cross-college-performance', [AnalyticsController::class, 'crossCollegePerformance']);
        Route::get('/compliance', [AnalyticsController::class, 'compliance']);
    });
});
```

---

## 5. API Token Management

### 5.1 Token Abilities

```php
// Token with all abilities
$token = $user->createToken('admin-token', ['*']);

// Token with specific abilities
$token = $user->createToken('analyst-token', [
    'view:curricula',
    'view:exams',
    'view:analytics',
]);

// Check token ability in controller
if ($request->user()->tokenCan('create:curricula')) {
    // User can create curricula
}
```

### 5.2 Token Expiration

**Configuration in `.env`**:
```env
SANCTUM_TOKEN_EXPIRATION=525600  # 1 year in minutes
```

### 5.3 Token Revocation

```php
// Revoke current token
$request->user()->currentAccessToken()->delete();

// Revoke all tokens
$user->tokens()->delete();

// Revoke specific token
$user->tokens()->where('id', $tokenId)->delete();
```

---

## 6. Row-Level Security

### 6.1 Global Scopes for Data Filtering

**File**: `app/Models/Scopes/CollegeScope.php`

```php
<?php

namespace App\Models\Scopes;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;

class CollegeScope implements Scope
{
    /**
     * Apply college filtering based on user role
     */
    public function apply(Builder $builder, Model $model)
    {
        $user = auth()->user();

        // Super admins see everything
        if ($user && $user->hasRole('super_academics_admin')) {
            return;
        }

        // Analysts can see all but not modify
        if ($user && $user->hasRole('super_academics_analyst')) {
            return;
        }

        // Other roles might have college-specific access
        if ($user && $user->college_id) {
            $builder->where('college_id', $user->college_id);
        }
    }
}
```

### 6.2 Manual Authorization Checks

```php
// In controller
public function show(int $id)
{
    $curriculum = Curriculum::findOrFail($id);
    
    $this->authorize('view', $curriculum);
    
    return new CurriculumResource($curriculum);
}

// In service
public function updateCurriculum(int $id, array $data)
{
    $curriculum = Curriculum::findOrFail($id);
    
    if (Gate::denies('update', $curriculum)) {
        throw new AuthorizationException('You are not authorized to update this curriculum.');
    }
    
    return $curriculum->update($data);
}
```

---

## 7. Security Best Practices

### 7.1 Password Policies

**File**: `app/Rules/StrongPassword.php`

```php
<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class StrongPassword implements Rule
{
    public function passes($attribute, $value)
    {
        return preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/', $value);
    }

    public function message()
    {
        return 'Password must be at least 12 characters with uppercase, lowercase, number, and special character.';
    }
}
```

### 7.2 Rate Limiting

**File**: `app/Providers/RouteServiceProvider.php`

```php
protected function configureRateLimiting()
{
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });

    RateLimiter::for('login', function (Request $request) {
        return Limit::perMinute(5)->by($request->email . $request->ip());
    });
}
```

### 7.3 Audit Logging

**File**: `app/Observers/CurriculumObserver.php`

```php
<?php

namespace App\Observers;

use App\Models\Curriculum;
use App\Models\AuditLog;

class CurriculumObserver
{
    public function created(Curriculum $curriculum)
    {
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'curriculum.created',
            'entity_type' => 'curriculum',
            'entity_id' => $curriculum->id,
            'changes' => $curriculum->toArray(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function updated(Curriculum $curriculum)
    {
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'curriculum.updated',
            'entity_type' => 'curriculum',
            'entity_id' => $curriculum->id,
            'changes' => $curriculum->getChanges(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    public function deleted(Curriculum $curriculum)
    {
        AuditLog::create([
            'user_id' => auth()->id(),
            'action' => 'curriculum.deleted',
            'entity_type' => 'curriculum',
            'entity_id' => $curriculum->id,
            'changes' => ['deleted_at' => now()],
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
```

### 7.4 IP Whitelisting (Optional)

**File**: `app/Http/Middleware/IpWhitelist.php`

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IpWhitelist
{
    protected $whitelist = [
        '192.168.1.0/24',
        '10.0.0.0/8',
    ];

    public function handle(Request $request, Closure $next)
    {
        if (!in_array($request->ip(), $this->whitelist)) {
            return response()->json([
                'message' => 'Access denied from your IP address',
            ], 403);
        }

        return $next($request);
    }
}
```

---

## Summary

### Key Security Features
1. **Multi-Factor Authentication**: TOTP-based MFA for high-privilege accounts
2. **Role-Based Access Control**: 5 distinct roles with granular permissions
3. **Token-Based Authentication**: Sanctum tokens with abilities and expiration
4. **Policy-Based Authorization**: Centralized authorization logic in policies
5. **Audit Logging**: Complete activity trail for compliance
6. **Rate Limiting**: Protect against brute force and DDoS attacks
7. **Strong Password Policy**: Enforce complex password requirements
8. **Row-Level Security**: Filter data based on user context

### Role Summary
| Role | Permissions | Use Case |
|------|-------------|----------|
| **super_academics_admin** | All permissions (*) | Full system control |
| **super_academics_analyst** | Read + Export | Reporting and analysis |
| **curriculum_manager** | Manage curricula | Create and update curriculum templates |
| **examination_coordinator** | Manage exams + question bank | Schedule exams, manage questions |
| **compliance_officer** | View all + manage compliance | Track and resolve compliance issues |

---

*This authentication and permission system provides enterprise-grade security for the Super Academics portal with fine-grained access control and comprehensive audit trails.*
