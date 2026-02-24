import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Menu,
  BarChart2,
  TrendingUp,
  Briefcase,
  Cpu,
  Info,
  X
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Market Overview', icon: <BarChart2 size={18} /> },
  { path: '/skills', label: 'Skill Trends', icon: <TrendingUp size={18} /> },
  { path: '/jobs', label: 'Job Analytics', icon: <Briefcase size={18} /> },
  { path: '/forecasts', label: 'AI Forecasts', icon: <Cpu size={18} /> },
  { path: '/about', label: 'About Project', icon: <Info size={18} /> },
];

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden p-3 fixed top-4 left-4 z-50 bg-accent/80 text-white rounded-lg shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={20} />
      </button>

      {/* Sidebar Overlay for Mobile */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-card border-r border-white/10
          flex flex-col z-50 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-fuchsia bg-clip-text text-transparent uppercase tracking-tighter">
              EA IT Forecaster
            </h1>
            <p className="text-[10px] text-muted mt-1 uppercase tracking-widest">
              Market Intelligence v1.0
            </p>
          </div>
          {/* Close button for mobile */}
          <button className="md:hidden" onClick={() => setIsOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-accent/10 text-accent border border-accent/20 shadow-[0_0_15px_rgba(0,212,255,0.1)]' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'}
              `}
              onClick={() => setIsOpen(false)} // close sidebar on mobile link click
            >
              {item.icon}
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Status */}
        <div className="p-6 border-t border-white/10">
          <div className="p-3 bg-white/5 rounded-lg">
            <p className="text-[10px] uppercase text-muted font-bold mb-1">Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-mono">Live Sync: Active</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
