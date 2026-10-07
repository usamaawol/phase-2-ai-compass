import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ShieldCheck, ShieldOff, Eye, EyeOff, Star, TrendingUp, Archive } from 'lucide-react';
import { adminListTools, adminArchiveTool, adminDeleteTool, adminVerifyTool, adminUnverifyTool, adminSetPublished, adminSetFeatured, adminSetTrending, type ToolRecord } from '@/lib/admin-db';
import { useAuth } from '@/hooks/use-auth';
import { pageHead } from '@/lib/metadata';

export const Route = createFileRoute('/admin/tools/')({
  head: () => pageHead('AI Tools — Admin', 'Manage AI tools', { noindex: true }),
  component: AdminTools,
});

function AdminTools() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tools,   setTools]   = useState<(ToolRecord & { published: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [filter,  setFilter]  = useState<'all' | 'published' | 'draft' | 'archived'>('all');
  const [search,  setSearch]  = useState('');
  const [busy,    setBusy]    = useState<string | null>(null);

  async function reload() {
    setLoading(true);
    try { setTools(await adminListTools() as (ToolRecord & { published: boolean })[]); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed to load'); }
    finally { setLoading(false); } 
  }

  useEffect(() => { reload(); }, []);

  async function act(slug: string, fn: () => Promise<unknown>) {
    setBusy(slug);
    try { await fn(); await reload(); }
    catch (e: unknown) { alert(e instanceof Error ? e.message : 'Action failed'); }
    finally { setBusy(null); }
  }

  const visible = tools.filter(t => {
    const matchStatus =
      filter === 'all'      ? true :
      filter === 'published'? t.status === 'published' :
      filter === 'draft'    ? t.status === 'draft' :
      filter === 'archived' ? t.status === 'archived' : true;
    const matchSearch = search === '' || t.name.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (loading) return <div className="admin-page-loading">Loading tools…</div>;
  if (error)   return <div className="admin-error">Error: {error}</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>AI Tools</h1>
          <p>{tools.length} tools in catalog</p>
        </div>
        <Link to="/admin/tools/new" className="admin-btn primary">
          <Plus size={15} /> Add tool
        </Link>
      </div>

      {/* Filters */}
      <div className="admin-toolbar">
        <input
          className="admin-search"
          placeholder="Search tools…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="admin-filter-tabs">
          {(['all','published','draft','archived'] as const).map(f => (
            <button key={f} className={`admin-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tool</th>
              <th>Company</th>
              <th>Status</th>
              <th>Verified</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(t => (
              <tr key={t.slug} className={busy === t.slug ? 'opacity-50' : ''}>
                <td>
                  <div className="admin-tool-name">{t.name}</div>
                  <div className="admin-tool-slug">/tool/{t.slug}</div>
                </td>
                <td>{t.company}</td>
                <td>
                  <span className={`admin-badge-pill status-${t.status}`}>{t.status}</span>
                </td>
                <td>
                  <span className={`admin-badge-pill verif-${t.verification_status}`}>
                    {t.verification_status.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  {t.is_featured ? <Star size={14} className="text-primary fill-primary" /> : '—'}
                </td>
                <td>
                  <div className="admin-actions">
                    <button title="Edit" onClick={() => navigate({ to: '/admin/tools/$slug/edit', params: { slug: t.slug } })}>
                      <Pencil size={13} />
                    </button>
                    <button title={t.status === 'published' ? 'Unpublish' : 'Publish'}
                      onClick={() => act(t.slug, () => adminSetPublished(t.slug, t.status !== 'published'))}>
                      {t.status === 'published' ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                    <button title="Verify"
                      onClick={() => act(t.slug, () => adminVerifyTool(t.slug, user?.uid ?? ''))}>
                      <ShieldCheck size={13} />
                    </button>
                    <button title="Unverify" onClick={() => act(t.slug, () => adminUnverifyTool(t.slug))}>
                      <ShieldOff size={13} />
                    </button>
                    <button title={t.is_featured ? 'Unfeature' : 'Feature'}
                      onClick={() => act(t.slug, () => adminSetFeatured(t.slug, !t.is_featured))}>
                      <Star size={13} />
                    </button>
                    <button title={t.is_trending ? 'Remove trending' : 'Mark trending'}
                      onClick={() => act(t.slug, () => adminSetTrending(t.slug, !t.is_trending))}>
                      <TrendingUp size={13} />
                    </button>
                    <button title="Archive" className="warn"
                      onClick={() => { if (confirm(`Archive ${t.name}?`)) act(t.slug, () => adminArchiveTool(t.slug)); }}>
                      <Archive size={13} />
                    </button>
                    <button title="Delete permanently" className="danger"
                      onClick={() => { if (confirm(`Permanently delete ${t.name}? This cannot be undone.`)) act(t.slug, () => adminDeleteTool(t.slug)); }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr><td colSpan={6} className="admin-empty">No tools found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
