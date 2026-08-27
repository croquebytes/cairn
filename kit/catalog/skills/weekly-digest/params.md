---
name: weekly-digest-params
type: params
description: "The tailoring surface for weekly-digest — window, audience, sections, and tone."
---

# Tailoring — weekly digest

| Parameter | Default | What changes |
|---|---|---|
| `window` | 7 days | `7`, `14`, or `30`. Beyond 30 the narrative goes vague; use a different skill |
| `audience` | self | `self`, `team`, or `stakeholder`. Stakeholder drops file paths and keeps outcomes; self keeps paths, which is what makes it useful later |
| `sections` | narrative, added, stalled, numbers | Reorder or drop. Dropping `stalled` is the common request and the one to push back on |
| `theme_count` | 3–5 | Fewer for a quiet vault |
| `tone` | plain first person | `plain first person` or `neutral third person`. Third person for anything circulated outside the team |
| `include_numbers` | `true` | |
| `destination` | `knowledge/digest-{date}.md` | Some deployments want digests in their own folder so they do not dilute `knowledge/` search |
| `stall_threshold` | 14 days | How old an untouched inbox item must be to count as stalled |
| `quiet_week_text` | (none) | Optional fixed sentence for a week with no activity. Leave empty — a generated honest sentence beats a canned one |
| `link_style` | relative path | `relative path`, `wikilink`, or `none` |

## Deployment notes

- **`audience: stakeholder` is where digests go wrong.** Dropping paths is fine;
  dropping the stalled section turns the digest into marketing and it stops
  being read within a month.
- **Never parameterize:** the requirement that every claim trace to a chronicle
  line. A digest that can generalize is a digest that can be wrong quietly.
