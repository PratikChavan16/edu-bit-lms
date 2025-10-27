# Super Admin Portal - Security Checklist

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## OWASP Top 10 Compliance

### ✅ A01:2021 - Broken Access Control

**Implemented Protections**:
- [x] Role-Based Access Control (RBAC) with 20+ permissions
- [x] Multi-tenancy isolation (university_id scoping)
- [x] Row-Level Security (RLS) policies on all tables
- [x] API endpoint authorization via middleware
- [x] Frontend route guards checking permissions
- [x] Activity logging for all privileged actions

**Testing**:
```bash
# Test unauthorized access
curl -X GET http://localhost:8000/api/super-admin/courses \
  -H "Authorization: Bearer invalid_token"
# Expected: 401 Unauthorized

# Test cross-tenant access
curl -X GET http://localhost:8000/api/super-admin/courses/other-university-course-id \
  -H "Authorization: Bearer valid_token"
# Expected: 404 Not Found (hidden by RLS)
```

---

### ✅ A02:2021 - Cryptographic Failures

**Implemented Protections**:
- [x] Passwords hashed with bcrypt (cost 12)
- [x] JWT tokens signed with RS256 (4096-bit RSA)
- [x] HTTPS enforced in production
- [x] Sensitive data encrypted at rest (AES-256)
- [x] Database connections over SSL/TLS
- [x] Secure cookie flags (HttpOnly, Secure, SameSite)

**Configuration**:
```php
// config/hashing.php
'bcrypt' => [
    'rounds' => 12,
],

// config/session.php
'secure' => true,
'http_only' => true,
'same_site' => 'strict',
```

**Testing**:
```bash
# Verify password hashing
php artisan tinker
>>> $hash = Hash::make('password');
>>> Hash::check('password', $hash); // true
>>> Hash::check('wrong', $hash); // false
```

---

### ✅ A03:2021 - Injection

**Implemented Protections**:
- [x] Eloquent ORM with parameterized queries
- [x] Input validation via Laravel Form Requests
- [x] SQL injection prevention (prepared statements)
- [x] XSS prevention (output escaping)
- [x] Command injection prevention (avoid shell_exec)

**Code Examples**:
```php
// ❌ BAD: SQL Injection vulnerable
$courses = DB::select("SELECT * FROM courses WHERE code = '$code'");

// ✅ GOOD: Parameterized query
$courses = DB::select("SELECT * FROM courses WHERE code = ?", [$code]);

// ✅ BETTER: Eloquent ORM
$courses = Course::where('code', $code)->get();
```

**Testing**:
```bash
# Test SQL injection
curl -X GET "http://localhost:8000/api/super-admin/courses?search=' OR 1=1 --"
# Expected: No unauthorized data returned
```

---

### ✅ A04:2021 - Insecure Design

**Implemented Protections**:
- [x] Secure multi-tenancy architecture
- [x] Principle of least privilege (granular permissions)
- [x] Defense in depth (multiple security layers)
- [x] Input validation at multiple layers (client, server, database)
- [x] Rate limiting on sensitive endpoints
- [x] Audit logging with 90-day retention

**Rate Limiting**:
```php
// routes/api.php
Route::middleware(['throttle:login'])->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});

// config/throttle.php
'login' => [
    'max_attempts' => 5,
    'decay_minutes' => 15,
],
```

---

### ✅ A05:2021 - Security Misconfiguration

**Implemented Protections**:
- [x] Debug mode disabled in production
- [x] Error messages sanitized (no stack traces)
- [x] Unused features/endpoints disabled
- [x] Default passwords changed
- [x] Security headers configured
- [x] File upload restrictions

**Security Headers** (via middleware):
```php
// app/Http/Middleware/SecurityHeaders.php
return $next($request)
    ->header('X-Frame-Options', 'DENY')
    ->header('X-Content-Type-Options', 'nosniff')
    ->header('X-XSS-Protection', '1; mode=block')
    ->header('Referrer-Policy', 'strict-origin-when-cross-origin')
    ->header('Content-Security-Policy', "default-src 'self'");
```

**Testing**:
```bash
# Check headers
curl -I http://localhost:8000/api/super-admin/dashboard
```

---

### ✅ A06:2021 - Vulnerable Components

**Implemented Protections**:
- [x] Dependencies updated regularly (`composer update`, `npm update`)
- [x] Vulnerability scanning via `composer audit`, `npm audit`
- [x] Automated dependency alerts (GitHub Dependabot)
- [x] Only trusted packages used

**Commands**:
```bash
# Backend
composer audit
composer outdated

# Frontend
npm audit
npm audit fix

# Update dependencies
composer update
npm update
```

---

### ✅ A07:2021 - Authentication Failures

**Implemented Protections**:
- [x] Strong password policy (min 8 chars, uppercase, lowercase, number, symbol)
- [x] Password strength meter on frontend
- [x] Account lockout after 5 failed attempts
- [x] 2FA support (TOTP with backup codes)
- [x] Session timeout (60 minutes)
- [x] Secure password reset flow

**Password Validation**:
```php
// app/Http/Requests/Auth/RegisterRequest.php
public function rules()
{
    return [
        'password' => [
            'required',
            'string',
            'min:8',
            'regex:/[a-z]/',      // lowercase
            'regex:/[A-Z]/',      // uppercase
            'regex:/[0-9]/',      // number
            'regex:/[@$!%*#?&]/', // symbol
        ],
    ];
}
```

**Testing**:
```bash
# Test account lockout
for i in {1..6}; do
  curl -X POST http://localhost:8000/api/super-admin/auth/login \
    -d '{"email":"admin@test.com","password":"wrong"}'
done
# Expected: 6th attempt should return 429 Too Many Requests
```

---

### ✅ A08:2021 - Software and Data Integrity Failures

**Implemented Protections**:
- [x] Code signing for deployments
- [x] Composer.lock committed (pinned dependencies)
- [x] Package integrity verification
- [x] CI/CD pipeline with security checks
- [x] Database migrations version controlled

**CI/CD Pipeline** (.github/workflows/security.yml):
```yaml
name: Security Scan

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Backend Security Audit
        run: |
          composer install
          composer audit
      
      - name: Frontend Security Audit
        run: |
          npm install
          npm audit
      
      - name: SAST Scan
        uses: github/codeql-action/analyze@v2
```

---

### ✅ A09:2021 - Logging and Monitoring Failures

**Implemented Protections**:
- [x] Activity logging for all CRUD operations
- [x] Authentication logs (login, logout, failed attempts)
- [x] Error logging with stack traces (non-production)
- [x] Real-time monitoring dashboard
- [x] Alert system for suspicious activity
- [x] Log retention policy (90 days)

**Activity Logging**:
```php
// app/Services/ActivityLogger.php
ActivityLog::create([
    'user_id' => auth()->id(),
    'action' => 'courses.create',
    'resource_type' => 'Course',
    'resource_id' => $course->id,
    'changes' => $course->getChanges(),
    'ip_address' => request()->ip(),
    'user_agent' => request()->userAgent(),
]);
```

**Alerting**:
```php
// Trigger alert on suspicious activity
if ($failedAttempts >= 10) {
    Notification::route('mail', 'security@university.edu')
        ->notify(new SuspiciousActivityAlert($user, $failedAttempts));
}
```

---

### ✅ A10:2021 - Server-Side Request Forgery (SSRF)

**Implemented Protections**:
- [x] URL validation on user inputs
- [x] Whitelist allowed domains for external requests
- [x] No direct user control over HTTP requests
- [x] Network segmentation (internal services not exposed)

**URL Validation**:
```php
// app/Http/Requests/WebhookRequest.php
public function rules()
{
    return [
        'url' => [
            'required',
            'url',
            'regex:/^https:\/\//',
            function ($attribute, $value, $fail) {
                $allowedDomains = ['trusted-partner.com', 'api.university.edu'];
                $domain = parse_url($value, PHP_URL_HOST);
                if (!in_array($domain, $allowedDomains)) {
                    $fail('URL domain not whitelisted');
                }
            },
        ],
    ];
}
```

---

## Additional Security Measures

### CSRF Protection

**Implemented**:
- [x] CSRF tokens on all state-changing requests
- [x] SameSite cookie attribute
- [x] Double Submit Cookie pattern

```typescript
// frontend: lib/api.ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Send cookies
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Add CSRF token to requests
api.interceptors.request.use((config) => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (token) {
    config.headers['X-CSRF-TOKEN'] = token;
  }
  return config;
});
```

---

### CORS Configuration

```php
// config/cors.php
return [
    'paths' => ['api/*'],
    'allowed_origins' => [
        'http://localhost:3003',
        'https://superadmin.university.edu',
    ],
    'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
    'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With'],
    'exposed_headers' => [],
    'max_age' => 3600,
    'supports_credentials' => true,
];
```

---

### File Upload Security

**Restrictions**:
- [x] File type whitelist (only PDF, DOCX, XLSX)
- [x] File size limit (5MB)
- [x] Malware scanning (ClamAV)
- [x] Rename uploaded files (avoid code execution)
- [x] Store outside webroot

```php
// app/Http/Requests/BulkImportRequest.php
public function rules()
{
    return [
        'file' => [
            'required',
            'file',
            'mimes:csv,xlsx',
            'max:5120', // 5MB
        ],
    ];
}

// Store securely
$path = $request->file('file')->storeAs(
    'imports',
    Str::uuid() . '.csv',
    'private' // Not publicly accessible
);
```

---

## Penetration Testing Checklist

### Pre-Testing
- [ ] Backup production database
- [ ] Notify team of testing schedule
- [ ] Set up isolated testing environment
- [ ] Document baseline security metrics

### Authentication & Authorization
- [ ] Test password brute force (rate limiting)
- [ ] Test session fixation attacks
- [ ] Test privilege escalation (cross-role access)
- [ ] Test JWT token manipulation
- [ ] Test 2FA bypass attempts

### Input Validation
- [ ] Test SQL injection on all forms
- [ ] Test XSS on all input fields
- [ ] Test command injection
- [ ] Test file upload vulnerabilities
- [ ] Test CSV injection in bulk imports

### API Security
- [ ] Test API authentication bypass
- [ ] Test API rate limiting
- [ ] Test mass assignment vulnerabilities
- [ ] Test IDOR (insecure direct object references)
- [ ] Test API versioning issues

### Multi-Tenancy
- [ ] Test cross-tenant data access
- [ ] Test university_id manipulation
- [ ] Test RLS policy bypass attempts

### Network Security
- [ ] Test HTTPS enforcement
- [ ] Test insecure redirects
- [ ] Test CORS misconfigurations
- [ ] Test SSRF vulnerabilities

---

## Security Audit Report Template

```markdown
# Security Audit Report - Super Admin Portal

**Date**: YYYY-MM-DD
**Auditor**: [Name]
**Scope**: Super Admin Portal (Backend + Frontend)

## Summary
- **Critical Issues**: 0
- **High Issues**: 0
- **Medium Issues**: 2
- **Low Issues**: 5

## Findings

### 1. [Issue Title]
**Severity**: Medium
**Description**: [Detailed description]
**Affected Component**: [File/endpoint]
**Reproduction Steps**:
1. Step 1
2. Step 2
**Recommendation**: [How to fix]
**Status**: Open/Fixed

## Compliance
- [x] OWASP Top 10 2021
- [x] GDPR Requirements
- [x] FERPA Compliance
- [x] SOC 2 Controls

## Recommendations
1. Recommendation 1
2. Recommendation 2
```

---

## Incident Response Plan

### 1. Detection
- Monitor alert system for anomalies
- Review activity logs daily
- Set up automated alerts (Sentry, CloudWatch)

### 2. Containment
- Identify affected systems
- Isolate compromised accounts
- Block malicious IP addresses

### 3. Eradication
- Remove malicious code
- Patch vulnerabilities
- Reset compromised credentials

### 4. Recovery
- Restore from backups if needed
- Verify system integrity
- Re-enable services gradually

### 5. Post-Incident
- Document incident details
- Update security measures
- Conduct team debrief

---

## Security Contacts

- **Security Team**: security@university.edu
- **Emergency Hotline**: +1-XXX-XXX-XXXX
- **Bug Bounty**: https://university.edu/security/bounty

---

**Security is a continuous process. Review this checklist quarterly! 🔒**
