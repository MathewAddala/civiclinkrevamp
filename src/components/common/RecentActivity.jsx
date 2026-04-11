import React from 'react';
import { motion } from 'framer-motion';
export default function RecentActivity({ activities = [] }) {
  return (
    <div className="holographic-card p-6 flex flex-col shadow-xl h-full">
      <h3 className="font-bold text-xl mb-6 text-gray-100 glow-text font-orbitron">Recent Civic Activity</h3>
      <ul className="space-y-4 flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-700 scrollbar-track-gray-800">
        {activities.length === 0 && (
          <li className="text-gray-400">No activity available.</li>
        )}
        {activities.map((activity, index) => (
          <motion.li 
            key={index}
            className="flex items-start bg-gray-800/60 p-3 rounded-lg border border-gray-700 hover:border-blue-600 transition-all duration-200"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.02, x: 5 }}
          >
            <div className="flex-shrink-0 mt-1 text-blue-400">&bull;</div>
            <div className="ml-4 flex-1">
              <p className="text-sm text-gray-300 leading-tight">{activity.message || activity.text}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.createdAt ? new Date(activity.createdAt).toLocaleString() : activity.time || 'recently'}</p>
            </div>
          </motion.li>
        ))}
      </ul>
      <motion.button 
        className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 glow-effect"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        View All Activity
      </motion.button>
    </div>
  );
}