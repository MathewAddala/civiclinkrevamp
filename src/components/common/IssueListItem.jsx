// src/components/common/IssueListItem.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, AlertTriangle, Wrench, CheckCircle2, UsersRound } from 'lucide-react';

export default function IssueListItem({ issue, delay, isAdmin }) {
  const statusStyles = {
    open: { icon: <AlertTriangle size={16} />, color: 'text-yellow-400', bg: 'bg-yellow-900/50' },
    'in-progress': { icon: <Wrench size={16} />, color: 'text-blue-400', bg: 'bg-blue-900/50' },
    escalated: { icon: <AlertTriangle size={16} />, color: 'text-red-400', bg: 'bg-red-900/50' },
    resolved: { icon: <CheckCircle2 size={16} />, color: 'text-green-400', bg: 'bg-green-900/50' },
  };

  const currentStatusStyle = statusStyles[issue.status] || statusStyles.open; // Fallback

  return (
    <motion.div 
      className="flex items-center justify-between p-4 bg-gray-800/60 border border-gray-700 rounded-lg hover:border-blue-600 transition-all cursor-pointer"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex-1">
        <p className="font-semibold text-white">{issue.id}: {issue.title}</p>
        <p className="text-sm text-gray-400 flex items-center mt-1"><MapPin size={14} className="mr-2" /> {issue.location} - {issue.time}</p>
        {isAdmin && (
            <p className="text-xs text-gray-500 flex items-center mt-1">
                <UsersRound size={12} className="mr-1" /> Assigned: <span className="text-blue-300 ml-1">{issue.assignedTo}</span>
            </p>
        )}
      </div>
      <div className={`flex items-center px-3 py-1 rounded-full text-xs font-bold ${currentStatusStyle.color} ${currentStatusStyle.bg}`}>
        {currentStatusStyle.icon}
        <span className="ml-2 capitalize">{issue.status.replace('-', ' ')}</span>
      </div>
      {isAdmin && (
        <motion.button 
            className="ml-4 px-3 py-1 bg-purple-600 text-white text-xs rounded-md hover:bg-purple-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            Manage
        </motion.button>
      )}
    </motion.div>
  );
};