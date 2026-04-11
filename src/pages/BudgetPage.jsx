import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.jsx';
import Sandbox from '../simulation/components/Sandbox.jsx'; // NEW IMPORT
import { adminService } from '../services/adminService.js';

export default function BudgetPage() {
  const { isAdmin, refreshProfile } = useAuth();
  const [eventStatus, setEventStatus] = useState(null);
  const [isWorking, setIsWorking] = useState(false);
  const [message, setMessage] = useState('');
  const [startForm, setStartForm] = useState({
    budgetTokensPerCitizen: 500,
    projectTokensPerCitizen: 1000,
  });

  const loadStatus = async () => {
    try {
      const status = await adminService.votingEventStatus();
      setEventStatus(status);
    } catch (err) {
      setEventStatus(null);
      setMessage(err instanceof Error ? err.message : 'Failed to load event status.');
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const startEvent = async () => {
    setIsWorking(true);
    setMessage('');
    try {
      await adminService.startVotingEvent({
        budgetTokensPerCitizen: Number(startForm.budgetTokensPerCitizen),
        projectTokensPerCitizen: Number(startForm.projectTokensPerCitizen),
      });
      setMessage('Voting event started and tokens granted to citizens.');
      await refreshProfile?.();
      await loadStatus();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to start event.');
    } finally {
      setIsWorking(false);
    }
  };

  const stopEvent = async () => {
    setIsWorking(true);
    setMessage('');
    try {
      await adminService.stopVotingEvent();
      setMessage('Voting event stopped.');
      await refreshProfile?.();
      await loadStatus();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Failed to stop event.');
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ staggerChildren: 0.1 }}
    >
      <motion.div>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-orbitron tracking-tight">Civic Budget Engine</h1>
        <p className="text-gray-400 mt-2">
          {isAdmin 
            ? "Review interest averages and approve final allocations." 
            : "Allocate resources and shape the future by proposing your ideal budget."}
        </p>
        <p className="text-gray-500 text-sm mt-3 max-w-3xl">
          {isAdmin
            ? "Review community preferences and finalize the budget with manual overrides if necessary."
            : "Use your allocated tokens to influence the resource distribution. The collective vote forms the basis for final approval."}
        </p>
      </motion.div>

      {isAdmin && (
        <div className="glass-panel rounded-2xl border border-white/5 p-4 mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white tracking-wide">Event Control</h2>
            <div className="px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-xs font-semibold text-gray-400 flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${eventStatus?.active ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-gray-600'}`}></span>
              {eventStatus?.active ? 'Active' : 'Inactive'}
            </div>
            {message && <p className="text-xs text-gray-300">{message}</p>}
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
             <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="w-24 p-2 rounded-lg bg-black/40 text-white font-mono border border-white/10 text-sm outline-none"
                  value={startForm.budgetTokensPerCitizen}
                  onChange={(e) => setStartForm((prev) => ({ ...prev, budgetTokensPerCitizen: e.target.value }))}
                  disabled={isWorking}
                  placeholder="Budget"
                />
                <input
                  type="number"
                  className="w-24 p-2 rounded-lg bg-black/40 text-white font-mono border border-white/10 text-sm outline-none"
                  value={startForm.projectTokensPerCitizen}
                  onChange={(e) => setStartForm((prev) => ({ ...prev, projectTokensPerCitizen: e.target.value }))}
                  disabled={isWorking}
                  placeholder="Project"
                />
             </div>
             
             <div className="h-6 w-[1px] bg-white/10 mx-1"></div>

             <button
               type="button"
               onClick={startEvent}
               disabled={isWorking || eventStatus?.active}
               className="px-4 py-2 bg-white text-black font-semibold text-sm rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
             >
               Start Event
             </button>
             <button
               type="button"
               onClick={stopEvent}
               disabled={isWorking || !eventStatus?.active}
               className="px-4 py-2 bg-white/5 text-gray-300 font-semibold text-sm rounded-lg border border-white/10 hover:bg-white/10 transition-colors disabled:opacity-50"
             >
               Stop Event
             </button>
             <button
               type="button"
               onClick={loadStatus}
               className="px-3 py-2 bg-transparent text-gray-500 hover:text-white transition-colors"
               disabled={isWorking}
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/></svg>
             </button>
          </div>
        </div>
      )}
      
      <Sandbox /> {/* Render the Sandbox component */}
    </motion.div>
  );
}
