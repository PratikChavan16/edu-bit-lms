# Shared Contracts - MUST READ FIRST

## Purpose
This folder contains **ALL shared contracts** that BOTH developers MUST use when building their assigned portals. These contracts are the **single source of truth** for:
- API request/response formats
- Shared TypeScript types and interfaces
- Enums and constants
- Error codes and messages
- Integration events between portals

## Critical Rules for Parallel Development

### 🚨 NEVER MODIFY THESE FILES WITHOUT TEAM AGREEMENT 🚨
1. **Read-only by default**: Treat these as immutable contracts
2. **Changes require sync**: If you need to change a contract, discuss in daily standup
3. **Version control**: All changes must be documented with version numbers
4. **Breaking changes**: Must be approved by both developers

### How to Use These Contracts

#### For Backend Developers:
```typescript
// Import shared types
import { UniversityHierarchy, GodModeContext } from '@brain/shared_contracts/shared_types';
import { ErrorCode } from '@brain/shared_contracts/error_codes';

// Use standard response format
import { apiResponse } from '@brain/shared_contracts/api_response_formats';
```

#### For Frontend Developers:
```typescript
// Import shared types
import type { User, Role, NavigationNode } from '@/types/shared';

// Use consistent error handling
import { ERROR_CODES } from '@/constants/errors';
```

## Files in This Folder

| File | Purpose | Used By | Update Frequency |
|------|---------|---------|------------------|
| `api_response_formats.yaml` | Standard API response structures | Backend & Frontend | Rarely (only for new patterns) |
| `shared_types.ts` | TypeScript interfaces for entities | Both | Weekly (as entities evolve) |
| `shared_enums.yaml` | All enums (roles, statuses, etc.) | Both | Rarely (stable after initial setup) |
| `error_codes.yaml` | Standardized error codes | Backend | Rarely (add new codes as needed) |
| `integration_events.yaml` | Event contracts for inter-portal communication | Backend | Weekly (as integrations grow) |
| `validation_rules.yaml` | Shared validation rules (email, phone, etc.) | Both | Rarely (stable patterns) |

## Parallel Development Workflow

### Developer A (Portals 1-7)
1. Clone repo, read all files in `shared_contracts/`
2. Use these types in your portal's backend/frontend
3. If you need a new shared type, create a PR with `[SHARED-CONTRACT]` prefix
4. Wait for Developer B approval before merging

### Developer B (Portals 8-14)
1. Clone repo, read all files in `shared_contracts/`
2. Use these types in your portal's backend/frontend
3. If you need a new shared type, create a PR with `[SHARED-CONTRACT]` prefix
4. Wait for Developer A approval before merging

## Integration Points

### God Mode Hierarchy Access
Both Bitflow Admin and University Owner need to consume the same hierarchy API:
```
GET /api/hierarchy/universities
GET /api/hierarchy/colleges/:id
GET /api/hierarchy/departments/:id
```

Response format defined in: `api_response_formats.yaml` → `hierarchical_navigation`

### Cross-Portal Data Access
When Bitflow Admin needs to access University Owner data (or vice versa):
- Use integration events (defined in `integration_events.yaml`)
- Follow the event schema exactly
- Emit events with proper context (user_id, tenant_id, god_mode_flag)

## Conflict Resolution

### If Both Developers Modify the Same Contract:
1. **Stop and sync immediately**
2. Discuss the conflict in a quick call
3. Agree on the final contract structure
4. One developer updates, the other reviews and pulls

### If Contracts Drift:
- Run the mismatch detector (see `../mismatch_detector.md`)
- Fix discrepancies before continuing development

## Version History

| Version | Date | Change | Author |
|---------|------|--------|--------|
| 1.0.0 | 2025-01-XX | Initial shared contracts for God Mode | Dev A + Dev B |

---

**Remember**: These contracts are your **guardrails for zero-conflict development**. Trust them, follow them, and you'll integrate smoothly! 🚀
