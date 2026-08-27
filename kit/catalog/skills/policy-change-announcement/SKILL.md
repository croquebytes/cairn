---
name: policy-change-announcement
type: skill
description: "Turn a policy or configuration change into plain-language user communications — what changes, when, what the reader must do — with a draft per channel and nothing sent. Load when a compliance, security, or platform change needs to be announced to users."
created: 2026-08-26
status: active
version: 0.1.0
kind: microsoft-365
runs_on: pasted or exported content
---

# Policy-change announcement drafter

Runs on a **pasted change record today** — a message-centre item, a change
ticket, a policy diff. It drafts; a human sends. That is not a limitation of
this version; it is the design.

Most change communications fail the same way: they explain the change instead of
telling the reader what will be different on their screen on Tuesday.

## Trigger

"We're enabling MFA next month, write the comms" · "draft the announcement for
this policy change" · "users need to know about this" · a message-centre item
pasted in.

## Do not load this for

Incident communications — an outage needs a different structure and a faster
approval path. Writing the policy itself. Sending anything.

## Inputs

| Input | Required | Notes |
|---|---|---|
| The change | yes | What is changing, from the change record or policy diff |
| Effective date | yes | If unknown, the draft says `[DATE — confirm]` and stops short of sending |
| Affected audience | yes | Who sees a difference. "Everyone" is usually wrong and worth challenging |
| User-visible impact | yes | What is different on the user's screen. If nobody can answer this, the announcement is premature |
| Action required | yes | What the reader must do, and by when. "Nothing" is a valid and welcome answer |
| Support path | yes | Where confused people go |

## Procedure

1. **Establish the user-visible impact before writing a word.** If the answer is
   "nothing visible", say that prominently — it is the most reassuring sentence
   in any change announcement. If nobody can describe the impact, stop and say
   the announcement is not ready.
2. **Lead with the reader, not the change.** The first sentence says what will
   be different for them and when. The reason comes second. The policy reference
   comes last.
3. **Separate "you must act" from "for your information".** Put required action
   in its own block with a deadline. Mixing them is why people ignore both.
4. **Write the deadline as a date**, never "in two weeks".
5. **Name the support path** explicitly — a queue, a channel, a form. "Contact
   IT" is not a support path.
6. **Produce a draft per channel**, same facts, different length:

   | Channel | Shape |
   |---|---|
   | Email | subject under 60 chars, ~150 words, action block |
   | Teams post | ~60 words, one link |
   | Intranet notice | ~200 words, with the FAQ questions this will generate |
   | Ticket macro | 40 words for the service desk to paste in reply |

7. **Predict the questions.** List the three to five things people will ask, so
   the service desk sees them before the users do. If an FAQ page is warranted,
   hand off to `../sharepoint-faq-builder/`.
8. **Flag what you could not confirm.** Any `[DATE — confirm]`, unknown
   audience, or unclear impact goes in a "Needs confirmation before sending"
   block at the top of the file. A human clears these before anything goes out.
9. Save to `inbox/raw/`. Append a chronicle line. **Send nothing.**

## Output

```markdown
# Change announcement — {change} — effective {date}

## Needs confirmation before sending
- [ ] {open item}

## Email
**Subject:** {≤60 chars}
{body}
**You need to:** {action} **by {date}** — or: **No action needed.**
**Questions:** {support path}

## Teams post
{≤60 words}

## Intranet notice
{≤200 words}

## Ticket macro
{≤40 words}

## Questions this will generate
1. {question}
```

## Guardrails

- **Send nothing.** No email, no post, no ticket. Every draft is a file.
- **Never invent a date, an audience, or a support path.** `[DATE — confirm]` in
  a draft is a working state; an invented date in a sent announcement is an
  incident.
- **Never soften a mandatory change into a suggestion.** If users must act, the
  draft says must.
- Do not write scare copy. Security changes get announced in the same plain
  register as everything else; urgency that is not real trains people to ignore
  the urgency that is.
- Do not quote policy at users. Cite it at the bottom; explain it at the top.

## Done when

- [ ] The first sentence describes user-visible impact and gives a date
- [ ] Required action is in its own block with a real date, or the draft says no
      action is needed
- [ ] The support path is a specific destination
- [ ] Unconfirmed items are listed at the top
- [ ] Four channel drafts, all carrying the same facts
- [ ] Nothing was sent
