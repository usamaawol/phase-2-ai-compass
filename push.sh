#!/usr/bin/env bash
LOG="/home/usama/Downloads/phase-2-ai-compass-main/push.log"
exec > "$LOG" 2>&1
set -e
cd /home/usama/Downloads/phase-2-ai-compass-main
git config user.email "kiro@aicompass.app"
git config user.name "Kiro"

echo "=== Remove .env from git tracking (keep the file locally) ==="
git rm --cached .env 2>/dev/null || echo ".env was not tracked"

echo "=== Stage all changes ==="
git add -A

echo "=== Changed files ==="
git diff --cached --name-only

echo "=== Commit ==="
if git diff --cached --quiet; then
  echo "Nothing to commit."
else
  git commit -m "fix: redesigned sidebar, fixed mobile, removed .env from git, Vercel config

Sidebar redesign:
- Brand shows icon with primary-color background + glow, name + tagline
- Nav items have icon wrapper, hover slide effect, active right-edge pip
- Active items highlighted with primary tint background
- Sign-in button styled with primary border/glow, hover lift
- User chip shows Google avatar with primary border ring
- Smooth drawer animation with spring cubic-bezier
- Mobile drawer width 260px, blurred backdrop

Mobile fixes:
- Removed 0px sidebar width on mobile so page-area fills full screen
- Mobile topbar height 56px, sticky, subtle shadow
- Hero h1 scales down to 38px on mobile (was overflowing)
- Hamburger button has proper hover state
- shell padding reduced on mobile for more content space

Firebase on Vercel:
- .env removed from git tracking (still exists locally)
- .gitignore already blocks future .env commits
- vercel.json created with rewrites, caching headers, build config
- Add VITE_FIREBASE_* vars in Vercel dashboard → Settings → Environment Variables

Style cleanup:
- Complete styles.css rewrite with all sections consolidated
- Old sidebar CSS classes replaced with new nav-* classes
- Admin CSS fully preserved"
fi

echo "=== Push ==="
git push origin main

echo "=== Done ==="
git log --oneline -4
