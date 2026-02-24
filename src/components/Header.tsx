
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-white/10 bg-background/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50">
      <div>
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
          IT Jobs Analysis — East Africa
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
           {['KE', 'TZ', 'UG', 'RW', 'BI'].map((c) => (
             <div key={c} className="w-8 h-8 rounded-full border border-background bg-card flex items-center justify-center text-[10px] font-bold">
               {c}
             </div>
           ))}
        </div>
        <button className="px-4 py-1.5 bg-accent text-background text-xs font-bold rounded hover:bg-white transition-colors">
          EXPORT REPORT
        </button>
      </div>
    </header>
  );
};

export default Header;
