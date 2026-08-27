---
name: status
type: skill
description: "Report vault health — inbox depth, knowledge count, last actions, and the blind spots the vault can detect about itself. Load when the user asks for status, health, how the vault is doing, or what needs attention."
created: 2026-08-26
status: active
version: 0.1.0
---

# Status

A system that cannot report its own condition cannot be trusted to run
unattended. This skill is the vault's self-report, including the parts that are
unflattering.

## Trigger

"Status" · "health" · "how's the vault" · "what needs attention" · a scheduled
health check.

## Do not load this for

Content questions. This reports on the vault's condition, not on what is in it.

## Procedure

1. Run `../../../scripts/check.sh` if a shell is available — it does the
   structural checks faster and without judgement. Report its findings.
2. Count `inbox/raw/`, `inbox/archive/`, `knowledge/`, `skills/`,
   `../../catalog/skills/`.
3. Read the tail of each log: `logs/chronicle.md` (last 3),
   `logs/heartbeat.md` (last 1), `logs/approvals.md` (last 1).
4. **Look for blind spots.** These are the findings that matter:

   | Signal | What it means |
   |---|---|
   | Inbox above 10 | Capture is outrunning curation |
   | Inbox items older than 14 days | The promote gate is not being run |
   | No chronicle entry in 7 days | Nothing is happening, or things are happening unlogged — the second is worse |
   | A batch stopped at a cap, remainder never processed | Work was silently dropped |
   | Files in `knowledge/` with no frontmatter, or with `description:` under 20 characters | Routing is degrading |
   | Two notes whose `description:` fields overlap | Probable duplicate; the promote gate leaked |
   | `MOC.md` not updated since the last knowledge file was added | The routing table is stale, and stale routing is trusted routing |
   | Approvals log empty while the chronicle shows gated actions | The gate was bypassed. This is the serious one |

5. Report. Lead with flags; counts go underneath. If there are no flags, say
   "no flags" — do not manufacture concern.

## Output

```
Vault | 2026-08-26
Inbox: 3 raw, 41 archived · Knowledge: 12 · Skills: 5 core, 8 catalog
Last action: promoted 'graph-delegated-permissions' (2026-08-24)
Last batch: inbox sweep, 4 items, 0 errors (2026-08-24)

Flags
  ! MOC.md not updated since 2026-08-12; 3 knowledge notes added since
  ! 2 inbox items older than 14 days
```

## Guardrails

- Read-only. This skill never writes, moves, or fixes. It reports, and it offers
  to fix in a separate step the user approves.
- Never report a number you did not count.
- An empty vault is not a problem. Say "new vault, no history yet".

## Done when

- [ ] Counts are real
- [ ] Every blind-spot check above was run and its result stated
- [ ] Nothing was modified
