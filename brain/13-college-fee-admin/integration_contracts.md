# College Fee Admin Portal - Integration Contracts

**Version**: 1.0.0  
**Integrations**: 5 external services  
**Annual Transaction Volume**: 15,000+ payments/year

---

## Integration Summary

| Service | Purpose | Cost | SLA | Status |
|---------|---------|------|-----|--------|
| **Razorpay** | Payment gateway (₹39 Cr/year) | 2% per transaction | 99.9% | ✅ |
| **AWS S3** | Receipt storage (30,000+ PDFs/year) | $0.023/GB | 99.99% | ✅ |
| **AWS SES** | Email notifications | $0.10/1000 emails | 99.9% | ✅ |
| **MSG91** | SMS reminders (10,000+ SMS/year) | ₹0.25/SMS | 99% | ✅ |
| **Bank NEFT/RTGS** | Refund disbursement (500+/year) | Per bank policy | N/A | ✅ |

---

## 1. Razorpay Payment Gateway

### Contract Details
- **Provider**: Razorpay Software Pvt Ltd
- **Contract Start**: 2024-01-01
- **Contract Duration**: 3 years
- **Transaction Fee**: 2% (negotiated from 2.5%)
- **Settlement Cycle**: T+3 days
- **Support**: 24x7 email/phone

### API Endpoints

#### Create Order
```bash
POST https://api.razorpay.com/v1/orders

Authorization: Basic <base64(key_id:key_secret)>
Content-Type: application/json

{
  "amount": 7500000,
  "currency": "INR",
  "receipt": "ORD-101",
  "notes": {
    "student_id": "21CS001",
    "payment_id": 101
  }
}

Response:
{
  "id": "order_ABC123",
  "entity": "order",
  "amount": 7500000,
  "currency": "INR",
  "receipt": "ORD-101",
  "status": "created",
  "created_at": 1698768000
}
```

#### Verify Payment
```bash
POST https://api.razorpay.com/v1/payments/{payment_id}/capture

{
  "amount": 7500000,
  "currency": "INR"
}
```

#### Initiate Refund
```bash
POST https://api.razorpay.com/v1/payments/{payment_id}/refund

{
  "amount": 5000000,
  "speed": "normal",
  "notes": {
    "refund_reason": "Dropout refund"
  }
}

Response:
{
  "id": "rfnd_ABC123",
  "amount": 5000000,
  "currency": "INR",
  "status": "processed",
  "created_at": 1698768000
}
```

### Webhook Configuration
```json
{
  "url": "https://api.college.edu.in/api/v1/payments/online/callback",
  "events": [
    "payment.captured",
    "payment.failed",
    "refund.processed"
  ],
  "secret": "whsec_ABC123XYZ789"
}
```

### Webhook Signature Verification
```php
$signature = hash_hmac('sha256', $payload, config('razorpay.webhook_secret'));
if (!hash_equals($signature, $receivedSignature)) {
    abort(403, 'Invalid webhook signature');
}
```

### Error Codes
| Code | Description | Action |
|------|-------------|--------|
| **BAD_REQUEST_ERROR** | Invalid input | Validate request params |
| **GATEWAY_ERROR** | Bank/payment method issue | Retry or switch method |
| **SERVER_ERROR** | Razorpay server issue | Wait and retry |
| **AUTHENTICATION_ERROR** | Invalid API key | Check credentials |

---

## 2. AWS S3 - Receipt Storage

### Bucket Configuration
```json
{
  "bucket_name": "college-fee-receipts",
  "region": "ap-south-1",
  "encryption": "AES256",
  "versioning": "enabled",
  "lifecycle_policy": {
    "transition_to_glacier": "90 days",
    "permanent_retention": true
  }
}
```

### Upload Receipt
```php
use Illuminate\Support\Facades\Storage;

$filename = 'receipts/' . $receipt->receipt_number . '.pdf';
Storage::disk('s3')->put($filename, $pdfContent, 'public');

$url = Storage::disk('s3')->url($filename);
$receipt->update(['pdf_url' => $url]);
```

### Access Control
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789:role/FeeAdminRole"
      },
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::college-fee-receipts/*"
    }
  ]
}
```

### Cost Estimation
- **Storage**: 30,000 receipts/year × 100 KB = 3 GB/year
- **Cost**: 3 GB × $0.023/GB = $0.069/month
- **GET Requests**: 100,000/year × $0.0004/1000 = $0.04/month
- **Total**: ~$1/month

---

## 3. AWS SES - Email Notifications

### Configuration
```php
// config/mail.php
'ses' => [
    'key' => env('AWS_SES_KEY'),
    'secret' => env('AWS_SES_SECRET'),
    'region' => env('AWS_SES_REGION', 'ap-south-1'),
],

// Sender email
'from' => [
    'address' => 'fees@college.edu.in',
    'name' => 'St. Xavier College Fee Department'
],
```

### Send Payment Confirmation Email
```php
use Illuminate\Support\Facades\Mail;
use App\Mail\PaymentConfirmation;

Mail::to($student->email)
    ->send(new PaymentConfirmation($payment, $receipt));
```

### Email Templates

#### Payment Confirmation
```html
Subject: Payment Confirmation - Receipt {{receipt_number}}

Dear {{student_name}},

Your payment of ₹{{amount}} has been successfully received.

Receipt Number: {{receipt_number}}
Payment Date: {{payment_date}}
Payment Mode: {{payment_mode}}

Download Receipt: {{receipt_url}}

Thank you,
St. Xavier College Fee Department
```

#### Payment Reminder
```html
Subject: Payment Reminder - {{installment_name}} Due on {{due_date}}

Dear {{student_name}},

This is a reminder that your {{installment_name}} of ₹{{amount}} is due on {{due_date}}.

Pay online: {{payment_link}}

For queries, contact: fees@college.edu.in

Best regards,
Fee Department
```

### Cost Estimation
- **Email Volume**: 40,000/year (receipts + reminders)
- **Cost**: 40,000 × $0.10/1000 = $4/year

---

## 4. MSG91 - SMS Gateway

### API Configuration
```php
// config/services.php
'msg91' => [
    'auth_key' => env('MSG91_AUTH_KEY'),
    'sender_id' => env('MSG91_SENDER_ID', 'STXAVR'),
    'route' => '4', // Transactional
],
```

### Send SMS
```php
use Illuminate\Support\Facades\Http;

Http::post('https://api.msg91.com/api/v5/flow/', [
    'authkey' => config('services.msg91.auth_key'),
    'mobiles' => $student->phone,
    'template_id' => '67890',
    'variables' => [
        'var1' => $student->name,
        'var2' => $installment->amount,
        'var3' => $installment->due_date->format('d M Y')
    ]
]);
```

### SMS Templates

#### Payment Confirmation (Template ID: 12345)
```
Dear {var1}, your payment of Rs.{var2} has been received. Receipt: {var3}. Download: {var4}. - St. Xavier College
```

#### Payment Reminder (Template ID: 67890)
```
Dear {var1}, your installment of Rs.{var2} is due on {var3}. Pay online at fees.college.edu.in - St. Xavier College
```

#### Overdue Alert (Template ID: 11111)
```
URGENT: Dear {var1}, your fee of Rs.{var2} is overdue by {var3} days. Late fee applicable. Pay now - St. Xavier College
```

### DLT (Distributed Ledger Technology) Registration
- **Entity ID**: 1201XXXXXXXXXX
- **Template IDs**: 12345, 67890, 11111 (TRAI approved)
- **Sender ID**: STXAVR (6 characters, alphanumeric)

### Cost Estimation
- **SMS Volume**: 10,000/year (reminders + confirmations)
- **Cost**: 10,000 × ₹0.25 = ₹2,500/year

---

## 5. Bank NEFT/RTGS Integration

### Supported Banks
- State Bank of India (SBI)
- HDFC Bank
- ICICI Bank
- Axis Bank
- Others via manual processing

### NEFT Refund Process

#### Step 1: Generate Beneficiary File (NEFT format)
```php
// Generate NACH format file for bulk refunds
$nachContent = "H,STXAV,{$date},REFUND\n";

foreach ($refunds as $refund) {
    $nachContent .= implode(',', [
        $refund->bank_account_number,
        $refund->ifsc_code,
        $refund->account_holder_name,
        $refund->net_refund_amount,
        'REFUND-' . $refund->id
    ]) . "\n";
}

Storage::put("neft_batch_{$date}.txt", $nachContent);
```

#### Step 2: Upload to Bank Portal
1. Login to bank's corporate banking portal
2. Upload NEFT batch file
3. Approve with dual authorization (2-factor)
4. Bank processes within 2 hours

#### Step 3: Receive UTR Numbers
```php
// Bank sends CSV with UTR numbers
$utrFile = Storage::get('utr_responses/batch_20241015.csv');

foreach ($utrData as $row) {
    Refund::where('id', $row['refund_id'])
          ->update([
              'utr_number' => $row['utr'],
              'status' => 'disbursed',
              'disbursed_at' => now()
          ]);
}
```

### Bank Charges
- **NEFT**: Free (RBI mandate)
- **RTGS**: ₹25 per transaction (for amounts > ₹2 lakhs)
- **Processing Time**: NEFT (2-4 hours), RTGS (30 minutes)

---

## Integration Monitoring

### Health Checks

#### Razorpay Health Check
```php
use Illuminate\Support\Facades\Cache;

public function checkRazorpayHealth()
{
    try {
        $api = new \Razorpay\Api\Api(config('razorpay.key'), config('razorpay.secret'));
        $api->utility->verifyWebhookSignature('test', 'test', 'test');
        
        Cache::put('razorpay_health', 'up', now()->addMinutes(5));
        return true;
    } catch (\Exception $e) {
        Cache::put('razorpay_health', 'down', now()->addMinutes(5));
        \Log::error('Razorpay health check failed: ' . $e->getMessage());
        return false;
    }
}
```

#### AWS S3 Health Check
```php
public function checkS3Health()
{
    try {
        Storage::disk('s3')->files('receipts');
        Cache::put('s3_health', 'up', now()->addMinutes(5));
        return true;
    } catch (\Exception $e) {
        Cache::put('s3_health', 'down', now()->addMinutes(5));
        return false;
    }
}
```

### Alert Thresholds
- Razorpay API error rate > 5% → P1 Alert
- S3 upload failure > 3 consecutive → P2 Alert
- SES bounce rate > 10% → P2 Alert
- SMS delivery failure > 20% → P3 Alert

---

## Fallback Strategies

### Payment Gateway Fallback
```
Primary: Razorpay
   ↓ (if fails 3 times)
Fallback: PayU
   ↓ (if fails)
Manual: Cash/Cheque collection
```

### Email Fallback
```
Primary: AWS SES
   ↓ (if SES down)
Fallback: SMTP (Gmail Business)
```

### SMS Fallback
```
Primary: MSG91
   ↓ (if MSG91 down)
Fallback: Twilio
```

---

**Integration Status**: ✅ All systems operational  
**Last Health Check**: 2024-10-15 10:30 AM  
**Next Review**: 2024-11-15
