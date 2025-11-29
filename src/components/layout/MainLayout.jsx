import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx'; // Assuming Sidebar exists
import Header from './Header.jsx'; // Assuming Header exists

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <Outlet /> {/* Renders the child route component */}
        </main>
      </div>
    </div>
  );
}