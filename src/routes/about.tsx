import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageHead, breadcrumbSchema, organisationSchema, SITE_URL } from '@/lib/metadata';

export const Route = createFileRoute('/about')({
  head: () => ({
    ...pageHead('About AI Compass', 'AI Compass is a free AI tool discovery platform. Find the right AI for coding, design, writing, research — no affiliate links, no invented ratings, direct to official sources.',
      { path: '/about', keywords: 'about AI Compass, AI tool directory, unbiased AI tools, AI Compass mission' }),
    scripts: [
      organisationSchema(),
      breadcrumbSchema([{ name: 'AI Compass', url: SITE_URL }, { name: 'About', url: `${SITE_URL}/about` }]),
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="shell">
      <div className="page-heading"><div className="eyebrow">A CLEARER WAY FORWARD</div><h1>AI Compass</h1><p>Find the Right AI for the Job.</p></div>
      <div className="prose-page">
        <h2>More possibility. Less noise.</h2>
        <p>The world of AI is moving quickly. Choosing a tool shouldn't mean spending hours finding your way through it.</p>
        <p>AI Compass organises tools around what you want to accomplish — building a website, researching a topic, making something new, or simply getting a little more done.</p>
        <h2>Follow the work, not the hype.</h2>
        <p>Explore tools by category and capability, learn what they offer, and go directly to their official websites. No invented ratings. No affiliate detours.</p>
        <h2>An honest starting point.</h2>
        <p>This first edition includes a demo catalog. Pricing is never shown, platform and history details are labeled as reported until verified, and popularity order is illustrative. Always confirm current details with the product itself.</p>
        <Button size="lg" asChild><Link to="/discover">Find your next tool<ArrowUpRight /></Link></Button>
      </div>
    </div>
  );
}
