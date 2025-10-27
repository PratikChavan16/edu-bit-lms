# Bitflow Admin Portal - Authentication & Permissions

**Version**: 2.0  
**Last Updated**: October 25, 2025  
**Portal**: Bitflow Admin (Platform Management)  
**Role**: Bitflow Owner

---

## Authentication

### JWT Token Structure

```json
{
  "sub": "bitflow-owner-user-uuid",
  "email": "owner@bitflow.edu",
  "role": "bitflow_owner",
  "university_id": null,
  "scope": "global",
  "permissions": ["*"],
  "iat": 1698264000,
  "exp": 1698264900,
  "jti": "token-unique-id"
}
```

### Key Differences from Other Portals

| Attribute | Bitflow Owner | Other Roles |
|-----------|---------------|-------------|
| `university_id` | `null` | Specific UUID |
| `scope` | `global` | `university` or `college` |
| `permissions` | `["*"]` (all) | Specific permissions |
| Access Level | Cross-tenant | Single tenant |

### Token Lifecycle

- **Access Token**: 15 minutes expiry
- **Refresh Token**: 7 days expiry  
- **Storage**:
  - Access token: Memory (Zustand store)
  - Refresh token: HttpOnly cookie (secure, sameSite=strict, domain=.bitflow.edu)
- **Rotation**: Refresh token rotates on every use (one-time use tokens)

### Authentication Flow

```
1. Bitflow Owner enters credentials
   ↓
2. POST /api/admin/auth/login
   ↓
3. Backend validates credentials
   - Checks role = 'bitflow_owner'
   - Verifies 2FA (TOTP)
   ↓
4. Generate JWT tokens (RS256 with 4096-bit keys)
   ↓
5. Return access token + refresh token + user profile
   ↓
6. Frontend stores tokens
   ↓
7. All API requests include:
   Authorization: Bearer {access_token}
   ↓
8. Backend middleware validates:
   - Token signature
   - Token not expired
   - Role = 'bitflow_owner'
   - User account is active
   - IP whitelist (if configured)
   ↓
9. When access token expires:
   - Axios interceptor detects 401
   - Calls POST /api/admin/auth/refresh
   - Validates refresh token
   - Issues new access + refresh tokens
   - Retries original request
```

---

## Authorization

### Role: Bitflow Owner

**Identifier**: `bitflow_owner`  
**Level**: 0 (Highest authority)  
**Scope**: `global` (All universities + platform)  
**Description**: The supreme administrator who manages the entire Bitflow LMS platform

---

## Permissions Matrix

### ✅ Complete Access - Bitflow Owner has ALL permissions

| Category | Permissions | Description |
|----------|-------------|-------------|
| **Universities** | `universities.*` | Complete control over all universities |
| | `universities.create` | Create new universities (tenants) |
| | `universities.read` | View all university details |
| | `universities.update` | Edit university information |
| | `universities.delete` | Permanently delete universities |
| | `universities.suspend` | Suspend/unsuspend universities |
| | `universities.configure` | Change storage, rate limits, features |
| **Users** | `users.*` | Global user management across all universities |
| | `users.read_all` | View users from any university |
| | `users.create_admin` | Create university owners |
| | `users.reset_password` | Reset any user's password |
| | `users.lock` | Lock/unlock user accounts |
| | `users.delete` | Delete user accounts |
| | `users.impersonate` | Login as any user (for support) |
| **Billing** | `billing.*` | Complete billing and revenue management |
| | `billing.view_all` | View all invoices and payments |
| | `billing.create_invoice` | Generate invoices |
| | `billing.process_payment` | Process/refund payments |
| | `billing.manage_plans` | Create/edit subscription plans |
| | `billing.apply_discounts` | Apply discounts/coupons |
| **Analytics** | `analytics.*` | Access to all platform analytics |
| | `analytics.view_all` | View aggregated platform metrics |
| | `analytics.view_university` | Drill down to university-level data |
| | `analytics.export` | Export reports (PDF/CSV) |
| **Settings** | `settings.manage_global` | Manage platform-wide settings |
| | `settings.email` | Configure SMTP settings |
| | `settings.sms` | Configure SMS gateway |
| | `settings.payment` | Configure Stripe/payment gateways |
| | `settings.storage` | Configure S3/storage settings |
| | `settings.security` | Configure global security policies |
| | `settings.api` | Manage API keys and rate limits |
| **Audit** | `audit_logs.*` | Complete audit log access |
| | `audit_logs.read` | View all audit logs across platform |
| | `audit_logs.export` | Export audit logs for compliance |
| **Support** | `support.*` | Manage support tickets from universities |
| | `support.view_all` | View all support tickets |
| | `support.reply` | Reply to tickets |
| | `support.assign` | Assign tickets to team members |
| | `support.close` | Close/resolve tickets |
| **System** | `system.*` | System administration and monitoring |
| | `system.view_logs` | Access system error/debug logs |
| | `system.view_health` | Monitor system health metrics |
| | `system.maintenance_mode` | Enable/disable maintenance mode |
| | `system.clear_cache` | Clear Redis cache |
| | `system.run_migrations` | Execute database migrations |
| | `system.backup` | Trigger manual backups |

---

## Row-Level Security (RLS)

### Special Case: Bitflow Owner

**Bitflow Owner BYPASSES row-level security** because they operate at the platform level, not within a single university.

#### Database Queries

```php
// Regular University-Scoped User
$students = Student::where('university_id', auth()->user()->university_id)->get();

// Bitflow Owner (No university_id filter)
if (auth()->user()->role === 'bitflow_owner') {
    $students = Student::all(); // Access ALL students across ALL universities
} else {
    $students = Student::where('university_id', auth()->user()->university_id)->get();
}
```

#### Middleware Implementation

```php
// app/Http/Middleware/EnsureBitflowOwner.php
public function handle($request, Closure $next)
{
    if (auth()->user()->role !== 'bitflow_owner') {
        return response()->json([
            'message' => 'Forbidden. Bitflow Owner role required.'
        ], 403);
    }

    // Optional: IP whitelist check
    if (config('bitflow.owner_ip_whitelist_enabled')) {
        $allowedIPs = config('bitflow.owner_allowed_ips');
        if (!in_array($request->ip(), $allowedIPs)) {
            \Log::warning('Bitflow Owner access from unauthorized IP', [
                'user' => auth()->user()->email,
                'ip' => $request->ip()
            ]);
            return response()->json(['message' => 'Access denied from this IP'], 403);
        }
    }

    return $next($request);
}
```

---

## API Route Protection

### Routes File

```php
// routes/api.php - Bitflow Admin Routes

use App\Http\Middleware\EnsureBitflowOwner;

Route::prefix('admin')->middleware(['auth:sanctum', EnsureBitflowOwner::class])->group(function () {
    
    // Platform Dashboard
    Route::get('/dashboard', [PlatformController::class, 'dashboard']);
    Route::get('/system/health', [PlatformController::class, 'systemHealth']);
    Route::get('/alerts', [PlatformController::class, 'alerts']);
    
    // University Management
    Route::apiResource('universities', UniversityController::class);
    Route::patch('universities/{id}/status', [UniversityController::class, 'changeStatus']);
    Route::get('universities/{id}/usage', [UniversityController::class, 'usage']);
    Route::get('universities/{id}/activities', [UniversityController::class, 'activities']);
    
    // Global User Management
    Route::get('users', [GlobalUserController::class, 'index']);
    Route::post('users/{id}/reset-password', [GlobalUserController::class, 'resetPassword']);
    Route::patch('users/{id}/status', [GlobalUserController::class, 'changeStatus']);
    Route::delete('users/{id}', [GlobalUserController::class, 'destroy']);
    
    // Analytics
    Route::get('analytics', [AnalyticsController::class, 'index']);
    Route::get('analytics/export', [AnalyticsController::class, 'export']);
    
    // Billing
    Route::get('billing', [BillingController::class, 'index']);
    Route::get('invoices/{id}/pdf', [BillingController::class, 'downloadInvoice']);
    Route::post('invoices/{id}/retry', [BillingController::class, 'retryPayment']);
    
    // Settings
    Route::get('settings', [GlobalSettingsController::class, 'index']);
    Route::patch('settings/general', [GlobalSettingsController::class, 'updateGeneral']);
    Route::patch('settings/email', [GlobalSettingsController::class, 'updateEmail']);
    Route::patch('settings/sms', [GlobalSettingsController::class, 'updateSMS']);
    Route::patch('settings/payment', [GlobalSettingsController::class, 'updatePayment']);
    Route::patch('settings/storage', [GlobalSettingsController::class, 'updateStorage']);
    Route::patch('settings/security', [GlobalSettingsController::class, 'updateSecurity']);
    Route::patch('settings/api', [GlobalSettingsController::class, 'updateAPI']);
    
    // Audit Logs
    Route::get('audit-logs', [AuditLogController::class, 'index']);
    Route::get('audit-logs/export', [AuditLogController::class, 'export']);
    
    // Support Tickets
    Route::get('support/tickets', [SupportTicketController::class, 'index']);
    Route::get('support/tickets/{id}', [SupportTicketController::class, 'show']);
    Route::post('support/tickets/{id}/reply', [SupportTicketController::class, 'reply']);
    Route::patch('support/tickets/{id}/status', [SupportTicketController::class, 'updateStatus']);
    
    // System Logs
    Route::get('system/logs', [SystemLogController::class, 'index']);
});
```

---

## Frontend Authorization

### Route Guards

```typescript
// bitflow-frontend/apps/bitflow-admin/middleware/auth.ts

import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const payload = JSON.parse(atob(token.value.split('.')[1]));
    
    // Verify role
    if (payload.role !== 'bitflow_owner') {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }
    
    // Verify not expired
    if (payload.exp * 1000 < Date.now()) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!login|forbidden|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

### Permission Checks in Components

```typescript
// hooks/useAuth.ts
export function useAuth() {
  const { user, token } = useAuthStore();
  
  const isBitflowOwner = user?.role === 'bitflow_owner';
  
  const hasPermission = (permission: string) => {
    if (isBitflowOwner) {
      return true; // Bitflow Owner has all permissions
    }
    return user?.permissions?.includes(permission) ?? false;
  };
  
  const canAccessUniversity = (universityId: string) => {
    return isBitflowOwner; // Always true for Bitflow Owner
  };
  
  return {
    user,
    token,
    isBitflowOwner,
    hasPermission,
    canAccessUniversity,
  };
}

// Usage in components
function UniversityActionsMenu({ universityId }: Props) {
  const { isBitflowOwner, hasPermission } = useAuth();
  
  return (
    <DropdownMenu>
      {isBitflowOwner && (
        <>
          <MenuItem onClick={() => editUniversity(universityId)}>
            Edit University
          </MenuItem>
          <MenuItem onClick={() => suspendUniversity(universityId)}>
            Suspend University
          </MenuItem>
          <MenuItem onClick={() => deleteUniversity(universityId)}>
            Delete University
          </MenuItem>
        </>
      )}
    </DropdownMenu>
  );
}
```

---

## Multi-Factor Authentication (MFA)

### Required for Bitflow Owner

**MFA is MANDATORY for Bitflow Owner role** due to the elevated access level.

#### MFA Flow

```
1. User enters email + password
   ↓
2. Backend validates credentials
   ↓
3. If valid, return: { requires_mfa: true, temp_token: "..." }
   ↓
4. Frontend shows TOTP input
   ↓
5. User enters 6-digit code from authenticator app
   ↓
6. POST /api/admin/auth/verify-mfa { temp_token, totp_code }
   ↓
7. Backend validates TOTP code
   ↓
8. If valid, return full JWT tokens
   ↓
9. User is authenticated
```

#### TOTP Setup

```typescript
// When setting up MFA
const setupMFA = async () => {
  const response = await axios.post('/api/admin/auth/mfa/setup');
  // Returns: { secret, qr_code_url }
  
  // Show QR code to user
  // User scans with Google Authenticator / Authy
  // User enters first code to verify setup
  
  await axios.post('/api/admin/auth/mfa/verify-setup', {
    secret: response.data.secret,
    code: userEnteredCode
  });
};
```

---

## Session Management

### Inactivity Timeout

- **Bitflow Owner sessions**: 30 minutes inactivity timeout
- After timeout: Auto-logout and redirect to login
- Warning shown 5 minutes before timeout

```typescript
// hooks/useIdleTimeout.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useIdleTimeout(timeoutMinutes: number = 30) {
  const router = useRouter();
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        // Log out user
        localStorage.clear();
        router.push('/login?reason=timeout');
      }, timeoutMinutes * 60 * 1000);
    };
    
    // Reset on user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetTimeout);
    });
    
    resetTimeout(); // Initial setup
    
    return () => {
      clearTimeout(timeout);
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout);
      });
    };
  }, [timeoutMinutes, router]);
}
```

---

## IP Whitelisting (Optional)

For additional security, Bitflow Owner access can be restricted to specific IP addresses.

### Configuration

```env
# .env
BITFLOW_OWNER_IP_WHITELIST_ENABLED=true
BITFLOW_OWNER_ALLOWED_IPS="203.0.113.1,203.0.113.2,203.0.113.0/24"
```

### Middleware Check

```php
// app/Http/Middleware/CheckIPWhitelist.php
public function handle($request, Closure $next)
{
    if (!auth()->check() || auth()->user()->role !== 'bitflow_owner') {
        return $next($request);
    }
    
    if (!config('bitflow.owner_ip_whitelist_enabled')) {
        return $next($request);
    }
    
    $allowedIPs = config('bitflow.owner_allowed_ips');
    $clientIP = $request->ip();
    
    foreach ($allowedIPs as $allowedIP) {
        if (str_contains($allowedIP, '/')) {
            // CIDR notation
            if ($this->ipInCIDR($clientIP, $allowedIP)) {
                return $next($request);
            }
        } else {
            // Exact match
            if ($clientIP === $allowedIP) {
                return $next($request);
            }
        }
    }
    
    \Log::warning('Bitflow Owner access denied - IP not whitelisted', [
        'user' => auth()->user()->email,
        'ip' => $clientIP
    ]);
    
    return response()->json([
        'message' => 'Access denied from this IP address'
    ], 403);
}
```

---

## Audit Logging

**Every action by Bitflow Owner is logged** for compliance and security.

### What Gets Logged

- Login/logout events
- University creation/modification/deletion
- User access (viewing, resetting passwords, locking accounts)
- Settings changes
- Billing operations
- System configuration changes

### Log Format

```json
{
  "id": "uuid",
  "timestamp": "2025-10-25T10:30:00Z",
  "user_id": "bitflow-owner-uuid",
  "user_email": "owner@bitflow.edu",
  "role": "bitflow_owner",
  "action": "UPDATE",
  "resource_type": "University",
  "resource_id": "university-uuid",
  "changes": {
    "storage_quota_gb": {
      "old": 500,
      "new": 1000
    }
  },
  "ip_address": "203.0.113.1",
  "user_agent": "Mozilla/5.0...",
  "request_id": "req-uuid"
}
```

### Implementation

```php
// app/Observers/UniversityObserver.php
public function updated(University $university)
{
    AuditLog::create([
        'user_id' => auth()->id(),
        'user_email' => auth()->user()->email,
        'role' => auth()->user()->role,
        'action' => 'UPDATE',
        'resource_type' => 'University',
        'resource_id' => $university->id,
        'changes' => $university->getChanges(),
        'ip_address' => request()->ip(),
        'user_agent' => request()->userAgent(),
    ]);
}
```

---

## Security Best Practices

### 1. Principle of Least Privilege

- Only grant Bitflow Owner role to **absolutely necessary personnel**
- Typically 1-3 people maximum
- Regular access reviews

### 2. Strong Password Requirements

- Minimum 16 characters
- Mix of uppercase, lowercase, numbers, symbols
- Cannot reuse last 5 passwords
- Must change every 90 days

### 3. MFA Always Enabled

- Cannot be disabled for Bitflow Owner
- Backup codes generated and stored securely

### 4. Session Security

- Tokens rotated on refresh
- Sessions invalidated on password change
- Logout from all devices option

### 5. Monitoring & Alerts

- Alert on failed login attempts (>3 in 10 minutes)
- Alert on login from new IP/device
- Alert on high-risk actions (delete university, settings change)

---

## Emergency Access Revocation

### Immediate Actions if Compromise Suspected

```php
// Artisan command: php artisan bitflow:revoke-owner-access {user_id}

// 1. Invalidate all tokens
DB::table('personal_access_tokens')
    ->where('tokenable_id', $userId)
    ->delete();

// 2. Lock account
User::find($userId)->update(['status' => 'locked']);

// 3. Log incident
AuditLog::create([
    'action' => 'EMERGENCY_ACCESS_REVOCATION',
    'resource_type' => 'User',
    'resource_id' => $userId,
    'details' => 'Bitflow Owner access revoked due to suspected compromise'
]);

// 4. Send alert to security team
Mail::to('security@bitflow.edu')->send(new SecurityAlertMail($userId));
```

---

**End of Authentication & Permissions Documentation**
