import { createFileRoute } from '@tanstack/react-router';
import { CategoryGrid } from '@/components/compass/shared';
import { pageHead, breadcrumbSchema, itemListSchema, SITE_URL } from '@/lib/metadata';
import { categories } from '@/lib/catalog';

export const Route = createFileRoute('/categories')({
  head: () => ({
    ...pageHead(
      'Browse 26 AI Tool Categories',
      'Explore AI tools organised across 26 categories — coding, writing, research, image generation, video editing, automation, and more. Find your category.',
      { path: '/categories', keywords: 'AI categories, AI tools by type, coding AI, image generation AI, writing AI, video AI, AI automation' },
    ),
    scripts: [
      breadcrumbSchema([{ name: 'AI Compass', url: SITE_URL }, { name: 'Categories', url: `${SITE_URL}/categories` }]),
      itemListSchema('26 AI Tool Categories', `${SITE_URL}/categories`, categories.map(c => ({ name: c.name, url: `${SITE_URL}/category/${c.slug}` }))),
    ],
  }),
  component: Categories,
});

function Categories() {
  return (
    <div className="shell pb-16">
      <div className="page-heading">
        <div className="eyebrow">26 WAYS TO FIND YOUR DIRECTION</div>
        <h1>What do you want to do?</h1>
        <p>From your first idea to your final edit. Explore AI by the work it helps you accomplish.</p>
      </div>
      <CategoryGrid />
    </div>
  );
}
