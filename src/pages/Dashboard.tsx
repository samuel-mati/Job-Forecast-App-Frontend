// src/pages/Dashboard.tsx
import React, { useEffect, useMemo, useState } from "react";
import StatCard from "../components/StatCard";
import Chat from "../components/Chat";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

// --------------------- Backend URL ---------------------
const BASE_URL = "https://job-forecast-app-backend-nt19.onrender.com";

// --------------------- Types ---------------------
interface SkillDemand {
  name: string;
  demand: number;
  country?: string;
}

interface RegionalDistribution {
  country: string;
  jobs: number;
}

interface TrendHistory {
  month: string;
  [country: string]: number | string;
}

interface DashboardData {
  skill_demand: SkillDemand[];
  regional_distribution: RegionalDistribution[];
  trend_history: TrendHistory[];
}

// --------------------- Component ---------------------
const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --------------------- Fetch Dashboard Data ---------------------
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${BASE_URL}/api/dashboard/`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const json: DashboardData = await res.json();
        setData(json);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(err.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // --------------------- Safe Defaults ---------------------
  const trendHistory = data?.trend_history ?? [];
  const regionalDistribution = data?.regional_distribution ?? [];
  const skillDemand = data?.skill_demand ?? [];

  // --------------------- Extract Countries ---------------------
  const countries = useMemo(() => {
    const set = new Set<string>();
    trendHistory.forEach((entry) => {
      Object.keys(entry).forEach((key) => {
        if (key !== "month") set.add(key);
      });
    });
    return Array.from(set).sort();
  }, [trendHistory]);

  // --------------------- Filtered Data ---------------------
  const filteredTrend = useMemo(() => {
    const base =
      selectedCountry === "All"
        ? trendHistory
        : trendHistory.map((entry) => ({
            month: entry.month,
            [selectedCountry]: entry[selectedCountry] ?? 0,
          }));
    return [...base].sort(
      (a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()
    );
  }, [trendHistory, selectedCountry]);

  const filteredRegional = useMemo(
    () =>
      selectedCountry === "All"
        ? regionalDistribution
        : regionalDistribution.filter((r) => r.country === selectedCountry),
    [regionalDistribution, selectedCountry]
  );

  const filteredSkills = useMemo(
    () =>
      selectedCountry === "All"
        ? skillDemand
        : skillDemand.filter((s) => s.country === selectedCountry),
    [skillDemand, selectedCountry]
  );

  // --------------------- KPI Calculations ---------------------
  const totalJobs = filteredRegional.reduce((sum, r) => sum + r.jobs, 0);

  const topSkill =
    filteredSkills.length > 0
      ? [...filteredSkills].sort((a, b) => b.demand - a.demand)[0].name
      : "N/A";

  const topRegion =
    filteredRegional.length > 0
      ? [...filteredRegional].sort((a, b) => b.jobs - a.jobs)[0].country
      : "N/A";

  const growthRate = useMemo(() => {
    if (filteredTrend.length < 2) return 0;
    const first = filteredTrend[0];
    const last = filteredTrend[filteredTrend.length - 1];

    const getTotal = (entry: TrendHistory) => {
      if (selectedCountry === "All") {
        return countries.reduce((sum, c) => sum + Number(entry[c] || 0), 0);
      }
      return Number(entry[selectedCountry] || 0);
    };

    const firstValue = getTotal(first);
    const lastValue = getTotal(last);

    if (firstValue === 0) return 0;

    return Number((((lastValue - firstValue) / firstValue) * 100).toFixed(1));
  }, [filteredTrend, selectedCountry, countries]);

  const trendDirection =
    growthRate > 5
      ? "Upward Momentum"
      : growthRate < -5
      ? "Cooling Market"
      : "Stable Trend";

  // --------------------- Loading & Error ---------------------
  if (loading) return <p className="p-6 text-sm text-muted">Loading dashboard...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;
  if (!data) return <p className="p-6 text-sm text-muted">No data available.</p>;

  // --------------------- Render ---------------------
  return (
    <div className="px-4 md:px-8 py-6 space-y-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">
            East Africa IT Demand Dashboard
          </h1>
          <p className="text-sm text-muted mt-1">Regional labor market intelligence</p>
          <div className="text-xs text-muted mt-1">{trendDirection}</div>
        </div>

        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="bg-card border border-white/10 rounded-md px-3 py-2 text-sm"
        >
          <option value="All">All Countries</option>
          {countries.map((country) => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard label="Total Jobs" value={totalJobs} trend="neutral" />
        <StatCard label="Top Skill" value={topSkill} trend="neutral" />
        <StatCard label="Top Region" value={topRegion} trend="neutral" />
        <StatCard
          label="Growth Rate"
          value={`${growthRate}%`}
          trend={growthRate > 0 ? "up" : growthRate < 0 ? "down" : "neutral"}
        />
      </div>

      {/* Hiring Trends */}
      <div className="bg-card p-5 rounded-xl border border-white/10">
        <h2 className="text-base font-semibold mb-4">Hiring Trends</h2>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={filteredTrend}>
              <CartesianGrid stroke="#222" strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#141414", border: "1px solid #333", color: "#ffffff" }}
                itemStyle={{ color: "#ffffff" }}
                labelStyle={{ color: "#ffffff" }}
              />
              {(selectedCountry === "All" ? countries : [selectedCountry]).map((c, idx) => (
                <Line
                  key={c}
                  type="monotone"
                  dataKey={c}
                  stroke={`hsl(${(idx * 70) % 360}, 70%, 55%)`}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Regional + Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Regional Distribution */}
        <div className="bg-card p-5 rounded-xl border border-white/10">
          <h2 className="text-base font-semibold mb-4">Regional Distribution</h2>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredRegional} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="country" type="category" tick={{ fontSize: 10 }} width={90} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#141414", border: "1px solid #333", color: "#ffffff" }}
                />
                <Bar dataKey="jobs" radius={[0, 4, 4, 0]}>
                  {filteredRegional.map((_, idx) => (
                    <Cell key={idx} fill={`hsl(${idx * 60}, 65%, 55%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Skills */}
        <div className="bg-card p-5 rounded-xl border border-white/10">
          <h2 className="text-base font-semibold mb-4">Top Skills</h2>
          <div className="space-y-3">
            {[...filteredSkills].sort((a, b) => b.demand - a.demand).slice(0, 5).map((skill) => (
              <div key={skill.name} className="flex justify-between items-center bg-white/5 px-4 py-2 rounded-md text-sm">
                <span>{skill.name}</span>
                <span className="font-semibold">{skill.demand}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Component */}
      <Chat
        onAsk={async (question) => {
          try {
            const res = await fetch(`${BASE_URL}/api/api/forecast/ask`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                question,
                forecast: filteredSkills.map((s) => ({
                  skill: s.name,
                  country: s.country,
                  demand: s.demand,
                })),
              }),
            });
            if (!res.ok) throw new Error(`Chat API error: ${res.status}`);
            const json = await res.json();
            return json.answer;
          } catch (err: any) {
            console.error("Chat fetch error:", err);
            return "Failed to get answer from backend.";
          }
        }}
      />

    </div>
  );
};

export default Dashboard;
