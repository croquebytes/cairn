---
name: weekly-digest
type: skill
description: "Read the week's chronicle and new knowledge, and write a short narrative digest of what actually changed — including what stalled. Load when the user asks for a weekly summary, a digest, a recap, or 'what happened this week'."
created: 2026-08-26
status: active
version: 0.1.0
kind: generic
---

# Weekly digest

A digest that only reports progress is a press release. This one reports the
week, which includes the parts where nothing moved.

## Trigger

"Weekly digest" · "what happened this week" · "write the recap" · a scheduled
Friday run.

## Do not load this for

Vault health — that is `vault/skills/status/`. Summarizing a document or a
meeting. Anything covering a period longer than a month; long-range summaries
need a different sampling approach and this one will just get vague.

## Inputs

| Input | Required | Notes |
|---|---|---|
| `logs/chronicle.md` | yes | The period's entries only |
| `knowledge/` | yes | Files created or updated in the period |
| `logs/heartbeat.md` | no | Batch runs and their remainders |
| Previous digest | no | To avoid repeating last week's framing |

## Procedure

1. Fix the window: last 7 days ending today, unless told otherwise. State the
   window in the output.
2. Read chronicle entries inside the window. Read only those.
3. Group them into themes — three to five. A theme is a thread of related
   actions, not a category of file. "Sorted out how delegated permissions work"
   is a theme; "four knowledge notes added" is a count.
4. List knowledge notes created or updated in the window, with their
   `description:` line.
5. **Find what stalled**, and say it plainly:
   - inbox items older than the window that are still in `raw/`
   - batches that stopped at a cap with an unprocessed remainder
   - days inside the window with no chronicle entry at all
   - notes marked `status: draft` that have not moved
6. Write the digest in the shape below. Prose for the themes; lists for the
   rest. Aim for something a person reads in ninety seconds.
7. Save to `knowledge/digest-{YYYY-MM-DD}.md` and append a chronicle line.

## Output

```markdown
# Week of {start} – {end}

{Two or three paragraphs. What the week was about. Specific — name the notes,
name the decisions. If the week was quiet, say the week was quiet.}

## Added to knowledge
- `{file}` — {description}

## Stalled
- {item} — {how long, and what it is waiting on}

## Numbers
Captured {n} · promoted {n} · archived {n} · escalated {n}
```

## Guardrails

- **Never pad a quiet week.** "Three notes promoted, nothing else moved" is the
  correct output for that week, and it is the output that makes the digest worth
  reading in a busy one.
- Every claim traces to a chronicle line or a file. No summarizing from memory
  of the session.
- Numbers are counted, never estimated.
- Does not send. Writes a file; a human decides where it goes.

## Done when

- [ ] The window is stated
- [ ] The "Stalled" section exists and was genuinely checked (say "nothing" if
      nothing)
- [ ] Every named item is a real file
- [ ] Chronicle line appended
