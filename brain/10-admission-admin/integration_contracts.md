# Admission Admin Portal - Integration Contracts

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Integration Overview

```
Admission Admin Portal
    ├── Entrance Exam Service (JEE/CET API)
    ├── Payment Gateways (Razorpay, HDFC)
    ├── SMS Gateway (Twilio, MSG91)
    ├── Email Service (AWS SES)
    ├── Student Portal (Post-Admission Handoff)
    ├── Document Storage (AWS S3)
    ├── OCR Service (AWS Textract, Google Vision AI)
    ├── Search Service (Elasticsearch)
    └── Event Bus (CloudEvents)
```

---

## 1. Entrance Exam Service Integration

### 1.1 Fetch Exam Scores
**Provider**: National Testing Agency (NTA) / State CET Board  
**Authentication**: API Key + OAuth 2.0

**Request**:
```http
GET https://api.nta.ac.in/v2/jee-mains/scores
Authorization: Bearer <access_token>
X-API-Key: <api_key>
Content-Type: application/json

{
  "roll_numbers": ["240987654", "240987655"],
  "exam_year": 2024,
  "exam_session": "JAN"
}
```

**Response**:
```json
{
  "status": "success",
  "data": [
    {
      "roll_number": "240987654",
      "candidate_name": "RAHUL SHARMA",
      "dob": "2006-08-15",
      "percentile": 98.4,
      "score": 288,
      "rank": 2847,
      "category": "GENERAL",
      "marks": {
        "physics": 95,
        "chemistry": 93,
        "mathematics": 100
      },
      "exam_date": "2024-01-25"
    }
  ],
  "retrieved_at": "2024-06-25T10:30:00Z"
}
```

**Error Handling**:
```json
{
  "status": "error",
  "error_code": "INVALID_ROLL_NUMBER",
  "message": "Roll number 240987654 not found",
  "retry_after": 300
}
```

**Rate Limiting**: 100 requests/minute  
**Timeout**: 30 seconds

---

### 1.2 Verify Exam Certificate
**Request**:
```http
POST https://api.nta.ac.in/v2/jee-mains/verify-certificate
Authorization: Bearer <access_token>

{
  "roll_number": "240987654",
  "certificate_hash": "abc123def456...",
  "document_url": "https://admission-docs.s3.amazonaws.com/certificates/240987654.pdf"
}
```

**Response**:
```json
{
  "status": "success",
  "verified": true,
  "certificate_details": {
    "issued_date": "2024-02-15",
    "validity": "valid",
    "tampering_detected": false
  }
}
```

---

## 2. Payment Gateway Integration

### 2.1 Razorpay Integration

#### Create Payment Order
**Request**:
```http
POST https://api.razorpay.com/v1/orders
Authorization: Basic <base64(key_id:key_secret)>
Content-Type: application/json

{
  "amount": 150000,  // Amount in paise (₹1,500)
  "currency": "INR",
  "receipt": "ADM-2024-001234",
  "notes": {
    "application_id": "ADM-2024-001234",
    "program": "B.Tech CSE",
    "category": "general"
  }
}
```

**Response**:
```json
{
  "id": "order_NXQxQxXxXxXxXx",
  "entity": "order",
  "amount": 150000,
  "amount_paid": 0,
  "currency": "INR",
  "receipt": "ADM-2024-001234",
  "status": "created",
  "created_at": 1698235200
}
```

---

#### Payment Webhook
**Webhook URL**: `https://admission.institution.edu/api/webhooks/razorpay`  
**Method**: POST  
**Authentication**: HMAC-SHA256 signature verification

**Webhook Payload**:
```json
{
  "event": "payment.captured",
  "payload": {
    "payment": {
      "entity": {
        "id": "pay_NXQxQxXxXxXxXx",
        "order_id": "order_NXQxQxXxXxXxXx",
        "amount": 150000,
        "currency": "INR",
        "status": "captured",
        "method": "card",
        "card": {
          "last4": "1234",
          "network": "Visa",
          "type": "credit"
        },
        "captured_at": 1698235500,
        "created_at": 1698235200
      }
    }
  }
}
```

**Signature Verification**:
```php
$webhookSignature = $_SERVER['HTTP_X_RAZORPAY_SIGNATURE'];
$webhookBody = file_get_contents('php://input');
$webhookSecret = config('razorpay.webhook_secret');

$expectedSignature = hash_hmac('sha256', $webhookBody, $webhookSecret);

if ($webhookSignature !== $expectedSignature) {
    abort(403, 'Invalid signature');
}
```

---

#### Refund Processing
**Request**:
```http
POST https://api.razorpay.com/v1/payments/{payment_id}/refund
Authorization: Basic <base64(key_id:key_secret)>
Content-Type: application/json

{
  "amount": 150000,  // Full refund
  "notes": {
    "reason": "Application rejected",
    "application_id": "ADM-2024-001234"
  }
}
```

**Response**:
```json
{
  "id": "rfnd_NXQxQxXxXxXxXx",
  "entity": "refund",
  "amount": 150000,
  "currency": "INR",
  "payment_id": "pay_NXQxQxXxXxXxXx",
  "status": "processed",
  "created_at": 1698240000
}
```

---

### 2.2 HDFC Payment Gateway Integration

#### Payment Request
**Request**:
```http
POST https://payment.hdfc.com/api/v2/create-transaction
Content-Type: application/json
Authorization: Bearer <merchant_token>

{
  "merchant_id": "MERCHANT_123",
  "order_id": "ADM-2024-001234",
  "amount": "1500.00",
  "currency": "INR",
  "customer_email": "applicant@example.com",
  "customer_phone": "9876543210",
  "return_url": "https://admission.institution.edu/payment/callback",
  "cancel_url": "https://admission.institution.edu/payment/cancel"
}
```

**Response**:
```json
{
  "status": "success",
  "transaction_id": "TXN_20240625143052",
  "payment_url": "https://payment.hdfc.com/pay/TXN_20240625143052",
  "expires_at": "2024-06-25T15:30:52Z"
}
```

---

## 3. SMS Gateway Integration

### 3.1 Twilio SMS API

#### Send Single SMS
**Request**:
```http
POST https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json
Authorization: Basic <base64(AccountSid:AuthToken)>
Content-Type: application/x-www-form-urlencoded

From=+91XXXXXXXXXX&To=+919876543210&Body=Your application ADM-2024-001234 has been verified. Merit list will be published on 05/07/2024.
```

**Response**:
```json
{
  "sid": "SM9876543210abcdef",
  "status": "queued",
  "to": "+919876543210",
  "from": "+91XXXXXXXXXX",
  "body": "Your application ADM-2024-001234 has been verified...",
  "date_created": "2024-06-25T10:30:00Z"
}
```

---

#### Send Bulk SMS (50,000 notifications)
**Request**:
```http
POST https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json
Authorization: Basic <base64(AccountSid:AuthToken)>
Content-Type: application/json

{
  "messaging_service_sid": "MG9876543210abcdef",
  "to": ["+919876543210", "+919876543211", ...],
  "body": "Merit List Round 1 published. Check your rank at https://admission.institution.edu"
}
```

**Rate Limiting**: 100 SMS/second  
**Cost**: ₹0.60 per SMS

---

### 3.2 MSG91 SMS API (Alternative)

**Request**:
```http
POST https://api.msg91.com/api/v5/flow/
Content-Type: application/json
authkey: <auth_key>

{
  "flow_id": "6234567890abcdef12345678",
  "mobiles": "919876543210,919876543211",
  "rank": "284",
  "name": "Rahul Sharma",
  "program": "B.Tech CSE"
}
```

**Response**:
```json
{
  "type": "success",
  "message": "SMS sent successfully",
  "request_id": "1234567890abcdef"
}
```

---

## 4. Email Service Integration

### 4.1 AWS SES (Simple Email Service)

#### Send Single Email
**Request** (using AWS SDK):
```php
use Aws\Ses\SesClient;

$sesClient = new SesClient([
    'version' => 'latest',
    'region' => 'ap-south-1',
]);

$sesClient->sendEmail([
    'Source' => 'admission@institution.edu',
    'Destination' => [
        'ToAddresses' => ['applicant@example.com'],
    ],
    'Message' => [
        'Subject' => [
            'Data' => 'Application Verified - Merit List Coming Soon',
            'Charset' => 'UTF-8',
        ],
        'Body' => [
            'Html' => [
                'Data' => '<html><body>Dear Rahul Sharma...</body></html>',
                'Charset' => 'UTF-8',
            ],
        ],
    ],
]);
```

**Response**:
```json
{
  "MessageId": "01020187654321-abcdef12-3456-7890-abcd-ef1234567890"
}
```

---

#### Send Bulk Emails (50,000 emails)
**Request** (using SES Batch API):
```php
$sesClient->sendBulkTemplatedEmail([
    'Source' => 'admission@institution.edu',
    'Template' => 'MeritListPublished',
    'DefaultTemplateData' => json_encode(['year' => 2024]),
    'Destinations' => [
        [
            'Destination' => ['ToAddresses' => ['applicant1@example.com']],
            'ReplacementTemplateData' => json_encode(['name' => 'Rahul', 'rank' => 284]),
        ],
        [
            'Destination' => ['ToAddresses' => ['applicant2@example.com']],
            'ReplacementTemplateData' => json_encode(['name' => 'Priya', 'rank' => 145]),
        ],
        // ... up to 50 destinations per request
    ],
]);
```

**Rate Limiting**: 14 emails/second (production limit: 50,000/day)  
**Cost**: $0.10 per 1,000 emails

---

## 5. Student Portal Integration

### 5.1 Post-Admission Student Handoff

**Trigger**: When seat allocation confirmed and fees paid

**Request**:
```http
POST https://student-portal.institution.edu/api/v1/students/create
Authorization: Bearer <service_token>
Content-Type: application/json

{
  "admission_id": "ADM-2024-001234",
  "student_data": {
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "mobile": "9876543210",
    "dob": "2006-08-15",
    "aadhar": "123456789012",
    "program": "B.Tech CSE",
    "category": "general",
    "admission_year": 2024,
    "merit_rank": 284
  },
  "documents": [
    {
      "type": "hsc_marksheet",
      "url": "https://admission-docs.s3.amazonaws.com/hsc/240987654.pdf",
      "hash": "abc123def456..."
    },
    {
      "type": "aadhar_card",
      "url": "https://admission-docs.s3.amazonaws.com/aadhar/123456789012.pdf",
      "hash": "def789ghi012..."
    }
  ],
  "payment_details": {
    "amount": 150000,
    "transaction_id": "pay_NXQxQxXxXxXxXx",
    "payment_date": "2024-06-25T14:30:52Z"
  }
}
```

**Response**:
```json
{
  "status": "success",
  "student_id": "STU-2024-12345",
  "enrollment_number": "2024BTECH0012345",
  "portal_access": {
    "username": "rahul.sharma@student.institution.edu",
    "temporary_password": "TempPass@123",
    "password_reset_required": true,
    "portal_url": "https://student-portal.institution.edu"
  },
  "created_at": "2024-06-25T14:35:00Z"
}
```

---

### 5.2 Document Transfer
**Request**:
```http
POST https://student-portal.institution.edu/api/v1/documents/transfer
Authorization: Bearer <service_token>
Content-Type: application/json

{
  "admission_id": "ADM-2024-001234",
  "student_id": "STU-2024-12345",
  "documents": [
    {
      "document_id": "DOC-001",
      "type": "hsc_marksheet",
      "s3_key": "admission-documents/hsc/240987654.pdf",
      "verified": true,
      "verified_by": "STAFF-2024-00045",
      "verified_at": "2024-06-26T10:30:00Z"
    }
  ]
}
```

**Response**:
```json
{
  "status": "success",
  "transferred_count": 8,
  "message": "All documents transferred to student portal"
}
```

---

## 6. Document Storage (AWS S3)

### 6.1 Upload Document
**Request** (Pre-signed URL generation):
```php
use Aws\S3\S3Client;

$s3Client = new S3Client([
    'version' => 'latest',
    'region' => 'ap-south-1',
]);

$command = $s3Client->getCommand('PutObject', [
    'Bucket' => 'admission-documents-prod',
    'Key' => 'applications/ADM-2024-001234/hsc_marksheet.pdf',
    'ContentType' => 'application/pdf',
]);

$presignedRequest = $s3Client->createPresignedRequest($command, '+15 minutes');
$presignedUrl = (string) $presignedRequest->getUri();
```

**Client-Side Upload** (using pre-signed URL):
```javascript
const file = document.getElementById('file-input').files[0];

fetch(presignedUrl, {
  method: 'PUT',
  body: file,
  headers: {
    'Content-Type': 'application/pdf'
  }
})
.then(response => {
  console.log('Upload successful');
});
```

---

### 6.2 Download Document (Pre-signed URL)
**Request**:
```php
$presignedUrl = $s3Client->getObjectUrl(
    'admission-documents-prod',
    'applications/ADM-2024-001234/hsc_marksheet.pdf',
    '+15 minutes'
);
```

**Response**:
```
https://admission-documents-prod.s3.ap-south-1.amazonaws.com/applications/ADM-2024-001234/hsc_marksheet.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=...&X-Amz-Date=20240625T103000Z&X-Amz-Expires=900&X-Amz-Signature=...
```

---

### 6.3 Document Lifecycle Policy
**Policy** (applied to S3 bucket):
```json
{
  "Rules": [
    {
      "Id": "TransitionToGlacier",
      "Status": "Enabled",
      "Prefix": "applications/",
      "Transitions": [
        {
          "Days": 730,
          "StorageClass": "GLACIER"
        }
      ],
      "Expiration": {
        "Days": 2555
      }
    }
  ]
}
```

**Lifecycle**:
- Day 0-730 (2 years): S3 Standard
- Day 730-2555 (7 years): Glacier
- Day 2555+: Permanent deletion

---

## 7. OCR Service Integration

### 7.1 AWS Textract

#### Analyze Document
**Request**:
```php
use Aws\Textract\TextractClient;

$textractClient = new TextractClient([
    'version' => 'latest',
    'region' => 'ap-south-1',
]);

$result = $textractClient->analyzeDocument([
    'Document' => [
        'S3Object' => [
            'Bucket' => 'admission-documents-prod',
            'Name' => 'applications/ADM-2024-001234/hsc_marksheet.pdf',
        ],
    ],
    'FeatureTypes' => ['TABLES', 'FORMS'],
]);
```

**Response**:
```json
{
  "DocumentMetadata": {
    "Pages": 1
  },
  "Blocks": [
    {
      "BlockType": "LINE",
      "Confidence": 99.8,
      "Text": "HSC MARKSHEET",
      "Geometry": {...}
    },
    {
      "BlockType": "LINE",
      "Confidence": 98.5,
      "Text": "Name: RAHUL SHARMA",
      "Geometry": {...}
    },
    {
      "BlockType": "LINE",
      "Confidence": 97.2,
      "Text": "Percentage: 92.4%",
      "Geometry": {...}
    }
  ]
}
```

**Cost**: $1.50 per 1,000 pages

---

### 7.2 Google Vision AI (Fallback)

**Request**:
```http
POST https://vision.googleapis.com/v1/images:annotate
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "requests": [
    {
      "image": {
        "source": {
          "gcsImageUri": "gs://admission-documents/hsc_marksheet.pdf"
        }
      },
      "features": [
        {"type": "DOCUMENT_TEXT_DETECTION"}
      ]
    }
  ]
}
```

**Response**:
```json
{
  "responses": [
    {
      "textAnnotations": [
        {
          "description": "HSC MARKSHEET\nName: RAHUL SHARMA\nPercentage: 92.4%",
          "confidence": 0.985
        }
      ]
    }
  ]
}
```

---

## 8. Elasticsearch Integration

### 8.1 Index Application Data
**Request**:
```http
PUT http://elasticsearch:9200/applications/_doc/ADM-2024-001234
Content-Type: application/json

{
  "application_id": "ADM-2024-001234",
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "mobile": "9876543210",
  "program": "B.Tech CSE",
  "category": "general",
  "status": "verified",
  "entrance_score": 288,
  "hsc_percentage": 92.4,
  "merit_score": 234.55,
  "created_at": "2024-06-25T10:00:00Z"
}
```

---

### 8.2 Search Applications
**Request**:
```http
GET http://elasticsearch:9200/applications/_search
Content-Type: application/json

{
  "query": {
    "bool": {
      "must": [
        {"match": {"program": "B.Tech CSE"}},
        {"range": {"merit_score": {"gte": 200}}}
      ]
    }
  },
  "sort": [
    {"merit_score": {"order": "desc"}}
  ],
  "from": 0,
  "size": 50
}
```

**Response**:
```json
{
  "hits": {
    "total": {"value": 3247},
    "hits": [
      {
        "_id": "ADM-2024-001234",
        "_source": {
          "name": "Rahul Sharma",
          "merit_score": 234.55,
          ...
        }
      }
    ]
  }
}
```

---

## 9. Event Bus Integration (CloudEvents)

### 9.1 Application Submitted Event
**Event Schema**:
```json
{
  "specversion": "1.0",
  "type": "edu.institution.admission.application.submitted",
  "source": "admission-portal",
  "id": "evt-20240625-001",
  "time": "2024-06-25T10:00:00Z",
  "datacontenttype": "application/json",
  "data": {
    "application_id": "ADM-2024-001234",
    "applicant_name": "Rahul Sharma",
    "program": "B.Tech CSE",
    "payment_status": "pending"
  }
}
```

**Subscribers**:
- Payment Service (initiate payment)
- Notification Service (send confirmation email/SMS)
- Analytics Service (track application metrics)

---

### 9.2 Merit List Published Event
**Event Schema**:
```json
{
  "specversion": "1.0",
  "type": "edu.institution.admission.meritlist.published",
  "source": "admission-portal",
  "id": "evt-20240705-042",
  "time": "2024-07-05T18:00:00Z",
  "datacontenttype": "application/json",
  "data": {
    "merit_list_id": "ML-2024-BTECH-CSE-R1",
    "program": "B.Tech CSE",
    "round": 1,
    "total_applicants": 3247,
    "cutoff_score": 185.5,
    "published_by": "STAFF-2024-00001"
  }
}
```

**Subscribers**:
- Notification Service (send merit list to 3,247 applicants)
- Student Portal (prepare counseling interface)
- Analytics Service (track merit list metrics)

---

## 10. Integration Testing

### Mock Services (for testing)
```php
// tests/Integration/PaymentGatewayMockTest.php
class PaymentGatewayMockTest extends TestCase
{
    public function test_razorpay_payment_success()
    {
        Http::fake([
            'https://api.razorpay.com/v1/orders' => Http::response([
                'id' => 'order_mock_123',
                'status' => 'created',
                'amount' => 150000,
            ], 200),
        ]);
        
        $response = $this->postJson('/api/payment/create-order', [
            'application_id' => 'ADM-2024-001234',
            'amount' => 1500,
        ]);
        
        $response->assertStatus(200)
                 ->assertJsonPath('razorpay_order_id', 'order_mock_123');
    }
}
```

---

**Integration Status**: ✅ All integrations active  
**Uptime**: 99.8%  
**API Latency**: P50: 120ms, P95: 450ms, P99: 1.2s
