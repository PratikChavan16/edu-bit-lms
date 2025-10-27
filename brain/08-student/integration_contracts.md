# Student Portal - Integration Contracts

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Overview

This document defines all integration points between the Student Portal and other services/systems.

---

## 1. Authentication Service Integration

### APIs Consumed

#### `POST /api/auth/login`
**Purpose**: Authenticate student credentials  
**Request**:
```json
{
  "email": "student@example.com",
  "password": "password123"
}
```
**Response**:
```json
{
  "data": {
    "token": "eyJhbGc...",
    "refresh_token": "eyJhbGc...",
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john.doe@student.edu",
      "roles": ["student"]
    }
  }
}
```

#### `POST /api/auth/refresh`
**Purpose**: Refresh access token  
**Request**:
```json
{
  "refresh_token": "eyJhbGc..."
}
```

#### `POST /api/auth/logout`
**Purpose**: Invalidate tokens

---

## 2. Notification Service Integration

### APIs Consumed

#### `GET /api/notifications`
**Purpose**: Fetch user notifications  
**Query Parameters**:
- `unread`: boolean
- `type`: academic|financial|administrative|system
- `page`: integer

#### WebSocket Connection
**URL**: `ws://api.bitflow.edu/notifications`  
**Purpose**: Real-time notification delivery  
**Authentication**: JWT token in connection header

**Events Received**:
```javascript
{
  "event": "notification.new",
  "data": {
    "id": "uuid",
    "type": "academic",
    "title": "Grade Posted",
    "message": "Your grade for Assignment 3 has been posted",
    "link": "/grades"
  }
}
```

### Webhooks Consumed

#### `grade.posted`
**Trigger**: When faculty posts a grade  
**Payload**:
```json
{
  "event": "grade.posted",
  "data": {
    "student_id": "uuid",
    "course_id": "uuid",
    "grade_id": "uuid",
    "component_name": "Assignment 3",
    "marks_obtained": 8,
    "max_marks": 10,
    "grade": "A"
  }
}
```
**Action**: Display notification to student

#### `assignment.graded`
**Trigger**: When faculty grades a submission  
**Payload**:
```json
{
  "event": "assignment.graded",
  "data": {
    "submission_id": "uuid",
    "student_id": "uuid",
    "assignment_id": "uuid",
    "marks_obtained": 9,
    "feedback": "Excellent work!"
  }
}
```

#### `fee.due.reminder`
**Trigger**: 7 days before fee due date  
**Payload**:
```json
{
  "event": "fee.due.reminder",
  "data": {
    "student_id": "uuid",
    "invoice_id": "uuid",
    "amount": 3000,
    "due_date": "2025-12-31"
  }
}
```

#### `announcement.published`
**Trigger**: When admin publishes announcement  
**Payload**:
```json
{
  "event": "announcement.published",
  "data": {
    "announcement_id": "uuid",
    "title": "Mid-term Exams Schedule",
    "target_roles": ["student"],
    "college_id": "uuid"
  }
}
```

---

## 3. File Storage Integration (AWS S3)

### Upload Endpoints

#### `POST /api/file-uploads`
**Purpose**: Upload assignment submission  
**Request**: `multipart/form-data`
```
file: <binary>
entity_type: "submission"
entity_id: "uuid"
```
**Response**:
```json
{
  "data": {
    "id": "uuid",
    "file_url": "https://s3.amazonaws.com/bitflow-uploads/submissions/...",
    "file_name": "assignment3.pdf",
    "file_size": 1024000,
    "mime_type": "application/pdf"
  }
}
```

### Download Endpoints

#### `GET /api/file-uploads/{id}/download`
**Purpose**: Download file with signed URL  
**Response**: Redirects to S3 signed URL (valid for 1 hour)

---

## 4. Payment Gateway Integration

### Razorpay Integration

#### Payment Initiation Flow

1. **Student Portal calls backend**:
```
POST /api/payments/initiate
{
  "invoice_id": "uuid",
  "amount": 3000,
  "payment_method": "razorpay"
}
```

2. **Backend creates Razorpay order**:
```php
$order = Razorpay::orders->create([
    'amount' => $amount * 100, // paise
    'currency' => 'INR',
    'receipt' => $invoiceNumber,
    'notes' => [
        'student_id' => $student->id,
        'invoice_id' => $invoice->id,
    ],
]);
```

3. **Backend returns order details to frontend**:
```json
{
  "data": {
    "payment_id": "uuid",
    "razorpay_order_id": "order_xxx",
    "amount": 3000,
    "currency": "INR",
    "key_id": "rzp_xxx"
  }
}
```

4. **Frontend opens Razorpay checkout**:
```javascript
const options = {
  key: data.key_id,
  amount: data.amount * 100,
  currency: data.currency,
  order_id: data.razorpay_order_id,
  handler: function (response) {
    // Success callback
    verifyPayment(response);
  },
};
const razorpay = new Razorpay(options);
razorpay.open();
```

5. **Frontend verifies payment**:
```
POST /api/payments/verify
{
  "razorpay_payment_id": "pay_xxx",
  "razorpay_order_id": "order_xxx",
  "razorpay_signature": "signature_xxx"
}
```

6. **Backend verifies signature and updates payment status**

---

## 5. Email Service Integration

### APIs Called

#### `POST /api/emails/send`
**Purpose**: Send email notifications  
**Request**:
```json
{
  "to": "student@example.com",
  "template": "assignment_submitted",
  "data": {
    "student_name": "John Doe",
    "assignment_title": "Neural Networks Implementation",
    "submitted_at": "2025-10-25T14:30:00Z",
    "course_name": "Machine Learning"
  }
}
```

### Email Templates Used
- `assignment_submitted`: Confirmation after submission
- `grade_posted`: Notification when grade is posted
- `fee_payment_successful`: Receipt after payment
- `password_changed`: Security notification
- `profile_updated`: Confirmation of profile changes

---

## 6. SMS Service Integration (Optional)

### APIs Called

#### `POST /api/sms/send`
**Purpose**: Send SMS notifications  
**Request**:
```json
{
  "to": "+919876543210",
  "message": "Your fee payment of Rs. 3000 has been received. Receipt: RCP/2025/001"
}
```

**Use Cases**:
- Fee payment confirmation
- Exam schedule reminder
- Attendance warning (below 75%)

---

## 7. Events Published by Student Portal

### `assignment.submitted`
**Trigger**: When student submits assignment  
**Payload**:
```json
{
  "event": "assignment.submitted",
  "data": {
    "submission_id": "uuid",
    "assignment_id": "uuid",
    "student_id": "uuid",
    "course_id": "uuid",
    "submitted_at": "2025-10-25T14:30:00Z",
    "is_late": false
  }
}
```
**Consumers**: Faculty Portal, Notification Service, Email Service

### `profile.updated`
**Trigger**: When student updates profile  
**Payload**:
```json
{
  "event": "profile.updated",
  "data": {
    "student_id": "uuid",
    "updated_fields": ["phone", "address"],
    "updated_at": "2025-10-25T14:30:00Z"
  }
}
```
**Consumers**: Audit Service

### `fee.payment.initiated`
**Trigger**: When student starts payment process  
**Payload**:
```json
{
  "event": "fee.payment.initiated",
  "data": {
    "payment_id": "uuid",
    "student_id": "uuid",
    "invoice_id": "uuid",
    "amount": 3000,
    "payment_method": "razorpay"
  }
}
```
**Consumers**: Financial Service, Analytics Service

### `support.ticket.created`
**Trigger**: When student raises support ticket  
**Payload**:
```json
{
  "event": "support.ticket.created",
  "data": {
    "ticket_id": "uuid",
    "created_by": "uuid",
    "category": "academic",
    "priority": "high",
    "subject": "Cannot submit assignment"
  }
}
```
**Consumers**: Support Portal, Notification Service

---

## 8. Data Flow Diagrams

### Assignment Submission Flow

```
┌─────────────┐
│   Student   │
│   Portal    │
└──────┬──────┘
       │ 1. Select file
       │ 2. POST /assignments/{id}/submit
       ▼
┌─────────────┐
│   Backend   │
│   API       │
└──────┬──────┘
       │ 3. Validate file
       │ 4. Upload to S3
       │
       ├──────────────────┬──────────────────┐
       ▼                  ▼                  ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   AWS S3    │  │ PostgreSQL  │  │   Event     │
│  (Storage)  │  │ (Database)  │  │    Bus      │
└─────────────┘  └─────────────┘  └──────┬──────┘
                                          │
                          ┌───────────────┼───────────────┐
                          ▼               ▼               ▼
                   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
                   │   Faculty   │ │    Email    │ │ Notification│
                   │   Portal    │ │   Service   │ │   Service   │
                   └─────────────┘ └─────────────┘ └─────────────┘
```

### Fee Payment Flow

```
┌─────────────┐
│   Student   │
│   Portal    │
└──────┬──────┘
       │ 1. Select fees to pay
       │ 2. POST /payments/initiate
       ▼
┌─────────────┐
│   Backend   │
│   API       │
└──────┬──────┘
       │ 3. Create Razorpay order
       │ 4. Return order details
       ▼
┌─────────────┐
│  Razorpay   │
│   Gateway   │
└──────┬──────┘
       │ 5. Student completes payment
       │ 6. Webhook notification
       ▼
┌─────────────┐
│   Backend   │
│   API       │
└──────┬──────┘
       │ 7. Verify signature
       │ 8. Update payment status
       │
       ├──────────────────┬──────────────────┐
       ▼                  ▼                  ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ PostgreSQL  │  │    Email    │  │     SMS     │
│ (Database)  │  │   Service   │  │   Service   │
└─────────────┘  └─────────────┘  └─────────────┘
```

---

## 9. Error Handling

### Error Response Format
```json
{
  "message": "Validation error",
  "errors": {
    "field_name": [
      "Error message 1",
      "Error message 2"
    ]
  }
}
```

### Common Error Codes
- `401`: Unauthorized - Invalid or expired token
- `403`: Forbidden - Student accessing another student's data
- `404`: Not Found - Resource doesn't exist
- `422`: Validation Error - Invalid input data
- `429`: Rate Limit Exceeded - Too many requests
- `500`: Internal Server Error - Backend issue

---

## 10. Rate Limiting

### API Rate Limits
- **Authentication endpoints**: 5 requests/minute
- **File uploads**: 10 requests/minute
- **General APIs**: 60 requests/minute
- **WebSocket**: 1 connection per student

### Rate Limit Response
```json
{
  "message": "Rate limit exceeded. Try again in 45 seconds.",
  "retry_after": 45
}
```
**HTTP Status**: `429 Too Many Requests`

---

## 11. Caching Strategy

### Redis Cache Keys
- `student:{id}:profile` - TTL: 1 hour
- `student:{id}:dashboard` - TTL: 15 minutes
- `student:{id}:courses` - TTL: 1 hour
- `student:{id}:attendance` - TTL: 30 minutes
- `student:{id}:grades` - TTL: 30 minutes
- `student:{id}:notifications:unread` - TTL: 5 minutes

### Cache Invalidation
- On profile update: Clear `student:{id}:profile`
- On grade posted: Clear `student:{id}:grades`, `student:{id}:dashboard`
- On attendance marked: Clear `student:{id}:attendance`, `student:{id}:dashboard`

---

## 12. API Versioning

All Student Portal APIs are versioned using URL path:
- Current version: `/api/v2/students/*`
- Legacy version: `/api/v1/students/*` (deprecated, sunset date: Dec 31, 2025)

### Breaking Changes Policy
- Major version increment for breaking changes
- 6 months deprecation notice before sunset
- Backward compatibility maintained during transition

---

**🔌 These integration contracts ensure seamless communication between Student Portal and all dependent services.**
