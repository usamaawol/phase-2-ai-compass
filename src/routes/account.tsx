import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { LogOut, User, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/integrations/supabase/client';
import { pageHead } from '@/lib/metadata';

export const Route = createFileRoute('/account')({
  head: () => pageHead('My Account', 'View your AI Compass account and submissions.', { noindex: true }),
  component: AccountPage,
});

type Submission = {
  id: string;
  status: string;
  review_note: string;
  created_at: string;
  data: Record<string, unknown>;
};

function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [subs,    setSubs]    = useState<Submission[]>([]);
  const [subsLoad, setSubsLoad] = useState(false);

  // Redirect if not signed in
  useEffect(() => {
    if (!loading && !user) navigate({ to: '/' });
  }, [user, loading, navigate]);

  // Load submissions
  useEffect(() => {
    if (!user) return;
    setSubsLoad(true);
    supabase
      .from('tool_submissions')
      .select('id, status, review_note, created_at, data')
      .eq('user_id', user.uid)
      .order('created_at', { ascending: false })
      .then(({ data }) => setSubs((data ?? []) as Submission[]))
      .finally(() => setSubsLoad(false));
  }, [user]);

  if (loading) {
    return (
      <div className="shell" style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
        <Loader2 className="animate-spin" size={28} />
      </div>
    );
  }

  if (!user) return null;

  const statusIcon = (s: string) => {
    if (s === 'approved') return <CheckCircle size={13} className="text-green-500"/>;
    if (s === 'rejected') return <XCircle size={13} className="text-destructive"/>;
    return <Clock size={13} className="text-muted-foreground"/>;
  };

  return (
    <div className="shell">
      <div className="page-heading">
        <div className="eyebrow">YOUR ACCOUNT</div>
        <h1>My Account</h1>
      </div>

      {/* Profile card */}
      <div className="account-card">
        <div className="account-avatar-wrap">
          {user.photoURL
            ? <img src={user.photoURL} alt="" className="account-avatar" referrerPolicy="no-referrer"/>
            : <div className="account-avatar-fallback"><User size={28}/></div>
          }
        </div>
        <div className="account-info">
          <h2 className="account-name">{user.displayName ?? 'User'}</h2>
          <p className="account-email">{user.email}</p>
        </div>
        <div className="account-actions">
          <Button variant="outline" size="sm" asChild>
            <Link to="/submit">Submit a tool</Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate({ to: '/' }); }}>
            <LogOut size={14}/> Sign out
          </Button>
        </div>
      </div>

      {/* Submissions */}
      <section style={{ marginTop: 36 }}>
        <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>
          My submissions ({subs.length})
        </h2>

        {subsLoad && <p className="text-muted-foreground text-sm">Loading…</p>}

        {!subsLoad && subs.length === 0 && (
          <div className="account-empty">
            <p>You haven't submitted any tools yet.</p>
            <Button asChild size="sm">
              <Link to="/submit">Submit your first tool</Link>
            </Button>
          </div>
        )}

        {!subsLoad && subs.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tool name</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Review note</th>
                </tr>
              </thead>
              <tbody>
                {subs.map(sub => (
                  <tr key={sub.id}>
                    <td><strong>{String(sub.data?.name ?? '—')}</strong></td>
                    <td className="text-xs text-muted-foreground">
                      {new Date(sub.created_at).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`admin-badge-pill status-${sub.status}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        {statusIcon(sub.status)} {sub.status}
                      </span>
                    </td>
                    <td className="text-xs text-muted-foreground">{sub.review_note || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
