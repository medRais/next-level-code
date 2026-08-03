---
# PLACEHOLDER PRODUCT — see the note in document-intelligence.md.
name: Knowledge Answers API
tagline: Answers drawn from your own documentation, with a citation for every claim.
icon: lucide:message-square-quote
order: 2
seo:
  title: Knowledge Answers API
  description: Retrieval-augmented answers grounded in your own documentation, with citations on every claim and a clear signal when the corpus cannot answer.
problem: >-
  Organisations hold the answers their staff and customers need, spread across
  documentation, policies and past cases. A general-purpose assistant does not
  know any of it, and will produce a confident answer anyway. What is needed is
  not a model that knows more, but one that can only speak from your material —
  and says so when your material is silent.
useCases:
  - title: Internal support
    body: >-
      Give staff a single place to ask procedural questions and get the answer
      with a link to the policy it came from, instead of asking a colleague who
      may be remembering an outdated version.
  - title: Customer-facing assistance
    body: >-
      Answer product and service questions from your published documentation,
      with citations that let the customer verify the answer themselves.
  - title: Case and claim preparation
    body: >-
      Surface the relevant precedent, clause or prior case from a large archive
      in seconds, so the expert starts from the material rather than the search.
benefits:
  - Every answer cites the passages it was built from, so it can be checked rather than trusted.
  - Returns an explicit "not answerable from this corpus" rather than inventing a plausible response.
  - Your documents stay your documents — they are indexed for retrieval, not used to train a model.
  - Access controls carry through to answers, so a user is never shown a passage they could not open directly.
snippetLanguage: bash
assurances:
  - Corpora are isolated per account; no content is shared between customers or used for training.
  - Document-level permissions are enforced at retrieval, not filtered after generation.
  - Processing region can be pinned to a jurisdiction you have committed to.
  - Full audit trail of questions, retrieved passages and returned answers.
---

```bash
curl https://api.nextlevelcode.tech/v1/answers \
  -H "Authorization: Bearer $NLC_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "corpus":   "internal-policies",
        "question": "How long do we retain supplier invoices?"
      }'
```

```json
{
  "answer": "Supplier invoices are retained for ten years from the end of the financial year in which they were issued.",
  "citations": [
    { "document": "records-retention-policy.pdf", "page": 12, "score": 0.94 },
    { "document": "finance-handbook.pdf",         "page": 47, "score": 0.88 }
  ],
  "answerable": true
}
```
