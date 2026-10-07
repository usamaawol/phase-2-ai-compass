import { createFileRoute, notFound, Link } from '@tanstack/react-router';
import { ChevronRight, ArrowUpRight, Check, X, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTool, getCategory, tools, platformList } from '@/lib/catalog';
import { ToolLogo, ToolGrid, SectionHeading, DemoNote } from '@/components/compass/shared';
import { pageHead } from '@/lib/metadata';

export const Route = createFileRoute('/tool/$slug')({
  loader: ({ params }) => { const tool = getTool(params.slug); if (!tool) throw notFound(); return tool.slug; },
  head: ({ params }) => { const t = getTool(params.slug); return pageHead(t ? `${t.name} — AI Tool Profile` : 'Tool not found', t?.short_description ?? 'Explore AI tools with AI Compass.'); },
  component: ToolPage,
});

function ToolPage() {
  const { slug } = Route.useParams();
  const t = getTool(slug);
  if (!t) return null;
  const alternatives = t.alternatives.map(s => tools.find(x => x.slug === s)!).filter(Boolean);
  const yesNo = (v: boolean | null) => (v === null ? 'Check official website' : v ? 'Yes (reported)' : 'Not listed');
  return (
    <div className="shell">
      <div className="breadcrumb"><Link to="/discover">Discover</Link><ChevronRight /><span>{t.name}</span></div>
      <div className="profile-heading"><ToolLogo tool={t} /><div><h1>{t.name}</h1><p>{t.short_description}</p><p className="text-xs text-muted-foreground mt-2">by {t.company}</p></div></div>
      <div className="profile-layout">
        <div className="profile-main">
          <div className="tags">{t.categories.map(c => <Link key={c} to="/category/$slug" params={{ slug: c }} className="tag">{getCategory(c)?.name}</Link>)}</div>
          <h2>Overview</h2><p>{t.long_description}</p>
          <h2>Who it’s for</h2><div className="capabilities">{t.target_users.map(c => <span key={c}><Check />{c}</span>)}</div>
          <h2>Key features</h2><div className="capabilities">{t.key_features.map(c => <span key={c}><Check />{c}</span>)}</div>
          <h2>How to get started</h2><ol className="steps">{t.getting_started.map((s, i) => <li key={s}><span>{i + 1}</span>{s}</li>)}</ol>
          <h2>Where you can use it</h2>
          <div className="platform-grid">{platformList.map(p => { const on = t.platforms.includes(p); return <div key={p} className={on ? 'platform on' : 'platform'}>{on ? <Check /> : <X />}{p}</div>; })}</div>
          <p className="demo-note">Ticks show commonly reported availability, not yet verified. A cross means not listed here—check the official website.</p>
          <h2>Strengths & limitations</h2>
          <div className="capabilities">{t.strengths.map(c => <span key={c}><Check />{c}</span>)}</div>
          <ul className="limitations">{t.limitations.map(l => <li key={l}>{l}</li>)}</ul>
          <h2>Background</h2><p>{t.history}</p>
          <DemoNote />
        </div>
        <aside className="profile-aside">
          <Button asChild className="w-full"><a href={t.official_url} target="_blank" rel="noopener noreferrer">Visit Official Website<ArrowUpRight /></a></Button>
          <dl>{[['Company', t.company], ['Launched', t.launch_year ? `${t.launch_year} (reported)` : 'Not verified'], ['Pricing', 'Check official website'], ['Open source', t.open_source ? 'Yes (reported)' : 'Not listed'], ['API', yesNo(t.api_available)], ['Skill level', `${t.skill_level} · guide`], ['Status', t.verification_status], ['Last verified', t.last_verified ?? 'Not yet checked']].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          <p className="demo-note flex gap-2"><ShieldAlert size={14} className="shrink-0" />Information is not invented. Unverified details are labeled—always confirm with the source.</p>
        </aside>
      </div>
      {alternatives.length > 0 && <section className="section tools-band"><SectionHeading title={`Alternatives to ${t.name}`} description="Other tools for similar work." /><ToolGrid items={alternatives} /></section>}
    </div>
  );
}
