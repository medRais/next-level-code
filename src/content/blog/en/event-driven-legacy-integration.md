---
title: Integrating with a core system you are not allowed to change
description: The constraint that shapes most enterprise integration is that the system of record cannot be touched. Here are the patterns that work under it, and the failure modes each one brings.
pubDate: 2026-03-24
tags:
  - Architecture
  - Integration
  - Legacy
seo:
  title: Integrating with a core system you cannot change
  description: Change data capture, outbox and polling compared for enterprise integration, with the ordering, idempotency and backpressure failures each pattern introduces.
---

In most enterprises the interesting constraint is not technical ambition. It
is that the system holding the data is twenty years old, carries the
business's obligations, is understood in full by a small number of people, and
**must not be modified**.

Everything else follows from that. The question is never "what is the ideal
architecture" but "what can we build that reads from this system without
asking it to change, and without becoming the reason it falls over".

Three patterns cover most of the ground. Each brings a different set of
problems, and choosing well means choosing which problems you would rather
have.

## Polling: the one that always works

Query on a schedule for rows changed since the last run.

It is unfashionable, requires nothing from the source beyond read access, and
is frequently the correct answer. Its weaknesses are known and bounded:
latency equal to the polling interval, load proportional to frequency rather
than to change, and a dependence on a reliable "modified at" column.

That last point is where it usually fails. If updates can occur without the
timestamp being touched — a batch job writing directly, a correction applied
in the database — polling silently misses them. Before committing, verify that
the column is maintained on *every* write path, including the ones nobody
mentions.

Polling deserves more respect than it gets. If a five-minute delay is
acceptable and volumes are moderate, it is less machinery to operate than
anything else here, and less machinery is a feature.

## Change data capture: low latency, at a price

CDC reads the database's own transaction log and emits an event per change.
No application code changes, no schema changes, near-real-time, and no way for
a write to escape it — the log is the source of truth for what happened.

The costs are real:

- **It is coupled to the schema, not to the domain.** You receive row changes,
  not business events. A "customer moved address" event has to be reconstructed
  from a row update, and a schema refactor in the core breaks your consumers
  without anyone in that team knowing you existed.
- **It needs privileges.** Replication access to a production database is not
  granted casually in a bank, and rightly so.
- **It is genuine infrastructure.** Connectors, offsets, schema registry,
  failure and replay. Someone operates that.

CDC is the right answer when latency genuinely matters and the source cannot
be touched. It is over-engineering when a five-minute delay would have been
fine.

## The outbox: the best option, when you are allowed it

The application writes its business event to an outbox table inside the same
transaction as the change itself, and a relay publishes from that table.

This is the strongest pattern available, because you get **domain events
rather than row diffs**, and because atomicity is guaranteed by the database's
own transaction rather than by hope: either both the change and the event
happened, or neither did.

The catch is in the first sentence. It requires modifying the application —
exactly what you were told you could not do. It is worth asking anyway. A
single insert inside an existing transaction is a much smaller change than it
sounds, and if the core team will accept it, everything downstream gets
easier. Ask before assuming the answer is no.

## The failures that arrive regardless

Whichever pattern you choose, the same three problems turn up.

**Duplicates are not an edge case.** Every one of these mechanisms will
redeliver: a relay crashes after publishing but before committing its offset,
a poll overlaps a boundary, a connector replays after failover. Consumers must
be idempotent — keyed on a stable business identifier, not on arrival order.
Design for at-least-once from the start; retrofitting idempotency into a
consumer that assumed exactly-once is miserable work.

**Ordering is weaker than you think.** Global ordering across a partitioned
stream does not exist. Per-key ordering usually does, and is usually enough —
but only if you partition on the key that matters. Partition on customer
identifier and two updates to the same customer stay ordered. Partition on
something else and they do not, and the bug appears months later under load,
which is the worst time to find it.

**Backpressure is your responsibility.** A nightly batch in the core system
will emit in minutes what normally arrives over a day. If your consumer
responds by hammering a downstream API or exhausting a connection pool, you
have turned a source-system event into an outage of something else. Rate-limit
deliberately, and make the queue depth visible on a dashboard someone actually
looks at.

## What to insist on

Two things are worth being firm about, because they are cheap now and
impossible to add later under pressure.

**A dead letter path with a way back.** Messages will fail to process.
Discarding them loses data; retrying them forever blocks the stream. You need
somewhere for them to go, enough context attached to diagnose them, and a
supported route to replay once fixed.

**Lag as a first-class metric.** Not "is the connector running" but "how far
behind is it, right now". A pipeline that is up and forty minutes behind is
producing wrong answers with complete confidence, and it will not alert on
liveness checks.

## The honest summary

Integrating with a system you cannot modify is not a problem to be solved
elegantly. It is a constraint to be respected, and the patterns above are all
compromises. The engineering judgement is in choosing which compromise fits
the actual latency requirement, the actual volume and the actual political
reality of who owns the core system — rather than picking the most
sophisticated option and discovering the constraint afterwards.
