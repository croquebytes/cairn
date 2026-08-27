---
name: doc-to-faq-params
type: params
description: "The tailoring surface for doc-to-faq — audience, reading level, citation style, and coverage."
---

# Tailoring — document → FAQ

| Parameter | Default | What changes |
|---|---|---|
| `audience` | end user | `end user`, `manager`, `IT admin`, `external customer`. Changes which questions get asked at all, not just the wording |
| `reading_level` | plain, roughly grade 8 | Raise for a technical audience. Do not lower below grade 6 — it reads as condescending and people stop trusting it |
| `question_count` | 8–15 | Below 8 the FAQ misses; above ~20 nobody scrolls |
| `answer_length` | 2–4 sentences | |
| `citation_style` | `§ section` | `§ section`, `heading name`, `page number`, or `none`. **`none` is not recommended** — uncited answers are unverifiable, and this is the parameter that most changes how much the output can be trusted |
| `include_not_covered` | `true` | Turning this off removes the most useful section. If a deployment insists, record why |
| `tone` | direct | `direct` or `warm`. Warm adds a sentence of context per answer; it does not soften rules |
| `escalation_contact` | none | Role or address used in "Not covered" answers. Set per client |
| `include_contradictions` | `true` | |
| `source_version_required` | `true` | If `false`, output carries a read date only. Only sensible for living documents that have no version |
| `output_format` | markdown | `markdown`, `html`, or `sharepoint_page` (see `../sharepoint-faq-builder/`) |

## Deployment notes

- **`audience` is the highest-leverage parameter.** The same 12-page policy
  produces a completely different FAQ for an end user than for the admin who has
  to enforce it. Run it twice rather than trying to serve both.
- **Never parameterize:** the citation requirement, unless the client has
  explicitly accepted an uncitable FAQ in writing. That is the difference
  between a reference and a guess.
