import React from 'react';
import {
  MousePointer2,
  Square,
  Circle,
  Type,
  Hand,
  Image,
  Minus,
  Pen,
  Star,
} from 'lucide-react';

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Select (V)', shortcut: 'V' },
  { id: 'hand', icon: Hand, label: 'Hand Tool (H)', shortcut: 'H' },
  { id: 'rectangle', icon: Square, label: 'Rectangle (R)', shortcut: 'R' },
  { id: 'circle', icon: Circle, label: 'Ellipse (O)', shortcut: 'O' },
  { id: 'text', icon: Type, label: 'Text (T)', shortcut: 'T' },
  { id: 'line', icon: Minus, label: 'Line (L)', shortcut: 'L' },
  { id: 'pen', icon: Pen, label: 'Pen (P)', shortcut: 'P' },
  { id: 'star', icon: Star, label: 'Star (S)', shortcut: 'S' },
  { id: 'image', icon: Image, label: 'Image', shortcut: '' },
];

export default function DesignToolbar({ activeTool, setActiveTool, addElement }) {
  const handleToolClick = (toolId) => {
    if (toolId === 'rectangle' || toolId === 'circle' || toolId === 'text') {
      addElement(toolId);
    } else {
      setActiveTool(toolId);
    }
  };

  return (
    <div className="w-14 bg-[#181825] border-r border-[#313244] flex flex-col items-center py-3 gap-1">
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = activeTool === tool.id;
        return (
          <button
            key={tool.id}
            onClick={() => handleToolClick(tool.id)}
            title={tool.label}
            className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-150 ${
              isActive
                ? 'bg-[#3b82f6] text-white shadow-lg shadow-blue-500/20'
                : 'text-[#6c7086] hover:bg-[#313244] hover:text-[#cdd6f4]'
            }`}
          >
            <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
          </button>
        );
      })}
      
      <div className="flex-1" />
      
      <div className="w-8 h-px bg-[#313244] mb-2" />
      
      <div className="flex flex-col items-center gap-2">
        <button
          title="Frame colors"
          className="w-6 h-6 rounded-full bg-[#3b82f6] border-2 border-[#45475a] hover:scale-110 transition-transform"
        />
        <button
          title="Stroke color"
          className="w-6 h-6 rounded-full border-2 border-[#45475a] bg-transparent hover:scale-110 transition-transform"
        />
      </div>
    </div>
  );
}
