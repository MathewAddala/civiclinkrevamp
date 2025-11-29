import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, DollarSign, Users, Award, Bell, CheckCircle, Coins } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Link } from 'react-router-dom'; // NEW IMPORT

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const CitizenDashboard = () => {
  const { user } = useAuth();

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <h1 className="text-4xl font-extrabold text-white glow-text mb-2 font-orbitron">
        Hello, <span className="text-blue-400">{user?.name || 'Citizen'}</span>!
      </h1>
      <p className="text-gray-400 text-lg">This is your CivicLink Overview.</p>

      {/* CORRECTED: New Budget Voting Call-to-Action Card */}
      <motion.div variants={cardVariants}>
        <Link to="/budget">
          <div className="holographic-card p-6 border-blue-500 hover:border-blue-400 transition-all cursor-pointer">
            <div className="flex items-center">
              <Coins size={48} className="text-blue-400 mr-6" />
              <div>
                <h2 className="text-2xl font-bold text-white font-orbitron">Shape Your City's Budget</h2>
                <p className="text-gray-300 mt-1">Your voice matters. Use the Budget Engine to propose how funds should be allocated for the next cycle.</p>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Citizen Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* ... (The rest of the stat cards remain the same) ... */}
        <motion.div variants={cardVariants} className="holographic-card p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Your Reported Issues</p>
            <h2 className="text-3xl font-bold text-white font-orbitron">7</h2>
          </div>
          <Lightbulb size={48} className="text-yellow-500 opacity-70" />
        </motion.div>
        <motion.div variants={cardVariants} className="holographic-card p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Projects Supported</p>
            <h2 className="text-3xl font-bold text-white font-orbitron">3</h2>
          </div>
          <Users size={48} className="text-green-500 opacity-70" />
        </motion.div>
        <motion.div variants={cardVariants} className="holographic-card p-6 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm">Civic Score</p>
            <h2 className="text-3xl font-bold text-purple-400 font-orbitron">850</h2>
          </div>
          <Award size={48} className="text-purple-500 opacity-70" />
        </motion.div>
      </div>

      {/* ... (The rest of the CitizenDashboard remains the same) ... */}
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={cardVariants} className="holographic-card p-6 lg:col-span-2">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Bell size={24} className="mr-2 text-yellow-400" /> Your Notifications
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start text-gray-300">
              <span className="text-green-500 mr-3 text-xl">&bull;</span>
              <div>
                <p><span className="font-semibold text-white">Issue Resolved:</span> "Broken Streetlight on Elm St" (ID: 1005).</p>
                <p className="text-gray-500 text-sm">5 minutes ago</p>
              </div>
            </li>
            <li className="flex items-start text-gray-300">
              <span className="text-blue-500 mr-3 text-xl">&bull;</span>
              <div>
                <p><span className="font-semibold text-white">Project Update:</span> "Community Garden" project reached 75% funding!</p>
                <p className="text-gray-500 text-sm">1 day ago</p>
              </div>
            </li>
          </ul>
        </motion.div>
        <motion.div variants={cardVariants} className="holographic-card p-6">
          <h3 className="text-2xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg flex items-center justify-center transition-colors glow-effect">
              <Lightbulb size={20} className="mr-2" /> Report an Issue
            </button>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-3 rounded-lg flex items-center justify-center transition-colors glow-effect">
              <Users size={20} className="mr-2" /> Explore Projects
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CitizenDashboard;