# Cairn

A second brain any AI can run — safely.

Cairn is a folder of markdown files, a short list of rules, and a set of packaged
skills. Point an AI assistant at it and it can capture, curate, and operate your
knowledge without you handing over custody of it. There is no app, no account,
no database, and nothing to migrate off later, because there is nothing you are
on.

A cairn is a stack of stones marking a path so the next person can follow it.
That is the whole idea.

---

## Quickstart

About ten minutes. No API key, no cloud account, no AI required for the first
success.

```bash
unzip cairn-kit.zip && cd cairn-kit
./scripts/init.sh "My Vault"
```

Once the repository is public you can clone it instead — the kit lives at
`kit/` inside it:

```bash
# git clone https://github.com/croquebytes/cairn.git && cd cairn/kit
```

`init.sh` names the vault, appends the first chronicle entry, starts a fresh git
history, and then runs `check.sh` — a plain POSIX shell script that validates the
vault against the rules in `MANIFEST.md` and prints a health report. If it ends
in `OK`, you have a working vault, with no assistant involved. A system whose
first success depends on a paid API key is not a system you own.

Run `./scripts/check.sh` on its own any time. It is also the health check.

Then open the folder in your assistant of choice and say:

> Read `vault/MOC.md` and give me the vault status.

That routes through `vault/skills/status/` and reports what is in the inbox,
what is in knowledge, and what the last logged action was. From there:

1. Drop a link, an article, or a pasted note into `vault/inbox/raw/`.
2. Run the **ingest** skill — it becomes a structured note with frontmatter.
3. Run the **promote** skill — it moves to `vault/knowledge/` or to
   `vault/inbox/archive/`. Either way a line is appended to the chronicle.

That loop is the entire system. Everything else is a variation on it.

---

## What's in the box

```
cairn-kit/
  MANIFEST.md          the rules — the one file that outranks everything
  CLAUDE.md            adapter: Claude Code / Claude apps
  AGENTS.md            adapter: Codex, Cursor, anything reading AGENTS.md
  vault/
    MOC.md             the routing index — read this first, every session
    knowledge/         curated notes that survived the promote gate
    inbox/raw/         everything lands here first
    inbox/archive/     reviewed, not promoted. Nothing is deleted
    logs/              append-only: chronicle, approvals, heartbeat
    templates/         use these; do not freehand frontmatter
    skills/            the core loop: safety-limits, vault-orientation,
                       ingest, promote, status
    agents/            archivist and scout — role definitions, not personas
  catalog/             packaged, tailorable skills (see below)
  scripts/             init.sh, check.sh, package.sh
```

---

## The five principles

**1. Files are the source of truth.** Markdown with YAML frontmatter, on your
disk. Any editor opens them. Git diffs them. Grep searches them. When the
assistant you use today is replaced by a better one, you change one adapter
file, not your knowledge.

**2. Logs append. Nothing deletes.** Removing an inbox item means moving it to
`archive/`. Every action that changed the vault leaves a line in
`vault/logs/chronicle.md`. The audit trail is not a feature bolted on for
compliance; it is how you trust an automated system at all.

**3. Skills load per task.** `vault/MOC.md` is a routing table. An assistant
reads it, decides what the task needs, and loads that. It does not swallow the
whole vault to answer one question — which is what keeps this usable as the
vault grows.

**4. Guardrails ship on.** `vault/skills/safety-limits/` is enabled by default,
not offered as an exercise for the reader. Batch caps, error caps, no recursion,
and an approval gate on anything that writes outside the vault, sends, installs,
or deletes. **AI drafts, a human sends.**

**5. Any runtime can operate it.** `CLAUDE.md` and `AGENTS.md` are thin adapters
over `MANIFEST.md`. Adding a runtime means adding an adapter, not reorganizing
your knowledge. Curate once, serve every assistant.

---

## The catalog

`catalog/` holds skills packaged the way a consultancy would need them to be
packaged. Each one is a folder with three files:

| File | What it is |
|---|---|
| `SKILL.md` | the procedure — trigger phrases, inputs, steps, and an explicit **negative scope** saying what it must not do |
| `params.md` | the tailoring surface — what a deployer edits per client, per team, per person, without touching the procedure |
| `checklist.md` | the acceptance test — happy path, failure paths, and "does it say *I don't know* when it should" |

That third file is the point. **A skill isn't a prompt. It's a procedure plus
its tailoring parameters plus its acceptance test, packaged so that deploying it
for the next person is configuration, not rework.**

Eight ship in the starter catalog — four generic, four shaped for Microsoft 365:

| Skill | Kind |
|---|---|
| `meeting-notes-summary` | generic |
| `inbox-triage` | generic |
| `weekly-digest` | generic |
| `doc-to-faq` | generic |
| `sharepoint-faq-builder` | Microsoft 365 |
| `teams-thread-summarizer` | Microsoft 365 |
| `policy-change-announcement` | Microsoft 365 |
| `decision-register` | Microsoft 365 |

The Microsoft 365 items run on **pasted or exported content today** — a copied
Teams thread, a downloaded policy document. They are shaped for a tenant, not
connected to one. Wiring them to live data through Microsoft Graph with
delegated permissions is a real project, and this kit does not pretend to have
done it.

`catalog/` is also a valid Claude Code plugin directory — it has a
`.claude-plugin/plugin.json` and a `skills/` folder — so you can install the
whole catalog at once, or copy a single skill folder into any assistant that can
read a markdown procedure.

```bash
./scripts/package.sh     # -> dist/cairn-catalog.zip
```

---

## Microsoft 365

Cairn is a pattern, not a product, which means it does not need its own storage.
A Microsoft 365 tenant already ships a file store with metadata, versioning,
permissions, approvals, scheduling, and an audit log. The pattern maps onto
what a tenant already owns:

| Vault concept | M365 native equivalent |
|---|---|
| Markdown files as source of truth | `.md` files in a SharePoint document library |
| YAML frontmatter | SharePoint metadata columns — indexed, filterable, flow-triggerable |
| Append-only chronicle | A SharePoint list with versioning, plus the Purview unified audit log |
| Git history | SharePoint version history, native, per file |
| Approval gate | Power Automate approvals — the card lands in Teams |
| Scheduler + heartbeat | Scheduled flows plus a run-log list |
| Permission tiers | Entra groups, library permissions, Conditional Access |

Nothing to buy is the strongest pitch there is. The full table, and what it
actually takes to stand up, is on the site under **In your tenant**.

---

## What this is not

- Not a SaaS product. There is no hosted version and no account.
- Not an agent framework. It is a folder and a set of rules that agents obey.
- Not a search engine. It relies on good `description:` frontmatter and a
  routing index rather than an embedding store. Add vector search if you want
  it; the files do not change.
- Not finished. Version 0.1.0. The core loop works; the catalog is a starting
  set, not a complete library.

## License

MIT. Take it, rename it, deploy it for someone else, change every word of it.
That is what a pattern is for.
