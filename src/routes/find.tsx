import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Sparkles, RotateCcw, ExternalLink, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tools, categories, getCategory, type Tool } from "@/lib/catalog";
import { ToolLogo } from "@/components/compass/shared";
import { pageHead, breadcrumbSchema, SITE_URL } from "@/lib/metadata";

export const Route = createFileRoute("/find")({
  head: () => ({
    ...pageHead(
      "Find the Right AI for Your Task",
      "Describe what you want to do and AI Compass recommends the best AI tools for your task. Transparent keyword-based matching across 52+ AI tools.",
      {
        path: "/find",
        keywords: "find AI tool, best AI for task, AI recommendation, which AI should I use",
      },
    ),
    scripts: [
      breadcrumbSchema([
        { name: "AI Compass", url: SITE_URL },
        { name: "Find", url: `${SITE_URL}/find` },
      ]),
    ],
  }),
  component: FindPage,
});

/* ── Suggestion chips ─────────────────────────────────────── */
const SUGGESTIONS = [
  "Write a blog post",
  "Build a website",
  "Generate images",
  "Analyze data from a spreadsheet",
  "Create a presentation",
  "Write and debug code",
  "Edit a video",
  "Transcribe a meeting",
  "Research a topic",
  "Create music",
  "Chat with a PDF",
  "Run AI locally",
];

/* ── Scoring engine ───────────────────────────────────────── */
interface Result {
  tool: Tool;
  score: number;
  reasons: string[];
}

function scoreTools(query: string): Result[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const words = q.split(/\s+/).filter((w) => w.length > 2);

  return tools
    .filter((t) => t.demo === true || t.verified === false) // all catalog tools
    .map((t) => {
      let score = 0;
      const reasons: string[] = [];

      // Name match — very high weight
      if (t.name.toLowerCase().includes(q)) {
        score += 40;
        reasons.push(`Named "${t.name}"`);
      }

      // Tags match
      t.tags.forEach((tag) => {
        if (
          q.includes(tag.toLowerCase()) ||
          tag
            .toLowerCase()
            .split(" ")
            .some((w) => words.includes(w))
        ) {
          score += 15;
          reasons.push(`Tagged: ${tag}`);
        }
      });

      // Category match
      t.categories.forEach((slug) => {
        const cat = getCategory(slug);
        if (!cat) return;
        const catWords = cat.name.toLowerCase().split(/\s+/);
        if (catWords.some((w) => words.includes(w)) || q.includes(cat.name.toLowerCase())) {
          score += 20;
          reasons.push(`Category: ${cat.name}`);
        }
      });

      // Description keyword match
      const desc = (t.short_description + " " + t.long_description).toLowerCase();
      words.forEach((w) => {
        if (desc.includes(w)) {
          score += 3;
        }
      });

      // Exact phrase in description
      if (desc.includes(q)) {
        score += 25;
        reasons.push("Matches your description");
      }

      // Best for / key features
      [...t.best_for, ...t.key_features].forEach((item) => {
        if (
          item
            .toLowerCase()
            .split(/\s+/)
            .some((w) => words.includes(w))
        ) {
          score += 8;
        }
      });

      // Featured tools get a small boost for relevance
      if (t.featured && score > 0) score += 5;

      return { tool: t, score, reasons: [...new Set(reasons)].slice(0, 3) };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12);
}

/* ── Result card ─────────────────────────────────────────── */
function ResultCard({ result, rank }: { result: Result; rank: number }) {
  const { tool: t, reasons } = result;
  const catName = getCategory(t.categories[0])?.name ?? "";
  const isBest = rank === 0;

  return (
    <div className={`find-card${isBest ? " find-card-best" : ""}`}>
      {isBest && (
        <div className="find-card-badge">
          <Sparkles size={10} /> Best match
        </div>
      )}
      <div className="find-card-top">
        <ToolLogo tool={t} />
        <div className="find-card-info">
          <Link to="/tool/$slug" params={{ slug: t.slug }} className="find-card-name">
            {t.name}
          </Link>
          <span className="find-card-cat">{catName}</span>
        </div>
      </div>
      <p className="find-card-desc">{t.short_description}</p>
      {reasons.length > 0 && (
        <div className="find-card-reasons">
          {reasons.map((r) => (
            <span key={r} className="find-reason-chip">
              {r}
            </span>
          ))}
        </div>
      )}
      <div className="find-card-actions">
        <Button size="sm" variant="outline" asChild>
          <Link to="/tool/$slug" params={{ slug: t.slug }}>
            View profile
            <ArrowUpRight size={13} />
          </Link>
        </Button>
        <a
          href={t.official_url}
          target="_blank"
          rel="noopener noreferrer"
          className="find-official-link"
        >
          Official site <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
function FindPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [searched, setSearched] = useState(false);

  function run(q: string) {
    setQuery(q);
    setResults(scoreTools(q));
    setSearched(true);
  }

  function reset() {
    setQuery("");
    setResults([]);
    setSearched(false);
  }

  const best = results.slice(0, 1);
  const good = results.slice(1, 4);
  const others = results.slice(4);

  return (
    <div className="shell">
      <div className="page-heading">
        <div className="eyebrow">
          <Lightbulb size={15} />
          FIND THE RIGHT AI FOR YOUR TASK
        </div>
        <h1>What do you want to do?</h1>
        <p>
          Describe your task and we'll match you with the most relevant AI tools. Matching is based
          on categories, tags, and descriptions — no black box.
        </p>
      </div>

      {/* Search box */}
      <div className="find-search-wrap">
        <div className="find-search-box">
          <Sparkles size={18} className="find-search-icon" />
          <input
            className="find-search-input"
            placeholder="e.g. write a blog post, generate images, analyze my data..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && query.trim() && run(query)}
            aria-label="Describe your task"
            autoFocus
          />
          {query && (
            <button className="find-search-clear" onClick={reset} aria-label="Clear">
              ✕
            </button>
          )}
        </div>
        <Button onClick={() => run(query)} disabled={!query.trim()} size="lg">
          Find my AI
        </Button>
      </div>

      {/* Suggestion chips */}
      {!searched && (
        <div className="find-suggestions">
          <span className="find-suggestions-label">Try:</span>
          {SUGGESTIONS.map((s) => (
            <button key={s} className="find-suggestion-chip" onClick={() => run(s)}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {searched && results.length === 0 && (
        <div className="find-empty">
          <p>
            No strong matches found for "<strong>{query}</strong>".
          </p>
          <p>
            Try different words, or{" "}
            <Link to="/discover" className="text-primary">
              browse all tools
            </Link>
            .
          </p>
          <Button variant="outline" onClick={reset}>
            <RotateCcw size={14} /> Try again
          </Button>
        </div>
      )}

      {searched && results.length > 0 && (
        <div className="find-results">
          <div className="find-results-header">
            <p className="find-results-count">
              {results.length} tool{results.length !== 1 ? "s" : ""} matched "
              <strong>{query}</strong>"
            </p>
            <button className="find-reset" onClick={reset}>
              <RotateCcw size={13} /> Start over
            </button>
          </div>

          {/* Best match */}
          {best.length > 0 && (
            <section className="find-section-group">
              <h2 className="find-section-title">Best match</h2>
              <div className="find-grid find-grid-1">
                {best.map((r, i) => (
                  <ResultCard key={r.tool.slug} result={r} rank={i} />
                ))}
              </div>
            </section>
          )}

          {/* Good options */}
          {good.length > 0 && (
            <section className="find-section-group">
              <h2 className="find-section-title">Other good options</h2>
              <div className="find-grid find-grid-3">
                {good.map((r, i) => (
                  <ResultCard key={r.tool.slug} result={r} rank={i + 1} />
                ))}
              </div>
            </section>
          )}

          {/* More alternatives */}
          {others.length > 0 && (
            <section className="find-section-group">
              <h2 className="find-section-title">More alternatives</h2>
              <div className="find-grid find-grid-3">
                {others.map((r, i) => (
                  <ResultCard key={r.tool.slug} result={r} rank={i + 4} />
                ))}
              </div>
            </section>
          )}

          <p className="find-disclaimer">
            Scores reflect how closely each tool's category, tags, and description match your query
            — not quality or verified performance. Always confirm current details on the tool's
            official website.
          </p>
        </div>
      )}

      {/* Browse categories shortcut */}
      {!searched && (
        <div className="find-browse-hint">
          <span>Prefer browsing?</span>
          <Link to="/categories" className="find-browse-link">
            Explore all 26 categories <ArrowUpRight size={13} />
          </Link>
          <Link to="/discover" className="find-browse-link">
            See all 52 tools <ArrowUpRight size={13} />
          </Link>
        </div>
      )}
    </div>
  );
}
