import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import BudgetPage from './pages/BudgetPage.jsx';
import IssuesPage from './pages/IssuesPage.jsx';
import ProjectKickstarterPage from './pages/ProjectKickstarterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import MapViewPage from './pages/MapViewPage.jsx'; // 🌟 FINAL, STABLE MAP IMPORT 🌟
import { useAuth } from './contexts/AuthContext.jsx';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  if (!user || user.role === 'guest') {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/budget" element={<BudgetPage />} />
        <Route path="/issues" element={<IssuesPage />} />
        <Route path="/kickstarter" element={<ProjectKickstarterPage />} />
      </Route>
      
      {/* 🌟 FINAL, SIMPLE REACT-LEAFLET ROUTE 🌟 */}
      <Route path="/map-view" element={<ProtectedRoute><MapViewPage /></ProtectedRoute>} /> 
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}