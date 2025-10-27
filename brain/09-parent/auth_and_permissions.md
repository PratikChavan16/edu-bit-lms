# Parent Portal - Authentication & Permissions

**Version**: 2.0  
**Last Updated**: October 25, 2025  
**Security Level**: High (FERPA Compliant)

---

## Table of Contents

1. [Authentication Overview](#authentication-overview)
2. [Parent Registration & Verification](#parent-registration--verification)
3. [Parent-Child Linking](#parent-child-linking)
4. [JWT Token Structure](#jwt-token-structure)
5. [Permission Model](#permission-model)
6. [Multi-Child Access Control](#multi-child-access-control)
7. [Session Management](#session-management)
8. [Two-Factor Authentication](#two-factor-authentication)
9. [Biometric Authentication (Mobile)](#biometric-authentication-mobile)
10. [Privacy Controls](#privacy-controls)
11. [Audit Logging](#audit-logging)
12. [Security Best Practices](#security-best-practices)

---

## Authentication Overview

### Authentication Flow Diagram

```
┌─────────────┐
│   Parent    │
│  (Mobile/   │
│    Web)     │
└──────┬──────┘
       │
       │ 1. Enter Mobile Number
       ▼
┌─────────────────────────────────┐
│  Registration Check              │
│  - New User → Registration       │
│  - Existing → Login              │
└──────────┬──────────────────────┘
           │
           │ 2. Send OTP (SMS)
           ▼
┌─────────────────────────────────┐
│  OTP Verification                │
│  - 6-digit code                  │
│  - Valid for 5 minutes           │
│  - Max 3 attempts                │
└──────────┬──────────────────────┘
           │
           │ 3. OTP Valid ✓
           ▼
┌─────────────────────────────────┐
│  Check Children Linked           │
│  - Yes → JWT Token + Dashboard   │
│  - No → Child Linking Flow       │
└──────────┬──────────────────────┘
           │
           │ 4. Issue JWT Token
           ▼
┌─────────────────────────────────┐
│  Access Granted                  │
│  - View children's data          │
│  - Make payments                 │
│  - Send messages                 │
└─────────────────────────────────┘
```

### Supported Authentication Methods

| Method | Platform | Security Level | Usage |
|--------|----------|----------------|-------|
| **Mobile + OTP** | Web + Mobile | High | Primary (90%) |
| **Email + Password** | Web | Medium | Alternative (5%) |
| **Biometric** | Mobile Only | Very High | Quick Login (75% of mobile) |
| **Google OAuth** | Web + Mobile | High | Social Login (5%) |

---

## Parent Registration & Verification

### Registration Flow

```typescript
// Step 1: Mobile Number Registration
POST /api/parent/auth/register
{
  "mobile": "+91-9876543210",
  "country_code": "+91",
  "device_info": {
    "device_id": "uuid-device-123",
    "platform": "android",
    "app_version": "2.0.1"
  }
}

// Response
{
  "success": true,
  "message": "OTP sent to +91-9876543210",
  "otp_expiry": "2025-10-25T10:35:00Z",
  "verification_id": "verify_abc123"
}

// Step 2: OTP Verification
POST /api/parent/auth/verify-otp
{
  "verification_id": "verify_abc123",
  "otp": "123456",
  "mobile": "+91-9876543210"
}

// Response (New User - No Children Linked)
{
  "success": true,
  "is_new_user": true,
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "refresh_token": "refresh_xyz789",
  "requires_child_linking": true,
  "parent": {
    "id": "PAR001",
    "mobile": "+91-9876543210",
    "children": []
  }
}

// Response (Existing User - Children Already Linked)
{
  "success": true,
  "is_new_user": false,
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "refresh_token": "refresh_xyz789",
  "requires_child_linking": false,
  "parent": {
    "id": "PAR001",
    "name": "Mrs. Sharma",
    "mobile": "+91-9876543210",
    "email": "sharma@example.com",
    "children": [
      {
        "id": "STU001",
        "name": "Aarav Kumar",
        "class": "10-A",
        "roll_no": "101"
      },
      {
        "id": "STU045",
        "name": "Ananya Kumar",
        "class": "8-B",
        "roll_no": "215"
      }
    ]
  }
}
```

### OTP Security

```typescript
interface OTPConfig {
  length: 6;                    // 6-digit code
  validity: 300;                // 5 minutes in seconds
  max_attempts: 3;              // Max verification attempts
  resend_cooldown: 60;          // 1 minute before resend
  rate_limit: 5;                // Max 5 OTPs per hour per mobile
  
  // OTP Generation (cryptographically secure)
  generation_method: "crypto.randomInt(100000, 999999)";
  
  // Storage (Redis with TTL)
  storage: {
    key: `otp:${mobile}:${verification_id}`,
    ttl: 300,
    data: {
      otp_hash: "bcrypt_hash",  // Never store plain OTP
      attempts: 0,
      created_at: "timestamp"
    }
  }
}
```

---

## Parent-Child Linking

### Linking Methods

#### Method 1: School-Generated Code (Primary - 80%)

**Process**:
1. School admin generates unique linking code for each parent
2. Code sent to parent via SMS/Email
3. Parent enters code in app
4. System verifies code and links parent to child(ren)

```typescript
// Step 1: Admin generates code
POST /api/admin/parent-codes/generate
{
  "student_ids": ["STU001", "STU045"],
  "parent_mobile": "+91-9876543210",
  "validity_days": 7
}

// Response
{
  "linking_code": "ABC-XYZ-123",
  "valid_until": "2025-11-01T23:59:59Z",
  "students": [
    { "id": "STU001", "name": "Aarav Kumar" },
    { "id": "STU045", "name": "Ananya Kumar" }
  ]
}

// Step 2: Parent uses code
POST /api/parent/children/link
Authorization: Bearer {parent_jwt}
{
  "linking_code": "ABC-XYZ-123"
}

// Response
{
  "success": true,
  "message": "Successfully linked 2 children",
  "children": [
    {
      "id": "STU001",
      "name": "Aarav Kumar",
      "class": "10-A",
      "roll_no": "101",
      "relationship": "parent"
    },
    {
      "id": "STU045",
      "name": "Ananya Kumar",
      "class": "8-B",
      "roll_no": "215",
      "relationship": "parent"
    }
  ]
}
```

#### Method 2: Admin-Approved Request (Secondary - 15%)

**Process**:
1. Parent searches for child by name/roll number
2. Parent submits linking request with proof
3. Admin reviews and approves/rejects
4. Parent receives notification

```typescript
// Step 1: Search for child
GET /api/parent/children/search?query=Aarav Kumar&class=10-A

// Step 2: Submit linking request
POST /api/parent/children/link-request
{
  "student_id": "STU001",
  "relationship": "father",
  "proof_documents": [
    {
      "type": "aadhar_card",
      "file_url": "s3://docs/aadhar_001.pdf"
    },
    {
      "type": "birth_certificate",
      "file_url": "s3://docs/birth_001.pdf"
    }
  ],
  "reason": "First time registration"
}

// Response
{
  "success": true,
  "request_id": "REQ_001",
  "status": "pending_approval",
  "message": "Request submitted. You'll be notified once approved.",
  "estimated_approval_time": "24-48 hours"
}

// Step 3: Admin approves
POST /api/admin/parent-links/approve
{
  "request_id": "REQ_001",
  "approved": true,
  "notes": "Documents verified"
}

// Step 4: Parent receives notification
Notification: "Your request to link Aarav Kumar has been approved!"
```

#### Method 3: Bulk Upload by Admin (5%)

**Process**: Admin uploads CSV with parent-student mappings

```csv
student_id,parent_mobile,parent_email,relationship
STU001,+91-9876543210,sharma@email.com,mother
STU045,+91-9876543210,sharma@email.com,mother
```

### Linking Validation Rules

```typescript
interface LinkingValidation {
  // Student must exist and be enrolled
  student_exists: boolean;
  student_active: boolean;
  
  // Parent verification
  parent_verified: boolean;  // Mobile verified via OTP
  
  // Relationship rules
  max_parents_per_student: 4;  // Both parents + 2 guardians
  allowed_relationships: [
    "father",
    "mother",
    "guardian",
    "grandparent",
    "sibling_adult"
  ];
  
  // Security checks
  requires_admin_approval: boolean;  // If no linking code
  proof_documents_required: boolean; // If manual request
  cooling_period: 0;  // No delay if code-based
  
  // Audit trail
  log_linking_event: true;
  notify_school_admin: true;
  notify_other_linked_parents: true;  // "New parent linked to your child"
}
```

---

## JWT Token Structure

### Access Token (Short-lived)

```typescript
interface ParentAccessToken {
  // Standard JWT claims
  iss: "parent-portal";              // Issuer
  sub: "PAR001";                     // Parent ID
  aud: ["parent-api", "payment-api"]; // Audience
  iat: 1698249600;                   // Issued at
  exp: 1698256800;                   // Expires (2 hours)
  nbf: 1698249600;                   // Not before
  jti: "jwt_abc123";                 // JWT ID (for revocation)
  
  // Custom claims
  role: "parent";
  mobile: "+91-9876543210";
  email: "sharma@example.com";
  name: "Mrs. Sharma";
  
  // Children access (most important!)
  children: [
    {
      student_id: "STU001",
      name: "Aarav Kumar",
      class: "10-A",
      relationship: "mother",
      permissions: ["view", "communicate"]
    },
    {
      student_id: "STU045",
      name: "Ananya Kumar",
      class: "8-B",
      relationship: "mother",
      permissions: ["view", "communicate"]
    }
  ];
  
  // Security
  device_id: "uuid-device-123";
  ip_address: "192.168.1.100";
  session_id: "sess_xyz789";
  
  // Feature flags
  features: {
    payment_enabled: true,
    2fa_enabled: false,
    biometric_enabled: true
  };
}

// Example encoded JWT
eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwYXJlbnQtcG9ydGFsIiwic3ViIjoiUEFSMDAxIiwiYXVkIjpbInBhcmVudC1hcGkiLCJwYXltZW50LWFwaSJdLCJpYXQiOjE2OTgyNDk2MDAsImV4cCI6MTY5ODI1NjgwMCwibmJmIjoxNjk4MjQ5NjAwLCJqdGkiOiJqd3RfYWJjMTIzIiwicm9sZSI6InBhcmVudCIsIm1vYmlsZSI6Iis5MS05ODc2NTQzMjEwIiwiZW1haWwiOiJzaGFybWFAZXhhbXBsZS5jb20iLCJuYW1lIjoiTXJzLiBTaGFybWEiLCJjaGlsZHJlbiI6W3sic3R1ZGVudF9pZCI6IlNUVTAwMSIsIm5hbWUiOiJBYXJhdiBLdW1hciIsImNsYXNzIjoiMTAtQSIsInJlbGF0aW9uc2hpcCI6Im1vdGhlciIsInBlcm1pc3Npb25zIjpbInZpZXciLCJjb21tdW5pY2F0ZSJdfSx7InN0dWRlbnRfaWQiOiJTVFUwNDUiLCJuYW1lIjoiQW5hbnlhIEt1bWFyIiwiY2xhc3MiOiI4LUIiLCJyZWxhdGlvbnNoaXAiOiJtb3RoZXIiLCJwZXJtaXNzaW9ucyI6WyJ2aWV3IiwiY29tbXVuaWNhdGUiXX1dLCJkZXZpY2VfaWQiOiJ1dWlkLWRldmljZS0xMjMiLCJpcF9hZGRyZXNzIjoiMTkyLjE2OC4xLjEwMCIsInNlc3Npb25faWQiOiJzZXNzX3h5ejc4OSIsImZlYXR1cmVzIjp7InBheW1lbnRfZW5hYmxlZCI6dHJ1ZSwiMmZhX2VuYWJsZWQiOmZhbHNlLCJiaW9tZXRyaWNfZW5hYmxlZCI6dHJ1ZX19.signature
```

### Refresh Token (Long-lived)

```typescript
interface ParentRefreshToken {
  iss: "parent-portal";
  sub: "PAR001";
  iat: 1698249600;
  exp: 1705939200;  // 90 days
  jti: "refresh_xyz789";
  type: "refresh";
  session_id: "sess_xyz789";
  device_id: "uuid-device-123";
}

// Stored securely
Storage: {
  web: "httpOnly cookie (secure, sameSite=strict)",
  mobile: "Encrypted secure storage (Keychain/Keystore)"
}
```

### Token Refresh Flow

```typescript
POST /api/parent/auth/refresh
Cookie: refresh_token=refresh_xyz789

// Response
{
  "access_token": "new_access_token",
  "refresh_token": "new_refresh_token",  // Token rotation
  "expires_in": 7200
}

// Old refresh token invalidated (single-use)
```

---

## Permission Model

### Role-Based Permissions

```yaml
Parent Role:
  inherent_permissions:
    - view_own_children_data
    - view_attendance
    - view_grades
    - view_report_cards
    - view_fee_details
    - make_payments
    - send_messages_to_teachers
    - apply_leave
    - schedule_meetings
    - download_documents
  
  restrictions:
    - cannot_view_other_students
    - cannot_modify_grades
    - cannot_mark_attendance
    - cannot_access_staff_data
    - cannot_view_internal_communications
    - cannot_modify_fee_structure
```

### Per-Child Permissions

```typescript
interface ChildPermissions {
  student_id: string;
  relationship: "father" | "mother" | "guardian";
  
  // Granular permissions (can be customized by admin)
  permissions: {
    view_attendance: boolean;       // true
    view_grades: boolean;           // true
    view_financial: boolean;        // true (can be restricted)
    communicate_teachers: boolean;  // true
    apply_leave: boolean;           // true
    make_payments: boolean;         // true (can be restricted to one parent)
    view_medical_records: boolean;  // false (requires special permission)
    view_disciplinary: boolean;     // false (requires special permission)
  };
  
  // Permission expires (for temporary guardians)
  valid_from: "2025-01-01";
  valid_until: "2025-12-31" | null;  // null = permanent
  
  // Status
  status: "active" | "suspended" | "revoked";
  revoked_by: "admin" | "parent" | "student_turned_18";
  revoked_at: string | null;
}
```

### Permission Checking (Backend)

```php
// Laravel Policy Example
namespace App\Policies;

class StudentDataPolicy
{
    public function viewAttendance(Parent $parent, Student $student): bool
    {
        // Check if parent is linked to student
        $link = $parent->children()
            ->where('student_id', $student->id)
            ->where('status', 'active')
            ->first();
        
        if (!$link) {
            return false;
        }
        
        // Check specific permission
        return $link->permissions['view_attendance'] ?? false;
    }
    
    public function viewGrades(Parent $parent, Student $student): bool
    {
        $link = $parent->children()
            ->where('student_id', $student->id)
            ->where('status', 'active')
            ->first();
        
        if (!$link) {
            return false;
        }
        
        // Check if permission is still valid (time-based)
        if ($link->valid_until && now() > $link->valid_until) {
            return false;
        }
        
        return $link->permissions['view_grades'] ?? false;
    }
    
    public function makePayment(Parent $parent, Student $student): bool
    {
        $link = $parent->children()
            ->where('student_id', $student->id)
            ->where('status', 'active')
            ->first();
        
        if (!$link) {
            return false;
        }
        
        // Check payment permission (might be restricted to one parent)
        return $link->permissions['make_payments'] ?? false;
    }
}

// Usage in Controller
public function getAttendance(Request $request, $studentId)
{
    $student = Student::findOrFail($studentId);
    
    // Authorization check
    $this->authorize('viewAttendance', $student);
    
    // Fetch attendance
    return $student->attendance()->get();
}
```

---

## Multi-Child Access Control

### Row-Level Security (PostgreSQL)

```sql
-- Enable RLS on sensitive tables
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_transactions ENABLE ROW LEVEL SECURITY;

-- Create policy for parent access
CREATE POLICY parent_child_data_access ON attendance
  FOR SELECT
  TO parent_role
  USING (
    student_id IN (
      SELECT student_id
      FROM parent_student_links
      WHERE parent_id = current_setting('app.parent_id')::varchar
        AND status = 'active'
        AND (valid_until IS NULL OR valid_until > NOW())
    )
  );

-- Apply to all child-related tables
CREATE POLICY parent_grade_access ON grades
  FOR SELECT
  TO parent_role
  USING (
    student_id IN (
      SELECT student_id
      FROM parent_student_links
      WHERE parent_id = current_setting('app.parent_id')::varchar
        AND status = 'active'
        AND permissions->>'view_grades' = 'true'
    )
  );

CREATE POLICY parent_fee_access ON fee_transactions
  FOR SELECT
  TO parent_role
  USING (
    student_id IN (
      SELECT student_id
      FROM parent_student_links
      WHERE parent_id = current_setting('app.parent_id')::varchar
        AND status = 'active'
        AND permissions->>'view_financial' = 'true'
    )
  );
```

### Context Setting (Laravel Middleware)

```php
namespace App\Http\Middleware;

class SetParentContext
{
    public function handle(Request $request, Closure $next)
    {
        $parent = $request->user();
        
        if ($parent && $parent->role === 'parent') {
            // Set PostgreSQL session variable for RLS
            DB::statement("SET app.parent_id = ?", [$parent->id]);
            
            // Store in request for easy access
            $request->merge([
                'parent_id' => $parent->id,
                'accessible_children' => $parent->children()
                    ->where('status', 'active')
                    ->pluck('student_id')
                    ->toArray()
            ]);
        }
        
        return $next($request);
    }
}
```

---

## Session Management

### Session Configuration

```typescript
interface SessionConfig {
  // Web sessions
  web: {
    idle_timeout: 30 * 60,        // 30 minutes of inactivity
    absolute_timeout: 8 * 3600,   // 8 hours max session
    remember_me: 30 * 86400,      // 30 days if "remember me" checked
    concurrent_sessions: 3,        // Max 3 devices
  };
  
  // Mobile sessions
  mobile: {
    idle_timeout: 7 * 86400,      // 7 days (longer for mobile)
    absolute_timeout: 90 * 86400, // 90 days max
    biometric_timeout: 5 * 60,    // 5 minutes after biometric auth
    concurrent_devices: 3,         // Max 3 mobile devices
  };
  
  // Session storage (Redis)
  storage: {
    key_prefix: "session:parent:",
    ttl: "based on timeout",
    data: {
      user_id: string,
      device_info: object,
      ip_address: string,
      last_activity: timestamp,
      created_at: timestamp,
      fingerprint: string  // Device fingerprint
    }
  };
}
```

### Session Validation

```php
public function validateSession(Request $request): bool
{
    $sessionId = $request->bearerToken();
    $session = Redis::get("session:parent:{$sessionId}");
    
    if (!$session) {
        return false;  // Session expired or doesn't exist
    }
    
    $sessionData = json_decode($session, true);
    
    // Check idle timeout
    $idleTimeout = $sessionData['platform'] === 'mobile' ? 7 * 86400 : 30 * 60;
    if (time() - $sessionData['last_activity'] > $idleTimeout) {
        Redis::del("session:parent:{$sessionId}");
        return false;
    }
    
    // Check absolute timeout
    $absoluteTimeout = $sessionData['platform'] === 'mobile' ? 90 * 86400 : 8 * 3600;
    if (time() - $sessionData['created_at'] > $absoluteTimeout) {
        Redis::del("session:parent:{$sessionId}");
        return false;
    }
    
    // Check device fingerprint (prevent session hijacking)
    if ($sessionData['fingerprint'] !== $this->generateFingerprint($request)) {
        Redis::del("session:parent:{$sessionId}");
        Log::warning("Session hijacking attempt detected", [
            'user_id' => $sessionData['user_id'],
            'ip' => $request->ip()
        ]);
        return false;
    }
    
    // Update last activity
    $sessionData['last_activity'] = time();
    Redis::setex(
        "session:parent:{$sessionId}",
        $absoluteTimeout,
        json_encode($sessionData)
    );
    
    return true;
}
```

---

## Two-Factor Authentication

### 2FA Methods

```typescript
interface TwoFactorAuth {
  // TOTP (Time-based One-Time Password)
  totp: {
    enabled: boolean;
    secret: string;           // Base32 encoded secret
    qr_code: string;          // QR code for Google Authenticator
    backup_codes: string[];   // 10 backup codes
    verified: boolean;
  };
  
  // SMS-based 2FA
  sms: {
    enabled: boolean;
    mobile: string;
    last_sent: timestamp;
    cooldown: 60;  // 1 minute between sends
  };
  
  // Email-based 2FA
  email: {
    enabled: boolean;
    email: string;
    last_sent: timestamp;
  };
}
```

### 2FA Setup Flow

```typescript
// Step 1: Enable 2FA (TOTP)
POST /api/parent/auth/2fa/enable
Authorization: Bearer {jwt}

// Response
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANS...",
  "manual_entry_key": "JBSW-Y3DP-EHPK-3PXP",
  "backup_codes": [
    "1234-5678",
    "9012-3456",
    // ... 8 more
  ]
}

// Step 2: Verify setup
POST /api/parent/auth/2fa/verify
{
  "code": "123456"  // From authenticator app
}

// Response
{
  "success": true,
  "message": "2FA enabled successfully",
  "backup_codes": [...]  // Show backup codes again
}
```

### 2FA Login Flow

```typescript
// Step 1: Regular login (mobile + OTP)
POST /api/parent/auth/login
{ "mobile": "+91-9876543210", "otp": "123456" }

// Response (2FA enabled)
{
  "success": true,
  "requires_2fa": true,
  "temporary_token": "temp_abc123",
  "expires_in": 300  // 5 minutes
}

// Step 2: Provide 2FA code
POST /api/parent/auth/2fa/verify
{
  "temporary_token": "temp_abc123",
  "code": "654321"  // From authenticator app
}

// Response (final)
{
  "success": true,
  "access_token": "eyJhbGciOiJSUzI1NiIs...",
  "refresh_token": "refresh_xyz789"
}
```

---

## Biometric Authentication (Mobile)

### Setup Flow

```typescript
// Mobile app: Check biometric availability
import ReactNativeBiometrics from 'react-native-biometrics';

const { available, biometryType } = await ReactNativeBiometrics.isSensorAvailable();
// biometryType: 'TouchID' | 'FaceID' | 'Biometrics'

// Step 1: Enable biometric
POST /api/parent/auth/biometric/enable
Authorization: Bearer {jwt}
{
  "device_id": "uuid-device-123",
  "biometry_type": "FaceID"
}

// Response
{
  "success": true,
  "biometric_token": "bio_xyz789",  // Encrypted, stored in Keychain
  "message": "Biometric authentication enabled"
}

// Step 2: Biometric login
const { success, signature } = await ReactNativeBiometrics.createSignature({
  promptMessage: 'Authenticate to access Parent Portal',
  payload: biometric_token
});

if (success) {
  POST /api/parent/auth/biometric/login
  {
    "device_id": "uuid-device-123",
    "biometric_token": "bio_xyz789",
    "signature": signature
  }
  
  // Response
  {
    "access_token": "...",
    "refresh_token": "..."
  }
}
```

---

## Privacy Controls

### Parent Privacy Settings

```typescript
interface PrivacySettings {
  // Data visibility
  allow_class_comparison: boolean;     // Compare child with class average
  allow_peer_comparison: boolean;      // See anonymized peer performance
  share_emergency_contact: boolean;    // Share with school
  
  // Communication preferences
  allow_teacher_calls: boolean;
  allow_school_marketing: boolean;
  allow_third_party_partners: boolean;
  
  // Notification preferences
  attendance_notifications: "realtime" | "daily_digest" | "weekly" | "off";
  grade_notifications: "realtime" | "weekly" | "off";
  announcement_notifications: "important_only" | "all" | "off";
  
  // Data retention
  auto_delete_old_data: boolean;       // After graduation
  download_data_on_exit: boolean;      // Export before deletion
}
```

### FERPA Compliance Controls

```typescript
// Federal Educational Rights and Privacy Act
interface FERPACompliance {
  // Consent management
  consent_obtained: boolean;
  consent_date: string;
  consent_expiry: string | null;
  
  // Directory information (can be shared)
  directory_info_consent: {
    name: boolean,
    photo: boolean,
    achievements: boolean,
    graduation_date: boolean
  };
  
  // Educational records (restricted)
  educational_records_access: {
    grades: "parent_only",
    attendance: "parent_only",
    disciplinary: "parent_only",
    medical: "parent_guardian_only"
  };
  
  // Third-party disclosure log
  disclosure_log: Array<{
    disclosed_to: string,
    purpose: string,
    date: string,
    records_shared: string[],
    consent_obtained: boolean
  }>;
}
```

---

## Audit Logging

### Audit Events

```typescript
interface AuditLog {
  event_id: string;
  timestamp: string;
  
  // Actor
  actor: {
    parent_id: string,
    name: string,
    mobile: string,
    ip_address: string,
    device_info: object
  };
  
  // Action
  action: "view" | "create" | "update" | "delete" | "download" | "payment";
  resource_type: "attendance" | "grades" | "fees" | "documents" | "messages";
  resource_id: string;
  
  // Target (which child's data)
  target: {
    student_id: string,
    student_name: string
  };
  
  // Details
  details: {
    description: string,
    changes: object | null,
    success: boolean,
    error_message: string | null
  };
  
  // Security
  risk_level: "low" | "medium" | "high";
  flagged: boolean;
  flagged_reason: string | null;
}

// Examples
{
  "event_id": "evt_001",
  "timestamp": "2025-10-25T10:30:00Z",
  "actor": {
    "parent_id": "PAR001",
    "name": "Mrs. Sharma",
    "ip_address": "192.168.1.100"
  },
  "action": "view",
  "resource_type": "grades",
  "resource_id": "GRD_CS101_MID",
  "target": {
    "student_id": "STU001",
    "student_name": "Aarav Kumar"
  },
  "details": {
    "description": "Viewed midterm grades for Mathematics",
    "success": true
  },
  "risk_level": "low"
}

{
  "event_id": "evt_002",
  "timestamp": "2025-10-25T14:15:00Z",
  "actor": {
    "parent_id": "PAR001",
    "mobile": "+91-9876543210"
  },
  "action": "payment",
  "resource_type": "fees",
  "resource_id": "FEE_2025_SEM2",
  "target": {
    "student_id": "STU001",
    "student_name": "Aarav Kumar"
  },
  "details": {
    "description": "Fee payment via UPI",
    "amount": 25000,
    "transaction_id": "TXN_XYZ789",
    "success": true
  },
  "risk_level": "medium"
}
```

### Audit Queries

```sql
-- View all access to a specific student's data
SELECT * FROM audit_logs
WHERE target->>'student_id' = 'STU001'
ORDER BY timestamp DESC
LIMIT 100;

-- Detect suspicious activity (multiple parents accessing same child)
SELECT 
  target->>'student_id' AS student_id,
  COUNT(DISTINCT actor->>'parent_id') AS parent_count
FROM audit_logs
WHERE action = 'view'
  AND timestamp > NOW() - INTERVAL '24 hours'
GROUP BY target->>'student_id'
HAVING COUNT(DISTINCT actor->>'parent_id') > 2;

-- Track payment activities
SELECT * FROM audit_logs
WHERE action = 'payment'
  AND timestamp > NOW() - INTERVAL '7 days'
ORDER BY timestamp DESC;
```

---

## Security Best Practices

### 1. Input Validation

```typescript
// Validate mobile number
function validateMobile(mobile: string): boolean {
  const regex = /^\+\d{1,3}-\d{10}$/;
  return regex.test(mobile);
}

// Validate OTP
function validateOTP(otp: string): boolean {
  return /^\d{6}$/.test(otp);
}

// Sanitize child search query (prevent SQL injection)
function sanitizeQuery(query: string): string {
  return query.replace(/[^\w\s-]/g, '').trim();
}
```

### 2. Rate Limiting

```yaml
rate_limits:
  /api/parent/auth/register:
    limit: 5 requests
    window: 1 hour
    scope: ip_address
  
  /api/parent/auth/verify-otp:
    limit: 3 attempts
    window: 5 minutes
    scope: verification_id
  
  /api/parent/children/search:
    limit: 20 requests
    window: 1 minute
    scope: parent_id
  
  /api/parent/payments:
    limit: 10 requests
    window: 5 minutes
    scope: parent_id
```

### 3. Security Headers

```nginx
# Response headers
add_header X-Frame-Options "DENY";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
add_header Referrer-Policy "strict-origin-when-cross-origin";
```

### 4. Encryption

```typescript
// Sensitive data encryption
import * as crypto from 'crypto';

function encryptPII(data: string, key: string): string {
  const algorithm = 'aes-256-gcm';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
}

function decryptPII(encryptedData: string, key: string): string {
  const [ivHex, encrypted, authTagHex] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### 5. Secure Communication

```typescript
// Backend: Verify message is from legitimate parent
function verifyParentMessage(parentId: string, studentId: string, teacherId: string): boolean {
  // Check parent-child link exists and is active
  const link = ParentStudentLink.where({
    parent_id: parentId,
    student_id: studentId,
    status: 'active'
  }).first();
  
  if (!link) {
    return false;
  }
  
  // Check teacher teaches this student
  const teaches = CourseAssignment.where({
    faculty_id: teacherId,
    course_id: { in: student.enrolled_courses }
  }).exists();
  
  return teaches;
}
```

---

**Last Updated**: October 25, 2025  
**Security Review**: Quarterly  
**Compliance**: FERPA, COPPA, GDPR
