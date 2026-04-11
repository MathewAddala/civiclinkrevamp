import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import CitizenDashboard from './citizen/CitizenDashboard.jsx';

export default function DashboardPage() {
  const { user } = useAuth();


  if (user?.role === 'admin') {
    return <AdminDashboard />;
  } else if (user?.role === 'citizen') {
    return <CitizenDashboard />;
  }
  

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-400 text-lg">Loading dashboard or invalid user role...</p>
    </div>
  );
}