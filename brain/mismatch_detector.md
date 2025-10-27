# Bitflow LMS - Mismatch Detector & Sync Validator

**Version**: 2.0  
**Purpose**: Detect inconsistencies between frontend TypeScript and backend PHP/Database  
**Last Updated**: October 25, 2025

---

## Overview

The Mismatch Detector is a critical validation tool that ensures:
1. **TypeScript interfaces match Laravel DTOs/Models**
2. **API contracts are synchronized between frontend and backend**
3. **Database schema aligns with backend models**
4. **Enum values are consistent across all layers**

---

## Detection Layers

### Layer 1: TypeScript ↔ Laravel DTO Matching

**Frontend**: `types/student.ts`
```typescript
interface Student {
  id: string;
  user_id: string;
  university_id: string;
  college_id: string;
  admission_number: string;
  admission_date: string; // ISO date
  course: string;
  year: number;
  section: string;
  status: 'active' | 'suspended' | 'graduated' | 'dropped';
}
```

**Backend**: `app/Http/Resources/StudentResource.php`
```php
class StudentResource extends JsonResource {
    public function toArray($request): array {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'university_id' => $this->university_id,
            'college_id' => $this->college_id,
            'admission_number' => $this->admission_number,
            'admission_date' => $this->admission_date->toISOString(),
            'course' => $this->course,
            'year' => $this->year,
            'section' => $this->section,
            'status' => $this->status,
        ];
    }
}
```

**Validation Script**: `scripts/validate-types.js`
```javascript
const fs = require('fs');
const path = require('path');

// Extract TypeScript interface fields
function parseTypeScriptInterface(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/interface Student \{([^}]+)\}/);
  if (!match) return null;
  
  const fields = {};
  const lines = match[1].split('\n').filter(line => line.trim());
  
  lines.forEach(line => {
    const fieldMatch = line.match(/(\w+):\s*([^;]+);?/);
    if (fieldMatch) {
      fields[fieldMatch[1]] = fieldMatch[2].trim();
    }
  });
  
  return fields;
}

// Extract PHP Resource fields
function parsePhpResource(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/return \[([\s\S]+?)\];/);
  if (!match) return null;
  
  const fields = {};
  const lines = match[1].split('\n').filter(line => line.includes('=>'));
  
  lines.forEach(line => {
    const fieldMatch = line.match(/'(\w+)'\s*=>/);
    if (fieldMatch) {
      fields[fieldMatch[1]] = 'mixed'; // Simplified type
    }
  });
  
  return fields;
}

// Compare fields
function compareMismatch(tsFields, phpFields) {
  const mismatches = [];
  
  // Check TypeScript fields exist in PHP
  Object.keys(tsFields).forEach(field => {
    if (!phpFields[field]) {
      mismatches.push({
        field,
        issue: 'MISSING_IN_PHP',
        ts_type: tsFields[field]
      });
    }
  });
  
  // Check PHP fields exist in TypeScript
  Object.keys(phpFields).forEach(field => {
    if (!tsFields[field]) {
      mismatches.push({
        field,
        issue: 'MISSING_IN_TS',
        php_present: true
      });
    }
  });
  
  return mismatches;
}

// Main execution
const tsPath = 'bitflow-frontend/types/student.ts';
const phpPath = 'bitflow-core/app/Http/Resources/StudentResource.php';

const tsFields = parseTypeScriptInterface(tsPath);
const phpFields = parsePhpResource(phpPath);
const mismatches = compareMismatch(tsFields, phpFields);

if (mismatches.length > 0) {
  console.error('❌ MISMATCHES DETECTED:');
  console.table(mismatches);
  process.exit(1);
} else {
  console.log('✅ All fields synchronized!');
}
```

---

### Layer 2: API Contract Validation

**OpenAPI Spec**: `brain/08-student/api_spec.yaml`
```yaml
paths:
  /students/{id}:
    get:
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Student'
```

**Frontend API Client**: `lib/api/students.ts`
```typescript
export async function getStudent(id: string): Promise<Student> {
  const response = await fetch(`/api/students/${id}`);
  return response.json();
}
```

**Backend Route**: `routes/api.php`
```php
Route::get('/students/{id}', [StudentController::class, 'show']);
```

**Validation**: Ensure all three layers define the same endpoint structure.

---

### Layer 3: Database Schema ↔ Model Validation

**Database Schema**: `brain/master_db_schema.sql`
```sql
CREATE TABLE students (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    university_id UUID NOT NULL,
    college_id UUID NOT NULL,
    admission_number VARCHAR(50) UNIQUE NOT NULL,
    admission_date DATE NOT NULL,
    course VARCHAR(100),
    year INTEGER CHECK (year BETWEEN 1 AND 6),
    section VARCHAR(10),
    status VARCHAR(20) NOT NULL DEFAULT 'active'
);
```

**Laravel Model**: `app/Models/Student.php`
```php
class Student extends Model {
    protected $fillable = [
        'user_id',
        'university_id',
        'college_id',
        'admission_number',
        'admission_date',
        'course',
        'year',
        'section',
        'status',
    ];
    
    protected $casts = [
        'admission_date' => 'date',
        'year' => 'integer',
    ];
}
```

**Mismatch Check**:
- Ensure all database columns are in `$fillable` or `$guarded`
- Verify `$casts` match database types
- Check constraints (e.g., `year BETWEEN 1 AND 6`) are validated in backend

---

### Layer 4: Enum Synchronization

**TypeScript Enum**: `types/enums.ts`
```typescript
export enum StudentStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  GRADUATED = 'graduated',
  DROPPED = 'dropped'
}
```

**PHP Enum**: `app/Enums/StudentStatus.php`
```php
enum StudentStatus: string {
    case ACTIVE = 'active';
    case SUSPENDED = 'suspended';
    case GRADUATED = 'graduated';
    case DROPPED = 'dropped';
}
```

**Database Check Constraint**:
```sql
status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'suspended', 'graduated', 'dropped'))
```

**Validation Script**: Ensure all three definitions have identical values.

---

## Automated Validation Tools

### Tool 1: Type Checker Script

```bash
#!/bin/bash
# scripts/check-types.sh

echo "🔍 Checking TypeScript ↔ PHP type consistency..."

# Run type checker
node scripts/validate-types.js

# Check OpenAPI spec matches backend routes
echo "🔍 Validating API routes..."
php artisan route:list --json | node scripts/validate-routes.js

# Check database migrations match models
echo "🔍 Checking database schema..."
php artisan model:validate

echo "✅ All checks passed!"
```

### Tool 2: Pre-commit Hook

```bash
# .husky/pre-commit

#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "Running mismatch detection..."

# Check types
npm run validate:types

# Run linters
npm run lint
php artisan pint --test

# Run tests
npm run test
php artisan test --parallel

echo "✅ Pre-commit checks passed!"
```

### Tool 3: CI/CD Validation

```yaml
# .github/workflows/validate-sync.yml

name: Validate Sync

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
      
      - name: Install dependencies
        run: |
          cd bitflow-frontend && pnpm install
          cd ../bitflow-core && composer install
      
      - name: Validate TypeScript ↔ PHP
        run: node scripts/validate-types.js
      
      - name: Validate API routes
        run: |
          cd bitflow-core
          php artisan route:list --json | node ../scripts/validate-routes.js
      
      - name: Check database schema
        run: |
          cd bitflow-core
          php artisan migrate:status
          php artisan schema:validate
```

---

## Common Mismatches & Fixes

### Mismatch 1: Missing Field in Frontend

**Error**:
```
❌ Field 'guardian_email' exists in PHP but not in TypeScript
```

**Fix**:
```typescript
// types/student.ts
interface Student {
  // ... existing fields
  guardian_email?: string; // Add missing field
}
```

### Mismatch 2: Type Inconsistency

**Error**:
```
❌ Field 'year' type mismatch: TS=string, PHP=integer
```

**Fix**:
```typescript
// types/student.ts
interface Student {
  year: number; // Change from string to number
}
```

### Mismatch 3: Enum Value Mismatch

**Error**:
```
❌ Enum 'StudentStatus' has value 'inactive' in TS but not in PHP
```

**Fix**:
```php
// app/Enums/StudentStatus.php
enum StudentStatus: string {
    case ACTIVE = 'active';
    case INACTIVE = 'inactive'; // Add missing case
    case SUSPENDED = 'suspended';
    // ...
}
```

### Mismatch 4: Missing API Endpoint

**Error**:
```
❌ Route GET /students/{id}/attendance defined in OpenAPI but not in Laravel
```

**Fix**:
```php
// routes/api.php
Route::get('/students/{id}/attendance', [StudentController::class, 'attendance']);
```

---

## Sync Checklist JSON Format

Each portal has a `sync_checklist.json` file:

```json
{
  "portal": "student",
  "version": "2.0",
  "last_validated": "2025-10-25T10:00:00Z",
  "sync_points": [
    {
      "id": "student-type-dto",
      "description": "Student TypeScript interface matches StudentResource",
      "frontend_file": "types/student.ts",
      "backend_file": "app/Http/Resources/StudentResource.php",
      "status": "synced",
      "last_checked": "2025-10-25T10:00:00Z"
    },
    {
      "id": "student-api-routes",
      "description": "Student API routes match OpenAPI spec",
      "spec_file": "brain/08-student/api_spec.yaml",
      "backend_file": "routes/api.php",
      "status": "synced",
      "last_checked": "2025-10-25T10:00:00Z"
    },
    {
      "id": "student-db-model",
      "description": "students table schema matches Student model",
      "schema_file": "brain/master_db_schema.sql",
      "model_file": "app/Models/Student.php",
      "status": "synced",
      "last_checked": "2025-10-25T10:00:00Z"
    },
    {
      "id": "student-status-enum",
      "description": "StudentStatus enum synchronized across layers",
      "frontend_file": "types/enums.ts",
      "backend_file": "app/Enums/StudentStatus.php",
      "database_constraint": "students.status CHECK constraint",
      "status": "synced",
      "last_checked": "2025-10-25T10:00:00Z"
    }
  ],
  "critical_fields": [
    "id",
    "user_id",
    "university_id",
    "college_id",
    "admission_number",
    "status"
  ],
  "known_issues": []
}
```

---

## Manual Validation Steps

### Step 1: Compare TypeScript and PHP

1. Open `types/student.ts`
2. Open `app/Http/Resources/StudentResource.php`
3. Line-by-line comparison of field names
4. Check type consistency (string vs number, optional vs required)

### Step 2: Validate API Contracts

1. Open `brain/08-student/api_spec.yaml`
2. Run `php artisan route:list`
3. Ensure every OpenAPI endpoint has a Laravel route
4. Check request/response schemas match DTOs

### Step 3: Database Schema Review

1. Open `brain/master_db_schema.sql`
2. Open `app/Models/Student.php`
3. Verify `$fillable` includes all table columns
4. Check `$casts` match SQL data types
5. Ensure constraints are enforced in validation

### Step 4: Test Data Flow

1. Create student via API
2. Check database record
3. Fetch student via API
4. Verify frontend receives correct shape
5. Check all fields are present and correctly typed

---

## Reporting

### Daily Sync Report

```bash
#!/bin/bash
# scripts/daily-sync-report.sh

echo "📊 Daily Sync Report - $(date)"
echo "================================"

# Count total sync points
total=$(find brain/*/sync_checklist.json | wc -l)
echo "Total sync checklists: $total"

# Check status
synced=0
out_of_sync=0

for file in brain/*/sync_checklist.json; do
  status=$(jq -r '.sync_points[] | select(.status != "synced") | .id' "$file")
  if [ -z "$status" ]; then
    ((synced++))
  else
    ((out_of_sync++))
    echo "⚠️ Out of sync: $file"
    echo "$status"
  fi
done

echo "✅ Synced portals: $synced/$total"
echo "❌ Out of sync: $out_of_sync/$total"

if [ $out_of_sync -gt 0 ]; then
  exit 1
fi
```

---

## Best Practices

1. **Run validation before every commit**
2. **Update sync checklists when adding fields**
3. **Keep TypeScript interfaces as source of truth for frontend**
4. **Keep Laravel models as source of truth for backend**
5. **Use code generation tools to sync automatically**
6. **Write integration tests that verify end-to-end data flow**
7. **Document intentional mismatches (e.g., computed fields)**
8. **Set up alerts for failed sync checks in CI/CD**

---

**🎯 Goal: Zero mismatches between frontend, backend, and database at all times.**
