import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LogOut,
  User,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Bookmark,
  Send,
  Camera,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useBookmarks } from "@/hooks/use-bookmarks";
import {
  getUserProfile,
  saveUserProfile,
  getMySubmissions,
  type SubmissionRecord,
} from "@/lib/admin-db";
import { tools } from "@/lib/catalog";
import { ToolCard } from "@/components/compass/shared";
import { pageHead } from "@/lib/metadata";

export const Route = createFileRoute("/account")({
  head: () =>
    pageHead("My Account", "Your AI Compass account — profile, bookmarks, and submissions.", {
      noindex: true,
    }),
  component: AccountPage,
});

type Tab = "profile" | "bookmarks" | "submissions";
type Submission = {
  id: string;
  status: string;
  review_note: string;
  created_at: string;
  data: Record<string, unknown>;
};

function AccountPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { bookmarks } = useBookmarks();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>("profile");
  const [subs, setSubs] = useState<Submission[]>([]);
  const [subsLoad, setSubsLoad] = useState(false);

  // Profile edit state
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [profileBusy, setProfileBusy] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Redirect if not signed in
  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/" });
  }, [user, authLoading, navigate]);

  // Initialize profile fields from user
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName ?? "");
      // Load bio from Firebase Firestore users collection
      getUserProfile(user.uid).then((profile) => {
        if (profile) {
          if (profile.display_name) setDisplayName(profile.display_name);
          const prefs = profile.preferences as Record<string, unknown> | null;
          if (prefs?.bio) setBio(String(prefs.bio));
        }
      });
    }
  }, [user]);

  // Load submissions when on that tab
  useEffect(() => {
    if (tab !== "submissions" || !user) return;
    setSubsLoad(true);
    getMySubmissions(user.uid)
      .then((rows) => {
        // Filter out feedback submissions
        setSubs(
          rows.filter((s) => {
            const d = s.data as Record<string, unknown>;
            return d?._type !== "feedback";
          }),
        );
      })
      .finally(() => setSubsLoad(false));
  }, [tab, user]);

  async function saveProfile() {
    if (!user) return;
    setProfileBusy(true);
    try {
      await saveUserProfile({
        uid: user.uid,
        email: user.email,
        display_name: displayName.trim(),
        avatar_url: user.photoURL ?? "",
        preferences: { bio: bio.trim() },
      });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch {
      /* silent */
    } finally {
      setProfileBusy(false);
    }
  }

  if (authLoading)
    return (
      <div
        className="shell"
        style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}
      >
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  if (!user) return null;

  const savedTools = tools.filter((t) => bookmarks.has(t.slug));

  const statusIcon = (s: string) => {
    if (s === "approved") return <CheckCircle size={13} className="text-green-500" />;
    if (s === "rejected") return <XCircle size={13} className="text-destructive" />;
    return <Clock size={13} className="text-muted-foreground" />;
  };

  return (
    <div className="shell">
      <div className="page-heading">
        <div className="eyebrow">YOUR ACCOUNT</div>
        <h1>My Account</h1>
      </div>

      {/* Profile card header */}
      <div className="account-card">
        <div className="account-avatar-wrap" style={{ position: "relative" }}>
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt=""
              className="account-avatar"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="account-avatar-fallback">
              <User size={28} />
            </div>
          )}
          <span className="account-avatar-badge" title="Profile photo from Google">
            <Camera size={11} />
          </span>
        </div>
        <div className="account-info">
          <h2 className="account-name">{displayName || user.displayName || "User"}</h2>
          <p className="account-email">{user.email}</p>
        </div>
        <div className="account-actions">
          <Button variant="outline" size="sm" asChild>
            <Link to="/submit">Submit a tool</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              signOut();
              navigate({ to: "/" });
            }}
          >
            <LogOut size={14} /> Sign out
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="account-tabs">
        {(
          [
            { id: "profile", label: "Profile", icon: User, count: undefined },
            { id: "bookmarks", label: "Bookmarks", icon: Bookmark, count: bookmarks.size },
            { id: "submissions", label: "Submissions", icon: Send, count: undefined },
          ] as { id: Tab; label: string; icon: React.ElementType; count?: number }[]
        ).map((t) => (
          <button
            key={t.id}
            className={`account-tab${tab === t.id ? " active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <t.icon size={14} />
            {t.label}
            {t.count !== undefined && <span className="account-tab-count">{t.count}</span>}
          </button>
        ))}
      </div>

      {/* ── Profile tab ── */}
      {tab === "profile" && (
        <div className="account-section">
          <div className="submit-form" style={{ maxWidth: 520 }}>
            <div className="admin-field">
              <label className="admin-field-label" htmlFor="acc-name">
                Display name
              </label>
              <input
                id="acc-name"
                className="admin-input"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={user.displayName ?? "Your name"}
              />
              <p className="admin-field-hint">Shown on your submissions and profile.</p>
            </div>
            <div className="admin-field">
              <label className="admin-field-label" htmlFor="acc-email">
                Email
              </label>
              <input
                id="acc-email"
                className="admin-input"
                value={user.email ?? ""}
                disabled
                style={{ opacity: 0.6, cursor: "not-allowed" }}
              />
              <p className="admin-field-hint">Managed by Google — cannot be changed here.</p>
            </div>
            <div className="admin-field">
              <label className="admin-field-label" htmlFor="acc-bio">
                Bio (optional)
              </label>
              <textarea
                id="acc-bio"
                className="admin-input admin-textarea"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a little about yourself…"
              />
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Button onClick={saveProfile} disabled={profileBusy}>
                <Save size={14} />
                {profileBusy ? "Saving…" : "Save profile"}
              </Button>
              {profileSaved && (
                <span style={{ fontSize: 12, color: "oklch(.65 .15 145)" }}>✓ Saved</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Bookmarks tab ── */}
      {tab === "bookmarks" && (
        <div className="account-section">
          {savedTools.length === 0 ? (
            <div className="account-empty">
              <p>No bookmarks yet. Browse tools and click the bookmark icon to save them here.</p>
              <Button asChild size="sm">
                <Link to="/discover">Browse tools</Link>
              </Button>
            </div>
          ) : (
            <>
              <p className="result-count" style={{ marginBottom: 20 }}>
                {savedTools.length} saved tool{savedTools.length !== 1 ? "s" : ""}
              </p>
              <div className="tool-grid">
                {savedTools.map((t) => (
                  <ToolCard key={t.slug} tool={t} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Submissions tab ── */}
      {tab === "submissions" && (
        <div className="account-section">
          {subsLoad && <p className="text-muted-foreground text-sm">Loading…</p>}
          {!subsLoad && subs.length === 0 && (
            <div className="account-empty">
              <p>No submissions yet.</p>
              <Button asChild size="sm">
                <Link to="/submit">Submit your first tool</Link>
              </Button>
            </div>
          )}
          {!subsLoad && subs.length > 0 && (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Tool</th>
                    <th>Submitted</th>
                    <th>Status</th>
                    <th>Review note</th>
                  </tr>
                </thead>
                <tbody>
                  {subs.map((sub) => (
                    <tr key={sub.id}>
                      <td>
                        <strong>{String(sub.data?.name ?? "—")}</strong>
                      </td>
                      <td className="text-xs text-muted-foreground">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        <span
                          className={`admin-badge-pill status-${sub.status}`}
                          style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
                        >
                          {statusIcon(sub.status)} {sub.status}
                        </span>
                      </td>
                      <td className="text-xs text-muted-foreground admin-cell-desc">
                        {sub.review_note || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
