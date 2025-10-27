# Super Admin Portal - Integration Contracts

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Overview

The Super Admin Portal integrates with other portals through:
- **Events** (publish/subscribe)
- **Webhooks** (HTTP callbacks)
- **Shared Database** (multi-tenant schema)
- **API Contracts** (RESTful endpoints)

---

## 1. Events Published

### 1.1 Academic Calendar Events

#### AcademicYearCreated
```json
{
  "event": "academic_year.created",
  "timestamp": "2025-10-25T10:30:00Z",
  "data": {
    "id": "uuid",
    "university_id": "uuid",
    "name": "2025-26",
    "start_date": "2025-08-01",
    "end_date": "2026-07-31",
    "status": "active"
  }
}
```

**Consumed by**: University Owner, Principal, Faculty, Student, Accountant, Exam Controller

#### SemesterPublished
```json
{
  "event": "semester.published",
  "timestamp": "2025-10-25T10:35:00Z",
  "data": {
    "id": "uuid",
    "academic_year_id": "uuid",
    "name": "Odd Semester 2025-26",
    "type": "odd",
    "start_date": "2025-08-01",
    "end_date": "2025-12-31",
    "registration_start": "2025-07-15",
    "registration_end": "2025-07-31"
  }
}
```

**Consumed by**: Principal, Faculty, Student, Admission Officer

---

### 1.2 Course Events

#### CourseCreated
```json
{
  "event": "course.created",
  "timestamp": "2025-10-25T11:00:00Z",
  "data": {
    "id": "uuid",
    "code": "CS301",
    "name": "Data Structures",
    "credits": 4,
    "type": "theory",
    "department_id": "uuid",
    "min_students": 20,
    "max_students": 60,
    "status": "active"
  }
}
```

**Consumed by**: Faculty, Student, HOD, Curriculum Committee

#### CourseFacultyAssigned
```json
{
  "event": "course.faculty_assigned",
  "timestamp": "2025-10-25T11:10:00Z",
  "data": {
    "course_id": "uuid",
    "faculty_id": "uuid",
    "role": "coordinator",
    "section": "A",
    "hours_per_week": 6
  }
}
```

**Consumed by**: Faculty, HOD, Principal

---

### 1.3 Timetable Events

#### TimetableGenerated
```json
{
  "event": "timetable.generated",
  "timestamp": "2025-10-25T12:00:00Z",
  "data": {
    "id": "uuid",
    "semester_id": "uuid",
    "program_id": "uuid",
    "year": 2,
    "section": "A",
    "status": "draft",
    "conflicts": [],
    "generated_at": "2025-10-25T12:00:00Z"
  }
}
```

**Consumed by**: Principal, Faculty, Student, HOD

#### TimetablePublished
```json
{
  "event": "timetable.published",
  "timestamp": "2025-10-25T14:00:00Z",
  "data": {
    "id": "uuid",
    "semester_id": "uuid",
    "program_id": "uuid",
    "year": 2,
    "section": "A",
    "published_at": "2025-10-25T14:00:00Z",
    "total_slots": 30,
    "faculty_count": 8,
    "room_count": 5
  }
}
```

**Consumed by**: Principal, Faculty, Student, HOD, Exam Controller

---

### 1.4 Examination Events

#### ExamSchedulePublished
```json
{
  "event": "exam.schedule_published",
  "timestamp": "2025-10-25T15:00:00Z",
  "data": {
    "id": "uuid",
    "semester_id": "uuid",
    "course_id": "uuid",
    "exam_type": "mid-term",
    "date": "2025-11-15",
    "start_time": "10:00:00",
    "end_time": "12:00:00",
    "duration_minutes": 120,
    "max_marks": 100
  }
}
```

**Consumed by**: Student, Faculty, Exam Controller, Principal

#### HallAllocationCompleted
```json
{
  "event": "exam.hall_allocation_completed",
  "timestamp": "2025-10-25T15:30:00Z",
  "data": {
    "exam_id": "uuid",
    "allocations": [
      {
        "hall_id": "uuid",
        "hall_name": "Main Hall",
        "capacity": 50,
        "allocated_students": 48
      }
    ]
  }
}
```

**Consumed by**: Exam Controller, Student, Facility Manager

---

### 1.5 User Management Events

#### UserCreated
```json
{
  "event": "user.created",
  "timestamp": "2025-10-25T16:00:00Z",
  "data": {
    "id": "uuid",
    "email": "faculty@university.edu",
    "role": "faculty",
    "department_id": "uuid",
    "status": "active"
  }
}
```

**Consumed by**: All portals (for access control)

#### UserPasswordReset
```json
{
  "event": "user.password_reset",
  "timestamp": "2025-10-25T16:30:00Z",
  "data": {
    "user_id": "uuid",
    "email": "faculty@university.edu",
    "reset_by": "uuid",
    "reason": "Forgot password"
  }
}
```

**Consumed by**: Security audit logs

---

## 2. Events Consumed

### 2.1 From University Owner Portal

#### UniversitySettingsUpdated
```json
{
  "event": "university.settings_updated",
  "data": {
    "university_id": "uuid",
    "settings": {
      "academic_year_start_month": 8,
      "semester_duration_months": 5,
      "max_courses_per_semester": 6
    }
  }
}
```

**Action**: Update academic calendar constraints, timetable generation rules

#### CollegeCreated
```json
{
  "event": "college.created",
  "data": {
    "id": "uuid",
    "name": "College of Engineering",
    "university_id": "uuid",
    "status": "active"
  }
}
```

**Action**: Create college entry in Super Admin scope, enable course management

---

### 2.2 From Bitflow Admin Portal

#### SystemMaintenanceScheduled
```json
{
  "event": "system.maintenance_scheduled",
  "data": {
    "start_time": "2025-11-01T02:00:00Z",
    "end_time": "2025-11-01T04:00:00Z",
    "affected_services": ["timetable_generator", "exam_scheduler"]
  }
}
```

**Action**: Show maintenance banner, disable affected features temporarily

---

### 2.3 From Principal Portal

#### CourseApprovalRequested
```json
{
  "event": "course.approval_requested",
  "data": {
    "course_id": "uuid",
    "college_id": "uuid",
    "requested_by": "uuid",
    "reason": "New elective for AI specialization"
  }
}
```

**Action**: Create course approval task in Super Admin dashboard

---

## 3. Webhooks

### 3.1 Outgoing Webhooks

#### Timetable Published Webhook
```http
POST https://downstream-system.com/webhooks/timetable
Content-Type: application/json
X-Signature: HMAC-SHA256-signature

{
  "event": "timetable.published",
  "timetable_id": "uuid",
  "download_url": "https://api.university.edu/timetables/uuid/download",
  "expires_at": "2025-10-26T10:00:00Z"
}
```

#### Exam Schedule Webhook
```http
POST https://sms-gateway.com/webhooks/exam-alerts
Content-Type: application/json

{
  "event": "exam.schedule_published",
  "students": [
    {
      "phone": "+1234567890",
      "exam": "CS301 Mid-Term",
      "date": "2025-11-15",
      "hall": "Main Hall"
    }
  ]
}
```

### 3.2 Incoming Webhooks

#### Accept Course Approval
```http
POST /api/super-admin/webhooks/course-approval
Content-Type: application/json
X-Principal-Signature: signature

{
  "course_id": "uuid",
  "approved": true,
  "approved_by": "uuid",
  "comments": "Approved for implementation"
}
```

---

## 4. Shared Database Contracts

### 4.1 Multi-Tenancy Pattern

All Super Admin tables include:
```sql
university_id UUID NOT NULL REFERENCES universities(id)
```

Row-level security enforced:
```sql
CREATE POLICY university_isolation ON courses
  FOR ALL USING (university_id = current_setting('app.current_university_id')::UUID);
```

### 4.2 Shared Tables (Read-Only for Super Admin)

- `universities` - Created by Bitflow Admin
- `colleges` - Created by University Owner
- `departments` - Created by Principal
- `programs` - Created by Principal

Super Admin **reads** from these, **does not modify**.

---

## 5. API Contracts (Inter-Portal)

### 5.1 Faculty Portal Integration

#### Get Faculty Workload
```http
GET /api/super-admin/faculty/{id}/workload
Authorization: Bearer {token}

Response:
{
  "faculty_id": "uuid",
  "total_hours_per_week": 18,
  "courses": [
    {
      "course_code": "CS301",
      "hours": 6,
      "sections": ["A", "B"]
    }
  ],
  "status": "normal" // normal | overload | underload
}
```

### 5.2 Student Portal Integration

#### Get Student Timetable
```http
GET /api/super-admin/students/{id}/timetable
Authorization: Bearer {token}

Response:
{
  "student_id": "uuid",
  "semester_id": "uuid",
  "slots": [
    {
      "day": "monday",
      "start_time": "09:00",
      "end_time": "10:00",
      "course_code": "CS301",
      "faculty_name": "Dr. Smith",
      "room": "A101"
    }
  ]
}
```

### 5.3 Exam Controller Portal Integration

#### Provide Exam Hall Availability
```http
POST /api/super-admin/exams/check-availability
Authorization: Bearer {token}

Request:
{
  "date": "2025-11-15",
  "start_time": "10:00",
  "end_time": "12:00",
  "required_capacity": 200
}

Response:
{
  "available_halls": [
    {
      "hall_id": "uuid",
      "name": "Main Hall",
      "capacity": 150,
      "available": true
    }
  ],
  "total_capacity": 300
}
```

---

## 6. Data Synchronization

### 6.1 Real-Time Sync (via Redis Pub/Sub)

Channel: `university:{university_id}:timetable:updates`

Message:
```json
{
  "type": "slot_updated",
  "timetable_id": "uuid",
  "slot_id": "uuid",
  "changes": {
    "room": "A101 → A102",
    "time": "09:00-10:00 → 10:00-11:00"
  }
}
```

### 6.2 Batch Sync (via Scheduled Jobs)

**Daily at 3 AM**: Sync course enrollments
```php
// Job: SyncCourseEnrollments
$courses = Course::with('enrollments')->get();
foreach ($courses as $course) {
    Redis::set("course:{$course->id}:enrollment_count", $course->enrollments->count());
}
```

---

## 7. Error Handling

### 7.1 Event Failures

If event publishing fails:
```php
try {
    event(new TimetablePublished($timetable));
} catch (\Exception $e) {
    Log::error('Event publish failed', [
        'event' => 'timetable.published',
        'timetable_id' => $timetable->id,
        'error' => $e->getMessage()
    ]);
    
    // Queue for retry
    dispatch(new RetryEventPublish('timetable.published', $timetable->toArray()))
        ->delay(now()->addMinutes(5));
}
```

### 7.2 Webhook Failures

Retry strategy:
- Retry 1: After 1 minute
- Retry 2: After 5 minutes
- Retry 3: After 15 minutes
- **Max retries**: 3
- **After failure**: Log error, alert admin

---

## 8. Security

### 8.1 Event Authentication

All events signed with HMAC-SHA256:
```php
$signature = hash_hmac('sha256', json_encode($event), config('events.secret'));
```

### 8.2 Webhook Authentication

Verify webhook signatures:
```php
$receivedSignature = $request->header('X-Signature');
$calculatedSignature = hash_hmac('sha256', $request->getContent(), config('webhooks.secret'));

if (!hash_equals($calculatedSignature, $receivedSignature)) {
    abort(401, 'Invalid signature');
}
```

---

## 9. Monitoring

### 9.1 Event Metrics

Track:
- Events published per minute
- Event publishing failures
- Average event processing time

Dashboard: `/super-admin/monitoring/events`

### 9.2 Webhook Metrics

Track:
- Webhook delivery success rate
- Average webhook response time
- Failed webhooks requiring manual retry

Dashboard: `/super-admin/monitoring/webhooks`

---

## 10. Testing Integration Contracts

### 10.1 Event Testing
```php
// tests/Feature/Events/TimetablePublishedTest.php
public function test_timetable_published_event_is_dispatched()
{
    Event::fake();
    
    $timetable = Timetable::factory()->create();
    $timetable->publish();
    
    Event::assertDispatched(TimetablePublished::class, function ($event) use ($timetable) {
        return $event->timetable->id === $timetable->id;
    });
}
```

### 10.2 Webhook Testing
```php
// tests/Feature/Webhooks/TimetableWebhookTest.php
public function test_timetable_webhook_is_sent()
{
    Http::fake([
        'https://downstream-system.com/*' => Http::response(['status' => 'received'], 200)
    ]);
    
    $timetable = Timetable::factory()->create();
    $timetable->publish();
    
    Http::assertSent(function ($request) {
        return $request->url() === 'https://downstream-system.com/webhooks/timetable';
    });
}
```

---

**Integration Complete! 🔗**
