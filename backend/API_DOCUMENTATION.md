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

**Current:** No rate limiting (to be implemented in production)

**Recommended Production Limits:**
- Authentication endpoints: 5 requests/minute per IP
- API endpoints: 60 requests/minute per user
- Public endpoints: 30 requests/minute per IP

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

**Last Updated:** January 15, 2025  
**API Version:** 1.0.0
