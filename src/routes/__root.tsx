import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts, type ErrorComponentProps } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import appCss from "../styles.css?url";
import { Sidebar } from "@/components/compass/sidebar";
import { Footer } from "@/components/compass/shared";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/components/compass/theme-provider";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SITE_URL, SITE_NAME, SITE_TAGLINE } from "@/lib/metadata";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Go home</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try refreshing or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Try again</button>
          <a href="/" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport",      content: "width=device-width, initial-scale=1" },
      { title: SITE_NAME },
      { name: "description",   content: `${SITE_NAME} — ${SITE_TAGLINE} Discover AI tools for coding, creativity, research, and more.` },
      { name: "author",        content: SITE_NAME },
      { name: "theme-color",   content: "#1a1f1a" },
      { property: "og:site_name",   content: SITE_NAME },
      { property: "og:type",        content: "website" },
      { property: "og:title",       content: SITE_NAME },
      { property: "og:description", content: `${SITE_NAME} — ${SITE_TAGLINE}` },
      { property: "og:url",         content: SITE_URL },
      { property: "og:image",       content: `${SITE_URL}/og-default.png` },
      { name: "twitter:card",  content: "summary_large_image" },
      { name: "twitter:site",  content: "@aicompassapp" },
    ],
    links: [
      { rel: "stylesheet",  href: appCss },
      { rel: "icon",        href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect",  href: "https://fonts.googleapis.com" },
      { rel: "preconnect",  href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet",  href: "https://fonts.googleapis.com/css2?family=Geist:wght@400;450;500;550;600;650;700&display=swap" },
    ],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org", "@type": "WebSite",
        name: SITE_NAME, url: SITE_URL,
        description: `${SITE_NAME} — ${SITE_TAGLINE} Discover AI tools across 26 categories.`,
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/discover?q={search_term_string}` },
          "query-input": "required name=search_term_string",
        },
      }),
    }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en"><head><HeadContent /></head><body>{children}<Scripts /></body></html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <div className="app-layout">
            <Sidebar />
            <div className="page-area">
              <main><Outlet /></main>
              <Footer />
            </div>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
