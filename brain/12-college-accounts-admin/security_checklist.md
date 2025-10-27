# College Accounts Admin Portal - Security Checklist

**Priority Level**: CRITICAL  
**Compliance Requirements**: Financial data security, audit trail  
**Review Frequency**: Pre-deployment + Monthly audits

---

## Security Categories (120 Checkpoints)

### 1. Authentication Security (15 checkpoints)

#### Password Security
- [ ] **Strong password policy enforced**
  - Minimum 12 characters
  - Must contain: uppercase, lowercase, number, special character
  - No common passwords (checked against dictionary)
  - Cannot reuse last 5 passwords

- [ ] **Password expiration policy**
  - Force password change every 90 days
  - Warning at 14 days before expiration
  - Grace period: 3 days after expiration

- [ ] **Account lockout mechanism**
  - Lock after 5 failed login attempts
  - Lockout duration: 30 minutes
  - Admin notification after 3 lockouts in 24 hours

- [ ] **Password reset flow secure**
  - Email verification required
  - Reset token valid for 1 hour only
  - Token is single-use and invalidated after use
  - Old password cannot be used

#### Session Management
- [ ] **Session timeout configured**
  - Idle timeout: 30 minutes
  - Absolute timeout: 8 hours
  - Warning 5 minutes before timeout

- [ ] **Secure session storage**
  - Sessions stored in Redis with encryption
  - Session ID regenerated on login
  - HttpOnly and Secure flags on cookies

#### Multi-Factor Authentication
- [ ] **MFA enforced for high-value operations**
  - Required for payments > ₹50,000
  - Required for vendor bank account changes
  - Required for budget modifications

- [ ] **MFA backup codes provided**
  - 10 single-use backup codes generated
  - Securely stored with encryption
  - User notified when backup codes used

- [ ] **MFA recovery process secure**
  - Admin approval required for MFA reset
  - Identity verification via alternate channel
  - Audit log entry created

#### Login Security
- [ ] **Login rate limiting active**
  - 5 attempts per IP per minute
  - 10 attempts per user per hour
  - Exponential backoff after failed attempts

- [ ] **Suspicious login detection**
  - Alert on login from new device/location
  - Email notification to user
  - Require additional verification

- [ ] **Login audit trail maintained**
  - All login attempts logged
  - IP address, user agent, timestamp recorded
  - Failed attempts tracked separately

- [ ] **Concurrent session limit**
  - Maximum 3 concurrent sessions per user
  - Oldest session terminated when limit exceeded
  - User notified of new session

- [ ] **Session hijacking prevention**
  - IP address validation
  - User agent validation
  - Session fingerprinting

- [ ] **Brute force protection**
  - Progressive delays after failed attempts
  - CAPTCHA after 3 failed attempts
  - IP blocking after 10 attempts

---

### 2. Authorization & Access Control (18 checkpoints)

#### Role-Based Access Control
- [ ] **Roles properly defined**
  - college_accounts_admin role created
  - Permissions assigned per role specification
  - No users with elevated privileges

- [ ] **Permission checks enforced**
  - Middleware applied to all routes
  - Policy checks in controllers
  - Frontend permission checks for UI elements

- [ ] **Least privilege principle**
  - Users have minimum required permissions
  - No wildcard permissions granted
  - Regular permission audits scheduled

#### Row-Level Security
- [ ] **College data isolation enforced**
  - Global scope filters by college_id
  - All queries include college_id check
  - No cross-college data access possible

- [ ] **Resource ownership validated**
  - Created by user tracked
  - Ownership checked before modifications
  - Transfer of ownership logged

#### API Authorization
- [ ] **Token-based authentication**
  - Sanctum tokens used for API
  - Tokens expire after 8 hours
  - Token refresh mechanism implemented

- [ ] **Token scope validation**
  - API endpoints check token abilities
  - Scopes match required permissions
  - Invalid scope returns 403 error

- [ ] **API key rotation**
  - API keys rotated every 90 days
  - Old keys valid for 7-day grace period
  - Rotation reminders sent at 14 days

#### Policy Enforcement
- [ ] **Expense policy enforced**
  - Draft/rejected expenses editable only
  - Approved expenses immutable
  - Delete restricted to draft status

- [ ] **Payment policy enforced**
  - Only scheduled payments executable
  - Cancel restricted to scheduled/processing
  - Dual approval for > ₹50K

- [ ] **Vendor policy enforced**
  - Blacklist action requires approval
  - Bank details change requires verification
  - Vendor deletion soft-delete only

- [ ] **Purchase order policy enforced**
  - PO approval workflow validated
  - Goods receipt requires PO approval
  - PO closure requires full receipt

#### Audit Trail
- [ ] **All actions logged**
  - User ID, action, timestamp recorded
  - IP address and user agent logged
  - Changes tracked in JSONB field

- [ ] **Immutable audit logs**
  - Logs cannot be modified
  - Deletion restricted to admins only
  - 7-year retention for compliance

- [ ] **Sensitive action alerts**
  - Payment execution sends notification
  - Budget modification alerts principal
  - Vendor blacklist alerts admin

#### Admin Controls
- [ ] **Admin override logged**
  - Admin actions tagged separately
  - Reason required for overrides
  - Principal notified of overrides

- [ ] **Emergency access procedure**
  - Break-glass account available
  - Usage triggers immediate alert
  - Post-incident review required

- [ ] **Privilege escalation prevention**
  - Users cannot grant own permissions
  - Role changes require approval
  - Permission changes audited

---

### 3. Data Protection (22 checkpoints)

#### Encryption
- [ ] **Data encrypted at rest**
  - Database encryption enabled
  - AES-256 encryption used
  - Encryption keys rotated annually

- [ ] **Data encrypted in transit**
  - TLS 1.3 enforced
  - SSL certificates valid and not expired
  - HSTS header configured

- [ ] **Sensitive fields encrypted**
  - Bank account numbers encrypted
  - Vendor GST numbers encrypted
  - PAN numbers encrypted

- [ ] **Encryption key management**
  - Keys stored in AWS KMS
  - Separate keys per environment
  - Key rotation automated

#### Data Masking
- [ ] **PII masked in logs**
  - Bank account numbers masked (show last 4 digits)
  - Emails partially hidden (a***@domain.com)
  - Phone numbers masked (show last 4 digits)

- [ ] **Sensitive data redacted in exports**
  - Full account numbers not exported
  - Financial details require permission
  - Export actions logged

#### Data Retention
- [ ] **Retention policy defined**
  - Expenses: 7 years (compliance)
  - Payments: 7 years (compliance)
  - Audit logs: 7 years (compliance)
  - Session data: 30 days

- [ ] **Data deletion secure**
  - Soft delete for financial records
  - Hard delete after retention period
  - Deletion logged in audit trail

#### Backup & Recovery
- [ ] **Automated daily backups**
  - Full backup at 2 AM daily
  - Incremental backups every 6 hours
  - Backups encrypted at rest

- [ ] **Backup stored securely**
  - Separate AWS S3 bucket
  - Versioning enabled
  - Cross-region replication

- [ ] **Backup restoration tested**
  - Monthly restoration drill
  - RTO: 4 hours
  - RPO: 1 hour

- [ ] **Point-in-time recovery available**
  - 30-day recovery window
  - Transaction logs retained
  - Recovery tested quarterly

#### Data Validation
- [ ] **Input validation enforced**
  - All form inputs validated server-side
  - Type checking for amounts
  - Length validation for text fields

- [ ] **SQL injection prevention**
  - Prepared statements used exclusively
  - ORM (Eloquent) used for queries
  - No raw SQL with user input

- [ ] **XSS prevention**
  - Output encoding applied
  - Content Security Policy configured
  - HTML sanitization library used

- [ ] **CSRF protection enabled**
  - CSRF tokens required for state changes
  - Token validation on server
  - Token regeneration after login

#### Data Integrity
- [ ] **Amount validation**
  - Positive values only (CHECK constraint)
  - Decimal precision enforced (2 places)
  - Maximum amount limit: ₹10 Crore

- [ ] **Foreign key constraints**
  - All relationships enforced at DB level
  - ON DELETE RESTRICT for financial data
  - Referential integrity maintained

- [ ] **Transaction atomicity**
  - Database transactions used
  - Rollback on failure
  - ACID properties ensured

- [ ] **Duplicate prevention**
  - Unique constraints on expense_number
  - Duplicate payment detection
  - Invoice number uniqueness enforced

#### Privacy Compliance
- [ ] **GDPR compliance (if applicable)**
  - Data access request process
  - Right to erasure implemented
  - Consent tracking

- [ ] **Data minimization**
  - Only necessary data collected
  - Unused fields removed
  - Regular data audit

---

### 4. API Security (15 checkpoints)

#### Authentication
- [ ] **API authentication required**
  - All endpoints except /login protected
  - Bearer token required in header
  - Invalid token returns 401

- [ ] **Token validation strict**
  - Token expiration checked
  - Token signature verified
  - Revoked tokens rejected

#### Rate Limiting
- [ ] **General rate limit enforced**
  - 60 requests per minute per user
  - 429 status code on exceeded
  - Retry-After header provided

- [ ] **Payment endpoint rate limit**
  - 5 requests per minute for /payments/execute
  - 10 requests per minute for /payments
  - Stricter limit for sensitive operations

- [ ] **IP-based rate limiting**
  - 100 requests per minute per IP
  - Protects against DDoS
  - Whitelist for trusted IPs

#### Input Validation
- [ ] **Request validation**
  - Laravel Form Requests used
  - JSON schema validation
  - Type coercion prevented

- [ ] **File upload validation**
  - File type whitelist (PDF, JPG, PNG)
  - Maximum size: 5 MB
  - Virus scanning enabled

- [ ] **Amount validation**
  - Negative amounts rejected
  - Decimal precision validated
  - Maximum limit enforced

#### Output Security
- [ ] **Error messages sanitized**
  - No stack traces in production
  - Generic error messages
  - Detailed logs server-side only

- [ ] **Response data filtered**
  - API resources used for transformation
  - Sensitive fields excluded
  - Consistent response format

#### API Versioning
- [ ] **API versioning implemented**
  - Version in URL (/api/v1/)
  - Deprecated versions documented
  - Sunset header for old versions

#### CORS Configuration
- [ ] **CORS properly configured**
  - Allowed origins whitelisted
  - Credentials allowed for trusted origins
  - Preflight requests handled

#### Security Headers
- [ ] **Security headers set**
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Strict-Transport-Security configured

- [ ] **Content Security Policy**
  - CSP header configured
  - Inline scripts disallowed
  - Trusted sources whitelisted

#### API Documentation
- [ ] **API documentation access restricted**
  - Swagger UI requires authentication
  - Internal documentation only
  - No sensitive examples

---

### 5. Financial Transaction Security (20 checkpoints)

#### Payment Processing
- [ ] **Dual approval for high-value**
  - Payments > ₹50,000 require principal approval
  - Workflow enforced in code
  - Approval tracked in database

- [ ] **Payment confirmation required**
  - OTP sent via SMS/email
  - OTP valid for 5 minutes
  - Single-use OTP

- [ ] **Bank account verification**
  - Penny drop verification for new accounts
  - Account holder name match
  - IFSC code validation

- [ ] **Payment limit enforcement**
  - Daily limit: ₹5 Lakh per user
  - Per-transaction limit: ₹2 Lakh
  - Limits configurable by admin

- [ ] **Payment fraud detection**
  - Duplicate payment check (amount + vendor + date)
  - Unusual pattern detection (time, amount)
  - Alert on threshold breach

- [ ] **Payment reversal audit**
  - Reversal requires approval
  - Reason mandatory
  - Cannot reverse completed payments > 7 days

#### Expense Management
- [ ] **Budget check before approval**
  - Available budget validated
  - Buffer of 10% maintained
  - Alert if 90% utilized

- [ ] **Receipt requirement enforced**
  - Mandatory for amounts > ₹5,000
  - File size and type validated
  - Receipt URL secured (signed URL)

- [ ] **Expense approval workflow**
  - Self-approval prevented
  - Approver must have permission
  - Approval deadline: 7 days

- [ ] **Expense modification restricted**
  - Only draft/rejected editable
  - Modification tracked in audit log
  - Version history maintained

#### Vendor Management
- [ ] **Vendor onboarding verification**
  - GST number validated via API
  - PAN verification
  - Bank account verification

- [ ] **Vendor blacklist process**
  - Requires admin approval
  - Reason mandatory
  - Pending payments blocked

- [ ] **Vendor payment terms enforced**
  - Payment within agreed terms
  - Early payment requires approval
  - Late payment alerts

#### Purchase Orders
- [ ] **PO approval workflow**
  - POs > ₹1 Lakh require approval
  - Three-way matching (PO + GRN + Invoice)
  - Partial receipts tracked

- [ ] **PO modification restricted**
  - Cannot modify after approval
  - Amendments create new version
  - Original PO immutable

#### Invoice Management
- [ ] **Duplicate invoice detection**
  - Invoice number uniqueness per vendor
  - Amount + vendor + date check
  - Alert on potential duplicate

- [ ] **Invoice matching**
  - Match to PO before payment
  - Quantity and amount validation
  - Discrepancy flagged for review

#### Budget Management
- [ ] **Budget allocation limits**
  - Cannot exceed total budget
  - Category-wise allocation
  - Reallocation requires approval

- [ ] **Budget utilization monitoring**
  - Real-time utilization tracking
  - Alert at 70%, 90%, 100%
  - Overspending prevention

- [ ] **Budget variance analysis**
  - Monthly variance calculated
  - Significant variance (>10%) flagged
  - Explanation required for variance

---

### 6. Infrastructure Security (12 checkpoints)

#### Network Security
- [ ] **Firewall configured**
  - Only ports 80, 443 open
  - SSH restricted to VPN only
  - Database port not exposed

- [ ] **VPC isolation**
  - Database in private subnet
  - Application in public subnet with ALB
  - NAT gateway for outbound traffic

- [ ] **IP whitelisting**
  - Admin panel accessible from office IPs only
  - Payment processing from whitelisted IPs
  - IP blacklist for suspicious IPs

#### Server Hardening
- [ ] **OS hardening applied**
  - Unnecessary services disabled
  - Security patches auto-applied
  - Root login disabled

- [ ] **SSH hardening**
  - Key-based authentication only
  - Password authentication disabled
  - Non-standard port used

- [ ] **File permissions secure**
  - Web files owned by www-data
  - No world-writable files
  - Sensitive files not in web root

#### Database Security
- [ ] **Database access restricted**
  - Accessible from app servers only
  - SSL connection required
  - No public database endpoint

- [ ] **Database user privileges minimal**
  - Application user has limited permissions
  - No DROP/ALTER permissions
  - Separate read-only user for reports

- [ ] **Database backup encrypted**
  - Backups encrypted at rest
  - Backup access restricted
  - Restoration tested monthly

#### Container Security (if using Docker)
- [ ] **Base images from trusted sources**
  - Official images used
  - Images scanned for vulnerabilities
  - Regular image updates

- [ ] **Containers run as non-root**
  - User directive in Dockerfile
  - Privilege escalation disabled
  - Read-only file system where possible

- [ ] **Secrets management**
  - Secrets not in images
  - Environment variables for secrets
  - AWS Secrets Manager integration

---

### 7. Application Security (10 checkpoints)

#### Dependency Management
- [ ] **Dependencies up-to-date**
  - Weekly dependency check
  - Security patches applied promptly
  - composer audit run regularly

- [ ] **Vulnerable dependencies removed**
  - No packages with known CVEs
  - Alternatives found for vulnerable packages
  - Security advisories monitored

#### Code Quality
- [ ] **Static analysis enabled**
  - PHPStan level 8+ enforced
  - No critical issues in codebase
  - Analysis in CI/CD pipeline

- [ ] **Code review mandatory**
  - All changes peer-reviewed
  - Security checklist in PR template
  - Senior review for critical changes

- [ ] **Linting enforced**
  - PSR-12 coding standard
  - PHP CS Fixer in pre-commit hook
  - ESLint for frontend code

#### Secure Coding Practices
- [ ] **No hardcoded secrets**
  - API keys in environment variables
  - Database credentials in .env
  - No secrets in version control

- [ ] **Error handling secure**
  - Try-catch blocks for exceptions
  - User-friendly error messages
  - Stack traces not exposed

- [ ] **Logging secure**
  - No sensitive data in logs
  - Logs rotated daily
  - Log access restricted

#### File Upload Security
- [ ] **File upload validation**
  - Type validation (MIME + extension)
  - Size limit enforced
  - File content validation

- [ ] **Uploaded files stored securely**
  - Outside web root or in S3
  - Signed URLs for access
  - Expiring links for receipts

---

### 8. Monitoring & Alerting (8 checkpoints)

#### Security Monitoring
- [ ] **Failed login monitoring**
  - Alert after 10 failed logins
  - Slack/email notification
  - IP blocking automated

- [ ] **Suspicious transaction monitoring**
  - Unusual amounts flagged
  - Off-hours transactions alerted
  - Rapid consecutive payments flagged

- [ ] **Budget overrun alerts**
  - Alert at 90% utilization
  - Daily digest to principal
  - Critical alert at 100%

#### Application Monitoring
- [ ] **Uptime monitoring**
  - Health check every 5 minutes
  - Alert on downtime > 2 minutes
  - SLA: 99.5% uptime

- [ ] **Performance monitoring**
  - APM tool integrated (New Relic/Datadog)
  - Slow queries logged
  - p95 latency < 1000ms

- [ ] **Error tracking**
  - Sentry integration for error tracking
  - Critical errors alert immediately
  - Error trends analyzed weekly

#### Audit & Compliance
- [ ] **Audit log review**
  - Monthly audit log review
  - Anomalies investigated
  - Report to compliance officer

- [ ] **Compliance reporting**
  - Monthly compliance report
  - Security metrics tracked
  - Incident response time logged

---

## Pre-Deployment Checklist

### Critical (Must be 100% before go-live)
- [ ] All authentication checkpoints passed
- [ ] All authorization checkpoints passed
- [ ] All data protection checkpoints passed
- [ ] All financial transaction checkpoints passed
- [ ] Penetration testing completed
- [ ] Security audit by external firm

### High Priority (Resolve within 7 days of launch)
- [ ] All API security checkpoints passed
- [ ] All infrastructure checkpoints passed
- [ ] All monitoring checkpoints passed

### Medium Priority (Resolve within 30 days)
- [ ] All application security checkpoints passed

---

## Security Incident Response

### Severity Levels
1. **Critical**: Data breach, payment fraud, unauthorized access
   - Response time: Immediate (< 15 minutes)
   - Escalation: CEO, CTO, Legal

2. **High**: Service outage, vulnerability exploitation attempt
   - Response time: < 1 hour
   - Escalation: CTO, Security team

3. **Medium**: Suspicious activity, unusual patterns
   - Response time: < 4 hours
   - Escalation: Security team

### Incident Response Steps
1. **Detect**: Monitoring alerts, user reports
2. **Contain**: Isolate affected systems, revoke tokens
3. **Investigate**: Analyze logs, identify root cause
4. **Remediate**: Patch vulnerability, restore service
5. **Document**: Incident report, lessons learned
6. **Communicate**: Notify affected users, regulatory bodies if required

---

*This comprehensive security checklist ensures the College Accounts Admin portal meets industry-standard security requirements for financial applications.*
