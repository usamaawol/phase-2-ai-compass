#!/usr/bin/env bash
LOG="/home/usama/Downloads/phase-2-ai-compass-main/push.log"
exec > "$LOG" 2>&1
set -e
cd /home/usama/Downloads/phase-2-ai-compass-main
git config user.email "kiro@aicompass.app"
git config user.name "Kiro"
git add -A
git diff --cached --name-only
git commit -m "feat: Changelog page, bookmarks, changelog route, sidebar polish

Changelog (/changelog):
- Version history with type badges (feature/improvement/fix)
- Color-coded entries with item lists and check icons
- Sticky roadmap sidebar with planned features
- Submit a Tool link at the bottom

Bookmarks (useBookmarks hook):
- Toggle bookmark on any tool card (heart/bookmark icon)
- Persisted in localStorage (per-uid when signed in, global when guest)
- Bookmark button on ToolCard with saved/unsaved states and accessible labels
- No Supabase migrations needed — pure localStorage for now

Sidebar:
- Added Changelog nav item (ScrollText icon, public)
- Fixed duplicate Info icon — Changelog uses ScrollText, About keeps Info
- All 8 nav items: Home, Discover, Find my AI, Categories, Compare,
  Submit Tool, Changelog, About

Footer:
- Added Changelog link

routeTree: /changelog registered in all type maps and rootRouteChildren

CSS additions:
- .tool-bookmark, .tool-bookmark.saved — bookmark button on tool cards
- .cl-layout, .cl-entry, .cl-entry-meta, .cl-type-* — changelog layout
- .cl-roadmap, .cl-roadmap-list, .cl-planned — roadmap sidebar
- Dark and light mode variants for all cl-type-* badges
- Mobile: single column, unsticky roadmap"
git push origin main
echo "=== Done ===" && git log --oneline -5
