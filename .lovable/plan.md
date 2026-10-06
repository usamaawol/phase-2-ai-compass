# AI Compass — Phases 2–5

## What will be added

Preserve AI Compass branding and the existing light and dark designs. Complete the remaining discovery features, add task-based recommendations and comparison, then connect the catalog to secure administration.

### Phase 2 — Complete discovery
- Preserve the 26 categories, filtering, sorting, category pages and tool profiles.
- Move the catalog into Lovable Cloud so approved admin changes appear across the website.
- Keep existing sample records clearly marked as demo data; do not invent pricing, popularity or verification claims.

### Phase 3 — Find the right AI
- Add `/find` with a task-description form, suggested tasks and useful empty states.
- Recommend tools using transparent keyword/category/capability matching, not an external AI service.
- Show Best Match, Other Good Options and Alternative Tools with explanations. Scores indicate task relevance, not quality or verified performance.

### Phase 4 — Compare tools
- Let users select up to four tools from discovery, categories, recommendations and tool profiles.
- Add a shared comparison tray with remove and clear controls.
- Replace the comparison placeholder with a side-by-side table and a rule-based “Which one should you choose?” summary.
- Show “Not available” when data is missing and label illustrative demo values.

### Phase 5 — Accounts and administration
- Add secure sign-in, sign-out and registered-user profiles with display name, avatar URL and preferences.
- Add an account page for users to edit their own profile; ordinary users cannot access administration.
- Add the requested admin menu:
  - **Dashboard:** catalog counts, verification status and pending submissions.
  - **AI Tools:** add, edit, delete with confirmation, and manually verify tool details.
  - **Categories:** manage category names, descriptions and tool assignments.
  - **Tags:** manage tags and tool assignments.
  - **Featured Tools:** select and order homepage featured tools.
  - **Submissions:** review submitted tools, approve into the catalog or reject with a reason.
  - **Settings:** edit supported public site settings without exposing credentials or weakening access controls.
- Add a signed-in tool-submission page; submissions stay private until an administrator approves them.
- Verification records the administrator’s manual review and review date, not an automated audit or endorsement.

## Access and setup
- Lovable Cloud will provide persistent catalog storage, profiles, submissions and secure accounts.
- Keep administrator permissions separate from profile information and enforce them on the server and stored data.
- Never grant admin rights through public signup or automatically make the first registrant an admin.
- After an account exists, securely assign the owner’s administrator permission through the managed setup process; owner identity is required before that step.
- Default sign-in is Google. Email/password can be added if explicitly requested; signup never bypasses confirmation silently.

## Technical details
- Keep typed, browser-safe catalog models and matching utilities; use authenticated server functions for private operations and narrow public reads for approved catalog records.
- Store categories, tags, tools, their relationships, featured ordering, submissions, settings, profiles and separate roles in Cloud with explicit permissions and row-level security.
- Seed the existing demo catalog in the initial schema migration, not on page load.
- Use the managed protected-route layout for account/admin pages and validate administrator roles on every privileged operation.
- Keep discovery and comparison selection in validated URL parameters; preserve existing public URLs.
- Give each new content page its own title and sharing metadata.

## Checks
- Test matching and comparison limits, missing-data states, and discovery filters.
- Check sign-in/sign-out, profile ownership, admin access restrictions, tool management and submission approval.
- Check that approved changes appear on public pages and that private submissions are never publicly readable.
- Check page layouts and controls in both light and dark modes.