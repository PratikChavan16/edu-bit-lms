# University Owner Portal - Integration Contracts

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## 1. Events & Webhooks

### 1.1 Outgoing Events

#### College Created
```php
class CollegeCreated {
    public function webhookPayload(): array {
        return [
            'event' => 'college.created',
            'university_id' => $this->college->university_id,
            'data' => ['id' => $this->college->id, 'name' => $this->college->name],
        ];
    }
}
```

**Listeners**: NotifyBitflowAdmin, CreateCollegeWorkspaces, SendPrincipalInvitation

#### Faculty Hired, Student Transferred

---

### 1.2 Incoming Webhooks

#### From Bitflow Admin: University Suspended
```php
// POST /webhooks/bitflow-admin/university-suspended
public function handleUniversitySuspended(Request $request) {
    $university->update(['status' => 'suspended']);
    // Notify owners
}
```

#### From Principal Portal: College Update Request

---

## 2. Inter-Portal Communication

### Downstream (Owner → Principal, Faculty, Student)
- Notify Principal of Assignment
- Push Fee Structure to Colleges

### Upstream (Owner → Bitflow Admin)
- Report Critical Issue

---

## 3. External APIs

- **Email**: SendGrid/SES
- **SMS**: Twilio
- **Storage**: AWS S3

---

## 4. Real-time (WebSockets)

Laravel Reverb for admission status updates, live notifications.

---

## 5. Security

- Webhook signature verification (HMAC SHA256)
- Rate limiting: 200 req/min authenticated, 10 req/min bulk operations

---

**Integration Contracts Complete!**
