# Super Non-Teaching Manager Portal - Integration Contracts

**Integration Strategy**: Event-Driven + Scheduled Sync  
**Message Format**: JSON  
**Transport**: HTTP REST APIs + Webhooks

---

## Integration Architecture

```
┌──────────────────────────────────────────────────────────┐
│         Super Non-Teaching Manager Portal                │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐       │
│  │ Employee   │  │ Attendance │  │ Leave      │       │
│  │ Service    │  │ Service    │  │ Service    │       │
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘       │
│        │               │               │              │
│        └───────────────┼───────────────┘              │
│                        │                              │
└────────────────────────┼──────────────────────────────┘
                         │
      ┌──────────────────┼──────────────────┐
      │                  │                  │
      ▼                  ▼                  ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Payroll   │  │  Principal  │  │ Super Admin │
│   Portal    │  │   Portal    │  │   Portal    │
└─────────────┘  └─────────────┘  └─────────────┘
      │
      ▼
┌─────────────┐
│  Biometric  │
│   Devices   │
└─────────────┘
```

---

## 1. Internal Portal Integrations

### 1.1 Super Admin Portal

**Purpose**: Master data sync, college/employee management  
**Direction**: Bidirectional

#### Endpoints

##### Get College List
```http
GET /api/v1/colleges
Authorization: Bearer {api_key}

Response:
{
  "data": [
    {
      "id": 1,
      "name": "ABC Engineering College",
      "code": "ABC-ENG",
      "is_active": true
    }
  ]
}
```

##### Get Employee by College
```http
GET /api/v1/employees?college_id=1
Authorization: Bearer {api_key}

Response:
{
  "data": [
    {
      "id": 123,
      "employee_code": "EMP-00123",
      "name": "John Doe",
      "designation": "Clerk",
      "status": "active"
    }
  ],
  "pagination": {
    "total": 150,
    "per_page": 20,
    "current_page": 1
  }
}
```

##### Sync Employee Status Updates
```http
POST /api/v1/employees/{id}/status
Authorization: Bearer {api_key}
Content-Type: application/json

{
  "status": "resigned",
  "effective_date": "2024-03-31",
  "reason": "Personal reasons"
}

Response: 200 OK
```

**Sync Frequency**: Real-time for status changes, Daily batch for full sync at 2 AM

---

### 1.2 Principal Portal

**Purpose**: Leave approvals, performance reviews  
**Direction**: Bidirectional

#### Endpoints

##### Get Pending Leave Approvals
```http
GET /api/v1/leaves/pending?college_id=1
Authorization: Bearer {api_key}

Response:
{
  "data": [
    {
      "id": 456,
      "employee": {
        "id": 123,
        "name": "John Doe",
        "employee_code": "EMP-00123"
      },
      "leave_type": "casual",
      "from_date": "2024-03-15",
      "to_date": "2024-03-17",
      "days": 3,
      "reason": "Family function",
      "balance": {
        "available": 9,
        "total": 12
      }
    }
  ]
}
```

##### Approve/Reject Leave
```http
POST /api/v1/leaves/{id}/approve
Authorization: Bearer {api_key}
Content-Type: application/json

{
  "action": "approve", // or "reject"
  "comments": "Approved for the requested dates",
  "approver_id": 5
}

Response: 200 OK
{
  "message": "Leave approved successfully",
  "leave": {
    "id": 456,
    "status": "approved",
    "approved_at": "2024-03-10T10:30:00Z"
  }
}
```

##### Get Performance Appraisals for Review
```http
GET /api/v1/appraisals?college_id=1&status=pending_manager_review
Authorization: Bearer {api_key}

Response:
{
  "data": [
    {
      "id": 789,
      "employee": {
        "id": 123,
        "name": "John Doe",
        "designation": "Clerk"
      },
      "appraisal_year": 2024,
      "self_rating": 4.2,
      "self_comments": "Achieved all targets...",
      "goals": [...]
    }
  ]
}
```

**Sync Frequency**: Real-time via webhooks for pending approvals, Hourly sync for updates

---

### 1.3 College Admin Portal

**Purpose**: Local HR operations, attendance monitoring  
**Direction**: Bidirectional

#### Endpoints

##### Get College Employee Attendance
```http
GET /api/v1/attendance?college_id=1&date=2024-03-10
Authorization: Bearer {api_key}

Response:
{
  "data": {
    "date": "2024-03-10",
    "college_id": 1,
    "summary": {
      "total_employees": 150,
      "present": 142,
      "absent": 5,
      "late": 3,
      "on_leave": 8
    },
    "records": [
      {
        "employee_id": 123,
        "employee_code": "EMP-00123",
        "name": "John Doe",
        "punch_in": "08:55:00",
        "punch_out": "17:10:00",
        "work_hours": 8.25,
        "status": "present"
      }
    ]
  }
}
```

##### Mark Manual Attendance
```http
POST /api/v1/attendance/mark
Authorization: Bearer {api_key}
Content-Type: application/json

{
  "employee_id": 123,
  "attendance_date": "2024-03-10",
  "status": "present",
  "punch_in": "09:00:00",
  "punch_out": "17:00:00",
  "reason": "Forgot to punch, verified by security"
}

Response: 201 Created
```

**Sync Frequency**: Real-time for attendance marking, Daily muster roll sync at 5 AM

---

### 1.4 Payroll Portal

**Purpose**: Salary processing, attendance data feed  
**Direction**: Bidirectional (mostly push from NT Manager)

#### Endpoints

##### Sync Employee Master Data
```http
POST /api/v1/payroll/employees/sync
Authorization: Bearer {api_key}
Content-Type: application/json

{
  "employees": [
    {
      "employee_code": "EMP-00123",
      "name": "John Doe",
      "college_id": 1,
      "designation": "Clerk",
      "salary": 30000.00,
      "bank_account": "123456789",
      "bank_ifsc": "SBIN0001234",
      "status": "active",
      "date_of_joining": "2023-01-15"
    }
  ],
  "sync_date": "2024-03-10"
}

Response: 200 OK
{
  "synced_count": 150,
  "failed_count": 0,
  "errors": []
}
```

##### Sync Attendance Data for Salary Processing
```http
POST /api/v1/payroll/attendance/sync
Authorization: Bearer {api_key}
Content-Type: application/json

{
  "month": "2024-03",
  "college_id": 1,
  "attendance_data": [
    {
      "employee_code": "EMP-00123",
      "present_days": 25,
      "absent_days": 1,
      "late_days": 2,
      "leave_days": 2,
      "overtime_hours": 5.5,
      "late_deduction": 100.00 // ₹50 × 2 late days
    }
  ]
}

Response: 200 OK
```

##### Sync Leave Data
```http
POST /api/v1/payroll/leaves/sync
Authorization: Bearer {api_key}
Content-Type: application/json

{
  "month": "2024-03",
  "leave_data": [
    {
      "employee_code": "EMP-00123",
      "approved_leaves": [
        {
          "leave_type": "casual",
          "from_date": "2024-03-15",
          "to_date": "2024-03-17",
          "days": 3
        }
      ]
    }
  ]
}

Response: 200 OK
```

**Sync Frequency**:  
- Employee master: Daily at 2 AM  
- Attendance data: Daily at 5 AM (previous day)  
- Leave data: Monthly on 1st at 1 AM (before payroll processing)

---

### 1.5 BitFlow Admin Portal

**Purpose**: Master data (designations, departments)  
**Direction**: Pull from BitFlow Admin

#### Endpoints

##### Get Designations
```http
GET /api/v1/master-data/designations
Authorization: Bearer {api_key}

Response:
{
  "data": [
    {
      "id": 1,
      "code": "CLK",
      "name": "Clerk",
      "category": "administrative",
      "is_active": true
    },
    {
      "id": 2,
      "code": "LAB-ASST",
      "name": "Lab Assistant",
      "category": "technical",
      "is_active": true
    }
  ]
}
```

##### Get Departments
```http
GET /api/v1/master-data/departments
Authorization: Bearer {api_key}

Response:
{
  "data": [
    {
      "id": 1,
      "code": "ADMIN",
      "name": "Administration",
      "is_active": true
    },
    {
      "id": 2,
      "code": "MAINT",
      "name": "Maintenance",
      "is_active": true
    }
  ]
}
```

**Sync Frequency**: Weekly on Sunday at 10 AM

---

## 2. External Service Integrations

### 2.1 Biometric Device Integration (ZKTeco SDK)

**Protocol**: TCP Socket + HTTP API  
**Purpose**: Real-time attendance capture

#### Device Connection

```php
// ZKTeco SDK Integration
use ZKTeco\Devices\Attendance;

$device = new Attendance([
    'ip' => '192.168.1.100',
    'port' => 4370,
    'device_id' => 'DEVICE-001',
    'password' => env('BIOMETRIC_DEVICE_PASSWORD'),
]);

// Connect
$device->connect();

// Get attendance logs
$logs = $device->getAttendance();

foreach ($logs as $log) {
    AttendanceService::recordPunch(
        employee_id: $log['employee_id'],
        punch_type: $log['punch_type'], // in/out
        timestamp: $log['timestamp'],
        device_id: 'DEVICE-001'
    );
}

$device->disconnect();
```

#### Webhook for Real-Time Punch

```http
POST /api/v1/biometric/webhook
Content-Type: application/json
X-Device-Signature: {hmac_signature}

{
  "device_id": "DEVICE-001",
  "employee_id": 123,
  "punch_time": "2024-03-10T09:05:30Z",
  "punch_type": "in",
  "biometric_template_hash": "abc123...", // One-way hash
  "nonce": "xyz789",
  "timestamp": 1710067530
}

Response: 200 OK
{
  "message": "Punch recorded",
  "attendance_id": 456
}
```

**Security**:
- HMAC-SHA256 signature validation
- Timestamp check (reject if >30s old)
- Nonce tracking (prevent replay attacks)
- Device IP whitelisting

**Sync Strategy**:
- Real-time: Webhook on every punch (primary)
- Batch: Poll device every 5 minutes (fallback for offline devices)
- Reconciliation: Daily at 6 AM to catch missed punches

---

### 2.2 Email Service (SMTP / SendGrid)

**Purpose**: Offer letters, leave notifications, training invitations

#### Send Offer Letter

```php
Mail::to($candidate->email)
    ->send(new OfferLetterMail($application, $offerDetails));
```

**Email Template**:
```html
Subject: Job Offer - {{ $position_title }} at {{ $college_name }}

Dear {{ $candidate_name }},

We are pleased to offer you the position of {{ $position_title }} 
at {{ $college_name }}.

Salary: ₹{{ $salary }}
Joining Date: {{ $joining_date }}

Please find the detailed offer letter attached.

Best regards,
HR Department
```

#### Send Leave Approval Notification

```php
Mail::to($employee->email)
    ->send(new LeaveApprovedMail($leaveApplication));
```

**Sync Frequency**: Real-time (triggered by events)

---

### 2.3 SMS Gateway (Twilio / MSG91)

**Purpose**: Attendance alerts, leave status, interview reminders

#### Send Late Mark Alert

```php
use Twilio\Rest\Client;

$client = new Client(env('TWILIO_SID'), env('TWILIO_TOKEN'));

$client->messages->create(
    $employee->phone,
    [
        'from' => env('TWILIO_PHONE'),
        'body' => "Dear {$employee->name}, you are marked late today at {$punchInTime}. Please regularize if needed."
    ]
);
```

#### Send Interview Reminder

```http
POST https://api.msg91.com/api/v5/flow/
Headers:
  authkey: {api_key}
Content-Type: application/json

{
  "flow_id": "interview_reminder",
  "sender": "COLLEG",
  "mobiles": "919876543210",
  "variable1": "John Doe",
  "variable2": "15-03-2024",
  "variable3": "10:00 AM"
}

Template:
"Dear {{1}}, your interview is scheduled for {{2}} at {{3}}. Please be on time."
```

**Rate Limiting**: 50 SMS/minute  
**Character Limit**: 160 chars (single SMS)

---

### 2.4 Background Verification Service

**Purpose**: Pre-employment screening

#### Initiate Verification

```http
POST https://api.verificationprovider.com/v1/verification
Authorization: Bearer {api_key}
Content-Type: application/json

{
  "candidate": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "aadhar": "123456789012"
  },
  "checks": [
    "education",
    "employment",
    "court_records",
    "credit_check"
  ],
  "callback_url": "https://college.edu/api/webhooks/bgv-status"
}

Response: 201 Created
{
  "verification_id": "VER-12345",
  "status": "in_progress",
  "estimated_completion": "2024-03-20"
}
```

#### Webhook: Verification Status Update

```http
POST /api/webhooks/bgv-status
Content-Type: application/json
X-Signature: {hmac_signature}

{
  "verification_id": "VER-12345",
  "candidate_email": "john@example.com",
  "status": "completed",
  "checks": {
    "education": {
      "status": "verified",
      "details": "MBA from XYZ University - Verified"
    },
    "employment": {
      "status": "verified",
      "details": "Previous employer confirmed"
    },
    "court_records": {
      "status": "clear"
    },
    "credit_check": {
      "status": "good",
      "score": 750
    }
  },
  "completed_at": "2024-03-18T15:30:00Z"
}

Response: 200 OK
```

**Verification Timeline**: 5-7 business days

---

### 2.5 Government Compliance Systems

**Purpose**: PF, ESI reporting

#### PF Monthly Return Sync

```http
POST https://unifiedportal-mem.epfindia.gov.in/api/ecr
Headers:
  Authorization: Bearer {epf_token}
Content-Type: application/json

{
  "establishment_id": "MHPUN12345",
  "month": "2024-03",
  "employees": [
    {
      "uan": "123456789012",
      "name": "John Doe",
      "gross_wages": 30000,
      "epf_wages": 15000,
      "eps_wages": 15000,
      "edli_wages": 15000,
      "employee_contribution": 1800,
      "employer_contribution": 1800,
      "pension_contribution": 1250
    }
  ]
}

Response: 200 OK
```

**Sync Frequency**: Monthly on 15th

---

## 3. Data Synchronization Strategies

### 3.1 Real-Time Sync (Webhooks)

**Use Cases**: Biometric punch, leave approvals, status changes

**Implementation**:
```php
// Event listener
Event::listen(EmployeeTransferred::class, function ($event) {
    Http::withToken(env('PAYROLL_API_KEY'))
        ->post('https://payroll.college.edu/api/webhooks/employee-transfer', [
            'employee_code' => $event->employee->employee_code,
            'from_college_id' => $event->fromCollegeId,
            'to_college_id' => $event->toCollegeId,
            'effective_date' => $event->effectiveDate,
        ]);
});
```

### 3.2 Scheduled Batch Sync

**Use Cases**: Employee master data, attendance summary, leave balances

**Cron Jobs**:
```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    // Employee master sync (daily at 2 AM)
    $schedule->command('sync:employees-to-payroll')
        ->dailyAt('02:00')
        ->withoutOverlapping();
    
    // Attendance data sync (daily at 5 AM)
    $schedule->command('sync:attendance-to-payroll')
        ->dailyAt('05:00')
        ->withoutOverlapping();
    
    // Biometric device polling (every 5 minutes)
    $schedule->command('sync:biometric-devices')
        ->everyFiveMinutes();
    
    // Leave balance sync (monthly on 1st at 1 AM)
    $schedule->command('sync:leave-balances-to-payroll')
        ->monthlyOn(1, '01:00');
}
```

### 3.3 On-Demand Sync

**Use Cases**: Manual data refresh, error recovery

```php
// Artisan command
php artisan sync:employees --college-id=1 --force

// API endpoint
POST /api/v1/sync/trigger
{
  "sync_type": "employees",
  "college_id": 1,
  "force": true
}
```

---

## 4. Error Handling & Retry Policy

### Retry Strategy

```php
// config/queue.php
'connections' => [
    'redis' => [
        'driver' => 'redis',
        'connection' => 'default',
        'queue' => 'default',
        'retry_after' => 90,
        'block_for' => null,
    ],
],

// Job with retry
class SyncEmployeeToPayroll implements ShouldQueue
{
    public $tries = 5;
    public $backoff = [60, 300, 900, 3600]; // 1min, 5min, 15min, 1hr
    
    public function handle()
    {
        // Sync logic with exponential backoff
    }
    
    public function failed(Throwable $exception)
    {
        // Log to dead letter queue
        Log::error('Employee sync failed', [
            'employee_id' => $this->employeeId,
            'exception' => $exception->getMessage(),
        ]);
        
        // Send alert
        Notification::route('mail', 'devops@college.edu')
            ->notify(new SyncFailedNotification($this->employeeId));
    }
}
```

### Circuit Breaker

```php
use Illuminate\Support\Facades\Cache;

class CircuitBreaker
{
    private const FAILURE_THRESHOLD = 5;
    private const TIMEOUT = 300; // 5 minutes
    
    public function call(callable $callback, string $serviceName)
    {
        $failureCount = Cache::get("circuit_breaker:{$serviceName}:failures", 0);
        
        if ($failureCount >= self::FAILURE_THRESHOLD) {
            throw new ServiceUnavailableException("{$serviceName} circuit breaker open");
        }
        
        try {
            $result = $callback();
            Cache::forget("circuit_breaker:{$serviceName}:failures");
            return $result;
        } catch (\Exception $e) {
            Cache::increment("circuit_breaker:{$serviceName}:failures");
            Cache::put("circuit_breaker:{$serviceName}:opened_at", now(), self::TIMEOUT);
            throw $e;
        }
    }
}
```

---

## 5. Monitoring & Alerting

### Integration Health Checks

```php
// Health check endpoint
GET /api/v1/integrations/health

Response:
{
  "status": "healthy",
  "services": {
    "payroll": {
      "status": "up",
      "last_sync": "2024-03-10T05:00:00Z",
      "latency_ms": 250
    },
    "biometric_devices": {
      "status": "up",
      "devices_online": 12,
      "devices_offline": 1,
      "last_poll": "2024-03-10T10:05:00Z"
    },
    "email": {
      "status": "up",
      "queue_size": 5
    },
    "sms": {
      "status": "degraded",
      "rate_limited": true
    }
  }
}
```

### Alerts

- **Biometric Device Offline**: Alert if device offline >30 minutes
- **Sync Failure**: Alert after 3 consecutive failures
- **Queue Backlog**: Alert if queue depth >1000
- **API Rate Limit**: Alert on 429 responses

---

*Complete integration contracts for Super Non-Teaching Manager Portal with 5 internal portals, 5 external services, and comprehensive sync strategies.*
