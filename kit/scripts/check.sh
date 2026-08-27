#!/bin/sh
# check.sh — validate a Cairn vault against MANIFEST.md.
#
# Plain POSIX shell. No dependencies, no network, no API key, no AI.
# This is the vault's first success and its recurring health check.
#
# Exit 0 = OK (warnings allowed). Exit 1 = errors found.

set -u

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
VAULT="$ROOT/vault"
ERRORS=0
WARNS=0

red()   { printf '\033[31m%s\033[0m\n' "$1"; }
yell()  { printf '\033[33m%s\033[0m\n' "$1"; }
green() { printf '\033[32m%s\033[0m\n' "$1"; }
dim()   { printf '\033[2m%s\033[0m\n' "$1"; }

err()  { red  "  ERROR  $1"; ERRORS=$((ERRORS + 1)); }
warn() { yell "  FLAG   $1"; WARNS=$((WARNS + 1)); }

today=$(date +%Y-%m-%d)

# strip leading zeros so arithmetic does not read them as octal
num() { printf '%s' "$1" | cut -d- -f"$2" | sed 's/^0*\([0-9]\)/\1/'; }

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT INT TERM

echo
echo "Cairn vault check | $today"
dim  "$ROOT"
echo

# ---------------------------------------------------------------- structure
echo "Structure"
for f in MANIFEST.md CLAUDE.md AGENTS.md README.md; do
  [ -f "$ROOT/$f" ] || err "missing $f"
done
for d in knowledge inbox/raw inbox/archive logs templates skills agents; do
  [ -d "$VAULT/$d" ] || err "missing vault/$d/"
done
[ -f "$VAULT/MOC.md" ] || err "missing vault/MOC.md — nothing can route without it"
for s in safety-limits vault-orientation ingest promote status; do
  [ -f "$VAULT/skills/$s/SKILL.md" ] || err "missing vault/skills/$s/SKILL.md"
done
for l in chronicle.md approvals.md heartbeat.md; do
  [ -f "$VAULT/logs/$l" ] || err "missing vault/logs/$l — the audit trail must exist before anything runs"
done
[ "$ERRORS" -eq 0 ] && echo "  ok     all required files and directories present"
echo

# ---------------------------------------------------------------- frontmatter
echo "Frontmatter"
fm_checked=0
find "$VAULT" -name '*.md' -not -path "$VAULT/logs/*" | sort > "$TMP/files"
while IFS= read -r f; do
  rel=${f#"$ROOT"/}
  fm_checked=$((fm_checked + 1))
  head -n 1 "$f" | grep -q '^---$' || { err "$rel — no YAML frontmatter"; continue; }
  for key in name type description; do
    grep -m1 -q "^$key:" "$f" || err "$rel — frontmatter missing '$key:'"
  done
  desc=$(grep -m1 '^description:' "$f" | cut -d: -f2- | sed 's/^ *//; s/^"//; s/"$//')
  case "$desc" in
    "") : ;;                       # already reported above
    ?????????????????????*) : ;;   # >= 21 chars
    *) warn "$rel — description is $(printf '%s' "$desc" | wc -c | tr -d ' ') chars; routing reads this field, make it specific" ;;
  esac
  grep -q '<YYYY-MM-DD>\|<kebab-case-slug>\|<slug>' "$f" && \
    case "$rel" in
      */templates/*) : ;;
      *) warn "$rel — unfilled template placeholder" ;;
    esac
done < "$TMP/files"
echo "  ok     $fm_checked markdown files checked"
echo

# ---------------------------------------------------------------- naming
echo "Naming"
for f in "$VAULT"/knowledge/*.md; do
  [ -e "$f" ] || continue
  b=$(basename "$f")
  echo "$b" | grep -Eq '^[a-z0-9]+(-[a-z0-9]+)*-[0-9]{4}-[0-9]{2}\.md$' || \
    warn "vault/knowledge/$b — expected {slug}-{YYYY-MM}.md"
done
for f in "$VAULT"/inbox/raw/*.md; do
  [ -e "$f" ] || continue
  b=$(basename "$f")
  echo "$b" | grep -Eq '^[a-z0-9]+(-[a-z0-9]+)*-[0-9]{4}-[0-9]{2}-[0-9]{2}-raw\.md$' || \
    warn "vault/inbox/raw/$b — expected {slug}-{YYYY-MM-DD}-raw.md"
done
echo "  ok     filenames checked"
echo

# ---------------------------------------------------------------- catalog
echo "Catalog"
cat_count=0
if [ -d "$ROOT/catalog/skills" ]; then
  for d in "$ROOT/catalog/skills"/*/; do
    [ -d "$d" ] || continue
    cat_count=$((cat_count + 1))
    n=$(basename "$d")
    for req in SKILL.md params.md checklist.md; do
      [ -f "$d$req" ] || err "catalog/skills/$n — missing $req (a skill without its $req is a prompt)"
    done
  done
  [ -f "$ROOT/catalog/.claude-plugin/plugin.json" ] || warn "catalog/.claude-plugin/plugin.json missing — catalog will not install as a plugin"
fi
echo "  ok     $cat_count catalog skills, each with procedure + params + acceptance test"
echo

# ---------------------------------------------------------------- blind spots
echo "Blind spots"
raw=$(find "$VAULT/inbox/raw" -name '*.md' | wc -l | tr -d ' ')
arch=$(find "$VAULT/inbox/archive" -name '*.md' | wc -l | tr -d ' ')
kn=$(find "$VAULT/knowledge" -name '*.md' | wc -l | tr -d ' ')

[ "$raw" -gt 10 ] && warn "inbox has $raw raw items — capture is outrunning curation"

if [ -f "$VAULT/logs/chronicle.md" ]; then
  last=$(grep -Eo '^- [0-9]{4}-[0-9]{2}-[0-9]{2}' "$VAULT/logs/chronicle.md" | tail -n 1 | cut -d' ' -f2)
  if [ -z "${last:-}" ]; then
    warn "chronicle has no dated entries — new vault, or things are happening unlogged"
  else
    # days since, without GNU date
    ty=$(num "$today" 1); tm=$(num "$today" 2); td=$(num "$today" 3)
    ly=$(num "$last"  1); lm=$(num "$last"  2); ld=$(num "$last"  3)
    days=$(( (ty - ly) * 365 + (tm - lm) * 30 + (td - ld) ))
    [ "$days" -gt 7 ] && warn "no chronicle entry in roughly $days days"
  fi
fi

if [ -s "$VAULT/MOC.md" ] && [ "$kn" -gt 0 ]; then
  newer=$(find "$VAULT/knowledge" -name '*.md' -newer "$VAULT/MOC.md" | wc -l | tr -d ' ')
  [ "$newer" -gt 0 ] && warn "$newer knowledge note(s) newer than MOC.md — the routing table is stale, and stale routing still gets trusted"
fi

[ "$WARNS" -eq 0 ] && echo "  ok     no flags"
echo

# ---------------------------------------------------------------- report
echo "Counts"
echo "  knowledge $kn · inbox $raw raw, $arch archived · core skills 5 · catalog $cat_count"
echo

if [ "$ERRORS" -gt 0 ]; then
  red "FAILED — $ERRORS error(s), $WARNS flag(s)"
  echo "Errors are rule violations from MANIFEST.md. Fix them before letting an assistant write."
  exit 1
fi

if [ "$WARNS" -gt 0 ]; then
  green "OK — $WARNS flag(s)"
  echo "Flags are things the vault noticed about itself. None of them block."
else
  green "OK"
fi
exit 0
