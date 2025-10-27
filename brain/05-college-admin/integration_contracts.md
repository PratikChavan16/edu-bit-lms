# College Admin Portal - Integration Contracts

## Overview
This document defines the integration contracts and API specifications for the College Admin portal's interactions with other system components, external services, and third-party integrations. It ensures data consistency, proper event handling, and seamless inter-portal communication.

## 1. Internal Portal Integrations

### 1.1 Integration with Super Admin Portal

#### Staff Onboarding Workflow
**Direction**: Super Admin → College Admin

**Contract**: When Super Admin creates a college, College Admin receives initialization event

```typescript
interface CollegeInitializationEvent {
  event_type: "college.initialized";
  event_id: string;
  timestamp: string;
  data: {
    college_id: string;
    college_name: string;
    college_code: string;
    admin_user: {
      user_id: string;
      email: string;
      first_name: string;
      last_name: string;
    };
    initial_config: {
      max_staff: number;
      max_students: number;
      modules_enabled: string[];
    };
  };
}
```

**Endpoint**: `POST /api/v1/events/college-initialization`

**Expected Response**:
```json
{
  "status": "acknowledged",
  "college_id": "col_123",
  "setup_status": "in_progress",
  "estimated_completion": "2024-10-25T10:30:00Z"
}
```

#### License & Module Management
**Direction**: Super Admin ⟷ College Admin (Bidirectional)

**Contract**: License limit validation before staff creation

```typescript
interface LicenseValidationRequest {
  college_id: string;
  resource_type: "staff" | "student" | "bus" | "hostel_room";
  requested_count: number;
  current_count: number;
}

interface LicenseValidationResponse {
  is_valid: boolean;
  available_licenses: number;
  license_limit: number;
  requires_upgrade: boolean;
  upgrade_url?: string;
}
```

**Endpoint**: `GET /api/v1/licenses/validate`

**Headers**:
```
Authorization: Bearer {jwt_token}
X-College-ID: {college_id}
```

### 1.2 Integration with Principal Portal

#### Staff Performance Data Sharing
**Direction**: College Admin → Principal

**Contract**: Staff attendance and performance metrics synchronization

```typescript
interface StaffPerformanceSync {
  sync_id: string;
  college_id: string;
  sync_timestamp: string;
  staff_metrics: Array<{
    staff_id: string;
    employee_id: string;
    full_name: string;
    department_id: string;
    metrics: {
      attendance_percentage: number;
      leave_days_taken: number;
      performance_rating: number;
      work_orders_completed: number;
      tasks_pending: number;
    };
    period: {
      start_date: string;
      end_date: string;
    };
  }>;
}
```

**Endpoint**: `POST /api/v1/principal/staff-metrics`

**Webhook**: Principal portal webhook receives real-time updates

```typescript
// Webhook payload to Principal
interface StaffEventWebhook {
  event: "staff.created" | "staff.updated" | "staff.terminated";
  staff_id: string;
  college_id: string;
  timestamp: string;
  data: Partial<StaffData>;
}
```

### 1.3 Integration with Faculty Portal

#### Staff-Faculty Account Linking
**Direction**: College Admin ⟷ Faculty (Bidirectional)

**Contract**: When teaching staff is created, Faculty account is auto-provisioned

```typescript
interface StaffToFacultyLink {
  staff_id: string;
  employee_id: string;
  college_id: string;
  personal_info: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  department_id: string;
  designation: string;
  is_teaching_staff: boolean;
  subjects_eligible: string[];
}

interface FacultyAccountResponse {
  faculty_id: string;
  user_id: string;
  account_status: "active" | "pending_activation";
  login_credentials_sent: boolean;
  portal_access_url: string;
}
```

**Endpoint**: `POST /api/v1/faculty/link-account`

**Sync Frequency**: Real-time via webhook + Daily batch reconciliation

### 1.4 Integration with Student Portal

#### Transport & Hostel Assignment Sync
**Direction**: College Admin → Student Portal

**Contract**: Student transport and hostel assignments

```typescript
interface StudentAssignmentSync {
  sync_type: "transport" | "hostel";
  college_id: string;
  assignments: Array<{
    student_id: string;
    assignment_id: string;
    assignment_type: "bus_route" | "hostel_room";
    details: {
      bus_id?: string;
      bus_number?: string;
      route_id?: string;
      pickup_stop?: string;
      hostel_id?: string;
      room_number?: string;
      bed_number?: string;
    };
    effective_from: string;
    valid_until: string;
    fee_amount: number;
    payment_status: "pending" | "paid" | "overdue";
  }>;
}
```

**Endpoint**: `POST /api/v1/student/assignments/sync`

**Event Stream**: Real-time updates via Server-Sent Events (SSE)

```typescript
// SSE Event Format
data: {
  "event": "assignment.updated",
  "student_id": "stu_456",
  "assignment_type": "bus_route",
  "status": "confirmed"
}
```

### 1.5 Integration with Accountant Portal

#### Financial Transaction Data Exchange
**Direction**: College Admin → Accountant (Bidirectional)

**Contract**: Vendor payments, staff salaries, infrastructure expenses

```typescript
interface FinancialTransactionSync {
  transaction_batch_id: string;
  college_id: string;
  fiscal_period: {
    year: number;
    month: number;
  };
  transactions: Array<{
    transaction_id: string;
    transaction_type: "vendor_payment" | "staff_salary" | "infrastructure_expense";
    category: string;
    sub_category: string;
    amount: number;
    currency: "INR" | "USD";
    transaction_date: string;
    payment_method: string;
    vendor_id?: string;
    staff_id?: string;
    asset_id?: string;
    description: string;
    approval_status: "pending" | "approved" | "rejected";
    payment_status: "pending" | "completed" | "failed";
    reference_documents: string[];
  }>;
}
```

**Endpoint**: `POST /api/v1/accountant/transactions/batch`

**Reconciliation**: Daily automated reconciliation at 23:00 UTC

### 1.6 Integration with College Accounts Admin

#### Budget Allocation & Expense Tracking
**Direction**: College Accounts Admin → College Admin

**Contract**: Budget limits for different departments and categories

```typescript
interface BudgetAllocation {
  college_id: string;
  fiscal_year: number;
  allocations: Array<{
    department_id?: string;
    category: "staff" | "infrastructure" | "transport" | "hostel" | "library";
    allocated_amount: number;
    spent_amount: number;
    remaining_amount: number;
    utilization_percentage: number;
    approval_required_above: number;
  }>;
}

interface ExpenseApprovalRequest {
  expense_id: string;
  category: string;
  amount: number;
  budget_allocation_id: string;
  description: string;
  supporting_documents: string[];
  requested_by: string;
  urgency: "low" | "medium" | "high";
}
```

**Endpoint**: `GET /api/v1/accounts/budget-allocations`
**Endpoint**: `POST /api/v1/accounts/expense-approval`

## 2. External Service Integrations

### 2.1 SMS Gateway Integration (Twilio)

**Purpose**: Send SMS notifications for bus delays, emergency alerts, staff notifications

**Authentication**: API Key + Secret

```typescript
interface SMSNotificationRequest {
  provider: "twilio";
  message_type: "bus_delay" | "emergency_alert" | "staff_notification";
  recipients: Array<{
    phone_number: string;
    country_code: string;
    student_id?: string;
    staff_id?: string;
  }>;
  message: {
    content: string;
    sender_id: string;
    priority: "high" | "normal";
  };
  metadata: {
    college_id: string;
    triggered_by: string;
    reference_id: string;
  };
}

interface SMSResponse {
  batch_id: string;
  messages_sent: number;
  messages_failed: number;
  delivery_status: Array<{
    phone_number: string;
    status: "sent" | "delivered" | "failed";
    message_id: string;
    error_message?: string;
  }>;
}
```

**Webhook for Delivery Status**:
```typescript
interface SMSDeliveryWebhook {
  message_id: string;
  status: "delivered" | "failed" | "undelivered";
  phone_number: string;
  error_code?: string;
  delivered_at?: string;
}
```

**Endpoint**: `POST https://api.twilio.com/2010-04-01/Accounts/{AccountSID}/Messages.json`

### 2.2 Email Service Integration (SendGrid)

**Purpose**: Staff onboarding emails, document notifications, system alerts

```typescript
interface EmailNotificationRequest {
  provider: "sendgrid";
  template_id: string;
  recipients: Array<{
    email: string;
    name: string;
    type: "to" | "cc" | "bcc";
  }>;
  dynamic_data: Record<string, any>;
  attachments?: Array<{
    filename: string;
    content: string; // Base64 encoded
    type: string;
    disposition: "attachment" | "inline";
  }>;
  metadata: {
    college_id: string;
    user_id: string;
    category: string;
  };
}

interface EmailResponse {
  message_id: string;
  status: "queued" | "sent" | "failed";
  recipients_accepted: number;
  recipients_rejected: number;
}
```

**Webhook for Email Events**:
```typescript
interface EmailEventWebhook {
  event: "delivered" | "opened" | "clicked" | "bounced" | "spam";
  email: string;
  message_id: string;
  timestamp: number;
  url?: string; // For click events
  reason?: string; // For bounce events
}
```

**Endpoint**: `POST https://api.sendgrid.com/v3/mail/send`

### 2.3 Cloud Storage Integration (AWS S3 / Azure Blob)

**Purpose**: Store staff documents, asset images, work order attachments

```typescript
interface FileUploadRequest {
  provider: "aws_s3" | "azure_blob";
  file: {
    filename: string;
    content_type: string;
    size_bytes: number;
    content: Blob | Buffer;
  };
  storage_path: string;
  metadata: {
    college_id: string;
    uploader_id: string;
    entity_type: "staff" | "asset" | "work_order";
    entity_id: string;
  };
  access_control: "private" | "public-read";
  encryption: "AES256" | "aws:kms";
}

interface FileUploadResponse {
  file_id: string;
  storage_url: string;
  signed_url: string; // Temporary access URL
  signed_url_expires_at: string;
  file_size: number;
  checksum: string;
}

interface FileRetrievalRequest {
  file_id: string;
  college_id: string;
  expiry_duration: number; // seconds
}
```

**S3 Configuration**:
```json
{
  "bucket": "edubit-college-admin-{environment}",
  "region": "us-east-1",
  "lifecycle_policy": {
    "transition_to_glacier": 365,
    "delete_after": 2555
  }
}
```

### 2.4 GPS Tracking Integration (Google Maps / MapBox)

**Purpose**: Real-time bus location tracking, route optimization

```typescript
interface GPSLocationUpdate {
  device_id: string;
  bus_id: string;
  college_id: string;
  location: {
    latitude: number;
    longitude: number;
    altitude?: number;
    accuracy: number; // meters
  };
  speed: number; // km/h
  heading: number; // degrees (0-360)
  timestamp: string;
  additional_data: {
    ignition_status: "on" | "off";
    fuel_level?: number;
    battery_voltage?: number;
  };
}

interface RouteOptimizationRequest {
  origin: {
    latitude: number;
    longitude: number;
  };
  destination: {
    latitude: number;
    longitude: number;
  };
  waypoints: Array<{
    latitude: number;
    longitude: number;
    stop_duration: number; // minutes
  }>;
  optimization_criteria: "shortest_distance" | "fastest_time" | "least_traffic";
  departure_time?: string;
}

interface RouteOptimizationResponse {
  optimized_route: {
    total_distance: number; // km
    estimated_duration: number; // minutes
    waypoints_order: number[];
    polyline: string; // Encoded polyline
  };
  alternative_routes: Array<{
    distance: number;
    duration: number;
    polyline: string;
  }>;
}
```

**Webhook from GPS Device**:
```typescript
interface GPSDeviceWebhook {
  device_id: string;
  event_type: "location_update" | "geofence_enter" | "geofence_exit" | "speed_alert";
  location: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  metadata: Record<string, any>;
}
```

**Endpoint**: `POST /api/v1/transport/gps-update`

### 2.5 Payment Gateway Integration (Razorpay/Stripe)

**Purpose**: Collect transport fees, hostel fees, vendor payments

```typescript
interface PaymentInitiationRequest {
  provider: "razorpay" | "stripe";
  payment_type: "transport_fee" | "hostel_fee" | "vendor_payment";
  amount: number;
  currency: "INR" | "USD";
  customer: {
    customer_id: string;
    email: string;
    phone: string;
    name: string;
  };
  metadata: {
    college_id: string;
    student_id?: string;
    vendor_id?: string;
    reference_id: string;
    description: string;
  };
  callback_url: string;
  webhook_url: string;
}

interface PaymentResponse {
  payment_id: string;
  order_id: string;
  status: "created" | "initiated" | "processing";
  payment_url: string; // Redirect URL for payment
  expires_at: string;
}

interface PaymentWebhook {
  event: "payment.success" | "payment.failed" | "payment.refunded";
  payment_id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: "success" | "failed" | "refunded";
  customer_id: string;
  payment_method: string;
  timestamp: string;
  metadata: Record<string, any>;
}
```

**Webhook Endpoint**: `POST /api/v1/webhooks/payment`

**Signature Verification**: Required using provider's secret key

### 2.6 Biometric Integration (Attendance Devices)

**Purpose**: Staff attendance via fingerprint/face recognition

```typescript
interface BiometricAttendanceSync {
  device_id: string;
  device_location: string;
  college_id: string;
  attendance_records: Array<{
    employee_id: string;
    biometric_id: string;
    timestamp: string;
    attendance_type: "check_in" | "check_out";
    verification_method: "fingerprint" | "face" | "card";
    confidence_score: number; // 0-100
    device_temperature?: number;
  }>;
  sync_timestamp: string;
}

interface BiometricSyncResponse {
  records_processed: number;
  records_failed: number;
  conflicts: Array<{
    employee_id: string;
    reason: string;
    suggested_action: string;
  }>;
}
```

**Endpoint**: `POST /api/v1/attendance/biometric-sync`

**Sync Frequency**: Every 15 minutes or real-time push

## 3. Data Synchronization Contracts

### 3.1 Staff Data Sync

**Master Data Source**: College Admin Portal

**Sync Targets**: Principal, Faculty, Accountant portals

**Sync Strategy**: Event-driven + Daily batch reconciliation

```typescript
interface StaffDataSyncEvent {
  event_type: "staff.created" | "staff.updated" | "staff.deleted";
  event_id: string;
  timestamp: string;
  college_id: string;
  staff_data: {
    staff_id: string;
    employee_id: string;
    personal_info: object;
    employment_info: object;
    department_info: object;
    contact_info: object;
    bank_details: object; // For Accountant only
    teaching_assignments?: object; // For Faculty only
  };
  sync_targets: string[]; // Portal names to sync
}
```

**Conflict Resolution**: Last-write-wins with timestamp comparison

### 3.2 Infrastructure Asset Sync

**Master Data Source**: College Admin Portal

**Sync Targets**: Principal, Accountant portals

```typescript
interface AssetDataSync {
  sync_id: string;
  college_id: string;
  assets: Array<{
    asset_id: string;
    asset_code: string;
    asset_info: object;
    financial_info: object;
    maintenance_history: object[];
    current_status: string;
  }>;
  sync_timestamp: string;
}
```

### 3.3 Transport & Hostel Sync

**Master Data Source**: College Admin Portal

**Sync Targets**: Student Portal, Parent Portal

```typescript
interface TransportHostelSync {
  sync_type: "transport" | "hostel" | "both";
  college_id: string;
  transport_data?: {
    buses: object[];
    routes: object[];
    assignments: object[];
  };
  hostel_data?: {
    hostels: object[];
    rooms: object[];
    assignments: object[];
  };
  sync_timestamp: string;
}
```

## 4. Webhook Configuration

### 4.1 Outgoing Webhooks

**College Admin sends webhooks to**:

| Event | Target Portals | Retry Policy |
|-------|----------------|--------------|
| staff.created | Principal, Faculty, Accountant | 3 retries, exponential backoff |
| staff.updated | Principal, Faculty, Accountant | 3 retries, exponential backoff |
| staff.terminated | All portals | 5 retries, immediate + exponential |
| asset.created | Principal, Accountant | 3 retries |
| work_order.completed | Principal, Accountant | 2 retries |
| bus.delayed | Student, Parent | 5 retries, immediate |
| emergency.alert | All portals | 10 retries, immediate |

**Webhook Payload Format**:
```typescript
interface WebhookPayload {
  webhook_id: string;
  event: string;
  timestamp: string;
  college_id: string;
  data: object;
  signature: string; // HMAC-SHA256
}
```

### 4.2 Incoming Webhooks

**College Admin receives webhooks from**:

| Source | Event | Action |
|--------|-------|--------|
| Super Admin | college.config_updated | Update college settings |
| Super Admin | license.limit_changed | Update license limits |
| Accountant | budget.allocated | Update budget allocations |
| Accountant | payment.approved | Update vendor payment status |
| Principal | staff.performance_review | Store performance data |
| Payment Gateway | payment.success | Update fee payment status |
| GPS Device | location.update | Update bus location |
| Biometric Device | attendance.recorded | Sync attendance data |

**Webhook Endpoint**: `POST /api/v1/webhooks/{source}/{event_type}`

**Authentication**: HMAC signature verification + IP whitelist

## 5. API Rate Limits & Quotas

### 5.1 Rate Limiting

| Endpoint Type | Rate Limit | Quota |
|---------------|------------|-------|
| Read Operations | 1000 req/min | Unlimited |
| Write Operations | 100 req/min | 50,000/day |
| Bulk Operations | 10 req/min | 1,000/day |
| File Uploads | 50 req/min | 10 GB/day |
| Webhooks | 500 req/min | Unlimited |

### 5.2 Throttling Response

```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests. Please try again later.",
  "retry_after": 60,
  "limit": 1000,
  "remaining": 0,
  "reset_at": "2024-10-25T10:30:00Z"
}
```

**Response Headers**:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1729850400
Retry-After: 60
```

## 6. Error Handling & Retry Mechanisms

### 6.1 Error Response Format

```typescript
interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: object;
    trace_id: string;
    timestamp: string;
  };
  retry_strategy?: {
    retry_after: number;
    max_retries: number;
    backoff_type: "linear" | "exponential";
  };
}
```

### 6.2 Retry Strategy

**Exponential Backoff**:
```
Retry 1: After 1 second
Retry 2: After 2 seconds
Retry 3: After 4 seconds
Retry 4: After 8 seconds
Retry 5: After 16 seconds
```

**Transient Errors** (Retry automatically):
- 408 Request Timeout
- 429 Too Many Requests
- 500 Internal Server Error
- 502 Bad Gateway
- 503 Service Unavailable
- 504 Gateway Timeout

**Permanent Errors** (Do not retry):
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 422 Unprocessable Entity

## 7. Data Consistency & Idempotency

### 7.1 Idempotency Keys

All write operations support idempotency keys to prevent duplicate actions:

```typescript
interface IdempotentRequest {
  idempotency_key: string; // UUID v4
  request_data: object;
}
```

**Header**: `Idempotency-Key: {uuid}`

**Retention**: 24 hours

### 7.2 Transaction Coordination

**Two-Phase Commit** for critical operations:

```typescript
interface TransactionCoordination {
  transaction_id: string;
  phase: "prepare" | "commit" | "rollback";
  participants: Array<{
    portal: string;
    status: "ready" | "committed" | "aborted";
  }>;
  timeout: number; // seconds
}
```

## 8. Monitoring & Observability

### 8.1 Integration Health Checks

**Endpoint**: `GET /api/v1/integrations/health`

```typescript
interface IntegrationHealthStatus {
  status: "healthy" | "degraded" | "unhealthy";
  integrations: Array<{
    name: string;
    type: "portal" | "external_service";
    status: "up" | "down" | "slow";
    latency_ms: number;
    success_rate: number;
    last_check: string;
    error_message?: string;
  }>;
}
```

### 8.2 Integration Metrics

**Tracked Metrics**:
- Request success rate (per integration)
- Average response time
- Error rate by error type
- Webhook delivery success rate
- Data sync lag (time difference between source and target)
- Queue depth (for async operations)

## 9. Security Considerations

### 9.1 Authentication

- **OAuth 2.0** for portal-to-portal communication
- **API Keys** for external services
- **JWT tokens** with 1-hour expiration
- **Refresh tokens** with 7-day expiration

### 9.2 Authorization

- **Scope-based access control** for API endpoints
- **College-level data isolation**
- **Role-based permissions** verification

### 9.3 Data Encryption

- **TLS 1.3** for all API communications
- **Field-level encryption** for sensitive data (PII, financial info)
- **At-rest encryption** for stored webhook payloads

### 9.4 Webhook Security

- **HMAC-SHA256 signature** verification
- **IP whitelist** for webhook sources
- **Timestamp validation** (reject requests older than 5 minutes)
- **Replay attack prevention** using nonce

```typescript
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

## 10. Versioning & Backward Compatibility

### 10.1 API Versioning

**URL-based versioning**: `/api/v1/`, `/api/v2/`

**Version Support Policy**:
- Current version: Full support
- Previous version: Support for 6 months
- Deprecated versions: 3 months grace period

### 10.2 Breaking Changes

**Notification Process**:
1. Announce 3 months in advance
2. Provide migration guide
3. Offer dual version support during transition
4. Deprecate old version after transition period

---

*This integration contract document ensures seamless communication between the College Admin portal and all connected systems, maintaining data consistency and system reliability.*
