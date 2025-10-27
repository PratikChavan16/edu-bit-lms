# Admission Admin Portal - Frontend Guide

**Next.js 15 + React Implementation Guide**  
**Port:** 3010  
**Framework:** Next.js 15 (App Router), React 18, TypeScript 5  
**State Management:** TanStack Query v5, React Context API  
**UI Library:** Tailwind CSS v3, shadcn/ui components  
**Data Visualization:** Recharts v2, Chart.js v4  
**Form Handling:** React Hook Form v7 + Zod validation  
**Real-time:** WebSocket (Socket.io-client v4)

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Component Architecture](#component-architecture)
3. [State Management](#state-management)
4. [API Integration](#api-integration)
5. [Form Handling](#form-handling)
6. [Real-time Updates](#real-time-updates)
7. [UI Components](#ui-components)
8. [Routing & Navigation](#routing--navigation)
9. [Performance Optimization](#performance-optimization)
10. [Accessibility](#accessibility)
11. [Testing](#testing)
12. [Code Examples](#code-examples)

---

## 1. Project Structure

```
admission-admin-frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Sidebar + Header layout
│   │   ├── page.tsx                # Dashboard home
│   │   ├── applications/
│   │   │   ├── page.tsx            # Application list
│   │   │   └── [id]/
│   │   │       ├── page.tsx        # Application detail
│   │   │       └── verify/page.tsx # Document verification
│   │   ├── merit-lists/
│   │   │   ├── page.tsx            # Merit list management
│   │   │   └── [id]/page.tsx       # Merit list detail
│   │   ├── seat-allocation/
│   │   │   └── page.tsx            # Seat allocation matrix
│   │   ├── communications/
│   │   │   └── page.tsx            # Bulk email/SMS center
│   │   ├── reports/
│   │   │   └── page.tsx            # Reports & analytics
│   │   └── settings/
│   │       └── page.tsx            # System configuration
│   ├── api/                        # API route handlers (optional proxy)
│   ├── layout.tsx                  # Root layout
│   └── globals.css
├── components/
│   ├── ui/                         # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── dashboard/
│   │   ├── StatsCard.tsx
│   │   ├── ApplicationChart.tsx
│   │   └── RecentActivity.tsx
│   ├── applications/
│   │   ├── ApplicationTable.tsx
│   │   ├── ApplicationFilters.tsx
│   │   ├── ApplicationDetail.tsx
│   │   └── DocumentVerification.tsx
│   ├── merit-lists/
│   │   ├── MeritListGenerator.tsx
│   │   ├── FormulaConfigurator.tsx
│   │   └── MeritPreview.tsx
│   ├── seat-allocation/
│   │   ├── AllocationMatrix.tsx
│   │   └── SeatAvailability.tsx
│   ├── communications/
│   │   ├── BulkEmailForm.tsx
│   │   └── SMSComposer.tsx
│   └── shared/
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       ├── ErrorBoundary.tsx
│       └── LoadingSpinner.tsx
├── hooks/
│   ├── useApplications.ts
│   ├── useMeritLists.ts
│   ├── useDocumentVerification.ts
│   ├── usePayments.ts
│   ├── useAuth.ts
│   └── useWebSocket.ts
├── lib/
│   ├── api.ts                      # API client (axios/fetch wrapper)
│   ├── auth.ts                     # Auth utilities
│   ├── validation.ts               # Zod schemas
│   ├── utils.ts                    # Helper functions
│   └── constants.ts
├── types/
│   ├── application.ts
│   ├── document.ts
│   ├── merit-list.ts
│   └── user.ts
├── context/
│   ├── AuthContext.tsx
│   └── WebSocketContext.tsx
└── package.json
```

---

## 2. Component Architecture

### 2.1 Layout Components

**Root Layout** (`app/layout.tsx`)
- Global providers (TanStack Query, Auth Context, WebSocket Context)
- Font loading (Inter, Roboto)
- Metadata configuration

**Dashboard Layout** (`app/(dashboard)/layout.tsx`)
- Sidebar navigation (collapsed/expanded states)
- Header with user menu, notifications, logout
- Breadcrumb navigation
- Role-based menu rendering

### 2.2 Page Components

**Dashboard Page** (`app/(dashboard)/page.tsx`)
- Stats cards (Total Applications, Pending Verification, Merit Lists Published, Seats Allocated)
- Application status pie chart
- Recent activity feed (last 10 actions)
- Quick actions (Create Merit List, Send Communication, Generate Report)

**Application List Page** (`app/(dashboard)/applications/page.tsx`)
- Filter sidebar (Status, Program, Category, Date Range, Search)
- Data table with sorting, pagination (50 items/page)
- Bulk actions (Assign Verifier, Export CSV, Send Email)
- Real-time updates (new applications appear without refresh)

**Application Detail Page** (`app/(dashboard)/applications/[id]/page.tsx`)
- Tabbed interface (Personal, Academic, Documents, Payment, Timeline)
- Edit mode with validation
- Status change workflow
- Activity timeline (audit log visualization)

**Document Verification Page** (`app/(dashboard)/applications/[id]/verify/page.tsx`)
- Split-screen layout (uploaded document on left, OCR data on right)
- Side-by-side comparison
- Approval/Rejection workflow with comments
- Fraud detection alerts
- Next document navigation

**Merit List Generator** (`app/(dashboard)/merit-lists/page.tsx`)
- Formula configurator (entrance weight, HSC weight, extra-curricular weight)
- Category quota settings
- Preview table (top 100 applicants)
- Publish button with confirmation dialog
- Version history

**Seat Allocation Matrix** (`app/(dashboard)/seat-allocation/page.tsx`)
- Program-wise seat availability grid
- Category-wise breakdown (General, OBC, SC, ST)
- Real-time seat fill updates
- Manual allocation override (for special cases)

**Communication Center** (`app/(dashboard)/communications/page.tsx`)
- Template selector (Application Received, Document Pending, Merit List Published, etc.)
- Recipient filters (All, Status-based, Program-based)
- Email/SMS toggle
- Preview pane
- Schedule send (immediate or specific date/time)
- Delivery status tracking

### 2.3 Shared Components

**Sidebar** (`components/shared/Sidebar.tsx`)
- Collapsible navigation (hover expand)
- Active route highlighting
- Role-based menu items
- Badge counts (Pending Verification: 127, Unread Notifications: 5)

**StatsCard** (`components/dashboard/StatsCard.tsx`)
- Props: title, value, icon, trend (up/down %), color
- Skeleton loading state
- Click handler for drill-down

**ApplicationTable** (`components/applications/ApplicationTable.tsx`)
- TanStack Table integration
- Column visibility toggle
- Sortable columns (Name, Status, Program, Submitted Date, Merit Score)
- Row selection for bulk actions
- Infinite scroll option (loads 50 more on scroll bottom)

---

## 3. State Management

### 3.1 Server State (TanStack Query)

**Query Keys Structure:**
```typescript
// lib/query-keys.ts
export const queryKeys = {
  applications: {
    all: ['applications'] as const,
    lists: () => [...queryKeys.applications.all, 'list'] as const,
    list: (filters: ApplicationFilters) => 
      [...queryKeys.applications.lists(), filters] as const,
    details: () => [...queryKeys.applications.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.applications.details(), id] as const,
  },
  meritLists: {
    all: ['merit-lists'] as const,
    list: () => [...queryKeys.meritLists.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.meritLists.all, id] as const,
  },
  documents: {
    all: ['documents'] as const,
    list: (appId: string) => [...queryKeys.documents.all, appId] as const,
    ocrData: (docId: string) => [...queryKeys.documents.all, 'ocr', docId] as const,
  },
};
```

**Query Configuration:**
```typescript
// app/providers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,           // 30 seconds
      gcTime: 5 * 60 * 1000,      // 5 minutes (formerly cacheTime)
      retry: 2,
      refetchOnWindowFocus: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### 3.2 Client State (React Context)

**AuthContext** (`context/AuthContext.tsx`)
- User object (id, name, email, role, permissions)
- Login/logout functions
- Token management (localStorage + HTTP-only cookies)
- Session refresh (15-minute intervals)
- 2FA state management

**WebSocketContext** (`context/WebSocketContext.tsx`)
- Socket connection management
- Event listeners (application.submitted, document.verified, meritlist.published)
- Reconnection logic (exponential backoff)
- Connection status indicator

### 3.3 Local State (useState/useReducer)

**Form State:** React Hook Form manages form fields
**UI State:** useState for modals, dropdowns, tooltips
**Filter State:** useState for filter sidebar (applications, reports)

---

## 4. API Integration

### 4.1 API Client Setup

```typescript
// lib/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8010/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (handle 401, refresh token)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt token refresh
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post('/api/auth/refresh', { refreshToken });
          localStorage.setItem('auth_token', data.token);
          error.config.headers.Authorization = `Bearer ${data.token}`;
          return axios(error.config);
        } catch (refreshError) {
          // Redirect to login
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 4.2 API Service Functions

```typescript
// lib/api-services.ts
import apiClient from './api';
import type { Application, ApplicationFilters, Document, MeritList } from '@/types';

export const applicationService = {
  getAll: (filters: ApplicationFilters) => 
    apiClient.get<Application[]>('/applications', { params: filters }),
  
  getById: (id: string) => 
    apiClient.get<Application>(`/applications/${id}`),
  
  create: (data: Partial<Application>) => 
    apiClient.post<Application>('/applications', data),
  
  update: (id: string, data: Partial<Application>) => 
    apiClient.patch<Application>(`/applications/${id}`, data),
  
  export: (filters: ApplicationFilters) => 
    apiClient.get('/applications/export', { 
      params: filters, 
      responseType: 'blob' 
    }),
};

export const documentService = {
  assign: (applicationId: string, verifierId: string) => 
    apiClient.post('/documents/assign', { applicationId, verifierId }),
  
  verify: (documentId: string, status: string, comments?: string) => 
    apiClient.post(`/documents/${documentId}/verify`, { status, comments }),
  
  getOCR: (documentId: string) => 
    apiClient.post(`/documents/${documentId}/ocr`),
};

export const meritListService = {
  getAll: () => 
    apiClient.get<MeritList[]>('/merit-lists'),
  
  generate: (formula: object, filters: object) => 
    apiClient.post<MeritList>('/merit-lists', { formula, filters }),
  
  publish: (id: string) => 
    apiClient.post(`/merit-lists/${id}/publish`),
};
```

### 4.3 Custom Hooks

```typescript
// hooks/useApplications.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '@/lib/api-services';
import { queryKeys } from '@/lib/query-keys';
import type { ApplicationFilters } from '@/types';

export const useApplications = (filters: ApplicationFilters) => {
  return useQuery({
    queryKey: queryKeys.applications.list(filters),
    queryFn: () => applicationService.getAll(filters).then(res => res.data),
  });
};

export const useApplication = (id: string) => {
  return useQuery({
    queryKey: queryKeys.applications.detail(id),
    queryFn: () => applicationService.getById(id).then(res => res.data),
    enabled: !!id,
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Application> }) =>
      applicationService.update(id, data),
    onSuccess: (response, { id }) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.lists() });
    },
    onError: (error) => {
      console.error('Update failed:', error);
      // Show toast notification
    },
  });
};
```

---

## 5. Form Handling

### 5.1 Validation Schemas (Zod)

```typescript
// lib/validation.ts
import { z } from 'zod';

export const applicationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().regex(/^[6-9]\d{9}$/, 'Invalid mobile number'),
  aadhar: z.string().regex(/^\d{12}$/, 'Aadhar must be 12 digits'),
  dateOfBirth: z.string().refine((date) => {
    const age = new Date().getFullYear() - new Date(date).getFullYear();
    return age >= 17 && age <= 25;
  }, 'Age must be between 17 and 25'),
  category: z.enum(['GENERAL', 'OBC', 'SC', 'ST']),
  program: z.string().min(1, 'Program is required'),
  entranceExam: z.enum(['JEE', 'CET', 'OTHER']),
  entranceScore: z.number().min(0).max(300),
  hscScore: z.number().min(0).max(100),
  extraCurricularScore: z.number().min(0).max(100).optional(),
});

export const meritListSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  admissionCycleId: z.string().uuid(),
  formula: z.object({
    entranceWeight: z.number().min(0).max(1),
    hscWeight: z.number().min(0).max(1),
    extraWeight: z.number().min(0).max(1),
  }).refine((data) => 
    data.entranceWeight + data.hscWeight + data.extraWeight === 1,
    'Weights must sum to 1'
  ),
  categoryQuotas: z.object({
    GENERAL: z.number().min(0).max(100),
    OBC: z.number().min(0).max(100),
    SC: z.number().min(0).max(100),
    ST: z.number().min(0).max(100),
  }).refine((data) => 
    data.GENERAL + data.OBC + data.SC + data.ST === 100,
    'Quotas must sum to 100'
  ),
});

export const communicationSchema = z.object({
  channel: z.enum(['EMAIL', 'SMS', 'BOTH']),
  templateId: z.string().uuid(),
  recipientFilters: z.object({
    status: z.array(z.string()).optional(),
    program: z.array(z.string()).optional(),
    category: z.array(z.string()).optional(),
  }),
  scheduledAt: z.string().datetime().optional(),
  subject: z.string().min(1).max(200).optional(), // For emails
  body: z.string().min(1).max(1000),
});
```

### 5.2 Form Component Example

```typescript
// components/applications/ApplicationForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applicationSchema } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useUpdateApplication } from '@/hooks/useApplications';

export default function ApplicationForm({ application, onSuccess }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: application,
  });
  
  const updateMutation = useUpdateApplication();
  
  const onSubmit = (data) => {
    updateMutation.mutate(
      { id: application.id, data },
      { onSuccess }
    );
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName">First Name</label>
          <Input id="firstName" {...register('firstName')} />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="lastName">Last Name</label>
          <Input id="lastName" {...register('lastName')} />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>
      
      {/* More fields... */}
      
      <Button type="submit" disabled={updateMutation.isPending}>
        {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
```

---

## 6. Real-time Updates

### 6.1 WebSocket Context

```typescript
// context/WebSocketContext.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';

interface WebSocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  connected: false,
});

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    
    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8010', {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });
    
    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setConnected(true);
    });
    
    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    });
    
    // Application events
    newSocket.on('application.submitted', (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.applications.lists() });
      // Show toast notification
    });
    
    newSocket.on('document.verified', (data) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.applications.detail(data.applicationId) 
      });
    });
    
    // Merit list events
    newSocket.on('meritlist.published', (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meritLists.list() });
      // Show banner notification
    });
    
    // Seat allocation events
    newSocket.on('seat.allocated', (data) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.applications.detail(data.applicationId) 
      });
    });
    
    setSocket(newSocket);
    
    return () => {
      newSocket.close();
    };
  }, [queryClient]);
  
  return (
    <WebSocketContext.Provider value={{ socket, connected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
```

### 6.2 Real-time Dashboard Updates

```typescript
// components/dashboard/RealtimeStats.tsx
'use client';

import { useEffect } from 'react';
import { useWebSocket } from '@/context/WebSocketContext';
import { useApplicationStats } from '@/hooks/useApplications';

export default function RealtimeStats() {
  const { socket } = useWebSocket();
  const { data: stats, refetch } = useApplicationStats();
  
  useEffect(() => {
    if (!socket) return;
    
    // Refetch stats on any application event
    socket.on('application.submitted', () => refetch());
    socket.on('application.status_changed', () => refetch());
    
    return () => {
      socket.off('application.submitted');
      socket.off('application.status_changed');
    };
  }, [socket, refetch]);
  
  return (
    <div className="grid grid-cols-4 gap-4">
      <StatsCard 
        title="Total Applications" 
        value={stats?.total || 0} 
        trend={stats?.trend || 0}
      />
      {/* More cards... */}
    </div>
  );
}
```

---

## 7. UI Components

### 7.1 Data Table (TanStack Table)

```typescript
// components/applications/ApplicationTable.tsx
'use client';

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { useState } from 'react';
import type { Application } from '@/types';

const columns: ColumnDef<Application>[] = [
  {
    accessorKey: 'applicationNumber',
    header: 'Application #',
    cell: ({ row }) => (
      <a href={`/applications/${row.original.id}`} className="text-blue-600">
        {row.getValue('applicationNumber')}
      </a>
    ),
  },
  {
    accessorKey: 'fullName',
    header: 'Name',
  },
  {
    accessorKey: 'program',
    header: 'Program',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      const colors = {
        DRAFT: 'bg-gray-200',
        SUBMITTED: 'bg-blue-200',
        UNDER_REVIEW: 'bg-yellow-200',
        APPROVED: 'bg-green-200',
        REJECTED: 'bg-red-200',
      };
      return (
        <span className={`px-2 py-1 rounded ${colors[status]}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'meritScore',
    header: 'Merit Score',
    cell: ({ row }) => row.getValue('meritScore')?.toFixed(2) || 'N/A',
  },
  {
    accessorKey: 'submittedAt',
    header: 'Submitted',
    cell: ({ row }) => new Date(row.getValue('submittedAt')).toLocaleDateString(),
  },
];

export default function ApplicationTable({ data }: { data: Application[] }) {
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });
  
  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  
  return (
    <div>
      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th 
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer p-2 text-left border-b"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-2 border-b">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div>
          Showing {table.getState().pagination.pageIndex * 50 + 1} to{' '}
          {Math.min((table.getState().pagination.pageIndex + 1) * 50, data.length)} of{' '}
          {data.length} results
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 7.2 Charts (Recharts)

```typescript
// components/dashboard/ApplicationChart.tsx
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

const COLORS = {
  SUBMITTED: '#3B82F6',
  UNDER_REVIEW: '#F59E0B',
  APPROVED: '#10B981',
  REJECTED: '#EF4444',
  DRAFT: '#6B7280',
};

export default function ApplicationChart({ data }: { data: ChartData[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
```

### 7.3 Document Viewer

```typescript
// components/applications/DocumentViewer.tsx
'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function DocumentViewer({ url }: { url: string }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };
  
  return (
    <div className="flex flex-col items-center">
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<div>Loading PDF...</div>}
        error={<div>Failed to load PDF</div>}
      >
        <Page pageNumber={pageNumber} width={600} />
      </Document>
      
      <div className="flex items-center gap-4 mt-4">
        <button
          onClick={() => setPageNumber(pageNumber - 1)}
          disabled={pageNumber <= 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {pageNumber} of {numPages}
        </span>
        <button
          onClick={() => setPageNumber(pageNumber + 1)}
          disabled={pageNumber >= numPages}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

---

## 8. Routing & Navigation

### 8.1 App Router Structure

Next.js 15 App Router with route groups:

- `(auth)` - Login page (no layout)
- `(dashboard)` - All authenticated pages (with sidebar + header layout)

### 8.2 Middleware for Auth

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 8.3 Navigation Component

```typescript
// components/shared/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  FileText,
  Award,
  Users,
  Mail,
  BarChart,
  Settings,
} from 'lucide-react';

const menuItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard', roles: ['*'] },
  { href: '/applications', icon: FileText, label: 'Applications', roles: ['*'] },
  { href: '/merit-lists', icon: Award, label: 'Merit Lists', roles: ['SENIOR_OFFICER', 'MERIT_MANAGER'] },
  { href: '/seat-allocation', icon: Users, label: 'Seat Allocation', roles: ['SENIOR_OFFICER', 'COUNSELING_COORDINATOR'] },
  { href: '/communications', icon: Mail, label: 'Communications', roles: ['SENIOR_OFFICER', 'COORDINATOR'] },
  { href: '/reports', icon: BarChart, label: 'Reports', roles: ['SENIOR_OFFICER', 'COORDINATOR'] },
  { href: '/settings', icon: Settings, label: 'Settings', roles: ['SENIOR_OFFICER'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const filteredItems = menuItems.filter(item => 
    item.roles.includes('*') || item.roles.includes(user?.role)
  );
  
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen sticky top-0">
      <div className="p-4">
        <h1 className="text-xl font-bold">Admission Admin</h1>
      </div>
      <nav className="mt-8">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-800 ${
                isActive ? 'bg-gray-800 border-l-4 border-blue-500' : ''
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

---

## 9. Performance Optimization

### 9.1 Code Splitting

```typescript
// app/(dashboard)/applications/[id]/page.tsx
import dynamic from 'next/dynamic';

// Lazy load heavy components
const DocumentVerification = dynamic(
  () => import('@/components/applications/DocumentVerification'),
  { loading: () => <p>Loading document viewer...</p> }
);

const ApplicationTimeline = dynamic(
  () => import('@/components/applications/ApplicationTimeline'),
  { ssr: false }
);
```

### 9.2 Image Optimization

```typescript
// components/shared/UserAvatar.tsx
import Image from 'next/image';

export default function UserAvatar({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={40}
      height={40}
      className="rounded-full"
      priority={false}
      loading="lazy"
    />
  );
}
```

### 9.3 Memoization

```typescript
// components/applications/ApplicationFilters.tsx
'use client';

import { useMemo } from 'react';
import { useApplications } from '@/hooks/useApplications';

export default function ApplicationFilters({ onFilterChange }) {
  const { data: applications } = useApplications({});
  
  // Expensive computation - memoize
  const programOptions = useMemo(() => {
    if (!applications) return [];
    return Array.from(new Set(applications.map(a => a.program))).sort();
  }, [applications]);
  
  return (
    <select onChange={(e) => onFilterChange({ program: e.target.value })}>
      <option value="">All Programs</option>
      {programOptions.map(program => (
        <option key={program} value={program}>{program}</option>
      ))}
    </select>
  );
}
```

### 9.4 Virtual Scrolling (for large lists)

```typescript
// For lists with 1000+ items
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

export default function VirtualApplicationList({ applications }) {
  const parentRef = useRef(null);
  
  const virtualizer = useVirtualizer({
    count: applications.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60, // Row height
  });
  
  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
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
            <ApplicationRow application={applications[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 10. Accessibility

### 10.1 WCAG 2.1 AA Compliance

**Keyboard Navigation:**
- All interactive elements accessible via Tab key
- Focus indicators visible (2px blue outline)
- Skip to main content link

**Screen Reader Support:**
- Semantic HTML (`<nav>`, `<main>`, `<section>`)
- ARIA labels for icon buttons
- `aria-live` regions for notifications

**Color Contrast:**
- Text contrast ratio ≥ 4.5:1
- Status badges meet contrast requirements

### 10.2 Accessible Components

```typescript
// components/ui/button.tsx
import { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  'aria-label'?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', 'aria-label': ariaLabel, ...props }, ref) => {
    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        className={`px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' :
          variant === 'secondary' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' :
          'bg-red-600 text-white hover:bg-red-700'
        }`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
```

---

## 11. Testing

### 11.1 Unit Tests (Vitest + React Testing Library)

```typescript
// __tests__/components/ApplicationTable.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ApplicationTable from '@/components/applications/ApplicationTable';

const mockApplications = [
  {
    id: '1',
    applicationNumber: 'APP001',
    fullName: 'John Doe',
    program: 'Computer Science',
    status: 'SUBMITTED',
    meritScore: 235.5,
    submittedAt: '2024-01-15T10:30:00Z',
  },
];

describe('ApplicationTable', () => {
  it('renders application data', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ApplicationTable data={mockApplications} />
      </QueryClientProvider>
    );
    
    expect(screen.getByText('APP001')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('235.50')).toBeInTheDocument();
  });
  
  it('sorts by merit score', () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <ApplicationTable data={mockApplications} />
      </QueryClientProvider>
    );
    
    const meritHeader = screen.getByText('Merit Score');
    fireEvent.click(meritHeader);
    
    // Assert sorting indicator appears
    expect(meritHeader.textContent).toContain('🔼');
  });
});
```

### 11.2 Integration Tests

```typescript
// __tests__/hooks/useApplications.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useApplications } from '@/hooks/useApplications';
import { applicationService } from '@/lib/api-services';

jest.mock('@/lib/api-services');

describe('useApplications', () => {
  it('fetches applications successfully', async () => {
    const mockData = [{ id: '1', fullName: 'Test' }];
    (applicationService.getAll as jest.Mock).mockResolvedValue({ data: mockData });
    
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    
    const { result } = renderHook(() => useApplications({}), { wrapper });
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });
});
```

### 11.3 E2E Tests (Playwright)

```typescript
// e2e/application-flow.spec.ts
import { test, expect } from '@playwright/test';

test('complete application verification flow', async ({ page }) => {
  // Login
  await page.goto('http://localhost:3010/login');
  await page.fill('input[name="email"]', 'verifier@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  // Wait for dashboard
  await expect(page).toHaveURL('http://localhost:3010/');
  
  // Navigate to applications
  await page.click('a[href="/applications"]');
  await expect(page.locator('h1')).toContainText('Applications');
  
  // Open first application
  await page.click('table tbody tr:first-child a');
  await expect(page.locator('.application-detail')).toBeVisible();
  
  // Open document verification
  await page.click('button:has-text("Verify Documents")');
  await expect(page.locator('.document-viewer')).toBeVisible();
  
  // Approve document
  await page.click('button:has-text("Approve")');
  await page.fill('textarea[name="comments"]', 'All documents verified');
  await page.click('button:has-text("Submit")');
  
  // Assert success notification
  await expect(page.locator('.toast-success')).toContainText('Document approved');
});
```

---

## 12. Code Examples

### 12.1 Complete Page Example

```typescript
// app/(dashboard)/merit-lists/page.tsx
'use client';

import { useState } from 'react';
import { useMeritLists, useGenerateMeritList } from '@/hooks/useMeritLists';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import MeritListGenerator from '@/components/merit-lists/MeritListGenerator';
import MeritListTable from '@/components/merit-lists/MeritListTable';

export default function MeritListsPage() {
  const [showGenerator, setShowGenerator] = useState(false);
  const { data: meritLists, isLoading } = useMeritLists();
  const generateMutation = useGenerateMeritList();
  
  const handleGenerate = (formula: object, filters: object) => {
    generateMutation.mutate(
      { formula, filters },
      {
        onSuccess: () => {
          setShowGenerator(false);
          // Show success toast
        },
      }
    );
  };
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Merit Lists</h1>
        <Button onClick={() => setShowGenerator(true)}>
          Generate New Merit List
        </Button>
      </div>
      
      <Card className="p-6">
        <MeritListTable data={meritLists || []} />
      </Card>
      
      <Dialog open={showGenerator} onClose={() => setShowGenerator(false)}>
        <MeritListGenerator 
          onGenerate={handleGenerate}
          isLoading={generateMutation.isPending}
        />
      </Dialog>
    </div>
  );
}
```

### 12.2 Custom Hook with Optimistic Updates

```typescript
// hooks/useDocumentVerification.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentService } from '@/lib/api-services';
import { queryKeys } from '@/lib/query-keys';

export const useVerifyDocument = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      documentId, 
      status, 
      comments 
    }: { 
      documentId: string; 
      status: string; 
      comments?: string 
    }) => documentService.verify(documentId, status, comments),
    
    onMutate: async ({ documentId, status }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ 
        queryKey: queryKeys.documents.all 
      });
      
      // Snapshot previous value
      const previousDocuments = queryClient.getQueryData(
        queryKeys.documents.all
      );
      
      // Optimistically update
      queryClient.setQueryData(queryKeys.documents.all, (old: any) => {
        return old?.map((doc: any) => 
          doc.id === documentId ? { ...doc, status } : doc
        );
      });
      
      return { previousDocuments };
    },
    
    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(
        queryKeys.documents.all, 
        context?.previousDocuments
      );
    },
    
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.documents.all 
      });
    },
  });
};
```

---

## Summary

**Frontend Stack:**
- **Framework:** Next.js 15 (App Router) + React 18 + TypeScript 5
- **State:** TanStack Query (server state) + React Context (client state)
- **UI:** Tailwind CSS + shadcn/ui + Recharts + TanStack Table
- **Forms:** React Hook Form + Zod validation
- **Real-time:** Socket.io-client for WebSocket connections

**Performance:**
- Code splitting with dynamic imports
- Image optimization with Next.js Image component
- Virtual scrolling for large lists (1000+ items)
- React Query caching (30s stale time)
- Memoization for expensive computations

**Best Practices:**
- TypeScript for type safety
- Accessibility (WCAG 2.1 AA)
- Mobile-first responsive design (82% mobile usage)
- Comprehensive testing (unit + integration + E2E)
- Error boundaries for graceful failures

**Key Features Implemented:**
- Real-time dashboard updates (WebSocket)
- Document verification interface (split-screen with OCR comparison)
- Merit list generation with formula configurator
- Bulk communication center (email/SMS)
- Role-based navigation and permissions
- Optimistic UI updates for better UX

This frontend architecture supports the Admission Admin Portal's scale: 50,000 applications/year, peak load of 50K concurrent users, 287K emails + 148K SMS, ₹12 Crores payment processing.
