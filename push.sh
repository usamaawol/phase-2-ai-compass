#!/usr/bin/env bash
LOG="/home/usama/Downloads/phase-2-ai-compass-main/push.log"
exec > "$LOG" 2>&1
set -e
cd /home/usama/Downloads/phase-2-ai-compass-main

git config user.email "kiro@aicompass.app"
git config user.name "Kiro"

echo "=== Remove bun.lock so Vercel/npm resolves fresh ==="
rm -f bun.lock

echo "=== Stage ==="
git add -A

echo "=== Changed files ==="
git diff --cached --name-only

echo "=== Commit ==="
if git diff --cached --quiet; then
  echo "Nothing to commit."
else
  git commit -m "fix: bump TanStack to 1.170.41 to fix CVE-2026-102989 XSS

- @tanstack/react-start   1.168.60 → 1.170.41
- @tanstack/router-plugin 1.168.42 → 1.170.41
- @tanstack/react-router  already at 1.170.41
- @tanstack/zod-adapter   ^1.167.0 → ^1.170.41
- Added overrides: @tanstack/start-server-core pinned to 1.170.41
  (forces the vulnerable transitive dep to the patched version)
- @lovable.dev/vite-tanstack-config → latest
- Removed bun.lock so Vercel/npm resolves fresh from package.json
  (Vercel uses npm, not bun — stale lockfile was causing conflicts)"
fi

echo "=== Push ==="
git push origin main

echo "=== Done ==="
git log --oneline -3
