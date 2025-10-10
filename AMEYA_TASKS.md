# 👨‍💻 AMEYA'S WORK PLAN
**Developer:** Ameya  
**Role:** Team Lead & Infrastructure Specialist  
**Experience Level:** Advanced  
**Project:** EduBit LMS - Bitflow Nova  
**Timeline:** 8 weeks  
**Start Date:** October 10, 2025

---

## 🎯 YOUR ROLE

You are the **Team Lead** and **Infrastructure Specialist**. Your responsibilities:

1. **Build the Foundation** - Authentication system + Shared component library
2. **Build Complex Features** - Drag-drop timetable, bulk upload, assessment builder, grading, analytics
3. **Mentor the Team** - Gauri and Manthan are beginners, they need your guidance
4. **Code Reviews** - Review all PRs before merge
5. **Unblock Issues** - Help team members when they're stuck

**Why You're Critical:**
- Gauri & Manthan can't start until you build auth + components (Week 1-2)
- You're building the hardest features (Week 3-8)
- You're the technical decision maker

---

## 📊 YOUR WORKLOAD

**Total Work:** ~10 complex pages + Infrastructure + Mentoring

**Breakdown:**
- Infrastructure (Auth + Components): ~10 days
- Complex Pages: ~30 days
- Mentoring & Code Reviews: Ongoing (1-2 hours daily)

**Complexity:** 🔴 High (90% of your work is complex)

---

## 🗓️ YOUR 8-WEEK PLAN

---

## 📅 WEEK 1: AUTHENTICATION SYSTEM (CRITICAL PATH) 🚨

**Priority:** ⭐⭐⭐ CRITICAL  
**Why Critical:** Gauri & Manthan can't build anything until this is done  
**Time:** 3-4 days

### **What to Build:**

#### 1. Authentication Flow
**Files to Create:**
```
/packages/api-client/src/auth.ts
/packages/api-client/src/interceptors.ts
/packages/ui/src/context/AuthContext.tsx
/packages/ui/src/hooks/useAuth.ts
/packages/ui/src/components/ProtectedRoute.tsx
```

**Features:**
- ✅ Login flow for all 5 portals
  - Super Admin portal
  - College Admin portal
  - Faculty portal
  - Student portal
  - Parent portal
- ✅ Token management (JWT)
  - Store access token in memory
  - Store refresh token in httpOnly cookie (or localStorage)
  - Auto-refresh tokens before expiry
- ✅ Protected routes
  - Redirect to login if not authenticated
  - Redirect based on role (admin can't access student portal)
- ✅ Role-based access control (RBAC)
  - Check user role from token
  - Protect routes by role
- ✅ Logout functionality
  - Clear tokens
  - Redirect to login
- ✅ Password reset flow
  - Request reset link
  - Reset password with token

**APIs to Integrate:**
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/password/reset-link
POST /api/auth/password/reset
GET /api/auth/me
```

**Code Example Structure:**

```typescript
// /packages/api-client/src/auth.ts
import axios from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
  portal: 'super-admin' | 'college-admin' | 'faculty' | 'student' | 'parent';
}

interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post('/api/auth/login', credentials);
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await axios.post('/api/auth/logout');
  },
  
  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await axios.post('/api/auth/refresh', { refresh_token: refreshToken });
    return response.data;
  },
  
  me: async (): Promise<User> => {
    const response = await axios.get('/api/auth/me');
    return response.data;
  }
};
```

```typescript
// /packages/ui/src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Implementation here...
}
```

```typescript
// /packages/ui/src/components/ProtectedRoute.tsx
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
    
    if (!isLoading && isAuthenticated && allowedRoles) {
      if (!allowedRoles.includes(user?.role)) {
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
```

**Testing:**
- [ ] Can log in as Super Admin
- [ ] Can log in as College Admin
- [ ] Can log in as Faculty
- [ ] Can log in as Student
- [ ] Can log in as Parent
- [ ] Token refreshes automatically
- [ ] Logout clears all tokens
- [ ] Protected routes redirect to login
- [ ] Role-based access works

**Done When:**
- All 5 portals can authenticate
- Gauri & Manthan can use `useAuth()` hook
- Protected routes work

---

## 📅 WEEK 1-2: BASIC COMPONENTS LIBRARY

**Priority:** ⭐⭐⭐ CRITICAL  
**Time:** 3-4 days (parallel with Week 2 work)

### **What to Build:**

#### 2. Basic UI Components

**Files to Create:**
```
/packages/ui/src/components/Button.tsx
/packages/ui/src/components/Input.tsx
/packages/ui/src/components/Textarea.tsx
/packages/ui/src/components/Select.tsx
/packages/ui/src/components/Checkbox.tsx
/packages/ui/src/components/Radio.tsx
/packages/ui/src/components/Card.tsx
/packages/ui/src/components/Badge.tsx
/packages/ui/src/components/Alert.tsx
/packages/ui/src/components/Modal.tsx
/packages/ui/src/components/Spinner.tsx
```

**Component Requirements:**

**Button Component:**
```typescript
// /packages/ui/src/components/Button.tsx
import { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors',
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
          'bg-red-600 text-white hover:bg-red-700': variant === 'danger',
          'bg-transparent hover:bg-gray-100': variant === 'ghost',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
          'opacity-50 cursor-not-allowed': disabled || isLoading,
        },
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner className="mr-2" size="sm" />}
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}
```

**Input Component:**
```typescript
// /packages/ui/src/components/Input.tsx
import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2',
              {
                'border-gray-300 focus:ring-blue-500': !error,
                'border-red-500 focus:ring-red-500': error,
                'pl-10': leftIcon,
                'pr-10': rightIcon,
              },
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);
```

**Card Component:**
```typescript
// /packages/ui/src/components/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({ children, className, padding = 'md' }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow-sm border border-gray-200',
        {
          'p-3': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
        },
        className
      )}
    >
      {children}
    </div>
  );
}
```

**Similar structure for:**
- Textarea
- Select
- Checkbox
- Radio
- Badge
- Alert
- Modal
- Spinner

**Documentation:**
Create a `README.md` in `/packages/ui/` with usage examples for each component.

**Testing:**
- [ ] All components render correctly
- [ ] All variants/sizes work
- [ ] Props are type-safe
- [ ] Accessible (keyboard navigation, ARIA labels)

**Done When:**
- All 11 basic components built
- Gauri & Manthan can import and use them
- Usage examples documented

---

## 📅 WEEK 2: ADVANCED COMPONENTS LIBRARY

**Priority:** ⭐⭐⭐ CRITICAL  
**Time:** 4-5 days

### **What to Build:**

#### 3. Advanced UI Components

**Files to Create:**
```
/packages/ui/src/components/DataTable/DataTable.tsx
/packages/ui/src/components/DataTable/DataTableHeader.tsx
/packages/ui/src/components/DataTable/DataTableRow.tsx
/packages/ui/src/components/DataTable/DataTablePagination.tsx
/packages/ui/src/components/FileUpload.tsx
/packages/ui/src/components/DatePicker.tsx
/packages/ui/src/components/Charts/LineChart.tsx
/packages/ui/src/components/Charts/BarChart.tsx
/packages/ui/src/components/Charts/PieChart.tsx
/packages/ui/src/components/Tabs.tsx
/packages/ui/src/components/Pagination.tsx
/packages/ui/src/components/Toast.tsx
/packages/ui/src/components/Breadcrumbs.tsx
```

**DataTable Component (MOST IMPORTANT):**
```typescript
// /packages/ui/src/components/DataTable/DataTable.tsx
interface Column<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onRowClick?: (row: T) => void;
  isLoading?: boolean;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable<T>({
  data,
  columns,
  onSort,
  onRowClick,
  isLoading,
  pagination,
}: DataTableProps<T>) {
  // Implementation...
  // - Sortable columns
  // - Row click handling
  // - Loading state
  // - Pagination
  // - Empty state
}
```

**FileUpload Component:**
```typescript
// /packages/ui/src/components/FileUpload.tsx
interface FileUploadProps {
  onUpload: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
}

export function FileUpload({
  onUpload,
  accept,
  multiple = false,
  maxSize = 5,
  maxFiles = 1,
}: FileUploadProps) {
  // Implementation...
  // - Drag and drop
  // - File validation
  // - Preview (images)
  // - Progress indicator
  // - Error handling
}
```

**Charts (using Recharts):**
```typescript
// /packages/ui/src/components/Charts/LineChart.tsx
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface LineChartProps {
  data: any[];
  xKey: string;
  yKeys: string[];
  colors?: string[];
  height?: number;
}

export function LineChart({ data, xKey, yKeys, colors, height = 300 }: LineChartProps) {
  // Implementation...
}
```

**DatePicker:**
```typescript
// /packages/ui/src/components/DatePicker.tsx
// Use react-datepicker or build custom
interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
}

export function DatePicker({ value, onChange, minDate, maxDate, placeholder }: DatePickerProps) {
  // Implementation...
}
```

**Testing:**
- [ ] DataTable sorts correctly
- [ ] FileUpload validates files
- [ ] Charts render with data
- [ ] DatePicker selects dates
- [ ] All components responsive

**Done When:**
- All 13 advanced components built
- Manthan can use DataTable for all admin tables
- Gauri can use Charts for dashboards
- FileUpload works for document uploads

---

## 📅 WEEK 3-4: TIMETABLE BUILDER (COMPLEX FEATURE #1)

**Priority:** ⭐⭐⭐ High  
**Complexity:** 🔴 Very High  
**Time:** 4-5 days

### **What to Build:**

#### 4. Admin Timetable Builder

**Location:** `/apps/admin/src/app/timetable/builder/page.tsx`

**Features:**
- ✅ Drag-and-drop interface
  - Drag teacher/subject onto time slot
  - Visual grid (Days × Time slots)
  - Color-coded by subject
- ✅ Conflict detection
  - Teacher can't teach 2 classes at same time
  - Room can't be used by 2 classes at same time
  - Show warning before allowing drop
- ✅ Bulk operations
  - Copy entire week
  - Duplicate timetable for another class
  - Clear all slots
- ✅ Save and publish
  - Save draft
  - Publish to students/faculty

**Tech Stack:**
- Use `@dnd-kit/core` or `react-beautiful-dnd` for drag-drop
- Complex state management (useReducer)
- Real-time validation

**APIs:**
```
GET /api/timetable/grid?class_id=1
POST /api/timetable/slots
PUT /api/timetable/slots/{id}
DELETE /api/timetable/slots/{id}
POST /api/timetable/validate
POST /api/timetable/publish
```

**Data Structure:**
```typescript
interface TimeSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  start_time: string; // "09:00"
  end_time: string;   // "10:00"
  subject_id: number | null;
  teacher_id: number | null;
  room_id: number | null;
}

interface Conflict {
  type: 'teacher' | 'room';
  message: string;
  conflictingSlots: string[];
}
```

**Code Structure:**
```typescript
// State management
const [timetable, setTimetable] = useState<TimeSlot[]>([]);
const [conflicts, setConflicts] = useState<Conflict[]>([]);

// Drag and drop handlers
const handleDragEnd = async (event: DragEndEvent) => {
  // 1. Get dragged item (teacher/subject)
  // 2. Get drop target (time slot)
  // 3. Validate for conflicts
  // 4. Update timetable
  // 5. Save to backend
};

// Conflict detection
const checkConflicts = (slot: TimeSlot): Conflict[] => {
  // Check teacher conflicts
  // Check room conflicts
  // Return list of conflicts
};
```

**UI Layout:**
```
+----------------------------------------------------------+
|  Timetable Builder - Class 10A                          |
+----------------------------------------------------------+
|  [Teachers Panel]  [Subjects Panel]  [Actions]          |
+----------------------------------------------------------+
|         | Monday | Tuesday | Wednesday | Thursday | Fri  |
|---------|--------|---------|-----------|----------|------|
| 09-10   | Math   | Eng     | Physics   | Math     | CS   |
|         | Mr.A   | Ms.B    | Mr.C      | Mr.A     | Ms.D |
|---------|--------|---------|-----------|----------|------|
| 10-11   | Empty  | Math    | Empty     | Eng      | Math |
|---------|--------|---------|-----------|----------|------|
| ...     | ...    | ...     | ...       | ...      | ...  |
+----------------------------------------------------------+
|  [Save Draft]  [Publish]  [Copy Week]  [Clear All]      |
+----------------------------------------------------------+
```

**Testing:**
- [ ] Can drag teacher onto slot
- [ ] Conflict warning shows
- [ ] Can't create conflicting slots
- [ ] Can save and publish
- [ ] Copy week works
- [ ] Responsive design

**Done When:**
- College admin can create full timetable
- Conflict detection works
- Timetable saves correctly
- Manthan can move to simpler pages

---

## 📅 WEEK 4: BULK STUDENT UPLOAD (COMPLEX FEATURE #2)

**Priority:** ⭐⭐⭐ High  
**Complexity:** 🔴 High  
**Time:** 3-4 days

### **What to Build:**

#### 5. Admin Bulk Student Upload

**Location:** `/apps/admin/src/app/students/bulk-upload/page.tsx`

**Features:**
- ✅ CSV file upload
  - Download sample CSV template
  - Upload CSV file
  - Validate CSV structure
- ✅ Data preview
  - Show first 10 rows
  - Highlight errors in red
  - Show validation errors
- ✅ Error handling
  - Row-level errors (invalid email, duplicate roll number)
  - Show which rows failed
  - Download error report
- ✅ Progress tracking
  - Show upload progress (0-100%)
  - Chunk large files (1000 rows at a time)
  - Real-time status updates
- ✅ Rollback on failure
  - Option to rollback if errors
  - Partial import option

**Tech Stack:**
- Use `papaparse` for CSV parsing
- Chunked uploads for large files
- WebSockets or polling for progress updates

**APIs:**
```
GET /api/students/bulk/template
POST /api/students/bulk/validate
POST /api/students/bulk/import
GET /api/students/bulk/status/{jobId}
POST /api/students/bulk/rollback/{jobId}
```

**CSV Structure:**
```csv
first_name,last_name,email,roll_number,department_id,year,phone,parent_phone
John,Doe,john@example.com,2024001,1,1,1234567890,9876543210
Jane,Smith,jane@example.com,2024002,1,1,1234567891,9876543211
```

**Code Structure:**
```typescript
// CSV Upload Flow
const handleFileUpload = async (file: File) => {
  // 1. Parse CSV with papaparse
  const parsed = await parseCSV(file);
  
  // 2. Validate structure
  const validationErrors = validateCSV(parsed.data);
  if (validationErrors.length > 0) {
    setErrors(validationErrors);
    return;
  }
  
  // 3. Preview data
  setPreviewData(parsed.data.slice(0, 10));
  
  // 4. Upload in chunks
  const jobId = await uploadInChunks(parsed.data);
  
  // 5. Poll for progress
  pollProgress(jobId);
};

// Chunked upload
const uploadInChunks = async (data: any[], chunkSize = 1000) => {
  const chunks = chunkArray(data, chunkSize);
  let jobId: string;
  
  for (let i = 0; i < chunks.length; i++) {
    const response = await axios.post('/api/students/bulk/import', {
      data: chunks[i],
      chunk: i + 1,
      total_chunks: chunks.length,
      job_id: jobId,
    });
    
    jobId = response.data.job_id;
    setProgress((i + 1) / chunks.length * 100);
  }
  
  return jobId;
};
```

**UI Layout:**
```
+----------------------------------------------------------+
|  Bulk Student Upload                                     |
+----------------------------------------------------------+
|  Step 1: Download Template                               |
|  [Download CSV Template]                                 |
+----------------------------------------------------------+
|  Step 2: Upload CSV                                      |
|  [Drag & Drop CSV or Click to Browse]                   |
+----------------------------------------------------------+
|  Step 3: Preview & Validate                              |
|  +-------------------------------------------------+     |
|  | Row | Name      | Email           | Errors     |     |
|  |-----|-----------|-----------------|------------|     |
|  | 1   | John Doe  | john@email.com  | ✓          |     |
|  | 2   | Jane S    | invalid-email   | Invalid    |     |
|  | 3   | Bob Test  | bob@email.com   | ✓          |     |
|  +-------------------------------------------------+     |
|  Valid: 150 | Errors: 5                                  |
+----------------------------------------------------------+
|  Step 4: Import                                          |
|  [Import All] [Import Valid Only] [Cancel]               |
|                                                           |
|  Progress: [████████░░] 80% (800/1000 rows)              |
+----------------------------------------------------------+
|  Step 5: Results                                         |
|  ✓ Successfully imported 150 students                    |
|  ✗ Failed to import 5 students                           |
|  [Download Error Report] [Download Success Report]       |
+----------------------------------------------------------+
```

**Testing:**
- [ ] Can upload CSV
- [ ] Validation catches errors
- [ ] Preview shows data correctly
- [ ] Progress tracking works
- [ ] Error report downloads
- [ ] Large files (10,000+ rows) work

**Done When:**
- College admin can bulk upload students
- Validation prevents bad data
- Error handling is robust
- Progress updates work

---

## 📅 WEEK 5-6: ASSESSMENT BUILDER (COMPLEX FEATURE #3)

**Priority:** ⭐⭐⭐ High  
**Complexity:** 🔴 Very High  
**Time:** 5-6 days

### **What to Build:**

#### 6. Faculty Assessment Builder

**Location:** `/apps/faculty/src/app/assessments/create/page.tsx`

**Features:**
- ✅ Multi-step form wizard
  - Step 1: Basic info (title, description, duration)
  - Step 2: Settings (passing marks, randomize questions)
  - Step 3: Add questions
  - Step 4: Review and publish
- ✅ Question types
  - MCQ (Multiple Choice - single answer)
  - Multi-select MCQ (multiple correct answers)
  - SAQ (Short Answer - text input)
  - LAQ (Long Answer - rich text)
- ✅ Question builder
  - Rich text editor for question text
  - Image upload for question
  - Add options (for MCQ)
  - Mark correct answer
  - Set marks per question
- ✅ Question bank
  - Save question to bank
  - Reuse questions from bank
  - Tag questions (difficulty, topic)
- ✅ Preview mode
  - Student view of assessment
  - Test taking experience

**Tech Stack:**
- Multi-step form: `react-hook-form` with multiple schemas
- Rich text: Use `tiptap` or `lexical`
- Image upload: Your `FileUpload` component

**APIs:**
```
POST /api/assessments
GET /api/assessments/{id}
PUT /api/assessments/{id}
POST /api/assessments/{id}/questions
PUT /api/assessments/{id}/questions/{qid}
DELETE /api/assessments/{id}/questions/{qid}
POST /api/media/upload
GET /api/questions/bank
```

**Data Structure:**
```typescript
interface Assessment {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  total_marks: number;
  passing_marks: number;
  randomize_questions: boolean;
  show_results_immediately: boolean;
  questions: Question[];
}

interface Question {
  id: number;
  type: 'mcq' | 'multi-select' | 'saq' | 'laq';
  question_text: string;
  question_image?: string;
  marks: number;
  options?: Option[]; // For MCQ
  correct_answer?: string | string[]; // For MCQ/SAQ
}

interface Option {
  id: string;
  text: string;
  is_correct: boolean;
}
```

**Code Structure:**
```typescript
// Multi-step form
const [step, setStep] = useState(1);
const [assessment, setAssessment] = useState<Partial<Assessment>>({});

// Step 1: Basic Info
const BasicInfoForm = () => {
  const { register, handleSubmit } = useForm();
  
  const onSubmit = (data) => {
    setAssessment(prev => ({ ...prev, ...data }));
    setStep(2);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input label="Title" {...register('title')} />
      <Textarea label="Description" {...register('description')} />
      <Input type="number" label="Duration (minutes)" {...register('duration_minutes')} />
      <Button type="submit">Next</Button>
    </form>
  );
};

// Step 3: Question Builder
const QuestionBuilder = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<Question>>({});
  
  const addQuestion = () => {
    setQuestions(prev => [...prev, currentQuestion as Question]);
    setCurrentQuestion({});
  };
  
  return (
    <div>
      <Select
        label="Question Type"
        value={currentQuestion.type}
        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, type: e.target.value }))}
      >
        <option value="mcq">Multiple Choice (Single)</option>
        <option value="multi-select">Multiple Choice (Multiple)</option>
        <option value="saq">Short Answer</option>
        <option value="laq">Long Answer</option>
      </Select>
      
      <RichTextEditor
        value={currentQuestion.question_text}
        onChange={(text) => setCurrentQuestion(prev => ({ ...prev, question_text: text }))}
      />
      
      {currentQuestion.type === 'mcq' && (
        <MCQOptionsBuilder
          options={currentQuestion.options || []}
          onChange={(options) => setCurrentQuestion(prev => ({ ...prev, options }))}
        />
      )}
      
      <Input
        type="number"
        label="Marks"
        value={currentQuestion.marks}
        onChange={(e) => setCurrentQuestion(prev => ({ ...prev, marks: parseInt(e.target.value) }))}
      />
      
      <Button onClick={addQuestion}>Add Question</Button>
    </div>
  );
};
```

**UI Layout:**
```
+----------------------------------------------------------+
|  Create Assessment                                       |
+----------------------------------------------------------+
|  [1. Basic Info] → [2. Settings] → [3. Questions] → [4. Review] |
+----------------------------------------------------------+
|                                                           |
|  Step 3: Add Questions (5/10 added)                      |
|                                                           |
|  Question Type: [Dropdown: MCQ ▼]                        |
|                                                           |
|  Question Text:                                           |
|  [Rich Text Editor with formatting toolbar]              |
|  What is the capital of France?                           |
|                                                           |
|  Image (optional): [Upload Image]                        |
|                                                           |
|  Options:                                                 |
|  ○ Paris      [✓ Correct]  [Delete]                      |
|  ○ London     [ ]           [Delete]                      |
|  ○ Berlin     [ ]           [Delete]                      |
|  ○ Madrid     [ ]           [Delete]                      |
|  [+ Add Option]                                           |
|                                                           |
|  Marks: [2]                                               |
|                                                           |
|  [Save to Question Bank]  [Add Question]                 |
|                                                           |
|  Questions Added (5):                                     |
|  1. What is the capital of France? (MCQ, 2 marks)        |
|  2. Explain Newton's Laws (LAQ, 5 marks)                 |
|  ...                                                      |
|                                                           |
|  [Back] [Save Draft] [Next: Review]                      |
+----------------------------------------------------------+
```

**Testing:**
- [ ] Can create assessment with all steps
- [ ] All question types work
- [ ] Rich text editor works
- [ ] Image upload works
- [ ] Can preview assessment
- [ ] Save draft works

**Done When:**
- Faculty can create full assessment
- All question types supported
- Preview mode works
- Gauri can build student attempt page

---

## 📅 WEEK 6-7: GRADING INTERFACE (COMPLEX FEATURE #4)

**Priority:** ⭐⭐ High  
**Complexity:** 🔴 High  
**Time:** 3-4 days

### **What to Build:**

#### 7. Faculty Grading Interface

**Location:** `/apps/faculty/src/app/assessments/[id]/grade/page.tsx`

**Features:**
- ✅ View all submissions
  - Table of students with submission status
  - Filter by status (pending, graded)
  - Sort by name, submission time, score
- ✅ Grade SAQ/LAQ responses
  - View student answer
  - View correct answer (if available)
  - Enter marks
  - Add feedback comments
- ✅ Bulk grading
  - Mark multiple as absent
  - Apply marks to multiple students
  - Copy feedback to similar answers
- ✅ Export results
  - Download as CSV
  - Generate PDF report

**APIs:**
```
GET /api/assessments/{id}/submissions
GET /api/submissions/{id}
PUT /api/submissions/{id}/grade
POST /api/submissions/bulk/grade
GET /api/assessments/{id}/export
```

**Code Structure:**
```typescript
// Grading Interface
const GradingInterface = ({ assessmentId }: { assessmentId: number }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  
  const handleGrade = async (submissionId: number, questionId: number, marks: number, feedback: string) => {
    await axios.put(`/api/submissions/${submissionId}/grade`, {
      question_id: questionId,
      marks,
      feedback,
    });
    
    // Refresh submissions
  };
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Left: Submissions List */}
      <div className="col-span-1">
        <SubmissionsList
          submissions={submissions}
          onSelect={setSelectedSubmission}
        />
      </div>
      
      {/* Right: Grading Panel */}
      <div className="col-span-2">
        {selectedSubmission && (
          <GradingPanel
            submission={selectedSubmission}
            onGrade={handleGrade}
          />
        )}
      </div>
    </div>
  );
};
```

**UI Layout:**
```
+----------------------------------------------------------+
|  Grade Assessment: Mid-Term Exam                         |
+----------------------------------------------------------+
|  Submissions (45)                |  Grading Panel        |
|                                  |                       |
|  +--------------------------+    |  Student: John Doe    |
|  | □ John Doe               |    |  Roll: 2024001        |
|  |   Submitted: 2h ago      |    |  Submitted: 2h ago    |
|  |   Status: Pending        |    |                       |
|  +--------------------------+    |  Question 1 (MCQ)     |
|  | □ Jane Smith             |    |  Auto-graded: 2/2 ✓   |
|  |   Submitted: 3h ago      |    |                       |
|  |   Status: Graded (18/20) |    |  Question 2 (SAQ)     |
|  +--------------------------+    |  Q: Explain gravity   |
|  | □ Bob Johnson            |    |  A: Gravity is...     |
|  |   Not submitted          |    |  Marks: [_/5]         |
|  |   Status: Absent         |    |  Feedback:            |
|  +--------------------------+    |  [Text area]          |
|  ...                             |  [Save & Next]        |
|                                  |                       |
|  [Mark Selected as Absent]       |  Question 3 (LAQ)     |
|  [Export Results]                |  ...                  |
+----------------------------------------------------------+
```

**Testing:**
- [ ] Can view all submissions
- [ ] Can grade SAQ answers
- [ ] Can grade LAQ answers
- [ ] Bulk operations work
- [ ] Export to CSV works

**Done When:**
- Faculty can grade all submissions
- Bulk grading works
- Export results works

---

## 📅 WEEK 7-8: ANALYTICS DASHBOARD (COMPLEX FEATURE #5)

**Priority:** ⭐⭐ High  
**Complexity:** 🔴 High  
**Time:** 4-5 days

### **What to Build:**

#### 8. Admin Analytics Dashboard

**Location:** `/apps/admin/src/app/analytics/page.tsx`

**Features:**
- ✅ Multiple chart types
  - Revenue trends (line chart)
  - Enrollment by department (bar chart)
  - Fee collection status (pie chart)
  - Attendance trends (line chart)
- ✅ Filters
  - Date range picker
  - Select department
  - Select year/semester
- ✅ KPI Cards
  - Total revenue
  - Total students
  - Average attendance
  - Fee collection rate
- ✅ Export
  - Download charts as PNG
  - Export data to Excel
  - Generate PDF report

**APIs:**
```
GET /api/analytics/revenue?from=2025-01-01&to=2025-03-31
GET /api/analytics/enrollment?department_id=1
GET /api/analytics/fees?year=2025
GET /api/analytics/attendance?from=2025-01-01&to=2025-03-31
GET /api/analytics/export?type=pdf
```

**Code Structure:**
```typescript
const AnalyticsDashboard = () => {
  const [dateRange, setDateRange] = useState({ from: new Date(), to: new Date() });
  const [filters, setFilters] = useState({});
  
  const { data: revenueData } = useQuery({
    queryKey: ['analytics', 'revenue', dateRange],
    queryFn: () => fetchRevenueData(dateRange),
  });
  
  const { data: enrollmentData } = useQuery({
    queryKey: ['analytics', 'enrollment', filters],
    queryFn: () => fetchEnrollmentData(filters),
  });
  
  return (
    <div>
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <DateRangePicker value={dateRange} onChange={setDateRange} />
        <Select label="Department" onChange={...} />
        <Button onClick={handleExport}>Export Report</Button>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPICard title="Total Revenue" value="₹12,50,000" change="+15%" />
        <KPICard title="Total Students" value="1,234" change="+8%" />
        <KPICard title="Avg Attendance" value="92%" change="-2%" />
        <KPICard title="Fee Collection" value="85%" change="+5%" />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <h3>Revenue Trends</h3>
          <LineChart data={revenueData} xKey="month" yKeys={['revenue']} />
        </Card>
        
        <Card>
          <h3>Enrollment by Department</h3>
          <BarChart data={enrollmentData} xKey="department" yKeys={['students']} />
        </Card>
      </div>
    </div>
  );
};
```

**Testing:**
- [ ] All charts render correctly
- [ ] Filters update charts
- [ ] KPI cards show correct data
- [ ] Export to PDF works
- [ ] Responsive on all screens

**Done When:**
- Analytics dashboard complete
- All charts working
- Export functionality works

---

## 📅 ONGOING: MENTORING & CODE REVIEW

**Time:** 1-2 hours daily (Week 1-8)

### **Daily Responsibilities:**

#### 1. Daily Standup (10:00 AM - 15 min)
- Listen to Gauri & Manthan's updates
- Identify blockers
- Assign tasks if needed

#### 2. Code Reviews (Throughout day)
- Review all PRs within 2-4 hours
- Provide constructive feedback
- Approve or request changes

**Code Review Checklist:**
- [ ] Code follows project structure
- [ ] TypeScript types are correct
- [ ] No console.logs left
- [ ] Error handling implemented
- [ ] Loading states implemented
- [ ] Responsive design
- [ ] Accessibility (ARIA labels, keyboard nav)
- [ ] No hardcoded values
- [ ] API integration correct
- [ ] Comments for complex logic

**Feedback Examples:**
```
✅ Good:
"Great work! One suggestion: Add error handling in line 45 
for the API call. Otherwise looks good to merge!"

❌ Too harsh:
"This is wrong. Fix it."

✅ Good:
"The logic is correct but we can simplify this using 
array.map() instead of forEach + push. Check this example: [link]"
```

#### 3. Unblock Issues (As needed)
**When Gauri/Manthan posts in Slack:**
- Respond within 1-2 hours
- If quick answer: Reply in Slack
- If complex: Schedule 15-min pair programming session

**Common Blockers:**
- API integration errors → Check API docs, test endpoint
- Component not working → Check props, imports
- TypeScript errors → Help with types
- Styling issues → Share Tailwind examples

#### 4. Pair Programming (Week 1-2)
**Week 1:**
- Pair with Gauri: Build first page together (Student Dashboard)
- Pair with Manthan: Build first CRUD together (Universities)

**Week 2:**
- Check in with both
- Quick 30-min sessions if stuck

---

## 📊 YOUR PROGRESS TRACKING

### **Week-by-Week Checklist:**

**Week 1:**
- [ ] Authentication system complete
- [ ] Basic components (11) complete
- [ ] Gauri & Manthan setup environment
- [ ] Pair programming sessions done

**Week 2:**
- [ ] Advanced components (13) complete
- [ ] DataTable working for Manthan
- [ ] Charts working for Gauri
- [ ] All components documented

**Week 3-4:**
- [ ] Timetable builder complete
- [ ] Bulk upload complete
- [ ] Code reviews ongoing

**Week 5-6:**
- [ ] Assessment builder complete
- [ ] Grading interface complete

**Week 7-8:**
- [ ] Analytics dashboard complete
- [ ] All code reviews done
- [ ] Final testing

---

## 🎯 YOUR SUCCESS METRICS

**Week 4 Checkpoint:**
- [ ] Auth + Components 100% complete
- [ ] Gauri completed 4 pages
- [ ] Manthan completed 6 pages
- [ ] No blockers for team

**Week 6 Checkpoint:**
- [ ] Timetable + Bulk upload + Assessment builder complete
- [ ] Gauri completed 10 pages
- [ ] Manthan completed 15 pages
- [ ] All PRs reviewed

**Week 8 Final:**
- [ ] All 10 complex pages complete
- [ ] All 50+ pages in production
- [ ] Code quality high
- [ ] Team grew skills
- [ ] On time! 🎉

---

## 💡 TIPS FOR SUCCESS

### **1. Build for Reusability**
Your components will be used 50+ times. Make them:
- ✅ Flexible (props for customization)
- ✅ Type-safe (proper TypeScript types)
- ✅ Documented (usage examples)
- ✅ Accessible (ARIA labels)

### **2. Focus on DX (Developer Experience)**
Gauri & Manthan are beginners. Help them by:
- ✅ Clear component APIs
- ✅ Good error messages
- ✅ Code examples in comments
- ✅ Quick to respond

### **3. Balance Speed & Quality**
- Week 1-2: Take time, build solid foundation
- Week 3+: Move faster on features
- Don't sacrifice code quality for speed

### **4. Mentoring Style**
- ✅ Explain "why" not just "how"
- ✅ Share resources (docs, articles)
- ✅ Encourage questions
- ✅ Celebrate their wins

### **5. Time Management**
- Morning: Complex features
- Afternoon: Code reviews, meetings
- Evening: Planning next day

---

## 📞 WHEN TO ASK FOR HELP

**You should escalate if:**
- Complex feature will take >7 days (discuss alternatives)
- API is blocking you (talk to backend team)
- Team is falling behind (discuss timeline adjustment)
- Major technical decision needed (architecture change)

**Don't be a hero:**
- It's okay to ask for help
- It's okay to adjust timeline
- Team success > individual heroics

---

## 🎉 YOU GOT THIS!

**Why you're the perfect person for this:**
- ✅ You have the technical skills
- ✅ You can mentor others
- ✅ You can handle complex features
- ✅ You're organized and reliable

**Your impact:**
- Building the foundation for 50+ pages
- Upskilling 2 junior developers
- Creating reusable components
- Delivering a production-ready system

**Remember:**
- You're not alone (backend team, project manager)
- Team success is your success
- Take breaks, avoid burnout
- Celebrate milestones

---

## 📋 QUICK REFERENCE

**Your Pages:**
1. ✅ Authentication System (Week 1)
2. ✅ Component Library (Week 1-2)
3. 🔴 Timetable Builder (Week 3-4)
4. 🔴 Bulk Upload (Week 4)
5. 🔴 Assessment Builder (Week 5-6)
6. 🔴 Grading Interface (Week 6-7)
7. 🔴 Analytics Dashboard (Week 7-8)

**Daily Routine:**
- 10:00 AM: Daily standup
- Morning: Build features
- Afternoon: Code reviews
- Evening: Unblock team

**Communication:**
- Slack: `#frontend-team`
- Meetings: Daily standup, Friday demo
- Code: GitHub PRs

---

**Let's build something amazing! 🚀**

**Document Version:** 1.0  
**Created:** October 10, 2025  
**Branch:** `frontend`  
**Your Status:** READY TO LEAD! 💪
