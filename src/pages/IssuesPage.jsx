import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Map } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import IssueListItem from '../components/common/IssueListItem.jsx';
import Modal from '../components/ui/Modal.jsx';
import { issueService } from '../services/issueService.js';
import { useNavigate } from 'react-router-dom';
import LocationPickerMap from '../components/maps/LocationPickerMap.jsx';

const formatRelativeTime = (inputDate) => {
  if (!inputDate) return 'recently';
  const diffMs = Date.now() - new Date(inputDate).getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;
  return `${Math.floor(diffHours / 24)} day(s) ago`;
};

const toIssueListItem = (issue) => ({
  id: issue.id ? `#${issue.id}` : '#N/A',
  issueId: issue.id,
  title: issue.title || issue.description || 'Untitled issue',
  status: issue.status || 'open',
  priority: issue.priority || 'Medium',
  location: issue.location || issue.address || 'Unknown',
  time: formatRelativeTime(issue.createdAt || issue.created_at),
  assignedTo: issue.assignedTo || issue.assigned_to || 'Unassigned',
  reporter: issue.submittedBy?.name || issue.submittedBy?.email || issue.submitted_by?.name || 'Citizen',
  description: issue.description || 'No description provided.',
  attachmentUrl: issue.attachmentData ? `data:${issue.attachmentType || 'image/jpeg'};base64,${issue.attachmentData}` : null,
  attachmentName: issue.attachmentName || null,
});



export default function IssuesPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [viewedIssue, setViewedIssue] = useState(null);
  const [issues, setIssues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [manageError, setManageError] = useState('');
  const [formState, setFormState] = useState({
    title: '',
    location: '',
    description: '',
    attachment: null,
  });
  const [pickedLocation, setPickedLocation] = useState({ lat: null, lng: null, address: '' });
  const [manageState, setManageState] = useState({
    status: 'open',
    assignedTo: '',
    priority: 'Medium',
  });
  const [statusFilter, setStatusFilter] = useState('all');

  const loadIssues = async () => {
    setFetchError('');
    try {
      const response = await issueService.list();
      const rows = Array.isArray(response) ? response : (response?.data || []);
      setIssues(rows.map(toIssueListItem));
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Unable to load issues from backend.');
      setIssues([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
  }, []);

  const handleCreateIssue = async (event) => {
    event.preventDefault();
    setSubmitError('');

    if (!formState.title.trim() || !pickedLocation.lat || !pickedLocation.lng) {
      setSubmitError('Issue title and map location are required.');
      return;
    }

    try {
      await issueService.create({
        title: formState.title.trim(),
        location: (formState.location.trim() || pickedLocation.address || 'Pinned location').trim(),
        description: formState.description.trim(),
        lat: pickedLocation.lat,
        lng: pickedLocation.lng,
        attachment: formState.attachment || undefined,
      });
      setFormState({ title: '', location: '', description: '', attachment: null });
      setPickedLocation({ lat: null, lng: null, address: '' });
      setIsModalOpen(false);
      setIsLoading(true);
      await loadIssues();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not submit issue.');
    }
  };

  const openManageModal = async (issue, quickStatusUpdate = false) => {
    if (quickStatusUpdate) {
      try {
        await issueService.update(issue.issueId, { status: issue.status });
        await loadIssues();
      } catch (err) {
        console.error(err);
      }
      return;
    }
    setSelectedIssue(issue);
    setManageState({
      status: issue.status || 'open',
      assignedTo: issue.assignedTo === 'Unassigned' ? '' : issue.assignedTo,
      priority: issue.priority || 'Medium',
    });
    setManageError('');
    setIsManageModalOpen(true);
  };

  const handleManageIssue = async (event) => {
    event.preventDefault();
    if (!selectedIssue?.issueId) return;

    try {
      await issueService.update(selectedIssue.issueId, {
        status: manageState.status,
        assignedTo: manageState.assignedTo || 'Unassigned',
        priority: manageState.priority,
      });
      setIsManageModalOpen(false);
      setSelectedIssue(null);
      setIsLoading(true);
      await loadIssues();
    } catch (err) {
      setManageError(err instanceof Error ? err.message : 'Failed to update issue.');
    }
  };

  const openViewModal = (issue) => {
    setViewedIssue(issue);
    setIsViewModalOpen(true);
  };

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Report a New Issue">
        <form className="space-y-4" onSubmit={handleCreateIssue}>
          {submitError && <div className="p-3 bg-white/5 text-gray-300 rounded-lg border border-white/10 text-sm">{submitError}</div>}
          <div>
            <label htmlFor="issueTitle" className="block text-gray-400 text-sm font-bold mb-2">Issue Title</label>
            <input type="text" id="issueTitle" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700" placeholder="e.g., Broken Streetlight" value={formState.title} onChange={(e) => setFormState((prev) => ({ ...prev, title: e.target.value }))} />
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Pick Location on Map</label>
            <LocationPickerMap value={pickedLocation} onChange={setPickedLocation} />
          </div>
          <div>
            <label htmlFor="issueLocation" className="block text-gray-400 text-sm font-bold mb-2">Location Label (optional)</label>
            <input
              type="text"
              id="issueLocation"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700"
              placeholder={pickedLocation.address ? pickedLocation.address : "e.g., Near Main Gate"}
              value={formState.location}
              onChange={(e) => setFormState((prev) => ({ ...prev, location: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="issueDescription" className="block text-gray-400 text-sm font-bold mb-2">Description</label>
            <textarea id="issueDescription" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700" rows="3" value={formState.description} onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))} />
          </div>
          <div>
            <label htmlFor="issueAttachment" className="block text-gray-400 text-sm font-bold mb-2">Attachment (optional)</label>
            <input
              id="issueAttachment"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="w-full p-2 rounded-lg bg-gray-800 text-white border border-gray-700"
              onChange={(e) => setFormState((prev) => ({ ...prev, attachment: e.target.files?.[0] || null }))}
            />
            <p className="text-xs text-gray-500 mt-1">Allowed: JPG, PNG, PDF. Max 5MB.</p>
          </div>
          <motion.button type="submit" className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            Submit Report
          </motion.button>
        </form>
      </Modal>

      <Modal isOpen={isManageModalOpen} onClose={() => setIsManageModalOpen(false)} title="Manage Issue">
        <form className="space-y-4" onSubmit={handleManageIssue}>
          {manageError && <div className="p-3 bg-white/5 text-gray-300 rounded-lg border border-white/10 text-sm">{manageError}</div>}
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Status</label>
            <select className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700" value={manageState.status} onChange={(e) => setManageState((prev) => ({ ...prev, status: e.target.value }))}>
              <option className="bg-gray-900 text-gray-200" value="open">Open</option>
              <option className="bg-gray-900 text-gray-200" value="in-progress">In Progress</option>
              <option className="bg-gray-900 text-gray-200" value="escalated">Escalated</option>
              <option className="bg-gray-900 text-gray-200" value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Priority</label>
            <select className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700" value={manageState.priority} onChange={(e) => setManageState((prev) => ({ ...prev, priority: e.target.value }))}>
              <option className="bg-gray-900 text-gray-200" value="Low">Low</option>
              <option className="bg-gray-900 text-gray-200" value="Medium">Medium</option>
              <option className="bg-gray-900 text-gray-200" value="High">High</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm font-bold mb-2">Assigned Team</label>
            <input type="text" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700" value={manageState.assignedTo} onChange={(e) => setManageState((prev) => ({ ...prev, assignedTo: e.target.value }))} placeholder="Team Alpha" />
          </div>
          <motion.button type="submit" className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            Update Issue
          </motion.button>
        </form>
      </Modal>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Issue Details">
        {viewedIssue && (
          <div className="space-y-4">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Title</p>
              <p className="text-white text-lg font-bold">{viewedIssue.id}: {viewedIssue.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Status</p>
                <p className="text-gray-300 capitalize">{viewedIssue.status.replace('-', ' ')}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Reported By</p>
                <p className="text-gray-300">{viewedIssue.reporter}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Location</p>
                <p 
                  className="text-blue-400 cursor-pointer hover:text-blue-300 underline transition-colors"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    navigate('/map-view');
                  }}
                >
                  {viewedIssue.location}
                </p>
              </div>
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Time Report</p>
                <p className="text-gray-300">{viewedIssue.time}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Description</p>
              <p className="text-gray-300 whitespace-pre-wrap mt-1 p-4 bg-black/40 border border-white/10 rounded-xl leading-relaxed">{viewedIssue.description}</p>
            </div>
            {viewedIssue.attachmentUrl && (
              <div>
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Attachment: {viewedIssue.attachmentName}</p>
                {viewedIssue.attachmentUrl.startsWith('data:application/pdf') ? (
                  <a href={viewedIssue.attachmentUrl} download={viewedIssue.attachmentName || 'document.pdf'} className="text-blue-400 hover:text-blue-300 underline block p-4 bg-white/5 border border-white/10 rounded-xl w-full text-center">
                    Download PDF Attachment
                  </a>
                ) : (
                  <img src={viewedIssue.attachmentUrl} alt="Issue Attachment" className="max-w-full rounded-xl border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]" />
                )}
              </div>
            )}
            <motion.button 
              onClick={() => setIsViewModalOpen(false)}
              className="w-full mt-4 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Close
            </motion.button>
          </div>
        )}
      </Modal>

      <motion.div className="space-y-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ staggerChildren: 0.1 }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-orbitron tracking-tight">Issue Resolution Hub</h1>
            <p className="text-gray-400 mt-2 font-light">Live feed of civic reports and their resolution status.</p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <motion.button onClick={() => navigate('/map-view')} className="flex items-center px-6 py-3 bg-white/10 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/20 transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Map size={18} className="mr-2" /> Map View
              </motion.button>
            )}
            {!isAdmin && (
              <motion.button onClick={() => setIsModalOpen(true)} className="flex items-center px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Plus size={20} className="mr-2" /> Report New Issue
              </motion.button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-start mb-4">
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-blue-500 font-semibold cursor-pointer"
            >
              <option className="bg-gray-900 text-gray-200" value="all">All Statuses</option>
              <option className="bg-gray-900 text-gray-200" value="open">Open</option>
              <option className="bg-gray-900 text-gray-200" value="in-progress">In Progress</option>
              <option className="bg-gray-900 text-gray-200" value="escalated">Escalated</option>
              <option className="bg-gray-900 text-gray-200" value="resolved">Resolved</option>
            </select>
          </div>

          {isLoading && <p className="text-gray-400">Loading issues...</p>}
          {!isLoading && fetchError && <p className="text-gray-400">{fetchError}</p>}
          {!isLoading && !fetchError && issues.length === 0 && <p className="text-gray-400">No issues available yet. Add one to get started.</p>}
          {!isLoading && !fetchError && issues
            .filter(issue => statusFilter === 'all' || issue.status === statusFilter)
            .map((issue, index) => (
            <IssueListItem key={`${issue.id}-${index}`} issue={issue} delay={index} isAdmin={isAdmin} onManage={openManageModal} onView={openViewModal} />
          ))}
        </div>
      </motion.div>
    </>
  );
}
