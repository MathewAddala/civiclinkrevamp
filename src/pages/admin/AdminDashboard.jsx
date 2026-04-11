import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Users, DollarSign, Lightbulb, MapPin, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import IssueResolutionChart from '../../components/charts/IssueResolutionChart.jsx';
import { dashboardService } from '../../services/dashboardService.js';
import { adminService } from '../../services/adminService.js';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [activity, setActivity] = useState([]);
  const [trends, setTrends] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryResponse, activityResponse, trendsResponse] = await Promise.all([
          dashboardService.summary(),
          dashboardService.activity(),
          dashboardService.issueTrends(),
        ]);
        setSummary(summaryResponse);
        setActivity(Array.isArray(activityResponse) ? activityResponse : []);
        setTrends(Array.isArray(trendsResponse) ? trendsResponse : []);
        const usersResponse = await adminService.listUsers();
        setUsers(Array.isArray(usersResponse) ? usersResponse : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      }
    };

    load();
  }, []);

  const promoteToAdmin = async (id) => {
    try {
      await adminService.promoteUser(id);
      const usersResponse = await adminService.listUsers();
      setUsers(Array.isArray(usersResponse) ? usersResponse : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to promote user');
    }
  };

  return (
    <motion.div
      className="p-6 lg:p-8 space-y-8"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight font-orbitron mb-6">
        <span className="text-white">Admin Command</span> Center
      </h1>

      {error && <p className="text-red-400">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div variants={cardVariants} className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Active Citizens</p>
            <h2 className="text-3xl font-bold text-white font-orbitron">{summary?.activeCitizens ?? '-'}</h2>
          </div>
          <Users size={48} className="text-gray-400 opacity-70" />
        </motion.div>
        <motion.div variants={cardVariants} className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Issues Reported</p>
            <h2 className="text-3xl font-bold text-white font-orbitron">{summary?.issuesReported ?? '-'}</h2>
          </div>
          <Lightbulb size={48} className="text-gray-400 opacity-70" />
        </motion.div>
        <motion.div variants={cardVariants} className="glass-panel p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Pending Budget Proposals</p>
            <h2 className="text-3xl font-bold text-white font-orbitron">{summary?.pendingBudgetProposals ?? '-'}</h2>
          </div>
          <DollarSign size={48} className="text-gray-400 opacity-70" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={cardVariants} className="glass-panel p-6 rounded-3xl lg:col-span-2 h-[450px] flex flex-col">
          <h3 className="text-2xl font-bold text-white mb-4 shrink-0">Recent Activity</h3>
          <ul className="space-y-4 overflow-y-auto flex-1 pr-2">
            {activity.length === 0 && <li className="text-gray-400">No activity found.</li>}
            {activity.map((item, index) => (
              <li key={`${item.message}-${index}`} className="flex items-start text-gray-300">
                <span className="text-blue-500 mr-3 text-xl">&bull;</span>
                <div>
                  <p>{item.message}</p>
                  <p className="text-gray-500 text-sm">{item.createdAt ? new Date(item.createdAt).toLocaleString() : 'recently'}</p>
                </div>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={cardVariants} className="glass-panel p-6 rounded-3xl h-[450px] flex flex-col">
          <h3 className="text-2xl font-bold text-white mb-4 shrink-0">Quick Actions</h3>
          <div className="space-y-4 flex-1">
            <button onClick={() => navigate('/budget')} className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold p-3.5 rounded-xl transition-colors border border-white/10">
              Review Budgets
            </button>
            <button onClick={() => navigate('/issues')} className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold p-3.5 rounded-xl transition-colors border border-white/10">
              Manage Issues
            </button>
            <button onClick={() => navigate('/kickstarter')} className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold p-3.5 rounded-xl transition-colors border border-white/10">
              View Projects
            </button>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={cardVariants} className="glass-panel p-6 rounded-3xl">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            <LineChart size={24} className="mr-2 text-green-400" /> Issue Resolution Trends
          </h3>
          <p className="text-gray-400">Monthly trend comparing reported issues versus resolved issues.</p>
          <div className="h-48 rounded-lg mt-4">
            <IssueResolutionChart data={trends} />
          </div>
        </motion.div>

        <motion.div variants={cardVariants}>
          <div className="glass-panel p-6 rounded-3xl flex flex-col justify-center items-center h-full cursor-pointer transition-all hover:border-white/20 hover:scale-[1.01]">
            <MapPin size={64} className="text-white mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-orbitron mb-2 text-center">View Live Issue Map</h3>
            <p className="text-gray-400 text-center mb-4">View full-screen map with issue locations.</p>
            <motion.button
              onClick={() => navigate('/map-view')}
              className="flex items-center px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go to Full Map <ArrowRight size={18} className="ml-2" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      <motion.div variants={cardVariants} className="glass-panel p-6 rounded-3xl">
        <h3 className="text-2xl font-bold text-white mb-4">Promote Citizen to Admin</h3>
        <div className="space-y-3 max-h-72 overflow-y-auto">
          {users.filter((u) => String(u.role).toLowerCase() !== 'admin').length === 0 && (
            <p className="text-gray-400">No citizen accounts available.</p>
          )}
          {users
            .filter((u) => String(u.role).toLowerCase() !== 'admin')
            .map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-700 bg-gray-900/60">
                <div>
                  <p className="text-white font-semibold">{u.name}</p>
                  <p className="text-xs text-gray-400">{u.email}</p>
                </div>
                <button
                  onClick={() => promoteToAdmin(u.id)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/10 text-sm font-semibold transition-all"
                >
                  Promote
                </button>
              </div>
            ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;
