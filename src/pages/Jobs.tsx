// Jobs.tsx
import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

// -------------------- Types --------------------
interface JobRole {
  role: string;
  count: number;
}

// -------------------- Colors --------------------
const COLORS = [
  "#00d4ff",
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
];

// -------------------- Component --------------------
const Jobs: React.FC = () => {
  // -------------------- State --------------------
  const [rolesData, setRolesData] = useState<JobRole[]>([]);
  const [loading, setLoading] = useState(true);

// -------------------- Fetch Jobs Data --------------------
useEffect(() => {
  const fetchJobs = async () => {
    try {
      const res = await fetch(
        "https://job-forecast-app-backend-nt19.onrender.com/api/api/jobs/"
      );
      const data: JobRole[] = await res.json();

      // Sort descending by count and pick top 6
      const sorted = [...data].sort((a, b) => b.count - a.count);
      setRolesData(sorted.slice(0, 6));
    } catch (err) {
      console.error("Failed to fetch job roles:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchJobs();
}, []);

  // -------------------- Loading / Empty States --------------------
  if (loading) {
    return (
      <div className="p-6 text-sm text-muted">
        Loading job analytics...
      </div>
    );
  }

  if (!rolesData.length) {
    return (
      <div className="p-6 text-sm text-muted">
        No job data available.
      </div>
    );
  }

  // -------------------- Derived Metrics --------------------
  const totalJobs = rolesData.reduce((sum, r) => sum + r.count, 0);

  const pieData = rolesData.map((role) => ({
    name: role.role,
    value: role.count,
  }));

  const topRole = rolesData[0];
  const topShare =
    totalJobs > 0 ? Math.round((topRole.count / totalJobs) * 100) : 0;

  // -------------------- Layout --------------------
  return (
    <div className="px-4 md:px-8 py-6 space-y-10">

      {/* -------------------- Header -------------------- */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold">
          Job Analytics
        </h1>
        <p className="text-sm text-muted mt-1">
          Distribution of leading IT roles across the market
        </p>
      </div>

      {/* -------------------- Grid -------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* -------------------- Pie Chart Card -------------------- */}
        <div className="bg-card p-6 rounded-xl border border-white/10">
          <h2 className="text-base font-semibold mb-6">
            Market Share by Role
          </h2>

          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={3}
                  label={({ percent }) =>
                    `${((percent ?? 0) * 100).toFixed(1)}%`
                  }
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                {/* -------------------- Tooltip -------------------- */}
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#141414",
                    border: "1px solid #333",
                  }}
                  itemStyle={{ color: "#ffffff", fontSize: "12px" }}
                  formatter={(value: number | undefined, name: string | undefined, props) => {
                    const percent =
                      totalJobs > 0 && value
                        ? ((value / totalJobs) * 100).toFixed(1)
                        : "0";
                    return [`${value?.toLocaleString()} (${percent}%)`, name];
                  }}
                />

                {/* -------------------- Legend -------------------- */}
                <Legend
                  wrapperStyle={{ fontSize: "10px" }}
                  iconSize={8}
                  verticalAlign="bottom"
                  height={36}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* -------------------- Table + Insight Card -------------------- */}
        <div className="space-y-6">

          {/* -------------------- Table -------------------- */}
          <div className="bg-card rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-white/5 text-muted text-xs uppercase tracking-wide border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left">Position</th>
                  <th className="px-6 py-4 text-right">Job Count</th>
                  <th className="px-6 py-4 text-right">Market Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rolesData.map((item) => {
                  const share =
                    totalJobs > 0
                      ? ((item.count / totalJobs) * 100).toFixed(1)
                      : "0";
                  return (
                    <tr
                      key={item.role}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium">{item.role}</td>
                      <td className="px-6 py-4 text-right font-mono">
                        {item.count.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-accent font-semibold">
                        {share}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* -------------------- Insight -------------------- */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-2">
              Market Insight
            </h3>
            <p className="text-sm text-gray-300">
              <span className="font-semibold">{topRole.role}</span> currently dominates the IT job market,
              representing <span className="font-semibold">{topShare}%</span> of
              the top listed positions. Employers are heavily hiring for this role compared to other roles,
              indicating strong demand in this specialization.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Jobs;
