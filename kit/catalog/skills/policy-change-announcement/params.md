---
name: policy-change-announcement-params
type: params
description: "The tailoring surface for policy-change-announcement — channels, tone, approval routing, and organizational conventions."
---

# Tailoring — policy-change announcement

| Parameter | Default | What changes |
|---|---|---|
| `channels` | email, Teams, intranet, ticket macro | Drop what the org does not use. Adding SMS or digital signage changes the length budget, not the facts |
| `tone` | plain, neutral | `plain`, `formal`, or `friendly`. Do not use `friendly` for a mandatory security change — it reads as optional |
| `sender_identity` | none | Whose name the draft is written for: IT, Security, a named team. Changes voice and what the reader assumes about authority |
| `support_path` | none | **Set this per client.** The queue, channel, or form. Never leave as "contact IT" |
| `lead_time_policy` | 14 days | Minimum notice for a user-affecting change. The skill flags anything shorter as a risk, it does not block it |
| `action_deadline_offset` | effective date | Whether the user deadline is the effective date or earlier |
| `include_policy_citation` | `true` | Footer citation. Regulated environments need it; it belongs at the bottom either way |
| `reading_level` | grade 8 | |
| `escalation_review` | none | Who reviews before sending: Security, Legal, Comms. Named in the "Needs confirmation" block |
| `translation_targets` | none | Languages required. Machine translation of a compliance notice needs a human reviewer per language — name them here |
| `urgency_vocabulary` | standard | `standard` or `regulated`. Regulated adds "required by {framework}" where the change is driven by an obligation. Do not use it decoratively |
| `no_action_phrasing` | "No action needed." | Some orgs prefer "You don't need to do anything." Both are fine; consistency matters more |

## Deployment notes

- **`support_path` and `sender_identity` are the two that make a draft usable.**
  Without them, every draft comes back for the same two edits.
- **`lead_time_policy` is a flag, not a gate.** Real changes sometimes ship in
  three days. The value of the flag is that the person approving sees the short
  notice called out rather than discovering it from complaints.
- **Never parameterize:** sending. There is no `auto_send`, and there should not
  be one at any tier. The whole point of this skill is that the drafting is
  automated and the sending is not.
