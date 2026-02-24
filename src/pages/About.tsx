
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-accent via-white to-fuchsia bg-clip-text text-transparent">
          EAST AFRICA IT INTELLIGENCE
        </h1>
        <p className="text-xl text-muted font-light">Powering the digital transformation of the EAC through data-driven insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-accent w-fit pb-1">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed">
            This platform serves as a critical bridge between technical talent and regional policy. By analyzing thousands of IT job postings daily, we help educators align curricula with market needs and assist investors in identifying emerging tech hubs.
          </p>
        </section>
        
        <section className="space-y-4">
          <h2 className="text-2xl font-bold border-b border-fuchsia w-fit pb-1">Regional Scope</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
             {['Kenya', 'Tanzania', 'Uganda', 'Rwanda', 'Burundi'].map(c => (
               <div key={c} className="bg-white/5 p-2 rounded border border-white/10 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                 {c}
               </div>
             ))}
          </div>
        </section>
      </div>

      <div className="bg-card p-8 rounded-3xl border border-white/10">
         <h3 className="text-xl font-bold mb-6 uppercase tracking-widest text-center">Data Ecosystem</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
               <div className="text-3xl">📡</div>
               <h4 className="font-bold">Aggregated</h4>
               <p className="text-xs text-muted">LinkedIn, BrighterMonday, MyJobMag, and local governmental portals.</p>
            </div>
            <div className="space-y-2">
               <div className="text-3xl">🧠</div>
               <h4 className="font-bold">AI Processed</h4>
               <p className="text-xs text-muted">NLP extraction of technical requirements and soft skill patterns.</p>
            </div>
            <div className="space-y-2">
               <div className="text-3xl">📈</div>
               <h4 className="font-bold">Real-time</h4>
               <p className="text-xs text-muted">Updates synchronized every 24 hours to ensure high fidelity indicators.</p>
            </div>
         </div>
      </div>

      <footer className="text-center pt-12 border-t border-white/10">
         <p className="text-xs text-muted uppercase tracking-widest">
           Built for Analysts • Educators • Policy Makers • Future Builders
         </p>
      </footer>
    </div>
  );
};

export default About;
