# API Contract Drafts

This document captures early OpenAPI-style specifications for Sprint Zero endpoints. The full OpenAPI document will be generated once the Laravel skeleton is in place.

## GET /api/tenants/me

Retrieves the resolved university and college context for the authenticated session.

```
Response 200
{
  "university": {
    "id": "uuid",
    "name": "Maratha Vidya Prasarak Samaj",
    "slug": "mvp",
    "branding": {
      "primaryColor": "#1A56DB",
      "logoUrl": "https://cdn.bitflow.dev/mvp/logo.svg"
    }
  },
  "college": {
    "id": "uuid",
    "name": "MVP Engineering College",
    "slug": "mvp-engg",
    "timeZone": "Asia/Kolkata"
  },
  "roles": ["univ_superadmin", "super_accountant"]
}
```

## POST /api/features/change-request

Creates a feature toggle change request.

```
Request
{
  "featureCode": "HRMS_PAYROLL",
  "target": {
    "scope": "university",   // or "college"
    "id": "uuid-of-target"
  },
  "desiredState": true,
  "parameters": {
    "storageQuotaGb": 500
  },
  "notes": "Enable payroll for the finance pilot."
}
```

```
Response 201
{
  "id": "uuid",
  "status": "pending",
  "submittedAt": "2025-10-07T09:30:00Z"
}
```

Validation errors return 422 with standard Laravel error format.

## GET /api/feature-config/current

Provides frontend applications with the effective feature flags for the authenticated user context.

```
Response 200
{
  "features": {
    "HRMS": true,
    "HRMS_PAYROLL": false,
    "LIBRARY_VIDEO_STREAMING": true,
    "STUDENT_STORAGE_QUOTA_MB": 300
  },
  "generatedAt": "2025-10-07T09:30:00Z"
}
```

This endpoint is heavily cached and invalidated when approvals are applied.
