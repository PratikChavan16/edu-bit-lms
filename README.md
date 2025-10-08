# Bitflow Nova - Unified Campus Management System

A comprehensive educational platform for managing universities, colleges, learning management, HRMS, finance, and administration under one ecosystem.

## 🏗️ Architecture

This monorepo contains:

- **`bitflow-core/`** — Laravel 11 backend API (PHP 8.3)
- **`bitflow-frontend/`** — Next.js 15 frontend monorepo (React 19)
  - `apps/admin/` — Bitflow Central admin portal
  - `apps/learner/` — Student/learner portal
  - `packages/ui/` — Shared component library
  - `packages/api-client/` — TanStack Query API hooks
- **`docs/`** — System-wide documentation and integration playbook

## 🚀 Quick Start

### Prerequisites

- **Node.js** 22+ with Corepack enabled
- **PNPM** 9+
- **PHP** 8.3+ with Composer
- **Docker** (optional, for local services)

### Backend Setup

```bash
cd bitflow-core
composer install
cp .env.example .env
# Configure database credentials in .env
# php artisan migrate
composer test
```

### Frontend Setup

```bash
cd bitflow-frontend
pnpm install
pnpm lint
pnpm test
```

### Development Servers

**Backend:**
```bash
cd bitflow-core
php artisan serve  # http://localhost:8000
```

**Admin Portal:**
```bash
cd bitflow-frontend
pnpm --filter @bitflow/admin-app dev  # http://localhost:3000
```

**Learner Portal:**
```bash
pnpm --filter @bitflow/learner-app dev  # http://localhost:3001
```

## 📋 Features

### Admin Portal (Bitflow Central)
- University provisioning and management
- Feature toggle control plane
- Billing and invoicing
- Infrastructure monitoring and alerts
- Backup orchestration
- Audit log viewer

### Learner Portal
- Personalized student dashboard
- Library (notes, videos, e-books, assessments)
- Document management
- Assessment submission workflows
- Results and grade viewing
- Attendance and fee status

### Planned Modules
- College admin portal
- Faculty portal
- Parent portal
- Finance/accounting modules
- HRMS and payroll
- Examination management

## 🧪 Testing

**Backend:**
```bash
cd bitflow-core
composer test  # PHPUnit
```

**Frontend:**
```bash
cd bitflow-frontend
pnpm test  # Vitest
```

## 📚 Documentation

- **[Integration Playbook](./docs/integration-playbook.md)** — End-to-end development workflow
- **[Backend Implementation](./bitflow-core/docs/backend-implementation.md)** — API endpoint tracking
- **[Frontend Design Spec](./bitflow-frontend/docs/design/frontend-design-spec.txt)** — Comprehensive UI/UX guidelines
- **[OpenAPI Contracts](./bitflow-core/docs/contracts/)** — API specifications

## 🛠️ Tech Stack

**Backend:**
- Laravel 11
- PHP 8.3
- AWS (RDS, S3, Redis, MediaConvert)
- PHPUnit

**Frontend:**
- Next.js 15 (canary)
- React 19 (canary)
- TanStack Query
- Tailwind CSS
- TypeScript
- Vitest + Playwright

**Infrastructure:**
- Terraform (IaC)
- GitHub Actions (CI/CD)
- Docker

## 📦 Project Structure

```
.
├── bitflow-core/           # Laravel backend
│   ├── app/
│   │   └── Http/
│   │       └── Controllers/
│   ├── docs/
│   │   └── contracts/     # OpenAPI specs
│   ├── routes/
│   └── tests/
├── bitflow-frontend/       # Next.js monorepo
│   ├── apps/
│   │   ├── admin/         # Admin portal
│   │   └── learner/       # Learner portal
│   ├── packages/
│   │   ├── ui/            # Shared components
│   │   └── api-client/    # API hooks
│   └── docs/
└── docs/                   # System documentation
    └── integration-playbook.md
```

## 🤝 Contributing

1. Contracts defined in OpenAPI specs are the source of truth
2. Backend implements controllers matching contracts
3. Frontend consumes via typed `@bitflow/api-client` hooks
4. All PRs require tests and lint checks passing
5. Breaking changes need 48h notice with migration guide

## 📄 License

Proprietary - Bitflow Nova Platform

## 👥 Team

- **Platform Team** — Architecture and infrastructure
- **Backend Squad** — API implementation
- **Frontend Squad** — UI/UX development

---

**Last Updated:** October 7, 2025  
**Version:** 0.1.0 (Alpha)
