import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { adminListFeedback, adminRespondFeedback } from "@/lib/admin-db";
import { useAuth } from "@/hooks/use-auth";
import { pageHead } from "@/lib/metadata";

export const Route = createFileRoute("/admin/feedback")({
  head: () => pageHead("Feedback — Admin", "Review user feedback", { noindex: true }),
  component: AdminFeedback,
});

type FbItem = Awaited<ReturnType<typeof adminListFeedback>>[number];

const TYPE_LABELS: Record<string, string> = {
  suggestion: "💡 Suggestion",
  bug: "🐛 Bug",
  incorrect_info: "⚠️ Incorrect info",
  other: "💬 Other",
};

function AdminFeedback() {
  const { user } = useAuth();
  const [items, setItems] = useState<FbItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<FbItem | null>(null);
  const [response, setResponse] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function reload() {
    setLoading(true);
    try {
      setItems(await adminListFeedback());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, []);

  async function respond(id: string) {
    if (!response.trim() || !user) return;
    setBusy(true);
    try {
      await adminRespondFeedback(id, response, user.uid, user.displayName ?? user.uid);
      setPreview(null);
      setResponse("");
      await reload();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <div className="admin-page-loading">Loading feedback…</div>;

  const d = (item: FbItem) => item.data as Record<string, unknown>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>User Feedback</h1>
          <p>
            {items.length} feedback message{items.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      {items.length === 0 && (
        <div className="admin-empty" style={{ padding: "48px 0", textAlign: "center" }}>
          <MessageSquare size={36} style={{ margin: "0 auto 14px", opacity: 0.3 }} />
          <p>No feedback yet.</p>
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
              <tr key={item.id}>
                <td className="text-xs">{new Date(item.created_at).toLocaleDateString()}</td>
                <td>
                  <span className="admin-badge-pill">
                    {TYPE_LABELS[String(d(item).type)] ?? String(d(item).type)}
                  </span>
                </td>
                <td className="admin-cell-desc">{String(d(item).message ?? "—")}</td>
                <td className="text-xs font-mono">
                  {d(item).user_email ? String(d(item).user_email) : item.user_id.slice(0, 8) + "…"}
                </td>
                <td className="text-xs font-mono">{String(d(item).page_url ?? "—")}</td>
                <td>
                  <span
                    className={`admin-badge-pill status-${item.status === "approved" ? "approved" : item.status === "rejected" ? "rejected" : "pending"}`}
                  >
                    {item.status === "approved"
                      ? "responded"
                      : item.status === "pending"
                        ? "new"
                        : item.status}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
                    <button
                      title="View & respond"
                      onClick={() => {
                        setPreview(item);
                        setResponse("");
                      }}
                    >
                      <Eye size={13} />
                    </button>
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
          <div className="admin-preview-modal" style={{ maxWidth: 560 }}>
            <div className="admin-preview-header">
              <h3>{TYPE_LABELS[String(d(preview).type)] ?? "Feedback"}</h3>
              <button onClick={() => setPreview(null)}>✕</button>
            </div>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: "var(--foreground)",
                }}
              >
                {String(d(preview).message)}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: "var(--muted-foreground)" }}>
                From: {d(preview).user_email ? String(d(preview).user_email) : preview.user_id} ·
                Page: {String(d(preview).page_url ?? "/")} ·
                {new Date(preview.created_at).toLocaleString()}
              </p>
            </div>
            {preview.review_note && (
              <div
                style={{
                  padding: "12px 20px",
                  background: "var(--secondary)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <p style={{ margin: 0, fontSize: 12, color: "var(--muted-foreground)" }}>
                  <strong>Previous response:</strong> {preview.review_note}
                </p>
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
                Admin response (optional — user won't receive an email, this is for your records):
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
                  <CheckCircle size={13} /> Mark reviewed
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
