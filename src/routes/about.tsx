import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ShieldCheck, ExternalLink, Users, Bot, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tools, categories } from "@/lib/catalog";
import { pageHead, breadcrumbSchema, organisationSchema, SITE_URL } from "@/lib/metadata";

export const Route = createFileRoute("/about")({
  head: () => ({
    ...pageHead(
      "About AI Compass",
      "AI Compass is a free, unbiased AI tool discovery platform. Find the right AI for coding, design, writing, research — no affiliate links, no invented ratings.",
      {
        path: "/about",
        keywords: "about AI Compass, AI tool directory, unbiased AI tools, AI Compass mission",
      },
    ),
    scripts: [
      organisationSchema(),
      breadcrumbSchema([
        { name: "AI Compass", url: SITE_URL },
        { name: "About", url: `${SITE_URL}/about` },
      ]),
    ],
  }),
  component: About,
});

const openSourceCount = tools.filter((t) => t.open_source).length;

function About() {
  return (
    <div className="shell">
      <div className="page-heading">
        <div className="eyebrow">A CLEARER WAY FORWARD</div>
        <h1>AI Compass</h1>
        <p>Find the Right AI for the Job.</p>
      </div>

      {/* Stats row */}
      <div className="about-stats">
        <div className="about-stat">
          <Bot size={22} />
          <div>
            <strong>{tools.length}</strong>
            <span>AI tools catalogued</span>
          </div>
        </div>
        <div className="about-stat">
          <LayoutGrid size={22} />
          <div>
            <strong>{categories.length}</strong>
            <span>categories</span>
          </div>
        </div>
        <div className="about-stat">
          <ShieldCheck size={22} />
          <div>
            <strong>{openSourceCount}</strong>
            <span>open source tools</span>
          </div>
        </div>
        <div className="about-stat">
          <Users size={22} />
          <div>
            <strong>Free</strong>
            <span>always, no ads</span>
          </div>
        </div>
      </div>

      <div className="prose-page">
        <h2>More possibility. Less noise.</h2>
        <p>
          The world of AI is moving quickly. New tools appear every week, old ones change their
          pricing overnight, and the difference between the right and wrong tool for a job can cost
          you hours.
        </p>
        <p>
          AI Compass organises tools around what you want to accomplish — building a website,
          researching a topic, making something new, or simply getting a little more done. We put
          the work first.
        </p>

        <h2>What we believe.</h2>
        <p>
          <strong>No invented information.</strong> We never fabricate pricing, founder details,
          launch dates, or platform support. If we don't know something, we say so. Every unverified
          detail is labelled.
        </p>
        <p>
          <strong>No affiliate links.</strong> Every external link goes to the official website of
          the tool. We don't earn commissions — we exist to help you find the right tool, not to
          push you toward any particular one.
        </p>
        <p>
          <strong>No ratings we can't back up.</strong> We don't show star ratings or popularity
          scores as if they were verified facts. Popularity order in the demo catalog is
          illustrative only.
        </p>

        <h2>Who is this for?</h2>
        <p>
          Developers discovering AI coding tools. Designers looking for image and video generation.
          Researchers who need AI search and summarisation. Students finding the right AI tutor.
          Business teams evaluating productivity tools. Anyone who wants to understand the AI
          landscape without wading through marketing noise.
        </p>

        <h2>The catalog today.</h2>
        <p>
          The current catalog is a demo — {tools.length} tools across {categories.length}{" "}
          categories, built to demonstrate what the platform can do. Pricing is never shown.
          Platform details and histories are labeled as reported until an administrator verifies
          them.
        </p>
        <p>
          The next phase connects the catalog to a live database, allowing administrators to add,
          edit, verify, and publish tools without touching source code. Signed-in users can submit
          tools for review.
        </p>

        <h2>Know a tool we're missing?</h2>
        <p>
          The catalog grows with community help. If you know an AI tool that should be here, submit
          it for review.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
          <Button size="lg" asChild>
            <Link to="/discover">
              Find your next tool
              <ArrowUpRight />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/submit">Submit a tool</Link>
          </Button>
        </div>

        <h2>Accuracy and verification.</h2>
        <p>
          AI products change rapidly — pricing, features, platforms, and availability can all shift
          without notice. AI Compass is not a substitute for reading the official documentation of
          any tool before using or paying for it.
        </p>
        <p>
          Each tool profile shows a verification status. "Not verified" means details have not yet
          been reviewed by a human administrator. Admins verify tools manually — verification
          records the date and reviewer, not an automated test or quality endorsement.
        </p>

        <p style={{ marginTop: 32 }}>
          <a
            href="mailto:hello@aicompass.app"
            className="text-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14 }}
          >
            Get in touch <ExternalLink size={13} />
          </a>
          {" · "}
          <Link to="/privacy" className="text-primary" style={{ fontSize: 14 }}>
            Privacy policy
          </Link>
          {" · "}
          <Link to="/terms" className="text-primary" style={{ fontSize: 14 }}>
            Terms of service
          </Link>
        </p>
      </div>
    </div>
  );
}
