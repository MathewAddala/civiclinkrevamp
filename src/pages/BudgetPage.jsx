// src/pages/BudgetPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.jsx';
import Sandbox from '../simulation/components/Sandbox.jsx'; // NEW IMPORT

export default function BudgetPage() {
  const { isAdmin } = useAuth();

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ staggerChildren: 0.1 }}
    >
      <motion.div>
        <h1 className="text-4xl font-extrabold text-white glow-text font-orbitron">Civic Budget Engine</h1>
        <p className="text-gray-400 mt-2">
          {isAdmin 
            ? "Review and approve citizen-proposed budget allocations." 
            : "Allocate the city's resources. Shape its future by proposing your ideal budget."}
        </p>
      </motion.div>
      
      <Sandbox /> {/* Render the Sandbox component */}
    </motion.div>
  );
}