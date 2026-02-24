import React, { useState } from 'react';
import {
  Trash2,
  Copy,
  RotateCcw,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Palette,
} from 'lucide-react';

const PRESET_COLORS = [
  '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#06b6d4', '#6366f1',
  '#f8fafc', '#e2e8f0', '#94a3b8', '#475569', '#1e293b',
  '#0f172a', '#000000', '#ffffff',
];

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#313244]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#a6adc8] uppercase tracking-wider hover:bg-[#313244]/30 transition-colors"
      >
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        {title}
      </button>
      {open && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
}

function NumberInput({ label, value, onChange, min, max, step = 1 }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] text-[#6c7086] uppercase tracking-wide">{label}</label>
      <input
        type="number"
        value={Math.round(value)}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        min={min}
        max={max}
        step={step}
        className="w-full bg-[#11111b] border border-[#313244] rounded-md px-2 py-1.5 text-xs text-[#cdd6f4] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/30 outline-none transition-colors"
      />
    </div>
  );
}

function ColorPicker({ label, value, onChange }) {
  const [showPresets, setShowPresets] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] text-[#6c7086] uppercase tracking-wide">{label}</label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded-md border border-[#313244] cursor-pointer bg-transparent"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-[#11111b] border border-[#313244] rounded-md px-2 py-1.5 text-xs text-[#cdd6f4] font-mono focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/30 outline-none transition-colors"
        />
        <button
          onClick={() => setShowPresets(!showPresets)}
          className="p-1.5 rounded hover:bg-[#313244] text-[#6c7086] hover:text-[#cdd6f4] transition-colors"
        >
          <Palette size={14} />
        </button>
      </div>
      {showPresets && (
        <div className="grid grid-cols-6 gap-1 mt-1">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => {
                onChange(color);
                setShowPresets(false);
              }}
              className="w-6 h-6 rounded border border-[#45475a] hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function PropertiesPanel({
  selectedElement,
  updateElement,
  deleteElement,
  duplicateElement,
}) {
  if (!selectedElement) {
    return (
      <div className="w-64 bg-[#181825] border-l border-[#313244] flex flex-col items-center justify-center text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-[#313244]/40 flex items-center justify-center mb-4">
          <Palette size={28} className="text-[#6c7086]" />
        </div>
        <p className="text-sm text-[#6c7086] mb-1">No selection</p>
        <p className="text-xs text-[#45475a]">Click an element on the canvas to inspect and edit its properties</p>
      </div>
    );
  }

  const el = selectedElement;

  return (
    <div className="w-64 bg-[#181825] border-l border-[#313244] flex flex-col overflow-y-auto">
      {/* Element header */}
      <div className="px-3 py-3 border-b border-[#313244]">
        <div className="flex items-center justify-between mb-2">
          <input
            type="text"
            value={el.name}
            onChange={(e) => updateElement(el.id, { name: e.target.value })}
            className="bg-transparent text-sm font-medium text-[#cdd6f4] border-none outline-none w-full focus:bg-[#11111b] focus:px-2 focus:py-0.5 focus:rounded transition-all"
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => duplicateElement(el.id)}
            className="p-1.5 rounded hover:bg-[#313244] text-[#6c7086] hover:text-[#cdd6f4] transition-colors"
            title="Duplicate"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={() => updateElement(el.id, { locked: !el.locked })}
            className="p-1.5 rounded hover:bg-[#313244] text-[#6c7086] hover:text-[#cdd6f4] transition-colors"
            title={el.locked ? 'Unlock' : 'Lock'}
          >
            {el.locked ? <Lock size={14} /> : <Unlock size={14} />}
          </button>
          <button
            onClick={() => updateElement(el.id, { visible: !el.visible })}
            className="p-1.5 rounded hover:bg-[#313244] text-[#6c7086] hover:text-[#cdd6f4] transition-colors"
            title={el.visible ? 'Hide' : 'Show'}
          >
            {el.visible ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <div className="flex-1" />
          <button
            onClick={() => deleteElement(el.id)}
            className="p-1.5 rounded hover:bg-[#f38ba8]/10 text-[#6c7086] hover:text-[#f38ba8] transition-colors"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Transform */}
      <Section title="Transform">
        <div className="grid grid-cols-2 gap-2">
          <NumberInput label="X" value={el.x} onChange={(v) => updateElement(el.id, { x: v })} />
          <NumberInput label="Y" value={el.y} onChange={(v) => updateElement(el.id, { y: v })} />
          <NumberInput label="Width" value={el.width} onChange={(v) => updateElement(el.id, { width: v })} min={1} />
          <NumberInput label="Height" value={el.height} onChange={(v) => updateElement(el.id, { height: v })} min={1} />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <NumberInput
            label="Rotation"
            value={el.rotation}
            onChange={(v) => updateElement(el.id, { rotation: v })}
            min={-360}
            max={360}
          />
          {el.type !== 'text' && (
            <NumberInput
              label="Radius"
              value={el.borderRadius || 0}
              onChange={(v) => updateElement(el.id, { borderRadius: v })}
              min={0}
            />
          )}
        </div>
      </Section>

      {/* Fill */}
      <Section title="Fill">
        <ColorPicker
          label="Fill Color"
          value={el.fill}
          onChange={(v) => updateElement(el.id, { fill: v })}
        />
        <div className="mt-3">
          <NumberInput
            label="Opacity"
            value={el.opacity * 100}
            onChange={(v) => updateElement(el.id, { opacity: Math.min(1, Math.max(0, v / 100)) })}
            min={0}
            max={100}
            step={5}
          />
        </div>
      </Section>

      {/* Stroke */}
      {el.type !== 'text' && (
        <Section title="Stroke" defaultOpen={false}>
          <ColorPicker
            label="Stroke Color"
            value={el.stroke || '#000000'}
            onChange={(v) => updateElement(el.id, { stroke: v })}
          />
          <div className="mt-2">
            <NumberInput
              label="Width"
              value={el.strokeWidth || 0}
              onChange={(v) => updateElement(el.id, { strokeWidth: v })}
              min={0}
              max={20}
            />
          </div>
        </Section>
      )}

      {/* Text properties */}
      {el.type === 'text' && (
        <Section title="Typography">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-[#6c7086] uppercase tracking-wide">Content</label>
              <textarea
                value={el.text}
                onChange={(e) => updateElement(el.id, { text: e.target.value })}
                rows={3}
                className="w-full bg-[#11111b] border border-[#313244] rounded-md px-2 py-1.5 text-xs text-[#cdd6f4] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/30 outline-none transition-colors resize-none"
              />
            </div>
            <NumberInput
              label="Font Size"
              value={el.fontSize}
              onChange={(v) => updateElement(el.id, { fontSize: v })}
              min={8}
              max={200}
            />
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-[#6c7086] uppercase tracking-wide">Weight</label>
              <select
                value={el.fontWeight}
                onChange={(e) => updateElement(el.id, { fontWeight: e.target.value })}
                className="w-full bg-[#11111b] border border-[#313244] rounded-md px-2 py-1.5 text-xs text-[#cdd6f4] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/30 outline-none transition-colors"
              >
                <option value="300">Light</option>
                <option value="normal">Regular</option>
                <option value="500">Medium</option>
                <option value="600">Semibold</option>
                <option value="bold">Bold</option>
                <option value="800">Extra Bold</option>
              </select>
            </div>
          </div>
        </Section>
      )}

      {/* Quick actions */}
      <div className="mt-auto border-t border-[#313244] px-3 py-3">
        <button
          onClick={() => updateElement(el.id, { rotation: 0, opacity: 1 })}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#313244]/50 text-xs text-[#a6adc8] hover:bg-[#313244] hover:text-[#cdd6f4] transition-colors"
        >
          <RotateCcw size={12} />
          Reset Transform
        </button>
      </div>
    </div>
  );
}
