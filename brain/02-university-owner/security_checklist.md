# University Owner Portal - Security Checklist

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## 1. Multi-Tenancy Security ✅

- [x] All tables include `university_id`
- [x] Global scope on all models
- [x] Row-level security (RLS) in PostgreSQL
- [x] JWT tokens include `university_id` claim
- [x] S3 paths include `university_id`

---

## 2. Authentication & Authorization ✅

### JWT Security
- [x] RS256, 4096-bit keys
- [x] Access: 60 min, Refresh: 30 days
- [x] Refresh token rotation
- [x] HttpOnly cookies for refresh

### Password Security
- [x] Bcrypt cost 12
- [x] Min 12 chars, complexity requirements
- [x] Password history (last 5)
- [x] 90-day expiry
- [x] Account lockout: 5 attempts, 30 min

### 2FA
- [x] TOTP (Google Authenticator)
- [x] 10 backup codes
- [x] Required for University Owner

---

## 3. Input Validation ✅

- [x] FormRequest validation on all inputs
- [x] XSS prevention via HTML escaping
- [x] File uploads: whitelist types, 10MB limit, ClamAV scanning

---

## 4. OWASP Top 10 ✅

- [x] A01: Access control via middleware
- [x] A02: AES-256 encryption, TLS 1.3
- [x] A03: Eloquent ORM prevents SQL injection
- [x] A04: Multi-tenancy designed from start
- [x] A05: APP_DEBUG=false, security headers
- [x] A06: Monthly dependency updates
- [x] A07: Strong auth, 2FA, rate limiting
- [x] A08: Code signing, audit logs
- [x] A09: All events logged, 2-year retention
- [x] A10: Whitelist domains for SSRF

---

## 5. API Security ✅

### Rate Limiting
- 200 req/min authenticated
- 60 req/min unauthenticated
- 10 req/min bulk operations

### Security Headers
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

---

## 6. Data Protection ✅

- [x] Personal data encrypted at rest (AES-256)
- [x] GDPR compliant (right to access, erasure)
- [x] Database backups encrypted
- [x] Encryption keys in AWS KMS

---

## 7. Infrastructure ✅

- [x] OS patched monthly
- [x] Firewall: ports 80, 443, 22 only
- [x] SSH key auth only, root disabled
- [x] PostgreSQL accessible only from app server
- [x] HTTPS enforced, TLS 1.3 only

---

## 8. Audit Logging ✅

Events logged:
- Login/logout, failed attempts
- College CRUD, faculty hiring, student transfers
- Fee/expense changes

Retention: 2 years, exported to SIEM

---

## 9. Incident Response ✅

Workflow: Detection → Containment → Investigation → Eradication → Recovery → Post-Mortem

---

## 10. Penetration Testing ✅

- Annual third-party pen test
- Monthly vulnerability scanning (OWASP ZAP)

---

**Security Checklist Complete!**
