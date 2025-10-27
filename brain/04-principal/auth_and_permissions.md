# Principal Portal - Authentication & Permissions

Version: 2.0
Last Updated: October 25, 2025

Overview
- The Principal manages exactly one college within a university. All access is constrained by university_id + college_id scoping.
- Authentication uses stateless JWT (RS256) issued by the Identity service. Authorization uses RBAC + attribute-based checks (budget thresholds, department alignment).

Token Model (JWT)
- Algorithm: RS256 (asymmetric). Public key distributed to all services via secrets manager.
- Lifetimes: Access 60 min; Refresh 14 days; Device binding via refresh token family.
- Required claims:
  - sub: user UUID
  - role: principal
  - university_id: int
  - college_id: int
  - permissions: string[] (fine-grained)
  - iat/exp/jti: standard claims
  - ver: token schema version (e.g., 2)

Session & MFA
- 2FA: TOTP preferred; SMS fallback for recovery; enforced for role=principal.
- Session timeout: 60 minutes of inactivity; absolute 12 hours; refresh rotates.
- Device management: last 10 devices stored with IP, user-agent, issued_at; remote revoke supported.

RBAC Roles (Principal Scope)
- principal: Full college-level governance with explicit thresholds.
- delegates.principal_approver: Temporary delegation for approvals during leave.
- viewers.finance_read: Read-only finance summaries.
- viewers.reports_read: Access to Reports page and exports.

Permission Matrix (selected)
- faculty.view, faculty.assign, faculty.leave.approve, faculty.evaluate
- recruitment.vacancy.create, recruitment.candidate.decision
- students.view, students.at_risk.view, students.disciplinary.manage
- departments.view, departments.hod.assign, departments.budget.distribute
- programs.view, programs.curriculum.approve, programs.outcomes.view
- admissions.view, admissions.merit.generate, admissions.seat.allocate, admissions.payments.view
- exams.timetable.approve, exams.committee.manage, exams.result.approve, exams.grievance.manage
- reports.view, reports.schedule
- infra.rooms.view, infra.maintenance.manage, infra.equipment.view
- finance.expense.approve(<5L), finance.expense.escalate(>=5L), finance.payroll.verify
- comms.announce.send, comms.grievance.manage, comms.alert.send

Threshold Rules
- Budget approvals < ₹5,00,000: allow principal.approve
- Budget approvals ≥ ₹5,00,000: require escalate_to_owner
- Teaching workload > 18h/week: allow approval with justification note
- PII fields (phone, address): mask in list endpoints; unmask requires purpose logging

Authorization Flow
1) JWT verified (RS256) → claims extracted.
2) College isolation enforced at middleware: all queries auto-filter by university_id + college_id.
3) Route policy checks permission slug and, if present, threshold attributes.
4) Decision logged to audit with subject, action, object, result, reason.

Laravel Middleware (concept)
```php
// app/Http/Middleware/EnsureCollegeScoped.php
public function handle($request, Closure $next) {
	$claims = $request->user()->claims();
	if (!$claims || !$claims['university_id'] || !$claims['college_id']) {
		abort(401);
	}
	// Bind to container for services & global scopes
	app()->instance('scope.university_id', (int)$claims['university_id']);
	app()->instance('scope.college_id', (int)$claims['college_id']);
	return $next($request);
}
```

Global Scope (Eloquent)
```php
// app/Models/Traits/CollegeScoped.php
protected static function booted() {
	static::addGlobalScope('college', function ($builder) {
		$builder->where('university_id', app('scope.university_id'))
				->where('college_id', app('scope.college_id'));
	});
}
```

API Gateway Headers
- X-University-Id: required and must match JWT claim
- X-College-Id: required and must match JWT claim
- X-Request-Intent: optional (e.g., "approve", "escalate") for audit enrichment

Delegations
- Principal may delegate selected permissions to another user for a bounded date range.
- Required fields: delegate_user_id, permissions[], from_date, to_date, reason.
- Delegated actions carry both principal_id and actor_id in audit.

Audit & Logging
- Every approval/rejection writes an immutable audit record with: subject, action, object, before/after, reason, ip, ua.
- Sensitive data access (unmasking) requires reason code and is alerted to DPO weekly.

Rate Limiting & Abuse Prevention
- Approvals: 60/min burst; 600/hour rolling; per principal_id.
- Announcements send: 10/min; queue-backed; failures retried with backoff.

Security Checklist (enforced)
- Keys rotated quarterly; clock skew tolerance ±60s.
- CSRF not required for pure API JWT, but admin UI still uses SameSite=Lax for support pages.
- Deny policy by default: no permission → 403; unknown permission → 403.
- Error responses omit existence hints: 403 returned instead of 404 for access-controlled resources.

Testing Guidance
- Unit: permissions resolver with threshold cases (₹4.99L approve vs ₹5L escalate).
- API: attempt cross-college access → expect 403; missing headers → 401.
- E2E: delegated approver flow including automatic revocation after to_date.
