---
name: moc
type: index
description: "Map of contents — the routing table for this vault. Read this at the start of every session, then load only what the task needs."
created: 2026-08-26
status: active
---

# MOC — map of contents

The routing table. An assistant reads this file first, decides what the task
needs, and loads that. Loading the whole vault to answer one question is the
failure mode this file exists to prevent.

Keep it current. A stale MOC is worse than no MOC, because it is trusted.

## Rules

`../MANIFEST.md` — the constitution. Read before your first write of a session.

## Skills — the core loop

| Skill | Load when | Path |
|---|---|---|
| **safety-limits** | before any batch, scheduled, or automated run | `skills/safety-limits/` |
| **vault-orientation** | session start, or you have lost context | `skills/vault-orientation/` |
| **ingest** | raw content needs to become a structured inbox note | `skills/ingest/` |
| **promote** | inbox items need a promote-or-archive decision | `skills/promote/` |
| **status** | someone asks how the vault is doing | `skills/status/` |

## Agents

Roles, not personalities. Load a soul file when acting in that role.

| Agent | Role | Path |
|---|---|---|
| **Archivist** | curation — decides what earns a place in `knowledge/` | `agents/archivist/soul.md` |
| **Scout** | discovery — finds candidate material and lands it in the inbox | `agents/scout/soul.md` |

## Knowledge

`knowledge/` — curated notes, one topic per file, named `{slug}-{YYYY-MM}.md`.
As the vault grows, add a section here grouping notes by domain so routing
stays cheap. Right now there is one starter note:

| Note | About |
|---|---|
| `knowledge/how-this-vault-works-2026-08.md` | the four movements, explained as a note inside the vault they describe |

## Inbox

| Path | What is in it |
|---|---|
| `inbox/raw/` | captured, not yet judged |
| `inbox/archive/` | reviewed, not promoted. Never deleted |

## Logs — append only

| Log | What gets appended |
|---|---|
| `logs/chronicle.md` | every action that changed the vault |
| `logs/approvals.md` | every gated action a human approved, and what was approved |
| `logs/heartbeat.md` | scheduled or batch runs: task, time, outcome, counts |

## Templates

Use these. Do not freehand frontmatter.

`templates/knowledge.md` · `templates/inbox.md` · `templates/skill.md` ·
`templates/agent.md`

## Catalog

`../catalog/` — packaged skills, each with a procedure, a `params.md` tailoring
surface, and a `checklist.md` acceptance test. Not loaded automatically. Read
`../catalog/README.md` for the index.
