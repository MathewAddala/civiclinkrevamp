// src/pages/ProjectKickstarterPage.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { PackagePlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.jsx';
import ProjectProposalCard from '../components/common/ProjectProposalCard.jsx'; // Import the new component

const projects = [
  { id: 'proj-1', title: "Green Park Initiative", desc: "Renovate the central park with new trees and recreational facilities to boost urban biodiversity and citizen well-being.", goal: 10000, current: 7500, status: 'funding', color: 'green' },
  { id: 'proj-2', title: "Community Art Mural", desc: "Commission a local artist to paint a vibrant mural on the old library wall, fostering community pride and artistic expression.", goal: 2500, current: 1800, status: 'funding', color: 'purple' },
  { id: 'proj-3', title: "Digital Literacy Program", desc: "Provide free workshops for seniors on using modern technology, bridging the digital divide and enhancing civic participation.", goal: 5000, current: 4800, status: 'approved', color: 'blue' },
  { id: 'proj-4', title: "Bridge Repair Fund", desc: "Urgent repairs for the old pedestrian bridge connecting East and West sides, ensuring safer transit for all residents.", goal: 15000, current: 6000, status: 'pending', color: 'yellow' },
  { id: 'proj-5', title: "Smart Waste Management", desc: "Implement AI-powered waste sorting and collection systems to reduce landfill impact and improve city cleanliness.", goal: 20000, current: 12000, status: 'funding', color: 'red' },
  { id: 'proj-6', title: "Public Wi-Fi Expansion", desc: "Extend free public Wi-Fi access to underserved neighborhoods, ensuring equitable access to information and opportunities.", goal: 12000, current: 9500, status: 'pending', color: 'indigo' },
];

export default function ProjectKickstarterPage() {
  const { isAdmin } = useAuth();

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ staggerChildren: 0.1 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-white glow-text font-orbitron">Project Kickstarter</h1>
          <p className="text-gray-400 mt-2">Support citizen-led initiatives to improve our city.</p>
        </div>
        {!isAdmin && (
            <motion.button 
            className="flex items-center px-5 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors glow-effect"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            >
            <PackagePlus size={20} className="mr-2"/> Propose a Project
            </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <ProjectProposalCard key={project.id} project={project} delay={index} isAdmin={isAdmin} />
        ))}
      </div>
    </motion.div>
  );
}