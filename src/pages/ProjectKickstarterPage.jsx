import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PackagePlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import ProjectProposalCard from '../components/common/ProjectProposalCard.jsx';
import Modal from '../components/ui/Modal.jsx';
import { projectService } from '../services/projectService.js';

const toProjectCardModel = (project) => ({
  id: project.id || project.projectId,
  title: project.title || 'Untitled Project',
  desc: project.desc || project.description || 'No description provided.',
  goal: Number(project.goal || project.goalAmount || 0),
  current: Number(project.current || project.currentAmount || 0),
  status: project.status || 'pending',
  color: project.color || 'blue',
  sector: project.sector || 'Other',
});

export default function ProjectKickstarterPage() {
  const { isAdmin, user, refreshProfile } = useAuth();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [showProposalModal, setShowProposalModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportProject, setSupportProject] = useState(null);
  const [supportAmount, setSupportAmount] = useState(100);
  const [proposalForm, setProposalForm] = useState({
    title: '',
    description: '',
    goalAmount: 10000,
    sector: 'Transportation',
  });
  const [statusFilter, setStatusFilter] = useState('open');

  const loadProjects = async () => {
    setFetchError('');
    try {
      const response = await projectService.list();
      const rows = Array.isArray(response) ? response : (response?.data || []);
      setProjects(rows.map(toProjectCardModel));
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Unable to load projects.');
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (event) => {
    event.preventDefault();
    try {
      await projectService.create({
        title: proposalForm.title,
        description: proposalForm.description,
        goalAmount: Number(proposalForm.goalAmount),
        sector: proposalForm.sector,
      });
      setShowProposalModal(false);
      setProposalForm({ title: '', description: '', goalAmount: 10000, sector: 'Transportation' });
      setActionMessage('Project proposal submitted.');
      setIsLoading(true);
      await loadProjects();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : 'Failed to create project.');
    }
  };

  const handleSupport = async (project) => {
    setSupportProject(project);
    setSupportAmount(100);
    setShowSupportModal(true);
  };

  const submitSupport = async (event) => {
    event.preventDefault();
    try {
      const amount = Number(supportAmount);
      await projectService.support(supportProject.id, amount);
      setActionMessage(`You supported ${supportProject.title} with ${amount} tokens.`);
      setShowSupportModal(false);
      setSupportProject(null);
      await refreshProfile?.();
      setIsLoading(true);
      await loadProjects();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : 'Failed to support project.');
    }
  };

  const handleApprove = async (project) => {
    try {
      await projectService.approve(project.id);
      setActionMessage(`${project.title} approved.`);
      setIsLoading(true);
      await loadProjects();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : 'Failed to approve project.');
    }
  };

  const handleReject = async (project) => {
    try {
      await projectService.reject(project.id);
      setActionMessage(`${project.title} rejected.`);
      setIsLoading(true);
      await loadProjects();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : 'Failed to reject project.');
    }
  };

  const filteredProjects = projects.filter((project) => {
    const status = String(project.status || '').toLowerCase();
    if (statusFilter === 'open') return status === 'pending' || status === 'funding';
    if (statusFilter === 'approved') return status === 'approved';
    if (statusFilter === 'rejected') return status === 'rejected';
    return true;
  });

  return (
    <motion.div className="space-y-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ staggerChildren: 0.1 }}>
      <Modal isOpen={showProposalModal} onClose={() => setShowProposalModal(false)} title="Propose a Project">
        <form className="space-y-4" onSubmit={handleCreateProject}>
          <input className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="Project title" value={proposalForm.title} onChange={(e) => setProposalForm((prev) => ({ ...prev, title: e.target.value }))} required />
          <textarea className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700" rows="4" placeholder="Project description" value={proposalForm.description} onChange={(e) => setProposalForm((prev) => ({ ...prev, description: e.target.value }))} required />
          <input className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700" type="number" min="1" placeholder="Goal amount" value={proposalForm.goalAmount} onChange={(e) => setProposalForm((prev) => ({ ...prev, goalAmount: e.target.value }))} required />
          <select className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700" value={proposalForm.sector} onChange={(e) => setProposalForm((prev) => ({ ...prev, sector: e.target.value }))}>
            <option className="bg-gray-900 text-gray-200" value="Transportation">Transportation</option>
            <option className="bg-gray-900 text-gray-200" value="Healthcare">Healthcare</option>
            <option className="bg-gray-900 text-gray-200" value="Environment">Environment</option>
            <option className="bg-gray-900 text-gray-200" value="Sanitation">Sanitation</option>
            <option className="bg-gray-900 text-gray-200" value="Education">Education</option>
            <option className="bg-gray-900 text-gray-200" value="Other">Other</option>
          </select>
          <button type="submit" className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors">Submit Proposal</button>
        </form>
      </Modal>

      <Modal isOpen={showSupportModal} onClose={() => setShowSupportModal(false)} title="Support Project">
        <form className="space-y-4" onSubmit={submitSupport}>
          <p className="text-gray-300 text-sm">
            Project: <span className="text-white font-semibold">{supportProject?.title}</span>
          </p>
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Tokens to spend</label>
            <input
              type="number"
              min="1"
              max={user?.projectTokens ?? 0}
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
              value={supportAmount}
              onChange={(e) => setSupportAmount(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Available: {user?.projectTokens ?? 0} project tokens</p>
          </div>
          <button type="submit" className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-gray-200 transition-colors">
            Support
          </button>
        </form>
      </Modal>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-orbitron tracking-tight">Project Kickstarter</h1>
          <p className="text-gray-400 mt-2 font-light">Support citizen-led initiatives to improve our city.</p>
          {actionMessage && <p className="text-blue-300 mt-2 text-sm">{actionMessage}</p>}
        </div>
        {!isAdmin && (
          <motion.button onClick={() => setShowProposalModal(true)} className="flex items-center px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <PackagePlus size={20} className="mr-2" /> Propose a Project
          </motion.button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-300">Project status filter</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500 font-semibold cursor-pointer"
        >
          <option className="bg-gray-900 text-gray-200" value="open">Open / In Review</option>
          <option className="bg-gray-900 text-gray-200" value="approved">Approved</option>
          <option className="bg-gray-900 text-gray-200" value="rejected">Rejected</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading && <p className="text-gray-400 col-span-full">Loading projects...</p>}
        {!isLoading && fetchError && <p className="text-red-400 col-span-full">{fetchError}</p>}
        {!isLoading && !fetchError && filteredProjects.length === 0 && <p className="text-gray-400 col-span-full">No projects found for selected status.</p>}
        {!isLoading && !fetchError && filteredProjects.map((project, index) => (
          <ProjectProposalCard
            key={project.id}
            project={project}
            delay={index}
            isAdmin={isAdmin}
            onApprove={handleApprove}
            onReject={handleReject}
            onSupport={handleSupport}
          />
        ))}
      </div>
    </motion.div>
  );
}
