# ReVogue Labs — Security Specification & Threat Model

## 1. Data Invariants
1. **Strict Identity Ownership**: A `UserProfile` document at `/users/{userId}` can only be read by its authenticated owner (`request.auth.uid == userId`) or a verified admin. Users can never self-assign elevated roles (`role` is strictly `'student'`) or modify their own `dropCredits`.
2. **Verified Write Gate**: All standard database creates and updates require a verified email token (`request.auth.token.email_verified == true`), preventing unverified spoofed writes.
3. **Immutable Ownership & Timestamps**: `uid`, `userId`, `id`, and `createdAt` are immutable after document creation. Timestamps must equal `request.time`.
4. **No Orphaned or Poisoned IDs**: Every document ID path parameter is validated against `^[a-zA-Z0-9_\-]+$` and bounded to `<= 128` chars.
5. **Terminal State Locking**: Once a `PickupBooking` reaches `'paid'` or `'cancelled'`, or a `ThriftOrder` reaches `'delivered'` or `'cancelled'`, non-admin mutations are blocked.
6. **Zero Query Scraping**: Every `allow list` rule evaluates `resource.data.userId == request.auth.uid` (or verified admin email token without `get()`/`exists()` calls).

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Role Self-Escalation**: Creating `/users/{uid}` with `role: "admin"` -> **REJECTED** (`role == 'student'` enforced).
2. **Credit Minting**: Updating `/users/{uid}` to set `dropCredits: 99999` -> **REJECTED** (`affectedKeys().hasOnly(['displayName', 'campusId', 'updatedAt'])`).
3. **Shadow Field Injection**: Creating `/users/{uid}` with extra field `isVerified: true` -> **REJECTED** (`keys().hasOnly(...)`).
4. **Cross-User PII Read**: Authenticated student reading `/users/{otherUid}` -> **REJECTED** (`isOwner(userId) || isAdmin()`).
5. **Unverified Admin Spoof**: Token with `email: "chotusharma4477@gmail.com"` and `email_verified: false` -> **REJECTED** (`email_verified == true` required).
6. **ID Poisoning**: Creating `/orders/` with 500-char ID or invalid characters (`../admin`) -> **REJECTED** (`isValidId()`).
7. **Booking Owner Spoofing**: Creating `/pickupBookings/{id}` with `userId: "victimUid"` -> **REJECTED** (`incoming().userId == request.auth.uid`).
8. **Status Shortcutting**: Creating `/pickupBookings/{id}` with `status: "paid"` -> **REJECTED** (`incoming().status == 'scheduled'`).
9. **Client Timestamp Forgery**: Creating `/orders/{id}` with backdated `createdAt` -> **REJECTED** (`incoming().createdAt == request.time`).
10. **Terminal State Re-opening**: Student updating a `'delivered'` order to `'cancelled'` -> **REJECTED** (`existing().status != 'delivered'`).
11. **Unbounded Array Attack**: Creating `/orders/{id}` with 500 `itemTitles` -> **REJECTED** (`itemTitles.size() >= 1 && itemTitles.size() <= 20`).
12. **Blanket Collection Scrape**: Student calling `getDocs(collection(db, 'orders'))` without `where('userId', '==', uid)` -> **REJECTED** (`resource.data.userId == request.auth.uid`).
