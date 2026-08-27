---
name: meeting-notes-summary-params
type: params
description: "The tailoring surface for meeting-notes-summary — what a deployer changes per team without touching the procedure."
---

# Tailoring — meeting notes → summary

Edit these. Do not edit `SKILL.md` to make a deployment fit; if you find
yourself doing that, the parameter is missing and should be added here.

| Parameter | Default | What changes |
|---|---|---|
| `sections` | Decisions, Actions, Open questions, Risks | Which sections appear, and in what order. A standup wants Actions first; a steering committee wants Decisions first |
| `owner_field` | free text name | Set to `email`, `teams_handle`, or `ticket_assignee` if the team routes work by identifier |
| `date_format` | `YYYY-MM-DD` | Change for a team that lives in `DD/MM/YYYY`. Applies to output only; frontmatter stays ISO |
| `unassigned_label` | `unassigned` | Some teams want `TBD`, some want a named triage owner |
| `escalate_if_no_owner` | `false` | `true` adds an "Unowned actions" block at the top. Use where unowned actions are the recurring failure |
| `include_transcript_excerpt` | `true` | `false` for confidentiality-sensitive teams — decisions only, no quoted speech |
| `destination` | `vault/inbox/raw/` | A team with an established decision log may point this at `vault/knowledge/`, but then the promote gate is skipped — document that trade |
| `conflict_check` | `true` | Whether to check decisions against `vault/knowledge/`. Expensive on large vaults; turn off for high-volume standups |
| `tone` | neutral record | `neutral record` or `narrative`. Narrative reads better for a weekly digest; neutral is correct for anything anyone might audit |
| `redaction_terms` | none | Strings to redact on sight (project codenames, client names). Case-insensitive |

## Deployment notes

- **Per client:** set `redaction_terms` and `owner_field` first. Those are the
  two that cause an embarrassing output if left at default.
- **Per team:** `sections` and `escalate_if_no_owner`.
- **Never parameterize:** the "never invent an owner or date" guardrail. If a
  deployment asks for inferred owners, that is a different skill, and it needs
  its own acceptance test.
