import { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import {
  Compass,
  Home,
  Search,
  LayoutGrid,
  GitCompareArrows,
  Info,
  Sun,
  Moon,
  LogIn,
  LogOut,
  Lock,
  X,
  Menu,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from './theme-provider';

/* ─── nav items ──────────────────────────────────────────────── */
interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  /** Requires sign-in to visit */
  protected?: boolean;
}

const NAV: NavItem[] = [
  { to: '/',           label: 'Home',       icon: Home },
  { to: '/discover',   label: 'Discover',   icon: Search,           protected: true },
  { to: '/categories', label: 'Categories', icon: LayoutGrid,       protected: true },
  { to: '/compare',    label: 'Compare',    icon: GitCompareArrows, protected: true },
  { to: '/about',      label: 'About',      icon: Info },
];

/* ─── Google SVG ─────────────────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.7-6.7C35.8 2.5 30.2 0 24 0 14.6 0 6.6 5.5 2.7 13.6l7.8 6C12.4 13 17.8 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17z"/>
      <path fill="#FBBC05" d="M10.5 28.4A14.5 14.5 0 0 1 9.5 24c0-1.5.3-3 .8-4.4l-7.8-6A23.9 23.9 0 0 0 0 24c0 3.8.9 7.4 2.5 10.6l8-6.2z"/>
      <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-6.2 0-11.5-4.2-13.4-9.8l-8 6.2C6.6 42.5 14.6 48 24 48z"/>
    </svg>
  );
}

/* ─── login modal ────────────────────────────────────────────── */
function LoginModal({ onClose }: { onClose: () => void }) {
  const { signIn } = useAuth();
  const [busy,  setBusy]  = useState(false);
  const [error, setError] = useState('');

  async function handleGoogle() {
    setBusy(true);
    setError('');
    try {
      await signIn();
      onClose();
    } catch (e: unknown) {
      // Translate Firebase error codes into plain language
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('api-key-not-valid') || msg.includes('api-key-not-found')) {
        setError('Firebase is not configured yet. Add your VITE_FIREBASE_* keys to the .env file and restart the dev server.');
      } else if (msg.includes('popup-closed-by-user') || msg.includes('cancelled-popup-request')) {
        setError('Sign-in was cancelled. Please try again.');
      } else if (msg.includes('popup-blocked')) {
        setError('Pop-up was blocked by your browser. Please allow pop-ups for this site and try again.');
      } else if (msg.includes('network-request-failed')) {
        setError('Network error. Check your internet connection and try again.');
      } else {
        setError('Sign-in failed. Please try again.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    /* clicking the backdrop closes the modal */
    <div
      className="login-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in to AI Compass"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="login-card">
        <button className="login-close" onClick={onClose} aria-label="Close sign-in dialog">
          <X size={18} />
        </button>

        {/* Brand */}
        <div className="login-brand">
          <Compass size={28} strokeWidth={1.5} />
          <span>AI Compass</span>
        </div>

        <h2 className="login-title">Sign in to continue</h2>
        <p className="login-subtitle">
          Access Discover, Categories, and Compare.<br />
          Free · No password needed.
        </p>

        <button
          className="google-btn"
          onClick={handleGoogle}
          disabled={busy}
        >
          <GoogleIcon />
          <span>{busy ? 'Signing in…' : 'Continue with Google'}</span>
        </button>

        {error && <p className="login-error" role="alert">{error}</p>}

        <p className="login-note">
          By signing in you agree to our terms of service.<br />
          Your data is never sold.
        </p>
      </div>
    </div>
  );
}

/* ─── sidebar content (shared between desktop & mobile drawer) ─ */
function SidebarContent({
  onClose,
  onLoginRequest,
}: {
  onClose: () => void;
  onLoginRequest: () => void;
}) {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const location = useLocation();

  function handleNavClick(e: React.MouseEvent, item: NavItem) {
    if (item.protected && !user) {
      e.preventDefault();
      onLoginRequest();
    }
    onClose();
  }

  return (
    <>
      {/* Brand / logo */}
      <Link to="/" className="sidebar-brand" aria-label="AI Compass home" onClick={onClose}>
        <Compass size={26} strokeWidth={1.5} />
        <span className="sidebar-brand-text">
          AI Compass<span className="sidebar-brand-dot">.</span>
        </span>
      </Link>

      {/* Divider */}
      <div className="sidebar-divider" />

      {/* Nav links */}
      <nav className="sidebar-nav" aria-label="Main navigation">
        {NAV.map((item) => {
          const Icon    = item.icon;
          const active  = location.pathname === item.to
                        || (item.to !== '/' && location.pathname.startsWith(item.to));
          const locked  = !!item.protected && !user;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={['sidebar-link', active ? 'active' : '', locked ? 'locked' : ''].join(' ')}
              onClick={(e) => handleNavClick(e, item)}
              aria-current={active ? 'page' : undefined}
            >
              <span className="sidebar-link-icon"><Icon size={17} strokeWidth={1.8} /></span>
              <span className="sidebar-link-label">{item.label}</span>
              {locked && (
                <span className="sidebar-lock-icon" aria-label="Sign in required">
                  <Lock size={11} />
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Push bottom section down */}
      <div className="sidebar-spacer" />

      {/* Bottom controls */}
      <div className="sidebar-bottom">
        {/* Theme toggle */}
        <button
          className="sidebar-action"
          onClick={toggle}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          <span className="sidebar-link-icon">
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </span>
          <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
        </button>

        {/* Auth */}
        {user ? (
          <div className="sidebar-user">
            {user.photoURL
              ? <img src={user.photoURL} alt="" className="sidebar-avatar" referrerPolicy="no-referrer" />
              : <div className="sidebar-avatar-fallback">{(user.displayName ?? 'U')[0]}</div>
            }
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user.displayName ?? user.email ?? 'User'}</span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Link to="/admin" className="sidebar-admin-link" onClick={onClose}>
                  <ShieldCheck size={11} /> Admin
                </Link>
                <button className="sidebar-signout" onClick={() => signOut()}>
                  <LogOut size={11} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button className="sidebar-action sidebar-signin" onClick={onLoginRequest}>
            <span className="sidebar-link-icon"><LogIn size={17} /></span>
            <span>Sign in</span>
          </button>
        )}
      </div>
    </>
  );
}

/* ─── main export ────────────────────────────────────────────── */
export function Sidebar() {
  const [showLogin,   setShowLogin]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="sidebar" aria-label="Site navigation">
        <SidebarContent
          onClose={() => {}}
          onLoginRequest={() => setShowLogin(true)}
        />
      </aside>

      {/* ── Mobile top bar ── */}
      <div className="mobile-topbar">
        <Link to="/" className="sidebar-brand mobile-brand" aria-label="AI Compass home">
          <Compass size={22} strokeWidth={1.5} />
          <span className="sidebar-brand-text">
            AI Compass<span className="sidebar-brand-dot">.</span>
          </span>
        </Link>
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(v => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        >
          <aside
            className="mobile-drawer"
            aria-label="Mobile navigation"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent
              onClose={() => setMobileOpen(false)}
              onLoginRequest={() => { setMobileOpen(false); setShowLogin(true); }}
            />
          </aside>
        </div>
      )}

      {/* ── Login modal ── */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
