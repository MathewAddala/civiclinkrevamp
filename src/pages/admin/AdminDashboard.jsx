// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Users, DollarSign, Lightbulb, MapPin, TrendingUp, BarChart2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // 🌟 IMPORT useNavigate 🌟
import IssueResolutionChart from '../../components/charts/IssueResolutionChart.jsx';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AdminDashboard = () => {
  const navigate = useNavigate(); // 🌟 Initialize useNavigate 🌟

  return (
    <motion.div 
      className="p-6 lg:p-8 space-y-8"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <h1 className="text-4xl font-extrabold text-white glow-text mb-6">
        <span className="text-indigo-400">Admin Command</span> Center
      </h1>

      {/* Overview Grid (Unchanged) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div variants={cardVariants} className="holographic-card p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Active Citizens</p>
            <h2 className="text-3xl font-bold text-white font-orbitron">2,450</h2>
          </div>
          <Users size={48} className="text-blue-500 opacity-70" />
        </motion.div>
        <motion.div variants={cardVariants} className="holographic-card p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Issues Reported</p>
            <h2 className="text-3xl font-bold text-white font-orbitron">328</h2>
          </div>
          <Lightbulb size={48} className="text-yellow-500 opacity-70" />
        </motion.div>
        <motion.div variants={cardVariants} className="holographic-card p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Budget Utilized</p>
            <h2 className="text-3xl font-bold text-green-400 font-orbitron">$1.2M</h2>
          </div>
          <DollarSign size={48} className="text-green-500 opacity-70" />
        </motion.div>
      </div>

      {/* Main Content Area (Unchanged) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity/Alerts (Unchanged) */}
        <motion.div variants={cardVariants} className="holographic-card p-6 lg:col-span-2">
          <h3 className="text-2xl font-bold text-white mb-4">Recent Activity & Alerts</h3>
          <ul className="space-y-4">
            <li className="flex items-start text-gray-300">
              <span className="text-green-500 mr-3 text-xl">&bull;</span>
              <div>
                <p><span className="font-semibold text-white">System Alert:</span> New budget proposal submitted for review. <span className="text-blue-400">#INFRA-2024-005</span></p>
                <p className="text-gray-500 text-sm">2 minutes ago</p>
              </div>
            </li>
            <li className="flex items-start text-gray-300">
              <span className="text-yellow-500 mr-3 text-xl">&bull;</span>
              <div>
                <p><span className="font-semibold text-white">Issue Update:</span> "Pothole on Main St" (ID: 1024) escalated to high priority.</p>
                <p className="text-gray-500 text-sm">1 hour ago</p>
              </div>
            </li>
            <li className="flex items-start text-gray-300">
              <span className="text-blue-500 mr-3 text-xl">&bull;</span>
              <div>
                <p><span className="font-semibold text-white">New Citizen:</span> <span className="text-blue-400">Mathew Addala</span> joined CivicLink.</p>
                <p className="text-gray-500 text-sm">3 hours ago</p>
              </div>
            </li>
          </ul>
        </motion.div>

        {/* Quick Actions (Unchanged) */}
        <motion.div variants={cardVariants} className="holographic-card p-6">
          <h3 className="text-2xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg flex items-center justify-center transition-colors glow-effect">
              <DollarSign size={20} className="mr-2" /> Review Budgets
            </button>
            <button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold p-3 rounded-lg flex items-center justify-center transition-colors glow-effect">
              <Lightbulb size={20} className="mr-2" /> Manage Issues
            </button>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-3 rounded-lg flex items-center justify-center transition-colors glow-effect">
              <Users size={20} className="mr-2" /> View Citizen Directory
            </button>
          </div>
        </motion.div>
      </div>

      {/* Analytics & Metrics (Updated) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={cardVariants} className="holographic-card p-6">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            <LineChart size={24} className="mr-2 text-green-400" /> Issue Resolution Trends
          </h3>
          <p className="text-gray-400">Monthly trend comparing reported issues versus resolved issues.</p>
          
          {/* Issue Resolution Chart Component */}
          <div className="h-48 rounded-lg mt-4">
            <IssueResolutionChart />
          </div>
        </motion.div>
        
        {/* 🌟 MAP CARD LINKING TO FINAL, SIMPLE ROUTE 🌟 */}
        <motion.div variants={cardVariants}>
          <div 
            className="holographic-card p-6 flex flex-col justify-center items-center h-full cursor-pointer transition-all hover:border-blue-500 hover:scale-[1.01]"
          >
              <MapPin size={64} className="text-blue-400 mb-4 glow-text"/>
              <h3 className="text-2xl font-bold text-white font-orbitron mb-2 text-center">
                  View Live Issue Map
              </h3>
              <p className="text-gray-400 text-center mb-4">
                  View full-screen map with issue locations.
              </p>
              <motion.button 
                  // Button click triggers the navigation 
                  onClick={() => navigate('/map-view')} 
                  className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
              >
                  Go to Full Map <ArrowRight size={18} className="ml-2"/>
              </motion.button>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
};

export default AdminDashboard;