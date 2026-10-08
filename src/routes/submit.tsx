import { createFileRoute, Link } from "@tanstack/react-router";
import { Lightbulb, MessageSquarePlus, ShieldCheck, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { pageHead, SITE_URL, breadcrumbSchema } from "@/lib/metadata";
import { isAdminUser } from "@/lib/admin-db";

export const Route = createFileRoute("/submit")({
  head: () => ({
    ...pageHead(
      "Suggest an AI Tool",
      "Know an AI tool we should add? Send us a suggestion through our feedback channel.",
      { path: "/submit", keywords: "suggest AI tool, recommend AI tool, AI tool suggestion" },
    ),
    scripts: [
      breadcrumbSchema([
        { name: "AI Compass", url: SITE_URL },
        { name: "Suggest a Tool", url: `${SITE_URL}/submit` },
      ]),
    ],
  }),
  component: SubmitPage,
});

function SubmitPage() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    if (!user) {
      setCheckingAdmin(false);
      return;
    }
    isAdminUser(user.uid)
      .then(setIsAdmin)
      .catch(() => setIsAdmin(false))
      .finally(() => setCheckingAdmin(false));
  }, [user]);

  return (
    <div className="shell">
      <div className="page-heading">
        <div className="eyebrow">HELP US GROW THE CATALOG</div>
        <h1>Suggest an AI Tool</h1>
        <p>Know a great AI tool that's missing from AI Compass? We'd love to hear about it!</p>
      </div>

      {checkingAdmin ? null : isAdmin ? (
        <div className="submit-guidelines" style={{ borderLeftColor: "#b5e85b" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <ShieldCheck size={28} style={{ color: "#b5e85b", flexShrink: 0 }} />
            <div>
              <strong>Admin access detected</strong>
              <p style={{ marginTop: 8, marginBottom: 16 }}>
                As an administrator, you can directly manage AI tools from the admin dashboard.
              </p>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Button asChild>
                  <Link to="/admin/tools/new">
                    <Bot size={14} /> Create New Tool
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/admin/tools">
                    <ShieldCheck size={14} /> Manage All Tools
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className="submit-guidelines">
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <MessageSquarePlus size={28} style={{ color: "#b5e85b", flexShrink: 0 }} />
          <div>
            <strong>Send us your idea through Feedback</strong>
            <ul style={{ marginTop: 12, marginBottom: 16 }}>
              <li>
                Click the <strong>Feedback</strong> button in the bottom-right corner of any page
              </li>
              <li>
                Select <strong>"💡 Suggestion"</strong> (or <strong>"Suggest an AI Tool"</strong> if
                available)
              </li>
              <li>
                Tell us:
                <ul style={{ marginTop: 6, marginLeft: 20 }}>
                  <li>The tool's name</li>
                  <li>Official website URL (if available)</li>
                  <li>What it does and why you like it</li>
                  <li>Which category it belongs to</li>
                </ul>
              </li>
              <li>
                We review every suggestion and add it to the catalog if it meets our guidelines
              </li>
            </ul>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
              <Button asChild variant="outline">
                <Link to="/discover">
                  <Lightbulb size={14} /> Browse Existing Tools
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="submit-guidelines" style={{ opacity: 0.85 }}>
        <strong>Before suggesting:</strong>
        <ul style={{ marginTop: 12 }}>
          <li>
            Double-check it's not already listed in our{" "}
            <Link to="/discover" className="text-primary">
              Discover
            </Link>{" "}
            page
          </li>
          <li>The tool must have an official website (https)</li>
          <li>Only publicly available tools (no private betas)</li>
          <li>No affiliate links — official URLs only</li>
        </ul>
      </div>
    </div>
  );
}
