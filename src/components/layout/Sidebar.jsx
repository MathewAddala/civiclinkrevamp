import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Coins, Wrench, PackagePlus, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Budget Engine', path: '/budget', icon: <Coins size={20} /> }, // Corrected: No adminOnly flag
    { name: 'Issue Hub', path: '/issues', icon: <Wrench size={20} /> },
    { name: 'Project Kickstarter', path: '/kickstarter', icon: <PackagePlus size={20} /> },
  ];

  const NavItem = ({ item }) => {
    // ... (NavItem component remains the same)
    const activeClass = "bg-blue-600 text-white shadow-lg glow-effect";
    return (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center px-4 py-3 rounded-lg transition-all duration-300 
           ${isActive 
              ? activeClass 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`
        }
      >
        <span className="mr-4">{item.icon}</span>
        <span className="font-medium">{item.name}</span>
      </NavLink>
    );
  };

  return (
    <motion.div
      initial={{ x: -250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="w-64 bg-gray-900 border-r border-gray-800 flex-shrink-0 p-4 flex flex-col shadow-xl"
    >
      <div className="flex items-center mb-10 px-2">
        <span className="text-3xl font-extrabold text-blue-500 glow-text tracking-wide font-orbitron">CivicLink</span>
      </div>
      <nav className="flex flex-col space-y-3 flex-grow">
        {navItems.map((item) => (
          (item.adminOnly && !isAdmin) ? null : <NavItem key={item.name} item={item} />
        ))}
      </nav>

      {/* CORRECTED: User info and Logout button are added back here for visibility */}
      <div className="mt-auto pt-6 border-t border-gray-800">
        {user && user.role !== 'guest' && (
          <div className="flex items-center p-3 mb-4 rounded-lg bg-gray-800/50">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-white font-semibold">{user.name}</p>
              <p className="text-gray-400 text-sm capitalize">{user.role}</p>
            </div>
          </div>
        )}
        <motion.button
          onClick={logout}
          className="w-full flex items-center p-3 rounded-lg text-red-400 hover:bg-red-900/50 hover:text-white transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut size={20} className="mr-3" />
          <span className="font-medium">Logout</span>
        </motion.button>
      </div>
    </motion.div>
  );
}