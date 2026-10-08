import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare,
  ShieldAlert,
  CheckSquare,
  Archive,
} from "lucide-react";
import {
  adminListFeedback,
  adminRespondFeedback,
  adminUpdateFeedbackStatus,
  type FeedbackRecord,
} from "@/lib/admin-db";
import { useAuth } from "@/hooks/use-auth";
import { pageHead } from "@/lib/metadata";

export const Route = createFileRoute("/admin/feedback")({
  head: () => pageHead("Feedback — Admin", "Review user feedback & suggestions", { noindex: true }),
  component: AdminFeedback,
});

type FbItem = Awaited<ReturnType<typeof adminListFeedback>>[number];

const TYPE_LABELS: Record<string, string> = {
  suggest_tool: "🤖 Suggest AI Tool",
  suggestion: "💡 Suggestion",
  bug: "🐛 Bug",
  incorrect_info: "⚠️ Incorrect info",
  other: "💬 Other",
};

const STATUS_FILTERS: (FeedbackRecord["status"] | "all")[] = [
  "all",
  "new",
  "reviewed",
  "resolved",
  "dismissed",
];

function AdminFeedback() {
  const { user } = useAuth();
  const [items, setItems] = useState<FbItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof STATUS_FILTERS)[number]>("new");
  const [preview, setPreview] = useState<FbItem | null>(null);
  const [response, setResponse] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function reload() {
    setLoading(true);
    try {
      setItems(await adminListFeedback(filter));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, [filter]);

  async function respond(id: string) {
    if (!user) return;
    setBusy(true);
    try {
      if (response.trim()) {
        await adminRespondFeedback(id, response.trim(), user.uid, user.displayName ?? user.uid);
      } else {
        await adminUpdateFeedbackStatus(id, "reviewed", user.uid, user.displayName ?? user.uid);
      }
      setPreview(null);
      setResponse("");
      await reload();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  async function setStatus(id: string, status: FeedbackRecord["status"]) {
    if (!user) return;
    setBusy(true);
    try {
      await adminUpdateFeedbackStatus(id, status, user.uid, user.displayName ?? user.uid);
      await reload();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="admin-page-loading">Loading feedback…</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>User Feedback & Suggestions</h1>
          <p>
            {items.length} message{items.length !== 1 ? "s" : ""} · includes AI tool suggestions
          </p>
        </div>
      </div>

      <div className="admin-filter-tabs">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f}
            className={`admin-tab${filter === f ? " active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f === "new"
              ? "🆕 New"
              : f === "reviewed"
                ? "👀 Reviewed"
                : f === "resolved"
                  ? "✅ Resolved"
                  : f === "dismissed"
                    ? "🚫 Dismissed"
                    : "All"}
          </button>
        ))}
      </div>

      {error && <p className="admin-error">{error}</p>}

      {items.length === 0 && (
        <div className="admin-empty" style={{ padding: "48px 0", textAlign: "center" }}>
          <MessageSquare size={36} style={{ margin: "0 auto 14px", opacity: 0.3 }} />
          <p>No feedback in this category yet.</p>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Message</th>
              <th>User</th>
              <th>Page</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className={busy === item.id ? "opacity-50" : ""}>
                <td className="text-xs">{new Date(item.created_at).toLocaleDateString()}</td>
                <td>
                  <span className="admin-badge-pill">{TYPE_LABELS[item.type] ?? item.type}</span>
                </td>
                <td className="admin-cell-desc">{item.message}</td>
                <td className="text-xs font-mono">
                  {item.user_email
                    ? item.user_email
                    : item.user_id
                      ? item.user_id.slice(0, 8) + "…"
                      : "anonymous"}
                </td>
                <td className="text-xs font-mono">{item.page_url || "—"}</td>
                <td>
                  <span
                    className={`admin-badge-pill status-${
                      item.status === "new"
                        ? "pending"
                        : item.status === "reviewed"
                          ? "approved"
                          : item.status === "resolved"
                            ? "approved"
                            : "rejected"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
                    <button
                      title="View & respond"
                      onClick={() => {
                        setPreview(item);
                        setResponse(item.admin_response ?? "");
                      }}
                    >
                      <Eye size={13} />
                    </button>
                    {item.status === "new" && (
                      <button
                        title="Mark as reviewed"
                        className="success"
                        onClick={() => setStatus(item.id, "reviewed")}
                      >
                        <CheckSquare size={13} />
                      </button>
                    )}
                    {item.status !== "dismissed" && (
                      <button
                        title="Dismiss"
                        className="danger"
                        onClick={() => setStatus(item.id, "dismissed")}
                      >
                        <ShieldAlert size={13} />
                      </button>
                    )}
                    {item.status !== "resolved" && (
                      <button
                        title="Mark resolved"
                        className="success"
                        onClick={() => setStatus(item.id, "resolved")}
                      >
                        <Archive size={13} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {preview && (
        <div
          className="login-overlay"
          onClick={(e) => e.target === e.currentTarget && setPreview(null)}
        >
          <div className="admin-preview-modal" style={{ maxWidth: 600 }}>
            <div className="admin-preview-header">
              <h3>{TYPE_LABELS[preview.type] ?? "Feedback"}</h3>
              <button onClick={() => setPreview(null)}>✕</button>
            </div>

            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
              <p
                style={{
                  margin: "0 0 12px",
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: "var(--foreground)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {preview.message}
              </p>
              <div style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
                <div>
                  <strong>From:</strong> {preview.user_email ?? preview.user_id ?? "anonymous"}
                </div>
                <div>
                  <strong>Page:</strong> {preview.page_url || "/"}
                </div>
                <div>
                  <strong>Received:</strong> {new Date(preview.created_at).toLocaleString()}
                </div>
                {preview.reviewed_at && (
                  <div>
                    <strong>Last review:</strong> {preview.reviewed_by} ·{" "}
                    {new Date(preview.reviewed_at).toLocaleString()}
                  </div>
                )}
              </div>
            </div>

            {preview.admin_response && (
              <div
                style={{
                  padding: "12px 20px",
                  background: "var(--secondary)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <p style={{ margin: 0, fontSize: 12, color: "var(--muted-foreground)" }}>
                  <strong>Admin note:</strong>
                </p>
                <p style={{ margin: "6px 0 0", fontSize: 13 }}>{preview.admin_response}</p>
              </div>
            )}

            <div style={{ padding: "16px 20px" }}>
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--foreground)",
                }}
              >
                Admin response / notes (saved to record):
              </p>
              <textarea
                className="admin-input admin-textarea"
                rows={3}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Add a note or response…"
                style={{ width: "100%", boxSizing: "border-box" }}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button
                  className="admin-btn primary"
                  onClick={() => respond(preview.id)}
                  disabled={busy}
                >
                  <CheckCircle size={13} /> Save & mark reviewed
                </button>
                <button className="admin-btn" onClick={() => setPreview(null)}>
                  <XCircle size={13} /> Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
