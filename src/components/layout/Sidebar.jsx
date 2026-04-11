import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Coins, Wrench, PackagePlus, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Budget Engine', path: '/budget', icon: <Coins size={20} /> },
    { name: 'Issue Hub', path: '/issues', icon: <Wrench size={20} /> },
    { name: 'Project Kickstarter', path: '/kickstarter', icon: <PackagePlus size={20} /> },
  ];

  const NavItem = ({ item }) => {

    const activeClass = "bg-white/10 border border-white/5 shadow-lg text-white";
    return (
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `flex items-center px-4 py-3 rounded-lg transition-all duration-300 
           ${isActive 
              ? activeClass 
              : 'text-gray-400 hover:bg-white/5 hover:text-white'}`
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
      className="w-64 bg-[#0a0a0a]/50 backdrop-blur-xl border-r border-white/5 flex-shrink-0 p-4 flex flex-col shadow-2xl relative z-20"
    >
      <div className="flex items-center mb-10 px-2">
        <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-400 tracking-wide font-orbitron">CivicLink</span>
      </div>
      <nav className="flex flex-col space-y-3 flex-grow">
        {navItems.map((item) => (
          (item.adminOnly && !isAdmin) ? null : <NavItem key={item.name} item={item} />
        ))}
      </nav>


      <div className="mt-auto pt-6 border-t border-gray-800">
        {user && user.role !== 'guest' && (
          <div className="flex items-center p-3 mb-4 rounded-xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 bg-gradient-to-tr from-gray-200 to-gray-400 rounded-full flex items-center justify-center text-black font-extrabold text-lg mr-3 shadow-[0_0_15px_rgba(255,255,255,0.15)] border border-white/40">
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
          className="w-full flex items-center p-3 rounded-xl text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-colors duration-200 border border-transparent hover:border-red-500/20"
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