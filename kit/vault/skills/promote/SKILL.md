---
name: promote
type: skill
description: "The curation gate — read an inbox item, decide promote or archive against explicit criteria, and move it. Load when the user says promote, curate, process the inbox, or clean up the inbox."
created: 2026-08-26
status: active
version: 0.1.0
---

# Promote

This is the gate that keeps `knowledge/` worth reading. A vault that promotes
everything is a folder of downloads.

## Trigger

"Promote" · "curate" · "process the inbox" · "what should I keep" · a scheduled
inbox sweep.

## Do not load this for

Capturing new material — that is `../ingest/`. Deleting anything, ever.

## Inputs

| Input | Required | Notes |
|---|---|---|
| Inbox items | yes | Files in `inbox/raw/` with frontmatter |
| Existing knowledge | yes | You must check for duplicates before promoting |

## The criteria

Promote only when **all four** are true:

1. **Durable.** Still useful in six months. News is not knowledge; the pattern
   inside the news might be.
2. **Novel here.** `knowledge/` does not already cover it. If a note is close,
   the right move is to update that note and archive the inbox item — not to add
   a second note on the same subject.
3. **Actionable or explanatory.** It changes a decision, or it explains a
   mechanism. "Interesting" is not a criterion.
4. **Sourced.** The origin is known and named.

Fail any one, archive it. Archiving is not rejection — it is the vault staying
navigable. `inbox/archive/` keeps everything; nothing is lost by archiving.

## Procedure

1. List `inbox/raw/`. If more than 10 items, take the oldest 10 — see
   `../safety-limits/SKILL.md`.
2. For each item, read the note (not the source it points at).
3. **Duplicate check.** Search `knowledge/` for the topic — grep the slug, the
   key terms, and the `description:` fields. State what you found before
   deciding.
4. Apply the four criteria. Write the verdict and the reason in one sentence.
5. **Promote:** copy `../../templates/knowledge.md`, fill it from the inbox note
   (rewritten, not pasted), save as `knowledge/{slug}-{YYYY-MM}.md`, then move
   the raw file to `inbox/archive/`. The archive keeps the provenance.
   **Archive:** move the raw file to `inbox/archive/` unchanged.
6. Append one chronicle line per item: promoted or archived, the filename, the
   one-sentence reason.
7. If an item updated an existing note instead of creating one, say so in the
   chronicle line — that is the most valuable outcome and the easiest to lose
   track of.
8. Report a summary: promoted N, archived M, updated K, remaining R.

## Output

Files moved. New notes in `knowledge/`. One chronicle line per item. Nothing
deleted.

## Guardrails

- **Never delete.** `mv` only.
- **Never promote without the duplicate check.** Duplicate knowledge notes are
  the failure mode that quietly ruins a vault.
- Never promote an item whose source is unknown without saying so out loud.
- If you cannot decide, leave it in `inbox/raw/` and say which fact would decide
  it. An undecided item is fine; a wrongly promoted one is expensive.

## Done when

- [ ] Every processed item is in `knowledge/` or `inbox/archive/` — none in both
- [ ] Every promotion names the duplicate check that cleared it
- [ ] `inbox/raw/` count went down by exactly the number processed
- [ ] The chronicle has a line per item and a summary line
