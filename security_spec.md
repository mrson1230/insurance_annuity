# Security Specification: Fubon Hyundai MAX Annuity Landing & Lead DB

## 1. Data Invariants
1. **PII Isolation**: Customer consultation leads (`/leads/{leadId}`) contain personally identifiable information (name, birth year/age, phone number). Unauthenticated or non-admin users MUST NEVER be able to `get`, `list`, `update`, or `delete` any lead document.
2. **Public Lead Intake**: Visitors can submit a new lead (`create` on `/leads/{leadId}`) only when every required field is present, within strict type and length boundaries, free of shadow/extra fields, `status` is strictly `'상담대기'`, and `createdAt == request.time`.
3. **Immutable Audit & Status Integrity**: After creation, `createdAt`, `name`, `phone`, `age`, `product`, `budget`, `memo`, and `time` cannot be mutated. Only verified administrators may toggle `status` between `'상담대기'` and `'상담완료'` while stamping `updatedAt == request.time`.
4. **Verified Admin Gate**: Admin privileges require `request.auth != null && request.auth.token.email_verified == true` and either the bootstrapped admin email (`jeonggons53@gmail.com`) or a matching verified entry in `/admins/{request.auth.uid}`.

## 2. The "Dirty Dozen" Adversarial Payloads
All 12 payloads below MUST evaluate to `PERMISSION_DENIED`:

1. **Blanket List Scrape (Unauthenticated)**: `list` on `/leads` with `auth = null`.
2. **Blanket List Scrape (Non-Admin User)**: `list` on `/leads` as `user@example.com` (`email_verified: true`).
3. **Spoofed Unverified Admin**: `get` or `list` on `/leads` with `email: 'jeonggons53@gmail.com'` and `email_verified: false`.
4. **Shadow Field Injection on Create**: `create` on `/leads/lead1` including `{ ..., isAdmin: true }`.
5. **Pre-Completed Status Spoof on Create**: `create` on `/leads/lead1` with `status: '상담완료'`.
6. **Client Timestamp Spoofing on Create**: `create` on `/leads/lead1` with `createdAt` set to a past client timestamp instead of `request.time`.
7. **Resource Exhaustion / 1MB Phone Poisoning**: `create` on `/leads/lead1` with `phone` length > 20 chars or `memo` length > 300 chars.
8. **Invalid Document ID Poisoning**: `create` on `/leads/bad$id..` failing `^[a-zA-Z0-9_-]+$`.
9. **Non-Admin Status Tampering**: `update` on `/leads/lead1` by non-admin setting `{ status: '상담완료', updatedAt: request.time }`.
10. **Immutable Field Overwrite by Admin**: `update` on `/leads/lead1` modifying `phone` or `createdAt`.
11. **Self-Assigned Admin Escalation**: `create` on `/admins/{uid}` by non-bootstrapped user `{ email: 'attacker@example.com', role: 'admin', createdAt: request.time }`.
12. **Unauthorized Lead Deletion**: `delete` on `/leads/lead1` by non-admin authenticated user.
