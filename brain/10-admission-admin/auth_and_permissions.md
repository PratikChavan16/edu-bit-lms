# Admission Admin Portal - Authentication & Permissions

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## 1. Authentication Methods

### Primary Authentication: Email + Password
```typescript
interface AdminCredentials {
  email: string;        // admin@institution.edu
  password: string;     // BCrypt hashed, min 12 characters
  mfa_code?: string;    // Optional 2FA (TOTP)
}
```

**Login Flow**:
1. Admin enters email + password
2. System verifies credentials (BCrypt comparison)
3. If 2FA enabled, prompt for TOTP code
4. Generate JWT token (2-hour expiry)
5. Store session in Redis (8-hour sliding expiration)

### Secondary Authentication: SSO (LDAP/Active Directory)
For enterprise integration:
```
Login URL: https://admission.institution.edu/sso/login
SAML 2.0 provider: institution-ldap.edu
```

---

## 2. Role-Based Access Control (RBAC)

### Role Hierarchy
```
Senior Admission Officer (Super Admin)
    ├── Document Verification Coordinator
    │   └── Document Verifier
    ├── Merit List Manager
    ├── Counseling Coordinator
    └── Data Entry Operator (Read-only)
```

### Role Definitions

#### Senior Admission Officer
**Permissions**:
- `admission.applications.*` (Full CRUD)
- `admission.documents.*` (View, approve/reject)
- `admission.merit_lists.*` (Create, publish, delete)
- `admission.seat_allocation.*` (Configure, run algorithm)
- `admission.staff.*` (Manage staff, assign roles)
- `admission.reports.*` (Generate all reports)
- `admission.settings.*` (Configure admission criteria, quotas)

**Use Cases**:
- Configure admission formula (60% entrance + 30% HSC + 10% extra)
- Publish merit lists
- Handle escalations (borderline cases, grievances)
- Generate executive reports

---

#### Document Verification Coordinator
**Permissions**:
- `admission.applications.read`
- `admission.documents.read`
- `admission.documents.verify` (Approve/reject)
- `admission.documents.assign` (Assign verifications to team)
- `admission.reports.verification` (Verification statistics)

**Use Cases**:
- Monitor verification queue (247 pending)
- Assign verifications to 10 team members
- Review fraud alerts
- Generate verification performance reports

**Restrictions**:
- Cannot modify application data
- Cannot access payment information
- Cannot publish merit lists

---

#### Document Verifier
**Permissions**:
- `admission.applications.read` (Assigned applications only)
- `admission.documents.read` (Assigned documents only)
- `admission.documents.verify` (Approve/reject assigned documents)

**Use Cases**:
- Verify 50-80 documents per day
- Mark documents as approved/rejected with comments
- Request re-upload from applicants

**Restrictions**:
- Can only see assigned applications
- Cannot assign work to others
- Cannot access merit lists or seat allocation

---

#### Merit List Manager
**Permissions**:
- `admission.applications.read`
- `admission.entrance_exams.read` (Fetch exam scores)
- `admission.merit_lists.create`
- `admission.merit_lists.publish`
- `admission.reports.merit` (Merit list statistics)

**Use Cases**:
- Configure merit calculation formula
- Generate merit lists
- Handle tie-breaking cases
- Publish merit lists on schedule

**Restrictions**:
- Cannot modify verified applications
- Cannot access document verification queue
- Cannot configure seat allocation

---

#### Counseling Coordinator
**Permissions**:
- `admission.merit_lists.read`
- `admission.seat_allocation.configure`
- `admission.seat_allocation.run`
- `admission.counseling.manage` (Rounds, schedules)
- `admission.notifications.send` (Counseling notifications)

**Use Cases**:
- Configure counseling rounds (dates, eligible ranks)
- Run seat allocation algorithm
- Monitor choice filling status
- Send counseling reminders

---

#### Data Entry Operator
**Permissions**:
- `admission.applications.read`
- `admission.documents.read`
- `admission.reports.read`

**Use Cases**:
- View application data for inquiries
- Generate read-only reports
- Respond to applicant queries

**Restrictions**:
- Read-only access (no modifications)
- Cannot approve/reject documents
- Cannot publish merit lists

---

## 3. Permission Matrix

| Action | Senior Officer | Doc Coordinator | Doc Verifier | Merit Manager | Counseling Coord | Data Entry |
|--------|----------------|-----------------|--------------|---------------|------------------|------------|
| View Applications | ✅ All | ✅ All | ✅ Assigned | ✅ All | ✅ All | ✅ All |
| Edit Applications | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Verify Documents | ✅ | ✅ | ✅ (Assigned) | ❌ | ❌ | ❌ |
| Assign Verifications | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Generate Merit List | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Publish Merit List | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Configure Seat Allocation | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Run Seat Allocation | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Manage Staff | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Payment Details | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Generate Reports | ✅ All | ✅ Verification | ❌ | ✅ Merit | ✅ Counseling | ✅ Read-only |

---

## 4. JWT Token Structure

```json
{
  "iss": "https://admission.institution.edu",
  "sub": "ADM-ADMIN-00123",
  "iat": 1698235200,
  "exp": 1698242400,
  "role": "document_verifier",
  "permissions": [
    "admission.applications.read",
    "admission.documents.read",
    "admission.documents.verify"
  ],
  "staff_id": "STAFF-2024-00045",
  "name": "Ramesh Kumar",
  "email": "ramesh@institution.edu",
  "assigned_applications": [12345, 12346, 12347]
}
```

**Token Expiry**:
- Access Token: 2 hours
- Refresh Token: 7 days (office staff, not remote access)

---

## 5. Document Verification Workflow

### Verification States
```
submitted → pending_verification → verified/rejected → approved (by coordinator)
```

### Permissions Per State

| State | Can View | Can Verify | Can Approve |
|-------|----------|------------|-------------|
| `submitted` | All admins | - | - |
| `pending_verification` | Assigned verifier | Assigned verifier | - |
| `verified` | All admins | - | Coordinator |
| `rejected` | All admins | - | - |
| `approved` | All admins | - | - |

### Verification Audit Trail
```sql
CREATE TABLE document_verification_log (
    id UUID PRIMARY KEY,
    application_id UUID,
    document_type VARCHAR(50),
    action VARCHAR(20), -- 'verified', 'rejected', 'approved'
    performed_by VARCHAR(50), -- Staff ID
    comments TEXT,
    created_at TIMESTAMPTZ
);
```

Every document verification action logged for audit compliance.

---

## 6. Row-Level Security (RLS)

### Document Verifiers: Can Only See Assigned Applications
```sql
CREATE POLICY verifier_access ON applications
    FOR SELECT
    USING (
        id IN (
            SELECT application_id 
            FROM document_assignments 
            WHERE staff_id = current_setting('app.current_staff_id')
            AND status = 'assigned'
        )
    );
```

### Coordinators: Can See All Applications
```sql
CREATE POLICY coordinator_access ON applications
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM staff 
            WHERE staff_id = current_setting('app.current_staff_id')
            AND role IN ('senior_admission_officer', 'document_verification_coordinator')
        )
    );
```

---

## 7. Session Management

### Session Storage (Redis)
```typescript
interface AdminSession {
  session_id: string;
  staff_id: string;
  role: string;
  ip_address: string;
  user_agent: string;
  login_at: string;
  last_activity: string;
  expires_at: string;
}
```

**Session Timeout**:
- Idle timeout: 30 minutes
- Absolute timeout: 8 hours
- Max concurrent sessions: 2 per admin

**Session Invalidation**:
- Manual logout
- Password change
- Role change by super admin

---

## 8. Two-Factor Authentication (2FA)

### TOTP Setup Flow
1. Admin enables 2FA in settings
2. System generates secret key
3. Display QR code for Google Authenticator
4. Admin scans QR code
5. Admin enters 6-digit code to verify setup
6. System stores encrypted secret

### 2FA Login Flow
```typescript
// After password verification
if (admin.has_2fa_enabled) {
  const isValid = verify2FACode(admin.totp_secret, req.body.mfa_code);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid 2FA code' });
  }
}
```

**Recovery Codes**:
- 10 one-time recovery codes generated during 2FA setup
- Stored hashed in database
- Can be used if TOTP app unavailable

---

## 9. Password Policy

### Requirements
- Minimum 12 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (@, #, $, %, etc.)
- Cannot contain username or email
- Cannot be one of last 5 passwords

### Password Expiry
- Mandatory change every 90 days
- Warning at 80 days
- Account locked after expiry until password reset

### Failed Login Attempts
- Max 5 attempts in 15 minutes
- Account locked for 30 minutes after 5 failures
- Email notification sent to admin on lockout

---

## 10. Audit Logging

### Logged Actions
```typescript
const AUDIT_ACTIONS = [
  'admin.login',
  'admin.logout',
  'admin.password_change',
  'application.view',
  'application.edit',
  'document.verify',
  'document.reject',
  'merit_list.generate',
  'merit_list.publish',
  'seat_allocation.run',
  'staff.create',
  'staff.role_change',
];
```

### Audit Log Schema
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY,
    staff_id VARCHAR(50),
    action VARCHAR(50),
    resource_type VARCHAR(50),
    resource_id VARCHAR(50),
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ
);
```

**Retention**: 7 years (regulatory compliance)

---

## 11. API Authentication

### Request Headers
```http
Authorization: Bearer <JWT_TOKEN>
X-Staff-ID: STAFF-2024-00045
X-Request-ID: uuid-v4-here
```

### Rate Limiting
| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/applications` | 100 req | 1 min |
| `/api/documents/verify` | 50 req | 1 min |
| `/api/merit-lists/generate` | 5 req | 1 hour |
| `/api/seat-allocation/run` | 2 req | 1 hour |

---

## 12. Security Best Practices

### Password Storage
```php
// BCrypt with cost factor 12
$hashedPassword = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
```

### JWT Signing
```php
// RS256 (asymmetric) for better security
$jwt = JWT::encode($payload, $privateKey, 'RS256');
```

### Document Access URLs
```php
// Pre-signed S3 URLs (15-minute expiry)
$s3->getObjectUrl('bucket-name', 'document-key', '+15 minutes');
```

### SQL Injection Prevention
```php
// Always use parameterized queries
$stmt = $pdo->prepare("SELECT * FROM applications WHERE id = :id");
$stmt->execute(['id' => $applicationId]);
```

---

**Authentication Status**: ✅ Production Ready  
**2FA Adoption**: 85% of staff  
**Failed Login Lockouts**: <1% of login attempts
