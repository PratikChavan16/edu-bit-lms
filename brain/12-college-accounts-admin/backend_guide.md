# College Accounts Admin Portal - Backend Implementation Guide

**Framework**: Laravel 11.x  
**PHP Version**: 8.2+  
**Architecture**: Service-Oriented Architecture with Repository Pattern  
**Database**: PostgreSQL 16  
**Cache**: Redis 7.2

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Core Models](#2-core-models)
3. [Services Layer](#3-services-layer)
4. [Controllers](#4-controllers)
5. [Routes](#5-routes)
6. [Background Jobs](#6-background-jobs)
7. [API Resources](#7-api-resources)

---

## 1. Architecture Overview

### 1.1 Directory Structure
```
app/
├── Models/
│   ├── Expense.php
│   ├── Vendor.php
│   ├── PurchaseOrder.php
│   ├── Invoice.php
│   ├── Payment.php
│   ├── Budget.php
│   ├── GLCode.php
│   └── BankAccount.php
├── Services/
│   ├── ExpenseService.php
│   ├── VendorService.php
│   ├── PaymentService.php
│   └── BudgetService.php
├── Http/
│   ├── Controllers/
│   │   ├── ExpenseController.php
│   │   ├── VendorController.php
│   │   ├── PurchaseOrderController.php
│   │   ├── InvoiceController.php
│   │   ├── PaymentController.php
│   │   └── ReportController.php
│   └── Resources/
│       ├── ExpenseResource.php
│       ├── VendorResource.php
│       └── PaymentResource.php
├── Jobs/
│   ├── ProcessBatchPayment.php
│   ├── SendPaymentReminder.php
│   └── GenerateFinancialReport.php
└── Policies/
    ├── ExpensePolicy.php
    ├── PaymentPolicy.php
    └── BudgetPolicy.php
```

### 1.2 Request Flow
```
Client Request
    ↓
Route (routes/api.php)
    ↓
Middleware (Auth, Permission)
    ↓
Controller (Validation)
    ↓
Service (Business Logic)
    ↓
Repository/Model (Data Access)
    ↓
Database
    ↓
API Resource (Transform)
    ↓
JSON Response
```

---

## 2. Core Models

### 2.1 Expense Model

**File**: `app/Models/Expense.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'college_id',
        'expense_number',
        'category',
        'amount',
        'expense_date',
        'description',
        'gl_code_id',
        'vendor_id',
        'payment_mode',
        'invoice_number',
        'receipt_url',
        'status',
        'submitted_by',
        'approved_by',
        'approved_at',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'expense_date' => 'date',
        'approved_at' => 'datetime',
    ];

    // Constants
    const STATUS_DRAFT = 'draft';
    const STATUS_PENDING_APPROVAL = 'pending_approval';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_PAID = 'paid';

    const CATEGORY_SALARIES = 'salaries';
    const CATEGORY_UTILITIES = 'utilities';
    const CATEGORY_SUPPLIES = 'supplies';
    const CATEGORY_MAINTENANCE = 'maintenance';
    const CATEGORY_TRANSPORT = 'transport';
    const CATEGORY_INFRASTRUCTURE = 'infrastructure';
    const CATEGORY_MISCELLANEOUS = 'miscellaneous';

    // Relationships
    public function college(): BelongsTo
    {
        return $this->belongsTo(College::class);
    }

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function glCode(): BelongsTo
    {
        return $this->belongsTo(GLCode::class);
    }

    public function submitter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'submitted_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING_APPROVAL);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    public function scopeByCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    public function scopeDateRange($query, $from, $to)
    {
        return $query->whereBetween('expense_date', [$from, $to]);
    }

    // Accessors
    public function getFormattedAmountAttribute(): string
    {
        return '₹' . number_format($this->amount, 2);
    }

    public function getIsEditableAttribute(): bool
    {
        return in_array($this->status, [self::STATUS_DRAFT, self::STATUS_REJECTED]);
    }

    public function getRequiresReceiptAttribute(): bool
    {
        return $this->amount > 5000;
    }

    // Methods
    public function submit(): bool
    {
        if ($this->status !== self::STATUS_DRAFT) {
            return false;
        }

        $this->update(['status' => self::STATUS_PENDING_APPROVAL]);
        
        // Fire event for notification
        event(new \App\Events\ExpenseSubmitted($this));
        
        return true;
    }

    public function approve(User $approver): bool
    {
        if ($this->status !== self::STATUS_PENDING_APPROVAL) {
            return false;
        }

        $this->update([
            'status' => self::STATUS_APPROVED,
            'approved_by' => $approver->id,
            'approved_at' => now(),
        ]);

        event(new \App\Events\ExpenseApproved($this));
        
        return true;
    }

    public function reject(User $approver, string $reason): bool
    {
        if ($this->status !== self::STATUS_PENDING_APPROVAL) {
            return false;
        }

        $this->update([
            'status' => self::STATUS_REJECTED,
            'approved_by' => $approver->id,
            'approved_at' => now(),
            'notes' => $reason,
        ]);

        event(new \App\Events\ExpenseRejected($this));
        
        return true;
    }

    // Boot method for auto-generating expense number
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($expense) {
            if (empty($expense->expense_number)) {
                $expense->expense_number = 'EXP-' . date('Y') . '-' . str_pad(
                    static::whereYear('created_at', date('Y'))->count() + 1,
                    6,
                    '0',
                    STR_PAD_LEFT
                );
            }
        });
    }
}
```

### 2.2 Vendor Model

**File**: `app/Models/Vendor.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Vendor extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'college_id',
        'vendor_code',
        'vendor_name',
        'contact_person',
        'phone',
        'email',
        'category',
        'gst_number',
        'pan_number',
        'bank_account_number',
        'bank_name',
        'ifsc_code',
        'branch',
        'address',
        'payment_terms',
        'status',
    ];

    const STATUS_ACTIVE = 'active';
    const STATUS_INACTIVE = 'inactive';
    const STATUS_BLACKLISTED = 'blacklisted';

    // Relationships
    public function college()
    {
        return $this->belongsTo(College::class);
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // Accessors
    public function getTotalTransactionsAttribute(): int
    {
        return $this->payments()->count();
    }

    public function getTotalPaidAttribute(): float
    {
        return $this->payments()
            ->where('status', Payment::STATUS_COMPLETED)
            ->sum('amount');
    }

    public function getOutstandingAmountAttribute(): float
    {
        return $this->invoices()
            ->where('status', '!=', Invoice::STATUS_PAID)
            ->sum('outstanding_amount');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    // Boot
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($vendor) {
            if (empty($vendor->vendor_code)) {
                $vendor->vendor_code = 'VEN-' . str_pad(
                    static::count() + 1,
                    5,
                    '0',
                    STR_PAD_LEFT
                );
            }
        });
    }
}
```

### 2.3 Payment Model

**File**: `app/Models/Payment.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'college_id',
        'payment_number',
        'vendor_id',
        'invoice_id',
        'amount',
        'payment_date',
        'payment_mode',
        'bank_account_id',
        'reference_number',
        'transaction_id',
        'status',
        'processed_by',
        'processed_at',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'date',
        'processed_at' => 'datetime',
    ];

    const STATUS_SCHEDULED = 'scheduled';
    const STATUS_PROCESSING = 'processing';
    const STATUS_COMPLETED = 'completed';
    const STATUS_FAILED = 'failed';
    const STATUS_CANCELLED = 'cancelled';

    const MODE_CASH = 'cash';
    const MODE_CHEQUE = 'cheque';
    const MODE_NEFT = 'neft';
    const MODE_RTGS = 'rtgs';
    const MODE_UPI = 'upi';

    // Relationships
    public function vendor()
    {
        return $this->belongsTo(Vendor::class);
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function bankAccount()
    {
        return $this->belongsTo(BankAccount::class);
    }

    // Methods
    public function execute(): bool
    {
        if ($this->status !== self::STATUS_SCHEDULED) {
            return false;
        }

        $this->update(['status' => self::STATUS_PROCESSING]);

        // Process payment based on mode
        try {
            if (in_array($this->payment_mode, [self::MODE_NEFT, self::MODE_RTGS])) {
                // Call payment gateway API
                $result = app(\App\Services\PaymentGatewayService::class)
                    ->processPayment($this);
                
                if ($result['success']) {
                    $this->update([
                        'status' => self::STATUS_COMPLETED,
                        'transaction_id' => $result['transaction_id'],
                        'processed_at' => now(),
                    ]);
                    
                    // Update invoice
                    $this->invoice->markAsPaid();
                    
                    return true;
                }
            } else {
                // For cash/cheque, mark as completed immediately
                $this->update([
                    'status' => self::STATUS_COMPLETED,
                    'processed_at' => now(),
                ]);
                
                return true;
            }
        } catch (\Exception $e) {
            $this->update(['status' => self::STATUS_FAILED]);
            \Log::error('Payment failed: ' . $e->getMessage());
            return false;
        }

        return false;
    }

    // Boot
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($payment) {
            if (empty($payment->payment_number)) {
                $payment->payment_number = 'PAY-' . date('Y') . '-' . str_pad(
                    static::whereYear('created_at', date('Y'))->count() + 1,
                    6,
                    '0',
                    STR_PAD_LEFT
                );
            }
        });
    }
}
```

---

## 3. Services Layer

### 3.1 ExpenseService

**File**: `app/Services/ExpenseService.php`

```php
<?php

namespace App\Services;

use App\Models\Expense;
use App\Models\Budget;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class ExpenseService
{
    public function createExpense(array $data): Expense
    {
        return DB::transaction(function () use ($data) {
            // Check budget availability if required
            if (isset($data['check_budget']) && $data['check_budget']) {
                $this->checkBudgetAvailability(
                    $data['category'],
                    $data['amount']
                );
            }

            $expense = Expense::create($data);

            // Upload receipt if provided
            if (isset($data['receipt'])) {
                $path = $data['receipt']->store('receipts', 's3');
                $expense->update(['receipt_url' => $path]);
            }

            // Clear cache
            Cache::tags(['expenses'])->flush();

            return $expense->fresh();
        });
    }

    public function submitForApproval(Expense $expense): bool
    {
        // Validate expense is complete
        if (!$this->validateExpenseForSubmission($expense)) {
            throw new \Exception('Expense is incomplete and cannot be submitted.');
        }

        return $expense->submit();
    }

    public function approveExpense(Expense $expense, $approver): bool
    {
        return DB::transaction(function () use ($expense, $approver) {
            // Update budget utilization
            $this->updateBudgetUtilization($expense);

            // Approve expense
            $result = $expense->approve($approver);

            // Clear cache
            Cache::tags(['expenses', 'budgets'])->flush();

            return $result;
        });
    }

    public function getExpenseSummary(string $fromDate, string $toDate): array
    {
        $cacheKey = "expense_summary_{$fromDate}_{$toDate}";

        return Cache::tags(['expenses'])->remember($cacheKey, 3600, function () use ($fromDate, $toDate) {
            $expenses = Expense::dateRange($fromDate, $toDate)
                ->where('status', Expense::STATUS_APPROVED)
                ->get();

            $totalExpenses = $expenses->sum('amount');
            
            $categoryBreakdown = $expenses->groupBy('category')->map(function ($items, $category) use ($totalExpenses) {
                $amount = $items->sum('amount');
                return [
                    'category' => $category,
                    'amount' => $amount,
                    'count' => $items->count(),
                    'percentage' => $totalExpenses > 0 ? ($amount / $totalExpenses) * 100 : 0,
                ];
            })->values();

            return [
                'total_expenses' => $totalExpenses,
                'category_breakdown' => $categoryBreakdown,
                'total_count' => $expenses->count(),
            ];
        });
    }

    protected function checkBudgetAvailability(string $category, float $amount): void
    {
        $budget = Budget::where('category', $category)
            ->where('financial_year', $this->getCurrentFinancialYear())
            ->first();

        if (!$budget) {
            throw new \Exception("No budget allocated for {$category}");
        }

        if ($budget->remaining_amount < $amount) {
            throw new \Exception("Insufficient budget. Available: ₹{$budget->remaining_amount}, Required: ₹{$amount}");
        }
    }

    protected function updateBudgetUtilization(Expense $expense): void
    {
        $budget = Budget::where('category', $expense->category)
            ->where('financial_year', $this->getCurrentFinancialYear())
            ->first();

        if ($budget) {
            $budget->increment('utilized_amount', $expense->amount);
        }
    }

    protected function validateExpenseForSubmission(Expense $expense): bool
    {
        // Check required fields
        if (empty($expense->category) || empty($expense->amount) || empty($expense->description)) {
            return false;
        }

        // Check receipt requirement
        if ($expense->requires_receipt && empty($expense->receipt_url)) {
            return false;
        }

        return true;
    }

    protected function getCurrentFinancialYear(): string
    {
        $month = date('n');
        $year = date('Y');
        
        if ($month >= 4) {
            return $year . '-' . ($year + 1);
        } else {
            return ($year - 1) . '-' . $year;
        }
    }
}
```

### 3.2 PaymentService

**File**: `app/Services/PaymentService.php`

```php
<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Invoice;
use App\Jobs\ProcessBatchPayment;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    public function schedulePayment(array $data): Payment
    {
        return DB::transaction(function () use ($data) {
            $payment = Payment::create(array_merge($data, [
                'status' => Payment::STATUS_SCHEDULED,
            ]));

            // Update invoice status
            if ($payment->invoice_id) {
                $payment->invoice->update(['status' => Invoice::STATUS_SCHEDULED]);
            }

            return $payment;
        });
    }

    public function processBatchPayment(array $paymentIds, string $batchDate): void
    {
        // Dispatch job for async processing
        ProcessBatchPayment::dispatch($paymentIds, $batchDate);
    }

    public function executePayment(Payment $payment): bool
    {
        return $payment->execute();
    }

    public function getPaymentHistory(int $vendorId, array $filters = []): array
    {
        $query = Payment::where('vendor_id', $vendorId)
            ->with(['invoice', 'bankAccount'])
            ->orderBy('payment_date', 'desc');

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['from_date'])) {
            $query->whereDate('payment_date', '>=', $filters['from_date']);
        }

        return $query->paginate(20)->toArray();
    }
}
```

---

## 4. Controllers

### 4.1 ExpenseController

**File**: `app/Http/Controllers/ExpenseController.php`

```php
<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Services\ExpenseService;
use App\Http\Resources\ExpenseResource;
use App\Http\Requests\CreateExpenseRequest;
use App\Http\Requests\UpdateExpenseRequest;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    protected ExpenseService $expenseService;

    public function __construct(ExpenseService $expenseService)
    {
        $this->expenseService = $expenseService;
        $this->authorizeResource(Expense::class);
    }

    public function index(Request $request)
    {
        $query = Expense::with(['vendor', 'glCode', 'submitter'])
            ->where('college_id', auth()->user()->college_id);

        // Apply filters
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('from_date') && $request->filled('to_date')) {
            $query->dateRange($request->from_date, $request->to_date);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('description', 'like', "%{$request->search}%")
                  ->orWhere('expense_number', 'like', "%{$request->search}%");
            });
        }

        $expenses = $query->latest()->paginate($request->per_page ?? 20);

        return ExpenseResource::collection($expenses);
    }

    public function store(CreateExpenseRequest $request)
    {
        $data = $request->validated();
        $data['college_id'] = auth()->user()->college_id;
        $data['submitted_by'] = auth()->id();

        $expense = $this->expenseService->createExpense($data);

        return new ExpenseResource($expense);
    }

    public function show(Expense $expense)
    {
        $expense->load(['vendor', 'glCode', 'submitter', 'approver']);
        return new ExpenseResource($expense);
    }

    public function update(UpdateExpenseRequest $request, Expense $expense)
    {
        $this->authorize('update', $expense);

        $expense->update($request->validated());

        return new ExpenseResource($expense->fresh());
    }

    public function destroy(Expense $expense)
    {
        $this->authorize('delete', $expense);

        $expense->delete();

        return response()->json(['message' => 'Expense deleted successfully']);
    }

    public function submit(Expense $expense)
    {
        $this->authorize('submit', $expense);

        $this->expenseService->submitForApproval($expense);

        return response()->json(['message' => 'Expense submitted for approval']);
    }

    public function summary(Request $request)
    {
        $request->validate([
            'from_date' => 'required|date',
            'to_date' => 'required|date|after_or_equal:from_date',
        ]);

        $summary = $this->expenseService->getExpenseSummary(
            $request->from_date,
            $request->to_date
        );

        return response()->json(['data' => $summary]);
    }
}
```

---

## 5. Routes

**File**: `routes/api.php`

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    AuthController,
    ExpenseController,
    VendorController,
    PurchaseOrderController,
    InvoiceController,
    PaymentController,
    BudgetController,
    ReportController
};

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    
    // Authentication
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/refresh', [AuthController::class, 'refresh']);
    
    // Expenses
    Route::apiResource('expenses', ExpenseController::class);
    Route::post('expenses/{expense}/submit', [ExpenseController::class, 'submit']);
    Route::get('expenses/reports/summary', [ExpenseController::class, 'summary']);
    
    // Vendors
    Route::apiResource('vendors', VendorController::class);
    Route::get('vendors/{vendor}/payments', [VendorController::class, 'payments']);
    
    // Purchase Orders
    Route::apiResource('purchase-orders', PurchaseOrderController::class);
    Route::post('purchase-orders/{purchaseOrder}/approve', [PurchaseOrderController::class, 'approve']);
    Route::post('purchase-orders/{purchaseOrder}/goods-receipt', [PurchaseOrderController::class, 'goodsReceipt']);
    
    // Invoices
    Route::apiResource('invoices', InvoiceController::class);
    Route::post('invoices/{invoice}/approve', [InvoiceController::class, 'approve']);
    
    // Payments
    Route::apiResource('payments', PaymentController::class);
    Route::post('payments/{payment}/execute', [PaymentController::class, 'execute']);
    Route::post('payments/batch', [PaymentController::class, 'batchPayment']);
    
    // Budgets
    Route::get('budgets', [BudgetController::class, 'index']);
    Route::get('budgets/utilization', [BudgetController::class, 'utilization']);
    
    // Reports
    Route::get('reports/profit-loss', [ReportController::class, 'profitLoss']);
    Route::get('reports/balance-sheet', [ReportController::class, 'balanceSheet']);
    Route::get('reports/cash-flow', [ReportController::class, 'cashFlow']);
});
```

---

## 6. Background Jobs

### 6.1 ProcessBatchPayment Job

**File**: `app/Jobs/ProcessBatchPayment.php`

```php
<?php

namespace App\Jobs;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessBatchPayment implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected array $paymentIds;
    protected string $batchDate;

    public function __construct(array $paymentIds, string $batchDate)
    {
        $this->paymentIds = $paymentIds;
        $this->batchDate = $batchDate;
    }

    public function handle(): void
    {
        foreach ($this->paymentIds as $paymentId) {
            $payment = Payment::find($paymentId);
            
            if ($payment && $payment->status === Payment::STATUS_SCHEDULED) {
                try {
                    $payment->execute();
                    \Log::info("Payment {$payment->payment_number} processed successfully");
                } catch (\Exception $e) {
                    \Log::error("Payment {$payment->payment_number} failed: " . $e->getMessage());
                }
            }
        }
    }
}
```

---

## 7. API Resources

### 7.1 ExpenseResource

**File**: `app/Http/Resources/ExpenseResource.php`

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'expense_number' => $this->expense_number,
            'category' => $this->category,
            'amount' => $this->amount,
            'formatted_amount' => $this->formatted_amount,
            'expense_date' => $this->expense_date->format('Y-m-d'),
            'description' => $this->description,
            'gl_code' => $this->glCode?->code,
            'vendor' => [
                'id' => $this->vendor?->id,
                'name' => $this->vendor?->vendor_name,
            ],
            'payment_mode' => $this->payment_mode,
            'invoice_number' => $this->invoice_number,
            'receipt_url' => $this->receipt_url,
            'status' => $this->status,
            'is_editable' => $this->is_editable,
            'submitted_by' => $this->submitter?->name,
            'approved_by' => $this->approver?->name,
            'approved_at' => $this->approved_at?->format('Y-m-d H:i:s'),
            'notes' => $this->notes,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),
        ];
    }
}
```

---

*This backend implementation guide provides a solid foundation for building a robust, scalable College Accounts Admin portal with Laravel 11.*
