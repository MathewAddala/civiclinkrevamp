// src/components/charts/IssueResolutionChart.jsx
import React from 'react';
import { motion } from 'framer-motion';

const issueData = [
    { name: 'Jan', Resolved: 40, Reported: 60, resolvedY: 100, reportedY: 80 },
    { name: 'Feb', Resolved: 35, Reported: 55, resolvedY: 105, reportedY: 85 },
    { name: 'Mar', Resolved: 50, Reported: 70, resolvedY: 90, reportedY: 70 },
    { name: 'Apr', Resolved: 65, Reported: 68, resolvedY: 75, reportedY: 72 },
    { name: 'May', Resolved: 60, Reported: 75, resolvedY: 80, reportedY: 65 },
    { name: 'Jun', Resolved: 80, Reported: 82, resolvedY: 60, reportedY: 58 },
];

const getPathD = (data, key) => {
    return data.map((d, i) => {
        const x = i * 60 + 20;
        const y = d[`${key}Y`];
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
};

export default function IssueResolutionChart() {
    const chartHeight = 150;
    const chartWidth = issueData.length * 60 + 40;

    return (
        <div className="mt-6 p-2 relative">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="150">
                {/* Grid Lines (Minimalist) */}
                <line x1="0" y1="10" x2={chartWidth} y2="10" stroke="#374151" strokeWidth="0.5" />
                <line x1="0" y1={chartHeight - 30} x2={chartWidth} y2={chartHeight - 30} stroke="#374151" strokeWidth="0.5" />

                {/* Resolved Line (Green Glow) */}
                <motion.path
                    d={getPathD(issueData, 'resolved')}
                    fill="none"
                    stroke="#4CAF50"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    filter="drop-shadow(0 0 5px rgba(76, 175, 80, 0.8))"
                />

                {/* Reported Line (Blue Glow) */}
                <motion.path
                    d={getPathD(issueData, 'reported')}
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
                    filter="drop-shadow(0 0 5px rgba(59, 130, 246, 0.8))"
                />
                
                {/* X-Axis Labels */}
                {issueData.map((d, i) => (
                    <text 
                        key={d.name} 
                        x={i * 60 + 20} 
                        y={chartHeight - 10} 
                        textAnchor="middle" 
                        fontSize="10" 
                        fill="#9CA3AF"
                    >
                        {d.name}
                    </text>
                ))}

                {/* Legend */}
                <circle cx={chartWidth - 110} cy="18" r="4" fill="#3B82F6" />
                <text x={chartWidth - 100} y="21" fontSize="10" fill="#E5E7EB">Reported</text>
                
                <circle cx={chartWidth - 40} cy="18" r="4" fill="#4CAF50" />
                <text x={chartWidth - 30} y="21" fontSize="10" fill="#E5E7EB">Resolved</text>

            </svg>
        </div>
    );
}