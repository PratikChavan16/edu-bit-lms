# University Owner Portal - Frontend Implementation Guide

**Version**: 2.0  
**Framework**: Next.js 16 + React 19 + TypeScript 5.6  
**Port**: 3002  
**Last Updated**: October 25, 2025

---

## Project Structure

```
apps/university-owner/
├── app/
│   ├── layout.tsx                    # Root layout with sidebar
│   ├── page.tsx                      # University Dashboard (/)
│   ├── colleges/
│   │   ├── page.tsx                 # Colleges list
│   │   ├── create/
│   │   │   └── page.tsx             # Create college
│   │   └── [id]/
│   │       ├── page.tsx             # College details
│   │       ├── edit/
│   │       │   └── page.tsx         # Edit college
│   │       └── assign-principal/
│   │           └── page.tsx         # Assign principal
│   ├── programs/
│   │   ├── page.tsx                 # Programs list
│   │   ├── create/
│   │   │   └── page.tsx             # Create program
│   │   └── [id]/
│   │       ├── page.tsx             # Program details
│   │       └── curriculum/
│   │           └── page.tsx         # Manage curriculum
│   ├── faculty/
│   │   ├── page.tsx                 # Faculty list
│   │   ├── hire/
│   │   │   └── page.tsx             # Hire faculty (3-step wizard)
│   │   └── [id]/
│   │       ├── page.tsx             # Faculty profile
│   │       └── leaves/
│   │           └── page.tsx         # Leave management
│   ├── students/
│   │   ├── page.tsx                 # Students list
│   │   ├── [id]/
│   │   │   └── page.tsx             # Student profile
│   │   ├── transfer/
│   │   │   └── page.tsx             # Transfer student
│   │   └── bulk-import/
│   │       └── page.tsx             # Bulk import students
│   ├── admissions/
│   │   ├── page.tsx                 # Admissions dashboard
│   │   ├── applications/
│   │   │   ├── page.tsx             # Applications list
│   │   │   └── [id]/
│   │   │       └── page.tsx         # Application review
│   │   ├── merit-lists/
│   │   │   ├── page.tsx             # Merit lists
│   │   │   └── [id]/
│   │   │       └── page.tsx         # Merit list details
│   │   └── entrance-tests/
│   │       └── page.tsx             # Entrance tests
│   ├── financial/
│   │   ├── page.tsx                 # Financial dashboard
│   │   ├── fee-structures/
│   │   │   ├── page.tsx             # Fee structures list
│   │   │   └── create/
│   │   │       └── page.tsx         # Create fee structure
│   │   ├── collections/
│   │   │   └── page.tsx             # Fee collections
│   │   ├── expenses/
│   │   │   ├── page.tsx             # Expenses list
│   │   │   └── [id]/
│   │   │       └── page.tsx         # Approve expense
│   │   └── scholarships/
│   │       └── page.tsx             # Scholarships management
│   ├── reports/
│   │   └── page.tsx                 # Reports & Analytics
│   └── settings/
│       ├── page.tsx                 # Settings home
│       ├── profile/
│       │   └── page.tsx             # University profile
│       ├── calendar/
│       │   └── page.tsx             # Academic calendar
│       ├── users/
│       │   └── page.tsx             # User management
│       └── templates/
│           └── page.tsx             # Email/SMS templates
├── components/
│   ├── dashboard/
│   │   ├── DashboardStats.tsx       # Key metrics cards
│   │   ├── EnrollmentTrendChart.tsx # Enrollment line chart
│   │   ├── FeeCollectionChart.tsx   # Bar chart by college
│   │   ├── RecentActivities.tsx     # Activity feed
│   │   └── PendingApprovals.tsx     # Approvals list
│   ├── colleges/
│   │   ├── CollegesGrid.tsx         # Grid view
│   │   ├── CollegesTable.tsx        # Table view
│   │   ├── CollegeCard.tsx          # Grid card component
│   │   ├── CreateCollegeModal.tsx   # Create modal with form
│   │   ├── CollegeDetailsView.tsx   # Details page layout
│   │   ├── AssignPrincipalModal.tsx # Assign principal modal
│   │   └── CollegeStatsPanel.tsx    # Statistics panel
│   ├── programs/
│   │   ├── ProgramsTable.tsx        # Programs data table
│   │   ├── CreateProgramModal.tsx   # Create program modal
│   │   ├── CurriculumEditor.tsx     # Curriculum drag-drop editor
│   │   └── ProgramDetailsCard.tsx   # Program details
│   ├── faculty/
│   │   ├── FacultyTable.tsx         # Faculty data table
│   │   ├── HireFacultyWizard.tsx    # 3-step hire wizard
│   │   ├── FacultyProfileView.tsx   # Profile page
│   │   ├── LeavesList.tsx           # Faculty leaves list
│   │   ├── ApproveLeaveModal.tsx    # Approve/reject leave
│   │   └── FacultyFilters.tsx       # Filter panel
│   ├── students/
│   │   ├── StudentsTable.tsx        # Students data table
│   │   ├── StudentProfileView.tsx   # Profile page
│   │   ├── TransferStudentModal.tsx # Transfer modal
│   │   ├── BulkImportWizard.tsx     # CSV import wizard
│   │   └── StudentFilters.tsx       # Filter controls
│   ├── admissions/
│   │   ├── ApplicationsTable.tsx    # Applications list
│   │   ├── ApplicationReviewModal.tsx # Review application
│   │   ├── MeritListsTable.tsx      # Merit lists
│   │   ├── ApproveMeritListModal.tsx # Approve merit list
│   │   └── EntranceTestsCalendar.tsx # Tests calendar
│   ├── financial/
│   │   ├── FinancialSummary.tsx     # Dashboard summary
│   │   ├── FeeCollectionCharts.tsx  # Charts panel
│   │   ├── FeeStructuresTable.tsx   # Fee structures list
│   │   ├── CreateFeeStructureForm.tsx # Create form
│   │   ├── ExpensesList.tsx         # Pending expenses
│   │   ├── ApproveExpenseModal.tsx  # Approve modal
│   │   └── ScholarshipsTable.tsx    # Scholarships list
│   ├── reports/
│   │   ├── ReportGeneratorForm.tsx  # Generate report form
│   │   ├── ReportPreview.tsx        # Preview generated report
│   │   ├── RecentReportsList.tsx    # Previously generated
│   │   └── ReportFilters.tsx        # Filter panel
│   ├── settings/
│   │   ├── SettingsNav.tsx          # Settings navigation tabs
│   │   ├── ProfileSettingsForm.tsx  # University profile form
│   │   ├── AcademicCalendarForm.tsx # Calendar configuration
│   │   ├── UsersManagementTable.tsx # Users list
│   │   └── TemplatesEditor.tsx      # Email/SMS templates
│   └── shared/
│       ├── Layout.tsx               # Main layout wrapper
│       ├── Header.tsx               # Top header with profile
│       ├── Sidebar.tsx              # Navigation sidebar
│       ├── StatCard.tsx             # Metric display card
│       ├── DataTable.tsx            # Reusable data table
│       ├── Pagination.tsx           # Pagination controls
│       ├── SearchBar.tsx            # Search input
│       ├── FilterDropdown.tsx       # Filter dropdown
│       ├── DateRangePicker.tsx      # Date range selector
│       ├── FileUpload.tsx           # File upload component
│       ├── Modal.tsx                # Base modal
│       ├── ConfirmDialog.tsx        # Confirmation dialog
│       ├── Toast.tsx                # Toast notifications
│       ├── LoadingSpinner.tsx       # Loading spinner
│       ├── EmptyState.tsx           # Empty data state
│       └── ErrorBoundary.tsx        # Error boundary
├── lib/
│   ├── api/
│   │   ├── client.ts                # Axios instance
│   │   ├── dashboard.ts             # Dashboard API calls
│   │   ├── colleges.ts              # Colleges API calls
│   │   ├── programs.ts              # Programs API calls
│   │   ├── faculty.ts               # Faculty API calls
│   │   ├── students.ts              # Students API calls
│   │   ├── admissions.ts            # Admissions API calls
│   │   ├── financial.ts             # Financial API calls
│   │   └── settings.ts              # Settings API calls
│   ├── stores/
│   │   ├── authStore.ts             # Authentication state (Zustand)
│   │   ├── dashboardStore.ts        # Dashboard data
│   │   ├── collegesStore.ts         # Colleges state
│   │   ├── facultyStore.ts          # Faculty state
│   │   └── studentsStore.ts         # Students state
│   ├── hooks/
│   │   ├── useAuth.ts               # Auth hook
│   │   ├── useUniversity.ts         # University context hook
│   │   ├── useFilters.ts            # Filters state management
│   │   ├── usePagination.ts         # Pagination hook
│   │   └── useDebounce.ts           # Debounce hook for search
│   ├── utils/
│   │   ├── formatters.ts            # Data formatters
│   │   ├── validators.ts            # Form validators
│   │   ├── dateHelpers.ts           # Date utilities
│   │   └── exportHelpers.ts         # CSV/PDF export
│   └── types/
│       ├── college.ts               # College types
│       ├── program.ts               # Program types
│       ├── faculty.ts               # Faculty types
│       ├── student.ts               # Student types
│       ├── admission.ts             # Admission types
│       ├── financial.ts             # Financial types
│       └── common.ts                # Shared types
└── public/
    ├── images/
    ├── icons/
    └── placeholder-logo.png
```

---

## Key Pages Implementation

### app/page.tsx - University Dashboard

```tsx
'use client';

import { useEffect } from 'react';
import { useDashboardStore } from '@/lib/stores/dashboardStore';
import DashboardStats from '@/components/dashboard/DashboardStats';
import EnrollmentTrendChart from '@/components/dashboard/EnrollmentTrendChart';
import FeeCollectionChart from '@/components/dashboard/FeeCollectionChart';
import RecentActivities from '@/components/dashboard/RecentActivities';
import PendingApprovals from '@/components/dashboard/PendingApprovals';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function DashboardPage() {
  const { data, loading, error, fetchDashboard } = useDashboardStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">University Dashboard</h1>
        <p className="text-gray-600">Overview of your university operations</p>
      </div>

      {/* Key Metrics */}
      <DashboardStats metrics={data?.metrics} />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EnrollmentTrendChart data={data?.enrollment_trend} />
        <FeeCollectionChart data={data?.fee_collection} />
      </div>

      {/* Activity & Approvals Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities activities={data?.recent_activities} />
        <PendingApprovals approvals={data?.pending_approvals} />
      </div>
    </div>
  );
}
```

### app/colleges/page.tsx - Colleges List

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useCollegesStore } from '@/lib/stores/collegesStore';
import CollegesGrid from '@/components/colleges/CollegesGrid';
import CollegesTable from '@/components/colleges/CollegesTable';
import CreateCollegeModal from '@/components/colleges/CreateCollegeModal';
import SearchBar from '@/components/shared/SearchBar';
import FilterDropdown from '@/components/shared/FilterDropdown';
import { Button } from '@/components/ui/button';
import { ViewGridIcon, ViewListIcon } from '@heroicons/react/outline';

type ViewMode = 'grid' | 'table';

export default function CollegesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { colleges, filters, loading, fetchColleges, setFilter } = useCollegesStore();

  useEffect(() => {
    fetchColleges();
  }, [filters, fetchColleges]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Colleges</h1>
          <p className="text-gray-600">Manage colleges within your university</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          + Create College
        </Button>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <SearchBar
            value={filters.search}
            onChange={(value) => setFilter('search', value)}
            placeholder="Search colleges..."
          />
          <FilterDropdown
            label="Status"
            options={[
              { label: 'All', value: '' },
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]}
            value={filters.status}
            onChange={(value) => setFilter('status', value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
          >
            <ViewGridIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-2 rounded ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
          >
            <ViewListIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Colleges Display */}
      {loading ? (
        <LoadingSpinner />
      ) : viewMode === 'grid' ? (
        <CollegesGrid colleges={colleges} />
      ) : (
        <CollegesTable colleges={colleges} />
      )}

      {/* Create College Modal */}
      {showCreateModal && (
        <CreateCollegeModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
```

### app/faculty/hire/page.tsx - Hire Faculty Wizard

```tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFacultyStore } from '@/lib/stores/facultyStore';
import { toast } from '@/components/shared/Toast';

type Step = 1 | 2 | 3;

interface FacultyData {
  // Step 1: Personal Info
  name: string;
  email: string;
  phone: string;
  // Step 2: Qualifications
  qualification: string;
  specialization: string;
  experience_years: number;
  // Step 3: Employment Details
  college_id: string;
  department_id: string;
  designation: string;
  employment_type: string;
  date_of_joining: string;
  salary: number;
}

export default function HireFacultyPage() {
  const router = useRouter();
  const { hireFaculty } = useFacultyStore();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [formData, setFormData] = useState<Partial<FacultyData>>({});

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const handleSubmit = async () => {
    try {
      await hireFaculty(formData as FacultyData);
      toast.success('Faculty hired successfully!');
      router.push('/faculty');
    } catch (error) {
      toast.error('Failed to hire faculty');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-32 h-1 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-sm text-gray-600">Personal Info</span>
          <span className="text-sm text-gray-600">Qualifications</span>
          <span className="text-sm text-gray-600">Employment</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {currentStep === 1 && (
          <PersonalInfoForm data={formData} onChange={setFormData} />
        )}
        {currentStep === 2 && (
          <QualificationsForm data={formData} onChange={setFormData} />
        )}
        {currentStep === 3 && (
          <EmploymentDetailsForm data={formData} onChange={setFormData} />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          <div className="ml-auto">
            {currentStep < 3 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleSubmit}>Hire Faculty</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## State Management (Zustand)

### lib/stores/authStore.ts

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api/client';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  university_id: string;
  university: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  };
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, otp?: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,

      login: async (email: string, password: string, otp?: string) => {
        set({ loading: true });
        try {
          const response = await api.post('/owner/auth/login', {
            email,
            password,
            otp,
          });

          const { access_token, user, university } = response.data;

          set({
            user: { ...user, university },
            accessToken: access_token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },

      refreshToken: async () => {
        try {
          const response = await api.post('/owner/auth/refresh');
          const { access_token } = response.data;
          set({ accessToken: access_token });
        } catch (error) {
          get().logout();
        }
      },

      setUser: (user: User) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

### lib/stores/collegesStore.ts

```typescript
import { create } from 'zustand';
import * as collegesApi from '@/lib/api/colleges';
import { College } from '@/lib/types/college';

interface CollegesState {
  colleges: College[];
  selectedCollege: College | null;
  filters: {
    search: string;
    status: string;
  };
  pagination: {
    page: number;
    per_page: number;
    total: number;
  };
  loading: boolean;
  error: string | null;
  
  fetchColleges: () => Promise<void>;
  fetchCollegeById: (id: string) => Promise<void>;
  createCollege: (data: Partial<College>) => Promise<College>;
  updateCollege: (id: string, data: Partial<College>) => Promise<void>;
  deleteCollege: (id: string) => Promise<void>;
  assignPrincipal: (collegeId: string, principalId: string) => Promise<void>;
  setFilter: (key: string, value: any) => void;
  setPage: (page: number) => void;
}

export const useCollegesStore = create<CollegesState>((set, get) => ({
  colleges: [],
  selectedCollege: null,
  filters: {
    search: '',
    status: '',
  },
  pagination: {
    page: 1,
    per_page: 15,
    total: 0,
  },
  loading: false,
  error: null,

  fetchColleges: async () => {
    set({ loading: true, error: null });
    try {
      const { filters, pagination } = get();
      const response = await collegesApi.getColleges({
        ...filters,
        page: pagination.page,
        per_page: pagination.per_page,
      });
      
      set({
        colleges: response.data,
        pagination: {
          ...pagination,
          total: response.meta.total,
        },
        loading: false,
      });
    } catch (error) {
      set({ error: 'Failed to fetch colleges', loading: false });
    }
  },

  fetchCollegeById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const college = await collegesApi.getCollegeById(id);
      set({ selectedCollege: college, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch college', loading: false });
    }
  },

  createCollege: async (data: Partial<College>) => {
    const college = await collegesApi.createCollege(data);
    set((state) => ({
      colleges: [...state.colleges, college],
    }));
    return college;
  },

  updateCollege: async (id: string, data: Partial<College>) => {
    const updated = await collegesApi.updateCollege(id, data);
    set((state) => ({
      colleges: state.colleges.map((c) => (c.id === id ? updated : c)),
      selectedCollege: state.selectedCollege?.id === id ? updated : state.selectedCollege,
    }));
  },

  deleteCollege: async (id: string) => {
    await collegesApi.deleteCollege(id);
    set((state) => ({
      colleges: state.colleges.filter((c) => c.id !== id),
    }));
  },

  assignPrincipal: async (collegeId: string, principalId: string) => {
    await collegesApi.assignPrincipal(collegeId, principalId);
    get().fetchCollegeById(collegeId);
  },

  setFilter: (key: string, value: any) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
      pagination: { ...state.pagination, page: 1 }, // Reset to page 1
    }));
  },

  setPage: (page: number) => {
    set((state) => ({
      pagination: { ...state.pagination, page },
    }));
  },
}));
```

---

## API Client

### lib/api/client.ts

```typescript
import axios from 'axios';
import { useAuthStore } from '@/lib/stores/authStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // For HttpOnly cookies
});

// Request interceptor - Add JWT token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await useAuthStore.getState().refreshToken();
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### lib/api/colleges.ts

```typescript
import api from './client';
import { College } from '@/lib/types/college';

export const getColleges = async (params: any) => {
  const response = await api.get('/owner/colleges', { params });
  return response.data;
};

export const getCollegeById = async (id: string): Promise<College> => {
  const response = await api.get(`/owner/colleges/${id}`);
  return response.data.data;
};

export const createCollege = async (data: Partial<College>): Promise<College> => {
  const response = await api.post('/owner/colleges', data);
  return response.data.data;
};

export const updateCollege = async (id: string, data: Partial<College>): Promise<College> => {
  const response = await api.patch(`/owner/colleges/${id}`, data);
  return response.data.data;
};

export const deleteCollege = async (id: string): Promise<void> => {
  await api.delete(`/owner/colleges/${id}`);
};

export const assignPrincipal = async (collegeId: string, principalId: string): Promise<void> => {
  await api.post(`/owner/colleges/${collegeId}/assign-principal`, {
    principal_id: principalId,
  });
};
```

---

## TypeScript Types

### lib/types/college.ts

```typescript
export interface College {
  id: string;
  university_id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string | null;
  email: string;
  website: string | null;
  logo: string | null;
  established_year: number;
  student_capacity: number;
  principal_id: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  
  // Relationships
  principal?: {
    id: string;
    name: string;
    email: string;
    photo: string | null;
  };
  
  // Computed fields
  students_count?: number;
  faculty_count?: number;
  programs_count?: number;
  departments?: Department[];
}

export interface Department {
  id: string;
  college_id: string;
  name: string;
  code: string;
  status: 'active' | 'inactive';
}
```

### lib/types/faculty.ts

```typescript
export interface Faculty {
  id: string;
  user_id: string;
  university_id: string;
  college_id: string;
  department_id: string;
  designation: 'Professor' | 'Associate Professor' | 'Assistant Professor' | 'Lecturer' | 'Lab Assistant';
  qualification: string;
  specialization: string | null;
  experience_years: number;
  date_of_joining: string;
  employment_type: 'permanent' | 'contract' | 'visiting';
  salary: number;
  phone: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  
  // Relationships
  user: {
    id: string;
    name: string;
    email: string;
    photo: string | null;
  };
  college: {
    id: string;
    name: string;
    code: string;
  };
  department: {
    id: string;
    name: string;
    code: string;
  };
}
```

---

## Styling with Tailwind CSS

```tsx
// components/shared/StatCard.tsx
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p
              className={`text-sm mt-2 ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-full text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );
}
```

---

**Frontend Guide Complete! Next.js 16 structure with Zustand state management, TypeScript types, and university-scoped components.**
