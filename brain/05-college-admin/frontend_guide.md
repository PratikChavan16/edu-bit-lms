# College Admin Portal - Frontend Implementation Guide

## Overview
Comprehensive frontend implementation guide for the College Admin portal built with Next.js 15, React 18.3, TypeScript 5.3, and TailwindCSS 3.4. This guide covers architecture, component patterns, state management, performance optimization, and best practices.

## Technology Stack

### Core Framework
- **Next.js 15.0**: React framework with App Router
- **React 18.3**: UI library with concurrent features
- **TypeScript 5.3**: Type-safe JavaScript
- **TailwindCSS 3.4**: Utility-first CSS framework

### State Management
- **TanStack Query (React Query) v5**: Server state management
- **Zustand 4.4**: Client state management
- **React Hook Form 7.48**: Form state management

### UI Components
- **Shadcn/ui**: Accessible component primitives
- **Radix UI**: Headless UI components
- **Lucide Icons**: Icon library
- **Recharts**: Charting library

### Data Visualization
- **Chart.js 4.4**: Complex charts
- **React Leaflet**: Maps for GPS tracking
- **Date-fns**: Date manipulation

### Development Tools
- **ESLint 8.54**: Linting
- **Prettier 3.1**: Code formatting
- **Husky**: Git hooks
- **TypeScript ESLint**: TypeScript linting

---

## 1. Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth layout group
│   │   ├── login/
│   │   └── forgot-password/
│   ├── (dashboard)/              # Dashboard layout group
│   │   ├── layout.tsx            # Main dashboard layout
│   │   ├── page.tsx              # Dashboard home
│   │   ├── staff/
│   │   │   ├── page.tsx          # Staff list
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx      # Staff detail
│   │   │   ├── create/
│   │   │   └── import/
│   │   ├── infrastructure/
│   │   ├── transport/
│   │   ├── hostel/
│   │   ├── documents/
│   │   ├── vendors/
│   │   ├── grievances/
│   │   └── library/
│   ├── api/                      # API routes (if needed)
│   ├── layout.tsx                # Root layout
│   └── providers.tsx             # App providers
├── components/
│   ├── ui/                       # Shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── features/                 # Feature-specific components
│   │   ├── staff/
│   │   │   ├── staff-table.tsx
│   │   │   ├── staff-form.tsx
│   │   │   ├── staff-filters.tsx
│   │   │   └── staff-stats.tsx
│   │   ├── transport/
│   │   ├── infrastructure/
│   │   └── ...
│   ├── layout/                   # Layout components
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   ├── breadcrumbs.tsx
│   │   └── footer.tsx
│   └── shared/                   # Shared components
│       ├── data-table.tsx
│       ├── search-input.tsx
│       ├── date-picker.tsx
│       └── file-upload.tsx
├── lib/
│   ├── api/                      # API client
│   │   ├── client.ts             # Axios instance
│   │   ├── staff.ts              # Staff API methods
│   │   ├── infrastructure.ts
│   │   └── ...
│   ├── hooks/                    # Custom hooks
│   │   ├── use-staff.ts
│   │   ├── use-transport.ts
│   │   └── use-auth.ts
│   ├── stores/                   # Zustand stores
│   │   ├── ui-store.ts
│   │   └── auth-store.ts
│   ├── utils/                    # Utility functions
│   │   ├── cn.ts                 # Class name merger
│   │   ├── format.ts
│   │   └── validation.ts
│   └── types/                    # TypeScript types
│       ├── staff.ts
│       ├── api.ts
│       └── ...
├── public/
│   ├── images/
│   ├── icons/
│   └── locales/
├── styles/
│   └── globals.css
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 2. Core Configuration

### 2.1 Next.js Configuration

**File**: `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // For Docker deployment
  
  images: {
    domains: ['edubit-storage.s3.amazonaws.com', 'localhost'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'college-admin.edubit.com'],
    },
  },
  
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### 2.2 TypeScript Configuration

**File**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/app/*": ["./app/*"],
      "@/types/*": ["./lib/types/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 2.3 TailwindCSS Configuration

**File**: `tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/forms')],
};

export default config;
```

---

## 3. API Client Setup

### 3.1 Axios Instance

**File**: `lib/api/client.ts`

```typescript
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/lib/stores/auth-store';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    const collegeId = useAuthStore.getState().user?.college_id;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    if (collegeId) {
      config.headers['X-College-ID'] = collegeId;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });
        
        const { access_token } = response.data;
        useAuthStore.getState().setToken(access_token);
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle other errors
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 3.2 API Methods

**File**: `lib/api/staff.ts`

```typescript
import apiClient from './client';
import { Staff, StaffCreateInput, StaffUpdateInput, PaginatedResponse } from '@/types/staff';

export const staffApi = {
  // Get staff list with pagination and filters
  getStaff: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    department_id?: string;
    status?: string;
  }): Promise<PaginatedResponse<Staff>> => {
    const response = await apiClient.get('/staff', { params });
    return response.data;
  },

  // Get single staff member
  getStaffById: async (id: string): Promise<Staff> => {
    const response = await apiClient.get(`/staff/${id}`);
    return response.data.data;
  },

  // Create staff member
  createStaff: async (data: StaffCreateInput): Promise<Staff> => {
    const response = await apiClient.post('/staff', data);
    return response.data.data;
  },

  // Update staff member
  updateStaff: async (id: string, data: StaffUpdateInput): Promise<Staff> => {
    const response = await apiClient.put(`/staff/${id}`, data);
    return response.data.data;
  },

  // Delete staff member
  deleteStaff: async (id: string): Promise<void> => {
    await apiClient.delete(`/staff/${id}`);
  },

  // Bulk import staff
  importStaff: async (file: File): Promise<{ imported: number; failed: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post('/staff/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Export staff to Excel
  exportStaff: async (filters?: object): Promise<Blob> => {
    const response = await apiClient.get('/staff/export', {
      params: filters,
      responseType: 'blob',
    });
    
    return response.data;
  },

  // Get staff attendance
  getStaffAttendance: async (staffId: string, startDate: string, endDate: string) => {
    const response = await apiClient.get(`/staff/${staffId}/attendance`, {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data.data;
  },
};
```

---

## 4. State Management

### 4.1 React Query Setup

**File**: `app/providers.tsx`

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 4.2 Custom Hooks with React Query

**File**: `lib/hooks/use-staff.ts`

```typescript
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '@/lib/api/staff';
import { Staff, StaffCreateInput, StaffUpdateInput } from '@/types/staff';
import { useToast } from '@/components/ui/use-toast';

export function useStaff(params?: {
  page?: number;
  per_page?: number;
  search?: string;
  department_id?: string;
  status?: string;
}) {
  return useQuery({
    queryKey: ['staff', params],
    queryFn: () => staffApi.getStaff(params),
  });
}

export function useStaffById(id: string) {
  return useQuery({
    queryKey: ['staff', id],
    queryFn: () => staffApi.getStaffById(id),
    enabled: !!id,
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: StaffCreateInput) => staffApi.createStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: 'Success',
        description: 'Staff member created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create staff member',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: StaffUpdateInput }) =>
      staffApi.updateStaff(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      queryClient.invalidateQueries({ queryKey: ['staff', variables.id] });
      toast({
        title: 'Success',
        description: 'Staff member updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update staff member',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => staffApi.deleteStaff(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: 'Success',
        description: 'Staff member deleted successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete staff member',
        variant: 'destructive',
      });
    },
  });
}

export function useImportStaff() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (file: File) => staffApi.importStaff(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({
        title: 'Import Complete',
        description: `Successfully imported ${data.imported} staff members. ${data.failed} failed.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Import Failed',
        description: error.response?.data?.message || 'Failed to import staff',
        variant: 'destructive',
      });
    },
  });
}
```

### 4.3 Zustand Store for UI State

**File**: `lib/stores/ui-store.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIStore {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  collapseSidebar: (collapsed: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarOpen: true,
      sidebarCollapsed: false,
      theme: 'light',
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      collapseSidebar: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-store',
    }
  )
);
```

### 4.4 Auth Store

**File**: `lib/stores/auth-store.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  college_id: string;
  permissions: string[];
}

interface AuthStore {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      logout: () => set({ user: null, token: null, refreshToken: null }),
      hasPermission: (permission) => {
        const user = get().user;
        return user?.permissions.includes(permission) || false;
      },
    }),
    {
      name: 'auth-store',
    }
  )
);
```

---

## 5. Component Patterns

### 5.1 Staff Table Component

**File**: `components/features/staff/staff-table.tsx`

```typescript
'use client';

import { useMemo, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Staff } from '@/types/staff';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StaffTableProps {
  data: Staff[];
  onEdit: (staff: Staff) => void;
  onDelete: (staff: Staff) => void;
}

export function StaffTable({ data, onEdit, onDelete }: StaffTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<Staff>[] = useMemo(
    () => [
      {
        accessorKey: 'employee_id',
        header: 'Employee ID',
      },
      {
        accessorKey: 'full_name',
        header: 'Name',
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.full_name}</div>
            <div className="text-sm text-muted-foreground">{row.original.email}</div>
          </div>
        ),
      },
      {
        accessorKey: 'designation',
        header: 'Designation',
      },
      {
        accessorKey: 'department',
        header: 'Department',
        cell: ({ row }) => row.original.department?.name || 'N/A',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => (
          <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(row.original)}>
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            data.length
          )}{' '}
          of {data.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
```

### 5.2 Staff Form Component

**File**: `components/features/staff/staff-form.tsx`

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Staff } from '@/types/staff';

const staffFormSchema = z.object({
  employee_id: z.string().min(1, 'Employee ID is required'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  designation: z.string().min(1, 'Designation is required'),
  department_id: z.string().min(1, 'Department is required'),
  employment_type: z.enum(['full_time', 'part_time', 'contract']),
  joining_date: z.string(),
});

type StaffFormValues = z.infer<typeof staffFormSchema>;

interface StaffFormProps {
  staff?: Staff;
  onSubmit: (data: StaffFormValues) => void;
  onCancel: () => void;
}

export function StaffForm({ staff, onSubmit, onCancel }: StaffFormProps) {
  const form = useForm<StaffFormValues>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: staff || {
      employee_id: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      designation: '',
      department_id: '',
      employment_type: 'full_time',
      joining_date: new Date().toISOString().split('T')[0],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="employee_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employee ID</FormLabel>
                <FormControl>
                  <Input placeholder="EMP001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employment_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Employment Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="full_time">Full Time</SelectItem>
                    <SelectItem value="part_time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="designation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Designation</FormLabel>
                <FormControl>
                  <Input placeholder="Professor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="joining_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Joining Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{staff ? 'Update' : 'Create'} Staff</Button>
        </div>
      </form>
    </Form>
  );
}
```

---

## 6. Performance Optimization

### 6.1 Code Splitting

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const ReportGenerator = dynamic(() => import('@/components/features/reports/report-generator'), {
  loading: () => <Skeleton className="h-96 w-full" />,
  ssr: false,
});

const MapView = dynamic(() => import('@/components/features/transport/map-view'), {
  loading: () => <div>Loading map...</div>,
  ssr: false,
});
```

### 6.2 Image Optimization

```typescript
import Image from 'next/image';

<Image
  src={staff.photo}
  alt={staff.full_name}
  width={150}
  height={150}
  className="rounded-full"
  priority={false}
  quality={85}
  placeholder="blur"
  blurDataURL={staff.photoBlur}
/>
```

### 6.3 Memoization

```typescript
import { useMemo } from 'react';

const filteredStaff = useMemo(() => {
  return staff.filter((s) => {
    if (filters.department && s.department_id !== filters.department) return false;
    if (filters.status && s.status !== filters.status) return false;
    if (filters.search && !s.full_name.toLowerCase().includes(filters.search.toLowerCase()))
      return false;
    return true;
  });
}, [staff, filters]);
```

---

## 7. Testing

### 7.1 Component Testing

```typescript
// __tests__/components/staff-table.test.tsx
import { render, screen } from '@testing-library/react';
import { StaffTable } from '@/components/features/staff/staff-table';

const mockStaff = [
  {
    id: '1',
    employee_id: 'EMP001',
    full_name: 'John Doe',
    email: 'john@example.com',
    designation: 'Professor',
    status: 'active',
  },
];

describe('StaffTable', () => {
  it('renders staff data correctly', () => {
    render(<StaffTable data={mockStaff} onEdit={jest.fn()} onDelete={jest.fn()} />);
    
    expect(screen.getByText('EMP001')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Professor')).toBeInTheDocument();
  });
});
```

---

*This frontend implementation guide provides a comprehensive foundation for building the College Admin portal with modern React patterns, TypeScript safety, and performance optimization.*
