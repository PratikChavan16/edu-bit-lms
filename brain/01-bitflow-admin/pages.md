# Bitflow Admin Portal - Page Specifications

**Version**: 2.0  
**Last Updated**: October 25, 2025  
**Portal**: Bitflow Admin (Platform Management)  
**Role**: Bitflow Owner

---

## Page-by-Page Specification

Each page specification includes:
- URL route
- Wireframe description
- Components used
- Data requirements
- User interactions
- Validation rules
- Error states
- Loading states

---

## 1. Platform Dashboard (`/`)

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ Bitflow Admin Portal | [System Health 🟢] | [Admin ▼]          │
├─────────────────────────────────────────────────────────────────┤
│ Platform Overview - Multi-Tenant SaaS Dashboard                 │
├──────────────┬──────────────┬──────────────┬──────────────────┤
│ Universities │ Total Users  │ API Requests │ Storage Used     │
│ 147 Active   │ 125,430      │ 2.4M today   │ 850 GB / 2 TB   │
│ +3 this week │ +2,340 today │ 🟢 Healthy   │ 42.5% capacity  │
└──────────────┴──────────────┴──────────────┴──────────────────┘
├───────────────────────────────────────────────────────────────────┤
│ 🏢 Recent University Activity                                    │
├───────────────────────────────────────────────────────────────────┤
│ • MIT University      - 234 new students enrolled today          │
│ • Stanford College    - Peak traffic: 5,420 concurrent users     │
│ • Oxford Academy      - Completed payment for Q4                 │
│ • Cambridge Institute - Requested storage upgrade (500 GB)       │
└───────────────────────────────────────────────────────────────────┘
├────────────────────────┬──────────────────────────────────────────┤
│ 📊 System Performance  │ ⚠️ Alerts & Issues                      │
├────────────────────────┼──────────────────────────────────────────┤
│ • API Latency: 45ms    │ • 2 universities near storage limit     │
│ • DB Response: 12ms    │ • 1 payment failed (auto-retry queued)  │
│ • Redis Hit Rate: 98%  │ • 3 universities with subscription due  │
│ • Uptime: 99.98%       │ • Disk usage at 85% on DB server        │
└────────────────────────┴──────────────────────────────────────────┘
├───────────────────────────────────────────────────────────────────┤
│ 💰 Revenue Overview (This Month)                                 │
├───────────────────────────────────────────────────────────────────┤
│ MRR: $147,000 | New Sales: $18,000 | Renewals: $129,000          │
│ [Bar Chart: Revenue Trend Last 6 Months]                         │
└───────────────────────────────────────────────────────────────────┘
```

### Components
- `PlatformStatsGrid` - High-level metrics (4 stat cards)
- `UniversityActivityFeed` - Real-time university events
- `SystemHealthPanel` - Performance metrics
- `AlertsPanel` - Critical alerts and warnings
- `RevenueChart` - Financial overview

### Data Requirements
```typescript
interface PlatformDashboard {
  stats: {
    totalUniversities: number;
    activeUniversities: number;
    totalUsers: number;
    apiRequestsToday: number;
    storageUsed: number;
    storageTotal: number;
  };
  recentActivity: UniversityActivity[];
  systemPerformance: {
    apiLatency: number;
    dbResponseTime: number;
    redisHitRate: number;
    uptime: number;
  };
  alerts: Alert[];
  revenue: {
    mrr: number;
    newSales: number;
    renewals: number;
    trend: RevenueDataPoint[];
  };
}
```

### API Calls
- `GET /api/admin/dashboard` - All dashboard data
- `GET /api/admin/system/health` - Real-time system health
- `GET /api/admin/alerts` - Active alerts

### Loading State
- Skeleton loaders for stat cards
- "Fetching live platform metrics..." message
- Progressive rendering: Stats → Activity → Charts

### Error State
- Critical: Show "Platform Dashboard Unavailable" with emergency contact
- Partial: Show available data with warning for failed sections
- Retry button with exponential backoff

---

## 2. Universities Management (`/universities`)

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard  | Universities Management                  │
├─────────────────────────────────────────────────────────────────┤
│ [🔍 Search universities...] [Filter ▼] [+ Create University]   │
├─────────────────────────────────────────────────────────────────┤
│ Showing 147 universities | Active: 140 | Inactive: 7           │
├────────┬──────────────┬────────┬──────────┬──────────┬─────────┤
│ Name   │ Domain       │ Status │ Users    │ Storage  │ Actions │
├────────┼──────────────┼────────┼──────────┼──────────┼─────────┤
│ MIT    │ mit.edu      │ 🟢 Act │ 12,450   │ 85 GB    │ [⋮]    │
│ Stanford│ stan.edu    │ 🟢 Act │ 8,920    │ 62 GB    │ [⋮]    │
│ Oxford │ oxford.ac.uk │ 🟡 Lim │ 15,340   │ 198 GB   │ [⋮]    │
│ Cambridge│ cam.ac.uk  │ 🟢 Act │ 11,230   │ 74 GB    │ [⋮]    │
│ Harvard│ harvard.edu  │ 🔴 Sus │ 0        │ 0 GB     │ [⋮]    │
└────────┴──────────────┴────────┴──────────┴──────────┴─────────┘
│ ← Previous   1 2 3 4 5 ... 15   Next → │ 10 per page ▼        │
└─────────────────────────────────────────────────────────────────┘
```

### Modal: Create University
```
┌─────────────────────────────────────────────┐
│ Create New University                    [×]│
├─────────────────────────────────────────────┤
│ University Name *                           │
│ [                                    ]      │
│                                             │
│ Primary Email *                             │
│ [admin@                              ]      │
│                                             │
│ Contact Phone *                             │
│ [+1                                  ]      │
│                                             │
│ Domain (auto-generated)                     │
│ [mit-university.bitflow.edu          ] 🔒  │
│                                             │
│ Storage Quota (GB) *                        │
│ [500                                 ] ▼   │
│                                             │
│ Subscription Plan                           │
│ ⚪ Basic ($500/mo) ⚪ Pro ($1000/mo)        │
│ ⚫ Enterprise ($2500/mo)                    │
│                                             │
│        [Cancel]  [Create University]        │
└─────────────────────────────────────────────┘
```

### Components
- `UniversitiesTable` - Sortable, filterable data table
- `UniversityRow` - Individual university row with actions
- `CreateUniversityModal` - Form for new university
- `UniversityActionsDropdown` - Edit, Suspend, Delete options
- `FilterPanel` - Status, storage, date range filters
- `Pagination` - Table pagination controls

### Data Requirements
```typescript
interface University {
  id: string;
  name: string;
  domain: string;
  slug: string;
  primaryEmail: string;
  primaryPhone: string;
  status: 'active' | 'inactive' | 'suspended' | 'limited';
  storageQuotaGB: number;
  storageUsedGB: number;
  totalUsers: number;
  subscriptionPlan: 'basic' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'past_due' | 'canceled';
  createdAt: string;
  lastActivityAt: string;
}

interface CreateUniversityRequest {
  name: string;
  primaryEmail: string;
  primaryPhone: string;
  storageQuotaGB: number;
  subscriptionPlan: string;
}
```

### API Calls
- `GET /api/admin/universities` - List all universities (paginated)
- `POST /api/admin/universities` - Create new university
- `PATCH /api/admin/universities/{id}` - Update university
- `DELETE /api/admin/universities/{id}` - Delete university
- `PATCH /api/admin/universities/{id}/status` - Change status

### Validation Rules
- **Name**: Required, 3-200 characters, unique
- **Email**: Required, valid email format, unique
- **Phone**: Required, valid international format
- **Storage Quota**: Required, min 50 GB, max 10,000 GB
- **Subscription Plan**: Required, one of [basic, pro, enterprise]

### User Interactions
1. **Create University**: Opens modal → Fill form → Submit → Success toast
2. **Edit University**: Click actions → Edit → Modal opens with pre-filled data
3. **Suspend University**: Click actions → Suspend → Confirmation dialog → API call
4. **Filter**: Click filter → Select criteria → Table updates
5. **Search**: Type in search box → Debounced search (300ms) → Results update
6. **Sort**: Click column header → Toggle asc/desc → Re-fetch data

### Loading State
- Table skeleton with shimmer effect
- "Loading universities..." message
- Disable actions during operations

### Error State
- **Create Failed**: Show validation errors inline in modal
- **Fetch Failed**: "Unable to load universities. [Retry]"
- **Delete Failed**: "Cannot delete university with active users"

### Success State
- **Created**: "✅ MIT University created successfully"
- **Updated**: "✅ University details updated"
- **Suspended**: "⚠️ Oxford University suspended"

---

## 3. University Details (`/universities/{id}`)

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Universities  | MIT University                        │
├─────────────────────────────────────────────────────────────────┤
│ [Edit] [Suspend] [Delete] [View Login Logs] [Billing History]  │
├─────────────────────────────────────────────────────────────────┤
│ 📋 Basic Information                                            │
├─────────────────────────────────────────────────────────────────┤
│ Name: MIT University                 Domain: mit.bitflow.edu    │
│ Email: admin@mit.edu                 Phone: +1-617-253-1000     │
│ Status: 🟢 Active                    Created: Jan 15, 2024      │
│ Last Activity: 2 minutes ago         Owner: Dr. John Smith      │
└─────────────────────────────────────────────────────────────────┘
├─────────────────────────────────────────────────────────────────┤
│ 📊 Usage Statistics                                             │
├─────────────────────────────────────────────────────────────────┤
│ Total Users: 12,450          Active Today: 8,920                │
│ Storage: 85 GB / 500 GB      API Calls (24h): 145,230          │
│ Colleges: 8                  Programs: 42                       │
│ Students: 10,200             Faculty: 850                       │
│ [Bar Chart: User Growth Last 6 Months]                          │
│ [Pie Chart: Storage Breakdown by Module]                        │
└─────────────────────────────────────────────────────────────────┘
├─────────────────────────────────────────────────────────────────┤
│ 💳 Subscription & Billing                                       │
├─────────────────────────────────────────────────────────────────┤
│ Plan: Enterprise ($2,500/month)                                 │
│ Status: Active                       Next Billing: Nov 15, 2025 │
│ Payment Method: Card ending in 4242                             │
│ MRR: $2,500                          Total Paid: $25,000        │
│                                                                  │
│ Recent Invoices:                                                │
│ • Oct 2025 - $2,500 - Paid ✅       [Download PDF]             │
│ • Sep 2025 - $2,500 - Paid ✅       [Download PDF]             │
│ • Aug 2025 - $2,500 - Paid ✅       [Download PDF]             │
└─────────────────────────────────────────────────────────────────┘
├─────────────────────────────────────────────────────────────────┤
│ ⚙️ Configuration                                                │
├─────────────────────────────────────────────────────────────────┤
│ Storage Quota: 500 GB          [Change Quota]                   │
│ API Rate Limit: 10,000/hour    [Adjust Limit]                  │
│ Custom Domain: ✅ Enabled       [Configure DNS]                 │
│ SSO Integration: ✅ Enabled     [Manage SSO]                    │
│ Backup Frequency: Daily         [Change Schedule]               │
└─────────────────────────────────────────────────────────────────┘
├─────────────────────────────────────────────────────────────────┤
│ 🔐 Security & Access                                            │
├─────────────────────────────────────────────────────────────────┤
│ 2FA Required: ✅ Yes            IP Whitelist: 3 IPs configured  │
│ Last Security Audit: Oct 20     Next Audit: Jan 20, 2026       │
│ Failed Login Attempts (24h): 3                                  │
│                                                                  │
│ Recent Admin Activities:                                        │
│ • Oct 25, 2025 10:30 AM - Created 5 new faculty users          │
│ • Oct 25, 2025 09:15 AM - Updated college structure            │
│ • Oct 24, 2025 04:45 PM - Generated monthly report             │
└─────────────────────────────────────────────────────────────────┘
```

### Components
- `UniversityHeader` - Name, status, action buttons
- `InfoCard` - Reusable card for sections
- `UsageStatsPanel` - Charts and metrics
- `BillingPanel` - Subscription and invoice details
- `ConfigurationPanel` - Editable settings
- `SecurityPanel` - Security settings and audit logs
- `ActivityTimeline` - Recent admin activities

### Data Requirements
```typescript
interface UniversityDetails extends University {
  owner: {
    name: string;
    email: string;
    phone: string;
  };
  usage: {
    totalUsers: number;
    activeToday: number;
    storageUsedGB: number;
    apiCalls24h: number;
    collegesCount: number;
    programsCount: number;
    studentsCount: number;
    facultyCount: number;
    userGrowth: DataPoint[];
    storageBreakdown: { module: string; size: number }[];
  };
  subscription: {
    plan: string;
    status: string;
    nextBillingDate: string;
    paymentMethod: string;
    mrr: number;
    totalPaid: number;
    recentInvoices: Invoice[];
  };
  configuration: {
    storageQuotaGB: number;
    apiRateLimit: number;
    customDomainEnabled: boolean;
    ssoEnabled: boolean;
    backupFrequency: string;
  };
  security: {
    twoFactorRequired: boolean;
    ipWhitelist: string[];
    lastSecurityAudit: string;
    nextSecurityAudit: string;
    failedLoginAttempts24h: number;
  };
  recentActivities: Activity[];
}
```

### API Calls
- `GET /api/admin/universities/{id}` - Full university details
- `GET /api/admin/universities/{id}/usage` - Usage statistics
- `GET /api/admin/universities/{id}/billing` - Billing information
- `PATCH /api/admin/universities/{id}/config` - Update configuration
- `GET /api/admin/universities/{id}/activities` - Recent activities

### User Interactions
1. **Edit Details**: Click Edit → Modal with form → Save changes
2. **Change Quota**: Click "Change Quota" → Modal with slider → Confirm
3. **View Invoice**: Click "Download PDF" → API call → Download file
4. **Suspend**: Click Suspend → Confirmation modal → API call → Redirect
5. **Delete**: Click Delete → Multi-step confirmation → API call → Redirect to list

### Validation Rules
- **Storage Quota**: Min 50 GB, Max 10,000 GB, Must be >= current usage
- **API Rate Limit**: Min 1,000/hour, Max 100,000/hour

### Loading State
- Skeleton for entire page
- "Loading university details..." message
- Progressive: Show basic info first, then load heavy data (charts, billing)

### Error State
- **Not Found**: "University not found. It may have been deleted."
- **Fetch Failed**: "Unable to load details. [Retry]"
- **Update Failed**: Show error toast with specific message

---

## 4. Global Users Management (`/users`)

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard  | Global Users Management                  │
├─────────────────────────────────────────────────────────────────┤
│ [🔍 Search users...] [Filter by University ▼] [Filter by Role ▼]│
├─────────────────────────────────────────────────────────────────┤
│ Showing 125,430 users across 147 universities                   │
├─────────┬────────────┬──────────┬─────────┬──────────┬─────────┤
│ Name    │ Email      │ Role     │ Univ    │ Status   │ Actions │
├─────────┼────────────┼──────────┼─────────┼──────────┼─────────┤
│ John D. │ j@mit.edu  │ Student  │ MIT     │ 🟢 Act   │ [⋮]    │
│ Sarah K.│ s@stan.edu │ Faculty  │ Stanford│ 🟢 Act   │ [⋮]    │
│ Mike T. │ m@ox.ac.uk │ Principal│ Oxford  │ 🟡 Lock  │ [⋮]    │
└─────────┴────────────┴──────────┴─────────┴──────────┴─────────┘
│ ← Previous   1 2 3 4 ... 12543   Next → │ 10 per page ▼       │
└─────────────────────────────────────────────────────────────────┘
```

### Components
- `UsersTable` - Paginated, searchable, filterable
- `UserRow` - Individual user with actions
- `FilterPanel` - University, role, status filters
- `UserActionsDropdown` - View, Reset Password, Lock, Delete
- `Pagination` - Table pagination

### Data Requirements
```typescript
interface GlobalUser {
  id: string;
  name: string;
  email: string;
  role: string;
  university: {
    id: string;
    name: string;
  };
  status: 'active' | 'inactive' | 'locked' | 'suspended';
  lastLogin: string;
  createdAt: string;
}
```

### API Calls
- `GET /api/admin/users` - List all users (paginated, filtered)
- `POST /api/admin/users/{id}/reset-password` - Reset user password
- `PATCH /api/admin/users/{id}/status` - Change user status
- `DELETE /api/admin/users/{id}` - Delete user

### User Interactions
1. **Search**: Type user name/email → Debounced search → Results update
2. **Filter**: Select university/role → Apply → Table refreshes
3. **Reset Password**: Click action → Confirm → Send reset email
4. **Lock User**: Click action → Confirm → User locked

### Loading State
- Table skeleton
- "Loading users..." message

### Error State
- "Unable to load users. [Retry]"
- Action errors shown as toasts

---

## 5. Analytics Dashboard (`/analytics`)

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard  | Platform Analytics                       │
├─────────────────────────────────────────────────────────────────┤
│ Date Range: [Last 30 Days ▼] [Export Report]                   │
├─────────────────────────────────────────────────────────────────┤
│ 📈 Platform Growth                                              │
├─────────────────────────────────────────────────────────────────┤
│ [Line Chart: Universities Added Over Time]                      │
│ [Line Chart: Total Users Growth]                                │
│ [Line Chart: Revenue Growth (MRR)]                              │
└─────────────────────────────────────────────────────────────────┘
├─────────────────────────────────────────────────────────────────┤
│ 🏆 Top Performing Universities                                  │
├─────────────────────────────────────────────────────────────────┤
│ 1. MIT University        - 12,450 users | $2,500/mo            │
│ 2. Oxford Academy        - 15,340 users | $2,500/mo            │
│ 3. Stanford College      - 8,920 users  | $2,500/mo            │
│ [Bar Chart: Top 10 by User Count]                              │
└─────────────────────────────────────────────────────────────────┘
├─────────────────────────────────────────────────────────────────┤
│ 📊 Usage Patterns                                               │
├─────────────────────────────────────────────────────────────────┤
│ [Heatmap: API Usage by Hour of Day]                            │
│ [Pie Chart: Most Used Features]                                │
│ [Bar Chart: Storage Usage by University]                       │
└─────────────────────────────────────────────────────────────────┘
├─────────────────────────────────────────────────────────────────┤
│ ⚠️ Health Metrics                                               │
├─────────────────────────────────────────────────────────────────┤
│ Avg API Latency: 45ms    Error Rate: 0.02%    Uptime: 99.98%  │
│ [Line Chart: Response Time Trend]                              │
│ [Line Chart: Error Rate Trend]                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Components
- `DateRangePicker` - Select analysis period
- `GrowthCharts` - Line charts for key metrics
- `TopUniversitiesPanel` - Leaderboard
- `UsagePatternsPanel` - Heatmaps and distribution
- `HealthMetricsPanel` - Performance indicators
- `ExportButton` - Generate PDF/CSV reports

### Data Requirements
```typescript
interface AnalyticsData {
  dateRange: { start: string; end: string };
  growth: {
    universitiesAdded: DataPoint[];
    userGrowth: DataPoint[];
    revenueGrowth: DataPoint[];
  };
  topUniversities: {
    name: string;
    userCount: number;
    mrr: number;
  }[];
  usagePatterns: {
    apiUsageHeatmap: HeatmapData[];
    featureUsage: { feature: string; count: number }[];
    storageByUniversity: { university: string; storage: number }[];
  };
  healthMetrics: {
    avgLatency: number;
    errorRate: number;
    uptime: number;
    responseTimeTrend: DataPoint[];
    errorRateTrend: DataPoint[];
  };
}
```

### API Calls
- `GET /api/admin/analytics` - All analytics data
- `GET /api/admin/analytics/export` - Generate export file

### User Interactions
1. **Change Date Range**: Select range → Charts reload
2. **Export Report**: Click Export → Generate → Download file
3. **Drill Down**: Click chart element → Navigate to filtered view

### Loading State
- Skeleton for charts
- "Analyzing platform data..." message

### Error State
- "Unable to load analytics. [Retry]"

---

## 6. Billing & Subscriptions (`/billing`)

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard  | Billing & Subscriptions                  │
├─────────────────────────────────────────────────────────────────┤
│ 💰 Revenue Overview                                             │
├─────────────────────────────────────────────────────────────────┤
│ MRR: $147,000          ARR: $1,764,000          Churn: 2.1%     │
│ [Line Chart: MRR Trend Last 12 Months]                         │
└─────────────────────────────────────────────────────────────────┘
├─────────────────────────────────────────────────────────────────┤
│ 📋 Subscription Status                                          │
├─────────────────────────────────────────────────────────────────┤
│ Active: 140    Past Due: 5    Canceled: 2    Trial: 0          │
├─────────┬────────────┬──────────┬─────────┬──────────┬─────────┤
│ Univ    │ Plan       │ Status   │ MRR     │ Next Bill│ Actions │
├─────────┼────────────┼──────────┼─────────┼──────────┼─────────┤
│ MIT     │ Enterprise │ 🟢 Act   │ $2,500  │ Nov 15   │ [⋮]    │
│ Stanford│ Enterprise │ 🟢 Act   │ $2,500  │ Nov 18   │ [⋮]    │
│ Oxford  │ Pro        │ 🟡 PastDue│$1,000  │ Oct 28   │ [⋮]    │
└─────────┴────────────┴──────────┴─────────┴──────────┴─────────┘
├─────────────────────────────────────────────────────────────────┤
│ 📄 Recent Invoices                                              │
├─────────────────────────────────────────────────────────────────┤
│ Oct 2025 - MIT University      - $2,500 - Paid ✅  [PDF]       │
│ Oct 2025 - Stanford College    - $2,500 - Paid ✅  [PDF]       │
│ Oct 2025 - Oxford Academy      - $1,000 - Failed ❌ [Retry]   │
└─────────────────────────────────────────────────────────────────┘
```

### Components
- `RevenueOverviewPanel` - MRR, ARR, churn metrics
- `SubscriptionStatusGrid` - Status breakdown
- `SubscriptionsTable` - All university subscriptions
- `InvoicesTable` - Recent invoices with actions
- `RevenueChart` - MRR trend visualization

### Data Requirements
```typescript
interface BillingData {
  revenue: {
    mrr: number;
    arr: number;
    churnRate: number;
    mrrTrend: DataPoint[];
  };
  subscriptionStatus: {
    active: number;
    pastDue: number;
    canceled: number;
    trial: number;
  };
  subscriptions: {
    university: string;
    plan: string;
    status: string;
    mrr: number;
    nextBillingDate: string;
  }[];
  recentInvoices: Invoice[];
}
```

### API Calls
- `GET /api/admin/billing` - All billing data
- `GET /api/admin/invoices/{id}/pdf` - Download invoice
- `POST /api/admin/invoices/{id}/retry` - Retry failed payment

### User Interactions
1. **Retry Payment**: Click Retry → Confirm → Process payment
2. **Download Invoice**: Click PDF → Download file
3. **Change Plan**: Click actions → Select plan → Confirm

### Loading State
- Skeleton for all sections
- "Loading billing data..." message

### Error State
- "Unable to load billing data. [Retry]"

---

## 7. Global Settings (`/settings`)

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard  | Global Platform Settings                 │
├─────────────────────────────────────────────────────────────────┤
│ [General] [Email] [SMS] [Payment] [Storage] [Security] [API]   │
├─────────────────────────────────────────────────────────────────┤
│ General Settings                                                │
├─────────────────────────────────────────────────────────────────┤
│ Platform Name:  [Bitflow LMS                           ]        │
│ Support Email:  [support@bitflow.edu                   ]        │
│ Support Phone:  [+1-800-BITFLOW                        ]        │
│ Timezone:       [UTC -5:00 (Eastern Time)              ] ▼      │
│ Maintenance Mode: ⚪ Disabled  ⚫ Enabled                        │
│                                                                  │
│ Default Settings for New Universities:                          │
│ Storage Quota:     [500 GB                             ] ▼      │
│ API Rate Limit:    [10,000 requests/hour               ]        │
│ Trial Period:      [30 days                            ]        │
│                                                                  │
│                                  [Save Changes]                 │
└─────────────────────────────────────────────────────────────────┘
```

### Components
- `SettingsNavigation` - Tab navigation
- `GeneralSettingsForm` - Platform-wide settings
- `EmailSettingsForm` - SMTP configuration
- `SMSSettingsForm` - Twilio/SMS gateway
- `PaymentSettingsForm` - Stripe configuration
- `StorageSettingsForm` - S3/storage settings
- `SecuritySettingsForm` - Security policies
- `APISettingsForm` - API keys and rate limits

### Data Requirements
```typescript
interface GlobalSettings {
  general: {
    platformName: string;
    supportEmail: string;
    supportPhone: string;
    timezone: string;
    maintenanceMode: boolean;
    defaultStorageQuotaGB: number;
    defaultApiRateLimit: number;
    trialPeriodDays: number;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    fromAddress: string;
  };
  sms: {
    provider: 'twilio' | 'sns';
    accountSid: string;
    authToken: string;
    fromNumber: string;
  };
  payment: {
    stripePublishableKey: string;
    stripeSecretKey: string;
    webhookSecret: string;
  };
  storage: {
    provider: 's3' | 'gcs' | 'azure';
    bucket: string;
    region: string;
    accessKey: string;
    secretKey: string;
  };
  security: {
    passwordMinLength: number;
    passwordRequireUppercase: boolean;
    passwordRequireNumbers: boolean;
    passwordRequireSpecial: boolean;
    sessionTimeoutMinutes: number;
    maxFailedLoginAttempts: number;
  };
  api: {
    globalRateLimit: number;
    requireApiKey: boolean;
    allowedOrigins: string[];
  };
}
```

### API Calls
- `GET /api/admin/settings` - All global settings
- `PATCH /api/admin/settings/general` - Update general settings
- `PATCH /api/admin/settings/email` - Update email settings
- `PATCH /api/admin/settings/sms` - Update SMS settings
- `PATCH /api/admin/settings/payment` - Update payment settings
- `PATCH /api/admin/settings/storage` - Update storage settings
- `PATCH /api/admin/settings/security` - Update security settings
- `PATCH /api/admin/settings/api` - Update API settings

### Validation Rules
- **Email Settings**: Test connection before saving
- **Payment Settings**: Validate API keys with test mode
- **Storage Settings**: Verify bucket access
- **Security Settings**: Password length 8-128 characters

### User Interactions
1. **Switch Tab**: Click tab → Load tab content
2. **Edit Setting**: Change value → Enable save button
3. **Save Changes**: Click Save → Validate → API call → Success toast
4. **Test Connection**: Click Test → Verify settings → Show result

### Loading State
- Skeleton for forms
- "Loading settings..." message

### Error State
- **Fetch Failed**: "Unable to load settings. [Retry]"
- **Save Failed**: Show field-specific errors inline
- **Test Failed**: "Connection test failed: [reason]"

---

## 8. Colleges Page (`/colleges`) - GOD MODE

### Purpose
View and manage all colleges across all universities. While typically colleges are created by University Owners, Bitflow Owner has God Mode access for onboarding, support, and emergency situations.

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ Colleges                                    [+ Create College]  │
├─────────────────────────────────────────────────────────────────┤
│ 🛡️ God Mode Access: You have full access to create/edit/delete │
│   colleges across all universities. Typically, colleges are     │
│   created by University Owners. All actions are logged.         │
├──────────────┬──────────────┬──────────────┬──────────────────┤
│ Total: 147   │ Active: 132  │ Suspended: 8 │ Enrollment: 45K  │
└──────────────┴──────────────┴──────────────┴──────────────────┘
├─────────────────────────────────────────────────────────────────┤
│ [Search...] [University ▼] [Status ▼] [Type ▼]     [Search]   │
├─────────────────────────────────────────────────────────────────┤
│ College              University      Status   Students  Actions│
├─────────────────────────────────────────────────────────────────┤
│ Engineering College  MIT            Active   5,420     [Edit]  │
│ SOE (2015)          admin@...                 85%      [Del]   │
│ --------------------------------------------------------        │
│ Arts & Science      Stanford        Active   3,210     [Edit]  │
│ ARTS (2010)         info@...                  64%      [Del]   │
└─────────────────────────────────────────────────────────────────┘
```

### Components
- `CollegesTable` - Paginated table with university context
- `CollegeStatsGrid` - Summary cards (total, active, suspended, enrollment)
- `CollegeFilters` - University, status, type filters
- `CreateCollegeModal` - Form with university selector + God Mode warning
- `EditCollegeModal` - Edit form with God Mode warning
- `GodModeInfoBanner` - Explains elevated access and audit logging

### Data Requirements
```typescript
interface College {
  id: string;
  university_id: string;
  university: { id: string; name: string };
  name: string;
  code: string; // e.g., "SOE", "ARTS"
  type: string; // "Engineering", "Arts & Science", etc.
  email: string;
  phone?: string;
  established_year?: number;
  status: 'active' | 'inactive' | 'suspended';
  capacity?: number;
  current_enrollment?: number;
  created_by_role?: 'bitflow_owner' | 'university_owner';
}
```

### User Interactions
1. **Create College**: Click "+ Create College" → Modal with university selector → God Mode warning → Submit
2. **Edit College**: Click Edit icon → Modal with pre-filled data → God Mode warning → Save
3. **Delete College**: Click Delete → Confirmation → Soft delete → Audit log
4. **Filter**: Select university/status/type → Refresh table

### API Calls
- `GET /api/v1/colleges?university_id=xxx&status=active` - List
- `POST /api/v1/colleges` - Create (God Mode)
- `PUT /api/v1/colleges/{id}` - Update (God Mode)
- `DELETE /api/v1/colleges/{id}` - Delete (God Mode)

### Audit Logging
All create/edit/delete actions logged with:
- Actor: bitflow_owner
- Entity: college
- Note: "God Mode access - Platform-level action"

---

## 9. Audit Logs (`/audit-logs`)

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard  | Platform Audit Logs                      │
├─────────────────────────────────────────────────────────────────┤
│ [🔍 Search logs...] [Filter by User ▼] [Date Range ▼] [Export] │
├─────────────────────────────────────────────────────────────────┤
│ Showing 15,420 audit logs                                       │
├──────────┬─────────┬────────────┬───────────────┬──────────────┤
│ Time     │ User    │ Action     │ Resource      │ Details      │
├──────────┼─────────┼────────────┼───────────────┼──────────────┤
│ 10:45 AM │ Admin   │ CREATE     │ University    │ MIT Univ...  │
│ 10:30 AM │ Admin   │ UPDATE     │ Settings      │ Changed S... │
│ 09:15 AM │ System  │ DELETE     │ User          │ Inactive ... │
│ 08:00 AM │ Admin   │ LOGIN      │ Session       │ IP: 203.... │
└──────────┴─────────┴────────────┴───────────────┴──────────────┘
│ ← Previous   1 2 3 4 ... 1542   Next → │ 10 per page ▼         │
└─────────────────────────────────────────────────────────────────┘
```

### Components
- `AuditLogsTable` - Paginated logs table
- `AuditLogRow` - Individual log entry
- `FilterPanel` - User, action, resource, date filters
- `ExportButton` - Export logs to CSV
- `Pagination` - Table pagination

### Data Requirements
```typescript
interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT';
  resourceType: string;
  resourceId: string;
  details: string;
  ipAddress: string;
  userAgent: string;
}
```

### API Calls
- `GET /api/admin/audit-logs` - List audit logs (paginated, filtered)
- `GET /api/admin/audit-logs/export` - Export logs

### User Interactions
1. **Search**: Type query → Debounced search → Results update
2. **Filter**: Select criteria → Apply → Table refreshes
3. **Export**: Click Export → Generate CSV → Download

### Loading State
- Table skeleton
- "Loading audit logs..." message

### Error State
- "Unable to load audit logs. [Retry]"

---

## 9. Support Tickets (`/support`)

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard  | Support Tickets from Universities        │
├─────────────────────────────────────────────────────────────────┤
│ [Open: 23] [In Progress: 15] [Resolved: 340] [Closed: 1,240]   │
├──────────┬─────────────┬──────────┬─────────┬─────────┬────────┤
│ ID       │ University  │ Subject  │ Priority│ Status  │ Actions│
├──────────┼─────────────┼──────────┼─────────┼─────────┼────────┤
│ #5482    │ MIT         │ Storage  │ 🔴 High │ Open    │ [View] │
│ #5481    │ Stanford    │ API Err  │ 🟡 Med  │ InProg  │ [View] │
│ #5480    │ Oxford      │ Billing  │ 🟢 Low  │ Resolved│ [View] │
└──────────┴─────────────┴──────────┴─────────┴─────────┴────────┘
```

### Components
- `TicketStatsBar` - Status counts
- `TicketsTable` - All tickets
- `TicketRow` - Individual ticket
- `TicketDetailsModal` - Full ticket view with conversation

### Data Requirements
```typescript
interface SupportTicket {
  id: string;
  universityId: string;
  universityName: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdBy: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}
```

### API Calls
- `GET /api/admin/support/tickets` - List tickets
- `GET /api/admin/support/tickets/{id}` - Ticket details
- `POST /api/admin/support/tickets/{id}/reply` - Reply to ticket
- `PATCH /api/admin/support/tickets/{id}/status` - Update status

### User Interactions
1. **View Ticket**: Click View → Modal with full conversation
2. **Reply**: Type message → Send → Update ticket
3. **Change Status**: Select status → Confirm → Update

### Loading State
- Table skeleton
- "Loading support tickets..." message

### Error State
- "Unable to load tickets. [Retry]"

---

## 10. System Logs & Monitoring (`/system-logs`)

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard  | System Logs & Monitoring                 │
├─────────────────────────────────────────────────────────────────┤
│ [Errors] [Warnings] [Info] [API Calls] [Database] [Cache]      │
├─────────────────────────────────────────────────────────────────┤
│ 🔴 Errors (Last 24 Hours)                                       │
├──────────┬──────────────┬─────────────────────────────────────┤
│ Time     │ Source       │ Message                             │
├──────────┼──────────────┼─────────────────────────────────────┤
│ 10:52 AM │ API Gateway  │ Timeout connecting to Redis         │
│ 09:30 AM │ DB Conn Pool │ Max connections reached (100/100)   │
│ 08:15 AM │ Payment      │ Stripe webhook signature invalid    │
└──────────┴──────────────┴─────────────────────────────────────┘
├─────────────────────────────────────────────────────────────────┤
│ 📊 System Health                                                │
├─────────────────────────────────────────────────────────────────┤
│ CPU Usage: 45%           Memory: 62%           Disk: 75%        │
│ [Line Chart: CPU Usage Last Hour]                              │
│ [Line Chart: Memory Usage Last Hour]                           │
└─────────────────────────────────────────────────────────────────┘
```

### Components
- `LogsNavigation` - Log type tabs
- `LogsTable` - Filterable logs table
- `SystemHealthPanel` - Real-time metrics
- `LogDetailsModal` - Full log entry with stack trace

### Data Requirements
```typescript
interface SystemLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info' | 'debug';
  source: string;
  message: string;
  stackTrace?: string;
  context?: Record<string, any>;
}

interface SystemHealth {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  cpuTrend: DataPoint[];
  memoryTrend: DataPoint[];
}
```

### API Calls
- `GET /api/admin/system/logs` - List logs
- `GET /api/admin/system/health` - System health metrics

### User Interactions
1. **Switch Log Type**: Click tab → Load logs
2. **View Details**: Click log → Modal with full details
3. **Filter**: Select criteria → Apply → Logs refresh

### Loading State
- Table skeleton
- "Loading system logs..." message

### Error State
- "Unable to load system logs. [Retry]"

---

## Common Components Used Across All Pages

### 1. Header
- Platform logo
- Navigation menu
- System health indicator
- Notifications bell
- Admin profile dropdown

### 2. Sidebar Navigation
```
📊 Dashboard
🏢 Universities
👥 Global Users
📈 Analytics
💳 Billing & Subscriptions
⚙️ Global Settings
🔐 Audit Logs
🎫 Support Tickets
📋 System Logs
```

### 3. Toast Notifications
- Success: Green with checkmark
- Error: Red with X
- Warning: Yellow with exclamation
- Info: Blue with info icon

### 4. Confirmation Modals
```
┌─────────────────────────────────────┐
│ Confirm Action               [×]    │
├─────────────────────────────────────┤
│ Are you sure you want to [action]?  │
│ This action cannot be undone.       │
│                                     │
│      [Cancel]  [Confirm]            │
└─────────────────────────────────────┘
```

### 5. Empty States
```
┌─────────────────────────────────────┐
│              📭                     │
│      No universities found          │
│                                     │
│  [Create First University]          │
└─────────────────────────────────────┘
```

### 6. Error Boundary
```
┌─────────────────────────────────────┐
│              ⚠️                     │
│   Something went wrong              │
│                                     │
│   [Reload Page] [Report Issue]      │
└─────────────────────────────────────┘
```

---

## Hierarchical Navigation Pages (v2.1+)

### Overview

The following pages implement the hierarchical drill-down navigation system, providing access to all 13 portals' functionality through a systematic hierarchy.

---

## 10. University Hub (`/universities/[id]`)

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ 🏠 > Universities > MIT University                              │
├─────────────────────────────────────────────────────────────────┤
│ [Logo] MIT University                                           │
│        contact@mit.edu • +1-555-0100                           │
│        [🟢 Active] [Premium Tier]                               │
├──────────────┬──────────────┬──────────────┬──────────────────┤
│ 15 Colleges  │ 3,850 Students│ 245 Faculty  │ 87 Staff        │
└──────────────┴──────────────┴──────────────┴──────────────────┘
├─────────────────────────────────────────────────────────────────┤
│ Quick Actions                                                    │
├─────────────────┬─────────────────┬──────────────────────────┤
│ 👥 Management   │ 🏢 Colleges     │ ⚙️ Settings             │
│ Team            │                 │                          │
│ [View Team →]   │ [Browse →]      │ [Settings →]            │
└─────────────────┴─────────────────┴──────────────────────────┘
```

### Components
- Breadcrumb, UniversityHeader, StatsCards, QuickActionCards

### API Endpoint
- `GET /api/admin/universities/{id}`

---

## 11. College Hub (`/universities/[id]/colleges/[collegeId]`)

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ 🏠 > Universities > MIT > Colleges > Engineering College        │
├─────────────────────────────────────────────────────────────────┤
│ Engineering College - SOE | Engineering                         │
│ [🟢 Active] [NAAC A+] Est. 1995                                │
├──────────────┬──────────────┬──────────────┬──────────────────┤
│ 8 Departments│ 1,240 Students│ 68 Faculty   │ 42 Courses      │
└──────────────┴──────────────┴──────────────┴──────────────────┘
│ Sections: [Leadership] [Departments] [Academic Staff]          │
│ [Admin Staff] [Non-Teaching] [Students] [Curriculum]           │
│ [Library] [Transport] [Hostel] [Settings]                      │
└─────────────────────────────────────────────────────────────────┘
```

### API Endpoint
- `GET /api/admin/universities/{id}/colleges/{collegeId}`

---

## 12. Students List (`/universities/[id]/colleges/[collegeId]/students`)

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ 🏠 > ... > Engineering College > Students                       │
├─────────────────────────────────────────────────────────────────┤
│ [🔍 Search] [Dept ▼] [Year ▼] [Status ▼] [+ Enroll] [📤 Import]│
├─────────────────────────────────────────────────────────────────┤
│ [Photo] John Doe | CS2025001 | CSE | Year 3 | 🟢 Active       │
│ GPA: 8.5 | Attendance: 92% | [View] [Edit]                    │
└─────────────────────────────────────────────────────────────────┘
```

### Components
- SearchBar, Filters (Dept, Year, Status), StudentCard, Pagination

### API Endpoint
- `GET /api/admin/universities/{id}/colleges/{collegeId}/students`

---

## 13-22. Other Hierarchical Pages

Similar patterns for:
- **Departments**: List, Create, Edit, View
- **Academic Staff**: List with filters, Faculty profiles
- **Administrative Staff**: Admission, Accounts, Fee admins
- **Curriculum**: Courses, Exams, Results
- **Library**: Books, Issues, Members
- **Transport**: Routes, Vehicles, Tracking
- **Hostel**: Rooms, Allocation, Attendance

All follow the same component patterns with breadcrumbs, filters, search, and contextual data.

---

## Responsive Design Breakpoints

- **Desktop**: 1920px+ (Full layout)
- **Laptop**: 1280px - 1919px (Compact spacing)
- **Tablet**: 768px - 1279px (Stack some sections, hide sidebar)
- **Mobile**: 320px - 767px (Single column, hamburger menu, simplified views)

---

## Performance Optimization

1. **Lazy Loading**: Load charts and heavy components on demand
2. **Infinite Scroll**: For large tables (audit logs, system logs)
3. **Debouncing**: Search inputs debounced at 300ms
4. **Caching**: Cache dashboard data for 5 minutes
5. **Pagination**: Max 50 items per page for tables
6. **Image Optimization**: Serve WebP with PNG fallback
7. **Code Splitting**: Route-based code splitting
8. **Virtual Scrolling**: For tables with 100+ rows

---

## Accessibility (WCAG 2.1 Level AA)

1. **Keyboard Navigation**: All actions accessible via keyboard
2. **Screen Readers**: Proper ARIA labels and roles
3. **Color Contrast**: Minimum 4.5:1 for text
4. **Focus Indicators**: Visible focus states
5. **Alt Text**: All images have descriptive alt text
6. **Form Labels**: All inputs have associated labels
7. **Error Identification**: Clear error messages
8. **Semantic HTML**: Proper use of HTML5 elements

---

## Security Considerations

1. **Authentication**: All pages require Bitflow Owner role
2. **Authorization**: Verify permissions on every API call
3. **CSRF Protection**: CSRF tokens on all forms
4. **XSS Prevention**: Sanitize all user inputs
5. **Rate Limiting**: Prevent abuse (100 requests/minute)
6. **Audit Logging**: Log all sensitive actions
7. **Session Management**: 30-minute inactivity timeout
8. **HTTPS Only**: All traffic over TLS 1.3

---

**End of Page Specifications**
