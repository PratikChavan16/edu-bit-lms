# Faculty/Teacher Portal - Pages and UI Specifications

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Table of Contents

1. [Design System Overview](#design-system-overview)
2. [Global Components](#global-components)
3. [Page Specifications](#page-specifications)
4. [Interaction Patterns](#interaction-patterns)
5. [State Management](#state-management)
6. [Responsive Design](#responsive-design)
7. [Accessibility](#accessibility)

---

## Design System Overview

### Layout Conventions

**Desktop Layout** (≥1024px):
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Logo | Breadcrumb | Search | Notifications | Avatar │
├─────────┬───────────────────────────────────────────────────┤
│         │                                                   │
│  Left   │              Main Content Area                    │
│  Nav    │                                                   │
│  (240px)│                                                   │
│         │                                                   │
│         │                                                   │
└─────────┴───────────────────────────────────────────────────┘
```

**Tablet Layout** (768px-1023px):
```
┌─────────────────────────────────────────────────────────────┐
│ Header: [☰] Logo | Notifications | Avatar                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│              Main Content Area (Full Width)                 │
│              (Nav as drawer/overlay)                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Mobile Layout** (<768px):
```
┌──────────────────────────┐
│ [☰] Logo  [🔔] [👤]      │
├──────────────────────────┤
│                          │
│    Main Content          │
│    (Full Width)          │
│                          │
└──────────────────────────┘
│  Bottom Nav (if needed)  │
└──────────────────────────┘
```

### Color Palette

**Primary Colors**:
- Primary: `#3B82F6` (Blue-500)
- Primary Dark: `#1E40AF` (Blue-800)
- Primary Light: `#93C5FD` (Blue-300)

**Semantic Colors**:
- Success: `#10B981` (Green-500)
- Warning: `#F59E0B` (Amber-500)
- Error: `#EF4444` (Red-500)
- Info: `#06B6D4` (Cyan-500)

**Neutral Colors**:
- Gray-900: `#111827` (Text primary)
- Gray-700: `#374151` (Text secondary)
- Gray-500: `#6B7280` (Text muted)
- Gray-200: `#E5E7EB` (Borders)
- Gray-50: `#F9FAFB` (Background light)

**Status Colors**:
- Present (Attendance): `#10B981` (Green)
- Absent (Attendance): `#EF4444` (Red)
- Late: `#F59E0B` (Amber)
- Excused: `#8B5CF6` (Purple)
- Draft: `#6B7280` (Gray)
- Published: `#10B981` (Green)

### Typography

**Font Family**: Inter, system-ui, sans-serif

**Font Sizes**:
- Heading 1: 2.25rem (36px) / Bold
- Heading 2: 1.875rem (30px) / Bold
- Heading 3: 1.5rem (24px) / SemiBold
- Heading 4: 1.25rem (20px) / SemiBold
- Body Large: 1.125rem (18px) / Regular
- Body: 1rem (16px) / Regular
- Body Small: 0.875rem (14px) / Regular
- Caption: 0.75rem (12px) / Regular

**Line Heights**:
- Tight: 1.25
- Normal: 1.5
- Relaxed: 1.75

### Spacing Scale

Based on 4px base unit:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

---

## Global Components

### Header

**Desktop Version**:
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] Faculty Portal > Dashboard         [🔍] [🔔] [👤]    │
└─────────────────────────────────────────────────────────────┘
```

**Components**:
1. **Logo + Portal Name** (Left)
   - Clickable, returns to dashboard
   - Portal name: "Faculty Portal"

2. **Breadcrumb** (Center-Left)
   - Shows navigation path: Dashboard > My Courses > CS101
   - Each segment clickable
   - Max 3 levels, truncate with "..."

3. **Global Search** (Center-Right)
   - Icon button, expands to search bar
   - Placeholder: "Search students, courses..."
   - Keyboard shortcut: Ctrl+K (Cmd+K on Mac)
   - Dropdown results: Students, Courses, Materials

4. **Notifications** (Right)
   - Bell icon with badge (unread count)
   - Dropdown panel with recent 5 notifications
   - Categories: Submissions, Messages, System alerts
   - "View All" link to notifications page

5. **User Menu** (Far Right)
   - Avatar with faculty name
   - Dropdown:
     - Profile
     - Settings
     - Help & Support
     - Logout

**States**:
- Normal: White background, shadow
- Scrolled: Adds subtle shadow
- Offline Mode: Yellow banner below header

### Left Navigation

**Menu Structure**:
```
├── 📊 Dashboard
├── 📚 My Courses
│   └── (Expandable: Recent courses)
├── ✅ Attendance
│   ├── Mark Attendance
│   ├── Edit Attendance
│   └── Reports
├── 📝 Assessments
│   ├── Assessments List
│   ├── Gradebook
│   └── Regrade Requests
├── 📄 Materials
├── 📅 Timetable
├── 💬 Messages
├── 🏖️ Leaves
├── 📋 Exams & Duties
├── 📈 Analytics
└── ⚙️ Settings
```

**Interactions**:
- Hover: Highlight background
- Active: Bold text + left border accent
- Expandable sections: Arrow icon rotates
- Collapsible on tablet/mobile
- Keyboard navigation: Tab, Arrow keys

**Mobile Version**:
- Hamburger menu
- Slides in from left
- Overlay backdrop (semi-transparent black)
- Close on backdrop click or X button

### Offline Banner

**Appearance**:
```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ You are offline. Changes will sync when connected.       │
│ [Sync Now] [View Queue: 3 pending]                          │
└─────────────────────────────────────────────────────────────┘
```

**Colors**:
- Background: `#FEF3C7` (Amber-100)
- Text: `#78350F` (Amber-900)
- Border: `#F59E0B` (Amber-500)

**Behaviors**:
- Auto-appears when network lost
- Auto-dismisses when network restored
- Shows pending sync count
- "Sync Now" button for manual sync

### Toast Notifications

**Types**:
1. **Success**: Green background, checkmark icon
2. **Error**: Red background, X icon
3. **Warning**: Amber background, exclamation icon
4. **Info**: Blue background, info icon

**Example**:
```
┌─────────────────────────────────┐
│ ✓ Attendance saved successfully │
│   [Undo]                         │
└─────────────────────────────────┘
```

**Behavior**:
- Appears top-right corner
- Auto-dismisses after 5 seconds
- Manual dismiss with X button
- Stack multiple toasts
- Slide-in animation

### Loading States

**Skeleton Loaders**:
- Gray animated pulse
- Match shape of content (cards, lists, tables)
- Show during initial page load

**Spinner**:
- Use for actions (saving, submitting)
- Centered with backdrop for full-page loading
- Inline for button actions

---

## Page Specifications

### 1. Dashboard (`/`)

**Route**: `/`  
**Layout**: Full-width with card grid

**Wireframe**:
```
┌─────────────────────────────────────────────────────────────┐
│ Welcome back, Prof. John Doe!           [Date: Oct 25, 2025] │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐  │
│ │  Today's Classes │ │ Quick Actions   │ │ Pending Items │  │
│ │  ├─ 10:00 CS101  │ │ • Mark Attend.  │ │ Grade: 15     │  │
│ │  │  Rm A, Sec A  │ │ • Post Material │ │ Messages: 3   │  │
│ │  ├─ 12:00 MA102  │ │ • Announcement  │ │ Approvals: 1  │  │
│ │  │  Rm B, Sec B  │ │                 │ │               │  │
│ └─────────────────┘ └─────────────────┘ └───────────────┘  │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │  Recent Activity                                        │ │
│ │  • Marked attendance for CS101 - 2 hours ago            │ │
│ │  • Published grades for Assignment 3 - 5 hours ago      │ │
│ │  • Uploaded material "Lecture 10 Notes" - Yesterday     │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌─────────────────────────────────────┐│
│ │ Weekly Overview  │ │ Student Analytics Summary           ││
│ │ [Bar Chart]      │ │ • At-risk students: 5               ││
│ │                  │ │ • Avg attendance: 92%               ││
│ │                  │ │ • Pending submissions: 23           ││
│ └──────────────────┘ └─────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**Components Detail**:

#### Today's Classes Card
- **Header**: "Today's Classes" + date
- **Content**: List of classes with:
  - Time (10:00 AM)
  - Course code + name (CS101 - Intro to Programming)
  - Room number (Rm A)
  - Section (Sec A)
  - Student count (62 students)
- **Actions**: 
  - Hover: "Mark Attendance" quick button
  - Click card: Navigate to course details
- **Empty State**: "No classes scheduled today. Enjoy your day! 🎉"

#### Quick Actions Card
- **Actions**:
  1. **Mark Attendance**: Icon + "Mark Attendance" → Opens modal with course selector
  2. **Post Materials**: Icon + "Post Materials" → Opens upload dialog
  3. **Quick Announcement**: Icon + "Send Announcement" → Opens compose modal
  4. **Grade Assignment**: Icon + "Grade Submissions" → Navigate to pending list
- **Style**: Large buttons, icon + text, primary color on hover

#### Pending Items Card
- **Sections**:
  - **Assignments to Grade**: Count + badge, click → Gradebook
  - **Attendance to Mark**: Overdue count (red if >0), click → Attendance page
  - **Material Uploads Pending**: Count, click → Materials page
  - **Unread Messages**: Count + badge, click → Messages inbox
  - **Leave Requests Status**: Pending approvals, click → Leaves page
- **Style**: List with badges, clickable items

#### Recent Activity Timeline
- **Items**: Last 10 actions
- **Format**: 
  - Icon (based on action type)
  - Description: "Marked attendance for CS101"
  - Timestamp: "2 hours ago"
- **Interactions**: Click item → Navigate to related entity

#### Weekly Overview Chart
- **Type**: Bar chart
- **X-axis**: Days of week (Mon-Fri)
- **Y-axis**: Number of classes
- **Data**: Classes per day
- **Interactive**: Hover shows class details

#### Student Analytics Summary
- **Metrics**:
  - At-risk students: Count + red badge
  - Average attendance: Percentage + trend icon (↑/↓)
  - Pending submissions: Count
  - Response time: Average (hours)
- **Actions**: "View Details" → Analytics page

**States**:
- **Loading**: Skeleton cards
- **Empty (First-time)**: Setup wizard
  - "Welcome to Faculty Portal!"
  - "Let's get you started..."
  - Steps: Complete profile, View courses, Mark first attendance
- **Error**: Retry button with error message

---

### 2. My Courses (`/courses`)

**Route**: `/courses`  
**Layout**: Grid or list view (toggle)

**Wireframe**:
```
┌─────────────────────────────────────────────────────────────┐
│ My Courses                                      [Grid] [List]│
├─────────────────────────────────────────────────────────────┤
│ [Search courses...]  [Term: Fall 2025 ▼] [Program ▼]        │
│ [Department ▼] [Section ▼]  [Sort: Name ▼]   Found: 4       │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│ │ CS101 Sec A  │ │ MA102 Sec B  │ │ CS201 Sec A  │         │
│ │ Intro to CS  │ │ Calculus II  │ │ Data Struct  │         │
│ │ 62 students  │ │ 58 students  │ │ 45 students  │         │
│ │ Next: 10:00  │ │ Next: 12:00  │ │ Next: Wed    │         │
│ │ Attendance:  │ │ Attendance:  │ │ Attendance:  │         │
│ │ 92% ████░    │ │ 88% ███░░    │ │ 95% █████    │         │
│ │ Pending: 5   │ │ Pending: 12  │ │ Pending: 0   │         │
│ │ [Actions ▼]  │ │ [Actions ▼]  │ │ [Actions ▼]  │         │
│ └──────────────┘ └──────────────┘ └──────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

**Components**:

#### Filter Bar
- **Search**: Text input, placeholder "Search by course code or name..."
- **Filters**:
  - Term/Semester dropdown (Fall 2025, Spring 2025, etc.)
  - Program dropdown (All, B.Tech, M.Tech, MBA, etc.)
  - Department dropdown (All, CSE, ECE, etc.)
  - Section dropdown (All, A, B, C, etc.)
- **Sort**: Dropdown (Name, Code, Next Class, Student Count)
- **Results Count**: "Found: 4 courses"
- **Clear Filters**: Button (appears when filters active)

#### Course Cards (Grid View)
Each card shows:
- **Header**: Course Code + Section (CS101 Sec A)
- **Title**: Course Name (Intro to Computer Science)
- **Stats**:
  - Student count: "62 students" with icon
  - Next class: "Next: Today 10:00 AM" or "Next: Wednesday"
  - Attendance rate: Percentage + progress bar (color-coded: Green >90%, Amber 80-90%, Red <80%)
  - Pending items: "Pending: 5 grades" with badge
- **Actions Dropdown**:
  - View Details
  - Mark Attendance
  - Post Materials
  - Grade Assignments
  - Send Announcement

**List View Alternative**:
```
┌─────────────────────────────────────────────────────────────┐
│ Code   │ Name          │ Section │ Students │ Next   │Actions│
├────────┼───────────────┼─────────┼──────────┼────────┼───────┤
│ CS101  │ Intro to CS   │ A       │ 62       │ 10:00  │ [···] │
│ MA102  │ Calculus II   │ B       │ 58       │ 12:00  │ [···] │
│ CS201  │ Data Struct   │ A       │ 45       │ Wed    │ [···] │
└─────────────────────────────────────────────────────────────┘
```

**States**:
- **Loading**: Skeleton cards (4-6 placeholders)
- **Empty**: 
  - "No courses assigned yet"
  - "Contact your department for course assignments"
  - Illustration + help link
- **No Results** (after filtering):
  - "No courses match your filters"
  - "Try adjusting your search criteria"
  - [Clear Filters] button

---

### 3. Course Details (`/courses/:id`)

**Route**: `/courses/CS101-A-FALL25`  
**Layout**: Tabs-based

**Wireframe**:
```
┌─────────────────────────────────────────────────────────────┐
│ CS101 - Introduction to Computer Science (Section A)        │
│ Fall 2025 • 62 Students • Room A-101                         │
│ [Mark Attendance] [Post Material] [Send Message]            │
├─────────────────────────────────────────────────────────────┤
│ [Overview] [Roster] [Syllabus] [Teaching Plan] [Analytics]  │
├─────────────────────────────────────────────────────────────┤
│  OVERVIEW TAB                                                │
│  ┌────────────────────┐ ┌────────────────────────────────┐  │
│  │ Course Info        │ │ Assessment Breakdown           │  │
│  │ • Credits: 4       │ │ [Pie Chart]                    │  │
│  │ • Type: Theory+Lab │ │ Quiz: 20%  Assignment: 30%     │  │
│  │ • Schedule:        │ │ Midterm: 20%  Final: 30%       │  │
│  │   Mon/Wed 10-12    │ │                                │  │
│  └────────────────────┘ └────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Recent Activity                                       │  │
│  │ • Oct 25: Attendance marked (60/62 present)           │  │
│  │ • Oct 24: Assignment 3 published                      │  │
│  │ • Oct 23: Lecture notes uploaded                      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Tab Details**:

#### Overview Tab
- Course description
- Learning outcomes (bullet list)
- Assessment breakdown (pie/donut chart)
- Schedule information
- Recent activity timeline
- Quick stats: Attendance rate, avg grade, submission rate

#### Roster Tab
- Searchable student list
- Columns: Roll No, Name, Email, Attendance %, Current Grade, Status
- Actions per student: View profile, Send message, View history
- Bulk actions: Export CSV, Send group message
- Filters: By attendance range, by grade range, at-risk only

#### Syllabus Tab
- Week-by-week breakdown
- Topics covered
- Readings/resources
- Milestones
- Editable (if faculty has permission)

#### Teaching Plan Tab
- Lesson plans by session
- Status: Completed, Upcoming, In Progress
- Attachments (slides, handouts)
- Notes (visible to faculty only)

#### Analytics Tab
- Attendance trends (line chart)
- Grade distribution (histogram)
- Topic-wise performance
- At-risk students list
- Engagement metrics

---

### 4. Mark Attendance (`/attendance/mark`)

**Route**: `/attendance/mark?course=CS101&date=2025-10-25`  
**Layout**: Full-width table with actions

**Online Mode Wireframe**:
```
┌─────────────────────────────────────────────────────────────┐
│ Mark Attendance                                              │
│ CS101 - Intro to CS (Sec A)  │  Oct 25, 2025  │  10:00-12:00│
│ Room: A-101  │  Enrolled: 62  │  Marked: 60  │  Pending: 2  │
├─────────────────────────────────────────────────────────────┤
│ [Present All] [Absent All] [Clear All]  Mode: [P] [A] [L] [E]│
│ [Search student...]  [Filter: All ▼]  [Sort: Roll No ▼]     │
├──────┬────────────────────┬──────────┬─────────────────────┤
│ □    │ Roll │ Name        │ Photo    │ Status    │ Notes   │
├──────┼──────┼─────────────┼──────────┼───────────┼─────────┤
│ ☑    │ 001  │ Anaya Kumar │ [Photo]  │ [Present ▼] │       │
│ ☑    │ 002  │ Bharat Patel│ [Photo]  │ [Absent ▼]  │ Sick  │
│ ☑    │ 003  │ Chitra Rao  │ [Photo]  │ [Present ▼] │       │
│ ...  │ ...  │ ...         │ ...      │ ...         │ ...   │
├─────────────────────────────────────────────────────────────┤
│ [< Prev Session] [Save Draft] [Save & Publish] [Next >]     │
└─────────────────────────────────────────────────────────────┘
```

**Features**:

#### Header Stats
- Course info with session time
- Live counters: Enrolled, Marked, Pending
- Visual progress: "60/62 marked (97%)"

#### Bulk Actions
- **Present All**: Mark all as present
- **Absent All**: Mark all as absent (confirmation required)
- **Clear All**: Reset all to unmarked
- **Keyboard Mode**: Toggle keyboard shortcuts (P/A/L/E keys)

#### Student List
- **Checkbox**: Select multiple students
- **Photo**: Student photo (fallback to initials)
- **Roll No**: Sortable
- **Name**: Sortable, clickable → student profile
- **Status Dropdown**: Present / Absent / Late / Excused
  - Color-coded badges
  - Keyboard shortcuts when enabled
- **Notes**: Optional text input (e.g., "Sick", "Interview")

#### Search & Filter
- Search: By name or roll number
- Filter: All / Present / Absent / Late / Excused / Unmarked
- Sort: Roll No, Name, Status

#### Save Actions
- **Save Draft**: Save without publishing (students don't see)
- **Save & Publish**: Finalize and notify students
- **Auto-save**: Every 30 seconds (draft mode)

**Offline Mode Wireframe**:
```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ OFFLINE MODE - Changes will sync when connection restored│
│ Local roster cached at: 09:52 AM  │  Sync queue: 0 pending  │
├─────────────────────────────────────────────────────────────┤
│ ... [Same attendance interface as online] ...                │
├─────────────────────────────────────────────────────────────┤
│ [Save Locally] [Sync Now] [View Sync Queue]                 │
└─────────────────────────────────────────────────────────────┘
```

**Offline Features**:
- Yellow banner indicating offline mode
- Data saved to IndexedDB
- Roster from cache (with timestamp)
- Manual "Sync Now" button (checks network)
- Sync queue counter showing pending operations
- Conflict resolution on reconnect (if needed)

**Conflict Resolution Modal** (appears when syncing):
```
┌─────────────────────────────────────────────────────────────┐
│ Attendance Conflict Detected                                 │
├─────────────────────────────────────────────────────────────┤
│ Student: Bharat Patel (002)                                  │
│ Date: Oct 25, 2025, 10:00 AM                                 │
│                                                              │
│ Your Device (Offline)        │  Server (Online)              │
│ Status: Absent               │  Status: Present              │
│ Time: 10:35 AM               │  Time: 10:32 AM               │
│ Device: Chrome on Windows    │  Device: Mobile App           │
│                                                              │
│ [Use Device] [Use Server] [Merge (requires approval)]        │
└─────────────────────────────────────────────────────────────┘
```

**Keyboard Shortcuts** (when enabled):
- `P`: Mark as Present
- `A`: Mark as Absent
- `L`: Mark as Late
- `E`: Mark as Excused
- `↓/↑`: Navigate students
- `Tab`: Move to next field
- `Ctrl+S`: Save draft
- `Ctrl+Enter`: Save & Publish

---

### 5. Edit Attendance (`/attendance/edit`)

**Route**: `/attendance/edit?course=CS101&date=2025-10-24`  
**Layout**: Similar to Mark Attendance with additional warnings

**Wireframe**:
```
┌─────────────────────────────────────────────────────────────┐
│ Edit Attendance                                              │
│ CS101 (Sec A)  │  Oct 24, 2025  │  Originally marked: 10:35AM│
├─────────────────────────────────────────────────────────────┤
│ ⏱️ Edit Window: 18 hours remaining (expires Oct 25, 10:00 AM)│
│                                                              │
│ ... [Attendance grid] ...                                    │
│                                                              │
│ Audit Trail:                                                 │
│ • Marked by: Prof. John Doe on Oct 24, 10:35 AM             │
│ • Last edited: Oct 24, 3:15 PM (corrected 2 entries)        │
├─────────────────────────────────────────────────────────────┤
│ Justification for edit (optional): [Text input...]          │
│ [Cancel] [Save Changes]                                      │
└─────────────────────────────────────────────────────────────┘
```

**Beyond Edit Window**:
```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ Edit Window Expired                                       │
│ This attendance record was marked more than 24 hours ago.    │
│ Editing requires approval from HOD/Principal.                │
│                                                              │
│ [Request Edit Approval]  [Cancel]                            │
└─────────────────────────────────────────────────────────────┘
```

**Approval Request Modal**:
```
┌─────────────────────────────────────────────────────────────┐
│ Request Attendance Edit Approval                             │
├─────────────────────────────────────────────────────────────┤
│ Course: CS101 (Sec A)                                        │
│ Date: Oct 24, 2025                                           │
│ Original mark time: Oct 24, 10:35 AM                         │
│ Current time: Oct 26, 2:00 PM (38 hours later)               │
│                                                              │
│ Justification (required): *                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Student provided medical certificate after 24h window   │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Supporting documents (optional):                             │
│ [Upload Files]  medical_cert.pdf (attached)                  │
│                                                              │
│ Proposed changes:                                            │
│ • Student 002 (Bharat Patel): Absent → Excused               │
│                                                              │
│ Approver: HOD (Dr. Sharma)                                   │
│                                                              │
│ [Cancel] [Submit Request]                                    │
└─────────────────────────────────────────────────────────────┘
```

---

### 6. Assessments List (`/assessments`)

**Route**: `/assessments?course=CS101`  
**Layout**: Table with filters

**Wireframe**:
```
┌─────────────────────────────────────────────────────────────┐
│ Assessments - CS101 (Sec A)                                  │
│ [+ New Assessment]  [Import Template]  [Export All]          │
├─────────────────────────────────────────────────────────────┤
│ [Search...]  [Type: All ▼] [Status: All ▼] [Sort: Due Date ▼]│
├──────────────────────────────────────────────────────────────┤
│ Title           │Type │Weight│Due Date│Status   │Submissions│
├─────────────────┼─────┼──────┼────────┼─────────┼───────────┤
│ Quiz 1          │Quiz │10%   │Oct 15  │Published│ 60/62     │
│ Assignment 1    │Asgn │15%   │Oct 22  │Published│ 58/62     │
│ Midterm Exam    │Exam │20%   │Nov 05  │Draft    │ 0/62      │
│ Project Phase 1 │Proj │10%   │Nov 15  │Draft    │ 0/62      │
└─────────────────────────────────────────────────────────────┘
```

**Each Row Actions** (... menu):
- View Details
- Edit (if draft or within edit window)
- Delete (if draft, requires confirmation)
- Grade Submissions
- View Analytics
- Duplicate
- Export Results

**Status Badges**:
- **Draft**: Gray badge, only visible to faculty
- **Published**: Green badge, visible to students
- **Grading**: Blue badge, submissions being graded
- **Completed**: Purple badge, all graded and published
- **Overdue**: Red badge, past due date

---

### 7. Create/Edit Assessment (`/assessments/create` or `/assessments/:id/edit`)

**Wireframe**:
```
┌─────────────────────────────────────────────────────────────┐
│ Create New Assessment                              [Save ▼]  │
├─────────────────────────────────────────────────────────────┤
│ Basic Information                                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Title: * [________________________]                     │ │
│ │ Type: * [Quiz ▼] [Quiz|Assignment|Exam|Project|Lab]    │ │
│ │ Description: [Rich text editor...]                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Grading Configuration                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Total Marks: [100]    Weight: [10] %                    │ │
│ │ Passing Threshold: [40] marks (40%)                     │ │
│ │ Grading Method: ( ) Manual  (•) Rubric  ( ) Auto (MCQ)  │ │
│ │                                                         │ │
│ │ Rubric Setup: [+ Add Criterion]                         │ │
│ │ ┌─ Criterion 1: Code Quality (40 marks)               ┐ │ │
│ │ │  Levels: Excellent(36-40) Good(30-35) Fair(20-29)   │ │ │
│ │ └────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Submission Settings                                          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Submission Type: [☑] Online  [☐] Offline  [☐] Both     │ │
│ │ File Types Allowed: [.pdf, .docx, .zip]  [Edit]        │ │
│ │ Max File Size: [10] MB                                  │ │
│ │ Due Date: [Oct 30, 2025] Time: [11:59 PM]              │ │
│ │ Late Submission: (•) Allowed  ( ) Not Allowed           │ │
│ │ Late Penalty: [-10] % per day, Max [3] days             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Attachments & Resources                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Upload Files]  question_paper.pdf, dataset.csv         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Visibility & Publishing                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Status: ( ) Draft  (•) Publish Now  ( ) Schedule        │ │
│ │ Notify Students: [☑] Email  [☑] In-app notification     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [Cancel] [Save as Draft] [Publish Assessment]                │
└─────────────────────────────────────────────────────────────┘
```

**Validation**:
- Title required
- Type required
- Total marks > 0
- Weight percentage (total across all assessments ≤ 100%)
- Due date must be future date
- At least one submission type selected

---

### 8. Gradebook (`/gradebook?course=CS101`)

**Route**: `/gradebook?course=CS101`  
**Layout**: Spreadsheet-style table

**Wireframe**:
```
┌─────────────────────────────────────────────────────────────┐
│ Gradebook - CS101 (Sec A)                                    │
│ [Import CSV] [Export CSV] [Export PDF] [Recalculate Totals] │
├─────────────────────────────────────────────────────────────┤
│ [View: Grid] [Rubric] [Student View]  Filter: [All ▼]       │
├──────┬───────┬─────┬─────┬──────┬──────┬───────┬──────────┤
│ Roll │ Name  │ Q1  │ A1  │ Mid  │ Proj │ Total │ Grade │ ✓│
│      │       │(10%)│(15%)│(20%) │(10%) │(100%) │       │  │
├──────┼───────┼─────┼─────┼──────┼──────┼───────┼───────┼──┤
│ 001  │ Anaya │ 9   │ 14  │ 48   │ 19   │ 90    │ A+    │ ☑│
│ 002  │Bharat │ 8   │ 12  │ 44   │ 18   │ 82    │ A     │ ☑│
│ 003  │Chitra │ 10  │ 15  │ 50   │ 20   │ 95    │ A+    │ ☑│
│ ...  │ ...   │ ... │ ... │ ...  │ ...  │ ...   │ ...   │  │
├──────┴───────┴─────┴─────┴──────┴──────┴───────┴───────┴──┤
│ Class Avg:    │ 8.5 │ 13.2│ 46.5 │ 18.5 │ 86.7  │ B+    │  │
│ Highest:      │ 10  │ 15  │ 50   │ 20   │ 95    │ A+    │  │
│ Lowest:       │ 6   │ 9   │ 38   │ 15   │ 68    │ C     │  │
└─────────────────────────────────────────────────────────────┘
│ [Publish Grades] [Apply Curve] [Download Reports]            │
└─────────────────────────────────────────────────────────────┘
```

**Features**:

#### Inline Editing
- Click cell → Edit mode
- Tab to move to next cell
- Enter to save and move down
- Validation: Must be ≤ max marks
- Color indicators: Red (below passing), Yellow (borderline), Green (good)

#### Bulk Actions
- Select multiple students (checkbox)
- Apply curve: Add % to all, cap at maximum
- Bulk comments: Add same comment to multiple students
- Export selected students only

#### Grade Calculation
- **Auto-calculate**: Total = Σ(assessment × weight)
- **Letter Grade**: Based on institutional scale
  - A+: 90-100
  - A: 80-89
  - B+: 70-79
  - B: 60-69
  - C: 50-59
  - F: <50
- **Custom Scale**: Faculty can override

#### Publish Grades
**Modal**:
```
┌─────────────────────────────────────────────────────────────┐
│ Publish Grades - Confirmation Required                       │
├─────────────────────────────────────────────────────────────┤
│ ⚠️ Publishing grades will:                                   │
│ • Make grades visible to students                            │
│ • Send notifications to all students                         │
│ • Lock grades (edits require approval)                       │
│ • Create audit trail                                         │
│                                                              │
│ Assessment: Assignment 1                                     │
│ Students graded: 58/62                                       │
│ Pending: 4 students (Roll: 015, 028, 041, 053)              │
│                                                              │
│ ⚠️ 4 students have no grades. Publish anyway?                │
│ ( ) Publish only graded students                             │
│ (•) Publish all (pending marked as 0)                        │
│                                                              │
│ 2FA Verification Required:                                   │
│ Enter code: [______]  [Resend Code]                          │
│                                                              │
│ [Cancel] [Confirm & Publish]                                 │
└─────────────────────────────────────────────────────────────┘
```

---

### 9. Grading Interface (`/assessments/:id/grade`)

**Route**: `/assessments/ASGN001/grade`  
**Layout**: Side-by-side submission viewer and grading panel

**Wireframe**:
```
┌─────────────────────────────────────────────────────────────┐
│ Grade: Assignment 1 - Introduction Essay                     │
│ Student: Anaya Kumar (001)   [15/62]   [< Prev] [Next >]    │
├──────────────────────────────┬──────────────────────────────┤
│ SUBMISSION VIEWER            │ GRADING PANEL                │
│                              │                              │
│ Submitted: Oct 22, 10:45 PM  │ Total Marks: 15              │
│ Status: On Time              │ Earned: [___] / 15           │
│                              │                              │
│ [PDF Viewer]                 │ Rubric Grading:              │
│ ┌──────────────────────────┐ │ ┌──────────────────────────┐│
│ │                          │ │ │ Content Quality (7 marks)││
│ │  [Document preview]      │ │ │ Excellent: (•) 6-7       ││
│ │                          │ │ │ Good:      ( ) 4-5       ││
│ │                          │ │ │ Fair:      ( ) 2-3       ││
│ │  ...                     │ │ │ Poor:      ( ) 0-1       ││
│ │                          │ │ │ Score: [7]               ││
│ │                          │ │ └──────────────────────────┘│
│ │                          │ │                              │
│ │                          │ │ ┌──────────────────────────┐│
│ └──────────────────────────┘ │ │ Writing Quality (5 marks)││
│                              │ │ ... similar ...          ││
│ [Download] [Plagiarism Check]│ └──────────────────────────┘│
│                              │                              │
│                              │ Feedback:                    │
│                              │ ┌──────────────────────────┐│
│                              │ │ Excellent work! Well     ││
│                              │ │ structured and clear...  ││
│                              │ │                          ││
│                              │ └──────────────────────────┘│
│                              │                              │
│                              │ Attachments:                 │
│                              │ [Upload Feedback File]       │
│                              │                              │
│                              │ [Save Draft] [Publish Grade] │
└──────────────────────────────┴──────────────────────────────┘
```

**Submission Viewer Features**:
- PDF viewer (built-in)
- Code viewer (syntax highlighting for .java, .py, etc.)
- Image viewer
- Video player
- Download button
- Plagiarism check integration (if available)
- View previous submissions (if resubmission allowed)

**Grading Panel Features**:
- Quick score input (top)
- Rubric-based grading (radio buttons or sliders)
- Auto-calculate total from rubric
- Rich text feedback editor
- Feedback templates (common comments dropdown)
- Attach feedback files (annotated PDFs, etc.)
- Save as draft (student doesn't see)
- Publish grade (student notified)

**Keyboard Shortcuts**:
- `Ctrl+→`: Next student
- `Ctrl+←`: Previous student
- `Ctrl+S`: Save draft
- `Ctrl+Enter`: Publish grade

---

### 10. Materials (`/materials?course=CS101`)

**Route**: `/materials?course=CS101`  
**Layout**: Hierarchical list with preview

**Wireframe**:
```
┌─────────────────────────────────────────────────────────────┐
│ Course Materials - CS101 (Sec A)                             │
│ [+ Upload] [+ New Folder] [+ Add Link]     [Grid] [List]    │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────┐│
│ │ 📁 Week 1: Introduction to Programming                   ││
│ │   📄 Lecture_1_Slides.pdf (v2) - Oct 20  [↓ 58/62]      ││
│ │   📄 Lab_1_Instructions.docx - Oct 21     [↓ 60/62]      ││
│ │   🔗 Python Installation Guide (external) [↗ 55 clicks]  ││
│ │   📝 Quick Reference Sheet.md             [👁️ View]       ││
│ └──────────────────────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────────────────────┐│
│ │ 📁 Week 2: Variables and Data Types                      ││
│ │   📄 Lecture_2_Slides.pdf - Oct 23        [↓ 45/62]      ││
│ │   🎥 Data Types Demo.mp4 - Oct 24         [▶️ 38/62]      ││
│ └──────────────────────────────────────────────────────────┘│
│ ┌──────────────────────────────────────────────────────────┐│
│ │ 📁 Week 3: Control Flow (Upcoming - Hidden from students)││
│ │   📄 Lecture_3_Slides.pdf (Draft)                        ││
│ └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**Upload Material Modal**:
```
┌─────────────────────────────────────────────────────────────┐
│ Upload Course Material                                       │
├─────────────────────────────────────────────────────────────┤
│ Title: * [__________________________________]                │
│ Description: [Optional description...]                       │
│                                                              │
│ Folder/Topic: [Week 2: Variables ▼]   [+ New Folder]        │
│                                                              │
│ File Upload:                                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │  Drag and drop files here or [Browse]                   │ │
│ │  Accepted: PDF, DOC, PPT, Video, Images (Max 50MB)      │ │
│ └─────────────────────────────────────────────────────────┘ │
│ Uploaded: lecture_slides.pdf (2.3 MB) [✓]                    │
│                                                              │
│ Visibility:                                                  │
│ (•) Publish Now  ( ) Schedule  ( ) Hidden (faculty only)     │
│ Schedule date: [Oct 25, 2025] Time: [08:00 AM]              │
│                                                              │
│ Tags (optional): [programming, basics, variables]           │
│                                                              │
│ Notify Students: [☑] Email  [☑] In-app notification          │
│                                                              │
│ [Cancel] [Upload]                                            │
└─────────────────────────────────────────────────────────────┘
```

**Material Actions** (... menu):
- View/Download
- Edit details
- Move to folder
- Duplicate
- Upload new version (maintains version history)
- View analytics (views, downloads)
- Share link
- Archive (hides from students, keeps for records)
- Delete (confirmation required)

**Version History** (when clicking version indicator):
```
┌─────────────────────────────────────────────────────────────┐
│ Version History - Lecture_1_Slides.pdf                       │
├─────────────────────────────────────────────────────────────┤
│ v2 (Current) - Oct 20, 2025, 10:30 AM                        │
│ • Uploaded by: Prof. John Doe                                │
│ • Size: 2.3 MB                                               │
│ • Change notes: Fixed typo on slide 15, added example        │
│ • Downloads: 58/62 students                                  │
│ [Download] [View] [Restore as Current]                       │
│                                                              │
│ v1 - Oct 15, 2025, 3:00 PM                                   │
│ • Uploaded by: Prof. John Doe                                │
│ • Size: 2.1 MB                                               │
│ • Change notes: Initial version                              │
│ • Downloads: 50/62 students                                  │
│ [Download] [View] [Restore as Current]                       │
└─────────────────────────────────────────────────────────────┘
```

---

### 11. Timetable (`/timetable`)

**Route**: `/timetable`  
**Layout**: Weekly calendar view

**Wireframe**:
```
┌─────────────────────────────────────────────────────────────┐
│ My Timetable                Week: Oct 21-25, 2025  [< | >]   │
│ [Week View] [Day View] [Month View]   [Export to Calendar]  │
├──────────┬────────┬────────┬────────┬────────┬────────┬─────┤
│ Time     │ Mon    │ Tue    │ Wed    │ Thu    │ Fri    │ Sat │
├──────────┼────────┼────────┼────────┼────────┼────────┼─────┤
│ 08:00-09:00│      │        │        │        │        │     │
│ 09:00-10:00│      │ CS101  │        │ CS101  │        │     │
│          │        │ Rm A   │        │ Rm A   │        │     │
│ 10:00-12:00│CS101 │        │ CS201  │        │ CS201  │     │
│          │ Rm A  │        │ Lab 1  │        │ Lab 1  │     │
│ 12:00-13:00│      │        │        │        │        │     │
│ 13:00-15:00│      │ MA102  │        │ MA102  │        │     │
│          │        │ Rm B   │        │ Rm B   │        │     │
│ 15:00-17:00│Office│        │ Office │        │ Office │     │
│          │ Hours │        │ Hours  │        │ Hours  │     │
└──────────┴────────┴────────┴────────┴────────┴────────┴─────┘
│ [Request Substitution] [Request Swap] [View Substitutes]     │
└─────────────────────────────────────────────────────────────┘
```

**Class Cell Details** (on click):
```
┌─────────────────────────────────────────────────────────────┐
│ Class Details                                                │
├─────────────────────────────────────────────────────────────┤
│ Course: CS101 - Intro to Computer Science (Sec A)           │
│ Time: Monday, 10:00 AM - 12:00 PM                            │
│ Room: A-101 (Building A, Floor 1)                            │
│ Students: 62                                                 │
│                                                              │
│ Quick Actions:                                               │
│ [Mark Attendance] [Post Material] [Send Announcement]        │
│                                                              │
│ Options:                                                     │
│ [Request Substitution] [Request Room Change] [Cancel Class]  │
│ [View Class History]                                         │
│                                                              │
│ [Close]                                                      │
└─────────────────────────────────────────────────────────────┘
```

**Request Substitution Modal**:
```
┌─────────────────────────────────────────────────────────────┐
│ Request Substitution                                         │
├─────────────────────────────────────────────────────────────┤
│ Class: CS101 (Sec A) - Mon, Oct 28, 10:00-12:00 AM          │
│ Reason: [Leave/Conference/Personal/Other ▼]                 │
│                                                              │
│ Details:                                                     │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Attending conference...                                 │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Suggested Substitutes (based on availability):              │
│ (•) Prof. Jane Smith (CSE Dept) - Available, Same subject   │
│ ( ) Prof. Ahmed Ali (CSE Dept) - Available                  │
│ ( ) Other: [Select from dropdown ▼]                         │
│                                                              │
│ Teaching Plan & Materials:                                   │
│ [☑] Share lecture slides                                     │
│ [☑] Share attendance roster                                  │
│ [☐] Grant grading access                                     │
│                                                              │
│ Notes for Substitute:                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Please cover topics from slides 15-30...                │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [Cancel] [Submit Request]                                    │
└─────────────────────────────────────────────────────────────┘
```

---

### 12. Messages (`/messages`)

**Route**: `/messages`  
**Layout**: Inbox-style with conversation view

**Wireframe**:
```
┌─────────────────────────────────────────────────────────────┐
│ Messages                                                     │
│ [Compose] [Announcements]                     [Search...]   │
├────────────────────┬────────────────────────────────────────┤
│ INBOX (3 Unread)   │ Conversation: Bharat Patel (002)      │
│                    │                                        │
│ ● Bharat Patel     │ Bharat Patel                  Oct 24  │
│   Assignment query │ Hello Sir, I have a question...       │
│   Oct 24, 3:30 PM  │                                        │
│                    │ You (Prof. John)              Oct 24  │
│ ● Chitra Rao       │ Hi Bharat, sure! What's your...       │
│   Attendance       │                                        │
│   Oct 23, 10:15 AM │ Bharat Patel                  Oct 25  │
│                    │ Thank you! About problem 5...          │
│ ○ Admin Office     │                                        │
│   Room change      │ ┌──────────────────────────────────┐  │
│   Oct 22           │ │ [Type your message...]           │  │
│                    │ │                                  │  │
│ ○ Anaya Kumar      │ │ [Attach] [Template ▼]   [Send]  │  │
│   Grade inquiry    │ └──────────────────────────────────┘  │
│   Oct 21           │                                        │
└────────────────────┴────────────────────────────────────────┘
```

**Compose Message Modal**:
```
┌─────────────────────────────────────────────────────────────┐
│ New Message                                                  │
├─────────────────────────────────────────────────────────────┤
│ To: [Search student by name or roll number...] [+ Add]      │
│ Selected: Bharat Patel (002) [x]                             │
│                                                              │
│ Course Context: [CS101 - Intro to CS ▼]  (optional)         │
│                                                              │
│ Template: [None ▼]  [Assessment Reminder|Feedback|Etc.]     │
│                                                              │
│ Subject: [_______________________________________]           │
│                                                              │
│ Message: *                                                   │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Rich text editor with formatting options]              │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Attachments: [Upload Files]                                 │
│ assignment_feedback.pdf (attached) [x]                       │
│                                                              │
│ Options:                                                     │
│ [☐] Request read receipt                                     │
│ [☐] CC to HOD                                                │
│ [☐] Mark as urgent                                           │
│                                                              │
│ [Cancel] [Save Draft] [Send]                                 │
└─────────────────────────────────────────────────────────────┘
```

**Announcements Tab**:
```
┌─────────────────────────────────────────────────────────────┐
│ Class Announcements                       [+ New Announcement]│
├─────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────────┐│
│ │ 📢 Quiz 2 Reminder - CS101 (Sec A)                       ││
│ │ Posted: Oct 25, 9:00 AM  •  Sent to: 62 students        ││
│ │ Reminder: Quiz 2 scheduled for Oct 30. Topics: Ch 3-5... ││
│ │ [View Details] [Edit] [Resend] [Delete]                  ││
│ └───────────────────────────────────────────────────────────┘│
│ ┌───────────────────────────────────────────────────────────┐│
│ │ 📢 Class Cancelled - MA102 (Sec B)                       ││
│ │ Posted: Oct 24, 8:00 AM  •  Sent to: 58 students        ││
│ │ Today's class is cancelled due to faculty meeting...     ││
│ │ [View Details] [Edit] [Delete]                           ││
│ └───────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

### 13. Leaves & Substitution (`/leaves`)

**Route**: `/leaves`  
**Layout**: Tabs for My Leaves and Substitute Assignments

**Wireframe**:
```
┌─────────────────────────────────────────────────────────────┐
│ Leaves & Substitution                                        │
│ [+ Request Leave]        [My Leaves] [Substitute Assignments]│
├─────────────────────────────────────────────────────────────┤
│ MY LEAVES TAB                                                │
│ [Filter: All ▼] [Status: All ▼] [Date Range ▼]              │
├─────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────────┐│
│ │ Leave Request #2025-10-001                   🟡 Pending  ││
│ │ Dates: Nov 1-3, 2025 (3 days)                            ││
│ │ Type: Conference                                          ││
│ │ Reason: Attending IEEE Conference                         ││
│ │ Submitted: Oct 24, 2025                                   ││
│ │ Approver: Dr. Sharma (HOD)                                ││
│ │ Affected Classes: 6 classes                               ││
│ │ Substitute: Prof. Jane Smith (Requested)                  ││
│ │ [View Details] [Cancel Request] [Track Status]            ││
│ └───────────────────────────────────────────────────────────┘│
│ ┌───────────────────────────────────────────────────────────┐│
│ │ Leave Request #2025-09-015                   🟢 Approved ││
│ │ Dates: Oct 18, 2025 (1 day)                              ││
│ │ Type: Personal                                            ││
│ │ Approved by: Dr. Sharma on Oct 15, 2025                   ││
│ │ Substitute: Prof. Ahmed Ali (Confirmed)                   ││
│ │ [View Details] [Download Approval]                        ││
│ └───────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**Request Leave Modal**:
```
┌─────────────────────────────────────────────────────────────┐
│ Request Leave                                                │
├─────────────────────────────────────────────────────────────┤
│ Leave Type: * [Conference/Personal/Medical/Casual ▼]        │
│                                                              │
│ Dates: *                                                     │
│ From: [Nov 1, 2025]  To: [Nov 3, 2025]  (3 days)            │
│                                                              │
│ Reason: *                                                    │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Attending IEEE International Conference on AI...        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Supporting Documents:                                        │
│ [Upload Files]  conference_invitation.pdf (attached) [x]     │
│                                                              │
│ Affected Classes:                                            │
│ ✓ CS101 (Sec A) - Nov 1, 10:00-12:00                        │
│ ✓ MA102 (Sec B) - Nov 1, 13:00-15:00                        │
│ ✓ CS101 (Sec A) - Nov 2, 10:00-12:00                        │
│ ... (6 classes total)                                        │
│                                                              │
│ Substitute Faculty:                                          │
│ System Suggestions (based on availability & expertise):      │
│ (•) Prof. Jane Smith (CSE) - Available, taught CS101 before │
│ ( ) Prof. Ahmed Ali (CSE) - Available                        │
│ ( ) Manual Selection: [Choose ▼]                             │
│                                                              │
│ Permissions for Substitute:                                  │
│ [☑] View course materials                                    │
│ [☑] Mark attendance                                          │
│ [☐] Grade assessments                                        │
│ [☐] Modify course content                                    │
│                                                              │
│ Notes for Substitute (optional):                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Please cover Chapter 5 topics. Slides are uploaded...   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Approver: Dr. Rajesh Sharma (HOD, CSE)                       │
│                                                              │
│ [Cancel] [Save Draft] [Submit Request]                       │
└─────────────────────────────────────────────────────────────┘
```

**Substitute Assignments Tab**:
```
┌─────────────────────────────────────────────────────────────┐
│ SUBSTITUTE ASSIGNMENTS TAB                                   │
│ Classes where you're assigned as substitute                  │
├─────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────────┐│
│ │ CS201 (Sec B) - Substituting for Prof. David Miller      ││
│ │ Dates: Oct 28-30, 2025 (3 days)                          ││
│ │ Reason: Medical Leave                                     ││
│ │ Classes: 4 classes                                        ││
│ │ Status: 🟢 Accepted                                       ││
│ │ [View Teaching Plan] [Access Materials] [Mark Attendance] ││
│ └───────────────────────────────────────────────────────────┘│
│ ┌───────────────────────────────────────────────────────────┐│
│ │ MA105 (Sec A) - Substituting for Prof. Sarah Johnson     ││
│ │ Date: Nov 5, 2025 (1 day)                                ││
│ │ Reason: Conference                                        ││
│ │ Classes: 2 classes                                        ││
│ │ Status: 🟡 Pending Response                               ││
│ │ [Accept] [Decline] [View Details]                         ││
│ └───────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

### 14. Exams & Duties (`/exams`)

**Route**: `/exams`  
**Layout**: List with filtering

**Wireframe**:
```
┌─────────────────────────────────────────────────────────────┐
│ Exam Duties & Invigilation                                   │
│ [Filter: All ▼] [Status: All ▼] [Sort: Date ▼]              │
├─────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────────┐│
│ │ 📋 Midterm Examination - CS Department                    ││
│ │ Date: Nov 10, 2025  •  Time: 09:00 AM - 12:00 PM         ││
│ │ Venue: Exam Hall A  •  Students: 120                      ││
│ │ Role: Invigilator  •  Co-invigilator: Prof. Jane Smith   ││
│ │ Status: 🟡 Pending Acknowledgment                         ││
│ │ [Acknowledge] [Decline] [View Details]                    ││
│ └───────────────────────────────────────────────────────────┘│
│ ┌───────────────────────────────────────────────────────────┐│
│ │ 📋 Final Examination - Mathematics                        ││
│ │ Date: Dec 5, 2025  •  Time: 02:00 PM - 05:00 PM          ││
│ │ Venue: Exam Hall C  •  Students: 90                       ││
│ │ Role: Chief Invigilator                                   ││
│ │ Status: 🟢 Acknowledged                                   ││
│ │ [View Duty Details] [Report Incident] [Submit Report]     ││
│ └───────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

**Acknowledge Duty Modal**:
```
┌─────────────────────────────────────────────────────────────┐
│ Acknowledge Exam Duty                                        │
├─────────────────────────────────────────────────────────────┤
│ Examination: Midterm - CS Department                         │
│ Date: Nov 10, 2025                                           │
│ Time: 09:00 AM - 12:00 PM                                    │
│ Venue: Exam Hall A                                           │
│ Role: Invigilator                                            │
│                                                              │
│ Responsibilities:                                            │
│ • Verify student identity and seating arrangement            │
│ • Distribute question papers at 09:15 AM sharp               │
│ • Monitor students for malpractice                           │
│ • Collect answer scripts at 12:00 PM                         │
│ • Submit signed attendance and incident report (if any)      │
│                                                              │
│ Conflicts:                                                   │
│ ⚠️ You have CS101 class scheduled at 10:00 AM on this day    │
│ (Automatic substitution will be arranged)                    │
│                                                              │
│ ( ) I acknowledge and accept this duty                       │
│                                                              │
│ [Cancel] [Acknowledge Duty]                                  │
└─────────────────────────────────────────────────────────────┘
```

**Report Incident Modal**:
```
┌─────────────────────────────────────────────────────────────┐
│ Report Exam Incident                                         │
├─────────────────────────────────────────────────────────────┤
│ Examination: Midterm - CS Department                         │
│ Date: Nov 10, 2025  •  Time: 10:45 AM                        │
│ Reported by: Prof. John Doe                                  │
│                                                              │
│ Incident Type: * [Malpractice/Medical/Technical/Other ▼]    │
│                                                              │
│ Student Involved (if applicable):                            │
│ Roll No: [015]  Name: [Auto-filled from roster]             │
│                                                              │
│ Incident Description: *                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Student caught with unauthorized notes hidden in...     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Actions Taken:                                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Confiscated notes, warned student, allowed to continue  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Evidence (photos, documents):                                │
│ [Upload Files]  evidence_photo.jpg (attached) [x]            │
│                                                              │
│ Witnesses:                                                   │
│ • Prof. Jane Smith (Co-invigilator)                          │
│ [+ Add Witness]                                              │
│                                                              │
│ Severity: ( ) Minor  (•) Moderate  ( ) Severe                │
│                                                              │
│ [Cancel] [Save Draft] [Submit Report]                        │
└─────────────────────────────────────────────────────────────┘
```

---

### 15. Analytics (`/analytics`)

**Route**: `/analytics`  
**Layout**: Dashboard with multiple chart widgets

**Wireframe**:
```
┌─────────────────────────────────────────────────────────────┐
│ Teaching Analytics                                           │
│ [Course: All ▼] [Term: Fall 2025 ▼] [Date Range: Semester ▼]│
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────────────┐ ┌────────────────────────────────┐ │
│ │ Attendance Trends    │ │ Grade Distribution             │ │
│ │ [Line Chart]         │ │ [Histogram]                    │ │
│ │ CS101: 92% avg       │ │ A+: 12  A: 18  B+: 20  B: 8    │ │
│ │ MA102: 88% avg       │ │ C: 4    F: 0                   │ │
│ └──────────────────────┘ └────────────────────────────────┘ │
│ ┌──────────────────────┐ ┌────────────────────────────────┐ │
│ │ Assessment Performance│ │ Submission Timeliness          │ │
│ │ [Bar Chart]          │ │ [Donut Chart]                  │ │
│ │ Quiz1: 8.5/10        │ │ On-time: 85%  Late: 10%        │ │
│ │ Assgn1: 13.2/15      │ │ Missing: 5%                    │ │
│ └──────────────────────┘ └────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ At-Risk Students (5)                                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Roll │ Name     │ Attendance │ Avg Grade │ Risk Level  │ │
│ ├──────┼──────────┼────────────┼───────────┼─────────────┤ │
│ │ 015  │ Name     │ 65% ⚠️     │ 42% ⚠️    │ 🔴 High     │ │
│ │ 028  │ Name     │ 78% ⚠️     │ 55%       │ 🟡 Medium   │ │
│ │ ...  │ ...      │ ...        │ ...       │ ...         │ │
│ │ [Send Intervention] [Schedule Meeting] [Export List]    │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Student Detail Analytics** (click on at-risk student):
```
┌─────────────────────────────────────────────────────────────┐
│ Student Analytics - Bharat Patel (002)                       │
├─────────────────────────────────────────────────────────────┤
│ Course: CS101 (Sec A)                                        │
│ Overall: 🟢 Good Standing                                    │
├─────────────────────────────────────────────────────────────┤
│ Attendance History                                           │
│ [Calendar Heatmap showing present/absent/late days]          │
│ Current: 92% (57/62 classes)                                 │
│ Trend: ↗️ Improving                                          │
│                                                              │
│ Grade Progression                                            │
│ [Line Chart showing grades over assessments]                 │
│ Quiz 1: 8/10  →  Assign 1: 12/15  →  Mid: 44/50             │
│ Trend: ↗️ Improving                                          │
│                                                              │
│ Submission Behavior                                          │
│ On-time: 80% (8/10)  •  Late: 20% (2/10)  •  Missing: 0%    │
│                                                              │
│ Engagement Metrics                                           │
│ Material Access: 95% (views materials regularly)             │
│ Message Response: 90% (responds within 24h)                  │
│                                                              │
│ Faculty Actions:                                             │
│ Last message: Oct 20 (Follow-up on assignment)               │
│ Last meeting: Oct 15 (Office hours)                          │
│                                                              │
│ [Send Message] [Schedule Meeting] [Add Note] [Export Report] │
└─────────────────────────────────────────────────────────────┘
```

---

### 16. Settings (`/settings`)

**Route**: `/settings`  
**Layout**: Tabbed settings page

**Wireframe**:
```
┌─────────────────────────────────────────────────────────────┐
│ Settings                                                     │
│ [Profile] [Security] [Notifications] [Preferences] [Help]   │
├─────────────────────────────────────────────────────────────┤
│ PROFILE TAB                                                  │
│ ┌──────────────┐                                             │
│ │  [Photo]     │  Prof. John Doe                             │
│ │  [Change]    │  Faculty ID: FAC001                         │
│ └──────────────┘  Department: Computer Science               │
│                   Email: john.doe@institution.edu            │
│                                                              │
│ Personal Information                                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Full Name: * [John Michael Doe_______________]          │ │
│ │ Phone: [+1-555-0123____________]                        │ │
│ │ Office: [Room 204, CSE Block___]                        │ │
│ │ Office Hours: [Mon/Wed 3-5 PM___]                       │ │
│ │ Bio: [Textarea for faculty bio...]                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Academic Information                                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Designation: Associate Professor                         │ │
│ │ Specialization: Artificial Intelligence, Machine Learning│ │
│ │ Qualifications: Ph.D. Computer Science (MIT, 2015)      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [Cancel] [Save Changes]                                      │
└─────────────────────────────────────────────────────────────┘
```

**Security Tab**:
```
┌─────────────────────────────────────────────────────────────┐
│ SECURITY TAB                                                 │
│                                                              │
│ Password                                                     │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Current Password: * [____________]                      │ │
│ │ New Password: * [____________]                          │ │
│ │ Confirm Password: * [____________]                      │ │
│ │ [Change Password]                                       │ │
│ │ Last changed: Oct 1, 2025                               │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Two-Factor Authentication (2FA)                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Status: 🟢 Enabled (TOTP via Google Authenticator)      │ │
│ │ Enrolled: Sep 15, 2025                                  │ │
│ │ Backup Codes: 7 remaining (out of 10)                   │ │
│ │ [View Backup Codes] [Regenerate] [Disable 2FA]          │ │
│ │ [Add SMS Backup]                                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Active Sessions                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 🖥️ This device - Chrome on Windows (Current)            │ │
│ │    Last active: Just now  •  Location: Campus WiFi      │ │
│ │                                                         │ │
│ │ 📱 Mobile - iPhone 12                                   │ │
│ │    Last active: 2 hours ago  •  Location: Home          │ │
│ │    [Revoke Session]                                     │ │
│ │                                                         │ │
│ │ 🖥️ Office Desktop - Firefox on Linux                    │ │
│ │    Last active: Yesterday  •  Location: Office          │ │
│ │    [Revoke Session]                                     │ │
│ │                                                         │ │
│ │ [Revoke All Other Sessions]                             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Login History                                                │
│ [View Last 30 Days] [Export Login History]                  │
└─────────────────────────────────────────────────────────────┘
```

**Notifications Tab**:
```
┌─────────────────────────────────────────────────────────────┐
│ NOTIFICATIONS TAB                                            │
│                                                              │
│ Email Notifications                                          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [☑] Student submissions (immediate)                      │ │
│ │ [☑] Grade publication reminders (daily digest at 9 AM)  │ │
│ │ [☑] Attendance reminders (30 min after class)           │ │
│ │ [☑] Leave approval status (immediate)                   │ │
│ │ [☑] Exam duty assignments (weekly digest)               │ │
│ │ [☐] System updates and maintenance                      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ In-App Notifications                                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [☑] Student messages (real-time)                        │ │
│ │ [☑] Regrade requests (real-time)                        │ │
│ │ [☑] Course announcements (immediate)                    │ │
│ │ [☑] System alerts (immediate)                           │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ SMS Notifications (if enabled)                               │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [☑] Urgent system alerts only                           │ │
│ │ [☐] Exam duty reminders (1 day before)                  │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Quiet Hours (Do Not Disturb)                                 │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [☑] Enable quiet hours                                  │ │
│ │ From: [10:00 PM] To: [08:00 AM]                         │ │
│ │ Days: [☑] Mon [☑] Tue [☑] Wed [☑] Thu [☑] Fri          │ │
│ │       [☑] Sat [☑] Sun                                   │ │
│ │ (Urgent notifications will still come through)          │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [Save Preferences]                                           │
└─────────────────────────────────────────────────────────────┘
```

**Preferences Tab**:
```
┌─────────────────────────────────────────────────────────────┐
│ PREFERENCES TAB                                              │
│                                                              │
│ Appearance                                                   │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Theme: (•) Light  ( ) Dark  ( ) Auto (system)           │ │
│ │ Language: [English ▼]                                   │ │
│ │ Font Size: ( ) Small  (•) Medium  ( ) Large             │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Default Views                                                │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Course List View: ( ) Grid  (•) List                    │ │
│ │ Timetable View: (•) Week  ( ) Day  ( ) Month            │ │
│ │ Gradebook View: (•) Grid  ( ) Rubric                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Attendance Settings                                          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [☑] Enable offline mode by default                      │ │
│ │ [☑] Auto-sync when network available                    │ │
│ │ [☑] Show student photos in attendance                   │ │
│ │ [☑] Enable keyboard shortcuts (P/A/L/E)                 │ │
│ │ Default status: (•) Present  ( ) Unmarked               │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ Grading Preferences                                          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Default passing threshold: [40] %                       │ │
│ │ [☑] Show grade distribution in gradebook                │ │
│ │ [☑] Highlight at-risk students (< 50%)                  │ │
│ │ Rounding: ( ) No rounding  (•) Round to integer         │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [Reset to Defaults] [Save Preferences]                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Interaction Patterns

### Navigation Patterns

1. **Breadcrumb Navigation**
   - Always visible in header
   - Shows path: Dashboard > My Courses > CS101 > Attendance
   - Each segment clickable (except current page)
   - Auto-truncates long paths with "..."

2. **Deep Linking**
   - All pages have shareable URLs
   - State preserved in URL parameters
   - Example: `/attendance/mark?course=CS101&date=2025-10-25&section=A`

3. **Back/Forward Support**
   - Browser back button works as expected
   - State restored from history

4. **Quick Actions**
   - Context-sensitive shortcuts on every page
   - Example: On course page, show "Mark Attendance", "Post Material"

### Form Patterns

1. **Auto-Save**
   - Forms auto-save to draft every 30 seconds
   - "Saving..." indicator appears briefly
   - "Last saved: 2 minutes ago" timestamp

2. **Validation**
   - Inline validation on blur
   - Real-time for critical fields (e.g., email format)
   - Summary of errors at top of form
   - Scroll to first error on submit

3. **Multi-Step Forms**
   - Progress indicator at top
   - Can navigate between steps
   - Save draft at any step
   - Data persists across steps

4. **Confirmation Dialogs**
   - For destructive actions (delete, cancel)
   - Clear primary/secondary buttons
   - Option to "Don't ask again" for non-critical

### Loading Patterns

1. **Skeleton Screens**
   - On initial page load
   - Match layout of actual content
   - Animated pulse effect

2. **Progressive Loading**
   - Critical content first (above-fold)
   - Lazy-load below-fold content
   - Infinite scroll for long lists

3. **Button Loading States**
   - Spinner replaces button text
   - Button disabled during action
   - Success/error feedback after completion

### Empty States

1. **No Data**
   - Friendly illustration
   - Helpful message: "No courses assigned yet"
   - Call-to-action: "Contact your department"

2. **No Results (Search/Filter)**
   - "No results found for 'query'"
   - Suggestions: "Try different keywords"
   - [Clear Filters] button

3. **First-Time Setup**
   - Welcome message
   - Quick tour/tutorial
   - Sample data (optional)

### Error States

1. **Inline Errors**
   - Red text below field
   - Icon indicator
   - Clear, actionable message

2. **Form-Level Errors**
   - Alert box at top
   - List of errors with links to fields
   - Scroll to first error

3. **Page-Level Errors**
   - Full-page error message (for 404, 500)
   - Retry button
   - Link to home/help

4. **Network Errors**
   - Offline banner (persistent)
   - "Retry" button on failed actions
   - Queue pending operations

---

## State Management

### Frontend State (Zustand)

**Auth Store**:
```typescript
interface AuthState {
  user: Faculty | null;
  token: string | null;
  isAuthenticated: boolean;
  permissions: string[];
  login: (credentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}
```

**Attendance Store**:
```typescript
interface AttendanceState {
  attendanceRecords: AttendanceRecord[];
  offlineQueue: OfflineOperation[];
  isOnline: boolean;
  markAttendance: (record) => Promise<void>;
  syncOfflineRecords: () => Promise<void>;
  resolveConflict: (conflict) => void;
}
```

**Course Store**:
```typescript
interface CourseState {
  courses: Course[];
  selectedCourse: Course | null;
  loading: boolean;
  fetchCourses: () => Promise<void>;
  selectCourse: (id) => void;
}
```

### Offline Persistence (IndexedDB)

**Schema**:
```javascript
const db = await openDB('faculty-portal', 1, {
  upgrade(db) {
    // Attendance records
    db.createObjectStore('attendance', { keyPath: 'id' });
    
    // Course rosters (cached)
    db.createObjectStore('rosters', { keyPath: 'courseId' });
    
    // Offline queue
    db.createObjectStore('offline_queue', { keyPath: 'id', autoIncrement: true });
    
    // Draft data
    db.createObjectStore('drafts', { keyPath: 'id' });
  }
});
```

### Sync Strategy

1. **Auto-Sync** (when online):
   - Check offline queue every 30 seconds
   - Sync pending operations in order
   - Retry failed operations (max 3 attempts)

2. **Manual Sync**:
   - "Sync Now" button in offline banner
   - Shows progress: "Syncing 3/5 records..."
   - Success/error notification per record

3. **Conflict Resolution**:
   - Detect conflicts (same record modified online and offline)
   - Show side-by-side comparison
   - Faculty chooses: Use local, Use server, or Merge
   - Log resolution in audit trail

---

## Responsive Design

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: ≥ 1024px
- **Large Desktop**: ≥ 1440px

### Mobile Adaptations

1. **Navigation**:
   - Hamburger menu (left sidebar collapses)
   - Bottom navigation bar (optional)
   - Swipe gestures (back/forward)

2. **Tables**:
   - Convert to cards on mobile
   - Horizontal scroll for essential columns
   - Accordion rows for details

3. **Forms**:
   - Stack fields vertically
   - Larger tap targets (min 44x44px)
   - Native mobile inputs (date picker, file upload)

4. **Attendance**:
   - Swipe left/right for status
   - Quick action buttons (P/A/L/E) below name
   - Floating action button for "Save"

### Touch Interactions

- Tap: Select, open
- Long-press: Context menu
- Swipe: Navigate, delete
- Pinch: Zoom (for charts, images)

---

## Accessibility

### WCAG 2.1 AA Compliance

1. **Keyboard Navigation**:
   - All actions accessible via keyboard
   - Tab order logical
   - Focus indicators visible
   - Skip links ("Skip to content")

2. **Screen Readers**:
   - Semantic HTML (headings, landmarks, lists)
   - Alt text for images
   - ARIA labels for icons, buttons
   - Live regions for dynamic updates

3. **Color Contrast**:
   - Text: 4.5:1 ratio minimum
   - Large text (18pt+): 3:1 ratio
   - Interactive elements: 3:1 ratio

4. **Form Accessibility**:
   - Labels associated with inputs
   - Error messages linked to fields
   - Required fields indicated
   - Help text for complex inputs

5. **Content Structure**:
   - One H1 per page
   - Proper heading hierarchy
   - Descriptive link text (no "click here")
   - Tables with headers

### Assistive Technology

- **Keyboard Shortcuts**: Documented in Help section
- **Voice Control**: All actions voice-command compatible
- **Screen Magnification**: Layout doesn't break at 200% zoom
- **High Contrast Mode**: Tested in Windows High Contrast

---

**Document Version**: 2.0  
**Last Updated**: October 25, 2025  
**Maintained By**: Faculty Portal UX Team
