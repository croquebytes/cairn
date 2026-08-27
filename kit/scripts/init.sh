#!/bin/sh
# init.sh — personalize a fresh Cairn vault.
#
# Usage:  ./scripts/init.sh "My Vault"
#
# Names the vault, writes the first chronicle entry, starts a fresh git history,
# and runs the health check. No network, no dependencies, no API key.

set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
VAULT_NAME=${1:-}

if [ -z "$VAULT_NAME" ]; then
  printf 'Usage: %s "My Vault"\n' "$0" >&2
  exit 2
fi

today=$(date +%Y-%m-%d)

echo
echo "Cairn init"
echo "  vault name : $VAULT_NAME"
echo "  date       : $today"
echo "  root       : $ROOT"
echo

# ------------------------------------------------------------------ personalize
printf '%s\n' "$VAULT_NAME" > "$ROOT/vault/.vault-name"

# The chronicle is append-only, including here. init.sh adds a line; it never
# rewrites the file, because the first thing this vault teaches is that logs
# are appended to.
printf -- '- %s · init · vault personalized as "%s" · scripts/init.sh\n' \
  "$today" "$VAULT_NAME" >> "$ROOT/vault/logs/chronicle.md"
echo "  appended the first chronicle entry"

# ------------------------------------------------------------------ git
if [ -d "$ROOT/.git" ]; then
  echo "  git        : existing repository left alone"
elif command -v git >/dev/null 2>&1; then
  git -C "$ROOT" init -q
  git -C "$ROOT" add -A
  git -C "$ROOT" -c user.name="Cairn" -c user.email="cairn@localhost" \
      commit -qm "Initial vault: $VAULT_NAME"
  echo "  git        : fresh history, one commit"
else
  echo "  git        : not installed, skipped"
fi

# Keep the routing table newer than the notes it routes so the staleness check
# starts clean.
touch "$ROOT/vault/MOC.md"

echo
echo "Next:"
echo "  ./scripts/check.sh"
echo "  then open this folder in your assistant and say:"
echo "  \"Read vault/MOC.md and give me the vault status.\""
echo

sh "$ROOT/scripts/check.sh"
