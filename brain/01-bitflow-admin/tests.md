# Bitflow Admin Portal - Testing Strategy

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Testing Pyramid

```
        /\
       /  \  E2E Tests (10%)
      /____\
     /      \  Integration Tests (30%)
    /________\
   /          \  Unit Tests (60%)
  /______________\
```

---

## 1. Unit Tests (Backend - Laravel)

### Test Structure

```
tests/
├── Unit/
│   ├── Models/
│   │   ├── UniversityTest.php
│   │   ├── SubscriptionTest.php
│   │   └── InvoiceTest.php
│   ├── Services/
│   │   ├── UniversityServiceTest.php
│   │   ├── BillingServiceTest.php
│   │   └── AnalyticsServiceTest.php
│   └── Middleware/
│       ├── EnsureBitflowOwnerTest.php
│       └── CheckIPWhitelistTest.php
```

### Example: UniversityTest.php

```php
<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\University;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UniversityTest extends TestCase
{
    use RefreshDatabase;

    public function test_university_has_correct_fillable_attributes()
    {
        $fillable = (new University())->getFillable();
        
        $this->assertContains('name', $fillable);
        $this->assertContains('domain', $fillable);
        $this->assertContains('primary_email', $fillable);
    }

    public function test_storage_percentage_accessor()
    {
        $university = University::factory()->create([
            'storage_quota_gb' => 1000,
            'storage_used_gb' => 250,
        ]);

        $this->assertEquals(25.0, $university->storage_percentage);
    }

    public function test_active_scope()
    {
        University::factory()->create(['status' => 'active']);
        University::factory()->create(['status' => 'inactive']);
        University::factory()->create(['status' => 'active']);

        $activeCount = University::active()->count();

        $this->assertEquals(2, $activeCount);
    }

    public function test_university_can_have_many_users()
    {
        $university = University::factory()->create();
        $user1 = User::factory()->create(['university_id' => $university->id]);
        $user2 = User::factory()->create(['university_id' => $university->id]);

        $this->assertCount(2, $university->users);
    }
}
```

### Example: UniversityServiceTest.php

```php
<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\UniversityService;
use App\Models\University;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UniversityServiceTest extends TestCase
{
    use RefreshDatabase;

    protected UniversityService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = new UniversityService();
    }

    public function test_create_university_generates_domain_and_slug()
    {
        $data = [
            'name' => 'MIT University',
            'primary_email' => 'admin@mit.edu',
            'primary_phone' => '+1-617-253-1000',
            'storage_quota_gb' => 500,
            'subscription_plan' => 'pro',
        ];

        $university = $this->service->create($data);

        $this->assertEquals('mit-university', $university->slug);
        $this->assertEquals('mit-university.bitflow.edu', $university->domain);
    }

    public function test_create_university_also_creates_subscription()
    {
        $data = [
            'name' => 'Test University',
            'primary_email' => 'admin@test.edu',
            'primary_phone' => '+1-555-0100',
            'storage_quota_gb' => 500,
            'subscription_plan' => 'enterprise',
        ];

        $university = $this->service->create($data);

        $this->assertDatabaseHas('subscriptions', [
            'university_id' => $university->id,
            'plan' => 'enterprise',
            'status' => 'trial',
        ]);
    }

    public function test_delete_university_removes_all_related_data()
    {
        $university = University::factory()->create();
        $user = User::factory()->create(['university_id' => $university->id]);

        $this->service->delete($university);

        $this->assertDatabaseMissing('universities', ['id' => $university->id]);
        $this->assertDatabaseMissing('users', ['id' => $user->id]);
    }
}
```

---

## 2. Feature Tests (Backend - API Endpoints)

### Test Structure

```
tests/
├── Feature/
│   ├── Admin/
│   │   ├── PlatformControllerTest.php
│   │   ├── UniversityControllerTest.php
│   │   ├── GlobalUserControllerTest.php
│   │   ├── AnalyticsControllerTest.php
│   │   ├── BillingControllerTest.php
│   │   └── SettingsControllerTest.php
```

### Example: UniversityControllerTest.php

```php
<?php

namespace Tests\Feature\Admin;

use Tests\TestCase;
use App\Models\User;
use App\Models\University;
use Illuminate\Foundation\Testing\RefreshDatabase;

class UniversityControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $bitflowOwner;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->bitflowOwner = User::factory()->create([
            'role' => 'bitflow_owner',
            'university_id' => null,
        ]);
    }

    public function test_bitflow_owner_can_list_universities()
    {
        University::factory()->count(3)->create();

        $response = $this->actingAs($this->bitflowOwner, 'sanctum')
            ->getJson('/api/admin/universities');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    public function test_bitflow_owner_can_create_university()
    {
        $data = [
            'name' => 'New University',
            'primary_email' => 'admin@new.edu',
            'primary_phone' => '+1-555-0200',
            'storage_quota_gb' => 500,
            'subscription_plan' => 'pro',
        ];

        $response = $this->actingAs($this->bitflowOwner, 'sanctum')
            ->postJson('/api/admin/universities', $data);

        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'name', 'domain', 'slug']);

        $this->assertDatabaseHas('universities', [
            'name' => 'New University',
            'primary_email' => 'admin@new.edu',
        ]);
    }

    public function test_create_university_validates_required_fields()
    {
        $response = $this->actingAs($this->bitflowOwner, 'sanctum')
            ->postJson('/api/admin/universities', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'primary_email', 'primary_phone']);
    }

    public function test_create_university_validates_unique_email()
    {
        $existing = University::factory()->create([
            'primary_email' => 'existing@test.edu',
        ]);

        $data = [
            'name' => 'New University',
            'primary_email' => 'existing@test.edu',
            'primary_phone' => '+1-555-0300',
            'storage_quota_gb' => 500,
            'subscription_plan' => 'pro',
        ];

        $response = $this->actingAs($this->bitflowOwner, 'sanctum')
            ->postJson('/api/admin/universities', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['primary_email']);
    }

    public function test_bitflow_owner_can_update_university()
    {
        $university = University::factory()->create();

        $response = $this->actingAs($this->bitflowOwner, 'sanctum')
            ->patchJson("/api/admin/universities/{$university->id}", [
                'name' => 'Updated Name',
                'storage_quota_gb' => 1000,
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('universities', [
            'id' => $university->id,
            'name' => 'Updated Name',
            'storage_quota_gb' => 1000,
        ]);
    }

    public function test_bitflow_owner_can_delete_university_with_confirmation()
    {
        $university = University::factory()->create();

        $response = $this->actingAs($this->bitflowOwner, 'sanctum')
            ->deleteJson("/api/admin/universities/{$university->id}?confirmation=DELETE");

        $response->assertStatus(204);

        $this->assertDatabaseMissing('universities', ['id' => $university->id]);
    }

    public function test_delete_university_requires_confirmation()
    {
        $university = University::factory()->create();

        $response = $this->actingAs($this->bitflowOwner, 'sanctum')
            ->deleteJson("/api/admin/universities/{$university->id}");

        $response->assertStatus(400);

        $this->assertDatabaseHas('universities', ['id' => $university->id]);
    }

    public function test_cannot_delete_university_with_active_users()
    {
        $university = University::factory()->create();
        User::factory()->create(['university_id' => $university->id]);

        $response = $this->actingAs($this->bitflowOwner, 'sanctum')
            ->deleteJson("/api/admin/universities/{$university->id}?confirmation=DELETE");

        $response->assertStatus(400)
            ->assertJsonFragment(['message' => 'Cannot delete university with']);

        $this->assertDatabaseHas('universities', ['id' => $university->id]);
    }

    public function test_non_bitflow_owner_cannot_access_endpoints()
    {
        $superAdmin = User::factory()->create([
            'role' => 'super_admin',
            'university_id' => University::factory()->create()->id,
        ]);

        $response = $this->actingAs($superAdmin, 'sanctum')
            ->getJson('/api/admin/universities');

        $response->assertStatus(403);
    }

    public function test_unauthenticated_user_cannot_access_endpoints()
    {
        $response = $this->getJson('/api/admin/universities');

        $response->assertStatus(401);
    }
}
```

---

## 3. Integration Tests

### Example: BillingIntegrationTest.php

```php
<?php

namespace Tests\Integration;

use Tests\TestCase;
use App\Models\University;
use App\Models\Invoice;
use App\Services\BillingService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BillingIntegrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_monthly_invoice_generation_flow()
    {
        $university = University::factory()->create([
            'subscription_plan' => 'enterprise',
        ]);

        $billingService = app(BillingService::class);
        $invoice = $billingService->generateInvoice($university);

        $this->assertDatabaseHas('invoices', [
            'university_id' => $university->id,
            'status' => 'open',
        ]);

        $this->assertEquals(2500.00, $invoice->total); // Enterprise plan
    }

    public function test_payment_processing_updates_invoice_status()
    {
        $invoice = Invoice::factory()->create(['status' => 'open']);

        $billingService = app(BillingService::class);
        $billingService->processPayment($invoice, 'card_test_success');

        $this->assertDatabaseHas('invoices', [
            'id' => $invoice->id,
            'status' => 'paid',
        ]);
    }
}
```

---

## 4. Frontend Tests (TypeScript + Jest + React Testing Library)

### Test Structure

```
bitflow-admin/
├── __tests__/
│   ├── components/
│   │   ├── CreateUniversityModal.test.tsx
│   │   ├── UniversitiesTable.test.tsx
│   │   └── StatCard.test.tsx
│   ├── hooks/
│   │   ├── useAuth.test.ts
│   │   └── useUniversities.test.ts
│   ├── utils/
│   │   └── formatters.test.ts
│   └── pages/
│       └── universities.test.tsx
```

### Example: CreateUniversityModal.test.tsx

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateUniversityModal } from '@/components/universities/CreateUniversityModal';

describe('CreateUniversityModal', () => {
  it('renders modal when open', () => {
    render(
      <CreateUniversityModal 
        isOpen={true} 
        onClose={() => {}} 
        onSuccess={() => {}} 
      />
    );

    expect(screen.getByText('Create New University')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <CreateUniversityModal 
        isOpen={true} 
        onClose={() => {}} 
        onSuccess={() => {}} 
      />
    );

    const submitButton = screen.getByText('Create University');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Name must be at least 3 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    const onSuccess = jest.fn();

    render(
      <CreateUniversityModal 
        isOpen={true} 
        onClose={() => {}} 
        onSuccess={onSuccess} 
      />
    );

    fireEvent.change(screen.getByLabelText(/University Name/i), {
      target: { value: 'Test University' },
    });
    fireEvent.change(screen.getByLabelText(/Primary Email/i), {
      target: { value: 'admin@test.edu' },
    });
    fireEvent.change(screen.getByLabelText(/Contact Phone/i), {
      target: { value: '+1-555-0100' },
    });

    fireEvent.click(screen.getByText('Create University'));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
```

---

## 5. E2E Tests (Playwright)

### Test Structure

```
e2e/
├── auth.spec.ts
├── universities.spec.ts
├── billing.spec.ts
└── settings.spec.ts
```

### Example: universities.spec.ts

```typescript
import { test, expect } from '@playwright/test';

test.describe('University Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as Bitflow Owner
    await page.goto('http://localhost:3001/login');
    await page.fill('input[name="email"]', 'owner@bitflow.edu');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:3001/');
  });

  test('should display universities list', async ({ page }) => {
    await page.goto('http://localhost:3001/universities');
    
    await expect(page.locator('h1')).toContainText('Universities Management');
    await expect(page.locator('table')).toBeVisible();
  });

  test('should create new university', async ({ page }) => {
    await page.goto('http://localhost:3001/universities');
    
    // Open modal
    await page.click('button:has-text("Create University")');
    
    // Fill form
    await page.fill('input[name="name"]', 'E2E Test University');
    await page.fill('input[name="primary_email"]', 'admin@e2etest.edu');
    await page.fill('input[name="primary_phone"]', '+1-555-9999');
    await page.selectOption('select[name="subscription_plan"]', 'pro');
    
    // Submit
    await page.click('button:has-text("Create University")');
    
    // Verify success
    await expect(page.locator('text=University created successfully')).toBeVisible();
    await expect(page.locator('text=E2E Test University')).toBeVisible();
  });

  test('should search universities', async ({ page }) => {
    await page.goto('http://localhost:3001/universities');
    
    await page.fill('input[placeholder*="Search"]', 'MIT');
    await page.waitForTimeout(500); // Debounce
    
    const rows = page.locator('table tbody tr');
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('MIT');
  });

  test('should suspend university', async ({ page }) => {
    await page.goto('http://localhost:3001/universities');
    
    // Click actions menu
    await page.click('button[aria-label="Actions"]:first');
    await page.click('text=Suspend University');
    
    // Confirm
    await page.click('button:has-text("Confirm")');
    
    // Verify
    await expect(page.locator('text=University suspended')).toBeVisible();
  });
});
```

---

## 6. Performance Tests

### Load Testing (k6)

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },  // Ramp up to 50 users
    { duration: '3m', target: 50 },  // Stay at 50 users
    { duration: '1m', target: 100 }, // Ramp up to 100 users
    { duration: '3m', target: 100 }, // Stay at 100 users
    { duration: '1m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],   // Error rate must be less than 1%
  },
};

const BASE_URL = 'http://localhost:8000';
const TOKEN = 'your-test-token';

export default function () {
  const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  };

  // Test: List universities
  let res = http.get(`${BASE_URL}/api/admin/universities`, { headers });
  check(res, {
    'list universities status is 200': (r) => r.status === 200,
    'list universities response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // Test: Get platform dashboard
  res = http.get(`${BASE_URL}/api/admin/dashboard`, { headers });
  check(res, {
    'dashboard status is 200': (r) => r.status === 200,
    'dashboard response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}
```

Run: `k6 run load-test.js`

---

## 7. Test Coverage Goals

- **Unit Tests**: > 80% code coverage
- **Feature Tests**: All API endpoints covered
- **Integration Tests**: Critical user flows covered
- **E2E Tests**: Happy paths + critical error paths
- **Performance Tests**: Response times within thresholds

---

## Running All Tests

### Backend

```powershell
# Run all tests
php artisan test

# With coverage
php artisan test --coverage

# Run specific test suite
php artisan test tests/Feature/Admin/UniversityControllerTest.php

# Run tests in parallel
php artisan test --parallel
```

### Frontend

```powershell
# Run unit tests
pnpm test

# Run E2E tests
pnpm test:e2e

# Run with coverage
pnpm test:coverage
```

---

**Testing Strategy Complete!**
