// src/simulation/components/Sandbox.jsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Coins, Leaf, HeartPulse, Bus, Trash2, GraduationCap, Gavel } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx'; // Adjust path if AuthContext is at a different level

// Reusable Slider Component for internal use
const SectorSlider = ({ icon, name, color, value, onChange, max, isDisabled }) => (
  <motion.div 
    className="holographic-card p-4"
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex justify-between items-center mb-2">
      <div className={`flex items-center text-lg font-semibold ${color}`}>
        {icon}
        <span className="ml-3 font-orbitron">{name}</span>
      </div>
      <span className={`font-bold text-xl ${color} font-orbitron`}>{value}%</span>
    </div>
    <input
      type="range"
      min="0"
      max={max}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      disabled={isDisabled}
      className={`w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer ${isDisabled ? 'opacity-50' : ''} [&::-webkit-slider-thumb]:bg-blue-600 [&::-moz-range-thumb]:bg-blue-600`}
    />
  </motion.div>
);

export default function Sandbox() {
  const { isAdmin } = useAuth();

  const [allocations, setAllocations] = useState({
    transport: 25,
    healthcare: 30,
    environment: 15,
    sanitation: 15,
    education: 15,
  });

  const totalAllocated = useMemo(() => Object.values(allocations).reduce((sum, val) => sum + val, 0), [allocations]);

  const handleAllocationChange = (sector, value) => {
    // Admins cannot change sliders in this simulation, they only review
    if (isAdmin) return; 

    const newAllocations = { ...allocations, [sector]: value };
    const newTotal = Object.values(newAllocations).reduce((sum, val) => sum + val, 0);

    // Ensure total doesn't exceed 100%
    if (newTotal <= 100) {
      setAllocations(newAllocations);
    } else {
        // If it goes over, adjust other sectors proportionally or simply cap
        // For simplicity, we just cap it and let the `max` prop on slider handle direct overflow.
        // The `max` prop will prevent direct input beyond the remaining.
    }
  };
  
  // Simulated impact metrics based on allocations
  const impactMetrics = {
      commuteTime: Math.max(10, 30 - allocations.transport * 0.4), // More transport = less commute time
      airQuality: Math.min(100, 50 + allocations.environment * 2), // More environment = better air quality
      lifeExpectancy: Math.min(85, 75 + allocations.healthcare * 0.15), // More healthcare = higher life expectancy
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Allocation Sliders */}
      <motion.div className="lg:col-span-2 space-y-6">
        <SectorSlider icon={<Bus />} name="Transportation" color="text-blue-400" value={allocations.transport} onChange={(v) => handleAllocationChange('transport', v)} max={100 - totalAllocated + allocations.transport} isDisabled={isAdmin} />
        <SectorSlider icon={<HeartPulse />} name="Healthcare" color="text-green-400" value={allocations.healthcare} onChange={(v) => handleAllocationChange('healthcare', v)} max={100 - totalAllocated + allocations.healthcare} isDisabled={isAdmin} />
        <SectorSlider icon={<Leaf />} name="Environment" color="text-yellow-400" value={allocations.environment} onChange={(v) => handleAllocationChange('environment', v)} max={100 - totalAllocated + allocations.environment} isDisabled={isAdmin} />
        <SectorSlider icon={<Trash2 />} name="Sanitation" color="text-purple-400" value={allocations.sanitation} onChange={(v) => handleAllocationChange('sanitation', v)} max={100 - totalAllocated + allocations.sanitation} isDisabled={isAdmin} />
        <SectorSlider icon={<GraduationCap />} name="Education" color="text-pink-400" value={allocations.education} onChange={(v) => handleAllocationChange('education', v)} max={100 - totalAllocated + allocations.education} isDisabled={isAdmin} />
      </motion.div>

      {/* Impact Simulation & Action */}
      <motion.div 
        className="holographic-card p-6 flex flex-col items-center justify-center space-y-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
          <h2 className="text-2xl font-bold text-white mb-4 font-orbitron">Impact Simulation</h2>
          <div className="text-center">
              <p className="text-gray-400 text-sm">Avg. Commute Time</p>
              <motion.p key={impactMetrics.commuteTime} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-5xl font-bold text-blue-400 font-orbitron">{impactMetrics.commuteTime.toFixed(0)} min</motion.p>
          </div>
          <div className="text-center">
              <p className="text-gray-400 text-sm">Air Quality Index</p>
              <motion.p key={impactMetrics.airQuality} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-5xl font-bold text-green-400 font-orbitron">{impactMetrics.airQuality.toFixed(0)}</motion.p>
          </div>
          <div className="w-full text-center mt-auto pt-6">
              <p className="text-lg font-semibold text-white">Total Allocated: {totalAllocated}%</p>
              <div className="w-full bg-gray-700 rounded-full h-3 mt-2">
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                    animate={{ width: `${totalAllocated}%`}}
                    transition={{ duration: 0.5 }}
                  />
              </div>
              {isAdmin ? (
                  <motion.button className="mt-6 w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors glow-effect" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Gavel size={20} className="mr-2 inline-block"/> Approve Allocation
                  </motion.button>
              ) : (
                  <motion.button className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-lg disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed glow-effect" disabled={totalAllocated !== 100} whileHover={{ scale: totalAllocated === 100 ? 1.05 : 1 }} whileTap={{ scale: totalAllocated === 100 ? 0.95 : 1 }}>
                      {totalAllocated === 100 ? "Submit Proposal" : `Allocate ${100 - totalAllocated}% more`}
                  </motion.button>
              )}
          </div>
      </motion.div>
    </div>
  );
}