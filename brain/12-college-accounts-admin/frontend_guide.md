# College Accounts Admin Portal - Frontend Implementation Guide

**Framework**: Next.js 15 + React 18  
**Language**: TypeScript 5.3  
**Styling**: TailwindCSS 3.4 + shadcn/ui  
**State Management**: React Query + Zustand

---

## Table of Contents
1. [Project Structure](#1-project-structure)
2. [Technology Stack](#2-technology-stack)
3. [API Integration](#3-api-integration)
4. [State Management](#4-state-management)
5. [Component Architecture](#5-component-architecture)
6. [Form Handling](#6-form-handling)
7. [Financial Data Formatting](#7-financial-data-formatting)
8. [Performance Optimization](#8-performance-optimization)
9. [Accessibility](#9-accessibility)
10. [Testing](#10-testing)

---

## 1. Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── 2fa/
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx        # Dashboard
│   │   │   ├── expenses/
│   │   │   │   ├── page.tsx    # Expense list
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx # Expense details
│   │   │   │   └── create/
│   │   │   │       └── page.tsx # Create expense
│   │   │   ├── vendors/
│   │   │   ├── payments/
│   │   │   ├── budgets/
│   │   │   └── reports/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── expenses/
│   │   │   ├── ExpenseForm.tsx
│   │   │   ├── ExpenseCard.tsx
│   │   │   └── ExpenseFilters.tsx
│   │   ├── vendors/
│   │   ├── payments/
│   │   └── shared/
│   │       ├── Navbar.tsx
│   │       ├── Sidebar.tsx
│   │       └── PageHeader.tsx
│   ├── lib/
│   │   ├── api/                # API client
│   │   │   ├── client.ts
│   │   │   ├── expenses.ts
│   │   │   └── ...
│   │   ├── hooks/              # Custom hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useExpenses.ts
│   │   │   └── ...
│   │   ├── store/              # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   └── filterStore.ts
│   │   ├── utils/
│   │   │   ├── currency.ts
│   │   │   ├── date.ts
│   │   │   └── validation.ts
│   │   └── types/
│   │       ├── expense.ts
│   │       └── ...
│   └── styles/
│       └── globals.css
├── public/
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## 2. Technology Stack

### 2.1 Core Technologies

**Next.js 15** (App Router)
- Server Components for better performance
- Built-in API routes (not used - separate backend)
- Optimized image loading
- File-based routing

**React 18**
- Concurrent rendering
- Automatic batching
- useTransition for smooth UX

**TypeScript 5.3**
- Strict mode enabled
- Full type safety
- Better IDE support

### 2.2 UI Framework

**TailwindCSS 3.4**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Financial Green theme
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',  // Main green
          600: '#059669',
          700: '#047857',
        },
        danger: {
          500: '#ef4444',
        },
        warning: {
          500: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
```

**shadcn/ui Components**
- Radix UI primitives
- Fully customizable
- Accessible by default

---

## 3. API Integration

### 3.1 Axios Client Setup

**File**: `src/lib/api/client.ts`

```typescript
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { authStore } from '@/lib/store/authStore';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
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

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ error: { message: string } }>) => {
    if (error.response?.status === 401) {
      // Token expired - logout
      authStore.getState().logout();
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Insufficient permissions
      toast.error('You do not have permission to perform this action');
    } else if (error.response?.status === 429) {
      // Rate limit exceeded
      toast.error('Too many requests. Please try again later.');
    } else if (error.response?.data?.error?.message) {
      // API error message
      toast.error(error.response.data.error.message);
    } else {
      // Generic error
      toast.error('An unexpected error occurred');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 3.2 API Service Layer

**File**: `src/lib/api/expenses.ts`

```typescript
import apiClient from './client';
import type { Expense, ExpenseFormData, ExpenseSummary } from '@/lib/types/expense';

export const expenseApi = {
  // List expenses with filters
  list: async (params?: {
    category?: string;
    status?: string;
    from_date?: string;
    to_date?: string;
    search?: string;
    page?: number;
  }) => {
    const { data } = await apiClient.get<{ data: Expense[]; meta: any }>('/expenses', { params });
    return data;
  },

  // Get single expense
  get: async (id: number) => {
    const { data } = await apiClient.get<{ data: Expense }>(`/expenses/${id}`);
    return data.data;
  },

  // Create expense
  create: async (formData: ExpenseFormData) => {
    const { data } = await apiClient.post<{ data: Expense }>('/expenses', formData);
    return data.data;
  },

  // Update expense
  update: async (id: number, formData: Partial<ExpenseFormData>) => {
    const { data } = await apiClient.put<{ data: Expense }>(`/expenses/${id}`, formData);
    return data.data;
  },

  // Delete expense
  delete: async (id: number) => {
    await apiClient.delete(`/expenses/${id}`);
  },

  // Submit for approval
  submit: async (id: number) => {
    const { data } = await apiClient.post<{ data: Expense }>(`/expenses/${id}/submit`);
    return data.data;
  },

  // Get summary
  getSummary: async (params?: { from_date?: string; to_date?: string }) => {
    const { data } = await apiClient.get<{ data: ExpenseSummary }>('/expenses/summary', { params });
    return data.data;
  },
};
```

---

## 4. State Management

### 4.1 Server State (React Query)

**File**: `src/lib/hooks/useExpenses.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { expenseApi } from '@/lib/api/expenses';
import { toast } from 'sonner';

export const useExpenses = (filters?: {
  category?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
}) => {
  return useQuery({
    queryKey: ['expenses', filters],
    queryFn: () => expenseApi.list(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useExpense = (id: number) => {
  return useQuery({
    queryKey: ['expenses', id],
    queryFn: () => expenseApi.get(id),
    enabled: !!id,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: expenseApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create expense');
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => expenseApi.update(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.id] });
      toast.success('Expense updated successfully');
    },
  });
};

export const useSubmitExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: expenseApi.submit,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenses', data.id] });
      toast.success('Expense submitted for approval');
    },
  });
};
```

### 4.2 Client State (Zustand)

**File**: `src/lib/store/authStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  college_id: number;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export const authStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: (user, token) => set({ user, token }),

      logout: () => {
        set({ user: null, token: null });
        // Clear React Query cache
        queryClient.clear();
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

**File**: `src/lib/store/filterStore.ts`

```typescript
import { create } from 'zustand';

interface FilterState {
  category?: string;
  status?: string;
  dateRange?: { from: string; to: string };
  search?: string;
  setCategory: (category?: string) => void;
  setStatus: (status?: string) => void;
  setDateRange: (range?: { from: string; to: string }) => void;
  setSearch: (search?: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  category: undefined,
  status: undefined,
  dateRange: undefined,
  search: undefined,

  setCategory: (category) => set({ category }),
  setStatus: (status) => set({ status }),
  setDateRange: (dateRange) => set({ dateRange }),
  setSearch: (search) => set({ search }),
  clearFilters: () => set({
    category: undefined,
    status: undefined,
    dateRange: undefined,
    search: undefined,
  }),
}));
```

---

## 5. Component Architecture

### 5.1 Atomic Design Structure

**Atoms**: Basic UI elements
```typescript
// components/ui/Badge.tsx
export const Badge = ({ children, variant = 'default' }: BadgeProps) => {
  return (
    <span className={cn(
      'px-2 py-1 rounded-full text-xs font-medium',
      variant === 'success' && 'bg-green-100 text-green-800',
      variant === 'warning' && 'bg-yellow-100 text-yellow-800',
      variant === 'danger' && 'bg-red-100 text-red-800',
    )}>
      {children}
    </span>
  );
};
```

**Molecules**: Combinations of atoms
```typescript
// components/expenses/StatusBadge.tsx
export const StatusBadge = ({ status }: { status: ExpenseStatus }) => {
  const config = {
    draft: { label: 'Draft', variant: 'default' },
    pending_approval: { label: 'Pending', variant: 'warning' },
    approved: { label: 'Approved', variant: 'success' },
    rejected: { label: 'Rejected', variant: 'danger' },
  };

  const { label, variant } = config[status];

  return <Badge variant={variant}>{label}</Badge>;
};
```

**Organisms**: Complex components
```typescript
// components/expenses/ExpenseForm.tsx
export const ExpenseForm = ({ initialData, onSubmit }: ExpenseFormProps) => {
  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salaries">Salaries & Wages</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="supplies">Office Supplies</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                <Input
                  type="number"
                  className="pl-8"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* More fields... */}

        <div className="flex gap-4">
          <Button type="submit" variant="outline">Save as Draft</Button>
          <Button type="submit">Submit for Approval</Button>
        </div>
      </form>
    </Form>
  );
};
```

---

## 6. Form Handling

### 6.1 Validation with Zod

**File**: `src/lib/validation/expense.ts`

```typescript
import { z } from 'zod';

export const expenseSchema = z.object({
  category: z.enum(['salaries', 'utilities', 'supplies', 'maintenance']),
  amount: z.number().positive('Amount must be positive').max(10000000, 'Amount too large'),
  expense_date: z.string().refine((date) => new Date(date) <= new Date(), {
    message: 'Expense date cannot be in the future',
  }),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  gl_code_id: z.number(),
  vendor_id: z.number(),
  payment_mode: z.enum(['cash', 'cheque', 'neft', 'rtgs', 'upi']),
  receipt: z.instanceof(File).optional().refine(
    (file) => !file || file.size <= 5 * 1024 * 1024,
    'File size must be less than 5MB'
  ),
}).refine(
  (data) => {
    // Require receipt for amounts > ₹5000
    return data.amount <= 5000 || !!data.receipt;
  },
  {
    message: 'Receipt required for expenses over ₹5,000',
    path: ['receipt'],
  }
);

export type ExpenseFormData = z.infer<typeof expenseSchema>;
```

---

## 7. Financial Data Formatting

**File**: `src/lib/utils/currency.ts`

```typescript
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatCompactCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`; // Crores
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} L`; // Lakhs
  }
  return formatCurrency(amount);
};
```

---

## 8. Performance Optimization

### 8.1 Code Splitting

```typescript
// Dynamic imports for heavy components
const ExpenseChart = dynamic(() => import('@/components/expenses/ExpenseChart'), {
  loading: () => <Skeleton className="h-64" />,
});

const ReportDownloader = dynamic(() => import('@/components/reports/ReportDownloader'), {
  ssr: false, // Client-side only
});
```

### 8.2 Memoization

```typescript
const ExpenseCard = React.memo(({ expense }: { expense: Expense }) => {
  return <div>...</div>;
});

// Memoize expensive calculations
const budgetUtilization = useMemo(() => {
  return (budget.utilized_amount / budget.allocated_amount) * 100;
}, [budget.utilized_amount, budget.allocated_amount]);
```

---

## 9. Accessibility

```typescript
// ARIA labels for screen readers
<button
  aria-label={`Submit expense ${expense.expense_number} for approval`}
  onClick={() => handleSubmit(expense.id)}
>
  Submit
</button>

// Keyboard navigation
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  ...
</div>
```

---

## 10. Testing

```typescript
// components/__tests__/ExpenseForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ExpenseForm } from '../ExpenseForm';

describe('ExpenseForm', () => {
  it('validates amount is positive', async () => {
    render(<ExpenseForm />);
    
    const amountInput = screen.getByLabelText(/amount/i);
    fireEvent.change(amountInput, { target: { value: '-100' } });
    
    const submitButton = screen.getByText(/submit/i);
    fireEvent.click(submitButton);
    
    expect(await screen.findByText(/amount must be positive/i)).toBeInTheDocument();
  });

  it('requires receipt for amount > ₹5000', async () => {
    render(<ExpenseForm />);
    
    const amountInput = screen.getByLabelText(/amount/i);
    fireEvent.change(amountInput, { target: { value: '6000' } });
    
    const submitButton = screen.getByText(/submit/i);
    fireEvent.click(submitButton);
    
    expect(await screen.findByText(/receipt required/i)).toBeInTheDocument();
  });
});
```

---

*Complete frontend implementation guide for College Accounts Admin portal with modern React best practices.*
