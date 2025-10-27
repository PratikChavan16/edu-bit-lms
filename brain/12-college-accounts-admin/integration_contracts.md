# College Accounts Admin Portal - Integration Contracts

**Integration Strategy**: REST APIs + Webhooks + Batch Sync  
**Data Format**: JSON (ISO 8601 dates, amounts in paisa)  
**Authentication**: OAuth2 + HMAC signatures

---

## Table of Contents
1. [Internal Portal Integrations](#1-internal-portal-integrations)
2. [External Service Integrations](#2-external-service-integrations)
3. [Webhook Specifications](#3-webhook-specifications)
4. [Data Synchronization](#4-data-synchronization)
5. [Error Handling](#5-error-handling)

---

## 1. Internal Portal Integrations

### 1.1 Super Admin Portal Integration

**Purpose**: College management, user authentication, audit logs

#### API Endpoints

**GET /api/v1/colleges**
```json
Request:
{
  "headers": {
    "Authorization": "Bearer {token}",
    "X-Portal": "college-accounts"
  }
}

Response: 200 OK
{
  "data": [
    {
      "id": 1,
      "name": "ABC Engineering College",
      "code": "ABC",
      "is_active": true,
      "address": "123 Main St, City",
      "phone": "+91-1234567890"
    }
  ]
}
```

**GET /api/v1/users**
```json
Request:
{
  "params": {
    "role": "college_accounts_admin",
    "college_id": 1
  }
}

Response: 200 OK
{
  "data": [
    {
      "id": 101,
      "name": "John Accountant",
      "email": "john@college.edu",
      "role": "college_accounts_admin",
      "college_id": 1,
      "is_active": true
    }
  ]
}
```

**POST /api/v1/audit-logs**
```json
Request:
{
  "entity_type": "expense",
  "entity_id": 12345,
  "action": "approved",
  "user_id": 101,
  "user_name": "John Accountant",
  "changes": {
    "status": {
      "old": "pending_approval",
      "new": "approved"
    },
    "approved_by": 101,
    "approved_at": "2024-01-15T10:30:00Z"
  },
  "ip_address": "192.168.1.10",
  "user_agent": "Mozilla/5.0..."
}

Response: 201 Created
{
  "id": 98765,
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 1.2 Principal Portal Integration

**Purpose**: Expense approvals, budget allocation, financial reports

#### API Endpoints

**POST /api/v1/approvals/expenses/{expense_id}/request**
```json
Request:
{
  "requester_id": 101,
  "requester_name": "John Accountant",
  "amount": 75000, // In rupees (requires principal approval if > 50K)
  "category": "infrastructure",
  "description": "Lab equipment purchase",
  "vendor_name": "Tech Supplies Ltd",
  "justification": "Required for new computer lab setup"
}

Response: 201 Created
{
  "approval_id": 456,
  "status": "pending",
  "created_at": "2024-01-15T10:30:00Z",
  "estimated_response": "2024-01-17T10:30:00Z" // 48 hours SLA
}
```

**Webhook Callback** (Principal → Accounts):
```json
POST /api/v1/webhooks/expense-approval
{
  "approval_id": 456,
  "expense_id": 12345,
  "status": "approved",
  "approver_id": 50,
  "approver_name": "Dr. Principal",
  "approved_at": "2024-01-16T14:20:00Z",
  "comments": "Approved for lab setup project"
}
```

**GET /api/v1/budgets/summary**
```json
Request:
{
  "params": {
    "college_id": 1,
    "financial_year": "2024-25"
  }
}

Response: 200 OK
{
  "college_id": 1,
  "financial_year": "2024-25",
  "budgets": [
    {
      "category": "salaries",
      "allocated_amount": 8000000,
      "utilized_amount": 6500000,
      "remaining_amount": 1500000,
      "utilization_percentage": 81.25,
      "alert_level": "warning" // normal, warning, critical
    }
  ]
}
```

---

### 1.3 Super Accountant Portal Integration

**Purpose**: Multi-college financial consolidation, compliance reporting

#### API Endpoints

**GET /api/v1/expenses/export**
```json
Request:
{
  "params": {
    "college_id": 1,
    "from_date": "2024-01-01",
    "to_date": "2024-01-31",
    "status": "approved"
  }
}

Response: 200 OK
{
  "data": [
    {
      "expense_number": "EXP-2024-000123",
      "college_id": 1,
      "college_name": "ABC Engineering College",
      "category": "supplies",
      "amount": 5000,
      "expense_date": "2024-01-15",
      "vendor_name": "Office Mart",
      "gl_code": "5200",
      "status": "approved",
      "approved_by_name": "Dr. Principal",
      "approved_at": "2024-01-16T14:20:00Z"
    }
  ],
  "summary": {
    "total_expenses": 250000,
    "expense_count": 48
  }
}
```

**POST /api/v1/financial-reports/submit**
```json
Request:
{
  "college_id": 1,
  "report_type": "monthly_pl",
  "period": "2024-01",
  "data": {
    "revenue": 5000000,
    "expenses": {
      "salaries": 3000000,
      "utilities": 200000,
      "supplies": 150000,
      "maintenance": 100000
    },
    "net_income": 1550000
  },
  "generated_at": "2024-02-01T10:00:00Z",
  "generated_by": "John Accountant"
}

Response: 201 Created
{
  "submission_id": 789,
  "status": "received",
  "next_action": "review_by_super_accountant"
}
```

---

### 1.4 College Fee Admin Integration

**Purpose**: Fee collection data, student financial records, reconciliation

#### API Endpoints

**GET /api/v1/fee-collections**
```json
Request:
{
  "params": {
    "college_id": 1,
    "from_date": "2024-01-01",
    "to_date": "2024-01-31"
  }
}

Response: 200 OK
{
  "data": [
    {
      "receipt_number": "FEE-2024-001234",
      "student_id": 5678,
      "student_name": "Jane Student",
      "amount": 50000,
      "payment_mode": "upi",
      "payment_date": "2024-01-10",
      "fee_type": "tuition",
      "academic_year": "2023-24",
      "semester": 1
    }
  ],
  "summary": {
    "total_collected": 12500000,
    "transaction_count": 250
  }
}
```

**POST /api/v1/reconciliation/fees**
```json
Request:
{
  "college_id": 1,
  "period": "2024-01",
  "bank_account_id": 1,
  "fee_collections_total": 12500000,
  "bank_deposits_total": 12500000,
  "reconciliation_status": "matched",
  "discrepancies": []
}

Response: 201 Created
{
  "reconciliation_id": 234,
  "status": "completed",
  "verified_at": "2024-02-01T10:00:00Z"
}
```

---

### 1.5 BitFlow Admin Integration

**Purpose**: System configuration, GL code management, category settings

#### API Endpoints

**GET /api/v1/config/gl-codes**
```json
Response: 200 OK
{
  "data": [
    {
      "id": 1,
      "code": "5100",
      "name": "Salaries & Wages",
      "category": "salaries",
      "is_active": true
    },
    {
      "id": 2,
      "code": "5200",
      "name": "Office Supplies",
      "category": "supplies",
      "is_active": true
    }
  ]
}
```

**GET /api/v1/config/expense-categories**
```json
Response: 200 OK
{
  "categories": [
    {
      "value": "salaries",
      "label": "Salaries & Wages",
      "requires_approval": true,
      "receipt_threshold": 0
    },
    {
      "value": "supplies",
      "label": "Office Supplies",
      "requires_approval": false,
      "receipt_threshold": 5000
    }
  ]
}
```

---

## 2. External Service Integrations

### 2.1 Payment Gateway Integration

**Service**: Razorpay / PayU / HDFC Payment Gateway  
**Purpose**: NEFT/RTGS processing, payment status tracking

#### API Endpoints

**POST /api/v2/payments/neft/initiate**
```json
Request:
{
  "headers": {
    "Authorization": "Bearer {api_key}",
    "X-Request-ID": "req_123456789"
  },
  "body": {
    "amount": 500000, // In paisa (₹5000)
    "currency": "INR",
    "beneficiary": {
      "name": "Tech Supplies Ltd",
      "account_number": "1234567890",
      "ifsc": "HDFC0001234",
      "bank_name": "HDFC Bank"
    },
    "remitter": {
      "account_number": "9876543210",
      "ifsc": "ICIC0005678"
    },
    "purpose": "Payment for Invoice INV-2024-001",
    "reference_number": "PAY-2024-000123"
  }
}

Response: 202 Accepted
{
  "payment_id": "pay_xyz123",
  "status": "processing",
  "estimated_completion": "2024-01-15T16:00:00Z", // NEFT: 2-4 hours
  "transaction_id": null // Available after completion
}
```

**GET /api/v2/payments/{payment_id}/status**
```json
Response: 200 OK
{
  "payment_id": "pay_xyz123",
  "status": "completed",
  "transaction_id": "TXN987654321",
  "utr_number": "HDFC2024011598765",
  "completed_at": "2024-01-15T15:45:00Z",
  "amount": 500000,
  "charges": 500 // Gateway charges
}
```

**Webhook** (Payment Gateway → Our System):
```json
POST /api/v1/webhooks/payment-status
{
  "headers": {
    "X-Signature": "sha256_hmac_signature"
  },
  "body": {
    "event": "payment.completed",
    "payment_id": "pay_xyz123",
    "reference_number": "PAY-2024-000123",
    "status": "completed",
    "transaction_id": "TXN987654321",
    "utr_number": "HDFC2024011598765",
    "completed_at": "2024-01-15T15:45:00Z"
  }
}
```

**Error Codes**:
- `insufficient_funds`: Remitter account balance low
- `invalid_account`: Beneficiary account invalid
- `daily_limit_exceeded`: Transaction limit reached
- `bank_offline`: Beneficiary bank unavailable

**Retry Logic**:
- Automatic retry after 30 minutes for `bank_offline`
- Manual retry for `insufficient_funds`
- No retry for `invalid_account`

---

### 2.2 Bank Integration

**Service**: Bank statement download, reconciliation, balance inquiry  
**Purpose**: Automated bank reconciliation, balance monitoring

#### API Endpoints

**GET /api/v1/bank/statements**
```json
Request:
{
  "account_number": "9876543210",
  "from_date": "2024-01-01",
  "to_date": "2024-01-31"
}

Response: 200 OK
{
  "account_number": "9876543210",
  "bank_name": "ICICI Bank",
  "statement_period": {
    "from": "2024-01-01",
    "to": "2024-01-31"
  },
  "opening_balance": 10000000,
  "closing_balance": 9500000,
  "transactions": [
    {
      "date": "2024-01-15",
      "description": "NEFT-Tech Supplies Ltd",
      "ref_number": "HDFC2024011598765",
      "debit": 500000,
      "credit": 0,
      "balance": 9500000
    }
  ]
}
```

**GET /api/v1/bank/balance**
```json
Request:
{
  "account_number": "9876543210"
}

Response: 200 OK
{
  "account_number": "9876543210",
  "available_balance": 9500000,
  "as_of": "2024-01-15T16:00:00Z"
}
```

**Sync Schedule**: Every 6 hours (4 AM, 10 AM, 4 PM, 10 PM)

---

### 2.3 GST Portal Integration

**Service**: GST return filing, GSTIN validation, tax calculation  
**Purpose**: GST compliance, vendor verification

#### API Endpoints

**POST /api/v1/gst/validate**
```json
Request:
{
  "gstin": "29ABCDE1234F1Z5"
}

Response: 200 OK
{
  "gstin": "29ABCDE1234F1Z5",
  "legal_name": "Tech Supplies Ltd",
  "trade_name": "Tech Supplies",
  "status": "active",
  "registration_date": "2020-01-01",
  "address": "123 Business Park, Bangalore",
  "business_type": "Private Limited Company"
}

Error Response: 400 Bad Request
{
  "error": "invalid_gstin",
  "message": "GSTIN format invalid or not registered"
}
```

**POST /api/v1/gst/calculate**
```json
Request:
{
  "amount": 10000, // Taxable amount
  "gst_rate": 18,  // GST rate percentage
  "include_tax": false // Whether amount includes GST
}

Response: 200 OK
{
  "taxable_amount": 10000,
  "cgst": 900,
  "sgst": 900,
  "igst": 0,
  "total_gst": 1800,
  "total_amount": 11800
}
```

**Sync Schedule**: Monthly for return filing preparation

---

### 2.4 TDS System Integration

**Service**: TDS calculation, Form 16 generation, quarterly filing  
**Purpose**: TDS compliance for vendor payments

#### API Endpoints

**POST /api/v1/tds/calculate**
```json
Request:
{
  "vendor_pan": "ABCDE1234F",
  "payment_amount": 100000,
  "payment_nature": "professional_services", // Section 194J
  "financial_year": "2024-25",
  "quarter": 1
}

Response: 200 OK
{
  "tds_rate": 10,
  "tds_amount": 10000,
  "net_payment": 90000,
  "section": "194J",
  "surcharge": 0,
  "cess": 400, // 4% on TDS
  "total_tds": 10400
}
```

**POST /api/v1/tds/form16/generate**
```json
Request:
{
  "vendor_id": 123,
  "financial_year": "2024-25",
  "quarter": 1
}

Response: 200 OK
{
  "form16_url": "https://storage.../form16_Q1_FY2425_VEN00123.pdf",
  "generated_at": "2024-07-05T10:00:00Z",
  "total_tds": 50000
}
```

**Sync Schedule**: Quarterly before filing deadline

---

### 2.5 Accounting Software Integration

**Service**: Tally / QuickBooks / Zoho Books  
**Purpose**: GL posting, financial data export, two-way sync

#### API Endpoints

**POST /api/v1/tally/vouchers**
```json
Request:
{
  "voucher_type": "payment",
  "voucher_number": "PAY-2024-000123",
  "date": "2024-01-15",
  "ledger_entries": [
    {
      "ledger": "Tech Supplies Ltd",
      "amount": -50000, // Credit
      "narration": "Payment for Invoice INV-2024-001"
    },
    {
      "ledger": "ICICI Bank",
      "amount": 50000, // Debit
      "narration": "NEFT payment"
    }
  ]
}

Response: 201 Created
{
  "voucher_id": "TLY-VCH-12345",
  "status": "posted",
  "posted_at": "2024-01-15T16:00:00Z"
}
```

**GET /api/v1/tally/ledgers**
```json
Response: 200 OK
{
  "ledgers": [
    {
      "name": "Tech Supplies Ltd",
      "type": "creditor",
      "opening_balance": 0,
      "current_balance": -50000
    }
  ]
}
```

**Sync Strategy**:
- **Real-time**: Payment transactions
- **Hourly**: Expense approvals
- **Daily**: Budget utilization updates
- **Monthly**: Financial reports

---

## 3. Webhook Specifications

### 3.1 Webhook Registration

**POST /api/v1/webhooks/register**
```json
Request:
{
  "url": "https://client-system.com/webhooks/expense-updates",
  "events": ["expense.approved", "payment.completed"],
  "secret": "webhook_secret_key_abc123"
}

Response: 201 Created
{
  "webhook_id": "wh_123456",
  "status": "active"
}
```

### 3.2 Webhook Payload Format

**Common Structure**:
```json
{
  "event": "expense.approved",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "expense_id": 12345,
    "expense_number": "EXP-2024-000123",
    "amount": 5000,
    "status": "approved",
    "approved_by": 50,
    "approved_at": "2024-01-15T10:30:00Z"
  },
  "signature": "sha256_hmac_signature"
}
```

### 3.3 Signature Verification

**HMAC SHA256**:
```python
import hmac
import hashlib

def verify_signature(payload, signature, secret):
    expected_signature = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)
```

### 3.4 Retry Policy

**Exponential Backoff**:
- Attempt 1: Immediate
- Attempt 2: 1 minute later
- Attempt 3: 5 minutes later
- Attempt 4: 15 minutes later
- Attempt 5: 1 hour later
- After 5 failures: Alert admin and move to dead letter queue

**Success Criteria**: HTTP 200-299 status code

---

## 4. Data Synchronization

### 4.1 Sync Specifications

#### Expense Sync to Super Accountant
```json
{
  "entity": "expense",
  "direction": "college_accounts → super_accountant",
  "frequency": "daily",
  "schedule": "2:00 AM",
  "batch_size": 1000,
  "payload": {
    "expenses": [
      {
        "expense_number": "EXP-2024-000123",
        "college_id": 1,
        "amount": 5000,
        "category": "supplies",
        "status": "approved",
        "expense_date": "2024-01-15"
      }
    ]
  }
}
```

#### Budget Utilization Sync
```json
{
  "entity": "budget_utilization",
  "direction": "college_accounts → principal",
  "frequency": "real-time",
  "trigger": "on_expense_approval",
  "payload": {
    "college_id": 1,
    "category": "supplies",
    "utilized_amount": 250000,
    "allocated_amount": 500000,
    "utilization_percentage": 50
  }
}
```

---

## 5. Error Handling

### 5.1 HTTP Status Codes

- **200 OK**: Success
- **201 Created**: Resource created
- **202 Accepted**: Async processing started
- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Missing/invalid auth
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **409 Conflict**: Duplicate/conflict
- **422 Unprocessable Entity**: Validation error
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error
- **503 Service Unavailable**: Service down

### 5.2 Error Response Format

```json
{
  "error": {
    "code": "insufficient_budget",
    "message": "Available budget (₹50,000) is less than expense amount (₹75,000)",
    "details": {
      "category": "supplies",
      "available": 50000,
      "required": 75000
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "request_id": "req_123456789"
  }
}
```

### 5.3 Timeout Handling

- **Connection Timeout**: 10 seconds
- **Read Timeout**: 30 seconds (45s for payment operations)
- **Retry Strategy**: 3 attempts with exponential backoff

### 5.4 Circuit Breaker

**Configuration**:
- **Failure Threshold**: 5 consecutive failures
- **Open Duration**: 60 seconds
- **Half-Open Test**: 1 request
- **Success Threshold**: 2 consecutive successes to close

---

*This comprehensive integration specification ensures seamless data flow between College Accounts Admin portal and all connected systems.*
