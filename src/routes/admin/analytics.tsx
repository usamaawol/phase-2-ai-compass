import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  Legend,
} from "recharts";
import { Eye, Users, UserCheck, UserPlus, TrendingUp, Activity, FileText } from "lucide-react";
import { getAnalytics } from "@/lib/admin-db";
import { pageHead } from "@/lib/metadata";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

export const Route = createFileRoute("/admin/analytics")({
  head: () => pageHead("Analytics — Admin", "Site traffic and user analytics", { noindex: true }),
  component: AdminAnalytics,
});

type AnalyticsData = Awaited<ReturnType<typeof getAnalytics>>;

const chartConfig = {
  views: { label: "Page Views", color: "hsl(var(--primary))" },
  unique: { label: "Unique Visitors", color: "hsl(var(--chart-2))" },
} as const;

function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAnalytics()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const chartData = useMemo(() => {
    if (!data) return [];
    return data.total_views_last_7_days.map((d) => ({
      ...d,
      label: formatDayLabel(d.day),
    }));
  }, [data]);

  if (loading) return <div className="admin-page-loading">Loading analytics…</div>;
  if (error) return <div className="admin-error">Error: {error}</div>;
  if (!data) return null;

  const statCards = [
    {
      label: "Total Page Views",
      value: data.total_views,
      icon: Eye,
      color: "blue",
    },
    {
      label: "Unique Sessions",
      value: data.unique_sessions,
      icon: Activity,
      color: "purple",
    },
    {
      label: "Unique Visitors",
      value: data.unique_visitors,
      icon: Users,
      color: "teal",
    },
    {
      label: "Logged-In Users",
      value: data.logged_in_users,
      icon: UserCheck,
      color: "green",
    },
    {
      label: "Signups (7d)",
      value: data.user_signups_last_7,
      icon: UserPlus,
      color: "orange",
    },
  ];

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <h1>Analytics</h1>
          <p>Traffic overview and visitor insights (last sampled page views)</p>
        </div>
      </div>

      <div className="admin-stat-grid">
        {statCards.map((c) => (
          <div key={c.label} className={`admin-stat-card admin-stat-${c.color}`}>
            <c.icon size={22} />
            <div>
              <div className="admin-stat-value">{c.value.toLocaleString()}</div>
              <div className="admin-stat-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-section">
        <h2>
          <TrendingUp size={18} /> Traffic — Last 7 Days
        </h2>
        <div className="admin-chart-card">
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-72 w-full">
              <LineChart data={chartData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ReTooltip
                  cursor={false}
                  content={(props) => <ChartTooltipContent {...props} indicator="line" />}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="views"
                  name="Page Views"
                  stroke="var(--color-views)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="unique"
                  name="Unique Visitors"
                  stroke="var(--color-unique)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  strokeDasharray="4 4"
                />
              </LineChart>
            </ChartContainer>
          ) : (
            <div className="admin-empty">No page view data available for the last 7 days.</div>
          )}
        </div>
      </div>

      <div className="admin-section">
        <h2>
          <FileText size={18} /> Top Pages
        </h2>
        <div className="admin-chart-card">
          {data.top_pages.length > 0 ? (
            <TopPagesChart data={data.top_pages} />
          ) : (
            <div className="admin-empty">No top page data yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function TopPagesChart({ data }: { data: { path: string; views: number }[] }) {
  const topConfig = {
    views: { label: "Page Views", color: "hsl(var(--primary))" },
  } as const;
  return (
    <ChartContainer config={topConfig} className="h-80 w-full">
      <BarChart data={data} layout="vertical" accessibilityLayer>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          type="category"
          dataKey="path"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={180}
          tickFormatter={(v) => (v.length > 26 ? v.slice(0, 23) + "…" : v)}
        />
        <ReTooltip
          cursor={false}
          content={(props) => <ChartTooltipContent {...props} indicator="dot" />}
        />
        <Bar dataKey="views" name="Page Views" fill="var(--color-views)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  );
}

function formatDayLabel(dayBucket: string): string {
  const [year, month, day] = dayBucket.split("-");
  const d = new Date(Number(year), Number(month) - 1, Number(day));
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
