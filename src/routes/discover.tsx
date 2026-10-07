import { createFileRoute } from '@tanstack/react-router';
import { Discovery } from '@/components/compass/discovery';
import { discoverySearch } from '@/lib/search';
import { pageHead, breadcrumbSchema, itemListSchema, SITE_URL } from '@/lib/metadata';
import { tools } from '@/lib/catalog';

export const Route = createFileRoute('/discover')({
  validateSearch: discoverySearch,
  head: () => ({
    ...pageHead(
      'Discover AI Tools',
      'Browse and filter 52+ AI tools by category, platform, pricing, and skill level. Find the exact AI tool for coding, design, writing, research, and more.',
      { path: '/discover', keywords: 'AI tool search, filter AI tools, AI tools by category, free AI tools, AI tools list 2025' },
    ),
    scripts: [
      breadcrumbSchema([{ name: 'AI Compass', url: SITE_URL }, { name: 'Discover', url: `${SITE_URL}/discover` }]),
      itemListSchema('AI Tools Directory', `${SITE_URL}/discover`, tools.slice(0, 20).map(t => ({ name: t.name, url: `${SITE_URL}/tool/${t.slug}` }))),
    ],
  }),
  component: Discover,
});

function Discover() {
  const filters  = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <div className="shell">
      <div className="page-heading">
        <div className="eyebrow">YOUR NEXT TOOL IS OUT THERE</div>
        <h1>Discover AI Tools</h1>
        <p>Browse and filter 52+ AI tools by category, capability, platform, and more.</p>
      </div>
      <Discovery filters={filters} onChange={next => navigate({ search: next, replace: true })} />
    </div>
  );
}
