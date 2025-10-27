# Super Non-Teaching Manager Portal - Frontend Implementation Guide

**Framework**: Next.js 15 (App Router)  
**Language**: TypeScript 5.3  
**UI Library**: React 18.3  
**Styling**: TailwindCSS 3.4 + shadcn/ui  
**State Management**: Zustand 4.5 + React Query 5.0

---

## Project Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (hr)/                           # HR Manager protected routes
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── employees/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   ├── recruitment/
│   │   │   ├── page.tsx
│   │   │   ├── requisitions/
│   │   │   │   └── [id]/page.tsx
│   │   │   └── applications/
│   │   │       └── [id]/page.tsx
│   │   ├── attendance/
│   │   │   ├── page.tsx
│   │   │   └── muster-roll/
│   │   │       └── page.tsx
│   │   ├── leave/
│   │   │   ├── page.tsx
│   │   │   └── approvals/
│   │   │       └── page.tsx
│   │   ├── performance/
│   │   │   ├── page.tsx
│   │   │   └── appraisals/
│   │   │       └── [id]/page.tsx
│   │   ├── training/
│   │   │   ├── page.tsx
│   │   │   └── programs/
│   │   │       └── [id]/page.tsx
│   │   ├── transfers/
│   │   │   └── page.tsx
│   │   ├── separations/
│   │   │   └── page.tsx
│   │   ├── reports/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                             # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── sidebar.tsx
│   │   └── page-container.tsx
│   ├── employees/
│   │   ├── employee-card.tsx
│   │   ├── employee-list.tsx
│   │   ├── employee-form.tsx
│   │   └── employee-detail-tabs.tsx
│   ├── attendance/
│   │   ├── attendance-calendar.tsx
│   │   ├── punch-record-row.tsx
│   │   └── muster-roll-table.tsx
│   ├── leave/
│   │   ├── leave-application-card.tsx
│   │   ├── leave-balance-widget.tsx
│   │   └── leave-calendar.tsx
│   ├── recruitment/
│   │   ├── job-requisition-card.tsx
│   │   ├── application-kanban.tsx
│   │   └── interview-scheduler.tsx
│   ├── performance/
│   │   ├── appraisal-form.tsx
│   │   ├── rating-input.tsx
│   │   └── goal-tracker.tsx
│   ├── training/
│   │   ├── training-program-card.tsx
│   │   └── enrollment-manager.tsx
│   └── common/
│       ├── status-badge.tsx
│       ├── date-range-picker.tsx
│       └── filter-bar.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts                   # Axios instance
│   │   ├── employees.ts
│   │   ├── attendance.ts
│   │   ├── leave.ts
│   │   ├── recruitment.ts
│   │   ├── performance.ts
│   │   └── training.ts
│   ├── hooks/
│   │   ├── use-auth.ts
│   │   ├── use-employees.ts
│   │   ├── use-attendance.ts
│   │   ├── use-leave.ts
│   │   └── use-permissions.ts
│   ├── stores/
│   │   ├── auth-store.ts               # Zustand store
│   │   └── filter-store.ts
│   ├── utils/
│   │   ├── date-utils.ts
│   │   ├── format-utils.ts
│   │   └── validation.ts
│   └── types/
│       ├── employee.ts
│       ├── attendance.ts
│       ├── leave.ts
│       └── api.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## Technology Stack

### Core Dependencies
```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.3.0",
    
    "axios": "^1.6.0",
    "@tanstack/react-query": "^5.0.0",
    "zustand": "^4.5.0",
    
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-tabs": "^1.0.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    
    "react-hook-form": "^7.50.0",
    "zod": "^3.22.0",
    "@hookform/resolvers": "^3.3.0",
    
    "date-fns": "^3.0.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.56.0",
    "prettier": "^3.2.0"
  }
}
```

---

## API Client Setup

### `lib/api/client.ts`
```typescript
import axios, { AxiosError } from 'axios';
import { useAuthStore } from '@/lib/stores/auth-store';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
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

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      // Forbidden - show permission error
      console.error('Permission denied');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## State Management

### Zustand Auth Store - `lib/stores/auth-store.ts`
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  college_id?: number;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      
      hasPermission: (permission) => {
        const { user } = get();
        return user?.permissions.includes(permission) || false;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

### Filter Store - `lib/stores/filter-store.ts`
```typescript
import { create } from 'zustand';

interface FilterState {
  // Employee filters
  employeeFilters: {
    college_id?: number;
    designation?: string;
    status?: string;
    search?: string;
  };
  setEmployeeFilters: (filters: Partial<FilterState['employeeFilters']>) => void;
  
  // Attendance filters
  attendanceFilters: {
    college_id?: number;
    date?: Date;
  };
  setAttendanceFilters: (filters: Partial<FilterState['attendanceFilters']>) => void;
  
  // Leave filters
  leaveFilters: {
    status?: string;
    college_id?: number;
  };
  setLeaveFilters: (filters: Partial<FilterState['leaveFilters']>) => void;
  
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  employeeFilters: {},
  setEmployeeFilters: (filters) =>
    set((state) => ({
      employeeFilters: { ...state.employeeFilters, ...filters },
    })),
  
  attendanceFilters: {},
  setAttendanceFilters: (filters) =>
    set((state) => ({
      attendanceFilters: { ...state.attendanceFilters, ...filters },
    })),
  
  leaveFilters: {},
  setLeaveFilters: (filters) =>
    set((state) => ({
      leaveFilters: { ...state.leaveFilters, ...filters },
    })),
  
  resetFilters: () =>
    set({
      employeeFilters: {},
      attendanceFilters: {},
      leaveFilters: {},
    }),
}));
```

---

## React Query Hooks

### Employee Hooks - `lib/hooks/use-employees.ts`
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { Employee, EmployeeFilters } from '@/lib/types/employee';

export function useEmployees(filters?: EmployeeFilters) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Employee[] }>('/employees', {
        params: filters,
      });
      return data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useEmployee(id: number) {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Employee }>(`/employees/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (employee: Partial<Employee>) => {
      const { data } = await apiClient.post('/employees', employee);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...employee }: Partial<Employee> & { id: number }) => {
      const { data } = await apiClient.put(`/employees/${id}`, employee);
      return data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employees', variables.id] });
    },
  });
}

export function useTransferEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      employee_id,
      to_college_id,
      effective_date,
      reason,
    }: {
      employee_id: number;
      to_college_id: number;
      effective_date: string;
      reason: string;
    }) => {
      const { data } = await apiClient.post('/transfers', {
        employee_id,
        to_college_id,
        effective_date,
        reason,
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['transfers'] });
    },
  });
}
```

### Attendance Hooks - `lib/hooks/use-attendance.ts`
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';
import { format } from 'date-fns';

export function useAttendance(date: Date, college_id?: number) {
  return useQuery({
    queryKey: ['attendance', format(date, 'yyyy-MM-dd'), college_id],
    queryFn: async () => {
      const { data } = await apiClient.get('/attendance', {
        params: {
          date: format(date, 'yyyy-MM-dd'),
          college_id,
        },
      });
      return data.data;
    },
  });
}

export function useMusterRoll(date: Date, college_id?: number) {
  return useQuery({
    queryKey: ['muster-roll', format(date, 'yyyy-MM-dd'), college_id],
    queryFn: async () => {
      const { data } = await apiClient.get('/attendance/muster-roll', {
        params: {
          date: format(date, 'yyyy-MM-dd'),
          college_id,
        },
      });
      return data.data;
    },
  });
}

export function useRecordPunch() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      employee_id,
      punch_time,
      device_id,
    }: {
      employee_id: number;
      punch_time: string;
      device_id?: string;
    }) => {
      const { data } = await apiClient.post('/attendance/punch', {
        employee_id,
        punch_time,
        device_id,
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

export function useRegularizeAttendance() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      employee_id,
      date,
      reason,
    }: {
      employee_id: number;
      date: string;
      reason: string;
    }) => {
      const { data } = await apiClient.post('/attendance/regularize', {
        employee_id,
        date,
        reason,
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}
```

### Leave Hooks - `lib/hooks/use-leave.ts`
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api/client';

export function useLeaveApplications(status?: string) {
  return useQuery({
    queryKey: ['leave-applications', status],
    queryFn: async () => {
      const { data } = await apiClient.get('/leave/applications', {
        params: { status },
      });
      return data.data;
    },
  });
}

export function useLeaveBalance(employee_id: number) {
  return useQuery({
    queryKey: ['leave-balance', employee_id],
    queryFn: async () => {
      const { data } = await apiClient.get(`/leave/balance/${employee_id}`);
      return data.data;
    },
    enabled: !!employee_id,
  });
}

export function useApplyLeave() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (application: {
      employee_id: number;
      leave_type: string;
      from_date: string;
      to_date: string;
      reason: string;
    }) => {
      const { data } = await apiClient.post('/leave/applications', application);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-applications'] });
    },
  });
}

export function useApproveLeave() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({
      id,
      comments,
    }: {
      id: number;
      comments?: string;
    }) => {
      const { data } = await apiClient.post(`/leave/applications/${id}/approve`, {
        comments,
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-applications'] });
      queryClient.invalidateQueries({ queryKey: ['leave-balance'] });
    },
  });
}
```

---

## Components

### Employee Card - `components/employees/employee-card.tsx`
```typescript
import { Employee } from '@/lib/types/employee';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Phone, MapPin } from 'lucide-react';

interface EmployeeCardProps {
  employee: Employee;
  onClick?: () => void;
}

export function EmployeeCard({ employee, onClick }: EmployeeCardProps) {
  const statusColor = {
    active: 'bg-green-100 text-green-800',
    probation: 'bg-yellow-100 text-yellow-800',
    suspended: 'bg-red-100 text-red-800',
    resigned: 'bg-gray-100 text-gray-800',
  }[employee.status] || 'bg-gray-100';

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={employee.photo_url} alt={employee.first_name} />
            <AvatarFallback>
              {employee.first_name[0]}{employee.last_name[0]}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {employee.first_name} {employee.last_name}
                </h3>
                <p className="text-sm text-gray-600">{employee.designation}</p>
                <p className="text-xs text-gray-500">{employee.employee_code}</p>
              </div>
              <Badge className={statusColor}>
                {employee.status}
              </Badge>
            </div>
            
            <div className="mt-3 space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{employee.college?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{employee.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>{employee.phone}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

### Leave Application Card - `components/leave/leave-application-card.tsx`
```typescript
import { LeaveApplication } from '@/lib/types/leave';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Calendar, Clock, User } from 'lucide-react';

interface LeaveApplicationCardProps {
  application: LeaveApplication;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}

export function LeaveApplicationCard({
  application,
  onApprove,
  onReject,
}: LeaveApplicationCardProps) {
  const leaveTypeColors = {
    casual: 'bg-blue-100 text-blue-800',
    sick: 'bg-red-100 text-red-800',
    earned: 'bg-green-100 text-green-800',
    loss_of_pay: 'bg-gray-100 text-gray-800',
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-gray-500" />
            <div>
              <h4 className="font-semibold">
                {application.employee.first_name} {application.employee.last_name}
              </h4>
              <p className="text-sm text-gray-500">
                {application.employee.employee_code}
              </p>
            </div>
          </div>
          <Badge className={leaveTypeColors[application.leave_type]}>
            {application.leave_type.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(application.from_date), 'MMM dd, yyyy')} -{' '}
              {format(new Date(application.to_date), 'MMM dd, yyyy')}
            </span>
            <span className="font-medium">({application.number_of_days} days)</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Applied on {format(new Date(application.created_at), 'MMM dd, yyyy')}</span>
          </div>
        </div>
        
        <div className="mt-3 p-3 bg-gray-50 rounded">
          <p className="text-sm font-medium mb-1">Reason:</p>
          <p className="text-sm text-gray-700">{application.reason}</p>
        </div>
        
        {application.leave_balance && (
          <div className="mt-3 text-sm text-gray-600">
            Available Balance: <span className="font-medium">{application.leave_balance} days</span>
          </div>
        )}
      </CardContent>
      
      {application.status === 'pending' && (onApprove || onReject) && (
        <CardFooter className="flex gap-2">
          {onApprove && (
            <Button
              onClick={() => onApprove(application.id)}
              className="flex-1"
              variant="default"
            >
              Approve
            </Button>
          )}
          {onReject && (
            <Button
              onClick={() => onReject(application.id)}
              className="flex-1"
              variant="destructive"
            >
              Reject
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
```

### Attendance Calendar - `components/attendance/attendance-calendar.tsx`
```typescript
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { cn } from '@/lib/utils';

interface AttendanceRecord {
  date: Date;
  status: 'present' | 'absent' | 'leave' | 'late';
}

interface AttendanceCalendarProps {
  month: Date;
  records: AttendanceRecord[];
}

export function AttendanceCalendar({ month, records }: AttendanceCalendarProps) {
  const start = startOfMonth(month);
  const end = endOfMonth(month);
  const days = eachDayOfInterval({ start, end });
  
  const recordMap = new Map(
    records.map((r) => [format(r.date, 'yyyy-MM-dd'), r.status])
  );
  
  const statusColors = {
    present: 'bg-green-500',
    absent: 'bg-red-500',
    leave: 'bg-blue-500',
    late: 'bg-yellow-500',
  };
  
  return (
    <div className="border rounded-lg p-4">
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const status = recordMap.get(dateKey);
          
          return (
            <div
              key={dateKey}
              className={cn(
                'aspect-square flex items-center justify-center rounded-lg text-sm',
                isToday(day) && 'ring-2 ring-blue-500',
                !isSameMonth(day, month) && 'text-gray-400'
              )}
            >
              <div className="relative">
                <span>{format(day, 'd')}</span>
                {status && (
                  <div
                    className={cn(
                      'absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full',
                      statusColors[status]
                    )}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span>Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Leave</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>Late</span>
        </div>
      </div>
    </div>
  );
}
```

---

## Form Validation

### Employee Form Schema - `lib/validation/employee-schema.ts`
```typescript
import { z } from 'zod';

export const employeeSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
  college_id: z.number().positive('College is required'),
  designation: z.string().min(2, 'Designation is required'),
  department: z.string().min(2, 'Department is required'),
  date_of_joining: z.string().refine((date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  }, 'Invalid date'),
  date_of_birth: z.string().refine((date) => {
    const d = new Date(date);
    return d instanceof Date && !isNaN(d.getTime());
  }, 'Invalid date'),
  status: z.enum(['active', 'probation', 'suspended', 'resigned', 'terminated']),
  salary: z.number().positive('Salary must be positive').optional(),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
```

### Leave Application Schema
```typescript
import { z } from 'zod';
import { differenceInDays } from 'date-fns';

export const leaveApplicationSchema = z.object({
  employee_id: z.number().positive(),
  leave_type: z.enum(['casual', 'sick', 'earned', 'loss_of_pay']),
  from_date: z.string(),
  to_date: z.string(),
  reason: z.string().min(10, 'Reason must be at least 10 characters'),
  supporting_document: z.string().optional(),
}).refine(
  (data) => {
    const from = new Date(data.from_date);
    const to = new Date(data.to_date);
    return to >= from;
  },
  {
    message: 'End date must be after start date',
    path: ['to_date'],
  }
).refine(
  (data) => {
    const from = new Date(data.from_date);
    const to = new Date(data.to_date);
    const days = differenceInDays(to, from) + 1;
    return days <= 30;
  },
  {
    message: 'Leave cannot exceed 30 days',
    path: ['to_date'],
  }
);
```

---

## Utility Functions

### Date Utilities - `lib/utils/date-utils.ts`
```typescript
import { format, parseISO } from 'date-fns';

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM dd, yyyy');
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM dd, yyyy hh:mm a');
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}
```

### Format Utilities - `lib/utils/format-utils.ts`
```typescript
export function formatEmployeeCode(code: string): string {
  return code.toUpperCase();
}

export function formatPhone(phone: string): string {
  // Format: +91-XXXXX-XXXXX
  return phone.replace(/(\+\d{2})(\d{5})(\d+)/, '$1-$2-$3');
}

export function formatWorkHours(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function calculateYearsOfService(joiningDate: string): string {
  const years = new Date().getFullYear() - new Date(joiningDate).getFullYear();
  return years === 1 ? '1 year' : `${years} years`;
}
```

---

## Performance Optimization

### Code Splitting
```typescript
// app/(hr)/reports/page.tsx
import dynamic from 'next/dynamic';

const ReportsChart = dynamic(() => import('@/components/reports/reports-chart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false,
});
```

### Memoization
```typescript
import { useMemo } from 'react';

function EmployeeList({ employees }: { employees: Employee[] }) {
  const sortedEmployees = useMemo(() => {
    return [...employees].sort((a, b) => 
      a.employee_code.localeCompare(b.employee_code)
    );
  }, [employees]);
  
  return (
    <div>
      {sortedEmployees.map((emp) => (
        <EmployeeCard key={emp.id} employee={emp} />
      ))}
    </div>
  );
}
```

### Virtual Scrolling (for large lists)
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function EmployeeVirtualList({ employees }: { employees: Employee[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: employees.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
  });
  
  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <EmployeeCard employee={employees[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Testing

### Component Testing with React Testing Library
```typescript
// __tests__/components/employee-card.test.tsx
import { render, screen } from '@testing-library/react';
import { EmployeeCard } from '@/components/employees/employee-card';

const mockEmployee = {
  id: 1,
  employee_code: 'EMP-0001',
  first_name: 'John',
  last_name: 'Doe',
  email: 'john@example.com',
  phone: '+91-9876543210',
  designation: 'Clerk',
  status: 'active',
  college: { id: 1, name: 'ABC Engineering' },
};

describe('EmployeeCard', () => {
  it('renders employee information correctly', () => {
    render(<EmployeeCard employee={mockEmployee} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('EMP-0001')).toBeInTheDocument();
    expect(screen.getByText('Clerk')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
  });
});
```

---

## Environment Variables

### `.env.local`
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=Super NT Manager
```

---

*Complete Next.js 15 + TypeScript frontend implementation guide with React Query, Zustand, shadcn/ui, and comprehensive components.*

**Framework**: Next.js 15 (App Router)  
**UI Library**: React 18  
**Styling**: TailwindCSS 3.4 + shadcn/ui  
**State Management**: Zustand + React Query  
**TypeScript**: Strict mode enabled

---

## Project Structure

```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (hr)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── employees/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── layout.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   ├── recruitment/
│   │   │   └── page.tsx
│   │   ├── attendance/
│   │   │   └── page.tsx
│   │   ├── leave/
│   │   │   └── page.tsx
│   │   ├── performance/
│   │   │   └── page.tsx
│   │   ├── training/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (employee)/
│   │   ├── my-profile/
│   │   │   └── page.tsx
│   │   ├── my-attendance/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/ (shadcn/ui components)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── ...
│   ├── atoms/
│   │   ├── StatusBadge.tsx
│   │   ├── AttendanceDot.tsx
│   │   ├── LeaveTypeChip.tsx
│   │   └── EmployeeAvatar.tsx
│   ├── molecules/
│   │   ├── EmployeeCard.tsx
│   │   ├── AttendanceRow.tsx
│   │   ├── LeaveApplicationCard.tsx
│   │   └── StatCard.tsx
│   ├── organisms/
│   │   ├── EmployeeList.tsx
│   │   ├── AttendanceMusterRoll.tsx
│   │   ├── LeaveCalendar.tsx
│   │   ├── AppraisalForm.tsx
│   │   └── TrainingEnrollmentManager.tsx
│   ├── templates/
│   │   ├── HRDashboard.tsx
│   │   ├── EmployeeDetailPage.tsx
│   │   └── RecruitmentBoard.tsx
│   └── layout/
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   ├── employees.ts
│   │   ├── attendance.ts
│   │   ├── leave.ts
│   │   └── ...
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePermissions.ts
│   │   ├── useEmployees.ts
│   │   ├── useAttendance.ts
│   │   └── ...
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── filterStore.ts
│   │   └── uiStore.ts
│   ├── utils/
│   │   ├── date.ts
│   │   ├── format.ts
│   │   └── validators.ts
│   └── types/
│       ├── employee.ts
│       ├── attendance.ts
│       ├── leave.ts
│       └── ...
├── public/
│   ├── images/
│   └── icons/
└── tailwind.config.js
```

---

## Technology Stack

### Core Libraries

```json
{
  "dependencies": {
    "next": "15.0.0",
    "react": "18.3.0",
    "react-dom": "18.3.0",
    "typescript": "5.3.0",
    
    "@tanstack/react-query": "^5.0.0",
    "@tanstack/react-table": "^8.10.0",
    "zustand": "^4.4.0",
    "axios": "^1.6.0",
    
    "react-hook-form": "^7.48.0",
    "zod": "^3.22.0",
    
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-select": "^2.0.0",
    
    "date-fns": "^3.0.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/node": "^20.0.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0",
    "@playwright/test": "^1.40.0"
  }
}
```

---

## API Client Setup

### Axios Configuration

```typescript
// lib/api/client.ts
import axios from 'axios';
import { authStore } from '@/lib/stores/authStore';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor: Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = authStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authStore.getState().logout();
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      // Permission denied
      console.error('Permission denied:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);
```

---

## React Query Setup

### Query Client Configuration

```typescript
// app/providers.tsx
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
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            retry: 0,
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

### Custom Hooks with React Query

#### useEmployees Hook

```typescript
// lib/hooks/useEmployees.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeesApi } from '@/lib/api/employees';
import { Employee, EmployeeFilters } from '@/lib/types/employee';

export function useEmployees(filters?: EmployeeFilters) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: () => employeesApi.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
}

export function useEmployee(id: number) {
  return useQuery({
    queryKey: ['employees', id],
    queryFn: () => employeesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useUpdateEmployee(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Employee>) => employeesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', id] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}
```

#### useAttendance Hook

```typescript
// lib/hooks/useAttendance.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '@/lib/api/attendance';

export function useAttendance(filters: { collegeId?: number; date?: string }) {
  return useQuery({
    queryKey: ['attendance', filters],
    queryFn: () => attendanceApi.getAll(filters),
    staleTime: 1 * 60 * 1000, // 1 minute (more frequent for real-time data)
  });
}

export function useRecordPunch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: attendanceApi.recordPunch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

export function useMusterRoll(collegeId: number, date: string) {
  return useQuery({
    queryKey: ['muster-roll', collegeId, date],
    queryFn: () => attendanceApi.getMusterRoll(collegeId, date),
    enabled: !!collegeId && !!date,
  });
}
```

#### useLeave Hook

```typescript
// lib/hooks/useLeave.ts
export function useLeaveApplications(status?: string) {
  return useQuery({
    queryKey: ['leave-applications', status],
    queryFn: () => leaveApi.getAll(status),
  });
}

export function useLeaveBalance(employeeId: number) {
  return useQuery({
    queryKey: ['leave-balance', employeeId],
    queryFn: () => leaveApi.getBalance(employeeId),
    enabled: !!employeeId,
  });
}

export function useApplyLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: leaveApi.apply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-applications'] });
      queryClient.invalidateQueries({ queryKey: ['leave-balance'] });
    },
  });
}

export function useApproveLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ leaveId, action }: { leaveId: number; action: 'approve' | 'reject' }) =>
      leaveApi.approve(leaveId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave-applications'] });
      queryClient.invalidateQueries({ queryKey: ['leave-balance'] });
    },
  });
}
```

---

## Zustand State Management

### Auth Store

```typescript
// lib/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  collegeId?: number;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export const authStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      hasPermission: (permission) => {
        const { user } = get();
        return user?.permissions.includes(permission) || false;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

### Filter Store

```typescript
// lib/stores/filterStore.ts
import { create } from 'zustand';

interface EmployeeFilters {
  collegeId?: number;
  designation?: string;
  status?: string;
  search?: string;
}

interface FilterState {
  employeeFilters: EmployeeFilters;
  setEmployeeFilters: (filters: Partial<EmployeeFilters>) => void;
  resetEmployeeFilters: () => void;
}

export const filterStore = create<FilterState>((set) => ({
  employeeFilters: {},

  setEmployeeFilters: (filters) => {
    set((state) => ({
      employeeFilters: { ...state.employeeFilters, ...filters },
    }));
  },

  resetEmployeeFilters: () => {
    set({ employeeFilters: {} });
  },
}));
```

---

## Component Architecture

### Atomic Design Components

#### Atoms: StatusBadge

```typescript
// components/atoms/StatusBadge.tsx
import { cn } from '@/lib/utils';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  probation: 'bg-yellow-100 text-yellow-800',
  suspended: 'bg-red-100 text-red-800',
  resigned: 'bg-gray-100 text-gray-800',
};

interface StatusBadgeProps {
  status: keyof typeof statusColors;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        statusColors[status],
        className
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
```

#### Atoms: AttendanceDot

```typescript
// components/atoms/AttendanceDot.tsx
const dotColors = {
  present: 'bg-green-500',
  absent: 'bg-red-500',
  late: 'bg-yellow-500',
  on_leave: 'bg-blue-500',
};

export function AttendanceDot({ status }: { status: keyof typeof dotColors }) {
  return <span className={cn('h-2 w-2 rounded-full', dotColors[status])} />;
}
```

#### Molecules: EmployeeCard

```typescript
// components/molecules/EmployeeCard.tsx
import { Employee } from '@/lib/types/employee';
import { StatusBadge } from '@/components/atoms/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EmployeeCardProps {
  employee: Employee;
  onClick?: () => void;
}

export function EmployeeCard({ employee, onClick }: EmployeeCardProps) {
  return (
    <Card className="cursor-pointer hover:shadow-md transition" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={employee.avatar} />
            <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold">{employee.name}</h3>
            <p className="text-sm text-gray-500">{employee.designation}</p>
            <p className="text-xs text-gray-400">{employee.employeeCode}</p>
          </div>
          <StatusBadge status={employee.status} />
        </div>
      </CardContent>
    </Card>
  );
}
```

#### Organisms: EmployeeList

```typescript
// components/organisms/EmployeeList.tsx
'use client';

import { useEmployees } from '@/lib/hooks/useEmployees';
import { EmployeeCard } from '@/components/molecules/EmployeeCard';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export function EmployeeList({ filters }: { filters?: EmployeeFilters }) {
  const { data: employees, isLoading } = useEmployees(filters);
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {employees?.data.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
          onClick={() => router.push(`/employees/${employee.id}`)}
        />
      ))}
    </div>
  );
}
```

---

## Form Handling

### React Hook Form + Zod

```typescript
// app/(hr)/employees/new/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateEmployee } from '@/lib/hooks/useEmployees';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const employeeSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  collegeId: z.number().min(1, 'College is required'),
  designation: z.string().min(2, 'Designation is required'),
  dateOfJoining: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Invalid date',
  }),
  salary: z.number().min(1, 'Salary must be greater than 0'),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export default function NewEmployeePage() {
  const { mutate: createEmployee, isPending } = useCreateEmployee();

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      collegeId: undefined,
      designation: '',
      dateOfJoining: '',
      salary: 0,
    },
  });

  const onSubmit = (data: EmployeeFormData) => {
    createEmployee(data, {
      onSuccess: () => {
        toast.success('Employee created successfully');
        router.push('/employees');
      },
      onError: (error) => {
        toast.error('Failed to create employee');
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Employee</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="firstName"
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
          
          {/* More fields... */}
          
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creating...' : 'Create Employee'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
```

---

## Data Formatting Utils

```typescript
// lib/utils/format.ts
import { format, parseISO } from 'date-fns';

export function formatDate(date: string | Date): string {
  return format(typeof date === 'string' ? parseISO(date) : date, 'MMM dd, yyyy');
}

export function formatDateTime(date: string | Date): string {
  return format(typeof date === 'string' ? parseISO(date) : date, 'MMM dd, yyyy HH:mm');
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function formatWorkHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
}

export function formatEmployeeCode(code: string): string {
  return code.toUpperCase();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatLeaveBalance(balance: number): string {
  return balance.toFixed(1);
}
```

---

## Performance Optimization

### Code Splitting

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const AppraisalForm = dynamic(() => import('@/components/organisms/AppraisalForm'), {
  loading: () => <Skeleton className="h-96" />,
});

const TrainingEnrollmentManager = dynamic(
  () => import('@/components/organisms/TrainingEnrollmentManager'),
  { ssr: false }
);
```

### React.memo for Lists

```typescript
// components/molecules/EmployeeCard.tsx
import { memo } from 'react';

export const EmployeeCard = memo(function EmployeeCard({ employee, onClick }: EmployeeCardProps) {
  // Component code
});
```

### useMemo for Expensive Calculations

```typescript
const sortedEmployees = useMemo(() => {
  return employees.sort((a, b) => a.name.localeCompare(b.name));
}, [employees]);
```

### Virtual Scrolling for Large Lists

```typescript
// Use @tanstack/react-virtual for 2000+ employee lists
import { useVirtualizer } from '@tanstack/react-virtual';

const parentRef = useRef<HTMLDivElement>(null);

const virtualizer = useVirtualizer({
  count: employees.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 80,
  overscan: 5,
});
```

---

## Accessibility

### ARIA Labels

```typescript
<button aria-label="Approve leave application">
  <CheckIcon />
</button>

<select aria-label="Filter by college">
  <option value="">All Colleges</option>
</select>
```

### Keyboard Navigation

```typescript
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick();
    }
  }}
>
  {children}
</div>
```

---

## Testing

### Unit Tests (Jest + React Testing Library)

```typescript
// __tests__/components/StatusBadge.test.tsx
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '@/components/atoms/StatusBadge';

describe('StatusBadge', () => {
  it('renders active status correctly', () => {
    render(<StatusBadge status="active" />);
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Active')).toHaveClass('bg-green-100');
  });
});
```

### E2E Tests (Playwright)

```typescript
// e2e/employee.spec.ts
test('create new employee', async ({ page }) => {
  await page.goto('/employees/new');
  
  await page.fill('[name="firstName"]', 'John');
  await page.fill('[name="lastName"]', 'Doe');
  await page.fill('[name="email"]', 'john@college.edu');
  
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/employees');
  await expect(page.locator('text=John Doe')).toBeVisible();
});
```

---

## Deployment

### Build for Production

```bash
npm run build

# Output: .next/ directory
# Static assets optimized
# Server components pre-rendered
```

### Environment Variables

```bash
# .env.production
NEXT_PUBLIC_API_URL=https://api.college.edu
NEXT_PUBLIC_WS_URL=wss://api.college.edu
```

---

*Complete Next.js 15 frontend implementation guide with React Query, Zustand, TypeScript, and comprehensive component architecture.*
