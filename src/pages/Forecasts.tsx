import React, { useEffect, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// -------------------- Types --------------------

interface ForecastItem {
  skill: string;
  country?: string;
  month: string;
  forecast: number;
  forecast_lower?: number;
  forecast_upper?: number;
}

// -------------------- Component --------------------

const Forecasts: React.FC = () => {
  const [data, setData] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  // -------------------- Fetch Data --------------------
useEffect(() => {
  const fetchForecast = async () => {
    try {
      const res = await fetch(
        "https://job-forecast-app-backend-nt19.onrender.com/api/forecast/"
      );
      if (!res.ok) throw new Error("Failed to fetch forecast data");
      const json: ForecastItem[] = await res.json();
      setData(json);
    } catch (err: any) {
      console.error("Forecast fetch error:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };
  fetchForecast();
}, []);

  // -------------------- Aggregate Forecast by Month --------------------

  const chartData = useMemo(() => {
    // Sum all forecasts per month across skills
    const aggregated = data.reduce<Record<string, ForecastItem>>((acc, curr) => {
      if (!acc[curr.month]) {
        acc[curr.month] = { ...curr };
      } else {
        acc[curr.month].forecast += curr.forecast;
        if (curr.forecast_lower !== undefined)
          acc[curr.month].forecast_lower =
            (acc[curr.month].forecast_lower || 0) + curr.forecast_lower;
        if (curr.forecast_upper !== undefined)
          acc[curr.month].forecast_upper =
            (acc[curr.month].forecast_upper || 0) + curr.forecast_upper;
      }
      return acc;
    }, {});

    return Object.entries(aggregated)
      .map(([month, item]) => ({
        month,
        forecast: item.forecast,
        forecast_lower: item.forecast_lower,
        forecast_upper: item.forecast_upper,
      }))
      .sort(
        (a, b) =>
          new Date(a.month).getTime() - new Date(b.month).getTime()
      );
  }, [data]);

  // -------------------- Derived Metrics --------------------

  const latestForecast =
    chartData.length > 0
      ? chartData[chartData.length - 1].forecast
      : 0;

  const averageConfidence = useMemo(() => {
    const valid = chartData.filter(
      (d) =>
        d.forecast_lower !== undefined && d.forecast_upper !== undefined
    );
    if (!valid.length) return null;

    const avg =
      valid.reduce(
        (sum, d) =>
          sum +
          1 -
          (d.forecast_upper! - d.forecast_lower!) / (d.forecast || 1),
        0
      ) / valid.length;

    return (avg * 100).toFixed(1);
  }, [chartData]);

  // -------------------- States --------------------

  if (loading)
    return (
      <div className="text-center py-20 text-gray-400">
        Loading forecast data...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-400">{error}</div>
    );

  if (!chartData.length)
    return (
      <div className="text-center py-20 text-gray-400">
        No forecast data available.
      </div>
    );

  // -------------------- Render --------------------

  return (
    <div className="space-y-10 px-4 md:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            AI Demand Projections
          </h1>
          <p className="text-sm text-muted mt-1">
            Forecasted IT job openings based on predictive modeling.
          </p>
        </div>

        {averageConfidence && (
          <div className="px-4 py-2 bg-fuchsia/10 border border-fuchsia/30 rounded-lg">
            <span className="text-xs font-bold text-fuchsia uppercase">
              Model Confidence: {averageConfidence}%
            </span>
          </div>
        )}
      </div>

      {/* Chart Card */}
      <div className="bg-card p-8 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <span className="text-8xl font-black">AI</span>
        </div>

        <h3 className="text-xl font-semibold mb-8 flex items-center gap-3">
          <span className="w-3 h-3 bg-fuchsia rounded-full shadow-[0_0_10px_#ff00ff]" />
          Projected IT Job Openings
        </h3>

        <div className="h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id="forecastGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#ff00ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff00ff" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />

              <XAxis
                dataKey="month"
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) =>
                  new Date(value).toLocaleString("default", { month: "short" })
                }
              />

              <YAxis
                stroke="#666"
                fontSize={12}
                tickFormatter={(value) => value.toLocaleString()}
              />
<Tooltip
  contentStyle={{
    backgroundColor: "#141414",
    border: "1px solid #333",
    color: "#ffffff",
  }}
  itemStyle={{ color: "#ffffff" }}
  labelStyle={{ color: "#ffffff" }}
  formatter={(value: number | undefined, _name, props) => {
    const safeValue = value ?? 0;
    const payload = props?.payload;

    return [
      `${safeValue.toLocaleString()} (low: ${
        payload?.forecast_lower?.toLocaleString() ?? "—"
      }, high: ${
        payload?.forecast_upper?.toLocaleString() ?? "—"
      })`,
      "Forecast",
    ];
  }}
  labelFormatter={(label) =>
    new Date(label).toLocaleDateString()
  }
/>

              <Area
                type="monotone"
                dataKey="forecast"
                stroke="#ff00ff"
                fill="url(#forecastGradient)"
                strokeWidth={3}
                animationDuration={2000}
                animationEasing="ease-in-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
        <h3 className="font-semibold mb-2 uppercase tracking-wide text-sm">
          Forecast Insight
        </h3>
        <p className="text-sm text-gray-300">
          The most recent projected demand reaches{" "}
          <span className="font-semibold text-fuchsia">
            {latestForecast.toLocaleString()}
          </span>{" "}
          expected job openings, indicating sustained momentum in the IT sector.
        </p>
      </div>
    </div>
  );
};

export default Forecasts;
