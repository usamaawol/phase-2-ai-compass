import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, BookmarkX, ArrowUpRight, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tools } from "@/lib/catalog";
import { ToolGrid } from "@/components/compass/shared";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useAuth } from "@/hooks/use-auth";
import { pageHead } from "@/lib/metadata";

export const Route = createFileRoute("/saved")({
  head: () => pageHead("Saved Tools", "Your bookmarked AI tools on AI Compass.", { noindex: true }),
  component: SavedPage,
});

function SavedPage() {
  const { bookmarks, toggle, loading } = useBookmarks();
  const { user } = useAuth();
  const saved = tools.filter((t) => bookmarks.has(t.slug));

  if (loading) {
    return (
      <div className="shell" style={{ padding: "60px 0", color: "var(--muted-foreground)" }}>
        Loading…
      </div>
    );
  }

  return (
    <div className="shell">
      <div className="page-heading">
        <div className="eyebrow">
          <Bookmark size={14} /> YOUR SAVED TOOLS
        </div>
        <h1>Saved tools</h1>
        <p>Tools you've bookmarked for quick access.</p>
      </div>

      {!user && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 18px",
            marginBottom: 24,
            borderRadius: 12,
            background: "var(--accent)",
            border: "1px solid var(--border)",
          }}
        >
          <Cloud size={20} style={{ color: "var(--primary)", flexShrink: 0 }} />
          <p style={{ margin: 0, flex: 1, fontSize: 14, color: "var(--foreground)" }}>
            <strong>Sign in</strong> to sync your bookmarks across devices. Your current
            bookmarks are saved locally in this browser only.
          </p>
          <Button size="sm" asChild>
            <Link to="/account">Sign in</Link>
          </Button>
        </div>
      )}

      {saved.length === 0 ? (
        <div className="saved-empty">
          <BookmarkX size={40} />
          <h2>No saved tools yet</h2>
          <p>Browse AI tools and click the bookmark icon on any card to save it here.</p>
          <Button asChild>
            <Link to="/discover">
              Browse all tools <ArrowUpRight size={14} />
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="saved-header">
            <span className="result-count">
              {saved.length} saved tool{saved.length !== 1 ? "s" : ""}
            </span>
            <button className="find-reset" onClick={() => saved.forEach((t) => toggle(t.slug))}>
              Clear all
            </button>
          </div>
          <ToolGrid items={saved} />
        </>
      )}
    </div>
  );
}

