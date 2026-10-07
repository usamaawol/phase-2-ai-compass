#!/usr/bin/env bash
LOG="/home/usama/Downloads/phase-2-ai-compass-main/push.log"
exec > "$LOG" 2>&1
set -e
cd /home/usama/Downloads/phase-2-ai-compass-main
git config user.email "kiro@aicompass.app"
git config user.name "Kiro"

echo "=== Current HEAD ==="
git log --oneline -2

echo "=== Stage all ==="
git add -A

echo "=== Changed files ==="
git diff --cached --name-only

echo "=== Commit ==="
if git diff --cached --quiet; then
  echo "Nothing new — forcing a no-op commit to trigger Vercel redeploy"
  git commit --allow-empty -m "chore: trigger Vercel redeploy with latest fixes

Ensures Vercel picks up:
- package.json: @tanstack/react-start 1.170.41, @lovable.dev/vite-tanstack-config 2.25.2
- .npmrc: legacy-peer-deps=true
- vercel.json: installCommand with --legacy-peer-deps
- @tanstack/start-server-core override 1.170.41 (CVE-2026-102989 fix)"
else
  git commit -m "feat: /find page, sidebar polish, Find my AI nav item

New /find route — task-based AI recommendation engine:
- Describe any task in plain English, get matched tools instantly
- Transparent keyword/category/tag scoring (no black box)
- Best match highlighted, good options + alternatives sections
- 12 suggestion chips to get started fast
- Mobile-responsive 3-col → 1-col grid
- Breadcrumb + SEO head with JSON-LD

Sidebar:
- Added 'Find my AI' nav item (Lightbulb icon) between Discover and Categories
- /find is protected (requires Google sign-in)

CSS: find-search-wrap, find-card, find-card-best, find-grid, find-suggestion-chip etc.

routeTree.gen.ts: /find route registered in all type maps + rootRouteChildren

package.json (already pushed, confirming):
- @tanstack/react-start 1.170.41 (CVE fix)
- @lovable.dev/vite-tanstack-config 2.25.2 (peer dep fix)
- overrides: @tanstack/start-server-core 1.170.41
- .npmrc: legacy-peer-deps=true
- vercel.json: installCommand with --legacy-peer-deps"
fi

echo "=== Push ==="
git push origin main

echo "=== Done ==="
git log --oneline -5
