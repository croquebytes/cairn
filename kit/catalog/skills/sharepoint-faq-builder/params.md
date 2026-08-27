---
name: sharepoint-faq-builder-params
type: params
description: "The tailoring surface for sharepoint-faq-builder — tenant conventions, metadata columns, review cadence, and audience."
---

# Tailoring — SharePoint FAQ builder

This is the skill where per-client tailoring is most of the work. Every tenant
names its columns differently and every one has a different idea of who owns a
page.

| Parameter | Default | What changes |
|---|---|---|
| `site_url` | none | The target site. Metadata only — nothing is written to it |
| `library` | `Site Pages` | Some tenants keep FAQs in a dedicated library with its own retention |
| `column_map` | Owner, SourceDocument, SourceReviewed, ReviewBy, Status | **Map to the tenant's actual column names.** This is the first thing to set and the most common cause of a broken deployment |
| `review_interval` | 6 months | Sets `ReviewBy`. 3 months for anything regulatory, 12 for stable procedure |
| `owner_convention` | role | `role` or `group`. Never `person` — see the guardrail |
| `audience_group` | none | Entra group for audience targeting |
| `page_template` | Q&A stack | `Q&A stack` or `accordion`. Accordion looks tidier and is worse for search — collapsed text still indexes but users cannot skim it |
| `keyword_source` | derived | `derived` from the answers, or `ticket_terms` from a supplied sample. Ticket terms win whenever you have them, because they are what users actually type |
| `escalation_path` | none | Queue, channel, or form for "Still stuck?". Set per client |
| `language` | en | Set per tenant. Do not machine-translate a policy FAQ without a reviewer who reads the target language |
| `status_on_output` | `Draft` | **Do not change.** Listed so deployers can see it is deliberate |
| `include_deflection_note` | `true` | Requires a ticket sample |
| `sensitivity_label` | none | Purview label to apply on publish. Named here so the human who publishes knows which one |

## Deployment notes

- **Set `column_map` before the first run.** A page whose metadata does not match
  the library's columns silently loses its governance data, which means it
  silently loses its review date, which means it rots.
- **`owner_convention: role`, always.** The single most common reason an
  intranet FAQ is wrong two years later is that its owner left.
- **Never parameterize:** publishing. There is no `auto_publish`. Adding one
  would move this from a drafting skill to a tenant-writing integration, which
  needs its own permissions review, its own approval gate, and its own
  acceptance test.
