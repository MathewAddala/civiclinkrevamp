import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ title, value, Icon, color = 'blue' }) {
  const colors = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    purple: 'text-purple-400',
  };

  const borderColors = {
    blue: 'border-blue-700',
    green: 'border-green-700',
    yellow: 'border-yellow-700',
    purple: 'border-purple-700',
  };

  return (
    <motion.div
      className={`holographic-card p-6 flex flex-col justify-between items-start 
                  border ${borderColors[color]} relative overflow-hidden`}
      whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(59, 130, 246, 0.25)" }} 
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Background glowing circle for futuristic touch */}
      <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full opacity-10 blur-xl ${colors[color].replace('text', 'bg')}`} />

      <div className="flex items-center justify-between w-full z-10 relative mb-4">
        <div className={`text-5xl ${colors[color]} mr-4`}>
          <Icon size={40} strokeWidth={1.5} />
        </div>
        <div className="text-right">
          <p className="text-sm font-light text-gray-400 mb-1">{title}</p>
          <p className="text-4xl font-bold text-gray-100 glow-text font-orbitron">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}