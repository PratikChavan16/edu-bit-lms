# 🎓 Bitflow LMS - University Operating System

> **⚠️ DEVELOPERS START HERE:** All documentation, planning, and contracts have been moved to the **`brain/`** folder for organized parallel development.

---

## 🚀 Quick Start

### For Developers

1. **📁 Go to the Brain Folder:** [`brain/`](./brain/)
2. **📖 Read the Navigation Guide:** [`brain/BRAIN_NAVIGATION.md`](./brain/BRAIN_NAVIGATION.md)
3. **✅ Check Your Assignments:** [`brain/PORTAL_DISTRIBUTION.md`](./brain/PORTAL_DISTRIBUTION.md)
4. **🏁 Get Started:** [`brain/planning/QUICK_START_PARALLEL_DEV.md`](./brain/planning/QUICK_START_PARALLEL_DEV.md)

### For Managers/Stakeholders

- **Executive Summary:** [`brain/EXECUTIVE_SUMMARY.md`](./brain/EXECUTIVE_SUMMARY.md)
- **Project Overview:** [`brain/README.md`](./brain/README.md)
- **Progress Dashboard:** [`brain/BRAIN_FOLDER_ORGANIZATION.md`](./brain/BRAIN_FOLDER_ORGANIZATION.md)

---

## 🧠 Brain Folder - Central Documentation Hub

All project documentation, planning, contracts, and portal-specific guides are now centralized in the **`brain/`** folder:

```
brain/
├── 📁 planning/              ← Strategic planning & development approach
├── 📁 architecture/          ← System design & architectural decisions  
├── 📁 tracking/              ← Progress reports & change history
├── 📁 shared_contracts/      ← Shared types, APIs, integration contracts
├── 📁 01-bitflow-admin/      ← Portal documentation (14 portals total)
├── 📁 02-university-owner/
├── ...
└── 📄 master_*.{sql,yaml,md} ← Master files for entire system
```

**Why the Brain Folder?**
- ✅ All documentation in one place
- ✅ Zero conflicts during parallel development
- ✅ Clear file ownership and tracking
- ✅ Easy to find anything with BRAIN_NAVIGATION.md

---

## 🌟 What is Bitflow LMS?

Bitflow LMS is an **enterprise-grade, multi-tenant Campus Operating System** designed for universities managing multiple colleges. It provides:

- **14 Specialized Portals** for every stakeholder (admin, faculty, students, parents, etc.)
- **Multi-Tenant Architecture** with row-level isolation
- **God Mode & Hierarchical Navigation** for seamless cross-portal management
- **Comprehensive Academic Management** (courses, attendance, grades, assignments)
- **Financial System** (fee management, payments, accounting)
- **HR & Operations** (staff management, payroll, leave tracking)

---

## 🏗️ Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend** | Laravel | 11.x |
| **Frontend** | Next.js (App Router) | 16.0 |
| **Language** | PHP / TypeScript | 8.3 / 5.6 |
| **Database** | PostgreSQL | 16+ |
| **Cache** | Redis | 7+ |
| **State Management** | Zustand | 5.0 |
| **Styling** | TailwindCSS | 4.0 |
| **API** | RESTful + WebSockets | - |
| **Auth** | Laravel Sanctum + JWT | - |

---

## 📂 Project Structure

```
edu-bit-lms/
├── brain/                     ← 📚 ALL DOCUMENTATION (START HERE!)
│   ├── planning/
│   ├── architecture/
│   ├── tracking/
│   ├── shared_contracts/
│   └── 01-bitflow-admin/ ... 14-super-non-teaching-manager/
│
├── backend/                   ← Laravel 11 API
│   ├── app/
│   │   ├── Http/Controllers/  # API endpoints
│   │   ├── Models/            # Eloquent models
│   │   └── Services/          # Business logic
│   ├── database/
│   │   ├── migrations/        # Database migrations
│   │   └── seeders/           # Test data
│   └── routes/
│       └── api.php            # API routes
│
├── bitflow-admin/             ← Next.js 16 Frontend (Portal 01)
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   ├── components/        # React components
│   │   ├── stores/            # Zustand stores
│   │   └── lib/               # Utilities
│   └── public/                # Static assets
│
├── docker-compose.yml         ← Docker setup
└── README.md                  ← This file (redirects to brain/)
```

---

## 🎯 14 Specialized Portals

| # | Portal Name | User Role | Owner |
|---|-------------|-----------|-------|
| 01 | Bitflow Admin | System Administrator | Dev A |
| 02 | University Owner | University Management | Dev B |
| 03 | Super Admin | Super Administrator | Dev A |
| 04 | Principal | College Principal | Dev A |
| 05 | College Admin | College Administrator | Dev B |
| 06 | Super Academics | Academic Manager | Dev A |
| 07 | Faculty/Teacher | Teaching Staff | Dev A |
| 08 | Student | Students | Dev A |
| 09 | Parent | Parents/Guardians | Dev A |
| 10 | Admission Admin | Admissions Team | Dev B |
| 11 | Super Accountant | Head Accountant | Dev B |
| 12 | College Accounts Admin | College Accountant | Dev B |
| 13 | College Fee Admin | Fee Collection | Dev B |
| 14 | Super Non-Teaching Manager | HR/Operations | Dev B |

**Full details:** [`brain/PORTAL_DISTRIBUTION.md`](./brain/PORTAL_DISTRIBUTION.md)

---

## 🚦 Getting Started

### Prerequisites

- **Docker Desktop** (recommended) OR:
  - PHP 8.3+
  - Node.js 22+
  - PostgreSQL 16+
  - Redis 7+

### Installation (Docker - Recommended)

```bash
# 1. Clone the repository
git clone <repository-url>
cd edu-bit-lms

# 2. Start Docker containers
docker-compose up -d

# 3. Install backend dependencies
docker-compose exec backend composer install

# 4. Run database migrations
docker-compose exec backend php artisan migrate --seed

# 5. Install frontend dependencies
docker-compose exec frontend npm install

# 6. Start development
# Backend: http://localhost:8000
# Frontend: http://localhost:3000
```

### Installation (Manual)

See [`brain/global_build_guide.md`](./brain/global_build_guide.md) for detailed manual installation instructions.

---

## 📚 Documentation

**All documentation is in the `brain/` folder. Start here:**

### 🎯 Essential Reading
- **[Brain Navigation Guide](./brain/BRAIN_NAVIGATION.md)** - Find any document quickly
- **[Quick Start for Developers](./brain/planning/QUICK_START_PARALLEL_DEV.md)** - Get started in 15 minutes
- **[Portal Distribution](./brain/PORTAL_DISTRIBUTION.md)** - Developer assignments & timeline
- **[Organization Summary](./brain/ORGANIZATION_SUMMARY.md)** - Visual overview & progress

### 🏗️ Architecture & Design
- **[God Mode Implementation](./brain/architecture/GOD_MODE_IMPLEMENTATION.md)**
- **[Hierarchical Navigation Plan](./brain/architecture/HIERARCHICAL_NAVIGATION_IMPLEMENTATION_PLAN.md)**
- **[Complete God Mode Analysis](./brain/architecture/COMPLETE_GOD_MODE_ANALYSIS.md)**
- **[Navigation Flow Diagram](./brain/architecture/NAVIGATION_FLOW_DIAGRAM.md)**

### 🤝 Shared Contracts (CRITICAL!)
- **[Shared Contracts README](./brain/shared_contracts/README.md)**
- **[Usage Guide](./brain/shared_contracts/USAGE_GUIDE.md)**
- **[API Response Formats](./brain/shared_contracts/api_response_formats.yaml)**
- **[Shared TypeScript Types](./brain/shared_contracts/shared_types.ts)**

### 📊 Master Files
- **[Master Database Schema](./brain/master_db_schema.sql)**
- **[Master Roles & Permissions](./brain/master_roles_permissions.yaml)**
- **[Master API Gateway](./brain/master_api_gateway.yaml)**
- **[Master Auth System](./brain/master_auth_system.md)**

### 🎨 Frontend & UI
- **[Master Theme Design](./brain/master_theme_design.md)**
- **Portal-specific frontend guides** in each portal's folder

### 🔧 DevOps & Deployment
- **[Build Guide](./brain/global_build_guide.md)**
- **[Deployment Guide](./brain/global_deployment.md)**
- **[Observability](./brain/global_observability.md)**
- **[Security & Compliance](./brain/global_security_compliance.md)**

---

## 👥 Parallel Development Strategy

**Two developers working simultaneously with ZERO conflicts!**

### Developer A - Portals (7 portals)
- 01-Bitflow Admin ⭐ (God Mode foundation)
- 03-Super Admin
- 04-Principal
- 06-Super Academics
- 07-Faculty/Teacher
- 08-Student
- 09-Parent

### Developer B - Portals (7 portals)
- 02-University Owner ⭐ (God Mode foundation)
- 05-College Admin
- 10-Admission Admin
- 11-Super Accountant
- 12-College Accounts Admin
- 13-College Fee Admin
- 14-Super Non-Teaching Manager

**How it works:**
- Each developer owns their portals (no overlaps!)
- Shared contracts prevent integration issues
- Weekly sync meetings for coordination
- Git branches: `dev-a/*` and `dev-b/*`

**Full strategy:** [`brain/planning/PARALLEL_DEVELOPMENT_STRATEGY.md`](./brain/planning/PARALLEL_DEVELOPMENT_STRATEGY.md)

---

## 📈 Project Progress

### Overall: 97% Documentation Complete

| Phase | Status | Progress |
|-------|--------|----------|
| **Planning & Organization** | ✅ Complete | 100% |
| **Shared Contracts** | ✅ Complete | 100% |
| **Master Files** | ⏳ In Progress | 82% (4 files need God Mode updates) |
| **Portal Documentation** | ⏳ In Progress | 88% (2 portals need God Mode docs) |
| **Backend Implementation** | ⏳ Next | 0% (starting after docs) |
| **Frontend Implementation** | ⏳ Next | 0% (starting after docs) |

**Detailed progress:** [`brain/BRAIN_FOLDER_ORGANIZATION.md`](./brain/BRAIN_FOLDER_ORGANIZATION.md)

---

## 🔑 Key Architectural Features

### 🌐 Multi-Tenancy
- **Row-level isolation** via `university_id` and `college_id`
- **Automatic tenant scoping** via middleware
- **Secure data separation** between universities

### 👑 God Mode
- **Cross-tenant navigation** for admin portals
- **Seamless context switching** without re-login
- **Hierarchical permissions** (university → college → department)

### 🔐 Security
- **JWT-based authentication** with Laravel Sanctum
- **Role-based access control** (RBAC) with granular permissions
- **Audit logging** for all sensitive operations
- **Rate limiting** and DDoS protection

### 📊 Performance
- **Redis caching** for frequently accessed data
- **Database query optimization** with eager loading
- **WebSocket** for real-time updates
- **Horizontal scalability** via stateless design

---

## 🧪 Testing

```bash
# Backend tests
docker-compose exec backend php artisan test

# Frontend tests
docker-compose exec frontend npm test

# End-to-end tests
docker-compose exec frontend npm run test:e2e
```

**Testing guide:** [`brain/architecture/PRODUCTION_READINESS_COMPLETE.md`](./brain/architecture/PRODUCTION_READINESS_COMPLETE.md)

---

## 🚀 Deployment

**Production deployment guide:** [`brain/global_deployment.md`](./brain/global_deployment.md)

Quick overview:
1. Set up production environment (AWS/GCP/Azure)
2. Configure environment variables
3. Build Docker images
4. Deploy backend & frontend
5. Run database migrations
6. Set up monitoring & logging

---

## 📞 Support & Contributing

### Need Help?

1. **Documentation:** Check [`brain/BRAIN_NAVIGATION.md`](./brain/BRAIN_NAVIGATION.md)
2. **Contracts:** Review [`brain/shared_contracts/`](./brain/shared_contracts/)
3. **Architecture:** Read [`brain/architecture/`](./brain/architecture/)
4. **Issues:** Check project issues on GitHub

### Contributing

See [`brain/planning/PARALLEL_DEVELOPMENT_STRATEGY.md`](./brain/planning/PARALLEL_DEVELOPMENT_STRATEGY.md) for:
- Git branching strategy
- Code review process
- Testing requirements
- Documentation standards

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎯 Next Steps

### For New Developers
1. Read [`brain/BRAIN_NAVIGATION.md`](./brain/BRAIN_NAVIGATION.md)
2. Review [`brain/planning/QUICK_START_PARALLEL_DEV.md`](./brain/planning/QUICK_START_PARALLEL_DEV.md)
3. Check [`brain/PORTAL_DISTRIBUTION.md`](./brain/PORTAL_DISTRIBUTION.md) for your assignments
4. Study [`brain/shared_contracts/USAGE_GUIDE.md`](./brain/shared_contracts/USAGE_GUIDE.md)
5. Read your portal's documentation (e.g., `brain/01-bitflow-admin/README.md`)

### For Project Managers
1. Review [`brain/EXECUTIVE_SUMMARY.md`](./brain/EXECUTIVE_SUMMARY.md)
2. Track progress via [`brain/BRAIN_FOLDER_ORGANIZATION.md`](./brain/BRAIN_FOLDER_ORGANIZATION.md)
3. Check milestones in [`brain/PARALLEL_DEV_CHECKLIST.md`](./brain/PARALLEL_DEV_CHECKLIST.md)

---

**🧠 Remember: Everything you need is in the `brain/` folder!**

**Last Updated:** October 2024  
**Version:** 2.0.0  
**Maintainers:** Developer A & Developer B
