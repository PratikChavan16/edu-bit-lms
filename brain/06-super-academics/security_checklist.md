# Super Academics Portal - Security Checklist

## Overview
Comprehensive security checklist for the Super Academics portal covering authentication, authorization, data protection, infrastructure security, compliance, and operational security practices.

---

## Table of Contents
1. [Authentication Security](#1-authentication-security)
2. [Authorization & Access Control](#2-authorization--access-control)
3. [Data Protection](#3-data-protection)
4. [API Security](#4-api-security)
5. [Infrastructure Security](#5-infrastructure-security)
6. [Application Security](#6-application-security)
7. [Database Security](#7-database-security)
8. [Monitoring & Logging](#8-monitoring--logging)
9. [Incident Response](#9-incident-response)
10. [Compliance & Governance](#10-compliance--governance)

---

## 1. Authentication Security

### 1.1 Password Security
- [ ] **Strong Password Policy Enforced**
  - Minimum 12 characters
  - Requires uppercase, lowercase, numbers, special characters
  - Password complexity validation using custom rule
  ```php
  'password' => ['required', new StrongPassword()]
  ```

- [ ] **Password Hashing**
  - Uses bcrypt with cost factor 12
  - Never store plain text passwords
  ```php
  Hash::make($password, ['rounds' => 12])
  ```

- [ ] **Password History**
  - Prevent reuse of last 5 passwords
  - Store hashed password history in `password_history` table

- [ ] **Password Expiration**
  - Force password change every 90 days for admin users
  - Email notification 7 days before expiration

### 1.2 Multi-Factor Authentication (MFA)
- [ ] **TOTP-Based MFA Implemented**
  - Google Authenticator / Authy compatible
  - Using `pragmarx/google2fa` package

- [ ] **Mandatory MFA for Roles**
  - Required for `super_academics_admin`
  - Required for `curriculum_manager`
  - Required for `examination_coordinator`

- [ ] **MFA Recovery Codes**
  - Generate 10 single-use recovery codes
  - Store encrypted recovery codes
  - Allow regeneration after verification

- [ ] **MFA Bypass Prevention**
  - No session persistence without MFA verification
  - Re-verify MFA after 24 hours of inactivity

### 1.3 Session Management
- [ ] **Secure Session Configuration**
  ```php
  'lifetime' => 120, // 2 hours
  'expire_on_close' => true,
  'encrypt' => true,
  'http_only' => true,
  'same_site' => 'strict',
  'secure' => true, // HTTPS only
  ```

- [ ] **Session Fixation Prevention**
  - Regenerate session ID on login
  ```php
  $request->session()->regenerate();
  ```

- [ ] **Concurrent Session Control**
  - Limit to 3 active sessions per user
  - Revoke oldest session if limit exceeded

- [ ] **Idle Session Timeout**
  - Auto-logout after 30 minutes of inactivity
  - Show countdown warning at 25 minutes

### 1.4 Account Security
- [ ] **Account Lockout Policy**
  - Lock account after 5 failed login attempts
  - Lockout duration: 15 minutes
  - Email notification on lockout

- [ ] **Login Anomaly Detection**
  - Track login IP addresses
  - Alert on login from new IP/device
  - Require email verification for suspicious logins

- [ ] **Email Verification Required**
  - Verify email before granting access
  - Send verification link on registration
  - Expire verification links after 24 hours

---

## 2. Authorization & Access Control

### 2.1 Role-Based Access Control (RBAC)
- [ ] **Roles Properly Defined**
  - `super_academics_admin`: Full access
  - `super_academics_analyst`: Read-only + reporting
  - `curriculum_manager`: Curriculum management
  - `examination_coordinator`: Exam management
  - `compliance_officer`: Compliance monitoring

- [ ] **Permissions Granularly Assigned**
  - 30+ specific permissions defined
  - Permissions mapped to business actions
  - No overly broad permissions like `*:all`

- [ ] **Permission Middleware Applied**
  ```php
  Route::post('/curriculum', [CurriculumController::class, 'store'])
      ->middleware('permission:create:curricula');
  ```

### 2.2 Policy-Based Authorization
- [ ] **Policies Implemented for All Models**
  - `CurriculumPolicy`: view, create, update, delete, publish, approve
  - `ExamSchedulePolicy`: view, create, update, delete, publish
  - `ApprovalPolicy`: view, approve, reject, requestChanges

- [ ] **Policy Checks in Controllers**
  ```php
  $this->authorize('update', $curriculum);
  ```

- [ ] **Ownership Validation**
  - Users cannot approve their own submissions
  - Draft curricula can only be deleted by creator

### 2.3 Row-Level Security
- [ ] **College-Based Data Isolation**
  - College principals see only their college data
  - Super admins see all data
  - Global scopes applied where necessary

- [ ] **Soft Deletes Enforced**
  - All sensitive tables use soft deletes
  - Deleted records excluded from queries by default
  - Only admins can view deleted records

---

## 3. Data Protection

### 3.1 Encryption
- [ ] **Data at Rest Encryption**
  - PostgreSQL transparent data encryption (TDE) enabled
  - Sensitive fields encrypted using Laravel encryption
  ```php
  $user->two_factor_secret = encrypt($secret);
  ```

- [ ] **Encrypted Database Columns**
  - `two_factor_secret`
  - `recovery_codes`
  - `api_credentials` (for external integrations)

- [ ] **Data in Transit Encryption**
  - TLS 1.3 enforced for all connections
  - HTTPS mandatory (redirect HTTP to HTTPS)
  - Database connections use SSL/TLS

### 3.2 Data Masking
- [ ] **PII Masking in Logs**
  - Email addresses partially masked in logs
  - Phone numbers masked (e.g., `+91****56789`)
  - Never log passwords or tokens

- [ ] **API Response Sanitization**
  - Remove sensitive fields from API responses
  - Use Laravel Resources for controlled output
  ```php
  class UserResource extends JsonResource
  {
      public function toArray($request)
      {
          return [
              'id' => $this->id,
              'name' => $this->name,
              'email' => $this->email,
              // 'password' => excluded
          ];
      }
  }
  ```

### 3.3 Data Retention
- [ ] **Retention Policy Defined**
  - Audit logs retained for 7 years (compliance requirement)
  - Exam results retained for 10 years
  - Curriculum versions retained indefinitely

- [ ] **Data Purging Schedule**
  - Soft-deleted records permanently deleted after 90 days
  - Expired sessions purged daily
  - Old audit logs archived to cold storage annually

### 3.4 Backup & Recovery
- [ ] **Automated Daily Backups**
  - Full database backup at 2 AM UTC
  - Incremental backups every 4 hours
  - Backup retention: 30 days

- [ ] **Backup Encryption**
  - All backups encrypted using AES-256
  - Encryption keys stored in separate vault

- [ ] **Disaster Recovery Plan**
  - RTO (Recovery Time Objective): 4 hours
  - RPO (Recovery Point Objective): 1 hour
  - Monthly disaster recovery drills

---

## 4. API Security

### 4.1 API Authentication
- [ ] **Sanctum Token Authentication**
  - All API endpoints require valid token
  - Tokens expire after 365 days (configurable)
  - Tokens can be revoked manually

- [ ] **Token Abilities (Scopes)**
  - Tokens issued with specific abilities
  - Abilities checked in middleware
  ```php
  if ($request->user()->tokenCan('create:curricula')) {
      // Allow action
  }
  ```

### 4.2 API Rate Limiting
- [ ] **Rate Limits Applied**
  - General API: 60 requests/minute per user
  - Login endpoint: 5 requests/minute per IP
  - Report generation: 10 requests/hour per user

- [ ] **Rate Limit Headers Returned**
  ```
  X-RateLimit-Limit: 60
  X-RateLimit-Remaining: 45
  X-RateLimit-Reset: 1640995200
  ```

### 4.3 Input Validation
- [ ] **All Inputs Validated**
  - Using Laravel Form Requests
  - Server-side validation mandatory (never trust client)
  ```php
  public function rules()
  {
      return [
          'program_name' => 'required|string|max:255',
          'degree_type' => 'required|in:bachelor,master,diploma',
          'total_credits' => 'required|integer|min:1|max:300',
      ];
  }
  ```

- [ ] **SQL Injection Prevention**
  - Eloquent ORM used (parameterized queries)
  - Raw queries use parameter binding
  ```php
  DB::select('SELECT * FROM curricula WHERE id = ?', [$id]);
  ```

- [ ] **XSS Prevention**
  - All outputs escaped using `{{ }}` in Blade
  - API responses use JSON encoding (auto-escaping)
  - Content Security Policy (CSP) headers set

### 4.4 API Versioning
- [ ] **Versioned Endpoints**
  - `/api/v1/curriculum`
  - Maintain backward compatibility
  - Deprecation notices 6 months before removal

---

## 5. Infrastructure Security

### 5.1 Server Hardening
- [ ] **OS Security Updates**
  - Automatic security updates enabled
  - Monthly manual review of updates
  - Test updates in staging before production

- [ ] **Firewall Configuration**
  - Only ports 80 (HTTP), 443 (HTTPS), 22 (SSH) open
  - SSH restricted to specific IP ranges
  - Fail2ban installed to block brute force

- [ ] **SSH Security**
  - Key-based authentication only (no password login)
  - Root login disabled
  - Non-standard SSH port (e.g., 2222)

### 5.2 Network Security
- [ ] **VPC Configuration**
  - Application servers in private subnet
  - Database in isolated subnet (no internet access)
  - Load balancer in public subnet

- [ ] **DDoS Protection**
  - Cloudflare or AWS Shield enabled
  - Rate limiting at load balancer level
  - Geographic IP blocking if necessary

### 5.3 Container Security (If using Docker)
- [ ] **Minimal Base Images**
  - Use Alpine Linux for smaller attack surface
  - Multi-stage builds to exclude build tools

- [ ] **Non-Root User**
  - Containers run as non-root user
  ```dockerfile
  USER www-data
  ```

- [ ] **Image Scanning**
  - Scan images for vulnerabilities using Trivy/Clair
  - Fail builds on critical vulnerabilities

---

## 6. Application Security

### 6.1 Dependency Management
- [ ] **Dependency Scanning**
  - Use `composer audit` weekly
  - GitHub Dependabot enabled for automated PRs
  - Pin dependency versions in `composer.lock`

- [ ] **Outdated Package Updates**
  - Review and update packages monthly
  - Test updates in staging environment

### 6.2 Code Security
- [ ] **Static Analysis**
  - PHPStan or Psalm in CI/CD pipeline
  - Code must pass level 7+ analysis

- [ ] **Security Linting**
  - Use `security-checker` for known vulnerabilities
  ```bash
  composer require --dev enlightn/security-checker
  security-checker security:check
  ```

- [ ] **Code Reviews**
  - All code reviewed by 2+ developers
  - Security-focused review for auth/payment code

### 6.3 Error Handling
- [ ] **Production Error Handling**
  - `APP_DEBUG=false` in production
  - Generic error messages shown to users
  - Detailed errors logged internally

- [ ] **Exception Logging**
  - All exceptions logged to centralized system
  - Sentry or Bugsnag integration for real-time alerts

---

## 7. Database Security

### 7.1 Access Control
- [ ] **Principle of Least Privilege**
  - Application user has only necessary permissions
  - No `SUPERUSER` or `CREATE DATABASE` permissions
  - Read-only user for reporting/analytics

- [ ] **Database User Separation**
  - Separate users for:
    - Application (read/write)
    - Migrations (schema changes)
    - Backups (read-only)
    - Monitoring (read-only)

### 7.2 Connection Security
- [ ] **SSL/TLS Required**
  - Database connections require SSL
  ```php
  'pgsql' => [
      'sslmode' => 'require',
      'sslcert' => env('DB_SSL_CERT'),
  ]
  ```

- [ ] **Connection Pooling**
  - PgBouncer for connection pooling
  - Limits prevent connection exhaustion attacks

### 7.3 Query Security
- [ ] **Prepared Statements**
  - All queries use prepared statements
  - No string concatenation in queries

- [ ] **Query Result Limits**
  - Paginate large result sets
  - Maximum 1000 records per query
  - Use cursors for bulk exports

---

## 8. Monitoring & Logging

### 8.1 Application Monitoring
- [ ] **Health Check Endpoints**
  - `/api/health` endpoint for uptime monitoring
  - Check database, Redis, Elasticsearch connectivity

- [ ] **Performance Monitoring**
  - Application Performance Monitoring (APM) with New Relic/Datadog
  - Track slow queries (> 1 second)
  - Monitor memory usage and CPU spikes

### 8.2 Security Monitoring
- [ ] **Failed Login Monitoring**
  - Alert on > 10 failed logins per user per hour
  - Dashboard showing failed login attempts

- [ ] **Suspicious Activity Detection**
  - Alert on mass data downloads
  - Alert on privilege escalation attempts
  - Alert on API rate limit violations

### 8.3 Audit Logging
- [ ] **Comprehensive Audit Trail**
  - Log all CRUD operations on sensitive data
  - Log permission changes
  - Log approval actions

- [ ] **Audit Log Fields**
  ```php
  [
      'user_id' => auth()->id(),
      'action' => 'curriculum.updated',
      'entity_type' => 'curriculum',
      'entity_id' => $curriculum->id,
      'changes' => $curriculum->getChanges(),
      'ip_address' => request()->ip(),
      'user_agent' => request()->userAgent(),
      'timestamp' => now(),
  ]
  ```

- [ ] **Immutable Audit Logs**
  - Audit logs cannot be modified or deleted
  - Stored in append-only table/file

### 8.4 Log Management
- [ ] **Centralized Logging**
  - ELK Stack (Elasticsearch, Logstash, Kibana) or similar
  - All logs aggregated in one place

- [ ] **Log Retention**
  - Application logs: 90 days
  - Security logs: 7 years
  - Compliance logs: Per regulatory requirements

---

## 9. Incident Response

### 9.1 Incident Response Plan
- [ ] **IR Team Defined**
  - Security Lead
  - DevOps Engineer
  - CTO/Tech Lead
  - Legal/Compliance (if needed)

- [ ] **Incident Severity Levels**
  - **Critical**: Data breach, system compromise
  - **High**: Service disruption, vulnerability exploitation
  - **Medium**: Failed security control, suspicious activity
  - **Low**: Policy violation, minor misconfiguration

### 9.2 Response Procedures
- [ ] **Detection & Analysis**
  - Automated alerts trigger investigation
  - Analyze logs and audit trails
  - Determine scope and impact

- [ ] **Containment**
  - Isolate affected systems
  - Revoke compromised credentials
  - Block malicious IPs

- [ ] **Eradication & Recovery**
  - Remove malware/backdoors
  - Patch vulnerabilities
  - Restore from clean backup

- [ ] **Post-Incident Review**
  - Root cause analysis
  - Update security controls
  - Document lessons learned

### 9.3 Communication Plan
- [ ] **Internal Communication**
  - Notify management within 1 hour of critical incident
  - Update stakeholders every 4 hours during active incident

- [ ] **External Communication**
  - Notify affected users within 72 hours (GDPR requirement)
  - Public disclosure if required by law

---

## 10. Compliance & Governance

### 10.1 Regulatory Compliance
- [ ] **GDPR Compliance** (if applicable)
  - Right to access (data export)
  - Right to erasure (data deletion)
  - Consent management for data processing
  - Data processing agreements with vendors

- [ ] **FERPA Compliance** (Educational Records)
  - Student data access controls
  - Parent/guardian consent for minor students
  - Annual notification of privacy rights

- [ ] **ISO 27001 Controls**
  - Information security policies documented
  - Regular security audits conducted
  - Security awareness training for staff

### 10.2 Security Policies
- [ ] **Acceptable Use Policy**
  - Define proper use of system
  - Prohibit unauthorized access attempts
  - Users acknowledge policy on login

- [ ] **Data Classification Policy**
  - Public, Internal, Confidential, Restricted
  - Different security controls per classification

- [ ] **Change Management Policy**
  - All changes require approval
  - Changes tested in staging first
  - Rollback plan documented

### 10.3 Security Training
- [ ] **Annual Security Training**
  - Mandatory for all users with admin access
  - Topics: Phishing, password security, social engineering

- [ ] **Phishing Simulation**
  - Quarterly simulated phishing campaigns
  - Additional training for users who fail

### 10.4 Vulnerability Management
- [ ] **Quarterly Penetration Testing**
  - External pentest by certified firm
  - Address critical findings within 30 days

- [ ] **Bug Bounty Program** (Optional)
  - Responsible disclosure program
  - Rewards for security researchers

---

## Security Checklist Summary

### Critical (Must Have)
✅ Strong password policy with MFA  
✅ Role-based access control (RBAC)  
✅ Data encryption (at rest and in transit)  
✅ SQL injection prevention  
✅ API rate limiting  
✅ Audit logging  
✅ Automated backups  
✅ Incident response plan  

### High Priority
✅ Account lockout policy  
✅ Session management  
✅ Input validation  
✅ Dependency scanning  
✅ Security monitoring  
✅ Disaster recovery plan  

### Medium Priority
✅ Password history  
✅ IP whitelisting  
✅ Penetration testing  
✅ Security training  

---

## Compliance Checklist

| Requirement | Status | Notes |
|-------------|--------|-------|
| GDPR - Right to Access | ✅ | Data export API implemented |
| GDPR - Right to Erasure | ✅ | Hard delete after 90 days |
| FERPA - Access Controls | ✅ | RBAC with granular permissions |
| FERPA - Audit Logs | ✅ | 7-year retention |
| ISO 27001 - Security Policy | ✅ | Documented and approved |
| ISO 27001 - Access Review | 🔄 | Quarterly reviews scheduled |
| PCI DSS - N/A | N/A | No payment card data stored |

---

*This security checklist ensures the Super Academics portal meets enterprise-grade security standards and regulatory compliance requirements.*
