# Bitflow LMS - Global Security & Compliance

**Version**: 2.0  
**Last Updated**: October 25, 2025  
**Security Level**: CRITICAL  
**Compliance Standards**: OWASP, GDPR, PCI-DSS Level 1, FERPA, ISO 27001

---

## Table of Contents

1. [Security Overview](#security-overview)
2. [OWASP Top 10 Mitigations](#owasp-top-10-mitigations)
3. [Authentication Security](#authentication-security)
4. [Data Protection](#data-protection)
5. [PCI-DSS Compliance](#pci-dss-compliance)
6. [GDPR Compliance](#gdpr-compliance)
7. [FERPA Compliance](#ferpa-compliance)
8. [Vulnerability Management](#vulnerability-management)
9. [Security Testing](#security-testing)
10. [Incident Response](#incident-response)

---

## Security Overview

### Security Layers

1. **Network Layer**: TLS 1.3, Firewall, DDoS protection
2. **Application Layer**: Input validation, CSRF protection, XSS prevention
3. **Authentication Layer**: JWT RS256, MFA, session management
4. **Authorization Layer**: RBAC, permission checks, data isolation
5. **Data Layer**: Encryption at rest, encryption in transit, secure backups
6. **Infrastructure Layer**: Container security, secrets management, patch management

### Security Principles

- **Defense in Depth**: Multiple layers of security controls
- **Least Privilege**: Minimum necessary permissions
- **Fail Secure**: Default to denying access
- **Complete Mediation**: Check every access request
- **Open Design**: Security through implementation, not obscurity
- **Separation of Privilege**: Require multiple conditions for critical operations

---

## OWASP Top 10 Mitigations

### A01:2021 - Broken Access Control

**Risk**: Users access resources without proper authorization

**Mitigations**:

```php
// Laravel Policy Enforcement
class StudentController extends Controller {
    public function show(Student $student) {
        // Automatic policy check via middleware
        $this->authorize('view', $student);
        
        // Additional multi-tenancy check
        if ($student->university_id !== auth()->user()->university_id) {
            abort(403, 'Access denied');
        }
        
        return new StudentResource($student);
    }
}

// Frontend Permission Check
const StudentProfile = () => {
  const { user } = useAuth();
  const canEditStudent = user.permissions.includes('students.update');
  
  if (!canEditStudent) {
    return <AccessDenied />;
  }
  
  return <StudentForm />;
};
```

**Controls**:
- ✅ Deny by default
- ✅ Implement RBAC with Laravel Policies
- ✅ Multi-tenancy enforcement (university_id checks)
- ✅ API rate limiting
- ✅ Log all access attempts

---

### A02:2021 - Cryptographic Failures

**Risk**: Sensitive data exposed due to weak encryption

**Mitigations**:

```php
// Encrypt sensitive fields
use Illuminate\Support\Facades\Crypt;

class Student extends Model {
    protected $casts = [
        'ssn' => 'encrypted', // Social Security Number
        'medical_records' => 'encrypted',
    ];
}

// TLS Configuration
// config/database.php
'pgsql' => [
    'sslmode' => 'require',
    'sslcert' => env('DB_SSL_CERT'),
    'sslkey' => env('DB_SSL_KEY'),
    'sslrootcert' => env('DB_SSL_ROOT_CERT'),
],
```

**Controls**:
- ✅ TLS 1.3 for all connections
- ✅ AES-256-GCM for data at rest
- ✅ Bcrypt (cost 12) for passwords
- ✅ RSA-4096 for JWT signing
- ✅ Encrypted database connections
- ✅ Secure key management (AWS KMS/HashiCorp Vault)

---

### A03:2021 - Injection

**Risk**: SQL/NoSQL/LDAP injection attacks

**Mitigations**:

```php
// ALWAYS use parameterized queries
// ✅ GOOD
$students = Student::where('college_id', $collegeId)
    ->where('year', $year)
    ->get();

// ❌ BAD - Never do this
$students = DB::select("SELECT * FROM students WHERE college_id = '$collegeId'");

// Input validation
class CreateStudentRequest extends FormRequest {
    public function rules(): array {
        return [
            'email' => ['required', 'email', 'max:255'],
            'admission_number' => ['required', 'string', 'max:50', 'regex:/^[A-Z0-9]+$/'],
            'year' => ['required', 'integer', 'min:1', 'max:6'],
        ];
    }
}

// Frontend validation
const validateAdmissionNumber = (value: string): string | null => {
  if (!/^[A-Z0-9]+$/.test(value)) {
    return 'Admission number must contain only uppercase letters and numbers';
  }
  return null;
};
```

**Controls**:
- ✅ Use Eloquent ORM (parameterized queries)
- ✅ Input validation on backend (FormRequest)
- ✅ Input validation on frontend (Zod/Yup)
- ✅ Escape output in templates
- ✅ Whitelist allowed values for enums

---

### A04:2021 - Insecure Design

**Risk**: Fundamental security flaws in architecture

**Mitigations**:

```php
// Secure password reset flow
class PasswordResetController extends Controller {
    public function requestReset(Request $request) {
        // 1. Rate limit requests
        RateLimiter::attempt('password-reset:' . $request->ip(), 3, function() {
            // 2. Generate secure token
            $token = Str::random(64);
            
            // 3. Store with expiration (1 hour)
            DB::table('password_resets')->insert([
                'email' => $request->email,
                'token' => Hash::make($token),
                'created_at' => now(),
            ]);
            
            // 4. Send email (no indication if email exists)
            Mail::to($request->email)->send(new PasswordResetMail($token));
        }, 60);
        
        // 5. Same response regardless of email existence
        return response()->json(['message' => 'If email exists, reset link sent']);
    }
}
```

**Controls**:
- ✅ Threat modeling for all features
- ✅ Security review before implementation
- ✅ Secure defaults
- ✅ Principle of least privilege
- ✅ Defense in depth

---

### A05:2021 - Security Misconfiguration

**Risk**: Default configurations, unnecessary features enabled

**Mitigations**:

```php
// .env.production
APP_DEBUG=false
APP_ENV=production

// Disable unnecessary features
'features' => [
    'registration' => false, // Admin-only user creation
    'password-reset' => true,
    'two-factor' => true,
],

// Security headers
// app/Http/Middleware/SecurityHeaders.php
class SecurityHeaders {
    public function handle($request, Closure $next) {
        $response = $next($request);
        
        return $response->withHeaders([
            'X-Content-Type-Options' => 'nosniff',
            'X-Frame-Options' => 'DENY',
            'X-XSS-Protection' => '1; mode=block',
            'Strict-Transport-Security' => 'max-age=31536000; includeSubDomains',
            'Content-Security-Policy' => "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
            'Referrer-Policy' => 'strict-origin-when-cross-origin',
            'Permissions-Policy' => 'geolocation=(), microphone=(), camera=()',
        ]);
    }
}
```

**Controls**:
- ✅ Disable debug mode in production
- ✅ Remove default accounts
- ✅ Configure security headers
- ✅ Disable directory listing
- ✅ Regular security audits

---

### A06:2021 - Vulnerable Components

**Risk**: Outdated libraries with known vulnerabilities

**Mitigations**:

```bash
# Backend dependency scanning
composer audit

# Frontend dependency scanning
pnpm audit

# Automated updates
dependabot.yml:
version: 2
updates:
  - package-ecosystem: "composer"
    directory: "/bitflow-core"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
  
  - package-ecosystem: "npm"
    directory: "/bitflow-frontend"
    schedule:
      interval: "weekly"
```

**Controls**:
- ✅ Automated dependency scanning (Dependabot)
- ✅ Regular updates (weekly)
- ✅ Security patch SLA: Critical (24h), High (7d)
- ✅ Vendor directory excluded from git
- ✅ Lock files committed

---

### A07:2021 - Authentication Failures

**Risk**: Weak authentication, credential stuffing

**Mitigations**:

```php
// Strong password policy
'password' => [
    'required',
    'min:8',
    'max:128',
    'regex:/[a-z]/', // Lowercase
    'regex:/[A-Z]/', // Uppercase
    'regex:/[0-9]/', // Number
    'regex:/[@$!%*#?&]/', // Special char
    'not_in:' . implode(',', COMMON_PASSWORDS), // Common password check
],

// MFA enforcement
class LoginController extends Controller {
    public function login(Request $request) {
        // Rate limiting
        if (RateLimiter::tooManyAttempts('login:' . $request->ip(), 5)) {
            throw new TooManyRequestsException();
        }
        
        // Verify credentials
        $user = User::where('email', $request->email)->first();
        
        if (!$user || !Hash::check($request->password, $user->password_hash)) {
            RateLimiter::hit('login:' . $request->ip(), 60);
            throw new UnauthorizedException('Invalid credentials');
        }
        
        // Check if MFA required
        if ($user->two_factor_enabled) {
            return response()->json(['requires_mfa' => true]);
        }
        
        // Generate tokens
        return $this->generateTokens($user);
    }
}
```

**Controls**:
- ✅ Strong password policy
- ✅ MFA for privileged accounts
- ✅ Rate limiting (5 attempts/minute)
- ✅ Account lockout after failures
- ✅ Password history (prevent reuse)
- ✅ Session timeout (15 min access, 7 day refresh)

---

### A08:2021 - Software and Data Integrity Failures

**Risk**: Unsigned code, insecure CI/CD

**Mitigations**:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Verify signatures
        run: git verify-commit HEAD
      
      - name: Run security scan
        run: |
          composer audit
          pnpm audit
      
      - name: Run tests
        run: |
          php artisan test
          pnpm test
      
      - name: Deploy
        if: success()
        run: ./deploy.sh
```

**Controls**:
- ✅ Code signing (Git commit signatures)
- ✅ Dependency integrity checks (lock files)
- ✅ CI/CD pipeline security
- ✅ Immutable build artifacts
- ✅ Audit logging

---

### A09:2021 - Security Logging and Monitoring Failures

**Risk**: Attacks not detected or investigated

**Mitigations**:

```php
// Comprehensive audit logging
class AuditLogger {
    public static function log(string $action, string $entityType, $entityId, array $changes = []) {
        DB::table('audit_logs')->insert([
            'user_id' => auth()->id(),
            'university_id' => auth()->user()->university_id,
            'action' => $action,
            'entity_type' => $entityType,
            'entity_id' => $entityId,
            'changes' => json_encode($changes),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'created_at' => now(),
        ]);
        
        // Send to centralized logging (ELK/Datadog)
        Log::info('AUDIT', [
            'action' => $action,
            'entity' => $entityType,
            'user' => auth()->id(),
        ]);
    }
}

// Usage
public function destroy(Student $student) {
    AuditLogger::log('DELETE', 'Student', $student->id, $student->toArray());
    $student->delete();
}
```

**Controls**:
- ✅ Log all authentication events
- ✅ Log all authorization failures
- ✅ Log all data modifications
- ✅ Centralized logging (ELK Stack)
- ✅ Real-time alerting (suspicious activity)
- ✅ Log retention (1 year minimum)

---

### A10:2021 - Server-Side Request Forgery (SSRF)

**Risk**: Server makes unintended requests

**Mitigations**:

```php
// Validate and sanitize URLs
class FileUploadController extends Controller {
    public function uploadFromUrl(Request $request) {
        $url = $request->input('url');
        
        // 1. Parse URL
        $parsed = parse_url($url);
        
        // 2. Whitelist domains
        $allowedDomains = ['s3.amazonaws.com', 'cdn.bitflow.edu'];
        if (!in_array($parsed['host'], $allowedDomains)) {
            throw new ValidationException('Invalid domain');
        }
        
        // 3. Prevent internal network access
        $ip = gethostbyname($parsed['host']);
        if ($this->isPrivateIp($ip)) {
            throw new ValidationException('Cannot access internal network');
        }
        
        // 4. Use allow list for protocols
        if (!in_array($parsed['scheme'], ['https'])) {
            throw new ValidationException('Only HTTPS allowed');
        }
        
        // 5. Download with timeout
        $response = Http::timeout(10)->get($url);
        
        return $response;
    }
    
    private function isPrivateIp(string $ip): bool {
        return !filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE);
    }
}
```

**Controls**:
- ✅ URL validation
- ✅ Domain whitelist
- ✅ Block internal IPs
- ✅ Protocol whitelist (HTTPS only)
- ✅ Request timeout

---

## Authentication Security

### Password Storage

```php
// NEVER store plain text passwords
// ✅ CORRECT
$user->password_hash = Hash::make($request->password, ['rounds' => 12]);

// ❌ WRONG
$user->password = $request->password;
```

### Session Security

```php
// config/session.php
'lifetime' => 15, // 15 minutes
'secure' => true, // HTTPS only
'http_only' => true, // Not accessible via JavaScript
'same_site' => 'strict', // CSRF protection
```

---

## Data Protection

### PII Encryption

```php
class Student extends Model {
    protected $casts = [
        'ssn' => 'encrypted',
        'passport_number' => 'encrypted',
        'medical_records' => 'encrypted',
    ];
}
```

### Data Masking

```php
// Mask sensitive data in logs
Log::info('User login', [
    'email' => Str::mask($user->email, '*', 3),
    'ip' => request()->ip(),
]);
```

---

## PCI-DSS Compliance

### Requirements for Fee Payments

1. **Cardholder Data**: Never store CVV/CVV2
2. **Encryption**: Use TLS 1.3 for transmission
3. **Access Control**: Limit access to cardholder data
4. **Testing**: Regular penetration testing
5. **Monitoring**: Track all access to cardholder data

```php
// Use payment gateway (Stripe/Razorpay) - NEVER store card details
class FeePaymentController extends Controller {
    public function createPayment(Request $request) {
        $stripe = new \Stripe\StripeClient(config('services.stripe.secret'));
        
        // Create payment intent (card details never touch our server)
        $paymentIntent = $stripe->paymentIntents->create([
            'amount' => $request->amount * 100, // Cents
            'currency' => 'usd',
            'metadata' => [
                'student_id' => $request->student_id,
                'university_id' => auth()->user()->university_id,
            ],
        ]);
        
        return response()->json([
            'client_secret' => $paymentIntent->client_secret,
        ]);
    }
}
```

---

## GDPR Compliance

### Data Subject Rights

1. **Right to Access**: Users can export their data
2. **Right to Rectification**: Users can update their data
3. **Right to Erasure**: Users can request deletion
4. **Right to Portability**: Export data in machine-readable format
5. **Right to Object**: Opt-out of processing

```php
// GDPR Data Export
class GdprController extends Controller {
    public function exportData() {
        $user = auth()->user();
        
        $data = [
            'user' => $user->toArray(),
            'student' => $user->student->toArray(),
            'enrollments' => $user->student->enrollments->toArray(),
            'grades' => $user->student->grades->toArray(),
            'attendance' => $user->student->attendance->toArray(),
        ];
        
        return response()->json($data);
    }
    
    public function deleteAccount(Request $request) {
        $user = auth()->user();
        
        // Log deletion request
        AuditLogger::log('GDPR_DELETE_REQUEST', 'User', $user->id);
        
        // Soft delete (retain for legal obligations)
        $user->delete();
        
        return response()->json(['message' => 'Account deleted']);
    }
}
```

---

## FERPA Compliance

### Student Records Protection

```php
// Restrict access to student records
class StudentPolicy {
    public function viewRecords(User $user, Student $student): bool {
        // Teachers can view their students
        if ($user->hasRole('faculty')) {
            return $student->courses()->whereHas('faculty', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })->exists();
        }
        
        // Parents can view their children
        if ($user->hasRole('parent')) {
            return $student->parents()->where('parent_user_id', $user->id)->exists();
        }
        
        // Admins can view all
        return $user->hasPermission('students.read');
    }
}
```

---

## Security Testing

### Automated Security Scans

```bash
# Run security audit
composer audit
pnpm audit

# Static analysis
./vendor/bin/phpstan analyse
pnpm lint

# Penetration testing
# Use OWASP ZAP or Burp Suite
```

---

## Incident Response

### Incident Response Plan

1. **Detection**: Monitor logs, alerts
2. **Containment**: Isolate affected systems
3. **Eradication**: Remove threat
4. **Recovery**: Restore services
5. **Lessons Learned**: Post-mortem analysis

### Security Contact

- **Email**: security@bitflow.edu
- **PGP Key**: [Public Key]
- **Response SLA**: 24 hours for critical issues

---

**🔒 Security is everyone's responsibility. Report suspicious activity immediately.**
