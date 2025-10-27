# Super Non-Teaching Manager Portal - Security Checklist

**Security Standard**: OWASP Top 10 2023  
**Compliance**: GDPR, Labor Law Data Protection  
**Review Frequency**: Quarterly

---

## 1. Authentication Security (12 checkpoints)

### Password Management
- [ ] **Password Complexity**: Minimum 10 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
- [ ] **Password Rotation**: Enforce 90-day password change policy
- [ ] **Password History**: Prevent reuse of last 5 passwords
- [ ] **Default Password**: Force change on first login for new employees
- [ ] **Password Storage**: Use bcrypt with cost factor 12 minimum

### Session Security
- [ ] **Token Expiry**: Set 4-hour token expiration for Sanctum
- [ ] **Token Revocation**: Implement logout endpoint that revokes all tokens
- [ ] **Concurrent Sessions**: Limit to 3 active sessions per user
- [ ] **Session Timeout**: Auto-logout after 30 minutes of inactivity
- [ ] **Token Prefix**: Use Bearer token standard

### Failed Login Protection
- [ ] **Rate Limiting**: Max 5 failed attempts within 15 minutes
- [ ] **Account Lockout**: Lock account for 15 minutes after 5 failed attempts
- [ ] **Notification**: Email user on account lockout

---

## 2. Authorization & Access Control (15 checkpoints)

### Role-Based Access Control
- [ ] **Role Assignment**: Verify only authorized admins can assign roles
- [ ] **Permission Verification**: Check permissions on every API request
- [ ] **Super NT Manager**: Full access to all colleges verified
- [ ] **College HR**: Data isolation to single college enforced
- [ ] **Employee Role**: Self-service access only to own data

### Data Isolation
- [ ] **College Scope**: Global scope applied to filter by college_id for College HR
- [ ] **Employee Scope**: Employees can only access own attendance/leave/appraisal
- [ ] **Manager Scope**: Managers can only approve direct reports' requests
- [ ] **Cross-College**: Prevent College HR from viewing other colleges' data

### Sensitive Data Access
- [ ] **Salary View**: Only Super NT Manager can view salary fields
- [ ] **Biometric Data**: Encrypted and access logged
- [ ] **Personal Documents**: Aadhar/PAN access restricted and audited
- [ ] **Performance Ratings**: Only employee and manager can view
- [ ] **Exit Interview**: Confidential, HR only access

### Policy Enforcement
- [ ] **Policy Classes**: Implement policies for all models (Employee, Attendance, Leave, etc.)
- [ ] **Gate Checks**: Use Gate::authorize() before sensitive operations

---

## 3. Data Protection & Privacy (18 checkpoints)

### Encryption
- [ ] **Data at Rest**: PostgreSQL transparent data encryption enabled
- [ ] **Salary Encryption**: Field-level encryption using Laravel encrypted casts
- [ ] **Bank Details**: Encrypted storage for account numbers
- [ ] **Biometric Templates**: One-way hash with bcrypt, never decrypt
- [ ] **SSL/TLS**: HTTPS enforced for all API endpoints (TLS 1.3 minimum)

### PII Protection
- [ ] **Aadhar Masking**: Display only last 4 digits (****-****-1234)
- [ ] **PAN Masking**: Show only last 3 characters (******789)
- [ ] **Phone Masking**: Mask middle 4 digits in logs (98****3210)
- [ ] **Email Masking**: Hide in public-facing interfaces (j***@college.edu)

### Data Retention
- [ ] **Active Employees**: Retain all data
- [ ] **Separated Employees**: Retain for 7 years post-separation
- [ ] **Attendance Logs**: Retain for 3 years
- [ ] **Leave Records**: Retain for 3 years
- [ ] **Biometric Logs**: Retain for 2 years, then delete
- [ ] **Audit Logs**: Retain for 5 years

### GDPR Compliance
- [ ] **Data Consent**: Obtain consent for biometric data collection
- [ ] **Right to Access**: Provide employee data export on request
- [ ] **Right to Erasure**: Implement data deletion post-retention period
- [ ] **Data Portability**: Export employee data in CSV/JSON format

---

## 4. API Security (14 checkpoints)

### Input Validation
- [ ] **Request Validation**: Use FormRequest classes for all POST/PUT endpoints
- [ ] **Type Checking**: Strict type validation (employee_id must be integer)
- [ ] **Date Validation**: Validate date formats and ranges
- [ ] **Enum Validation**: Verify leave_type, status against allowed enums
- [ ] **SQL Injection**: Use parameterized queries (Eloquent ORM)
- [ ] **XSS Prevention**: Escape output in API responses (implicit in Laravel)

### Rate Limiting
- [ ] **General API**: 60 requests/minute for authenticated users
- [ ] **Anonymous API**: 10 requests/minute for public endpoints
- [ ] **Biometric Punch**: 5 requests/minute to prevent abuse
- [ ] **Login Endpoint**: 5 attempts/minute per IP
- [ ] **Report Generation**: 10 requests/hour for heavy reports

### File Upload Security
- [ ] **Allowed Types**: Restrict to PDF, JPG, PNG for documents (no executables)
- [ ] **File Size**: Max 5MB per file upload
- [ ] **Virus Scan**: Integrate ClamAV or VirusTotal API for uploaded files
- [ ] **Storage Location**: Store outside web root, serve via signed URLs

---

## 5. HR Data Security (16 checkpoints)

### Salary Confidentiality
- [ ] **Field Encryption**: Salary, bank_account_number encrypted in database
- [ ] **Access Logging**: Log every salary view with user_id and timestamp
- [ ] **Restricted View**: Only Super NT Manager can view salaries
- [ ] **Payroll Sync**: Salary data encrypted during API sync to Payroll portal

### Performance Data
- [ ] **Manager Access**: Only reporting manager can view team appraisals
- [ ] **Self-Access**: Employee can view own appraisal after manager submission
- [ ] **Rating Privacy**: Performance ratings not visible to peers
- [ ] **360 Feedback**: Feedback givers remain anonymous

### Attendance Integrity
- [ ] **Biometric Verification**: Validate device_id before accepting punch
- [ ] **Tamper Detection**: Log any manual attendance edits with reason
- [ ] **Backdated Prevention**: Restrict backdated attendance to 7 days for College HR
- [ ] **Duplicate Punch**: Prevent multiple punch-ins on same day
- [ ] **Device Authentication**: Pre-register biometric devices with unique keys

### Leave Balance Security
- [ ] **Balance Validation**: Check leave balance before approving leave
- [ ] **Negative Balance**: Database constraint prevents negative leave balance
- [ ] **Concurrent Approval**: Use database transactions to prevent race conditions
- [ ] **Carry Forward**: Validate carry-forward rules (max 5 days CL)

---

## 6. Biometric Integration Security (12 checkpoints)

### Device Authentication
- [ ] **Device Registration**: Whitelist biometric devices by MAC address/device_id
- [ ] **Pre-Shared Key**: Authenticate devices using PSK before accepting data
- [ ] **Certificate Pinning**: Pin ZKTeco device SSL certificates
- [ ] **IP Whitelisting**: Allow punch data only from college network IPs

### Data Transmission
- [ ] **TLS Encryption**: Use TLS 1.3 for device-to-server communication
- [ ] **Payload Signing**: HMAC signature on biometric data payload
- [ ] **Replay Attack**: Include timestamp and nonce in payload, reject old timestamps (>30s)
- [ ] **Data Validation**: Verify employee_id exists before storing punch

### Biometric Template Security
- [ ] **One-Way Hash**: Hash fingerprint templates with bcrypt (irreversible)
- [ ] **No Storage**: Do not store raw biometric images
- [ ] **Template Matching**: Match on device, send only employee_id to server
- [ ] **Consent**: Obtain written consent for biometric data collection

---

## 7. Employee Privacy & Compliance (10 checkpoints)

### Consent Management
- [ ] **Biometric Consent**: Obtain and store consent before collecting fingerprint/face data
- [ ] **Data Processing**: Inform employees about HR data processing purposes
- [ ] **Third-Party Sharing**: Obtain consent before sharing data with background verification

### Access Transparency
- [ ] **Audit Logs**: Log all employee data access (who viewed what, when)
- [ ] **Employee Portal**: Allow employees to view access logs for their data
- [ ] **Manager Viewing**: Notify employee when manager views performance data

### Data Minimization
- [ ] **Collect Only Necessary**: Don't collect religion, caste, health status unless legally required
- [ ] **Aadhar Usage**: Use Aadhar only for identity verification, not as employee_code
- [ ] **Personal Address**: Optional field, not mandatory

### Separation Data Handling
- [ ] **Exit Interview**: Store confidentially, HR-only access
- [ ] **Reason for Leaving**: Anonymize in attrition reports
- [ ] **F&F Settlement**: Secure calculation, prevent tampering

---

## 8. Infrastructure Security (15 checkpoints)

### Database Security
- [ ] **Connection**: Use SSL for PostgreSQL connections
- [ ] **User Privileges**: Database user has minimal required privileges (no DROP)
- [ ] **Backup Encryption**: Encrypt database backups with AES-256
- [ ] **Backup Storage**: Store backups in separate AWS S3 bucket with versioning
- [ ] **Point-in-Time Recovery**: Enable PITR with 30-day retention

### Redis Security
- [ ] **Authentication**: Set requirepass in redis.conf
- [ ] **Network Binding**: Bind Redis to localhost only
- [ ] **Encryption**: Use TLS for Redis connections (if remote)
- [ ] **Queue Security**: Sign queue jobs to prevent tampering

### Server Hardening
- [ ] **Firewall**: Open only ports 443 (HTTPS), 22 (SSH with key-only)
- [ ] **SSH**: Disable root login, use SSH keys only
- [ ] **OS Updates**: Auto-update security patches
- [ ] **Fail2ban**: Install to block brute-force SSH attempts
- [ ] **Intrusion Detection**: Install OSSEC or Wazuh

### Container Security
- [ ] **Base Images**: Use official, minimal images (alpine)
- [ ] **Image Scanning**: Scan Docker images with Trivy for vulnerabilities
- [ ] **Non-Root User**: Run containers as non-root user

---

## 9. Monitoring & Incident Response (12 checkpoints)

### Real-Time Monitoring
- [ ] **Failed Logins**: Alert on >10 failed logins in 5 minutes
- [ ] **Privilege Escalation**: Alert on role/permission changes
- [ ] **Salary Access**: Alert on bulk salary views (>50 in 10 minutes)
- [ ] **Attendance Tampering**: Alert on manual attendance edits without reason

### Anomaly Detection
- [ ] **Off-Hours Access**: Alert on HR portal access between 11 PM - 6 AM
- [ ] **Unusual Leave**: Alert on >10 leave applications from single employee
- [ ] **Mass Transfer**: Alert on >5 transfer requests in 1 hour
- [ ] **Biometric Device Offline**: Alert if device offline for >30 minutes

### Incident Response
- [ ] **Security Contact**: Designate security officer email (security@college.edu)
- [ ] **Incident Playbook**: Document response steps for data breach, unauthorized access
- [ ] **Communication Plan**: Template for notifying affected employees
- [ ] **Post-Incident Review**: Conduct review within 48 hours, document lessons

---

## 10. Code Security & DevOps (15 checkpoints)

### Secure Coding
- [ ] **Dependency Scanning**: Run `composer audit` in CI/CD pipeline
- [ ] **Static Analysis**: Use Larastan/PHPStan at level 5 minimum
- [ ] **Secret Management**: Use AWS Secrets Manager, no secrets in .env committed
- [ ] **Environment Variables**: Separate .env for dev/staging/prod

### CI/CD Security
- [ ] **Branch Protection**: Require PR reviews for main branch
- [ ] **Automated Tests**: Run PHPUnit security tests on every commit
- [ ] **Code Signing**: Sign Docker images with Docker Content Trust
- [ ] **Deployment Approval**: Manual approval required for production deployments

### Third-Party Integrations
- [ ] **API Key Rotation**: Rotate API keys every 90 days
- [ ] **Webhook Validation**: Verify HMAC signature on incoming webhooks
- [ ] **OAuth Scopes**: Request minimum required scopes for external services
- [ ] **Vendor Assessment**: Review security practices of biometric device vendor

### Logging & Auditing
- [ ] **Centralized Logs**: Ship logs to ELK stack or CloudWatch
- [ ] **Log Retention**: Retain security logs for 1 year minimum
- [ ] **PII in Logs**: Never log passwords, full Aadhar, or biometric templates
- [ ] **Audit Trail**: Maintain immutable audit trail for HR lifecycle events

### Disaster Recovery
- [ ] **Backup Testing**: Test database restore monthly
- [ ] **Failover Plan**: Document RTO (2 hours) and RPO (15 minutes) targets

---

## Security Checklist Completion Tracker

| Category | Checkpoints | Completed | % Complete |
|----------|-------------|-----------|------------|
| 1. Authentication | 12 | 0 | 0% |
| 2. Authorization | 15 | 0 | 0% |
| 3. Data Protection | 18 | 0 | 0% |
| 4. API Security | 14 | 0 | 0% |
| 5. HR Data Security | 16 | 0 | 0% |
| 6. Biometric Security | 12 | 0 | 0% |
| 7. Employee Privacy | 10 | 0 | 0% |
| 8. Infrastructure | 15 | 0 | 0% |
| 9. Monitoring | 12 | 0 | 0% |
| 10. Code & DevOps | 15 | 0 | 0% |
| **TOTAL** | **139** | **0** | **0%** |

---

## Security Review Schedule

- **Weekly**: Failed login reports, access logs review
- **Monthly**: Dependency updates (`composer update`), backup testing
- **Quarterly**: Full security audit, penetration testing
- **Annually**: GDPR compliance review, vendor security assessment

---

## Emergency Contacts

- **Security Officer**: security@college.edu
- **Database Admin**: dba@college.edu
- **DevOps Team**: devops@college.edu
- **Legal/Compliance**: legal@college.edu

---

*Complete 139-point security checklist for Super Non-Teaching Manager Portal covering authentication, data protection, biometric security, and compliance.*
