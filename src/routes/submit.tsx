import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Send, CheckCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { submitTool } from "@/lib/admin-db";
import { pageHead, breadcrumbSchema, SITE_URL } from "@/lib/metadata";
import { categories } from "@/lib/catalog";

export const Route = createFileRoute("/submit")({
  head: () => ({
    ...pageHead(
      "Submit an AI Tool",
      "Know an AI tool that should be on AI Compass? Submit it for review. Every submission is reviewed by our team before publishing.",
      { path: "/submit", keywords: "submit AI tool, add AI tool, suggest AI tool" },
    ),
    scripts: [
      breadcrumbSchema([
        { name: "AI Compass", url: SITE_URL },
        { name: "Submit a Tool", url: `${SITE_URL}/submit` },
      ]),
    ],
  }),
  component: SubmitPage,
});

interface FormState {
  name: string;
  official_url: string;
  company: string;
  short_description: string;
  categories: string[];
  notes: string;
}

const EMPTY: FormState = {
  name: "",
  official_url: "",
  company: "",
  short_description: "",
  categories: [],
  notes: "",
};

function SubmitPage() {
  const { user, signIn } = useAuth();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!form.name.trim() || !form.official_url.trim()) {
      setError("Name and official URL are required.");
      return;
    }
    if (!form.official_url.startsWith("https://")) {
      setError("Official URL must start with https://");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await submitTool({
        user_id: user.uid,
        name: form.name.trim(),
        official_url: form.official_url.trim(),
        company: form.company.trim(),
        short_description: form.short_description.trim(),
        categories: form.categories,
        submitter_notes: form.notes.trim(),
      });
      setDone(true);
      setForm(EMPTY);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  /* Success state */
  if (done) {
    return (
      <div className="shell">
        <div className="submit-success">
          <CheckCircle size={48} />
          <h1>Thank you!</h1>
          <p>
            Your submission has been received and will be reviewed by our team. We'll add it to the
            catalog if it meets our guidelines.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24 }}>
            <Button asChild>
              <Link to="/discover">Explore tools</Link>
            </Button>
            <Button variant="outline" onClick={() => setDone(false)}>
              Submit another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shell">
      <div className="page-heading">
        <div className="eyebrow">HELP US GROW THE CATALOG</div>
        <h1>Submit an AI Tool</h1>
        <p>
          Know a great AI tool that's missing from AI Compass? Submit it for review. Every
          submission is checked by our team before publishing.
        </p>
      </div>

      {/* Guidelines */}
      <div className="submit-guidelines">
        <strong>Before submitting:</strong>
        <ul>
          <li>The tool must have an official website (https)</li>
          <li>No affiliate links — official URLs only</li>
          <li>Only publicly available tools (no private betas)</li>
          <li>We will not invent pricing or feature claims — include only what you know</li>
        </ul>
      </div>

      {/* Auth gate */}
      {!user ? (
        <div className="submit-auth-gate">
          <LogIn size={28} />
          <h2>Sign in to submit</h2>
          <p>You need a free account to submit tools. This helps us prevent spam.</p>
          <Button onClick={() => signIn()}>Sign in with Google</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="submit-form">
          <div className="submit-form-grid">
            {/* Name */}
            <div className="admin-field">
              <label className="admin-field-label" htmlFor="s-name">
                Tool name *
              </label>
              <input
                id="s-name"
                className="admin-input"
                required
                placeholder="e.g. ChatGPT"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>

            {/* Official URL */}
            <div className="admin-field">
              <label className="admin-field-label" htmlFor="s-url">
                Official website URL *
              </label>
              <input
                id="s-url"
                className="admin-input"
                required
                type="url"
                placeholder="https://"
                value={form.official_url}
                onChange={(e) => set("official_url", e.target.value)}
              />
              <p className="admin-field-hint">Must be the official website — no affiliate links</p>
            </div>

            {/* Company */}
            <div className="admin-field">
              <label className="admin-field-label" htmlFor="s-company">
                Company / maker
              </label>
              <input
                id="s-company"
                className="admin-input"
                placeholder="e.g. OpenAI"
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="admin-field">
            <label className="admin-field-label" htmlFor="s-desc">
              Short description
            </label>
            <textarea
              id="s-desc"
              className="admin-input admin-textarea"
              rows={3}
              placeholder="One or two sentences describing what the tool does."
              value={form.short_description}
              onChange={(e) => set("short_description", e.target.value)}
            />
            <p className="admin-field-hint">Keep it factual. Don't include pricing claims.</p>
          </div>

          {/* Categories */}
          <div className="admin-field">
            <label className="admin-field-label">Categories (select all that apply)</label>
            <div className="admin-checkbox-grid">
              {categories.map((c) => (
                <label key={c.slug} className="admin-check-label">
                  <input
                    type="checkbox"
                    checked={form.categories.includes(c.slug)}
                    onChange={(e) => {
                      const cats = form.categories;
                      set(
                        "categories",
                        e.target.checked ? [...cats, c.slug] : cats.filter((x) => x !== c.slug),
                      );
                    }}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="admin-field">
            <label className="admin-field-label" htmlFor="s-notes">
              Additional notes for reviewers
            </label>
            <textarea
              id="s-notes"
              className="admin-input admin-textarea"
              rows={2}
              placeholder="Anything the reviewer should know (optional)"
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>

          {error && <p className="admin-error">{error}</p>}

          <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8 }}>
            <Button type="submit" disabled={busy}>
              <Send size={14} />
              {busy ? "Submitting…" : "Submit for review"}
            </Button>
            <span className="admin-field-hint">Submitted as {user.displayName ?? user.email}</span>
          </div>
        </form>
      )}
    </div>
  );
}
