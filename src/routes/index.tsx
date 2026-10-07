import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowRight, ArrowUpRight, Check, Compass, GitCompareArrows, Telescope, ExternalLink } from 'lucide-react';
import hero from '@/assets/compass-hero.jpg';
import { Button } from '@/components/ui/button';
import { CategoryGrid, SectionHeading, ToolGrid, SearchBox, TaskChips, DemoNote } from '@/components/compass/shared';
import { tools } from '@/lib/catalog';
import { pageHead, organisationSchema, SITE_URL } from '@/lib/metadata';

export const Route = createFileRoute('/')({
  head: () => ({
    ...pageHead(
      'Find the Right AI for the Job',
      'Discover the best AI tools for coding, design, writing, research, productivity, and more. AI Compass organises 52+ AI tools across 26 categories so you find the right one fast.',
      { path: '/', keywords: 'best AI tools 2025, AI tool directory, ChatGPT alternatives, AI for coding, AI for writing, AI for design' },
    ),
    scripts: [
      organisationSchema(),
      { type: 'application/ld+json', children: JSON.stringify({
        '@context': 'https://schema.org', '@type': 'ItemList',
        name: 'Featured AI Tools', url: SITE_URL, numberOfItems: 6,
        itemListElement: tools.slice(0, 6).map((t, i) => ({
          '@type': 'ListItem', position: i + 1, name: t.name,
          url: `${SITE_URL}/tool/${t.slug}`, description: t.short_description,
        })),
      })},
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <section className="hero">
        <img className="hero-image" src={hero} width={1920} height={1024} fetchPriority="high"
          alt="A silver compass with a lime needle on a charcoal navigation map" />
        <div className="hero-shade" />
        <div className="shell hero-content fade-in">
          <div className="eyebrow"><span className="status-dot" />YOUR DIRECTION IN THE WORLD OF AI</div>
          <h1>Find the right AI.<br /><span>For the job.</span></h1>
          <p className="hero-description">Less searching. More creating. Discover the AI tools that help you build, think, and do your best work.</p>
          <div className="hero-buttons">
            <Button size="lg" asChild><Link to="/discover">Explore AI Tools<ArrowUpRight /></Link></Button>
            <Button size="lg" variant="outline" asChild><Link to="/categories">Browse Categories<ArrowRight /></Link></Button>
          </div>
          <SearchBox className="hero-search" />
          <TaskChips />
          <div className="hero-meta">
            <span><Check />Curated for real work</span>
            <span><Check />Direct to official websites</span>
            <span><Check />No account needed</span>
          </div>
        </div>
      </section>
      <section className="section shell" aria-label="AI tool categories">
        <SectionHeading eyebrow="FOLLOW YOUR CURIOSITY" title="What are you looking for?" description="Start with what you want to do. Find what helps you do it." link="categories" label="All 26 categories" />
        <CategoryGrid featured />
      </section>
      <section className="tools-band" aria-label="Featured AI tools">
        <div className="section shell">
          <SectionHeading eyebrow="THE TOOLS EVERYONE'S TALKING ABOUT" title="A good place to start." description="Explore popular AI tools for your next big idea—or your everyday work." link="discover" label="Explore all tools" />
          <ToolGrid items={tools.slice(0, 6)} />
          <DemoNote />
        </div>
      </section>
      <section className="find-section" aria-label="Task-based AI search">
        <div className="find-inner">
          <div className="eyebrow"><Compass size={15} />A LITTLE DIRECTION GOES A LONG WAY</div>
          <h2>Not sure which AI you need?</h2>
          <p>Describe what you want to do and we'll match you with the right tools.<br />Transparent matching — no black box.</p>
          <SearchBox placeholder="I want to..." />
          <TaskChips />
          <div style={{ marginTop: 16 }}>
            <Button variant="outline" size="sm" asChild>
              <Link to="/find">Try the full AI finder <ArrowUpRight size={13}/></Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="section shell" aria-label="Why AI Compass">
        <SectionHeading eyebrow="LESS NOISE. MORE POSSIBILITY." title="AI is everywhere. Find your direction." />
        <div className="why-grid">
          {[
            { icon: Compass,          title: 'Discover with purpose',    text: 'Explore tools organised around the work you actually want to do.' },
            { icon: GitCompareArrows, title: 'Make a considered choice',  text: "Understand each tool's capabilities before taking the next step." },
            { icon: Telescope,        title: 'Expand your toolkit',       text: 'Find a new way to approach coding, creativity, learning, and more.' },
            { icon: ExternalLink,     title: 'Go straight to the source', text: 'Every tool takes you directly to its official website. No detours.' },
          ].map(({ icon: Icon, title, text }) => (
            <div className="why-item" key={title}><Icon strokeWidth={1.6} /><h3>{title}</h3><p>{text}</p></div>
          ))}
        </div>
      </section>
    </>
  );
}
