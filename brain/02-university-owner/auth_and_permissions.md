# University Owner Portal - Authentication & Permissions

**Version**: 2.0  
**Last Updated**: October 25, 2025  
**Portal**: University Owner Portal  
**Role**: University Owner

---

## Authentication

### JWT Token Structure

```json
{
  "sub": "university-owner-user-uuid",
  "email": "owner@mit.edu",
  "role": "university_owner",
  "university_id": "mit-university-uuid",
  "scope": "university",
  "permissions": [
    "colleges.*",
    "programs.*",
    "faculty.*",
    "students.*",
    "admissions.*",
    "financial.*",
    "reports.*"
  ],
  "iat": 1698264000,
  "exp": 1698267600,
  "jti": "token-unique-id"
}
```

### Key Characteristics

| Attribute | Value | Purpose |
|-----------|-------|---------|
| `university_id` | Specific UUID | Scopes all queries to this university |
| `scope` | `university` | Restricts access to university-level operations |
| `permissions` | University-wide permissions | Full control within assigned university |
| Access Level | Single university, all colleges | Cannot access other universities |

### Token Lifecycle

- **Access Token**: 60 minutes expiry
- **Refresh Token**: 30 days expiry
- **Storage**:
  - Access token: Memory (Zustand store)
  - Refresh token: HttpOnly cookie (secure, sameSite=strict)
- **Rotation**: Refresh token rotates on every use

### Authentication Flow

```
1. University Owner enters credentials at {university-slug}.bitflow.edu:3002
   ↓
2. POST /api/owner/auth/login
   Body: { email, password, otp? }
   ↓
3. Backend validates:
   - User exists
   - Role = 'university_owner'
   - Password correct (bcrypt)
   - 2FA (if enabled)
   - Account status = 'active'
   - University status = 'active'
   ↓
4. Generate JWT tokens (RS256 algorithm)
   - Include university_id in token payload
   - Set permissions based on role
   ↓
5. Return tokens + user profile + university info
   ↓
6. Frontend stores:
   - Access token in Zustand store
   - Refresh token in HttpOnly cookie
   - User profile in localStorage
   ↓
7. All subsequent API requests include:
   Authorization: Bearer {access_token}
   ↓
8. Backend middleware (EnsureUniversityOwner) validates:
   - Token signature valid
   - Token not expired
   - Role = 'university_owner'
   - university_id matches authenticated user
   - User account active
   - University subscription active
   ↓
9. Database queries auto-scoped:
   - WHERE university_id = {token.university_id}
   - Global scope applied to all models
   ↓
10. On token expiry:
    - Axios interceptor detects 401
    - POST /api/owner/auth/refresh
    - Issues new tokens
    - Retries original request
```

---

## Multi-Factor Authentication (2FA)

### Configuration

- **Status**: Optional (recommended for University Owners)
- **Method**: TOTP (Time-based One-Time Password)
- **Apps Supported**: Google Authenticator, Authy, Microsoft Authenticator
- **Backup Codes**: 10 single-use codes generated on 2FA setup

### Enabling 2FA

```php
// POST /api/owner/auth/2fa/enable
public function enable2FA(Request $request)
{
    $user = $request->user();
    $google2fa = new Google2FA();
    
    // Generate secret
    $secret = $google2fa->generateSecretKey();
    
    // Save encrypted secret
    $user->update([
        'mfa_secret' => encrypt($secret),
    ]);
    
    // Generate QR code
    $qrCodeUrl = $google2fa->getQRCodeUrl(
        'Bitflow LMS - ' . $user->university->name,
        $user->email,
        $secret
    );
    
    // Generate backup codes
    $backupCodes = [];
    for ($i = 0; $i < 10; $i++) {
        $backupCodes[] = Str::random(8);
    }
    
    $user->update([
        'mfa_backup_codes' => encrypt(json_encode($backupCodes)),
    ]);
    
    return response()->json([
        'secret' => $secret,
        'qr_code_url' => $qrCodeUrl,
        'backup_codes' => $backupCodes,
    ]);
}
```

### Login with 2FA

```php
// POST /api/owner/auth/login
public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
        'otp' => 'sometimes|string|size:6',
    ]);
    
    $user = User::where('email', $request->email)
        ->where('role', 'university_owner')
        ->first();
    
    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['error' => 'Invalid credentials'], 401);
    }
    
    // Check if 2FA is enabled
    if ($user->mfa_enabled) {
        if (!$request->has('otp')) {
            return response()->json(['requires_2fa' => true], 200);
        }
        
        $google2fa = new Google2FA();
        $secret = decrypt($user->mfa_secret);
        
        if (!$google2fa->verifyKey($secret, $request->otp)) {
            return response()->json(['error' => 'Invalid OTP'], 401);
        }
    }
    
    // Generate tokens
    $token = $user->createToken('auth_token')->plainTextToken;
    
    return response()->json([
        'access_token' => $token,
        'user' => $user,
        'university' => $user->university,
    ]);
}
```

---

## Authorization & Permissions

### Permission Structure

University Owner has full permissions within their university:

```php
// Permissions granted to university_owner role
$permissions = [
    // Colleges
    'colleges.create',
    'colleges.read',
    'colleges.update',
    'colleges.delete',
    'colleges.assign_principal',
    
    // Programs
    'programs.create',
    'programs.read',
    'programs.update',
    'programs.delete',
    'programs.manage_curriculum',
    
    // Faculty
    'faculty.create',
    'faculty.read',
    'faculty.update',
    'faculty.delete',
    'faculty.assign',
    'faculty.approve_leave',
    
    // Students
    'students.read',
    'students.update',
    'students.transfer',
    'students.bulk_import',
    
    // Admissions
    'admissions.configure',
    'admissions.view_applications',
    'admissions.approve_merit_list',
    'admissions.manage_tests',
    
    // Financial
    'finance.view_dashboard',
    'finance.configure_fees',
    'finance.view_reports',
    'finance.approve_expenses',
    'finance.manage_scholarships',
    
    // Reports
    'reports.view_all',
    'reports.export',
    
    // Settings
    'settings.update_profile',
    'settings.configure_calendar',
    'settings.manage_users',
];
```

### Middleware: EnsureUniversityOwner

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUniversityOwner
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        
        // Check role
        if ($user->role !== 'university_owner') {
            return response()->json([
                'error' => 'Unauthorized. University Owner access required.'
            ], 403);
        }
        
        // Check university ownership
        if (!$user->university_id) {
            return response()->json([
                'error' => 'No university assigned to this account.'
            ], 403);
        }
        
        // Check university status
        $university = $user->university;
        if ($university->status !== 'active') {
            return response()->json([
                'error' => 'University is not active.',
                'university_status' => $university->status
            ], 403);
        }
        
        // Check subscription status
        if ($university->subscription && $university->subscription->status !== 'active') {
            return response()->json([
                'error' => 'University subscription is not active.',
                'subscription_status' => $university->subscription->status
            ], 403);
        }
        
        return $next($request);
    }
}
```

### Route Protection

```php
// routes/api.php

Route::prefix('owner')->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
    
    Route::middleware(['auth:sanctum', 'university-owner'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index']);
        
        Route::apiResource('colleges', CollegeController::class);
        Route::post('/colleges/{college}/assign-principal', [CollegeController::class, 'assignPrincipal']);
        
        Route::apiResource('programs', ProgramController::class);
        Route::post('/programs/{program}/curriculum', [ProgramController::class, 'manageCurriculum']);
        
        Route::apiResource('faculty', FacultyController::class);
        Route::post('/faculty/leaves/{leave}/approve', [FacultyController::class, 'approveLeave']);
        
        Route::get('/students', [StudentController::class, 'index']);
        Route::get('/students/{student}', [StudentController::class, 'show']);
        Route::post('/students/{student}/transfer', [StudentController::class, 'transfer']);
        Route::post('/students/bulk-import', [StudentController::class, 'bulkImport']);
        
        Route::prefix('admissions')->group(function () {
            Route::get('/applications', [AdmissionController::class, 'applications']);
            Route::post('/applications/{application}/review', [AdmissionController::class, 'review']);
            Route::get('/merit-lists', [AdmissionController::class, 'meritLists']);
            Route::post('/merit-lists/{list}/approve', [AdmissionController::class, 'approveMeritList']);
        });
        
        Route::prefix('financial')->group(function () {
            Route::get('/dashboard', [FinancialController::class, 'dashboard']);
            Route::get('/fee-structures', [FeeStructureController::class, 'index']);
            Route::post('/fee-structures', [FeeStructureController::class, 'store']);
            Route::post('/expenses/{expense}/approve', [ExpenseController::class, 'approve']);
        });
        
        Route::post('/reports/generate', [ReportController::class, 'generate']);
        
        Route::prefix('settings')->group(function () {
            Route::get('/profile', [SettingsController::class, 'profile']);
            Route::patch('/profile', [SettingsController::class, 'updateProfile']);
            Route::get('/academic-calendar', [SettingsController::class, 'calendar']);
            Route::post('/academic-calendar', [SettingsController::class, 'configureCalendar']);
        });
    });
});
```

---

## Multi-Tenancy Security

### Database Query Scoping

**Global Scope Applied to All University-Scoped Models**:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

abstract class UniversityScopedModel extends Model
{
    protected static function booted()
    {
        // Automatically scope all queries to authenticated user's university
        static::addGlobalScope('university', function (Builder $builder) {
            if (auth()->check() && auth()->user()->university_id) {
                $builder->where('university_id', auth()->user()->university_id);
            }
        });
        
        // Automatically set university_id when creating records
        static::creating(function ($model) {
            if (auth()->check() && !$model->university_id) {
                $model->university_id = auth()->user()->university_id;
            }
        });
    }
}
```

**Models Using Global Scope**:

```php
class College extends UniversityScopedModel {}
class Program extends UniversityScopedModel {}
class Faculty extends UniversityScopedModel {}
class Student extends UniversityScopedModel {}
class FeeStructure extends UniversityScopedModel {}
```

### Cross-University Access Prevention

```php
// Example: Attempting to access another university's college
GET /api/owner/colleges/{college-from-other-university}

// Backend automatically applies scope
$college = College::find($id);
// Returns NULL because global scope filters by university_id

// Response
404 Not Found
```

### Bypass Global Scope (Admin Only)

```php
// Only Bitflow Admin can bypass university scope
if (auth()->user()->role === 'bitflow_owner') {
    $allColleges = College::withoutGlobalScope('university')->get();
}
```

---

## Session Management

### Idle Timeout

- **Timeout**: 30 minutes of inactivity
- **Implementation**: Frontend tracks last activity
- **Warning**: Show warning at 28 minutes
- **Action**: Auto-logout and redirect to login

```typescript
// Frontend: useIdleTimeout hook
export function useIdleTimeout() {
  const logout = useAuthStore((state) => state.logout);
  const [showWarning, setShowWarning] = useState(false);
  
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    let warningTimer: NodeJS.Timeout;
    
    const resetTimer = () => {
      clearTimeout(idleTimer);
      clearTimeout(warningTimer);
      setShowWarning(false);
      
      // Show warning at 28 minutes
      warningTimer = setTimeout(() => {
        setShowWarning(true);
      }, 28 * 60 * 1000);
      
      // Logout at 30 minutes
      idleTimer = setTimeout(() => {
        logout();
        window.location.href = '/login?reason=idle_timeout';
      }, 30 * 60 * 1000);
    };
    
    // Reset timer on user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);
    
    resetTimer();
    
    return () => {
      clearTimeout(idleTimer);
      clearTimeout(warningTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [logout]);
  
  return { showWarning };
}
```

### Concurrent Sessions

- **Allowed**: Maximum 3 concurrent sessions per University Owner
- **Detection**: Track session tokens in database
- **Action**: Force logout oldest session when limit exceeded

---

## Audit Logging

### Events Logged

All University Owner actions are logged to `audit_logs` table:

```php
use Spatie\Activitylog\Traits\LogsActivity;

class College extends UniversityScopedModel
{
    use LogsActivity;
    
    protected static $logAttributes = ['name', 'code', 'status', 'principal_id'];
    protected static $logOnlyDirty = true;
    protected static $logName = 'college';
}
```

### Log Structure

```json
{
  "id": "uuid",
  "log_name": "college",
  "description": "updated",
  "subject_type": "App\\Models\\College",
  "subject_id": "college-uuid",
  "causer_type": "App\\Models\\User",
  "causer_id": "user-uuid",
  "properties": {
    "attributes": {
      "name": "College of Engineering",
      "status": "active"
    },
    "old": {
      "name": "Engineering College",
      "status": "inactive"
    }
  },
  "created_at": "2025-10-25T10:30:00Z"
}
```

### Retention

- **Duration**: 2 years
- **Access**: University Owner, Bitflow Admin
- **Export**: Available via Reports page

---

## API Rate Limiting

```php
// config/sanctum.php
RateLimiter::for('api', function (Request $request) {
    return $request->user()
        ? Limit::perMinute(120)->by($request->user()->id)
        : Limit::perMinute(60)->by($request->ip());
});

// Higher limits for University Owner
RateLimiter::for('owner-api', function (Request $request) {
    return Limit::perMinute(200)->by($request->user()->id);
});
```

---

## Password Policies

- **Minimum Length**: 12 characters
- **Requirements**: Uppercase, lowercase, number, special character
- **History**: Cannot reuse last 5 passwords
- **Expiry**: 90 days (optional, configurable per university)
- **Reset Link**: Valid for 15 minutes

---

## Security Headers

```php
// app/Http/Middleware/SecurityHeaders.php
public function handle(Request $request, Closure $next)
{
    $response = $next($request);
    
    return $response
        ->header('X-Frame-Options', 'DENY')
        ->header('X-Content-Type-Options', 'nosniff')
        ->header('X-XSS-Protection', '1; mode=block')
        ->header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
        ->header('Referrer-Policy', 'strict-origin-when-cross-origin')
        ->header('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
}
```

---

## Permission Comparison Matrix

| Feature | University Owner | Super Admin | Principal |
|---------|------------------|-------------|-----------|
| **Colleges** |
| Create College | ✅ Yes | ✅ Yes | ❌ No |
| View All Colleges | ✅ Yes | ✅ Yes | ❌ Only Own |
| Edit Any College | ✅ Yes | ✅ Yes | ❌ Only Own |
| Assign Principal | ✅ Yes | ✅ Yes | ❌ No |
| **Programs** |
| Create Program | ✅ Yes | ✅ Yes | ❌ No |
| Assign to College | ✅ Yes | ✅ Yes | ❌ No |
| **Faculty** |
| Hire Faculty | ✅ Yes | ✅ Yes | ✅ College Only |
| View All Faculty | ✅ Yes | ✅ Yes | ❌ College Only |
| Approve Leave | ✅ Yes | ✅ Yes | ✅ College Only |
| **Financial** |
| Configure Fees | ✅ Yes | ✅ Yes | ❌ No |
| View Collection | ✅ All Colleges | ✅ All Colleges | ❌ Own College |
| Approve Expenses | ✅ Yes | ✅ Yes | ❌ No |
| **Settings** |
| University Profile | ✅ Yes | ✅ Limited | ❌ No |
| Academic Calendar | ✅ Yes | ✅ Yes | ❌ View Only |
| User Management | ✅ Yes | ✅ Limited | ❌ No |

---

**Authentication & Permissions Complete!**
