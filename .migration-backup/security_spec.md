# Security Specification for IMP (Integrated Medical Platform)

## 1. Data Invariants
- A patient record must have a unique file number.
- An appointment must be linked to a valid patient.
- A medical record can only be created by an authenticated doctor.
- Invoices must reflect real transactions.
- Critical health data (MedicalRecord) is restricted to the patient and their doctor.

## 2. The "Dirty Dozen" Payloads
1. Create patient with missing `name`.
2. Update `patient` with a 2MB name string.
3. Spoof `patientId` in a `MedicalRecord`.
4. Change `amount` of a `paid` invoice.
5. Create appointment for a non-existent patient.
6. Read another patient's `MedicalRecord` as a random user.
7. Inject script tag into `diagnosis` field.
8. Delete a `Patient` without admin privileges.
9. Bypass `expiryDate` format in `Drug` entity.
10. Update `createdAt` timestamp.
11. Set `price` of a drug to a negative value.
12. Bulk download `patients` collection without filter.

## 3. Test Runner (Draft)
- Verify `PERMISSION_DENIED` for unauthorized PII access.
- Verify schema validation for `vitals`.
- Verify terminal state lock for `paid` invoices.
