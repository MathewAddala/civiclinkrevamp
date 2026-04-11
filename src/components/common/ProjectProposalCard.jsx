
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, CheckCircle, XCircle } from 'lucide-react';

export default function ProjectProposalCard({ project, delay, isAdmin, onApprove, onReject, onSupport }) {
  const projectColors = {
    green: { text: 'text-green-400', bar: 'from-green-500 to-green-400' },
    purple: { text: 'text-purple-400', bar: 'from-purple-500 to-purple-400' },
    blue: { text: 'text-blue-400', bar: 'from-blue-500 to-blue-400' },
    yellow: { text: 'text-yellow-400', bar: 'from-yellow-500 to-yellow-400' },
    red: { text: 'text-red-400', bar: 'from-red-500 to-red-400' },
    indigo: { text: 'text-indigo-400', bar: 'from-indigo-500 to-indigo-400' },
  };
  const currentColor = projectColors[project.color] || projectColors.blue;
  const fundingRatio = project.goal > 0 ? (project.current / project.goal) * 100 : 0;
  const isFullyFunded = project.goal > 0 && project.current >= project.goal;
  const displayStatus = project.status || 'pending';

  return (
    <motion.div 
      className="glass-panel p-6 flex flex-col h-full rounded-3xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
        <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold text-white tracking-wide">{project.title}</h3>
        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold tracking-wider ${displayStatus === 'approved' ? 'bg-white/10 border border-white/20 text-gray-300' : displayStatus === 'pending' ? 'bg-white/5 border border-white/10 text-gray-400' : 'bg-black/40 border border-white/5 text-gray-500'}`}>
          {displayStatus.toUpperCase()}
        </span>
      </div>
      <p className="text-xs text-gray-500 mb-2 font-medium">SECTOR: <span className="text-gray-300 ml-1">{project.sector || 'Other'}</span></p>
      <p className="text-gray-400 mt-2 flex-grow text-sm leading-relaxed">{project.desc}</p>
      <div className="mt-6">
        <div className="flex justify-between items-center text-xs font-semibold text-gray-400 mb-2 tracking-wide uppercase">
          <span className="flex items-center"><Target size={14} className="mr-1"/> {project.goal} Tokens</span>
          <span className="flex items-center"><Users size={14} className="mr-1"/> {fundingRatio.toFixed(0)}% Funded</span>
        </div>
        <div className="w-full bg-white/5 border border-white/10 rounded-full h-2">
          <motion.div
            className="bg-gray-300 h-2 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, fundingRatio)}%` }}
            transition={{ duration: 1, delay: delay * 0.1 + 0.5 }}
          />
        </div>
        {isAdmin ? (
            displayStatus !== 'approved' && displayStatus !== 'rejected' ? (
              <div className="grid grid-cols-2 gap-3 mt-6">
                <motion.button 
                    type="button"
                    onClick={() => onApprove?.(project)}
                    className="py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <CheckCircle size={16} className="mr-1.5 inline-block"/> Approve
                </motion.button>
                <motion.button
                    type="button"
                    onClick={() => onReject?.(project)}
                    className="py-2.5 bg-white/5 border border-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-all text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <XCircle size={16} className="mr-1.5 inline-block"/> Reject
                </motion.button>
              </div>
            ) : (
              <div className="w-full mt-6 py-2.5 bg-white/5 border border-white/10 text-gray-500 font-semibold rounded-xl cursor-not-allowed text-center text-sm">
                  Project {displayStatus}
              </div>
            )
        ) : (
            <motion.button 
              className="w-full mt-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              type="button"
              onClick={() => onSupport?.(project)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={displayStatus === 'approved' || isFullyFunded}
            >
              {displayStatus === 'approved' ? 'Funded & Approved' : isFullyFunded ? 'Awaiting Administration' : 'View & Support'}
            </motion.button>
        )}
      </div>
    </motion.div>
  );
};
