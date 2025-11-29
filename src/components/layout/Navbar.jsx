import React, { useState, useEffect } from 'react'; // NEW: Add useEffect
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sun, Bell, UserCircle2, ChevronDown, LogOut, Settings, LogIn } from 'lucide-react'; // NEW: Add LogIn icon
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom'; // NEW IMPORT

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate(); // NEW: For redirecting

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.user-dropdown-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false); // Close dropdown
  };

  const handleLoginRedirect = () => {
    navigate('/login');
    setIsDropdownOpen(false); // Close dropdown
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -20, scaleY: 0.8 },
    visible: { opacity: 1, y: 0, scaleY: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, scaleY: 0.8, transition: { duration: 0.15, ease: "easeIn" } },
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18, delay: 0.1 }}
      className="bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center z-10 relative shadow-xl"
    >
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search CivicLink data..."
          className="w-full md:w-96 pl-10 pr-4 py-2 rounded-full bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-700 transition-all duration-300"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <Search size={20} />
        </span>
      </div>
      
      {/* User Profile Section */}
      <div className="flex items-center space-x-4">
        <motion.button 
          whileHover={{ scale: 1.1, color: '#3B82F6' }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full text-gray-400 hover:bg-gray-800 transition-colors duration-200"
        >
          <Sun size={22} /> {/* Theme Toggle (Placeholder) */}
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1, color: '#3B82F6' }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full text-gray-400 hover:bg-gray-800 transition-colors duration-200"
        >
          <Bell size={22} /> {/* Notifications (Placeholder) */}
        </motion.button>
        
        {/* User Dropdown */}
        <motion.div
          className="relative user-dropdown-container" // Add a class for click outside detection
        >
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold cursor-pointer ring-2 ring-offset-2 ring-blue-500 ring-offset-gray-900 shadow-lg"
          >
            <UserCircle2 size={24} />
            <ChevronDown size={16} className={`ml-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
          </motion.div>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 mt-3 w-48 bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700 z-20 origin-top-right"
              >
                <div className="py-2">
                  <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                    Logged in as <br /><span className="font-semibold text-blue-300">{user?.name || 'Loading...'}</span>
                    <br /><span className="text-xs text-gray-500 capitalize">({user?.role || '...'})</span>
                  </div>
                  <motion.a 
                    href="#" 
                    className="flex items-center px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors duration-150"
                    whileHover={{ x: 5 }}
                  >
                    <Settings size={18} className="mr-2" /> Settings
                  </motion.a>
                  {user?.role !== 'guest' ? ( // Check if not a guest user
                    <motion.button 
                      onClick={handleLogout} // Call handleLogout
                      className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors duration-150"
                      whileHover={{ x: 5 }}
                    >
                      <LogOut size={18} className="mr-2" /> Logout
                    </motion.button>
                  ) : (
                    <motion.button 
                      onClick={handleLoginRedirect} // Redirect to login page
                      className="flex items-center w-full px-4 py-2 text-green-400 hover:bg-gray-700 transition-colors duration-150"
                      whileHover={{ x: 5 }}
                    >
                      <LogIn size={18} className="mr-2" /> Login
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.header>
  );
}