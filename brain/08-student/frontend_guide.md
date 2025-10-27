# Student Portal - Frontend Implementation Guide

**Version**: 2.0  
**Framework**: Next.js 16 + React 19 + TypeScript 5.6  
**Last Updated**: October 25, 2025

---

## Project Structure

```
apps/student/
├── app/
│   ├── layout.tsx                 # Root layout
│   ├── page.tsx                   # Dashboard (/)
│   ├── courses/
│   │   ├── page.tsx              # Courses list
│   │   └── [id]/
│   │       ├── page.tsx          # Course details
│   │       └── materials/
│   │           └── page.tsx      # Course materials
│   ├── attendance/
│   │   ├── page.tsx              # Attendance overview
│   │   └── [courseId]/
│   │       └── page.tsx          # Course-specific attendance
│   ├── grades/
│   │   └── page.tsx              # Grades & CGPA
│   ├── assignments/
│   │   ├── page.tsx              # Assignments list
│   │   └── [id]/
│   │       ├── page.tsx          # Assignment details
│   │       └── submit/
│   │           └── page.tsx      # Submit assignment
│   ├── timetable/
│   │   └── page.tsx              # Weekly timetable
│   ├── fees/
│   │   ├── page.tsx              # Fee overview
│   │   ├── pay/
│   │   │   └── page.tsx          # Payment page
│   │   └── history/
│   │       └── page.tsx          # Payment history
│   ├── profile/
│   │   ├── page.tsx              # View profile
│   │   ├── edit/
│   │   │   └── page.tsx          # Edit profile
│   │   └── change-password/
│   │       └── page.tsx          # Change password
│   ├── notifications/
│   │   └── page.tsx              # Notifications list
│   └── support/
│       ├── page.tsx              # Support home
│       ├── contact/
│       │   └── page.tsx          # Contact faculty
│       └── complaint/
│           └── page.tsx          # Raise complaint
├── components/
│   ├── dashboard/
│   ├── courses/
│   ├── attendance/
│   ├── grades/
│   ├── assignments/
│   ├── timetable/
│   ├── fees/
│   ├── profile/
│   ├── notifications/
│   ├── support/
│   └── shared/
│       ├── Layout.tsx
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       ├── StatCard.tsx
│       ├── DataTable.tsx
│       ├── Modal.tsx
│       ├── FileUpload.tsx
│       └── ...
├── lib/
│   ├── api/
│   │   ├── client.ts            # Axios instance
│   │   ├── students.ts          # Student API calls
│   │   ├── courses.ts           # Course API calls
│   │   ├── attendance.ts        # Attendance API calls
│   │   ├── grades.ts            # Grades API calls
│   │   ├── assignments.ts       # Assignment API calls
│   │   ├── fees.ts              # Fee API calls
│   │   └── notifications.ts     # Notification API calls
│   ├── store/
│   │   ├── authStore.ts         # Auth state (Zustand)
│   │   ├── studentStore.ts      # Student data state
│   │   └── uiStore.ts           # UI state (sidebar, modals)
│   ├── hooks/
│   │   ├── useAuth.ts           # Auth hook
│   │   ├── useStudent.ts        # Student data hook
│   │   ├── useNotifications.ts  # Notifications hook
│   │   └── useFileUpload.ts     # File upload hook
│   ├── utils/
│   │   ├── formatters.ts        # Date, number formatters
│   │   ├── validators.ts        # Zod schemas
│   │   ├── constants.ts         # Constants
│   │   └── helpers.ts           # Helper functions
│   └── types/
│       ├── student.ts           # Student types
│       ├── course.ts            # Course types
│       ├── attendance.ts        # Attendance types
│       ├── grade.ts             # Grade types
│       ├── assignment.ts        # Assignment types
│       ├── fee.ts               # Fee types
│       └── notification.ts      # Notification types
├── public/
│   ├── icons/
│   └── images/
├── styles/
│   └── globals.css
├── .env.local
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## TypeScript Interfaces

### types/student.ts

```typescript
export interface Student {
  id: string;
  user_id: string;
  college_id: string;
  department_id: string;
  roll_number: string;
  enrollment_year: number;
  current_semester: number;
  status: 'active' | 'on_leave' | 'graduated' | 'suspended';
  dob: string;
  gender: 'male' | 'female' | 'other';
  blood_group?: string;
  address?: string;
  guardian_name?: string;
  guardian_phone?: string;
  cgpa?: number;
  user: User;
  college: College;
  department: Department;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
}

export interface College {
  id: string;
  name: string;
  code: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
}

export interface DashboardStats {
  current_semester: number;
  cgpa: number;
  attendance_percentage: number;
  pending_assignments: number;
  outstanding_fees: number;
}
```

### types/course.ts

```typescript
export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
  semester: number;
  department: Department;
}

export interface Enrollment {
  id: string;
  student_id: string;
  course_id: string;
  academic_year_id: string;
  enrolled_at: string;
  status: 'enrolled' | 'dropped' | 'completed';
  current_grade?: string;
  attendance_percentage: number;
  course: Course;
}
```

### types/attendance.ts

```typescript
export interface Attendance {
  id: string;
  student_id: string;
  course_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  marked_by: string;
  marked_at: string;
  course?: Course;
}

export interface AttendanceSummary {
  total_classes: number;
  present: number;
  absent: number;
  percentage: number;
}
```

### types/grade.ts

```typescript
export interface Grade {
  id: string;
  student_id: string;
  course_id: string;
  exam_type: 'assignment' | 'quiz' | 'mid_term' | 'end_term' | 'project';
  component_name: string;
  marks_obtained: number;
  max_marks: number;
  weightage: number;
  grade?: string;
  graded_by: string;
  graded_at: string;
  feedback?: string;
  course?: Course;
}

export interface CGPAData {
  cgpa: number;
  semester_gpas: Array<{
    semester: number;
    gpa: number;
    credits: number;
  }>;
}
```

### types/assignment.ts

```typescript
export interface Assignment {
  id: string;
  course_id: string;
  title: string;
  description: string;
  max_marks: number;
  due_date: string;
  attachment_url?: string;
  course?: Course;
}

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  file_url: string;
  submitted_at: string;
  status: 'submitted' | 'graded' | 'returned';
  marks_obtained?: number;
  grade?: string;
  feedback?: string;
  graded_at?: string;
}
```

---

## State Management (Zustand)

### store/authStore.ts

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, refreshToken: string, user: User) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, refreshToken, user) =>
        set({ token, refreshToken, user, isAuthenticated: true }),
      clearAuth: () =>
        set({ token: null, refreshToken: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

### store/studentStore.ts

```typescript
import { create } from 'zustand';
import { Student, DashboardStats } from '@/lib/types/student';

interface StudentState {
  student: Student | null;
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  setStudent: (student: Student) => void;
  setStats: (stats: DashboardStats) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStudentStore = create<StudentState>((set) => ({
  student: null,
  stats: null,
  loading: false,
  error: null,
  setStudent: (student) => set({ student }),
  setStats: (stats) => set({ stats }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
```

---

## API Client

### lib/api/client.ts

```typescript
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/lib/store/authStore';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor (handle token refresh)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const { token, refresh_token, user } = data.data;
        useAuthStore.getState().setAuth(token, refresh_token, user);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

### lib/api/students.ts

```typescript
import apiClient from './client';
import { Student, DashboardStats } from '@/lib/types/student';

export const studentsApi = {
  getMe: async (): Promise<Student> => {
    const { data } = await apiClient.get('/students/me');
    return data.data;
  },

  getDashboard: async (studentId: string) => {
    const { data } = await apiClient.get(`/students/${studentId}/dashboard`);
    return data.data;
  },

  updateProfile: async (studentId: string, updates: Partial<Student>) => {
    const { data } = await apiClient.put(`/students/${studentId}`, updates);
    return data.data;
  },

  uploadPhoto: async (studentId: string, file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    const { data } = await apiClient.post(
      `/students/${studentId}/photo`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return data.data;
  },
};
```

---

## Components

### components/shared/StatCard.tsx

```typescript
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendValue,
  onClick,
}: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow p-6 ${
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
          {trend && trendValue && (
            <div className="mt-2 flex items-center text-sm">
              <span
                className={`font-medium ${
                  trend === 'up'
                    ? 'text-green-600'
                    : trend === 'down'
                    ? 'text-red-600'
                    : 'text-gray-600'
                }`}
              >
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className="p-3 bg-primary-50 rounded-full">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
      </div>
    </div>
  );
}
```

### components/shared/FileUpload.tsx

```typescript
'use client';

import { useState, useRef } from 'react';
import { Upload, X, FileIcon } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
  label?: string;
}

export function FileUpload({
  onFileSelect,
  accept = '.pdf,.docx,.zip',
  maxSize = 10 * 1024 * 1024, // 10MB
  label = 'Upload File',
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (file.size > maxSize) {
      setError(`File size must be less than ${maxSize / 1024 / 1024}MB`);
      return false;
    }
    return true;
  };

  const handleFileChange = (selectedFile: File) => {
    setError('');
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      onFileSelect(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Drag and drop your file here, or{' '}
            <button
              type="button"
              className="text-primary-600 hover:text-primary-500 font-medium"
              onClick={() => fileInputRef.current?.click()}
            >
              browse
            </button>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Accepted: {accept} | Max: {maxSize / 1024 / 1024}MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) handleFileChange(selectedFile);
            }}
          />
        </div>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileIcon className="h-8 w-8 text-primary-500" />
            <div>
              <p className="text-sm font-medium text-gray-900">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
```

---

## Form Validation (Zod)

### lib/utils/validators.ts

```typescript
import { z } from 'zod';

export const profileUpdateSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
  blood_group: z.string().max(5).optional(),
  address: z.string().max(500).optional(),
  guardian_name: z.string().max(255).optional(),
  guardian_phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
});

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number'),
  new_password_confirmation: z.string(),
}).refine((data) => data.new_password === data.new_password_confirmation, {
  message: 'Passwords do not match',
  path: ['new_password_confirmation'],
});

export const assignmentSubmissionSchema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => f.size <= 10 * 1024 * 1024, 'Max file size is 10MB')
    .refine(
      (f) =>
        ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'].includes(f.type),
      'Only PDF, DOCX, ZIP files are allowed'
    ),
  comments: z.string().max(500).optional(),
});
```

---

**⚛️ This frontend guide provides the complete architecture for implementing the Student Portal with Next.js and TypeScript.**
