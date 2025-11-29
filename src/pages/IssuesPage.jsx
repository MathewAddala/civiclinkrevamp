// src/pages/IssuesPage.jsx
import React, { useState } from 'react'; // Don't forget useState
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import IssueListItem from '../components/common/IssueListItem.jsx'; // Import the new component
import Modal from '../components/ui/Modal.jsx'; // Import the new Modal component

const issues = [
  { id: '#1024', title: "Major water leak on Main St.", status: 'escalated', priority: 'High', location: 'Downtown', time: '5 min ago', assignedTo: 'Team Alpha' },
  { id: '#1023', title: "Broken streetlight near park", status: 'open', priority: 'Medium', location: 'Uptown', time: '1 hr ago', assignedTo: 'Unassigned' },
  { id: '#1021', title: "Pothole on 5th Avenue", status: 'in-progress', priority: 'Medium', location: 'Midtown', time: '3 hrs ago', assignedTo: 'Team Beta' },
  { id: '#998', title: "Garbage overflow at city square", status: 'resolved', priority: 'Low', location: 'Downtown', time: '1 day ago', assignedTo: 'Team Gamma' },
  { id: '#997', title: "Graffiti on public transport hub", status: 'open', priority: 'Medium', location: 'Eastside', time: '2 days ago', assignedTo: 'Unassigned' },
  { id: '#996', title: "Road construction blockage", status: 'in-progress', priority: 'High', location: 'West End', time: '3 days ago', assignedTo: 'Team Alpha' },
];

export default function IssuesPage() {
  const { isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Report a New Issue">
        <form className="space-y-4">
          <div>
            <label htmlFor="issueTitle" className="block text-gray-400 text-sm font-bold mb-2">Issue Title</label>
            <input type="text" id="issueTitle" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500" placeholder="e.g., Broken Streetlight on Elm St." />
          </div>
          <div>
            <label htmlFor="issueLocation" className="block text-gray-400 text-sm font-bold mb-2">Location</label>
            <input type="text" id="issueLocation" className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500" placeholder="e.g., Corner of Elm St. and 5th Ave." />
          </div>
          <div className="pt-4">
            <motion.button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg glow-effect" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Submit Report
            </motion.button>
          </div>
        </form>
      </Modal>

      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-extrabold text-white glow-text font-orbitron">Issue Resolution Hub</h1>
            <p className="text-gray-400 mt-2">Live feed of civic reports and their resolution status.</p>
          </div>
          {!isAdmin && (
              <motion.button 
                onClick={() => setIsModalOpen(true)} // Open modal when clicked
                className="flex items-center px-5 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors glow-effect"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={20} className="mr-2"/> Report New Issue
              </motion.button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Issues List */}
          <div className="lg:col-span-2 space-y-4">
            {issues.map((issue, index) => (
              <IssueListItem key={issue.id} issue={issue} delay={index} isAdmin={isAdmin} />
            ))}
          </div>
          
          {/* Simulated Heatmap */}
          <motion.div 
            className="lg:col-span-3 holographic-card p-4 h-96 lg:h-auto flex items-center justify-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-500 font-semibold z-10 text-2xl font-orbitron">Live City Heatmap (Simulation)</p>
            <div className="absolute inset-0 bg-gray-950 opacity-80 z-0"></div>
            {/* Pulsing hotspots */}
            <motion.div 
              className="absolute w-32 h-32 bg-red-500 rounded-full blur-2xl opacity-60"
              style={{ top: '30%', left: '40%'}}
              animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div 
              className="absolute w-24 h-24 bg-yellow-500 rounded-full blur-2xl opacity-50"
              style={{ top: '60%', left: '65%'}}
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}