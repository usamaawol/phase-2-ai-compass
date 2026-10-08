import { createFileRoute } from "@tanstack/react-router";
import { pageHead, breadcrumbSchema, SITE_URL } from "@/lib/metadata";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    ...pageHead("Privacy Policy", "AI Compass Privacy Policy — how we handle your data.", {
      path: "/privacy",
    }),
    scripts: [
      breadcrumbSchema([
        { name: "AI Compass", url: SITE_URL },
        { name: "Privacy Policy", url: `${SITE_URL}/privacy` },
      ]),
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="shell">
      <div className="page-heading">
        <div className="eyebrow">LEGAL</div>
        <h1>Privacy Policy</h1>
        <p>Last updated: October 2026</p>
      </div>
      <div className="prose-page">
        <h2>What we collect</h2>
        <p>
          When you sign in with Google, we receive your Google account name, email address, and
          profile photo. This information is used only to identify your account within AI Compass.
        </p>
        <p>
          We store your bookmarks and any tool submissions you make. Bookmarks are stored locally in
          your browser. Submissions are stored in our database for review by the AI Compass team.
        </p>

        <h2>What we do not collect</h2>
        <p>
          We do not track your browsing history, sell your data to third parties, or serve
          advertising. We do not store passwords — authentication is handled entirely by Google.
        </p>

        <h2>Cookies and local storage</h2>
        <p>
          We use browser local storage to remember your theme preference (dark/light) and bookmarked
          tools. No tracking cookies are set.
        </p>

        <h2>Third-party services</h2>
        <p>We use:</p>
        <ul>
          <li>
            <strong>Firebase Authentication</strong> (Google) — for sign-in. Google's Privacy Policy
            applies.
          </li>
          <li>
            <strong>Supabase</strong> — for storing tool submissions and catalog data.
          </li>
          <li>
            <strong>Vercel</strong> — for hosting. Vercel may collect standard access logs.
          </li>
        </ul>

        <h2>Your rights</h2>
        <p>
          You can delete your account and all associated data by signing in and requesting deletion
          via our contact email. You can clear bookmarks at any time from your browser's local
          storage settings.
        </p>

        <h2>External links</h2>
        <p>
          AI Compass links to official AI tool websites. We are not responsible for the privacy
          practices of those external sites.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy? Contact us at <strong>privacy@aicompass.app</strong>.
        </p>
      </div>
    </div>
  );
}
