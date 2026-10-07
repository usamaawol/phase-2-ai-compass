import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Star, StarOff, ArrowUp, ArrowDown } from 'lucide-react';
import { adminListTools, adminSetFeatured, adminUpdateTool, type ToolRecord } from '@/lib/admin-db';
import { pageHead } from '@/lib/metadata';

export const Route = createFileRoute('/admin/featured')({
  head: () => pageHead('Featured Tools — Admin', 'Manage featured tools', { noindex: true }),
  component: AdminFeatured,
});

function AdminFeatured() {
  const [tools,   setTools]   = useState<(ToolRecord & { published: boolean })[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy,    setBusy]    = useState<string | null>(null);
  const [error,   setError]   = useState('');

  async function reload() {
    setLoading(true);
    try {
      const all = await adminListTools() as (ToolRecord & { published: boolean })[];
      setTools(all.sort((a, b) => (a.featured_order ?? 999) - (b.featured_order ?? 999)));
    } catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed'); }
    finally { setLoading(false); }
  }

  useEffect(() => { reload(); }, []);

  const featured    = tools.filter(t => t.is_featured);
  const notFeatured = tools.filter(t => !t.is_featured && t.status === 'published');

  async function act(slug: string, fn: () => Promise<unknown>) {
    setBusy(slug);
    try { await fn(); await reload(); }
    catch (e: unknown) { alert(e instanceof Error ? e.message : 'Action failed'); }
    finally { setBusy(null); }
  }

  async function moveOrder(slug: string, direction: 'up' | 'down') {
    const idx = featured.findIndex(t => t.slug === slug);
    if (idx < 0) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= featured.length) return;
    const a = featured[idx]!;
    const b = featured[swapIdx]!;
    await adminUpdateTool(a.slug, { featured_order: b.featured_order });
    await adminUpdateTool(b.slug, { featured_order: a.featured_order });
    await reload();
  }

  if (loading) return <div className="admin-page-loading">Loading…</div>;
  if (error)   return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1>Featured Tools</h1><p>{featured.length} featured · shown on homepage</p></div>
      </div>

      {/* Featured list */}
      <section className="admin-section">
        <h2>Currently featured ({featured.length})</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Order</th><th>Tool</th><th>Company</th><th>Move</th><th>Remove</th></tr></thead>
            <tbody>
              {featured.map((t, i) => (
                <tr key={t.slug} className={busy === t.slug ? 'opacity-50' : ''}>
                  <td className="admin-order-badge">{i + 1}</td>
                  <td><strong>{t.name}</strong></td>
                  <td>{t.company}</td>
                  <td>
                    <div className="admin-actions">
                      <button title="Move up"   disabled={i === 0}                    onClick={() => act(t.slug, () => moveOrder(t.slug, 'up'))}><ArrowUp size={13} /></button>
                      <button title="Move down" disabled={i === featured.length - 1}  onClick={() => act(t.slug, () => moveOrder(t.slug, 'down'))}><ArrowDown size={13} /></button>
                    </div>
                  </td>
                  <td>
                    <button title="Remove from featured" className="warn"
                      onClick={() => act(t.slug, () => adminSetFeatured(t.slug, false))}>
                      <StarOff size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              {featured.length === 0 && <tr><td colSpan={5} className="admin-empty">No featured tools.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add to featured */}
      <section className="admin-section">
        <h2>Add to featured</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Tool</th><th>Company</th><th>Action</th></tr></thead>
            <tbody>
              {notFeatured.map(t => (
                <tr key={t.slug} className={busy === t.slug ? 'opacity-50' : ''}>
                  <td>{t.name}</td>
                  <td>{t.company}</td>
                  <td>
                    <button className="admin-btn sm primary"
                      onClick={() => act(t.slug, () => adminSetFeatured(t.slug, true, featured.length))}>
                      <Star size={12} /> Feature
                    </button>
                  </td>
                </tr>
              ))}
              {notFeatured.length === 0 && <tr><td colSpan={3} className="admin-empty">All published tools are featured.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
