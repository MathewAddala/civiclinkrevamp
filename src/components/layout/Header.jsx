import React from 'react';
import { Bell, Settings, UserCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx'; // Adjust path as needed

export default function Header() {
  const { user } = useAuth(); // Get user from context

  return (
    <header className="bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center">
        <h1 className="text-3xl font-orbitron text-white ml-2">
          Welcome, <span className="text-blue-400 glow-text">{user?.name || "Guest"}</span>!
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <button className="text-gray-400 hover:text-blue-500 transition-colors">
          <Bell size={24} />
        </button>
        <button className="text-gray-400 hover:text-blue-500 transition-colors">
          <Settings size={24} />
        </button>
        <div className="flex items-center text-gray-400">
          <UserCircle size={24} className="mr-2" />
          <span className="font-medium text-white text-sm">{user?.email || "guest@example.com"}</span>
        </div>
      </div>
    </header>
  );
}