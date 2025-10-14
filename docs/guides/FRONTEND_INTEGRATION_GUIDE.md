# 🎨 Frontend Integration Guide - EduBit LMS

## Quick Start for Frontend Developers

### Base URL
```
Development: http://localhost:8000/api
Production: https://api.edubit.com/api
```

### Authentication
All protected endpoints require Bearer token in Authorization header:
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}
```

---

## 📋 Key API Endpoints for Frontend Pages

### 1. **Login Page** (`/login`)

**API Call:**
```javascript
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123",
  "remember": true
}

Response:
{
  "token": "1|abc123...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "user@example.com",
    "role": "student" // or "admin", "faculty"
  },
  "expires_at": "2025-01-15T12:00:00Z"
}
```

**Frontend Actions:**
1. Show email/password form
2. On submit, call POST /auth/login
3. Store token in localStorage/sessionStorage
4. Redirect based on user role:
   - `admin` → `/admin/dashboard`
   - `student` → `/learner/dashboard`
   - `faculty` → `/faculty/dashboard`

---

### 2. **Admin Dashboard** (`/admin/dashboard`)

**API Calls:**
```javascript
// Overall statistics
GET /admin/analytics/dashboard
Response: {
  "total_students": 1250,
  "active_students": 1180,
  "total_assessments": 45,
  "average_attendance": 87.5,
  "fee_collection": {
    "total_expected": 5000000,
    "total_collected": 4200000,
    "pending": 150
  },
  "library_stats": {
    "total_resources": 5000,
    "issued_resources": 450
  }
}
```

**UI Components:**
1. **Stats Cards Row:**
   - Total Students: `data.total_students`
   - Active Students: `data.active_students`
   - Average Attendance: `data.average_attendance%`
   - Fee Collection Rate: `(collected/expected * 100)%`

2. **Charts:**
   - Attendance Trend: `GET /admin/analytics/attendance`
   - Fee Collection: `GET /admin/analytics/fee-collection`
   - Performance: `GET /admin/analytics/student-performance`

3. **Quick Actions:**
   - Create Announcement
   - View Pending Corrections
   - Generate Reports

---

### 3. **Learner Dashboard** (`/learner/dashboard`)

**API Calls:**
```javascript
// Profile with quick stats
GET /learner/profile
Response: {
  "id": "uuid",
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "profile_picture": "url"
  },
  "roll_number": "2021CS001",
  "course": { "id": "uuid", "name": "Computer Science" },
  "year": 3,
  "semester": 1,
  "quick_stats": {
    "attendance_percentage": 85.5,
    "pending_fees": 50000,
    "average_performance": 78.5,
    "total_assessments": 12
  }
}

// Attendance graph data
GET /learner/profile/attendance?start_date=2025-01-01&end_date=2025-01-31
Response: {
  "summary": {
    "attendance_percentage": 85.5,
    "total_days": 20,
    "present_days": 17,
    "absent_days": 2,
    "status": "good" // or "average", "low"
  },
  "graph_data": {
    "daily": [
      { "date": "2025-01-01", "total": 5, "present": 4, "absent": 1, "percentage": 80 },
      { "date": "2025-01-02", "total": 5, "present": 5, "absent": 0, "percentage": 100 }
    ],
    "colors": {
      "present": "#10b981",
      "absent": "#ef4444",
      "late": "#f59e0b",
      "excused": "#6366f1"
    }
  },
  "subject_wise": [
    { "subject_name": "Data Structures", "percentage": 90 },
    { "subject_name": "Algorithms", "percentage": 85 }
  ]
}

// Fee status widget
GET /learner/profile/fees
Response: {
  "summary": {
    "total_amount": 100000,
    "paid_amount": 60000,
    "pending_amount": 40000,
    "payment_progress": 60,
    "status": "partial" // or "paid", "pending", "unpaid"
  },
  "widget_data": {
    "progress_percentage": 60,
    "amount_paid": 60000,
    "amount_pending": 40000,
    "next_due_date": "2025-02-15"
  },
  "upcoming_payments": [
    {
      "invoice_number": "INV-2025-12345",
      "amount_due": 40000,
      "due_date": "2025-02-15",
      "days_remaining": 30
    }
  ],
  "overdue_invoices": []
}

// Recent announcements
GET /learner/announcements?limit=5
Response: {
  "data": [
    {
      "id": "uuid",
      "title": "Holiday Notice",
      "content": "Campus closed on Jan 26",
      "priority": "high",
      "published_at": "2025-01-10T10:00:00Z",
      "is_read": false
    }
  ]
}
```

**UI Components:**
1. **Profile Widget:**
   - Profile picture
   - Name, roll number, course
   - Quick stats (4 cards)

2. **Attendance Graph:**
   - Use Chart.js or Recharts
   - Line/Bar chart with `graph_data.daily`
   - Color-coded by status
   - Show percentage on tooltip

3. **Fee Status Widget:**
   - Progress bar (`payment_progress`)
   - Amount paid vs pending
   - Next due date
   - "Pay Now" button

4. **Announcements Feed:**
   - Card layout with title, content preview
   - Priority badge (high = red, medium = yellow, low = blue)
   - Unread indicator

5. **Timetable Widget (Today's Schedule):**
   ```javascript
   GET /learner/profile/timetable
   ```

6. **Upcoming Assessments:**
   ```javascript
   GET /learner/assessments?status=upcoming
   ```

---

### 4. **Library Resources Page** (`/learner/library`)

**API Call:**
```javascript
GET /learner/library/resources?type=book&search=python
Response: {
  "data": [
    {
      "id": "uuid",
      "title": "Python Programming",
      "author": "John Smith",
      "type": "book",
      "isbn": "978-1234567890",
      "status": "available", // or "issued", "reserved"
      "category": { "name": "Programming" },
      "is_bookmarked": false
    }
  ],
  "meta": { "total": 100, "per_page": 20 }
}
```

**UI Components:**
1. Search bar + filters (type, category)
2. Card grid layout
3. Status badge (available = green, issued = red)
4. Bookmark button
5. "View Details" button → `/learner/library/resources/{id}`

---

### 5. **Assessments Page** (`/learner/assessments`)

**API Call:**
```javascript
GET /learner/assessments
Response: {
  "data": [
    {
      "id": "uuid",
      "title": "Mid-Term Exam",
      "subject": { "name": "Data Structures" },
      "type": "exam",
      "total_marks": 100,
      "due_date": "2025-01-20T23:59:59Z",
      "status": "pending", // or "submitted", "graded"
      "submission": null // or { "marks_obtained": 85 }
    }
  ]
}

// Submit assessment
POST /learner/assessments/{id}/submit
{
  "answers": [
    { "question_id": "uuid", "answer": "Option A" }
  ]
}
```

**UI Components:**
1. Tab navigation (Pending, Submitted, Graded)
2. Card layout with title, subject, due date
3. Status badge
4. "Start Assessment" button → opens submission interface
5. Countdown timer for due date

---

### 6. **Announcements Page** (`/learner/announcements`)

**API Call:**
```javascript
GET /learner/announcements?priority=high&type=academic
Response: {
  "data": [
    {
      "id": "uuid",
      "title": "Important Notice",
      "content": "Full announcement text...",
      "type": "academic",
      "priority": "high",
      "published_at": "2025-01-15T10:00:00Z",
      "expires_at": "2025-01-20T23:59:59Z",
      "is_read": false
    }
  ]
}

// Mark as read
POST /learner/announcements/{id}/read
```

**UI Components:**
1. Filter by priority/type
2. Card layout with priority badge
3. Unread indicator (blue dot)
4. Expand/collapse content
5. Mark as read automatically on view

---

### 7. **Profile Page** (`/learner/profile`)

**API Calls:**
```javascript
// Get full profile
GET /learner/profile

// Update profile
PATCH /learner/profile
{
  "phone": "1234567890",
  "emergency_contact": "9876543210",
  "address": "123 Main St",
  "bio": "Computer Science student"
}

// Upload profile picture
POST /learner/profile/picture
FormData: { profile_picture: File }
```

**UI Components:**
1. **Profile Header:**
   - Profile picture with edit button
   - Name, roll number, course
   - Edit profile button

2. **Tabs:**
   - Overview (personal info)
   - Attendance (graph from `/learner/profile/attendance`)
   - Fees (widget from `/learner/profile/fees`)
   - Performance (from `/learner/profile/performance`)
   - Timetable (from `/learner/profile/timetable`)
   - Library (from `/learner/profile/library`)

---

## 🎨 UI Component Examples

### Attendance Graph (Recharts)
```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

<LineChart data={attendanceData.graph_data.daily}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="date" />
  <YAxis />
  <Tooltip />
  <Legend />
  <Line type="monotone" dataKey="percentage" stroke="#10b981" />
</LineChart>
```

### Fee Status Widget (Progress Bar)
```jsx
<div className="bg-white rounded-lg shadow p-6">
  <h3 className="text-lg font-semibold mb-4">Fee Status</h3>
  
  <div className="mb-4">
    <div className="flex justify-between mb-2">
      <span>Payment Progress</span>
      <span>{feeData.widget_data.progress_percentage}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-green-500 h-2 rounded-full"
        style={{ width: `${feeData.widget_data.progress_percentage}%` }}
      />
    </div>
  </div>
  
  <div className="grid grid-cols-2 gap-4">
    <div>
      <p className="text-sm text-gray-600">Paid</p>
      <p className="text-xl font-bold">₹{feeData.widget_data.amount_paid}</p>
    </div>
    <div>
      <p className="text-sm text-gray-600">Pending</p>
      <p className="text-xl font-bold text-red-600">₹{feeData.widget_data.amount_pending}</p>
    </div>
  </div>
  
  {feeData.widget_data.next_due_date && (
    <p className="mt-4 text-sm">
      Next payment due: {new Date(feeData.widget_data.next_due_date).toLocaleDateString()}
    </p>
  )}
</div>
```

---

## 🔐 Authentication Flow

```javascript
// Login
const login = async (email, password, remember) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, remember })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    // Redirect based on role
  }
};

// API calls with token
const apiCall = async (endpoint) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`/api${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  if (response.status === 401) {
    // Token expired, logout
    localStorage.clear();
    window.location.href = '/login';
  }
  
  return response.json();
};

// Logout
const logout = async () => {
  const token = localStorage.getItem('token');
  
  await fetch('/api/auth/logout', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  localStorage.clear();
  window.location.href = '/login';
};
```

---

## 📊 Analytics Charts for Admin

### Student Performance Chart
```javascript
GET /admin/analytics/student-performance
Response: {
  "grade_distribution": {
    "A+": 25,
    "A": 50,
    "B+": 30,
    "B": 20,
    "C": 10,
    "D": 5,
    "F": 2
  },
  "class_average": 75.5
}

// Use Recharts BarChart for grade distribution
```

### Attendance Trend Chart
```javascript
GET /admin/analytics/attendance?start_date=2025-01-01&end_date=2025-01-31
Response: {
  "daily_trends": {
    "2025-01-01": { "total": 100, "present": 85, "percentage": 85 },
    "2025-01-02": { "total": 100, "present": 90, "percentage": 90 }
  }
}

// Use LineChart for daily trends
```

---

## 🚀 Next.js Setup (Recommended)

```bash
cd bitflow-frontend/apps/admin  # or learner

# Install dependencies
pnpm install

# Add axios or fetch wrapper
pnpm add axios

# Add chart library
pnpm add recharts

# Add date library
pnpm add date-fns

# Run dev server
pnpm dev
```

### API Client Setup (`lib/api.ts`)
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## 📝 Environment Variables

Create `.env.local` in frontend apps:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_APP_NAME=EduBit LMS
```

---

## 🎯 Priority Pages to Build

1. ✅ **Login Page** (Required to access everything)
2. ✅ **Learner Dashboard** (Main student landing page)
3. ✅ **Library Resources** (Browse and search)
4. ✅ **Announcements** (Important communication)
5. ✅ **Profile Page** (Student information with graphs)
6. ⚪ Admin Dashboard (for administrators)
7. ⚪ Assessments (view and submit)
8. ⚪ Timetable (calendar view)

---

## 💡 Tips for Frontend Developers

1. **Use React Query** for API state management:
   ```bash
   pnpm add @tanstack/react-query
   ```

2. **Use shadcn/ui** for pre-built components:
   ```bash
   npx shadcn-ui@latest init
   npx shadcn-ui@latest add card button input
   ```

3. **Handle Loading States:**
   ```jsx
   const { data, isLoading, error } = useQuery({
     queryKey: ['profile'],
     queryFn: () => api.get('/learner/profile')
   });
   
   if (isLoading) return <Spinner />;
   if (error) return <ErrorMessage />;
   ```

4. **Use TypeScript** for type safety:
   ```typescript
   interface User {
     id: string;
     name: string;
     email: string;
     role: 'admin' | 'student' | 'faculty';
   }
   ```

5. **Test API endpoints** using Postman or curl before building UI

---

**Ready to build! All backend APIs are functional and tested.** 🚀

*For questions, check `FEATURE_STATUS_REPORT_2025.md` for complete API documentation.*
