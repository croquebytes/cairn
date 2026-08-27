---
name: meeting-notes-summary
type: skill
description: "Turn raw meeting notes or a transcript into a structured summary — decisions, owners, dates, open questions — with anything uncertain marked rather than smoothed over. Load when the user pastes notes or a transcript and asks for a summary, minutes, or action items."
created: 2026-08-26
status: active
version: 0.1.0
kind: generic
---

# Meeting notes → structured summary

## Trigger

A pasted transcript or set of notes plus: "summarize this" · "what were the
action items" · "write up the minutes" · "who owns what from this call".

## Do not load this for

Live transcription. Summarizing a document (`../doc-to-faq/`). Producing a
message to send — this writes a note; sending it is a separate, gated step.

## Inputs

| Input | Required | Notes |
|---|---|---|
| Notes or transcript | yes | Pasted or a path. If it is a file, read it before starting |
| Attendee list | no | If absent, derive from the transcript and mark it derived |
| Meeting date | no | Defaults to today; say which you used |

## Procedure

1. Read the whole thing before writing anything. Do not summarize as you scroll.
2. Extract **decisions** — statements where the group settled something. A
   decision has a subject and a resolution. "We discussed the migration" is not
   a decision; "we're moving the file server in Q4" is.
3. For each decision, find its **owner** and **date**. If either is not in the
   source, write `owner: unassigned` or `date: not set`. Never infer an owner
   from who talked most.
4. Extract **actions** — commitments to do a specific thing. Same owner/date
   rule.
5. Extract **open questions** — things raised and not resolved. This section is
   the one people actually reread; do not compress it away.
6. Extract **risks or blockers** if any were named.
7. Write the note using the output shape below.
8. **Mark uncertainty inline.** Where the source is ambiguous, write
   `[unclear: <what is ambiguous>]` rather than choosing a reading. A summary
   that quietly resolves ambiguity is worse than one that flags it.
9. If a decision contradicts something in `vault/knowledge/`, say so at the
   bottom under "Conflicts with the vault" and name the file.
10. Save to `vault/inbox/raw/{meeting-slug}-{YYYY-MM-DD}-raw.md` and append a
    chronicle line. It goes to the inbox, not to knowledge — the promote gate
    decides whether a given meeting is durable.

## Output

```markdown
# {Meeting} — {date}

**Attendees:** {list} {(derived from transcript)}

## Decisions
| Decision | Owner | Date |
|---|---|---|

## Actions
| Action | Owner | Due |
|---|---|---|

## Open questions
- {question} — raised by {who}

## Risks
- {risk}

## Conflicts with the vault
- {claim} contradicts `knowledge/{file}.md`
```

## Guardrails

- **Never invent an owner or a date.** `unassigned` and `not set` are correct
  answers and are the whole reason anyone trusts this output.
- Never send the summary anywhere. Writes a file; a human sends.
- Do not quote more than a sentence of the transcript per point.
- If the transcript contains anything that looks like a credential, a personal
  identifier, or content the user may not have intended to paste, stop and flag
  it before writing the file.

## Done when

- [ ] Every decision has an owner field and a date field, even if `unassigned`
- [ ] Open questions section exists (say "none" if none)
- [ ] Every ambiguity is marked, not resolved
- [ ] File is in `inbox/raw/`, chronicle line appended, nothing sent
