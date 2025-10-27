# Principal Portal - Security Checklist

Version: 2.0  
Last Updated: October 25, 2025

---

## OWASP Top 10 Compliance

### ✅ A01:2021 - Broken Access Control

Protections
- RBAC with granular permissions (30+ slugs) per `auth_and_permissions.md`.
- Strict college isolation (middleware + Eloquent global scopes + RLS in DB).
- Approval thresholds enforced (e.g., finance <₹5L approve; ≥₹5L escalate).
- Frontend guards and masked PII in lists; unmask requires purpose logging.
- Audit trail for every privileged action (approve/reject/unmask).

Checks
```bash
# Unauthorized
curl -i http://localhost:8000/api/principal/faculty

# Cross-college (should 403/404 by RLS)
curl -H "Authorization: Bearer VALID" -H "X-College-Id: 999" \
	http://localhost:8000/api/principal/faculty
```

---

### ✅ A02:2021 - Cryptographic Failures

Protections
- JWT RS256 with 4096-bit keys; rotation quarterly.
- HTTPS enforced in prod; HSTS header (max-age 6 months).
- Sensitive fields encrypted at rest where applicable.
- Database SSL/TLS connections.

Config
```php
// config/session.php
'secure' => true,
'same_site' => 'lax',
```

---

### ✅ A03:2021 - Injection

Protections
- Parameterized queries via Eloquent; FormRequest validation.
- Reject dangerous content; sanitize user-provided HTML in announcements.
- No dynamic SQL, no shell exec.

---

### ✅ A04:2021 - Insecure Design

Protections
- Deny-by-default policies; least privilege.
- Approvals require remarks; escalation path defined.
- Rate limiting on approvals and announcements.

---

### ✅ A05:2021 - Security Misconfiguration

Protections
- Debug false in prod; sanitized errors.
- Security headers middleware.
- CORS restricted to known origins (e.g., http://localhost:3004 in dev).

Headers
```php
return $next($request)
	->header('X-Frame-Options','DENY')
	->header('X-Content-Type-Options','nosniff')
	->header('Referrer-Policy','strict-origin-when-cross-origin')
	->header('Content-Security-Policy', "default-src 'self'");
```

---

### ✅ A06:2021 - Vulnerable Components

Protections
- Dependency audits (`composer audit`, `npm audit`).
- Dependabot alerts and version pinning.

---

### ✅ A07:2021 - Identification and Authentication Failures

Protections
- Strong password policy; account lockout after 5 failures.
- 2FA enforced for Principal; session timeout 60 min.
- Device/session listing and remote revoke.

---

### ✅ A08:2021 - Software and Data Integrity Failures

Protections
- Signed webhooks (HMAC) with timestamp checks.
- CI verifies checksums; build artifacts are immutable.

---

### ✅ A09:2021 - Security Logging and Monitoring Failures

Protections
- Audit records for all approvals and unmask actions.
- Sentry/OTel tracing with college context.
- Alerting on suspicious patterns (approval spikes, failed logins).

---

### ✅ A10:2021 - Server-Side Request Forgery (SSRF)

Protections
- Egress restrict outbound calls; only allowlisted webhook URLs.
- Validate URLs and enforce HTTPS for callbacks.

---

## Data Protection & Privacy

PII Masking
- Lists: show last-4 for phone; email partially masked.
- Unmask requires `pii.unmask` permission + reason; audit written.

Retention
- Audit logs 180 days; announcements 365 days; admissions artifacts 730 days.

Data Subject Rights
- Export student or faculty profile on verifiable request via DPO workflow.

---

## Rate Limits (reference)
- Approvals: 60/min, 600/hour per principal_id
- Announcements: 10/min
- Admissions batch jobs: protected via queue concurrency controls

---

## Hardening Checklist
- [ ] Production .env secrets managed via vault
- [ ] Keys rotated quarterly; revoke on compromise
- [ ] DB RLS policies present on all college tables
- [ ] CSP nonces for inline scripts where necessary
- [ ] Backups encrypted and tested quarterly
- [ ] Incident response runbook accessible to on-call
