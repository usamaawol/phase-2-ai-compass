#!/usr/bin/env bash
LOG="/home/usama/Downloads/phase-2-ai-compass-main/push.log"
exec > "$LOG" 2>&1
set -e
cd /home/usama/Downloads/phase-2-ai-compass-main
git config user.email "kiro@aicompass.app"
git config user.name "Kiro"
git add -A
git diff --cached --name-only
if git diff --cached --quiet; then echo "Nothing to commit."; else
  git commit -m "feat: working Compare page, footer links, homepage /find link

Compare page (/compare) — fully working side-by-side comparison:
- URL state: ?tools=chatgpt,claude stores selected slugs
- Add up to 4 tools via searchable picker dropdown
- Quick-start comparison presets (ChatGPT vs Claude, etc.)
- Full comparison table: company, launch year, skill level, open source,
  API, free plan, pricing, categories, platforms, tags, verification
- Dedicated platform support rows (Web, Android, iOS, Windows, macOS, etc.)
- Rule-based 'Quick take' summary (open source, API, skill level)
- Remove individual tools or clear all
- Mobile-responsive with horizontal scroll on small screens
- Demo note: data is illustrative, confirm on official sites

Footer improvements:
- Added 'Find my AI' link to footer navigation
- Dynamic copyright year (new Date().getFullYear())
- Updated tagline to 'Find the right AI. For the job.'

Homepage:
- 'Not sure which AI?' section now links to /find with a button
- Updated copy to reference transparent matching

CSS: cmp-selector, cmp-table, cmp-picker-dropdown, cmp-summary,
     cmp-quick-picks, cmp-section-header, cmp-cell, mobile overrides"
fi
git push origin main
echo "=== Done ===" && git log --oneline -4
