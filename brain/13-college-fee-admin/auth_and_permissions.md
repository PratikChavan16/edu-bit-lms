# College Fee Admin Portal - Authentication & Permissions

**Version**: 1.0.0  
**Security Standard**: RBAC + Row-Level Security (RLS)  
**Authentication**: JWT (Laravel Sanctum)  
**Annual Revenue**: ₹60 Crores/year

---

## Table of Contents
1. [Authentication System](#authentication-system)
2. [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
3. [Permissions Matrix](#permissions-matrix)
4. [Row-Level Security](#row-level-security)
5. [JWT Token Management](#jwt-token-management)
6. [Multi-Factor Authentication (MFA)](#multi-factor-authentication-mfa)
7. [Audit Logging](#audit-logging)

---

## Authentication System

### Login Flow
```
User Credentials (Email + Password)
        ↓
Laravel Sanctum Authentication
        ↓
Verify User + College Association
        ↓
Check Role Permissions
        ↓
Generate JWT Token (24hr expiry)
        ↓
Return Token + User Details + Permissions
```

### Login Endpoint Implementation
```php
POST /api/v1/auth/login

Request:
{
  "email": "fee.admin@college.edu.in",
  "password": "SecurePassword123!"
}

Response:
{
  "success": true,
  "token": "1|aB3dE5fG7hI9jK0lM...",
  "expires_at": "2024-11-11T10:30:00Z",
  "user": {
    "id": 101,
    "name": "Suresh Kumar",
    "email": "fee.admin@college.edu.in",
    "role": "college_fee_admin",
    "college_id": 5,
    "college_name": "St. Xavier's College",
    "permissions": [
      "view_payments",
      "create_payments",
      "view_receipts",
      "approve_refunds",
      "manage_scholarships"
    ]
  }
}
```

### Password Policy
- **Minimum Length**: 12 characters
- **Complexity**: 1 uppercase, 1 lowercase, 1 number, 1 special character
- **Expiry**: 90 days
- **History**: Cannot reuse last 5 passwords
- **Lockout**: 5 failed attempts → 30-minute lockout

---

## Role-Based Access Control (RBAC)

### Roles in Fee Admin Portal

#### 1. College Fee Admin (Primary Role)
**User Count**: 2-3 per college  
**Access Level**: Full fee management within college

**Permissions**:
- ✅ View all payments, receipts, refunds
- ✅ Collect cash/cheque payments at counter
- ✅ Initiate online payments
- ✅ Generate receipts
- ✅ Manage fee structures
- ✅ View defaulter list
- ✅ Send payment reminders
- ✅ Submit refund requests
- ❌ Approve refunds (requires College Accountant approval)
- ✅ Review scholarship applications
- ✅ Generate financial reports
- ✅ Manage installment plans

#### 2. Senior Fee Admin
**User Count**: 1 per college  
**Access Level**: All Fee Admin + Approvals

**Additional Permissions**:
- ✅ Approve refunds up to ₹50,000
- ✅ Approve scholarships up to ₹50,000
- ✅ Block/Unblock hall tickets
- ✅ Override late fees
- ✅ Modify fee structures

#### 3. College Accountant (Read-Only Financial Access)
**User Count**: 1-2 per college  
**Access Level**: Financial oversight

**Permissions**:
- ✅ View all financial data
- ✅ Approve refunds > ₹50,000
- ✅ Download financial reports
- ❌ Collect payments
- ❌ Modify fee structures

#### 4. Super Accountant (Cross-College)
**User Count**: 2-3 for entire university  
**Access Level**: All colleges financial oversight

**Permissions**:
- ✅ View all colleges' financial data
- ✅ Generate consolidated reports
- ✅ Approve high-value refunds (> ₹1,00,000)
- ✅ Audit payment records

---

## Permissions Matrix

### CRUD Permissions Table

| Resource | View (college_fee_admin) | Create (college_fee_admin) | Update (college_fee_admin) | Delete (college_fee_admin) | Approve (senior_fee_admin) |
|----------|:----------:|:----------:|:----------:|:----------:|:----------:|
| **Payments** | ✅ | ✅ | ❌ | ❌ | N/A |
| **Receipts** | ✅ | ✅ (auto) | ❌ | ❌ | N/A |
| **Fee Structures** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Installment Plans** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Defaulters** | ✅ | N/A | ✅ (reminders) | N/A | N/A |
| **Refunds** | ✅ | ✅ (request) | ❌ | ❌ | ✅ |
| **Scholarships** | ✅ | ✅ (apply) | ❌ | ❌ | ✅ |
| **Reports** | ✅ | ✅ | N/A | N/A | N/A |

### Special Permissions

| Permission | college_fee_admin | senior_fee_admin | college_accountant | super_accountant |
|------------|:------------------:|:----------------:|:------------------:|:----------------:|
| **Collect Cash Payment** | ✅ | ✅ | ❌ | ❌ |
| **Record Cheque Payment** | ✅ | ✅ | ❌ | ❌ |
| **Approve Refund < ₹50K** | ❌ | ✅ | ✅ | ✅ |
| **Approve Refund > ₹50K** | ❌ | ❌ | ✅ | ✅ |
| **Block Hall Ticket** | ❌ | ✅ | ❌ | ❌ |
| **Override Late Fee** | ❌ | ✅ | ❌ | ❌ |
| **Delete Payment** | ❌ | ❌ | ❌ | ❌ (Never allowed) |
| **Edit Receipt** | ❌ | ❌ | ❌ | ❌ (Never allowed) |
| **View Other Colleges** | ❌ | ❌ | ❌ | ✅ |

---

## Row-Level Security

### College Isolation
Every query automatically filtered by `college_id`:

```php
// Middleware: CollegeIsolation.php

public function handle(Request $request, Closure $next)
{
    $user = auth()->user();
    
    if (!$user->college_id) {
        abort(403, 'User not associated with a college');
    }
    
    // Set session variable for RLS
    DB::statement("SET app.current_college_id = ?", [$user->college_id]);
    
    return $next($request);
}
```

### PostgreSQL RLS Policies
```sql
-- Payments table
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY payments_college_isolation ON payments
FOR ALL
USING (college_id = current_setting('app.current_college_id')::BIGINT);

-- Prevents cross-college data leakage
```

### Query Examples
```php
// User from College A (college_id = 5)
Payment::all();
// Returns: Only payments where college_id = 5

// User from College B (college_id = 8)
Payment::where('student_id', 101)->get();
// Returns: Empty if student 101 is not in College B
```

---

## JWT Token Management

### Token Structure
```json
{
  "iss": "https://api.bitflow.edu.in",
  "sub": 101,
  "iat": 1698768000,
  "exp": 1698854400,
  "college_id": 5,
  "role": "college_fee_admin",
  "permissions": [
    "view_payments",
    "create_payments",
    "view_receipts"
  ]
}
```

### Token Expiry & Refresh
- **Access Token**: 24 hours
- **Refresh Token**: 30 days
- **Auto-Refresh**: When < 1 hour remaining

```php
POST /api/v1/auth/refresh

Headers:
Authorization: Bearer {refresh_token}

Response:
{
  "access_token": "new_token_here",
  "expires_at": "2024-11-12T10:30:00Z"
}
```

### Token Revocation
```php
POST /api/v1/auth/logout

// Revokes current token
DELETE FROM personal_access_tokens WHERE token = 'hashed_token';
```

---

## Multi-Factor Authentication (MFA)

### MFA Triggers
- **Always Required**: Refund approvals > ₹50,000
- **Always Required**: Scholarship approvals > ₹50,000
- **Always Required**: Fee structure modifications
- **Optional**: Login (encouraged for Senior Fee Admins)

### MFA Methods
1. **SMS OTP**: 6-digit code valid for 5 minutes
2. **Email OTP**: 6-digit code valid for 5 minutes
3. **Google Authenticator**: TOTP (Time-based OTP)

### MFA Flow
```
User Action (e.g., Approve Refund ₹80,000)
        ↓
System Detects High-Value Transaction
        ↓
Send OTP via SMS + Email
        ↓
User Enters OTP within 5 minutes
        ↓
Verify OTP
        ↓
Execute Action + Log Audit Trail
```

---

## Audit Logging

### Logged Events
| Event | Details Logged | Retention |
|-------|----------------|-----------|
| **Login** | User ID, IP, Timestamp, Device | 1 year |
| **Failed Login** | Email, IP, Reason | 1 year |
| **Payment Collection** | Payment ID, Amount, User ID | Permanent |
| **Receipt Generation** | Receipt Number, User ID | Permanent |
| **Refund Approval** | Refund ID, Approver, Amount | Permanent |
| **Fee Structure Change** | Old/New Values, User ID | Permanent |
| **Hall Ticket Block** | Student ID, Reason, User ID | Permanent |

### Audit Log Table Schema
```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    college_id BIGINT NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id BIGINT NULL,
    old_values JSONB NULL,
    new_values JSONB NULL,
    ip_address INET NOT NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_college ON audit_logs(college_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);
```

### Accessing Audit Logs
```php
GET /api/v1/audit-logs?user_id=101&action=approve_refund

// Requires 'view_audit_logs' permission
// Only accessible to Senior Fee Admin and Super Accountant
```

---

## Security Best Practices

### Password Storage
```php
// Bcrypt with cost factor 12
$hashedPassword = Hash::make($password, ['rounds' => 12]);
```

### API Rate Limiting
```php
// routes/api.php
Route::middleware(['auth:sanctum', 'throttle:100,1'])->group(function () {
    // 100 requests per minute per user
});
```

### IP Whitelisting (Production)
```php
// Only allow requests from college network
'allowed_ips' => [
    '203.0.113.0/24', // College network
    '198.51.100.50'    // VPN gateway
]
```

### Session Timeout
```php
// config/session.php
'lifetime' => 120, // 2 hours
'expire_on_close' => true
```

---

## Permission Verification Examples

### Laravel Policy
```php
<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Refund;

class RefundPolicy
{
    public function approve(User $user, Refund $refund)
    {
        // Only Senior Fee Admin can approve < ₹50K
        if ($refund->net_refund_amount < 50000) {
            return $user->role === 'senior_fee_admin';
        }
        
        // College Accountant can approve > ₹50K
        if ($refund->net_refund_amount < 100000) {
            return in_array($user->role, ['college_accountant', 'super_accountant']);
        }
        
        // Super Accountant required for > ₹1L
        return $user->role === 'super_accountant';
    }
}
```

### Frontend Permission Check
```typescript
// utils/permissions.ts
export const canApproveRefund = (user: User, amount: number): boolean => {
  if (amount < 50000) {
    return user.role === 'senior_fee_admin';
  } else if (amount < 100000) {
    return ['college_accountant', 'super_accountant'].includes(user.role);
  } else {
    return user.role === 'super_accountant';
  }
};
```

---

**End of Auth & Permissions Guide**
