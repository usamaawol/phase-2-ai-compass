import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { adminListTags, adminAddTag, adminDeleteTag } from '@/lib/admin-db';
import { pageHead } from '@/lib/metadata';

export const Route = createFileRoute('/admin/tags')({
  head: () => pageHead('Tags — Admin', 'Manage tags', { noindex: true }),
  component: AdminTags,
});

function AdminTags() {
  const [tags,    setTags]    = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTag,  setNewTag]  = useState('');
  const [busy,    setBusy]    = useState(false);
  const [error,   setError]   = useState('');

  async function reload() {
    setLoading(true);
    try { setTags(await adminListTags()); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed'); }
    finally { setLoading(false); }
  }

  useEffect(() => { reload(); }, []);

  async function add() {
    const name = newTag.trim().toLowerCase();
    if (!name) return;
    setBusy(true); setError('');
    try { await adminAddTag(name); setNewTag(''); await reload(); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Add failed'); }
    finally { setBusy(false); }
  }

  async function del(name: string) {
    if (!confirm(`Delete tag "${name}"?`)) return;
    setBusy(true);
    try { await adminDeleteTag(name); await reload(); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Delete failed'); }
    finally { setBusy(false); }
  }

  if (loading) return <div className="admin-page-loading">Loading…</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1>Tags</h1><p>{tags.length} tags</p></div>
      </div>
      {error && <p className="admin-error">{error}</p>}

      <div className="admin-add-row">
        <input
          className="admin-input"
          placeholder="New tag name (lowercase, hyphenated)"
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
        />
        <button className="admin-btn primary" onClick={add} disabled={busy || !newTag.trim()}>
          <Plus size={14} /> Add
        </button>
      </div>

      <div className="admin-tag-grid">
        {tags.map(tag => (
          <div key={tag} className="admin-tag-chip">
            <span>{tag}</span>
            <button title={`Delete ${tag}`} onClick={() => del(tag)} disabled={busy}>
              <Trash2 size={11} />
            </button>
          </div>
        ))}
        {tags.length === 0 && <p className="admin-empty">No tags yet.</p>}
      </div>
    </div>
  );
}
