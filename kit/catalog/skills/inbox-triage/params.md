---
name: inbox-triage-params
type: params
description: "The tailoring surface for inbox-triage — batch caps, criteria weights, and routing, adjustable per deployment."
---

# Tailoring — inbox triage

| Parameter | Default | What changes |
|---|---|---|
| `batch_cap` | `10` | Items per run. Raise only where a human genuinely reviews the log afterwards. Above ~25 nobody does |
| `error_cap` | `3` consecutive | Consecutive failures before stopping |
| `order` | `oldest_first` | `oldest_first`, `newest_first`, or `by_source`. Oldest-first is correct unless the queue is a feed, in which case newest-first prevents a permanent backlog of stale items |
| `criteria` | durable, novel, actionable, sourced | Drop or add criteria per deployment. Dropping `sourced` is common in personal vaults and always a mistake in shared ones |
| `durability_horizon` | 6 months | "Still useful in N months." A service desk KB might use 12; a news vault, 1 |
| `merge_threshold` | moderate | How close a match triggers `merge` over `promote`. `strict` produces more duplicate notes; `loose` overwrites nuance |
| `auto_archive` | `true` | If `false`, archive verdicts are proposed and wait for a human. Use for the first two weeks of any deployment |
| `escalate_to` | session user | Where escalations go: the session, a named person, or a task list |
| `write_knowledge` | `true` | `false` makes this classify-only — verdicts logged, nothing moved. The safest way to evaluate a new deployment |
| `duplicate_scope` | `knowledge/` | Add `inbox/archive/` to catch items that were already rejected once. Slower, and stops the same link being recaptured monthly |

## Deployment notes

- **Start with `auto_archive: false` and `write_knowledge: false`.** Run for a
  week, read the verdict log, then turn them on. The failure mode of triage is
  confident wrongness at volume, and it is invisible until you compare verdicts
  to what a human would have said.
- **Never parameterize:** deletion. There is no `delete` verdict and no
  parameter that creates one.
