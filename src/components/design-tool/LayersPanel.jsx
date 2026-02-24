import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  ChevronUp,
  ChevronDown,
  Square,
  Circle,
  Type,
  Layers,
  Search,
} from 'lucide-react';

const typeIcons = {
  rectangle: Square,
  circle: Circle,
  text: Type,
};

export default function LayersPanel({
  elements,
  selectedId,
  setSelectedId,
  updateElement,
  moveElementOrder,
  deleteElement,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const reversedElements = [...elements].reverse();

  const filteredElements = reversedElements.filter((el) =>
    el.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-60 bg-[#181825] border-r border-[#313244] flex flex-col">
      {/* Header */}
      <div className="px-3 py-3 border-b border-[#313244]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#a6adc8] uppercase tracking-wider mb-2">
          <Layers size={14} />
          <span>Layers</span>
          <span className="ml-auto text-[#6c7086] font-normal normal-case tracking-normal">
            {elements.length}
          </span>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-[#6c7086]" />
          <input
            type="text"
            placeholder="Search layers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#11111b] border border-[#313244] rounded-md pl-7 pr-2 py-1.5 text-xs text-[#cdd6f4] placeholder-[#6c7086] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/30 outline-none transition-colors"
          />
        </div>
      </div>

      {/* Layer list */}
      <div className="flex-1 overflow-y-auto">
        {filteredElements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-[#6c7086] text-xs">
            <Layers size={32} className="mb-2 opacity-40" />
            <span>No layers yet</span>
          </div>
        ) : (
          filteredElements.map((el) => {
            const isSelected = el.id === selectedId;
            const Icon = typeIcons[el.type] || Square;
            return (
              <div
                key={el.id}
                onClick={() => setSelectedId(el.id)}
                className={`group flex items-center gap-2 px-3 py-2 cursor-pointer border-l-2 transition-all ${
                  isSelected
                    ? 'bg-[#3b82f6]/10 border-l-[#3b82f6] text-[#cdd6f4]'
                    : 'border-l-transparent hover:bg-[#313244]/40 text-[#a6adc8]'
                }`}
              >
                {/* Type icon */}
                <Icon size={14} className={isSelected ? 'text-[#3b82f6]' : 'text-[#6c7086]'} />
                
                {/* Color preview */}
                <div
                  className="w-3 h-3 rounded-sm border border-[#45475a] flex-shrink-0"
                  style={{ backgroundColor: el.fill }}
                />

                {/* Name */}
                <span className="text-xs truncate flex-1">{el.name}</span>

                {/* Actions (visible on hover/selected) */}
                <div className={`flex items-center gap-0.5 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateElement(el.id, { visible: !el.visible });
                    }}
                    className="p-0.5 rounded hover:bg-[#45475a] transition-colors"
                    title={el.visible ? 'Hide' : 'Show'}
                  >
                    {el.visible ? (
                      <Eye size={12} className="text-[#6c7086]" />
                    ) : (
                      <EyeOff size={12} className="text-[#f38ba8]" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateElement(el.id, { locked: !el.locked });
                    }}
                    className="p-0.5 rounded hover:bg-[#45475a] transition-colors"
                    title={el.locked ? 'Unlock' : 'Lock'}
                  >
                    {el.locked ? (
                      <Lock size={12} className="text-[#fab387]" />
                    ) : (
                      <Unlock size={12} className="text-[#6c7086]" />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom actions */}
      {selectedId && (
        <div className="border-t border-[#313244] px-3 py-2 flex items-center justify-between">
          <div className="flex gap-1">
            <button
              onClick={() => moveElementOrder(selectedId, 'up')}
              className="p-1.5 rounded hover:bg-[#313244] text-[#6c7086] hover:text-[#cdd6f4] transition-colors"
              title="Move forward"
            >
              <ChevronUp size={14} />
            </button>
            <button
              onClick={() => moveElementOrder(selectedId, 'down')}
              className="p-1.5 rounded hover:bg-[#313244] text-[#6c7086] hover:text-[#cdd6f4] transition-colors"
              title="Move backward"
            >
              <ChevronDown size={14} />
            </button>
          </div>
          <button
            onClick={() => deleteElement(selectedId)}
            className="p-1.5 rounded hover:bg-[#f38ba8]/10 text-[#6c7086] hover:text-[#f38ba8] transition-colors"
            title="Delete layer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
