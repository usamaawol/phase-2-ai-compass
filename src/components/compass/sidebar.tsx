import { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import {
  Compass, Home, Search, LayoutGrid, GitCompareArrows,
  Info, Sun, Moon, LogIn, LogOut, Lock, X, Menu, ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from './theme-provider';

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  protected?: boolean;
}

const NAV: NavItem[] = [
  { to: '/',           label: 'Home',       icon: Home },
  { to: '/discover',   label: 'Discover',   icon: Search,           protected: true },
  { to: '/categories', label: 'Categories', icon: LayoutGrid,       protected: true },
  { to: '/compare',    label: 'Compare',    icon: GitCompareArrows, protected: true },
  { to: '/about',      label: 'About',      icon: Info },
];

/* ── Google SVG ─────────────────────────────────────────────── */
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

/* ── Login modal ─────────────────────────────────────────────── */
function LoginModal({ onClose }: { onClose: () => void }) {
  const { signIn } = useAuth();
  const [busy, setBusy]   = useState(false);
  const [error, setError] = useState('');

  async function handleGoogle() {
    setBusy(true); setError('');
    try { await signIn(); onClose(); }
    catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('api-key-not-valid') || msg.includes('api-key-not-found'))
        setError('Firebase is not configured. Check VITE_FIREBASE_* environment variables.');
      else if (msg.includes('popup-closed') || msg.includes('cancelled-popup'))
        setError('Sign-in cancelled. Please try again.');
      else if (msg.includes('popup-blocked'))
        setError('Pop-up blocked. Allow pop-ups for this site and try again.');
      else if (msg.includes('network-request-failed'))
        setError('Network error. Check your connection and try again.');
      else
        setError('Sign-in failed. Please try again.');
    } finally { setBusy(false); }
  }

  return (
    <div className="login-overlay" role="dialog" aria-modal="true"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="login-card">
        <button className="login-close" onClick={onClose} aria-label="Close"><X size={18}/></button>
        <div className="login-brand"><Compass size={28} strokeWidth={1.5}/><span>AI Compass</span></div>
        <h2 className="login-title">Sign in to continue</h2>
        <p className="login-subtitle">Access Discover, Categories, and Compare.<br/>Free · No password needed.</p>
        <button className="google-btn" onClick={handleGoogle} disabled={busy}>
          <GoogleIcon/><span>{busy ? 'Signing in…' : 'Continue with Google'}</span>
        </button>
        {error && <p className="login-error" role="alert">{error}</p>}
        <p className="login-note">By signing in you agree to our terms. Your data is never sold.</p>
      </div>
    </div>
  );
}

/* ── Nav content (shared desktop + mobile) ────────────────────── */
function NavContent({ onClose, onLoginRequest }: { onClose: () => void; onLoginRequest: () => void }) {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const location = useLocation();

  function handleClick(e: React.MouseEvent, item: NavItem) {
    if (item.protected && !user) { e.preventDefault(); onLoginRequest(); }
    else onClose();
  }

  return (
    <div className="nav-content">
      {/* ── Brand ── */}
      <Link to="/" className="nav-brand" onClick={onClose} aria-label="AI Compass home">
        <div className="nav-brand-icon">
          <Compass size={20} strokeWidth={1.6}/>
        </div>
        <div className="nav-brand-text">
          <span className="nav-brand-name">AI Compass</span>
          <span className="nav-brand-tag">Find the Right AI</span>
        </div>
      </Link>

      {/* ── Separator ── */}
      <div className="nav-sep"/>

      {/* ── Nav links ── */}
      <nav className="nav-links-list" aria-label="Main navigation">
        {NAV.map(item => {
          const Icon   = item.icon;
          const active = location.pathname === item.to
                      || (item.to !== '/' && location.pathname.startsWith(item.to));
          const locked = !!item.protected && !user;
          return (
            <Link key={item.to} to={item.to}
              className={`nav-item${active ? ' nav-item-active' : ''}${locked ? ' nav-item-locked' : ''}`}
              onClick={e => handleClick(e, item)}
              aria-current={active ? 'page' : undefined}
            >
              <span className="nav-item-icon-wrap">
                <Icon size={17} strokeWidth={active ? 2.2 : 1.8}/>
              </span>
              <span className="nav-item-label">{item.label}</span>
              {locked && <Lock size={10} className="nav-item-lock" aria-label="Requires sign-in"/>}
              {active && <span className="nav-item-pip" aria-hidden="true"/>}
            </Link>
          );
        })}
      </nav>

      <div className="nav-spacer"/>

      {/* ── Bottom ── */}
      <div className="nav-bottom">
        {/* Theme */}
        <button className="nav-bottom-btn" onClick={toggle}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
          {theme === 'light' ? <Moon size={15}/> : <Sun size={15}/>}
          <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
        </button>

        {/* Auth */}
        {user ? (
          <div className="nav-user">
            <div className="nav-user-left">
              {user.photoURL
                ? <img src={user.photoURL} alt="" className="nav-avatar" referrerPolicy="no-referrer"/>
                : <div className="nav-avatar-fallback"><Sparkles size={12}/></div>
              }
              <div className="nav-user-info">
                <span className="nav-user-name">{user.displayName ?? user.email ?? 'User'}</span>
                <div className="nav-user-actions">
                  <Link to="/admin" className="nav-admin-link" onClick={onClose}>
                    <ShieldCheck size={10}/> Admin
                  </Link>
                  <span className="nav-user-dot">·</span>
                  <button className="nav-signout" onClick={() => signOut()}>
                    <LogOut size={10}/> Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button className="nav-signin-btn" onClick={onLoginRequest}>
            <LogIn size={15}/>
            <span>Sign in with Google</span>
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────── */
export function Sidebar() {
  const [showLogin,  setShowLogin]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar" aria-label="Site navigation">
        <NavContent onClose={() => {}} onLoginRequest={() => setShowLogin(true)}/>
      </aside>

      {/* Mobile top bar */}
      <header className="mobile-topbar">
        <Link to="/" className="mobile-topbar-brand" aria-label="AI Compass home">
          <Compass size={20} strokeWidth={1.6}/>
          <span>AI Compass<span className="nav-brand-dot">.</span></span>
        </Link>
        <button className="mobile-hamburger" aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen} onClick={() => setMobileOpen(v => !v)}>
          {mobileOpen ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="mobile-backdrop" aria-hidden="true" onClick={() => setMobileOpen(false)}>
          <aside className="mobile-drawer" aria-label="Mobile navigation"
            onClick={e => e.stopPropagation()}>
            <NavContent
              onClose={() => setMobileOpen(false)}
              onLoginRequest={() => { setMobileOpen(false); setShowLogin(true); }}
            />
          </aside>
        </div>
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)}/>}
    </>
  );
}
