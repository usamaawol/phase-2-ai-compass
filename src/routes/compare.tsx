import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { X, Plus, ArrowUpRight, Check, Minus, ExternalLink, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTool, tools, getCategory, platformList, type Tool } from "@/lib/catalog";
import { ToolLogo } from "@/components/compass/shared";
import { pageHead, breadcrumbSchema, SITE_URL } from "@/lib/metadata";

/* ── URL search schema: up to 4 tool slugs ──────────────────── */
const compareSearch = zodValidator(
  z.object({
    tools: fallback(z.string(), "").default(""),
  }),
);

export const Route = createFileRoute("/compare")({
  validateSearch: compareSearch,
  head: () => ({
    ...pageHead(
      "Compare AI Tools Side by Side",
      "Compare up to 4 AI tools side by side. See capabilities, platforms, pricing, and open-source status at a glance.",
      {
        path: "/compare",
        keywords: "compare AI tools, ChatGPT vs Claude, AI tool comparison, best AI for coding",
      },
    ),
    scripts: [
      breadcrumbSchema([
        { name: "AI Compass", url: SITE_URL },
        { name: "Compare", url: `${SITE_URL}/compare` },
      ]),
    ],
  }),
  component: ComparePage,
});

/* ── Row definition ─────────────────────────────────────────── */
interface Row {
  label: string;
  key: keyof Tool | "platforms_list" | "categories_list" | "tags_list";
  render?: (t: Tool) => React.ReactNode;
}

const ROWS: Row[] = [
  { label: "Company", key: "company" },
  {
    label: "Launched",
    key: "launch_year",
    render: (t) => (t.launch_year ? `${t.launch_year}` : "—"),
  },
  { label: "Skill level", key: "skill_level" },
  {
    label: "Open source",
    key: "open_source",
    render: (t) =>
      t.open_source ? (
        <Check size={14} className="text-green-500" />
      ) : (
        <Minus size={14} className="text-muted-foreground" />
      ),
  },
  {
    label: "API available",
    key: "api_available",
    render: (t) =>
      t.api_available === true ? (
        <Check size={14} className="text-green-500" />
      ) : t.api_available === null ? (
        "?"
      ) : (
        <Minus size={14} className="text-muted-foreground" />
      ),
  },
  {
    label: "Free plan",
    key: "free_plan",
    render: (t) =>
      t.free_plan === true ? (
        <Check size={14} className="text-green-500" />
      ) : t.free_plan === null ? (
        "Check site"
      ) : (
        <Minus size={14} className="text-muted-foreground" />
      ),
  },
  { label: "Pricing", key: "pricing_type" },
  {
    label: "Categories",
    key: "categories_list",
    render: (t) =>
      t.categories
        .map((c) => getCategory(c)?.name)
        .filter(Boolean)
        .join(", "),
  },
  {
    label: "Platforms",
    key: "platforms_list",
    render: (t) =>
      t.platforms
        .filter((p) => p !== "Desktop")
        .slice(0, 4)
        .join(", "),
  },
  { label: "Tags", key: "tags_list", render: (t) => t.tags.slice(0, 3).join(", ") },
  { label: "Verification", key: "verification_status" },
];

const PLATFORM_ROWS = platformList.filter((p) => p !== "Desktop");

/* ── Tool picker ────────────────────────────────────────────── */
function ToolPicker({ onAdd, excluded }: { onAdd: (slug: string) => void; excluded: string[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const filtered = tools
    .filter((t) => !excluded.includes(t.slug))
    .filter((t) => !q || t.name.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 12);

  return (
    <div className="cmp-picker">
      <button className="cmp-add-btn" onClick={() => setOpen((v) => !v)}>
        <Plus size={16} /> Add tool <ChevronDown size={13} />
      </button>
      {open && (
        <div className="cmp-picker-dropdown">
          <input
            className="cmp-picker-search"
            placeholder="Search tools…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoFocus
          />
          <div className="cmp-picker-list">
            {filtered.map((t) => (
              <button
                key={t.slug}
                className="cmp-picker-item"
                onClick={() => {
                  onAdd(t.slug);
                  setOpen(false);
                  setQ("");
                }}
              >
                <ToolLogo tool={t} />
                <div>
                  <div className="cmp-picker-name">{t.name}</div>
                  <div className="cmp-picker-cat">{getCategory(t.categories[0])?.name}</div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && <p className="cmp-picker-empty">No results</p>}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main page ──────────────────────────────────────────────── */
function ComparePage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  // Parse slugs from URL
  const slugs: string[] = search.tools ? search.tools.split(",").filter(Boolean).slice(0, 4) : [];

  const selected: Tool[] = slugs.map((s) => getTool(s)).filter(Boolean) as Tool[];

  function setTools(next: string[]) {
    navigate({ search: { tools: next.join(",") }, replace: true });
  }

  function addTool(slug: string) {
    if (selected.length >= 4) return;
    setTools([...slugs, slug]);
  }

  function removeTool(slug: string) {
    setTools(slugs.filter((s) => s !== slug));
  }

  /* Rule-based summary */
  function getSummary(): string {
    if (selected.length < 2) return "";
    const openSourceOnes = selected.filter((t) => t.open_source).map((t) => t.name);
    const apiOnes = selected.filter((t) => t.api_available === true).map((t) => t.name);
    const beginnerOnes = selected.filter((t) => t.skill_level === "Beginner").map((t) => t.name);
    const parts: string[] = [];
    if (openSourceOnes.length)
      parts.push(
        `${openSourceOnes.join(" and ")} ${openSourceOnes.length === 1 ? "is" : "are"} open source.`,
      );
    if (apiOnes.length)
      parts.push(
        `${apiOnes.join(" and ")} ${apiOnes.length === 1 ? "offers" : "offer"} an API for developers.`,
      );
    if (beginnerOnes.length < selected.length)
      parts.push(
        `${selected
          .filter((t) => t.skill_level === "Advanced")
          .map((t) => t.name)
          .join(
            " and ",
          )} ${selected.filter((t) => t.skill_level === "Advanced").length === 1 ? "is" : "are"} better suited for advanced users.`,
      );
    return parts.length
      ? parts.join(" ") + " Always confirm current details on official websites."
      : "";
  }

  const summary = getSummary();

  return (
    <div className="shell">
      <div className="page-heading">
        <div className="eyebrow">MAKE A MORE INFORMED CHOICE</div>
        <h1>Compare AI tools</h1>
        <p>
          Add up to 4 tools to compare side by side. Data is illustrative — always confirm on
          official websites.
        </p>
      </div>

      {/* Tool selector row */}
      <div className="cmp-selector">
        {selected.map((t) => (
          <div key={t.slug} className="cmp-selected-chip">
            <ToolLogo tool={t} />
            <span className="cmp-chip-name">{t.name}</span>
            <button
              onClick={() => removeTool(t.slug)}
              aria-label={`Remove ${t.name}`}
              className="cmp-chip-remove"
            >
              <X size={13} />
            </button>
          </div>
        ))}
        {selected.length < 4 && <ToolPicker onAdd={addTool} excluded={slugs} />}
        {selected.length > 0 && (
          <button className="cmp-clear" onClick={() => setTools([])}>
            Clear all
          </button>
        )}
      </div>

      {/* Empty state */}
      {selected.length === 0 && (
        <div className="cmp-empty">
          <p>Add tools above to start comparing, or pick a quick comparison:</p>
          <div className="cmp-quick-picks">
            {[
              ["chatgpt", "claude"],
              ["cursor", "windsurf", "github-copilot"],
              ["midjourney", "adobe-firefly", "leonardo-ai"],
              ["zapier", "make", "n8n"],
            ].map((group) => (
              <button key={group[0]} className="cmp-quick-btn" onClick={() => setTools(group)}>
                {group
                  .map((s) => getTool(s)?.name)
                  .filter(Boolean)
                  .join(" vs ")}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Comparison table */}
      {selected.length >= 2 && (
        <>
          {/* Rule-based summary */}
          {summary && (
            <div className="cmp-summary">
              <strong>Quick take:</strong> {summary}
            </div>
          )}

          <div className="cmp-table-wrap">
            <table className="cmp-table">
              {/* Tool headers */}
              <thead>
                <tr>
                  <th className="cmp-row-label" />
                  {selected.map((t) => (
                    <th key={t.slug} className="cmp-tool-header">
                      <div className="cmp-tool-head-inner">
                        <ToolLogo tool={t} />
                        <div>
                          <Link
                            to="/tool/$slug"
                            params={{ slug: t.slug }}
                            className="cmp-tool-head-name"
                          >
                            {t.name}
                          </Link>
                          <div className="cmp-tool-head-co">{t.company}</div>
                        </div>
                        <button
                          onClick={() => removeTool(t.slug)}
                          className="cmp-tool-remove"
                          aria-label={`Remove ${t.name}`}
                        >
                          <X size={12} />
                        </button>
                      </div>
                      <p className="cmp-tool-desc">{t.short_description}</p>
                      <a
                        href={t.official_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cmp-official"
                      >
                        Official site <ExternalLink size={10} />
                      </a>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Data rows */}
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label}>
                    <td className="cmp-row-label">{row.label}</td>
                    {selected.map((t) => (
                      <td key={t.slug} className="cmp-cell">
                        {row.render ? row.render(t) : String(t[row.key as keyof Tool] ?? "—")}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Platform support rows */}
                <tr className="cmp-section-header">
                  <td colSpan={selected.length + 1}>Platform support</td>
                </tr>
                {PLATFORM_ROWS.map((p) => (
                  <tr key={p}>
                    <td className="cmp-row-label">{p}</td>
                    {selected.map((t) => (
                      <td key={t.slug} className="cmp-cell">
                        {t.platforms.includes(p) ? (
                          <Check size={14} className="text-primary" />
                        ) : (
                          <Minus size={14} className="cmp-no" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="demo-note" style={{ marginTop: 20 }}>
            Comparison data is illustrative and based on commonly reported details. Platforms,
            pricing, and features change — confirm on each tool's official website before making a
            decision.
          </p>
        </>
      )}

      {/* Single tool selected hint */}
      {selected.length === 1 && (
        <p className="cmp-hint">Add at least one more tool to see a comparison.</p>
      )}

      {/* Browse link */}
      <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
        <Link to="/discover" className="section-link">
          Browse all 52+ tools to find ones to compare <ArrowUpRight size={13} />
        </Link>
      </div>
    </div>
  );
}
