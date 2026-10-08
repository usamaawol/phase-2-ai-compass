import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Ban, Search, Shield, UserCheck, UserX, Eye, RefreshCw } from "lucide-react";
import { adminListUsers, adminBanUser, adminUnbanUser, type AdminUserItem } from "@/lib/admin-db";
import { useAuth } from "@/hooks/use-auth";
import { pageHead } from "@/lib/metadata";

export const Route = createFileRoute("/admin/users")({
  head: () => pageHead("Users — Admin", "User management and moderation", { noindex: true }),
  component: AdminUsers,
});

type FilterKey = "all" | "banned" | "active" | "admin";

function AdminUsers() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<AdminUserItem | null>(null);
  const [banReason, setBanReason] = useState("");
  const [banTarget, setBanTarget] = useState<AdminUserItem | null>(null);

  async function reload() {
    setLoading(true);
    try {
      setUsers(await adminListUsers());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  const filtered = useMemo(() => {
    let list = users;
    switch (filter) {
      case "banned":
        list = list.filter((u) => u.disabled);
        break;
      case "active":
        list = list.filter((u) => !u.disabled);
        break;
      case "admin":
        list = list.filter((u) => u.is_admin);
        break;
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (u) =>
          u.email?.toLowerCase().includes(q) ||
          u.display_name?.toLowerCase().includes(q) ||
          u.uid.toLowerCase().includes(q),
      );
    }
    return list;
  }, [users, filter, query]);

  async function handleBan(userItem: AdminUserItem) {
    if (userItem.uid === user?.uid) {
      alert("You cannot ban your own account.");
      return;
    }
    const reason =
      (banReason.trim() || prompt("Ban reason:", "Violation of community guidelines")) ?? "";
    if (!reason.trim()) return;
    setBusy(userItem.uid);
    try {
      await adminBanUser(
        userItem.uid,
        reason,
        user?.uid ?? "",
        user?.displayName ?? user?.email ?? "Admin",
      );
      setBanTarget(null);
      setBanReason("");
      await reload();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Ban failed");
    } finally {
      setBusy(null);
    }
  }

  async function handleUnban(userItem: AdminUserItem) {
    if (!confirm(`Unban ${userItem.display_name || userItem.email || userItem.uid}?`)) return;
    setBusy(userItem.uid);
    try {
      await adminUnbanUser(
        userItem.uid,
        user?.uid ?? "",
        user?.displayName ?? user?.email ?? "Admin",
      );
      await reload();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Unban failed");
    } finally {
      setBusy(null);
    }
  }

  const counts = useMemo(() => {
    return {
      all: users.length,
      banned: users.filter((u) => u.disabled).length,
      active: users.filter((u) => !u.disabled).length,
      admin: users.filter((u) => u.is_admin).length,
    };
  }, [users]);

  if (loading) return <div className="admin-page-loading">Loading users…</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Users</h1>
          <p>Manage user accounts and moderation bans</p>
        </div>
        <button className="admin-btn sm" onClick={reload} title="Refresh">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div className="admin-toolbar">
        <div className="admin-search-wrap">
          <Search size={14} />
          <input
            type="text"
            className="admin-search"
            placeholder="Search by email, name, or UID…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="admin-filter-tabs">
          {(
            [
              ["all", "All"],
              ["active", "Active"],
              ["banned", "Banned"],
              ["admin", "Admins"],
            ] as [FilterKey, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              className={`admin-tab${filter === key ? " active" : ""}`}
              onClick={() => setFilter(key)}
            >
              {label} ({counts[key]})
            </button>
          ))}
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Sign-ins</th>
              <th>First seen</th>
              <th>Last seen</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.uid} className={busy === u.uid ? "opacity-50" : ""}>
                <td>
                  <div className="admin-user-row">
                    {u.avatar_url ? (
                      <img
                        src={u.avatar_url}
                        alt=""
                        className="admin-avatar sm"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="admin-avatar-fallback sm">
                        {(u.display_name ?? u.email ?? "U")[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="admin-tool-name">{u.display_name || "—"}</div>
                      <div className="admin-tool-slug">{u.email || u.uid}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {u.is_admin ? (
                    <span className="admin-badge-pill status-approved" title="Administrator">
                      <Shield size={10} /> Admin
                    </span>
                  ) : (
                    <span className="admin-badge-pill">User</span>
                  )}
                </td>
                <td>
                  {u.disabled ? (
                    <span className="admin-badge-pill status-rejected" title={u.ban_reason}>
                      <Ban size={10} /> Banned
                    </span>
                  ) : (
                    <span className="admin-badge-pill status-pending">
                      <UserCheck size={10} /> Active
                    </span>
                  )}
                </td>
                <td>{u.sign_in_count || 0}</td>
                <td className="text-xs">
                  {u.first_seen_at ? new Date(u.first_seen_at).toLocaleDateString() : "—"}
                </td>
                <td className="text-xs">
                  {u.last_seen_at ? new Date(u.last_seen_at).toLocaleDateString() : "—"}
                </td>
                <td>
                  <div className="admin-actions">
                    <button title="View details" onClick={() => setPreview(u)}>
                      <Eye size={13} />
                    </button>
                    {u.disabled ? (
                      <button
                        title="Unban user"
                        className="success"
                        onClick={() => handleUnban(u)}
                        disabled={busy === u.uid || u.is_admin}
                      >
                        <UserCheck size={13} />
                      </button>
                    ) : (
                      <button
                        title="Ban user"
                        className="danger"
                        onClick={() => setBanTarget(u)}
                        disabled={busy === u.uid || u.is_admin || u.uid === user?.uid}
                      >
                        <UserX size={13} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="admin-empty">
                  No users match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {preview && (
        <div
          className="login-overlay"
          onClick={(e) => e.target === e.currentTarget && setPreview(null)}
        >
          <div className="admin-preview-modal">
            <div className="admin-preview-header">
              <h3>User details</h3>
              <button onClick={() => setPreview(null)}>✕</button>
            </div>
            <pre className="admin-preview-pre">{JSON.stringify(preview, null, 2)}</pre>
          </div>
        </div>
      )}

      {banTarget && (
        <div
          className="login-overlay"
          onClick={(e) => e.target === e.currentTarget && setBanTarget(null)}
        >
          <div className="admin-preview-modal">
            <div className="admin-preview-header">
              <h3>
                <Ban size={16} /> Ban user
              </h3>
              <button onClick={() => setBanTarget(null)}>✕</button>
            </div>
            <div className="admin-form-section" style={{ padding: 0 }}>
              <div className="admin-form-row" style={{ marginBottom: 16 }}>
                Banning:{" "}
                <strong>{banTarget.display_name || banTarget.email || banTarget.uid}</strong>
              </div>
              <label className="admin-field-label" htmlFor="ban-reason">
                Ban reason
              </label>
              <textarea
                id="ban-reason"
                className="admin-textarea"
                rows={4}
                placeholder="Why is this user being banned?"
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
              <div className="admin-form-actions" style={{ marginTop: 16 }}>
                <button className="admin-btn" onClick={() => setBanTarget(null)}>
                  Cancel
                </button>
                <button
                  className="admin-btn primary"
                  onClick={() => handleBan(banTarget)}
                  style={{
                    background: "hsl(var(--destructive))",
                    color: "hsl(var(--destructive-foreground))",
                  }}
                >
                  <Ban size={14} /> Confirm ban
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
