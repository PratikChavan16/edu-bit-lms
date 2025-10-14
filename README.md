# BitFlow LMS - Unified Campus Management System

A comprehensive educational platform for managing universities, colleges, learning management, and administration under one ecosystem.

> **📊 Current Status:** Active Development (60% Complete)  
> **🎯 Next Focus:** Complete Bitflow Nova Portal Frontend  
> **📅 Last Updated:** October 12, 2025

## 📚 **Documentation**

**👉 [Complete Documentation Index](./docs/README.md)** - Start here for all documentation

### Quick Links

| Document | Purpose |
|----------|---------|
| **[Project Status](./docs/status/PROJECT_STATUS.md)** | Current progress, metrics, and next steps |
| **[Implementation Guide](./docs/guides/IMPLEMENTATION_GUIDE.md)** | Complete development guide with examples |
| **[Testing Guide](./docs/guides/TESTING_GUIDE.md)** | How to write and run tests |
| **[Architecture](./docs/reference/ARCHITECTURE.md)** | System architecture and design decisions |
| **[Auth Guide](./docs/reference/AUTH_AND_ADMIN_COMPLETE.md)** | Authentication system details |

**📖 [See all documentation →](./docs/README.md)**

## 🏗️ **Project Structure**

```
edu-bit-lms/
├── bitflow-core/              # Laravel 11 Backend API
│   ├── app/Http/Controllers/  # ✅ 16 Controllers (90% tests pass)
│   ├── app/Models/           # ✅ 15+ Eloquent models
│   └── tests/                # ✅ 90% coverage
│
├── bitflow-frontend/          # Next.js 14 Frontend (Monorepo)
│   ├── apps/
│   │   ├── admin/            # 🔄 Bitflow Nova Portal (25% complete)
│   │   ├── faculty/          # ✅ Faculty Portal (100%)
│   │   └── learner/          # ✅ Student Portal (100%)
│   └── packages/
│       ├── ui/               # ✅ Component library
│       └── api-client/       # ✅ API client + auth
│
└── docs/                      # Documentation
```

## 🚀 **Quick Start**

### Prerequisites
- **PHP** 8.2+ with Composer 2.x
- **Node.js** 20+ with pnpm 8+
- **MySQL** 8.0+
- **Git** latest

### Backend Setup (5 minutes)

```bash
cd bitflow-core
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
# Runs on http://localhost:8000
```

### Frontend Setup (2 minutes)

```bash
cd bitflow-frontend
pnpm install
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
pnpm dev
# Admin: http://localhost:3000
# Faculty: http://localhost:3001
# Learner: http://localhost:3002
```

## ✅ **Completed Features**

### Backend (Laravel 11 + Sanctum)
✅ **Authentication System** - Token-based auth with role-based access control  
✅ **Admin APIs** (4 controllers) - Dashboard, Universities, Features, Operations  
✅ **Faculty APIs** (9 controllers) - Courses, Assessments, Attendance, Grades, etc.  
✅ **Learner APIs** (3 controllers) - Dashboard, Courses, Assessments  
✅ **90% Test Coverage** - Comprehensive PHPUnit tests

### Frontend (Next.js 14)
✅ **Student Portal** (3 pages) - Dashboard, Courses, Assessments  
✅ **Faculty Portal** (9 pages) - Complete teaching management interface  
✅ **Bitflow Nova Portal** (1/4 pages) - Dashboard with real-time metrics  
✅ **Component Library** (@bitflow/ui) - 20+ reusable components  
✅ **Authentication** - Login pages for all portals with Zustand state management

## 🔄 **In Progress**

🔄 **Bitflow Nova Portal Frontend** (3 pages remaining)
- Universities management (list + detail views)
- Feature toggles interface
- Operations alerts dashboard

## 🧪 **Testing**

**Backend:**
```bash
cd bitflow-core
composer test  # PHPUnit (90% coverage)
```

**Frontend:**
```bash
cd bitflow-frontend
pnpm test  # Vitest (coming soon)
```

## �️ **Tech Stack**

**Backend:**
- Laravel 11 with Sanctum authentication
- PHP 8.2+ with Composer
- MySQL 8.0 database
- PHPUnit for testing
- Spatie Permission for RBAC

**Frontend:**
- Next.js 14 (App Router)
- React 18 with TypeScript 5.5
- Zustand for state management
- React Query for data fetching
- Tailwind CSS for styling
- Radix UI components
- Lucide React icons

**DevOps:**
- pnpm workspaces (monorepo)
- Git version control
- Docker (planned)
- GitHub Actions (planned)

## 🎯 **Next Steps**

See **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** for detailed roadmap.

**Immediate priorities:**
1. Complete Bitflow Nova Portal frontend (6-8 hours)
2. Add Colleges & Users management APIs (4-5 hours)
3. Production readiness (4-6 hours)

## 🤝 **Contributing**

1. Check **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** for coding patterns
2. Follow existing code style and structure
3. Write tests for new features
4. Update documentation as needed
5. Run linters before committing

## 📄 **License**

Proprietary - BitFlow LMS Platform

## 👥 **Team**

Developed with ❤️ by the BitFlow team

- **Platform Team** — Architecture and infrastructure
- **Backend Squad** — API implementation
- **Frontend Squad** — UI/UX development

---

**Last Updated:** October 7, 2025  
**Version:** 0.1.0 (Alpha)
