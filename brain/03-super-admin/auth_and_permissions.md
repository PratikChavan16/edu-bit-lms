# Super Admin Portal - Authentication & Permissions

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Overview

The Super Admin Portal uses JWT-based authentication with role-based access control (RBAC). Super Admins have operational access across the university but cannot perform strategic or financial operations.

---

## Authentication Flow

### 1. Login Process

```
User (Super Admin)
  │
  ├─→ POST /api/auth/login
  │     Body: { email, password, otp? }
  │
  ├─→ Backend validates credentials
  │     • Check user exists
  │     • Verify password (bcrypt)
  │     • Validate role = 'super_admin'
  │     • Check university_id matches tenant
  │     • Verify 2FA if enabled
  │
  ├─→ Generate JWT tokens
  │     • Access Token (RS256, 60 min)
  │     • Refresh Token (30 days)
  │
  └─→ Return tokens + user data
        {
          access_token: "eyJ...",
          refresh_token: "eyJ...",
          user: { id, name, email, role },
          permissions: [...]
        }
```

### 2. JWT Structure

**Access Token Payload**:
```json
{
  "sub": 123,                      // User ID
  "role": "super_admin",
  "university_id": 1,
  "permissions": [
    "academic.manage",
    "courses.manage",
    "timetable.manage",
    "exams.manage",
    "users.manage"
  ],
  "exp": 1730203200,               // Expiry (60 min)
  "iat": 1730199600                // Issued at
}
```

**Refresh Token Payload**:
```json
{
  "sub": 123,
  "type": "refresh",
  "exp": 1732791600               // Expiry (30 days)
}
```

### 3. Token Storage

**Frontend (Next.js)**:
- Access Token: Memory (React state/Zustand)
- Refresh Token: HttpOnly cookie (secure, sameSite)
- Never store in localStorage (XSS risk)

**Backend (Laravel)**:
- Public/Private key pair for RS256
- Keys stored in `.env` or AWS Secrets Manager
- Token blacklist in Redis (logout/revoke)

---

## Multi-Tenancy Isolation

### University Scoping

Super Admins are scoped to a single university. All queries automatically filter by `university_id`.

**Global Scope (Laravel)**:
```php
// app/Models/UniversityScopedModel.php
trait UniversityScoped {
    protected static function booted() {
        static::addGlobalScope('university', function (Builder $query) {
            if (auth()->check()) {
                $query->where('university_id', auth()->user()->university_id);
            }
        });
    }
}

// Usage
class Course extends Model {
    use UniversityScoped;
}

// Automatic filtering
Course::all(); // Only returns courses for super admin's university
```

**Database Row-Level Security (PostgreSQL)**:
```sql
-- Enable RLS on courses table
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Policy: Super admins can only see their university's courses
CREATE POLICY courses_university_isolation ON courses
  USING (university_id = current_setting('app.university_id')::int);
```

---

## Role-Based Access Control (RBAC)

### Super Admin Permissions

| Category | Permission | Description |
|----------|-----------|-------------|
| **Academic Calendar** | `academic.manage` | Create/edit academic years, semesters, holidays |
| **Courses** | `courses.manage` | CRUD operations on course catalog |
| **Courses** | `courses.assign-faculty` | Map faculty to courses |
| **Curriculum** | `curriculum.manage` | Map courses to programs/semesters |
| **Timetable** | `timetable.generate` | Auto-generate timetables |
| **Timetable** | `timetable.edit` | Manual timetable editing |
| **Timetable** | `timetable.publish` | Publish timetables to faculty/students |
| **Exams** | `exams.schedule` | Create exam schedules |
| **Exams** | `exams.allocate-halls` | Assign exam halls |
| **Exams** | `exams.assign-invigilators` | Assign faculty as invigilators |
| **Exams** | `exams.publish` | Publish exam schedules |
| **Users** | `users.create` | Create new users (all roles except owner) |
| **Users** | `users.edit` | Update user details |
| **Users** | `users.deactivate` | Deactivate user accounts |
| **Users** | `users.reset-password` | Reset user passwords |
| **Reports** | `reports.operational` | View operational reports |
| **Settings** | `settings.operational` | Configure templates, notifications |
| **Communication** | `announcements.create` | Send announcements |

### Denied Permissions

Super Admins **CANNOT**:
- ❌ Create/delete colleges (University Owner only)
- ❌ Approve budgets or expenses (Financial operations)
- ❌ Set fee structures (Financial operations)
- ❌ Create/delete programs (Strategic decision)
- ❌ Access financial reports (University Owner only)
- ❌ Modify subscription plans (Bitflow Admin only)

---

## Permission Checking

### Backend (Laravel)

**Middleware**:
```php
// app/Http/Middleware/CheckPermission.php
public function handle($request, Closure $next, $permission) {
    if (!auth()->user()->hasPermission($permission)) {
        return response()->json([
            'message' => 'Unauthorized'
        ], 403);
    }
    return $next($request);
}

// Route usage
Route::post('/courses', [CourseController::class, 'store'])
    ->middleware(['auth:api', 'permission:courses.manage']);
```

**Permission Check in Code**:
```php
// Controller
public function store(Request $request) {
    $this->authorize('courses.manage');
    
    $course = Course::create([
        'university_id' => auth()->user()->university_id,
        // ...
    ]);
}
```

### Frontend (Next.js)

**Permission Context**:
```typescript
// hooks/usePermissions.ts
export const usePermissions = () => {
  const user = useAuthStore(state => state.user);
  
  const can = (permission: string): boolean => {
    return user?.permissions?.includes(permission) || false;
  };
  
  return { can };
};

// Usage in component
const { can } = usePermissions();

{can('courses.manage') && (
  <Button onClick={createCourse}>Add Course</Button>
)}
```

---

## Two-Factor Authentication (2FA)

### Setup Flow

```
1. User enables 2FA in settings
   ├─→ POST /api/auth/2fa/enable
   ├─→ Backend generates TOTP secret
   ├─→ Return QR code (otpauth://...)
   └─→ User scans with authenticator app

2. User verifies setup
   ├─→ POST /api/auth/2fa/verify
   │     Body: { otp: "123456" }
   ├─→ Backend validates OTP
   └─→ Mark 2FA as verified

3. Future logins require OTP
   ├─→ POST /api/auth/login
   │     Body: { email, password }
   ├─→ Backend returns: { requires_2fa: true }
   ├─→ POST /api/auth/login/2fa
   │     Body: { email, password, otp: "123456" }
   └─→ Return full tokens if OTP valid
```

### Backup Codes

- Generate 10 backup codes on 2FA enable
- Store hashed in database
- Each code single-use
- User downloads/prints codes

---

## API Request Authorization

### Request Headers

```http
GET /api/super-admin/courses
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
X-University-ID: 1
```

### Validation Steps

1. **Token Validation**:
   - Verify JWT signature (RS256)
   - Check expiry
   - Validate issuer/audience

2. **Role Check**:
   - Extract role from token
   - Verify role = 'super_admin'

3. **University Check**:
   - Extract university_id from token
   - Match with X-University-ID header
   - Match with requested resource

4. **Permission Check**:
   - Extract permissions from token
   - Verify required permission exists

5. **Resource Authorization**:
   - Ensure resource belongs to user's university
   - Check status (active/inactive)

---

## Session Management

### Token Refresh

```typescript
// Refresh before expiry (5 min buffer)
if (tokenExpiresIn < 5 * 60) {
  const newTokens = await refreshTokens();
  setAccessToken(newTokens.access_token);
}
```

### Logout

```
Client
  │
  ├─→ POST /api/auth/logout
  │     Headers: { Authorization: Bearer <token> }
  │
  ├─→ Backend
  │     • Extract user ID from token
  │     • Add token to blacklist (Redis)
  │     • Delete refresh token from cookies
  │
  └─→ Client
        • Clear access token from memory
        • Clear cookies
        • Redirect to /login
```

### Token Blacklist (Redis)

```php
// Add to blacklist
Redis::setex("blacklist:{$tokenId}", 3600, true);

// Check on each request
if (Redis::exists("blacklist:{$tokenId}")) {
    throw new UnauthorizedException();
}
```

---

## Security Best Practices

### 1. Password Security
- **Hashing**: bcrypt with cost factor 12
- **Complexity**: Min 8 chars, uppercase, lowercase, number, special char
- **Reset**: Signed URL with 1-hour expiry
- **Failed Attempts**: Lock account after 5 failed logins (15 min)

### 2. SQL Injection Prevention
- **Prepared Statements**: Always use Eloquent ORM or parameterized queries
- **Input Validation**: Validate all inputs against schema
- **Global Scopes**: Automatic university_id filtering

### 3. XSS Prevention
- **Output Encoding**: Escape all user inputs in UI
- **CSP Headers**: Content-Security-Policy: default-src 'self'
- **HttpOnly Cookies**: Prevent JavaScript access to refresh token

### 4. CSRF Protection
- **CSRF Tokens**: Laravel Sanctum CSRF protection
- **SameSite Cookies**: SameSite=Strict for refresh tokens

### 5. Rate Limiting
- **Login**: 5 attempts per 15 minutes per IP
- **API**: 60 requests per minute per user
- **Password Reset**: 3 requests per hour per email

---

## Audit Logging

### What to Log

Every Super Admin action is logged:

```php
Log::channel('audit')->info('Course created', [
    'user_id' => auth()->id(),
    'university_id' => auth()->user()->university_id,
    'action' => 'courses.create',
    'resource_type' => 'Course',
    'resource_id' => $course->id,
    'changes' => $course->toArray(),
    'ip_address' => $request->ip(),
    'user_agent' => $request->userAgent()
]);
```

### Log Retention

- **Activity Logs**: 90 days in database
- **Audit Logs**: 1 year in database, then archive to S3
- **Failed Login Attempts**: 30 days

---

## API Key Authentication (Optional)

For system integrations (e.g., external timetable service):

```http
POST /api/super-admin/timetables/generate
X-API-Key: sk_live_abc123...
```

**API Key Management**:
- Generate via `/api/auth/api-keys`
- Scope to specific permissions
- Set expiry date
- Revoke anytime
- Rate limit: 600 requests/hour

---

## Permission Matrix (Super Admin vs Others)

| Action | Super Admin | University Owner | Principal | Faculty |
|--------|-------------|------------------|-----------|---------|
| Create Academic Year | ✅ | ❌ | ❌ | ❌ |
| Create Course | ✅ | ❌ | ❌ | ❌ |
| Generate Timetable | ✅ | ❌ | View only | View only |
| Schedule Exam | ✅ | ❌ | View college | View own courses |
| Create Faculty User | ✅ | ✅ | View college | ❌ |
| Create Student User | ✅ | ✅ | ✅ | ❌ |
| View Financial Reports | ❌ | ✅ | College only | ❌ |
| Approve Budgets | ❌ | ✅ | Request only | ❌ |

---

## Compliance

### GDPR
- User data encrypted at rest
- Right to be forgotten (anonymize data)
- Data export API

### FERPA
- Student data access restricted by role
- Audit trail for all access

### SOC 2
- Annual security audits
- Encryption in transit (TLS 1.3)
- Incident response plan

---

**Authentication & Authorization Complete!**
