---
name: example-capture-2026-08-26-raw
type: inbox
description: "A worked example of an inbox note — what capture looks like before the promote gate sees it. Archive it once you have real items."
created: 2026-08-26
status: raw
source: original
captured_by: human
skill_candidate: false
---

# Example capture

## Source

Written by hand as part of the starter kit. Not fetched from anywhere.

## Summary

This file exists so that the first time you run the promote skill, it has
something real to act on. It is a normal inbox note in every respect: it has
frontmatter a routing pass can read, a summary written in the capturer's own
words rather than copied, an honest paragraph about whether it deserves to be
kept, and no content pretending to be knowledge yet.

## Claims worth checking

- That the promote skill will archive this rather than promote it — it fails the
  "durable" and "actionable or explanatory" criteria on purpose. Run
  `promote` and see whether the assistant reaches that verdict. If it promotes
  this note, the assistant is not applying the gate, and that is worth knowing
  on day one rather than in month six.

## Why it might be worth keeping

It shouldn't be. This is a fixture. The correct outcome is `inbox/archive/`,
with a chronicle line saying so.

## Raw

_No external source to quote._
