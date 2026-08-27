---
name: teams-thread-summarizer-params
type: params
description: "The tailoring surface for teams-thread-summarizer — who counts as a decider, how reactions are treated, and output emphasis."
---

# Tailoring — Teams thread summarizer

| Parameter | Default | What changes |
|---|---|---|
| `decider_roles` | none | Names or roles whose agreement constitutes a decision. Without this, "settled by someone with standing" is guesswork. **Set this per team** |
| `reaction_weight` | `none` | `none` or `signal`. `signal` lets a reaction move a proposal into a "likely agreed" sub-section — it never makes it a decision. Default `none` is correct for anything auditable |
| `sections` | Decided, Still open, Proposed, Reversals | Reorder per what the team actually asks for |
| `attribution` | display name | `display name`, `role`, or `anonymized`. Anonymized for threads that will be shared outside the team |
| `date_inference` | `false` | `true` converts "next Tuesday" to a date using the message timestamp. Useful and risky; off by default |
| `include_message_refs` | `true` | Message numbers so a reader can check. Turning this off makes the summary unverifiable |
| `max_quote_length` | 1 sentence | |
| `thread_age_warning` | 30 days | Warn when summarizing a thread older than this — decisions may have moved elsewhere |
| `redaction_terms` | none | Strings redacted on sight: client names, project codenames |
| `destination` | `inbox/raw/` | Teams with a decision register point this at `../decision-register/` instead |

## Deployment notes

- **`decider_roles` is the parameter that makes this skill work.** In a thread
  where six people have opinions and one can approve, a summarizer that does not
  know which is which produces a decision list that is really an opinion list.
  Ask the team who can settle things, and put those names or roles here.
- **`reaction_weight: signal` is a request you will get and should resist** for
  any thread that touches money, access, or compliance. A thumbs-up is not a
  sign-off, and a summary that records it as one will eventually be read as
  evidence.
- **Never parameterize:** posting back to Teams. This skill has no write path
  into a tenant.
