# Bitflow LMS - Complete Campus Management System

[![Version](https://img.shields.io/badge/version-2.0-blue.svg)](https://github.com/yourusername/bitflow-lms)
[![PHP](https://img.shields.io/badge/PHP-8.3-777BB4?logo=php)](https://www.php.net/)
[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?logo=laravel)](https://laravel.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

**Bitflow LMS** is an enterprise-grade, multi-tenant Campus Operating System designed for universities managing multiple colleges. Built with Laravel 11 and Next.js 16, it provides 14 specialized portals serving different user roles across academic, financial, and operational workflows.

## 🌟 Key Features

- **14 Specialized Portals** - Role-based interfaces for every stakeholder
- **Multi-Tenant Architecture** - Row-level isolation for secure university management
- **Real-Time Updates** - WebSocket-powered notifications and live data
- **Comprehensive Academic Management** - Courses, attendance, grades, assignments
- **Financial System** - Fee management, payments, accounting ledger
- **HR & Operations** - Staff management, payroll, leave tracking
- **Advanced Security** - JWT authentication, role-based permissions, audit logs
- **Scalable Design** - Supports 100,000+ users, 10,000+ concurrent sessions

## 🏗️ Architecture

### Technology Stack

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

### Project Structure

```
edu-bit/
├── backend/                    # Laravel 11 API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/   # API controllers
│   │   │   ├── Middleware/    # Auth, tenant isolation
│   │   │   └── Requests/      # Form validation
│   │   ├── Models/            # Eloquent models
│   │   ├── Services/          # Business logic layer
│   │   └── Policies/          # Authorization policies
│   ├── database/
│   │   ├── migrations/        # Database migrations
│   │   └── seeders/           # Sample data seeders
│   ├── routes/
│   │   └── api.php            # API routes
│   └── tests/                 # PHPUnit tests
│
├── frontend/                   # Next.js 16 Monorepo
│   ├── apps/                  # 14 Portal Applications
│   │   ├── bitflow-admin/     # Port 3001
│   │   ├── university-owner/  # Port 3002
│   │   ├── super-admin/       # Port 3003
│   │   ├── principal/         # Port 3004
│   │   ├── college-admin/     # Port 3005
│   │   ├── super-academics/   # Port 3006
│   │   ├── faculty-teacher/   # Port 3007
│   │   ├── student/           # Port 3008
│   │   ├── parent/            # Port 3009
│   │   ├── admission-admin/   # Port 3010
│   │   ├── super-accountant/  # Port 3011
│   │   ├── college-accounts-admin/  # Port 3012
│   │   ├── college-fee-admin/ # Port 3013
│   │   └── super-nt-manager/  # Port 3014
│   │
│   └── packages/              # Shared Libraries
│       ├── ui/                # Component library
│       ├── utils/             # Helper functions
│       └── types/             # TypeScript definitions
│
├── brain/                      # Complete documentation (196 files)
│   ├── master_db_schema.sql
│   ├── master_auth_system.md
│   ├── global_build_guide.md
│   └── [01-14]-portal/        # Portal-specific docs
│
├── docker-compose.yml
└── .env.example
```

## 📋 The 14 Portals

| # | Portal Name | Primary Role | Port | Description |
|---|------------|-------------|------|-------------|
| 01 | **Bitflow Admin** | Platform Owner | 3001 | Manage entire SaaS platform, create universities |
| 02 | **University Owner** | CEO/Chancellor | 3002 | Strategic oversight, executive dashboards |
| 03 | **Super Admin** | IT/Operations | 3003 | System configuration, user management |
| 04 | **Principal** | College Head | 3004 | College leadership, approvals |
| 05 | **College Admin** | Administrator | 3005 | Daily college operations |
| 06 | **Super Academics** | Academic Head | 3006 | Curriculum management, academic policies |
| 07 | **Faculty/Teacher** | Professor | 3007 | Teaching, grading, attendance |
| 08 | **Student** | Learner | 3008 | View grades, submit assignments, pay fees |
| 09 | **Parent** | Guardian | 3009 | Monitor child's academic progress |
| 10 | **Admission Admin** | Admissions | 3010 | Student admissions, enrollment |
| 11 | **Super Accountant** | CFO | 3011 | Financial oversight, budgeting |
| 12 | **College Accounts** | Accountant | 3012 | College-level finance |
| 13 | **College Fee Admin** | Fee Collector | 3013 | Fee collection, receipts |
| 14 | **Super NT Manager** | HR Manager | 3014 | Staff management, payroll |

## 🚀 Quick Start

### Prerequisites

- **PHP** 8.3+
- **Composer** 2.7+
- **Node.js** 20.x LTS
- **pnpm** 9.x
- **PostgreSQL** 16+
- **Redis** 7+
- **Docker** (optional but recommended)

### Installation

#### Option 1: Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/yourusername/bitflow-lms.git
cd bitflow-lms

# Copy environment file
cp .env.example .env

# Start all services
docker-compose up -d

# Access portals
# Backend API: http://localhost:8000/api
# Bitflow Admin: http://localhost:3001
# Student Portal: http://localhost:3008
# (See table above for all 14 portal URLs)
```

#### Option 2: Local Development

```bash
# 1. Setup Backend
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Generate JWT keys
mkdir -p storage/keys
openssl genrsa -out storage/keys/private.pem 4096
openssl rsa -in storage/keys/private.pem -pubout -out storage/keys/public.pem

# Setup database
createdb bitflow_lms
php artisan migrate --seed

# Start backend
php artisan serve  # http://localhost:8000

# 2. Setup Frontend (in new terminal)
cd frontend
pnpm install
pnpm dev  # Starts all 14 portals on ports 3001-3014
```

### Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@bitflow.edu | password |
| Faculty | faculty@bitflow.edu | password |
| Student | student@bitflow.edu | password |

## 📚 Documentation

Complete documentation is available in the `brain/` directory (196 files, 4.38 MB):

- **[HOW_TO_USE_THIS_BRAIN_FOLDER.md](brain/HOW_TO_USE_THIS_BRAIN_FOLDER.md)** - Start here!
- **[README.md](brain/README.md)** - System overview
- **[master_db_schema.sql](brain/master_db_schema.sql)** - Complete database schema
- **[master_auth_system.md](brain/master_auth_system.md)** - Authentication guide
- **[global_build_guide.md](brain/global_build_guide.md)** - Build instructions
- **Portal-specific docs** - 14 folders with complete specs for each portal

## 🧪 Testing

```bash
# Backend tests
cd backend
php artisan test
php artisan test --coverage

# Frontend tests
cd frontend
pnpm test
pnpm test:e2e
```

## 🔒 Security

- JWT-based authentication (RS256)
- Role-based access control (14 roles, 500+ permissions)
- Multi-tenant row-level security
- Audit logging for all mutations
- CORS protection
- Rate limiting
- SQL injection prevention (Eloquent ORM)
- XSS protection
- CSRF protection

## 📊 Performance

- **Target Scale**: 100,000+ users
- **Concurrent Sessions**: 10,000+
- **API Response Time**: P95 < 200ms
- **Page Load Time**: P95 < 2s
- **Database Queries**: P95 < 100ms

## 🤝 Contributing

This is an enterprise project. Please read the comprehensive documentation in the `brain/` folder before contributing.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with ❤️ for educational institutions worldwide.

---

**Version**: 2.0  
**Last Updated**: October 26, 2025  
**Status**: Phase 1 - Foundation (In Development)

For detailed implementation guide, see [brain/HOW_TO_USE_THIS_BRAIN_FOLDER.md](brain/HOW_TO_USE_THIS_BRAIN_FOLDER.md)
