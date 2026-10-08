import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bot,
  LayoutGrid,
  Tags,
  InboxIcon,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  FileText,
  MessageSquare,
} from "lucide-react";
import { adminGetStats } from "@/lib/admin-db";
import { pageHead } from "@/lib/metadata";

export const Route = createFileRoute("/admin/")({
  head: () => pageHead("Admin Dashboard", "AI Compass admin panel", { noindex: true }),
  component: AdminDashboard,
});

type Stats = Awaited<ReturnType<typeof adminGetStats>> & { newFeedback?: number };

function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminGetStats()
      .then(setStats)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-page-loading">Loading stats…</div>;
  if (error) return <div className="admin-error">Error: {error}</div>;
  if (!stats) return null;

  const cards = [
    {
      label: "Total Tools",
      value: stats.totalTools,
      icon: Bot,
      href: "/admin/tools",
      color: "blue",
    },
    {
      label: "Published",
      value: stats.published,
      icon: TrendingUp,
      href: "/admin/tools",
      color: "green",
    },
    { label: "Drafts", value: stats.drafts, icon: FileText, href: "/admin/tools", color: "yellow" },
    {
      label: "Needs Review",
      value: stats.needsReview,
      icon: ShieldAlert,
      href: "/admin/tools",
      color: "orange",
    },
    {
      label: "Categories",
      value: stats.totalCats,
      icon: LayoutGrid,
      href: "/admin/categories",
      color: "purple",
    },
    { label: "Tags", value: stats.totalTags, icon: Tags, href: "/admin/tags", color: "teal" },
    {
      label: "Pending Submissions",
      value: stats.pendingSubs,
      icon: InboxIcon,
      href: "/admin/submissions",
      color: "red",
    },
    {
      label: "Total Submissions",
      value: stats.totalSubs,
      icon: ShieldCheck,
      href: "/admin/submissions",
      color: "gray",
    },
    {
      label: "New Feedback",
      value: stats.newFeedback ?? 0,
      icon: MessageSquare,
      href: "/admin/feedback",
      color: "teal",
    },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Overview of the AI Compass catalog.</p>
      </div>

      <div className="admin-stat-grid">
        {cards.map((c) => (
          <Link to={c.href} key={c.label} className={`admin-stat-card admin-stat-${c.color}`}>
            <c.icon size={22} />
            <div>
              <div className="admin-stat-value">{c.value}</div>
              <div className="admin-stat-label">{c.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="admin-quick-links">
        <h2>Quick actions</h2>
        <div className="admin-quick-grid">
          <Link to="/admin/tools/new" className="admin-quick-btn primary">
            + Add new AI tool
          </Link>
          <Link to="/admin/submissions" className="admin-quick-btn">
            Review submissions
          </Link>
          <Link to="/admin/feedback" className="admin-quick-btn">
            View feedback
          </Link>
          <Link to="/admin/featured" className="admin-quick-btn">
            Manage featured
          </Link>
          <Link to="/admin/settings" className="admin-quick-btn">
            Site settings
          </Link>
        </div>
      </div>
    </div>
  );
}
