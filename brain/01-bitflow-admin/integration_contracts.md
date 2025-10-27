# Bitflow Admin Portal - Integration Contracts

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Overview

This document defines all external integrations, webhooks, events, and inter-portal communication contracts for Bitflow Admin Portal.

---

## 1. External API Integrations

### 1.1 Stripe API (Billing & Payments)

**Purpose**: Process subscriptions, invoices, and payments

**SDK**: `stripe/stripe-php: ^13.0`

**Configuration**:
```php
// config/services.php
'stripe' => [
    'key' => env('STRIPE_KEY'),
    'secret' => env('STRIPE_SECRET'),
    'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
],
```

**API Calls (Outgoing)**:

```php
use Stripe\StripeClient;

class StripeService
{
    protected StripeClient $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(config('services.stripe.secret'));
    }

    /**
     * Create Stripe Customer when creating university
     */
    public function createCustomer(University $university): string
    {
        $customer = $this->stripe->customers->create([
            'email' => $university->primary_email,
            'name' => $university->name,
            'metadata' => [
                'university_id' => $university->id,
            ],
        ]);

        return $customer->id; // Returns cus_xxxxx
    }

    /**
     * Create Subscription
     */
    public function createSubscription(string $customerId, string $priceId): string
    {
        $subscription = $this->stripe->subscriptions->create([
            'customer' => $customerId,
            'items' => [['price' => $priceId]],
            'payment_behavior' => 'default_incomplete',
            'expand' => ['latest_invoice.payment_intent'],
        ]);

        return $subscription->id; // Returns sub_xxxxx
    }

    /**
     * Create Invoice
     */
    public function createInvoice(string $customerId, array $items): string
    {
        $invoice = $this->stripe->invoices->create([
            'customer' => $customerId,
            'auto_advance' => true,
        ]);

        foreach ($items as $item) {
            $this->stripe->invoiceItems->create([
                'customer' => $customerId,
                'invoice' => $invoice->id,
                'amount' => $item['amount'] * 100, // Convert to cents
                'currency' => 'usd',
                'description' => $item['description'],
            ]);
        }

        $this->stripe->invoices->finalizeInvoice($invoice->id);

        return $invoice->id; // Returns in_xxxxx
    }

    /**
     * Cancel Subscription
     */
    public function cancelSubscription(string $subscriptionId): void
    {
        $this->stripe->subscriptions->cancel($subscriptionId);
    }
}
```

**Webhook Events (Incoming)**:

```php
// routes/api.php
Route::post('/webhooks/stripe', [StripeWebhookController::class, 'handle']);

// app/Http/Controllers/StripeWebhookController.php
class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $signature = $request->header('Stripe-Signature');
        $payload = $request->getContent();

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $signature,
                config('services.stripe.webhook_secret')
            );
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        match ($event->type) {
            'invoice.payment_succeeded' => $this->handlePaymentSucceeded($event->data->object),
            'invoice.payment_failed' => $this->handlePaymentFailed($event->data->object),
            'customer.subscription.updated' => $this->handleSubscriptionUpdated($event->data->object),
            'customer.subscription.deleted' => $this->handleSubscriptionDeleted($event->data->object),
            default => null,
        };

        return response()->json(['status' => 'success']);
    }

    protected function handlePaymentSucceeded($invoice)
    {
        Invoice::where('stripe_invoice_id', $invoice->id)->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        Payment::create([
            'invoice_id' => Invoice::where('stripe_invoice_id', $invoice->id)->value('id'),
            'amount' => $invoice->amount_paid / 100,
            'payment_method' => $invoice->payment_intent->payment_method->type ?? 'card',
            'stripe_payment_intent_id' => $invoice->payment_intent->id,
            'status' => 'completed',
        ]);
    }
}
```

**Stripe Events Handled**:
- `invoice.payment_succeeded` → Update invoice status to "paid"
- `invoice.payment_failed` → Update invoice status to "failed", send notification
- `customer.subscription.updated` → Sync subscription changes
- `customer.subscription.deleted` → Mark subscription as "cancelled"

---

### 1.2 AWS S3 (File Storage)

**Purpose**: Store university logos, reports, backups

**SDK**: `aws/aws-sdk-php: ^3.0`

**Configuration**:
```php
// config/filesystems.php
's3' => [
    'driver' => 's3',
    'key' => env('AWS_ACCESS_KEY_ID'),
    'secret' => env('AWS_SECRET_ACCESS_KEY'),
    'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    'bucket' => env('AWS_BUCKET'),
],
```

**Usage**:
```php
use Illuminate\Support\Facades\Storage;

// Upload university logo
$path = Storage::disk('s3')->putFile(
    'universities/logos',
    $request->file('logo')
);

// Generate signed URL for download
$url = Storage::disk('s3')->temporaryUrl(
    $path,
    now()->addMinutes(30)
);

// Delete file
Storage::disk('s3')->delete($path);
```

---

### 1.3 SendGrid (Email Service)

**Purpose**: Send transactional emails (invoices, alerts)

**SDK**: `sendgrid/sendgrid: ^8.0`

**Configuration**:
```php
// config/mail.php
'sendgrid' => [
    'api_key' => env('SENDGRID_API_KEY'),
],
```

**Email Types**:
- University welcome email
- Invoice generated notification
- Payment failure alert
- Subscription expiration warning
- System downtime notification

**Example**:
```php
use App\Mail\UniversityCreatedMail;
use Illuminate\Support\Facades\Mail;

Mail::to($university->primary_email)->send(
    new UniversityCreatedMail($university)
);
```

---

## 2. Internal Events (Laravel Events)

### Event Structure

```
app/Events/
├── UniversityCreated.php
├── UniversityUpdated.php
├── UniversityDeleted.php
├── SubscriptionStatusChanged.php
├── InvoiceGenerated.php
├── PaymentProcessed.php
└── StorageQuotaExceeded.php
```

### 2.1 UniversityCreated Event

```php
<?php

namespace App\Events;

use App\Models\University;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UniversityCreated
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public University $university) {}
}
```

**Triggered When**: New university is created via API

**Listeners**:
```php
// app/Listeners/CreateStripeCustomer.php
class CreateStripeCustomer
{
    public function handle(UniversityCreated $event)
    {
        $stripeService = app(StripeService::class);
        $customerId = $stripeService->createCustomer($event->university);

        $event->university->update([
            'stripe_customer_id' => $customerId,
        ]);
    }
}

// app/Listeners/SendWelcomeEmail.php
class SendWelcomeEmail
{
    public function handle(UniversityCreated $event)
    {
        Mail::to($event->university->primary_email)
            ->send(new UniversityCreatedMail($event->university));
    }
}

// app/Listeners/LogUniversityCreation.php
class LogUniversityCreation
{
    public function handle(UniversityCreated $event)
    {
        activity()
            ->performedOn($event->university)
            ->causedBy(auth()->user())
            ->log('University created');
    }
}
```

**EventServiceProvider Registration**:
```php
protected $listen = [
    UniversityCreated::class => [
        CreateStripeCustomer::class,
        SendWelcomeEmail::class,
        LogUniversityCreation::class,
    ],
];
```

---

### 2.2 StorageQuotaExceeded Event

```php
class StorageQuotaExceeded
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public University $university,
        public float $usagePercentage
    ) {}
}
```

**Triggered When**: University's storage usage exceeds 90%

**Listeners**:
```php
class SendStorageWarningEmail
{
    public function handle(StorageQuotaExceeded $event)
    {
        Mail::to($event->university->primary_email)
            ->send(new StorageQuotaWarningMail($event->university));
    }
}

class CreateStorageAlert
{
    public function handle(StorageQuotaExceeded $event)
    {
        Alert::create([
            'type' => 'storage_quota',
            'severity' => 'high',
            'university_id' => $event->university->id,
            'message' => "Storage usage at {$event->usagePercentage}%",
        ]);
    }
}
```

---

## 3. Inter-Portal Communication

### 3.1 University Portal → Bitflow Admin

**Scenario**: When university exceeds storage quota

```php
// In University Portal (Port 3002) backend
Http::post('http://localhost:8000/api/admin/alerts', [
    'type' => 'storage_exceeded',
    'university_id' => auth()->user()->university_id,
    'message' => 'Storage quota exceeded',
]);
```

**Bitflow Admin Receives**:
```php
// app/Http/Controllers/Admin/AlertController.php
public function store(Request $request)
{
    $alert = Alert::create([
        'type' => $request->type,
        'university_id' => $request->university_id,
        'severity' => 'high',
        'message' => $request->message,
        'is_acknowledged' => false,
    ]);

    // Trigger real-time notification to Bitflow Owner
    broadcast(new AlertCreated($alert));

    return response()->json($alert, 201);
}
```

---

### 3.2 Bitflow Admin → All University Portals

**Scenario**: Broadcast maintenance notification

```php
// Bitflow Admin sends to all universities
$universities = University::active()->get();

foreach ($universities as $university) {
    Http::post("http://{$university->domain}:8000/api/notifications", [
        'type' => 'maintenance',
        'title' => 'Scheduled Maintenance',
        'message' => 'System will be down on Sunday 2 AM - 4 AM',
        'scheduled_at' => '2025-11-15 02:00:00',
    ]);
}
```

---

## 4. Webhook Endpoints (Exposed by Bitflow Admin)

### 4.1 University Data Sync Webhook

**Endpoint**: `POST /api/webhooks/university-sync`

**Purpose**: Receive updates from university portals about their data

```php
// routes/api.php
Route::post('/webhooks/university-sync', [UniversitySyncWebhookController::class, 'handle']);

// Controller
class UniversitySyncWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $request->validate([
            'university_id' => 'required|uuid',
            'metric' => 'required|in:students,faculty,storage',
            'value' => 'required|numeric',
        ]);

        UniversityActivity::create([
            'university_id' => $request->university_id,
            'type' => 'metric_update',
            'description' => "{$request->metric} updated to {$request->value}",
            'metadata' => [
                'metric' => $request->metric,
                'old_value' => University::find($request->university_id)->{$request->metric},
                'new_value' => $request->value,
            ],
        ]);

        University::where('id', $request->university_id)->update([
            $request->metric => $request->value,
        ]);

        return response()->json(['status' => 'success']);
    }
}
```

**Example Request from University Portal**:
```json
{
  "university_id": "uuid-here",
  "metric": "students",
  "value": 15000
}
```

---

## 5. Real-Time Communication (Laravel Broadcasting)

### 5.1 WebSocket Configuration

**Driver**: Pusher or Laravel Reverb

```php
// config/broadcasting.php
'pusher' => [
    'driver' => 'pusher',
    'key' => env('PUSHER_APP_KEY'),
    'secret' => env('PUSHER_APP_SECRET'),
    'app_id' => env('PUSHER_APP_ID'),
    'options' => [
        'cluster' => env('PUSHER_APP_CLUSTER'),
        'encrypted' => true,
    ],
],
```

### 5.2 Broadcast Events

```php
// app/Events/AlertCreated.php
class AlertCreated implements ShouldBroadcast
{
    use InteractsWithSockets, SerializesModels;

    public function __construct(public Alert $alert) {}

    public function broadcastOn()
    {
        return new PrivateChannel('bitflow-admin');
    }

    public function broadcastAs()
    {
        return 'alert.created';
    }
}
```

**Frontend Listening** (Next.js):
```typescript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.NEXT_PUBLIC_PUSHER_KEY,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
  forceTLS: true,
  authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
  auth: {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  },
});

echo.private('bitflow-admin').listen('.alert.created', (e: Alert) => {
  toast.error(`New Alert: ${e.message}`);
});
```

---

## 6. Job Queue Contracts

### 6.1 Scheduled Jobs

**GenerateMonthlyInvoicesJob**:
- **Schedule**: 1st of every month at 00:00
- **Purpose**: Create invoices for all active subscriptions
- **Triggers**: `InvoiceGenerated` event for each university

**SyncStorageUsageJob**:
- **Schedule**: Every day at 02:00
- **Purpose**: Calculate storage usage for all universities
- **Triggers**: `StorageQuotaExceeded` event if usage > 90%

**SendPaymentRemindersJob**:
- **Schedule**: Every day at 09:00
- **Purpose**: Send payment reminders for overdue invoices
- **Triggers**: SendGrid email

---

## 7. API Rate Limiting

**Middleware**: `throttle:60,1` (60 requests per minute)

**Custom Rate Limiting for Webhooks**:
```php
RateLimiter::for('webhooks', function (Request $request) {
    return Limit::perMinute(100)->by($request->header('X-Signature'));
});
```

---

## 8. Contract Testing

### Example: Stripe Integration Test

```php
public function test_creates_stripe_customer_on_university_creation()
{
    Http::fake([
        'https://api.stripe.com/v1/customers' => Http::response([
            'id' => 'cus_test123',
        ], 200),
    ]);

    $university = University::factory()->create();

    event(new UniversityCreated($university));

    $this->assertDatabaseHas('universities', [
        'id' => $university->id,
        'stripe_customer_id' => 'cus_test123',
    ]);
}
```

---

## 9. Integration Checklist

- [ ] Stripe webhook endpoint verified
- [ ] AWS S3 bucket created and permissions set
- [ ] SendGrid API key configured and domain verified
- [ ] Pusher channels configured for real-time updates
- [ ] Job queue (Redis) running
- [ ] Scheduled tasks added to cron
- [ ] Webhook signatures validated
- [ ] Rate limiting tested
- [ ] Error handling implemented for all external API calls
- [ ] Retry logic added for failed webhooks

---

**All Integration Contracts Defined!**
