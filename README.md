# Cairn

**A second brain any AI can run — safely.**

Plain files. Clear rules. Packaged skills. No lock-in.

**[cairn-board.netlify.app](https://cairn-board.netlify.app)** — the board.

---

Cairn is a folder of markdown files, a short list of rules, and a set of
packaged skills. Point an AI assistant at it and it can capture, curate, and
operate your knowledge without you handing over custody of it. There is no app,
no account, no database, and nothing to migrate off later, because there is
nothing you are on.

A cairn is a stack of stones marking a path so the next person can follow it.
That is the whole idea.

## What's here

| | |
|---|---|
| **[`kit/`](kit/)** | The starter kit — the rules, two runtime adapters, a vault, five core skills, two agent roles, and a catalog of eight packaged skills. This is the substance |
| **[`site/`](site/)** | The board at cairn-board.netlify.app. Static HTML, one stylesheet, no framework, no build step |

## Try the kit

About ten minutes. No API key, no cloud account, and no AI needed for the first
success — a plain POSIX shell script validates the vault and prints a health
report.

```bash
git clone https://github.com/croquebytes/cairn.git
cd cairn/kit
./scripts/init.sh "My Vault"
```

`init.sh` names the vault, writes the first chronicle entry, starts a fresh git
history, and runs `check.sh`. If it ends in `OK`, you have a working vault. A
system whose first success depends on a paid API key is not a system you own.

Then open the folder in whatever assistant you use and say:

> Read `vault/MOC.md` and give me the vault status.

Prefer a download? The board serves the same thing as a zip:
[cairn-kit.zip](https://cairn-board.netlify.app/cairn-kit.zip).

Full detail in **[`kit/README.md`](kit/README.md)**.

## The five principles

1. **Files are the source of truth.** Markdown with YAML frontmatter, on your
   disk. When the assistant you use today is replaced by a better one, you
   change one adapter file, not your knowledge.
2. **Logs append. Nothing deletes.** Removing an inbox item means moving it to
   `archive/`. An audit trail you can edit isn't an audit trail.
3. **Skills load per task.** `vault/MOC.md` is a routing table, so the vault
   stays usable as it grows.
4. **Guardrails ship on.** Batch caps, error caps, no recursion, and an approval
   gate on anything that writes outside the vault, sends, installs, or deletes.
   AI drafts, a human sends.
5. **Any runtime can operate it.** `CLAUDE.md` and `AGENTS.md` are thin adapters
   over one rulebook. Curate once, serve every assistant.

## A skill isn't a prompt

Every item in [`kit/catalog/`](kit/catalog/) ships three files: the procedure,
its tailoring parameters, and its acceptance test. That third file is the point
— it's the difference between a demo and something you'd deploy for someone
else.

Four are generic; four are shaped for Microsoft 365 and run on pasted or
exported content today. They are shaped for a tenant, not connected to one, and
the site says so plainly.

## Working on the site

```bash
python3 -m http.server 4173 --directory site
```

No build step. Netlify builds from `site/` via `netlify.toml`; pushing to `main`
deploys.

When you change `site/assets/*`, bump the `?v=` string on the asset links in the
three HTML files, or returning visitors get stale CSS from cache.

## License

MIT. Take it, rename it, deploy it for someone else, change every word of it.
That is what a pattern is for.
