---
name: <skill-name>
type: skill
description: "<When to load this skill. Written so an assistant scanning the MOC can tell whether this is the right one — include the trigger phrases a user would actually say.>"
created: <YYYY-MM-DD>
status: active
version: 0.1.0
---

# <Skill name>

## Trigger

Load this when: <situations, and the phrases a user says>

## Do not load this for

<Explicit negative scope. A skill without this section will be loaded for the
wrong things.>

## Inputs

| Input | Required | Notes |
|---|---|---|
| <name> | yes/no | <where it comes from> |

## Procedure

1. <Step. Imperative. One action.>
2. <Step.>

## Output

<Exactly what gets produced and where it lands.>

## Guardrails

- <What this skill must never do>
- Caps: see `../safety-limits/SKILL.md`

## Done when

- [ ] <a checkable condition>
