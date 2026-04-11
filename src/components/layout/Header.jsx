import React from 'react';
import { Bell, Settings, UserCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx'; // Adjust path as needed

export default function Header() {
  const { user } = useAuth(); // Get user from context

  return (
    <header className="bg-transparent backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">
        <h1 className="text-2xl font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 ml-2 font-bold tracking-tight">
          Welcome, {user?.name || "Guest"}!
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        {user?.role && user.role === 'citizen' && (
          <div className="hidden md:flex items-center gap-3 text-xs text-gray-300">
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-inner">
              Budget Tokens: <span className="text-blue-300 font-semibold ml-1">{user?.budgetTokens ?? 0}</span>
            </span>
            <span className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-inner">
              Project Tokens: <span className="text-emerald-300 font-semibold ml-1">{user?.projectTokens ?? 0}</span>
            </span>
          </div>
        )}
        <button className="text-gray-400 hover:text-blue-500 transition-colors">
          <Bell size={24} />
        </button>
        <button className="text-gray-400 hover:text-blue-500 transition-colors">
          <Settings size={24} />
        </button>
        <div className="flex items-center text-gray-400">
          <UserCircle size={24} className="mr-2" />
          <span className="font-semibold text-white tracking-wide text-lg">{user?.email || "guest@example.com"}</span>
        </div>
      </div>
    </header>
  );
}