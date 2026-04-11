import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Users, Award, Bell, Coins } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService.js';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const CitizenDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryResponse, activityResponse] = await Promise.all([
          dashboardService.summary(),
          dashboardService.activity(),
        ]);
        setSummary(summaryResponse);
        setActivity(Array.isArray(activityResponse) ? activityResponse.slice(0, 5) : []);
      } catch {
        setSummary(null);
        setActivity([]);
      }
    };
    load();
  }, []);

  return (
    <motion.div
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2 font-orbitron tracking-tight">
        Hello, <span className="text-white">{user?.name || 'Citizen'}</span>!
      </h1>
      <p className="text-gray-400 text-lg">This is your CivicLink Overview.</p>

      <motion.div variants={cardVariants}>
        <Link to="/budget">
          <div className="glass-panel p-6 rounded-3xl hover:border-white/20 transition-all cursor-pointer">
            <div className="flex items-center">
              <Coins size={48} className="text-white mr-6" />
              <div>
                <h2 className="text-2xl font-bold text-white font-orbitron">Shape Your City's Budget</h2>
                <p className="text-gray-300 mt-1">Submit a real budget proposal. Admin can review and approve it.</p>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div variants={cardVariants} className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">City Issues Reported</p>
            <h2 className="text-3xl font-bold text-white font-orbitron">{summary?.issuesReported ?? '-'}</h2>
          </div>
          <Lightbulb size={48} className="text-gray-400 opacity-70" />
        </motion.div>
        <motion.div variants={cardVariants} className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Projects Supported</p>
            <h2 className="text-3xl font-bold text-white font-orbitron">{summary?.projectsSupported ?? '-'}</h2>
          </div>
          <Users size={48} className="text-gray-400 opacity-70" />
        </motion.div>
        <motion.div variants={cardVariants} className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Civic Score</p>
            <h2 className="text-3xl font-bold text-white font-orbitron">{summary?.civicScore ?? '-'}</h2>
          </div>
          <Award size={48} className="text-gray-400 opacity-70" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={cardVariants} className="glass-panel p-6 rounded-3xl lg:col-span-2">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Bell size={24} className="mr-2 text-white" /> Latest Updates
          </h3>
          <ul className="space-y-4">
            {activity.length === 0 && <li className="text-gray-400">No updates yet.</li>}
            {activity.map((item, idx) => (
              <li key={`${item.message}-${idx}`} className="flex items-start text-gray-300">
                <span className="text-blue-500 mr-3 text-xl">&bull;</span>
                <div>
                  <p>{item.message}</p>
                  <p className="text-gray-500 text-sm">{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'recently'}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={cardVariants} className="glass-panel p-6 rounded-3xl">
          <h3 className="text-2xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => navigate('/issues')} className="w-full bg-white text-black font-semibold p-3.5 rounded-xl flex items-center justify-center transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-gray-200">
              <Lightbulb size={20} className="mr-2" /> Report an Issue
            </button>
            <button onClick={() => navigate('/kickstarter')} className="w-full bg-white/10 text-white font-semibold border border-white/10 p-3.5 rounded-xl flex items-center justify-center transition-colors hover:bg-white/20">
              <Users size={20} className="mr-2" /> Explore Projects
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CitizenDashboard;
