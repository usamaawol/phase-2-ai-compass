import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, CheckCircle, Clock, ShieldAlert, Loader2, Wrench } from "lucide-react";
import { pageHead, breadcrumbSchema, SITE_URL } from "@/lib/metadata";
import { AdminProvider, useAdmin } from "@/hooks/use-admin";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/changelog")({
  head: () => {
    const base = pageHead(
      "Changelog — Admin",
      "Internal update notes for AI Compass administrators.",
      { path: "/changelog", noindex: true },
    );
    return {
      // pageHead() already injects { noindex,nofollow } robots for noindex:true.
      // We add googlebot + noarchive for extra safety, making changelog truly
      // invisible to search crawlers since the page itself is admin-only.
      meta: [
        ...base.meta,
        { name: "googlebot", content: "noindex,nofollow,noarchive" },
        { name: "robots", content: "noindex,nofollow,noarchive,nosnippet" },
      ],
      links: base.links,
    };
  },
  component: () => (
    <AdminProvider>
      <AdminGatedChangelog />
    </AdminProvider>
  ),
});

/**
 * Changelog is now PRIVATE / ADMIN-ONLY (publish-readiness request).
 * This gate ensures no random / unauthenticated user or regular signed-in
 * user can read the changelog content or roadmap — it renders only when
 * /admin_users/{uid} has role == 'admin'.
 */
function AdminGatedChangelog() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();

  if (authLoading || adminLoading) {
    return (
      <div className="shell">
        <div className="admin-loading">
          <Loader2 className="animate-spin" size={24} />
          <span>Checking permissions…</span>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="shell">
        <div className="admin-denied">
          <ShieldAlert size={40} />
          <h1>Changelog is for administrators only</h1>
          <p>
            This page contains internal release notes and roadmap items. It
            is not visible to the public.
          </p>
          <Link to="/" className="admin-denied-link">
            ← Back to AI Compass
          </Link>
        </div>
      </div>
    );
  }

  return <ChangelogPage />;
}

interface Entry {
  date: string;
  version?: string;
  type: "feature" | "fix" | "improvement";
  title: string;
  items: string[];
}

const ENTRIES: Entry[] = [
  {
    date: "October 2026",
    version: "2.6",
    type: "feature",
    title: "Compare, Find, Feedback & Account",
    items: [
      "Working side-by-side tool comparison (up to 4 tools, URL state)",
      "Quick-start comparison presets (ChatGPT vs Claude, etc.)",
      "Find my AI — describe a task, get matched tools instantly",
      "Transparent keyword/category/tag matching scoring",
      "Suggest an AI Tool — users send ideas via Feedback channel (admin review)",
      "Account page — view profile and saved bookmarks",
      "Bookmark tools — saved to Firestore per user account",
      "Announcement banner from site settings",
      "Admin dashboard — full catalog management + feedback review",
    ],
  },
  {
    date: "October 2026",
    version: "2.5",
    type: "feature",
    title: "Sidebar navigation, Firebase Auth & SEO",
    items: [
      "Fixed left sidebar replaces top navbar",
      "Home, Discover, Find, Categories, Compare, Suggest, About nav items",
      "Google sign-in via Firebase — Home is public, other pages require login",
      "Login modal with Google OAuth button",
      "Theme toggle (dark/light) moved to sidebar bottom",
      "Mobile: sticky top bar + slide-in drawer with backdrop",
      "Full SEO overhaul: canonical, og:url, og:image, JSON-LD structured data",
      "Sitemap.xml covering 83 URLs (5 core + 26 categories + 52 tools)",
      "robots.txt with Sitemap pointer",
    ],
  },
  {
    date: "September 2026",
    version: "2.0",
    type: "feature",
    title: "Discovery, 52 tools, 26 categories",
    items: [
      "52 AI tools across 26 categories",
      "Full-text search with URL-persisted filters",
      "Filter by category, tag, platform, skill level, open source",
      "Sort by popular, newest, A–Z",
      "Category pages with dedicated tool listings",
      "Rich tool profiles: capabilities, platforms, getting started, alternatives",
      "Demo catalog with clear unverified labeling",
    ],
  },
  {
    date: "September 2026",
    version: "1.0",
    type: "feature",
    title: "Launch — Visual foundation",
    items: [
      "Homepage with hero, featured categories, featured tools",
      "Task search with suggestion chips",
      "Dark mode (default) and light mode",
      "Responsive design (desktop, tablet, mobile)",
      "Compass-inspired branding",
    ],
  },
];

const ROADMAP = [
  { status: "planned", label: "Real-time Firebase catalog (admin-editable without code changes)" },
  { status: "planned", label: "Tool comparison improvements — export as table, share URL" },
  { status: "planned", label: "User profile page with avatar upload" },
  { status: "planned", label: "Trending & recently added sections on homepage" },
  { status: "planned", label: "Tool request voting — community upvotes for missing tools" },
  { status: "planned", label: "Email/password sign-in option" },
  { status: "planned", label: "Admin analytics dashboard with real charts" },
];

function typeIcon(type: Entry["type"]) {
  if (type === "feature") return <CheckCircle size={15} className="cl-icon-feature" />;
  if (type === "improvement") return <Wrench size={15} className="cl-icon-improve" />;
  return <Clock size={15} className="cl-icon-fix" />;
}

export default function ChangelogPage() {
  return (
    <div className="shell">
      <div className="page-heading">
        <div className="eyebrow">WHAT'S NEW</div>
        <h1>Changelog</h1>
        <p>A record of updates, new features, and improvements to AI Compass.</p>
      </div>

      <div className="cl-layout">
        {/* Entries */}
        <div className="cl-entries">
          {ENTRIES.map((entry) => (
            <div key={entry.date + entry.title} className="cl-entry">
              <div className="cl-entry-meta">
                <span className="cl-date">{entry.date}</span>
                {entry.version && <span className="cl-version">v{entry.version}</span>}
                <span className={`cl-type cl-type-${entry.type}`}>
                  {typeIcon(entry.type)}
                  {entry.type}
                </span>
              </div>
              <h2 className="cl-entry-title">{entry.title}</h2>
              <ul className="cl-items">
                {entry.items.map((item) => (
                  <li key={item}>
                    <CheckCircle size={13} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Roadmap sidebar */}
        <aside className="cl-roadmap">
          <h2>Roadmap</h2>
          <p>What's coming next.</p>
          <ul className="cl-roadmap-list">
            {ROADMAP.map((item) => (
              <li key={item.label} className={`cl-roadmap-item cl-${item.status}`}>
                <Clock size={12} />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <Link to="/submit" className="section-link">
              Missing a tool? Suggest it <ArrowUpRight size={13} />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
