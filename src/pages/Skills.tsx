import React, { useEffect, useState } from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

// Types for API response
interface SkillData {
  skill: string;
  country: string;
  month: string;
  count: number;
}

// Type for chart data
interface ChartData {
  name: string;
  demand: number;
}

const Skills: React.FC = () => {
  const [skillsData, setSkillsData] = useState<SkillData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('All Region');
  const [loading, setLoading] = useState(true);

  const COUNTRIES = ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Burundi', 'Unknown'];

  // Fetch skills data from Render backend
useEffect(() => {
  fetch('https://job-forecast-app-backend-nt19.onrender.com/api/api/skills/')
    .then(res => res.json())
    .then((data: SkillData[]) => {
      setSkillsData(data);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching skills:', err);
      setLoading(false);
    });
}, []);

  if (loading) return <div>Loading skills data...</div>;

  // Filter data by country
  const filteredData =
    selectedCountry === 'All Region'
      ? skillsData
      : skillsData.filter(d => d.country.toLowerCase() === selectedCountry.toLowerCase());

  // Aggregate skill demand
  const chartData: ChartData[] = filteredData.reduce((acc, curr) => {
    const existing = acc.find(d => d.name === curr.skill);
    if (existing) {
      existing.demand += curr.count;
    } else {
      acc.push({ name: curr.skill, demand: curr.count });
    }
    return acc;
  }, [] as ChartData[]);

  // Sort descending for BarChart
  const topSkills = [...chartData].sort((a, b) => b.demand - a.demand);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header & Country Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">IT Skill Trends</h1>
          <p className="text-muted text-sm">Mapping the technical landscape across East Africa.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All Region', ...COUNTRIES].map(c => (
            <button
              key={c}
              onClick={() => setSelectedCountry(c)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                selectedCountry === c
                  ? 'bg-accent border-accent text-background font-bold'
                  : 'border-white/10 text-muted hover:border-white/30'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <div className="bg-card p-8 rounded-2xl border border-white/10 flex flex-col items-center">
          <h3 className="text-xl font-bold mb-8 self-start uppercase tracking-widest text-accent">
            Skill Intensity Index
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="80%"
                data={chartData.length ? chartData : [{ name: 'No Data', demand: 0 }]}
              >
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="name" stroke="#888" fontSize={12} />
                <PolarRadiusAxis
                  stroke="#444"
                  angle={30}
                  domain={[0, Math.max(...chartData.map(d => d.demand), 10)]}
                />
                <Radar name="Demand" dataKey="demand" stroke="#00d4ff" fill="#00d4ff" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-card p-6 rounded-2xl border border-white/10">
          <h3 className="text-lg font-bold mb-4 uppercase text-fuchsia tracking-widest">Skill Demand</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSkills.length ? topSkills : [{ name: 'No Data', demand: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={10} />
                <YAxis stroke="#666" fontSize={10} />
                <Tooltip
                  cursor={{ fill: '#222' }}
                  contentStyle={{ backgroundColor: '#141414', border: '1px solid #333' }}
                />
                <Bar dataKey="demand" fill="#ff00ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Optional Insights Section */}
      {/* You can later generate insights dynamically based on API data */}
    </div>
  );
};

export default Skills;
