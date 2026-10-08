/** Canonical origin — update to your real domain before going live */
export const SITE_URL = "https://aicompass.app";
export const SITE_NAME = "AI Compass";
export const SITE_TAGLINE = "Find the Right AI for the Job.";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

interface PageHeadOptions {
  path?: string;
  image?: string;
  keywords?: string;
  type?: string;
  noindex?: boolean;
}

export function pageHead(title: string, description: string, options: PageHeadOptions = {}) {
  const {
    path = "",
    image = DEFAULT_OG_IMAGE,
    keywords = "",
    type = "website",
    noindex = false,
  } = options;
  const fullTitle = `${title} — ${SITE_NAME}`;
  const canonical = path ? `${SITE_URL}${path}` : SITE_URL;
  const baseKeywords =
    "AI tools, artificial intelligence, AI discovery, AI directory, machine learning tools, find AI, best AI apps";
  const allKeywords = keywords ? `${baseKeywords}, ${keywords}` : baseKeywords;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { name: "keywords", content: allKeywords },
      {
        name: "robots",
        content: noindex
          ? "noindex,nofollow"
          : "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1",
      },
      { name: "author", content: SITE_NAME },
      { property: "og:type", content: type },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      { property: "og:url", content: canonical },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: `${SITE_NAME} — ${SITE_TAGLINE}` },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@aicompassapp" },
      { name: "twitter:title", content: fullTitle },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: canonical }],
  };
}

export function jsonLd(data: object) {
  return {
    tag: "script" as const,
    attrs: { type: "application/ld+json" },
    children: JSON.stringify(data),
  };
}

export function websiteSchema() {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: `${SITE_NAME} — ${SITE_TAGLINE} Discover AI tools across 26 categories.`,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/discover?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  });
}

export function organisationSchema() {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description: `${SITE_NAME} — ${SITE_TAGLINE}`,
  });
}

export function breadcrumbSchema(crumbs: Array<{ name: string; url: string }>) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url,
    })),
  });
}

export function toolSchema(tool: {
  name: string;
  slug: string;
  short_description: string;
  official_url: string;
  company: string;
  categories: string[];
  platforms: string[];
  open_source: boolean;
}) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    url: `${SITE_URL}/tool/${tool.slug}`,
    sameAs: tool.official_url,
    description: tool.short_description,
    author: { "@type": "Organization", name: tool.company },
    applicationCategory: "Artificial Intelligence",
    operatingSystem: tool.platforms.join(", ") || "Web",
    isAccessibleForFree: true,
    ...(tool.open_source ? { license: "https://opensource.org/licenses" } : {}),
  });
}

export function itemListSchema(
  name: string,
  url: string,
  items: Array<{ name: string; url: string }>,
) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  });
}

export function collectionPageSchema(name: string, description: string, url: string) {
  return jsonLd({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  });
}
