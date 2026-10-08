# AI Compass — Phases 1 and 2

## Phase 1: Visual foundation

- Build the homepage under the **AI Compass** brand with the tagline **Find the Right AI for the Job.**
- Use a near-black interface, white and gray text, one vivid accent, readable modern sans-serif typography, and subtle animations.
- Include prominent task search, quick categories, featured tools, a task-discovery section, and a consistent compass-inspired logo.
- Create shared navigation and footer, with dedicated Discover, Categories, Compare, and About pages. Compare will explain its upcoming availability, not simulate a working comparison engine.
- Make navigation, search, cards, and page layouts accessible and comfortable on desktop and mobile.

## Phase 2: Discovery experience

- Add the 26 categories from the second document, supporting multiple categories per tool.
- Build search and filters for categories, tags, pricing, open-source status, platform, and skill level, plus Popular, Newest, and A–Z sorting.
- Build category pages and tool profiles with capabilities, related tools, and safe links to official websites.
- Include clear empty states and reset controls.
- Use clearly identified demo records for information that has not been checked. Do not invent ratings, prices, or verification badges.

## Technical details

- Use reusable navigation, search, category, and tool-card components with shared design tokens.
- Start with typed, bundled tool and category records; keep the data model ready for persistent storage later. No database or external APIs in this build.
- Store discovery filters in the URL so searches can be bookmarked and shared.
- Give every content page its own title and sharing metadata.
- Check navigation, filtering, tool links, and layouts at desktop and mobile sizes.

## Not included

Authentication, admin, accounts, reviews, favorites, scraping, AI recommendations, and advanced comparison remain outside these phases.
