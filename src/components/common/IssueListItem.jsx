// src/components/common/IssueListItem.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, Wrench, CheckCircle2, UsersRound } from 'lucide-react';

export default function IssueListItem({ issue, delay, isAdmin, onManage, onView }) {
  const statusStyles = {
    open: { icon: <AlertTriangle size={16} />, color: 'text-amber-400', bg: 'bg-amber-500/10 border border-amber-500/20' },
    'in-progress': { icon: <Wrench size={16} />, color: 'text-blue-400', bg: 'bg-blue-500/10 border border-blue-500/20' },
    escalated: { icon: <AlertTriangle size={16} />, color: 'text-red-400', bg: 'bg-red-500/10 border border-red-500/20' },
    resolved: { icon: <CheckCircle2 size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border border-emerald-500/20' },
  };

  const currentStatusStyle = statusStyles[issue.status] || statusStyles.open; // Fallback

  return (
    <motion.div 
      className="flex items-center justify-between p-5 glass-panel rounded-xl cursor-pointer mb-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex-1" onClick={() => onView?.(issue)}>
        <p className="font-semibold text-white">{issue.id}: {issue.title}</p>
        <p className="text-sm text-gray-400 flex items-center mt-1"><MapPin size={14} className="mr-2" /> {issue.location} - {issue.time}</p>
        <div className="text-xs text-gray-500 flex items-center mt-1 space-x-4">
            <span className="flex items-center">
              <UsersRound size={12} className="mr-1" /> Reporter: <span className="text-gray-300 ml-1">{issue.reporter}</span>
            </span>
            {isAdmin && (
              <span className="flex items-center">
                <UsersRound size={12} className="mr-1" /> Assigned: <span className="text-blue-300 ml-1">{issue.assignedTo}</span>
              </span>
            )}
        </div>
      </div>
      {isAdmin ? (
        <select 
          className={`flex items-center px-3 py-1 rounded-full text-xs font-bold appearance-none cursor-pointer border-none outline-none ${currentStatusStyle.color} ${currentStatusStyle.bg}`}
          value={issue.status}
          onChange={(e) => onManage?.({ ...issue, status: e.target.value }, true)}
        >
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="escalated">Escalated</option>
          <option value="resolved">Resolved</option>
        </select>
      ) : (
        <div className={`flex items-center px-3 py-1 rounded-full text-xs font-bold ${currentStatusStyle.color} ${currentStatusStyle.bg}`}>
          {currentStatusStyle.icon}
          <span className="ml-2 capitalize">{issue.status.replace('-', ' ')}</span>
        </div>
      )}
      {isAdmin && (
        <motion.button 
            type="button"
            onClick={() => onManage?.(issue, false)}
            className="ml-4 px-4 py-1.5 bg-white/10 text-white font-semibold border border-white/20 text-xs rounded-lg hover:bg-white/20 transition-colors shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            Manage
        </motion.button>
      )}
    </motion.div>
  );
};
