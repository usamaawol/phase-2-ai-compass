import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { adminGetSettings, adminSaveSettings } from '@/lib/admin-db';
import { pageHead } from '@/lib/metadata';

export const Route = createFileRoute('/admin/settings')({
  head: () => pageHead('Settings — Admin', 'Site settings', { noindex: true }),
  component: AdminSettings,
});

function AdminSettings() {
  const [form,    setForm]    = useState({ announcement: '', tagline: '', submissions_open: false });
  const [loading, setLoading] = useState(true);
  const [busy,    setBusy]    = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    adminGetSettings()
      .then(s => setForm({ announcement: s.announcement, tagline: s.tagline, submissions_open: s.submissions_open }))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(''); setSaved(false);
    try { await adminSaveSettings(form); setSaved(true); setTimeout(() => setSaved(false), 3000); }
    catch (err: unknown) { setError(err instanceof Error ? err.message : 'Save failed'); }
    finally { setBusy(false); }
  }

  if (loading) return <div className="admin-page-loading">Loading…</div>;

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <h1>Site Settings</h1>
        <p>Public-facing configuration. Changes take effect immediately.</p>
      </div>

      <form onSubmit={save} className="admin-form admin-form-narrow">
        <div className="admin-field">
          <label className="admin-field-label">Site tagline</label>
          <input className="admin-input" value={form.tagline}
            onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
            placeholder="Find the Right AI for the Job." />
          <p className="admin-field-hint">Shown in the footer and metadata.</p>
        </div>

        <div className="admin-field">
          <label className="admin-field-label">Site-wide announcement</label>
          <textarea className="admin-input admin-textarea" rows={3} value={form.announcement}
            onChange={e => setForm(f => ({ ...f, announcement: e.target.value }))}
            placeholder="Optional announcement banner text. Leave blank to hide." />
          <p className="admin-field-hint">Displayed as a banner at the top of every page.</p>
        </div>

        <div className="admin-field">
          <label className="admin-check-label admin-check-lg">
            <input type="checkbox" checked={form.submissions_open}
              onChange={e => setForm(f => ({ ...f, submissions_open: e.target.checked }))} />
            <div>
              <span className="admin-field-label">Tool submissions open</span>
              <p className="admin-field-hint">When enabled, signed-in users can submit new AI tools for review.</p>
            </div>
          </label>
        </div>

        {error  && <p className="admin-error">{error}</p>}
        {saved  && <p className="admin-success">Settings saved.</p>}

        <div className="admin-form-actions">
          <button type="submit" className="admin-btn primary" disabled={busy}>
            {busy ? 'Saving…' : 'Save settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
