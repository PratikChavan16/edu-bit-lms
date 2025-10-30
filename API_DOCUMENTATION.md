# 🚀 Bitflow LMS API - Complete Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [WebSocket Events](#websocket-events)
- [Error Handling](#error-handling)
- [Testing](#testing)

## 🎯 Overview

**Base URL:** `http://localhost:3000/api/v1`
**WebSocket URL:** `ws://localhost:3000`

### Tech Stack
- **Runtime:** Node.js 20+
- **Framework:** Express 4.18
- **Database:** PostgreSQL 16 + Prisma ORM
- **Authentication:** JWT (15min access, 7d refresh tokens)
- **Real-time:** Socket.io 4.8
- **File Upload:** Multer
- **Validation:** Zod schemas

### Key Features
- ✅ Multi-tenant architecture with schema-per-tenant isolation
- ✅ God Mode access for Bitflow administrators
- ✅ Comprehensive audit logging
- ✅ Role-based access control (RBAC)
- ✅ Real-time chat with WebSocket
- ✅ File upload/download with access control
- ✅ Billing and subscription management

---

## 🔐 Authentication

### Register New User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "universityId": "uuid",
  "roleId": "uuid"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "god@bitflow.com",
  "password": "Bitflow@2025"
}

Response:
{
  "user": { ... },
  "accessToken": "eyJhbG...",
  "refreshToken": "eyJhbG..."
}
```

### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbG..."
}
```

### Get Profile
```http
GET /auth/profile
Authorization: Bearer {accessToken}
```

### Logout
```http
POST /auth/logout
Authorization: Bearer {accessToken}
```

---

## 📡 API Endpoints

### 🏛️ Universities Management

#### List Universities
```http
GET /universities?page=1&limit=20&search=alpha&status=active
Authorization: Bearer {token}
```

#### Get University Details
```http
GET /universities/{id}
Authorization: Bearer {token}
```

#### Create University (God Mode Only)
```http
POST /universities
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Alpha University",
  "code": "ALPHA",
  "domain": "alpha.edu",
  "contactEmail": "contact@alpha.edu",
  "phone": "+1234567890",
  "address": "123 Campus Drive",
  "city": "Boston",
  "state": "MA",
  "country": "USA",
  "zipCode": "02115"
}
```

#### Update University (God Mode Only)
```http
PATCH /universities/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Alpha University Updated"
}
```

#### Delete University (God Mode Only)
```http
DELETE /universities/{id}
Authorization: Bearer {token}
```

---

### 🏫 Colleges Management

#### List Colleges
```http
GET /colleges?universityId={id}&search=engineering&status=active
Authorization: Bearer {token}
```

#### Get College Details
```http
GET /colleges/{id}
Authorization: Bearer {token}
```

#### Create College
```http
POST /colleges
Authorization: Bearer {token}
Content-Type: application/json

{
  "universityId": "uuid",
  "name": "College of Engineering",
  "code": "ENG",
  "description": "Engineering programs",
  "dean": "Dr. Jane Smith",
  "email": "engineering@alpha.edu"
}
```

#### Update College
```http
PATCH /colleges/{id}
Authorization: Bearer {token}
```

#### Delete College (Owner Only)
```http
DELETE /colleges/{id}
Authorization: Bearer {token}
```

---

### 👥 Users Management

#### List Users
```http
GET /users?page=1&limit=20&search=john&status=active&role=student
Authorization: Bearer {token}
```

#### Get User Details
```http
GET /users/{id}
Authorization: Bearer {token}
```

#### Create User
```http
POST /users
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": "student@alpha.edu",
  "username": "student123",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "2000-01-15",
  "gender": "male",
  "phone": "+1234567890",
  "roleId": "uuid"
}
```

#### Update User
```http
PATCH /users/{id}
Authorization: Bearer {token}
```

#### Assign Role to User
```http
POST /users/{id}/roles
Authorization: Bearer {token}
Content-Type: application/json

{
  "roleId": "uuid",
  "expiresAt": "2025-12-31T23:59:59Z" // optional
}
```

#### Delete User
```http
DELETE /users/{id}
Authorization: Bearer {token}
```

---

### 💰 Billing & Subscriptions

#### List Fee Structures
```http
GET /billing/fee-structures?universityId={id}&applicableTo=undergraduate
Authorization: Bearer {token}
```

#### Create Fee Structure
```http
POST /billing/fee-structures
Authorization: Bearer {token}
Content-Type: application/json

{
  "universityId": "uuid",
  "name": "Tuition Fee - Undergraduate",
  "amount": 5000.00,
  "currency": "USD",
  "frequency": "semester",
  "applicableTo": "undergraduate"
}
```

#### List Fee Payments
```http
GET /billing/payments?studentId={id}&status=completed
Authorization: Bearer {token}
```

#### Create Fee Payment
```http
POST /billing/payments
Authorization: Bearer {token}
Content-Type: application/json

{
  "studentId": "uuid",
  "feeStructureId": "uuid",
  "amount": 5000.00,
  "paymentMethod": "credit_card",
  "transactionId": "TXN123456"
}
```

#### Get Billing Analytics
```http
GET /billing/analytics?universityId={id}&startDate=2025-01-01&endDate=2025-12-31
Authorization: Bearer {token}

Response:
{
  "totalRevenue": 150000,
  "totalTransactions": 30,
  "mrr": 12000,
  "pendingPayments": 5,
  "byPaymentMethod": [...]
}
```

---

### 🎫 Support Tickets

#### List Tickets
```http
GET /tickets?status=open&priority=high&search=login
Authorization: Bearer {token}
```

#### Get Ticket Details
```http
GET /tickets/{id}
Authorization: Bearer {token}
```

#### Create Ticket
```http
POST /tickets
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Unable to login",
  "description": "Getting error when trying to login",
  "priority": "high",
  "category": "technical"
}
```

#### Assign Ticket
```http
POST /tickets/{id}/assign
Authorization: Bearer {token}
Content-Type: application/json

{
  "assignedToId": "uuid"
}
```

#### Resolve Ticket
```http
POST /tickets/{id}/resolve
Authorization: Bearer {token}
Content-Type: application/json

{
  "resolution": "Password reset link sent to user's email"
}
```

#### Get Ticket Statistics
```http
GET /tickets/stats?universityId={id}
Authorization: Bearer {token}
```

---

### 📊 Audit Logs

#### List Audit Logs
```http
GET /audit?action=CREATE&entityType=User&userId={id}&startDate=2025-10-01&endDate=2025-10-31
Authorization: Bearer {token}
```

#### Get Audit Log Details
```http
GET /audit/{id}
Authorization: Bearer {token}
```

#### Get Audit Log Statistics
```http
GET /audit/stats?universityId={id}
Authorization: Bearer {token}
```

#### Export Audit Logs
```http
GET /audit/export?startDate=2025-10-01&endDate=2025-10-31&format=csv
Authorization: Bearer {token}
```

---

### 💬 Chat & Messaging

#### List Conversations
```http
GET /chat/conversations?type=direct&page=1&limit=20
Authorization: Bearer {token}
```

#### Get Conversation Details
```http
GET /chat/conversations/{id}
Authorization: Bearer {token}
```

#### Create Conversation
```http
POST /chat/conversations
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "direct",
  "participantIds": ["uuid1", "uuid2"],
  "title": "Project Discussion" // optional
}
```

#### List Messages in Conversation
```http
GET /chat/conversations/{conversationId}/messages?page=1&limit=50
Authorization: Bearer {token}
```

#### Send Message
```http
POST /chat/messages
Authorization: Bearer {token}
Content-Type: application/json

{
  "conversationId": "uuid",
  "content": "Hello, how are you?",
  "attachments": ["file-id-1"] // optional
}
```

#### Mark Conversation as Read
```http
POST /chat/conversations/{conversationId}/mark-read
Authorization: Bearer {token}
```

#### Add Participant to Conversation
```http
POST /chat/conversations/{conversationId}/participants
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": "uuid"
}
```

---

### ⚙️ Settings Management

#### List Settings
```http
GET /settings?category=general&universityId={id}
Authorization: Bearer {token}
```

#### Get Setting by Key
```http
GET /settings/{key}?universityId={id}
Authorization: Bearer {token}
```

#### Create Setting
```http
POST /settings
Authorization: Bearer {token}
Content-Type: application/json

{
  "key": "max_upload_size",
  "value": "52428800",
  "category": "system",
  "isPublic": false,
  "universityId": "uuid" // optional, null for platform-level
}
```

#### Update Setting
```http
PATCH /settings/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "value": "104857600"
}
```

#### Delete Setting (God Mode Only)
```http
DELETE /settings/{id}
Authorization: Bearer {token}
```

---

### 📁 File Management

#### Upload File
```http
POST /files/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  file: <binary>,
  category: "documents",
  relatedEntityType: "Student", // optional
  relatedEntityId: "uuid" // optional
}

Response:
{
  "id": "uuid",
  "filename": "document-123456789.pdf",
  "originalName": "document.pdf",
  "mimeType": "application/pdf",
  "size": 1048576,
  "category": "documents"
}
```

#### List Files
```http
GET /files?category=documents&page=1&limit=20
Authorization: Bearer {token}
```

#### Get File Details
```http
GET /files/{id}
Authorization: Bearer {token}
```

#### Download File
```http
GET /files/{id}/download
Authorization: Bearer {token}
```

#### Delete File
```http
DELETE /files/{id}
Authorization: Bearer {token}
```

---

### 📊 Dashboard Analytics

#### Get Dashboard Data
```http
GET /dashboard
Authorization: Bearer {token}

Response (varies by role):
{
  "role": "student",
  "totalStudents": 1250,
  "totalCourses": 45,
  "enrolledCourses": 6,
  "completedAssignments": 12,
  "pendingAssignments": 3
}
```

---

## 🔌 WebSocket Events

### Connection
```javascript
import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});

socket.on('connect', () => {
  console.log('Connected to WebSocket');
});
```

### Events

#### Join Conversation
```javascript
socket.emit('join:conversation', conversationId);

socket.on('joined:conversation', (data) => {
  console.log('Joined:', data.conversationId);
});
```

#### Send Message
```javascript
socket.emit('message:send', {
  conversationId: 'uuid',
  content: 'Hello!',
  attachments: [] // optional
});

socket.on('message:new', (message) => {
  console.log('New message:', message);
});
```

#### Typing Indicators
```javascript
// Start typing
socket.emit('typing:start', { conversationId: 'uuid' });

// Stop typing
socket.emit('typing:stop', { conversationId: 'uuid' });

// Listen for others typing
socket.on('typing:user', (data) => {
  console.log(`${data.user.firstName} is typing...`);
});
```

#### Mark Messages as Read
```javascript
socket.emit('messages:read', { conversationId: 'uuid' });

socket.on('messages:read', (data) => {
  console.log(`User ${data.userId} read ${data.count} messages`);
});
```

---

## ⚠️ Error Handling

### Error Response Format
```json
{
  "error": "Error message",
  "details": [] // validation errors if applicable
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate records)
- `500` - Internal Server Error

### Common Errors

#### Invalid Token
```json
{
  "error": "Invalid token"
}
```

#### Insufficient Permissions
```json
{
  "error": "Insufficient permissions",
  "required": ["manage:users"],
  "userHas": ["view:users"]
}
```

#### Validation Error
```json
{
  "error": "Validation failed",
  "details": [
    {
      "path": ["email"],
      "message": "Invalid email format"
    }
  ]
}
```

---

## 🧪 Testing

### Test Credentials
All seeded users have password: `Bitflow@2025`

1. **Bitflow Owner (God Mode)**
   - Email: `god@bitflow.com`
   - Full platform access

2. **Bitflow Admin (God Mode)**
   - Email: `admin@bitflow.com`
   - Full platform access

3. **University Owner**
   - Email: `testowner@example.com`
   - University: Alpha University

4. **University Admin**
   - Email: `testadmin@example.com`
   - University: Beta College

5. **Super Admin**
   - Email: `testsuperadmin@example.com`
   - University: Gamma Institute

### Example cURL Commands

#### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"god@bitflow.com","password":"Bitflow@2025"}'
```

#### List Universities
```bash
curl -X GET http://localhost:3000/api/v1/universities \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Create Ticket
```bash
curl -X POST http://localhost:3000/api/v1/tickets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Issue","description":"Testing ticket creation","priority":"medium","category":"technical"}'
```

---

## 📈 Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per IP
- Exceeding limit returns `429 Too Many Requests`

---

## 🔒 Security Features

✅ **Helmet.js** - Security headers
✅ **CORS** - Cross-origin resource sharing
✅ **JWT** - Token-based authentication
✅ **Bcrypt** - Password hashing (10 rounds)
✅ **Rate Limiting** - DDoS protection
✅ **Audit Logging** - All actions tracked
✅ **God Mode Tracking** - Platform admin actions flagged

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- All IDs are UUIDs
- Pagination: default page=1, limit=20
- God Mode users can access all resources across universities
- Non-God Mode users are restricted to their university
- File uploads limited to 50MB
- Supported file types: images, PDFs, Office documents, CSV, text

---

**API Version:** 1.0.0  
**Last Updated:** October 30, 2025  
**Support:** support@bitflow.com
