---
title: 'Prompting, RAG or fine-tuning: choosing without guessing'
description: The three approaches solve different problems, and picking the wrong one is expensive in a way that is hard to reverse. A decision framework based on what each actually changes.
pubDate: 2026-05-07
tags:
  - AI
  - LLM
  - Architecture
seo:
  title: 'Prompting, RAG or fine-tuning: how to choose'
  description: What prompting, retrieval and fine-tuning each actually change, what they cost to maintain, and a decision order that avoids expensive mistakes.
---

The question arrives in almost every AI engagement: should we fine-tune a
model, build retrieval, or is this just prompting? It is usually asked as a
question about sophistication, as though the three were rungs on a ladder.
They are not. They change different things, and choosing by ambition rather
than by problem is how teams end up with an expensive asset that solves the
wrong half of their issue.

## What each one actually changes

Strip away the marketing and the distinction is simple.

**Prompting changes the instructions.** You are telling a model that already
has a capability how to apply it: the format, the tone, the constraints, the
worked examples. Nothing about the model changes.

**Retrieval changes the inputs.** You are giving the model facts it did not
have — your documents, your data, as of now. The model's behaviour is
unchanged; its evidence is not.

**Fine-tuning changes the model.** You are adjusting weights so the model
behaves differently by default: a consistent output structure, a domain
register, a task it performs poorly when merely instructed.

That gives a clean diagnostic. Ask what is actually wrong with the current
output:

- It does not know something → **retrieval**
- It knows but behaves wrongly → **prompting**, then fine-tuning if prompting
  cannot get there consistently
- It behaves correctly but too slowly or expensively at volume → **fine-tuning
  a smaller model**

Most production problems described as "the model needs to learn our business"
are retrieval problems. The model does not need to learn your business. It
needs to be shown the relevant page.

## Fine-tuning does not teach facts reliably

This is the most costly misconception, because it fails in the least
detectable way.

Fine-tuning on a corpus of company documents does not create a model that
knows those documents. It creates a model that has absorbed their *style* and
will produce text confidently resembling them, including for facts it has
blurred, conflated or invented. There is no citation, no provenance, and no
way to tell a remembered fact from a fabricated one.

Worse, the knowledge is frozen at training time. Every update means another
training run, and the old facts do not cleanly disappear.

If the requirement is "answers must reflect what our documents currently say",
that is retrieval, and it stays retrieval however much fine-tuning you add
around it.

## Where fine-tuning genuinely earns its place

It is not a last resort — it is a specific tool:

- **Consistent structured output**, where prompting gets you to 95% and the
  remaining 5% of malformed responses is operationally expensive.
- **A specialised task** the base model does poorly no matter how it is
  instructed — an unusual classification scheme, a domain notation.
- **Cost and latency at volume**, where a small fine-tuned model matches a
  large prompted one at a fraction of the price per call. At scale this
  argument alone can justify the whole exercise.
- **Register**, where the output must sound a particular way consistently and
  examples in the prompt are not holding it.

Notice that none of these are "so it knows our data".

## The costs nobody quotes

Every approach has a maintenance cost, and it is rarely in the estimate.

Prompting is cheap to change and easy to let sprawl: without a regression set,
prompt edits that fix one case quietly break three others. That is a testing
problem, and it is entirely solvable — but only if someone decides to solve it.

Retrieval carries the operational burden of an index: ingestion, freshness,
deletion, permissions, evaluation. It is real infrastructure and should be
staffed as such.

Fine-tuning carries the heaviest tail. A tuned model is a versioned artefact
with a dataset behind it. When the base model is deprecated — and it will be —
you repeat the exercise. Budget for the second training run, not just the
first.

## A sensible order

In practice this ordering avoids most of the expensive mistakes:

1. **Start with prompting and a proper evaluation set.** You cannot tell
   whether anything more elaborate helped without a baseline. The evaluation
   set is the deliverable here, not the prompt.
2. **Add retrieval when the failures are knowledge failures.** They usually
   are. Measure retrieval quality separately from answer quality.
3. **Consider fine-tuning when a specific, measured deficiency survives both**
   — a behaviour that prompting cannot make consistent, or a cost profile that
   does not work at your volume.
4. **Combine deliberately.** A fine-tuned model with retrieval is a perfectly
   good architecture — a model tuned for your output format, grounded in your
   current documents. It is a reasonable destination and a poor starting point.

## The uncomfortable answer

Frequently the honest recommendation is that the problem is not an AI problem.
The data is not clean enough, the documents contradict each other, or nobody
can define what a correct answer looks like. No amount of retrieval or
fine-tuning fixes a corpus that disagrees with itself.

Saying so early costs a small amount of consulting revenue and saves a great
deal of everyone's time. It is also the fastest way to find out whether the
project is really ready — and if it is not, the work that makes it ready is
usually worth doing on its own merits.
