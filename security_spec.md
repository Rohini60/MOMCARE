# Security Specification & Threat Model

## 1. Data Invariants

1. **User Identity Invariant**: A user document in `/users/{userId}` can only be created, read, or modified by the authenticated user whose `request.auth.uid == userId`.
2. **Resource Ownership Invariant**: Every record in `/care_tasks/{taskId}`, `/appointments/{appointmentId}`, `/health_records/{recordId}`, and `/medical_reports/{reportId}` must contain a `userId` field that strictly matches `request.auth.uid`.
3. **Identity Spoofing Prevention**: On document creation and update, `incoming().userId` must equal `request.auth.uid`. A user cannot forge data for another patient.
4. **List Query Integrity**: All `list` operations enforce `resource.data.userId == request.auth.uid` to prevent unauthorized query scraping.
5. **No Blanket Access**: Unauthenticated requests are rejected outright across all collections (`request.auth != null`).
6. **Path Traversal & ID Poisoning Guard**: Document path variables must conform to `isValidId()` (`size() <= 128` and matching alphanumeric/hyphen/underscore).
7. **Volumetric & Type Boundaries**: String lengths, numerics, and enums are strictly constrained to prevent buffer exhaustion and Denial of Wallet attacks.
8. **Default Deny Catch-All**: Any unspecified path is rejected by `match /{document=**} { allow read, write: if false; }`.

## 2. The "Dirty Dozen" Payloads (Exploit Scenarios)

1. **Payload 1 (Identity Spoofing on Create)**:
   Attempting to create a user profile under `/users/victim_uid` with `request.auth.uid == 'attacker_uid'`.
   Expected Result: `PERMISSION_DENIED`.

2. **Payload 2 (Ghost Field Attack / Shadow Field)**:
   Attempting to write `{ "email": "a@b.com", "name": "Eve", "age": 28, "isAdmin": true, ... }` with unauthorized admin privilege escalation.
   Expected Result: `PERMISSION_DENIED`.

3. **Payload 3 (Foreign User Care Task Write)**:
   Attempting to insert a care task with `userId: "another_mother"` while signed in as `mother_1`.
   Expected Result: `PERMISSION_DENIED`.

4. **Payload 4 (Oversized ID String Poisoning)**:
   Targeting document ID with 2KB string: `/care_tasks/` + `'a'.repeat(2000)`.
   Expected Result: `PERMISSION_DENIED`.

5. **Payload 5 (Unauthenticated Profile Read)**:
   Unauthenticated caller attempting `getDoc(doc(db, 'users', 'victim_uid'))`.
   Expected Result: `PERMISSION_DENIED`.

6. **Payload 6 (Cross-Tenant List Scraping)**:
   Querying `care_tasks` collection without `where('userId', '==', auth.currentUser.uid)` or with a different user's ID.
   Expected Result: `PERMISSION_DENIED`.

7. **Payload 7 (Invalid Enum Value Injection)**:
   Writing an appointment status with `"status": "hacked"` instead of `["scheduled", "completed", "cancelled"]`.
   Expected Result: `PERMISSION_DENIED`.

8. **Payload 8 (Medical Report Massive String Flood)**:
   Injecting a 5MB summary string into `/medical_reports/rep1` exceeding `maxLength: 8000`.
   Expected Result: `PERMISSION_DENIED`.

9. **Payload 9 (Cross-User Appointment Deletion)**:
   User B attempting to `deleteDoc(doc(db, 'appointments', 'appointment_of_user_A'))`.
   Expected Result: `PERMISSION_DENIED`.

10. **Payload 10 (Negative Age or Absurd Gestational Week)**:
    Creating user profile with `"current_week": -5` or `"age": 1000`.
    Expected Result: `PERMISSION_DENIED`.

11. **Payload 11 (Unauthenticated Medical Report Retrieval)**:
    Anonymous or public reader attempting to fetch `/medical_reports/rec1`.
    Expected Result: `PERMISSION_DENIED`.

12. **Payload 12 (Direct Root Write Attack)**:
    Attempting write to root document `/system_config/keys` or any unlisted collection.
    Expected Result: `PERMISSION_DENIED`.

## 3. Test Runner Outline (firestore.rules.test.ts)

All tests verify that security rules mathematically prevent all dirty dozen payloads and enforce the ABAC zero-trust boundary.
