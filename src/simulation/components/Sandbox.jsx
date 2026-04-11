import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, HeartPulse, Bus, Trash2, GraduationCap, Gavel } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { budgetService } from '../../services/budgetService.js';
import { adminService } from '../../services/adminService.js';

const SectorTokenSlider = ({ icon, name, color, value, onChange, max, isDisabled, unit = 'tokens' }) => (
  <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel rounded-2xl p-5 glow-effect" whileHover={{ scale: 1.02 }}>
    <div className="flex justify-between items-center mb-2">
      <div className={`flex items-center text-lg font-semibold text-white`}>
        <span className="text-gray-300">{icon}</span>
        <span className="ml-3 font-orbitron">{name}</span>
      </div>
      <span className={`font-bold text-xl text-white font-orbitron`}>{value} <span className="text-sm text-gray-500 font-inter">{unit}</span></span>
    </div>
    <input
      type="range"
      min="0"
      max={max}
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value, 10))}
      disabled={isDisabled}
      className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${isDisabled ? 'opacity-50 bg-gray-800' : 'bg-white/20'}`}
      style={!isDisabled ? { accentColor: "white" } : {}}
    />
  </motion.div>
);

export default function Sandbox() {
  const { isAdmin, user, refreshProfile } = useAuth();
  const [allocations, setAllocations] = useState({ transport: 0, healthcare: 0, environment: 0, sanitation: 0, education: 0 });
  const [proposals, setProposals] = useState([]);
  const [approvedBudget, setApprovedBudget] = useState(null);
  const [averageAllocation, setAverageAllocation] = useState({ transport: 0, healthcare: 0, environment: 0, sanitation: 0, education: 0 });
  const [overrideAllocation, setOverrideAllocation] = useState({ transport: 0, healthcare: 0, environment: 0, sanitation: 0, education: 0 });
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [eventActive, setEventActive] = useState(null);

  const totalAllocated = useMemo(() => Object.values(allocations).reduce((sum, val) => sum + val, 0), [allocations]);
  const totalOverride = useMemo(() => Object.values(overrideAllocation).reduce((sum, val) => sum + val, 0), [overrideAllocation]);

  const loadBudgetData = async () => {
    try {
      const [current, recent] = await Promise.all([budgetService.current(), budgetService.proposals()]);
      const rows = Array.isArray(recent) ? recent : [];
      const pending = rows.filter((row) => String(row?.status || '').toLowerCase() === 'pending');
      const tokenTotals = pending.reduce(
        (acc, row) => ({
          transport: acc.transport + (Number(row?.transportTokens) || 0),
          healthcare: acc.healthcare + (Number(row?.healthcareTokens) || 0),
          environment: acc.environment + (Number(row?.environmentTokens) || 0),
          sanitation: acc.sanitation + (Number(row?.sanitationTokens) || 0),
          education: acc.education + (Number(row?.educationTokens) || 0),
        }),
        { transport: 0, healthcare: 0, environment: 0, sanitation: 0, education: 0 }
      );
      const totalPendingTokens = Object.values(tokenTotals).reduce((sum, val) => sum + val, 0);
      const computedAverage = totalPendingTokens > 0
        ? {
            transport: Math.round((tokenTotals.transport * 100) / totalPendingTokens),
            healthcare: Math.round((tokenTotals.healthcare * 100) / totalPendingTokens),
            environment: Math.round((tokenTotals.environment * 100) / totalPendingTokens),
            sanitation: Math.round((tokenTotals.sanitation * 100) / totalPendingTokens),
            education: 0,
          }
        : { transport: 0, healthcare: 0, environment: 0, sanitation: 0, education: 0 };
      
      if (totalPendingTokens > 0) {
        computedAverage.education = Math.max(0, 100 - (computedAverage.transport + computedAverage.healthcare + computedAverage.environment + computedAverage.sanitation));
      }

      setProposals(rows);
      setApprovedBudget(current || null);
      setAverageAllocation(computedAverage);
      setOverrideAllocation(computedAverage);
      if (isAdmin) {
        setAllocations(computedAverage);
      }
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load budget data.');
    }
  };

  useEffect(() => {
    loadBudgetData();
  }, []);

  useEffect(() => {
    const loadEventStatus = async () => {
      try {
        const status = await adminService.votingEventStatus();
        setEventActive(Boolean(status?.active));
      } catch {
        setEventActive(null);
      }
    };
    loadEventStatus();
  }, []);

  const handleAllocationChange = (sector, value) => {
    const newAllocations = { ...allocations, [sector]: value };
    const newTotal = Object.values(newAllocations).reduce((sum, val) => sum + val, 0);
    if (isAdmin) {
      if (newTotal <= 100) setAllocations(newAllocations);
      return;
    }
    const budgetBalance = user?.budgetTokens ?? 0;
    if (newTotal <= budgetBalance) setAllocations(newAllocations);
  };

  const handleOverrideChange = (sector, value) => {
    const parsed = Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;
    setOverrideAllocation((prev) => ({ ...prev, [sector]: parsed }));
  };



  const submitProposal = async () => {
    try {
      await budgetService.submitProposal({
        transportTokens: allocations.transport,
        healthcareTokens: allocations.healthcare,
        environmentTokens: allocations.environment,
        sanitationTokens: allocations.sanitation,
        educationTokens: allocations.education,
      });
      setActionMessage('Proposal submitted successfully.');
      await refreshProfile?.();
      setAllocations({ transport: 0, healthcare: 0, environment: 0, sanitation: 0, education: 0 });
      await loadBudgetData();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : 'Failed to submit proposal.');
    }
  };

  const approveByAverage = async () => {
    try {
      await budgetService.approveAverage();
      setActionMessage('Citizen-interest average approved and published to citizens.');
      await refreshProfile?.();
      await loadBudgetData();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : 'Failed to approve by average.');
    }
  };

  const overrideCurrent = async () => {
    if (Math.round(totalOverride) !== 100) {
      setActionMessage('Override requires total allocation to be exactly 100%.');
      return;
    }
    try {
      await budgetService.overrideCurrent({
        transportTokens: Math.round(overrideAllocation.transport),
        healthcareTokens: Math.round(overrideAllocation.healthcare),
        environmentTokens: Math.round(overrideAllocation.environment),
        sanitationTokens: Math.round(overrideAllocation.sanitation),
        educationTokens: Math.round(overrideAllocation.education),
      });
      setActionMessage('Budget approved with admin override. Citizens can now see the approved percentages.');
      await refreshProfile?.();
      await loadBudgetData();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : 'Failed to override budget.');
    }
  };

  const citizenBudgetTokens = user?.budgetTokens ?? 0;
  const remaining = Math.max(0, citizenBudgetTokens - totalAllocated);
  const canCitizenSubmit =
    eventActive === true && totalAllocated >= 1 && citizenBudgetTokens > 0 && remaining === 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {!isAdmin && (
        <motion.div layout className="lg:col-span-2 space-y-6 h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
          {error && <p className="text-red-400">{error}</p>}
          <SectorTokenSlider icon={<Bus />} name="Transportation" value={allocations.transport} onChange={(v) => handleAllocationChange('transport', v)} max={remaining + allocations.transport} isDisabled={false} unit="tokens" />
          <SectorTokenSlider icon={<HeartPulse />} name="Healthcare" value={allocations.healthcare} onChange={(v) => handleAllocationChange('healthcare', v)} max={remaining + allocations.healthcare} isDisabled={false} unit="tokens" />
          <SectorTokenSlider icon={<Leaf />} name="Environment" value={allocations.environment} onChange={(v) => handleAllocationChange('environment', v)} max={remaining + allocations.environment} isDisabled={false} unit="tokens" />
          <SectorTokenSlider icon={<Trash2 />} name="Sanitation" value={allocations.sanitation} onChange={(v) => handleAllocationChange('sanitation', v)} max={remaining + allocations.sanitation} isDisabled={false} unit="tokens" />
          <SectorTokenSlider icon={<GraduationCap />} name="Education" value={allocations.education} onChange={(v) => handleAllocationChange('education', v)} max={remaining + allocations.education} isDisabled={false} unit="tokens" />
        </motion.div>
      )}

      <motion.div layout className={`${isAdmin ? 'col-span-full max-w-4xl mx-auto w-full' : 'lg:col-span-1 lg:h-[70vh] overflow-y-auto scrollbar-hide'} glass-panel rounded-3xl p-6 flex flex-col h-auto`} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 100, damping: 20 }}>
        <div className="flex flex-col mb-6 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 mb-1 font-orbitron">Budget Actions</h2>
            <p className="text-gray-400 text-xs">
              {isAdmin ? "Administer the final civic allocations." : `Plan your allocations. Remaining: ${remaining}.`}
            </p>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-white">
              {isAdmin ? `${totalAllocated}%` : `${totalAllocated}`}
            </p>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-1">
              {isAdmin ? "Total Allocation" : "Tokens Spent"}
            </p>
          </div>
        </div>

        {/* Unified Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden border border-white/10">
            <motion.div
              className={`h-full max-w-full ${totalAllocated > 100 && isAdmin ? 'bg-red-500' : 'bg-gradient-to-r from-gray-300 to-gray-100'}`}
              animate={{
                width: `${isAdmin ? Math.min(100, Math.max(0, totalAllocated)) : citizenBudgetTokens ? Math.min(100, (totalAllocated / citizenBudgetTokens) * 100) : 0}%`,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>


        {actionMessage && (
          <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-center text-sm font-medium">
            {actionMessage}
          </div>
        )}
        {approvedBudget && String(approvedBudget.status || '').toLowerCase() === 'approved' && (
          <div className="w-full p-3 rounded-lg bg-emerald-900/30 border border-emerald-700 text-xs text-emerald-200">
            Approved city budget: Transport {approvedBudget.transport}% | Healthcare {approvedBudget.healthcare}% | Environment {approvedBudget.environment}% | Sanitation {approvedBudget.sanitation}% | Education {approvedBudget.education}%
          </div>
        )}

        {!isAdmin ? (
          <div className="max-w-xl mx-auto w-full">
            {eventActive === false && (
              <p className="text-sm p-4 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-center mb-4">
                Voting is not active. Wait for the next event to start.
              </p>
            )}
            {eventActive === true && citizenBudgetTokens > 0 && remaining > 0 && (
              <p className="text-sm text-gray-400 text-center mb-4">
                You must spend all {citizenBudgetTokens} tokens.
              </p>
            )}
            <motion.button
              className="w-full py-4 bg-white text-black font-semibold rounded-2xl hover:bg-gray-200 transition-all disabled:bg-gray-800 disabled:text-gray-600 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              disabled={!canCitizenSubmit}
              onClick={submitProposal}
              whileHover={{ scale: canCitizenSubmit ? 1.02 : 1 }}
              whileTap={{ scale: canCitizenSubmit ? 0.98 : 1 }}
            >
              {citizenBudgetTokens < 1
                ? 'No Budget Tokens'
                : totalAllocated < 1
                  ? 'Allocate Tokens'
                  : remaining > 0
                    ? `Allocate ${remaining} More`
                    : `Submit Vote`}
            </motion.button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-2' : ''} gap-6`}>
              {/* Average Panel */}
              <div className="p-5 rounded-3xl glass-panel space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-white">Community Average</h3>
                  <span className="px-3 py-1 bg-white/10 text-gray-300 text-xs rounded-full border border-white/20">
                    {proposals.filter((p) => p.status === 'pending').length} pending
                  </span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Transport', val: averageAllocation.transport, color: 'text-gray-300' },
                    { label: 'Healthcare', val: averageAllocation.healthcare, color: 'text-gray-300' },
                    { label: 'Environment', val: averageAllocation.environment, color: 'text-gray-300' },
                    { label: 'Sanitation', val: averageAllocation.sanitation, color: 'text-gray-400' },
                    { label: 'Education', val: averageAllocation.education, color: 'text-gray-400' },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between items-center text-sm">
                      <span className="text-gray-400">{item.label}</span>
                      <span className={`font-mono font-medium ${item.color}`}>{item.val}%</span>
                    </div>
                  ))}
                </div>
                <motion.button 
                  className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors border border-white/10 disabled:opacity-50" 
                  disabled={proposals.filter((p) => p.status === 'pending').length === 0 || eventActive === false}
                  onClick={approveByAverage} 
                  whileTap={{ scale: 0.98 }}
                >
                  <Gavel size={16} className="inline-block mr-2" /> Approve Average
                </motion.button>
              </div>

              {/* Override Panel */}
              <div className="p-5 rounded-3xl glass-panel space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-white">Manual Override</h3>
                  <span className={`text-xs ${Math.round(totalOverride) === 100 ? 'text-green-400' : 'text-yellow-400'}`}>
                    Total: {Math.round(totalOverride)}%
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['transport', 'healthcare', 'environment', 'sanitation', 'education'].map((sec) => (
                    <div key={sec} className={sec === 'education' ? 'col-span-2' : ''}>
                      <p className="text-xs text-gray-500 mb-1 capitalize">{sec}</p>
                      <input 
                        type="number" min="0" 
                        value={overrideAllocation[sec]} 
                        onChange={(e) => handleOverrideChange(sec, e.target.value)} 
                        className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-purple-500 transition-colors" 
                      />
                    </div>
                  ))}
                </div>
                <motion.button 
                  className="w-full mt-4 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all border border-white/10 disabled:opacity-50 disabled:grayscale" 
                  disabled={eventActive === false}
                  onClick={overrideCurrent} 
                  whileTap={{ scale: 0.98 }}
                >
                  Publish Override
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
