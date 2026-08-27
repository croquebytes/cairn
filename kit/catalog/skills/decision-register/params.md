---
name: decision-register-params
type: params
description: "The tailoring surface for decision-register — ID scheme, required fields, storage shape, and what counts as a decider."
---

# Tailoring — decision register

| Parameter | Default | What changes |
|---|---|---|
| `id_prefix` | `D-` | `D-`, `ADR-`, `DEC-`, or a client code. Engineering teams often already use `ADR-` |
| `id_width` | 4 digits | |
| `register_shape` | one file per year | `one file per year`, `one file per decision`, or `single file`. One-per-decision maps cleanly to a SharePoint list item; single-file is easiest to grep and worst to merge |
| `required_fields` | decision, decided, by, basis, source | Making `alternatives` required raises quality and lowers adoption. Pick deliberately |
| `decider_authority` | none | Roles or names whose call constitutes a decision. Same parameter as `../teams-thread-summarizer/`; keep them in sync |
| `scope_tags` | none | `architecture`, `security`, `commercial`, `process`. Becomes the SharePoint choice column |
| `review_interval` | none | Optional revisit date for decisions with a shelf life (vendor choices, capacity plans) |
| `sharepoint_columns` | see below | Column map for tenant import: `Title`, `DecisionID`, `DecidedOn`, `DecidedBy`, `Basis`, `Supersedes`, `Status`, `Scope` |
| `visibility` | vault | `vault`, `team`, or `client-shared`. Client-shared registers need a review step before entries land |
| `basis_required` | `true` | If `false`, entries may omit basis silently. Prefer `true` with `not recorded` as an accepted value — the distinction between "no basis" and "basis not captured" is worth keeping |

## Deployment notes

- **`decider_authority` decides what the register is worth.** Without it, the
  register fills with things that felt decided in a thread, and it stops being
  the answer to "when did we decide that?"
- **`register_shape: one file per decision` for anything heading into
  SharePoint.** One item per list row, version history per decision, and
  supersession as a lookup column. Single-file registers are painful to migrate
  once they are long.
- **Never parameterize:** append-only. There is no `allow_edit`. The moment
  entries can be revised, the register stops being evidence and becomes a
  document, and every audit conversation about it gets harder.
