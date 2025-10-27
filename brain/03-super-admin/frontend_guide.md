# Super Admin Portal - Frontend Implementation Guide

**Version**: 2.0  
**Framework**: Next.js 16 + React 19 + TypeScript 5.6  
**Port**: 3003  
**Last Updated**: October 25, 2025

---

## Project Structure

```
apps/super-admin/
├── app/
│   ├── layout.tsx                    # Root layout with sidebar
│   ├── page.tsx                      # Operations Dashboard (/)
│   ├── academic-calendar/
│   │   ├── page.tsx                 # Calendar management
│   │   ├── years/
│   │   │   └── page.tsx             # Academic years
│   │   ├── semesters/
│   │   │   └── page.tsx             # Semesters
│   │   └── holidays/
│   │       └── page.tsx             # Holidays
│   ├── courses/
│   │   ├── page.tsx                 # Courses list
│   │   ├── create/
│   │   │   └── page.tsx             # Create course
│   │   ├── [id]/
│   │   │   ├── page.tsx             # Course details
│   │   │   ├── edit/
│   │   │   │   └── page.tsx         # Edit course
│   │   │   └── assign-faculty/
│   │   │       └── page.tsx         # Assign faculty
│   │   └── curriculum/
│   │       └── page.tsx             # Curriculum mapping
│   ├── timetables/
│   │   ├── page.tsx                 # Timetables list
│   │   ├── generate/
│   │   │   └── page.tsx             # Generate timetable (AI)
│   │   ├── [id]/
│   │   │   ├── page.tsx             # View timetable
│   │   │   ├── edit/
│   │   │   │   └── page.tsx         # Manual editor
│   │   │   └── conflicts/
│   │   │       └── page.tsx         # Resolve conflicts
│   │   └── templates/
│   │       └── page.tsx             # Timetable templates
│   ├── exams/
│   │   ├── page.tsx                 # Exams list
│   │   ├── schedule/
│   │   │   └── page.tsx             # Schedule exam
│   │   ├── [id]/
│   │   │   ├── page.tsx             # Exam details
│   │   │   ├── halls/
│   │   │   │   └── page.tsx         # Hall allocation
│   │   │   ├── seating/
│   │   │   │   └── page.tsx         # Seating arrangement
│   │   │   ├── invigilators/
│   │   │   │   └── page.tsx         # Assign invigilators
│   │   │   └── admit-cards/
│   │   │       └── page.tsx         # Generate admit cards
│   │   └── calendar/
│   │       └── page.tsx             # Exam calendar view
│   ├── users/
│   │   ├── page.tsx                 # Users list
│   │   ├── create/
│   │   │   └── page.tsx             # Create user
│   │   ├── bulk-import/
│   │   │   └── page.tsx             # Bulk CSV import
│   │   └── [id]/
│   │       ├── page.tsx             # User profile
│   │       └── activity/
│   │           └── page.tsx         # Activity logs
│   ├── reports/
│   │   ├── page.tsx                 # Reports dashboard
│   │   ├── enrollment/
│   │   │   └── page.tsx             # Course enrollment
│   │   ├── workload/
│   │   │   └── page.tsx             # Faculty workload
│   │   ├── utilization/
│   │   │   └── page.tsx             # Room utilization
│   │   └── exam-stats/
│   │       └── page.tsx             # Exam statistics
│   ├── communication/
│   │   ├── page.tsx                 # Communication center
│   │   ├── announcements/
│   │   │   └── create/
│   │   │       └── page.tsx         # Create announcement
│   │   └── notifications/
│   │       └── page.tsx             # Notifications center
│   └── settings/
│       ├── page.tsx                 # Settings home
│       ├── university/
│       │   └── page.tsx             # University settings
│       ├── email-templates/
│       │   └── page.tsx             # Email templates
│       └── notifications/
│           └── page.tsx             # Notification preferences
├── components/
│   ├── dashboard/
│   │   ├── MetricCard.tsx
│   │   ├── PendingTasksWidget.tsx
│   │   ├── ActivityFeed.tsx
│   │   └── SystemHealthMonitor.tsx
│   ├── calendar/
│   │   ├── AcademicYearForm.tsx
│   │   ├── SemesterForm.tsx
│   │   └── HolidayPicker.tsx
│   ├── courses/
│   │   ├── CourseTable.tsx
│   │   ├── CourseForm.tsx
│   │   ├── FacultyAssignmentForm.tsx
│   │   └── PrerequisitesGraph.tsx
│   ├── timetable/
│   │   ├── TimetableGrid.tsx
│   │   ├── SlotEditor.tsx
│   │   ├── ConflictDetector.tsx
│   │   └── WorkloadChart.tsx
│   ├── exams/
│   │   ├── ExamScheduleForm.tsx
│   │   ├── HallAllocationTable.tsx
│   │   ├── SeatingGenerator.tsx
│   │   └── InvigilatorAssignment.tsx
│   ├── users/
│   │   ├── UserTable.tsx
│   │   ├── UserForm.tsx
│   │   ├── BulkImportWizard.tsx
│   │   └── ActivityLogTable.tsx
│   └── common/
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       ├── SearchBar.tsx
│       ├── FilterPanel.tsx
│       ├── DataTable.tsx
│       └── Modal.tsx
├── lib/
│   ├── api/
│   │   ├── dashboard.ts
│   │   ├── academic-calendar.ts
│   │   ├── courses.ts
│   │   ├── timetables.ts
│   │   ├── exams.ts
│   │   ├── users.ts
│   │   └── reports.ts
│   ├── stores/
│   │   ├── auth.ts                  # Zustand auth store
│   │   ├── courses.ts               # Courses state
│   │   ├── timetables.ts            # Timetables state
│   │   └── users.ts                 # Users state
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCourses.ts
│   │   ├── useTimetables.ts
│   │   ├── useExams.ts
│   │   └── usePermissions.ts
│   └── utils/
│       ├── api-client.ts            # Axios wrapper
│       ├── date-helpers.ts
│       ├── validation.ts
│       └── formatters.ts
└── types/
    ├── academic-calendar.ts
    ├── courses.ts
    ├── timetables.ts
    ├── exams.ts
    ├── users.ts
    └── reports.ts
```

---

## Core Components

### 1. Dashboard Page

```typescript
// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useDashboard } from '@/lib/hooks/useDashboard';
import MetricCard from '@/components/dashboard/MetricCard';
import PendingTasksWidget from '@/components/dashboard/PendingTasksWidget';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import SystemHealthMonitor from '@/components/dashboard/SystemHealthMonitor';

export default function DashboardPage() {
  const { data, loading, refresh } = useDashboard();

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Operations Dashboard</h1>

      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4">
        <MetricCard
          title="Courses"
          value={data.metrics.total_courses}
          icon="📚"
          trend="+12"
        />
        <MetricCard
          title="Users"
          value={data.metrics.total_users.toLocaleString()}
          icon="👥"
          trend="+245"
        />
        <MetricCard
          title="Pending Tasks"
          value={data.metrics.pending_tasks}
          icon="🎯"
          color="amber"
        />
        <MetricCard
          title="Upcoming Exams"
          value={data.metrics.upcoming_exams}
          icon="📝"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-2 gap-6">
        <PendingTasksWidget tasks={data.pending_tasks} />
        <ActivityFeed activities={data.recent_activity} />
      </div>

      {/* System Health */}
      <SystemHealthMonitor health={data.system_health} />
    </div>
  );
}
```

### 2. Course Management

```typescript
// app/courses/page.tsx
'use client';

import { useState } from 'react';
import { useCourses } from '@/lib/hooks/useCourses';
import CourseTable from '@/components/courses/CourseTable';
import FilterPanel from '@/components/common/FilterPanel';
import SearchBar from '@/components/common/SearchBar';
import Link from 'next/link';

export default function CoursesPage() {
  const [filters, setFilters] = useState({
    college_id: null,
    department_id: null,
    type: null,
    status: 'active',
  });
  const [search, setSearch] = useState('');

  const { courses, loading, pagination, refetch } = useCourses({
    ...filters,
    search,
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Course Management</h1>
        <Link
          href="/courses/create"
          className="btn btn-primary"
        >
          ➕ Add Course
        </Link>
      </div>

      <div className="flex gap-4 mb-6">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by code or name..."
        />
        <FilterPanel filters={filters} onChange={setFilters} />
      </div>

      <CourseTable
        courses={courses}
        loading={loading}
        pagination={pagination}
        onRefetch={refetch}
      />
    </div>
  );
}
```

```typescript
// components/courses/CourseForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const courseSchema = z.object({
  code: z.string().min(3).max(10),
  name: z.string().min(3).max(255),
  credits: z.number().min(1).max(6),
  type: z.enum(['theory', 'lab', 'practical', 'project']),
  description: z.string().optional(),
  college_id: z.number(),
  department_id: z.number(),
  prerequisites: z.array(z.number()).optional(),
  min_students: z.number().default(20),
  max_students: z.number().default(60),
  waitlist_size: z.number().default(10),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function CourseForm({ onSubmit, defaultValues }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Course Code *</label>
          <input
            {...register('code')}
            className="input"
            placeholder="CS101"
          />
          {errors.code && (
            <p className="text-red-500 text-sm">{errors.code.message}</p>
          )}
        </div>

        <div>
          <label className="label">Credits *</label>
          <select {...register('credits', { valueAsNumber: true })} className="select">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Course Name *</label>
        <input
          {...register('name')}
          className="input"
          placeholder="Introduction to Programming"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Type *</label>
          <select {...register('type')} className="select">
            <option value="theory">Theory</option>
            <option value="lab">Lab</option>
            <option value="practical">Practical</option>
            <option value="project">Project</option>
          </select>
        </div>

        <div>
          <label className="label">Department *</label>
          <select {...register('department_id', { valueAsNumber: true })} className="select">
            <option value="">Select Department</option>
            {/* Load departments from API */}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Description</label>
        <textarea
          {...register('description')}
          className="textarea"
          rows={4}
          placeholder="Course description..."
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="label">Min Students</label>
          <input
            {...register('min_students', { valueAsNumber: true })}
            type="number"
            className="input"
          />
        </div>
        <div>
          <label className="label">Max Students</label>
          <input
            {...register('max_students', { valueAsNumber: true })}
            type="number"
            className="input"
          />
        </div>
        <div>
          <label className="label">Waitlist Size</label>
          <input
            {...register('waitlist_size', { valueAsNumber: true })}
            type="number"
            className="input"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button type="button" className="btn btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          💾 Save Course
        </button>
      </div>
    </form>
  );
}
```

### 3. Timetable Generator

```typescript
// app/timetables/generate/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateTimetable } from '@/lib/api/timetables';
import toast from 'react-hot-toast';

export default function GenerateTimetablePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    college_id: '',
    semester_id: '',
    year: '',
    section: '',
    constraints: {
      avoid_faculty_conflicts: true,
      avoid_room_conflicts: true,
      respect_preferences: true,
      max_consecutive_hours: 4,
    },
  });

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateTimetable(formData);
      
      toast.success(
        `Timetable generated in ${result.generation_time_seconds}s with ${result.conflicts.length} conflicts`
      );
      
      router.push(`/timetables/${result.timetable_id}`);
    } catch (error) {
      toast.error('Failed to generate timetable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🤖 Generate Timetable</h1>

      <div className="card space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Step 1: Select Scope</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">College</label>
              <select
                className="select"
                value={formData.college_id}
                onChange={(e) =>
                  setFormData({ ...formData, college_id: e.target.value })
                }
              >
                <option value="">Select College</option>
                {/* Load colleges */}
              </select>
            </div>

            <div>
              <label className="label">Semester</label>
              <select
                className="select"
                value={formData.semester_id}
                onChange={(e) =>
                  setFormData({ ...formData, semester_id: e.target.value })
                }
              >
                <option value="">Select Semester</option>
                {/* Load semesters */}
              </select>
            </div>

            <div>
              <label className="label">Year</label>
              <select
                className="select"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
              >
                <option value="">Select Year</option>
                <option value="First Year">First Year</option>
                <option value="Second Year">Second Year</option>
                <option value="Third Year">Third Year</option>
                <option value="Fourth Year">Fourth Year</option>
              </select>
            </div>

            <div>
              <label className="label">Section</label>
              <input
                className="input"
                value={formData.section}
                onChange={(e) =>
                  setFormData({ ...formData, section: e.target.value })
                }
                placeholder="A"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Step 2: Constraints</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.constraints.avoid_faculty_conflicts}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    constraints: {
                      ...formData.constraints,
                      avoid_faculty_conflicts: e.target.checked,
                    },
                  })
                }
              />
              <span>Avoid faculty conflicts</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.constraints.avoid_room_conflicts}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    constraints: {
                      ...formData.constraints,
                      avoid_room_conflicts: e.target.checked,
                    },
                  })
                }
              />
              <span>Avoid room conflicts</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.constraints.respect_preferences}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    constraints: {
                      ...formData.constraints,
                      respect_preferences: e.target.checked,
                    },
                  })
                }
              />
              <span>Respect faculty preferences</span>
            </label>

            <div>
              <label className="label">Max Consecutive Hours</label>
              <input
                type="number"
                className="input w-32"
                value={formData.constraints.max_consecutive_hours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    constraints: {
                      ...formData.constraints,
                      max_consecutive_hours: parseInt(e.target.value),
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Step 3: Generate</h2>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="btn btn-primary btn-lg"
          >
            {loading ? '⏳ Generating...' : '🚀 Generate Timetable'}
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 4. Timetable Grid Component

```typescript
// components/timetable/TimetableGrid.tsx
import { Timetable, TimetableSlot } from '@/types/timetables';

interface Props {
  timetable: Timetable;
  editable?: boolean;
  onSlotClick?: (slot: TimetableSlot) => void;
}

export default function TimetableGrid({ timetable, editable, onSlotClick }: Props) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const getSlot = (day: string, time: string) => {
    return timetable.slots?.find(
      s => s.day.toLowerCase() === day.toLowerCase() && s.start_time === time
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-fixed border-collapse w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 w-24">Time</th>
            {days.map(day => (
              <th key={day} className="border p-2">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {timeSlots.map(time => (
            <tr key={time}>
              <td className="border p-2 text-center font-semibold bg-gray-50">
                {time}
              </td>
              {days.map(day => {
                const slot = getSlot(day, time);
                return (
                  <td
                    key={`${day}-${time}`}
                    className={`border p-2 ${editable ? 'cursor-pointer hover:bg-blue-50' : ''} ${
                      slot?.has_conflict ? 'bg-red-100' : ''
                    }`}
                    onClick={() => editable && slot && onSlotClick?.(slot)}
                  >
                    {slot ? (
                      <div className="text-sm">
                        <div className="font-semibold">{slot.course?.code}</div>
                        <div className="text-gray-600">{slot.faculty?.name}</div>
                        <div className="text-gray-500 text-xs">Room {slot.room?.name}</div>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-center">—</div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## State Management (Zustand)

```typescript
// lib/stores/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  university_id: number;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  can: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,

      setAuth: (user, token) => set({ user, accessToken: token }),

      logout: () => {
        set({ user: null, accessToken: null });
        window.location.href = '/login';
      },

      can: (permission) => {
        const { user } = get();
        return user?.permissions?.includes(permission) || false;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }), // Don't persist token
    }
  )
);
```

```typescript
// lib/stores/courses.ts
import { create } from 'zustand';
import { Course } from '@/types/courses';

interface CoursesState {
  courses: Course[];
  loading: boolean;
  filters: any;
  setCourses: (courses: Course[]) => void;
  setLoading: (loading: boolean) => void;
  setFilters: (filters: any) => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: number, data: Partial<Course>) => void;
  removeCourse: (id: number) => void;
}

export const useCoursesStore = create<CoursesState>((set) => ({
  courses: [],
  loading: false,
  filters: {},

  setCourses: (courses) => set({ courses }),
  setLoading: (loading) => set({ loading }),
  setFilters: (filters) => set({ filters }),
  
  addCourse: (course) =>
    set((state) => ({ courses: [...state.courses, course] })),
  
  updateCourse: (id, data) =>
    set((state) => ({
      courses: state.courses.map((c) =>
        c.id === id ? { ...c, ...data } : c
      ),
    })),
  
  removeCourse: (id) =>
    set((state) => ({
      courses: state.courses.filter((c) => c.id !== id),
    })),
}));
```

---

## API Client

```typescript
// lib/utils/api-client.ts
import axios from 'axios';
import { useAuthStore } from '@/lib/stores/auth';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/super-admin',
  timeout: 30000,
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  const universityId = useAuthStore.getState().user?.university_id;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (universityId) {
    config.headers['X-University-ID'] = universityId;
  }

  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## Custom Hooks

```typescript
// lib/hooks/useCourses.ts
import { useEffect } from 'react';
import { useCoursesStore } from '@/lib/stores/courses';
import { fetchCourses } from '@/lib/api/courses';

export function useCourses(filters = {}) {
  const { courses, loading, setLoading, setCourses, setFilters } = useCoursesStore();

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const data = await fetchCourses(filters);
        setCourses(data.data);
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
    setFilters(filters);
  }, [JSON.stringify(filters)]);

  const refetch = () => {
    // Trigger reload
  };

  return { courses, loading, refetch, pagination: {} };
}
```

---

## TypeScript Types

```typescript
// types/courses.ts
export interface Course {
  id: number;
  university_id: number;
  college_id: number;
  department_id: number;
  code: string;
  name: string;
  credits: number;
  type: 'theory' | 'lab' | 'practical' | 'project';
  description?: string;
  prerequisites?: Course[];
  min_students: number;
  max_students: number;
  waitlist_size: number;
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface CreateCourseDto {
  code: string;
  name: string;
  credits: number;
  type: string;
  college_id: number;
  department_id: number;
  description?: string;
  prerequisites?: number[];
}
```

---

**Frontend Implementation Complete!**
