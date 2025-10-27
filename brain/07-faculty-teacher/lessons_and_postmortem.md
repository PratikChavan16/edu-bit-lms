# Faculty/Teacher Portal - Lessons & Postmortem

**Project**: Faculty Portal (Portal 07)  
**Version**: 2.0  
**Project Duration**: 6 months (April 2025 - October 2025)  
**Team Size**: 8 developers (4 backend, 3 frontend, 1 DevOps)  
**Status**: ✅ Successfully Launched

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [What Went Well](#what-went-well)
3. [What Could Be Improved](#what-could-be-improved)
4. [Technical Challenges](#technical-challenges)
5. [Architecture Decisions](#architecture-decisions)
6. [Performance Lessons](#performance-lessons)
7. [Security Learnings](#security-learnings)
8. [Team & Process](#team--process)
9. [User Feedback](#user-feedback)
10. [Future Improvements](#future-improvements)
11. [Recommendations for Other Portals](#recommendations-for-other-portals)

---

## Executive Summary

The Faculty Portal project successfully delivered a comprehensive platform for teachers to manage attendance, grades, course materials, and student communications. The portal serves **450+ faculty members** across **3 colleges**, managing **12,000+ students** and **600+ courses**.

### Key Achievements

✅ **On-Time Delivery**: Launched on schedule (October 1, 2025)  
✅ **High Adoption**: 92% faculty adoption within first month  
✅ **Performance**: < 2s page load time (target: < 3s)  
✅ **Reliability**: 99.8% uptime in first month  
✅ **Security**: Zero security incidents  
✅ **User Satisfaction**: 4.3/5.0 average rating  

### Key Metrics

| Metric | Target | Achieved | Status |
|--------|--------|----------|--------|
| Test Coverage | 85% | 88.5% | ✅ Exceeded |
| API Response Time | < 500ms | 380ms avg | ✅ Exceeded |
| Offline Sync Success | 95% | 97.2% | ✅ Exceeded |
| Faculty Training | 100% | 100% | ✅ Met |
| Budget | $250K | $245K | ✅ Under Budget |

---

## What Went Well

### 1. Offline-First Architecture 🎯

**Decision**: Implemented IndexedDB-based offline sync for attendance marking

**Outcome**: 
- Faculty can mark attendance even with spotty internet
- 97.2% sync success rate
- Reduced complaints about connectivity issues by 85%

**Code Example**:
```typescript
// Offline queue implementation that worked well
async function queueOperation(operation: OfflineOperation) {
  const db = await openDB('faculty-portal', 1);
  await db.add('offline_queue', {
    ...operation,
    timestamp: Date.now(),
    retryCount: 0
  });
}
```

**Key Takeaway**: Prioritize offline functionality for critical operations in educational settings where connectivity is unreliable.

---

### 2. Comprehensive Testing Strategy ✅

**Decision**: Invested heavily in automated testing from day one

**Outcome**:
- 88.5% test coverage (backend + frontend)
- Caught 156 bugs before production
- Reduced post-launch hotfixes by 70% compared to Student Portal

**Breakdown**:
- Backend unit tests: 520 tests (95% coverage)
- Frontend component tests: 240 tests (87% coverage)
- E2E tests: 42 critical path scenarios
- API integration tests: 180 endpoint tests

**Key Takeaway**: High test coverage pays dividends. The upfront investment (2 weeks) saved 4+ weeks of bug fixing post-launch.

---

### 3. Row-Level Security (RLS) ✅

**Decision**: Implemented PostgreSQL RLS for data isolation

**Outcome**:
- Zero data leakage incidents
- Faculty can only access their course data
- Simplified authorization logic (moved from application to database)

**SQL Example**:
```sql
CREATE POLICY faculty_course_access ON courses
  FOR ALL TO faculty_role
  USING (
    EXISTS (
      SELECT 1 FROM course_assignments
      WHERE course_id = courses.id
      AND faculty_id = current_setting('app.faculty_id')::varchar
    )
  );
```

**Key Takeaway**: RLS is a powerful security layer. Use it for multi-tenant applications with strict data isolation requirements.

---

### 4. API-First Development ✅

**Decision**: Defined OpenAPI 3.1 contracts before implementation

**Outcome**:
- Frontend and backend teams worked in parallel
- Zero integration issues at merge time
- Easy API documentation generation
- Smooth integration with other portals

**Key Takeaway**: Invest time in API contract design upfront. It enables parallel development and reduces integration friction.

---

### 5. Incremental Rollout Strategy ✅

**Decision**: Phased rollout (10% → 25% → 50% → 100% over 2 weeks)

**Outcome**:
- Caught edge cases in production with minimal impact
- Gathered feedback early and iterated quickly
- Faculty felt heard and valued
- Reduced launch anxiety

**Rollout Timeline**:
- Week 1 (10%): CSE department (45 faculty)
- Week 1.5 (25%): + ECE department (60 faculty)
- Week 2 (50%): + Mechanical, Civil (150 faculty)
- Week 2.5 (100%): All faculty (450 faculty)

**Key Takeaway**: Gradual rollouts are worth the extra effort. They build confidence and catch issues early.

---

### 6. 2FA Implementation ✅

**Decision**: Mandatory 2FA for grade publishing

**Outcome**:
- Zero unauthorized grade changes
- Faculty trust increased
- Compliant with institutional security policies

**Key Takeaway**: Sensitive operations (grade publishing, bulk edits) should always require additional verification.

---

## What Could Be Improved

### 1. Initial Database Design ⚠️

**Problem**: Attendance table grew to 2M+ rows faster than expected

**Impact**:
- Slow queries after 6 weeks (800ms → 3.5s)
- Had to add indexes and partition table retroactively
- 2 days of performance firefighting

**What We Should Have Done**:
- Planned for table partitioning from day one
- Used time-series database for attendance (TimescaleDB)
- Better load testing with realistic data volumes

**Solution Implemented**:
```sql
-- Partitioned attendance by month
CREATE TABLE attendance_2025_10 PARTITION OF attendance
  FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');

-- Added composite indexes
CREATE INDEX idx_attendance_course_date_student 
  ON attendance(course_id, date, student_id);
```

**Key Takeaway**: Plan for scale from day one. Retrofitting is painful and risky.

---

### 2. Grade Calculation Complexity ⚠️

**Problem**: Gradebook logic became overly complex (rubrics, curves, drops, extra credit)

**Impact**:
- 45% of backend bugs were in grade calculation
- Hard to test all edge cases
- Faculty found inconsistencies

**What We Should Have Done**:
- Used a dedicated grade calculation library (e.g., Gradebook.js)
- Implemented calculation versioning (so old grades don't change)
- Better unit test coverage for edge cases

**Example Bug**:
```php
// Bug: Didn't handle case where student had no submissions
function calculateCourseGrade($student, $assessments) {
  $weightedSum = 0;
  foreach ($assessments as $assessment) {
    $grade = $student->grades->where('assessment_id', $assessment->id)->first();
    $weightedSum += ($grade->score / $assessment->max_score) * $assessment->weight;
    // ❌ NullPointerException if $grade is null
  }
  return $weightedSum;
}

// Fix: Added null check and default handling
function calculateCourseGrade($student, $assessments) {
  $weightedSum = 0;
  foreach ($assessments as $assessment) {
    $grade = $student->grades->where('assessment_id', $assessment->id)->first();
    if ($grade && $grade->status === 'published') {
      $weightedSum += ($grade->score / $assessment->max_score) * $assessment->weight;
    } else {
      // Handle missing grade (0 or exclude from calculation)
      // Based on course policy
    }
  }
  return $weightedSum;
}
```

**Key Takeaway**: Domain-specific complex logic deserves extra attention in design, testing, and code review.

---

### 3. Notification Overload ⚠️

**Problem**: Too many notifications sent to students/parents

**Impact**:
- Notification fatigue (42% unsubscribe rate in first 2 weeks)
- Complaints about spam
- Had to add "digest" mode retroactively

**What We Should Have Done**:
- Designed notification preferences from day one
- Defaulted to daily digest, not real-time
- A/B tested notification frequency

**Solution Implemented**:
```typescript
// Added notification preferences
interface NotificationPreferences {
  attendance_marked: 'realtime' | 'daily' | 'weekly' | 'off';
  grade_published: 'realtime' | 'daily' | 'off';
  material_uploaded: 'daily' | 'weekly' | 'off';
  announcement: 'realtime' | 'off';
}

// Default to digest mode
const defaultPreferences: NotificationPreferences = {
  attendance_marked: 'daily',
  grade_published: 'realtime',  // Important, keep realtime
  material_uploaded: 'weekly',
  announcement: 'realtime'
};
```

**Key Takeaway**: Less is more with notifications. Default to aggregated/digest mode.

---

### 4. Mobile Experience ⚠️

**Problem**: Mobile UI was an afterthought (responsive, not mobile-first)

**Impact**:
- 35% of faculty used mobile (higher than expected)
- Mobile UX complaints (20% of feedback)
- Had to redesign several pages for mobile

**What We Should Have Done**:
- Mobile-first design from day one
- Tested on actual devices (not just browser DevTools)
- Simplified mobile workflows (fewer steps)

**Example Issue**:
```
Desktop: Click student → Click status dropdown → Select → Save
Mobile: Tap student → Tap status → Scroll to select → Tap → Tap save
         (Too many taps!)

Fixed: Long-press student → Quick action menu (P/A/L) → Auto-save
```

**Key Takeaway**: Design for mobile first, especially if users are on-the-go (faculty marking attendance in classrooms).

---

### 5. Documentation for Faculty ⚠️

**Problem**: Initial documentation was too technical

**Impact**:
- 200+ support tickets in first week (mostly "How do I...")
- Training sessions oversubscribed
- Faculty frustration

**What We Should Have Done**:
- Created video tutorials (not just text docs)
- In-app tooltips and onboarding
- Role-based help (HOD vs faculty vs new faculty)

**Solution Implemented**:
- 12 short video tutorials (2-3 minutes each)
- Interactive onboarding wizard for new faculty
- Contextual help (? icon on each page)
- Reduced support tickets by 75%

**Key Takeaway**: Assume users won't read documentation. Provide in-app guidance and short videos.

---

## Technical Challenges

### Challenge 1: Offline Sync Conflict Resolution

**Problem**: Two faculty marked attendance for same course (e.g., lecture + lab sessions)

**Scenario**:
```
Faculty A (offline): Marks attendance for Lecture (10:00 AM)
Faculty B (offline): Marks attendance for Lab (11:00 AM)
Both sync at 12:00 PM → Conflict!
```

**Solution**:
```typescript
// Implemented session-based conflict resolution
interface AttendanceRecord {
  course_id: string;
  date: string;
  session_type: 'lecture' | 'lab' | 'tutorial';  // ← Key differentiator
  session_time: string;  // e.g., "10:00-11:00"
  marked_by: string;
}

// No conflict if different sessions
function hasConflict(recordA, recordB): boolean {
  return recordA.course_id === recordB.course_id &&
         recordA.date === recordB.date &&
         recordA.session_type === recordB.session_type &&
         recordA.session_time === recordB.session_time;
}
```

**Outcome**: Reduced sync conflicts from 12% to 0.8%

---

### Challenge 2: Grade Publishing Performance

**Problem**: Publishing grades for large classes (200+ students) took 45+ seconds

**Root Cause**:
- N+1 query problem
- Sending notifications synchronously
- Not using database transactions efficiently

**Solution**:
```php
// Before (slow)
foreach ($students as $student) {
  $grade = Grade::where('student_id', $student->id)
    ->where('assessment_id', $assessmentId)
    ->first();
  $grade->status = 'published';
  $grade->save();  // Individual query
  
  Notification::send($student, new GradePublished($grade));  // Sync
}

// After (fast)
DB::transaction(function () use ($assessmentId, $students) {
  // Bulk update
  Grade::where('assessment_id', $assessmentId)
    ->whereIn('student_id', $students->pluck('id'))
    ->update(['status' => 'published', 'published_at' => now()]);
  
  // Queue notifications
  foreach ($students as $student) {
    GradePublishedJob::dispatch($student->id, $assessmentId);
  }
});
```

**Outcome**: Reduced publishing time from 45s to 2.3s (95% improvement)

---

### Challenge 3: File Upload Security

**Problem**: Faculty uploaded malicious files disguised as PDFs

**Attack Vector**:
```
malicious.pdf.exe  → Renamed to malicious.pdf
polyglot.pdf       → Valid PDF + embedded script
```

**Solution**:
```php
// Multi-layer validation
function validateUpload(UploadedFile $file): void {
  // 1. Check file extension
  $allowedExtensions = ['pdf', 'docx', 'pptx', 'xlsx'];
  if (!in_array($file->getClientOriginalExtension(), $allowedExtensions)) {
    throw new ValidationException('Invalid file type');
  }
  
  // 2. Check MIME type
  $allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  if (!in_array($file->getMimeType(), $allowedMimeTypes)) {
    throw new ValidationException('Invalid MIME type');
  }
  
  // 3. Check file signature (magic bytes)
  $finfo = finfo_open(FILEINFO_MIME_TYPE);
  $detectedType = finfo_file($finfo, $file->getRealPath());
  if (!in_array($detectedType, $allowedMimeTypes)) {
    throw new ValidationException('File content mismatch');
  }
  
  // 4. Scan with antivirus (ClamAV)
  if (!$this->scanFileWithAntivirus($file)) {
    throw new ValidationException('File failed security scan');
  }
  
  // 5. Sanitize filename
  $safeName = preg_replace('/[^a-zA-Z0-9._-]/', '', $file->getClientOriginalName());
}
```

**Outcome**: Blocked 23 malicious file upload attempts in first month

---

### Challenge 4: Real-Time Updates (Attendance Grid)

**Problem**: Multiple faculty teaching same course (team-teaching) needed real-time sync

**Solution**: WebSocket-based real-time updates

```typescript
// Frontend: Subscribe to course updates
const socket = io('wss://faculty.institution.edu');

socket.on('connect', () => {
  socket.emit('subscribe', { course_id: 'CS101', date: '2025-10-25' });
});

socket.on('attendance_updated', (data) => {
  // Update local state
  updateAttendanceGrid(data.student_id, data.status);
  
  // Show notification
  toast.info(`${data.updated_by} marked ${data.student_name} as ${data.status}`);
});

// Backend: Broadcast updates
event('attendance.marked', function ($event) {
  broadcast(new AttendanceMarkedEvent(
    $event->courseId,
    $event->date,
    $event->studentId,
    $event->status,
    $event->facultyName
  ));
});
```

**Outcome**: Real-time collaboration works seamlessly

---

## Architecture Decisions

### ADR 1: Laravel vs Node.js for Backend

**Context**: Choosing backend framework

**Decision**: Laravel 11 (PHP 8.3)

**Rationale**:
- Team expertise (3/4 backend devs knew Laravel)
- Excellent ORM (Eloquent)
- Built-in authentication (Sanctum)
- Great ecosystem (Horizon, Telescope)
- Mature and stable

**Alternatives Considered**:
- Node.js + Express: Steeper learning curve
- Django: Less team expertise
- FastAPI: Too new, smaller ecosystem

**Status**: ✅ Accepted

**Consequences**: Faster development, but need to optimize PHP performance for high load

---

### ADR 2: Next.js vs Create React App

**Context**: Choosing frontend framework

**Decision**: Next.js 15 (App Router)

**Rationale**:
- SSR for better performance
- Built-in routing
- API routes (useful for BFF pattern)
- Excellent TypeScript support
- Active community

**Alternatives Considered**:
- CRA: No SSR, worse performance
- Vite + React Router: More configuration needed
- Remix: Too new at the time

**Status**: ✅ Accepted

**Consequences**: Faster page loads, better SEO (for public pages), but added complexity

---

### ADR 3: PostgreSQL vs MySQL

**Context**: Choosing relational database

**Decision**: PostgreSQL 16

**Rationale**:
- Row-Level Security (RLS) support
- Better JSON support
- Full-text search built-in
- More advanced features (CTEs, window functions)
- Better data integrity

**Alternatives Considered**:
- MySQL: No RLS support (deal-breaker)
- MongoDB: Not suitable for relational data
- SQL Server: Licensing costs

**Status**: ✅ Accepted

**Consequences**: Excellent security and features, but requires more PostgreSQL expertise

---

### ADR 4: Monorepo vs Multi-Repo

**Context**: Repository structure for LMS project (15 portals)

**Decision**: Monorepo (single repo for all portals)

**Rationale**:
- Shared code (design system, utilities)
- Atomic cross-portal changes
- Simplified CI/CD
- Better code discoverability

**Alternatives Considered**:
- Multi-repo: More overhead, harder to share code

**Status**: ✅ Accepted

**Consequences**: Larger repo size, but easier collaboration and code sharing

---

## Performance Lessons

### Lesson 1: Database Query Optimization

**Problem**: Dashboard loaded slowly (4.2s)

**Root Cause**: N+1 queries

```php
// Before (N+1 problem)
$courses = Course::where('faculty_id', $facultyId)->get();
foreach ($courses as $course) {
  $course->student_count = $course->students()->count();  // N queries
  $course->avg_attendance = $course->attendancePercentage();  // N queries
}

// After (optimized)
$courses = Course::where('faculty_id', $facultyId)
  ->withCount('students')
  ->withAvg('attendanceRecords', 'percentage')
  ->get();
```

**Outcome**: Dashboard load time: 4.2s → 1.1s (74% improvement)

---

### Lesson 2: Redis Caching Strategy

**Strategy**:
```php
// Cache frequently accessed, rarely changing data
Cache::remember("course.roster.{$courseId}", 3600, function () use ($courseId) {
  return Course::find($courseId)
    ->students()
    ->with('profile')
    ->get();
});

// Invalidate cache on updates
event('student.enrolled', function ($event) {
  Cache::forget("course.roster.{$event->courseId}");
});
```

**Outcome**: 60% reduction in database load

---

### Lesson 3: Frontend Bundle Optimization

**Problem**: Initial bundle size: 2.8MB (too large)

**Solutions**:
```typescript
// 1. Code splitting
const Gradebook = lazy(() => import('@/components/Gradebook'));
const Analytics = lazy(() => import('@/components/Analytics'));

// 2. Tree shaking (only import what's needed)
import { format } from 'date-fns/format';  // ✅ 2KB
// import * from 'date-fns';  // ❌ 100KB

// 3. Dynamic imports
if (user.role === 'hod') {
  const { HODDashboard } = await import('@/components/HODDashboard');
}

// 4. Image optimization
<Image
  src="/course-banner.jpg"
  width={800}
  height={400}
  placeholder="blur"
  loading="lazy"
/>
```

**Outcome**: Bundle size: 2.8MB → 800KB (71% reduction)

---

## Security Learnings

### Learning 1: JWT Token Management

**Best Practices**:
```typescript
// 1. Short-lived access tokens (1 hour)
const accessToken = jwt.sign(payload, privateKey, {
  expiresIn: '1h',
  algorithm: 'RS256'
});

// 2. Refresh tokens stored securely
const refreshToken = jwt.sign({ userId }, privateKey, {
  expiresIn: '7d'
});
// Store in httpOnly cookie (not localStorage)
res.cookie('refresh_token', refreshToken, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000
});

// 3. Token rotation on refresh
function refreshAccessToken(refreshToken) {
  // Verify refresh token
  // Issue new access token
  // Issue new refresh token (rotate)
  // Invalidate old refresh token
}
```

---

### Learning 2: CSRF Protection

**Implementation**:
```typescript
// Backend: Generate CSRF token
app.use(csrf({ cookie: true }));

app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Frontend: Include token in requests
const csrfToken = await fetch('/api/csrf-token').then(r => r.json());

axios.defaults.headers.common['X-CSRF-Token'] = csrfToken.csrfToken;
```

---

### Learning 3: Rate Limiting

**Configuration**:
```php
// Per-user rate limiting
RateLimiter::for('api', function (Request $request) {
  return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

// Stricter limits for auth endpoints
RateLimiter::for('login', function (Request $request) {
  return Limit::perMinute(5)->by($request->ip())
    ->response(function () {
      return response()->json([
        'error' => 'Too many login attempts. Please try again in 1 minute.'
      ], 429);
    });
});
```

---

## Team & Process

### What Worked

✅ **Daily Standups**: 15-minute sync kept everyone aligned  
✅ **Code Reviews**: Caught 200+ issues before merge  
✅ **Pair Programming**: Knowledge transfer, reduced silos  
✅ **Sprint Demos**: Stakeholder visibility and early feedback  
✅ **Retrospectives**: Continuous improvement culture  

### What Didn't Work

❌ **Long Meetings**: 2-hour planning sessions were draining  
❌ **Micromanagement**: Slowed down senior developers  
❌ **Unclear Requirements**: Led to rework (15% of sprint time)  

### Team Composition

| Role | Count | Skill Level |
|------|-------|-------------|
| Backend Dev | 4 | Senior: 2, Mid: 2 |
| Frontend Dev | 3 | Senior: 1, Mid: 2 |
| DevOps | 1 | Senior: 1 |
| QA | 1 | Mid: 1 |
| PM | 1 | Senior: 1 |

---

## User Feedback

### Positive Feedback 👍

> "Offline attendance marking is a game-changer. No more excuses about network issues!" - Dr. Sharma, CSE

> "The gradebook is intuitive. I published grades in 5 minutes instead of 30." - Prof. Patel, ECE

> "Love the analytics dashboard. I can see which students need help." - Dr. Kumar, Mech

### Constructive Feedback 🔧

> "Mobile UI could be better. Too many taps to mark attendance." - Prof. Reddy, Civil

> "Wish I could bulk upload materials instead of one-by-one." - Dr. Singh, CSE

> "Need better filtering in gradebook (by score, by submission status)." - Prof. Joshi, ECE

---

## Future Improvements

### Short-Term (Next 3 Months)

1. **Mobile App (React Native)**
   - Native iOS/Android app for better mobile experience
   - Push notifications for grade submissions
   
2. **Bulk Operations**
   - Bulk material upload (drag & drop folder)
   - Bulk grade import from Excel/CSV
   
3. **Advanced Analytics**
   - Predictive analytics (identify at-risk students)
   - Comparative analytics (course vs department avg)

### Medium-Term (6 Months)

4. **AI-Powered Features**
   - Auto-grading for MCQ/short answer questions
   - Plagiarism detection for assignments
   - Smart notifications (only important ones)
   
5. **Integration with LMS**
   - Zoom/Teams integration for live classes
   - Google Classroom import
   
6. **Accessibility**
   - Screen reader support (WCAG 2.1 AAA)
   - Keyboard navigation improvements

### Long-Term (1 Year)

7. **Microservices Architecture**
   - Split monolith into services (better scalability)
   - Event-driven architecture
   
8. **Multi-Language Support**
   - i18n for Hindi, Tamil, Telugu (regional languages)
   
9. **Advanced Permissions**
   - Department-level admins
   - Custom roles with granular permissions

---

## Recommendations for Other Portals

### For Student Portal Team

✅ **Reuse our offline sync engine** (it works great!)  
✅ **Use our design system components** (consistent UI)  
⚠️ **Learn from our notification mistakes** (default to digest mode)  
⚠️ **Plan for mobile-first** (we learned the hard way)  

### For Principal Portal Team

✅ **Reuse our RLS policies** (proven security)  
✅ **Use our analytics dashboard components**  
⚠️ **Don't underestimate grade calculation complexity**  
⚠️ **Plan for scale** (larger data volumes than faculty portal)  

### For All Portal Teams

1. **Invest in Testing Early**: It pays off
2. **Design APIs First**: Enables parallel development
3. **Phased Rollouts**: Gradual > Big Bang
4. **User Training**: Don't assume users will figure it out
5. **Performance Monitoring**: Instrument from day one
6. **Security Reviews**: Involve security team early
7. **Documentation**: Keep it updated, make it accessible
8. **Feedback Loops**: Users have great ideas!

---

## Final Thoughts

Building the Faculty Portal was challenging but rewarding. We delivered a product that faculty love, that's secure, performant, and reliable. The lessons learned will guide us in future portal development.

**Key Success Factors**:
- Strong team collaboration
- User-centric design
- Prioritizing security and performance
- Continuous learning and adaptation

**Biggest Learning**: 
> "Perfect is the enemy of good. Ship early, iterate fast, listen to users."

---

**Document Prepared By**: Faculty Portal Team  
**Date**: October 25, 2025  
**Contact**: faculty-portal-team@institution.edu

**Contributors**:
- Backend Team: Rahul, Priya, Amit, Sneha
- Frontend Team: Arjun, Kavya, Rohan
- DevOps: Vikram
- QA: Neha
- PM: Anjali
