# Bitflow LMS API Documentation

**Version:** 1.0.0  
**Base URL:** `http://localhost:8000/api/v1`  
**Authentication:** Bearer Token (JWT)

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Request/Response Format](#requestresponse-format)
4. [Error Handling](#error-handling)
5. [Endpoints](#endpoints)
   - [Health Check](#health-check)
   - [Authentication](#authentication-endpoints)
6. [Testing](#testing)
7. [Rate Limiting](#rate-limiting)

---

## Overview

Bitflow LMS is a multi-tenant campus management system with 14 distinct user portals. This API follows REST principles with JSON request/response format.

**Key Features:**
- JWT authentication with RS256 asymmetric encryption
- Multi-tenant row-level data isolation
- Role-based access control (14 roles, 80+ permissions)
- Automatic token refresh mechanism
- Comprehensive error handling

---

## Authentication

### Authentication Flow

1. **Login** → Receive `access_token` (15 min) + `refresh_token` (7 days)
2. **API Requests** → Include `Authorization: Bearer {access_token}` header
3. **Token Expiry** → Use refresh token to get new access token
4. **Logout** → Invalidate session and refresh token

### Token Details

| Token Type | Expiry | Algorithm | Purpose |
|------------|--------|-----------|---------|
| Access Token | 15 minutes | RS256 (4096-bit RSA) | API authentication |
| Refresh Token | 7 days | RS256 (4096-bit RSA) | Token renewal |

### JWT Payload Structure

```json
{
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "email": "admin@bitflow.app",
  "university_id": "660e8400-e29b-41d4-a716-446655440000",
  "roles": ["bitflow_owner"],
  "permissions": ["users.view", "users.create"],
  "iat": 1705320000,
  "exp": 1705320900,
  "jti": "unique-token-id",
  "type": "access"
}
```

---

## Request/Response Format

### Standard Response Structure

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

### HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable Entity | Validation errors |
| 500 | Internal Server Error | Server-side error |

---

## Error Handling

### Validation Errors (422)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": [
      "The email field is required.",
      "The email must be a valid email address."
    ],
    "password": [
      "The password must be at least 8 characters."
    ]
  }
}
```

### Authentication Errors (401)

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Permission Errors (403)

```json
{
  "success": false,
  "message": "Insufficient permissions to perform this action"
}
```

---

## Endpoints

### Health Check

#### Check API Status
**GET** `/api/v1/health`

**Authentication:** None required

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T12:00:00Z",
  "version": "1.0.0"
}
```

---

### Authentication Endpoints

#### 1. Login
**POST** `/api/v1/auth/login`

**Description:** Authenticate user and receive JWT tokens.

**Request Body:**
```json
{
  "email": "admin@bitflow.app",
  "password": "Bitflow@2025"
}
```

**Validation Rules:**
- `email`: required, valid email format
- `password`: required, string

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
    "refresh_token": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "token_type": "Bearer",
    "expires_in": 900,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "admin@bitflow.app",
      "username": "bitflow_admin",
      "full_name": "Bitflow Administrator",
      "university_id": "660e8400-e29b-41d4-a716-446655440000",
      "status": "active",
      "roles": [
        {
          "id": "770e8400-e29b-41d4-a716-446655440000",
          "name": "Bitflow Owner",
          "slug": "bitflow_owner",
          "level": 1
        }
      ],
      "permissions": ["users.view", "users.create"],
      "university": {
        "id": "660e8400-e29b-41d4-a716-446655440000",
        "name": "Demo University",
        "domain": "demo.bitflow.edu"
      }
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Test Accounts:**
| Email | Password | Role |
|-------|----------|------|
| admin@bitflow.app | Bitflow@2025 | Bitflow Owner |
| owner@demo.bitflow.edu | University@2025 | University Owner |
| superadmin@demo.bitflow.edu | SuperAdmin@2025 | Super Admin |
| faculty@demo.bitflow.edu | Faculty@2025 | Faculty |
| student@demo.bitflow.edu | Student@2025 | Student |

---

#### 2. Get Current User
**GET** `/api/v1/auth/me`

**Description:** Get authenticated user's profile with roles and permissions.

**Authentication:** Required (Bearer token)

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@bitflow.app",
    "username": "bitflow_admin",
    "first_name": "Bitflow",
    "last_name": "Administrator",
    "full_name": "Bitflow Administrator",
    "phone": "+1-555-0001",
    "university_id": "660e8400-e29b-41d4-a716-446655440000",
    "status": "active",
    "email_verified_at": "2025-01-15T10:00:00Z",
    "created_at": "2025-01-01T00:00:00Z",
    "roles": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440000",
        "name": "Bitflow Owner",
        "slug": "bitflow_owner",
        "level": 1,
        "scope": "platform"
      }
    ],
    "permissions": ["users.view", "users.create"],
    "university": {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "name": "Demo University",
      "slug": "demo-university",
      "domain": "demo.bitflow.edu",
      "status": "active"
    }
  }
}
```

---

#### 3. Refresh Token
**POST** `/api/v1/auth/refresh`

**Description:** Get new access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "f47ac10b-58cc-4372-a567-0e02b2c3d479"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
    "token_type": "Bearer",
    "expires_in": 900
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid or expired refresh token"
}
```

---

#### 4. Update Profile
**PUT** `/api/v1/auth/profile`

**Description:** Update authenticated user's profile information.

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "first_name": "Updated",
  "last_name": "Name",
  "phone": "+1-555-9999",
  "profile_picture": "https://example.com/avatar.jpg"
}
```

**Validation Rules:**
- All fields are optional
- `phone`: valid phone format
- `profile_picture`: valid URL

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "admin@bitflow.app",
    "full_name": "Updated Name",
    "phone": "+1-555-9999"
  }
}
```

---

#### 5. Change Password
**PUT** `/api/v1/auth/password`

**Description:** Change authenticated user's password. All sessions will be invalidated.

**Authentication:** Required (Bearer token)

**Request Body:**
```json
{
  "current_password": "Bitflow@2025",
  "new_password": "NewSecure@2025",
  "new_password_confirmation": "NewSecure@2025"
}
```

**Validation Rules:**
- `current_password`: required, string
- `new_password`: required, min:8, must include:
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character
- `new_password_confirmation`: required, must match `new_password`

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully. All sessions have been terminated."
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

**Note:** All active sessions (including the current one) will be terminated for security.

---

#### 6. Logout
**POST** `/api/v1/auth/logout`

**Description:** Logout user and invalidate current session.

**Authentication:** Required (Bearer token)

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Note:** This invalidates the refresh token. Access token remains valid until expiry but cannot be refreshed.

---

## Notifications API

### Overview
Real-time notification system for users. Supports multiple notification types and delivery channels.

#### 1. Get User Notifications
**GET** `/api/v1/notifications`

**Description:** Get paginated list of user's notifications.

**Authentication:** Required

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | integer | No | Page number (default: 1) |
| `per_page` | integer | No | Items per page (default: 15, max: 100) |
| `type` | string | No | Filter by type: `system`, `activity`, `report`, `alert` |
| `read` | boolean | No | Filter by read status |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "system",
        "title": "System Maintenance Scheduled",
        "message": "System will be down for maintenance on Jan 20, 2025 from 2-4 AM.",
        "data": {
          "maintenance_start": "2025-01-20T02:00:00Z",
          "maintenance_end": "2025-01-20T04:00:00Z"
        },
        "read_at": null,
        "created_at": "2025-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "per_page": 15,
      "total": 45,
      "last_page": 3,
      "from": 1,
      "to": 15
    },
    "unread_count": 12
  }
}
```

---

#### 2. Get Unread Count
**GET** `/api/v1/notifications/unread-count`

**Description:** Get count of unread notifications for badge display.

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "unread_count": 12
  }
}
```

---

#### 3. Mark as Read
**PUT** `/api/v1/notifications/{id}/read`

**Description:** Mark a specific notification as read.

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "id": "uuid",
    "read_at": "2025-01-15T14:30:00Z"
  }
}
```

---

#### 4. Mark All as Read
**PUT** `/api/v1/notifications/mark-all-read`

**Description:** Mark all user's notifications as read.

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": {
    "marked_count": 12
  }
}
```

---

#### 5. Delete Notification
**DELETE** `/api/v1/notifications/{id}`

**Description:** Delete a specific notification.

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "message": "Notification deleted"
}
```

---

#### 6. Broadcast Notification (Admin Only)
**POST** `/api/v1/notifications/broadcast`

**Description:** Send notification to multiple users or all users in organization.

**Authentication:** Required (Admin role)

**Permissions:** `notifications.broadcast`

**Request Body:**
```json
{
  "type": "system",
  "title": "Important Announcement",
  "message": "Classes will resume on Monday.",
  "recipients": "all",
  "data": {
    "link": "/announcements/123",
    "priority": "high"
  }
}
```

**Recipients Options:**
- `all` - All users in organization
- `role:student` - All students
- `role:faculty` - All faculty
- Array of user IDs: `["uuid1", "uuid2"]`

**Response (201):**
```json
{
  "success": true,
  "message": "Notification broadcasted successfully",
  "data": {
    "sent_count": 1250,
    "notification_id": "uuid"
  }
}
```

---

## Advanced Search API

### Overview
Global search across all entities with filters and faceted results.

#### 1. Global Search
**GET** `/api/v1/search`

**Description:** Search across multiple entity types.

**Authentication:** Required

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | Yes | Search query (min 3 characters) |
| `entity` | string | No | Filter by entity type |
| `page` | integer | No | Page number |
| `per_page` | integer | No | Results per page (max: 50) |

**Entity Types:**
- `universities`
- `colleges`
- `departments`
- `students`
- `faculty`
- `courses`
- `users`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "query": "computer science",
    "results": [
      {
        "entity": "departments",
        "id": "uuid",
        "name": "Computer Science",
        "college": "College of Engineering",
        "match_score": 0.95,
        "highlights": {
          "name": "<mark>Computer Science</mark>"
        }
      },
      {
        "entity": "students",
        "id": "uuid",
        "name": "John Doe",
        "admission_number": "2024CS001",
        "course": "B.Tech Computer Science",
        "match_score": 0.87,
        "highlights": {
          "course": "B.Tech <mark>Computer Science</mark>"
        }
      }
    ],
    "facets": {
      "departments": 5,
      "students": 234,
      "courses": 12,
      "faculty": 18
    },
    "pagination": {
      "current_page": 1,
      "per_page": 20,
      "total": 269,
      "last_page": 14
    }
  }
}
```

---

#### 2. Advanced Search with Filters
**POST** `/api/v1/search/advanced`

**Description:** Search with complex filters and date ranges.

**Authentication:** Required

**Request Body:**
```json
{
  "query": "engineering",
  "entity": "students",
  "filters": {
    "department_id": "uuid",
    "year": 2,
    "status": "active",
    "admission_date": {
      "from": "2024-01-01",
      "to": "2024-12-31"
    }
  },
  "sort": {
    "field": "name",
    "order": "asc"
  },
  "page": 1,
  "per_page": 20
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "results": [...],
    "filters_applied": {
      "department": "Computer Science",
      "year": 2,
      "status": "active"
    },
    "pagination": {...}
  }
}
```

---

## Bulk Operations API

### Overview
Import and export data in bulk using CSV/Excel files.

#### 1. Bulk Import Students
**POST** `/api/v1/students/bulk-import`

**Description:** Import multiple students from CSV file.

**Authentication:** Required

**Permissions:** `students.create`

**Content-Type:** `multipart/form-data`

**Request:**
```
POST /api/v1/students/bulk-import
Content-Type: multipart/form-data

file: students.csv (binary)
validate_only: false (optional - set true to preview without importing)
```

**CSV Format:**
```csv
name,email,admission_number,department_code,course,year,status
John Doe,john@example.com,2024CS001,CS,B.Tech CS,1,active
Jane Smith,jane@example.com,2024CS002,CS,B.Tech CS,1,active
```

**Response (200):**
```json
{
  "success": true,
  "message": "Bulk import completed",
  "data": {
    "total_rows": 150,
    "successful": 147,
    "failed": 3,
    "errors": [
      {
        "row": 45,
        "email": "duplicate@example.com",
        "errors": ["Email already exists"]
      }
    ],
    "preview": [
      {
        "name": "John Doe",
        "email": "john@example.com",
        "admission_number": "2024CS001"
      }
    ]
  }
}
```

**Rate Limit:** 20 imports per hour (max 1000 rows per import)

---

#### 2. Bulk Export Students
**GET** `/api/v1/students/bulk-export`

**Description:** Export students to CSV or Excel.

**Authentication:** Required

**Permissions:** `students.view`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `format` | string | No | `csv` or `excel` (default: csv) |
| `filters` | object | No | JSON filters (department, year, status) |

**Response (200):**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="students_export_2025-01-15.csv"

[CSV data]
```

**Rate Limit:** 20 exports per hour (max 10,000 rows per export)

---

#### 3. Download Import Template
**GET** `/api/v1/students/import-template`

**Description:** Download CSV template for bulk import.

**Authentication:** Required

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `entity` | string | Yes | `students`, `faculty`, `departments` |

**Response (200):**
```
Content-Type: text/csv
Content-Disposition: attachment; filename="students_import_template.csv"

name,email,admission_number,department_code,course,year,status
# Required fields: name, email, admission_number, department_code, course, year
# Optional fields: status (default: active)
# Example row:
John Doe,john@example.com,2024CS001,CS,B.Tech CS,1,active
```

---

#### 4. Bulk Update Status
**PUT** `/api/v1/students/bulk-update-status`

**Description:** Update status for multiple students at once.

**Authentication:** Required

**Permissions:** `students.update`

**Request Body:**
```json
{
  "student_ids": ["uuid1", "uuid2", "uuid3"],
  "status": "graduated"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Status updated for 3 students",
  "data": {
    "updated_count": 3,
    "new_status": "graduated"
  }
}
```

---

#### 5. Bulk Delete
**DELETE** `/api/v1/students/bulk-delete`

**Description:** Delete multiple students (soft delete).

**Authentication:** Required

**Permissions:** `students.delete`

**Request Body:**
```json
{
  "student_ids": ["uuid1", "uuid2"]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "2 students deleted",
  "data": {
    "deleted_count": 2
  }
}
```

**Note:** This is a soft delete. Records can be restored by admins.

---

## Reports API

### Overview
Generate PDF reports with custom templates and scheduling.

#### 1. Generate Report
**POST** `/api/v1/reports/generate`

**Description:** Generate a one-time report.

**Authentication:** Required

**Permissions:** `reports.generate`

**Request Body:**
```json
{
  "report_type": "student_enrollment",
  "date_range": {
    "start": "2024-01-01",
    "end": "2024-12-31"
  },
  "filters": {
    "college_id": "uuid",
    "department_id": "uuid"
  },
  "template_id": "uuid",
  "format": "pdf"
}
```

**Report Types:**
- `student_enrollment`
- `faculty_distribution`
- `department_summary`
- `financial_summary`
- `attendance_report`

**Response (201):**
```json
{
  "success": true,
  "message": "Report generation started",
  "data": {
    "report_id": "uuid",
    "status": "generating",
    "estimated_time": "30 seconds"
  }
}
```

**Rate Limit:** 10 reports per hour

---

#### 2. Download Report
**GET** `/api/v1/reports/{id}/download`

**Description:** Download generated report.

**Authentication:** Required

**Response (200):**
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="student_enrollment_2024.pdf"

[PDF binary data]
```

---

#### 3. Schedule Recurring Report
**POST** `/api/v1/reports/scheduled`

**Description:** Create a scheduled report that generates automatically.

**Authentication:** Required

**Permissions:** `reports.schedule`

**Request Body:**
```json
{
  "name": "Monthly Enrollment Report",
  "report_type": "student_enrollment",
  "frequency": "monthly",
  "day_of_month": 1,
  "time": "09:00",
  "recipients": ["admin@university.edu", "dean@university.edu"],
  "format": "pdf",
  "template_id": "uuid"
}
```

**Frequency Options:**
- `daily` (time required)
- `weekly` (day_of_week + time required)
- `monthly` (day_of_month + time required)

**Response (201):**
```json
{
  "success": true,
  "message": "Scheduled report created",
  "data": {
    "scheduled_report_id": "uuid",
    "next_run": "2025-02-01T09:00:00Z"
  }
}
```

---

#### 4. List Report Templates
**GET** `/api/v1/reports/templates`

**Description:** Get available report templates.

**Authentication:** Required

**Response (200):**
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "uuid",
        "name": "Standard Enrollment Report",
        "description": "Default template for student enrollment",
        "report_type": "student_enrollment",
        "is_default": true,
        "created_by": "system"
      }
    ]
  }
}
```

---

## God Mode API (Bitflow Owners Only)

### Overview
System-wide administrative endpoints for Bitflow Owners with God Mode access.

#### 1. Get All Organizations
**GET** `/api/v1/god-mode/organizations`

**Description:** Get all universities with statistics.

**Authentication:** Required (Bitflow Owner role)

**Permissions:** `god_mode.view`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "organizations": [
      {
        "id": "uuid",
        "name": "Harvard University",
        "domain": "harvard.edu",
        "status": "active",
        "stats": {
          "total_students": 15000,
          "total_faculty": 1200,
          "total_colleges": 12,
          "active_users": 16500
        },
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "system_totals": {
      "total_organizations": 25,
      "total_users": 500000,
      "total_students": 425000,
      "total_faculty": 35000
    }
  }
}
```

---

#### 2. Switch Organization Context
**POST** `/api/v1/god-mode/switch-organization`

**Description:** Switch to view data from a specific organization.

**Authentication:** Required (Bitflow Owner)

**Request Body:**
```json
{
  "organization_id": "uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Organization context switched",
  "data": {
    "current_organization": {
      "id": "uuid",
      "name": "Harvard University"
    }
  }
}
```

**Note:** All subsequent API calls will return data scoped to this organization until switched again or logged out.

---

#### 3. Compare Organizations
**POST** `/api/v1/god-mode/compare`

**Description:** Compare metrics between two organizations.

**Authentication:** Required (Bitflow Owner)

**Request Body:**
```json
{
  "organization1_id": "uuid1",
  "organization2_id": "uuid2",
  "metrics": ["students", "faculty", "revenue", "growth"]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "comparison": {
      "organization1": {
        "name": "Harvard University",
        "students": 15000,
        "faculty": 1200,
        "growth_rate": "5.2%"
      },
      "organization2": {
        "name": "MIT",
        "students": 11000,
        "faculty": 1050,
        "growth_rate": "6.8%"
      }
    }
  }
}
```

---

#### 4. Get Audit Logs
**GET** `/api/v1/god-mode/audit-logs`

**Description:** Get system-wide audit logs.

**Authentication:** Required (Bitflow Owner)

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `organization_id` | uuid | No | Filter by organization |
| `user_id` | uuid | No | Filter by user |
| `action` | string | No | Filter by action type |
| `date_from` | date | No | Start date |
| `date_to` | date | No | End date |
| `page` | integer | No | Page number |

**Response (200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "uuid",
        "user": {
          "id": "uuid",
          "name": "John Admin",
          "email": "john@university.edu"
        },
        "action": "students.create",
        "entity": "Student",
        "entity_id": "uuid",
        "organization": "Harvard University",
        "ip_address": "192.168.1.100",
        "user_agent": "Mozilla/5.0...",
        "changes": {
          "before": null,
          "after": {"name": "Jane Doe"}
        },
        "created_at": "2025-01-15T14:30:00Z"
      }
    ],
    "pagination": {...}
  }
}
```

---

## Testing

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bitflow.app","password":"Bitflow@2025"}'
```

**Get Profile:**
```bash
curl -X GET http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using Postman

1. Import `postman_collection.json` file
2. Set environment variable `base_url` to `http://localhost:8000/api/v1`
3. Login endpoint automatically saves tokens to environment variables
4. Subsequent requests use `{{access_token}}` automatically

### Using HTTPie

**Login:**
```bash
http POST http://localhost:8000/api/v1/auth/login \
  email=admin@bitflow.app \
  password=Bitflow@2025
```

---

## Rate Limiting

**Status:** ✅ Implemented with tiered limits based on user roles and endpoints

### Rate Limit Configuration

All endpoints have rate limiting enabled to prevent abuse and ensure fair resource usage.

#### Authentication Endpoints
| Endpoint | Limit | Window | Purpose |
|----------|-------|--------|---------|
| POST `/auth/login` | 5 requests | per minute | Prevent brute force attacks |
| POST `/auth/login` | 20 requests | per hour | Additional hourly limit |
| POST `/auth/register` | 10 requests | per hour | Prevent spam registrations |
| POST `/auth/password-reset` | 5 requests | per hour | Prevent password reset abuse |

#### API Endpoints (Role-Based)
| User Role | Requests/Minute | Requests/Hour |
|-----------|-----------------|---------------|
| Guest (unauthenticated) | 10 | 600 |
| Student | 60 | 3,600 |
| Faculty | 60 | 3,600 |
| Admin | 300 | 18,000 |
| University Owner | 300 | 18,000 |
| **Bitflow Owner** | **500** | **30,000** |

#### Resource-Specific Limits
| Operation | Limit | Window | Notes |
|-----------|-------|--------|-------|
| Report Generation | 10 requests | per hour | CPU-intensive operation |
| File Uploads | 20 requests | per hour | Bandwidth protection |
| Bulk Import | 20 requests | per hour | Max 1,000 rows per import |
| Bulk Export | 20 requests | per hour | Max 10,000 rows per export |
| Advanced Search | 30 requests | per minute | Database protection |
| Notification Broadcast | 100 requests | per hour | Prevent spam |

### Rate Limit Headers

All responses include rate limit information in headers:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1705334400
```

### Rate Limit Exceeded Response

**Status Code:** 429 Too Many Requests

```json
{
  "success": false,
  "message": "Rate limit exceeded. Please try again later.",
  "data": {
    "retry_after": 45,
    "limit": 60,
    "window": "1 minute"
  }
}
```

### Bypass Configuration

System administrators can whitelist trusted IPs or users in `config/rate-limiting.php`:

```php
'bypass' => [
    'ips' => ['192.168.1.100'],
    'users' => ['admin@bitflow.app']
]
```

---

## Multi-Tenant Isolation

All API requests automatically filter data by `university_id` extracted from JWT token. Users can only access data belonging to their university.

**How it works:**
1. JWT contains `university_id` claim
2. Middleware extracts and injects into request context
3. Global scope (`UniversityScope`) filters all database queries
4. No manual filtering required in controllers

**Example:**
- User from University A cannot see colleges/students from University B
- All relationships respect tenant boundaries
- Cross-tenant access requires Bitflow Owner role

---

## Permissions System

### Permission Categories (15 categories, 80+ permissions)

1. **Users** - `users.view`, `users.create`, `users.update`, `users.delete`
2. **Colleges** - `colleges.*`
3. **Departments** - `departments.*`
4. **Courses** - `courses.*`
5. **Students** - `students.*`
6. **Faculty** - `faculty.*`
7. **Attendance** - `attendance.*`
8. **Grades** - `grades.*`
9. **Assignments** - `assignments.*`
10. **Fees** - `fees.*`
11. **Accounting** - `accounting.*`
12. **Admissions** - `admissions.*`
13. **Timetable** - `timetable.*`
14. **Library** - `library.*`
15. **Reports** - `reports.*`
16. **Settings** - `settings.*`

### Role Hierarchy (14 roles)

| Level | Role | Scope | Permissions |
|-------|------|-------|-------------|
| 1 | Bitflow Owner | Platform | ALL permissions |
| 2 | University Owner | University | University-level permissions |
| 3 | Super Admin | College | College-level permissions |
| 4 | Principal | College | College management |
| 5 | College Admin | College | Administrative tasks |
| 6 | Super Academics | University | Academic oversight |
| 7 | Faculty | Individual | Teaching permissions |
| 8 | Student | Individual | View-only permissions |
| 9 | Parent | Individual | Student data view |
| 10 | Admission Admin | College | Admissions management |
| 11 | Super Accountant | University | Financial oversight |
| 12 | College Accounts Admin | College | College finances |
| 13 | College Fee Admin | College | Fee management |
| 14 | Super NT Manager | University | Non-teaching staff management |

---

## Support

**Documentation:** https://docs.bitflow.edu  
**Email:** support@bitflow.app  
**GitHub:** https://github.com/bitflow-edu/lms

---

**Last Updated:** October 31, 2025  
**API Version:** 1.0.0
