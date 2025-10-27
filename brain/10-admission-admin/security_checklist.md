# Admission Admin Portal - Security Checklist

**Version**: 2.0  
**Last Updated**: October 25, 2025  
**Security Audit Status**: ✅ Passed (Last Audit: September 2025)

---

## 1. Document Security

### 1.1 Document Storage
- [x] **AWS S3 Encryption**: All documents stored with server-side encryption (AES-256)
- [x] **Bucket Policies**: Private bucket with strict IAM role-based access
- [x] **Document Access Logs**: Every document access logged with timestamp, user, IP
- [x] **Pre-signed URLs**: Temporary URLs (15-minute expiry) for document viewing
- [x] **Versioning Enabled**: S3 versioning to track document modifications
- [x] **Cross-Region Replication**: Documents replicated to backup region (Mumbai → Singapore)
- [x] **Lifecycle Policies**: Archive to Glacier after 2 years, retain for 7 years

**Test Command**:
```bash
aws s3api get-bucket-encryption --bucket admission-documents-prod
# Expected: AES256 encryption enabled
```

### 1.2 Document Tampering Detection
- [x] **SHA-256 Hashing**: Hash generated on upload, verified on every access
- [x] **Watermarking**: Digital watermarks on PDFs (invisible, contains upload timestamp)
- [x] **OCR Fraud Detection**: Compare OCR results with application data (>5% mismatch → flag)
- [x] **Duplicate Detection**: Image similarity check (prevents same document for multiple applications)
- [x] **Metadata Extraction**: EXIF data extraction (detect photo manipulation)

**Database Check**:
```sql
SELECT COUNT(*) FROM documents WHERE hash_verified = false;
-- Expected: 0 (all hashes verified)
```

### 1.3 Document Access Control
- [x] **Role-Based Access**: Document verifiers can only access assigned applications
- [x] **RLS Policies**: PostgreSQL RLS enforces document access at database level
- [x] **Audit Trail**: All document views logged (who, when, IP address, duration)
- [x] **Download Restrictions**: Only Senior Officers can bulk download documents
- [x] **Watermark on Download**: Downloaded documents watermarked with admin details

---

## 2. Applicant Data Privacy

### 2.1 Personal Identifiable Information (PII) Protection
- [x] **Database Encryption**: PII columns encrypted at rest (PostgreSQL pgcrypto)
- [x] **TLS/SSL**: All data in transit encrypted (TLS 1.3)
- [x] **Field-Level Encryption**: Aadhar, mobile, email encrypted with unique keys
- [x] **Masking in UI**: Aadhar displayed as XXXX-XXXX-1234 in UI
- [x] **Access Logs**: Every PII access logged for audit

**Encrypted Fields**:
```sql
-- Encrypted in database
aadhar_number_encrypted
mobile_encrypted
email_encrypted
parent_mobile_encrypted
annual_income_encrypted
```

### 2.2 Data Retention & Deletion
- [x] **7-Year Retention**: Admission data retained for 7 years (regulatory requirement)
- [x] **Right to Erasure**: Rejected candidates can request data deletion after 2 years
- [x] **Anonymization**: Deleted records anonymized (PII removed, application data retained for analytics)
- [x] **Backup Encryption**: All backups encrypted with separate keys
- [x] **Secure Deletion**: Physical deletion uses secure erase (overwrite 7 times)

### 2.3 Data Minimization
- [x] **Only Necessary Data**: Collect only data required for admission process
- [x] **No Sensitive Medical Data**: No health information collected
- [x] **Optional Fields**: Religion, caste optional (only for reservation category)
- [x] **Consent Tracking**: Explicit consent recorded for data processing

---

## 3. Payment Security

### 3.1 PCI DSS Compliance
- [x] **Level 1 PCI DSS**: Razorpay/HDFC gateway compliance certified
- [x] **No Card Storage**: Card details never stored in our database
- [x] **Tokenization**: Payment tokens used for transaction references
- [x] **3D Secure**: Mandatory 3D Secure (OTP) for card payments
- [x] **TLS 1.3**: All payment pages served over HTTPS with TLS 1.3

### 3.2 Payment Data Handling
- [x] **Webhook Validation**: Payment webhook signatures verified (HMAC-SHA256)
- [x] **Idempotency Keys**: Prevent duplicate payment processing
- [x] **Refund Security**: Only Senior Officers can initiate refunds
- [x] **Transaction Logs**: All payment attempts logged (success, failure, fraud)
- [x] **Fraud Detection**: Velocity checks (max 3 attempts per 10 minutes)

**Webhook Verification**:
```php
$signature = hash_hmac('sha256', $webhookBody, config('razorpay.webhook_secret'));
if ($signature !== $receivedSignature) {
    abort(403, 'Invalid webhook signature');
}
```

### 3.3 Payment Reconciliation
- [x] **Daily Reconciliation**: Automated reconciliation with payment gateway at 2 AM
- [x] **Mismatch Alerts**: Email alerts for any payment mismatches
- [x] **Audit Trail**: Complete payment lifecycle logged (initiated → processing → completed)
- [x] **Receipt Generation**: Encrypted PDFs with unique receipt numbers

---

## 4. Authentication & Access Control

### 4.1 Admin Authentication
- [x] **BCrypt Hashing**: Passwords hashed with BCrypt (cost factor 12)
- [x] **Password Policy**: Min 12 chars, uppercase, lowercase, number, special char
- [x] **2FA Enabled**: 85% staff adoption (TOTP via Google Authenticator)
- [x] **Session Management**: Redis-based sessions (2-hour access token, 8-hour absolute timeout)
- [x] **Failed Login Lockout**: 5 attempts → 30-minute lockout
- [x] **Password Expiry**: Mandatory change every 90 days

### 4.2 Role-Based Access Control (RBAC)
- [x] **Least Privilege**: Document verifiers can only access assigned applications
- [x] **RLS Policies**: PostgreSQL RLS enforces row-level security
- [x] **Permission Matrix**: 6 roles with granular permissions (see auth_and_permissions.md)
- [x] **Role Audit**: All role changes logged with reason

**RLS Policy Test**:
```sql
SET app.current_staff_id = 'STAFF-2024-00045';
SELECT COUNT(*) FROM applications;
-- Document verifier should only see assigned applications
```

### 4.3 API Security
- [x] **JWT Tokens**: RS256 asymmetric signing (2-hour expiry)
- [x] **Rate Limiting**: 100 req/min per endpoint
- [x] **CORS Restrictions**: Only whitelisted domains allowed
- [x] **API Key Rotation**: API keys rotated every 90 days
- [x] **Request Validation**: Zod/Joi schema validation on all inputs

---

## 5. Infrastructure Security

### 5.1 Network Security
- [x] **WAF (Web Application Firewall)**: AWS WAF enabled (blocks SQL injection, XSS)
- [x] **DDoS Protection**: CloudFlare DDoS protection (99.99% uptime)
- [x] **VPC Isolation**: Database in private subnet (no public IP)
- [x] **Security Groups**: Strict inbound/outbound rules (only port 443, 5432)
- [x] **Bastion Host**: SSH access only via bastion host (2FA required)

### 5.2 Database Security
- [x] **PostgreSQL RLS**: Row-level security enforced at database level
- [x] **Encrypted Connections**: SSL/TLS required for all database connections
- [x] **Parameterized Queries**: No raw SQL (prevents SQL injection)
- [x] **Regular Backups**: Daily automated backups (30-day retention)
- [x] **Backup Encryption**: Backups encrypted with AES-256

**Database Connection**:
```bash
psql "postgresql://user:pass@db-host:5432/admission_db?sslmode=require"
```

### 5.3 Server Security
- [x] **OS Hardening**: Ubuntu 22.04 LTS with automatic security updates
- [x] **Firewall**: UFW enabled (only ports 80, 443 open)
- [x] **SSH Hardening**: Password authentication disabled (key-based only)
- [x] **Fail2Ban**: Automatic IP blocking after 3 failed SSH attempts
- [x] **Log Monitoring**: Centralized logging to AWS CloudWatch

---

## 6. OCR Service Security

### 6.1 AWS Textract Security
- [x] **IAM Role Restrictions**: Textract role can only access admission-documents bucket
- [x] **Data Residency**: Documents processed in India region (Mumbai)
- [x] **Data Deletion**: OCR results deleted after 24 hours
- [x] **Audit Logging**: All Textract API calls logged to CloudTrail
- [x] **Cost Monitoring**: Budget alerts for abnormal API usage (potential attack)

### 6.2 OCR Data Validation
- [x] **Confidence Threshold**: OCR results <85% confidence flagged for manual review
- [x] **Cross-Validation**: OCR data compared with application data
- [x] **Fraud Detection**: Known fraudulent patterns detected (fake marksheets)
- [x] **Human Review**: All documents manually reviewed (OCR assists, not replaces)

---

## 7. Fraud Detection & Prevention

### 7.1 Application Fraud Detection
- [x] **Duplicate Detection**: Email, mobile, Aadhar checked for duplicates
- [x] **IP Tracking**: Multiple applications from same IP flagged
- [x] **Velocity Checks**: Max 3 applications per IP per day
- [x] **Document Similarity**: Image hashing detects reused documents
- [x] **Anomaly Detection**: ML model flags suspicious applications (95% accuracy)

### 7.2 Payment Fraud Detection
- [x] **Card BIN Checks**: High-risk card BINs flagged
- [x] **Geolocation**: Payment location vs applicant location mismatch flagged
- [x] **Velocity Limits**: Max 3 payment attempts per 10 minutes
- [x] **Failed Transaction Monitoring**: Repeated failures investigated

---

## 8. Compliance & Auditing

### 8.1 Regulatory Compliance
- [x] **RTI Act Compliance**: Admission data accessible under Right to Information Act
- [x] **AICTE Guidelines**: Admission process follows AICTE norms
- [x] **State Regulations**: Compliance with Maharashtra admission rules
- [x] **Reservation Quotas**: OBC 27%, SC 15%, ST 7.5% correctly implemented

### 8.2 Audit Logging
- [x] **7-Year Retention**: All audit logs retained for 7 years
- [x] **Immutable Logs**: Logs stored in append-only format (cannot be modified)
- [x] **Comprehensive Logging**: Login, logout, document access, merit list generation, seat allocation
- [x] **Real-Time Alerts**: Suspicious activities trigger immediate Slack/email alerts

**Audit Log Query**:
```sql
SELECT * FROM audit_logs 
WHERE action = 'merit_list.publish' 
AND created_at > NOW() - INTERVAL '30 days';
```

### 8.3 Security Audits
- [x] **Quarterly Penetration Testing**: External security firm (last: Sept 2025)
- [x] **Annual SOC 2 Audit**: SOC 2 Type II compliance
- [x] **Vulnerability Scanning**: Weekly automated scans (OWASP ZAP, Nessus)
- [x] **Code Reviews**: Mandatory security review for critical changes

---

## 9. Incident Response

### 9.1 Incident Detection
- [x] **SIEM Integration**: Splunk/ELK for log analysis
- [x] **Anomaly Detection**: ML-based anomaly detection (unusual access patterns)
- [x] **Alerting**: PagerDuty integration for critical security events
- [x] **Monitoring Dashboard**: Real-time security dashboard (Grafana)

### 9.2 Incident Response Plan
- [x] **Runbook**: Documented incident response procedures
- [x] **24/7 On-Call**: Security engineer on-call during admission season
- [x] **Escalation Path**: L1 → L2 → CISO → Senior Management
- [x] **Post-Incident Review**: Root cause analysis after every security incident

### 9.3 Backup & Recovery
- [x] **Daily Backups**: Automated daily backups at 2 AM
- [x] **30-Day Retention**: Backups retained for 30 days
- [x] **Tested Recovery**: Monthly disaster recovery drills (RTO: 4 hours, RPO: 24 hours)
- [x] **Off-Site Storage**: Backups stored in separate AWS region

---

## 10. Security Scorecard

| Category | Score | Status |
|----------|-------|--------|
| Document Security | 95/100 | ✅ Excellent |
| Data Privacy | 98/100 | ✅ Excellent |
| Payment Security | 100/100 | ✅ Excellent |
| Authentication | 92/100 | ✅ Excellent |
| Infrastructure Security | 94/100 | ✅ Excellent |
| OCR Security | 90/100 | ✅ Good |
| Fraud Detection | 96/100 | ✅ Excellent |
| Compliance & Auditing | 98/100 | ✅ Excellent |

**Overall Security Score**: 95.4/100 ✅

---

## 11. Security Todos (Continuous Improvement)

- [ ] Implement WebAuthn (passwordless login) for admins
- [ ] Deploy honeypot servers to detect attackers
- [ ] Integrate threat intelligence feeds (known fraudulent IPs)
- [ ] Implement blockchain-based immutable audit logs
- [ ] Add biometric authentication for document verification coordinators
- [x] Enable AWS GuardDuty for threat detection
- [x] Implement CSRF tokens on all forms
- [x] Deploy Content Security Policy (CSP) headers

---

**Security Audit Status**: ✅ Passed (Last Audit: September 2025)  
**Next Audit Due**: December 2025  
**Critical Vulnerabilities**: 0  
**High Vulnerabilities**: 0  
**Medium Vulnerabilities**: 2 (scheduled for Q4 2025 fix)
