import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx'; // NEW IMPORT
import CitizenDashboard from './citizen/CitizenDashboard.jsx'; // NEW IMPORT

export default function DashboardPage() {
  const { user } = useAuth();

  // Conditionally render the appropriate dashboard based on user role
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  } else if (user?.role === 'citizen') {
    return <CitizenDashboard />;
  }
  
  // Fallback or loading state (though AuthProvider should handle initial guest status)
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-400 text-lg">Loading dashboard or invalid user role...</p>
    </div>
  );
}