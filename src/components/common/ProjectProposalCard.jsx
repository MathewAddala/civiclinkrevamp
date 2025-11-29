// src/components/common/ProjectProposalCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, CheckCircle } from 'lucide-react';

export default function ProjectProposalCard({ project, delay, isAdmin }) {
  const projectColors = {
    green: 'green',
    purple: 'purple',
    blue: 'blue',
    yellow: 'yellow',
    red: 'red',
    indigo: 'indigo',
  };
  const currentColor = projectColors[project.color] || 'blue'; // Fallback color

  return (
    <motion.div 
      className="holographic-card p-6 flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, boxShadow: "0 0 25px rgba(59, 130, 246, 0.25)" }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className={`text-xl font-bold text-${currentColor}-400 font-orbitron`}>{project.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${project.status === 'approved' ? 'bg-green-900/50 text-green-400' : project.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-blue-900/50 text-blue-400'}`}>
          {project.status.toUpperCase()}
        </span>
      </div>
      <p className="text-gray-400 mt-2 flex-grow text-sm">{project.desc}</p>
      <div className="mt-6">
        <div className="flex justify-between items-center text-sm text-gray-300 mb-2">
          <span className="flex items-center"><Target size={14} className="mr-2"/> Goal: {project.goal} Tokens</span>
          <span className="flex items-center"><Users size={14} className="mr-2"/> {((project.current / project.goal) * 100).toFixed(0)}% Funded</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <motion.div 
            className={`bg-gradient-to-r from-${currentColor}-500 to-${currentColor}-400 h-2.5 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${(project.current / project.goal) * 100}%` }}
            transition={{ duration: 1, delay: delay * 0.1 + 0.5 }}
          />
        </div>
        {isAdmin ? (
            project.status === 'pending' ? (
              <motion.button 
                  className="w-full mt-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors glow-effect"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
              >
                  <CheckCircle size={18} className="mr-2 inline-block"/> Approve Project
              </motion.button>
            ) : (
              <div className="w-full mt-6 py-2 bg-gray-600 text-gray-400 font-semibold rounded-lg cursor-not-allowed text-center">
                  Project {project.status.toUpperCase()}
              </div>
            )
        ) : (
            <motion.button 
              className="w-full mt-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors glow-effect disabled:bg-gray-600 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={project.status === 'approved'}
            >
              {project.status === 'approved' ? 'Funded & Approved' : 'View & Support'}
            </motion.button>
        )}
      </div>
    </motion.div>
  );
};