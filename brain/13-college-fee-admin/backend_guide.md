# College Fee Admin Portal - Backend Implementation Guide

**Version**: 1.0.0  
**Framework**: Laravel 11.x  
**PHP Version**: 8.2  
**Database**: PostgreSQL 16  
**Cache**: Redis 7.2  
**Port**: 8013  
**Annual Revenue**: ₹60 Crores/year

---

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Directory Structure](#directory-structure)
3. [Models](#models)
4. [Controllers](#controllers)
5. [Services](#services)
6. [Middleware](#middleware)
7. [Jobs & Queues](#jobs--queues)
8. [Events & Listeners](#events--listeners)
9. [API Resources](#api-resources)
10. [Validation](#validation)
11. [Testing](#testing)

---

## Architecture Overview

### Design Pattern
```
┌─────────────────────────────────────────────────────┐
│                  API Routes (api.php)               │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│              Middleware Layer                       │
│  (Auth, CORS, Rate Limiting, College Isolation)     │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│              Controllers                            │
│  (Thin layer - delegates to Services)               │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│              Services Layer                         │
│  (Business Logic, External API Integration)         │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│              Repositories                           │
│  (Database Operations, Query Optimization)          │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│              Models (Eloquent ORM)                  │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│              PostgreSQL Database                    │
└─────────────────────────────────────────────────────┘
```

### Tech Stack
- **Framework**: Laravel 11 (Oct 2024 release)
- **ORM**: Eloquent with PostgreSQL driver
- **Authentication**: Laravel Sanctum (JWT tokens)
- **Queue**: Redis-backed queues for async tasks
- **Cache**: Redis for session & query caching
- **File Storage**: AWS S3 for receipt PDFs
- **Payment Gateway**: Razorpay PHP SDK
- **PDF Generation**: barryvdh/laravel-dompdf
- **SMS/Email**: AWS SES + MSG91

---

## Directory Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   ├── FeeStructureController.php
│   │   ├── PaymentController.php
│   │   ├── ReceiptController.php
│   │   ├── InstallmentController.php
│   │   ├── DefaulterController.php
│   │   ├── RefundController.php
│   │   ├── ScholarshipController.php
│   │   └── ReportController.php
│   ├── Middleware/
│   │   ├── CollegeIsolation.php
│   │   ├── FeeAdminAuth.php
│   │   └── LogFeeTransactions.php
│   ├── Requests/
│   │   ├── PaymentRequest.php
│   │   ├── RefundRequest.php
│   │   └── ScholarshipRequest.php
│   └── Resources/
│       ├── PaymentResource.php
│       ├── ReceiptResource.php
│       └── StudentFeeResource.php
├── Models/
│   ├── FeeComponent.php
│   ├── FeeStructure.php
│   ├── Payment.php
│   ├── Receipt.php
│   ├── Installment.php
│   ├── Defaulter.php
│   ├── Refund.php
│   ├── Scholarship.php
│   └── Student.php
├── Services/
│   ├── PaymentGatewayService.php
│   ├── ReceiptGeneratorService.php
│   ├── InstallmentService.php
│   ├── DefaulterService.php
│   ├── RefundService.php
│   ├── ScholarshipService.php
│   └── NotificationService.php
├── Repositories/
│   ├── PaymentRepository.php
│   ├── FeeStructureRepository.php
│   └── StudentRepository.php
├── Jobs/
│   ├── SendPaymentReminderJob.php
│   ├── ProcessRefundJob.php
│   ├── GenerateMonthlyReportJob.php
│   └── UpdateChequeStatusJob.php
├── Events/
│   ├── PaymentReceived.php
│   ├── RefundApproved.php
│   └── ScholarshipGranted.php
└── Listeners/
    ├── SendPaymentConfirmation.php
    ├── GenerateReceipt.php
    └── AdjustFeeStructure.php
```

---

## Models

### FeeComponent Model
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class FeeComponent extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'college_id',
        'name',
        'description',
        'base_amount',
        'gst_percentage',
        'is_mandatory',
        'is_refundable',
        'category' // tuition, library, sports, development
    ];

    protected $casts = [
        'base_amount' => 'decimal:2',
        'gst_percentage' => 'decimal:2',
        'is_mandatory' => 'boolean',
        'is_refundable' => 'boolean'
    ];

    // Relationships
    public function college()
    {
        return $this->belongsTo(College::class);
    }

    public function feeStructures()
    {
        return $this->belongsToMany(FeeStructure::class, 'fee_structure_components')
                    ->withPivot('customized_amount', 'waiver_percentage')
                    ->withTimestamps();
    }

    // Scopes
    public function scopeMandatory($query)
    {
        return $query->where('is_mandatory', true);
    }

    public function scopeRefundable($query)
    {
        return $query->where('is_refundable', true);
    }

    // Accessors & Mutators
    public function getAmountWithGstAttribute()
    {
        return $this->base_amount * (1 + ($this->gst_percentage / 100));
    }
}
```

### Payment Model
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'college_id',
        'student_id',
        'payment_mode', // online, cash, cheque, dd, neft
        'payment_type', // full_fee, installment, partial
        'installment_number',
        'amount',
        'gateway_charges',
        'net_amount',
        'transaction_id',
        'razorpay_order_id',
        'razorpay_payment_id',
        'razorpay_signature',
        'status', // pending, success, failed, refunded
        'payment_date',
        'received_by',
        'cheque_number',
        'cheque_date',
        'bank_name',
        'cheque_photo_url',
        'cheque_status', // deposited, realized, bounced
        'cash_denominations', // JSON
        'remarks'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'gateway_charges' => 'decimal:2',
        'net_amount' => 'decimal:2',
        'payment_date' => 'datetime',
        'cheque_date' => 'date',
        'cash_denominations' => 'array'
    ];

    // Relationships
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function receipt()
    {
        return $this->hasOne(Receipt::class);
    }

    public function receivedBy()
    {
        return $this->belongsTo(User::class, 'received_by');
    }

    // Scopes
    public function scopeSuccessful($query)
    {
        return $query->where('status', 'success');
    }

    public function scopeByMode($query, $mode)
    {
        return $query->where('payment_mode', $mode);
    }

    public function scopeBetweenDates($query, $startDate, $endDate)
    {
        return $query->whereBetween('payment_date', [$startDate, $endDate]);
    }

    // Methods
    public function verifyRazorpaySignature()
    {
        $generatedSignature = hash_hmac(
            'sha256',
            $this->razorpay_order_id . '|' . $this->razorpay_payment_id,
            config('services.razorpay.secret')
        );

        return $generatedSignature === $this->razorpay_signature;
    }

    public function markAsSuccess()
    {
        $this->update([
            'status' => 'success',
            'payment_date' => now()
        ]);

        event(new \App\Events\PaymentReceived($this));
    }
}
```

### Receipt Model
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    protected $fillable = [
        'college_id',
        'payment_id',
        'receipt_number',
        'student_id',
        'amount',
        'payment_mode',
        'issued_date',
        'issued_by',
        'pdf_url',
        'is_duplicate',
        'original_receipt_id',
        'qr_code_url',
        'digital_signature'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'issued_date' => 'datetime',
        'is_duplicate' => 'boolean'
    ];

    // Relationships
    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function issuedBy()
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    public function originalReceipt()
    {
        return $this->belongsTo(Receipt::class, 'original_receipt_id');
    }

    // Methods
    public static function generateReceiptNumber($collegeId)
    {
        $year = date('Y');
        $prefix = 'RCP-' . $year . '-';
        
        $lastReceipt = self::where('college_id', $collegeId)
                           ->where('receipt_number', 'like', $prefix . '%')
                           ->orderBy('id', 'desc')
                           ->first();

        if ($lastReceipt) {
            $lastNumber = (int) substr($lastReceipt->receipt_number, strlen($prefix));
            $newNumber = str_pad($lastNumber + 1, 6, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '000001';
        }

        return $prefix . $newNumber;
    }

    public function generateQRCode()
    {
        $verificationUrl = config('app.url') . '/verify-receipt/' . $this->receipt_number;
        
        // Use SimpleSoftwareIO/simple-qrcode package
        $qrCode = \QrCode::format('png')
                         ->size(200)
                         ->generate($verificationUrl);

        $filename = 'qr-codes/' . $this->receipt_number . '.png';
        \Storage::disk('s3')->put($filename, $qrCode);

        $this->update(['qr_code_url' => \Storage::disk('s3')->url($filename)]);
    }
}
```

### Installment Model
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Installment extends Model
{
    protected $fillable = [
        'college_id',
        'installment_plan_id',
        'student_id',
        'sequence',
        'due_date',
        'amount',
        'paid_amount',
        'late_fee',
        'status', // pending, partial, paid, overdue
        'payment_ids' // JSON array of payment IDs
    ];

    protected $casts = [
        'due_date' => 'date',
        'amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'late_fee' => 'decimal:2',
        'payment_ids' => 'array'
    ];

    // Relationships
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function plan()
    {
        return $this->belongsTo(InstallmentPlan::class, 'installment_plan_id');
    }

    // Accessors
    public function getPendingAmountAttribute()
    {
        return max(0, $this->amount - $this->paid_amount);
    }

    public function getDaysOverdueAttribute()
    {
        if ($this->due_date->isFuture()) {
            return 0;
        }
        return now()->diffInDays($this->due_date, false) * -1;
    }

    // Methods
    public function calculateLateFee()
    {
        $daysOverdue = $this->days_overdue;

        if ($daysOverdue <= 0) {
            return 0;
        } elseif ($daysOverdue <= 7) {
            return 500;
        } elseif ($daysOverdue <= 15) {
            return 1000;
        } else {
            return 2000;
        }
    }

    public function updateStatus()
    {
        if ($this->paid_amount >= $this->amount) {
            $this->status = 'paid';
        } elseif ($this->paid_amount > 0) {
            $this->status = 'partial';
        } elseif ($this->due_date->isPast()) {
            $this->status = 'overdue';
        } else {
            $this->status = 'pending';
        }

        $this->late_fee = $this->calculateLateFee();
        $this->save();
    }
}
```

### Refund Model
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Refund extends Model
{
    protected $fillable = [
        'college_id',
        'student_id',
        'refund_type', // dropout, overpayment, scholarship, correction
        'reason',
        'expected_amount',
        'calculated_amount',
        'processing_charges',
        'net_refund_amount',
        'status', // pending, approved, rejected, disbursed
        'bank_account_number',
        'ifsc_code',
        'account_holder_name',
        'utr_number',
        'approved_by',
        'approved_at',
        'disbursed_at',
        'remarks'
    ];

    protected $casts = [
        'expected_amount' => 'decimal:2',
        'calculated_amount' => 'decimal:2',
        'processing_charges' => 'decimal:2',
        'net_refund_amount' => 'decimal:2',
        'approved_at' => 'datetime',
        'disbursed_at' => 'datetime'
    ];

    // Relationships
    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // Methods
    public function calculateRefundAmount()
    {
        $student = $this->student;
        $totalPaid = $student->payments()->successful()->sum('amount');

        switch ($this->refund_type) {
            case 'dropout':
                $refundableAmount = $this->calculateDropoutRefund($student);
                break;
            case 'overpayment':
                $refundableAmount = $this->expected_amount;
                break;
            case 'scholarship':
                $refundableAmount = $this->expected_amount;
                break;
            default:
                $refundableAmount = 0;
        }

        $this->calculated_amount = $refundableAmount;
        $this->processing_charges = $refundableAmount * 0.05; // 5% processing fee
        $this->net_refund_amount = $refundableAmount - $this->processing_charges;
        $this->save();

        return $this->net_refund_amount;
    }

    private function calculateDropoutRefund($student)
    {
        // Get refundable components
        $feeStructure = $student->feeStructure;
        $refundableComponents = $feeStructure->components()
                                             ->wherePivot('is_refundable', true)
                                             ->get();

        $refundableAmount = $refundableComponents->sum('base_amount');
        
        // Deduct already consumed services (e.g., prorated tuition)
        // This is a simplified example
        return $refundableAmount;
    }
}
```

---

## Controllers

### PaymentController
```php
<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Services\PaymentGatewayService;
use App\Services\ReceiptGeneratorService;
use App\Http\Requests\PaymentRequest;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    protected $paymentGateway;
    protected $receiptGenerator;

    public function __construct(
        PaymentGatewayService $paymentGateway,
        ReceiptGeneratorService $receiptGenerator
    ) {
        $this->paymentGateway = $paymentGateway;
        $this->receiptGenerator = $receiptGenerator;
    }

    /**
     * Initiate online payment
     */
    public function initiateOnlinePayment(PaymentRequest $request)
    {
        $validated = $request->validated();

        // Create payment record
        $payment = Payment::create([
            'college_id' => auth()->user()->college_id,
            'student_id' => $validated['student_id'],
            'payment_mode' => 'online',
            'payment_type' => $validated['payment_for'],
            'installment_number' => $validated['installment_number'] ?? null,
            'amount' => $validated['amount'],
            'status' => 'pending'
        ]);

        // Create Razorpay order
        $razorpayOrder = $this->paymentGateway->createOrder([
            'amount' => $payment->amount * 100, // Convert to paise
            'currency' => 'INR',
            'receipt' => 'ORD-' . $payment->id,
            'notes' => [
                'student_id' => $payment->student_id,
                'payment_id' => $payment->id
            ]
        ]);

        // Update payment with Razorpay order ID
        $payment->update([
            'razorpay_order_id' => $razorpayOrder['id'],
            'gateway_charges' => $payment->amount * 0.02, // 2% gateway fee
            'net_amount' => $payment->amount * 1.02
        ]);

        return response()->json([
            'success' => true,
            'payment_id' => $payment->id,
            'razorpay_order_id' => $razorpayOrder['id'],
            'amount' => $payment->net_amount,
            'redirect_url' => config('services.razorpay.checkout_url')
        ]);
    }

    /**
     * Razorpay webhook callback
     */
    public function razorpayCallback(Request $request)
    {
        $payment = Payment::where('razorpay_order_id', $request->razorpay_order_id)
                          ->firstOrFail();

        $payment->update([
            'razorpay_payment_id' => $request->razorpay_payment_id,
            'razorpay_signature' => $request->razorpay_signature
        ]);

        // Verify signature
        if ($payment->verifyRazorpaySignature()) {
            $payment->markAsSuccess();

            // Generate receipt asynchronously
            \App\Jobs\GenerateReceiptJob::dispatch($payment);

            return response()->json(['success' => true]);
        }

        $payment->update(['status' => 'failed']);
        return response()->json(['success' => false], 400);
    }

    /**
     * Record cash payment
     */
    public function recordCashPayment(PaymentRequest $request)
    {
        $validated = $request->validated();

        $payment = Payment::create([
            'college_id' => auth()->user()->college_id,
            'student_id' => $validated['student_id'],
            'payment_mode' => 'cash',
            'amount' => $validated['amount'],
            'net_amount' => $validated['amount'],
            'cash_denominations' => $validated['cash_denominations'],
            'received_by' => auth()->id(),
            'status' => 'success',
            'payment_date' => now()
        ]);

        // Generate receipt immediately
        $receipt = $this->receiptGenerator->generate($payment);

        return response()->json([
            'success' => true,
            'payment_id' => $payment->id,
            'receipt' => $receipt
        ], 201);
    }

    /**
     * Record cheque/DD payment
     */
    public function recordChequePayment(PaymentRequest $request)
    {
        $validated = $request->validated();

        // Upload cheque photo if provided
        $photoUrl = null;
        if ($request->hasFile('cheque_photo')) {
            $photoUrl = $request->file('cheque_photo')
                                ->store('cheque-photos', 's3');
        }

        $payment = Payment::create([
            'college_id' => auth()->user()->college_id,
            'student_id' => $validated['student_id'],
            'payment_mode' => 'cheque',
            'amount' => $validated['amount'],
            'net_amount' => $validated['amount'],
            'bank_name' => $validated['bank_name'],
            'cheque_number' => $validated['cheque_number'],
            'cheque_date' => $validated['cheque_date'],
            'cheque_photo_url' => $photoUrl,
            'cheque_status' => 'deposited',
            'received_by' => auth()->id(),
            'status' => 'pending', // Status changes when cheque is realized
            'payment_date' => now()
        ]);

        return response()->json([
            'success' => true,
            'payment_id' => $payment->id,
            'message' => 'Cheque payment recorded. Receipt will be generated after realization.'
        ], 201);
    }

    /**
     * Get payment history
     */
    public function getPaymentHistory(Request $request)
    {
        $query = Payment::with(['student', 'receipt'])
                        ->where('college_id', auth()->user()->college_id);

        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }

        if ($request->has('from_date') && $request->has('to_date')) {
            $query->betweenDates($request->from_date, $request->to_date);
        }

        $payments = $query->orderBy('payment_date', 'desc')
                          ->paginate(50);

        return response()->json($payments);
    }
}
```

---

## Services

### PaymentGatewayService
```php
<?php

namespace App\Services;

use Razorpay\Api\Api;

class PaymentGatewayService
{
    protected $razorpay;

    public function __construct()
    {
        $this->razorpay = new Api(
            config('services.razorpay.key'),
            config('services.razorpay.secret')
        );
    }

    /**
     * Create Razorpay order
     */
    public function createOrder(array $data)
    {
        return $this->razorpay->order->create($data);
    }

    /**
     * Fetch payment details
     */
    public function fetchPayment($paymentId)
    {
        return $this->razorpay->payment->fetch($paymentId);
    }

    /**
     * Initiate refund
     */
    public function initiateRefund($paymentId, $amount)
    {
        $payment = $this->razorpay->payment->fetch($paymentId);
        
        return $payment->refund([
            'amount' => $amount * 100, // Convert to paise
            'speed' => 'normal'
        ]);
    }

    /**
     * Generate payment link
     */
    public function generatePaymentLink(array $data)
    {
        return $this->razorpay->paymentLink->create([
            'amount' => $data['amount'] * 100,
            'currency' => 'INR',
            'description' => $data['description'],
            'customer' => [
                'name' => $data['customer_name'],
                'email' => $data['customer_email'],
                'contact' => $data['customer_phone']
            ],
            'notify' => [
                'sms' => true,
                'email' => true
            ],
            'callback_url' => config('app.url') . '/payment-callback',
            'callback_method' => 'get'
        ]);
    }
}
```

### ReceiptGeneratorService
```php
<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Receipt;
use Barryvdh\DomPDF\Facade\Pdf;

class ReceiptGeneratorService
{
    /**
     * Generate receipt PDF
     */
    public function generate(Payment $payment)
    {
        // Create receipt record
        $receipt = Receipt::create([
            'college_id' => $payment->college_id,
            'payment_id' => $payment->id,
            'receipt_number' => Receipt::generateReceiptNumber($payment->college_id),
            'student_id' => $payment->student_id,
            'amount' => $payment->amount,
            'payment_mode' => $payment->payment_mode,
            'issued_date' => now(),
            'issued_by' => auth()->id()
        ]);

        // Generate QR code
        $receipt->generateQRCode();

        // Generate PDF
        $pdf = Pdf::loadView('receipts.template', [
            'receipt' => $receipt->load(['payment.student', 'issuedBy']),
            'college' => $payment->college
        ]);

        // Upload to S3
        $filename = 'receipts/' . $receipt->receipt_number . '.pdf';
        \Storage::disk('s3')->put($filename, $pdf->output());

        $receipt->update([
            'pdf_url' => \Storage::disk('s3')->url($filename)
        ]);

        return $receipt;
    }

    /**
     * Generate duplicate receipt
     */
    public function generateDuplicate(Receipt $originalReceipt, $reason)
    {
        $duplicateReceipt = Receipt::create([
            'college_id' => $originalReceipt->college_id,
            'payment_id' => $originalReceipt->payment_id,
            'receipt_number' => $originalReceipt->receipt_number . '-DUP',
            'student_id' => $originalReceipt->student_id,
            'amount' => $originalReceipt->amount,
            'payment_mode' => $originalReceipt->payment_mode,
            'issued_date' => now(),
            'issued_by' => auth()->id(),
            'is_duplicate' => true,
            'original_receipt_id' => $originalReceipt->id
        ]);

        // Generate PDF with "DUPLICATE" watermark
        $pdf = Pdf::loadView('receipts.duplicate-template', [
            'receipt' => $duplicateReceipt->load(['payment.student', 'issuedBy']),
            'reason' => $reason
        ]);

        $filename = 'receipts/' . $duplicateReceipt->receipt_number . '.pdf';
        \Storage::disk('s3')->put($filename, $pdf->output());

        $duplicateReceipt->update([
            'pdf_url' => \Storage::disk('s3')->url($filename)
        ]);

        return $duplicateReceipt;
    }
}
```

---

## Jobs & Queues

### SendPaymentReminderJob
```php
<?php

namespace App\Jobs;

use App\Models\Installment;
use App\Services\NotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendPaymentReminderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 120;

    protected $installment;
    protected $template;

    public function __construct(Installment $installment, string $template)
    {
        $this->installment = $installment;
        $this->template = $template;
    }

    public function handle(NotificationService $notificationService)
    {
        $student = $this->installment->student;

        // Send SMS
        $notificationService->sendSMS(
            $student->phone,
            $this->getReminderMessage()
        );

        // Send Email
        $notificationService->sendEmail(
            $student->email,
            'Payment Reminder - ' . $this->installment->sequence . ' Installment',
            'emails.payment-reminder',
            [
                'student' => $student,
                'installment' => $this->installment
            ]
        );
    }

    private function getReminderMessage()
    {
        $templates = [
            '7_days_before' => "Dear {$this->installment->student->name}, your installment of ₹{$this->installment->amount} is due on {$this->installment->due_date->format('d M Y')}. Pay online at fees.college.edu.in",
            
            'due_date' => "Dear {$this->installment->student->name}, your installment of ₹{$this->installment->amount} is due today. Please pay to avoid late fee.",
            
            '3_days_after' => "Dear {$this->installment->student->name}, your installment is overdue by 3 days. Outstanding: ₹{$this->installment->pending_amount}. Pay immediately to avoid hall ticket block.",
            
            '7_days_after' => "URGENT: Dear {$this->installment->student->name}, your installment is overdue by 7 days. Outstanding: ₹{$this->installment->pending_amount} + Late Fee. Pay now.",
        ];

        return $templates[$this->template] ?? $templates['due_date'];
    }
}
```

---

## Middleware

### CollegeIsolation Middleware
```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CollegeIsolation
{
    /**
     * Ensure users can only access their college data
     */
    public function handle(Request $request, Closure $next)
    {
        $user = auth()->user();

        if (!$user || !$user->college_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Add college_id to all queries automatically
        if ($request->isMethod('get')) {
            $request->merge(['college_id' => $user->college_id]);
        }

        return $next($request);
    }
}
```

---

## API Routes

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\RefundController;

Route::prefix('v1')->middleware(['auth:sanctum', 'college_isolation'])->group(function () {
    
    // Payments
    Route::post('/payments/online/initiate', [PaymentController::class, 'initiateOnlinePayment']);
    Route::post('/payments/cash', [PaymentController::class, 'recordCashPayment']);
    Route::post('/payments/cheque', [PaymentController::class, 'recordChequePayment']);
    Route::get('/payments/history', [PaymentController::class, 'getPaymentHistory']);
    
    // Refunds
    Route::post('/refunds/request', [RefundController::class, 'submitRequest']);
    Route::put('/refunds/{id}/approve', [RefundController::class, 'approve']);
    Route::post('/refunds/{id}/disburse', [RefundController::class, 'disburse']);
});

// Public webhook (no auth)
Route::post('/payments/online/callback', [PaymentController::class, 'razorpayCallback']);
```

---

## Configuration

### config/services.php
```php
<?php

return [
    'razorpay' => [
        'key' => env('RAZORPAY_KEY'),
        'secret' => env('RAZORPAY_SECRET'),
        'webhook_secret' => env('RAZORPAY_WEBHOOK_SECRET'),
        'checkout_url' => 'https://checkout.razorpay.com/v1/checkout.js'
    ],

    'msg91' => [
        'auth_key' => env('MSG91_AUTH_KEY'),
        'sender_id' => env('MSG91_SENDER_ID'),
        'route' => '4' // Transactional
    ],

    'aws' => [
        'ses' => [
            'key' => env('AWS_SES_KEY'),
            'secret' => env('AWS_SES_SECRET'),
            'region' => env('AWS_SES_REGION', 'ap-south-1'),
            'from' => env('MAIL_FROM_ADDRESS', 'fees@college.edu.in')
        ]
    ]
];
```

---

**End of Backend Guide**
