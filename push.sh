#!/usr/bin/env bash
LOG="/home/usama/Downloads/phase-2-ai-compass-main/push.log"
exec > "$LOG" 2>&1
set -e

cd /home/usama/Downloads/phase-2-ai-compass-main

git config user.email "kiro@aicompass.app"
git config user.name "Kiro"
git remote set-url origin https://github.com/usamaawol/phase-2-ai-compass.git

echo "=== Staging all changes ==="
git add -A

echo "=== Changed files ==="
git diff --cached --name-only

echo "=== Committing ==="
if git diff --cached --quiet; then
  echo "Nothing to commit."
else
  git commit -m "feat: left sidebar nav + Firebase Google auth + SEO

Navigation:
- Replaced top navbar with fixed left sidebar
- Added Home button as first nav item
- Sidebar has: Home, Discover, Categories, Compare, About
- Locked items (Discover/Categories/Compare) show padlock and trigger login modal

Firebase Auth:
- src/lib/firebase.ts — Firebase app init with env var guard
- src/hooks/use-auth.tsx — AuthProvider + useAuth hook (lazy-loads firebase)
- Google sign-in popup with 'select_account' prompt
- Home page and About are public; Discover/Categories/Compare require login

UI:
- Login modal with Google OAuth button, error state, close on backdrop click
- User avatar + display name shown in sidebar when signed in
- Sign out button in sidebar
- Mobile: sticky top bar with hamburger, slide-in drawer
- Theme toggle (dark/light) in sidebar bottom
- src/components/compass/theme-provider.tsx — ThemeProvider context

SEO (src/lib/metadata.ts):
- Canonical URLs, og:url, og:image, og:site_name, twitter cards
- keywords and robots meta on every page
- JSON-LD: WebSite+SearchAction, BreadcrumbList, SoftwareApplication,
  CollectionPage, ItemList, Organisation schemas
- public/sitemap.xml — 83 URLs (5 core + 26 categories + 52 tools)
- public/robots.txt — Sitemap pointer + crawl-delay"
fi

echo "=== Pushing to origin/main ==="
git push origin main

echo "=== Done ==="
git log --oneline -4
