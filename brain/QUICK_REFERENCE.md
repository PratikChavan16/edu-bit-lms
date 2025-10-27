# 🎯 Quick Reference Card - Everything You Need to Know

**Print this out or keep it open in a tab!**

---

## 📚 Essential Documents (Read These First)

### 🔥 **START HERE** (30 minutes)
1. `ORGANIZATION_SUMMARY.md` ← Visual overview  
2. `brain/PORTAL_DISTRIBUTION.md` ← Who builds what  
3. `brain/shared_contracts/USAGE_GUIDE.md` ← How to use contracts  

### 📖 **Deep Dive** (2 hours)
4. `COMPLETE_GOD_MODE_ANALYSIS.md` ← Technical analysis  
5. `PARALLEL_DEVELOPMENT_STRATEGY.md` ← Dev strategy  
6. `brain/BRAIN_FOLDER_ORGANIZATION.md` ← File tracking  

---

## 👥 Portal Distribution

### Developer A (7 portals - Academic Track)
```
01. Bitflow Admin ⭐ (God Mode - 3 weeks)
03. Super Admin (2 weeks)
04. Principal (2 weeks)
06. Super Academics (2 weeks)
07. Faculty/Teacher (1.5 weeks)
08. Student (1.5 weeks)
09. Parent (1 week)
```

### Developer B (7 portals - Business Track)
```
02. University Owner ⭐ (God Mode - 3 weeks)
05. College Admin (2 weeks)
10. Admission Admin (1.5 weeks)
11. Super Accountant (2 weeks)
12. College Accounts Admin (1.5 weeks)
13. College Fee Admin (1.5 weeks)
14. Super Non-Teaching Manager (1 week)
```

---

## 🔗 Critical Integration Points

### Week 2-3: God Mode Hierarchy API
**Developer A creates → Developer B consumes**
```
GET /api/hierarchy/universities
GET /api/hierarchy/colleges/:id
GET /api/hierarchy/departments/:id
```

### Week 4-5: User Management
**Developer A (Super Admin) → All portals**
```
Events: user.created, user.updated, user.role_changed
```

### Week 8-9: Student Enrollment
**Developer B (Admission) → Developer A (Student/Faculty)**
```
Events: student.enrolled, student.promoted
```

### Week 11-12: Payment Processing
**Developer B (Fee Admin) → Developer A (Student/Parent) + Developer B (Accountant)**
```
Events: payment.received, payment.overdue
```

---

## 📂 File Locations (Quick Access)

### Shared Contracts (Use These!)
```
/brain/shared_contracts/
├── shared_types.ts              ← Import types
├── api_response_formats.yaml    ← API standards
├── error_codes.yaml             ← Error handling
├── integration_events.yaml      ← Event schemas
└── USAGE_GUIDE.md              ← How to use
```

### Master Files (Reference These)
```
/brain/
├── master_db_schema.sql         ← Database schema
├── master_roles_permissions.yaml ← Roles & permissions
├── master_api_gateway.yaml      ← API routes
└── master_auth_system.md       ← Authentication
```

### Your Portal Brain
```
Developer A: /brain/01-bitflow-admin/
Developer B: /brain/02-university-owner/
```

---

## 🛠️ Code Templates

### Backend: API Response
```typescript
import { ApiResponse } from '@brain/shared_contracts/shared_types';

async createUniversity(dto: CreateDto): Promise<ApiResponse<University>> {
  return {
    success: true,
    data: { entity: university },
    metadata: {
      timestamp: new Date().toISOString(),
      request_id: this.generateRequestId(),
      portal: PortalType.BITFLOW_ADMIN,
      god_mode_context: { ... }
    }
  };
}
```

### Backend: Emit Event
```typescript
this.eventEmitter.emit('university.created', {
  event_id: uuid(),
  event_type: 'university.created',
  source_portal: 'bitflow-admin',
  timestamp: new Date().toISOString(),
  payload: { university_id, tenant_id, owner_id },
  metadata: { user_id: currentUser.id }
});
```

### Frontend: API Call
```typescript
import type { ApiResponse, University } from '@/types/shared';

const fetchUniversities = async (): Promise<ApiResponse<University[]>> => {
  const response = await fetch('/api/hierarchy/universities');
  return response.json();
};
```

### Frontend: Error Handling
```typescript
import { ERROR_CODES } from '@/constants/errors';

if (error.code === ERROR_CODES.ERR_AUTH_TOKEN_EXPIRED) {
  showToast(error.user_message);
  redirectToLogin();
}
```

---

## 📊 Progress Tracking

### Overall: 75% Complete
```
✅ Shared Contracts: 100% (8 files)
⏳ Master Files: 69% (9/13 files)
⏳ Bitflow Admin: 50% (needs updates)
⏳ University Owner: 50% (needs updates)
⏳ Other Portals: 80% (minor updates)
```

### Time Remaining: ~31 hours
```
Master Files:         7 hours
Bitflow Admin:        9 hours
University Owner:     9 hours
Other Portals:        6 hours
```

---

## 🚨 Critical Rules

### ❌ NEVER
- Modify shared contracts without team approval
- Hardcode enum values (use imports!)
- Use custom response formats
- Skip error codes
- Emit events with wrong schemas
- Merge shared files without both approvals

### ✅ ALWAYS
- Use standard API response format
- Import types from shared_types.ts
- Include God Mode context (if applicable)
- Emit integration events
- Follow validation rules
- Test integration points weekly

---

## 📅 Weekly Schedule

### Monday 9:00 AM - Daily Standup (15 min)
- What did you complete?
- What are you working on?
- Any blockers?

### Wednesday 3:00 PM - Integration Check (30 min)
- Review shared contract changes
- Test API integrations
- Discuss dependencies

### Friday 2:00 PM - Integration Testing (1-2 hrs)
- Run integration tests
- Test event emission/consumption
- Fix issues before weekend

---

## 🎯 Next Immediate Actions

### 1️⃣ Update Master Files (7 hours) ← Recommended
```
✓ master_db_schema.sql         (2 hrs)
✓ master_roles_permissions.yaml (1.5 hrs)
✓ master_api_gateway.yaml       (2 hrs)
✓ master_auth_system.md        (1.5 hrs)
```

### 2️⃣ Complete Bitflow Admin Brain (9 hours)
```
✓ CREATE hierarchical_navigation.md
✓ CREATE god_mode_implementation.md
✓ UPDATE 9 existing brain files
```

### 3️⃣ Complete University Owner Brain (9 hours)
```
✓ CREATE hierarchical_navigation.md
✓ CREATE god_mode_implementation.md
✓ UPDATE 9 existing brain files
```

---

## 💬 Communication

### Slack/Discord Channels
- `#daily-standup` - Daily updates
- `#shared-contracts` - Contract discussions
- `#integration` - API/event integration
- `#blockers` - Issues and blockers
- `#git` - Merge conflicts

### When to Sync
- **Urgent:** Direct message
- **API questions:** `#integration`
- **Contract changes:** `#shared-contracts`
- **Merge conflicts:** `#git`

---

## 🔍 Quick Lookup

### Error Codes (Most Common)
```
ERR_AUTH_INVALID_CREDENTIALS
ERR_AUTH_TOKEN_EXPIRED
ERR_PERMISSION_DENIED
ERR_RESOURCE_NOT_FOUND
ERR_VALIDATION_FAILED
ERR_GOD_MODE_CONTEXT_MISSING
ERR_SYSTEM_INTERNAL
```

### Event Types (Most Common)
```
university.created
college.created
user.role_changed
student.enrolled
payment.received
```

### User Roles
```
bitflow_admin (God Mode ✅)
university_owner (God Mode ✅)
super_admin
principal
college_admin
... (11 more)
```

---

## ✅ Daily Checklist

### Before You Start Coding
- [ ] Pull latest from `develop`
- [ ] Read shared contracts (if not done)
- [ ] Check `#shared-contracts` for changes
- [ ] Review your portal's brain folder

### While Coding
- [ ] Use shared types (import from shared_types.ts)
- [ ] Follow API response format
- [ ] Use error codes (not custom messages)
- [ ] Emit events for cross-portal actions
- [ ] Test as you go

### Before You Commit
- [ ] Tests pass (85%+ coverage)
- [ ] No errors or warnings
- [ ] Followed security checklist
- [ ] Documented any new patterns
- [ ] Ready for code review

### Before You Merge
- [ ] Code reviewed by other developer
- [ ] Integration tests passed
- [ ] No conflicts in shared files
- [ ] Updated progress tracker

---

## 📞 Need Help?

### Questions About...
- **Contracts:** Read `/brain/shared_contracts/USAGE_GUIDE.md`
- **Your Portal:** Read your portal's brain folder
- **Integration:** Check `/brain/PORTAL_DISTRIBUTION.md`
- **Progress:** Check `/brain/BRAIN_FOLDER_ORGANIZATION.md`
- **God Mode:** Read `/COMPLETE_GOD_MODE_ANALYSIS.md`

### Still Stuck?
1. Check the documentation first
2. Ask in the appropriate Slack channel
3. Tag the other developer if needed
4. Schedule a quick sync call

---

## 🎉 Success Metrics

### Your Portal is Done When:
✅ All features implemented  
✅ All API endpoints working  
✅ All pages responsive  
✅ Test coverage ≥ 85%  
✅ Security checklist 100%  
✅ Integration events working  
✅ Code reviewed and merged  
✅ Demo-ready  

---

**Print this card and keep it handy!** 📌

**Ready to start? Pick your next action from the "Next Immediate Actions" section above!** 🚀

---

**Version:** 1.0.0  
**Last Updated:** 2025-01-XX  
**Status:** ✅ Ready for Use
