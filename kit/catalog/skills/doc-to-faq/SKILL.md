---
name: doc-to-faq
type: skill
description: "Turn a policy, procedure, or reference document into the questions people actually ask about it, answered in plain language and cited back to the source section. Load when the user asks for an FAQ, a self-service page, or 'what will people ask about this'."
created: 2026-08-26
status: active
version: 0.1.0
kind: generic
---

# Document → FAQ

Most documentation fails because it is organized the way the author thinks and
read by someone with a question. This inverts it: questions first, every answer
carrying the section it came from so the reader can check.

## Trigger

"Make an FAQ from this" · "turn this policy into something people can use" ·
"what will people ask about this" · "write the self-service page".

## Do not load this for

Summarizing a document (a summary preserves the author's structure; an FAQ
discards it). Writing new policy. Anything where the source is a draft — an FAQ
built on a draft will outlive the draft and be wrong.

## Inputs

| Input | Required | Notes |
|---|---|---|
| Source document | yes | Full text. If you only have an excerpt, say so and scope the FAQ to it |
| Audience | yes | Who is asking. "End users" and "IT admins" produce different FAQs from the same policy |
| Known questions | no | Real tickets or emails, if available. These beat imagined ones every time |

## Procedure

1. Read the whole document. Note its structure — you are about to discard it,
   and you need to know what you are discarding.
2. **Generate questions from the reader's position, not the document's.** For
   each section, ask: what would someone hitting this rule in the middle of
   their day want to know? Phrase questions the way a person types them —
   "Can I use my personal phone?" not "Regarding personal device eligibility".
3. If real questions were supplied, they lead. Imagined questions fill gaps.
4. **Answer each in two to four sentences of plain language.** No hedging that
   the source does not contain, no softening a hard rule.
5. **Cite the source section** for every answer: `§ 4.2` or the heading.
   Uncited answers are the failure mode — they are where invention creeps in.
6. **Mark the gaps.** Where a question is obvious and the document does not
   answer it, include the question anyway under "Not covered by this document",
   with a note on who to ask. This section is the most valuable output and the
   one that gets cut.
7. Order by likely frequency, not by document order.
8. Flag anything where the document contradicts itself, quoting both places.
9. Save to `inbox/raw/` for review before it becomes knowledge. An FAQ is a
   published artifact; it goes through the gate.

## Output

```markdown
# FAQ — {document title}
_Source: {document}, version {v}, read {date}. Audience: {audience}._

### {Question in the reader's words}
{Answer, 2–4 sentences.}
_{§ reference}_

## Not covered by this document
- **{Question}** — the document does not address this. Ask {role}.

## Contradictions found
- § {a} says X; § {b} says Y.
```

## Guardrails

- **Every answer cites a section.** If you cannot cite it, it belongs under "Not
  covered".
- Never resolve a contradiction by picking one side. Report both.
- Never soften a rule to make it friendlier. Plain is not the same as lenient.
- Record the source version and the date you read it. An FAQ without a source
  version becomes a liability the moment the policy changes.
- Does not publish. Writes a file.

## Done when

- [ ] Every answer has a section citation
- [ ] "Not covered" section exists and was genuinely looked for
- [ ] Source document name, version, and read date are in the output
- [ ] Questions are phrased as a person would ask them
