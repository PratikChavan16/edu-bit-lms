# Backend Architecture Overview

This document captures the high-level architecture decisions for Bitflow Core. Use architecture decision records in `../adr` for detailed trade-offs and future revisions.

## Key components

- **API Gateway & HTTP layer**: Laravel application serving REST and future GraphQL endpoints.
- **Tenant context middleware**: Resolves university and college scope from domain/subdomain and injects guards into every query and policy.
- **RBAC & permissions**: Spatie Permission (or equivalent) extended for multi-role union logic and audit logging.
- **Background workers**: Horizon-powered queue workers handling media transcoding orchestration, bulk imports, and notification fan-out.
- **Event bus**: Redis or AWS SQS to decouple core events (student.created, payroll.run.completed, etc.).
- **Storage providers**: AWS S3 + MediaConvert + CloudFront for media; local MinIO in development; encrypted document storage with lifecycle policies.
- **Observability**: Centralized logging through CloudWatch, metrics via Prometheus/Grafana (optional), alerting into PagerDuty.

## Core modules

1. **Identity & Access** – authentication, multi-role RBAC, audit trails.
2. **Tenant Management** – universities, colleges, departments, branding, feature toggles.
3. **Learning & Content** – notes, videos, assessments, grading queues.
4. **Finance & HRMS** – fees, invoices, payroll, vendor ledgers, statutory reports.
5. **Communication** – chat services, announcements, notifications, helpdesk.
6. **Analytics** – reporting engine, AI attendance risk scoring, exports.

## Open items

- Validate final queue backend (Redis vs SQS) per hosting target.
- Finalize AI inference hosting (SageMaker vs in-app).
- Align on integration strategy for biometric attendance adapters.
