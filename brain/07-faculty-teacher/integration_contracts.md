# Faculty/Teacher Portal - Integration Contracts

**Version**: 2.0  
**Last Updated**: October 25, 2025  
**API Version**: v1

---

## Table of Contents

1. [Integration Overview](#integration-overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [REST API Contracts](#rest-api-contracts)
4. [Event Bus Integration](#event-bus-integration)
5. [Webhook Specifications](#webhook-specifications)
6. [Inter-Portal Communication](#inter-portal-communication)
7. [Data Sync Contracts](#data-sync-contracts)
8. [Error Handling Standards](#error-handling-standards)
9. [Rate Limiting](#rate-limiting)
10. [Versioning Strategy](#versioning-strategy)

---

## Integration Overview

### Architecture Diagram

```
┌────────────────────────────────────────────────────────────┐
│                    API Gateway (Kong)                       │
│            Rate Limiting • Auth • Logging                   │
└─────────────┬──────────────────────────────────────────────┘
              │
    ┌─────────┴─────────┐
    │                   │
    ▼                   ▼
┌─────────┐       ┌──────────┐
│ Faculty │       │  Redis   │
│ Backend │◄─────►│  Cache   │
│ Laravel │       └──────────┘
└────┬────┘
     │
     ├─────► PostgreSQL (with RLS)
     │
     ├─────► Event Bus (RabbitMQ/Redis Streams)
     │         ├─► Student Portal
     │         ├─► Principal Portal
     │         ├─► Registrar Portal
     │         └─► Notification Service
     │
     └─────► External Services
               ├─► SMS Gateway
               ├─► Email Service
               └─► File Storage (S3)
```

### Integration Points

| Portal/Service | Purpose | Protocol | Auth Method |
|----------------|---------|----------|-------------|
| Student Portal | Grade sync, attendance visibility | REST + Events | JWT (RS256) |
| Principal Portal | Reports, approval workflows | REST + Events | JWT (RS256) |
| Registrar Portal | Course enrollment, student data | REST | JWT (RS256) |
| Notification Service | Email/SMS notifications | Events | API Key |
| File Storage | Material uploads, submissions | S3 API | IAM Credentials |
| Analytics Service | Usage metrics, performance data | Events | API Key |

---

## Authentication & Authorization

### JWT Token Structure

```typescript
interface FacultyJWT {
  // Header
  alg: "RS256";
  typ: "JWT";
  kid: string; // Key ID for rotation
  
  // Payload
  sub: string;           // Faculty ID (e.g., "FAC001")
  iss: "faculty-portal"; // Issuer
  aud: string[];         // Audience (e.g., ["student-portal", "principal-portal"])
  iat: number;           // Issued at (Unix timestamp)
  exp: number;           // Expiration (iat + 1 hour)
  nbf: number;           // Not before (iat)
  
  // Custom claims
  role: "faculty" | "hod" | "principal";
  college_id: string;
  department_id: string;
  permissions: string[]; // e.g., ["attendance:write", "grade:publish"]
  2fa_verified: boolean;
  session_id: string;    // For revocation
}
```

### Token Exchange Flow

```
Faculty Portal                     Other Portal
      │                                  │
      │  1. Request with JWT             │
      │─────────────────────────────────►│
      │                                  │
      │                    2. Validate JWT│
      │                       (verify sig)│
      │                                  │
      │  3. Response + Refresh Token     │
      │◄─────────────────────────────────│
      │                                  │
```

### API Key Authentication (Service-to-Service)

```http
POST /api/v1/faculty/attendance/sync
Host: faculty.institution.edu
X-API-Key: sk_live_abc123...
X-Request-ID: req_xyz789...
Content-Type: application/json

{
  "service": "student-portal",
  "data": { ... }
}
```

---

## REST API Contracts

### OpenAPI 3.1 Specification

#### 1. Mark Attendance

```yaml
paths:
  /api/v1/faculty/attendance:
    post:
      summary: Mark attendance for a class session
      operationId: markAttendance
      tags: [Attendance]
      security:
        - bearerAuth: []
      parameters:
        - name: X-Request-ID
          in: header
          required: true
          schema:
            type: string
            format: uuid
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [course_id, date, records]
              properties:
                course_id:
                  type: string
                  example: "CS101"
                date:
                  type: string
                  format: date
                  example: "2025-10-25"
                session_type:
                  type: string
                  enum: [lecture, lab, tutorial]
                  example: "lecture"
                records:
                  type: array
                  items:
                    type: object
                    required: [student_id, status]
                    properties:
                      student_id:
                        type: string
                        example: "STU001"
                      status:
                        type: string
                        enum: [present, absent, late, excused]
                      notes:
                        type: string
                        maxLength: 500
                offline_id:
                  type: string
                  description: Client-generated UUID for offline sync
      responses:
        '201':
          description: Attendance marked successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    example: true
                  message:
                    type: string
                    example: "Attendance marked for 60 students"
                  data:
                    type: object
                    properties:
                      attendance_id:
                        type: string
                        example: "ATT_20251025_CS101_001"
                      marked_at:
                        type: string
                        format: date-time
                      summary:
                        type: object
                        properties:
                          present: { type: integer }
                          absent: { type: integer }
                          late: { type: integer }
                          excused: { type: integer }
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '403':
          $ref: '#/components/responses/Forbidden'
        '422':
          $ref: '#/components/responses/ValidationError'
        '429':
          $ref: '#/components/responses/RateLimited'
```

#### 2. Publish Grades

```yaml
paths:
  /api/v1/faculty/assessments/{assessmentId}/grades/publish:
    post:
      summary: Publish grades to students
      operationId: publishGrades
      tags: [Grades]
      security:
        - bearerAuth: []
      parameters:
        - name: assessmentId
          in: path
          required: true
          schema:
            type: string
        - name: X-2FA-Code
          in: header
          required: true
          schema:
            type: string
            pattern: '^\d{6}$'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                notify_students:
                  type: boolean
                  default: true
                message:
                  type: string
                  maxLength: 1000
      responses:
        '200':
          description: Grades published successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  message: { type: string }
                  data:
                    type: object
                    properties:
                      published_count: { type: integer }
                      notification_sent: { type: boolean }
                      published_at:
                        type: string
                        format: date-time
        '403':
          description: 2FA verification failed
          content:
            application/json:
              schema:
                type: object
                properties:
                  error: { type: string, example: "Invalid 2FA code" }
```

#### 3. Get Course Roster

```yaml
paths:
  /api/v1/faculty/courses/{courseId}/roster:
    get:
      summary: Get enrolled students for a course
      operationId: getCourseRoster
      tags: [Courses]
      security:
        - bearerAuth: []
      parameters:
        - name: courseId
          in: path
          required: true
          schema:
            type: string
        - name: include_dropped
          in: query
          schema:
            type: boolean
            default: false
        - name: sort
          in: query
          schema:
            type: string
            enum: [name, roll_no, attendance_pct]
            default: roll_no
      responses:
        '200':
          description: Course roster retrieved
          headers:
            X-Total-Count:
              schema:
                type: integer
            X-Cache-Hit:
              schema:
                type: boolean
          content:
            application/json:
              schema:
                type: object
                properties:
                  success: { type: boolean }
                  data:
                    type: array
                    items:
                      type: object
                      properties:
                        student_id: { type: string }
                        roll_no: { type: string }
                        name: { type: string }
                        email: { type: string }
                        enrollment_date: { type: string, format: date }
                        attendance_percentage: { type: number, format: float }
                        current_grade: { type: string, nullable: true }
```

### Pagination Standard

All list endpoints follow cursor-based pagination:

```typescript
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    next_cursor: string | null;
    prev_cursor: string | null;
    has_more: boolean;
    total?: number; // Optional, expensive to compute
  };
}

// Request
GET /api/v1/faculty/courses?cursor=eyJpZCI6MTAwfQ==&limit=50

// Response
{
  "success": true,
  "data": [...],
  "pagination": {
    "next_cursor": "eyJpZCI6MTUwfQ==",
    "prev_cursor": "eyJpZCI6NTB9",
    "has_more": true
  }
}
```

---

## Event Bus Integration

### Event Schema

All events follow CloudEvents specification:

```typescript
interface FacultyEvent {
  // CloudEvents standard fields
  specversion: "1.0";
  id: string;                    // Unique event ID
  source: "faculty-portal";
  type: string;                  // Event type (see below)
  datacontenttype: "application/json";
  time: string;                  // ISO 8601 timestamp
  
  // Custom fields
  subject: string;               // Entity affected (e.g., "attendance/CS101/2025-10-25")
  actor: string;                 // Faculty ID
  correlationid?: string;        // For tracing related events
  
  // Event payload
  data: Record<string, any>;
}
```

### Event Types

#### 1. Attendance Events

```typescript
// Event: faculty.attendance.marked
{
  "specversion": "1.0",
  "id": "evt_abc123",
  "source": "faculty-portal",
  "type": "faculty.attendance.marked",
  "time": "2025-10-25T10:30:00Z",
  "subject": "attendance/CS101/2025-10-25",
  "actor": "FAC001",
  "data": {
    "course_id": "CS101",
    "course_name": "Data Structures",
    "date": "2025-10-25",
    "session_type": "lecture",
    "marked_by": {
      "faculty_id": "FAC001",
      "name": "Dr. John Smith"
    },
    "summary": {
      "total": 60,
      "present": 58,
      "absent": 2,
      "late": 0,
      "excused": 0
    },
    "students_affected": ["STU001", "STU002", "..."]
  }
}

// Event: faculty.attendance.updated
{
  "type": "faculty.attendance.updated",
  "subject": "attendance/CS101/2025-10-25/STU001",
  "data": {
    "course_id": "CS101",
    "student_id": "STU001",
    "date": "2025-10-25",
    "old_status": "absent",
    "new_status": "present",
    "reason": "Attendance correction approved by HOD",
    "updated_by": "FAC001"
  }
}
```

#### 2. Grade Events

```typescript
// Event: faculty.grade.published
{
  "type": "faculty.grade.published",
  "subject": "grade/CS101/midterm-exam",
  "data": {
    "assessment_id": "ASS_20251025_001",
    "assessment_name": "Midterm Exam",
    "course_id": "CS101",
    "course_name": "Data Structures",
    "published_by": {
      "faculty_id": "FAC001",
      "name": "Dr. John Smith"
    },
    "published_at": "2025-10-25T14:00:00Z",
    "statistics": {
      "total_students": 60,
      "average": 78.5,
      "median": 80,
      "std_dev": 12.3,
      "highest": 98,
      "lowest": 42
    },
    "grades_count": 60
  }
}

// Event: faculty.grade.curved
{
  "type": "faculty.grade.curved",
  "subject": "grade/CS101/final-exam",
  "data": {
    "assessment_id": "ASS_20251120_001",
    "curve_type": "linear",
    "curve_amount": 5,
    "applied_by": "FAC001",
    "students_affected": 60,
    "before_stats": { "average": 73.2 },
    "after_stats": { "average": 78.2 }
  }
}
```

#### 3. Material Events

```typescript
// Event: faculty.material.uploaded
{
  "type": "faculty.material.uploaded",
  "subject": "material/CS101/lecture-notes-05",
  "data": {
    "material_id": "MAT_20251025_001",
    "course_id": "CS101",
    "title": "Trees and Graphs - Lecture Notes",
    "type": "document",
    "file_size": 2457600,  // bytes
    "file_type": "application/pdf",
    "uploaded_by": "FAC001",
    "visibility": "students",
    "tags": ["lecture", "week-5", "graphs"]
  }
}
```

### Event Subscriptions

```yaml
# Student Portal subscribes to:
subscriptions:
  - faculty.attendance.marked
  - faculty.attendance.updated
  - faculty.grade.published
  - faculty.material.uploaded
  
# Principal Portal subscribes to:
subscriptions:
  - faculty.attendance.marked
  - faculty.grade.published
  - faculty.leave.requested
  
# Notification Service subscribes to:
subscriptions:
  - faculty.grade.published   # → Send email to students
  - faculty.attendance.marked # → Send daily summary to parents
  - faculty.exam.incident     # → Alert exam coordinator
```

---

## Webhook Specifications

### Webhook Registration

```typescript
POST /api/v1/webhooks
Content-Type: application/json
Authorization: Bearer {jwt_token}

{
  "url": "https://student-portal.edu/webhooks/faculty-updates",
  "events": ["faculty.grade.published", "faculty.material.uploaded"],
  "secret": "whsec_abc123...",  // For signature verification
  "active": true,
  "metadata": {
    "description": "Student portal grade sync"
  }
}

// Response
{
  "id": "wh_xyz789",
  "url": "https://student-portal.edu/webhooks/faculty-updates",
  "events": ["faculty.grade.published", "faculty.material.uploaded"],
  "created_at": "2025-10-25T10:00:00Z",
  "secret": "whsec_abc123..."
}
```

### Webhook Payload

```http
POST /webhooks/faculty-updates
Host: student-portal.edu
Content-Type: application/json
X-Webhook-ID: wh_xyz789
X-Webhook-Signature: t=1698249600,v1=abc123...
X-Webhook-Timestamp: 1698249600
User-Agent: Faculty-Portal-Webhook/1.0

{
  "webhook_id": "wh_xyz789",
  "event": {
    "id": "evt_abc123",
    "type": "faculty.grade.published",
    "created_at": "2025-10-25T14:00:00Z",
    "data": { ... }
  }
}
```

### Signature Verification

```typescript
// Webhook consumer code
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const [timestamp, signatureHash] = signature.split(',');
  const t = timestamp.split('=')[1];
  const v1 = signatureHash.split('=')[1];
  
  const signedPayload = `${t}.${payload}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(v1),
    Buffer.from(expectedSignature)
  );
}
```

### Webhook Retry Logic

```
Attempt 1: Immediate
Attempt 2: 1 minute later
Attempt 3: 5 minutes later
Attempt 4: 30 minutes later
Attempt 5: 2 hours later
Attempt 6: 6 hours later (final attempt)

After 6 failed attempts:
- Webhook marked as "failing"
- Alert sent to webhook owner
- Webhook auto-disabled after 24 hours of failures
```

---

## Inter-Portal Communication

### 1. Faculty → Student Portal

**Use Case**: Student views their attendance

```sequence
Student Portal          Faculty Portal
      │                       │
      │  GET /attendance/{id} │
      │──────────────────────►│
      │                       │
      │      (Check RLS)      │
      │  ◄───── 200 OK ───────│
      │                       │
```

```typescript
// Request
GET /api/v1/inter-portal/attendance/student/STU001?course=CS101
Authorization: Bearer {student_portal_jwt}

// Response
{
  "success": true,
  "data": {
    "student_id": "STU001",
    "course_id": "CS101",
    "attendance_records": [
      {
        "date": "2025-10-25",
        "status": "present",
        "session_type": "lecture",
        "marked_at": "2025-10-25T10:30:00Z",
        "marked_by": "FAC001"
      },
      // ... more records
    ],
    "summary": {
      "total_classes": 45,
      "present": 42,
      "absent": 2,
      "late": 1,
      "excused": 0,
      "percentage": 93.33
    }
  }
}
```

### 2. Faculty → Principal Portal

**Use Case**: Principal reviews department attendance

```typescript
// Request
GET /api/v1/inter-portal/attendance/report?department=CSE&date_from=2025-10-01&date_to=2025-10-25
Authorization: Bearer {principal_jwt}

// Response
{
  "success": true,
  "data": {
    "department": "CSE",
    "period": {
      "from": "2025-10-01",
      "to": "2025-10-25"
    },
    "courses": [
      {
        "course_id": "CS101",
        "course_name": "Data Structures",
        "faculty": "Dr. John Smith",
        "avg_attendance": 92.5,
        "classes_held": 20,
        "students_enrolled": 60
      },
      // ... more courses
    ],
    "department_average": 89.2
  }
}
```

### 3. Registrar → Faculty Portal

**Use Case**: Sync course enrollment changes

```typescript
// Webhook payload from Registrar
POST /api/v1/webhooks/enrollment-update
X-API-Key: {registrar_api_key}

{
  "event_type": "enrollment.added",
  "course_id": "CS101",
  "student": {
    "student_id": "STU099",
    "name": "Alice Johnson",
    "email": "alice.j@institution.edu",
    "enrolled_at": "2025-10-25T09:00:00Z"
  }
}

// Faculty Portal response
{
  "success": true,
  "message": "Student added to course roster"
}
```

---

## Data Sync Contracts

### Eventual Consistency Model

```
┌──────────────┐        ┌──────────────┐
│   Faculty    │  sync  │   Student    │
│   Portal     │───────►│   Portal     │
│ (Source of   │        │ (Read-only   │
│  Truth)      │        │  replica)    │
└──────────────┘        └──────────────┘
     │
     │ Event: grade.published
     │ Timestamp: T0
     │
     ▼
┌──────────────────────────────────┐
│  Event Bus (RabbitMQ)            │
│  - Guaranteed delivery           │
│  - Order preservation per course │
└──────────────────────────────────┘
     │
     │ Delivery: T0 + ~50ms
     │
     ▼
┌──────────────┐
│   Student    │
│   Consumer   │
│  - Process   │
│  - Update DB │
│  - Invalidate│
│    cache     │
└──────────────┘
```

### Sync Conflict Resolution

```typescript
interface SyncConflict {
  entity_type: "attendance" | "grade";
  entity_id: string;
  
  local_version: {
    data: any;
    updated_at: string;
    updated_by: string;
  };
  
  remote_version: {
    data: any;
    updated_at: string;
    updated_by: string;
  };
  
  resolution_strategy: "last_write_wins" | "manual" | "merge";
}

// Last Write Wins example
function resolveConflict(conflict: SyncConflict): any {
  if (conflict.resolution_strategy === "last_write_wins") {
    return new Date(conflict.local_version.updated_at) > 
           new Date(conflict.remote_version.updated_at)
      ? conflict.local_version.data
      : conflict.remote_version.data;
  }
  
  // Manual resolution required
  throw new ConflictError(conflict);
}
```

---

## Error Handling Standards

### Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;           // Machine-readable error code
    message: string;        // Human-readable message
    details?: any;          // Additional context
    trace_id?: string;      // For debugging
    timestamp: string;      // ISO 8601
  };
}

// Examples

// 400 Bad Request
{
  "success": false,
  "error": {
    "code": "INVALID_DATE_FORMAT",
    "message": "Date must be in YYYY-MM-DD format",
    "details": {
      "field": "date",
      "provided": "25-10-2025",
      "expected": "2025-10-25"
    },
    "trace_id": "req_xyz789",
    "timestamp": "2025-10-25T10:30:00Z"
  }
}

// 422 Validation Error
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Input validation failed",
    "details": {
      "fields": {
        "course_id": ["Course ID is required"],
        "records": ["At least one attendance record is required"],
        "records.0.student_id": ["Invalid student ID format"]
      }
    },
    "trace_id": "req_abc123",
    "timestamp": "2025-10-25T10:30:00Z"
  }
}

// 403 Forbidden
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "You do not have permission to mark attendance for this course",
    "details": {
      "required_permission": "attendance:write:CS101",
      "your_permissions": ["attendance:write:CS102", "attendance:write:CS103"]
    },
    "trace_id": "req_def456",
    "timestamp": "2025-10-25T10:30:00Z"
  }
}

// 409 Conflict
{
  "success": false,
  "error": {
    "code": "ATTENDANCE_ALREADY_MARKED",
    "message": "Attendance has already been marked for this date",
    "details": {
      "course_id": "CS101",
      "date": "2025-10-25",
      "existing_record_id": "ATT_20251025_CS101_001",
      "marked_by": "FAC001",
      "marked_at": "2025-10-25T10:00:00Z"
    },
    "trace_id": "req_ghi789",
    "timestamp": "2025-10-25T10:30:00Z"
  }
}
```

### Error Codes Catalog

```typescript
enum ErrorCode {
  // Authentication (401)
  INVALID_TOKEN = "INVALID_TOKEN",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  MISSING_AUTH = "MISSING_AUTH",
  
  // Authorization (403)
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
  2FA_REQUIRED = "2FA_REQUIRED",
  OUTSIDE_EDIT_WINDOW = "OUTSIDE_EDIT_WINDOW",
  
  // Validation (422)
  VALIDATION_FAILED = "VALIDATION_FAILED",
  INVALID_DATE_FORMAT = "INVALID_DATE_FORMAT",
  INVALID_STUDENT_ID = "INVALID_STUDENT_ID",
  
  // Business Logic (409, 422)
  ATTENDANCE_ALREADY_MARKED = "ATTENDANCE_ALREADY_MARKED",
  GRADE_ALREADY_PUBLISHED = "GRADE_ALREADY_PUBLISHED",
  ENROLLMENT_NOT_FOUND = "ENROLLMENT_NOT_FOUND",
  
  // Server Errors (500)
  INTERNAL_ERROR = "INTERNAL_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR"
}
```

---

## Rate Limiting

### Rate Limit Policies

```yaml
# Per endpoint rate limits
rate_limits:
  # Authentication
  /api/auth/login:
    limit: 5 requests
    window: 15 minutes
    scope: ip_address
  
  # Read operations
  /api/v1/faculty/courses/*:
    limit: 100 requests
    window: 1 minute
    scope: user
  
  # Write operations
  /api/v1/faculty/attendance:
    limit: 10 requests
    window: 1 minute
    scope: user
  
  # Bulk operations
  /api/v1/faculty/grades/bulk:
    limit: 5 requests
    window: 5 minutes
    scope: user
  
  # Webhooks
  /api/v1/webhooks/*:
    limit: 1000 requests
    window: 1 hour
    scope: api_key
```

### Rate Limit Headers

```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1698249660
X-RateLimit-Policy: 100-req-per-min
Retry-After: 45

# When rate limited (429)
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1698249660
Retry-After: 45

{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You have exceeded the rate limit for this endpoint",
    "details": {
      "limit": 100,
      "window": "1 minute",
      "retry_after_seconds": 45
    }
  }
}
```

---

## Versioning Strategy

### API Versioning

```
# URL versioning (preferred)
https://faculty.institution.edu/api/v1/attendance
https://faculty.institution.edu/api/v2/attendance  # Breaking changes

# Header versioning (alternative)
GET /api/attendance
Accept: application/vnd.faculty-portal.v1+json
```

### Breaking vs Non-Breaking Changes

**Non-Breaking** (patch/minor version):
- Adding new optional fields
- Adding new endpoints
- Adding new event types
- Relaxing validation rules

**Breaking** (major version):
- Removing fields
- Changing field types
- Renaming fields
- Changing authentication requirements
- Removing endpoints

### Deprecation Policy

```yaml
# Deprecation timeline
announce_deprecation: 6 months before removal
sunset_header: 3 months before removal
remove_version: After 6 months

# Sunset header example
Sunset: Sat, 31 Dec 2025 23:59:59 GMT
Link: <https://docs.faculty-portal.edu/migration/v1-to-v2>; rel="deprecation"
```

---

**Last Updated**: October 25, 2025  
**Maintained By**: API Team + Integration Team  
**Support**: api-support@institution.edu
