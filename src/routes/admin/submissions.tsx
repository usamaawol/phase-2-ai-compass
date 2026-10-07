import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { adminListSubmissions, adminApproveSubmission, adminRejectSubmission } from '@/lib/admin-db';
import { useAuth } from '@/hooks/use-auth';
import { pageHead } from '@/lib/metadata';

export const Route = createFileRoute('/admin/submissions')({
  head: () => pageHead('Submissions — Admin', 'Review tool submissions', { noindex: true }),
  component: AdminSubmissions,
});

type Sub = Awaited<ReturnType<typeof adminListSubmissions>>[number];

function AdminSubmissions() {
  const { user } = useAuth();
  const [subs,    setSubs]    = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [busy,    setBusy]    = useState<string | null>(null);
  const [preview, setPreview] = useState<Sub | null>(null);
  const [reason,  setReason]  = useState('');
  const [error,   setError]   = useState('');

  async function reload() {
    setLoading(true);
    try { setSubs(await adminListSubmissions(filter === 'all' ? undefined : filter)); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : 'Failed'); }
    finally { setLoading(false); }
  }

  useEffect(() => { reload(); }, [filter]);

  async function approve(id: string) {
    if (!confirm('Approve this submission and create the tool?')) return;
    setBusy(id);
    try { await adminApproveSubmission(id, user?.uid ?? ''); await reload(); }
    catch (e: unknown) { alert(e instanceof Error ? e.message : 'Approve failed'); }
    finally { setBusy(null); }
  }

  async function reject(id: string) {
    const r = reason.trim() || prompt('Rejection reason (optional):') ?? '';
    setBusy(id);
    try { await adminRejectSubmission(id, r, user?.uid ?? ''); setReason(''); await reload(); }
    catch (e: unknown) { alert(e instanceof Error ? e.message : 'Reject failed'); }
    finally { setBusy(null); }
  }

  if (loading) return <div className="admin-page-loading">Loading…</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div><h1>Submissions</h1><p>User-submitted AI tools awaiting review</p></div>
      </div>

      <div className="admin-filter-tabs">
        {(['pending','approved','rejected','all'] as const).map(f => (
          <button key={f} className={`admin-tab${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Submitted</th><th>Tool name</th><th>By</th><th>Status</th><th>Review note</th><th>Actions</th></tr></thead>
          <tbody>
            {subs.map(sub => {
              const d = sub.data as Record<string, unknown>;
              return (
                <tr key={sub.id} className={busy === sub.id ? 'opacity-50' : ''}>
                  <td className="text-xs">{new Date(sub.created_at).toLocaleDateString()}</td>
                  <td><strong>{String(d.name ?? '—')}</strong></td>
                  <td className="text-xs font-mono">{sub.user_id.slice(0, 8)}…</td>
                  <td><span className={`admin-badge-pill status-${sub.status}`}>{sub.status}</span></td>
                  <td className="admin-cell-desc">{sub.review_note || '—'}</td>
                  <td>
                    <div className="admin-actions">
                      <button title="Preview data" onClick={() => setPreview(sub)}><Eye size={13} /></button>
                      {sub.status === 'pending' && <>
                        <button title="Approve" className="success" onClick={() => approve(sub.id)}><CheckCircle size={13} /></button>
                        <button title="Reject"  className="danger"  onClick={() => reject(sub.id)}><XCircle size={13} /></button>
                      </>}
                    </div>
                  </td>
                </tr>
              );
            })}
            {subs.length === 0 && <tr><td colSpan={6} className="admin-empty">No submissions found.</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Preview modal */}
      {preview && (
        <div className="login-overlay" onClick={e => e.target === e.currentTarget && setPreview(null)}>
          <div className="admin-preview-modal">
            <div className="admin-preview-header">
              <h3>Submission data</h3>
              <button onClick={() => setPreview(null)}>✕</button>
            </div>
            <pre className="admin-preview-pre">{JSON.stringify(preview.data, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
