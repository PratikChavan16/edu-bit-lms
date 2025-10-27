# Parent Portal - UI Pages Specification

**Version**: 2.0  
**Last Updated**: October 25, 2025  
**Platform**: Web + Mobile (React Native)

---

## Design System

### Color Palette
```css
/* Primary Colors */
--primary-blue: #2563EB;      /* Actions, links */
--primary-hover: #1D4ED8;
--accent-green: #10B981;      /* Success, positive */
--accent-red: #EF4444;        /* Alerts, negative */
--accent-yellow: #F59E0B;     /* Warnings */

/* Child Profile Colors (for multi-child differentiation) */
--child-1: #3B82F6;  /* Blue */
--child-2: #EC4899;  /* Pink */
--child-3: #8B5CF6;  /* Purple */
--child-4: #10B981;  /* Green */

/* Neutrals */
--gray-50: #F9FAFB;
--gray-800: #1F2937;
--white: #FFFFFF;
```

### Typography
```css
/* Headings */
h1: 28px / 700 / Inter
h2: 24px / 600 / Inter
h3: 20px / 600 / Inter

/* Body */
body: 16px / 400 / Inter
small: 14px / 400 / Inter

/* Mobile optimized (larger for readability) */
@media (max-width: 768px) {
  body: 18px
  button: 18px (larger touch targets)
}
```

---

## Page 1: Dashboard (Home)

### Layout
```
┌─────────────────────────────────────────────────┐
│  ☰  Parent Portal            🔔(3)  👤          │
├─────────────────────────────────────────────────┤
│                                                 │
│  Good Evening, Mrs. Sharma 👋                   │
│  Friday, October 25, 2025                       │
│                                                 │
│  [Quick Actions]                                │
│  [💰 Pay Fees] [✉️ Messages] [📅 Meetings]     │
│                                                 │
├─────────────────────────────────────────────────┤
│  My Children (2)                      [View All]│
│                                                 │
│  🟦 Aarav Kumar - Class 10-A          [Active] │
│  ┌─────────────────────────────────────────┐   │
│  │ Today: ✅ Present (All periods)        │   │
│  │ Attendance: 94% │ CGPA: 8.5           │   │
│  │ Pending Fees: ₹25,000 (Due: Nov 15)   │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  🟨 Ananya Kumar - Class 8-B          [Active] │
│  ┌─────────────────────────────────────────┐   │
│  │ Today: ✅ Present (All periods)        │   │
│  │ Attendance: 96% │ Percentage: 87%      │   │
│  │ No pending fees ✅                      │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
├─────────────────────────────────────────────────┤
│  Recent Activity                      [View All]│
│  🔔 New grade published - Aarav (Math)          │
│     2 hours ago                                 │
│  📢 School announcement - Parent meeting        │
│     5 hours ago                                 │
│  ✅ Fee payment successful - Ananya             │
│     Yesterday                                   │
└─────────────────────────────────────────────────┘

[Bottom Nav: 🏠 Home | 👦 Children | 💬 Messages | ⚙️ More]
```

### Interactions
- **Pull to refresh**: Update all data
- **Swipe child cards**: Quick actions (view details, pay fees, message teacher)
- **Tap notification**: Navigate to detail page
- **Quick actions**: One-tap common tasks

---

## Page 2: Child Profile

### Layout
```
┌─────────────────────────────────────────────────┐
│  ← Back                                    ⋮    │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Photo]  Aarav Kumar                           │
│           Class 10-A │ Roll No: 101             │
│           Son │ Linked since Jan 2025           │
│                                                 │
│  [Tabs: Overview | Attendance | Grades | Fees] │
│                                                 │
├─────────────────────────────────────────────────┤
│  📊 Quick Stats                                 │
│  ┌──────────┬──────────┬──────────┐            │
│  │Attendance│  CGPA    │ Rank     │            │
│  │   94%    │   8.5    │  12/60   │            │
│  └──────────┴──────────┴──────────┘            │
│                                                 │
│  📅 Today's Schedule                            │
│  08:00-09:00  Mathematics     Present ✅        │
│  09:00-10:00  Science         Present ✅        │
│  10:00-11:00  English         Present ✅        │
│  ...                                            │
│                                                 │
│  📚 Recent Assessments                          │
│  Math Quiz - 18/20 (90%) ⭐                     │
│  Science Lab - 48/50 (96%) ⭐⭐                 │
│  English Essay - 40/50 (80%)                    │
│                                                 │
│  💰 Fee Status                                  │
│  Pending: ₹25,000 │ Due: Nov 15, 2025          │
│  [Pay Now →]                                    │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Page 3: Attendance Detail

### Layout
```
┌─────────────────────────────────────────────────┐
│  ← Aarav Kumar                                  │
│  Attendance Details                             │
├─────────────────────────────────────────────────┤
│                                                 │
│  October 2025                    94.7% Present  │
│                                                 │
│  Mo  Tu  We  Th  Fr  Sa  Su                     │
│       1   2   3   4   5   6                     │
│       P   P   P   A   P   H   H                 │
│   7   8   9  10  11  12  13                     │
│   P   P   P   P   P   H   H                     │
│  14  15  16  17  18  19  20                     │
│   P   L   P   P   P   H   H                     │
│  21  22  23  24  25  26  27                     │
│   P   P   P   P   •   -   -                     │
│                                                 │
│  Legend: P=Present, A=Absent, L=Leave, H=Holiday│
│                                                 │
├─────────────────────────────────────────────────┤
│  Summary                                        │
│  Total Days: 19                                 │
│  Present: 18 (94.7%)                            │
│  Absent: 1 (5.3%)                               │
│  Leave: 0                                       │
│                                                 │
│  [📊 View Trends] [📝 Apply Leave]             │
│                                                 │
├─────────────────────────────────────────────────┤
│  Recent Records                                 │
│  Oct 25, 2025 - Friday                          │
│  08:00 Math       ✅ Present                    │
│  09:00 Science    ✅ Present                    │
│  10:00 English    ✅ Present                    │
│                                                 │
│  Oct 24, 2025 - Thursday                        │
│  08:00 Math       ✅ Present                    │
│  ...                                            │
└─────────────────────────────────────────────────┘
```

---

## Page 4: Grades & Report Card

### Layout
```
┌─────────────────────────────────────────────────┐
│  ← Aarav Kumar                                  │
│  Academic Performance                           │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Semester 1 ▼]           Overall CGPA: 8.5    │
│                                                 │
│  Subject-wise Performance                       │
│                                                 │
│  📚 Mathematics               Grade: A (91%)    │
│  ├─ Quiz 1: 18/20                               │
│  ├─ Quiz 2: 19/20                               │
│  ├─ Assignment: 45/50                           │
│  ├─ Midterm: 82/100                             │
│  └─ Project: 48/50                              │
│  Trend: ↗ Improving                             │
│  [View Details →]                               │
│                                                 │
│  📚 Science                   Grade: A+ (94%)   │
│  ├─ Lab Work: 48/50                             │
│  ├─ Quiz: 38/40                                 │
│  └─ Midterm: 90/100                             │
│  Trend: ➡ Stable                                │
│  [View Details →]                               │
│                                                 │
│  📚 English                   Grade: B+ (82%)   │
│  ├─ Essay: 40/50                                │
│  ├─ Quiz: 32/40                                 │
│  └─ Midterm: 76/100                             │
│  Trend: ↘ Needs Attention ⚠️                    │
│  [View Details →] [💬 Contact Teacher]         │
│                                                 │
├─────────────────────────────────────────────────┤
│  Report Cards                                   │
│  📄 Semester 1 Final Report (Oct 2025)         │
│     [Download PDF]                              │
│  📄 Midterm Report (Sep 2025)                   │
│     [Download PDF]                              │
└─────────────────────────────────────────────────┘
```

---

## Page 5: Fee Payment

### Payment Flow
```
┌─────────────────────────────────────────────────┐
│  ← Aarav Kumar                                  │
│  Fee Payment                                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  Pending Fees                                   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Semester 2 Fee                          │   │
│  │ Amount: ₹25,000                         │   │
│  │ Due Date: Nov 15, 2025 (21 days)       │   │
│  │                                         │   │
│  │ Breakdown:                              │   │
│  │ • Tuition Fee: ₹18,000                 │   │
│  │ • Lab Fee: ₹3,000                      │   │
│  │ • Library Fee: ₹2,000                  │   │
│  │ • Sports Fee: ₹2,000                   │   │
│  │                                         │   │
│  │ [Pay Now →]                             │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Payment History                                │
│  ✅ Sep 1, 2025 - ₹30,000                      │
│     Semester 1 (2/2)                            │
│     Receipt: #FEE-2025-001234                   │
│     [Download Receipt]                          │
│                                                 │
│  ✅ Jun 1, 2025 - ₹30,000                      │
│     Semester 1 (1/2)                            │
│     Receipt: #FEE-2025-000987                   │
│     [Download Receipt]                          │
│                                                 │
└─────────────────────────────────────────────────┘

Payment Method Selection:
┌─────────────────────────────────────────────────┐
│  Select Payment Method                          │
├─────────────────────────────────────────────────┤
│  ○ UPI                                          │
│     Google Pay, PhonePe, Paytm                  │
│                                                 │
│  ○ Debit/Credit Card                            │
│     Visa, Mastercard, Rupay                     │
│                                                 │
│  ○ Net Banking                                  │
│     All major banks                             │
│                                                 │
│  ○ Wallet                                       │
│     Paytm, PhonePe Wallet                       │
│                                                 │
│  [Continue to Payment →]                        │
└─────────────────────────────────────────────────┘

Payment Success:
┌─────────────────────────────────────────────────┐
│             ✅ Payment Successful                │
│                                                 │
│  Amount Paid: ₹25,000                           │
│  Transaction ID: TXN_XYZ789ABC                  │
│  Date: Oct 25, 2025, 2:30 PM                    │
│                                                 │
│  Receipt will be sent to:                       │
│  📧 sharma@example.com                          │
│  📱 +91-9876543210                              │
│                                                 │
│  [Download Receipt] [Share] [Done]              │
└─────────────────────────────────────────────────┘
```

---

## Page 6: Messages / Communication

### Layout
```
┌─────────────────────────────────────────────────┐
│  ← Messages                          [+ New]    │
├─────────────────────────────────────────────────┤
│  [Filter: ▼ All Children]                       │
│                                                 │
│  📧 Dr. Sharma (English - Aarav)      [New]    │
│     "Regarding Aarav's essay submission..."    │
│     2 hours ago                                 │
│                                                 │
│  📧 Prof. Verma (Math - Aarav)                 │
│     "Great improvement in recent test!"        │
│     Yesterday, 4:30 PM                          │
│                                                 │
│  📧 Ms. Gupta (Coordinator - Ananya)   [New]   │
│     "PTM scheduled for Nov 5th"                │
│     5 hours ago                                 │
│                                                 │
│  📧 Principal's Office                          │
│     "Annual Sports Day announcement"           │
│     2 days ago                                  │
│                                                 │
└─────────────────────────────────────────────────┘

Message Thread:
┌─────────────────────────────────────────────────┐
│  ← Dr. Sharma (English Teacher)                │
├─────────────────────────────────────────────────┤
│                                                 │
│  Dr. Sharma                          Oct 25     │
│  ┌───────────────────────────────────────────┐ │
│  │ I noticed Aarav's recent essay on         │ │
│  │ "Climate Change" showed excellent          │ │
│  │ research skills. However, the conclusion   │ │
│  │ could be stronger. Would you like to       │ │
│  │ discuss ways to help him improve?          │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│                                   Oct 25   You  │
│  ┌───────────────────────────────────────────┐ │
│  │ Thank you for the feedback, Dr. Sharma.   │ │
│  │ Yes, I'd appreciate guidance. When can    │ │
│  │ we schedule a brief meeting?              │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  [Type your message...]                 [Send] │
│  📎 Attach                                      │
└─────────────────────────────────────────────────┘
```

---

## Page 7: Analytics Dashboard

### Layout
```
┌─────────────────────────────────────────────────┐
│  ← Aarav Kumar                                  │
│  Performance Analytics                          │
├─────────────────────────────────────────────────┤
│                                                 │
│  📊 Grade Trend (Last 3 Semesters)             │
│                                                 │
│   95%│              ●                           │
│   90%│         ●    │                           │
│   85%│    ●    │    │                           │
│   80%│    │    │    │                           │
│   75%│────┴────┴────┴───                        │
│       Sem3  Sem4  Sem5                          │
│                                                 │
│  Overall Trend: ↗ Consistent Improvement        │
│                                                 │
├─────────────────────────────────────────────────┤
│  📈 Subject-wise Performance                    │
│                                                 │
│  Mathematics  ████████████ 91%                  │
│  Science      █████████████ 94%                 │
│  English      ███████████  82%                  │
│  Social       ████████████ 88%                  │
│  Hindi        ████████████ 89%                  │
│                                                 │
├─────────────────────────────────────────────────┤
│  🎯 Strengths                                   │
│  • Mathematics (Top 10% in class)              │
│  • Science Lab Work (Excellent)                │
│  • Consistent attendance (94%)                 │
│                                                 │
│  ⚠️ Areas for Improvement                      │
│  • English essay writing skills                │
│  • Social Studies (needs attention)            │
│                                                 │
│  💡 Recommendations                             │
│  • Extra English writing practice              │
│  • Consider tutoring for Social Studies        │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Page 8: Settings

### Layout
```
┌─────────────────────────────────────────────────┐
│  ← Settings                                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  Profile                                        │
│  👤 Mrs. Sharma                                 │
│  📱 +91-9876543210                              │
│  📧 sharma@example.com                          │
│  [Edit Profile →]                               │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  My Children                                    │
│  🟦 Aarav Kumar (Class 10-A)        [Active]   │
│  🟨 Ananya Kumar (Class 8-B)        [Active]   │
│  [+ Link Another Child]                         │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Notifications                                  │
│  🔔 Attendance Updates      [Daily Digest ▼]   │
│  📊 Grade Published         [Real-time ▼]      │
│  📢 Announcements           [Important Only ▼]  │
│  💰 Fee Reminders           [3 days before ▼]  │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Security                                       │
│  🔐 Change Password              →              │
│  🔒 Two-Factor Authentication    [Enabled ✅]  │
│  📱 Biometric Login              [Enabled ✅]  │
│  📲 Manage Devices (3)           →              │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Preferences                                    │
│  🌐 Language                 [English ▼]       │
│  🎨 Theme                    [Light ▼]         │
│  📍 Location                 [Auto-detect]     │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  Support                                        │
│  ❓ Help & FAQ               →                  │
│  📞 Contact Support          →                  │
│  📝 Privacy Policy           →                  │
│  📜 Terms of Service         →                  │
│                                                 │
│  ─────────────────────────────────────────────  │
│                                                 │
│  [Logout]                                       │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## Mobile-Specific Features

### 1. Bottom Sheet Modals
Quick actions slide up from bottom (easier thumb reach)

### 2. Swipe Gestures
- Swipe left on child card: Quick pay fees
- Swipe right: Quick message teacher
- Pull down: Refresh

### 3. Home Screen Widgets (iOS/Android)
```
┌─────────────────────┐
│ Aarav Kumar         │
│ Today: ✅ Present   │
│ Attendance: 94%     │
│ [Tap to open app]   │
└─────────────────────┘
```

### 4. Push Notification Actions
```
🔔 Attendance Alert
Aarav Kumar marked ABSENT in Math
[View Details] [Request Leave] [Dismiss]
```

---

**Last Updated**: October 25, 2025  
**Design System**: Tailwind CSS + shadcn/ui  
**Mobile Framework**: React Native  
**Accessibility**: WCAG 2.1 AA Compliant
