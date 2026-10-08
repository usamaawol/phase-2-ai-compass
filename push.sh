#!/usr/bin/env bash
LOG="/home/usama/Downloads/phase-2-ai-compass-main/push.log"
exec > "$LOG" 2>&1
set -e
cd /home/usama/Downloads/phase-2-ai-compass-main
git config user.email "kiro@aicompass.app"
git config user.name "Kiro"
git add -A
git diff --cached --name-only
git commit -m "feat: Saved Tools, Privacy, Terms, footer redesign, sitemap update

New pages:
- /saved — view all bookmarked tools, clear all, empty state
- /privacy — full privacy policy (Firebase Auth, Supabase, no tracking)
- /terms — full terms of service (submissions policy, accuracy disclaimer)

Footer redesign:
- Three-column layout: Explore / Community / Legal
- Section headings (EXPLORE, COMMUNITY, LEGAL)
- All major pages linked including Privacy and Terms

Sidebar:
- Added Saved nav item (Bookmark icon, protected)
- 9 nav items total: Home, Discover, Find my AI, Categories, Compare,
  Saved, Submit Tool, Changelog, About
- Login modal Terms + Privacy links updated to link to /terms and /privacy

routeTree:
- /saved, /privacy, /terms registered in all type maps

CSS:
- .footer-nav, .footer-nav-col, .footer-nav-heading, .footer-nav-link
- .saved-empty, .saved-header
- Mobile footer wraps to column

public/sitemap.xml:
- Recreated with all 95 URLs: 10 core + 26 categories + 52 tools + 7 utility
  (find, compare, submit, changelog, about, privacy, terms)"
git push origin main
echo "=== Done ===" && git log --oneline -4
