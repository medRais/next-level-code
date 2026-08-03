---
# ─────────────────────────────────────────────────────────────────────────────
# PLACEHOLDER PRODUCT — replace with the real API when the catalogue is fixed.
# The commercial framing, the endpoint names and the sample payload are
# illustrative. Everything a buyer would rely on (pricing, SLAs, certification
# claims) is deliberately left unstated or marked "on request".
# Swapping a product means editing this file; no code changes.
# ─────────────────────────────────────────────────────────────────────────────
name: Document Intelligence API
tagline: Turn the documents your business already receives into structured data your systems can act on.
icon: lucide:file-scan
order: 1
seo:
  title: Document Intelligence API
  description: Extract structured, validated data from invoices, contracts and onboarding documents through a single API call, with confidence scores on every field.
problem: >-
  Documents arrive as PDFs, scans and photographs, and the information inside
  them has to end up in a system that expects rows and fields. The gap is
  usually closed by people retyping — slow, expensive, and the point at which
  errors enter the process without anyone noticing.
useCases:
  - title: Supplier invoice processing
    body: >-
      Read supplier, reference, line items, totals and tax from an invoice in
      any layout, and hand them to your accounting or ERP system already
      validated against your own rules.
  - title: Contract and document review
    body: >-
      Pull dates, parties, obligations and renewal terms out of agreements so
      they can be tracked as data rather than remembered by whoever signed them.
  - title: Customer onboarding
    body: >-
      Turn the paperwork a new client sends in into a completed record, so the
      first interaction is a decision rather than a data-entry queue.
benefits:
  - Removes manual re-keying from the process, along with the errors it introduces.
  - Every extracted field carries a confidence score, so low-certainty cases can be routed to a human instead of silently passing through.
  - Handles layouts it has not seen before, so a new supplier does not mean a new configuration.
  - Integrates behind your existing workflow — no change to how documents reach you.
snippetLanguage: bash
assurances:
  - Documents are processed in transit and not retained after the response is returned, unless retention is explicitly enabled for your account.
  - Processing region can be pinned, so data does not leave a jurisdiction you have committed to.
  - Authentication by scoped API key, with per-key rate limits and full request audit logs.
  - Availability and support commitments agreed per contract.
---

```bash
curl https://api.nextlevelcode.tech/v1/documents/extract \
  -H "Authorization: Bearer $NLC_API_KEY" \
  -F "file=@invoice.pdf" \
  -F "schema=invoice"
```

```json
{
  "document_type": "invoice",
  "fields": {
    "supplier":   { "value": "Maileva",      "confidence": 0.99 },
    "invoice_no": { "value": "F-2026-00412", "confidence": 0.98 },
    "issued_on":  { "value": "2026-07-14",   "confidence": 0.97 },
    "total":      { "value": 1840.00,        "confidence": 0.99 }
  },
  "review_required": false
}
```
