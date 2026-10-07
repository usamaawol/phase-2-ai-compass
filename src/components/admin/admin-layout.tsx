import { Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import {
  LayoutDashboard,
  Bot,
  LayoutGrid,
  Tags,
  Star,
  InboxIcon,
  Settings,
  ChevronRight,
  LogOut,
  Compass,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useAdmin } from '@/hooks/use-admin';

interface AdminNavItem {
  to: string;
  label: string;
  icon: React.ElementType;
}

const ADMIN_NAV: AdminNavItem[] = [
  { to: '/admin',             label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/admin/tools',       label: 'AI Tools',      icon: Bot },
  { to: '/admin/categories',  label: 'Categories',    icon: LayoutGrid },
  { to: '/admin/tags',        label: 'Tags',          icon: Tags },
  { to: '/admin/featured',    label: 'Featured Tools',icon: Star },
  { to: '/admin/submissions', label: 'Submissions',   icon: InboxIcon },
  { to: '/admin/settings',    label: 'Settings',      icon: Settings },
];

/** Guard that blocks non-admins and shows the admin sidebar layout */
export function AdminLayout() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { isAdmin, loading: adminLoading }      = useAdmin();
  const navigate = useNavigate();

  // Still checking auth/role
  if (authLoading || adminLoading) {
    return (
      <div className="admin-loading">
        <Loader2 className="animate-spin" size={28} />
        <span>Checking permissions…</span>
      </div>
    );
  }

  // Not signed in → redirect to home
  if (!user) {
    navigate({ to: '/' });
    return null;
  }

  // Signed in but not admin
  if (!isAdmin) {
    return (
      <div className="admin-denied">
        <ShieldAlert size={40} />
        <h1>Access denied</h1>
        <p>Your account does not have admin permissions.</p>
        <Link to="/" className="admin-denied-link">← Back to AI Compass</Link>
      </div>
    );
  }

  return (
    <div className="admin-shell">
      {/* Admin sidebar */}
      <aside className="admin-sidebar">
        <Link to="/" className="admin-sidebar-brand">
          <Compass size={22} strokeWidth={1.5} />
          <span>AI Compass</span>
          <span className="admin-badge">Admin</span>
        </Link>

        <nav className="admin-nav" aria-label="Admin navigation">
          {ADMIN_NAV.map(item => (
            <AdminNavLink key={item.to} item={item} />
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user">
            {user.photoURL
              ? <img src={user.photoURL} alt="" className="admin-avatar" referrerPolicy="no-referrer" />
              : <div className="admin-avatar-fallback">{(user.displayName ?? 'A')[0]}</div>
            }
            <div className="admin-user-info">
              <span className="admin-user-name">{user.displayName ?? user.email}</span>
              <span className="admin-user-role">Administrator</span>
            </div>
          </div>
          <button className="admin-signout-btn" onClick={() => { signOut(); navigate({ to: '/' }); }}>
            <LogOut size={14} /> Sign out
          </button>
        </div>
      </aside>

      {/* Page content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

function AdminNavLink({ item }: { item: AdminNavItem }) {
  const location = useLocation();
  const exact  = item.to === '/admin';
  const active = exact
    ? location.pathname === '/admin'
    : location.pathname.startsWith(item.to);
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      className={`admin-nav-link${active ? ' active' : ''}`}
      aria-current={active ? 'page' : undefined}
    >
      <Icon size={16} strokeWidth={1.8} />
      <span>{item.label}</span>
      {active && <ChevronRight size={12} className="admin-nav-chevron" />}
    </Link>
  );
}
