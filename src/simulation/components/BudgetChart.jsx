import React from 'react';
import { motion } from 'framer-motion';

const budgetData = [
  { sector: 'Transportation', value: 35, color: 'bg-blue-500' },
  { sector: 'Healthcare', value: 25, color: 'bg-green-500' },
  { sector: 'Sanitation', value: 20, color: 'bg-yellow-500' },
  { sector: 'Education', value: 10, color: 'bg-purple-500' },
  { sector: 'Parks & Rec', value: 10, color: 'bg-pink-500' },
];

export default function BudgetChart() {
  return (
    <div className="holographic-card p-6 shadow-xl h-full">
      <h3 className="font-bold text-xl mb-6 text-gray-100 glow-text font-orbitron">Live Budget Allocation Overview</h3>
      <div className="space-y-6">
        {budgetData.map((item, index) => (
          <div key={item.sector} className="w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-base font-medium text-gray-300">{item.sector}</span>
              <span className="text-base font-bold text-gray-100">{item.value}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <motion.div
                className={`${item.color} h-3 rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${item.value}%` }}
                transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-6">
        *Percentages reflect real-time citizen token allocation.
      </p>
    </div>
  );
}