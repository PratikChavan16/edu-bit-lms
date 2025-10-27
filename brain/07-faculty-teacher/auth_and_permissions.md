# Faculty/Teacher Portal - Authentication and Permissions

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [JWT Token Structure](#jwt-token-structure)
4. [Permission System](#permission-system)
5. [Scopes and Tenancy](#scopes-and-tenancy)
6. [Time-Based Access Controls](#time-based-access-controls)
7. [Delegation and Substitution](#delegation-and-substitution)
8. [Approval Workflows](#approval-workflows)
9. [Two-Factor Authentication (2FA)](#two-factor-authentication-2fa)
10. [Session Management](#session-management)
11. [Audit and Logging](#audit-and-logging)
12. [Security Best Practices](#security-best-practices)

---

## Overview

The Faculty Portal implements a multi-layered security model combining:
- **JWT-based authentication** with RS256 signing
- **Role-Based Access Control (RBAC)** with granular permissions
- **Row-Level Security (RLS)** enforced at database level
- **Time-scoped access** for attendance and grade editing
- **Delegation mechanisms** for substitution teaching
- **Comprehensive audit logging** for all critical actions

**Security Principles**:
- **Least Privilege**: Faculty access only their assigned courses and students
- **Defense in Depth**: Multiple validation layers (middleware, service, database)
- **Transparency**: All actions auditable with who, what, when, why
- **Privacy First**: Student PII protected, peer visibility blocked
- **Offline Support**: Secure local storage with sync integrity

---

## Authentication

### Login Flow

1. **Initial Request**: Faculty navigates to `https://faculty.yourinstitution.edu`
2. **Credential Submission**: POST to `/api/auth/login` with:
   ```json
   {
     "username": "john.doe@institution.edu",
     "password": "hashed_password",
     "device_fingerprint": "sha256_hash"
   }
   ```
3. **2FA Challenge** (if enabled):
   - System sends TOTP code or SMS
   - Faculty submits code to `/api/auth/verify-2fa`
4. **Token Issuance**:
   - Backend generates JWT with RS256 signature
   - Access token (1 hour expiry) + Refresh token (7 days expiry)
5. **Frontend Storage**:
   - Access token: Memory (Zustand store)
   - Refresh token: HttpOnly cookie
   - Device ID: LocalStorage (for device binding)

### Token Refresh Flow

```typescript
// Automatic token refresh (frontend)
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      const newToken = await refreshAccessToken();
      error.config.headers.Authorization = `Bearer ${newToken}`;
      return axios.request(error.config);
    }
    return Promise.reject(error);
  }
);
```

**Backend Endpoint**: `POST /api/auth/refresh`
- Validates refresh token from HttpOnly cookie
- Issues new access token
- Rotates refresh token (optional, per security policy)

### Logout Flow

1. **Frontend**: Clear Zustand store, delete cookies, clear IndexedDB
2. **Backend**: `POST /api/auth/logout` - Blacklist tokens in Redis
3. **Session Termination**: Remove device binding, log event

### Password Reset

1. **Request**: `POST /api/auth/forgot-password` with email
2. **Email**: Secure token sent (valid 1 hour)
3. **Reset**: `POST /api/auth/reset-password` with token + new password
4. **Confirmation**: All sessions invalidated, user must re-login

---

## JWT Token Structure

### Access Token

**Algorithm**: RS256 (RSA Signature with SHA-256)

**Header**:
```json
{
  "alg": "RS256",
  "typ": "JWT",
  "kid": "faculty-portal-key-2025-10"
}
```

**Payload**:
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "iss": "https://auth.yourinstitution.edu",
  "aud": "faculty-portal",
  "role": "faculty",
  "faculty_id": "FAC001",
  "faculty_name": "Prof. John Doe",
  "employee_id": "EMP12345",
  "college_id": "CLG123",
  "college_name": "Main Campus",
  "department_id": "CSE",
  "department_name": "Computer Science",
  "permissions": [
    "attendance:mark",
    "attendance:edit",
    "attendance:view",
    "assessment:create",
    "assessment:edit",
    "assessment:delete",
    "grade:update",
    "grade:publish",
    "grade:view",
    "materials:create",
    "materials:edit",
    "materials:delete",
    "materials:view",
    "message:send",
    "message:view",
    "leave:request",
    "leave:view",
    "duty:acknowledge",
    "duty:view",
    "analytics:view"
  ],
  "substitute_for": null,
  "substitute_until": null,
  "device_id": "d8f3a9b2c1e4567890abcdef12345678",
  "device_name": "Chrome on Windows",
  "ip_address": "192.168.1.100",
  "2fa_verified": true,
  "iat": 1729852800,
  "exp": 1729856400,
  "nbf": 1729852800,
  "jti": "unique-jwt-identifier-123"
}
```

**Signature**: Generated using private RSA key (2048-bit minimum)

### Refresh Token

**Payload** (simplified):
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "type": "refresh",
  "iat": 1729852800,
  "exp": 1730457600,
  "jti": "refresh-token-unique-id-456"
}
```

**Storage**: HttpOnly, Secure, SameSite=Strict cookie

### Substitute Token (Special Case)

When faculty acts as substitute:
```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "role": "faculty",
  "faculty_id": "FAC001",
  "substitute_for": "FAC025",
  "substitute_for_name": "Prof. Jane Smith",
  "substitute_until": "2025-10-30T18:00:00Z",
  "substitute_courses": ["COURSE101", "COURSE205"],
  "permissions": [
    "attendance:mark",
    "materials:view",
    "message:send:limited"
  ],
  // ... other standard claims
}
```

**Restrictions**:
- Limited permissions (cannot publish grades, delete materials)
- Time-bound access (auto-revokes after `substitute_until`)
- Course-scoped (only assigned courses accessible)
- All actions tagged with substitute context

---

## Permission System

### Permission Hierarchy

```
faculty (base role)
├── attendance
│   ├── attendance:view (implicit for all faculty)
│   ├── attendance:mark (can mark present/absent)
│   ├── attendance:edit (can edit within window)
│   └── attendance:override (HOD+ only, beyond window)
├── assessment
│   ├── assessment:view
│   ├── assessment:create
│   ├── assessment:edit (own assessments)
│   ├── assessment:delete (drafts only)
│   └── assessment:publish
├── grade
│   ├── grade:view (own courses)
│   ├── grade:update (enter/modify before publish)
│   ├── grade:publish (finalize and notify students)
│   └── grade:revise (post-publish, requires approval)
├── materials
│   ├── materials:view
│   ├── materials:create
│   ├── materials:edit
│   ├── materials:delete
│   └── materials:archive
├── message
│   ├── message:view
│   ├── message:send (to students in own courses)
│   ├── message:broadcast (to entire class)
│   └── message:urgent (priority notifications)
├── leave
│   ├── leave:view (own leaves)
│   ├── leave:request
│   ├── leave:cancel (before approval)
│   └── leave:approve (HOD+ only)
├── duty
│   ├── duty:view (own duty assignments)
│   ├── duty:acknowledge
│   ├── duty:report (submit duty reports)
│   └── duty:assign (admin only)
└── analytics
    ├── analytics:view:self (own course analytics)
    ├── analytics:view:students (student performance)
    └── analytics:export (download reports)
```

### Permission Matrix

| Action | Regular Faculty | Substitute Faculty | HOD | Principal |
|--------|----------------|-------------------|-----|-----------|
| Mark Attendance | ✅ | ✅ (assigned courses only) | ✅ | ✅ |
| Edit Attendance (within 24h) | ✅ | ❌ | ✅ | ✅ |
| Edit Attendance (beyond 24h) | 🔶 (with approval) | ❌ | ✅ | ✅ |
| Create Assessment | ✅ | ❌ | ✅ | ✅ |
| Delete Assessment (draft) | ✅ | ❌ | ✅ | ✅ |
| Delete Assessment (published) | 🔶 (with approval) | ❌ | ✅ | ✅ |
| Enter Grades | ✅ | ❌ | ✅ | ✅ |
| Publish Grades | ✅ (with 2FA) | ❌ | ✅ | ✅ |
| Revise Published Grades | 🔶 (with approval) | ❌ | ✅ | ✅ |
| Upload Materials | ✅ | 🔶 (view only) | ✅ | ✅ |
| Delete Materials | ✅ | ❌ | ✅ | ✅ |
| Send Class Announcement | ✅ | ✅ (limited) | ✅ | ✅ |
| Send 1:1 Message | ✅ | 🔶 (limited) | ✅ | ✅ |
| Request Leave | ✅ | ✅ | ✅ | ✅ |
| Approve Leave | ❌ | ❌ | ✅ | ✅ |
| View Student PII | ✅ (own courses) | ✅ (assigned courses) | ✅ (department) | ✅ (college) |
| Export Student Data | ✅ (with justification) | ❌ | ✅ | ✅ |
| View Department Analytics | ❌ | ❌ | ✅ | ✅ |

**Legend**:  
✅ = Allowed  
❌ = Denied  
🔶 = Requires additional approval or step-up auth

---

## Scopes and Tenancy

### College-Level Scoping

**Middleware**: `EnsureCollegeScope`

```php
public function handle(Request $request, Closure $next)
{
    $collegeId = $request->user()->college_id;
    
    // Set global scope for all queries
    DB::table('courses')->where('college_id', $collegeId);
    DB::table('students')->where('college_id', $collegeId);
    
    return $next($request);
}
```

**Effect**: Faculty can only access data from their assigned college, even if they somehow obtain IDs from other colleges.

### Faculty-Level Scoping

**Eloquent Global Scope**: `FacultyScoped`

```php
class FacultyScoped implements Scope
{
    public function apply(Builder $builder, Model $model)
    {
        $facultyId = auth()->user()->faculty_id;
        
        // Apply based on model type
        if ($model instanceof Course) {
            $builder->whereHas('assignments', function ($query) use ($facultyId) {
                $query->where('faculty_id', $facultyId);
            });
        }
        
        if ($model instanceof Student) {
            $builder->whereHas('enrollments.course.assignments', function ($query) use ($facultyId) {
                $query->where('faculty_id', $facultyId);
            });
        }
    }
}
```

**Effect**: Faculty automatically see only courses they teach and students enrolled in those courses.

### PostgreSQL Row-Level Security (RLS)

**Policy for Attendance Table**:

```sql
-- Faculty can view attendance for their assigned courses
CREATE POLICY faculty_view_attendance ON attendance
    FOR SELECT
    TO faculty_role
    USING (
        course_id IN (
            SELECT course_id 
            FROM course_assignments 
            WHERE faculty_id = current_setting('app.faculty_id')::uuid
        )
    );

-- Faculty can insert attendance for their courses
CREATE POLICY faculty_insert_attendance ON attendance
    FOR INSERT
    TO faculty_role
    WITH CHECK (
        course_id IN (
            SELECT course_id 
            FROM course_assignments 
            WHERE faculty_id = current_setting('app.faculty_id')::uuid
        )
        AND marked_at >= NOW() - INTERVAL '24 hours'
    );

-- Faculty can update attendance within 24-hour window
CREATE POLICY faculty_update_attendance ON attendance
    FOR UPDATE
    TO faculty_role
    USING (
        course_id IN (
            SELECT course_id 
            FROM course_assignments 
            WHERE faculty_id = current_setting('app.faculty_id')::uuid
        )
        AND marked_at >= NOW() - INTERVAL '24 hours'
    );
```

**Laravel Integration**:

```php
// Set RLS context before queries
DB::statement("SET app.faculty_id = ?", [auth()->user()->faculty_id]);
DB::statement("SET app.college_id = ?", [auth()->user()->college_id]);
```

### Substitute Access Scoping

When acting as substitute, additional constraints apply:

```php
public function handle(Request $request, Closure $next)
{
    $substituteFor = $request->user()->substitute_for;
    $substituteUntil = $request->user()->substitute_until;
    
    if ($substituteFor) {
        // Check time validity
        if (Carbon::now()->isAfter($substituteUntil)) {
            throw new UnauthorizedException('Substitute access expired');
        }
        
        // Restrict to substitute courses only
        $allowedCourses = SubstituteAssignment::where('substitute_faculty_id', auth()->id())
            ->pluck('course_id');
        
        Course::addGlobalScope('substitute', function ($query) use ($allowedCourses) {
            $query->whereIn('id', $allowedCourses);
        });
    }
    
    return $next($request);
}
```

---

## Time-Based Access Controls

### Attendance Edit Window

**Default Policy**: 24 hours from class end time

**Implementation**:

```php
class AttendancePolicy
{
    public function edit(User $user, Attendance $attendance)
    {
        $classEndTime = $attendance->class_session->end_time;
        $editDeadline = $classEndTime->addHours(24);
        
        if (now()->lessThanOrEqualTo($editDeadline)) {
            return true; // Within window
        }
        
        // Beyond window: requires approval
        if ($user->hasPermission('attendance:override')) {
            return true; // HOD or Principal can override
        }
        
        // Regular faculty must request approval
        return $attendance->edit_approval_status === 'approved';
    }
}
```

**Frontend Handling**:

```typescript
// Attendance edit component
const canEdit = useMemo(() => {
  const classEndTime = new Date(attendance.class_session.end_time);
  const editDeadline = addHours(classEndTime, 24);
  
  if (isBefore(new Date(), editDeadline)) {
    return { allowed: true, requiresApproval: false };
  }
  
  if (user.permissions.includes('attendance:override')) {
    return { allowed: true, requiresApproval: false };
  }
  
  return { allowed: false, requiresApproval: true };
}, [attendance, user]);
```

**Approval Request Flow**:

1. Faculty attempts to edit attendance beyond 24h window
2. System shows: "Editing requires approval. Submit request?"
3. Faculty provides justification (text + optional attachment)
4. Request sent to HOD/Principal
5. Approver reviews: attendance details, edit reason, faculty history
6. Decision: Approve (allow edit) or Reject (with reason)
7. Faculty notified, if approved, edit window opens for 1 hour

### Grade Revision Window

**Policy**: Grades finalized 7 days after term-end, revisions require approval

```php
public function revise(User $user, Grade $grade)
{
    $termEndDate = $grade->course->term->end_date;
    $finalizationDate = $termEndDate->addDays(7);
    
    if (now()->lessThan($finalizationDate)) {
        return $user->hasPermission('grade:publish'); // Normal edit
    }
    
    // Post-finalization: requires approval
    return $grade->revision_approval_status === 'approved';
}
```

### Substitution Time Validity

```php
public function validateSubstituteAccess(User $user, Course $course)
{
    $substituteUntil = Carbon::parse($user->substitute_until);
    
    if (now()->isAfter($substituteUntil)) {
        // Auto-revoke access
        $user->substitute_for = null;
        $user->substitute_until = null;
        $user->save();
        
        throw new AccessDeniedException('Substitute period expired');
    }
    
    // Check course-specific assignment
    $isAssigned = SubstituteAssignment::where([
        'substitute_faculty_id' => $user->id,
        'course_id' => $course->id,
        'start_date' => '<=', now(),
        'end_date' => '>=', now()
    ])->exists();
    
    if (!$isAssigned) {
        throw new AccessDeniedException('Not assigned to this course');
    }
}
```

---

## Delegation and Substitution

### Substitution Assignment

**Scenario**: Prof. John (original faculty) going on leave, Prof. Jane assigned as substitute

**Assignment Record**:
```php
SubstituteAssignment::create([
    'original_faculty_id' => 'FAC001', // John
    'substitute_faculty_id' => 'FAC025', // Jane
    'course_id' => 'COURSE101',
    'start_date' => '2025-11-01',
    'end_date' => '2025-11-10',
    'approved_by' => 'HOD123',
    'approved_at' => now(),
    'permissions' => [
        'attendance:mark',
        'materials:view',
        'message:send:limited'
    ]
]);
```

**JWT Claims for Jane**:
```json
{
  "faculty_id": "FAC025",
  "substitute_for": "FAC001",
  "substitute_for_name": "Prof. John Doe",
  "substitute_until": "2025-11-10T23:59:59Z",
  "substitute_courses": ["COURSE101"],
  "permissions": [
    "attendance:mark",
    "materials:view",
    "message:send:limited"
  ]
}
```

### Substitute Actions Tracking

**Attendance Marked by Substitute**:

```php
Attendance::create([
    'course_id' => 'COURSE101',
    'student_id' => 'STU456',
    'date' => '2025-11-05',
    'status' => 'present',
    'marked_by' => 'FAC025', // Jane
    'marked_as_substitute_for' => 'FAC001', // John
    'marked_at' => now()
]);
```

**Frontend Display**:
```
Attendance Record
-----------------
Date: November 5, 2025
Marked by: Prof. Jane Smith (Substitute for Prof. John Doe)
Status: Present
```

**Audit Log Entry**:
```json
{
  "event": "attendance.marked",
  "actor_id": "FAC025",
  "actor_name": "Prof. Jane Smith",
  "actor_role": "substitute",
  "on_behalf_of": "FAC001",
  "on_behalf_of_name": "Prof. John Doe",
  "course_id": "COURSE101",
  "student_id": "STU456",
  "timestamp": "2025-11-05T10:30:00Z",
  "ip_address": "192.168.1.105",
  "device_id": "substitute-device-hash"
}
```

### Automatic Access Revocation

**Cron Job** (runs hourly):

```php
// app/Console/Commands/RevokeExpiredSubstitutes.php
public function handle()
{
    $expiredSubstitutes = SubstituteAssignment::where('end_date', '<', now())
        ->where('status', 'active')
        ->get();
    
    foreach ($expiredSubstitutes as $assignment) {
        $assignment->update(['status' => 'expired']);
        
        // Invalidate all tokens for substitute accessing these courses
        $this->invalidateSubstituteTokens($assignment->substitute_faculty_id);
        
        // Log event
        AuditLog::create([
            'event' => 'substitute.access.revoked',
            'faculty_id' => $assignment->substitute_faculty_id,
            'reason' => 'Time period expired',
            'revoked_at' => now()
        ]);
    }
}
```

---

## Approval Workflows

### Attendance Edit Approval

**Request Structure**:

```php
AttendanceEditRequest::create([
    'attendance_id' => 'ATT123',
    'requested_by' => 'FAC001',
    'requested_at' => now(),
    'justification' => 'Student provided medical certificate after 24h window',
    'proposed_change' => [
        'from' => 'absent',
        'to' => 'excused'
    ],
    'supporting_documents' => ['medical_cert.pdf'],
    'status' => 'pending',
    'approver_id' => null,
    'approved_at' => null
]);
```

**Approval Flow**:

1. **Request Submission**: Faculty clicks "Request Edit Approval"
2. **Notification**: HOD/Principal receives email + in-app notification
3. **Review**: Approver views attendance history, faculty track record, justification
4. **Decision**:
   - **Approve**: Edit window opens for 1 hour
   - **Reject**: Faculty notified with reason
5. **Execution**: If approved, faculty makes edit, system logs approval context
6. **Audit**: Full trail maintained with approver decision reasoning

### Grade Revision Approval

**Similar flow for post-finalization grade changes**:

```php
GradeRevisionRequest::create([
    'grade_id' => 'GRD789',
    'requested_by' => 'FAC001',
    'justification' => 'Calculation error discovered during quality review',
    'proposed_change' => [
        'from' => 75,
        'to' => 82
    ],
    'supporting_evidence' => ['recalculation_sheet.xlsx', 'rubric.pdf'],
    'status' => 'pending',
    'requires_approval_from' => 'HOD', // or 'principal' based on threshold
    'urgency' => 'normal' // or 'high' if affects graduation
]);
```

**Approval Threshold**:
- Grade change < 5 marks: HOD approval sufficient
- Grade change ≥ 5 marks or changes pass/fail status: Principal approval required
- Bulk grade changes (affecting >10 students): Academic committee review

---

## Two-Factor Authentication (2FA)

### Enrollment

**Setup Flow**:

1. Faculty navigates to Settings → Security → 2FA
2. Selects method: TOTP (Google Authenticator) or SMS
3. **TOTP Setup**:
   - Backend generates secret key
   - Display QR code + manual entry code
   - Faculty scans QR in authenticator app
   - Verifies with generated code
4. **SMS Setup**:
   - Faculty enters phone number
   - Receives verification code
   - Confirms code
5. **Backup Codes**: System generates 10 single-use codes for account recovery
6. **Confirmation**: 2FA enabled, logged in audit trail

### Login with 2FA

```typescript
// Frontend flow
async function login(username: string, password: string) {
  const response = await axios.post('/api/auth/login', { username, password });
  
  if (response.data.requires_2fa) {
    // Show 2FA prompt
    const code = await prompt2FACode();
    
    const verifyResponse = await axios.post('/api/auth/verify-2fa', {
      session_token: response.data.session_token,
      code: code,
      device_id: getDeviceFingerprint()
    });
    
    // Store tokens
    storeTokens(verifyResponse.data);
  } else {
    storeTokens(response.data);
  }
}
```

### Step-Up Authentication

**Required for**:
- Publishing grades
- Bulk grade changes
- Exporting student data
- Changing 2FA settings
- Adding new device

**Implementation**:

```php
public function publishGrades(Request $request, Course $course)
{
    // Check if step-up auth completed in last 5 minutes
    if (!$request->user()->hasRecentStepUpAuth(minutes: 5)) {
        return response()->json([
            'requires_step_up' => true,
            'action': 'grade.publish',
            'challenge_id' => Str::uuid()
        ], 403);
    }
    
    // Proceed with grade publication
    // ...
}
```

**Frontend**:

```typescript
try {
  await publishGrades(courseId);
} catch (error) {
  if (error.response?.data?.requires_step_up) {
    const code = await prompt2FACode('Confirm Grade Publication');
    await verifyStepUpAuth(error.response.data.challenge_id, code);
    
    // Retry original action
    await publishGrades(courseId);
  }
}
```

### Device Binding

**Trusted Devices**:
- After successful 2FA login, device can be marked "trusted"
- Trusted devices skip 2FA for 30 days
- Faculty can view/revoke trusted devices in settings

```php
TrustedDevice::create([
    'faculty_id' => 'FAC001',
    'device_fingerprint' => hash('sha256', $userAgent . $ip . $browserFingerprint),
    'device_name' => 'Chrome on Windows',
    'last_used_at' => now(),
    'expires_at' => now()->addDays(30)
]);
```

---

## Session Management

### Session Storage

**Backend**:
- Sessions stored in Redis with 7-day TTL
- Key format: `session:faculty:{faculty_id}:{device_id}`
- Includes: IP address, user agent, last activity, permissions

**Frontend**:
- Access token: Memory (Zustand, cleared on tab close)
- Refresh token: HttpOnly cookie (7-day expiry)
- Device ID: LocalStorage (persistent)

### Concurrent Sessions

**Policy**: Faculty can have up to 5 active sessions (devices) simultaneously

**Enforcement**:

```php
public function login(Request $request)
{
    $facultyId = $request->user()->faculty_id;
    $deviceId = $request->input('device_id');
    
    // Count active sessions
    $activeSessions = Redis::keys("session:faculty:{$facultyId}:*");
    
    if (count($activeSessions) >= 5) {
        // Revoke oldest session
        $oldestSession = $this->getOldestSession($activeSessions);
        Redis::del($oldestSession);
    }
    
    // Create new session
    Redis::setex(
        "session:faculty:{$facultyId}:{$deviceId}",
        604800, // 7 days
        json_encode([
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'created_at' => now(),
            'last_activity' => now()
        ])
    );
}
```

### Session Revocation

**Manual Logout**:
```php
public function logout(Request $request)
{
    $facultyId = auth()->id();
    $deviceId = $request->input('device_id');
    
    // Blacklist tokens
    Redis::sadd("blacklisted_tokens", $request->bearerToken());
    Redis::sadd("blacklisted_refresh_tokens", $request->cookie('refresh_token'));
    
    // Delete session
    Redis::del("session:faculty:{$facultyId}:{$deviceId}");
    
    return response()->json(['message' => 'Logged out successfully']);
}
```

**Remote Revocation** (from settings page):
```typescript
// Faculty can revoke sessions from other devices
async function revokeSession(deviceId: string) {
  await axios.post('/api/auth/revoke-session', { device_id: deviceId });
  // Refresh active sessions list
}
```

### Idle Timeout

**Frontend**:
```typescript
let idleTimer: NodeJS.Timeout;

function resetIdleTimer() {
  clearTimeout(idleTimer);
  
  idleTimer = setTimeout(() => {
    // Warn user at 25 minutes
    showIdleWarning();
    
    setTimeout(() => {
      // Logout at 30 minutes
      logout();
    }, 5 * 60 * 1000);
  }, 25 * 60 * 1000);
}

// Reset on user activity
window.addEventListener('mousemove', resetIdleTimer);
window.addEventListener('keypress', resetIdleTimer);
```

---

## Audit and Logging

### Critical Events

**Authentication Events**:
- Login success/failure (with IP, device, timestamp)
- 2FA enrollment, verification, failure
- Password changes
- Session creation/revocation
- Step-up auth challenges

**Academic Events**:
- Attendance marked/edited (before/after values)
- Grades entered/updated/published/revised
- Assessments created/modified/deleted
- Materials uploaded/edited/deleted
- Announcements sent

**Administrative Events**:
- Leave requests submitted/approved/rejected
- Substitution assignments
- Exam duty acknowledgments
- Incident reports

### Audit Log Structure

```php
AuditLog::create([
    'event_type' => 'attendance.marked',
    'actor_type' => 'faculty',
    'actor_id' => 'FAC001',
    'actor_name' => 'Prof. John Doe',
    'actor_role' => 'faculty',
    'target_type' => 'attendance',
    'target_id' => 'ATT123',
    'action' => 'create',
    'before_value' => null,
    'after_value' => json_encode(['status' => 'present', 'marked_at' => now()]),
    'justification' => null,
    'ip_address' => '192.168.1.100',
    'user_agent' => 'Mozilla/5.0...',
    'device_fingerprint' => 'sha256_hash',
    'college_id' => 'CLG123',
    'department_id' => 'CSE',
    'course_id' => 'COURSE101',
    'metadata' => json_encode([
        'session_id' => 'session_uuid',
        'request_id' => 'request_uuid',
        'source' => 'web' // or 'mobile', 'api'
    ]),
    'timestamp' => now(),
    'severity' => 'info' // or 'warning', 'critical'
]);
```

### Retention Policy

| Event Category | Retention Period | Storage Tier |
|----------------|------------------|--------------|
| Authentication | 2 years | Hot (PostgreSQL) |
| Attendance | 7 years | Warm (Archived after 2 years) |
| Grades | Permanent | Cold (Archived after 7 years) |
| Materials | 5 years | Warm |
| Messages | 3 years | Warm |
| Administrative | 7 years | Warm |

### Access Controls

**Who Can Access Audit Logs**:
- **Faculty**: Own actions only (read-only)
- **HOD**: Department faculty actions
- **Principal**: College-wide actions
- **Auditors**: Full access with justification
- **System Admins**: Technical logs only

**API Endpoint**:
```http
GET /api/audit-logs?
  faculty_id=FAC001&
  event_type=attendance.marked&
  start_date=2025-10-01&
  end_date=2025-10-31&
  page=1&limit=50
```

**Response**:
```json
{
  "data": [
    {
      "id": "audit_uuid_123",
      "event_type": "attendance.marked",
      "actor": "Prof. John Doe",
      "timestamp": "2025-10-25T10:30:00Z",
      "details": {
        "course": "CS101",
        "students_marked": 60,
        "absences": 3
      }
    }
  ],
  "pagination": { "total": 1250, "page": 1, "per_page": 50 }
}
```

---

## Security Best Practices

### Input Validation

- **Server-side validation** for all inputs (never trust client)
- **Whitelist approach**: Allow only known-safe values
- **Type checking**: Enforce strict types (TypeScript + PHP type hints)
- **Length limits**: Prevent buffer overflow attacks
- **Sanitization**: Escape HTML, SQL, command injection vectors

### SQL Injection Prevention

```php
// ❌ BAD
$results = DB::select("SELECT * FROM students WHERE faculty_id = " . $facultyId);

// ✅ GOOD
$results = DB::table('students')
    ->where('faculty_id', $facultyId)
    ->get();

// ✅ GOOD (raw queries with bindings)
$results = DB::select("SELECT * FROM students WHERE faculty_id = ?", [$facultyId]);
```

### XSS Prevention

```typescript
// ❌ BAD
studentNameDiv.innerHTML = studentData.name;

// ✅ GOOD
studentNameDiv.textContent = studentData.name;

// ✅ GOOD (React automatically escapes)
<div>{studentData.name}</div>

// For rich text (use DOMPurify)
import DOMPurify from 'dompurify';
const cleanHTML = DOMPurify.sanitize(userHTML);
```

### CSRF Protection

- **SameSite Cookies**: All cookies set with `SameSite=Strict`
- **CSRF Tokens**: Laravel's built-in CSRF protection enabled
- **Double Submit**: Refresh token rotation

```php
// Laravel automatic CSRF protection
Route::post('/api/attendance/mark', [AttendanceController::class, 'mark'])
    ->middleware('web'); // Includes VerifyCsrfToken middleware
```

### Rate Limiting

```php
// routes/api.php
Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {
    // 60 requests per minute per faculty
    Route::post('/attendance/mark', [AttendanceController::class, 'mark']);
});

// Custom rate limits for sensitive actions
Route::post('/grades/publish', [GradeController::class, 'publish'])
    ->middleware('throttle:10,1'); // 10 publishes per minute
```

### Encryption

**Data at Rest**:
- Database: Encrypted columns for PII (Laravel Encryption)
- Files: S3 server-side encryption (SSE-S3 or SSE-KMS)
- Backups: Encrypted with AES-256

**Data in Transit**:
- TLS 1.3 enforced (no fallback to older versions)
- Certificate pinning in mobile app
- HSTS header: `Strict-Transport-Security: max-age=31536000; includeSubDomains`

```php
// Encrypt sensitive fields
use Illuminate\Contracts\Encryption\Encryptor;

class Student extends Model
{
    protected $casts = [
        'ssn' => 'encrypted',
        'phone' => 'encrypted',
        'email' => 'encrypted'
    ];
}
```

### Dependency Management

- **Automated scanning**: Snyk, Dependabot
- **Regular updates**: Weekly security patch reviews
- **Version pinning**: Lock file for reproducible builds
- **Minimal dependencies**: Reduce attack surface

```json
// package.json
{
  "scripts": {
    "audit": "npm audit --audit-level=moderate",
    "audit:fix": "npm audit fix"
  }
}
```

---

**Document Version**: 2.0  
**Last Security Audit**: October 25, 2025  
**Next Review**: January 25, 2026  
**Maintained By**: Security Team + Faculty Portal Developers
