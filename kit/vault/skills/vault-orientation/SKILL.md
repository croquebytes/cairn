---
name: vault-orientation
type: skill
description: "The session-start procedure — read the routing index, load the caps, report vault state, then wait for direction. Load at the beginning of any session, or when you have lost track of what this vault contains."
created: 2026-08-26
status: active
version: 0.1.0
---

# Vault orientation

## Trigger

Session start. Also: "where are we", "what's in the vault", "catch me up", or
any moment you notice you are guessing at the vault's structure.

## Do not load this for

The second question of a session. Orient once. Re-orienting every turn burns
context and tells the user nothing new.

## Procedure

1. Read `../../MOC.md`. That is the routing table — what exists, and where.
2. Read `../safety-limits/SKILL.md`. Those are the caps you operate under.
3. Read `../../../MANIFEST.md` if you have not this session and you expect to
   write.
4. Count, do not read: files in `inbox/raw/`, files in `knowledge/`.
5. Read the **last three lines** of `logs/chronicle.md` and the last line of
   `logs/heartbeat.md`. Not the whole file.
6. Report in the shape below, then ask what to work on. Do not begin work you
   were not asked to do.

## Output

```
Vault | 2026-08-26
Inbox: 3 raw · Knowledge: 12 notes · Skills: 5 core, 8 catalog
Last action: promoted 'graph-delegated-permissions' to knowledge (2026-08-24)
Last batch: inbox sweep, 4 items, 0 errors (2026-08-24)
Flags: none
```

Raise a flag when: the inbox is above 10 items, the chronicle has no entry in
seven days, a batch stopped at a cap and the remainder was never processed, or a
file in `knowledge/` is missing frontmatter.

## Guardrails

- Read counts and tails, not whole directories.
- Never fabricate the report. If `chronicle.md` is empty, say it is empty — a
  new vault has no history, and inventing one is the worst possible first act.
- Caps: see `../safety-limits/SKILL.md`.

## Done when

- [ ] The user has counts, the last action, and any flags
- [ ] Nothing has been written
- [ ] You are waiting for direction
