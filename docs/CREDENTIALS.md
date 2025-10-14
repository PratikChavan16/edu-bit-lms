# 🔐 Portal Login Credentials

This document contains all the default login credentials for the BitFlow LMS system after running database seeders.

## 📋 Prerequisites

Make sure you've run the database seeders:
```bash
cd bitflow-core
php artisan migrate --seed
```

---

## 🎯 Portal URLs

- **Admin Portal**: http://localhost:3000
- **Faculty Portal**: http://localhost:3001 (if running)
- **Student Portal**: http://localhost:3002 (if running)

Backend API: http://localhost:8000

---

## 👥 User Credentials

### 1️⃣ **Bitflow Owner** (Super Admin)
**Highest level access - Can manage everything**

- **Username**: `bitflow_admin`
- **Email**: `admin@bitflow.nova`
- **Password**: `gMAP@2025?`
- **Role**: Bitflow Owner
- **Access**: All portals and system-wide settings

---

### 2️⃣ **College Owner / University Owner**
**University-level administration**

- **Username**: `college_123`
- **Email**: `owner@mvp.edu`
- **Password**: `cOLLEGE@123?`
- **Role**: University Owner
- **University**: Maratha Vidya Prasarak Samaj (MVP)
- **Access**: Admin portal, university management

---

### 3️⃣ **Principal / College Admin**
**College-level administration**

- **Username**: `principal_mvp`
- **Email**: `principal@mvp.edu`
- **Password**: `Principal@123`
- **Role**: College Admin
- **Name**: Dr. Rajesh Kumar
- **College**: MVP Engineering College
- **Access**: Admin portal, college management

---

### 4️⃣ **Faculty / Professor**
**Teaching staff access**

- **Username**: `prof_sharma`
- **Email**: `sharma@mvp.edu`
- **Password**: `Faculty@123`
- **Role**: Faculty
- **Name**: Prof. Suresh Sharma
- **Employee ID**: FAC001
- **Department**: Computer Science
- **Access**: Faculty portal

---

### 5️⃣ **Students** (5 demo accounts)
**Student portal access**

All students have the **same password**: `Student@123`

| # | Username | Email | Roll Number | Name |
|---|----------|-------|-------------|------|
| 1 | `student_mvp_1` | `student1@mvp.edu` | MVP2024CS1 | Student1 Kumar |
| 2 | `student_mvp_2` | `student2@mvp.edu` | MVP2024CS2 | Student2 Kumar |
| 3 | `student_mvp_3` | `student3@mvp.edu` | MVP2024CS3 | Student3 Kumar |
| 4 | `student_mvp_4` | `student4@mvp.edu` | MVP2024CS4 | Student4 Kumar |
| 5 | `student_mvp_5` | `student5@mvp.edu` | MVP2024CS5 | Student5 Kumar |

**Common Details:**
- **Course**: B.Tech Computer Science
- **Year**: 2
- **Section**: A
- **Access**: Student portal

---

## 🏛️ Demo Organization Structure

```
Maratha Vidya Prasarak Samaj (MVP University)
└── MVP Engineering College
    └── Computer Science Department
        ├── Faculty: Prof. Suresh Sharma
        └── Students: 5 students (Year 2, Section A)
```

---

## 🔑 Login Flow

### Admin Portal Login
1. Go to http://localhost:3000
2. Click "Login" or navigate to `/login`
3. Enter username/email and password
4. You'll be redirected to the dashboard

### Quick Access Recommendations

| Portal | Use This Account | Why |
|--------|------------------|-----|
| **Admin Portal** | `bitflow_admin` | Full system access, best for testing all features |
| **Faculty Portal** | `prof_sharma` | Test faculty features (attendance, grading, etc.) |
| **Student Portal** | `student_mvp_1` | Test student features (assignments, courses, etc.) |

---

## 🛡️ Security Notes

1. **Change passwords immediately** after deployment to production
2. All passwords follow complexity requirements:
   - Minimum 8 characters
   - Must contain letters, numbers, and symbols
   - Examples: `gMAP@2025?`, `Principal@123`

3. **Password Reset**: Admins can reset any user's password via:
   - Admin Portal → Users → [Select User] → Reset Password

---

## 🧪 Testing Authentication

### Test Login API (using cURL)
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "bitflow_admin",
    "password": "gMAP@2025?"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "id": "...",
    "username": "bitflow_admin",
    "email": "admin@bitflow.nova",
    "roles": [...]
  },
  "token": "1|...",
  "token_type": "Bearer"
}
```

---

## 📊 Role Permissions Overview

| Feature | Bitflow Owner | University Owner | College Admin | Faculty | Student |
|---------|--------------|------------------|---------------|---------|---------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Universities | ✅ | ✅ | ❌ | ❌ | ❌ |
| Colleges | ✅ | ✅ | ✅ | ❌ | ❌ |
| Users | ✅ | ✅ | ✅ | ❌ | ❌ |
| Departments | ✅ | ✅ | ✅ | ❌ | ❌ |
| Courses | ✅ | ✅ | ✅ | ✅ (view) | ✅ (view) |
| Assessments | ✅ | ✅ | ✅ | ✅ | ✅ (submit) |
| Attendance | ✅ | ✅ | ✅ | ✅ | ✅ (view) |
| Library | ✅ | ✅ | ✅ | ✅ | ✅ |
| Notices | ✅ | ✅ | ✅ | ✅ (create) | ✅ (view) |

---

## 🚨 Troubleshooting

### "Invalid credentials" error
- ✅ Check you're using the correct username (not email in some cases)
- ✅ Verify password is exactly as shown (case-sensitive)
- ✅ Ensure database is seeded: `php artisan migrate:fresh --seed`

### "Unauthenticated" error
- ✅ Backend must be running: `php artisan serve`
- ✅ Check `.env.local` has correct `NEXT_PUBLIC_API_BASE_URL`
- ✅ Clear browser cache/cookies

### Can't see data after login
- ✅ Ensure seeder ran successfully
- ✅ Check API routes are registered in `routes/api.php`
- ✅ Verify user has correct role assignments

---

## 📝 Quick Reference

**Most Common Credentials:**
```
Admin:   bitflow_admin / gMAP@2025?
Faculty: prof_sharma / Faculty@123
Student: student_mvp_1 / Student@123
```

**Database Seeder Location:**
```
bitflow-core/database/seeders/DemoDataSeeder.php
```

**Auth Controller:**
```
bitflow-core/app/Http/Controllers/Auth/AuthController.php
```

---

## 🔄 Reset Everything

If you need to start fresh:
```bash
cd bitflow-core
php artisan migrate:fresh --seed
```

This will:
1. Drop all tables
2. Re-run all migrations
3. Seed with fresh demo data
4. Recreate all users with default passwords

---

**Last Updated**: October 12, 2025  
**System**: BitFlow LMS - MVP Demo Environment
