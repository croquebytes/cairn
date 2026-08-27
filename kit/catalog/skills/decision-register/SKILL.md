---
name: decision-register
type: skill
description: "Maintain an append-only register of decisions — what was decided, by whom, when, on what basis, and what it superseded — so 'when did we decide that?' has an answer. Load when a decision needs recording, or when someone asks when or why something was decided."
created: 2026-08-26
status: active
version: 0.1.0
kind: microsoft-365
runs_on: pasted or exported content
---

# Decision register

The register is the highest-value thing a vault holds and the easiest to skip.
Notes decay; a decision record with a date and a rationale is still useful when
everyone who was in the room has left.

Runs on **pasted or exported content today** — meeting notes, a Teams thread, an
email. In a tenant this maps to a SharePoint list with versioning; the register
format below is designed to import into one column-for-column.

## Trigger

"Record this decision" · "when did we decide that" · "what was the rationale
for X" · "add this to the decision log" · the output of
`../meeting-notes-summary/` or `../teams-thread-summarizer/`.

## Do not load this for

Recording actions or tasks — those belong with the work, not in the register. A
register that accumulates tasks becomes unsearchable within months. Recording a
proposal: only settled things go in.

## Inputs

| Input | Required | Notes |
|---|---|---|
| The decision | yes | One sentence, in the past tense, with a subject |
| Decided by | yes | A person or a body. "The team" is acceptable only if the team is named |
| Date decided | yes | The date it was settled, not the date it was recorded |
| Basis | yes | What the decision rested on — a constraint, a cost, a requirement, a test result |
| Alternatives considered | no | Rejected options and one line on why. This is what makes a register worth rereading |
| Supersedes | no | The ID of a decision this replaces |
| Source | yes | Where this is evidenced: meeting, thread, document |

## Procedure

1. **Confirm it is a decision, not a proposal.** Test: is there a course of
   action now settled, and did someone with standing settle it? If not, it does
   not go in. Say so rather than recording it "provisionally" — provisional
   entries are how a register loses its authority.
2. **Assign the next ID.** Sequential, never reused: `D-0042`.
3. **Write the decision in one sentence, past tense, with a subject.** "We will
   consider moving to Entra ID" is not a decision. "We decided to move
   authentication to Entra ID" is.
4. **Record the basis in one or two sentences.** Not the discussion — the thing
   that actually made the difference. If nobody can name it, record `basis: not
   recorded` rather than reconstructing one. A missing basis is a fact about the
   decision and worth knowing.
5. **Record alternatives** with one line each on why they were rejected. This is
   the section people return to when the decision is challenged two years later.
6. **Link supersessions in both directions:** the new entry says
   `supersedes: D-0017`, and D-0017 gets an appended line —
   `superseded by D-0042 on {date}`. **The old entry is never edited or
   removed**; a register you can rewrite is not evidence.
7. **Append.** Never insert, never reorder, never renumber.
8. Save to `knowledge/decisions/` (or the configured register file) and append a
   chronicle line.

## Output

```markdown
## D-0042 — {Decision in one sentence}

| | |
|---|---|
| **Decided** | {YYYY-MM-DD} |
| **By** | {person or named body} |
| **Basis** | {what it rested on} |
| **Source** | {meeting / thread / document} |
| **Supersedes** | {D-nnnn or —} |
| **Status** | active |

**Alternatives considered**
- {option} — rejected because {reason}
```

## Guardrails

- **Append only.** A decision entry is never edited after the fact. Corrections
  are new entries that supersede.
- **Never record a proposal as a decision.** The four-bucket test in
  `../teams-thread-summarizer/` applies.
- **Never infer a decider.** If the source does not name who settled it, record
  `by: not recorded` and flag it — an unattributed decision is a real and common
  thing, and pretending otherwise makes the register lie.
- **Never reconstruct a basis.** `not recorded` is honest and useful.
- IDs are never reused, even for a withdrawn entry. A withdrawn decision gets a
  superseding entry saying it was withdrawn.
- Does not notify anyone. Writes a file.

## Done when

- [ ] The entry is a settled decision, not a proposal
- [ ] ID is the next in sequence and appears nowhere else
- [ ] Decided-date is the date it was settled, not today
- [ ] Basis is recorded or explicitly `not recorded`
- [ ] Supersession is linked in both directions, with the old entry unedited
      apart from its appended supersession line
- [ ] Chronicle line appended
