# 🎨 Frontend Development Guide - EduBit LMS
**For:** Frontend Development Team  
**Date:** October 9, 2025  
**Version:** 1.0  
**Project:** EduBit Learning Management System

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Portal Structure](#portal-structure)
3. [Technology Stack](#technology-stack)
4. [Design System](#design-system)
5. [API Integration Guidelines](#api-integration-guidelines)
6. [Page-by-Page Specifications](#page-by-page-specifications)
7. [Component Library](#component-library)
8. [Code Organization](#code-organization)
9. [Testing Requirements](#testing-requirements)
10. [Deployment Checklist](#deployment-checklist)

---

## 🎯 Project Overview

### What We're Building
A modern, multi-tenant Learning Management System with **5 distinct user portals**:
1. **Super Admin Portal** (System-wide management)
2. **College Admin Portal** (College operations)
3. **Faculty Portal** (Teaching & attendance)
4. **Student Portal** (Learning & submissions)
5. **Parent Portal** (View-only monitoring)

### Current Status
- ✅ Backend API: 72% complete, 65 endpoints live
- ✅ Authentication: Fully functional with Sanctum tokens
- 🟡 Admin Portal: 11% complete (login only)
- 🟡 Student Portal: 12.5% complete (login + partial dashboard)
- ❌ Other Portals: 0% (not started)

### Your Mission
Build **45+ pages across 5 portals** that integrate seamlessly with our Laravel backend API.

---

## 🏢 Portal Structure

### 1. **Super Admin Portal** (`/admin`)
**Users:** Bitflow Nova team members  
**Access Level:** Full system control  
**Main Focus:** University management, billing, system health

#### Pages to Build (9 pages)
```
/admin
├── /login (✅ DONE)
├── /dashboard (🟡 40% - needs API integration)
├── /universities (❌ 0%)
│   ├── /[id] (university details)
│   └── /[id]/colleges (list colleges)
├── /feature-toggles (❌ 0%)
├── /audit-log (❌ 0%)
├── /backups (❌ 0%)
├── /billing (❌ 0%)
├── /invoices (❌ 0%)
└── /change-requests (❌ 0%)
```

#### Key Features
- University CRUD operations
- College monitoring & provisioning
- Feature flag management
- System-wide audit logs
- Billing & invoice generation
- Backup management

---

### 2. **College Admin Portal** (`/college-admin`)
**Users:** College administrators  
**Access Level:** Single college management  
**Main Focus:** Student/faculty management, fees, academics

#### Pages to Build (15 pages)
```
/college-admin
├── /login (shared with /admin)
├── /dashboard (❌ 0%)
│   ├── Student count, enrollment trends
│   ├── Fee collection status
│   ├── Attendance overview
│   └── Recent activities
├── /students (❌ 0%)
│   ├── / (list with filters)
│   ├── /[id] (student profile)
│   ├── /import (bulk upload)
│   └── /create (add new)
├── /faculty (❌ 0%)
│   ├── / (list with filters)
│   ├── /[id] (faculty profile)
│   └── /create (add new)
├── /departments (❌ 0%)
├── /fees (❌ 0%)
│   ├── /structures (fee configuration)
│   ├── /invoices (all invoices)
│   ├── /payments (payment records)
│   └── /reports (collection reports)
├── /library (❌ 0%)
│   ├── /resources (manage resources)
│   ├── /categories (organize content)
│   └── /approval-queue (pending uploads)
├── /timetable (❌ 0%)
│   ├── /schedule (view & edit)
│   ├── /conflicts (detect issues)
│   └── /exceptions (holidays, events)
├── /attendance (❌ 0%)
│   ├── /overview (college-wide stats)
│   ├── /corrections (approve requests)
│   └── /reports (monthly reports)
├── /assessments (❌ 0%)
│   ├── /list (all assessments)
│   ├── /results (grade management)
│   └── /analytics (performance insights)
├── /documents (❌ 0%)
│   ├── /folders (organize by type)
│   ├── /verification (review uploads)
│   └── /archive (old documents)
├── /announcements (❌ 0%)
│   ├── /create (compose)
│   ├── /schedule (future posts)
│   └── /analytics (read stats)
└── /analytics (❌ 0%)
    ├── /students (performance trends)
    ├── /faculty (workload analysis)
    ├── /fees (collection insights)
    └── /library (usage statistics)
```

#### Key Features
- Student/faculty management with bulk import
- Fee structure configuration & invoice generation
- Library resource approval workflow
- Timetable creation with conflict detection
- Attendance correction approval
- Assessment result management
- Document verification system
- Announcement broadcasting
- Rich analytics dashboards

---

### 3. **Faculty Portal** (`/faculty`)
**Users:** Teachers  
**Access Level:** Class & content management  
**Main Focus:** Attendance, assessments, teaching materials

#### Pages to Build (10 pages)
```
/faculty
├── /login (shared)
├── /dashboard (❌ 0%)
│   ├── Today's schedule
│   ├── Upcoming assessments
│   ├── Attendance summary
│   └── Recent announcements
├── /timetable (❌ 0%)
│   ├── /weekly (my schedule)
│   └── /exceptions (request changes)
├── /attendance (❌ 0%)
│   ├── /mark (mark attendance)
│   ├── /history (past records)
│   ├── /corrections (request corrections)
│   └── /reports (generate reports)
├── /assessments (❌ 0%)
│   ├── / (my assessments)
│   ├── /create (new assessment)
│   ├── /[id] (view/edit)
│   ├── /[id]/questions (manage questions)
│   ├── /[id]/submissions (student submissions)
│   └── /[id]/grading (grade submissions)
├── /library (❌ 0%)
│   ├── /my-uploads (my resources)
│   ├── /upload (add new resource)
│   └── /browse (all resources)
├── /students (❌ 0%)
│   ├── /classes (my classes)
│   └── /[id] (student details)
└── /profile (❌ 0%)
```

#### Key Features
- Weekly timetable view (calendar component)
- Quick attendance marking (bulk actions)
- Assessment builder with question bank
- Submission grading interface
- Resource upload with preview
- Student performance tracking
- Leave request system

---

### 4. **Student Portal** (`/learner`)
**Users:** Students  
**Access Level:** View & submit  
**Main Focus:** Learning, submissions, self-service

#### Pages to Build (10 pages)
```
/learner
├── /login (✅ DONE)
├── /dashboard (🟡 40%)
│   ├── Attendance graph (last 30 days)
│   ├── Fee status widget
│   ├── Upcoming assessments
│   ├── Today's timetable
│   └── Recent announcements
├── /timetable (❌ 0%)
│   ├── /weekly (my schedule)
│   └── /daily (today's classes)
├── /assessments (❌ 0%)
│   ├── / (available assessments)
│   ├── /[id] (assessment details)
│   ├── /[id]/attempt (take assessment)
│   ├── /[id]/result (view grade)
│   └── /history (past assessments)
├── /attendance (❌ 0%)
│   ├── /summary (monthly view)
│   ├── /details (day-by-day)
│   └── /certificates (download proof)
├── /library (❌ 0%)
│   ├── /browse (search resources)
│   ├── /bookmarks (saved items)
│   └── /[id] (view/download)
├── /documents (❌ 0%)
│   ├── /folders (my documents)
│   ├── /upload (submit document)
│   └── /status (verification status)
├── /fees (❌ 0%)
│   ├── /invoices (all invoices)
│   ├── /[id] (invoice details)
│   ├── /payments (payment history)
│   └── /summary (financial summary)
├── /announcements (❌ 0%)
│   ├── / (all announcements)
│   └── /[id] (announcement details)
├── /profile (❌ 0%)
│   ├── /personal (basic info)
│   ├── /academic (course details)
│   ├── /settings (preferences)
│   └── /password (change password)
└── /support (❌ 0%)
    ├── /tickets (raise issues)
    └── /faq (help center)
```

#### Key Features
- Interactive attendance graph (Recharts/Chart.js)
- Real-time fee status with payment history
- Assessment taking interface with timer
- Resource browsing with filters
- Document upload with preview
- Mobile-responsive timetable
- Notification center
- Dark mode support

---

### 5. **Parent Portal** (`/parent`)
**Users:** Parents/Guardians  
**Access Level:** Read-only  
**Main Focus:** Monitoring child's progress

#### Pages to Build (6 pages)
```
/parent
├── /login (shared)
├── /dashboard (❌ 0%)
│   ├── Child selector (if multiple children)
│   ├── Attendance summary
│   ├── Latest grades
│   ├── Fee status
│   └── Recent announcements
├── /attendance (❌ 0%)
│   ├── /summary (monthly view)
│   └── /report (download)
├── /assessments (❌ 0%)
│   ├── / (all results)
│   └── /[id] (result details)
├── /fees (❌ 0%)
│   ├── /invoices (all invoices)
│   └── /[id] (invoice details)
├── /announcements (❌ 0%)
└── /profile (❌ 0%)
```

#### Key Features
- Multi-child switcher
- Read-only views of student data
- Fee invoice viewing
- Announcement notifications
- Performance reports
- Contact college admin

---

## 💻 Technology Stack

### Core Framework
```json
{
  "framework": "Next.js 14 (App Router)",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "stateManagement": "React Context / Zustand",
  "apiClient": "Axios (with interceptors)",
  "formHandling": "React Hook Form + Zod",
  "charts": "Recharts or Chart.js",
  "dateHandling": "date-fns",
  "icons": "Lucide Icons",
  "components": "Radix UI + Custom Components"
}
```

### Project Structure
```
bitflow-frontend/
├── apps/
│   ├── admin/           # Super Admin portal
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx (login)
│   │   │   ├── dashboard/
│   │   │   ├── universities/
│   │   │   └── ...
│   │   └── components/
│   ├── college-admin/   # College Admin portal (NEW)
│   ├── faculty/         # Faculty portal (NEW)
│   ├── learner/         # Student portal
│   └── parent/          # Parent portal (NEW)
├── packages/
│   ├── api-client/      # Shared API client
│   │   ├── src/
│   │   │   ├── client.ts
│   │   │   ├── auth.ts
│   │   │   ├── students.ts
│   │   │   ├── assessments.ts
│   │   │   └── ...
│   │   └── types/       # TypeScript types from backend
│   └── ui/              # Shared component library
│       ├── src/
│       │   ├── button.tsx
│       │   ├── card.tsx
│       │   ├── chart.tsx (NEW)
│       │   ├── calendar.tsx (NEW)
│       │   ├── file-upload.tsx (NEW)
│       │   └── ...
│       └── tailwind-preset.ts
└── docs/
    └── design/
        ├── STYLE_GUIDE.md
        └── frontend-design-spec.txt
```

---

## 🎨 Design System

### Colors (Use Tailwind Utility Classes)
```css
/* Primary Brand */
--primary: 263 70% 50%;      /* Blue - CTA buttons */
--primary-foreground: 0 0% 100%;

/* Neutral Grays */
--background: 0 0% 100%;      /* Page background */
--foreground: 222 47% 11%;    /* Text color */
--muted: 210 40% 96%;         /* Subtle backgrounds */
--muted-foreground: 215 16% 47%;

/* Status Colors */
--success: 142 71% 45%;       /* Green - success states */
--warning: 38 92% 50%;        /* Orange - warnings */
--destructive: 0 84% 60%;     /* Red - errors */
--info: 199 89% 48%;          /* Blue - info messages */
```

### Typography
```tsx
// Headings
<h1 className="text-3xl font-bold">Page Title</h1>
<h2 className="text-2xl font-semibold">Section Title</h2>
<h3 className="text-xl font-medium">Subsection</h3>

// Body text
<p className="text-base">Regular paragraph text</p>
<p className="text-sm text-muted-foreground">Secondary text</p>

// Labels
<label className="text-sm font-medium">Input Label</label>
```

### Spacing
Use Tailwind's spacing scale: `p-4`, `m-6`, `gap-3`, etc.
- Extra small: 2 (0.5rem / 8px)
- Small: 4 (1rem / 16px)
- Medium: 6 (1.5rem / 24px)
- Large: 8 (2rem / 32px)

### Component Patterns

#### Card Pattern
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Optional subtitle</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Main content */}
  </CardContent>
  <CardFooter>
    {/* Actions */}
  </CardFooter>
</Card>
```

#### Form Pattern
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" {...register('email')} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
        <Button type="submit">Login</Button>
      </div>
    </form>
  );
}
```

#### Table Pattern
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead>Actions</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map((item) => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
        <TableCell>{item.email}</TableCell>
        <TableCell>
          <Button variant="ghost" size="sm">Edit</Button>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

---

## 🔌 API Integration Guidelines

### 1. **API Client Setup** (`packages/api-client/src/client.ts`)

```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor: Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add college_id to query params if available
    const collegeId = localStorage.getItem('college_id');
    if (collegeId && !config.params?.college_id) {
      config.params = { ...config.params, college_id: collegeId };
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle errors & token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refresh_token: refreshToken });
        localStorage.setItem('auth_token', data.token);
        
        // Retry original request
        error.config.headers.Authorization = `Bearer ${data.token}`;
        return apiClient.request(error.config);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.clear();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

### 2. **Backend API Endpoints Reference**

#### Authentication (`/api/auth`)
```typescript
// POST /api/auth/login
interface LoginRequest {
  login: string;    // email or username
  password: string;
  device_name?: string;
}

interface LoginResponse {
  success: true;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      roles: Array<{ name: string; college_id: string }>;
    };
  };
}

// POST /api/auth/logout
// GET /api/auth/me
// POST /api/auth/refresh
// POST /api/auth/change-password
```

#### Students (`/api/admin/students`)
```typescript
// GET /api/admin/students?college_id=xxx&page=1&per_page=20&course=BSc&year=2
interface StudentsListResponse {
  success: true;
  data: {
    data: Array<{
      id: string;
      name: string;
      email: string;
      enrollment_number: string;
      course: string;
      year: number;
      status: 'active' | 'inactive' | 'graduated';
    }>;
    current_page: number;
    per_page: number;
    total: number;
  };
}

// GET /api/admin/students/{id}
// POST /api/admin/students (create)
// PATCH /api/admin/students/{id} (update)
```

#### Assessments (`/api/faculty/assessments`)
```typescript
// POST /api/faculty/assessments?college_id=xxx
interface CreateAssessmentRequest {
  title: string;
  type: 'mcq' | 'saq' | 'laq' | 'practical' | 'project';
  subject: string;
  course: string;
  year: number;  // 1-6 (academic year level, NOT calendar year)
  total_marks: number;
  passing_marks: number;
  duration_minutes?: number;
  starts_at?: string;  // ISO 8601 datetime
  ends_at?: string;
  submission_type: 'typed' | 'upload' | 'both';
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'archived';
  questions?: Array<{
    question_number: number;
    question_text: string;
    options?: string[];  // For MCQ
    correct_answer?: string;
    marks: number;
  }>;
}

// GET /api/faculty/assessments?college_id=xxx
// PATCH /api/faculty/assessments/{id}
// DELETE /api/faculty/assessments/{id}
// GET /api/faculty/assessments/{id}/submissions
```

#### Fees (`/api/admin/fees`)
```typescript
// POST /api/admin/fees/structures?college_id=xxx
interface CreateFeeStructureRequest {
  course: string;
  year: number;  // 1-6 (academic year)
  component_name: string;  // 'Tuition Fee', 'Lab Fee', etc.
  amount: number;
  frequency: 'annual' | 'semester' | 'monthly';
  effective_from: string;  // YYYY-MM-DD
  effective_to?: string;
}

// GET /api/admin/fees/invoices?college_id=xxx&student_id=xxx
// POST /api/admin/fees/invoices/{id}/payments (record payment)
```

#### Timetable (`/api/admin/timetable`)
```typescript
// POST /api/admin/timetable?college_id=xxx
interface CreateTimetableBlockRequest {
  subject: string;
  course: string;
  year: number;  // 1-6
  section?: string;  // 'A', 'B', etc.
  faculty_id: string;
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';
  start_time: string;  // HH:mm format (e.g., '09:00')
  end_time: string;
  location?: string;  // Room number
  type?: 'lecture' | 'lab' | 'tutorial' | 'exam' | 'other';
  effective_from: string;  // YYYY-MM-DD
  effective_to?: string;
}

// GET /api/admin/timetable?college_id=xxx&course=BSc&year=2
// PATCH /api/admin/timetable/{id}
// DELETE /api/admin/timetable/{id}
```

#### Library (`/api/admin/library/resources`)
```typescript
// POST /api/admin/library/resources?college_id=xxx
interface CreateLibraryResourceRequest {
  title: string;
  type: 'book' | 'notes' | 'video' | 'assignment' | 'question_paper' | 'reference';
  subject: string;
  course: string;
  year: number;  // 1-6
  file_url: string;
  description?: string;
}

// GET /api/admin/library/resources?college_id=xxx&type=book
// POST /api/admin/library/resources/{id}/approve
```

#### Documents (`/api/admin/documents`)
```typescript
// POST /api/admin/documents?college_id=xxx
interface CreateDocumentRequest {
  folder_id: string;
  name: string;
  file_url: string;
  description?: string;
  visibility: 'public' | 'private';
}

// POST /api/admin/documents/{id}/verify
interface VerifyDocumentRequest {
  verification_status: 'verified' | 'rejected';
  rejection_reason?: string;
}

// GET /api/learner/documents (student view)
```

### 3. **API Service Layer Example** (`packages/api-client/src/students.ts`)

```typescript
import { apiClient } from './client';
import type { StudentsListResponse, Student } from './types';

export const studentsApi = {
  /**
   * Get paginated list of students
   */
  list: async (params: {
    college_id: string;
    page?: number;
    per_page?: number;
    course?: string;
    year?: number;
    search?: string;
  }): Promise<StudentsListResponse> => {
    const { data } = await apiClient.get('/admin/students', { params });
    return data;
  },

  /**
   * Get single student by ID
   */
  getById: async (id: string): Promise<{ success: true; data: Student }> => {
    const { data } = await apiClient.get(`/admin/students/${id}`);
    return data;
  },

  /**
   * Create new student
   */
  create: async (student: Partial<Student>): Promise<{ success: true; data: Student }> => {
    const { data } = await apiClient.post('/admin/students', student);
    return data;
  },

  /**
   * Update existing student
   */
  update: async (id: string, updates: Partial<Student>): Promise<{ success: true; data: Student }> => {
    const { data } = await apiClient.patch(`/admin/students/${id}`, updates);
    return data;
  },
};
```

### 4. **Using API in Components**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { studentsApi } from '@/packages/api-client';
import type { Student } from '@/packages/api-client/types';

export function StudentsListPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true);
        const response = await studentsApi.list({
          college_id: 'xxx',  // Get from context/storage
          page: 1,
          per_page: 20,
        });
        setStudents(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load students');
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <h1>Students</h1>
      <Table>
        {/* Render students */}
      </Table>
    </div>
  );
}
```

### 5. **Error Handling Best Practices**

```tsx
import { toast } from 'sonner';  // or your toast library

async function handleSubmit(data: FormData) {
  try {
    await studentsApi.create(data);
    toast.success('Student created successfully!');
    router.push('/students');
  } catch (error: any) {
    if (error.response?.status === 422) {
      // Validation errors
      const errors = error.response.data.errors;
      Object.entries(errors).forEach(([field, messages]) => {
        toast.error(`${field}: ${messages[0]}`);
      });
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else {
      toast.error('Something went wrong. Please try again.');
    }
    console.error('Create student error:', error);
  }
}
```

---

## 📄 Page-by-Page Specifications

### Example: Student Dashboard (`/learner/dashboard`)

#### User Story
As a student, I want to see my daily schedule, attendance status, pending assessments, and recent announcements on my dashboard so I can stay organized.

#### UI Components
```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/packages/ui/card';
import { AttendanceGraph } from '@/components/AttendanceGraph';
import { FeeStatusWidget } from '@/components/FeeStatusWidget';
import { TimetableWidget } from '@/components/TimetableWidget';
import { AnnouncementsWidget } from '@/components/AnnouncementsWidget';

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Banner */}
      <Card>
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Here's what's happening today</p>
        </CardContent>
      </Card>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AttendanceGraph />
        <FeeStatusWidget />
        <Card>
          <CardHeader>
            <CardTitle>Pending Assessments</CardTitle>
          </CardHeader>
          <CardContent>{/* List upcoming assessments */}</CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <TimetableWidget />

      {/* Recent Announcements */}
      <AnnouncementsWidget />
    </div>
  );
}
```

#### API Calls Needed
```typescript
// 1. Fetch user profile
GET /api/auth/me

// 2. Fetch attendance data (last 30 days)
GET /api/learner/profile/attendance?days=30

// 3. Fetch fee status
GET /api/learner/fees/summary

// 4. Fetch upcoming assessments
GET /api/learner/assessments?status=active&sort=starts_at

// 5. Fetch today's timetable
GET /api/learner/profile/timetable?date=2025-10-09

// 6. Fetch recent announcements
GET /api/learner/announcements?limit=5&sort=-published_at
```

#### Data Transformations
```typescript
// Transform attendance data for chart
interface AttendanceData {
  date: string;
  status: 'present' | 'absent' | 'late';
}

function transformAttendanceForChart(data: AttendanceData[]) {
  return data.map((record) => ({
    date: format(new Date(record.date), 'MMM dd'),
    value: record.status === 'present' ? 1 : 0,
    color: record.status === 'present' ? '#10b981' : '#ef4444',
  }));
}
```

#### Loading & Error States
```tsx
if (loading) {
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-3 gap-6">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}

if (error) {
  return (
    <div className="container mx-auto p-6">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    </div>
  );
}
```

---

## 🧩 Component Library Requirements

### Components to Build (Priority Order)

#### 1. **AttendanceGraph** (HIGH PRIORITY)
**Location:** `/packages/ui/src/attendance-graph.tsx`  
**Purpose:** Display student attendance over time

```tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface AttendanceGraphProps {
  data: Array<{ date: string; present: number; total: number }>;
}

export function AttendanceGraph({ data }: AttendanceGraphProps) {
  const chartData = data.map((d) => ({
    date: format(new Date(d.date), 'MMM dd'),
    percentage: (d.present / d.total) * 100,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance (Last 30 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => `${value}%`} />
            <Line type="monotone" dataKey="percentage" stroke="hsl(var(--primary))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

#### 2. **FileUpload** (HIGH PRIORITY)
**Location:** `/packages/ui/src/file-upload.tsx`  
**Purpose:** Drag-and-drop file upload with preview

```tsx
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X } from 'lucide-react';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  maxSize?: number;  // in bytes
  multiple?: boolean;
}

export function FileUpload({ onUpload, accept, maxSize = 10485760, multiple = false }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    onUpload(acceptedFiles);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition',
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        {isDragActive ? (
          <p>Drop files here...</p>
        ) : (
          <div>
            <p className="font-medium">Drag & drop files here</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded">
              <File className="h-4 w-4" />
              <span className="flex-1 text-sm">{file.name}</span>
              <span className="text-sm text-muted-foreground">{formatFileSize(file.size)}</span>
              <Button variant="ghost" size="sm" onClick={() => setFiles(files.filter((_, i) => i !== index))}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}
```

#### 3. **TimetableCalendar** (MEDIUM PRIORITY)
**Location:** `/packages/ui/src/timetable-calendar.tsx`  
**Purpose:** Weekly timetable view

```tsx
import { Card } from './card';

interface TimetableBlock {
  id: string;
  subject: string;
  faculty: string;
  location: string;
  start_time: string;  // HH:mm
  end_time: string;
  day_of_week: string;
}

interface TimetableCalendarProps {
  blocks: TimetableBlock[];
  onBlockClick?: (block: TimetableBlock) => void;
}

export function TimetableCalendar({ blocks, onBlockClick }: TimetableCalendarProps) {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const hours = Array.from({ length: 12 }, (_, i) => i + 8);  // 8 AM to 7 PM

  return (
    <Card className="p-4">
      <div className="grid grid-cols-7 gap-2">
        <div />  {/* Empty cell for time column */}
        {days.map((day) => (
          <div key={day} className="text-center font-medium capitalize">
            {day.slice(0, 3)}
          </div>
        ))}

        {hours.map((hour) => (
          <>
            <div key={`time-${hour}`} className="text-sm text-muted-foreground py-2">
              {hour}:00
            </div>
            {days.map((day) => {
              const dayBlocks = blocks.filter((b) => b.day_of_week === day && parseInt(b.start_time) === hour);
              return (
                <div key={`${day}-${hour}`} className="border rounded p-1 min-h-[60px]">
                  {dayBlocks.map((block) => (
                    <button
                      key={block.id}
                      onClick={() => onBlockClick?.(block)}
                      className="w-full text-left p-2 bg-primary/10 rounded text-xs hover:bg-primary/20 transition"
                    >
                      <div className="font-medium">{block.subject}</div>
                      <div className="text-muted-foreground">{block.location}</div>
                    </button>
                  ))}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </Card>
  );
}
```

#### 4. **DataTable** (MEDIUM PRIORITY)
**Location:** `/packages/ui/src/data-table.tsx`  
**Purpose:** Sortable, filterable table with pagination

```tsx
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { Button } from './button';
import { Input } from './input';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id: string }>({ 
  data, 
  columns, 
  searchable = true, 
  onRowClick 
}: DataTableProps<T>) {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = 20;

  // Filter data
  let filteredData = data;
  if (searchable && search) {
    filteredData = data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
  }

  // Sort data
  if (sortKey) {
    filteredData.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (sortOrder === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });
  }

  // Paginate
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-4">
      {searchable && (
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={col.sortable ? 'cursor-pointer hover:bg-muted/50' : ''}
                onClick={() => {
                  if (col.sortable) {
                    setSortKey(col.key);
                    setSortOrder(sortKey === col.key && sortOrder === 'asc' ? 'desc' : 'asc');
                  }
                }}
              >
                {col.header}
                {col.sortable && sortKey === col.key && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row) => (
            <TableRow
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
            >
              {columns.map((col) => (
                <TableCell key={col.key}>{col.render(row)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
```

---

## 📂 Code Organization

### Folder Structure Per Portal

```
apps/learner/
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Login page
│   ├── dashboard/
│   │   └── page.tsx            # Dashboard
│   ├── timetable/
│   │   ├── page.tsx            # Weekly view
│   │   └── daily/page.tsx      # Daily view
│   ├── assessments/
│   │   ├── page.tsx            # List
│   │   ├── [id]/page.tsx       # Details
│   │   └── [id]/attempt/page.tsx  # Take assessment
│   └── ... (other modules)
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx        # Navigation + sidebar
│   │   └── Navbar.tsx
│   ├── dashboard/
│   │   ├── AttendanceWidget.tsx
│   │   ├── FeeWidget.tsx
│   │   └── TimetableWidget.tsx
│   └── ... (feature-specific components)
├── lib/
│   ├── api/
│   │   ├── client.ts           # Axios instance
│   │   ├── auth.ts             # Auth endpoints
│   │   ├── assessments.ts      # Assessment endpoints
│   │   └── ... (other modules)
│   ├── hooks/
│   │   ├── useAuth.ts          # Auth context
│   │   ├── useStudent.ts       # Student data
│   │   └── useTimetable.ts     # Timetable data
│   └── utils/
│       ├── format.ts           # Date/number formatting
│       └── validation.ts       # Form validation schemas
├── types/
│   └── index.ts                # TypeScript interfaces
└── middleware.ts               # Auth middleware
```

### Naming Conventions

#### Files
- Components: PascalCase (`StudentCard.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Pages: lowercase (`page.tsx`, `layout.tsx`)

#### Components
```tsx
// ✅ Good
export function StudentCard({ student }: StudentCardProps) {}

// ❌ Bad
export default function card({ student }) {}
```

#### Hooks
```tsx
// ✅ Good
export function useStudentData(id: string) {}

// ❌ Bad
export function getStudent(id: string) {}
```

#### API Functions
```tsx
// ✅ Good
export const assessmentsApi = {
  list: () => {},
  getById: (id) => {},
  create: (data) => {},
};

// ❌ Bad
export function listAssessments() {}
export function getAssessment() {}
```

---

## ✅ Testing Requirements

### Unit Tests (Jest + React Testing Library)
```tsx
// StudentCard.test.tsx
import { render, screen } from '@testing-library/react';
import { StudentCard } from './StudentCard';

describe('StudentCard', () => {
  it('renders student name', () => {
    const student = { id: '1', name: 'John Doe', email: 'john@example.com' };
    render(<StudentCard student={student} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const handleEdit = jest.fn();
    render(<StudentCard student={student} onEdit={handleEdit} />);
    await userEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(handleEdit).toHaveBeenCalledWith(student);
  });
});
```

### Integration Tests (Playwright)
```typescript
// e2e/student-dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Student Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'student@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('displays attendance graph', async ({ page }) => {
    await expect(page.locator('text=Attendance (Last 30 Days)')).toBeVisible();
  });

  test('shows today\'s timetable', async ({ page }) => {
    await expect(page.locator('text=Today\'s Schedule')).toBeVisible();
    await expect(page.locator('[data-testid="timetable-block"]')).toHaveCount(3);  // Assuming 3 classes today
  });
});
```

### Test Coverage Goals
- Unit tests: 80%+ coverage
- Integration tests: All critical user flows
- Visual regression tests: Key pages

---

## 🚀 Deployment Checklist

### Pre-Deployment
- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] ESLint passing (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Environment variables set in Vercel/deployment platform
- [ ] API base URL configured for production
- [ ] CORS headers configured on backend
- [ ] Error monitoring setup (Sentry)
- [ ] Analytics setup (Google Analytics / Mixpanel)

### Performance Optimization
- [ ] Image optimization (use Next.js Image component)
- [ ] Code splitting (dynamic imports for heavy components)
- [ ] Bundle size under 200KB (initial load)
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3s

### Security Checklist
- [ ] No sensitive data in client-side code
- [ ] HTTPS enforced
- [ ] XSS protection (sanitize user inputs)
- [ ] CSRF tokens (handled by backend)
- [ ] Rate limiting on forms
- [ ] Session timeout implemented

---

## 📞 Support & Communication

### Questions?
- **Backend API Questions:** Tag `@backend-lead` in Slack
- **Design Questions:** Check `docs/design/STYLE_GUIDE.md` or tag `@design-team`
- **Technical Blockers:** Create issue in GitHub with label `frontend-blocker`

### Daily Standup
- **Time:** 10:00 AM
- **Format:** What did I do yesterday? What will I do today? Any blockers?
- **Duration:** 15 minutes max

### Code Review Process
1. Create PR with descriptive title
2. Self-review checklist completed
3. Request review from 1 frontend + 1 backend dev
4. Address comments within 24 hours
5. Merge after 2 approvals

---

## 🎉 Getting Started Checklist

### Week 1: Setup & Foundation
- [ ] Clone repo: `git clone https://github.com/PratikChavan16/edu-bit-lms.git`
- [ ] Install dependencies: `pnpm install`
- [ ] Run backend locally: `php artisan serve`
- [ ] Run frontend dev server: `pnpm dev`
- [ ] Test login flow with test credentials
- [ ] Review existing code in `/apps/learner/app/dashboard`
- [ ] Setup API client in `/packages/api-client`
- [ ] Create first component in `/packages/ui`

### Week 2: Build Core Pages
- [ ] Complete Student Dashboard with real APIs
- [ ] Build Timetable page (weekly view)
- [ ] Build Assessments list page
- [ ] Build Library browse page

### Week 3: Forms & Interactions
- [ ] Assessment submission form
- [ ] Document upload interface
- [ ] Fee invoice viewing
- [ ] Profile editing

### Week 4: Polish & Testing
- [ ] Add loading states everywhere
- [ ] Implement error boundaries
- [ ] Write unit tests for key components
- [ ] Write E2E tests for critical flows
- [ ] Performance optimization

---

## 📚 Additional Resources

### Documentation Links
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Radix UI:** https://www.radix-ui.com/docs/primitives
- **React Hook Form:** https://react-hook-form.com/get-started
- **Recharts:** https://recharts.org/en-US/guide

### Design Assets
- **Figma:** [Link to design files]
- **Style Guide:** `docs/design/STYLE_GUIDE.md`
- **Component Specs:** `docs/design/frontend-design-spec.txt`

### Code Examples
- **Sample Dashboard:** `/apps/learner/app/dashboard/page.tsx`
- **API Integration:** `/packages/api-client/src/auth.ts`
- **Form Handling:** `/apps/learner/components/AssessmentForm.tsx`

---

**Last Updated:** October 9, 2025  
**Version:** 1.0  
**Maintained By:** Backend Team

**Questions?** Contact the backend lead or create an issue in GitHub with label `frontend-question`.

---

**Good luck building! 🚀**
