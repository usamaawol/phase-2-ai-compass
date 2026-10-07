import { createFileRoute, Link } from '@tanstack/react-router';
import { GitCompareArrows, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { pageHead, breadcrumbSchema, SITE_URL } from '@/lib/metadata';

export const Route = createFileRoute('/compare')({
  head: () => ({
    ...pageHead('Compare AI Tools Side by Side', 'Compare AI tools side by side to find the best fit. Side-by-side AI tool comparison coming soon to AI Compass.',
      { path: '/compare', keywords: 'compare AI tools, AI tool comparison, ChatGPT vs Claude, best AI for coding' }),
    scripts: [breadcrumbSchema([{ name: 'AI Compass', url: SITE_URL }, { name: 'Compare', url: `${SITE_URL}/compare` }])],
  }),
  component: Compare,
});

function Compare() {
  return (
    <div className="shell">
      <div className="page-heading"><div className="eyebrow">MAKE A MORE INFORMED CHOICE</div><h1>Compare AI tools</h1></div>
      <div className="compare-placeholder">
        <GitCompareArrows strokeWidth={1.4} />
        <h2>A clearer comparison. Coming soon.</h2>
        <p>Side-by-side comparisons are on the horizon. In the meantime, explore tool profiles to understand capabilities and find your best fit.</p>
        <Button size="lg" asChild><Link to="/discover">Explore tool profiles<ArrowUpRight /></Link></Button>
      </div>
    </div>
  );
}
