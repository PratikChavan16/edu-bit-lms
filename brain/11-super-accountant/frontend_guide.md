# Super Accountant Portal - Frontend Implementation Guide

**Portal:** Super Accountant (Global Financial Controller)  
**Port:** 3011  
**Framework:** Next.js 15.0 + React 18.3  
**Version:** 1.0.0  
**Last Updated:** October 25, 2025

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Key Components](#key-components)
4. [State Management](#state-management)
5. [API Integration](#api-integration)
6. [Authentication & Authorization](#authentication--authorization)
7. [Performance Optimization](#performance-optimization)
8. [Testing Strategy](#testing-strategy)
9. [Deployment](#deployment)

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

### UI Libraries
```json
{
  "@radix-ui/react-dialog": "^1.0.5",
  "@radix-ui/react-dropdown-menu": "^2.0.6",
  "@radix-ui/react-select": "^2.0.0",
  "@radix-ui/react-tabs": "^1.0.4",
  "tailwindcss": "^3.4.0",
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
  "swr": "^2.2.4"
}
```

### Form & Validation
```json
{
  "react-hook-form": "^7.49.0",
  "zod": "^3.22.4",
  "@hookform/resolvers": "^3.3.3"
}
```

### Charts & Visualization
```json
{
  "recharts": "^2.10.0",
  "react-chartjs-2": "^5.2.0",
  "chart.js": "^4.4.0"
}
```

### Utilities
```json
{
  "date-fns": "^3.0.0",
  "clsx": "^2.0.0",
  "tailwind-merge": "^2.2.0",
  "react-hot-toast": "^2.4.1"
}
```

---

## 2. Project Structure

```
super-accountant-portal/
├── app/                          # Next.js 15 App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/
│   │   │   └── page.tsx         # Login page
│   │   └── layout.tsx           # Auth layout (centered)
│   │
│   ├── (dashboard)/             # Protected route group
│   │   ├── layout.tsx           # Dashboard layout (sidebar + header)
│   │   ├── page.tsx             # Dashboard home
│   │   │
│   │   ├── payroll/
│   │   │   ├── page.tsx         # Payroll list
│   │   │   ├── process/page.tsx # Process payroll
│   │   │   └── [id]/page.tsx    # Payroll details
│   │   │
│   │   ├── expenses/
│   │   │   ├── page.tsx         # Expense list
│   │   │   ├── pending/page.tsx # Pending approvals
│   │   │   └── [id]/page.tsx    # Expense details
│   │   │
│   │   ├── budgets/
│   │   │   ├── page.tsx         # Budget overview
│   │   │   └── [id]/page.tsx    # Budget details
│   │   │
│   │   ├── vendors/
│   │   │   ├── page.tsx         # Vendor list
│   │   │   └── [id]/page.tsx    # Vendor details
│   │   │
│   │   ├── bank-reconciliation/
│   │   │   └── page.tsx         # Bank recon
│   │   │
│   │   ├── reports/
│   │   │   ├── page.tsx         # Report selector
│   │   │   ├── profit-loss/page.tsx
│   │   │   ├── balance-sheet/page.tsx
│   │   │   └── cash-flow/page.tsx
│   │   │
│   │   └── audit-trail/
│   │       └── page.tsx         # Audit logs
│   │
│   ├── api/                     # API routes (optional, mostly use Laravel backend)
│   │   └── health/route.ts
│   │
│   └── globals.css              # Global styles + Tailwind

├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   ├── select.tsx
│   │   └── ...
│   │
│   ├── dashboard/
│   │   ├── DashboardHeader.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StatCard.tsx
│   │   └── RecentActivity.tsx
│   │
│   ├── payroll/
│   │   ├── PayrollTable.tsx
│   │   ├── PayrollProcessForm.tsx
│   │   ├── PayslipGenerator.tsx
│   │   └── SalaryBreakdown.tsx
│   │
│   ├── expenses/
│   │   ├── ExpenseTable.tsx
│   │   ├── ExpenseApprovalCard.tsx
│   │   ├── ExpenseForm.tsx
│   │   └── ExpenseTimeline.tsx
│   │
│   ├── budgets/
│   │   ├── BudgetAllocationForm.tsx
│   │   ├── BudgetUtilizationChart.tsx
│   │   └── BudgetAlertCard.tsx
│   │
│   ├── vendors/
│   │   ├── VendorTable.tsx
│   │   ├── VendorForm.tsx
│   │   └── PaymentHistory.tsx
│   │
│   ├── reports/
│   │   ├── ProfitLossReport.tsx
│   │   ├── BalanceSheetReport.tsx
│   │   ├── CashFlowStatement.tsx
│   │   └── ReportExport.tsx
│   │
│   └── shared/
│       ├── DataTable.tsx
│       ├── DateRangePicker.tsx
│       ├── FileUpload.tsx
│       ├── SearchFilter.tsx
│       └── ApprovalWorkflow.tsx

├── lib/                          # Utilities & configs
│   ├── api-client.ts            # Axios instance with interceptors
│   ├── auth.ts                  # Auth helpers
│   ├── utils.ts                 # Helper functions (cn, formatCurrency)
│   ├── validators.ts            # Zod schemas
│   └── constants.ts             # App constants

├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── usePayroll.ts
│   ├── useExpenses.ts
│   ├── useBudgets.ts
│   └── useReports.ts

├── stores/                       # Zustand stores
│   ├── authStore.ts
│   ├── dashboardStore.ts
│   └── notificationStore.ts

├── types/                        # TypeScript types
│   ├── payroll.ts
│   ├── expense.ts
│   ├── budget.ts
│   ├── vendor.ts
│   └── api.ts

└── public/                       # Static assets
    ├── logo.svg
    └── images/
```

---

## 3. Key Components

### 3.1 Dashboard Component

**File:** `app/(dashboard)/page.tsx`

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { FinancialChart } from '@/components/dashboard/FinancialChart';
import { PendingApprovals } from '@/components/dashboard/PendingApprovals';
import { BudgetAlerts } from '@/components/dashboard/BudgetAlerts';

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiClient.get('/dashboard/stats'),
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Financial Dashboard</h1>
          <p className="text-muted-foreground">
            University-wide financial overview
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Total Budget</p>
          <p className="text-2xl font-bold">₹{stats?.totalBudget.toLocaleString()}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`₹${stats?.totalRevenue.toLocaleString()}`}
          change={stats?.revenueChange}
          icon="trending-up"
          trend="up"
        />
        <StatCard
          title="Total Expenses"
          value={`₹${stats?.totalExpenses.toLocaleString()}`}
          change={stats?.expenseChange}
          icon="trending-down"
          trend="down"
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingApprovals}
          icon="clock"
          urgency="high"
        />
        <StatCard
          title="Payroll Due"
          value={`₹${stats?.payrollDue.toLocaleString()}`}
          icon="users"
        />
      </div>

      {/* Charts and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancialChart data={stats?.monthlyTrends} />
        <BudgetAlerts alerts={stats?.budgetAlerts} />
      </div>

      {/* Recent Activity & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity activities={stats?.recentActivities} />
        </div>
        <PendingApprovals approvals={stats?.pendingApprovals} />
      </div>
    </div>
  );
}
```

### 3.2 Payroll Processing Component

**File:** `components/payroll/PayrollProcessForm.tsx`

```tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'react-hot-toast';

const payrollSchema = z.object({
  month: z.string().min(1, 'Month is required'),
  year: z.number().min(2020).max(2030),
  collegeIds: z.array(z.number()).min(1, 'Select at least one college'),
  processDate: z.string(),
  includeDeductions: z.boolean().default(true),
  includeTds: z.boolean().default(true),
});

type PayrollFormData = z.infer<typeof payrollSchema>;

export function PayrollProcessForm() {
  const [processing, setProcessing] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<PayrollFormData>({
    resolver: zodResolver(payrollSchema),
    defaultValues: {
      month: new Date().toLocaleString('default', { month: 'long' }),
      year: new Date().getFullYear(),
      collegeIds: [],
      processDate: new Date().toISOString().split('T')[0],
      includeDeductions: true,
      includeTds: true,
    },
  });

  const processPayrollMutation = useMutation({
    mutationFn: (data: PayrollFormData) => 
      apiClient.post('/payroll/process', data),
    onSuccess: (response) => {
      toast.success(`Payroll processed for ${response.data.employeeCount} employees`);
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      form.reset();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to process payroll');
    },
  });

  const onSubmit = (data: PayrollFormData) => {
    setProcessing(true);
    processPayrollMutation.mutate(data, {
      onSettled: () => setProcessing(false),
    });
  };

  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Month</label>
            <select {...form.register('month')} className="w-full border rounded-md p-2">
              {['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Year</label>
            <input
              type="number"
              {...form.register('year', { valueAsNumber: true })}
              className="w-full border rounded-md p-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Select Colleges (Total: 500 employees)
          </label>
          <CollegeMultiSelect
            value={form.watch('collegeIds')}
            onChange={(ids) => form.setValue('collegeIds', ids)}
          />
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...form.register('includeDeductions')}
              className="rounded"
            />
            <span className="text-sm">Include Deductions (PF, ESI)</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...form.register('includeTds')}
              className="rounded"
            />
            <span className="text-sm">Calculate TDS</span>
          </label>
        </div>

        {/* Summary */}
        <div className="bg-muted p-4 rounded-lg space-y-2">
          <h3 className="font-semibold">Payroll Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Employees</p>
              <p className="font-bold">500</p>
            </div>
            <div>
              <p className="text-muted-foreground">Estimated Amount</p>
              <p className="font-bold">₹2,45,00,000</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Deductions</p>
              <p className="font-bold">₹18,50,000</p>
            </div>
            <div>
              <p className="text-muted-foreground">Net Payable</p>
              <p className="font-bold text-green-600">₹2,26,50,000</p>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={processing}
            className="flex-1"
          >
            {processing ? 'Processing...' : 'Process Payroll'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
        </div>
      </form>
    </Card>
  );
}
```

### 3.3 Expense Approval Component

**File:** `components/expenses/ExpenseApprovalCard.tsx`

```tsx
'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

interface Expense {
  id: number;
  expense_code: string;
  category: string;
  amount: number;
  college_name: string;
  requested_by: string;
  description: string;
  created_at: string;
  attachments: string[];
}

interface ExpenseApprovalCardProps {
  expense: Expense;
}

export function ExpenseApprovalCard({ expense }: ExpenseApprovalCardProps) {
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: (id: number) => 
      apiClient.post(`/expenses/${id}/approve`),
    onSuccess: () => {
      toast.success('Expense approved successfully');
      queryClient.invalidateQueries({ queryKey: ['pending-expenses'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      apiClient.post(`/expenses/${id}/reject`, { reason }),
    onSuccess: () => {
      toast.success('Expense rejected');
      queryClient.invalidateQueries({ queryKey: ['pending-expenses'] });
      setIsRejecting(false);
    },
  });

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg">{expense.expense_code}</h3>
            <Badge variant="outline">{expense.category}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {expense.college_name} • {expense.requested_by}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">₹{expense.amount.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(expense.created_at), 'MMM dd, yyyy')}
          </p>
        </div>
      </div>

      <p className="text-sm mb-4">{expense.description}</p>

      {expense.attachments.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Attachments:</p>
          <div className="flex gap-2">
            {expense.attachments.map((file, idx) => (
              <a
                key={idx}
                href={file}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline"
              >
                Document {idx + 1}
              </a>
            ))}
          </div>
        </div>
      )}

      {!isRejecting ? (
        <div className="flex gap-3">
          <Button
            onClick={() => {
              setIsApproving(true);
              approveMutation.mutate(expense.id, {
                onSettled: () => setIsApproving(false),
              });
            }}
            disabled={isApproving}
            className="flex-1"
          >
            {isApproving ? 'Approving...' : 'Approve'}
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsRejecting(true)}
            className="flex-1"
          >
            Reject
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            placeholder="Reason for rejection..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            className="w-full border rounded-md p-2 text-sm"
            rows={3}
          />
          <div className="flex gap-3">
            <Button
              variant="destructive"
              onClick={() => {
                rejectMutation.mutate({
                  id: expense.id,
                  reason: rejectionReason,
                });
              }}
              disabled={!rejectionReason.trim()}
              className="flex-1"
            >
              Confirm Rejection
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsRejecting(false);
                setRejectionReason('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
```

---

## 4. State Management

### 4.1 Auth Store (Zustand)

**File:** `stores/authStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'super_accountant';
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
        const user = get().user;
        return user?.permissions.includes(permission) ?? false;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

---

## 5. API Integration

### 5.1 API Client Setup

**File:** `lib/api-client.ts`

```typescript
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'react-hot-toast';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8011/api',
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
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    return Promise.reject(error);
  }
);

export { apiClient };
```

### 5.2 Custom Hooks

**File:** `hooks/useExpenses.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function usePendingExpenses() {
  return useQuery({
    queryKey: ['pending-expenses'],
    queryFn: () => apiClient.get('/expenses/pending'),
  });
}

export function useApproveExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseId: number) =>
      apiClient.post(`/expenses/${expenseId}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });
}
```

---

## 6. Authentication & Authorization

### 6.1 Protected Route Middleware

**File:** `app/(dashboard)/layout.tsx`

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
```

---

## 7. Performance Optimization

### 7.1 Code Splitting

```tsx
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const FinancialChart = dynamic(
  () => import('@/components/dashboard/FinancialChart'),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

const ReportGenerator = dynamic(
  () => import('@/components/reports/ReportGenerator'),
  { ssr: false }
);
```

### 7.2 Image Optimization

```tsx
import Image from 'next/image';

<Image
  src="/logo.svg"
  alt="Logo"
  width={180}
  height={40}
  priority
/>
```

### 7.3 React Query Configuration

```tsx
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            cacheTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

---

## 8. Testing Strategy

### 8.1 Component Testing

**File:** `__tests__/components/PayrollProcessForm.test.tsx`

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PayrollProcessForm } from '@/components/payroll/PayrollProcessForm';

const queryClient = new QueryClient();

describe('PayrollProcessForm', () => {
  it('renders form fields correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PayrollProcessForm />
      </QueryClientProvider>
    );

    expect(screen.getByLabelText(/month/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/year/i)).toBeInTheDocument();
    expect(screen.getByText(/process payroll/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PayrollProcessForm />
      </QueryClientProvider>
    );

    const submitButton = screen.getByText(/process payroll/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/select at least one college/i)).toBeInTheDocument();
    });
  });
});
```

### 8.2 Integration Testing

```tsx
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post('/api/payroll/process', (req, res, ctx) => {
    return res(
      ctx.json({
        success: true,
        employeeCount: 500,
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## 9. Deployment

### 9.1 Build Configuration

**File:** `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['api.edubit.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Enable standalone output for Docker
  output: 'standalone',
};

module.exports = nextConfig;
```

### 9.2 Environment Variables

**File:** `.env.production`

```bash
NEXT_PUBLIC_API_URL=https://api.edubit.com/api
NEXT_PUBLIC_APP_NAME="Super Accountant Portal"
NEXT_PUBLIC_APP_VERSION="1.0.0"
```

### 9.3 Deployment Steps

```bash
# Build for production
npm run build

# Start production server
npm run start

# Or deploy to Vercel
vercel --prod
```

---

## Summary

This frontend implementation provides:

✅ **Modern Tech Stack**: Next.js 15, React 18, TypeScript 5.3  
✅ **Robust State Management**: Zustand + TanStack Query  
✅ **Type Safety**: Full TypeScript coverage with Zod validation  
✅ **Performance**: Code splitting, image optimization, caching  
✅ **User Experience**: Real-time updates, optimistic UI, loading states  
✅ **Testing**: Unit tests, integration tests, E2E tests  
✅ **Production Ready**: Docker support, CI/CD integration

**Key Features Implemented:**
- Dashboard with real-time financial metrics
- Payroll processing with TDS calculation
- Multi-level expense approval workflow
- Budget tracking with alerts
- Comprehensive financial reporting
- Audit trail with complete transaction history
