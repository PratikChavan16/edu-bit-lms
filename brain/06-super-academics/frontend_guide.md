# Super Academics Portal - Frontend Implementation Guide

## Overview
Comprehensive frontend implementation guide for the Super Academics portal built with Next.js 15, React 18, TypeScript 5.3, and TailwindCSS 3.4, covering architecture, components, state management, API integration, and performance optimization.

---

## Table of Contents
1. [Technology Stack](#1-technology-stack)
2. [Project Structure](#2-project-structure)
3. [Configuration](#3-configuration)
4. [State Management](#4-state-management)
5. [API Integration](#5-api-integration)
6. [Component Architecture](#6-component-architecture)
7. [Routing & Navigation](#7-routing--navigation)
8. [Forms & Validation](#8-forms--validation)
9. [Performance Optimization](#9-performance-optimization)
10. [Testing](#10-testing)

---

## 1. Technology Stack

### 1.1 Core Framework
- **Next.js**: 15.0.2 (App Router)
- **React**: 18.3.1
- **TypeScript**: 5.3.3
- **Node.js**: 20.x LTS

### 1.2 UI & Styling
- **TailwindCSS**: 3.4.1
- **Headless UI**: 2.0.0 (accessible components)
- **Heroicons**: 2.1.1
- **Radix UI**: 1.0.0 (advanced components)

### 1.3 State Management
- **Zustand**: 4.4.7 (global state)
- **React Query**: 5.0.5 (server state)
- **React Hook Form**: 7.48.2 (form state)

### 1.4 Data Fetching & API
- **Axios**: 1.6.2
- **SWR**: 2.2.4 (alternative to React Query)

### 1.5 Utilities
- **Zod**: 3.22.4 (schema validation)
- **date-fns**: 3.0.0 (date manipulation)
- **Recharts**: 2.10.3 (charts)
- **React DnD**: 16.0.1 (drag-and-drop)

### 1.6 Development Tools
- **ESLint**: 8.56.0
- **Prettier**: 3.1.1
- **TypeScript ESLint**: 6.15.0
- **Playwright**: 1.40.1 (E2E testing)

---

## 2. Project Structure

```
frontend/
├── app/                          # Next.js 15 App Router
│   ├── (auth)/                   # Auth layout group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/              # Dashboard layout group
│   │   ├── curriculum/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── create/
│   │   │       └── page.tsx
│   │   ├── examinations/
│   │   ├── analytics/
│   │   ├── approvals/
│   │   └── layout.tsx
│   ├── api/                      # API routes (if needed)
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── ui/                       # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   └── Card.tsx
│   ├── features/                 # Feature-specific components
│   │   ├── curriculum/
│   │   │   ├── CurriculumList.tsx
│   │   │   ├── CurriculumForm.tsx
│   │   │   ├── CourseManager.tsx
│   │   │   └── CurriculumComparison.tsx
│   │   ├── examinations/
│   │   │   ├── ExamScheduleCalendar.tsx
│   │   │   ├── QuestionBankManager.tsx
│   │   │   └── ExamForm.tsx
│   │   └── analytics/
│   │       ├── PerformanceChart.tsx
│   │       ├── ComplianceWidget.tsx
│   │       └── CollegeRankings.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   └── shared/
│       ├── DataTable.tsx
│       ├── SearchBar.tsx
│       └── Pagination.tsx
├── lib/
│   ├── api/                      # API client
│   │   ├── client.ts
│   │   ├── curriculum.ts
│   │   ├── examinations.ts
│   │   └── analytics.ts
│   ├── hooks/                    # Custom hooks
│   │   ├── useCurriculum.ts
│   │   ├── useAuth.ts
│   │   └── usePermissions.ts
│   ├── stores/                   # Zustand stores
│   │   ├── authStore.ts
│   │   ├── curriculumStore.ts
│   │   └── notificationStore.ts
│   ├── utils/
│   │   ├── cn.ts                 # Class name utility
│   │   ├── formatters.ts
│   │   └── validators.ts
│   └── types/
│       ├── curriculum.ts
│       ├── examination.ts
│       └── api.ts
├── public/
│   ├── images/
│   └── icons/
├── styles/
│   └── globals.css
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 3. Configuration

### 3.1 Next.js Configuration

**File**: `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  images: {
    domains: ['s3.amazonaws.com', 'cdn.example.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;
```

### 3.2 TypeScript Configuration

**File**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/app/*": ["./app/*"]
    },
    "plugins": [
      {
        "name": "next"
      }
    ]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 3.3 TailwindCSS Configuration

**File**: `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        success: {
          500: '#10b981',
          600: '#059669',
        },
        warning: {
          500: '#f59e0b',
          600: '#d97706',
        },
        danger: {
          500: '#ef4444',
          600: '#dc2626',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

---

## 4. State Management

### 4.1 Zustand Store (Auth)

**File**: `lib/stores/authStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  setUser: (user: User, token: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setUser: (user, token) => set({ user, token, isAuthenticated: true }),
      
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      
      hasPermission: (permission) => {
        const { user } = get();
        return user?.permissions.includes(permission) ?? false;
      },
      
      hasRole: (role) => {
        const { user } = get();
        return user?.roles.includes(role) ?? false;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

### 4.2 Zustand Store (Curriculum)

**File**: `lib/stores/curriculumStore.ts`

```typescript
import { create } from 'zustand';

interface Course {
  id: number;
  course_code: string;
  course_name: string;
  credits: number;
  semester: number;
}

interface Curriculum {
  id: number;
  program_name: string;
  status: string;
  courses: Course[];
}

interface CurriculumState {
  selectedCurriculum: Curriculum | null;
  curriculumList: Curriculum[];
  filters: {
    status: string | null;
    degree_type: string | null;
  };
  
  setSelectedCurriculum: (curriculum: Curriculum | null) => void;
  setCurriculumList: (list: Curriculum[]) => void;
  setFilters: (filters: Partial<CurriculumState['filters']>) => void;
  resetFilters: () => void;
}

export const useCurriculumStore = create<CurriculumState>((set) => ({
  selectedCurriculum: null,
  curriculumList: [],
  filters: {
    status: null,
    degree_type: null,
  },
  
  setSelectedCurriculum: (curriculum) => set({ selectedCurriculum: curriculum }),
  
  setCurriculumList: (list) => set({ curriculumList: list }),
  
  setFilters: (newFilters) => 
    set((state) => ({ filters: { ...state.filters, ...newFilters } })),
  
  resetFilters: () => set({ filters: { status: null, degree_type: null } }),
}));
```

---

## 5. API Integration

### 5.1 Axios Client Setup

**File**: `lib/api/client.ts`

```typescript
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/lib/stores/authStore';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - logout user
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      // Forbidden
      throw new Error('You do not have permission to perform this action.');
    }
    
    if (error.response?.status === 429) {
      // Rate limit exceeded
      throw new Error('Too many requests. Please try again later.');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 5.2 Curriculum API

**File**: `lib/api/curriculum.ts`

```typescript
import apiClient from './client';
import { Curriculum, CreateCurriculumPayload } from '@/lib/types/curriculum';

export const curriculumApi = {
  // List curricula
  list: async (params?: { status?: string; degree_type?: string }) => {
    const { data } = await apiClient.get<{ data: Curriculum[] }>('/curriculum', { params });
    return data.data;
  },
  
  // Get single curriculum
  get: async (id: number) => {
    const { data } = await apiClient.get<{ data: Curriculum }>(`/curriculum/${id}`);
    return data.data;
  },
  
  // Create curriculum
  create: async (payload: CreateCurriculumPayload) => {
    const { data } = await apiClient.post<{ data: Curriculum }>('/curriculum', payload);
    return data.data;
  },
  
  // Update curriculum
  update: async (id: number, payload: Partial<CreateCurriculumPayload>) => {
    const { data } = await apiClient.put<{ data: Curriculum }>(`/curriculum/${id}`, payload);
    return data.data;
  },
  
  // Delete curriculum
  delete: async (id: number) => {
    await apiClient.delete(`/curriculum/${id}`);
  },
  
  // Publish curriculum
  publish: async (id: number, collegeIds: number[]) => {
    await apiClient.post(`/curriculum/${id}/publish`, { college_ids: collegeIds });
  },
  
  // Get statistics
  stats: async (id: number) => {
    const { data } = await apiClient.get(`/curriculum/${id}/stats`);
    return data.data;
  },
  
  // Compare curricula
  compare: async (id1: number, id2: number) => {
    const { data } = await apiClient.post('/curriculum/compare', {
      curriculum_id_1: id1,
      curriculum_id_2: id2,
    });
    return data.data;
  },
};
```

### 5.3 React Query Hook

**File**: `lib/hooks/useCurriculum.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { curriculumApi } from '@/lib/api/curriculum';
import { CreateCurriculumPayload } from '@/lib/types/curriculum';
import { toast } from 'sonner';

// List curricula
export const useCurriculaList = (filters?: { status?: string }) => {
  return useQuery({
    queryKey: ['curricula', filters],
    queryFn: () => curriculumApi.list(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single curriculum
export const useCurriculum = (id: number) => {
  return useQuery({
    queryKey: ['curriculum', id],
    queryFn: () => curriculumApi.get(id),
    enabled: !!id,
  });
};

// Create curriculum
export const useCreateCurriculum = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: CreateCurriculumPayload) => curriculumApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curricula'] });
      toast.success('Curriculum created successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create curriculum');
    },
  });
};

// Update curriculum
export const useUpdateCurriculum = (id: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (payload: Partial<CreateCurriculumPayload>) => 
      curriculumApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curricula'] });
      queryClient.invalidateQueries({ queryKey: ['curriculum', id] });
      toast.success('Curriculum updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update curriculum');
    },
  });
};

// Publish curriculum
export const usePublishCurriculum = (id: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (collegeIds: number[]) => curriculumApi.publish(id, collegeIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['curriculum', id] });
      toast.success('Curriculum published successfully!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to publish curriculum');
    },
  });
};
```

---

## 6. Component Architecture

### 6.1 Base Button Component

**File**: `components/ui/Button.tsx`

```typescript
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
    };
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-lg',
          'transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### 6.2 Data Table Component

**File**: `components/ui/Table.tsx`

```typescript
import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function Table<T extends Record<string, any>>({
  data,
  columns,
  keyField,
  onRowClick,
  isLoading,
  emptyMessage = 'No data available',
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        {emptyMessage}
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr
              key={String(row[keyField])}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'hover:bg-gray-50 transition-colors',
                onRowClick && 'cursor-pointer'
              )}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.render
                    ? column.render(row)
                    : row[column.key as keyof T]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 6.3 Curriculum List Component

**File**: `components/features/curriculum/CurriculumList.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCurriculaList } from '@/lib/hooks/useCurriculum';
import { Table } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function CurriculumList() {
  const router = useRouter();
  const [filters, setFilters] = useState({ status: '' });
  const { data: curricula, isLoading } = useCurriculaList(filters);
  
  const columns = [
    {
      key: 'program_name',
      header: 'Program Name',
    },
    {
      key: 'degree_type',
      header: 'Degree Type',
      render: (row: any) => (
        <span className="capitalize">{row.degree_type}</span>
      ),
    },
    {
      key: 'total_credits',
      header: 'Credits',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: any) => (
        <Badge variant={row.status === 'active' ? 'success' : 'warning'}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: 'colleges_count',
      header: 'Colleges',
      render: (row: any) => row.colleges?.length || 0,
    },
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Curriculum Management</h1>
        <Button onClick={() => router.push('/curriculum/create')}>
          Create Curriculum
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow">
        <Table
          data={curricula || []}
          columns={columns}
          keyField="id"
          onRowClick={(row) => router.push(`/curriculum/${row.id}`)}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
```

---

## 7. Routing & Navigation

### 7.1 App Router Page

**File**: `app/(dashboard)/curriculum/page.tsx`

```typescript
import { Metadata } from 'next';
import { CurriculumList } from '@/components/features/curriculum/CurriculumList';

export const metadata: Metadata = {
  title: 'Curriculum Management | Super Academics',
  description: 'Manage academic curricula across colleges',
};

export default function CurriculumPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CurriculumList />
    </div>
  );
}
```

### 7.2 Protected Route

**File**: `app/(dashboard)/layout.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

## 8. Forms & Validation

### 8.1 Curriculum Form with React Hook Form

**File**: `components/features/curriculum/CurriculumForm.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useCreateCurriculum } from '@/lib/hooks/useCurriculum';

const curriculumSchema = z.object({
  program_name: z.string().min(3, 'Program name must be at least 3 characters'),
  degree_type: z.enum(['bachelor', 'master', 'diploma']),
  duration_years: z.number().min(1).max(6),
  total_credits: z.number().min(1).max(300),
  effective_from: z.string(),
});

type CurriculumFormData = z.infer<typeof curriculumSchema>;

export function CurriculumForm() {
  const createMutation = useCreateCurriculum();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CurriculumFormData>({
    resolver: zodResolver(curriculumSchema),
  });
  
  const onSubmit = async (data: CurriculumFormData) => {
    await createMutation.mutateAsync(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Program Name
        </label>
        <Input
          {...register('program_name')}
          placeholder="Bachelor of Computer Science"
          error={errors.program_name?.message}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Degree Type
        </label>
        <Select
          {...register('degree_type')}
          options={[
            { value: 'bachelor', label: 'Bachelor' },
            { value: 'master', label: 'Master' },
            { value: 'diploma', label: 'Diploma' },
          ]}
          error={errors.degree_type?.message}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Duration (Years)
          </label>
          <Input
            type="number"
            {...register('duration_years', { valueAsNumber: true })}
            error={errors.duration_years?.message}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Total Credits
          </label>
          <Input
            type="number"
            {...register('total_credits', { valueAsNumber: true })}
            error={errors.total_credits?.message}
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Effective From
        </label>
        <Input
          type="date"
          {...register('effective_from')}
          error={errors.effective_from?.message}
        />
      </div>
      
      <Button
        type="submit"
        isLoading={isSubmitting}
        className="w-full"
      >
        Create Curriculum
      </Button>
    </form>
  );
}
```

---

## 9. Performance Optimization

### 9.1 Code Splitting & Lazy Loading

```typescript
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const CurriculumComparison = lazy(() => 
  import('@/components/features/curriculum/CurriculumComparison')
);

export function CurriculumPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CurriculumComparison id1={1} id2={2} />
    </Suspense>
  );
}
```

### 9.2 Image Optimization

```typescript
import Image from 'next/image';

export function CollegeLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={200}
      height={100}
      quality={85}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,..."
    />
  );
}
```

### 9.3 Memoization

```typescript
import { useMemo } from 'react';

export function PerformanceChart({ data }: { data: any[] }) {
  const chartData = useMemo(() => {
    return data.map(item => ({
      ...item,
      calculated: expensiveCalculation(item),
    }));
  }, [data]);
  
  return <Recharts data={chartData} />;
}
```

---

## 10. Testing

### 10.1 Component Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('shows loading state', () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

*This comprehensive frontend guide provides a solid foundation for building a modern, performant, and maintainable Super Academics portal with Next.js 15 and React 18.*
