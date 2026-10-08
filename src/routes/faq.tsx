import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { pageHead, breadcrumbSchema, SITE_URL } from "@/lib/metadata";

export const Route = createFileRoute("/faq")({
  head: () => ({
    ...pageHead(
      "Frequently Asked Questions",
      "Common questions about AI Compass — how it works, how to submit tools, sign-in, and data accuracy.",
      {
        path: "/faq",
        keywords: "AI Compass FAQ, how AI Compass works, submit AI tool, AI tool accuracy",
      },
    ),
    scripts: [
      breadcrumbSchema([
        { name: "AI Compass", url: SITE_URL },
        { name: "FAQ", url: `${SITE_URL}/faq` },
      ]),
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "Is AI Compass free?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. AI Compass is completely free. We don't charge for access, don't show ads, and don't earn affiliate commissions.",
              },
            },
            {
              "@type": "Question",
              name: "How accurate is the tool information?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Every unverified detail is labeled. We never invent pricing, founder details, or platform support. If we don't know something we say so. Always confirm current details on the tool's official website.",
              },
            },
            {
              "@type": "Question",
              name: "Why do I need to sign in?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "The home page is public. Sign-in with Google is required to access Discover, Categories, Compare, Find my AI, and Submit a Tool — this helps us prevent spam submissions.",
              },
            },
            {
              "@type": "Question",
              name: "How do I submit a tool?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Sign in with Google, then go to Submit a Tool. Provide the name, official URL, and a short description. Our team reviews every submission before publishing.",
              },
            },
          ],
        }),
      },
    ],
  }),
  component: FaqPage,
});

const FAQS = [
  {
    q: "Is AI Compass free?",
    a: "Yes. AI Compass is completely free. We don't charge for access, don't show ads, and don't earn affiliate commissions from any tool.",
  },
  {
    q: "How accurate is the tool information?",
    a: "We never invent pricing, founder details, launch dates, or capability claims. Every unverified detail is explicitly labeled. AI products change rapidly — always confirm current details on each tool's official website before making decisions.",
  },
  {
    q: "Why do I need to sign in to use some features?",
    a: "The home page, About, FAQ, Privacy, Terms, and Changelog are fully public. Sign-in (Google) is required for Discover, Categories, Compare, Find my AI, Saved tools, and Submit a Tool. This helps us prevent spam and lets us associate bookmarks and submissions with your account.",
  },
  {
    q: "How do I submit an AI tool?",
    a: "Sign in with Google, then visit the Submit a Tool page. Provide the tool name, official website URL (https only), company name, and a short description. Our team reviews every submission before it appears in the catalog.",
  },
  {
    q: "What are the guidelines for submissions?",
    a: "The tool must have an official website (HTTPS). Only official URLs — no affiliate links or redirect services. The tool must be publicly available (no private betas). Include only information you know to be accurate — we will label anything unconfirmed.",
  },
  {
    q: 'What does "Not verified" mean on a tool profile?',
    a: "\"Not verified\" means the tool's details have not yet been reviewed by a human administrator. It does not mean the tool is fake or low-quality — it just means we haven't confirmed the details yet. Verified tools have been manually reviewed by our team.",
  },
  {
    q: "Can I compare tools?",
    a: "Yes. Go to Compare in the sidebar. You can add up to 4 tools and see them side by side — capabilities, platforms, open source status, API availability, and more. There are also quick-start presets like ChatGPT vs Claude.",
  },
  {
    q: 'How does "Find my AI" work?',
    a: 'Find my AI lets you describe a task in plain English (e.g. "generate images for my blog") and matches you with relevant tools based on their categories, tags, and descriptions. The scoring is transparent — no black box AI model, just keyword and category matching.',
  },
  {
    q: "Are there affiliate links on AI Compass?",
    a: "No. Every external link on AI Compass points directly to the official website of the tool. We do not earn commissions from any tool, platform, or company.",
  },
  {
    q: "How do I delete my account or data?",
    a: "Email hello@aicompass.app and we'll delete your account and all associated data. You can also clear your bookmarks at any time from your browser's local storage settings.",
  },
  {
    q: "I found incorrect information — how do I report it?",
    a: "Email hello@aicompass.app with the tool name and the specific error. We'll review and correct it. You can also submit a corrected version via the Submit a Tool page.",
  },
  {
    q: "How can I get my tool listed?",
    a: "Sign in and use the Submit a Tool page. Submissions are reviewed manually. To speed up review, include a clear description and the official website URL. We prioritize tools that are publicly available and have clear, factual descriptions.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span>{q}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && <p className="faq-answer">{a}</p>}
    </div>
  );
}

function FaqPage() {
  return (
    <div className="shell">
      <div className="page-heading">
        <div className="eyebrow">COMMON QUESTIONS</div>
        <h1>FAQ</h1>
        <p>Quick answers to the most common questions about AI Compass.</p>
      </div>

      <div className="faq-list">
        {FAQS.map((item) => (
          <FaqItem key={item.q} {...item} />
        ))}
      </div>

      <div className="faq-footer">
        <p>
          Still have a question?{" "}
          <a href="mailto:hello@aicompass.app" className="text-primary">
            Email us
          </a>{" "}
          or{" "}
          <Link to="/submit" className="text-primary">
            submit a tool
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
