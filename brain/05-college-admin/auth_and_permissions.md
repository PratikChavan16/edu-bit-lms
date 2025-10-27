# College Admin Portal - Authentication & Permissions

**Portal**: College Admin (#05)  
**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Table of Contents

1. [Authentication Strategy](#authentication-strategy)
2. [Role Definition](#role-definition)
3. [Permission Matrix](#permission-matrix)
4. [Authorization Implementation](#authorization-implementation)
5. [Multi-Factor Authentication](#multi-factor-authentication)
6. [Session Management](#session-management)
7. [Security Policies](#security-policies)

---

## 1. Authentication Strategy

### JWT Bearer Token Authentication

**Implementation**: Laravel Sanctum

```php
// Config: config/sanctum.php
return [
    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost')),
    'expiration' => 1440, // 24 hours
    'token_prefix' => 'college_admin',
];
```

### Login Flow

```
1. User submits credentials (email + password)
   POST /api/college-admin/login
   
2. Server validates credentials
   - Check email exists
   - Verify password hash
   - Check role = 'college_admin'
   - Check college_id exists
   
3. If MFA enabled:
   - Send OTP to registered phone/email
   - Return temp_token + mfa_required flag
   
4. User submits OTP
   POST /api/college-admin/mfa/verify
   
5. Server issues JWT token
   - Token includes: user_id, college_id, role, permissions
   - Token expiry: 24 hours
   - Refresh token expiry: 7 days
   
6. Client stores token in localStorage/secure cookie
7. All subsequent requests include: Authorization: Bearer {token}
```

### Sample Login Response

```json
{
  "success": true,
  "data": {
    "user": {
      "id": 123,
      "name": "Rajesh Kumar",
      "email": "admin@spce.edu.in",
      "role": "college_admin",
      "college_id": 1,
      "college_name": "SP College of Engineering"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "expires_in": 86400,
    "refresh_token": "def502004f8c7..."
  }
}
```

---

## 2. Role Definition

### College Admin Role

**Database Table**: `users`

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'college_admin'
    college_id BIGINT REFERENCES colleges(id),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Role Characteristics:**
- **Scope**: Single college operations
- **Level**: Operational management (non-academic)
- **Hierarchy**: Reports to Principal
- **Data Access**: Own college data only (filtered by college_id)

**Key Distinction from Other Roles:**

| Role | Scope | Focus | Example Permissions |
|------|-------|-------|---------------------|
| **College Admin** | Single College | Operations & Infrastructure | Staff management, transport, hostel, assets |
| **Principal** | Single College | Academic Leadership | Faculty approval, student discipline, curriculum |
| **Super Admin** | All Colleges | System Configuration | College setup, role assignment, system settings |
| **Super Accountant** | All Colleges | Financial Management | Payroll, budgets, accounting |

---

## 3. Permission Matrix

### Core Permissions

#### 3.1 Staff Management

| Permission | Description | Read | Write | Delete |
|-----------|-------------|------|-------|--------|
| `staff.view` | View staff list and details | ✅ | ❌ | ❌ |
| `staff.attendance.mark` | Mark daily attendance | ✅ | ✅ | ❌ |
| `staff.attendance.edit` | Edit past attendance (2-day limit) | ✅ | ✅ | ❌ |
| `staff.leave.view` | View leave requests | ✅ | ❌ | ❌ |
| `staff.leave.approve` | Approve/reject leave | ✅ | ✅ | ❌ |
| `staff.roster.manage` | Create/update duty rosters | ✅ | ✅ | ✅ |

**Business Rules:**
- Attendance can be edited within 2 days of marking
- Leave approval: Min 2 days notice (except sick leave)
- Roster changes: Min 24-hour notice to staff

#### 3.2 Infrastructure & Assets

| Permission | Description | Read | Write | Delete |
|-----------|-------------|------|-------|--------|
| `assets.view` | View asset registry | ✅ | ❌ | ❌ |
| `assets.create` | Add new assets | ❌ | ✅ | ❌ |
| `assets.update` | Update asset details | ✅ | ✅ | ❌ |
| `assets.condemn` | Mark asset as condemned | ✅ | ✅ | ❌ |
| `workorders.create` | Create work orders | ❌ | ✅ | ❌ |
| `workorders.assign` | Assign to technicians | ✅ | ✅ | ❌ |
| `workorders.complete` | Mark as completed | ✅ | ✅ | ❌ |

**Business Rules:**
- High-priority work orders must be assigned within 2 hours
- Completion requires before/after photos
- Asset value > ₹1 Lakh requires Principal approval for condemnation

#### 3.3 Transport Management

| Permission | Description | Read | Write | Delete |
|-----------|-------------|------|-------|--------|
| `transport.buses.view` | View bus list and status | ✅ | ❌ | ❌ |
| `transport.live_tracking` | Access real-time location | ✅ | ❌ | ❌ |
| `transport.students.allocate` | Assign students to buses | ✅ | ✅ | ❌ |
| `transport.routes.manage` | Create/update routes | ✅ | ✅ | ✅ |
| `transport.alerts.send` | Send alerts to drivers | ❌ | ✅ | ❌ |

**Business Rules:**
- Bus capacity cannot be exceeded
- Route changes require 7-day notice
- Breakdown alerts auto-trigger after 15-min stop

#### 3.4 Hostel Management

| Permission | Description | Read | Write | Delete |
|-----------|-------------|------|-------|--------|
| `hostel.rooms.view` | View room allocation | ✅ | ❌ | ❌ |
| `hostel.allocate` | Allocate students to rooms | ✅ | ✅ | ❌ |
| `hostel.vacate` | Mark room as vacant | ✅ | ✅ | ❌ |
| `hostel.visitors.log` | Log visitor entry/exit | ✅ | ✅ | ❌ |
| `hostel.mess.update` | Update mess menu | ✅ | ✅ | ❌ |

**Business Rules:**
- Room allocation: Same-year students only
- Visitor check-out mandatory before 8 PM
- Mess menu changes: 24-hour notice

#### 3.5 Document Management

| Permission | Description | Read | Write | Delete |
|-----------|-------------|------|-------|--------|
| `documents.templates.view` | View certificate templates | ✅ | ❌ | ❌ |
| `documents.generate` | Generate certificates | ✅ | ✅ | ❌ |
| `documents.verify` | Verify authenticity | ✅ | ❌ | ❌ |
| `documents.reissue` | Reissue lost certificates | ✅ | ✅ | ❌ |

**Business Rules:**
- Student verification required before generation
- Digital signature mandatory
- Verification code valid for 2 years

#### 3.6 Vendor Management

| Permission | Description | Read | Write | Delete |
|-----------|-------------|------|-------|--------|
| `vendors.view` | View vendor list | ✅ | ❌ | ❌ |
| `vendors.register` | Register new vendors | ❌ | ✅ | ❌ |
| `vendors.po.create` | Create purchase orders | ❌ | ✅ | ❌ |
| `vendors.po.approve` | Approve POs (< ₹50K) | ✅ | ✅ | ❌ |
| `vendors.invoices.track` | Track invoice payments | ✅ | ❌ | ❌ |

**Business Rules:**
- PO > ₹50,000 requires Principal approval
- PO > ₹2,00,000 requires Management approval
- GST validation mandatory for registered vendors

#### 3.7 Grievance Management

| Permission | Description | Read | Write | Delete |
|-----------|-------------|------|-------|--------|
| `grievances.view` | View all complaints | ✅ | ❌ | ❌ |
| `grievances.assign` | Assign to departments | ✅ | ✅ | ❌ |
| `grievances.resolve` | Mark as resolved | ✅ | ✅ | ❌ |
| `grievances.escalate` | Escalate to Principal | ✅ | ✅ | ❌ |

**Business Rules:**
- SLA tracking mandatory
- High-priority: 8 hours response time
- Auto-escalate if SLA breach

#### 3.8 Library Management

| Permission | Description | Read | Write | Delete |
|-----------|-------------|------|-------|--------|
| `library.books.view` | View book catalog | ✅ | ❌ | ❌ |
| `library.books.add` | Add new books | ❌ | ✅ | ❌ |
| `library.issue` | Issue books to students | ✅ | ✅ | ❌ |
| `library.return` | Process book returns | ✅ | ✅ | ❌ |
| `library.fines.manage` | Calculate and collect fines | ✅ | ✅ | ❌ |

**Business Rules:**
- Max 5 books per student
- Issue period: 14 days
- Fine: ₹5 per day after due date

---

## 4. Authorization Implementation

### Middleware: CollegeAdminAuthorization

**File**: `app/Http/Middleware/CollegeAdminAuthorization.php`

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CollegeAdminAuthorization
{
    public function handle(Request $request, Closure $next, ...$permissions)
    {
        $user = $request->user();

        // Check if user is authenticated
        if (!$user) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }

        // Check if user has college_admin role
        if ($user->role !== 'college_admin') {
            return response()->json([
                'error' => 'Unauthorized. College Admin access required.'
            ], 403);
        }

        // Check if user account is active
        if (!$user->is_active) {
            return response()->json([
                'error' => 'Account inactive. Contact administrator.'
            ], 403);
        }

        // Check specific permissions if provided
        if (!empty($permissions)) {
            $hasPermission = $this->checkPermissions($user, $permissions);
            if (!$hasPermission) {
                return response()->json([
                    'error' => 'Insufficient permissions',
                    'required' => $permissions
                ], 403);
            }
        }

        // Add college_id to request for automatic filtering
        $request->merge(['college_id' => $user->college_id]);

        return $next($request);
    }

    private function checkPermissions($user, $requiredPermissions)
    {
        $userPermissions = $user->permissions ?? [];
        
        foreach ($requiredPermissions as $permission) {
            if (!in_array($permission, $userPermissions)) {
                return false;
            }
        }
        
        return true;
    }
}
```

### Route Protection Example

```php
// routes/api.php
Route::middleware(['auth:sanctum', 'college.admin'])->group(function () {
    
    // Staff Management
    Route::middleware('permission:staff.attendance.mark')->group(function () {
        Route::post('/staff/attendance', [StaffController::class, 'markAttendance']);
    });

    Route::middleware('permission:staff.leave.approve')->group(function () {
        Route::put('/staff/leaves/{id}/approve', [StaffController::class, 'approveLeave']);
    });

    // Work Orders
    Route::middleware('permission:workorders.create')->group(function () {
        Route::post('/infrastructure/work-orders', [InfrastructureController::class, 'createWorkOrder']);
    });

    // Purchase Orders
    Route::middleware('permission:vendors.po.create')->group(function () {
        Route::post('/vendors/purchase-orders', [VendorController::class, 'createPO']);
    });
});
```

---

## 5. Multi-Factor Authentication

### MFA Setup

**Supported Methods:**
1. **Authenticator App** (Google Authenticator, Authy)
2. **SMS OTP**
3. **Email OTP**

### Enable MFA Flow

```
1. User navigates to Profile > Security
2. Clicks "Enable MFA"
3. Server generates secret key
4. QR code displayed (for authenticator app)
5. User scans QR code
6. User enters verification code
7. Server validates code
8. MFA enabled + backup codes generated (10)
9. User downloads/saves backup codes
```

### Login with MFA

```php
// Step 1: Initial login
POST /api/college-admin/login
Request: { "email": "...", "password": "..." }
Response: {
    "mfa_required": true,
    "temp_token": "abc123...",
    "mfa_method": "authenticator"
}

// Step 2: MFA verification
POST /api/college-admin/mfa/verify
Request: {
    "temp_token": "abc123...",
    "code": "123456"
}
Response: {
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "user": { ... }
}
```

---

## 6. Session Management

### Token Lifecycle

```
┌─────────────────────────────────────────┐
│ 1. Login → JWT Token (24h expiry)      │
│    + Refresh Token (7d expiry)          │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│ 2. Make API requests with JWT token    │
│    Authorization: Bearer {token}        │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│ 3. Token expires (after 24h)           │
│    Server returns 401 Unauthorized      │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│ 4. Client uses refresh token           │
│    POST /api/refresh                    │
│    → New JWT token issued               │
└─────────────────────────────────────────┘
                    │
┌─────────────────────────────────────────┐
│ 5. Refresh token expires (after 7d)    │
│    → User must login again              │
└─────────────────────────────────────────┘
```

### Logout

```php
POST /api/college-admin/logout

// Server actions:
1. Revoke current token
2. Revoke all refresh tokens
3. Log logout event in audit log
4. Clear session data
```

---

## 7. Security Policies

### Password Policy

```
✅ Minimum length: 12 characters
✅ Must contain: uppercase, lowercase, number, special char
✅ Cannot contain: name, email, common words
✅ Expiry: 90 days
✅ History: Cannot reuse last 5 passwords
✅ Max attempts: 5 (then account locked for 30 mins)
```

### API Rate Limiting

```php
// config/sanctum.php
'limiter' => [
    'login' => [
        'max_attempts' => 5,
        'decay_minutes' => 15,
    ],
    'api' => [
        'max_attempts' => 1000,
        'decay_minutes' => 60,
    ],
];
```

### Audit Logging

**All actions logged to** `audit_logs` **table:**

```sql
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id BIGINT,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Logged Actions:**
- Login/logout
- Staff attendance mark/edit
- Leave approve/reject
- Work order create/assign/complete
- Purchase order create/approve
- Document generation
- Grievance resolution

### Data Access Control

**Row-Level Security:**
```sql
-- All queries automatically filtered by college_id
SELECT * FROM staff WHERE college_id = {user.college_id};
SELECT * FROM assets WHERE college_id = {user.college_id};
SELECT * FROM work_orders WHERE college_id = {user.college_id};
```

**Prevented Actions:**
- Cannot access other college's data
- Cannot modify system-wide settings
- Cannot assign roles (Super Admin only)
- Cannot delete audit logs

---

## Summary

This authentication and authorization system provides:

✅ **Secure Authentication**: JWT + MFA  
✅ **Granular Permissions**: 40+ permissions across 8 modules  
✅ **Role-Based Access**: College Admin role with defined scope  
✅ **Data Isolation**: Automatic college_id filtering  
✅ **Audit Trail**: Complete action logging  
✅ **Session Management**: Token refresh with 7-day validity  
✅ **Security Policies**: Password rules, rate limiting, account lockout  
✅ **Production Ready**: Laravel Sanctum with industry best practices
