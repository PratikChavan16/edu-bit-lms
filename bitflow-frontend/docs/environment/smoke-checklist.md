# Frontend Smoke Test Checklist

Run after each deployment to sandbox:

- [ ] Admin login page renders and authenticates with test credentials.
- [ ] University Super Admin dashboard cards display mock metrics.
- [ ] College management table loads and filters.
- [ ] Feature toggle modal opens and submits mock request (API call stubbed).
- [ ] Student dashboard renders notices, upcoming lectures, and quick links.
- [ ] Document upload modal opens and validates file types (mock backend).
- [ ] Chat sidebar loads channels and sends dummy message to mock service.
- [ ] Page navigation preserves state when switching routes.
