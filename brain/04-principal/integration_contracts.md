# Principal Portal - Integration Contracts

Version: 2.0  
Last Updated: October 25, 2025

---

## Overview

The Principal portal integrates via:
- Events (publish/subscribe)
- Webhooks (HTTP callbacks with HMAC)
- Shared database (college-scoped tables)
- REST APIs (see `api_spec.yaml`)

Security
- All webhooks are signed with HMAC-SHA256 using a shared secret `WH_SECRET_PRINCIPAL`.
- Include headers: `X-Event-Name`, `X-Signature`, `X-Timestamp` (ISO string).
- Reject if skew > 5 minutes or signature mismatch.

---

## 1) Events Published

### 1.1 Faculty & HR

Event: `faculty.hired`
```json
{
	"event": "faculty.hired",
	"timestamp": "2025-10-25T10:00:00Z",
	"data": {
		"university_id": 1,
		"college_id": 10,
		"faculty_id": 987,
		"department_id": 22,
		"designation": "Associate Professor"
	}
}
```
Consumers: HR Manager, HOD, Payroll

Event: `faculty.leave.approved`
```json
{
	"event": "faculty.leave.approved",
	"timestamp": "2025-10-25T11:00:00Z",
	"data": {
		"university_id": 1,
		"college_id": 10,
		"leave_id": 321,
		"faculty_id": 987,
		"type": "annual",
		"from": "2025-10-25",
		"to": "2025-10-29",
		"days": 3
	}
}
```
Consumers: HOD, Timetable Service

---

### 1.2 Admissions

Event: `admissions.merit_list.generated`
```json
{
	"event": "admissions.merit_list.generated",
	"timestamp": "2025-10-25T12:00:00Z",
	"data": {
		"university_id": 1,
		"college_id": 10,
		"program_id": 4,
		"entries": 200
	}
}
```
Consumers: Admission Officer, Communications

Event: `admissions.seat_allocation.completed`
```json
{
	"event": "admissions.seat_allocation.completed",
	"timestamp": "2025-10-25T13:30:00Z",
	"data": {
		"university_id": 1,
		"college_id": 10,
		"program_id": 4,
		"round": 2,
		"allocated": 58,
		"waitlisted": 12
	}
}
```
Consumers: Finance (payment links), Student Portal

---

### 1.3 Finance

Event: `finance.expense.approved`
```json
{
	"event": "finance.expense.approved",
	"timestamp": "2025-10-25T14:00:00Z",
	"data": {
		"university_id": 1,
		"college_id": 10,
		"expense_id": 445,
		"department_id": 22,
		"amount": 240000,
		"category": "equipment"
	}
}
```
Consumers: Accountant, University Owner (summary)

Event: `finance.expense.escalated`
```json
{
	"event": "finance.expense.escalated",
	"timestamp": "2025-10-25T14:10:00Z",
	"data": {
		"university_id": 1,
		"college_id": 10,
		"expense_id": 446,
		"amount": 750000,
		"reason": "Above ₹5L threshold"
	}
}
```
Consumers: University Owner, Accountant

---

### 1.4 Exams

Event: `exams.timetable.approved`
```json
{
	"event": "exams.timetable.approved",
	"timestamp": "2025-10-25T15:00:00Z",
	"data": {
		"university_id": 1,
		"college_id": 10,
		"timetable_id": 88,
		"conflicts": 0
	}
}
```
Consumers: Exam Controller, Student, Faculty

Event: `exams.results.approved`
```json
{
	"event": "exams.results.approved",
	"timestamp": "2025-10-25T15:30:00Z",
	"data": {
		"university_id": 1,
		"college_id": 10,
		"batch_id": 501,
		"courses": 12
	}
}
```
Consumers: Student Portal, HOD, Accreditation Service

---

### 1.5 Infrastructure & Communication

Event: `infra.maintenance.completed`
```json
{
	"event": "infra.maintenance.completed",
	"timestamp": "2025-10-25T16:00:00Z",
	"data": {
		"university_id": 1,
		"college_id": 10,
		"ticket_id": 9021,
		"category": "electrical",
		"approved_by": 77
	}
}
```
Consumers: Facilities, Safety Audits

Event: `comms.announcement.sent`
```json
{
	"event": "comms.announcement.sent",
	"timestamp": "2025-10-25T16:30:00Z",
	"data": {
		"university_id": 1,
		"college_id": 10,
		"announcement_id": 1201,
		"audience": "department"
	}
}
```
Consumers: All impacted portals

---

## 2) Webhooks

Endpoint example (consumer-side):
```
POST https://consumer.example.com/webhooks/principal
Headers:
	X-Event-Name: finance.expense.approved
	X-Signature: sha256=HEX_DIGEST
	X-Timestamp: 2025-10-25T14:00:00Z
Body: JSON payload (see event examples)
```

Verification (pseudo):
```ts
const ok = hmacVerify(WH_SECRET_PRINCIPAL, `${timestamp}.${body}`, signature);
if (!ok || skewTooLarge(timestamp)) return 401;
```

Retry policy
- Exponential backoff: 1m, 5m, 15m, 1h (DLQ afterwards)
- Idempotency key = event_id (or combination of timestamp+hash)

---

## 3) Subscribed Events

- `semester.published` (from Super Admin) → triggers department timetables review
- `course.created` (from Super Admin) → allow HOD proposals; Principal approval path
- `user.created` (from Identity) → new faculty visibility in directory
- `budget.released` (from University Owner) → unlock department distributions

---

## 4) API Contracts (cross-portal)

Principal → Accountant
- Approve expense <₹5L: `POST /api/accountant/expenses/{id}/ingest` (internal)

Principal → Exam Controller
- Result batch approved: `POST /api/exams/batches/{id}/approve-sync`

Principal → Student Portal
- Announcement broadcast: `POST /api/student/announcements/ingest`

Auth
- Use service tokens (m2m) or signed webhooks for cross-portal calls.
