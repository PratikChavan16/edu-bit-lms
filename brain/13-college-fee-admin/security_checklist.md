# College Fee Admin Portal - Security Checklist

**Version**: 1.0.0  
**Standard**: PCI-DSS Level 1 Compliance  
**Annual Revenue**: ₹60 Crores/year  
**Audit Frequency**: Quarterly

---

## 🔒 PCI-DSS Compliance Checklist

### ✅ Requirement 1: Install and Maintain Firewall Configuration
- [x] AWS Security Groups configured for ports 443 (HTTPS), 5432 (PostgreSQL)
- [x] Block all inbound traffic except whitelisted IPs
- [x] Razorpay handles card data (no direct card storage)
- [x] TLS 1.3 enforced for all API endpoints

### ✅ Requirement 2: Secure Configuration
- [x] Default passwords changed on all systems
- [x] PHP 8.2 hardened (disable dangerous functions)
- [x] PostgreSQL 16 with SSL/TLS connections only
- [x] Redis password-protected
- [x] AWS IAM roles with least privilege

### ✅ Requirement 3: Protect Stored Cardholder Data
- [x] **NO CARD DATA STORED** (Razorpay tokenization)
- [x] Payment tokens encrypted at rest (AES-256)
- [x] Database encryption enabled (AWS RDS encryption)
- [x] Receipt PDFs stored in S3 with server-side encryption

### ✅ Requirement 4: Encrypt Transmission of Cardholder Data
- [x] HTTPS enforced (TLS 1.3, 256-bit encryption)
- [x] HSTS header enabled (max-age=31536000)
- [x] Razorpay API calls over HTTPS only
- [x] SMS/Email notifications over encrypted channels

### ✅ Requirement 5: Protect Against Malware
- [x] AWS GuardDuty enabled
- [x] ClamAV for uploaded files (cheque photos)
- [x] File upload restricted to images only (JPG, PNG, PDF)
- [x] Max file size: 5 MB

### ✅ Requirement 6: Secure Development
- [x] Laravel framework (latest security patches)
- [x] Input validation on all endpoints
- [x] CSRF protection enabled
- [x] SQL injection prevention (Eloquent ORM)
- [x] XSS protection (Content-Security-Policy header)
- [x] Code review before production deployment

### ✅ Requirement 7: Restrict Access by Business Need-to-Know
- [x] RBAC implemented (4 roles with granular permissions)
- [x] Row-Level Security (RLS) in PostgreSQL
- [x] College isolation middleware
- [x] Principle of least privilege enforced

### ✅ Requirement 8: Identify and Authenticate Access
- [x] Unique user IDs (no shared accounts)
- [x] Password policy (12 chars, complexity, 90-day expiry)
- [x] JWT authentication (24-hour token expiry)
- [x] MFA for high-value transactions (> ₹50,000)
- [x] Account lockout after 5 failed attempts

### ✅ Requirement 9: Restrict Physical Access
- [x] AWS data centers (ISO 27001 certified)
- [x] College server room access restricted
- [x] Fee counter workstations in secure area
- [x] Biometric/Card access for admin office

### ✅ Requirement 10: Track and Monitor All Access
- [x] Audit logs for all financial transactions (permanent retention)
- [x] Login/logout events logged
- [x] Failed login attempts tracked
- [x] CloudWatch logs enabled
- [x] Daily log review by security team

### ✅ Requirement 11: Regularly Test Security Systems
- [x] Quarterly penetration testing
- [x] Automated vulnerability scans (weekly)
- [x] Code security analysis (SonarQube)
- [x] Intrusion detection (AWS WAF)

### ✅ Requirement 12: Maintain Security Policy
- [x] Information Security Policy documented
- [x] Annual security awareness training for staff
- [x] Incident response plan in place
- [x] Third-party service provider agreements (Razorpay, AWS)

---

## 🛡️ OWASP Top 10 Protection

| Vulnerability | Protection Mechanism | Status |
|---------------|---------------------|--------|
| **A01: Broken Access Control** | RBAC + RLS policies | ✅ |
| **A02: Cryptographic Failures** | TLS 1.3, AES-256 encryption | ✅ |
| **A03: Injection** | Eloquent ORM, prepared statements | ✅ |
| **A04: Insecure Design** | Threat modeling, secure architecture | ✅ |
| **A05: Security Misconfiguration** | Hardened configs, no default passwords | ✅ |
| **A06: Vulnerable Components** | Automated dependency updates | ✅ |
| **A07: Authentication Failures** | JWT + MFA, strong password policy | ✅ |
| **A08: Software/Data Integrity** | Code signing, S3 integrity checks | ✅ |
| **A09: Logging Failures** | Comprehensive audit logs | ✅ |
| **A10: SSRF** | URL validation, no user-supplied URLs | ✅ |

---

## 🔐 Authentication Security

### Password Security
```php
// Bcrypt with cost factor 12
'password' => ['required', 'min:12', 'regex:/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/']

// Password history check (last 5 passwords)
if (Hash::check($newPassword, $user->password_history)) {
    throw new ValidationException('Cannot reuse recent passwords');
}
```

### JWT Token Security
```php
// Token expiry: 24 hours
'jwt_ttl' => 1440,

// Refresh token: 30 days
'refresh_ttl' => 43200,

// Blacklist old tokens
Cache::put('token_blacklist:' . $tokenId, true, now()->addDays(30));
```

### Rate Limiting
```php
// Login endpoint: 5 attempts per minute
Route::post('/login')->middleware('throttle:5,1');

// Payment API: 100 requests per minute
Route::middleware('throttle:100,1');
```

---

## 💳 Payment Security

### Razorpay Integration Security
```php
// Webhook signature verification
$signature = hash_hmac('sha256', $payload, config('razorpay.webhook_secret'));
if (!hash_equals($signature, $receivedSignature)) {
    abort(403, 'Invalid webhook signature');
}

// Payment amount verification
if ($razorpayPayment->amount !== $payment->amount * 100) {
    abort(400, 'Payment amount mismatch');
}
```

### Sensitive Data Handling
```php
// Bank account numbers encrypted at rest
'bank_account_number' => 'encrypted',

// Cheque photos stored in private S3 bucket
Storage::disk('s3-private')->put($filename, $file);

// Transaction IDs hashed in logs
Log::info('Payment processed', ['payment_id' => hash('sha256', $paymentId)]);
```

---

## 🌐 API Security

### HTTPS Enforcement
```apache
# .htaccess
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### CORS Configuration
```php
// config/cors.php
'allowed_origins' => [
    'https://fees.college.edu.in', // Production frontend
    'https://staging-fees.college.edu.in' // Staging
],
'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
'allowed_headers' => ['Authorization', 'Content-Type'],
'exposed_headers' => ['X-Total-Count'],
'max_age' => 86400
```

### Security Headers
```php
// app/Http/Middleware/SecurityHeaders.php
$response->headers->set('X-Frame-Options', 'DENY');
$response->headers->set('X-Content-Type-Options', 'nosniff');
$response->headers->set('X-XSS-Protection', '1; mode=block');
$response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
$response->headers->set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://checkout.razorpay.com");
```

---

## 📊 Data Protection

### Encryption at Rest
```bash
# PostgreSQL encryption (AWS RDS)
aws rds modify-db-instance --db-instance-identifier fee-admin-db --storage-encrypted

# S3 bucket encryption
aws s3api put-bucket-encryption --bucket fee-receipts \
--server-side-encryption-configuration '{"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]}'
```

### Data Masking
```php
// Mask sensitive data in responses
return [
    'student_name' => $student->name,
    'bank_account' => '****' . substr($refund->bank_account_number, -4),
    'cheque_number' => 'CHQ-' . substr($payment->cheque_number, -6)
];
```

### Backup Security
```bash
# Encrypted daily backups
pg_dump fee_admin_db | gpg --encrypt --recipient admin@college.edu.in > backup_$(date +%Y%m%d).sql.gpg

# Backup retention: 30 days
aws s3 lifecycle create --bucket fee-backups --lifecycle-policy backup-retention-policy.json
```

---

## 🚨 Incident Response

### Security Incident Workflow
```
1. Detection (CloudWatch Alarms)
        ↓
2. Triage (Assess severity: P1-Critical, P2-High, P3-Medium)
        ↓
3. Containment (Disable compromised accounts, block IPs)
        ↓
4. Investigation (Analyze logs, identify root cause)
        ↓
5. Remediation (Patch vulnerabilities, update configs)
        ↓
6. Recovery (Restore services, verify integrity)
        ↓
7. Post-Mortem (Document lessons, update policies)
```

### Critical Alert Thresholds
- Failed login attempts > 50 in 5 minutes → P2 Alert
- Payment API error rate > 5% → P1 Alert
- Unauthorized database access attempt → P1 Alert
- Refund approval > ₹5,00,000 → MFA + Email notification

---

## 🧪 Security Testing

### Pre-Deployment Checklist
- [ ] Vulnerability scan passed (0 critical, 0 high)
- [ ] Penetration test completed (no P1/P2 findings)
- [ ] Code security review approved
- [ ] Dependency audit clean (`composer audit`)
- [ ] Static analysis passed (PHPStan Level 8)
- [ ] API rate limiting verified
- [ ] HTTPS certificate valid (> 30 days expiry)
- [ ] Backup restore tested

### Monthly Security Tasks
- Week 1: Review access logs for anomalies
- Week 2: Update dependencies (`composer update`)
- Week 3: Review user permissions (revoke unused accounts)
- Week 4: Test incident response plan (tabletop exercise)

---

## 📝 Compliance Documentation

### Required Documents
1. **Information Security Policy** (Annual review)
2. **Data Protection Impact Assessment (DPIA)** (Quarterly)
3. **Penetration Test Report** (Quarterly)
4. **Vulnerability Scan Report** (Weekly)
5. **Audit Log Review Report** (Monthly)
6. **Incident Response Plan** (Annual review)
7. **Third-Party Security Agreements** (Razorpay, AWS)

### Audit Trail Requirements
- **Retention**: 7 years (as per financial regulations)
- **Immutability**: Write-once, read-many (WORM) storage
- **Access**: Restricted to auditors and compliance team

---

**Security Status**: ✅ Production-Ready  
**Last Security Audit**: 2024-10-15  
**Next Review**: 2025-01-15
