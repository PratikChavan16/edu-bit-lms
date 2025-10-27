# College Accounts Admin Portal - Authentication & Authorization

**Authentication Method**: Laravel Sanctum (Token-based)  
**Authorization**: Spatie Laravel Permission (RBAC)  
**MFA**: TOTP-based (Google Authenticator)  
**Session Management**: Stateless JWT tokens

---

## Table of Contents
1. [Authentication System](#1-authentication-system)
2. [Roles & Permissions](#2-roles--permissions)
3. [Authorization Policies](#3-authorization-policies)
4. [Multi-Factor Authentication](#4-multi-factor-authentication)
5. [Security Best Practices](#5-security-best-practices)

---

## 1. Authentication System

### 1.1 Laravel Sanctum Configuration

**File**: `config/sanctum.php`

```php
<?php

return [
    'expiration' => env('SANCTUM_TOKEN_EXPIRATION', 480), // 8 hours
    
    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),
    
    'middleware' => [
        'authenticate_session' => Laravel\Sanctum\Http\Middleware\AuthenticateSession::class,
        'encrypt_cookies' => App\Http\Middleware\EncryptCookies::class,
        'validate_csrf_token' => App\Http\Middleware\VerifyCsrfToken::class,
    ],
];
```

### 1.2 Login Implementation

**File**: `app/Http/Controllers/AuthController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Rate limiting: 5 attempts per minute
        $key = 'login-attempt:' . $request->ip();
        
        if (RateLimiter::tooManyAttempts($key, 5)) {
            $seconds = RateLimiter::availableIn($key);
            throw ValidationException::withMessages([
                'email' => ["Too many login attempts. Please try again in {$seconds} seconds."],
            ]);
        }

        $user = User::where('email', $request->email)
            ->where('role', 'college_accounts_admin')
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            RateLimiter::hit($key, 60);
            
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if account is active
        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Your account has been deactivated.'],
            ]);
        }

        // Check MFA requirement
        if ($user->mfa_enabled) {
            // Store pending auth session
            session(['pending_2fa_user_id' => $user->id]);
            
            return response()->json([
                'requires_2fa' => true,
                'message' => 'Please enter your 2FA code',
            ], 200);
        }

        // Clear rate limiter on successful login
        RateLimiter::clear($key);

        // Create token with abilities
        $token = $user->createToken('auth-token', [
            'expense:create',
            'expense:update',
            'expense:delete',
            'vendor:manage',
            'payment:process',
        ])->plainTextToken;

        // Log login
        activity()
            ->causedBy($user)
            ->log('User logged in');

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'college_id' => $user->college_id,
                    'college_name' => $user->college->name,
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                ],
            ],
        ]);
    }

    public function verify2FA(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $userId = session('pending_2fa_user_id');
        
        if (!$userId) {
            throw ValidationException::withMessages([
                'code' => ['Invalid session. Please login again.'],
            ]);
        }

        $user = User::findOrFail($userId);

        // Verify TOTP code
        $google2fa = app(\PragmaRX\Google2FALaravel\Google2FA::class);
        $valid = $google2fa->verifyKey($user->mfa_secret, $request->code);

        if (!$valid) {
            throw ValidationException::withMessages([
                'code' => ['Invalid 2FA code.'],
            ]);
        }

        // Clear pending session
        session()->forget('pending_2fa_user_id');

        // Create token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        activity()
            ->causedBy($request->user())
            ->log('User logged out');

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    public function refresh(Request $request)
    {
        $user = $request->user();
        
        // Revoke current token
        $request->user()->currentAccessToken()->delete();
        
        // Create new token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'token' => $token,
        ]);
    }
}
```

---

## 2. Roles & Permissions

### 2.1 Role Definition

**Single Role for this portal:**
- `college_accounts_admin`: College Accountant role

### 2.2 Permission Structure

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

        // Define all permissions
        $permissions = [
            // Expense Management (10 permissions)
            'expense.view',
            'expense.create',
            'expense.update',
            'expense.delete',
            'expense.submit',
            'expense.approve',      // Only for expenses < ₹50K (principal approves above)
            'expense.reject',
            'expense.view-all',
            'expense.export',
            'expense.reports',

            // Vendor Management (8 permissions)
            'vendor.view',
            'vendor.create',
            'vendor.update',
            'vendor.delete',
            'vendor.activate',
            'vendor.deactivate',
            'vendor.blacklist',
            'vendor.payment-history',

            // Purchase Orders (9 permissions)
            'po.view',
            'po.create',
            'po.update',
            'po.delete',
            'po.submit',
            'po.approve',
            'po.goods-receipt',
            'po.close',
            'po.reopen',

            // Invoice Management (7 permissions)
            'invoice.view',
            'invoice.create',
            'invoice.update',
            'invoice.delete',
            'invoice.approve',
            'invoice.schedule-payment',
            'invoice.mark-paid',

            // Payment Processing (8 permissions)
            'payment.view',
            'payment.create',
            'payment.update',
            'payment.delete',
            'payment.execute',
            'payment.batch-process',
            'payment.verify',
            'payment.cancel',

            // Budget Management (5 permissions)
            'budget.view',
            'budget.utilization',
            'budget.variance-analysis',
            'budget.export',
            'budget.alerts',

            // Financial Reports (6 permissions)
            'report.profit-loss',
            'report.balance-sheet',
            'report.cash-flow',
            'report.variance',
            'report.export',
            'report.schedule',

            // Bank Account (5 permissions)
            'bank-account.view',
            'bank-account.transactions',
            'bank-account.reconcile',
            'bank-account.balance-check',
            'bank-account.statements',

            // Audit & Compliance (3 permissions)
            'audit.view-logs',
            'audit.export-logs',
            'audit.search',
        ];

        // Create permissions
        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create College Accounts Admin role
        $accountsAdminRole = Role::create(['name' => 'college_accounts_admin']);

        // Assign all permissions to College Accounts Admin
        $accountsAdminRole->givePermissionTo([
            // Expense - Full access
            'expense.view',
            'expense.create',
            'expense.update',
            'expense.delete',
            'expense.submit',
            'expense.view-all',
            'expense.export',
            'expense.reports',
            
            // Vendor - Full access
            'vendor.view',
            'vendor.create',
            'vendor.update',
            'vendor.payment-history',
            
            // Purchase Orders - Full access except final approval
            'po.view',
            'po.create',
            'po.update',
            'po.goods-receipt',
            
            // Invoice - Full access
            'invoice.view',
            'invoice.create',
            'invoice.update',
            'invoice.schedule-payment',
            
            // Payment - Full access
            'payment.view',
            'payment.create',
            'payment.execute',
            'payment.batch-process',
            
            // Budget - View and monitoring
            'budget.view',
            'budget.utilization',
            'budget.variance-analysis',
            'budget.alerts',
            
            // Reports - Full access
            'report.profit-loss',
            'report.balance-sheet',
            'report.cash-flow',
            'report.variance',
            'report.export',
            
            // Bank - Full access
            'bank-account.view',
            'bank-account.transactions',
            'bank-account.reconcile',
            'bank-account.balance-check',
            
            // Audit - View access
            'audit.view-logs',
            'audit.search',
        ]);
    }
}
```

### 2.3 User Model with Permissions

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
        'role',
        'college_id',
        'phone',
        'is_active',
        'mfa_enabled',
        'mfa_secret',
        'last_login_at',
        'last_login_ip',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'mfa_secret',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'is_active' => 'boolean',
        'mfa_enabled' => 'boolean',
    ];

    // Relationship
    public function college()
    {
        return $this->belongsTo(College::class);
    }

    // Check if user owns a resource
    public function ownsResource($resource): bool
    {
        return $resource->college_id === $this->college_id;
    }
}
```

---

## 3. Authorization Policies

### 3.1 Expense Policy

**File**: `app/Policies/ExpensePolicy.php`

```php
<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Expense;

class ExpensePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('expense.view');
    }

    public function view(User $user, Expense $expense): bool
    {
        return $user->hasPermissionTo('expense.view') 
            && $user->ownsResource($expense);
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('expense.create');
    }

    public function update(User $user, Expense $expense): bool
    {
        // Can only update draft or rejected expenses
        if (!in_array($expense->status, [Expense::STATUS_DRAFT, Expense::STATUS_REJECTED])) {
            return false;
        }

        return $user->hasPermissionTo('expense.update') 
            && $user->ownsResource($expense);
    }

    public function delete(User $user, Expense $expense): bool
    {
        // Can only delete draft expenses
        if ($expense->status !== Expense::STATUS_DRAFT) {
            return false;
        }

        return $user->hasPermissionTo('expense.delete') 
            && $user->ownsResource($expense);
    }

    public function submit(User $user, Expense $expense): bool
    {
        // Can only submit draft expenses
        if ($expense->status !== Expense::STATUS_DRAFT) {
            return false;
        }

        return $user->hasPermissionTo('expense.submit') 
            && $user->ownsResource($expense);
    }
}
```

### 3.2 Payment Policy

**File**: `app/Policies/PaymentPolicy.php`

```php
<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Payment;

class PaymentPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('payment.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('payment.create');
    }

    public function execute(User $user, Payment $payment): bool
    {
        // Can only execute scheduled payments
        if ($payment->status !== Payment::STATUS_SCHEDULED) {
            return false;
        }

        return $user->hasPermissionTo('payment.execute') 
            && $user->ownsResource($payment);
    }

    public function cancel(User $user, Payment $payment): bool
    {
        // Can only cancel scheduled or processing payments
        if (!in_array($payment->status, [Payment::STATUS_SCHEDULED, Payment::STATUS_PROCESSING])) {
            return false;
        }

        return $user->hasPermissionTo('payment.cancel') 
            && $user->ownsResource($payment);
    }
}
```

### 3.3 Register Policies

**File**: `app/Providers/AuthServiceProvider.php`

```php
<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Expense;
use App\Models\Payment;
use App\Models\PurchaseOrder;
use App\Models\Invoice;
use App\Policies\ExpensePolicy;
use App\Policies\PaymentPolicy;
use App\Policies\PurchaseOrderPolicy;
use App\Policies\InvoicePolicy;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Expense::class => ExpensePolicy::class,
        Payment::class => PaymentPolicy::class,
        PurchaseOrder::class => PurchaseOrderPolicy::class,
        Invoice::class => InvoicePolicy::class,
    ];

    public function boot()
    {
        $this->registerPolicies();
    }
}
```

---

## 4. Multi-Factor Authentication

### 4.1 Setup MFA

**Installation**:
```bash
composer require pragmarx/google2fa-laravel
```

**File**: `app/Http/Controllers/MFAController.php`

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PragmaRX\Google2FALaravel\Google2FA;

class MFAController extends Controller
{
    protected $google2fa;

    public function __construct(Google2FA $google2fa)
    {
        $this->google2fa = $google2fa;
    }

    public function enable(Request $request)
    {
        $user = $request->user();

        // Generate secret key
        $secret = $this->google2fa->generateSecretKey();

        // Store temporarily
        $user->update(['mfa_secret' => encrypt($secret)]);

        // Generate QR code
        $qrCodeUrl = $this->google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );

        return response()->json([
            'success' => true,
            'data' => [
                'secret' => $secret,
                'qr_code_url' => $qrCodeUrl,
            ],
        ]);
    }

    public function verify(Request $request)
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = $request->user();
        $secret = decrypt($user->mfa_secret);

        $valid = $this->google2fa->verifyKey($secret, $request->code);

        if (!$valid) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid code',
            ], 400);
        }

        // Enable MFA
        $user->update(['mfa_enabled' => true]);

        return response()->json([
            'success' => true,
            'message' => '2FA enabled successfully',
        ]);
    }

    public function disable(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid password',
            ], 400);
        }

        $user->update([
            'mfa_enabled' => false,
            'mfa_secret' => null,
        ]);

        return response()->json([
            'success' => true,
            'message' => '2FA disabled successfully',
        ]);
    }
}
```

---

## 5. Security Best Practices

### 5.1 Middleware Stack

**File**: `app/Http/Kernel.php`

```php
protected $middlewareGroups = [
    'api' => [
        'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];

protected $routeMiddleware = [
    'auth' => \App\Http\Middleware\Authenticate::class,
    'auth.sanctum' => \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    'role' => \Spatie\Permission\Middlewares\RoleMiddleware::class,
    'permission' => \Spatie\Permission\Middlewares\PermissionMiddleware::class,
    'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
];
```

### 5.2 Rate Limiting

**File**: `app/Providers/RouteServiceProvider.php`

```php
protected function configureRateLimiting()
{
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });

    RateLimiter::for('login', function (Request $request) {
        return Limit::perMinute(5)->by($request->ip());
    });

    RateLimiter::for('payment-processing', function (Request $request) {
        return Limit::perMinute(10)->by($request->user()->id);
    });
}
```

### 5.3 Security Headers

**File**: `app/Http/Middleware/SecurityHeaders.php`

```php
<?php

namespace App\Http\Middleware;

use Closure;

class SecurityHeaders
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

        return $response;
    }
}
```

---

*This comprehensive authentication and authorization system ensures secure, role-based access control for the College Accounts Admin portal with industry-standard security practices.*
