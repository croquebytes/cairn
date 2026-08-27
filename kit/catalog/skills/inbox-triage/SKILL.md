---
name: inbox-triage
type: skill
description: "Classify and route everything sitting in the inbox — promote, archive, merge into an existing note, or escalate to a human — under an explicit batch cap. Load when the user says triage, process the inbox, clear the queue, or sort this backlog."
created: 2026-08-26
status: active
version: 0.1.0
kind: generic
---

# Inbox triage

The promote skill decides one item well. This one decides a queue, which is a
different problem: the risk is not a wrong verdict but a batch of wrong verdicts
nobody read.

## Trigger

"Triage the inbox" · "process the queue" · "clear the backlog" · a scheduled
inbox sweep.

## Do not load this for

A single item — use `vault/skills/promote/`. Capturing new material — use
`vault/skills/ingest/`. Anything outside `inbox/raw/`.

## Inputs

| Input | Required | Notes |
|---|---|---|
| `inbox/raw/` contents | yes | Items with frontmatter. Items without get fixed first, not skipped |
| `knowledge/` index | yes | For the duplicate check |
| Batch cap | yes | Defaults to 10 per run; see `params.md` |

## Procedure

1. **Count first, then cap.** List `inbox/raw/`. Report the count. Take the
   oldest N per the cap and say explicitly how many you are leaving.
2. For each item, in order:
   a. Read the item. Not the source it points at — if the note is too thin to
      judge, that itself is the verdict (`escalate`).
   b. **Duplicate check** against `knowledge/`: grep the slug, the key nouns,
      and the `description:` fields. State what you found.
   c. Assign exactly one verdict:

      | Verdict | When | Action |
      |---|---|---|
      | `promote` | durable, novel, actionable or explanatory, sourced | write to `knowledge/`, move raw to `archive/` |
      | `merge` | covered by an existing note but adds something | update that note, move raw to `archive/`, name the note in the log |
      | `archive` | fails any criterion | move raw to `archive/` unchanged |
      | `escalate` | you cannot decide, or the item touches something gated | leave in `raw/`, add it to the escalation list |

   d. Append one chronicle line: verdict, filename, one-sentence reason.
3. **Stop at the cap or at three consecutive errors**, whichever comes first.
   Do not raise the cap to finish.
4. Report: promoted N, merged M, archived K, escalated E, remaining R — and list
   the escalations with the specific question each one needs answered.

## Output

Files moved. Chronicle lines. A summary with an explicit remainder. Nothing
deleted, ever.

## Guardrails

- `merge` is the verdict most often skipped and most often correct. If the
  duplicate check found a near-match, `promote` needs a stated reason why a
  second note is better than an updated one.
- Never triage more than the cap. A run that processed 60 items is a run nobody
  reviewed.
- An `escalate` verdict is a success, not a failure to decide.
- Batch rules: `vault/skills/safety-limits/SKILL.md`.

## Done when

- [ ] Every processed item has exactly one verdict and one chronicle line
- [ ] Every `promote` names the duplicate check that cleared it
- [ ] The remainder count is stated out loud
- [ ] Escalations are listed with the question each needs
