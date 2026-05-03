# Firestore Security Specification

## 1. Data Invariants
- Each entity must match its blueprint schema.
- ID path variables must be valid (max 128 chars, alphanumeric).
- String fields must have size constraints (usually <= 500 characters, names <= 128).
- Transactions and Drugs must have non-negative numerical values where applicable.
- `createdAt` and `updatedAt` field must be strictly validated against `request.time`.
- Only authenticated users can perform data operations.

## 2. The Dirty Dozen Payloads

1. **Identity Theft**: Create a patient while spoofing `request.auth.uid` in a field (if we had ownerId, but here it's clinical data).
2. **Resource Exhaustion**: Create a patient with a 1MB string for `name`.
3. **Invalid Status Transition**: Update a cancelled appointment to 'confirmed'.
4. **ID Poisoning**: Create a document using a 2KB junk string as the ID.
5. **Schema Violation**: Create a drug without required `scientificName`.
6. **Immutable field breach**: Attempting to update `createdAt` on a patient record.
7. **Negative Stock**: Updating a drug's stock to `-500`.
8. **Orphaned Writes**: Creating an appointment for a non-existent patient ID (relational check).
9. **Unauthorized List**: Attempting to query `transactions` collection without being signed in.
10. **Terminal State Leap**: Modifying a queue item that is already 'completed'.
11. **Type Mismatch**: Sending a string for a field that should be a number (e.g., transaction amount).
12. **Shadow Field injection**: Adding `isAdmin: true` to a user profile update.

## 3. Test Runner (Draft)

```typescript
// firestore.rules.test.ts (logic representation)
// Note: Actual implementation would use @firebase/rules-unit-testing
```
