import { createFileRoute, notFound, Link, useNavigate } from '@tanstack/react-router';
import { ChevronRight, ArrowUpRight, Check, X, ShieldAlert, GitCompareArrows, Lightbulb, BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTool, getCategory, tools, platformList } from '@/lib/catalog';
import { ToolLogo, ToolGrid, SectionHeading, DemoNote } from '@/components/compass/shared';
import { pageHead, breadcrumbSchema, toolSchema, SITE_URL } from '@/lib/metadata';

export const Route = createFileRoute('/tool/$slug')({
  loader: ({ params }) => { const t = getTool(params.slug); if (!t) throw notFound(); return t.slug; },
  head: ({ params }) => {
    const t = getTool(params.slug);
    if (!t) return pageHead('Tool not found', 'Explore AI tools with AI Compass.');
    const catNames  = t.categories.map(c => getCategory(c)?.name).filter(Boolean).join(', ');
    const description = `${t.short_description} ${t.name} by ${t.company} is listed under ${catNames}. Platforms: ${t.platforms.slice(0, 4).join(', ')}.`;
    return {
      ...pageHead(`${t.name} — AI Tool Profile`, description, { path: `/tool/${t.slug}`, keywords: `${t.name}, ${t.company}, ${catNames}, ${t.tags.join(', ')}`, type: 'article' }),
      scripts: [
        breadcrumbSchema([{ name: 'AI Compass', url: SITE_URL }, { name: 'Discover', url: `${SITE_URL}/discover` }, { name: t.name, url: `${SITE_URL}/tool/${t.slug}` }]),
        toolSchema(t),
      ],
    };
  },
  component: ToolPage,
});

function ToolPage() {
  const { slug } = Route.useParams();
  const navigate  = useNavigate();
  const t = getTool(slug);
  if (!t) return null;
  const alternatives = t.alternatives.map(s => tools.find(x => x.slug === s)!).filter(Boolean);
  const yesNo = (v: boolean | null) => v === null ? 'Check official website' : v ? 'Yes (reported)' : 'Not listed';

  function addToCompare() {
    navigate({ to: '/compare', search: { tools: t!.slug } });
  }

  return (
    <div className="shell">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/discover">Discover</Link><ChevronRight /><span aria-current="page">{t.name}</span>
      </nav>
      <div className="profile-heading">
        <ToolLogo tool={t} />
        <div>
          <h1>{t.name}</h1>
          <p>{t.short_description}</p>
          <p className="text-xs text-muted-foreground mt-2">by {t.company}</p>
          {/* Action buttons */}
          <div className="profile-actions">
            <Button size="sm" variant="outline" onClick={addToCompare}>
              <GitCompareArrows size={14}/> Compare
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link to="/find" search={{}}>
                <Lightbulb size={14}/> Find similar
              </Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <a href={t.official_url} target="_blank" rel="noopener noreferrer">
                <ArrowUpRight size={14}/> Official site
              </a>
            </Button>
          </div>
        </div>
      </div>
      <div className="profile-layout">
        <div className="profile-main">
          <div className="tags" aria-label="Categories">
            {t.categories.map(c => <Link key={c} to="/category/$slug" params={{ slug: c }} className="tag">{getCategory(c)?.name}</Link>)}
          </div>
          <h2>Overview</h2><p>{t.long_description}</p>
          <h2>Who it's for</h2>
          <div className="capabilities">{t.target_users.map(c => <span key={c}><Check />{c}</span>)}</div>
          <h2>Key features</h2>
          <div className="capabilities">{t.key_features.map(c => <span key={c}><Check />{c}</span>)}</div>
          <h2>How to get started</h2>
          <ol className="steps">{t.getting_started.map((s, i) => <li key={s}><span>{i + 1}</span>{s}</li>)}</ol>
          <h2>Where you can use it</h2>
          <div className="platform-grid" aria-label="Supported platforms">
            {platformList.map(p => { const on = t.platforms.includes(p); return <div key={p} className={on ? 'platform on' : 'platform'}>{on ? <Check /> : <X />}{p}</div>; })}
          </div>
          <p className="demo-note">Ticks show commonly reported availability, not yet verified.</p>
          <h2>Strengths &amp; limitations</h2>
          <div className="capabilities">{t.strengths.map(c => <span key={c}><Check />{c}</span>)}</div>
          <ul className="limitations">{t.limitations.map(l => <li key={l}>{l}</li>)}</ul>
          <h2>Background</h2><p>{t.history}</p>
          <DemoNote />
        </div>
        <aside className="profile-aside" aria-label="Tool quick facts">
          <Button asChild className="w-full">
            <a href={t.official_url} target="_blank" rel="noopener noreferrer">Visit Official Website<ArrowUpRight /></a>
          </Button>
          <Button variant="outline" className="w-full mt-2" onClick={addToCompare}>
            <GitCompareArrows size={14}/> Add to comparison
          </Button>
          <dl>
            {([['Company', t.company], ['Launched', t.launch_year ? `${t.launch_year} (reported)` : 'Not verified'], ['Pricing', 'Check official website'], ['Open source', t.open_source ? 'Yes (reported)' : 'Not listed'], ['API', yesNo(t.api_available)], ['Skill level', `${t.skill_level} · guide`], ['Status', t.verification_status], ['Last verified', t.last_verified ?? 'Not yet checked']] as [string, string][])
              .map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <p className="demo-note flex gap-2"><ShieldAlert size={14} className="shrink-0" />Information is not invented. Unverified details are labeled — always confirm with the source.</p>
        </aside>
      </div>
      {alternatives.length > 0 && (
        <section className="section tools-band" aria-label={`Alternatives to ${t.name}`}>
          <SectionHeading title={`Alternatives to ${t.name}`} description="Other tools for similar work." />
          <ToolGrid items={alternatives} />
        </section>
      )}
    </div>
  );
}
