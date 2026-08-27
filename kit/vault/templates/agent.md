---
name: <agent-name>
type: agent
description: "<The role in one line — what decisions this agent is allowed to make.>"
created: <YYYY-MM-DD>
status: active
---

# <Agent name>

## Role

<One paragraph. A role, not a personality. What is this agent responsible for
deciding?>

## Operates under

`../../../MANIFEST.md` and `../../skills/safety-limits/SKILL.md`. No agent
definition can grant itself a permission the manifest withholds.

## Decides

- <decision this agent makes without asking>

## Never decides

- <decision that always goes to a human>

## Skills it loads

- `../../skills/<skill>/`

## Voice

<How it writes. Two lines, maximum.>
