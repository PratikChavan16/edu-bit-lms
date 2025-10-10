# 🚀 Quick Start Guide for Frontend Team
**Project:** EduBit LMS  
**Team:** 3 Frontend Developers  
**Date:** October 10, 2025

---

## 📖 HOW TO USE THIS DOCUMENTATION

You now have 4 comprehensive documents:

1. **`FRONTEND_TEAM_WORK_PLAN.md`** (Main Document - 100+ pages)
   - Detailed page-by-page specifications
   - API integration examples
   - Component requirements
   - Testing strategies

2. **`TEAM_DIVISION_SUMMARY.md`** (Quick Reference - 15 pages)
   - High-level overview
   - Visual team structure
   - Weekly milestones
   - Success criteria

3. **`PAGES_ALLOCATION_MATRIX.md`** (Detailed Spreadsheet - 30 pages)
   - Complete page list (84+ pages)
   - Time estimates per page
   - Complexity ratings
   - Workload balancing

4. **`QUICK_START_GUIDE.md`** (This Document)
   - Day 1 setup instructions
   - Development workflow
   - Common commands

---

## 🎯 YOUR ROLE

### If You're Developer 1 (Student & Parent Portals)
**Read:** `FRONTEND_TEAM_WORK_PLAN.md` → Section "DEVELOPER 1"
**Focus:** User experience, data visualization
**Start With:** Login page → Student Dashboard → Library

### If You're Developer 2 (Admin Portals)
**Read:** `FRONTEND_TEAM_WORK_PLAN.md` → Section "DEVELOPER 2"
**Focus:** Complex forms, data tables, bulk operations
**Start With:** Super Admin Dashboard → Universities → Students

### If You're Developer 3 (Faculty & Components)
**Read:** `FRONTEND_TEAM_WORK_PLAN.md` → Section "DEVELOPER 3"
**Focus:** Reusable components, assessment builder
**Start With:** Authentication flow → Basic UI components

---

## ⚡ DAY 1 - INITIAL SETUP (All Developers)

### Step 1: Clone Repository
```bash
cd ~/projects
git clone https://github.com/PratikChavan16/edu-bit-lms.git
cd edu-bit-lms
```

### Step 2: Install Dependencies
```bash
# Install Node.js 22+ if not already installed
node --version  # Should be v22.x.x

# Install pnpm if not installed
npm install -g pnpm

# Install all dependencies
cd bitflow-frontend
pnpm install
```

### Step 3: Environment Setup
```bash
# Setup Admin Portal
cd apps/admin
cp .env.example .env.local
nano .env.local  # Edit: NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Setup Learner Portal
cd ../learner
cp .env.example .env.local
nano .env.local  # Edit: NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Setup Faculty Portal (if you're D3)
cd ../faculty
cp .env.example .env.local
nano .env.local  # Edit: NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Setup Parent Portal (if needed)
cd ../parent
cp .env.example .env.local
nano .env.local  # Edit: NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Step 4: Start Backend (Terminal 1)
```bash
cd ~/projects/edu-bit-lms/bitflow-core
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve  # Runs on http://localhost:8000
```

### Step 5: Start Frontend Dev Servers

**Developer 1 (Terminal 2):**
```bash
cd ~/projects/edu-bit-lms/bitflow-frontend
pnpm --filter learner dev  # http://localhost:3001
```

**Developer 2 (Terminal 3):**
```bash
cd ~/projects/edu-bit-lms/bitflow-frontend
pnpm --filter admin dev  # http://localhost:3000
```

**Developer 3 (Terminal 4):**
```bash
cd ~/projects/edu-bit-lms/bitflow-frontend
pnpm --filter faculty dev  # http://localhost:3002
```

### Step 6: Verify Setup
Open browser:
- Admin Portal: http://localhost:3000
- Learner Portal: http://localhost:3001
- Faculty Portal: http://localhost:3002
- Backend API: http://localhost:8000/api/health

---

## 📁 PROJECT STRUCTURE OVERVIEW

```
edu-bit-lms/
├── bitflow-core/                 # Laravel Backend (PHP)
│   ├── app/
│   │   ├── Http/Controllers/    # API Controllers
│   │   ├── Models/              # Database Models
│   │   └── Services/            # Business Logic
│   ├── routes/api.php           # API Routes
│   └── database/
│       ├── migrations/          # Database Schema
│       └── seeders/             # Test Data
│
├── bitflow-frontend/            # Next.js Frontend (TypeScript)
│   ├── apps/
│   │   ├── admin/               # Super Admin Portal
│   │   │   ├── app/            # Next.js 15 App Router
│   │   │   │   ├── page.tsx    # Login page
│   │   │   │   ├── dashboard/  # Dashboard pages
│   │   │   │   └── ...
│   │   │   ├── components/     # Page-specific components
│   │   │   └── lib/            # Utilities
│   │   │
│   │   ├── learner/            # Student Portal (same structure)
│   │   ├── faculty/            # Faculty Portal (same structure)
│   │   └── parent/             # Parent Portal (same structure)
│   │
│   └── packages/
│       ├── ui/                 # Shared UI Components
│       │   └── src/
│       │       ├── button.tsx
│       │       ├── card.tsx
│       │       ├── data-table.tsx
│       │       └── ...
│       │
│       └── api-client/         # Shared API Client
│           └── src/
│               ├── client.ts   # Axios instance
│               ├── auth.ts     # Auth endpoints
│               └── ...
│
└── docs/                       # Documentation
    ├── FRONTEND_TEAM_WORK_PLAN.md
    ├── TEAM_DIVISION_SUMMARY.md
    └── PAGES_ALLOCATION_MATRIX.md
```

---

## 💻 DEVELOPMENT WORKFLOW

### Daily Workflow
```bash
# 1. Pull latest changes
git pull origin main

# 2. Create feature branch
git checkout -b feature/D1-student-dashboard
# or
git checkout -b feature/D2-admin-universities
# or
git checkout -b feature/D3-auth-flow

# 3. Start dev server (if not running)
pnpm --filter learner dev  # or admin, faculty

# 4. Make changes
# Edit files in apps/learner/app/... or apps/admin/app/...

# 5. Test locally
# Visit http://localhost:3001 (or 3000, 3002)

# 6. Run linter
pnpm lint

# 7. Run tests
pnpm test

# 8. Commit changes
git add .
git commit -m "feat: Add student dashboard with attendance graph"

# 9. Push to GitHub
git push origin feature/D1-student-dashboard

# 10. Create Pull Request on GitHub
# Go to https://github.com/PratikChavan16/edu-bit-lms
# Click "Compare & pull request"
# Add description and screenshots
# Request review from teammate
```

---

## 🔧 COMMON COMMANDS

### Install New Package
```bash
# Install in specific app
cd bitflow-frontend
pnpm --filter learner add axios

# Install in shared UI package
pnpm --filter @bitflow/ui add lucide-react

# Install in all workspaces
pnpm add -w typescript
```

### Create New Page
```bash
# Example: Create library page in learner portal
cd bitflow-frontend/apps/learner/app
mkdir library
touch library/page.tsx

# Edit library/page.tsx:
# 'use client';
# export default function LibraryPage() {
#   return <div>Library Page</div>;
# }
```

### Create New Component
```bash
# Example: Create AttendanceGraph component in shared UI
cd bitflow-frontend/packages/ui/src
touch attendance-graph.tsx

# Edit attendance-graph.tsx (see examples in FRONTEND_TEAM_WORK_PLAN.md)
```

### Run Tests
```bash
# Run all tests
pnpm test

# Run tests for specific app
pnpm --filter learner test

# Run tests in watch mode
pnpm --filter learner test:watch
```

### Build for Production
```bash
# Build all apps
pnpm build

# Build specific app
pnpm --filter learner build
```

---

## 🌐 API TESTING

### Using Browser DevTools
1. Open http://localhost:3001
2. Open DevTools (F12)
3. Go to Network tab
4. Click around the app
5. See API requests/responses

### Using Postman/Insomnia
1. Import OpenAPI specs from `bitflow-core/docs/contracts/`
2. Set base URL: `http://localhost:8000/api`
3. Test endpoints before building UI

### Login to Get Token
```bash
# POST http://localhost:8000/api/auth/login
{
  "email": "student@example.com",
  "password": "password"
}

# Response:
{
  "token": "1|abc123...",
  "user": { ... }
}

# Use token in subsequent requests:
# Authorization: Bearer 1|abc123...
```

---

## 🎨 STYLING GUIDE

### Tailwind CSS Classes
```tsx
// Page container
<div className="container mx-auto p-6">

// Card
<div className="bg-white rounded-lg shadow p-6">

// Button
<button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">

// Grid layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Typography
<h1 className="text-3xl font-bold mb-4">
<p className="text-base text-gray-700">
```

### Responsive Design
```tsx
// Mobile first approach
<div className="
  grid 
  grid-cols-1        // Mobile: 1 column
  md:grid-cols-2     // Tablet: 2 columns
  lg:grid-cols-3     // Desktop: 3 columns
  gap-4
">
```

---

## 🐛 DEBUGGING TIPS

### API Not Working?
```typescript
// Check API base URL
console.log(process.env.NEXT_PUBLIC_API_URL);

// Check if backend is running
// Visit http://localhost:8000/api/health

// Check CORS
// Backend should allow http://localhost:3000, 3001, 3002
```

### Component Not Rendering?
```typescript
// Add console.log to check data
console.log('Dashboard data:', data);

// Check for errors in browser console (F12)

// Verify API response format matches TypeScript types
```

### Styling Not Working?
```bash
# Restart dev server
# Press Ctrl+C to stop
pnpm --filter learner dev

# Clear browser cache
# Ctrl+Shift+R (hard refresh)
```

---

## 📝 CODE REVIEW CHECKLIST

Before creating Pull Request:
- [ ] Code compiles (`pnpm build`)
- [ ] No TypeScript errors (`pnpm type-check`)
- [ ] No ESLint warnings (`pnpm lint`)
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] API integration working
- [ ] Loading states added
- [ ] Error handling implemented
- [ ] Tests written (if applicable)
- [ ] Screenshots added to PR description

---

## 🤝 TEAM COMMUNICATION

### Daily Stand-up (10 AM)
Answer 3 questions:
1. What did I complete yesterday?
2. What am I working on today?
3. Any blockers?

### Slack Channels
- `#frontend-team` - General discussions
- `#api-integration` - Backend API questions
- `#design-system` - UI component discussions
- `#bugs` - Bug reports

### When Stuck
1. Check documentation first
2. Ask in Slack channel
3. Pair program with teammate
4. Create GitHub issue if it's a bug

---

## 📚 LEARNING RESOURCES

### Essential Reading
1. **Project Docs:**
   - `FRONTEND_TEAM_WORK_PLAN.md` (your assigned section)
   - `FRONTEND_INTEGRATION_GUIDE.md` (API reference)
   - `FRONTEND_DEVELOPMENT_GUIDE.md` (component examples)

2. **External Docs:**
   - [Next.js 15 Docs](https://nextjs.org/docs)
   - [React 19 Docs](https://react.dev)
   - [Tailwind CSS](https://tailwindcss.com/docs)
   - [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### Video Tutorials
- Next.js 15 App Router: https://www.youtube.com/watch?v=...
- TypeScript for React: https://www.youtube.com/watch?v=...
- Tailwind CSS Crash Course: https://www.youtube.com/watch?v=...

---

## 🎯 WEEK 1 GOALS

### Developer 1
- [ ] Day 1: Setup complete, login page started
- [ ] Day 2-3: Login page complete, dashboard started
- [ ] Day 4-5: Dashboard with attendance graph complete

### Developer 2
- [ ] Day 1: Setup complete, admin dashboard started
- [ ] Day 2-3: Admin dashboard complete
- [ ] Day 4-5: Universities list page started

### Developer 3
- [ ] Day 1: Setup complete, auth flow research
- [ ] Day 2-3: Authentication system complete
- [ ] Day 4-5: Basic UI components (Button, Input, Card) complete

---

## 🚨 IMPORTANT NOTES

### Backend Dependency
- Backend must be running for frontend to work
- Backend API: http://localhost:8000
- If backend is down, frontend will show errors

### Test Data
- Backend has seed data for testing
- Test student login: student@example.com / password
- Test admin login: admin@example.com / password

### Git Workflow
- Always pull before starting work: `git pull origin main`
- Never commit directly to `main` branch
- Always create feature branch
- Always get code review before merging

### Code Quality
- Write clean, readable code
- Add comments for complex logic
- Follow TypeScript best practices
- Use meaningful variable names

---

## 🎉 YOU'RE READY!

### Next Steps:
1. ✅ Read this guide completely
2. ✅ Complete Day 1 setup
3. ✅ Read your section in `FRONTEND_TEAM_WORK_PLAN.md`
4. ✅ Start coding!

### Questions?
- Check `FRONTEND_TEAM_WORK_PLAN.md` first
- Ask in `#frontend-team` Slack channel
- Create GitHub issue if it's a bug
- Pair program with teammate

---

**Good luck! Let's build an amazing LMS! 🚀**

---

**Document Version:** 1.0  
**Last Updated:** October 10, 2025  
**Status:** Ready for Team Onboarding
