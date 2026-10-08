/**
 * Floating feedback button — appears on all public pages.
 * Opens a modal with type selector + message field.
 * Submits to tool_submissions with _type: 'feedback'.
 */
import { useState } from "react";
import { MessageSquarePlus, X, Send, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { submitFeedback, type FeedbackRecord } from "@/lib/admin-db";

const TYPES: { value: FeedbackRecord["type"]; label: string }[] = [
  { value: "suggest_tool", label: "🤖 Suggest an AI Tool" },
  { value: "suggestion", label: "💡 Suggestion" },
  { value: "bug", label: "🐛 Bug report" },
  { value: "incorrect_info", label: "⚠️ Incorrect info" },
  { value: "other", label: "💬 Other" },
];

export function FeedbackButton() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FeedbackRecord["type"]>("suggest_tool");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setBusy(true);
    setError("");
    try {
      await submitFeedback({
        user_id: user?.uid,
        user_email: user?.email ?? undefined,
        type,
        message: message.trim(),
        page_url: typeof window !== "undefined" ? window.location.pathname : "",
      });
      setDone(true);
      setTimeout(() => {
        setOpen(false);
        setDone(false);
        setMessage("");
        setType("suggestion");
      }, 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        className="feedback-fab"
        onClick={() => setOpen(true)}
        aria-label="Send feedback"
        title="Send feedback"
      >
        <MessageSquarePlus size={19} />
        <span>Feedback</span>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="feedback-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Send feedback"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="feedback-modal">
            <div className="feedback-header">
              <h3>Send feedback</h3>
              <button onClick={() => setOpen(false)} className="feedback-close" aria-label="Close">
                <X size={16} />
              </button>
            </div>

            {done ? (
              <div className="feedback-success">
                <CheckCircle size={32} />
                <p>Thanks for your feedback!</p>
              </div>
            ) : (
              <form onSubmit={submit} className="feedback-form">
                {/* Type selector */}
                <div className="feedback-types">
                  {TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      className={`feedback-type-btn${type === t.value ? " active" : ""}`}
                      onClick={() => setType(t.value)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Message */}
                <textarea
                  className="feedback-textarea"
                  placeholder={
                    type === "suggest_tool"
                      ? "Tell us about the AI tool:\n• Tool name\n• Official website URL (if available)\n• What it does and why you recommend it\n• Which category it fits best"
                      : type === "suggestion"
                        ? "What would make AI Compass better?"
                        : type === "bug"
                          ? "What went wrong? What did you expect?"
                          : type === "incorrect_info"
                            ? "Which tool? What information is wrong?"
                            : "Tell us anything…"
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  required
                  autoFocus
                />

                {error && (
                  <p className="feedback-error" role="alert">
                    {error}
                  </p>
                )}

                <div className="feedback-footer">
                  {user ? (
                    <span className="feedback-user">
                      Sending as {user.displayName ?? user.email}
                    </span>
                  ) : (
                    <span className="feedback-anon">Sending anonymously</span>
                  )}
                  <button
                    type="submit"
                    className="feedback-send"
                    disabled={busy || !message.trim()}
                  >
                    <Send size={14} />
                    {busy ? "Sending…" : "Send"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
