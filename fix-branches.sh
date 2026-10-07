#!/usr/bin/env bash
LOG="/home/usama/Downloads/phase-2-ai-compass-main/fix-branches.log"
exec > "$LOG" 2>&1

cd /home/usama/Downloads/phase-2-ai-compass-main

echo "=== On branch ==="
git branch --show-current

echo "=== Stage ALL current files (our working tree already has all changes) ==="
git add -A

echo "=== What's staged ==="
git diff --cached --name-only

echo "=== Commit all changes onto main ==="
if git diff --cached --quiet; then
  echo "Nothing new to commit — all changes already in main."
else
  git commit -m "feat: sidebar nav, Firebase auth, SEO improvements

- Left sidebar navigation replaces top navbar with Home link
- Firebase Google sign-in (src/lib/firebase.ts, src/hooks/use-auth.tsx)
- Home page public; Discover/Categories/Compare prompt Google login
- Login modal with Google OAuth (sidebar.tsx, theme-provider.tsx)
- Rewrote metadata.ts: canonical, og:url, og:image, og:site_name,
  twitter card, keywords, robots meta, SITE_URL constants
- JSON-LD on every page: WebSite+SearchAction, BreadcrumbList,
  SoftwareApplication, CollectionPage, ItemList, Organisation
- Richer per-page descriptions and keywords on all 7 routes
- public/sitemap.xml: 83 URLs (5 core + 26 categories + 52 tools)
- public/robots.txt: Sitemap pointer, crawl-delay
- Brand consistently AI Compass throughout"
fi

echo "=== Push main ==="
git push origin main

echo "=== Final log ==="
git log --oneline -6

echo "=== DONE ==="
