# Super Academics Portal - Integration Contracts

## Overview
Comprehensive integration contracts documentation for the Super Academics portal, defining how it integrates with other internal portals, external services, and data synchronization mechanisms.

---

## Table of Contents
1. [Internal Portal Integrations](#1-internal-portal-integrations)
2. [External Service Integrations](#2-external-service-integrations)
3. [Data Synchronization](#3-data-synchronization)
4. [Webhook Specifications](#4-webhook-specifications)
5. [Error Handling & Retry Logic](#5-error-handling--retry-logic)
6. [Rate Limiting & Throttling](#6-rate-limiting--throttling)
7. [Security & Authentication](#7-security--authentication)
8. [Monitoring & Alerting](#8-monitoring--alerting)

---

## 1. Internal Portal Integrations

### 1.1 Super Admin Portal

**Purpose**: Receive system-wide configurations, user management, and global settings.

**Integration Type**: REST API + Event Broadcasting

**Endpoints Consumed**:

```yaml
GET /api/v1/admin/colleges
  Description: Fetch all registered colleges
  Response:
    {
      "data": [
        {
          "id": 1,
          "name": "XYZ College of Engineering",
          "code": "XYZ001",
          "status": "active",
          "accreditation": {
            "type": "NAAC",
            "grade": "A+",
            "valid_until": "2026-12-31"
          }
        }
      ]
    }

GET /api/v1/admin/users/{userId}
  Description: Fetch user details for permission verification
  Response:
    {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com",
      "roles": ["super_academics_admin"],
      "permissions": ["view:curricula", "create:curricula"]
    }

POST /api/v1/admin/audit-logs
  Description: Send audit logs to centralized logging
  Payload:
    {
      "user_id": 123,
      "action": "curriculum.published",
      "entity_type": "curriculum",
      "entity_id": 45,
      "timestamp": "2024-12-01T10:30:00Z"
    }
```

**Events Published to Super Admin**:

```php
// Curriculum Published Event
Event::dispatch('super-academics.curriculum.published', [
    'curriculum_id' => $curriculum->id,
    'program_name' => $curriculum->program_name,
    'published_by' => auth()->id(),
    'colleges' => $curriculum->colleges->pluck('id'),
    'timestamp' => now(),
]);

// Compliance Issue Raised Event
Event::dispatch('super-academics.compliance.issue_raised', [
    'college_id' => $issue->college_id,
    'issue_type' => $issue->issue_type,
    'severity' => $issue->severity,
    'deadline' => $issue->resolution_deadline,
]);
```

**Data Flow**:
```
Super Admin → Super Academics: College list, user roles
Super Academics → Super Admin: Audit logs, compliance alerts
```

---

### 1.2 College Admin Portal

**Purpose**: Push curriculum adoptions, exam schedules to individual colleges.

**Integration Type**: REST API + Redis Pub/Sub

**Endpoints Provided to College Admin**:

```yaml
POST /api/v1/colleges/{collegeId}/curriculum/adopt
  Description: Notify college of new curriculum to adopt
  Headers:
    Authorization: Bearer {token}
    X-Super-Academics-Signature: {hmac_sha256_signature}
  Payload:
    {
      "curriculum_id": 12,
      "program_name": "Bachelor of Computer Science",
      "version": "2.0",
      "effective_from": "2025-01-01",
      "courses": [
        {
          "course_code": "CS101",
          "course_name": "Intro to Programming",
          "credits": 4
        }
      ]
    }
  Response:
    {
      "status": "accepted",
      "adoption_id": 456,
      "message": "Curriculum will be integrated within 24 hours"
    }

POST /api/v1/colleges/{collegeId}/exam-schedule/publish
  Description: Publish exam schedule to college
  Payload:
    {
      "schedule_id": 78,
      "academic_year": "2024-2025",
      "semester": 1,
      "exam_type": "end_term",
      "exams": [
        {
          "course_code": "CS101",
          "exam_date": "2024-12-05",
          "start_time": "10:00",
          "duration_minutes": 180
        }
      ]
    }
```

**Webhook Callbacks from College Admin**:

```yaml
POST {COLLEGE_WEBHOOK_URL}/curriculum-adoption-status
  Description: College confirms curriculum adoption
  Payload:
    {
      "curriculum_id": 12,
      "college_id": 5,
      "status": "adopted",
      "adopted_at": "2024-12-01T14:00:00Z",
      "customizations": {
        "elective_groups_modified": true,
        "credit_distribution_adjusted": false
      }
    }

POST {COLLEGE_WEBHOOK_URL}/exam-registration-count
  Description: College reports exam registration numbers
  Payload:
    {
      "schedule_id": 78,
      "college_id": 5,
      "total_registrations": 450,
      "breakdown_by_program": {
        "Bachelor of CS": 200,
        "Bachelor of IT": 150,
        "Bachelor of Electronics": 100
      }
    }
```

---

### 1.3 Principal Portal

**Purpose**: Receive college-specific academic analytics and compliance reports.

**Integration Type**: REST API

**Endpoints Consumed by Principals**:

```yaml
GET /api/v1/super-academics/colleges/{collegeId}/performance
  Description: Get college-specific performance metrics
  Query Parameters:
    academic_year: 2024-2025
    semester: 1
  Response:
    {
      "college_id": 5,
      "college_name": "ABC Engineering College",
      "metrics": {
        "pass_percentage": 87.5,
        "avg_gpa": 8.2,
        "dropout_rate": 2.3,
        "rank_in_network": 12,
        "total_colleges": 50
      },
      "compliance_score": 94.5,
      "pending_approvals": 3
    }

GET /api/v1/super-academics/colleges/{collegeId}/curriculum-status
  Description: Check adoption status of all curricula
  Response:
    {
      "curricula": [
        {
          "curriculum_id": 12,
          "program_name": "Bachelor of CS",
          "adoption_status": "active",
          "adopted_on": "2024-08-15",
          "compliance_level": "full"
        },
        {
          "curriculum_id": 15,
          "program_name": "Bachelor of IT",
          "adoption_status": "pending",
          "pending_since": "2024-11-01",
          "compliance_level": "partial"
        }
      ]
    }
```

---

### 1.4 Faculty Portal

**Purpose**: Provide exam schedules and question bank access to faculty.

**Integration Type**: REST API + GraphQL (optional)

**Endpoints Provided**:

```yaml
GET /api/v1/super-academics/faculty/exam-schedules
  Description: Get upcoming exam schedules for faculty's courses
  Headers:
    Authorization: Bearer {faculty_token}
  Query Parameters:
    college_id: 5
    faculty_id: 234
  Response:
    {
      "schedules": [
        {
          "exam_id": 890,
          "course_code": "CS301",
          "course_name": "Database Systems",
          "exam_date": "2024-12-08",
          "start_time": "14:00",
          "duration_minutes": 180,
          "total_marks": 100
        }
      ]
    }

GET /api/v1/super-academics/question-bank/courses/{courseId}
  Description: Access question bank for specific course
  Query Parameters:
    difficulty: medium
    limit: 20
  Response:
    {
      "questions": [
        {
          "id": 1234,
          "question_text": "Explain normalization in DBMS",
          "question_type": "long_answer",
          "difficulty_level": "medium",
          "marks": 10,
          "usage_count": 5
        }
      ]
    }
```

---

### 1.5 Student Portal

**Purpose**: Display exam schedules and results to students.

**Integration Type**: REST API

**Endpoints Provided**:

```yaml
GET /api/v1/super-academics/students/{studentId}/exam-schedule
  Description: Get personalized exam schedule for student
  Response:
    {
      "student_id": 5678,
      "academic_year": "2024-2025",
      "semester": 1,
      "exams": [
        {
          "course_code": "CS101",
          "course_name": "Intro to Programming",
          "exam_date": "2024-12-05",
          "start_time": "10:00",
          "venue": "Main Hall",
          "seat_number": "A-45"
        }
      ]
    }

GET /api/v1/super-academics/students/{studentId}/results
  Description: Fetch exam results
  Query Parameters:
    academic_year: 2024-2025
    semester: 1
  Response:
    {
      "results": [
        {
          "course_code": "CS101",
          "marks_obtained": 85,
          "total_marks": 100,
          "grade": "A",
          "status": "pass"
        }
      ],
      "cgpa": 8.5
    }
```

---

## 2. External Service Integrations

### 2.1 Email Service (SendGrid)

**Purpose**: Send notifications about curriculum updates, exam schedules, compliance alerts.

**API Configuration**:

```php
// config/mail.php
'sendgrid' => [
    'api_key' => env('SENDGRID_API_KEY'),
    'from' => [
        'address' => 'noreply@superacademics.edu',
        'name' => 'Super Academics Portal',
    ],
],
```

**Email Templates**:

```php
// Curriculum Published Notification
Mail::to($college->principals)
    ->send(new CurriculumPublishedMail($curriculum, $college));

// Compliance Issue Alert
Mail::to($complianceOfficers)
    ->send(new ComplianceIssueMail($issue, $college));

// Exam Schedule Released
Mail::to($students)
    ->send(new ExamScheduleMail($schedule));
```

**Rate Limits**:
- 100 emails/second
- Daily limit: 100,000 emails

---

### 2.2 SMS Gateway (Twilio)

**Purpose**: Send urgent notifications (exam postponements, compliance deadlines).

**API Configuration**:

```php
// config/services.php
'twilio' => [
    'sid' => env('TWILIO_SID'),
    'token' => env('TWILIO_AUTH_TOKEN'),
    'from' => env('TWILIO_PHONE_NUMBER'),
],
```

**SMS Sending**:

```php
use Twilio\Rest\Client;

$client = new Client(config('services.twilio.sid'), config('services.twilio.token'));

$client->messages->create(
    '+919876543210',
    [
        'from' => config('services.twilio.from'),
        'body' => "URGENT: Exam schedule for CS101 has been rescheduled to 10-Dec-2024.",
    ]
);
```

**Rate Limits**:
- 10 SMS/second
- Cost optimization: Only for critical alerts

---

### 2.3 Cloud Storage (AWS S3)

**Purpose**: Store large files (curriculum PDFs, exam papers, reports).

**API Configuration**:

```php
// config/filesystems.php
's3' => [
    'driver' => 's3',
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    'bucket' => env('AWS_BUCKET', 'super-academics-storage'),
],
```

**File Upload**:

```php
use Illuminate\Support\Facades\Storage;

// Upload curriculum PDF
$path = Storage::disk('s3')->putFile(
    'curricula',
    $request->file('curriculum_pdf'),
    'public'
);

// Generate signed URL (expires in 1 hour)
$url = Storage::disk('s3')->temporaryUrl(
    $path,
    now()->addHour()
);
```

**Lifecycle Policy**:
- Standard storage: First 90 days
- Glacier: After 90 days
- Delete: After 7 years (compliance retention)

---

### 2.4 Reporting Service (Metabase / Power BI)

**Purpose**: Generate advanced analytics and visual reports.

**API Integration**:

```php
// Export data to Metabase
public function exportToMetabase()
{
    $data = DB::table('performance_metrics')
        ->select(
            'college_id',
            'academic_year',
            'pass_percentage',
            'avg_gpa',
            'dropout_rate'
        )
        ->get();

    Http::post('https://metabase.example.com/api/dataset', [
        'database_id' => 5,
        'query' => [
            'type' => 'native',
            'native' => [
                'query' => 'INSERT INTO performance_data VALUES ...',
            ],
        ],
        'data' => $data,
    ]);
}
```

**Scheduled Reports**:
- Daily: College performance summary
- Weekly: Curriculum adoption trends
- Monthly: Compliance dashboard
- Quarterly: Accreditation reports

---

### 2.5 Elasticsearch (Analytics & Search)

**Purpose**: Full-text search for curricula, courses, question bank.

**API Configuration**:

```php
// config/elasticsearch.php
'hosts' => [
    [
        'host' => env('ELASTICSEARCH_HOST', 'localhost'),
        'port' => env('ELASTICSEARCH_PORT', 9200),
        'scheme' => 'https',
        'user' => env('ELASTICSEARCH_USER'),
        'pass' => env('ELASTICSEARCH_PASSWORD'),
    ],
],
```

**Indexing Curriculum**:

```php
use Elasticsearch\ClientBuilder;

$client = ClientBuilder::create()->setHosts(config('elasticsearch.hosts'))->build();

$params = [
    'index' => 'curricula',
    'id' => $curriculum->id,
    'body' => [
        'program_name' => $curriculum->program_name,
        'degree_type' => $curriculum->degree_type,
        'courses' => $curriculum->courses->map(fn($course) => [
            'course_code' => $course->course_code,
            'course_name' => $course->course_name,
            'credits' => $course->credits,
        ]),
    ],
];

$client->index($params);
```

**Search Query**:

```php
$params = [
    'index' => 'curricula',
    'body' => [
        'query' => [
            'multi_match' => [
                'query' => 'computer science',
                'fields' => ['program_name^3', 'courses.course_name'],
            ],
        ],
    ],
];

$results = $client->search($params);
```

---

## 3. Data Synchronization

### 3.1 Curriculum Sync to Colleges

**Sync Trigger**: When curriculum is published

**Sync Method**: REST API + Background Job

**Process**:

```php
// Job: SyncCurriculumToColleges
public function handle()
{
    foreach ($this->collegeIds as $collegeId) {
        $college = College::find($collegeId);

        // Send curriculum data to college
        $response = Http::withToken($college->api_token)
            ->timeout(30)
            ->retry(3, 1000)
            ->post("{$college->api_endpoint}/curriculum/adopt", [
                'curriculum_id' => $this->curriculum->id,
                'program_name' => $this->curriculum->program_name,
                'courses' => $this->curriculum->courses->toArray(),
                'effective_from' => $this->curriculum->effective_from,
            ]);

        if ($response->failed()) {
            Log::error("Failed to sync curriculum to college {$collegeId}");
            // Retry logic or alert
        }
    }
}
```

**Sync Frequency**: Real-time (on publish)

**Conflict Resolution**: Last Write Wins (LWW)

---

### 3.2 Exam Results Aggregation

**Sync Trigger**: When college uploads exam results

**Sync Method**: Webhook + Database Write

**Process**:

```php
// Webhook endpoint
Route::post('/webhooks/college/{collegeId}/exam-results', function (Request $request, int $collegeId) {
    $validated = $request->validate([
        'exam_id' => 'required|exists:exams,id',
        'results' => 'required|array',
        'results.*.student_id' => 'required|exists:users,id',
        'results.*.marks_obtained' => 'required|numeric|min:0',
    ]);

    foreach ($validated['results'] as $result) {
        ExamResult::updateOrCreate(
            [
                'exam_id' => $validated['exam_id'],
                'student_id' => $result['student_id'],
                'college_id' => $collegeId,
            ],
            [
                'marks_obtained' => $result['marks_obtained'],
                'status' => 'completed',
                'evaluated_at' => now(),
            ]
        );
    }

    // Trigger analytics recalculation
    dispatch(new RecalculateCollegePerformance($collegeId));

    return response()->json(['message' => 'Results synced successfully']);
});
```

**Sync Frequency**: Daily (batch upload)

**Validation**: Results must match enrolled students

---

### 3.3 Compliance Data Collection

**Sync Trigger**: Weekly scheduled job

**Sync Method**: Pull data from colleges

**Process**:

```php
// Scheduled job: CollectComplianceData
protected $schedule = '0 2 * * 0'; // Every Sunday at 2 AM

public function handle()
{
    $colleges = College::all();

    foreach ($colleges as $college) {
        $complianceData = Http::withToken($college->api_token)
            ->get("{$college->api_endpoint}/compliance/report")
            ->json();

        ComplianceIssue::updateOrCreate(
            [
                'college_id' => $college->id,
                'issue_type' => 'weekly_check',
            ],
            [
                'faculty_count' => $complianceData['faculty_count'],
                'student_teacher_ratio' => $complianceData['student_teacher_ratio'],
                'infrastructure_score' => $complianceData['infrastructure_score'],
                'status' => $this->evaluateCompliance($complianceData),
            ]
        );
    }
}
```

---

## 4. Webhook Specifications

### 4.1 Webhook Registration

**Endpoint**: `POST /api/v1/webhooks/register`

**Payload**:
```json
{
  "college_id": 5,
  "events": ["curriculum.adopted", "exam.results_uploaded"],
  "callback_url": "https://college.example.com/webhooks/super-academics",
  "secret": "webhook_secret_key_123"
}
```

**Response**:
```json
{
  "webhook_id": "wh_abc123xyz",
  "status": "active",
  "registered_at": "2024-12-01T10:00:00Z"
}
```

### 4.2 Webhook Payload Format

**Event**: `curriculum.published`

```json
{
  "event": "curriculum.published",
  "webhook_id": "wh_abc123xyz",
  "timestamp": "2024-12-01T10:30:00Z",
  "data": {
    "curriculum_id": 12,
    "program_name": "Bachelor of Computer Science",
    "version": "2.0",
    "effective_from": "2025-01-01",
    "colleges": [5, 7, 12]
  },
  "signature": "sha256=abcdef123456..."
}
```

**Signature Verification**:

```php
$signature = hash_hmac('sha256', $payload, $webhookSecret);

if (!hash_equals($signature, $receivedSignature)) {
    abort(403, 'Invalid webhook signature');
}
```

### 4.3 Webhook Retry Policy

**Retry Schedule**:
- Attempt 1: Immediate
- Attempt 2: After 1 minute
- Attempt 3: After 5 minutes
- Attempt 4: After 15 minutes
- Attempt 5: After 1 hour

**Failure Handling**: After 5 failed attempts, webhook is marked as failed and admin is notified.

---

## 5. Error Handling & Retry Logic

### 5.1 HTTP Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 400 | Bad Request | Fix payload and retry |
| 401 | Unauthorized | Refresh token and retry |
| 403 | Forbidden | Check permissions |
| 404 | Not Found | Verify resource exists |
| 429 | Rate Limit Exceeded | Wait and retry with exponential backoff |
| 500 | Server Error | Retry up to 3 times |
| 503 | Service Unavailable | Retry with exponential backoff |

### 5.2 Exponential Backoff

```php
use Illuminate\Support\Facades\Http;

$response = Http::retry(3, 100, function ($exception, $request) {
    return $exception instanceof ConnectionException;
})
->timeout(30)
->post($url, $data);
```

### 5.3 Circuit Breaker Pattern

```php
use Illuminate\Support\Facades\Cache;

$circuitKey = "circuit_breaker_{$collegeId}";

if (Cache::get($circuitKey, 0) >= 5) {
    // Circuit open - too many failures
    throw new CircuitBreakerException("Service temporarily unavailable");
}

try {
    $response = Http::post($url, $data);
    
    if ($response->successful()) {
        Cache::forget($circuitKey); // Reset counter
    }
} catch (Exception $e) {
    Cache::increment($circuitKey);
    Cache::put($circuitKey, Cache::get($circuitKey), now()->addMinutes(5));
    throw $e;
}
```

---

## 6. Rate Limiting & Throttling

### 6.1 Outbound API Rate Limits

```php
// config/integration.php
'rate_limits' => [
    'sendgrid' => ['limit' => 100, 'per' => 'second'],
    'twilio' => ['limit' => 10, 'per' => 'second'],
    'colleges' => ['limit' => 50, 'per' => 'minute'],
],
```

### 6.2 Inbound Webhook Rate Limits

```php
// Apply to webhook routes
Route::middleware('throttle:100,1')->group(function () {
    Route::post('/webhooks/college/{id}/exam-results', ...);
});
```

---

## 7. Security & Authentication

### 7.1 API Token Authentication

```php
// Generate college-specific API token
$college->api_token = Str::random(64);
$college->save();

// Use token in requests
Http::withToken($college->api_token)->post(...);
```

### 7.2 HMAC Signature Verification

```php
$payload = $request->getContent();
$signature = $request->header('X-Super-Academics-Signature');

$expectedSignature = hash_hmac('sha256', $payload, $college->webhook_secret);

if (!hash_equals($expectedSignature, $signature)) {
    abort(403, 'Invalid signature');
}
```

---

## 8. Monitoring & Alerting

### 8.1 Integration Health Checks

```php
// Scheduled job: CheckIntegrationHealth
public function handle()
{
    $integrations = [
        'sendgrid' => fn() => Http::get('https://api.sendgrid.com/v3/health'),
        'twilio' => fn() => Http::get('https://status.twilio.com/api/v2/status.json'),
        's3' => fn() => Storage::disk('s3')->exists('health-check.txt'),
    ];

    foreach ($integrations as $name => $check) {
        try {
            $result = $check();
            Log::info("Integration {$name} is healthy");
        } catch (Exception $e) {
            Log::error("Integration {$name} failed: {$e->getMessage()}");
            // Send alert
        }
    }
}
```

### 8.2 Failed Sync Alerts

```slack
Integration Alert: Failed to sync curriculum #12 to College #5
Attempts: 5/5
Last Error: Connection timeout after 30 seconds
Action Required: Check college API endpoint status
```

---

*This integration contracts documentation ensures seamless data flow between Super Academics portal and all connected systems with robust error handling and monitoring.*
