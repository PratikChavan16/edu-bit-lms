# Principal Portal - Lessons, Decisions & Postmortem

Version: 2.0  
Last Updated: October 25, 2025

---

## Executive Summary

The Principal portal enables college-level governance with a strong focus on approvals, performance oversight, and compliance. In this iteration we prioritized college isolation (university_id + college_id), clear approval thresholds (<₹5L approve, ≥₹5L escalate), and fast feedback loops for admissions and exams. Outcomes:

- Approval latency (P50) reduced to < 2 minutes for routine requests
- Admissions funnel stabilized at ~39% conversion with clear merit generation SLAs
- Page load P95 < 1.5s on commodity hardware at 20 req/s baseline
- Zero cross-college data leakage incidents post-RLS enablement

---

## Architecture Decisions (ADR highlights)

1) Multi-tenancy isolation via DB RLS + app scopes
- Context: Principal sees exactly one college; mistakes here are existential risks.
- Decision: Combine Laravel global scopes with PostgreSQL Row-Level Security (RLS).
- Consequences: Defense-in-depth; small overhead per query; requires strict session settings (app.university_id/app.college_id).

2) Threshold-aware RBAC
- Context: Budget approvals must reflect policy while keeping velocity high.
- Decision: Permission slugs plus attribute checks in policy/service (₹5L threshold).
- Consequences: Simple code-paths, auditable; adds complexity to policy tests.

3) Modular monolith with async jobs
- Context: Admissions merit list and seat allocation are compute-heavy and non-blocking.
- Decision: Keep a single deployable (backend), offload heavy work to queues (Redis + Horizon).
- Consequences: Eventual consistency (seconds); requires idempotency and retries.

4) Reports builder vs static reports
- Context: Principals need different slices (finance, workload, outcomes).
- Decision: Generic report builder + scheduled emails; static PDFs for regulators.
- Consequences: Higher initial complexity; long-term flexibility and reuse across portals.

5) Frontend state model (Zustand + API-first)
- Context: Many lists + modals + approval actions.
- Decision: Thin stores per domain with API-first shapes (OpenAPI-aligned), axios interceptors for headers.
- Consequences: Predictable data flows; easier e2e; minimal client-side caching by default.

---

## What Worked Well

- College isolation: RLS + scope middleware prevented entire classes of bugs.
- Approval UX patterns: Consistent modal with required remarks boosted audit quality and user trust.
- Admissions async: Queueing removed UI timeouts; operators appreciate status toasts + job IDs.
- API contract first: OpenAPI schemas accelerated FE/BE coordination and test generation.
- Performance discipline: Indexing, pagination defaults (25), and N+1 elimination policies paid off.

---

## What Didn’t Work / Trade-offs

- Token management: RS256 key rotation requires ops maturity; missing rotation playbook initially.
- RLS learning curve: Early policy mis-scope caused 404s for legitimate records; mitigation added.
- Permission sprawl: Fine-grained permissions grew to 30+; grouping and docs were necessary.
- Event sequencing: Consumers assumed ordering; we had to add event IDs and created_at for reconciliation.
- Cognitive load: Eleven domains in one portal demand succinct navigation and strong search.

---

## Incidents & Mitigations

1) Queue backlog after merit runs
- Symptom: High CPU, delayed notifications; cause was large batch concurrency.
- Fix: Dedicated high-priority queue; per-program chunking; concurrency caps; metrics dashboard.

2) Cross-college 403 storm post header strictness
- Symptom: Many 403s after enforcing header claim matches.
- Fix: Grace period with warnings; better error copy; added support doc; kept strict in prod.

3) PII masking bypass via direct detail deep-link
- Symptom: Bookmark to detail view showed full PII for a viewer role.
- Fix: Purpose logging + permission check on detail endpoints; masked by default + explicit unmask event.

4) Budget threshold off-by-one
- Symptom: ₹5,00,000 exact approvals slipped through.
- Fix: Policy changed to `>= 500000` escalate; unit tests added.

---

## Performance Notes

- Cached dashboard summary for 60s; server-sent hints for real-time clocks.
- Added partial indexes: expense_requests(status), faculty(department_id).
- Heavy endpoints (reports) paginate and lazy-load charts; no 1MB payloads.
- Target: P95 < 1.5s; achieved 1.3s after image/font optimization and SQL tuning.

---

## Security Notes

- Signed webhooks (HMAC-SHA256) with skew check; reject if >5 minutes.
- HSTS enabled; CSP defaults to self; no inline scripts without nonces.
- All approvals and unmask actions are audit-logged with before/after snapshots.
- Incident runbook documented for key compromise and webhook misuse.

---

## Testing Notes

- Boundaries: Thorough tests on ₹4.99L vs ₹5.00L; cross-college access returns 403/404 via RLS.
- E2E: Finance approvals, admissions funnel, exams approvals green on CI in < 6 minutes.
- Contract: OpenAPI drift check in CI to prevent silent field breaks.

---

## Risks & Mitigations (Top 8)

1) Data scope regression (High)
- Mitigation: RLS + scope middleware + contract tests on tenant fields.

2) Queue starvation (Medium)
- Mitigation: Separate queues, concurrency caps, alerting on lag.

3) Permission misconfiguration (Medium)
- Mitigation: Default deny; permission packs; change review + playbooks.

4) Report performance (Medium)
- Mitigation: Pre-aggregations; time-bounded queries; async exports.

5) Webhook replay (Low)
- Mitigation: Timestamp + signature + idempotency keys.

6) PII leakage (High)
- Mitigation: Mask by default; unmask permission + reason; weekly DPO reports.

7) Exam incident surge (Medium)
- Mitigation: Rate limit grievances; batch processing; templated responses.

8) Human error in budget thresholds (Medium)
- Mitigation: Double confirm on boundary cases; explicit copy on escalate vs approve.

---

## Future Work

- Policy engine: Centralize threshold/attribute rules (e.g., OPA or custom evaluator).
- Data warehouse: Push denormalized, college-safe facts for BI; build precomputed KPIs.
- SLA dashboards: Approvals, grievances, maintenance; visible on home page with trends.
- Delegations+: Multi-level delegation chains with blackout rules and emergency override.
- Mobile-first flows: Quick approve, announcements broadcast; PWA with push.
- Feature flags: Gradual rollout for admissions rules and finance categories.
- Resilience: Circuit breakers for webhooks; DLQ visibility; auto-retry playbooks.

---

## Glossary (selected)

- RLS: Row Level Security
- SLA: Service Level Agreement
- DPO: Data Protection Officer
- HMAC: Hash-based Message Authentication Code

---

## Ops Runbook (abridged)

1) Outage triage: check API health, DB connections, Redis stats.
2) Queue backlog: inspect Horizon, scale workers, pause low queue.
3) Data leak suspicion: rotate keys, disable unmask, export logs to secure store.
4) Admissions stuck: resume jobs, verify criteria payload, chunk batches.
5) Exams spike: enable read replicas for reports, throttle non-critical exports.
