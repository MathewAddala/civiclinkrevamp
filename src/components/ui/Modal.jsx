// src/components/ui/Modal.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 flex items-start justify-center z-50 p-4 py-8 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Close modal if backdrop is clicked
        >
          {/* Reverting max-w to max-w-lg (standard size) and removing negative margins */}
          <motion.div
            className="holographic-card w-full max-w-lg max-h-[calc(100vh-4rem)] flex flex-col p-6 min-h-0"
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } }}
            exit={{ scale: 0.9, y: 50 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when modal content is clicked
          >
            <div className="flex shrink-0 justify-between items-center mb-4 gap-3">
              <h3 className="text-2xl font-bold text-white font-orbitron">{title}</h3>
              <motion.button 
                onClick={onClose} 
                className="text-gray-400 hover:text-white shrink-0"
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 -mr-1">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}