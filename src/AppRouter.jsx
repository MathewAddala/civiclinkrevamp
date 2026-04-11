import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import BudgetPage from './pages/BudgetPage.jsx';
import IssuesPage from './pages/IssuesPage.jsx';
import ProjectKickstarterPage from './pages/ProjectKickstarterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import MapViewPage from './pages/MapViewPage.jsx'; // 🌟 FINAL, STABLE MAP IMPORT 🌟
import LandingPage from './pages/LandingPage.jsx';
import { useAuth } from './contexts/AuthContext.jsx';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  if (!user || user.role === 'guest') {
    return <Navigate to="/landing" replace />;
  }
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/kickstarter" element={<ProjectKickstarterPage />} />
      </Route>
      
    
      <Route path="/map-view" element={<ProtectedRoute adminOnly><MapViewPage /></ProtectedRoute>} /> 
      
      <Route path="/" element={<Navigate to="/landing" replace />} />
      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  );
}