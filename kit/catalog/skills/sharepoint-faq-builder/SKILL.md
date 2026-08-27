---
name: sharepoint-faq-builder
type: skill
description: "Turn a policy or procedure document into a SharePoint-ready self-service FAQ page — plain-language Q&A, metadata columns, and an owner and review date so it does not rot. Load when the user wants an intranet FAQ, a SharePoint help page, or to deflect a recurring ticket type."
created: 2026-08-26
status: active
version: 0.1.0
kind: microsoft-365
runs_on: pasted or exported content
---

# SharePoint FAQ builder

Runs on a **pasted or exported document today**. It produces the page content
and the metadata a SharePoint page needs; a human creates the page. Connecting
this to a tenant through Microsoft Graph with delegated permissions is a real
project and this skill does not pretend to have done it.

## Trigger

"Build an FAQ page for the intranet" · "we keep getting the same ticket about
this" · "turn this policy into a SharePoint page" · "make a self-service page".

## Do not load this for

Creating or publishing anything in a live tenant — this writes content, a human
publishes. General FAQ generation with no SharePoint target — use
`../doc-to-faq/`. Anything requiring a Graph call.

## Inputs

| Input | Required | Notes |
|---|---|---|
| Source document | yes | Pasted text or an exported `.docx`/`.pdf` converted to text |
| Site and library | yes | Where the page will live. Used for metadata, not for writing |
| Audience | yes | The tenant's users, a department, or external guests |
| Ticket sample | no | Real tickets on this subject. If you have them, they set the question list |
| Page owner | yes | A named role. A page with no owner is a page nobody updates |

## Procedure

1. Run the `../doc-to-faq/` procedure to produce the question set, answers, and
   citations. That is the substance; the rest of this skill is packaging.
2. **Add the SharePoint layer:**
   - a page title under 60 characters that reads as a search result
   - a 150-character summary for the page description column
   - three to six **search keywords** — the words a user types into the
     SharePoint search box, which are usually not the words in the policy
   - the audience-targeting group, if the deployment uses one
3. **Set governance metadata**, which is the part that decides whether the page
   is still true in a year:

   | Column | Value |
   |---|---|
   | `Owner` | named role, not a person's name — roles survive turnover |
   | `SourceDocument` | file name and version |
   | `SourceReviewed` | the date the source was read |
   | `ReviewBy` | source review date plus the review interval |
   | `Status` | `Draft` until a human publishes |

4. **Structure the page for scanning**, not reading: question as an H2, answer
   underneath, no more than four sentences. SharePoint's default page rendering
   punishes long paragraphs and so do readers.
5. Include a **"Still stuck?"** block at the bottom naming the escalation path —
   a queue, a channel, a form. An FAQ without an exit routes people back to the
   ticket you were deflecting.
6. Carry through the **"Not covered by this document"** section. Rename it "What
   this page doesn't answer" for an end-user audience.
7. Output as markdown plus a metadata block. Save to `inbox/raw/`. Do not
   attempt to create the page.
8. If a ticket sample was supplied, close with a **deflection note**: which
   sampled tickets this page would have answered, and which it would not. That
   is the honest measure of whether it was worth building.

## Output

```markdown
---
page_title: {≤60 chars}
page_summary: {≤150 chars}
keywords: [{term}, {term}, {term}]
library: {site / library}
owner: {role}
source_document: {name} v{version}
source_reviewed: {YYYY-MM-DD}
review_by: {YYYY-MM-DD}
status: Draft
---

# {Page title}

## {Question}
{Answer.} _{§ reference}_

## What this page doesn't answer
- {question} — ask {role}

## Still stuck?
{Escalation path.}
```

## Guardrails

- **Never create, publish, or modify anything in a tenant.** This skill has no
  tenant connection, and if one is added later, publishing still stops at the
  approval gate.
- `Status` ships as `Draft`. A human changes it.
- Every answer cites a section of the source. No citation, no answer — it goes
  under "doesn't answer".
- Never name a person as `Owner`. Roles outlive people, and a page owned by
  someone who left is a page nobody can update.
- Do not claim deflection numbers. Report which sampled tickets would have been
  answered; do not project a rate.

## Done when

- [ ] Page title under 60 chars, summary under 150
- [ ] Keywords are search terms, not policy vocabulary
- [ ] `Owner` is a role, `ReviewBy` is set, `Status` is `Draft`
- [ ] Every answer cites a section
- [ ] "Still stuck?" names a real escalation path
- [ ] Nothing was published
