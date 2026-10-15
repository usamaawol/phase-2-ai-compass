import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
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
  X,
  Menu,
  ShieldCheck,
  Sparkles,
  Lightbulb,
  User,
  ScrollText,
  Bookmark,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "./theme-provider";

interface NavItem {
  to: string;
  label: string;
  icon: React.ElementType;
  /**
   * When true, this nav entry is ONLY rendered if the current signed-in
   * user has /admin_users/{uid}.role == 'admin'. Random users, anonymous
   * visitors, and even regular signed-in users will never see it.
   */
  adminOnly?: boolean;
}

const NAV: NavItem[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/discover", label: "Discover", icon: Search },
  { to: "/find", label: "Find my AI", icon: Lightbulb },
  { to: "/categories", label: "Categories", icon: LayoutGrid },
  { to: "/compare", label: "Compare", icon: GitCompareArrows },
  { to: "/saved", label: "Saved", icon: Bookmark },
  // Changelog is admin-only internal notes. Do not surface to public.
  { to: "/changelog", label: "Changelog", icon: ScrollText, adminOnly: true },
  { to: "/faq", label: "FAQ", icon: Info },
  { to: "/about", label: "About", icon: Info },
];

/* ── Auth error helper ───────────────────────────────────────── */
function authErrorMessage(e: unknown): string {
  const err = e as { code?: string; message?: string };
  const code = err?.code;
  const msg = err?.message ?? "";
  if (typeof console !== "undefined") console.error("[auth error]", e);
  if (msg.includes("Firebase is not configured")) {
    return "Firebase is not configured. Set the VITE_FIREBASE_* environment variables in your hosting provider's Production environment and redeploy.";
  }
  if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
    return "Invalid email or password. Please try again.";
  }
  if (code === "auth/email-already-in-use") {
    return "An account with this email already exists. Sign in instead.";
  }
  if (code === "auth/weak-password") {
    return "Password is too weak. Use at least 6 characters.";
  }
  if (code === "auth/invalid-email") {
    return "Please enter a valid email address.";
  }
  if (code === "auth/operation-not-allowed") {
    return "Email sign-in is not enabled. Enable it in Firebase Console → Authentication.";
  }
  if (code === "auth/too-many-requests") {
    return "Too many attempts. Try again later or reset your password.";
  }
  if (code === "auth/network-request-failed") {
    return "Network error. Check your connection and try again.";
  }
  if (code === "auth/api-key-not-valid" || code === "auth/invalid-api-key") {
    return "Firebase is not configured. Set the VITE_FIREBASE_* environment variables.";
  }
  if (code) return `Sign-in failed (${code}). Please try again.`;
  return msg ? `Sign-in failed: ${msg}` : "Sign-in failed. Please try again.";
}

/* ── Login modal ─────────────────────────────────────────────── */
function LoginModal({ onClose }: { onClose: () => void }) {
  const { signIn, signUp, resetPassword, signInWithGoogle } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      if (mode === "signup") {
        await signUp(email.trim(), password, name.trim() || undefined);
      } else {
        await signIn(email.trim(), password);
      }
      onClose();
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleResetPassword() {
    if (!email.trim()) {
      setError("Enter your email first, then click Forgot password.");
      return;
    }
    setBusy(true);
    setError("");
    setSuccess("");
    try {
      await resetPassword(email.trim());
      setSuccess("Password reset link sent! Check your email.");
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="login-overlay"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="login-card">
        <button className="login-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>
        <div className="login-brand">
          <Compass size={28} strokeWidth={1.5} />
          <span>AI Compass</span>
        </div>
        <h2 className="login-title">
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h2>
        <p className="login-subtitle">
          {mode === "signup"
            ? "Sign up to sync your bookmarks across devices and manage your profile."
            : "Sign in to access your saved tools and account settings."}
        </p>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="login-field">
              <label htmlFor="signup-name">Name</label>
              <input
                id="signup-name"
                className="login-input"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
          )}
          <div className="login-field">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              className="login-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              className="login-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              required
            />
          </div>

          {mode === "signin" && (
            <button type="button" className="login-forgot" onClick={handleResetPassword} disabled={busy}>
              Forgot password?
            </button>
          )}

          <button className="auth-submit-btn" type="submit" disabled={busy}>
            {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
          </button>
        </form>

        {error && <p className="login-error" role="alert">{error}</p>}
        {success && <p className="login-success">{success}</p>}

        <div className="auth-gate-divider" style={{ margin: "16px 0 4px" }}>
          <span>or</span>
        </div>
        <button
          className="auth-submit-btn"
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError("");
            setSuccess("");
            try {
              await signInWithGoogle();
              onClose();
            } catch (err) {
              setError(authErrorMessage(err));
            } finally {
              setBusy(false);
            }
          }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "var(--card)", color: "var(--foreground)", border: "1px solid var(--border)" }}
        >
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2045c0-.638-.057-1.252-.164-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.874 2.6836-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.859-3.0477.859-2.3445 0-4.3282-1.5836-5.036-3.7104H.957v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
            <path d="M3.964 10.71c-.18-.54-.2827-1.1168-.2827-1.71s.1027-1.17.2827-1.71V4.9582H.957A8.9965 8.9965 0 0 0 0 9c0 1.4523.3477 2.8268.957 4.0418L3.964 10.71z" fill="#FBBC05"/>
            <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.426 0 9 0 5.4818 0 2.4382 2.0168.957 4.9582L3.964 7.29C4.6718 5.1632 6.6555 3.5795 9 3.5795z" fill="#EA4335"/>
          </svg>
          {busy ? "Please wait…" : "Continue with Google"}
        </button>

        <p className="login-toggle">
          {mode === "signup" ? "Already have an account?" : "Don't have an account?"}
          <button type="button" onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(""); setSuccess(""); }}>
            {mode === "signup" ? "Sign in" : "Sign up"}
          </button>
        </p>

        <p className="login-note">
          By continuing you agree to our{" "}
          <a href="/terms" className="text-primary">
            terms
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-primary">
            privacy policy
          </a>
          . Your data is never sold.
        </p>
      </div>
    </div>
  );
}

/* ── Nav content (shared desktop + mobile) ────────────────────── */
function NavContent({
  onClose,
  onLoginRequest,
}: {
  onClose: () => void;
  onLoginRequest: () => void;
}) {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    setAdminLoading(true);
    if (!user) {
      setIsAdmin(false);
      setAdminLoading(false);
      return;
    }
    import("@/lib/admin-db")
      .then(({ isAdminUser }) => isAdminUser(user.uid))
      .then((admin) => setIsAdmin(admin))
      .catch(() => setIsAdmin(false))
      .finally(() => setAdminLoading(false));
  }, [user]);

  function handleClick(e: React.MouseEvent, item: NavItem) {
    onClose();
  }

  return (
    <div className="nav-content">
      {/* ── Brand ── */}
      <Link to="/" className="nav-brand" onClick={onClose} aria-label="AI Compass home">
        <div className="nav-brand-icon">
          <Compass size={20} strokeWidth={1.6} />
        </div>
        <div className="nav-brand-text">
          <span className="nav-brand-name">AI Compass</span>
          <span className="nav-brand-tag">Find the Right AI</span>
        </div>
      </Link>

      {/* ── Separator ── */}
      <div className="nav-sep" />

      {/* ── Nav links ── */}
      <nav className="nav-links-list" aria-label="Main navigation">
        {NAV.filter((item) => {
          // Strip admin-only items for everyone except confirmed admins.
          if (item.adminOnly) {
            if (adminLoading) return false;
            if (!isAdmin) return false;
          }
          return true;
        }).map((item) => {
          const Icon = item.icon;
          const active =
            location.pathname === item.to ||
            (item.to !== "/" && location.pathname.startsWith(item.to));
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`nav-item${active ? " nav-item-active" : ""}`}
              onClick={(e) => handleClick(e, item)}
              aria-current={active ? "page" : undefined}
            >
              <span className="nav-item-icon-wrap">
                <Icon size={17} strokeWidth={active ? 2.2 : 1.8} />
              </span>
              <span className="nav-item-label">{item.label}</span>
              {active && <span className="nav-item-pip" aria-hidden="true" />}
            </Link>
          );
        })}
      </nav>

      <div className="nav-spacer" />

      {/* ── Bottom ── */}
      <div className="nav-bottom">
        {/* Theme */}
        <button
          className="nav-bottom-btn"
          onClick={toggle}
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
          <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
        </button>

        {/* Auth */}
        {user ? (
          <div className="nav-user">
            <div className="nav-user-left">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="nav-avatar"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="nav-avatar-fallback">
                  <Sparkles size={12} />
                </div>
              )}
              <div className="nav-user-info">
                <Link to="/account" className="nav-user-name" onClick={onClose}>
                  {user.displayName ?? user.email ?? "User"}
                </Link>
                <div className="nav-user-actions">
                  {!adminLoading && isAdmin && (
                    <>
                      <Link to="/admin" className="nav-admin-link" onClick={onClose}>
                        <ShieldCheck size={10} /> Admin
                      </Link>
                      <span className="nav-user-dot">·</span>
                    </>
                  )}
                  <Link to="/account" className="nav-admin-link" onClick={onClose}>
                    <User size={10} /> Account
                  </Link>
                  <span className="nav-user-dot">·</span>
                  <button className="nav-signout" onClick={() => signOut()}>
                    <LogOut size={10} /> Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button className="nav-signin-btn" onClick={onLoginRequest}>
            <LogIn size={15} />
            <span>Sign in</span>
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Main export ─────────────────────────────────────────────── */
export function Sidebar() {
  const [showLogin, setShowLogin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="sidebar" aria-label="Site navigation">
        <NavContent onClose={() => {}} onLoginRequest={() => setShowLogin(true)} />
      </aside>

      {/* Mobile top bar */}
      <header className="mobile-topbar">
        <Link to="/" className="mobile-topbar-brand" aria-label="AI Compass home">
          <Compass size={20} strokeWidth={1.6} />
          <span>
            AI Compass<span className="nav-brand-dot">.</span>
          </span>
        </Link>
        <button
          className="mobile-hamburger"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="mobile-backdrop" aria-hidden="true" onClick={() => setMobileOpen(false)}>
          <aside
            className="mobile-drawer"
            aria-label="Mobile navigation"
            onClick={(e) => e.stopPropagation()}
          >
            <NavContent
              onClose={() => setMobileOpen(false)}
              onLoginRequest={() => {
                setMobileOpen(false);
                setShowLogin(true);
              }}
            />
          </aside>
        </div>
      )}

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
