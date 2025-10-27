# Student Portal - Authentication & Permissions

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Authentication

### JWT Token Structure

```json
{
  "sub": "user-uuid",
  "email": "john.doe@student.edu",
  "role": "student",
  "student_id": "student-uuid",
  "university_id": "university-uuid",
  "college_id": "college-uuid",
  "iat": 1698264000,
  "exp": 1698264900
}
```

### Token Lifecycle
- **Access Token**: 15 minutes expiry
- **Refresh Token**: 7 days expiry
- **Storage**: 
  - Access token: Memory (Zustand store)
  - Refresh token: HttpOnly cookie (secure, sameSite=strict)

### Authentication Flow

```
1. Student enters credentials
   ↓
2. POST /api/auth/login
   ↓
3. Backend validates credentials
   ↓
4. Generate JWT tokens (RS256 algorithm)
   ↓
5. Return access token + refresh token
   ↓
6. Frontend stores tokens
   ↓
7. All API requests include: Authorization: Bearer {access_token}
   ↓
8. When access token expires (15 min):
   - Axios interceptor detects 401
   - Automatically calls POST /api/auth/refresh
   - Updates access token
   - Retries original request
```

---

## Authorization

### Role: Student

**Identifier**: `student`  
**Level**: 8  
**Scope**: `individual` (own data only)

### Permissions Matrix

| Resource | Permission | Allowed? | Notes |
|----------|-----------|----------|-------|
| **Profile** | `students.view_own` | ✅ Yes | View own profile only |
| **Profile** | `students.update_own` | ✅ Yes | Update own profile (limited fields) |
| **Profile** | `students.view_all` | ❌ No | Cannot view other students |
| **Courses** | `courses.read` | ✅ Yes | View enrolled courses |
| **Courses** | `courses.create` | ❌ No | Cannot create courses |
| **Attendance** | `attendance.view_own` | ✅ Yes | View own attendance |
| **Attendance** | `attendance.mark` | ❌ No | Cannot mark attendance |
| **Grades** | `grades.view_own` | ✅ Yes | View own grades |
| **Grades** | `grades.create` | ❌ No | Cannot grade assignments |
| **Assignments** | `assignments.read` | ✅ Yes | View assignments for enrolled courses |
| **Assignments** | `assignments.submit` | ✅ Yes | Submit own solutions |
| **Assignments** | `assignments.create` | ❌ No | Cannot create assignments |
| **Fees** | `fees.view_own` | ✅ Yes | View own fee records |
| **Fees** | `fees.pay_own` | ✅ Yes | Pay own fees |
| **Fees** | `fees.view_all` | ❌ No | Cannot view others' fees |
| **Timetable** | `timetable.view_own` | ✅ Yes | View own timetable |
| **Notifications** | `notifications.read_own` | ✅ Yes | View own notifications |
| **Support** | `tickets.create` | ✅ Yes | Raise support tickets |

---

## Row-Level Security (RLS)

### Database-Level Enforcement

Students can ONLY access data where:
```sql
-- Student profile
students.user_id = {authenticated_user_id}

-- Enrollments
enrollments.student_id IN (
  SELECT id FROM students WHERE user_id = {authenticated_user_id}
)

-- Attendance
attendance.student_id IN (
  SELECT id FROM students WHERE user_id = {authenticated_user_id}
)

-- Grades
grades.student_id IN (
  SELECT id FROM students WHERE user_id = {authenticated_user_id}
)

-- Submissions
submissions.student_id IN (
  SELECT id FROM students WHERE user_id = {authenticated_user_id}
)

-- Invoices & Payments
invoices.student_id IN (
  SELECT id FROM students WHERE user_id = {authenticated_user_id}
)
```

### Laravel Policy Enforcement

```php
// app/Policies/StudentPolicy.php
public function view(User $user, Student $student): bool
{
    if ($user->hasRole('student')) {
        return $student->user_id === $user->id;
    }
    return $user->hasPermissionTo('students.read');
}

public function update(User $user, Student $student): bool
{
    if ($user->hasRole('student')) {
        return $student->user_id === $user->id 
            && $this->canUpdateFields($request->only([...]));
    }
    return $user->hasPermissionTo('students.update');
}

private function canUpdateFields(array $fields): bool
{
    // Students can only update certain fields
    $allowedFields = ['phone', 'blood_group', 'address', 'guardian_name', 'guardian_phone'];
    foreach ($fields as $field => $value) {
        if (!in_array($field, $allowedFields)) {
            return false;
        }
    }
    return true;
}
```

---

## Multi-Tenancy Isolation

### University-Level Isolation

All queries automatically scoped by `university_id`:

```php
// Global scope applied to all models
protected static function booted()
{
    static::addGlobalScope('university', function (Builder $builder) {
        if (auth()->check()) {
            $builder->where('university_id', auth()->user()->university_id);
        }
    });
}
```

### Validation

```php
// Before any query
if ($student->university_id !== auth()->user()->university_id) {
    abort(403, 'Unauthorized access');
}
```

---

## Frontend Authorization

### Route Protection

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Verify JWT and check role
  const decoded = verifyToken(token.value);
  
  if (decoded.role !== 'student') {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/courses/:path*',
    '/attendance/:path*',
    '/grades/:path*',
    '/assignments/:path*',
    '/fees/:path*',
    '/profile/:path*',
  ],
};
```

### Component-Level Authorization

```typescript
// components/shared/ProtectedComponent.tsx
import { useAuth } from '@/lib/hooks/useAuth';

interface ProtectedComponentProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedComponent({ 
  permission, 
  children, 
  fallback 
}: ProtectedComponentProps) {
  const { hasPermission } = useAuth();
  
  if (!hasPermission(permission)) {
    return fallback || null;
  }
  
  return <>{children}</>;
}

// Usage
<ProtectedComponent permission="assignments.submit">
  <button>Submit Assignment</button>
</ProtectedComponent>
```

---

## Session Management

### Concurrent Sessions
- **Limit**: 3 active sessions per student
- **Behavior**: When 4th session is created, oldest session is invalidated
- **Storage**: Redis (session tokens)

```php
// app/Services/SessionService.php
public function createSession(User $user, string $token): void
{
    $key = "user:{$user->id}:sessions";
    
    // Add new session
    Redis::zadd($key, time(), $token);
    
    // Keep only latest 3 sessions
    $count = Redis::zcard($key);
    if ($count > 3) {
        Redis::zpopmin($key, $count - 3);
    }
    
    // Set expiry on key
    Redis::expire($key, 7 * 24 * 60 * 60); // 7 days
}

public function isSessionValid(User $user, string $token): bool
{
    $key = "user:{$user->id}:sessions";
    return Redis::zscore($key, $token) !== null;
}
```

---

## Password Policy

### Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (optional but recommended)
- Cannot be same as last 3 passwords
- Must be changed every 90 days (university configurable)

### Validation (Zod)

```typescript
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .refine(
    async (password) => {
      // Check against previous passwords (API call)
      const response = await apiClient.post('/auth/check-password-history', {
        password,
      });
      return !response.data.used_before;
    },
    { message: 'Password was used recently. Please choose a different password.' }
  );
```

---

## Multi-Factor Authentication (MFA)

### Supported Methods
1. **TOTP (Time-based One-Time Password)** - Google Authenticator, Authy
2. **SMS OTP** - 6-digit code via SMS
3. **Email OTP** - 6-digit code via email

### MFA Enrollment (Optional)

```
1. Student enables MFA in profile settings
   ↓
2. Choose method (TOTP/SMS/Email)
   ↓
3. For TOTP:
   - Generate secret key
   - Display QR code
   - Student scans with authenticator app
   - Verify with first code
   ↓
4. Store MFA method in database
   ↓
5. On next login:
   - Enter email + password
   - If correct, prompt for MFA code
   - Verify MFA code
   - Grant access
```

### Implementation

```php
// app/Services/MFAService.php
use PragmaRX\Google2FA\Google2FA;

public function generateSecret(): string
{
    $google2fa = new Google2FA();
    return $google2fa->generateSecretKey();
}

public function getQRCodeUrl(User $user, string $secret): string
{
    $google2fa = new Google2FA();
    return $google2fa->getQRCodeUrl(
        config('app.name'),
        $user->email,
        $secret
    );
}

public function verifyCode(User $user, string $code): bool
{
    $google2fa = new Google2FA();
    return $google2fa->verifyKey($user->mfa_secret, $code);
}
```

---

## API Key Authentication (Alternative)

For mobile apps or third-party integrations:

### Generate API Key
```
POST /api/auth/api-keys
Authorization: Bearer {access_token}

Response:
{
  "data": {
    "id": "uuid",
    "name": "My Mobile App",
    "key": "bfl_sk_xxxxxxxxxxxxx",
    "created_at": "2025-10-25T14:30:00Z",
    "expires_at": "2026-10-25T14:30:00Z"
  }
}
```

### Use API Key
```
GET /api/students/me
Authorization: ApiKey bfl_sk_xxxxxxxxxxxxx
```

---

## Audit Logging

All authentication and authorization events are logged:

### Events Logged
- `auth.login_success`
- `auth.login_failed`
- `auth.logout`
- `auth.token_refreshed`
- `auth.password_changed`
- `auth.mfa_enabled`
- `auth.mfa_disabled`
- `auth.unauthorized_access_attempt`

### Audit Log Entry
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "action": "auth.login_success",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "metadata": {
    "method": "email_password",
    "mfa_used": true
  },
  "created_at": "2025-10-25T14:30:00Z"
}
```

---

## Security Best Practices

### 1. Token Security
- ✅ Use RS256 (asymmetric) algorithm for JWT
- ✅ Short-lived access tokens (15 min)
- ✅ Refresh tokens in HttpOnly cookies
- ✅ Rotate refresh tokens on each use
- ✅ Implement token blacklist for logout

### 2. Password Security
- ✅ Hash passwords with bcrypt (cost factor: 12)
- ✅ Enforce strong password policy
- ✅ Implement password history
- ✅ Rate limit login attempts (5 attempts/15 minutes)
- ✅ Account lockout after 5 failed attempts (15 min)

### 3. Data Access
- ✅ Enforce row-level security
- ✅ Use Laravel policies for authorization
- ✅ Validate university_id on every request
- ✅ Never expose other students' data

### 4. Network Security
- ✅ HTTPS only (TLS 1.3)
- ✅ CORS configured for frontend domains only
- ✅ CSRF protection enabled
- ✅ Rate limiting on all endpoints

### 5. Monitoring
- ✅ Log all authentication events
- ✅ Alert on suspicious activity (e.g., login from new location)
- ✅ Monitor for brute force attacks
- ✅ Track unauthorized access attempts

---

**🔐 Robust authentication and authorization ensure student data security and privacy.**
