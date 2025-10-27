# Faculty/Teacher Portal - Frontend Implementation Guide

**Portal**: Faculty/Teacher (#07)  
**Port**: 3007  
**Framework**: Next.js 15.0 + React 18.3  
**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Key Components](#key-components)
4. [Offline-First Implementation](#offline-first-implementation)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Performance Optimization](#performance-optimization)
8. [Testing](#testing)

---

## 1. Tech Stack

### Core Framework
```json
{
  "next": "15.0.0",
  "react": "18.3.0",
  "react-dom": "18.3.0",
  "typescript": "5.3.0"
}
```

### UI & Styling
```json
{
  "tailwindcss": "^3.4.0",
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-tabs": "^1.0.4",
  "@radix-ui/react-select": "^2.0.0",
  "shadcn-ui": "latest",
  "lucide-react": "^0.300.0"
}
```

### Data Management
```json
{
  "@tanstack/react-query": "^5.17.0",
  "zustand": "^4.4.7",
  "axios": "^1.6.0",
  "localforage": "^1.10.0"
}
```

### Offline Support
```json
{
  "workbox-webpack-plugin": "^7.0.0",
  "idb": "^8.0.0",
  "dexie": "^3.2.4"
}
```

### Form & Validation
```json
{
  "react-hook-form": "^7.49.0",
  "zod": "^3.22.4"
}
```

### Charts & Visualization
```json
{
  "recharts": "^2.10.0"
}
```

---

## 2. Project Structure

```
faculty-portal/
├── app/                          # Next.js 15 App Router
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/             # Protected routes
│   │   ├── layout.tsx           # Dashboard layout
│   │   ├── page.tsx             # Dashboard home
│   │   │
│   │   ├── courses/
│   │   │   ├── page.tsx         # Course list
│   │   │   └── [id]/
│   │   │       ├── page.tsx     # Course details
│   │   │       ├── attendance/page.tsx
│   │   │       ├── gradebook/page.tsx
│   │   │       └── materials/page.tsx
│   │   │
│   │   ├── attendance/
│   │   │   ├── mark/page.tsx    # Mark attendance (offline-first)
│   │   │   └── reports/page.tsx
│   │   │
│   │   ├── assessments/
│   │   │   ├── page.tsx
│   │   │   ├── create/page.tsx
│   │   │   └── [id]/grade/page.tsx
│   │   │
│   │   ├── messages/
│   │   │   └── page.tsx
│   │   │
│   │   └── profile/
│   │       └── page.tsx
│   │
│   └── globals.css

├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   └── ...
│   │
│   ├── attendance/
│   │   ├── AttendanceSheet.tsx
│   │   ├── QuickAttendance.tsx
│   │   ├── AttendanceStats.tsx
│   │   └── OfflineSyncIndicator.tsx
│   │
│   ├── gradebook/
│   │   ├── GradeTable.tsx
│   │   ├── GradeEntry.tsx
│   │   ├── CurveApplier.tsx
│   │   └── StudentGradeRow.tsx
│   │
│   ├── assessment/
│   │   ├── AssessmentForm.tsx
│   │   ├── RubricBuilder.tsx
│   │   └── SubmissionViewer.tsx
│   │
│   └── shared/
│       ├── CourseCard.tsx
│       ├── StudentAvatar.tsx
│       └── AnalyticsChart.tsx

├── lib/
│   ├── api-client.ts
│   ├── offline-db.ts           # IndexedDB wrapper
│   ├── sync-manager.ts         # Offline sync logic
│   └── utils.ts

├── hooks/
│   ├── useAttendance.ts
│   ├── useGradebook.ts
│   ├── useOfflineSync.ts
│   └── useCourses.ts

├── stores/
│   ├── authStore.ts
│   ├── attendanceStore.ts      # Offline attendance cache
│   └── syncStore.ts

└── types/
    ├── attendance.ts
    ├── grade.ts
    └── course.ts
```

---

## 3. Key Components

### 3.1 Dashboard Component

**File:** `app/(dashboard)/page.tsx`

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { CourseCard } from '@/components/shared/CourseCard';
import { QuickActions } from '@/components/dashboard/QuickActions';

export default function DashboardPage() {
  const { data: courses, isLoading } = useQuery({
    queryKey: ['faculty-courses'],
    queryFn: () => apiClient.get('/faculty/courses'),
  });

  const { data: stats } = useQuery({
    queryKey: ['faculty-stats'],
    queryFn: () => apiClient.get('/faculty/stats'),
  });

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Professor!</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Active Courses</p>
          <p className="text-2xl font-bold">{stats?.active_courses ?? 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Students</p>
          <p className="text-2xl font-bold">{stats?.total_students ?? 0}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pending Grading</p>
          <p className="text-2xl font-bold text-orange-600">
            {stats?.pending_grading ?? 0}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Unread Messages</p>
          <p className="text-2xl font-bold">{stats?.unread_messages ?? 0}</p>
        </Card>
      </div>

      {/* Course List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses?.map((course: any) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### 3.2 Offline-First Attendance Component

**File:** `components/attendance/AttendanceSheet.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useOfflineSync } from '@/hooks/useOfflineSync';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { Wifi, WifiOff, Check, X } from 'lucide-react';

interface Student {
  id: number;
  roll_number: string;
  name: string;
}

interface AttendanceSheetProps {
  courseId: number;
  students: Student[];
  date: string;
  timeSlot: string;
}

export function AttendanceSheet({
  courseId,
  students,
  date,
  timeSlot,
}: AttendanceSheetProps) {
  const [attendance, setAttendance] = useState<Record<number, string>>({});
  const { isOnline, saveOffline, syncPending } = useOfflineSync();

  // Initialize with default 'present' status
  useEffect(() => {
    const initial = students.reduce((acc, student) => {
      acc[student.id] = 'present';
      return acc;
    }, {} as Record<number, string>);
    setAttendance(initial);
  }, [students]);

  const toggleStatus = (studentId: number) => {
    setAttendance((prev) => {
      const currentStatus = prev[studentId];
      const nextStatus = 
        currentStatus === 'present' ? 'absent' :
        currentStatus === 'absent' ? 'late' : 'present';
      return { ...prev, [studentId]: nextStatus };
    });
  };

  const handleSave = async () => {
    const attendanceRecords = Object.entries(attendance).map(([id, status]) => ({
      student_id: parseInt(id),
      status,
      device_timestamp: new Date().toISOString(),
    }));

    const payload = {
      course_id: courseId,
      date,
      time_slot: timeSlot,
      attendance_records: attendanceRecords,
      is_offline_sync: !isOnline,
    };

    if (isOnline) {
      // Online: Send directly to server
      try {
        await apiClient.post(`/faculty/courses/${courseId}/attendance`, payload);
        toast.success('Attendance saved successfully');
      } catch (error) {
        toast.error('Failed to save attendance');
      }
    } else {
      // Offline: Save to IndexedDB
      await saveOffline('attendance', payload);
      toast.success('Attendance saved offline. Will sync when online.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present': return <Check className="w-4 h-4" />;
      case 'absent': return <X className="w-4 h-4" />;
      case 'late': return <span>⏰</span>;
      default: return null;
    }
  };

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Mark Attendance</h2>
          <p className="text-sm text-muted-foreground">
            {date} • {timeSlot}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Badge variant="outline" className="gap-2">
              <Wifi className="w-4 h-4" />
              Online
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-2">
              <WifiOff className="w-4 h-4" />
              Offline Mode
            </Badge>
          )}
          {syncPending > 0 && (
            <Badge variant="destructive">
              {syncPending} pending sync
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-600">Present</p>
          <p className="text-2xl font-bold text-green-700">
            {Object.values(attendance).filter(s => s === 'present').length}
          </p>
        </div>
        <div className="bg-red-50 p-3 rounded-lg">
          <p className="text-sm text-red-600">Absent</p>
          <p className="text-2xl font-bold text-red-700">
            {Object.values(attendance).filter(s => s === 'absent').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <p className="text-sm text-yellow-600">Late</p>
          <p className="text-2xl font-bold text-yellow-700">
            {Object.values(attendance).filter(s => s === 'late').length}
          </p>
        </div>
      </div>

      {/* Student List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {students.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onClick={() => toggleStatus(student.id)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                {student.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-muted-foreground">
                  {student.roll_number}
                </p>
              </div>
            </div>
            <Badge className={getStatusColor(attendance[student.id])}>
              {getStatusIcon(attendance[student.id])}
              {attendance[student.id]}
            </Badge>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <Button onClick={handleSave} className="flex-1">
          Save Attendance
        </Button>
        <Button variant="outline" onClick={() => setAttendance({})}>
          Reset
        </Button>
      </div>
    </Card>
  );
}
```

### 3.3 Gradebook Component

**File:** `components/gradebook/GradeTable.tsx`

```tsx
'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

interface Student {
  id: number;
  name: string;
  roll_number: string;
}

interface Assessment {
  id: number;
  title: string;
  max_marks: number;
}

interface GradeTableProps {
  courseId: number;
  assessment: Assessment;
  students: Student[];
  existingGrades: Record<number, number>;
}

export function GradeTable({
  courseId,
  assessment,
  students,
  existingGrades,
}: GradeTableProps) {
  const [grades, setGrades] = useState<Record<number, string>>(
    Object.entries(existingGrades).reduce((acc, [id, marks]) => {
      acc[parseInt(id)] = marks.toString();
      return acc;
    }, {} as Record<number, string>)
  );

  const queryClient = useQueryClient();

  const saveGradesMutation = useMutation({
    mutationFn: (gradeData: any) =>
      apiClient.post(`/faculty/assessments/${assessment.id}/grades`, gradeData),
    onSuccess: () => {
      toast.success('Grades saved successfully');
      queryClient.invalidateQueries({ queryKey: ['gradebook', courseId] });
    },
  });

  const publishGradesMutation = useMutation({
    mutationFn: () =>
      apiClient.post(`/faculty/assessments/${assessment.id}/publish`),
    onSuccess: () => {
      toast.success('Grades published to students');
    },
  });

  const handleGradeChange = (studentId: number, value: string) => {
    // Validate numeric input
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      const numValue = parseFloat(value);
      if (value === '' || (numValue >= 0 && numValue <= assessment.max_marks)) {
        setGrades((prev) => ({ ...prev, [studentId]: value }));
      }
    }
  };

  const handleSave = () => {
    const gradeData = Object.entries(grades)
      .filter(([_, marks]) => marks !== '')
      .map(([studentId, marks]) => ({
        student_id: parseInt(studentId),
        marks_obtained: parseFloat(marks),
      }));

    saveGradesMutation.mutate({ grades: gradeData });
  };

  const calculateStats = () => {
    const validGrades = Object.values(grades)
      .filter(g => g !== '')
      .map(g => parseFloat(g));

    if (validGrades.length === 0) return null;

    const sum = validGrades.reduce((a, b) => a + b, 0);
    const avg = sum / validGrades.length;
    const max = Math.max(...validGrades);
    const min = Math.min(...validGrades);

    return { avg, max, min, count: validGrades.length };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{assessment.title}</h2>
          <p className="text-sm text-muted-foreground">
            Max Marks: {assessment.max_marks}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saveGradesMutation.isPending}>
            Save Grades
          </Button>
          <Button
            variant="outline"
            onClick={() => publishGradesMutation.mutate()}
            disabled={publishGradesMutation.isPending}
          >
            Publish to Students
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="text-sm text-muted-foreground">Graded</p>
            <p className="text-xl font-bold">{stats.count}/{students.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Average</p>
            <p className="text-xl font-bold">{stats.avg.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Highest</p>
            <p className="text-xl font-bold">{stats.max}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Lowest</p>
            <p className="text-xl font-bold">{stats.min}</p>
          </div>
        </div>
      )}

      {/* Grade Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Roll No</th>
              <th className="px-4 py-3 text-left">Student Name</th>
              <th className="px-4 py-3 text-right">Marks</th>
              <th className="px-4 py-3 text-right">Percentage</th>
              <th className="px-4 py-3 text-center">Grade</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const marks = grades[student.id] ? parseFloat(grades[student.id]) : null;
              const percentage = marks !== null ? (marks / assessment.max_marks) * 100 : null;
              const letterGrade = percentage !== null
                ? percentage >= 90 ? 'A+' :
                  percentage >= 85 ? 'A' :
                  percentage >= 80 ? 'A-' :
                  percentage >= 75 ? 'B+' :
                  percentage >= 70 ? 'B' :
                  percentage >= 60 ? 'C' :
                  percentage >= 50 ? 'D' : 'F'
                : '-';

              return (
                <tr key={student.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{student.roll_number}</td>
                  <td className="px-4 py-3">{student.name}</td>
                  <td className="px-4 py-3 text-right">
                    <Input
                      type="text"
                      value={grades[student.id] || ''}
                      onChange={(e) => handleGradeChange(student.id, e.target.value)}
                      placeholder="0"
                      className="w-20 text-right"
                    />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {percentage !== null ? `${percentage.toFixed(1)}%` : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold">{letterGrade}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

---

## 4. Offline-First Implementation

### 4.1 Offline Database Setup

**File:** `lib/offline-db.ts`

```typescript
import Dexie, { Table } from 'dexie';

export interface OfflineAttendance {
  id?: number;
  courseId: number;
  date: string;
  timeSlot: string;
  attendanceRecords: any[];
  timestamp: number;
  synced: boolean;
}

export class FacultyOfflineDB extends Dexie {
  attendance!: Table<OfflineAttendance>;

  constructor() {
    super('FacultyPortalDB');
    this.version(1).stores({
      attendance: '++id, courseId, date, synced, timestamp',
    });
  }
}

export const db = new FacultyOfflineDB();
```

### 4.2 Sync Manager

**File:** `lib/sync-manager.ts`

```typescript
import { db } from './offline-db';
import { apiClient } from './api-client';

export class SyncManager {
  private syncInProgress = false;

  async syncAttendance() {
    if (this.syncInProgress) return;

    this.syncInProgress = true;

    try {
      const pendingRecords = await db.attendance
        .where('synced')
        .equals(false)
        .toArray();

      for (const record of pendingRecords) {
        try {
          await apiClient.post('/faculty/attendance/sync', {
            records: [{
              course_id: record.courseId,
              date: record.date,
              time_slot: record.timeSlot,
              attendance_records: record.attendanceRecords,
            }],
          });

          // Mark as synced
          await db.attendance.update(record.id!, { synced: true });
        } catch (error) {
          console.error('Failed to sync record:', record.id, error);
        }
      }
    } finally {
      this.syncInProgress = false;
    }
  }

  async getPendingCount(): Promise<number> {
    return await db.attendance.where('synced').equals(false).count();
  }
}

export const syncManager = new SyncManager();
```

### 4.3 Offline Sync Hook

**File:** `hooks/useOfflineSync.ts`

```typescript
import { useState, useEffect } from 'react';
import { syncManager } from '@/lib/sync-manager';
import { db } from '@/lib/offline-db';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [syncPending, setSyncPending] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncManager.syncAttendance();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check pending count
    const checkPending = async () => {
      const count = await syncManager.getPendingCount();
      setSyncPending(count);
    };

    checkPending();
    const interval = setInterval(checkPending, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const saveOffline = async (type: string, data: any) => {
    if (type === 'attendance') {
      await db.attendance.add({
        courseId: data.course_id,
        date: data.date,
        timeSlot: data.time_slot,
        attendanceRecords: data.attendance_records,
        timestamp: Date.now(),
        synced: false,
      });
      setSyncPending((prev) => prev + 1);
    }
  };

  return { isOnline, syncPending, saveOffline };
}
```

---

## 5. State Management

### 5.1 Auth Store

**File:** `stores/authStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Faculty {
  id: number;
  name: string;
  email: string;
  employee_code: string;
  department_id: number;
}

interface AuthState {
  faculty: Faculty | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (faculty: Faculty, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      faculty: null,
      token: null,
      isAuthenticated: false,

      login: (faculty, token) => {
        set({ faculty, token, isAuthenticated: true });
      },

      logout: () => {
        set({ faculty: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'faculty-auth',
    }
  )
);
```

---

## 6. API Integration

**File:** `lib/api-client.ts`

```typescript
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8007/api',
  timeout: 30000,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 7. Performance Optimization

### Code Splitting
```tsx
import dynamic from 'next/dynamic';

const GradeTable = dynamic(() => import('@/components/gradebook/GradeTable'), {
  ssr: false,
  loading: () => <TableSkeleton />,
});
```

### React Query Configuration
```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      cacheTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});
```

---

## 8. Testing

### Component Test Example
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { AttendanceSheet } from '@/components/attendance/AttendanceSheet';

describe('AttendanceSheet', () => {
  it('toggles student attendance status', () => {
    const students = [{ id: 1, name: 'John Doe', roll_number: '101' }];
    
    render(
      <AttendanceSheet
        courseId={1}
        students={students}
        date="2025-10-25"
        timeSlot="09:00-10:00"
      />
    );

    const studentRow = screen.getByText('John Doe').closest('div');
    fireEvent.click(studentRow);

    expect(screen.getByText('absent')).toBeInTheDocument();
  });
});
```

---

## Summary

This frontend implementation provides:

✅ **Offline-First Architecture**: Work without internet, auto-sync when online  
✅ **Modern Tech Stack**: Next.js 15, React 18, TypeScript  
✅ **Robust State Management**: Zustand + TanStack Query + IndexedDB  
✅ **Type Safety**: Full TypeScript coverage  
✅ **Performance**: Code splitting, caching, optimistic updates  
✅ **User Experience**: Real-time updates, loading states, error handling  
✅ **Production Ready**: PWA support, offline functionality

**Key Features:**
- Offline attendance marking with auto-sync
- Real-time gradebook with instant calculations
- Course management dashboard
- Student analytics and reporting
- Responsive design for mobile teaching
# Faculty/Teacher Portal - Frontend Implementation Guide

**Version**: 2.0  
**Framework**: Next.js 16 + React 19 + TypeScript 5.6  
**Last Updated**: October 25, 2025

---

## Project Structure

```
apps/faculty/
├── app/
│   ├── layout.tsx                    # Root layout with auth
│   ├── page.tsx                      # Dashboard (/)
│   ├── courses/
│   │   ├── page.tsx                 # Courses list
│   │   └── [id]/
│   │       ├── page.tsx             # Course details
│   │       ├── roster/
│   │       │   └── page.tsx         # Student roster
│   │       ├── syllabus/
│   │       │   └── page.tsx         # Syllabus management
│   │       ├── teaching-plan/
│   │       │   └── page.tsx         # Weekly teaching plan
│   │       └── analytics/
│   │           └── page.tsx         # Course analytics
│   ├── attendance/
│   │   ├── mark/
│   │   │   └── [courseId]/
│   │   │       └── page.tsx         # Mark attendance (offline-capable)
│   │   ├── history/
│   │   │   └── [courseId]/
│   │   │       └── page.tsx         # Attendance history
│   │   └── reports/
│   │       └── page.tsx             # Attendance reports
│   ├── assessments/
│   │   ├── page.tsx                 # All assessments
│   │   ├── create/
│   │   │   └── page.tsx             # Create assessment
│   │   └── [id]/
│   │       ├── page.tsx             # Assessment dashboard
│   │       ├── edit/
│   │       │   └── page.tsx         # Edit assessment
│   │       ├── submissions/
│   │       │   └── page.tsx         # View submissions
│   │       └── grading/
│   │           └── page.tsx         # Grade submissions
│   ├── gradebook/
│   │   └── [courseId]/
│   │       ├── page.tsx             # Course gradebook
│   │       ├── publish/
│   │       │   └── page.tsx         # Publish grades
│   │       └── analytics/
│   │           └── page.tsx         # Grade analytics
│   ├── materials/
│   │   ├── page.tsx                 # All materials
│   │   ├── upload/
│   │   │   └── page.tsx             # Upload materials
│   │   └── [id]/
│   │       ├── page.tsx             # Material details
│   │       └── history/
│   │           └── page.tsx         # Version history
│   ├── timetable/
│   │   ├── page.tsx                 # Weekly timetable
│   │   ├── swap/
│   │   │   └── page.tsx             # Request class swap
│   │   └── substitutions/
│   │       └── page.tsx             # Substitution management
│   ├── messages/
│   │   ├── announcements/
│   │   │   ├── page.tsx             # All announcements
│   │   │   └── create/
│   │   │       └── page.tsx         # Create announcement
│   │   └── students/
│   │       └── page.tsx             # Student messages
│   ├── support/
│   │   ├── at-risk/
│   │   │   └── page.tsx             # At-risk students
│   │   ├── interventions/
│   │   │   └── page.tsx             # Intervention tracking
│   │   └── remedial/
│   │       └── page.tsx             # Remedial programs
│   ├── leaves/
│   │   ├── page.tsx                 # Leave requests
│   │   ├── create/
│   │   │   └── page.tsx             # Create leave request
│   │   └── substitutes/
│   │       └── page.tsx             # Substitute coordination
│   ├── exams/
│   │   ├── duties/
│   │   │   └── page.tsx             # Exam duties schedule
│   │   └── incidents/
│   │       └── page.tsx             # Incident reports
│   ├── analytics/
│   │   ├── teaching/
│   │   │   └── page.tsx             # Teaching analytics
│   │   └── students/
│   │       └── page.tsx             # Student analytics
│   ├── profile/
│   │   ├── page.tsx                 # View profile
│   │   └── edit/
│   │       └── page.tsx             # Edit profile
│   └── settings/
│       ├── page.tsx                 # General settings
│       ├── security/
│       │   └── page.tsx             # Security settings
│       ├── notifications/
│       │   └── page.tsx             # Notification preferences
│       └── devices/
│           └── page.tsx             # Device management
├── components/
│   ├── dashboard/
│   │   ├── TodayClasses.tsx
│   │   ├── QuickActions.tsx
│   │   ├── PendingItems.tsx
│   │   ├── RecentActivity.tsx
│   │   └── WeeklyOverview.tsx
│   ├── courses/
│   │   ├── CourseCard.tsx
│   │   ├── CourseList.tsx
│   │   ├── CourseDetails.tsx
│   │   └── RosterTable.tsx
│   ├── attendance/
│   │   ├── AttendanceGrid.tsx
│   │   ├── AttendanceStatusToggle.tsx
│   │   ├── OfflineIndicator.tsx
│   │   ├── ConflictResolver.tsx
│   │   ├── AttendanceCalendar.tsx
│   │   └── AttendanceChart.tsx
│   ├── assessments/
│   │   ├── AssessmentCard.tsx
│   │   ├── AssessmentForm.tsx
│   │   ├── RubricBuilder.tsx
│   │   ├── SubmissionList.tsx
│   │   └── GradingInterface.tsx
│   ├── gradebook/
│   │   ├── GradebookGrid.tsx
│   │   ├── GradeCell.tsx
│   │   ├── GradeDistribution.tsx
│   │   ├── PublishGradesModal.tsx
│   │   └── GradeAuditLog.tsx
│   ├── materials/
│   │   ├── MaterialCard.tsx
│   │   ├── MaterialUploader.tsx
│   │   ├── MaterialViewer.tsx
│   │   └── VersionHistory.tsx
│   ├── timetable/
│   │   ├── WeekView.tsx
│   │   ├── ClassCard.tsx
│   │   ├── SwapRequestForm.tsx
│   │   └── RoomBooking.tsx
│   ├── messages/
│   │   ├── AnnouncementComposer.tsx
│   │   ├── MessageThread.tsx
│   │   ├── TemplateSelector.tsx
│   │   └── ReadReceiptsModal.tsx
│   ├── analytics/
│   │   ├── PerformanceChart.tsx
│   │   ├── AttendanceTrend.tsx
│   │   ├── GradeDistributionChart.tsx
│   │   └── AtRiskStudents.tsx
│   └── shared/
│       ├── Layout.tsx
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       ├── StatCard.tsx
│       ├── DataTable.tsx
│       ├── Modal.tsx
│       ├── FileUpload.tsx
│       ├── DatePicker.tsx
│       ├── ConfirmDialog.tsx
│       ├── Toast.tsx
│       └── LoadingSpinner.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts                # Axios instance with interceptors
│   │   ├── faculty.ts               # Faculty API calls
│   │   ├── courses.ts               # Course API calls
│   │   ├── attendance.ts            # Attendance API calls
│   │   ├── assessments.ts           # Assessment API calls
│   │   ├── grades.ts                # Grade API calls
│   │   ├── materials.ts             # Material API calls
│   │   ├── timetable.ts             # Timetable API calls
│   │   ├── messages.ts              # Message API calls
│   │   ├── leaves.ts                # Leave API calls
│   │   ├── exams.ts                 # Exam API calls
│   │   └── analytics.ts             # Analytics API calls
│   ├── store/
│   │   ├── authStore.ts             # Auth state (Zustand)
│   │   ├── facultyStore.ts          # Faculty data state
│   │   ├── courseStore.ts           # Course data state
│   │   ├── attendanceStore.ts       # Attendance state + offline queue
│   │   ├── assessmentStore.ts       # Assessment state
│   │   ├── gradeStore.ts            # Grade state
│   │   ├── materialStore.ts         # Material state
│   │   └── uiStore.ts               # UI state (sidebar, modals)
│   ├── hooks/
│   │   ├── useAuth.ts               # Auth hook
│   │   ├── useFaculty.ts            # Faculty data hook
│   │   ├── useCourses.ts            # Courses hook
│   │   ├── useAttendance.ts         # Attendance hook
│   │   ├── useOfflineSync.ts        # Offline sync hook
│   │   ├── useFileUpload.ts         # File upload hook
│   │   ├── useWebSocket.ts          # Real-time updates
│   │   └── useKeyboardShortcuts.ts  # Keyboard shortcuts
│   ├── utils/
│   │   ├── formatters.ts            # Date, number formatters
│   │   ├── validators.ts            # Zod schemas
│   │   ├── constants.ts             # Constants
│   │   ├── helpers.ts               # Helper functions
│   │   ├── offlineStorage.ts        # IndexedDB wrapper
│   │   └── errorHandling.ts         # Error utilities
│   └── types/
│       ├── faculty.ts               # Faculty types
│       ├── course.ts                # Course types
│       ├── attendance.ts            # Attendance types
│       ├── assessment.ts            # Assessment types
│       ├── grade.ts                 # Grade types
│       ├── material.ts              # Material types
│       ├── timetable.ts             # Timetable types
│       ├── message.ts               # Message types
│       └── common.ts                # Common types
├── public/
│   ├── icons/
│   ├── images/
│   └── offline/
│       └── service-worker.js        # Offline functionality
├── styles/
│   ├── globals.css
│   └── components/
│       └── attendance.css           # Attendance-specific styles
├── .env.local
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## TypeScript Interfaces

### types/faculty.ts

```typescript
export interface Faculty {
  id: string;
  user_id: string;
  college_id: string;
  department_id: string;
  employee_id: string;
  designation: string;
  qualification?: string;
  specialization?: string;
  experience_years: number;
  joining_date: string;
  status: 'active' | 'on_leave' | 'inactive';
  office_location?: string;
  office_hours?: OfficeHours[];
  user: User;
  college: College;
  department: Department;
}

export interface OfficeHours {
  day: number; // 0-6
  start_time: string;
  end_time: string;
}

export interface DashboardStats {
  total_courses: number;
  pending_grading: number;
  attendance_completion_rate: number;
  unread_messages: number;
}

export interface TodayClass {
  id: string;
  course_code: string;
  course_title: string;
  section: string;
  start_time: string;
  end_time: string;
  room: string;
  student_count: number;
}

export interface PendingItem {
  type: 'grading' | 'attendance' | 'material' | 'message';
  count: number;
  urgent_count?: number;
  oldest_date?: string;
}
```

### types/attendance.ts

```typescript
export interface AttendanceRecord {
  id: string;
  course_id: string;
  student_id: string;
  date: string;
  status: AttendanceStatus;
  note?: string;
  device_ts?: string;
  source: AttendanceSource;
  marked_by: string;
  student?: Student;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
export type AttendanceSource = 'ONLINE' | 'OFFLINE' | 'IMPORTED';

export interface AttendanceMark {
  student_id: string;
  status: AttendanceStatus;
  note?: string;
  device_ts?: string;
  source?: AttendanceSource;
}

export interface AttendanceConflict {
  student_id: string;
  server_value: AttendanceRecord;
  device_value: AttendanceMark;
  server_ts: string;
  device_ts: string;
}

export interface OfflineQueueItem {
  id: string;
  course_id: string;
  date: string;
  marks: AttendanceMark[];
  created_at: string;
  sync_attempts: number;
}
```

### types/assessment.ts

```typescript
export interface Assessment {
  id: string;
  course_id: string;
  faculty_id: string;
  title: string;
  type: AssessmentType;
  weight: number;
  max_marks: number;
  due_at?: string;
  late_submission_allowed: boolean;
  late_penalty_percentage?: number;
  status: 'DRAFT' | 'PUBLISHED';
  instructions?: string;
  rubric?: Rubric[];
  submission_count?: number;
  graded_count?: number;
  average_score?: number;
}

export type AssessmentType = 
  | 'QUIZ' 
  | 'ASSIGNMENT' 
  | 'LAB' 
  | 'PROJECT' 
  | 'MIDTERM' 
  | 'ENDSEM' 
  | 'VIVA';

export interface Rubric {
  id: string;
  criterion: string;
  max_points: number;
  description?: string;
}

export interface Submission {
  id: string;
  assessment_id: string;
  student_id: string;
  submitted_at: string;
  files: SubmissionFile[];
  status: 'submitted' | 'late' | 'graded';
  plagiarism_score?: number;
  student?: Student;
}

export interface SubmissionFile {
  id: string;
  filename: string;
  url: string;
  size: number;
  mime_type: string;
}
```

### types/grade.ts

```typescript
export interface GradeEntry {
  id: string;
  assessment_id: string;
  student_id: string;
  marks: number;
  status: GradeStatus;
  feedback?: string;
  graded_at?: string;
  published_at?: string;
  student?: Student;
}

export type GradeStatus = 'DRAFT' | 'PUBLISHED' | 'REVISED';

export interface GradebookRow {
  student_id: string;
  student_name: string;
  roll_number: string;
  grades: { [assessment_id: string]: number | null };
  total: number;
  percentage: number;
  letter_grade?: string;
}

export interface GradeAudit {
  id: string;
  assessment_id: string;
  student_id: string;
  actor_id: string;
  action: 'created' | 'updated' | 'published' | 'revised';
  reason?: string;
  before?: any;
  after?: any;
  created_at: string;
}
```

---

## State Management (Zustand)

### store/attendanceStore.ts

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AttendanceRecord, AttendanceMark, OfflineQueueItem } from '@/lib/types/attendance';
import { attendanceApi } from '@/lib/api/attendance';

interface AttendanceState {
  // Current state
  records: AttendanceRecord[];
  offlineQueue: OfflineQueueItem[];
  conflicts: any[];
  isOnline: boolean;
  isSyncing: boolean;
  
  // Actions
  setRecords: (records: AttendanceRecord[]) => void;
  addToOfflineQueue: (item: OfflineQueueItem) => void;
  removeFromOfflineQueue: (id: string) => void;
  setOnlineStatus: (online: boolean) => void;
  syncOfflineData: () => Promise<void>;
  resolveConflict: (conflictId: string, resolution: 'server' | 'device') => Promise<void>;
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      records: [],
      offlineQueue: [],
      conflicts: [],
      isOnline: navigator.onLine,
      isSyncing: false,

      setRecords: (records) => set({ records }),

      addToOfflineQueue: (item) => 
        set((state) => ({ 
          offlineQueue: [...state.offlineQueue, item] 
        })),

      removeFromOfflineQueue: (id) =>
        set((state) => ({
          offlineQueue: state.offlineQueue.filter((item) => item.id !== id),
        })),

      setOnlineStatus: (online) => {
        set({ isOnline: online });
        if (online) {
          get().syncOfflineData();
        }
      },

      syncOfflineData: async () => {
        const { offlineQueue, isOnline } = get();
        if (!isOnline || offlineQueue.length === 0) return;

        set({ isSyncing: true });

        try {
          for (const item of offlineQueue) {
            const result = await attendanceApi.sync(item.course_id, {
              date: item.date,
              marks: item.marks,
            });

            if (result.conflicts && result.conflicts.length > 0) {
              set((state) => ({
                conflicts: [...state.conflicts, ...result.conflicts],
              }));
            }

            get().removeFromOfflineQueue(item.id);
          }
        } catch (error) {
          console.error('Sync failed:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      resolveConflict: async (conflictId, resolution) => {
        // Implementation for conflict resolution
        await attendanceApi.resolveConflict(conflictId, resolution);
        set((state) => ({
          conflicts: state.conflicts.filter((c) => c.id !== conflictId),
        }));
      },
    }),
    {
      name: 'attendance-storage',
      partialize: (state) => ({
        offlineQueue: state.offlineQueue,
        conflicts: state.conflicts,
      }),
    }
  )
);
```

### store/gradeStore.ts

```typescript
import { create } from 'zustand';
import { GradeEntry, GradebookRow } from '@/lib/types/grade';
import { gradeApi } from '@/lib/api/grades';

interface GradeState {
  grades: GradeEntry[];
  gradebook: GradebookRow[];
  selectedAssessment: string | null;
  
  // Actions
  loadGrades: (assessmentId: string) => Promise<void>;
  updateGrade: (gradeId: string, marks: number, feedback?: string) => Promise<void>;
  publishGrades: (assessmentId: string, studentIds?: string[]) => Promise<void>;
  loadGradebook: (courseId: string) => Promise<void>;
}

export const useGradeStore = create<GradeState>((set, get) => ({
  grades: [],
  gradebook: [],
  selectedAssessment: null,

  loadGrades: async (assessmentId) => {
    const grades = await gradeApi.getGrades(assessmentId);
    set({ grades, selectedAssessment: assessmentId });
  },

  updateGrade: async (gradeId, marks, feedback) => {
    await gradeApi.updateGrade(gradeId, { marks, feedback });
    
    // Update local state
    set((state) => ({
      grades: state.grades.map((g) =>
        g.id === gradeId ? { ...g, marks, feedback } : g
      ),
    }));
  },

  publishGrades: async (assessmentId, studentIds) => {
    await gradeApi.publishGrades(assessmentId, studentIds);
    
    // Reload grades
    await get().loadGrades(assessmentId);
  },

  loadGradebook: async (courseId) => {
    const gradebook = await gradeApi.getGradebook(courseId);
    set({ gradebook });
  },
}));
```

---

## API Client

### api/client.ts

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '@/lib/store/authStore';

const client: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
client.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    const facultyId = useAuthStore.getState().faculty?.id;
    const collegeId = useAuthStore.getState().faculty?.college_id;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (collegeId) {
      config.headers['X-College-ID'] = collegeId;
    }

    if (facultyId) {
      config.headers['X-Faculty-ID'] = facultyId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired, logout
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }

    if (error.response?.status === 429) {
      // Rate limited, show toast
      console.error('Rate limit exceeded');
    }

    if (!navigator.onLine) {
      // Offline, queue for later
      console.warn('Request failed - offline');
    }

    return Promise.reject(error);
  }
);

export default client;
```

### api/attendance.ts

```typescript
import client from './client';
import { AttendanceRecord, AttendanceMark } from '@/lib/types/attendance';

export const attendanceApi = {
  getAttendance: async (courseId: string, date: string) => {
    const { data } = await client.get(`/faculty/courses/${courseId}/attendance`, {
      params: { date },
    });
    return data.data;
  },

  markAttendance: async (courseId: string, date: string, marks: AttendanceMark[]) => {
    const { data } = await client.put(`/faculty/courses/${courseId}/attendance`, {
      date,
      marks,
    });
    return data;
  },

  sync: async (courseId: string, payload: any) => {
    const { data } = await client.post(`/faculty/courses/${courseId}/attendance/sync`, payload);
    return data;
  },

  resolveConflict: async (conflictId: string, resolution: 'server' | 'device') => {
    const { data } = await client.post(`/attendance/conflicts/${conflictId}/resolve`, {
      resolution,
    });
    return data;
  },

  export: async (courseId: string, startDate: string, endDate: string) => {
    const { data } = await client.get(`/faculty/courses/${courseId}/attendance/export`, {
      params: { start_date: startDate, end_date: endDate },
      responseType: 'blob',
    });
    return data;
  },
};
```

---

## Custom Hooks

### hooks/useOfflineSync.ts

```typescript
import { useEffect, useCallback } from 'react';
import { useAttendanceStore } from '@/lib/store/attendanceStore';

export function useOfflineSync() {
  const { isOnline, setOnlineStatus, syncOfflineData, offlineQueue } = useAttendanceStore();

  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus]);

  const queueForSync = useCallback((item: any) => {
    useAttendanceStore.getState().addToOfflineQueue(item);
  }, []);

  return {
    isOnline,
    offlineQueue,
    queueForSync,
    syncOfflineData,
  };
}
```

### hooks/useKeyboardShortcuts.ts

```typescript
import { useEffect } from 'react';

interface ShortcutConfig {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  handler: () => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[]) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl === undefined || shortcut.ctrl === event.ctrlKey;
        const shiftMatch = shortcut.shift === undefined || shortcut.shift === event.shiftKey;
        const altMatch = shortcut.alt === undefined || shortcut.alt === event.altKey;
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();

        if (ctrlMatch && shiftMatch && altMatch && keyMatch) {
          event.preventDefault();
          shortcut.handler();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
```

---

## Key Components

### components/attendance/AttendanceGrid.tsx

```typescript
'use client';

import { useState, useCallback } from 'react';
import { AttendanceRecord, AttendanceMark, AttendanceStatus } from '@/lib/types/attendance';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';

interface AttendanceGridProps {
  students: any[];
  existingRecords: AttendanceRecord[];
  onSave: (marks: AttendanceMark[]) => Promise<void>;
  isOffline: boolean;
}

export function AttendanceGrid({ students, existingRecords, onSave, isOffline }: AttendanceGridProps) {
  const [marks, setMarks] = useState<Map<string, AttendanceMark>>(new Map());
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(0);

  const updateMark = useCallback((studentId: string, status: AttendanceStatus) => {
    setMarks((prev) => {
      const newMarks = new Map(prev);
      newMarks.set(studentId, {
        student_id: studentId,
        status,
        device_ts: new Date().toISOString(),
        source: isOffline ? 'OFFLINE' : 'ONLINE',
      });
      return newMarks;
    });
  }, [isOffline]);

  // Keyboard shortcuts for quick marking
  useKeyboardShortcuts([
    {
      key: 'p',
      handler: () => {
        const student = students[selectedStudentIndex];
        if (student) updateMark(student.id, 'PRESENT');
      },
    },
    {
      key: 'a',
      handler: () => {
        const student = students[selectedStudentIndex];
        if (student) updateMark(student.id, 'ABSENT');
      },
    },
    {
      key: 'l',
      handler: () => {
        const student = students[selectedStudentIndex];
        if (student) updateMark(student.id, 'LATE');
      },
    },
    {
      key: 'e',
      handler: () => {
        const student = students[selectedStudentIndex];
        if (student) updateMark(student.id, 'EXCUSED');
      },
    },
    {
      key: 'ArrowDown',
      handler: () => setSelectedStudentIndex((prev) => Math.min(prev + 1, students.length - 1)),
    },
    {
      key: 'ArrowUp',
      handler: () => setSelectedStudentIndex((prev) => Math.max(prev - 1, 0)),
    },
  ]);

  const handleSave = async () => {
    const marksArray = Array.from(marks.values());
    await onSave(marksArray);
  };

  return (
    <div className="attendance-grid">
      {isOffline && (
        <div className="offline-banner bg-yellow-100 p-2 text-center">
          Offline Mode - Changes will sync when online
        </div>
      )}
      
      <div className="grid grid-cols-1 gap-2">
        {students.map((student, index) => (
          <div
            key={student.id}
            className={`attendance-row p-3 border rounded ${
              index === selectedStudentIndex ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={student.user.avatar_url || '/default-avatar.png'}
                  alt={student.user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium">{student.user.name}</div>
                  <div className="text-sm text-gray-500">{student.roll_number}</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as AttendanceStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => updateMark(student.id, status)}
                    className={`px-4 py-2 rounded ${
                      marks.get(student.id)?.status === status
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200'
                    }`}
                  >
                    {status[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">
          {isOffline ? 'Save Locally' : 'Save'}
        </button>
      </div>
    </div>
  );
}
```

### components/gradebook/GradebookGrid.tsx

```typescript
'use client';

import { useState, useCallback } from 'react';
import { GradebookRow } from '@/lib/types/grade';
import { useGradeStore } from '@/lib/store/gradeStore';

interface GradebookGridProps {
  courseId: string;
  rows: GradebookRow[];
  assessments: any[];
}

export function GradebookGrid({ courseId, rows, assessments }: GradebookGridProps) {
  const { updateGrade } = useGradeStore();
  const [editingCell, setEditingCell] = useState<{ row: string; col: string } | null>(null);

  const handleCellEdit = useCallback(
    async (studentId: string, assessmentId: string, value: number) => {
      // Find grade entry ID
      const gradeId = '...'; // Lookup from data
      await updateGrade(gradeId, value);
      setEditingCell(null);
    },
    [updateGrade]
  );

  return (
    <div className="gradebook-grid overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="sticky left-0 bg-gray-100 p-2 border">Student</th>
            {assessments.map((assessment) => (
              <th key={assessment.id} className="p-2 border min-w-[100px]">
                <div>{assessment.title}</div>
                <div className="text-xs text-gray-500">{assessment.weight}%</div>
              </th>
            ))}
            <th className="p-2 border">Total</th>
            <th className="p-2 border">%</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.student_id} className="hover:bg-gray-50">
              <td className="sticky left-0 bg-white p-2 border">
                <div>{row.student_name}</div>
                <div className="text-xs text-gray-500">{row.roll_number}</div>
              </td>
              {assessments.map((assessment) => {
                const grade = row.grades[assessment.id];
                const isEditing =
                  editingCell?.row === row.student_id &&
                  editingCell?.col === assessment.id;

                return (
                  <td
                    key={assessment.id}
                    className="p-2 border text-center cursor-pointer"
                    onClick={() =>
                      setEditingCell({ row: row.student_id, col: assessment.id })
                    }
                  >
                    {isEditing ? (
                      <input
                        type="number"
                        defaultValue={grade || ''}
                        autoFocus
                        onBlur={(e) =>
                          handleCellEdit(
                            row.student_id,
                            assessment.id,
                            parseFloat(e.target.value)
                          )
                        }
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      <span>{grade !== null ? grade : '-'}</span>
                    )}
                  </td>
                );
              })}
              <td className="p-2 border text-center font-medium">{row.total}</td>
              <td className="p-2 border text-center">{row.percentage.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## Offline Storage Utilities

### utils/offlineStorage.ts

```typescript
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface FacultyDB extends DBSchema {
  attendance: {
    key: string;
    value: {
      id: string;
      course_id: string;
      date: string;
      marks: any[];
      created_at: string;
    };
  };
  roster: {
    key: string;
    value: {
      course_id: string;
      students: any[];
      cached_at: string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<FacultyDB>> | null = null;

export async function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<FacultyDB>('faculty-offline-db', 1, {
      upgrade(db) {
        db.createObjectStore('attendance', { keyPath: 'id' });
        db.createObjectStore('roster', { keyPath: 'course_id' });
      },
    });
  }
  return dbPromise;
}

export async function cacheRoster(courseId: string, students: any[]) {
  const db = await getDB();
  await db.put('roster', {
    course_id: courseId,
    students,
    cached_at: new Date().toISOString(),
  });
}

export async function getCachedRoster(courseId: string) {
  const db = await getDB();
  return await db.get('roster', courseId);
}

export async function saveOfflineAttendance(item: any) {
  const db = await getDB();
  await db.put('attendance', item);
}

export async function getOfflineAttendance() {
  const db = await getDB();
  return await db.getAll('attendance');
}

export async function clearOfflineAttendance(id: string) {
  const db = await getDB();
  await db.delete('attendance', id);
}
```

---

## Testing

### __tests__/components/AttendanceGrid.test.tsx

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { AttendanceGrid } from '@/components/attendance/AttendanceGrid';

describe('AttendanceGrid', () => {
  const mockStudents = [
    { id: '1', roll_number: '001', user: { name: 'Student 1', avatar_url: '' } },
    { id: '2', roll_number: '002', user: { name: 'Student 2', avatar_url: '' } },
  ];

  it('renders student list', () => {
    render(
      <AttendanceGrid
        students={mockStudents}
        existingRecords={[]}
        onSave={jest.fn()}
        isOffline={false}
      />
    );

    expect(screen.getByText('Student 1')).toBeInTheDocument();
    expect(screen.getByText('Student 2')).toBeInTheDocument();
  });

  it('marks attendance on button click', () => {
    const onSave = jest.fn();
    render(
      <AttendanceGrid
        students={mockStudents}
        existingRecords={[]}
        onSave={onSave}
        isOffline={false}
      />
    );

    const presentButton = screen.getAllByText('P')[0];
    fireEvent.click(presentButton);

    // Verify button is highlighted
    expect(presentButton).toHaveClass('bg-blue-500');
  });

  it('shows offline banner when offline', () => {
    render(
      <AttendanceGrid
        students={mockStudents}
        existingRecords={[]}
        onSave={jest.fn()}
        isOffline={true}
      />
    );

    expect(screen.getByText(/Offline Mode/)).toBeInTheDocument();
  });
});
```

---

## Performance Optimization

### Virtual Scrolling for Large Lists

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualizedStudentList({ students }: { students: any[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: students.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const student = students[virtualRow.index];
          return (
            <div
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              {/* Student row content */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

This comprehensive frontend guide provides all patterns, components, hooks, and utilities needed for implementing the Faculty/Teacher portal with Next.js 16, ensuring offline capability, performance, and great UX.
