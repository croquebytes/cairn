#!/bin/sh
# package.sh — zip the catalog for distribution.
#
# Produces dist/cairn-catalog.zip — the catalog directory, installable as a
# Claude Code plugin or unpacked skill-by-skill into any assistant.

set -eu

ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
DIST="$ROOT/dist"

command -v zip >/dev/null 2>&1 || { echo "zip not found" >&2; exit 1; }

# refuse to package a catalog that fails its own contract
sh "$ROOT/scripts/check.sh" >/dev/null || {
  echo "check.sh failed — fix the errors before packaging" >&2
  exit 1
}

mkdir -p "$DIST"
rm -f "$DIST/cairn-catalog.zip"

( cd "$ROOT" && zip -qr "$DIST/cairn-catalog.zip" catalog -x '*.DS_Store' )

echo "dist/cairn-catalog.zip"
unzip -l "$DIST/cairn-catalog.zip" | tail -n 1
