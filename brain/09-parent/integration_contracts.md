# Parent Portal - Integration Contracts

**Version**: 2.0  
**API Spec**: OpenAPI 3.1  
**Last Updated**: October 25, 2025

---

## 1. Overview

### Integration Architecture
```
┌─────────────────┐
│ Parent Portal   │
│ (Port 3009)     │
└────────┬────────┘
         │
    ┌────┴─────┬──────────┬────────────┬──────────────┐
    │          │          │            │              │
┌───▼──┐  ┌───▼───┐  ┌───▼────┐  ┌────▼───┐  ┌──────▼──────┐
│Student│  │Faculty│  │Fee Mgmt│  │Payment │  │Notification │
│Portal │  │Portal │  │API     │  │Gateway │  │Service      │
│3008   │  │3007   │  │3010    │  │Razorpay│  │FCM          │
└───────┘  └───────┘  └────────┘  └────────┘  └─────────────┘
```

### Integration Points
1. **Student Portal**: Read-only access to student academic data
2. **Faculty Portal**: Teacher messaging, grade notifications
3. **Fee Management API**: Payment processing, receipt generation
4. **Payment Gateways**: Razorpay, PhonePe, UPI
5. **Notification Service**: FCM push notifications, email

---

## 2. Student Portal Integration

### Base URL
```
Production: https://student.institution.edu/api/v1
Staging: https://staging-student.institution.edu/api/v1
```

### Authentication
```http
Authorization: Bearer <parent_jwt_token>
X-Child-ID: <student_id_from_parent_link>
```

### Contract: Get Student Attendance

**Endpoint**: `GET /students/{student_id}/attendance`

**Request**:
```http
GET /students/STU-2024-00123/attendance?from=2025-10-01&to=2025-10-31
Authorization: Bearer eyJhbGc...
X-Child-ID: STU-2024-00123
```

**Response** (200 OK):
```json
{
  "student_id": "STU-2024-00123",
  "student_name": "Aarav Kumar",
  "period": {
    "from": "2025-10-01",
    "to": "2025-10-31"
  },
  "summary": {
    "total_days": 25,
    "present": 23,
    "absent": 2,
    "percentage": 92.0
  },
  "records": [
    {
      "date": "2025-10-01",
      "status": "present",
      "marked_at": "2025-10-01T09:15:00Z",
      "marked_by": "FAC-2024-00045"
    },
    {
      "date": "2025-10-02",
      "status": "absent",
      "marked_at": "2025-10-02T09:20:00Z",
      "marked_by": "FAC-2024-00045",
      "reason": "Sick leave"
    }
  ]
}
```

**Authorization Logic**:
- Parent must be linked to student (verified via `parent_children` table)
- Parent must have `view_attendance` permission
- RLS policy enforces row-level access control

---

### Contract: Get Student Grades

**Endpoint**: `GET /students/{student_id}/grades`

**Request**:
```http
GET /students/STU-2024-00123/grades?semester=1&year=2025
Authorization: Bearer eyJhbGc...
X-Child-ID: STU-2024-00123
```

**Response** (200 OK):
```json
{
  "student_id": "STU-2024-00123",
  "semester": 1,
  "year": 2025,
  "class": "10th A",
  "subjects": [
    {
      "subject_id": "MATH-101",
      "subject_name": "Mathematics",
      "faculty_name": "Dr. Sharma",
      "assessments": [
        {
          "type": "unit_test",
          "name": "Unit Test 1",
          "max_marks": 50,
          "obtained_marks": 47,
          "percentage": 94.0,
          "conducted_on": "2025-09-15",
          "published_on": "2025-09-20"
        }
      ],
      "overall_grade": "A+",
      "overall_percentage": 92.5
    }
  ],
  "cgpa": 9.2,
  "overall_percentage": 91.5
}
```

**Error Response** (403 Forbidden):
```json
{
  "error": "unauthorized_access",
  "message": "Parent not linked to this student",
  "timestamp": "2025-10-25T10:30:00Z"
}
```

---

## 3. Faculty Portal Integration

### Contract: Send Message to Teacher

**Endpoint**: `POST /messages/send`

**Request**:
```http
POST /messages/send
Authorization: Bearer <parent_token>
Content-Type: application/json

{
  "from_id": "PAR-2024-00567",
  "from_type": "parent",
  "to_id": "FAC-2024-00045",
  "to_type": "faculty",
  "subject": "Query about homework",
  "body": "Dear Teacher, Could you please clarify the math homework for tomorrow?",
  "child_id": "STU-2024-00123",
  "priority": "normal"
}
```

**Response** (201 Created):
```json
{
  "message_id": "MSG-2024-001234",
  "status": "sent",
  "sent_at": "2025-10-25T10:30:00Z",
  "expected_reply_time": "24 hours",
  "notification_sent": true
}
```

---

### Contract: Get Teacher Availability

**Endpoint**: `GET /faculty/{faculty_id}/availability`

**Response** (200 OK):
```json
{
  "faculty_id": "FAC-2024-00045",
  "faculty_name": "Dr. Sharma",
  "availability": [
    {
      "day": "Monday",
      "slots": [
        {"start": "14:00", "end": "15:00", "type": "consultation"}
      ]
    }
  ],
  "preferred_contact": "in_app_message"
}
```

---

## 4. Fee Management API Integration

### Base URL
```
Production: https://fees.institution.edu/api/v1
```

### Contract: Get Pending Fees

**Endpoint**: `GET /fees/pending`

**Request**:
```http
GET /fees/pending?student_id=STU-2024-00123
Authorization: Bearer <parent_token>
```

**Response** (200 OK):
```json
{
  "student_id": "STU-2024-00123",
  "student_name": "Aarav Kumar",
  "pending_fees": [
    {
      "fee_id": "FEE-2024-00789",
      "fee_type": "tuition",
      "amount": 12500.00,
      "due_date": "2025-11-05",
      "late_fee": 0,
      "status": "pending"
    },
    {
      "fee_id": "FEE-2024-00790",
      "fee_type": "transport",
      "amount": 3000.00,
      "due_date": "2025-11-10",
      "late_fee": 0,
      "status": "pending"
    }
  ],
  "total_pending": 15500.00,
  "currency": "INR"
}
```

---

### Contract: Initiate Payment

**Endpoint**: `POST /payments/initiate`

**Request**:
```http
POST /payments/initiate
Authorization: Bearer <parent_token>
Content-Type: application/json

{
  "fee_ids": ["FEE-2024-00789", "FEE-2024-00790"],
  "total_amount": 15500.00,
  "payment_method": "razorpay",
  "parent_id": "PAR-2024-00567",
  "student_id": "STU-2024-00123",
  "return_url": "https://parent.institution.edu/payment/callback"
}
```

**Response** (201 Created):
```json
{
  "payment_id": "PAY-2024-003456",
  "razorpay_order_id": "order_O1A2B3C4D5E6F7",
  "amount": 15500.00,
  "currency": "INR",
  "status": "initiated",
  "payment_url": "https://api.razorpay.com/v1/checkout/...",
  "expiry_time": "2025-10-25T12:30:00Z"
}
```

---

### Contract: Payment Webhook (Callback from Fee Management)

**Endpoint**: `POST /webhooks/payment-status`

**Request** (from Fee Management API):
```http
POST /webhooks/payment-status
X-Webhook-Signature: sha256=abc123...
Content-Type: application/json

{
  "event": "payment.success",
  "payment_id": "PAY-2024-003456",
  "razorpay_payment_id": "pay_O1A2B3C4D5E6F7",
  "amount": 15500.00,
  "status": "captured",
  "captured_at": "2025-10-25T11:00:00Z",
  "parent_id": "PAR-2024-00567",
  "student_id": "STU-2024-00123",
  "receipt_url": "https://fees.institution.edu/receipts/PAY-2024-003456.pdf"
}
```

**Webhook Signature Verification**:
```php
$signature = hash_hmac('sha256', $payload, env('WEBHOOK_SECRET'));
if (!hash_equals($signature, $_SERVER['HTTP_X_WEBHOOK_SIGNATURE'])) {
    abort(401, 'Invalid signature');
}
```

---

## 5. Payment Gateway Integration

### Razorpay Integration

**Create Order**:
```javascript
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const order = await razorpay.orders.create({
  amount: 1550000, // Amount in paise (₹15,500)
  currency: 'INR',
  receipt: 'FEE-2024-00789',
  notes: {
    student_id: 'STU-2024-00123',
    parent_id: 'PAR-2024-00567',
  },
});
```

**Verify Payment Signature**:
```javascript
const crypto = require('crypto');

const generatedSignature = crypto
  .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
  .update(razorpay_order_id + '|' + razorpay_payment_id)
  .digest('hex');

if (generatedSignature === razorpay_signature) {
  // Payment verified
}
```

---

### UPI Integration (PhonePe)

**Initiate UPI Payment**:
```http
POST https://api.phonepe.com/apis/hermes/pg/v1/pay
Content-Type: application/json
X-VERIFY: <checksum>

{
  "merchantId": "M123456789",
  "merchantTransactionId": "PAY-2024-003456",
  "merchantUserId": "PAR-2024-00567",
  "amount": 1550000,
  "redirectUrl": "https://parent.institution.edu/payment/callback",
  "redirectMode": "REDIRECT",
  "callbackUrl": "https://parent.institution.edu/webhooks/phonepe",
  "mobileNumber": "9876543210",
  "paymentInstrument": {
    "type": "UPI_INTENT",
    "targetApp": "com.google.android.apps.nbu.paisa.user"
  }
}
```

---

## 6. Notification Service Integration

### Firebase Cloud Messaging (FCM)

**Subscribe to Child-Specific Topic**:
```javascript
await messaging().subscribeToTopic(`child-${student_id}`);
```

**Send Notification (Server-side)**:
```javascript
const admin = require('firebase-admin');

await admin.messaging().send({
  topic: 'child-STU-2024-00123',
  notification: {
    title: 'Attendance Marked',
    body: 'Aarav Kumar - Present (09:15 AM)',
  },
  data: {
    type: 'attendance',
    student_id: 'STU-2024-00123',
    date: '2025-10-25',
    status: 'present',
  },
  android: {
    priority: 'high',
  },
  apns: {
    payload: {
      aps: {
        sound: 'default',
        badge: 1,
      },
    },
  },
});
```

---

### Event Subscriptions (CloudEvents)

**Event: Grade Published**:
```json
{
  "specversion": "1.0",
  "type": "edu.institution.grade.published",
  "source": "faculty-portal",
  "id": "EVENT-2024-001234",
  "time": "2025-10-25T10:00:00Z",
  "datacontenttype": "application/json",
  "data": {
    "student_id": "STU-2024-00123",
    "subject": "Mathematics",
    "assessment_type": "unit_test",
    "marks": 47,
    "max_marks": 50,
    "published_by": "FAC-2024-00045"
  }
}
```

**Parent Portal Action**: Send push notification to parent

---

## 7. Error Handling

### Standard Error Response
```json
{
  "error": {
    "code": "UNAUTHORIZED_ACCESS",
    "message": "Parent not linked to this student",
    "details": {
      "parent_id": "PAR-2024-00567",
      "student_id": "STU-2024-00123"
    },
    "timestamp": "2025-10-25T10:30:00Z",
    "request_id": "REQ-2024-005678"
  }
}
```

### HTTP Status Codes
| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Data retrieved |
| 201 | Created | Payment initiated |
| 400 | Bad Request | Invalid fee_id |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Parent not linked to child |
| 404 | Not Found | Student not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Database connection failed |

---

## 8. Rate Limiting

### API Rate Limits
| Endpoint | Limit | Window |
|----------|-------|--------|
| `/students/{id}/attendance` | 60 req | 1 min |
| `/students/{id}/grades` | 30 req | 1 min |
| `/messages/send` | 10 req | 1 hour |
| `/payments/initiate` | 5 req | 5 min |

**Rate Limit Headers**:
```http
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1698235200
```

---

## 9. Versioning Strategy

### API Versioning
- **Current Version**: v1
- **URL Pattern**: `/api/v1/...`
- **Deprecation**: 6 months notice before v1 sunset
- **Backward Compatibility**: Maintained within major versions

---

## 10. Integration Checklist

### Pre-Integration
- [ ] Obtain API keys for all services
- [ ] Configure webhook endpoints
- [ ] Set up staging environment
- [ ] Document all integration points

### Testing
- [ ] Test authentication flow
- [ ] Test data access permissions (RLS)
- [ ] Test payment webhook signature verification
- [ ] Test push notification delivery
- [ ] Load test with 1000 concurrent parents

### Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Monitor API response times
- [ ] Track payment success rate
- [ ] Monitor webhook delivery rate

---

**Integration Status**: ✅ All Integrations Live  
**Last Updated**: October 25, 2025  
**Contact**: integrations@institution.edu
