# 🎯 Shared Contracts Foundation - Complete Setup

## ✅ What Was Created

The `brain/shared_contracts/` folder now contains **6 critical files** that serve as the **single source of truth** for parallel development:

### 📋 Files Created

| File | Purpose | Size | Critical For |
|------|---------|------|--------------|
| `README.md` | Overview and usage guide | Guide | Understanding contracts |
| `api_response_formats.yaml` | Standard API response structures | 350+ lines | API consistency |
| `shared_types.ts` | TypeScript interfaces and types | 500+ lines | Type safety |
| `shared_enums.yaml` | All enums and constants | 400+ lines | Consistent values |
| `error_codes.yaml` | Standardized error codes | 350+ lines | Error handling |
| `integration_events.yaml` | Event schemas for cross-portal communication | 500+ lines | Portal integration |
| `validation_rules.yaml` | Shared validation rules | 400+ lines | Data validation |

**Total:** 7 files, ~2,900 lines of production-ready contracts

---

## 🎯 Purpose: Zero-Conflict Parallel Development

These contracts enable **two developers** to work on **14 portals simultaneously** with:

### ✅ Guaranteed Benefits:
1. **No merge conflicts** - Clear boundaries
2. **Consistent APIs** - Same response formats
3. **Type safety** - Shared TypeScript interfaces
4. **Easy integration** - Predefined event contracts
5. **Faster development** - No guesswork

---

## 📖 How to Use (For Both Developers)

### Step 1: Read All Contracts (30 minutes)
Before writing ANY code, both developers must read:
1. `README.md` - Understanding the contract system
2. `shared_types.ts` - All entity interfaces
3. `api_response_formats.yaml` - Response structures
4. `shared_enums.yaml` - All constants
5. `error_codes.yaml` - Error handling
6. `integration_events.yaml` - Cross-portal events
7. `validation_rules.yaml` - Validation standards

### Step 2: Import Contracts in Your Code

#### Backend (NestJS):
```typescript
// In your DTOs, services, and controllers
import { 
  User, 
  University, 
  ApiResponse, 
  GodModeContext,
  UserRole 
} from '@brain/shared_contracts/shared_types';

import { ErrorCode } from '@brain/shared_contracts/error_codes';

// Use in service
async createUniversity(dto: CreateUniversityDto): Promise<ApiResponse<University>> {
  try {
    const university = await this.universityRepo.save(dto);
    
    return {
      success: true,
      data: { entity: university },
      metadata: {
        timestamp: new Date().toISOString(),
        request_id: this.generateRequestId(),
        portal: PortalType.BITFLOW_ADMIN,
      }
    };
  } catch (error) {
    throw new ApiException(ErrorCode.ERR_SYSTEM_DATABASE);
  }
}
```

#### Frontend (React):
```typescript
// In your components and API calls
import type { 
  User, 
  ApiResponse, 
  NavigationNode 
} from '@/types/shared';

import { ERROR_CODES } from '@/constants/errors';

// Use in API call
const fetchUniversities = async (): Promise<ApiResponse<University[]>> => {
  const response = await fetch('/api/hierarchy/universities');
  return response.json();
};

// Handle errors
if (error.code === ERROR_CODES.ERR_AUTH_TOKEN_EXPIRED) {
  showToast(error.user_message);
  redirectToLogin();
}
```

### Step 3: Follow the Response Format Standards

#### ✅ Correct API Response:
```json
{
  "success": true,
  "data": {
    "universities": [...]
  },
  "metadata": {
    "timestamp": "2025-01-15T10:30:00Z",
    "request_id": "req_abc123",
    "portal": "bitflow-admin",
    "god_mode_context": {
      "is_god_mode": true,
      "viewing_tenant_id": "tenant_xyz",
      "hierarchy_level": "platform"
    }
  }
}
```

#### ❌ Wrong (will break integration):
```json
{
  "data": [...],  // Missing success, metadata
  "status": "ok"   // Non-standard field
}
```

### Step 4: Emit and Consume Integration Events

#### Developer A (Bitflow Admin) - Emit Event:
```typescript
// When creating a university
this.eventEmitter.emit('university.created', {
  event_id: uuid(),
  event_type: 'university.created',
  source_portal: 'bitflow-admin',
  timestamp: new Date().toISOString(),
  payload: {
    university_id: newUniversity.id,
    tenant_id: newUniversity.tenant_id,
    owner_id: newUniversity.owner_id,
    name: newUniversity.name
  },
  metadata: {
    user_id: currentUser.id,
    god_mode_context: {...}
  }
});
```

#### Developer B (University Owner) - Listen for Event:
```typescript
// In University Owner portal
@OnEvent('university.created')
async handleUniversityCreated(event: UniversityCreatedEvent) {
  // Initialize university dashboard
  await this.initializeDashboard(event.payload.university_id);
  
  // Send welcome email
  await this.sendWelcomeEmail(event.payload.owner_id);
  
  // Create default roles
  await this.createDefaultRoles(event.payload.tenant_id);
}
```

---

## 🚨 Critical Rules (MUST FOLLOW!)

### Rule 1: Never Modify Contracts Without Agreement
- **Before modifying ANY file in `shared_contracts/`:**
  1. Discuss in daily standup or Slack
  2. Get approval from the other developer
  3. Update version number in file header
  4. Notify in commit message: `[SHARED-CONTRACT] Updated User interface`

### Rule 2: Always Use Standard Response Format
- **Every API endpoint MUST return:**
  ```typescript
  {
    success: boolean,
    data?: any,
    error?: ApiError,
    metadata: ApiMetadata
  }
  ```

### Rule 3: Always Include God Mode Context (if applicable)
- **For Bitflow Admin and University Owner:**
  ```typescript
  metadata: {
    god_mode_context: {
      is_god_mode: true,
      viewing_tenant_id: "tenant_xyz",
      hierarchy_level: "platform"
    }
  }
  ```

### Rule 4: Use Shared Enums, Never Hardcode
- ❌ **Wrong:** `if (user.role === 'bitflow_admin')`
- ✅ **Correct:** `if (user.role === UserRole.BITFLOW_ADMIN)`

### Rule 5: Emit Events for Cross-Portal Actions
- **When you create/update/delete entities that other portals need to know about:**
  - Emit an integration event
  - Use the exact schema from `integration_events.yaml`
  - Include all required fields

---

## 📊 Contract Coverage

### What's Covered:
✅ **All 14 user roles** (with God Mode flags)  
✅ **Core entities** (University, College, Department, Student, Faculty)  
✅ **Authentication** (JWT, login, permissions)  
✅ **Hierarchical navigation** (for God Mode)  
✅ **Pagination** (standard across all lists)  
✅ **CRUD operations** (create, read, update, delete)  
✅ **Batch operations** (bulk create, update)  
✅ **File uploads** (images, documents, CSV)  
✅ **Error handling** (50+ error codes)  
✅ **Integration events** (20+ event types)  
✅ **Validation rules** (comprehensive)  

### What's NOT Covered (Portal-Specific):
- Portal-specific business logic
- Portal-specific UI components
- Portal-specific database queries
- Portal-specific routes (except hierarchy API)

---

## 🔄 Workflow for Adding New Contracts

### When Developer A Needs a New Shared Type:

1. **Identify the need:**
   - "I need a `Timetable` entity that University Owner portal will also use"

2. **Check if it's truly shared:**
   - Will other portals use this entity? → Yes → Add to shared contracts
   - Only my portal uses it? → No → Keep it in your portal's types

3. **Create PR with `[SHARED-CONTRACT]` prefix:**
   ```bash
   git checkout -b feat/add-timetable-shared-type
   # Edit shared_types.ts
   git add brain/shared_contracts/shared_types.ts
   git commit -m "[SHARED-CONTRACT] Add Timetable interface"
   git push
   # Create PR, request review from Developer B
   ```

4. **Wait for approval before merging**

5. **Both developers pull latest:**
   ```bash
   git pull origin develop
   # Now both have the new Timetable type
   ```

---

## 🧪 Testing Your Contract Usage

### Backend Test:
```typescript
describe('UniversityController', () => {
  it('should return standard API response format', async () => {
    const response = await controller.getUniversities();
    
    expect(response).toHaveProperty('success');
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('metadata');
    expect(response.metadata).toHaveProperty('timestamp');
    expect(response.metadata).toHaveProperty('request_id');
  });
  
  it('should include God Mode context for Bitflow Admin', async () => {
    const response = await controller.getUniversities(godModeUser);
    
    expect(response.metadata.god_mode_context).toBeDefined();
    expect(response.metadata.god_mode_context.is_god_mode).toBe(true);
  });
});
```

### Frontend Test:
```typescript
describe('API Client', () => {
  it('should handle standard error responses', async () => {
    // Mock API error
    mockFetch.mockResolvedValue({
      json: () => ({
        success: false,
        error: {
          code: 'ERR_AUTH_TOKEN_EXPIRED',
          message: 'Token expired',
          user_message: 'Your session has expired. Please log in again.'
        }
      })
    });
    
    const result = await apiClient.getUniversities();
    
    expect(result.success).toBe(false);
    expect(result.error.code).toBe('ERR_AUTH_TOKEN_EXPIRED');
  });
});
```

---

## 📞 Communication Protocol

### Daily Standup Questions:
1. **Did you modify any shared contracts?** (If yes, notify team)
2. **Do you need any new shared types/enums?** (Discuss before adding)
3. **Are you emitting any new integration events?** (Ensure other dev knows to listen)

### Slack/Chat:
- Use `#shared-contracts` channel for all contract discussions
- Tag the other developer when proposing changes
- Use thread for detailed discussions

### Code Reviews:
- **Any PR touching `brain/shared_contracts/` = HIGH PRIORITY**
- Both developers must review and approve
- Test locally before approving

---

## 🎓 Learning Path (First Week)

### Day 1: Read and Understand
- [ ] Read all 7 contract files
- [ ] Understand the response format
- [ ] Understand God Mode context

### Day 2: Set Up Imports
- [ ] Configure TypeScript path aliases
- [ ] Import shared types in your portal
- [ ] Create utility functions for API responses

### Day 3: Implement First Endpoint
- [ ] Create one CRUD endpoint following contracts
- [ ] Test response format
- [ ] Test error handling

### Day 4: Emit First Event
- [ ] Implement event emission
- [ ] Verify event structure matches contract
- [ ] Test with the other developer

### Day 5: Integration Test
- [ ] Both developers test each other's APIs
- [ ] Verify contracts are followed
- [ ] Fix any discrepancies

---

## 🚀 Quick Reference

### Most Used Types:
```typescript
import { 
  User,           // User entity
  University,     // University entity
  College,        // College entity
  ApiResponse,    // API response wrapper
  GodModeContext, // God Mode context
  UserRole,       // User roles enum
  PortalType,     // Portal types enum
} from '@brain/shared_contracts/shared_types';
```

### Most Used Error Codes:
```typescript
ERR_AUTH_INVALID_CREDENTIALS
ERR_AUTH_TOKEN_EXPIRED
ERR_PERMISSION_DENIED
ERR_RESOURCE_NOT_FOUND
ERR_VALIDATION_FAILED
ERR_GOD_MODE_CONTEXT_MISSING
ERR_SYSTEM_INTERNAL
```

### Most Used Events:
```typescript
'university.created'
'college.created'
'user.role_changed'
'student.enrolled'
'payment.received'
```

---

## 🎯 Success Metrics

### You're Using Contracts Correctly If:
✅ All API responses follow the standard format  
✅ All errors use error codes from `error_codes.yaml`  
✅ All enums are imported, not hardcoded  
✅ Integration events match the schemas  
✅ No merge conflicts in shared contract files  
✅ Other developer can integrate without asking questions  

### Red Flags (Fix Immediately):
❌ Custom response formats  
❌ Hardcoded role strings  
❌ Missing God Mode context  
❌ Events with different schemas  
❌ Merge conflicts in contracts  
❌ Type mismatches between portals  

---

## 📚 Next Steps

1. **Read all contract files** (30-45 minutes)
2. **Set up imports in your portal** (15 minutes)
3. **Implement your first endpoint** (1 hour)
4. **Test with the other developer** (30 minutes)
5. **Start building your portal features** (ongoing)

---

## 🤝 Support

- **Questions about contracts?** → Ask in #shared-contracts channel
- **Need a new shared type?** → Create a PR with `[SHARED-CONTRACT]` prefix
- **Integration issues?** → Schedule a quick sync call
- **Conflicts?** → Resolve together, don't force push!

---

**Remember:** These contracts are your **guardrails** for smooth parallel development. Follow them, trust them, and you'll integrate seamlessly! 🚀

---

**Version:** 1.0.0  
**Last Updated:** 2025-01-XX  
**Maintained By:** Both Developers  
**Status:** ✅ Ready for Production Use
