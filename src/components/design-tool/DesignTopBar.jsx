import React, { useState } from 'react';
import {
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  Share2,
  Play,
  MoreHorizontal,
  ChevronDown,
} from 'lucide-react';

export default function DesignTopBar({
  fileName,
  setFileName,
  undo,
  redo,
  canUndo,
  canRedo,
  zoom,
  setZoom,
}) {
  const [showMenu, setShowMenu] = useState(false);

  const zoomPresets = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3];

  return (
    <div className="h-12 bg-[#181825] border-b border-[#313244] flex items-center px-3 gap-2 select-none">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2 mr-3">
        <div className="w-7 h-7 rounded-lg bg-[#3b82f6] flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-[#cdd6f4] hidden sm:block">DesignLab</span>
      </div>

      {/* Menu buttons */}
      <div className="hidden md:flex items-center gap-0.5 text-xs text-[#a6adc8]">
        {['File', 'Edit', 'View', 'Insert', 'Arrange'].map((label) => (
          <button
            key={label}
            className="px-2.5 py-1.5 rounded hover:bg-[#313244] transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="w-px h-5 bg-[#313244] mx-1 hidden md:block" />

      {/* File name */}
      <div className="flex items-center gap-1 mx-2">
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="bg-transparent text-sm text-[#cdd6f4] border-none outline-none max-w-[200px] hover:bg-[#313244] focus:bg-[#313244] px-2 py-1 rounded transition-colors"
        />
        <ChevronDown size={14} className="text-[#6c7086]" />
      </div>

      <div className="flex-1" />

      {/* Undo / Redo */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={undo}
          disabled={!canUndo}
          className={`p-2 rounded-lg transition-colors ${
            canUndo
              ? 'text-[#a6adc8] hover:bg-[#313244] hover:text-[#cdd6f4]'
              : 'text-[#45475a] cursor-not-allowed'
          }`}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={16} />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          className={`p-2 rounded-lg transition-colors ${
            canRedo
              ? 'text-[#a6adc8] hover:bg-[#313244] hover:text-[#cdd6f4]'
              : 'text-[#45475a] cursor-not-allowed'
          }`}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 size={16} />
        </button>
      </div>

      <div className="w-px h-5 bg-[#313244] mx-1" />

      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setZoom(Math.max(0.1, zoom - 0.25))}
          className="p-1.5 rounded hover:bg-[#313244] text-[#a6adc8] hover:text-[#cdd6f4] transition-colors"
          title="Zoom out"
        >
          <ZoomOut size={16} />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="px-2 py-1 rounded text-xs text-[#cdd6f4] hover:bg-[#313244] transition-colors min-w-[50px] text-center"
          >
            {Math.round(zoom * 100)}%
          </button>
          {showMenu && (
            <div className="absolute top-full right-0 mt-1 bg-[#1e1e2e] border border-[#313244] rounded-lg shadow-xl py-1 z-50 min-w-[100px]">
              {zoomPresets.map((z) => (
                <button
                  key={z}
                  onClick={() => {
                    setZoom(z);
                    setShowMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                    Math.abs(zoom - z) < 0.01
                      ? 'text-[#3b82f6] bg-[#3b82f6]/10'
                      : 'text-[#a6adc8] hover:bg-[#313244]'
                  }`}
                >
                  {z * 100}%
                </button>
              ))}
              <div className="h-px bg-[#313244] my-1" />
              <button
                onClick={() => {
                  setZoom(1);
                  setShowMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-[#a6adc8] hover:bg-[#313244] transition-colors"
              >
                Fit to screen
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => setZoom(Math.min(3, zoom + 0.25))}
          className="p-1.5 rounded hover:bg-[#313244] text-[#a6adc8] hover:text-[#cdd6f4] transition-colors"
          title="Zoom in"
        >
          <ZoomIn size={16} />
        </button>
      </div>

      <div className="w-px h-5 bg-[#313244] mx-1" />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <button className="p-2 rounded-lg text-[#a6adc8] hover:bg-[#313244] hover:text-[#cdd6f4] transition-colors" title="Preview">
          <Play size={16} />
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3b82f6] text-white text-xs font-medium hover:bg-[#2563eb] transition-colors">
          <Share2 size={14} />
          <span className="hidden sm:inline">Share</span>
        </button>
        <button className="p-2 rounded-lg text-[#a6adc8] hover:bg-[#313244] hover:text-[#cdd6f4] transition-colors" title="Export">
          <Download size={16} />
        </button>
      </div>
    </div>
  );
}
