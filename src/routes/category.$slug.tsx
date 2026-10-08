import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { getCategory, tools } from "@/lib/catalog";
import {
  pageHead,
  breadcrumbSchema,
  collectionPageSchema,
  itemListSchema,
  SITE_URL,
} from "@/lib/metadata";
import { discoverySearch } from "@/lib/search";
import { Discovery } from "@/components/compass/discovery";

export const Route = createFileRoute("/category/$slug")({
  validateSearch: discoverySearch,
  loader: ({ params }) => {
    const c = getCategory(params.slug);
    if (!c) throw notFound();
    return c.slug;
  },
  head: ({ params }) => {
    const c = getCategory(params.slug);
    if (!c) return pageHead("Category not found", "Explore AI tool categories with AI Compass.");
    const catTools = tools.filter((t) => t.categories.includes(c.slug));
    const toolNames = catTools
      .slice(0, 5)
      .map((t) => t.name)
      .join(", ");
    const description = `Discover the best ${c.name} AI tools. ${c.description} Browse ${c.tool_count} tools including ${toolNames} and more.`;
    const url = `${SITE_URL}/category/${c.slug}`;
    return {
      ...pageHead(`Best ${c.name} AI Tools`, description, {
        path: `/category/${c.slug}`,
        keywords: `${c.name} AI, best ${c.name} tools, ${toolNames}`,
      }),
      scripts: [
        breadcrumbSchema([
          { name: "AI Compass", url: SITE_URL },
          { name: "Categories", url: `${SITE_URL}/categories` },
          { name: c.name, url },
        ]),
        collectionPageSchema(`${c.name} AI Tools`, description, url),
        itemListSchema(
          `${c.name} AI Tools`,
          url,
          catTools.map((t) => ({ name: t.name, url: `${SITE_URL}/tool/${t.slug}` })),
        ),
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const category = getCategory(slug);
  const filters = Route.useSearch();
  const navigate = Route.useNavigate();
  if (!category) return null;
  const Icon = category.icon;
  return (
    <div className="shell">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/categories">Categories</Link>
        <ChevronRight />
        <span aria-current="page">{category.name}</span>
      </nav>
      <div className="page-heading">
        <div className="eyebrow">
          <Icon size={18} />
          EXPLORE YOUR POSSIBILITIES
        </div>
        <h1>{category.name} AI Tools</h1>
        <p>{category.description}</p>
      </div>
      <Discovery
        filters={filters}
        lockedCategory={slug}
        onChange={(next) => navigate({ search: next, replace: true })}
      />
    </div>
  );
}
