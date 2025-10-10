# 👩‍💻 GAURI'S WORK PLAN
**Developer:** Gauri  
**Role:** User Experience Developer (Student & Parent Portals)  
**Experience Level:** Beginner  
**Project:** EduBit LMS - Bitflow Nova  
**Timeline:** 8 weeks  
**Start Date:** October 10, 2025

---

## 🎯 YOUR ROLE

You are building the **Student Portal** and **Parent Portal** - the interfaces that students and parents will use every day!

**Why These Portals?**
- ✅ User-facing (make it beautiful!)
- ✅ Simpler logic (perfect for learning)
- ✅ Visual elements (graphs, charts, dashboards)
- ✅ Direct impact (students will love your work!)

**What You'll Learn:**
- React basics (components, hooks, state)
- Forms (React Hook Form + Zod validation)
- API integration (Axios + React Query)
- Data visualization (Recharts)
- File uploads/downloads
- Responsive design (Tailwind CSS)
- Payment integration (Razorpay)

---

## 📊 YOUR WORKLOAD

**Total Work:** 16 pages

**Breakdown:**
- Student Portal: 10 pages
- Parent Portal: 6 pages

**Complexity:**
- 🟢 Simple: 8 pages (Login, Library, Timetable, etc.)
- 🟡 Medium: 8 pages (Dashboard, Assessments, Fees, etc.)

**Timeline:** 8 weeks (2 pages per week average)

---

## 🗓️ YOUR 8-WEEK PLAN

---

## 📅 WEEK 1: LEARNING & SETUP

**Priority:** ⭐⭐⭐ CRITICAL  
**Focus:** Get ready to code!

### **What to Do:**

#### 1. Setup Development Environment (Day 1-2)
**Follow these steps:**

```bash
# 1. Check Node.js version (should be 18+)
node --version

# 2. Install pnpm (package manager)
npm install -g pnpm

# 3. Navigate to project
cd /home/envisage/Downloads/BitFlow_LMS/edu-bit-lms

# 4. Install dependencies
pnpm install

# 5. Create .env file for student portal
cd apps/learner
cp .env.example .env

# 6. Edit .env file
nano .env

# Add this:
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 7. Start development server
pnpm dev

# Should open http://localhost:3000
```

**Setup Checklist:**
- [ ] Node.js installed (v18+)
- [ ] pnpm installed
- [ ] VS Code installed with extensions:
  - [ ] ESLint
  - [ ] Prettier
  - [ ] Tailwind CSS IntelliSense
  - [ ] TypeScript
- [ ] Project dependencies installed
- [ ] Dev server runs without errors
- [ ] Can access http://localhost:3000

---

#### 2. Learn the Basics (Day 2-3)

**Watch/Read These (Pick what helps you learn best):**

**React Basics (2-3 hours):**
- [ ] React Official Docs: https://react.dev/learn
  - Components
  - Props
  - State (useState)
  - Effects (useEffect)
  - Events

**Next.js App Router (1 hour):**
- [ ] Next.js Docs: https://nextjs.org/docs/app
  - File-based routing
  - `page.tsx` files
  - Layouts
  - Navigation

**TypeScript Basics (1 hour):**
- [ ] TypeScript in 5 minutes: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
  - Types and interfaces
  - Function types
  - Optional properties

**Tailwind CSS (30 min):**
- [ ] Tailwind Docs: https://tailwindcss.com/docs
  - Utility classes
  - Flexbox
  - Grid
  - Responsive design

**Don't spend more than 1 day reading!** You'll learn better by building.

---

#### 3. Pair Programming with Ameya (Day 4-5)

**What You'll Do Together:**
- Watch Ameya build authentication system
- Ask questions about:
  - How components work
  - How to use hooks
  - How to call APIs
  - Project structure

**Take Notes On:**
- [ ] Where files go (folder structure)
- [ ] How to import components
- [ ] How to use Ameya's components (Button, Input, Card, etc.)
- [ ] How to make API calls

**Your First Pair Session:**
Ameya will help you build your first simple page together!

---

## 📅 WEEK 2: YOUR FIRST PAGES 🎉

**Priority:** ⭐⭐⭐ CRITICAL  
**Focus:** Build confidence with simple pages

---

### **PAGE 1: Student Login (Day 1)**

**Location:** `/apps/learner/src/app/login/page.tsx`

**Priority:** ⭐⭐⭐ CRITICAL  
**Complexity:** 🟢 Simple  
**Time:** 1 day

**What to Build:**
A simple login form for students.

**UI Design:**
```
+--------------------------------+
|                                |
|     [EduBit Logo]              |
|                                |
|     Student Login              |
|                                |
|     Email:                     |
|     [_________________]        |
|                                |
|     Password:                  |
|     [_________________] [👁]   |
|                                |
|     [✓] Remember me            |
|                                |
|     [      Login      ]        |
|                                |
|     Forgot password?           |
|                                |
+--------------------------------+
```

**Step-by-Step Instructions:**

```typescript
// File: /apps/learner/src/app/login/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input, Checkbox, Alert } from '@edu-bit/ui';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password, portal: 'student' });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">EduBit</h1>
          <p className="text-gray-600 mt-2">Student Portal</p>
        </div>

        {/* Error Message */}
        {error && <Alert variant="error" className="mb-4">{error}</Alert>}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@example.com"
            required
            className="mb-4"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="mb-4"
          />

          <Checkbox
            label="Remember me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="mb-6"
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={isLoading}
          >
            Login
          </Button>
        </form>

        {/* Forgot Password Link */}
        <div className="text-center mt-4">
          <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}
```

**What You're Learning:**
- ✅ Using useState for form data
- ✅ Handling form submission
- ✅ Using Ameya's components (Button, Input, Alert)
- ✅ Error handling
- ✅ Loading states
- ✅ Tailwind CSS classes

**Testing:**
- [ ] Form submits correctly
- [ ] Error shows if wrong credentials
- [ ] Loading spinner shows during login
- [ ] Redirects to dashboard after login
- [ ] Looks good on mobile

**Ask Ameya if:**
- Component imports not working
- Login API not working
- Redirects not working

---

### **PAGE 2: Student Dashboard (Day 2-3)**

**Location:** `/apps/learner/src/app/dashboard/page.tsx`

**Priority:** ⭐⭐⭐ CRITICAL  
**Complexity:** 🟡 Medium  
**Time:** 2-3 days

**What to Build:**
A dashboard showing student's overview - attendance, fees, timetable, announcements.

**UI Design:**
```
+----------------------------------------------------------+
| EduBit Student Portal                      [Profile ▼]   |
+----------------------------------------------------------+
| Welcome back, John Doe! 👋                               |
+----------------------------------------------------------+
|                                                           |
| +----------------------+  +---------------------------+  |
| | Attendance           |  | Fee Status                |  |
| |                      |  |                           |  |
| | [Line Graph]         |  | Total: ₹50,000            |  |
| |                      |  | Paid: ₹30,000             |  |
| | 92% This Month       |  | Due: ₹20,000              |  |
| +----------------------+  | [Pay Now]                 |  |
|                           +---------------------------+  |
| +----------------------+  +---------------------------+  |
| | Today's Classes      |  | Recent Announcements      |  |
| |                      |  |                           |  |
| | 09:00 - Math         |  | • Mid-term exams next... |  |
| | 10:00 - Physics      |  | • Library closed on...    |  |
| | 11:00 - Chemistry    |  | • Sports day announced   |  |
| +----------------------+  +---------------------------+  |
|                                                           |
| +---------------------------------------------------+    |
| | Quick Actions                                      |    |
| | [View Library] [Take Assessment] [View Timetable]  |    |
| +---------------------------------------------------+    |
+----------------------------------------------------------+
```

**Step-by-Step Instructions:**

```typescript
// File: /apps/learner/src/app/dashboard/page.tsx

'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, Badge, Button } from '@edu-bit/ui';
import { LineChart } from '@edu-bit/ui/charts';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';

export default function DashboardPage() {
  const { user } = useAuth();

  // Fetch dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await axios.get('/api/students/me/dashboard');
      return response.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      {/* Welcome Message */}
      <h1 className="text-3xl font-bold mb-6">
        Welcome back, {user?.name}! 👋
      </h1>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Attendance Card */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Attendance</h2>
          <LineChart
            data={dashboardData.attendance_data}
            xKey="month"
            yKeys={['percentage']}
            height={200}
          />
          <p className="text-2xl font-bold text-center mt-4">
            {dashboardData.attendance_percentage}% This Month
          </p>
        </Card>

        {/* Fee Status Card */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Fee Status</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Fees:</span>
              <span className="font-semibold">₹{dashboardData.total_fees}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Paid:</span>
              <span className="font-semibold text-green-600">₹{dashboardData.paid_fees}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Due:</span>
              <span className="font-semibold text-red-600">₹{dashboardData.due_fees}</span>
            </div>
            {dashboardData.due_fees > 0 && (
              <Button variant="primary" className="w-full mt-4">
                Pay Now
              </Button>
            )}
          </div>
        </Card>

        {/* Today's Classes */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Today's Classes</h2>
          <div className="space-y-3">
            {dashboardData.today_classes.map((cls: any) => (
              <div key={cls.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-semibold">{cls.subject}</p>
                  <p className="text-sm text-gray-600">{cls.teacher}</p>
                </div>
                <Badge>{cls.time}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Announcements */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Recent Announcements</h2>
          <div className="space-y-3">
            {dashboardData.announcements.slice(0, 5).map((announcement: any) => (
              <div key={announcement.id} className="border-b pb-2">
                <p className="text-sm">{announcement.title}</p>
                <p className="text-xs text-gray-500">{announcement.date}</p>
              </div>
            ))}
          </div>
          <Button variant="ghost" className="w-full mt-4">
            View All
          </Button>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Button variant="primary">View Library</Button>
          <Button variant="primary">Take Assessment</Button>
          <Button variant="primary">View Timetable</Button>
        </div>
      </Card>
    </div>
  );
}
```

**What You're Learning:**
- ✅ Using React Query for API calls
- ✅ Grid layouts with Tailwind
- ✅ Using Chart components
- ✅ Mapping arrays to display lists
- ✅ Responsive design (mobile-first)

**Testing:**
- [ ] Dashboard loads data
- [ ] Charts display correctly
- [ ] Responsive on mobile
- [ ] Quick actions work

**Ask Ameya if:**
- React Query not working
- Charts not displaying
- Layout breaks on mobile

---

## 📅 WEEK 3: BUILDING MOMENTUM

**Focus:** Practice what you learned, build 2 more pages

---

### **PAGE 3: Student Library (Day 1-2)**

**Location:** `/apps/learner/src/app/library/page.tsx`

**Priority:** ⭐⭐ High  
**Complexity:** 🟢 Simple  
**Time:** 1-2 days

**What to Build:**
A page showing educational resources students can view/download.

**UI Design:**
```
+----------------------------------------------------------+
| Library                                                   |
+----------------------------------------------------------+
| [Search: _________________] [Filter: All ▼] [🔍 Search]  |
+----------------------------------------------------------+
|                                                           |
| +----------------------+  +----------------------+        |
| | 📄 Mathematics Notes |  | 📄 Physics Lab Manual|       |
| | Subject: Math        |  | Subject: Physics     |       |
| | Added: 2 days ago    |  | Added: 1 week ago    |       |
| | [Download] [⭐]       |  | [Download] [⭐]       |       |
| +----------------------+  +----------------------+        |
|                                                           |
| +----------------------+  +----------------------+        |
| | 📹 Chemistry Video   |  | 📄 English Grammar   |       |
| | Subject: Chemistry   |  | Subject: English     |       |
| | Added: 3 days ago    |  | Added: 2 weeks ago   |       |
| | [View] [⭐]          |  | [Download] [⭐]       |       |
| +----------------------+  +----------------------+        |
|                                                           |
| [← Previous]  Page 1 of 10  [Next →]                     |
+----------------------------------------------------------+
```

**Code Template:**

```typescript
// File: /apps/learner/src/app/library/page.tsx

'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Input, Select, Button, Badge } from '@edu-bit/ui';
import axios from 'axios';

export default function LibraryPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['library', search, filter, page],
    queryFn: async () => {
      const response = await axios.get('/api/library/resources', {
        params: { search, category: filter, page },
      });
      return response.data;
    },
  });

  const handleBookmark = async (resourceId: number) => {
    await axios.post(`/api/library/resources/${resourceId}/bookmark`);
    // Refresh data
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Library</h1>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-6">
        <Input
          placeholder="Search resources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="notes">Notes</option>
          <option value="videos">Videos</option>
          <option value="assignments">Assignments</option>
        </Select>
        <Button>Search</Button>
      </div>

      {/* Resources Grid */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.resources.map((resource: any) => (
              <Card key={resource.id}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{resource.title}</h3>
                  <button onClick={() => handleBookmark(resource.id)}>
                    {resource.is_bookmarked ? '⭐' : '☆'}
                  </button>
                </div>
                <Badge>{resource.category}</Badge>
                <p className="text-sm text-gray-600 mt-2">
                  Subject: {resource.subject}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Added: {resource.created_at}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="primary">
                    {resource.type === 'video' ? 'View' : 'Download'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-6">
            <Button
              variant="ghost"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              ← Previous
            </Button>
            <span>Page {page} of {data.total_pages}</span>
            <Button
              variant="ghost"
              disabled={page === data.total_pages}
              onClick={() => setPage(page + 1)}
            >
              Next →
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
```

**What You're Learning:**
- ✅ Search and filter functionality
- ✅ Pagination
- ✅ Grid layouts
- ✅ Conditional rendering
- ✅ Button actions (bookmark, download)

**Testing:**
- [ ] Search works
- [ ] Filter works
- [ ] Pagination works
- [ ] Bookmark toggles
- [ ] Download works

---

### **PAGE 4: Student Timetable (Day 3-4)**

**Location:** `/apps/learner/src/app/timetable/page.tsx`

**Priority:** ⭐⭐ High  
**Complexity:** 🟢 Simple  
**Time:** 1-2 days

**What to Build:**
Weekly timetable showing all classes.

**UI Design:**
```
+----------------------------------------------------------+
| My Timetable                                Week 42, 2025 |
+----------------------------------------------------------+
|         | Mon     | Tue     | Wed     | Thu     | Fri    |
|---------|---------|---------|---------|---------|--------|
| 09-10   | Math    | English | Physics | Math    | CS     |
|         | Room 101| Room 102| Lab 1   | Room 101| Lab 2  |
|         | Mr. A   | Ms. B   | Mr. C   | Mr. A   | Ms. D  |
|---------|---------|---------|---------|---------|--------|
| 10-11   | Physics | Math    | Chem    | English | Free   |
|         | Lab 1   | Room 101| Lab 3   | Room 102|        |
|---------|---------|---------|---------|---------|--------|
| 11-12   | Break   | Break   | Break   | Break   | Break  |
|---------|---------|---------|---------|---------|--------|
| 12-13   | English | CS      | Math    | Physics | Math   |
+----------------------------------------------------------+
```

**Code Template:**

```typescript
// File: /apps/learner/src/app/timetable/page.tsx

'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, Badge } from '@edu-bit/ui';
import axios from 'axios';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = [
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
  '12:00-13:00',
  '13:00-14:00',
];

export default function TimetablePage() {
  const { data: timetable, isLoading } = useQuery({
    queryKey: ['timetable'],
    queryFn: async () => {
      const response = await axios.get('/api/students/me/timetable');
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  const getClassForSlot = (day: string, time: string) => {
    return timetable.find(
      (cls: any) => cls.day === day && cls.time === time
    );
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Timetable</h1>

      {/* Timetable Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-gray-100">Time</th>
              {DAYS.map((day) => (
                <th key={day} className="border p-2 bg-gray-100">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((time) => (
              <tr key={time}>
                <td className="border p-2 bg-gray-50 font-semibold">
                  {time}
                </td>
                {DAYS.map((day) => {
                  const cls = getClassForSlot(day, time);
                  return (
                    <td key={`${day}-${time}`} className="border p-2">
                      {cls ? (
                        <div className="bg-blue-50 p-2 rounded">
                          <p className="font-semibold">{cls.subject}</p>
                          <p className="text-sm text-gray-600">{cls.room}</p>
                          <p className="text-xs text-gray-500">{cls.teacher}</p>
                        </div>
                      ) : (
                        <div className="text-gray-400 text-center">-</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

**What You're Learning:**
- ✅ Table layouts
- ✅ Grid display
- ✅ Finding data in arrays
- ✅ Conditional rendering

**Testing:**
- [ ] Timetable displays correctly
- [ ] All classes show
- [ ] Responsive on mobile (scrollable)

---

## 📅 WEEK 4-5: INTERMEDIATE PAGES

*(Continue pattern for remaining pages...)*

### **Remaining Pages to Build:**

**Week 4:**
- PAGE 5: Student Attendance (with graph)
- PAGE 6: Student Documents (file upload)

**Week 5:**
- PAGE 7: Student Announcements
- PAGE 8: Student Profile

**Week 6-7:**
- PAGE 9: Student Assessments (complex - take tests)
- PAGE 10: Student Fees (payment integration)

**Week 7-8:**
- Parent Portal (6 pages - mostly reuse Student pages)

---

## 💡 TIPS FOR SUCCESS

### **1. Start Simple**
- Don't try to make it perfect first time
- Get it working, then make it pretty
- Ask Ameya for help early

### **2. Use Ameya's Components**
```typescript
// Always import from @edu-bit/ui
import { Button, Input, Card } from '@edu-bit/ui';

// Not this:
// Don't create your own button
```

### **3. Console.log is Your Friend**
```typescript
// See what data looks like
console.log('Dashboard data:', dashboardData);

// Check if code reaches here
console.log('Form submitted!');
```

### **4. Chrome DevTools**
- F12 to open
- Check Console for errors
- Check Network tab for API calls

### **5. Ask Questions!**
Don't stay stuck for more than 30 minutes. Ask in Slack!

---

## 🎯 YOUR SUCCESS CHECKLIST

**Week 2:**
- [ ] Login page works
- [ ] Dashboard looks good
- [ ] Can make API calls

**Week 4:**
- [ ] 4 pages complete
- [ ] Comfortable with forms
- [ ] Comfortable with lists

**Week 6:**
- [ ] 8 pages complete
- [ ] Can do file uploads
- [ ] Can use charts

**Week 8:**
- [ ] All 16 pages complete!
- [ ] Confident with React
- [ ] Ready for next project

---

## 📞 WHEN TO ASK FOR HELP

**Ask Ameya if:**
- ✅ Stuck for more than 30 minutes
- ✅ Error you don't understand
- ✅ Not sure which component to use
- ✅ API not working
- ✅ Design doesn't look right

**Ask Manthan if:**
- ✅ Want to pair program
- ✅ Need motivation
- ✅ Want to compare code

**Post in Slack if:**
- ✅ General question
- ✅ Want to share progress
- ✅ Found something cool

---

## 🎉 YOU GOT THIS!

**Remember:**
- Everyone was a beginner once
- Making mistakes is part of learning
- Progress > Perfection
- You're building something students will use!

**Your Impact:**
- Students will see their grades
- Parents will track progress
- You're making education better

**Have fun building! 🚀**

---

**Document Version:** 1.0  
**Created:** October 10, 2025  
**Branch:** `frontend`  
**Your Status:** READY TO LEARN! 💪
