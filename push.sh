#!/usr/bin/env bash
LOG="/home/usama/Downloads/phase-2-ai-compass-main/push.log"
exec > "$LOG" 2>&1
set -e
cd /home/usama/Downloads/phase-2-ai-compass-main
git config user.email "kiro@aicompass.app"
git config user.name "Kiro"
git add -A
git diff --cached --name-only
git commit -m "feat: Submit Tool page, Account page, Compare & Find buttons on tool profiles, announcement banner

Tool profile (/tool/:slug):
- Compare button → navigates to /compare?tools=<slug>
- Find similar button → navigates to /find
- Visit Official Site button in heading actions
- 'Add to comparison' button in sidebar

Submit Tool page (/submit):
- Requires Google sign-in (auth gate with sign-in button)
- Form: name, official URL, company, short description, categories, notes
- Validates https:// URL requirement
- Submits to Supabase tool_submissions table
- Success state with 'Submit another' option
- Guidelines panel (no affiliate links, official URLs only)

Account page (/account):
- Shows user avatar, display name, email
- Lists all their own submissions with status badges
- Sign out + Submit a tool buttons
- Redirects to / if not signed in

Announcement banner (global):
- Reads announcement from Supabase site_settings on client load
- Sticky below mobile topbar, dismissable
- Only shows if admin has set an announcement text

Sidebar:
- Added 'Submit Tool' nav item (Send icon, protected)
- Account link in user chip (links to /account)
- Sign out shortened to 'Out' to fit

Footer:
- Added 'Submit a Tool' link
- Dynamic copyright year

Root:
- useState added to imports (was missing — caused compile error)
- AnnouncementBanner component in AppShell

routeTree: /submit and /account registered in all type maps

CSS: profile-actions, submit-guidelines, submit-auth-gate, submit-form,
     submit-success, account-card, account-avatar, account-empty,
     announcement-banner, announcement-close"
git push origin main
echo "=== Done ===" && git log --oneline -4
