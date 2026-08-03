---
title: 'RAG in production: what actually breaks'
description: A retrieval system that demos well and a retrieval system that survives real users are different systems. These are the failures that show up after launch, and what to instrument before they do.
pubDate: 2026-06-18
tags:
  - AI
  - RAG
  - Production
seo:
  title: 'RAG in production: what actually breaks'
  description: The failures that appear after a retrieval system launches — retrieval quality, chunking, staleness, permissions, cost — and what to instrument first.
---

Retrieval-augmented generation demos beautifully. You point it at a folder of
documents, ask three questions you already know the answers to, and it
answers them. The gap between that and a system people rely on is not the
model. It is everything around the model.

Here is what tends to break, roughly in the order it breaks.

## Retrieval is the bottleneck, and it fails quietly

If the right passage is not in the context window, no model will save you. It
will produce a fluent answer from whatever it did retrieve, and that answer
will look exactly as confident as a correct one.

This is the single most important thing to understand about the architecture:
**generation failures are loud, retrieval failures are silent**. A model that
cannot answer says something visibly odd. A model handed the wrong three
paragraphs says something plausible and wrong.

So measure retrieval separately from generation. Build a set of questions with
known source passages, and track whether those passages are retrieved at all —
recall@k — independently of what the model then does with them. When quality
drops after a content change, this tells you immediately whether the problem
is retrieval or generation. Without it you are guessing.

## Chunking decides more than the embedding model

Teams spend weeks comparing embedding models and minutes deciding how to split
documents. The split usually matters more.

Fixed-size chunks cut sentences in half and separate a heading from the rule
it introduces. A clause that says "the retention period above applies only to
paper records" is worse than useless without the paragraph above it. Chunk on
document structure where the documents have any — headings, sections, list
boundaries — and carry the heading path into the chunk text so that the
passage still describes itself when it is retrieved alone.

Two things worth doing early:

- **Overlap adjacent chunks.** A little redundancy costs storage, which is
  cheap, and prevents the boundary problem, which is not.
- **Store the parent.** Retrieve on small precise chunks, then pass the
  surrounding section to the model. You get retrieval precision and
  generation context without choosing between them.

## Nobody plans for staleness

Documents change. Policies are superseded. A page is deleted and the answer it
supported keeps being given for another six weeks, because the embedding is
still sitting in the index.

Decide at design time how the index learns that its source has changed —
webhook, scheduled reconciliation, change feed — and, more importantly, how a
passage is *removed*. Deletion is the case people forget, and it is the one
with real consequences: a system confidently quoting a rescinded policy is
worse than a system that cannot answer at all.

## Permissions are a retrieval concern, not a generation one

This is the failure that turns into an incident.

If your corpus contains documents that not everyone may read, filtering the
answer after generation is not a control — the content has already been read
by the model and mixed into the response. Access control has to happen at
retrieval, as a filter on the candidate set, using the same permissions your
document system enforces.

Anything else means a user can extract text they are not entitled to by
phrasing a question well enough. Treat it as the design constraint it is, from
the first sprint.

## Cost lands somewhere other than you expect

The API bill for generation is usually the smaller number and the one everyone
watches. The larger and less visible costs are re-embedding a large corpus
every time you reconsider your chunking, and long contexts on high-traffic
endpoints.

Two habits that pay for themselves:

- **Cache aggressively at the question level.** Real usage is far more
  repetitive than you expect; a large share of questions in a support setting
  are near-duplicates.
- **Retrieve fewer, better passages.** Stuffing twenty chunks into context to
  improve the odds is expensive and frequently *worse* — relevant material
  gets buried among the marginal, and the model has no way to tell which is
  which.

## What to instrument before launch

If you build only one thing beyond the happy path, build the ability to
answer: *why did it say that?*

For every response, record the question, the retrieved passage identifiers and
their scores, the prompt actually sent, and the response. When someone reports
a bad answer — and they will, and it will be your most valuable signal — you
need to reconstruct the exact retrieval that produced it. Without that record
you are left rerunning the question against a corpus that has since changed
and hoping it reproduces.

That log is also what makes a "not answerable from this corpus" response
possible to trust. A system that knows when it does not know is worth
considerably more than one that is right slightly more often, because it is
the only version people can safely act on.

## The short version

The model is the part of a RAG system least likely to be your problem.
Retrieval quality, chunk design, staleness, permissions and observability are
where production systems actually fail — and every one of them is ordinary
engineering, not machine learning. That is good news: it means the work is
tractable, and it means the discipline that makes the rest of your estate
reliable applies here too.
