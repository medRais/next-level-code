---
# PLACEHOLDER PRODUCT — see the note in document-intelligence.md.
name: Document Verification API
tagline: Establish that a submitted document is genuine, current and consistent before it enters your process.
icon: lucide:shield-check
order: 3
seo:
  title: Document Verification API
  description: Check that identity and company documents are genuine, unexpired and internally consistent before they enter your onboarding or claims process.
problem: >-
  Onboarding, claims and supplier registration all depend on documents supplied
  by the party being checked. Verifying them by eye is slow and inconsistent,
  and the failure is asymmetric: a rejected genuine document costs a customer,
  while an accepted forged one costs considerably more.
useCases:
  - title: Customer onboarding
    body: >-
      Confirm that an identity document is genuine, unexpired and consistent
      with the details supplied, before an account is opened.
  - title: Supplier and partner registration
    body: >-
      Check company registration and banking documents at the point of
      submission, rather than discovering a discrepancy at the first payment.
  - title: Claims and applications
    body: >-
      Validate supporting documents automatically so assessors spend their time
      on the cases that genuinely need judgement.
benefits:
  - Returns a clear verdict with the specific reasons behind it, not an opaque score.
  - Flags tampering, expiry and internal inconsistency as separate findings, so your policy decides what each one means.
  - Borderline cases are routed for human review rather than forced into a pass or fail.
  - Every check produces an evidence record you can show to an auditor or a regulator.
snippetLanguage: bash
assurances:
  - Submitted documents are processed for the check and not retained by default; retention is opt-in and time-bounded.
  - Processing region can be pinned to a jurisdiction you have committed to.
  - Each verification produces an immutable evidence record with a timestamp and the findings that supported the verdict.
  - Availability, throughput and support commitments agreed per contract.
---

```bash
curl https://api.nextlevelcode.tech/v1/documents/verify \
  -H "Authorization: Bearer $NLC_API_KEY" \
  -F "file=@id-document.jpg" \
  -F "expected_holder=Jane Doe"
```

```json
{
  "verdict": "review",
  "findings": [
    { "check": "document_integrity", "result": "pass" },
    { "check": "expiry",             "result": "pass",   "expires_on": "2031-03-02" },
    { "check": "holder_match",       "result": "unclear", "reason": "accented characters differ" }
  ],
  "evidence_id": "ev_01JQ7F3M2K"
}
```
