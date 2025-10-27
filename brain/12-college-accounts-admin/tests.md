# College Accounts Admin Portal - Testing Guide

**Testing Philosophy**: Test Financial Accuracy + Security + Performance  
**Coverage Target**: 85%+ for financial modules  
**Test Pyramid**: 60% Unit, 30% Integration, 10% E2E

---

## Table of Contents
1. [Test Strategy](#1-test-strategy)
2. [Unit Tests](#2-unit-tests)
3. [Integration Tests](#3-integration-tests)
4. [End-to-End Tests](#4-end-to-end-tests)
5. [Performance Tests](#5-performance-tests)
6. [Security Tests](#6-security-tests)
7. [CI/CD Pipeline](#7-cicd-pipeline)

---

## 1. Test Strategy

### Testing Pyramid
```
        /\
       /E2E\      10% - Critical user flows (payment, approval)
      /------\
     /  API   \   30% - API endpoints, integrations
    /----------\
   /    Unit    \ 60% - Models, services, utilities
  /--------------\
```

### Test Environment Setup

**File**: `phpunit.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="./vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         colors="true">
    <testsuites>
        <testsuite name="Unit">
            <directory suffix="Test.php">./tests/Unit</directory>
        </testsuite>
        <testsuite name="Feature">
            <directory suffix="Test.php">./tests/Feature</directory>
        </testsuite>
    </testsuites>
    <coverage>
        <include>
            <directory suffix=".php">./app</directory>
        </include>
        <exclude>
            <directory>./app/Http/Middleware</directory>
            <file>./app/Http/Kernel.php</file>
        </exclude>
    </coverage>
    <php>
        <env name="APP_ENV" value="testing"/>
        <env name="DB_CONNECTION" value="pgsql"/>
        <env name="DB_DATABASE" value="lms_test"/>
        <env name="CACHE_DRIVER" value="array"/>
        <env name="QUEUE_CONNECTION" value="sync"/>
        <env name="SESSION_DRIVER" value="array"/>
    </php>
</phpunit>
```

---

## 2. Unit Tests

### 2.1 Expense Model Tests

**File**: `tests/Unit/Models/ExpenseTest.php`

```php
<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Expense;
use App\Models\User;
use App\Models\Vendor;
use App\Models\GLCode;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ExpenseTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RolePermissionSeeder::class);
    }

    /** @test */
    public function it_belongs_to_a_college()
    {
        $expense = Expense::factory()->create();

        $this->assertInstanceOf(College::class, $expense->college);
        $this->assertEquals($expense->college_id, $expense->college->id);
    }

    /** @test */
    public function it_belongs_to_a_vendor()
    {
        $expense = Expense::factory()->create();

        $this->assertInstanceOf(Vendor::class, $expense->vendor);
        $this->assertEquals($expense->vendor_id, $expense->vendor->id);
    }

    /** @test */
    public function it_belongs_to_a_gl_code()
    {
        $expense = Expense::factory()->create();

        $this->assertInstanceOf(GLCode::class, $expense->glCode);
        $this->assertEquals($expense->gl_code_id, $expense->glCode->id);
    }

    /** @test */
    public function it_has_a_submitter()
    {
        $expense = Expense::factory()->create();

        $this->assertInstanceOf(User::class, $expense->submitter);
        $this->assertEquals($expense->submitted_by, $expense->submitter->id);
    }

    /** @test */
    public function it_can_have_an_approver()
    {
        $expense = Expense::factory()->approved()->create();

        $this->assertInstanceOf(User::class, $expense->approver);
        $this->assertEquals($expense->approved_by, $expense->approver->id);
    }

    /** @test */
    public function it_generates_expense_number_on_create()
    {
        $expense = Expense::factory()->create();

        $this->assertNotNull($expense->expense_number);
        $this->assertMatchesRegularExpression('/^EXP-\d{4}-\d{6}$/', $expense->expense_number);
        
        // Should contain current year
        $this->assertStringContainsString(date('Y'), $expense->expense_number);
    }

    /** @test */
    public function it_returns_formatted_amount()
    {
        $expense = Expense::factory()->create(['amount' => 1500.50]);

        $this->assertEquals('₹1,500.50', $expense->formatted_amount);
    }

    /** @test */
    public function it_checks_if_editable()
    {
        $draftExpense = Expense::factory()->create(['status' => Expense::STATUS_DRAFT]);
        $approvedExpense = Expense::factory()->create(['status' => Expense::STATUS_APPROVED]);

        $this->assertTrue($draftExpense->is_editable);
        $this->assertFalse($approvedExpense->is_editable);
    }

    /** @test */
    public function it_checks_if_receipt_required()
    {
        $smallExpense = Expense::factory()->create(['amount' => 3000]);
        $largeExpense = Expense::factory()->create(['amount' => 6000]);

        $this->assertFalse($smallExpense->requires_receipt);
        $this->assertTrue($largeExpense->requires_receipt);
    }

    /** @test */
    public function it_can_be_submitted()
    {
        $expense = Expense::factory()->create(['status' => Expense::STATUS_DRAFT]);

        $expense->submit();

        $this->assertEquals(Expense::STATUS_PENDING_APPROVAL, $expense->status);
        $this->assertNotNull($expense->submitted_at);
    }

    /** @test */
    public function it_can_be_approved()
    {
        $expense = Expense::factory()->create(['status' => Expense::STATUS_PENDING_APPROVAL]);
        $approver = User::factory()->create();

        $expense->approve($approver->id);

        $this->assertEquals(Expense::STATUS_APPROVED, $expense->status);
        $this->assertEquals($approver->id, $expense->approved_by);
        $this->assertNotNull($expense->approved_at);
    }

    /** @test */
    public function it_can_be_rejected()
    {
        $expense = Expense::factory()->create(['status' => Expense::STATUS_PENDING_APPROVAL]);

        $expense->reject('Insufficient documentation');

        $this->assertEquals(Expense::STATUS_REJECTED, $expense->status);
        $this->assertEquals('Insufficient documentation', $expense->rejection_reason);
        $this->assertNotNull($expense->rejected_at);
    }

    /** @test */
    public function it_scopes_pending_expenses()
    {
        Expense::factory()->count(3)->create(['status' => Expense::STATUS_PENDING_APPROVAL]);
        Expense::factory()->count(2)->create(['status' => Expense::STATUS_APPROVED]);

        $pendingCount = Expense::pending()->count();

        $this->assertEquals(3, $pendingCount);
    }

    /** @test */
    public function it_scopes_approved_expenses()
    {
        Expense::factory()->count(3)->create(['status' => Expense::STATUS_APPROVED]);
        Expense::factory()->count(2)->create(['status' => Expense::STATUS_DRAFT]);

        $approvedCount = Expense::approved()->count();

        $this->assertEquals(3, $approvedCount);
    }

    /** @test */
    public function it_scopes_expenses_by_category()
    {
        Expense::factory()->count(3)->create(['category' => Expense::CATEGORY_SUPPLIES]);
        Expense::factory()->count(2)->create(['category' => Expense::CATEGORY_UTILITIES]);

        $suppliesCount = Expense::byCategory(Expense::CATEGORY_SUPPLIES)->count();

        $this->assertEquals(3, $suppliesCount);
    }

    /** @test */
    public function it_scopes_expenses_by_date_range()
    {
        Expense::factory()->create(['expense_date' => '2024-01-15']);
        Expense::factory()->create(['expense_date' => '2024-02-15']);
        Expense::factory()->create(['expense_date' => '2024-03-15']);

        $count = Expense::dateRange('2024-02-01', '2024-02-28')->count();

        $this->assertEquals(1, $count);
    }
}
```

### 2.2 Vendor Model Tests

**File**: `tests/Unit/Models/VendorTest.php`

```php
<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Vendor;
use App\Models\Expense;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;

class VendorTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_generates_vendor_code_on_create()
    {
        $vendor = Vendor::factory()->create();

        $this->assertNotNull($vendor->vendor_code);
        $this->assertMatchesRegularExpression('/^VEN-\d{5}$/', $vendor->vendor_code);
    }

    /** @test */
    public function it_has_many_expenses()
    {
        $vendor = Vendor::factory()->create();
        Expense::factory()->count(3)->create(['vendor_id' => $vendor->id]);

        $this->assertCount(3, $vendor->expenses);
    }

    /** @test */
    public function it_calculates_total_transactions()
    {
        $vendor = Vendor::factory()->create();
        Payment::factory()->count(5)->create(['vendor_id' => $vendor->id]);

        $this->assertEquals(5, $vendor->total_transactions);
    }

    /** @test */
    public function it_calculates_total_paid()
    {
        $vendor = Vendor::factory()->create();
        Payment::factory()->create(['vendor_id' => $vendor->id, 'amount' => 1000, 'status' => 'completed']);
        Payment::factory()->create(['vendor_id' => $vendor->id, 'amount' => 2000, 'status' => 'completed']);
        Payment::factory()->create(['vendor_id' => $vendor->id, 'amount' => 500, 'status' => 'failed']);

        $this->assertEquals(3000, $vendor->total_paid);
    }

    /** @test */
    public function it_scopes_active_vendors()
    {
        Vendor::factory()->count(3)->create(['status' => 'active']);
        Vendor::factory()->count(2)->create(['status' => 'inactive']);

        $activeCount = Vendor::active()->count();

        $this->assertEquals(3, $activeCount);
    }
}
```

### 2.3 Payment Model Tests

**File**: `tests/Unit/Models/PaymentTest.php`

```php
<?php

namespace Tests\Unit\Models;

use Tests\TestCase;
use App\Models\Payment;
use App\Services\PaymentGatewayService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;

class PaymentTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_generates_payment_number_on_create()
    {
        $payment = Payment::factory()->create();

        $this->assertNotNull($payment->payment_number);
        $this->assertMatchesRegularExpression('/^PAY-\d{4}-\d{6}$/', $payment->payment_number);
    }

    /** @test */
    public function it_executes_neft_payment_successfully()
    {
        $payment = Payment::factory()->create([
            'status' => Payment::STATUS_SCHEDULED,
            'payment_mode' => Payment::MODE_NEFT,
        ]);

        // Mock payment gateway
        $gatewayMock = Mockery::mock(PaymentGatewayService::class);
        $gatewayMock->shouldReceive('processNEFT')
            ->once()
            ->andReturn(['success' => true, 'transaction_id' => 'TXN123456']);

        $this->app->instance(PaymentGatewayService::class, $gatewayMock);

        $result = $payment->execute();

        $this->assertTrue($result);
        $this->assertEquals(Payment::STATUS_COMPLETED, $payment->status);
        $this->assertEquals('TXN123456', $payment->transaction_id);
    }

    /** @test */
    public function it_handles_payment_failure()
    {
        $payment = Payment::factory()->create([
            'status' => Payment::STATUS_SCHEDULED,
            'payment_mode' => Payment::MODE_RTGS,
        ]);

        $gatewayMock = Mockery::mock(PaymentGatewayService::class);
        $gatewayMock->shouldReceive('processRTGS')
            ->once()
            ->andThrow(new \Exception('Insufficient bank balance'));

        $this->app->instance(PaymentGatewayService::class, $gatewayMock);

        $result = $payment->execute();

        $this->assertFalse($result);
        $this->assertEquals(Payment::STATUS_FAILED, $payment->status);
        $this->assertStringContainsString('Insufficient bank balance', $payment->failure_reason);
    }

    /** @test */
    public function it_processes_cash_payment_immediately()
    {
        $payment = Payment::factory()->create([
            'status' => Payment::STATUS_SCHEDULED,
            'payment_mode' => Payment::MODE_CASH,
        ]);

        $result = $payment->execute();

        $this->assertTrue($result);
        $this->assertEquals(Payment::STATUS_COMPLETED, $payment->status);
    }
}
```

### 2.4 Service Tests - ExpenseService

**File**: `tests/Unit/Services/ExpenseServiceTest.php`

```php
<?php

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\ExpenseService;
use App\Models\Expense;
use App\Models\Budget;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;

class ExpenseServiceTest extends TestCase
{
    use RefreshDatabase;

    protected ExpenseService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(ExpenseService::class);
    }

    /** @test */
    public function it_creates_expense_successfully()
    {
        $data = [
            'college_id' => 1,
            'category' => Expense::CATEGORY_SUPPLIES,
            'amount' => 1500,
            'expense_date' => '2024-01-15',
            'description' => 'Office supplies',
            'gl_code_id' => 1,
            'vendor_id' => 1,
            'submitted_by' => 1,
        ];

        $expense = $this->service->createExpense($data);

        $this->assertInstanceOf(Expense::class, $expense);
        $this->assertEquals(1500, $expense->amount);
        $this->assertEquals(Expense::STATUS_DRAFT, $expense->status);
    }

    /** @test */
    public function it_throws_exception_when_budget_insufficient()
    {
        Budget::factory()->create([
            'college_id' => 1,
            'category' => Expense::CATEGORY_SUPPLIES,
            'allocated_amount' => 10000,
            'utilized_amount' => 9500,
        ]);

        $data = [
            'college_id' => 1,
            'category' => Expense::CATEGORY_SUPPLIES,
            'amount' => 1000, // Would exceed budget
            'expense_date' => '2024-01-15',
        ];

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Insufficient budget');

        $this->service->createExpense($data, checkBudget: true);
    }

    /** @test */
    public function it_submits_expense_for_approval()
    {
        $expense = Expense::factory()->create([
            'status' => Expense::STATUS_DRAFT,
            'amount' => 3000, // No receipt required
        ]);

        $result = $this->service->submitForApproval($expense->id);

        $this->assertTrue($result);
        $expense->refresh();
        $this->assertEquals(Expense::STATUS_PENDING_APPROVAL, $expense->status);
    }

    /** @test */
    public function it_requires_receipt_for_large_expense()
    {
        $expense = Expense::factory()->create([
            'status' => Expense::STATUS_DRAFT,
            'amount' => 6000, // Receipt required
            'receipt_url' => null,
        ]);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage('Receipt required');

        $this->service->submitForApproval($expense->id);
    }

    /** @test */
    public function it_approves_expense_and_updates_budget()
    {
        $budget = Budget::factory()->create([
            'college_id' => 1,
            'category' => Expense::CATEGORY_SUPPLIES,
            'allocated_amount' => 10000,
            'utilized_amount' => 5000,
        ]);

        $expense = Expense::factory()->create([
            'college_id' => 1,
            'status' => Expense::STATUS_PENDING_APPROVAL,
            'category' => Expense::CATEGORY_SUPPLIES,
            'amount' => 1500,
        ]);

        $result = $this->service->approveExpense($expense->id, 1);

        $this->assertTrue($result);
        $expense->refresh();
        $this->assertEquals(Expense::STATUS_APPROVED, $expense->status);

        $budget->refresh();
        $this->assertEquals(6500, $budget->utilized_amount);
    }

    /** @test */
    public function it_gets_expense_summary_with_caching()
    {
        Expense::factory()->count(5)->create([
            'college_id' => 1,
            'category' => Expense::CATEGORY_SUPPLIES,
            'amount' => 1000,
        ]);

        // First call - should hit database
        $summary1 = $this->service->getExpenseSummary(1);

        // Second call - should hit cache
        $summary2 = $this->service->getExpenseSummary(1);

        $this->assertEquals($summary1, $summary2);
        $this->assertEquals(5000, $summary1['total_expenses']);
    }
}
```

---

## 3. Integration Tests

### 3.1 Expense API Tests

**File**: `tests/Feature/ExpenseApiTest.php`

```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Expense;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ExpenseApiTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->seed(RolePermissionSeeder::class);
        
        $this->user = User::factory()->create();
        $this->user->assignRole('college_accounts_admin');
        
        Sanctum::actingAs($this->user);
    }

    /** @test */
    public function it_requires_authentication()
    {
        Sanctum::actingAs(null);

        $response = $this->getJson('/api/v1/expenses');

        $response->assertStatus(401);
    }

    /** @test */
    public function it_lists_expenses_with_pagination()
    {
        Expense::factory()->count(25)->create(['college_id' => $this->user->college_id]);

        $response = $this->getJson('/api/v1/expenses');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'expense_number', 'amount', 'category', 'status'],
                ],
                'meta' => ['current_page', 'total'],
            ]);

        $this->assertEquals(15, count($response->json('data'))); // Default pagination
    }

    /** @test */
    public function it_filters_expenses_by_category()
    {
        Expense::factory()->count(5)->create([
            'college_id' => $this->user->college_id,
            'category' => Expense::CATEGORY_SUPPLIES,
        ]);
        Expense::factory()->count(3)->create([
            'college_id' => $this->user->college_id,
            'category' => Expense::CATEGORY_UTILITIES,
        ]);

        $response = $this->getJson('/api/v1/expenses?category=' . Expense::CATEGORY_SUPPLIES);

        $response->assertStatus(200);
        $this->assertEquals(5, count($response->json('data')));
    }

    /** @test */
    public function it_creates_expense()
    {
        $data = [
            'category' => Expense::CATEGORY_SUPPLIES,
            'amount' => 1500,
            'expense_date' => '2024-01-15',
            'description' => 'Office supplies',
            'gl_code_id' => 1,
            'vendor_id' => 1,
        ];

        $response = $this->postJson('/api/v1/expenses', $data);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['id', 'expense_number', 'amount', 'status'],
            ]);

        $this->assertDatabaseHas('expenses', [
            'amount' => 1500,
            'college_id' => $this->user->college_id,
        ]);
    }

    /** @test */
    public function it_validates_expense_creation()
    {
        $data = [
            'category' => 'invalid_category',
            'amount' => -100, // Invalid amount
        ];

        $response = $this->postJson('/api/v1/expenses', $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['category', 'amount']);
    }

    /** @test */
    public function it_shows_expense_details()
    {
        $expense = Expense::factory()->create(['college_id' => $this->user->college_id]);

        $response = $this->getJson("/api/v1/expenses/{$expense->id}");

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $expense->id,
                    'expense_number' => $expense->expense_number,
                ],
            ]);
    }

    /** @test */
    public function it_prevents_accessing_other_college_expense()
    {
        $otherExpense = Expense::factory()->create(['college_id' => 999]);

        $response = $this->getJson("/api/v1/expenses/{$otherExpense->id}");

        $response->assertStatus(404);
    }

    /** @test */
    public function it_updates_draft_expense()
    {
        $expense = Expense::factory()->create([
            'college_id' => $this->user->college_id,
            'status' => Expense::STATUS_DRAFT,
            'amount' => 1000,
        ]);

        $response = $this->putJson("/api/v1/expenses/{$expense->id}", [
            'amount' => 1500,
        ]);

        $response->assertStatus(200);
        $expense->refresh();
        $this->assertEquals(1500, $expense->amount);
    }

    /** @test */
    public function it_prevents_updating_approved_expense()
    {
        $expense = Expense::factory()->create([
            'college_id' => $this->user->college_id,
            'status' => Expense::STATUS_APPROVED,
        ]);

        $response = $this->putJson("/api/v1/expenses/{$expense->id}", [
            'amount' => 2000,
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function it_deletes_draft_expense()
    {
        $expense = Expense::factory()->create([
            'college_id' => $this->user->college_id,
            'status' => Expense::STATUS_DRAFT,
        ]);

        $response = $this->deleteJson("/api/v1/expenses/{$expense->id}");

        $response->assertStatus(204);
        $this->assertSoftDeleted('expenses', ['id' => $expense->id]);
    }

    /** @test */
    public function it_submits_expense_for_approval()
    {
        $expense = Expense::factory()->create([
            'college_id' => $this->user->college_id,
            'status' => Expense::STATUS_DRAFT,
            'amount' => 3000,
        ]);

        $response = $this->postJson("/api/v1/expenses/{$expense->id}/submit");

        $response->assertStatus(200);
        $expense->refresh();
        $this->assertEquals(Expense::STATUS_PENDING_APPROVAL, $expense->status);
    }

    /** @test */
    public function it_gets_expense_summary()
    {
        Expense::factory()->count(10)->create([
            'college_id' => $this->user->college_id,
            'amount' => 1000,
        ]);

        $response = $this->getJson('/api/v1/expenses/summary');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'total_expenses',
                'category_breakdown' => [
                    '*' => ['category', 'total', 'percentage'],
                ],
            ]);

        $this->assertEquals(10000, $response->json('total_expenses'));
    }
}
```

---

## 4. End-to-End Tests

### 4.1 Payment Workflow E2E Test (Playwright)

**File**: `tests/e2e/payment-workflow.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Payment Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('[name="email"]', 'accountant@college.edu');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
  });

  test('Complete payment flow: expense → invoice → payment', async ({ page }) => {
    // Step 1: Create Expense
    await page.click('text=Expenses');
    await page.click('text=Create Expense');
    
    await page.selectOption('[name="category"]', 'supplies');
    await page.fill('[name="amount"]', '5000');
    await page.fill('[name="description"]', 'Office supplies for admin');
    await page.selectOption('[name="vendor_id"]', '1');
    await page.selectOption('[name="gl_code_id"]', '1');
    
    await page.click('button:has-text("Save as Draft")');
    await expect(page.locator('.toast-success')).toContainText('Expense saved');
    
    const expenseNumber = await page.locator('.expense-number').textContent();
    
    // Step 2: Submit for Approval
    await page.click(`text=${expenseNumber}`);
    await page.click('button:has-text("Submit for Approval")');
    
    await expect(page.locator('.status-badge')).toContainText('Pending Approval');
    
    // Step 3: Create Invoice (after approval - simulate)
    await page.goto('/invoices/create');
    await page.selectOption('[name="vendor_id"]', '1');
    await page.fill('[name="invoice_number"]', 'INV-2024-001');
    await page.fill('[name="invoice_date"]', '2024-01-15');
    await page.fill('[name="due_date"]', '2024-02-15');
    await page.fill('[name="total_amount"]', '5000');
    
    await page.click('button:has-text("Save Invoice")');
    await expect(page.locator('.toast-success')).toContainText('Invoice created');
    
    // Step 4: Schedule Payment
    await page.click('button:has-text("Schedule Payment")');
    await page.selectOption('[name="payment_mode"]', 'neft');
    await page.fill('[name="payment_date"]', '2024-02-10');
    await page.selectOption('[name="bank_account_id"]', '1');
    
    await page.click('button:has-text("Schedule")');
    await expect(page.locator('.toast-success')).toContainText('Payment scheduled');
    
    // Step 5: Execute Payment
    await page.goto('/payments');
    await page.click('text=Scheduled');
    await page.click(`text=${expenseNumber}`);
    await page.click('button:has-text("Execute Payment")');
    
    // Confirm OTP (in test environment)
    await page.fill('[name="otp"]', '123456');
    await page.click('button:has-text("Confirm")');
    
    await expect(page.locator('.toast-success')).toContainText('Payment executed successfully');
    await expect(page.locator('.payment-status')).toContainText('Completed');
    
    // Verify invoice marked as paid
    await page.goto('/invoices');
    await page.click(`text=INV-2024-001`);
    await expect(page.locator('.invoice-status')).toContainText('Paid');
  });

  test('Batch payment processing', async ({ page }) => {
    await page.goto('/payments/batch');
    
    // Select multiple scheduled payments
    await page.check('[data-payment-id="1"]');
    await page.check('[data-payment-id="2"]');
    await page.check('[data-payment-id="3"]');
    
    await page.click('button:has-text("Process Batch")');
    
    // Confirm batch
    await page.fill('[name="otp"]', '123456');
    await page.click('button:has-text("Confirm Batch")');
    
    await expect(page.locator('.toast-success')).toContainText('Batch processing started');
    
    // Wait for processing
    await page.waitForTimeout(5000);
    
    // Verify results
    await expect(page.locator('.batch-status')).toContainText('Completed');
    await expect(page.locator('.success-count')).toContainText('3 payments');
  });
});
```

---

## 5. Performance Tests

### 5.1 Load Testing with K6

**File**: `tests/performance/load-test.js`

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 50 },  // Ramp up to 50 users
    { duration: '5m', target: 50 },  // Stay at 50 users
    { duration: '2m', target: 100 }, // Ramp up to 100 users
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% requests under 1s
    http_req_failed: ['rate<0.01'],    // <1% failure rate
  },
};

const BASE_URL = 'https://staging-api.edubit.com';
let authToken;

export function setup() {
  // Login and get token
  const loginRes = http.post(`${BASE_URL}/api/v1/auth/login`, {
    email: 'test@college.edu',
    password: 'test123',
  });
  
  const token = loginRes.json('data.token');
  return { token };
}

export default function(data) {
  const headers = {
    'Authorization': `Bearer ${data.token}`,
    'Content-Type': 'application/json',
  };

  // Test 1: List expenses
  let res = http.get(`${BASE_URL}/api/v1/expenses`, { headers });
  check(res, {
    'list expenses status 200': (r) => r.status === 200,
    'list expenses response time OK': (r) => r.timings.duration < 500,
  });

  sleep(1);

  // Test 2: Get expense summary
  res = http.get(`${BASE_URL}/api/v1/expenses/summary`, { headers });
  check(res, {
    'summary status 200': (r) => r.status === 200,
    'summary response time OK': (r) => r.timings.duration < 1000,
  });

  sleep(1);

  // Test 3: Financial report
  res = http.get(`${BASE_URL}/api/v1/reports/profit-loss`, { headers });
  check(res, {
    'report status 200': (r) => r.status === 200,
    'report response time OK': (r) => r.timings.duration < 2000,
  });

  sleep(2);
}
```

---

## 6. Security Tests

### 6.1 Authorization Tests

**File**: `tests/Security/AuthorizationTest.php`

```php
<?php

namespace Tests\Security;

use Tests\TestCase;
use App\Models\User;
use App\Models\Expense;
use Laravel\Sanctum\Sanctum;

class AuthorizationTest extends TestCase
{
    /** @test */
    public function it_prevents_unauthorized_expense_access()
    {
        $user = User::factory()->create(['college_id' => 1]);
        $otherExpense = Expense::factory()->create(['college_id' => 2]);
        
        Sanctum::actingAs($user);

        $response = $this->getJson("/api/v1/expenses/{$otherExpense->id}");

        $response->assertStatus(404); // Not found (security through obscurity)
    }

    /** @test */
    public function it_prevents_updating_approved_expense()
    {
        $user = User::factory()->create();
        $expense = Expense::factory()->create([
            'college_id' => $user->college_id,
            'status' => Expense::STATUS_APPROVED,
        ]);
        
        Sanctum::actingAs($user);

        $response = $this->putJson("/api/v1/expenses/{$expense->id}", [
            'amount' => 9999,
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function it_prevents_sql_injection()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson("/api/v1/expenses?search='; DROP TABLE expenses;--");

        $response->assertStatus(200);
        $this->assertDatabaseHas('expenses', []); // Table still exists
    }
}
```

---

## 7. CI/CD Pipeline

**File**: `.github/workflows/test.yml`

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_DB: lms_test
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
          extensions: pgsql, pdo_pgsql, redis
          coverage: xdebug

      - name: Install Dependencies
        run: composer install --prefer-dist --no-progress

      - name: Copy .env
        run: cp .env.testing .env

      - name: Generate Key
        run: php artisan key:generate

      - name: Run Migrations
        run: php artisan migrate --seed

      - name: Run PHPUnit Tests
        run: vendor/bin/phpunit --coverage-clover=coverage.xml

      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml

      - name: Run PHPStan
        run: vendor/bin/phpstan analyse --level=8

      - name: Run PHP CS Fixer
        run: vendor/bin/php-cs-fixer fix --dry-run --diff
```

---

*This comprehensive testing guide ensures the College Accounts Admin portal meets quality, security, and performance standards.*
