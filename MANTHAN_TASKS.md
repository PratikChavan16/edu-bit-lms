# 👨‍💻 MANTHAN'S WORK PLAN
**Developer:** Manthan  
**Role:** Admin & CRUD Specialist  
**Experience Level:** Beginner  
**Project:** EduBit LMS - Bitflow Nova  
**Timeline:** 8 weeks  
**Start Date:** October 10, 2025

---

## 🎯 YOUR ROLE

You are building the **Admin Portals** and **Faculty Portal** - the management interfaces that power the entire system!

**Why These Portals?**
- ✅ Clear CRUD patterns (Create, Read, Update, Delete)
- ✅ Repetitive structure (learn once, repeat 20 times!)
- ✅ Data management (forms, tables, filters)
- ✅ Backend-heavy (less complex UI, more logic)
- ✅ Foundation for the system

**What You'll Learn:**
- React basics (components, hooks, state)
- CRUD operations (Create, Read, Update, Delete)
- Forms (React Hook Form + Zod validation)
- Tables (DataTable with sort, filter, pagination)
- API integration (Axios + React Query)
- File uploads/downloads
- Bulk operations

---

## 📊 YOUR WORKLOAD

**Total Work:** 24 pages

**Breakdown:**
- Super Admin Portal: 9 pages
- College Admin Portal: 8 pages
- Faculty Portal: 7 pages

**Complexity:**
- 🟢 Simple (CRUD): 18 pages
- 🟡 Medium: 6 pages

**Timeline:** 8 weeks (3 pages per week average)

---

## 🎓 THE CRUD PATTERN (YOUR SUPERPOWER!)

You'll use this pattern **20+ times**. Master it early!

### **The 4 Operations:**

1. **Create** - Add new record (POST)
2. **Read** - View records (GET)
3. **Update** - Edit record (PUT)
4. **Delete** - Remove record (DELETE)

### **The Standard Flow:**

```
List Page → Create Page → Edit Page
    ↓
  Delete Action
```

**Example: Universities**
```
1. List Universities (Table with search/filter)
2. Click "Add" → Create University Form
3. Click "Edit" → Edit University Form (pre-filled)
4. Click "Delete" → Confirm → Delete
```

You'll repeat this for:
- Universities, Colleges, Students, Faculty, Departments, etc.

**Once you master this, you'll fly through pages!** 🚀

---

## 🗓️ YOUR 8-WEEK PLAN

---

## 📅 WEEK 1: LEARNING & SETUP

**Priority:** ⭐⭐⭐ CRITICAL  
**Focus:** Get ready to code!

### **What to Do:**

#### 1. Setup Development Environment (Day 1-2)

```bash
# 1. Check Node.js version (should be 18+)
node --version

# 2. Install pnpm
npm install -g pnpm

# 3. Navigate to project
cd /home/envisage/Downloads/BitFlow_LMS/edu-bit-lms

# 4. Install dependencies
pnpm install

# 5. Create .env file for admin portal
cd apps/admin
cp .env.example .env
nano .env

# Add this:
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3001

# 6. Start development server
pnpm dev

# Should open http://localhost:3001
```

**Setup Checklist:**
- [ ] Node.js installed (v18+)
- [ ] pnpm installed
- [ ] VS Code installed with extensions:
  - [ ] ESLint
  - [ ] Prettier
  - [ ] Tailwind CSS IntelliSense
  - [ ] TypeScript
- [ ] Project running on http://localhost:3001

---

#### 2. Learn the Basics (Day 2-3)

**Focus on these:**

**React Basics (2 hours):**
- [ ] Components, Props, State
- [ ] useState, useEffect
- [ ] Event handling
- [ ] Forms

**React Hook Form (1 hour):**
- [ ] https://react-hook-form.com/get-started
- [ ] Basic form
- [ ] Validation with Zod

**Tables (1 hour):**
- [ ] How to display data in tables
- [ ] Sorting, filtering, pagination

**Don't spend more than 1 day reading!** Learn by doing.

---

#### 3. Pair Programming with Ameya (Day 4-5)

**What You'll Learn:**
- Watch Ameya build DataTable component
- Learn how to use DataTable for all your pages
- Build your first CRUD together

**Take Notes On:**
- [ ] DataTable props (columns, data, sorting, pagination)
- [ ] Form structure (register, handleSubmit, errors)
- [ ] API calls (GET, POST, PUT, DELETE)
- [ ] Where to put files

---

## 📅 WEEK 2: YOUR FIRST CRUD 🎉

**Priority:** ⭐⭐⭐ CRITICAL  
**Focus:** Master the CRUD pattern

---

### **PAGE 1: Super Admin Dashboard (Day 1)**

**Location:** `/apps/admin/src/app/dashboard/page.tsx`

**Priority:** ⭐⭐⭐ CRITICAL  
**Complexity:** 🟢 Simple  
**Time:** 1-2 days

**What to Build:**
Dashboard with system-wide statistics.

**UI Design:**
```
+----------------------------------------------------------+
| Super Admin Dashboard                                     |
+----------------------------------------------------------+
|                                                           |
| +-------------+ +-------------+ +-------------+           |
| | Universities| | Colleges    | | Students    |           |
| | 25          | | 450         | | 12,500      |           |
| | +15% ↑      | | +8% ↑       | | +5% ↑       |           |
| +-------------+ +-------------+ +-------------+           |
|                                                           |
| +-------------+ +-------------+ +-------------+           |
| | Faculty     | | Revenue     | | Active Users|           |
| | 2,500       | | ₹12.5 Cr    | | 10,234      |           |
| | +12% ↑      | | +20% ↑      | | +3% ↑       |           |
| +-------------+ +-------------+ +-------------+           |
|                                                           |
| +-------------------------+ +-------------------------+  |
| | Revenue Trends          | | Enrollment Trends       |  |
| | [Bar Chart]             | | [Line Chart]            |  |
| +-------------------------+ +-------------------------+  |
+----------------------------------------------------------+
```

**Code Template:**

```typescript
// File: /apps/admin/src/app/dashboard/page.tsx

'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, Badge } from '@edu-bit/ui';
import { BarChart, LineChart } from '@edu-bit/ui/charts';
import axios from 'axios';

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['super-admin-stats'],
    queryFn: async () => {
      const response = await axios.get('/api/super-admin/stats');
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Super Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <p className="text-gray-600 text-sm">Universities</p>
          <p className="text-3xl font-bold">{stats.total_universities}</p>
          <Badge variant="success">+{stats.universities_growth}%</Badge>
        </Card>

        <Card>
          <p className="text-gray-600 text-sm">Colleges</p>
          <p className="text-3xl font-bold">{stats.total_colleges}</p>
          <Badge variant="success">+{stats.colleges_growth}%</Badge>
        </Card>

        <Card>
          <p className="text-gray-600 text-sm">Students</p>
          <p className="text-3xl font-bold">{stats.total_students}</p>
          <Badge variant="success">+{stats.students_growth}%</Badge>
        </Card>

        <Card>
          <p className="text-gray-600 text-sm">Faculty</p>
          <p className="text-3xl font-bold">{stats.total_faculty}</p>
          <Badge variant="success">+{stats.faculty_growth}%</Badge>
        </Card>

        <Card>
          <p className="text-gray-600 text-sm">Revenue</p>
          <p className="text-3xl font-bold">₹{stats.total_revenue} Cr</p>
          <Badge variant="success">+{stats.revenue_growth}%</Badge>
        </Card>

        <Card>
          <p className="text-gray-600 text-sm">Active Users</p>
          <p className="text-3xl font-bold">{stats.active_users}</p>
          <Badge variant="success">+{stats.users_growth}%</Badge>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4">Revenue Trends</h2>
          <BarChart
            data={stats.revenue_data}
            xKey="month"
            yKeys={['revenue']}
            height={300}
          />
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Enrollment Trends</h2>
          <LineChart
            data={stats.enrollment_data}
            xKey="month"
            yKeys={['students']}
            height={300}
          />
        </Card>
      </div>
    </div>
  );
}
```

**What You're Learning:**
- ✅ Grid layouts
- ✅ Stats cards
- ✅ Charts (Bar, Line)
- ✅ React Query for data fetching

---

### **PAGE 2-4: Universities CRUD (Day 2-4)**

This is your **MASTER PATTERN**. Learn this well!

---

#### **PAGE 2: Universities List (Day 2)**

**Location:** `/apps/admin/src/app/universities/page.tsx`

**Priority:** ⭐⭐⭐ CRITICAL  
**Complexity:** 🟢 Simple  
**Time:** 1 day

**What to Build:**
Table of all universities with search, sort, and actions.

**UI Design:**
```
+----------------------------------------------------------+
| Universities                                [+ Add New]   |
+----------------------------------------------------------+
| [Search: _________________] [🔍 Search]                  |
+----------------------------------------------------------+
| ID | Name           | Code  | Location  | Actions       |
|----|----------------|-------|-----------|---------------|
| 1  | Mumbai Univ    | MU    | Mumbai    | [Edit][Delete]|
| 2  | Pune Univ      | PU    | Pune      | [Edit][Delete]|
| 3  | Delhi Univ     | DU    | Delhi     | [Edit][Delete]|
+----------------------------------------------------------+
| [← Previous]  Page 1 of 5  [Next →]                      |
+----------------------------------------------------------+
```

**Code Template:**

```typescript
// File: /apps/admin/src/app/universities/page.tsx

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { DataTable, Button, Input, Modal } from '@edu-bit/ui';
import axios from 'axios';

export default function UniversitiesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Fetch universities
  const { data, isLoading } = useQuery({
    queryKey: ['universities', search, page],
    queryFn: async () => {
      const response = await axios.get('/api/universities', {
        params: { search, page },
      });
      return response.data;
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => axios.delete(`/api/universities/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['universities'] });
      setDeleteId(null);
    },
  });

  // Table columns
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'code', label: 'Code' },
    { key: 'location', label: 'Location' },
    {
      key: 'actions',
      label: 'Actions',
      render: (value: any, row: any) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => router.push(`/universities/${row.id}/edit`)}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => setDeleteId(row.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Universities</h1>
        <Button onClick={() => router.push('/universities/create')}>
          + Add New
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search universities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button>Search</Button>
      </div>

      {/* Table */}
      <DataTable
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading}
        pagination={{
          currentPage: page,
          totalPages: data?.total_pages || 1,
          onPageChange: setPage,
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Confirm Delete"
      >
        <p>Are you sure you want to delete this university?</p>
        <div className="flex gap-2 mt-4">
          <Button
            variant="danger"
            onClick={() => deleteMutation.mutate(deleteId!)}
            isLoading={deleteMutation.isPending}
          >
            Delete
          </Button>
          <Button variant="ghost" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
```

**What You're Learning:**
- ✅ Using DataTable component
- ✅ Search functionality
- ✅ Pagination
- ✅ Delete with confirmation
- ✅ useMutation for POST/PUT/DELETE

**Testing:**
- [ ] Table displays data
- [ ] Search works
- [ ] Edit button navigates
- [ ] Delete shows confirmation
- [ ] Delete removes record

---

#### **PAGE 3: Create University (Day 3)**

**Location:** `/apps/admin/src/app/universities/create/page.tsx`

**Priority:** ⭐⭐⭐ CRITICAL  
**Complexity:** 🟢 Simple  
**Time:** 1 day

**What to Build:**
Form to add new university.

**UI Design:**
```
+----------------------------------------------------------+
| Create University                                         |
+----------------------------------------------------------+
|                                                           |
| Name: *                                                   |
| [_____________________________]                           |
|                                                           |
| Code: *                                                   |
| [_____________________________]                           |
|                                                           |
| Location: *                                               |
| [_____________________________]                           |
|                                                           |
| Status:                                                   |
| [Active ▼]                                                |
|                                                           |
| [Cancel] [Create University]                              |
+----------------------------------------------------------+
```

**Code Template:**

```typescript
// File: /apps/admin/src/app/universities/create/page.tsx

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button, Input, Select, Alert } from '@edu-bit/ui';
import axios from 'axios';

// Validation schema
const universitySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  code: z.string().min(2, 'Code must be at least 2 characters'),
  location: z.string().min(2, 'Location is required'),
  status: z.enum(['active', 'inactive']),
});

type UniversityForm = z.infer<typeof universitySchema>;

export default function CreateUniversityPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UniversityForm>({
    resolver: zodResolver(universitySchema),
    defaultValues: {
      status: 'active',
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: UniversityForm) =>
      axios.post('/api/universities', data),
    onSuccess: () => {
      router.push('/universities');
    },
  });

  const onSubmit = (data: UniversityForm) => {
    createMutation.mutate(data);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create University</h1>

      {createMutation.isError && (
        <Alert variant="error" className="mb-4">
          Failed to create university. Please try again.
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Name"
          {...register('name')}
          error={errors.name?.message}
          required
        />

        <Input
          label="Code"
          {...register('code')}
          error={errors.code?.message}
          required
        />

        <Input
          label="Location"
          {...register('location')}
          error={errors.location?.message}
          required
        />

        <Select label="Status" {...register('status')}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/universities')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={createMutation.isPending}
          >
            Create University
          </Button>
        </div>
      </form>
    </div>
  );
}
```

**What You're Learning:**
- ✅ React Hook Form
- ✅ Zod validation
- ✅ Form submission
- ✅ Error handling
- ✅ POST request

---

#### **PAGE 4: Edit University (Day 3)**

**Location:** `/apps/admin/src/app/universities/[id]/edit/page.tsx`

**Complexity:** 🟢 Simple  
**Time:** 0.5 day

**What to Build:**
Same as create form, but pre-filled with existing data.

**Code Template:**

```typescript
// File: /apps/admin/src/app/universities/[id]/edit/page.tsx

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useRouter, useParams } from 'next/navigation';
import { Button, Input, Select, Alert } from '@edu-bit/ui';
import axios from 'axios';

const universitySchema = z.object({
  name: z.string().min(3),
  code: z.string().min(2),
  location: z.string().min(2),
  status: z.enum(['active', 'inactive']),
});

type UniversityForm = z.infer<typeof universitySchema>;

export default function EditUniversityPage() {
  const router = useRouter();
  const params = useParams();
  const universityId = params.id as string;

  // Fetch existing university
  const { data: university, isLoading } = useQuery({
    queryKey: ['university', universityId],
    queryFn: async () => {
      const response = await axios.get(`/api/universities/${universityId}`);
      return response.data;
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm<UniversityForm>({
    resolver: zodResolver(universitySchema),
    values: university, // Pre-fill form
  });

  const updateMutation = useMutation({
    mutationFn: (data: UniversityForm) =>
      axios.put(`/api/universities/${universityId}`, data),
    onSuccess: () => {
      router.push('/universities');
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit University</h1>

      <form onSubmit={handleSubmit((data) => updateMutation.mutate(data))}>
        <Input label="Name" {...register('name')} error={errors.name?.message} required />
        <Input label="Code" {...register('code')} error={errors.code?.message} required />
        <Input label="Location" {...register('location')} error={errors.location?.message} required />
        <Select label="Status" {...register('status')}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>

        <div className="flex gap-2 mt-4">
          <Button type="button" variant="ghost" onClick={() => router.push('/universities')}>
            Cancel
          </Button>
          <Button type="submit" isLoading={updateMutation.isPending}>
            Update University
          </Button>
        </div>
      </form>
    </div>
  );
}
```

**What You're Learning:**
- ✅ Pre-filling forms
- ✅ PUT request
- ✅ URL parameters (id)

---

## 🎉 CONGRATULATIONS!

**You just learned the CRUD pattern!**

Now you can repeat this for:
- ✅ Colleges (same pattern)
- ✅ Students (same pattern, bigger form)
- ✅ Faculty (same pattern)
- ✅ Departments (same pattern)

**Speed Tip:**
Copy your Universities code, change the names:
- `universities` → `colleges`
- `University` → `College`
- Update fields

You'll build 20+ pages in no time! 🚀

---

## 📅 REMAINING WEEKS (QUICK OVERVIEW)

**Week 3-4:** Colleges, Feature Toggles, Audit Log, Backups
**Week 5-6:** Billing, College Admin Dashboard, Students CRUD
**Week 7:** Faculty CRUD, Departments, Documents
**Week 8:** Faculty Portal (7 pages - reuse patterns)

---

## 💡 YOUR SUPERPOWERS

**1. Pattern Recognition**
You'll notice:
- All list pages look similar
- All create forms look similar
- All edit forms look similar

**Copy-paste is okay!** Just change the details.

**2. DataTable Mastery**
Ameya's DataTable handles:
- Sorting
- Filtering
- Pagination

You just pass data and columns!

**3. Form Mastery**
React Hook Form + Zod:
- Validation automatic
- Error messages automatic
- Just define schema!

---

## 🎯 YOUR SUCCESS CHECKLIST

**Week 2:**
- [ ] Dashboard complete
- [ ] Universities CRUD complete
- [ ] Understand CRUD pattern

**Week 4:**
- [ ] 9 Super Admin pages complete
- [ ] Can build CRUD in 1 day

**Week 6:**
- [ ] 17 pages complete
- [ ] Comfortable with large forms

**Week 8:**
- [ ] All 24 pages complete!
- [ ] CRUD master!
- [ ] Ready for next project

---

## 📞 WHEN TO ASK FOR HELP

**Ask Ameya if:**
- DataTable not working
- Form validation confusing
- API errors
- Stuck for 30+ minutes

**Ask Gauri if:**
- Want to pair program
- Need motivation
- Compare approaches

---

## 🎉 YOU GOT THIS!

**Remember:**
- Repetition is your friend
- Each page gets easier
- You're building the backbone of the system
- Admins will manage everything through your pages!

**Your Impact:**
- Admins can manage 500+ colleges
- Track 10,000+ students
- Control entire system

**Have fun building! 🚀**

---

**Document Version:** 1.0  
**Created:** October 10, 2025  
**Branch:** `frontend`  
**Your Status:** READY TO MASTER CRUD! 💪
