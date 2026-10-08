import { createFileRoute, Link } from '@tanstack/react-router';
import { pageHead, breadcrumbSchema, SITE_URL } from '@/lib/metadata';

export const Route = createFileRoute('/terms')({
  head: () => ({
    ...pageHead('Terms of Service', 'AI Compass Terms of Service.',
      { path: '/terms' }),
    scripts: [breadcrumbSchema([{ name: 'AI Compass', url: SITE_URL }, { name: 'Terms', url: `${SITE_URL}/terms` }])],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="shell">
      <div className="page-heading">
        <div className="eyebrow">LEGAL</div>
        <h1>Terms of Service</h1>
        <p>Last updated: October 2026</p>
      </div>
      <div className="prose-page">
        <h2>Using AI Compass</h2>
        <p>AI Compass is a free AI tool discovery platform. By using the site you agree to these terms. We reserve the right to update them at any time — continued use constitutes acceptance.</p>

        <h2>Accounts</h2>
        <p>Sign-in is via Google OAuth. You are responsible for any activity under your account. We may suspend accounts that abuse the platform.</p>

        <h2>Tool submissions</h2>
        <p>When you submit a tool, you confirm that:</p>
        <ul>
          <li>The tool is real and publicly available.</li>
          <li>You are submitting the official website URL, not an affiliate link.</li>
          <li>The information you provide is accurate to the best of your knowledge.</li>
          <li>You are not submitting spam, malware, or scam tools.</li>
        </ul>
        <p>We reserve the right to reject any submission without explanation.</p>

        <h2>Accuracy of information</h2>
        <p>AI Compass provides a catalog of AI tools for discovery purposes. Tool information is illustrative and may be out of date. We never invent pricing, founder details, or capability claims. Always verify current details on the tool's official website before making decisions.</p>

        <h2>External links</h2>
        <p>We link to official AI tool websites. We are not affiliated with, endorsed by, or responsible for any of those products or their content.</p>

        <h2>No warranty</h2>
        <p>AI Compass is provided "as is". We make no warranties about uptime, accuracy, or suitability for any purpose.</p>

        <h2>Limitation of liability</h2>
        <p>To the maximum extent permitted by law, AI Compass is not liable for any indirect, incidental, or consequential damages arising from your use of the platform.</p>

        <h2>Contact</h2>
        <p>Questions? Email <strong>legal@aicompass.app</strong> or see our <Link to="/privacy" className="text-primary">Privacy Policy</Link>.</p>
      </div>
    </div>
  );
}
