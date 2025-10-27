# Bitflow Admin Portal - Frontend Implementation Guide

**Version**: 2.0  
**Framework**: Next.js 16 + React 19 + TypeScript 5.6  
**Port**: 3001  
**Last Updated**: October 25, 2025

---

## Project Structure

```
apps/bitflow-admin/
├── app/
│   ├── layout.tsx                    # Root layout with sidebar
│   ├── page.tsx                      # Platform Dashboard (/)
│   ├── universities/
│   │   ├── page.tsx                 # Universities list
│   │   ├── create/
│   │   │   └── page.tsx             # Create university
│   │   └── [id]/
│   │       ├── page.tsx             # University details
│   │       ├── edit/
│   │       │   └── page.tsx         # Edit university
│   │       ├── usage/
│   │       │   └── page.tsx         # Usage statistics
│   │       └── billing/
│   │           └── page.tsx         # Billing details
│   ├── users/
│   │   └── page.tsx                 # Global users management
│   ├── analytics/
│   │   └── page.tsx                 # Platform analytics
│   ├── billing/
│   │   ├── page.tsx                 # Billing overview
│   │   ├── invoices/
│   │   │   └── page.tsx             # Invoices list
│   │   └── subscriptions/
│   │       └── page.tsx             # Subscriptions management
│   ├── settings/
│   │   ├── page.tsx                 # Settings home
│   │   ├── general/
│   │   │   └── page.tsx             # General settings
│   │   ├── email/
│   │   │   └── page.tsx             # Email settings
│   │   ├── sms/
│   │   │   └── page.tsx             # SMS settings
│   │   ├── payment/
│   │   │   └── page.tsx             # Payment gateway settings
│   │   ├── storage/
│   │   │   └── page.tsx             # Storage settings
│   │   ├── security/
│   │   │   └── page.tsx             # Security policies
│   │   └── api/
│   │       └── page.tsx             # API settings
│   ├── audit-logs/
│   │   └── page.tsx                 # Audit logs
│   ├── support/
│   │   ├── page.tsx                 # Support tickets list
│   │   └── [id]/
│   │       └── page.tsx             # Ticket details
│   └── system-logs/
│       └── page.tsx                 # System logs & monitoring
├── components/
│   ├── platform/
│   │   ├── DashboardStats.tsx       # Platform metrics cards
│   │   ├── ActivityFeed.tsx         # Recent activity feed
│   │   ├── SystemHealthPanel.tsx    # Performance metrics
│   │   ├── AlertsPanel.tsx          # Active alerts
│   │   └── RevenueChart.tsx         # Revenue visualization
│   ├── universities/
│   │   ├── UniversitiesTable.tsx    # Data table
│   │   ├── UniversityRow.tsx        # Table row component
│   │   ├── CreateUniversityModal.tsx # Create modal
│   │   ├── UniversityDetailsCard.tsx # Details view
│   │   └── UsageCharts.tsx          # Usage visualizations
│   ├── users/
│   │   ├── GlobalUsersTable.tsx     # All users table
│   │   ├── UserActionsMenu.tsx      # Actions dropdown
│   │   └── UserDetailsModal.tsx     # User details popup
│   ├── analytics/
│   │   ├── GrowthCharts.tsx         # Growth metrics
│   │   ├── TopUniversitiesPanel.tsx # Leaderboard
│   │   ├── UsagePatterns.tsx        # Heatmaps
│   │   └── HealthMetrics.tsx        # System health
│   ├── billing/
│   │   ├── RevenueOverview.tsx      # MRR/ARR display
│   │   ├── SubscriptionsTable.tsx   # Active subscriptions
│   │   ├── InvoicesList.tsx         # Invoices list
│   │   └── PaymentRetryButton.tsx   # Retry failed payments
│   ├── settings/
│   │   ├── SettingsNav.tsx          # Settings navigation
│   │   ├── GeneralSettingsForm.tsx  # General settings
│   │   ├── EmailSettingsForm.tsx    # Email SMTP config
│   │   └── SecuritySettingsForm.tsx # Security policies
│   ├── audit/
│   │   ├── AuditLogsTable.tsx       # Audit logs table
│   │   └── LogDetailsModal.tsx      # Full log details
│   ├── support/
│   │   ├── TicketsTable.tsx         # Support tickets
│   │   ├── TicketDetailsModal.tsx   # Ticket conversation
│   │   └── ReplyForm.tsx            # Reply to ticket
│   ├── system/
│   │   ├── SystemLogsTable.tsx      # System logs
│   │   ├── SystemHealthDashboard.tsx # Health metrics
│   │   └── LogDetailsModal.tsx      # Stack trace view
│   └── shared/
│       ├── Layout.tsx               # Main layout
│       ├── Header.tsx               # Top header
│       ├── Sidebar.tsx              # Navigation sidebar
│       ├── StatCard.tsx             # Metric card
│       ├── DataTable.tsx            # Reusable table
│       ├── Pagination.tsx           # Table pagination
│       ├── FilterPanel.tsx          # Filter controls
│       ├── Modal.tsx                # Base modal
│       ├── ConfirmDialog.tsx        # Confirmation dialog
│       ├── Toast.tsx                # Toast notifications
│       ├── Spinner.tsx              # Loading spinner
│       ├── EmptyState.tsx           # Empty data state
│       └── ErrorBoundary.tsx        # Error boundary
├── lib/
│   ├── api/
│   │   ├── client.ts                # Axios instance with interceptors
│   │   ├── platform.ts              # Platform dashboard APIs
│   │   ├── universities.ts          # University management APIs
│   │   ├── users.ts                 # User management APIs
│   │   ├── analytics.ts             # Analytics APIs
│   │   ├── billing.ts               # Billing APIs
│   │   ├── settings.ts              # Settings APIs
│   │   ├── auditLogs.ts             # Audit logs APIs
│   │   ├── support.ts               # Support tickets APIs
│   │   └── systemLogs.ts            # System logs APIs
│   ├── store/
│   │   ├── authStore.ts             # Auth state (Zustand)
│   │   ├── platformStore.ts         # Platform data state
│   │   └── uiStore.ts               # UI state (sidebar, modals)
│   ├── hooks/
│   │   ├── useAuth.ts               # Authentication hook
│   │   ├── usePlatform.ts           # Platform data hook
│   │   ├── useUniversities.ts       # Universities hook
│   │   ├── useIdleTimeout.ts        # Session timeout hook
│   │   └── useWebSocket.ts          # Real-time updates
│   ├── utils/
│   │   ├── formatters.ts            # Date, currency formatters
│   │   ├── validators.ts            # Zod schemas
│   │   ├── constants.ts             # Constants
│   │   └── helpers.ts               # Helper functions
│   └── types/
│       ├── platform.types.ts        # Platform types
│       ├── university.types.ts      # University types
│       ├── user.types.ts            # User types
│       ├── analytics.types.ts       # Analytics types
│       ├── billing.types.ts         # Billing types
│       └── settings.types.ts        # Settings types
└── middleware.ts                     # Route protection
```

---

## TypeScript Types

### lib/types/university.types.ts

```typescript
export type UniversityStatus = 'active' | 'inactive' | 'suspended' | 'limited';
export type SubscriptionPlan = 'basic' | 'pro' | 'enterprise';
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trial';

export interface University {
  id: string;
  name: string;
  domain: string;
  slug: string;
  primary_email: string;
  primary_phone: string;
  logo_url?: string;
  status: UniversityStatus;
  storage_quota_gb: number;
  storage_used_gb: number;
  storage_percentage: number;
  api_rate_limit: number;
  total_users: number;
  subscription_plan: SubscriptionPlan;
  subscription_status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
  last_activity_at?: string;
}

export interface UniversityDetails extends University {
  owner: {
    name: string;
    email: string;
    phone: string;
  };
  usage: {
    total_users: number;
    active_today: number;
    api_calls_24h: number;
    colleges_count: number;
    programs_count: number;
    students_count: number;
    faculty_count: number;
    user_growth: DataPoint[];
    storage_breakdown: { module: string; size: number }[];
  };
  configuration: {
    custom_domain_enabled: boolean;
    sso_enabled: boolean;
    backup_frequency: string;
  };
  security: {
    two_factor_required: boolean;
    ip_whitelist: string[];
    failed_login_attempts_24h: number;
  };
}

export interface CreateUniversityRequest {
  name: string;
  primary_email: string;
  primary_phone: string;
  storage_quota_gb: number;
  subscription_plan: SubscriptionPlan;
}

export interface UpdateUniversityRequest {
  name?: string;
  primary_email?: string;
  primary_phone?: string;
  logo_url?: string;
  storage_quota_gb?: number;
  api_rate_limit?: number;
}

export interface DataPoint {
  date: string;
  value: number;
}
```

### lib/types/platform.types.ts

```typescript
export interface PlatformDashboard {
  stats: PlatformStats;
  recent_activity: UniversityActivity[];
  system_performance: SystemPerformance;
  alerts: Alert[];
  revenue: RevenueOverview;
}

export interface PlatformStats {
  total_universities: number;
  active_universities: number;
  total_users: number;
  api_requests_today: number;
  storage_used_gb: number;
  storage_total_gb: number;
}

export interface UniversityActivity {
  id: string;
  university_id: string;
  university_name: string;
  activity_type: 'enrollment' | 'payment' | 'upgrade' | 'downgrade' | 'issue';
  description: string;
  timestamp: string;
}

export interface SystemPerformance {
  api_latency_ms: number;
  db_response_time_ms: number;
  redis_hit_rate: number;
  uptime_percentage: number;
}

export interface Alert {
  id: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  created_at: string;
}

export interface RevenueOverview {
  mrr: number;
  arr: number;
  new_sales: number;
  renewals: number;
  trend: { month: string; revenue: number }[];
}
```

---

## API Client

### lib/api/client.ts

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';
import { useAuthStore } from '@/lib/store/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/admin';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
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

// Response interceptor - Handle auth errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Token expired - Attempt refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token } = response.data;
        useAuthStore.getState().setToken(access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - Logout user
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

### lib/api/universities.ts

```typescript
import apiClient from './client';
import {
  University,
  UniversityDetails,
  CreateUniversityRequest,
  UpdateUniversityRequest,
} from '@/lib/types/university.types';

export const universitiesApi = {
  // List all universities
  getAll: async (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    status?: string;
    sort_by?: string;
    sort_order?: string;
  }) => {
    const { data } = await apiClient.get<{
      data: University[];
      meta: any;
      links: any;
    }>('/universities', { params });
    return data;
  },

  // Get single university details
  getById: async (id: string) => {
    const { data } = await apiClient.get<UniversityDetails>(`/universities/${id}`);
    return data;
  },

  // Create new university
  create: async (request: CreateUniversityRequest) => {
    const { data } = await apiClient.post<University>('/universities', request);
    return data;
  },

  // Update university
  update: async (id: string, request: UpdateUniversityRequest) => {
    const { data } = await apiClient.patch<University>(`/universities/${id}`, request);
    return data;
  },

  // Delete university
  delete: async (id: string, confirmation: string) => {
    await apiClient.delete(`/universities/${id}`, {
      params: { confirmation },
    });
  },

  // Change university status
  changeStatus: async (id: string, status: string, reason?: string) => {
    const { data } = await apiClient.patch<University>(`/universities/${id}/status`, {
      status,
      reason,
    });
    return data;
  },

  // Get university usage statistics
  getUsage: async (id: string) => {
    const { data } = await apiClient.get(`/universities/${id}/usage`);
    return data;
  },

  // Get university activities
  getActivities: async (id: string, limit?: number) => {
    const { data } = await apiClient.get(`/universities/${id}/activities`, {
      params: { limit },
    });
    return data;
  },
};
```

---

## State Management (Zustand)

### lib/store/authStore.ts

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setRefreshToken: (refreshToken: string) => void;
  logout: () => void;
  isBitflowOwner: () => boolean;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),

      logout: () => set({ user: null, token: null, refreshToken: null, isAuthenticated: false }),

      isBitflowOwner: () => get().user?.role === 'bitflow_owner',

      hasPermission: (permission) => {
        const { user } = get();
        if (user?.role === 'bitflow_owner') return true; // All permissions
        return user?.permissions?.includes(permission) ?? false;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

### lib/store/platformStore.ts

```typescript
import { create } from 'zustand';
import { PlatformDashboard } from '@/lib/types/platform.types';

interface PlatformState {
  dashboard: PlatformDashboard | null;
  loading: boolean;
  error: string | null;
  setDashboard: (dashboard: PlatformDashboard) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePlatformStore = create<PlatformState>((set) => ({
  dashboard: null,
  loading: false,
  error: null,
  setDashboard: (dashboard) => set({ dashboard }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
```

---

## Custom Hooks

### lib/hooks/useAuth.ts

```typescript
import { useAuthStore } from '@/lib/store/authStore';

export function useAuth() {
  const { user, token, isBitflowOwner, hasPermission, logout } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated: !!token,
    isBitflowOwner: isBitflowOwner(),
    hasPermission,
    logout,
  };
}
```

### lib/hooks/useUniversities.ts

```typescript
import { useState, useEffect } from 'react';
import { universitiesApi } from '@/lib/api/universities';
import { University } from '@/lib/types/university.types';

export function useUniversities(params?: any) {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<any>(null);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const response = await universitiesApi.getAll(params);
      setUniversities(response.data);
      setMeta(response.meta);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch universities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, [JSON.stringify(params)]);

  return {
    universities,
    loading,
    error,
    meta,
    refetch: fetchUniversities,
  };
}
```

### lib/hooks/useIdleTimeout.ts

```typescript
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

export function useIdleTimeout(timeoutMinutes: number = 30) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        logout();
        router.push('/login?reason=timeout');
      }, timeoutMinutes * 60 * 1000);
    };

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach((event) => {
      document.addEventListener(event, resetTimeout);
    });

    resetTimeout();

    return () => {
      clearTimeout(timeout);
      events.forEach((event) => {
        document.removeEventListener(event, resetTimeout);
      });
    };
  }, [timeoutMinutes, router, logout]);
}
```

---

## Components

### components/universities/CreateUniversityModal.tsx

```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { universitiesApi } from '@/lib/api/universities';
import { toast } from 'sonner';

const schema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(200),
  primary_email: z.string().email('Invalid email address'),
  primary_phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
  storage_quota_gb: z.number().min(50).max(10000),
  subscription_plan: z.enum(['basic', 'pro', 'enterprise']),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateUniversityModal({ isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      storage_quota_gb: 500,
      subscription_plan: 'pro',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await universitiesApi.create(data);
      toast.success('University created successfully!');
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create university');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Create New University</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              University Name *
            </label>
            <input
              {...register('name')}
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="MIT University"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Primary Email *
            </label>
            <input
              {...register('primary_email')}
              type="email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="admin@mit.edu"
            />
            {errors.primary_email && (
              <p className="mt-1 text-sm text-red-600">{errors.primary_email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Phone *
            </label>
            <input
              {...register('primary_phone')}
              type="tel"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="+1-617-253-1000"
            />
            {errors.primary_phone && (
              <p className="mt-1 text-sm text-red-600">{errors.primary_phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Storage Quota (GB) *
            </label>
            <input
              {...register('storage_quota_gb', { valueAsNumber: true })}
              type="number"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="500"
            />
            {errors.storage_quota_gb && (
              <p className="mt-1 text-sm text-red-600">{errors.storage_quota_gb.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subscription Plan
            </label>
            <select
              {...register('subscription_plan')}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            >
              <option value="basic">Basic ($500/mo)</option>
              <option value="pro">Pro ($1000/mo)</option>
              <option value="enterprise">Enterprise ($2500/mo)</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create University'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

## Middleware (Route Protection)

### middleware.ts

```typescript
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token');

  // Redirect to login if no token
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Decode JWT payload (simplified - use proper JWT library in production)
    const payload = JSON.parse(atob(token.value.split('.')[1]));

    // Verify role is bitflow_owner
    if (payload.role !== 'bitflow_owner') {
      return NextResponse.redirect(new URL('/forbidden', request.url));
    }

    // Verify token not expired
    if (payload.exp * 1000 < Date.now()) {
      return NextResponse.redirect(new URL('/login?reason=expired', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/((?!login|forbidden|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## Hierarchical Navigation

The Bitflow Admin Portal implements a hierarchical navigation system that allows administrators to drill down from Platform → University → College → Specific Sections (Students, Departments, Faculty, etc.).

### Context Providers

#### UniversityContext

Provides university-level data and state to all nested routes.

**Location**: `apps/bitflow-admin/contexts/UniversityContext.tsx`

```typescript
'use client';

import { createContext, useContext, ReactNode } from 'react';

interface University {
  id: string;
  name: string;
  domain: string;
  logo_url: string;
  status: 'active' | 'inactive' | 'suspended';
  stats: {
    total_colleges: number;
    total_students: number;
    total_faculty: number;
    total_staff: number;
  };
}

interface UniversityContextType {
  university: University;
  refreshUniversity: () => Promise<void>;
}

const UniversityContext = createContext<UniversityContextType | undefined>(undefined);

export function UniversityProvider({ 
  children, 
  university 
}: { 
  children: ReactNode; 
  university: University;
}) {
  const refreshUniversity = async () => {
    // Implement refresh logic
  };

  return (
    <UniversityContext.Provider value={{ university, refreshUniversity }}>
      {children}
    </UniversityContext.Provider>
  );
}

export function useUniversity() {
  const context = useContext(UniversityContext);
  if (!context) {
    throw new Error('useUniversity must be used within UniversityProvider');
  }
  return context;
}
```

**Usage in Layout**:

```typescript
// app/universities/[id]/layout.tsx
import { UniversityProvider } from '@/contexts/UniversityContext';
import { Breadcrumb } from '@/components/Breadcrumb';

export default async function UniversityLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { id: string };
}) {
  const university = await getUniversityData(params.id);

  return (
    <UniversityProvider university={university}>
      <div className="min-h-screen bg-gray-50">
        <Breadcrumb />
        <div className="p-6">
          {children}
        </div>
      </div>
    </UniversityProvider>
  );
}
```

#### CollegeContext

Provides college-level data to all routes under a college.

**Location**: `apps/bitflow-admin/contexts/CollegeContext.tsx`

```typescript
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useUniversity } from './UniversityContext';

interface College {
  id: string;
  name: string;
  code: string;
  status: 'active' | 'inactive';
  established_year: number;
  stats: {
    total_departments: number;
    total_students: number;
    total_faculty: number;
    total_courses: number;
  };
}

interface CollegeContextType {
  college: College;
  refreshCollege: () => Promise<void>;
}

const CollegeContext = createContext<CollegeContextType | undefined>(undefined);

export function CollegeProvider({ 
  children, 
  college 
}: { 
  children: ReactNode; 
  college: College;
}) {
  const { university } = useUniversity();

  const refreshCollege = async () => {
    // Implement refresh logic
  };

  return (
    <CollegeContext.Provider value={{ college, refreshCollege }}>
      {children}
    </CollegeContext.Provider>
  );
}

export function useCollege() {
  const context = useContext(CollegeContext);
  if (!context) {
    throw new Error('useCollege must be used within CollegeProvider');
  }
  return context;
}
```

**Usage in Layout**:

```typescript
// app/universities/[id]/colleges/[collegeId]/layout.tsx
import { CollegeProvider } from '@/contexts/CollegeContext';
import { Breadcrumb } from '@/components/Breadcrumb';

export default async function CollegeLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { id: string; collegeId: string };
}) {
  const college = await getCollegeData(params.id, params.collegeId);

  return (
    <CollegeProvider college={college}>
      <div className="min-h-screen bg-gray-50">
        <Breadcrumb />
        <div className="p-6">
          {children}
        </div>
      </div>
    </CollegeProvider>
  );
}
```

### Breadcrumb Component

Dynamic breadcrumb navigation that automatically builds from the current route.

**Location**: `apps/bitflow-admin/components/Breadcrumb.tsx`

```typescript
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { useUniversity } from '@/contexts/UniversityContext';
import { useCollege } from '@/contexts/CollegeContext';

export function Breadcrumb() {
  const pathname = usePathname();
  const university = useUniversity();
  const college = useCollege();

  const segments = pathname.split('/').filter(Boolean);
  
  const breadcrumbs = [
    { label: 'Platform', href: '/' },
  ];

  // Build breadcrumb dynamically
  if (segments.includes('universities') && university) {
    breadcrumbs.push({
      label: university.university.name,
      href: `/universities/${university.university.id}`,
    });

    if (segments.includes('colleges') && college) {
      breadcrumbs.push({
        label: college.college.name,
        href: `/universities/${university.university.id}/colleges/${college.college.id}`,
      });

      // Add section-specific breadcrumbs
      if (segments.includes('students')) {
        breadcrumbs.push({
          label: 'Students',
          href: `/universities/${university.university.id}/colleges/${college.college.id}/students`,
        });
      }
      // Add more sections as needed...
    }
  }

  return (
    <nav className="bg-white border-b px-6 py-3">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.href} className="flex items-center">
            {index > 0 && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-900 font-medium">{crumb.label}</span>
            ) : (
              <Link 
                href={crumb.href}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

### Hierarchical Routing Patterns

#### University Hub Page

**Route**: `/universities/[id]`  
**File**: `apps/bitflow-admin/app/universities/[id]/page.tsx`

```typescript
'use client';

import { useUniversity } from '@/contexts/UniversityContext';
import { Card } from '@/components/ui/Card';
import { Building2, Users, GraduationCap, Settings } from 'lucide-react';

export default function UniversityHubPage() {
  const { university } = useUniversity();

  const quickActions = [
    {
      title: 'Management Team',
      icon: Users,
      href: `/universities/${university.id}/management`,
      description: 'View and manage university leadership',
    },
    {
      title: 'Colleges',
      icon: Building2,
      href: `/universities/${university.id}/colleges`,
      description: `${university.stats.total_colleges} colleges`,
    },
    {
      title: 'Settings',
      icon: Settings,
      href: `/universities/${university.id}/settings`,
      description: 'Configure university settings',
    },
  ];

  return (
    <div className="space-y-6">
      {/* University Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <img src={university.logo_url} alt={university.name} className="w-16 h-16" />
          <div>
            <h1 className="text-2xl font-bold">{university.name}</h1>
            <p className="text-gray-600">{university.domain}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-sm text-gray-600">Total Colleges</div>
          <div className="text-2xl font-bold">{university.stats.total_colleges}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600">Total Students</div>
          <div className="text-2xl font-bold">{university.stats.total_students}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600">Total Faculty</div>
          <div className="text-2xl font-bold">{university.stats.total_faculty}</div>
        </Card>
        <Card>
          <div className="text-sm text-gray-600">Total Staff</div>
          <div className="text-2xl font-bold">{university.stats.total_staff}</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start space-x-3">
                <action.icon className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

#### College Hub Page

**Route**: `/universities/[id]/colleges/[collegeId]`  
**File**: `apps/bitflow-admin/app/universities/[id]/colleges/[collegeId]/page.tsx`

```typescript
'use client';

import { useCollege } from '@/contexts/CollegeContext';
import { Card } from '@/components/ui/Card';
import { 
  Users, Building2, BookOpen, Library, 
  Bus, Home, Calendar, Settings 
} from 'lucide-react';

export default function CollegeHubPage() {
  const { college } = useCollege();

  const sections = [
    { title: 'Leadership', icon: Users, href: 'leadership', count: college.stats.leadership_count },
    { title: 'Departments', icon: Building2, href: 'departments', count: college.stats.total_departments },
    { title: 'Academic Staff', icon: GraduationCap, href: 'academic-staff', count: college.stats.total_faculty },
    { title: 'Students', icon: Users, href: 'students', count: college.stats.total_students },
    { title: 'Curriculum', icon: BookOpen, href: 'curriculum', count: college.stats.total_courses },
    { title: 'Library', icon: Library, href: 'library', count: college.stats.library_books },
    { title: 'Transport', icon: Bus, href: 'transport', count: college.stats.transport_routes },
    { title: 'Hostel', icon: Home, href: 'hostel', count: college.stats.hostel_rooms },
    { title: 'Attendance', icon: Calendar, href: 'attendance' },
    { title: 'Settings', icon: Settings, href: 'settings' },
  ];

  return (
    <div className="space-y-6">
      {/* College Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold">{college.name}</h1>
        <p className="text-gray-600">Code: {college.code} | Established: {college.established_year}</p>
      </div>

      {/* Section Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sections.map((section) => (
          <Link key={section.href} href={`${pathname}/${section.href}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{section.title}</h3>
                  {section.count !== undefined && (
                    <p className="text-2xl font-bold text-blue-600">{section.count}</p>
                  )}
                </div>
                <section.icon className="w-8 h-8 text-gray-400" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
```

#### Students List Page

**Route**: `/universities/[id]/colleges/[collegeId]/students`  
**File**: `apps/bitflow-admin/app/universities/[id]/colleges/[collegeId]/students/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useCollege } from '@/contexts/CollegeContext';
import { useUniversity } from '@/contexts/UniversityContext';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Search, Plus, Upload } from 'lucide-react';
import { useStudents } from '@/hooks/useStudents';

export default function StudentsListPage() {
  const { university } = useUniversity();
  const { college } = useCollege();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    year: '',
    status: 'active',
  });

  const { students, pagination, isLoading } = useStudents({
    universityId: university.id,
    collegeId: college.id,
    search,
    ...filters,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Students</h1>
        <div className="flex space-x-2">
          <Button variant="outline" icon={Upload}>
            Bulk Import
          </Button>
          <Button icon={Plus}>
            Enroll Student
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
          <Select
            value={filters.department}
            onChange={(value) => setFilters({ ...filters, department: value })}
            options={departments}
            placeholder="All Departments"
          />
          <Select
            value={filters.year}
            onChange={(value) => setFilters({ ...filters, year: value })}
            options={[
              { label: 'All Years', value: '' },
              { label: 'Year 1', value: '1' },
              { label: 'Year 2', value: '2' },
              { label: 'Year 3', value: '3' },
              { label: 'Year 4', value: '4' },
            ]}
          />
          <Select
            value={filters.status}
            onChange={(value) => setFilters({ ...filters, status: value })}
            options={[
              { label: 'Active', value: 'active' },
              { label: 'Suspended', value: 'suspended' },
              { label: 'Graduated', value: 'graduated' },
            ]}
          />
        </div>
      </Card>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.total > pagination.per_page && (
        <Pagination {...pagination} />
      )}
    </div>
  );
}
```

### Context-Aware API Calls

Use the context providers to automatically include the correct IDs in API calls:

```typescript
// hooks/useStudents.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

interface UseStudentsParams {
  universityId: string;
  collegeId: string;
  search?: string;
  department?: string;
  year?: string;
  status?: string;
  page?: number;
}

export function useStudents(params: UseStudentsParams) {
  const { universityId, collegeId, ...queryParams } = params;

  return useQuery({
    queryKey: ['students', universityId, collegeId, queryParams],
    queryFn: () =>
      apiClient.get(
        `/universities/${universityId}/colleges/${collegeId}/students`,
        { params: queryParams }
      ),
  });
}
```

### Form Patterns with Context

When creating or editing entities, use the context to pre-fill parent relationships:

```typescript
// app/universities/[id]/colleges/[collegeId]/departments/create/page.tsx
'use client';

import { useCollege } from '@/contexts/CollegeContext';
import { useUniversity } from '@/contexts/UniversityContext';
import { DepartmentForm } from '@/components/departments/DepartmentForm';

export default function CreateDepartmentPage() {
  const { university } = useUniversity();
  const { college } = useCollege();

  const handleSubmit = async (data: DepartmentFormData) => {
    await apiClient.post(
      `/universities/${university.id}/colleges/${college.id}/departments`,
      data
    );
    
    // Navigate back or show success
    router.push(`/universities/${university.id}/colleges/${college.id}/departments`);
  };

  return (
    <div>
      <h1>Create Department</h1>
      <p className="text-gray-600">
        College: {college.name} | University: {university.name}
      </p>
      <DepartmentForm onSubmit={handleSubmit} />
    </div>
  );
}
```

### Navigation Best Practices

1. **Always use context providers** - Never hard-code IDs in nested routes
2. **Breadcrumb component** - Include on all hierarchical pages for easy navigation
3. **Loading states** - Show skeleton loaders while context data is fetching
4. **Error boundaries** - Wrap context providers with error boundaries to handle missing data
5. **Deep linking** - Ensure all hierarchical URLs are shareable and bookmarkable
6. **Back navigation** - Use the breadcrumb or explicit back buttons, not browser back

---

## Performance Optimization

### Code Splitting

```typescript
// app/page.tsx - Lazy load heavy components
import dynamic from 'next/dynamic';

const RevenueChart = dynamic(() => import('@/components/platform/RevenueChart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false,
});
```

### Memoization

```typescript
import { useMemo } from 'react';

export function UniversitiesTable({ universities }: Props) {
  const sortedUniversities = useMemo(() => {
    return [...universities].sort((a, b) => a.name.localeCompare(b.name));
  }, [universities]);

  return <table>{/* ... */}</table>;
}
```

---

**End of Frontend Guide**
