import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  trend: "up" | "down" | "neutral";
}

const StatCard: React.FC<StatCardProps> = ({ label, value, change, trend }) => {
  const trendColors = {
    up: "bg-green-500/10 text-green-500",
    down: "bg-red-500/10 text-red-500",
    neutral: "bg-white/10 text-white",
  };

  const trendSymbols = {
    up: "↑",
    down: "↓",
    neutral: "•",
  };

  return (
    <div className="bg-card p-4 rounded-xl border border-white/10 flex flex-col justify-between h-full">

      <p className="text-xs text-muted uppercase tracking-wide font-semibold">
        {label}
      </p>

      <div className="flex items-end justify-between gap-3 mt-3">

        {/* VALUE FIXED PROPERLY */}
        <h3
          className="
            text-xl
            sm:text-2xl
            font-semibold
            leading-tight
            break-words
            max-w-full
          "
        >
          {value}
        </h3>

        {change && (
          <div className={`text-xs px-2 py-1 rounded shrink-0 ${trendColors[trend]}`}>
            {trendSymbols[trend]} {change}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
