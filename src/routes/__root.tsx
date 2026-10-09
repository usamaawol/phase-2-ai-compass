import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { LogIn, Compass, ArrowRight, Loader2, Ban } from "lucide-react";
import appCss from "../styles.css?url";
import { Sidebar } from "@/components/compass/sidebar";
import { Footer } from "@/components/compass/shared";
import { FeedbackButton } from "@/components/compass/feedback-button";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { ThemeProvider } from "@/components/compass/theme-provider";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SITE_URL, SITE_NAME, SITE_TAGLINE } from "@/lib/metadata";
import { Button } from "@/components/ui/button";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: SITE_NAME },
      {
        name: "description",
        content: `${SITE_NAME} — ${SITE_TAGLINE} Discover AI tools for coding, creativity, research, and more.`,
      },
      { name: "author", content: SITE_NAME },
      { name: "creator", content: SITE_NAME },
      { name: "publisher", content: SITE_NAME },
      {
        name: "robots",
        content: "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1,archive",
      },
      { name: "googlebot", content: "index,follow" },
      { name: "theme-color", content: "#1a1f1a", media: "(prefers-color-scheme: dark)" },
      { name: "theme-color", content: "#f8faf6", media: "(prefers-color-scheme: light)" },
      { name: "color-scheme", content: "dark light" },
      { name: "format-detection", content: "telephone=no" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: SITE_NAME },
      { name: "application-name", content: SITE_NAME },
      { name: "msapplication-TileColor", content: "#1a1f1a" },
      { name: "msapplication-tap-highlight", content: "no" },

      { property: "og:site_name", content: SITE_NAME },
      { property: "og:type", content: "website" },
      { property: "og:title", content: SITE_NAME },
      { property: "og:description", content: `${SITE_NAME} — ${SITE_TAGLINE}` },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}/og-default.png` },
      { property: "og:image:secure_url", content: `${SITE_URL}/og-default.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: `${SITE_NAME} — ${SITE_TAGLINE}` },
      { property: "og:image:type", content: "image/png" },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "en_GB" },
      { property: "og:locale:alternate", content: "en_CA" },
      { property: "og:locale:alternate", content: "en_AU" },

      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@aicompassapp" },
      { name: "twitter:creator", content: "@aicompassapp" },
      { name: "twitter:title", content: SITE_NAME },
      { name: "twitter:description", content: `${SITE_NAME} — ${SITE_TAGLINE}` },
      { name: "twitter:image", content: `${SITE_URL}/og-default.png` },
      { name: "twitter:image:alt", content: `${SITE_NAME} — ${SITE_TAGLINE}` },

      {
        name: "keywords",
        content:
          "AI tools directory, best AI tools 2026, ChatGPT alternatives, AI coding tools, AI writing assistants, AI image generators, find AI software, AI comparison, AI tool reviews, AI for productivity",
      },
      { name: "rating", content: "General" },
      { name: "coverage", content: "Worldwide" },
      { name: "distribution", content: "Global" },
      { name: "revisit-after", content: "1 days" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.svg", sizes: "any" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
      { rel: "mask-icon", href: "/favicon.svg", color: "#b5e85b" },
      { rel: "canonical", href: SITE_URL },
      { rel: "alternate", href: SITE_URL, hrefLang: "x-default" },
      { rel: "alternate", href: SITE_URL, hrefLang: "en" },
      { rel: "alternate", href: SITE_URL, hrefLang: "en-US" },
      { rel: "alternate", href: SITE_URL, hrefLang: "en-GB" },

      /* DNS prefetch + preconnect speeds up third-party origin lookups */
      { rel: "dns-prefetch", href: "https://fonts.googleapis.com" },
      { rel: "dns-prefetch", href: "https://fonts.gstatic.com" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },

      /* Pre-connect Firebase domains for faster auth when user signs in */
      { rel: "dns-prefetch", href: "https://www.googleapis.com" },
      { rel: "dns-prefetch", href: "https://securetoken.googleapis.com" },
      { rel: "dns-prefetch", href: "https://identitytoolkit.googleapis.com" },
      { rel: "dns-prefetch", href: "https://firestore.googleapis.com" },

      /* Only load the weights we actually use + preload hint for performance */
      {
        rel: "preload",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;550;600;650;700&display=swap&text=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%20.,!?-_/:()%27%22",
        as: "style",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;550;600;650;700&display=swap&text=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%20.,!?-_/:()%27%22",
      },

      /* Resource hints for the hero image on home */
      {
        rel: "preload",
        href: "/assets/compass-hero.jpg",
        as: "image",
        media: "(min-width: 701px)",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          url: SITE_URL,
          alternateName: "AI Compass App",
          inLanguage: "en",
          description: `${SITE_NAME} — ${SITE_TAGLINE} Discover AI tools across 26 categories. Compare, filter, and find the right AI tool for coding, writing, design, research, productivity, and more.`,
          potentialAction: [
            {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/discover?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
          logo: `${SITE_URL}/favicon.svg`,
          sameAs: ["https://twitter.com/aicompassapp"],
          description: `${SITE_NAME} — ${SITE_TAGLINE}`,
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppShell />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

const PUBLIC_PATHS = ["/", "/privacy", "/terms"];

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading, signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isPublicPath = PUBLIC_PATHS.some((p) =>
    p === "/" ? location.pathname === "/" : location.pathname.startsWith(p),
  );

  if (isPublicPath) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin" size={32} />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    const handleSignIn = async () => {
      await signIn();
      try {
        const pn = safeString(location?.pathname, "/");
        const sh = safeString(location?.search, "");
        let target = "/";
        try {
          const joined = "" + pn + sh;
          target = typeof joined === "string" && joined.startsWith("/") ? joined : "/";
        } catch {
          target = pn && typeof pn === "string" && pn.startsWith("/") ? pn : "/";
        }
        navigate({ to: target, replace: true });
      } catch {
        try {
          navigate({ to: "/", replace: true });
        } catch {}
      }
    };

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md">
          <div className="auth-gate-card">
            <div className="auth-gate-brand">
              <Compass size={36} strokeWidth={1.5} />
              <span>{SITE_NAME}</span>
            </div>
            <h1 className="auth-gate-title">Sign in required</h1>
            <p className="auth-gate-desc">
              You need a free account to access this page. Sign in with Google in one click.
            </p>
            <div className="auth-gate-actions">
              <Button size="lg" onClick={handleSignIn} className="auth-gate-signin">
                <LogIn size={18} />
                Sign in with Google
              </Button>
              <Button size="lg" variant="outline" asChild className="auth-gate-home">
                <Link to="/">
                  <ArrowRight size={16} className="rotate-180" />
                  Back to home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function safeString(v: unknown, fallback = ""): string {
  if (typeof v === "string") return v;
  if (v === null || v === undefined) return fallback;
  try {
    const t = Object.prototype.toString.call(v);
    if (t === "[object String]" || t === "[object Number]" || t === "[object Boolean]") {
      return String(v);
    }
  } catch {}
  try {
    const s = Object.prototype.toString.call(v);
    return typeof s === "string" ? s : fallback;
  } catch {
    return fallback;
  }
}

function safePathJoin(a: unknown, b: unknown): string {
  try {
    const sa = safeString(a, "");
    const sb = safeString(b, "");
    try {
      return "" + sa + sb;
    } catch {
      try {
        return [sa, sb].join("");
      } catch {
        return sa;
      }
    }
  } catch {
    return "";
  }
}

let SESSION_CACHE: string | null = null;
function getSessionId(): string {
  try {
    if (typeof window === "undefined") return "";
    if (!SESSION_CACHE) {
      try {
        const stored = window.sessionStorage.getItem("ac_sid");
        SESSION_CACHE = typeof stored === "string" && stored.length > 0 ? stored : null;
        if (!SESSION_CACHE) {
          const rand = Math.random().toString(36).slice(2, 10);
          const ts = Number(Date.now() || 0).toString(36);
          SESSION_CACHE = "s-" + rand + ts;
          try {
            window.sessionStorage.setItem("ac_sid", SESSION_CACHE);
          } catch {}
        }
      } catch {
        SESSION_CACHE = "s-" + Math.random().toString(36).slice(2, 10);
      }
    }
    return typeof SESSION_CACHE === "string" ? SESSION_CACHE : "";
  } catch {
    return "";
  }
}

function PageViewTracker() {
  try {
    const location = useLocation();
    const auth = useAuth() || {};
    const user = auth?.user ?? null;
    const sessionIdRef = useRef<string>("");
    const lastTrackedRef = useRef<string>("");
    const trackModuleRef = useRef<Promise<unknown> | null>(null);

    useEffect(() => {
      let cancelled = false;
      const run = () => {
        try {
          if (typeof window === "undefined") return;

          if (!sessionIdRef.current) sessionIdRef.current = getSessionId();
          const sessionId = safeString(sessionIdRef.current, "");
          if (!sessionId) return;

          const pathname = safeString(location?.pathname, "/");
          const search = safeString(location?.search, "");
          const key = safePathJoin(pathname, search);
          if (!key) return;
          if (lastTrackedRef.current === key) return;
          lastTrackedRef.current = key;

          let title = "";
          try {
            if (typeof document !== "undefined") title = safeString(document?.title, "");
          } catch {}

          let referrer: string | null = null;
          try {
            if (typeof document !== "undefined" && safeString(document?.referrer)) {
              referrer = safeString(document.referrer) || null;
            }
          } catch {}

          let ua: string | null = null;
          try {
            if (typeof navigator !== "undefined") ua = safeString(navigator?.userAgent) || null;
          } catch {}

          const uid = safeString(user?.uid) || null;
          const email = safeString(user?.email) || null;

          if (!trackModuleRef.current) {
            trackModuleRef.current = import("@/lib/admin-db").catch(() => ({}));
          }

          Promise.resolve(trackModuleRef.current)
            .then(async () => {
              if (cancelled) return;
              try {
                const mod = (await import("@/lib/admin-db")) as unknown as Record<string, unknown>;
                const fn = mod?.["trackPageView"];
                if (typeof fn !== "function") return;
                return await fn.call(null, {
                  path: pathname || "/",
                  title: title || "",
                  user_id: uid,
                  user_email: email,
                  session_id: sessionId,
                  referrer,
                  user_agent: ua,
                  country_code: null,
                  country_name: null,
                });
              } catch {}
              return undefined;
            })
            .catch(() => {});
        } catch {}
      };

      try {
        run();
      } catch {}

      return () => {
        cancelled = true;
      };
    }, [location, user]);

    return null;
  } catch {
    return null;
  }
}

function BannedNotice() {
  const { banned, banMessage } = useAuth();
  if (!banned) return null;
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "#4a0e0e",
        color: "#ffb8b8",
        padding: "10px 16px",
        textAlign: "center",
        borderBottom: "2px solid #8f1c1c",
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <Ban size={16} />
        Account disabled — {banMessage || "Contact site admin."}
      </div>
    </div>
  );
}

function AppShellInner() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <>
        <PageViewTracker />
        <BannedNotice />
        <Outlet />
      </>
    );
  }

  return (
    <>
      <PageViewTracker />
      <BannedNotice />
      <div className="app-layout">
        <Sidebar />
        <div className="page-area">
          <AnnouncementBanner />
          <main>
            <Outlet />
          </main>
          <Footer />
          <FeedbackButton />
        </div>
      </div>
    </>
  );
}

function AppShell() {
  return (
    <RequireAuth>
      <AppShellInner />
    </RequireAuth>
  );
}

/** Reads announcement from localStorage (set by admin via site_settings) */
function AnnouncementBanner() {
  const [msg, setMsg] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Attempt to read from Firebase Firestore site_settings on client
    import("@/lib/admin-db")
      .then(({ publicGetAnnouncement }) => publicGetAnnouncement())
      .then((announcement) => {
        if (announcement) setMsg(announcement);
      })
      .catch(() => {}); // silent — banner is optional
  }, []);

  if (!msg || dismissed) return null;

  return (
    <div className="announcement-banner" role="status" aria-live="polite">
      <span>{msg}</span>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="announcement-close"
      >
        ✕
      </button>
    </div>
  );
}
