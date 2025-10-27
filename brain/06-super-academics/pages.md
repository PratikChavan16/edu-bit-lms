# Super Academics Portal - UI Pages Specification

## Overview
Comprehensive UI specification for the Super Academics portal - a cross-college academic management system that provides centralized oversight, curriculum standardization, exam management, and academic analytics across all colleges in the EduBit network.

## Design System

### Color Palette
```css
/* Primary Colors - Academic Blue Theme */
--primary: #1E40AF;           /* Deep Academic Blue */
--primary-foreground: #FFFFFF;
--primary-hover: #1E3A8A;
--primary-light: #DBEAFE;

/* Secondary Colors */
--secondary: #7C3AED;         /* Purple for analytics */
--secondary-foreground: #FFFFFF;
--accent: #10B981;            /* Green for approvals */
--accent-foreground: #FFFFFF;

/* Semantic Colors */
--success: #10B981;           /* Approvals, Success */
--warning: #F59E0B;           /* Pending reviews */
--error: #EF4444;             /* Rejections, Errors */
--info: #3B82F6;              /* Information */

/* Neutral Colors */
--background: #FFFFFF;
--foreground: #111827;
--muted: #F3F4F6;
--muted-foreground: #6B7280;
--border: #E5E7EB;
--card: #FFFFFF;
--card-foreground: #111827;
```

### Typography
```css
/* Font Family */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### Spacing
```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
```

---

## Page Specifications

### 1. Dashboard (Home Page)

**Route**: `/dashboard`  
**Access**: Super Academics Manager

#### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Logo | Search | Profile                             │
├─────────┬───────────────────────────────────────────────────┤
│         │ Dashboard Overview                                │
│ Sidebar │ ┌─────────────────────────────────────────────┐   │
│         │ │ Key Metrics Cards (4 across)                │   │
│ - Home  │ │ • Total Colleges  • Active Programs         │   │
│ - Curr. │ │ • Pending Reviews • Student Enrollment      │   │
│ - Exams │ └─────────────────────────────────────────────┘   │
│ - Anal. │                                                   │
│ - Appr. │ ┌──────────────────┬──────────────────────────┐   │
│ - Aud.  │ │ Academic Calendar│ Compliance Status        │   │
│         │ │ (Timeline View)  │ (Donut Chart)            │   │
│         │ └──────────────────┴──────────────────────────┘   │
│         │                                                   │
│         │ ┌──────────────────────────────────────────────┐  │
│         │ │ Recent Curriculum Reviews                    │  │
│         │ │ (Table: College | Program | Status | Date)   │  │
│         │ └──────────────────────────────────────────────┘  │
│         │                                                   │
│         │ ┌──────────────────────────────────────────────┐  │
│         │ │ Cross-College Performance Comparison         │  │
│         │ │ (Bar Chart: Pass %, Avg Scores by College)   │  │
│         │ └──────────────────────────────────────────────┘  │
└─────────┴───────────────────────────────────────────────────┘
```

#### Key Metrics Cards
```typescript
interface MetricCard {
  title: string;
  value: number | string;
  change: number; // percentage
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: IconComponent;
  trend: number[]; // sparkline data
}
```

**Metrics Displayed**:
1. **Total Colleges**: 245 colleges (+12 this quarter)
2. **Active Programs**: 1,847 programs across all colleges
3. **Pending Reviews**: 34 curriculum submissions awaiting approval
4. **Total Enrollment**: 2.3M students across network

#### Academic Calendar Component
- **View Modes**: Month, Quarter, Year
- **Event Types**: 
  - Exam schedules (Red)
  - Academic reviews (Blue)
  - Holidays (Green)
  - Important deadlines (Orange)
- **Interactions**: Click event → Details modal
- **Filters**: By college, by event type

#### Compliance Status Chart
- **Chart Type**: Donut chart
- **Categories**:
  - Fully Compliant (Green): 85%
  - Minor Issues (Yellow): 12%
  - Major Issues (Red): 3%
- **Interaction**: Click segment → List of colleges in that category

---

### 2. Curriculum Management

**Route**: `/curriculum`  
**Access**: Super Academics Manager

#### 2.1 Curriculum Overview Page

```
┌─────────────────────────────────────────────────────────────┐
│ Curriculum Management                    [+ New Template]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Filters: [Program ▼] [Degree ▼] [Status ▼] [Search...]     │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Curriculum Templates Table                              │ │
│ │                                                         │ │
│ │ Program | Degree | Version | Status | Colleges | Actions││
│ │ ───────────────────────────────────────────────────────│ │
│ │ CSE     │ B.Tech│ v3.2    │Active  │ 87      │ ⋮      ││ │
│ │ ECE     │ B.Tech│ v2.8    │Active  │ 64      │ ⋮      ││ │
│ │ MBA     │ Master│ v1.5    │Draft   │ 0       │ ⋮      ││ │
│ │ ...                                                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Pagination: [< Previous] Page 1 of 23 [Next >]             │
└─────────────────────────────────────────────────────────────┘
```

**Actions Menu** (⋮):
- View Details
- Edit Template
- Version History
- Publish to Colleges
- Generate Report
- Archive

#### 2.2 Curriculum Template Detail/Edit Page

**Route**: `/curriculum/{id}`

```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Curriculum    B.Tech - Computer Science v3.2     │
│                         [Draft] [Preview] [Publish]         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Tabs: [Basic Info] [Course Structure] [Electives] [Credits]│
│                                                             │
│ ┌─ Basic Information ────────────────────────────────────┐ │
│ │ Program Name:    [Computer Science Engineering      ]  │ │
│ │ Degree:          [B.Tech                           ▼]  │ │
│ │ Duration:        [4 Years                          ▼]  │ │
│ │ Total Credits:   [160 Credits                       ]  │ │
│ │ Effective From:  [2024-08-01] To: [2028-07-31]        │ │
│ │ Description:                                          │ │
│ │ [Comprehensive CS program covering fundamentals...]   │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─ Semester-wise Course Structure ───────────────────────┐ │
│ │                                                         │ │
│ │ Semester 1                              [+ Add Course]  │ │
│ │ ┌──────────────────────────────────────────────────┐   │ │
│ │ │ CS101 │ Programming in C      │ 4 Credits │ Core│   │ │
│ │ │ MA101 │ Engineering Math-I    │ 4 Credits │ Core│   │ │
│ │ │ PH101 │ Engineering Physics   │ 3 Credits │ Core│   │ │
│ │ │ ...                                              │   │ │
│ │ └──────────────────────────────────────────────────┘   │ │
│ │                                                         │ │
│ │ Semester 2                              [+ Add Course]  │ │
│ │ [Similar structure...]                                  │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─ Elective Options ──────────────────────────────────────┐│
│ │ Semester 5 Electives (Choose 2 of 5)                   ││
│ │ □ CS501 - Machine Learning                             ││
│ │ □ CS502 - Cloud Computing                              ││
│ │ □ CS503 - Blockchain Technology                        ││
│ │ □ CS504 - IoT and Applications                         ││
│ │ □ CS505 - Cybersecurity                                ││
│ └────────────────────────────────────────────────────────┘│
│                                                             │
│ [Cancel] [Save Draft] [Submit for Review]                  │
└─────────────────────────────────────────────────────────────┘
```

**Drag-and-Drop**: Course cards can be reordered within semesters

---

### 3. Examination Management

**Route**: `/examinations`

#### 3.1 Exam Schedule Overview

```
┌─────────────────────────────────────────────────────────────┐
│ Examination Management                [+ Create Schedule]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Academic Year: [2024-25 ▼]  Semester: [Even ▼]  [Search]   │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Calendar View                   [Month ▼] [List View]   │ │
│ │                                                         │ │
│ │      MON     TUE     WED     THU     FRI     SAT        │ │
│ │   ┌─────┬─────┬─────┬─────┬─────┬─────┐               │ │
│ │   │  1  │  2  │  3  │  4  │  5  │  6  │               │ │
│ │   │     │ 3ex │     │     │     │     │               │ │
│ │   ├─────┼─────┼─────┼─────┼─────┼─────┤               │ │
│ │   │  8  │  9  │ 10  │ 11  │ 12  │ 13  │               │ │
│ │   │     │ 5ex │     │ 8ex │     │     │               │ │
│ │   └─────┴─────┴─────┴─────┴─────┴─────┘               │ │
│ │   [3ex] = 3 exams scheduled                            │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─ Upcoming Exams ────────────────────────────────────────┐ │
│ │ Date       │ Exam               │ Colleges │ Status     │ │
│ │ ──────────────────────────────────────────────────────  │ │
│ │ May 15     │ CS101 Mid-term     │ 87       │ Scheduled  │ │
│ │ May 16     │ MA101 Mid-term     │ 87       │ Scheduled  │ │
│ │ May 18     │ PH101 Mid-term     │ 87       │ Scheduled  │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### 3.2 Exam Question Bank

**Route**: `/examinations/question-bank`

```
┌─────────────────────────────────────────────────────────────┐
│ Question Bank                         [+ Add Question]      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Filters: [Subject ▼] [Topic ▼] [Difficulty ▼] [Type ▼]     │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Questions                                  Total: 2,847  │ │
│ │                                                         │ │
│ │ ┌─ Question Card ──────────────────────────────────────┐││
│ │ │ CS101 - Programming in C          [MCQ] [Easy]      │││
│ │ │ Q: What is the output of printf("%d", 5+3);         │││
│ │ │ A) 5+3  B) 8  C) 53  D) Compiler Error              │││
│ │ │ ✓ Correct Answer: B                                 │││
│ │ │ Used in: 12 exams | Last used: Mar 2024             │││
│ │ │ [Edit] [Duplicate] [Archive]                        │││
│ │ └──────────────────────────────────────────────────────┘││
│ │                                                         │ │
│ │ [Similar cards for other questions...]                 │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Question Types**:
- Multiple Choice (MCQ)
- Multiple Select
- True/False
- Fill in the Blank
- Short Answer
- Long Answer
- Coding Problem

---

### 4. Analytics & Reports

**Route**: `/analytics`

#### 4.1 Academic Performance Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│ Academic Analytics              [Export Report] [Schedule]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Time Period: [Last Quarter ▼]  Compare: [Previous Year]    │
│                                                             │
│ ┌──────────────┬──────────────┬──────────────┬────────────┐│
│ │ Avg Pass %   │ Avg GPA      │ Dropout Rate │ Placement  ││
│ │   87.3%      │   7.2/10     │   4.2%       │   78%      ││
│ │   ↑ 2.1%     │   ↑ 0.3      │   ↓ 0.8%     │   ↑ 5%     ││
│ └──────────────┴──────────────┴──────────────┴────────────┘│
│                                                             │
│ ┌─ Performance Trends ────────────────────────────────────┐ │
│ │ [Line Chart: Pass % across time for all colleges]      │ │
│ │ Filters: [Select Colleges] [Select Programs]           │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌──────────────────────────┬──────────────────────────────┐ │
│ │ Top Performing Colleges  │ Bottom Performing Colleges   │ │
│ │ 1. College A - 94.2%    │ 1. College X - 72.1%         │ │
│ │ 2. College B - 92.8%    │ 2. College Y - 74.3%         │ │
│ │ 3. College C - 91.5%    │ 3. College Z - 75.8%         │ │
│ └──────────────────────────┴──────────────────────────────┘ │
│                                                             │
│ ┌─ Program-wise Analysis ─────────────────────────────────┐ │
│ │ [Horizontal Bar Chart: Pass % by Program]              │ │
│ │ B.Tech CS    ████████████████████ 89%                  │ │
│ │ B.Tech ECE   ██████████████████ 85%                    │ │
│ │ MBA          ███████████████████ 87%                   │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### 4.2 Compliance Reports

**Route**: `/analytics/compliance`

```
┌─────────────────────────────────────────────────────────────┐
│ Compliance Reports                    [Generate Report]     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌─ Compliance Score ──────────────────────────────────────┐ │
│ │     Network-wide Compliance: 91.3/100                   │ │
│ │     [Progress Bar: ████████████████████░░░]             │ │
│ │                                                         │ │
│ │ Category Breakdown:                                     │ │
│ │ ✓ Curriculum Adherence:      95/100                    │ │
│ │ ✓ Faculty Qualifications:    93/100                    │ │
│ │ ⚠ Infrastructure Standards:  87/100                    │ │
│ │ ✓ Accreditation Status:      96/100                    │ │
│ │ ⚠ Research Output:           84/100                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─ Non-compliant Colleges ────────────────────────────────┐ │
│ │ College      │ Issue                │ Severity │ Status │ │
│ │ ─────────────────────────────────────────────────────── │ │
│ │ College A    │ Lab equipment short  │ Medium   │ InProg││ │
│ │ College B    │ Faculty shortage     │ High     │ Open  ││ │
│ │ College C    │ Curriculum outdated  │ Medium   │ Open  ││ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

### 5. Approval Workflows

**Route**: `/approvals`

```
┌─────────────────────────────────────────────────────────────┐
│ Approval Queue                        Pending: 34 items     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Tabs: [All (34)] [Curriculum (12)] [Faculty (8)]           │
│       [Programs (5)] [Facilities (9)]                       │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Approval Card                                           │ │
│ │ ┌────────────────────────────────────────────────────┐  │ │
│ │ │ [!] Curriculum Update - B.Tech Computer Science    │  │ │
│ │ │ College: ABC Institute of Technology               │  │ │
│ │ │ Submitted: May 10, 2024 | Due: May 20, 2024       │  │ │
│ │ │ Priority: High                                     │  │ │
│ │ │                                                    │  │ │
│ │ │ Changes Summary:                                   │  │ │
│ │ │ • Added 3 new elective courses                    │  │ │
│ │ │ • Updated credits for CS401                       │  │ │
│ │ │ • Removed obsolete course CS205                   │  │ │
│ │ │                                                    │  │ │
│ │ │ Compliance Status: ✓ All requirements met         │  │ │
│ │ │                                                    │  │ │
│ │ │ [View Details] [Approve] [Request Changes] [Reject]││ │
│ │ └────────────────────────────────────────────────────┘  │ │
│ │                                                         │ │
│ │ [Similar cards for other pending approvals...]          │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

**Approval Actions**:
- **Approve**: Instantly approves and notifies college
- **Request Changes**: Opens modal for feedback
- **Reject**: Opens modal for rejection reason
- **Delegate**: Assign to another reviewer

---

### 6. Audit Trail

**Route**: `/audit`

```
┌─────────────────────────────────────────────────────────────┐
│ Audit Trail                                [Export Logs]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Filters: [Date Range] [User ▼] [Action Type ▼] [Entity ▼]  │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Timestamp    │ User    │ Action         │ Entity        ││ │
│ │ ────────────────────────────────────────────────────────││ │
│ │ 10:45:23 AM │ Admin1  │ Approved       │ Curriculum    ││ │
│ │ 10:42:15 AM │ Admin2  │ Updated        │ Exam Schedule ││ │
│ │ 10:38:02 AM │ Admin1  │ Created        │ Question      ││ │
│ │ 10:35:47 AM │ Admin3  │ Deleted        │ Course        ││ │
│ │ 10:30:12 AM │ Admin1  │ Exported       │ Report        ││ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ Showing 1-50 of 12,847 entries  [< Previous] [Next >]      │
└─────────────────────────────────────────────────────────────┘
```

---

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Mobile Adaptations
- Sidebar collapses to hamburger menu
- Tables convert to card view
- Charts resize responsively
- Touch-friendly tap targets (min 44x44px)

---

## Component Library

### Buttons
```typescript
<Button variant="primary" size="md">Approve</Button>
<Button variant="secondary">Save Draft</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">View Details</Button>
<Button variant="destructive">Reject</Button>
```

### Data Tables
- Sortable columns
- Filterable headers
- Row selection (checkbox)
- Pagination controls
- Export options (CSV, Excel, PDF)

### Form Elements
- Text inputs with validation
- Select dropdowns with search
- Date pickers with range selection
- File uploads with drag-and-drop
- Rich text editors for descriptions

### Status Badges
```typescript
<Badge variant="success">Approved</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Rejected</Badge>
<Badge variant="info">In Review</Badge>
```

---

## Accessibility

- **WCAG 2.1 AA Compliance**
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels on all interactive elements
- **Color Contrast**: 4.5:1 minimum for text
- **Focus Indicators**: Visible focus states
- **Alt Text**: All images have descriptive alt text

---

## Performance Requirements

- **Page Load**: < 2 seconds (3G network)
- **Time to Interactive**: < 3 seconds
- **API Response**: < 500ms (p95)
- **Chart Rendering**: < 1 second for 10K data points

---

*This UI specification provides a comprehensive blueprint for building a professional, user-friendly Super Academics portal with consistent design patterns and optimal user experience.*
