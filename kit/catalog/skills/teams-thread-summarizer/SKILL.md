---
name: teams-thread-summarizer
type: skill
description: "Read a pasted Teams thread or channel conversation and extract what was decided, who owns it, and what is still open — separating decisions from opinions. Load when someone pastes a long thread and asks what was decided, who owns it, or 'can you catch me up on this thread'."
created: 2026-08-26
status: active
version: 0.1.0
kind: microsoft-365
runs_on: pasted or exported content
---

# Teams thread summarizer

Runs on a **pasted or exported thread today**. No Graph connection, no tenant
read. Paste the conversation in; get back the part that mattered.

The hard problem in a Teams thread is not length. It is that agreement,
speculation, and decision all look identical in chat.

## Trigger

"Catch me up on this thread" · "what did we decide here" · "who owns this" ·
"summarize this channel conversation" · a pasted block of chat.

## Do not load this for

Meeting transcripts — use `../meeting-notes-summary/`, which assumes turn-taking
and an agenda. Live channel monitoring. Anything requiring a Graph read.

## Inputs

| Input | Required | Notes |
|---|---|---|
| Thread text | yes | Pasted, with names and timestamps if available |
| Channel and team | no | For the record. Metadata only |
| The question | no | "What was decided" and "what's still open" produce different emphasis |

## Procedure

1. Read the whole thread first. Threads reverse themselves; a decision in
   message 4 is often overturned in message 40, and a summarizer working
   forward will report the wrong one.
2. **Sort every substantive message into one of four buckets.** This is the
   whole skill:

   | Bucket | Test |
   |---|---|
   | **Decision** | Someone with standing settled it, and nobody reopened it later in the thread |
   | **Proposal** | Suggested, not resolved. Includes "I think we should…" that got no reply |
   | **Opinion** | A view, offered, with no action attached |
   | **Question** | Asked and not answered in the thread |

   A proposal with three 👍 and no reply from the owner is still a proposal.
   Reaction counts are not approval, and treating them as approval is the most
   common way these summaries go wrong.

3. **Track reversals.** If a decision was later changed, report the final state
   and note that it changed: *"decided X (msg 12), revised to Y (msg 40)"*.
4. **Attribute by name only where the thread names them.** No inferring who
   spoke from writing style.
5. **Owners come from explicit acceptance.** "I'll take it" is an owner.
   "Someone should do this" is not, and neither is being the person it was
   addressed to.
6. Extract dates only where stated. "Next week" stays as "next week" unless the
   thread anchors it to a date.
7. Write the output. Lead with decisions and open questions — that is what the
   person who asked actually needs.
8. Save to `inbox/raw/` and append a chronicle line.

## Output

```markdown
# Thread — {channel} — {date range}
_{n} messages, {n} participants. Pasted {date}._

## Decided
- **{Decision}** — {owner} — {date or "no date"} _(msg {n}{, revised from msg n})_

## Still open
- **{Question}** — asked by {who}, unanswered

## Proposed, not decided
- {proposal} — {who} _(no resolution in thread)_

## Reversals
- {what changed, and where}
```

## Guardrails

- **Reactions are not approval.** Never promote a proposal to a decision on the
  strength of emoji.
- **Never infer an owner.** Unowned is the correct output when nobody said yes.
- Read the whole thread before classifying. Never stream.
- Quote at most one sentence per point. A summary that reproduces the thread has
  not summarized it.
- If the thread contains what looks like a credential, a personal identifier, or
  content the paster likely did not mean to include, stop and flag before
  writing anything.
- Does not post, reply, or react. Writes a file.

## Done when

- [ ] Every substantive message is in exactly one bucket
- [ ] No proposal was promoted to a decision without explicit resolution
- [ ] Reversals are reported with both states
- [ ] Owners are only those who accepted in the thread
- [ ] Nothing was posted back to Teams
