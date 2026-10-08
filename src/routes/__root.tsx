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
import { useEffect, useState, type ReactNode } from "react";
import { LogIn, Compass, ArrowRight, Loader2 } from "lucide-react";
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
      { rel: "alternate", href: SITE_URL, hreflang: "x-default" },
      { rel: "alternate", href: SITE_URL, hreflang: "en" },
      { rel: "alternate", href: SITE_URL, hreflang: "en-US" },
      { rel: "alternate", href: SITE_URL, hreflang: "en-GB" },

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

const PUBLIC_PATHS = ["/"];

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
              <Button size="lg" onClick={() => signIn()} className="auth-gate-signin">
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

function AppShellInner() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return <Outlet />;
  }

  return (
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
