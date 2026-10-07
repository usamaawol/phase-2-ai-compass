#!/usr/bin/env bash
LOG="/home/usama/Downloads/phase-2-ai-compass-main/push.log"
exec > "$LOG" 2>&1
set -e

cd /home/usama/Downloads/phase-2-ai-compass-main

git config user.email "kiro@aicompass.app"
git config user.name "Kiro"
git remote set-url origin https://github.com/usamaawol/phase-2-ai-compass.git

echo "=== Current branch ==="
git branch --show-current

echo "=== Staging all changes ==="
git add -A

echo "=== Staged files ==="
git diff --cached --name-only

echo "=== Committing ==="
if git diff --cached --quiet; then
  echo "Nothing to commit — working tree clean."
else
  git commit -m "feat: admin dashboard, Firebase rules, SEO, performance

Admin panel (/admin):
- AdminLayout with auth guard (blocks non-admins, redirects unauthenticated)
- Dashboard with stat cards (tools, published, drafts, needs review, subs)
- AI Tools list with search, filter by status, inline actions (publish, verify,
  feature, trend, archive, delete)
- Add tool form + Edit tool form (ToolForm covers all 30+ fields)
- Categories page with inline add/edit/delete
- Tags page with add/delete chip UI
- Featured tools page with drag-order (up/down arrows)
- Submissions page with preview modal, approve, reject
- Settings page (tagline, announcement banner, submissions toggle)
- Admin link shown in public sidebar for signed-in users

Routing:
- Fixed __root.tsx to skip public sidebar+footer for /admin routes
- Fixed routeTree.gen.ts _addFileChildren (object not array)
- All admin routes registered and typed

Firebase Security Rules:
- firebase.rules — Firestore rules for tools, categories, tags,
  admin_users, users/bookmarks, tool_submissions, site_settings
- firebase.storage.rules — Storage rules for tool logos and avatars
- firebase.json — Firebase hosting + rules deploy config
- firebase.indexes.json — empty indexes scaffold
- .env.example — safe template (real .env now gitignored)

Security:
- Added .env to .gitignore (prevents committing real API keys)
- Added .env.example as safe reference template

SEO:
- dns-prefetch added for Google Fonts origins
- Reduced Geist font weights to only those used (400,500,550,600,650,700)

Performance (vite.config.ts):
- manualChunks: vendor-react, vendor-router, vendor-radix, vendor-icons,
  vendor-firebase split for better long-term caching
- chunkSizeWarningLimit raised to 800kb

UI:
- Admin link (shield icon) shown next to user name in public sidebar
- sidebar.tsx imports ShieldCheck icon for admin navigation"
fi

echo "=== Pushing to origin/main ==="
git push origin main

echo "=== Final log ==="
git log --oneline -5

echo "=== DONE ==="
