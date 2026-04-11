import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, MapPin, ShieldCheck, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-inter">
      {/* Dynamic Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-gray-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-stone-500/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl text-center z-10 space-y-8"
      >
        <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 text-sm font-medium text-gray-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          Next-Gen City Governance
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight pb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            Shape Your
          </span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-500">
            Smart City
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
          Participate in community issues, dictate budget priorities, and propose impactful projects with beautifully transparent governance.
        </p>

        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Link to="/login" className="relative group overflow-hidden rounded-xl bg-white text-black px-8 py-4 font-bold text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            <span className="relative z-10 flex items-center gap-2">
              Enter CivicPlatform
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <a href="#features" className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-white font-medium hover:bg-white/10 transition-colors">
            Explore Capabilities
          </a>
        </motion.div>
      </motion.div>

      {/* Feature Section */}
      <motion.div 
        id="features"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl mt-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 z-10 pb-20"
      >
        <div className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <MapPin size={28} className="text-white" />
          </div>
          <h3 className="text-xl font-bold font-orbitron text-white mb-3">Live Issue Mapping</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Pinpoint city infrastructure problems with geospatial accuracy using MapLibre powered live-views.</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <Activity size={28} className="text-white" />
          </div>
          <h3 className="text-xl font-bold font-orbitron text-white mb-3">Democratic Budgets</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Use secure tokens to shape the city's financial focus. Allocate funding across multiple active sectors safely.</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <Zap size={28} className="text-white" />
          </div>
          <h3 className="text-xl font-bold font-orbitron text-white mb-3">Kickstarter Engine</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Propose initiatives locally and gather tokenized support from your community to bypass red tape.</p>
        </div>

        <div className="glass-panel p-8 rounded-3xl flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            <ShieldCheck size={28} className="text-white" />
          </div>
          <h3 className="text-xl font-bold font-orbitron text-white mb-3">JWT Secured</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Fully decoupled and fortified architecture utilizing JSON Web Tokens and BCrypt state protection.</p>
        </div>
      </motion.div>
    </div>
  );
}
