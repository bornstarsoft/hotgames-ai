#!/bin/sh
set -eu

repo_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
build_dir=$(mktemp -d "${TMPDIR:-/tmp}/hotgames-check.XXXXXX")

# Keep generated files out of the checkout; duplicate output paths are fatal.
HUGO_RESOURCEDIR="$build_dir/resources" hugo \
  --source "$repo_root" \
  --destination "$build_dir/site" \
  --cacheDir "$build_dir/cache" \
  --gc --minify --printPathWarnings --panicOnWarning

git -C "$repo_root" diff --check
if [ -n "$(git -C "$repo_root" ls-files -- public resources/_gen node_modules)" ]; then
  printf '%s\n' 'FAIL: generated output or dependencies are tracked/staged.' >&2
  exit 1
fi

printf 'PASS: warning-free Hugo build and Git hygiene. Output: %s/site\n' "$build_dir"
