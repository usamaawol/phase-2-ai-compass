#!/usr/bin/env bash
LOG="/home/usama/Downloads/phase-2-ai-compass-main/push.log"
exec > "$LOG" 2>&1
set -e
cd /home/usama/Downloads/phase-2-ai-compass-main
git config user.email "kiro@aicompass.app"
git config user.name "Kiro"
git add -A
echo "=== Staged ==="
git diff --cached --name-only
git commit -m "fix: resolve npm peer dep conflict on Vercel

- Pinned @lovable.dev/vite-tanstack-config back to 2.25.2
  (latest=2.26.0 has incompatible peer dep declaration with 1.170.41)
- Added .npmrc with legacy-peer-deps=true
- Added installCommand to vercel.json: npm install --legacy-peer-deps
- @tanstack/start-server-core override 1.170.41 kept (CVE fix)"
git push origin main
echo "=== Done ==="
git log --oneline -3
