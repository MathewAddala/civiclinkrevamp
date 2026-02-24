import React, { useState, useCallback, useRef, useEffect } from 'react';
import DesignToolbar from '../components/design-tool/DesignToolbar.jsx';
import DesignCanvas from '../components/design-tool/DesignCanvas.jsx';
import LayersPanel from '../components/design-tool/LayersPanel.jsx';
import PropertiesPanel from '../components/design-tool/PropertiesPanel.jsx';
import DesignTopBar from '../components/design-tool/DesignTopBar.jsx';

const generateId = () => Math.random().toString(36).substring(2, 9);

const DEFAULT_ELEMENTS = [
  {
    id: generateId(),
    type: 'rectangle',
    x: 120,
    y: 100,
    width: 280,
    height: 180,
    fill: '#3b82f6',
    stroke: '#2563eb',
    strokeWidth: 0,
    rotation: 0,
    opacity: 1,
    borderRadius: 12,
    name: 'Blue Card',
    locked: false,
    visible: true,
  },
  {
    id: generateId(),
    type: 'rectangle',
    x: 460,
    y: 140,
    width: 220,
    height: 220,
    fill: '#8b5cf6',
    stroke: '#7c3aed',
    strokeWidth: 0,
    rotation: 0,
    opacity: 1,
    borderRadius: 110,
    name: 'Purple Circle',
    locked: false,
    visible: true,
  },
  {
    id: generateId(),
    type: 'text',
    x: 140,
    y: 340,
    width: 300,
    height: 50,
    fill: '#f8fafc',
    text: 'Design Tool',
    fontSize: 36,
    fontWeight: 'bold',
    rotation: 0,
    opacity: 1,
    name: 'Heading Text',
    locked: false,
    visible: true,
  },
  {
    id: generateId(),
    type: 'rectangle',
    x: 140,
    y: 410,
    width: 540,
    height: 3,
    fill: '#334155',
    stroke: 'transparent',
    strokeWidth: 0,
    rotation: 0,
    opacity: 0.6,
    borderRadius: 2,
    name: 'Divider',
    locked: false,
    visible: true,
  },
  {
    id: generateId(),
    type: 'text',
    x: 140,
    y: 440,
    width: 540,
    height: 60,
    fill: '#94a3b8',
    text: 'Click elements to select. Drag to move. Use the toolbar to add shapes and text.',
    fontSize: 16,
    fontWeight: 'normal',
    rotation: 0,
    opacity: 1,
    name: 'Body Text',
    locked: false,
    visible: true,
  },
];

export default function DesignToolPage() {
  const [elements, setElements] = useState(DEFAULT_ELEMENTS);
  const [selectedId, setSelectedId] = useState(null);
  const [activeTool, setActiveTool] = useState('select');
  const [zoom, setZoom] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState([DEFAULT_ELEMENTS]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [fileName, setFileName] = useState('Untitled Design');

  const pushHistory = useCallback((newElements) => {
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      return [...trimmed, newElements];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setElements(history[newIndex]);
    }
  }, [historyIndex, history]);

  const selectedElement = elements.find((el) => el.id === selectedId) || null;

  const addElement = useCallback((type) => {
    const newEl = {
      id: generateId(),
      type,
      x: 200 + Math.random() * 100,
      y: 200 + Math.random() * 100,
      width: type === 'text' ? 200 : 160,
      height: type === 'text' ? 40 : 160,
      fill: type === 'text' ? '#f8fafc' : '#3b82f6',
      stroke: 'transparent',
      strokeWidth: 0,
      rotation: 0,
      opacity: 1,
      borderRadius: type === 'circle' ? 999 : 8,
      name: type === 'text' ? 'Text Layer' : type === 'circle' ? 'Ellipse' : 'Rectangle',
      locked: false,
      visible: true,
      ...(type === 'text' && {
        text: 'Type here',
        fontSize: 20,
        fontWeight: 'normal',
      }),
      ...(type === 'circle' && {
        borderRadius: 999,
      }),
    };
    const next = [...elements, newEl];
    setElements(next);
    setSelectedId(newEl.id);
    pushHistory(next);
    setActiveTool('select');
  }, [elements, pushHistory]);

  const updateElement = useCallback((id, updates) => {
    const next = elements.map((el) => (el.id === id ? { ...el, ...updates } : el));
    setElements(next);
    pushHistory(next);
  }, [elements, pushHistory]);

  const deleteElement = useCallback((id) => {
    const next = elements.filter((el) => el.id !== id);
    setElements(next);
    setSelectedId(null);
    pushHistory(next);
  }, [elements, pushHistory]);

  const duplicateElement = useCallback((id) => {
    const el = elements.find((e) => e.id === id);
    if (!el) return;
    const dup = { ...el, id: generateId(), x: el.x + 20, y: el.y + 20, name: el.name + ' Copy' };
    const next = [...elements, dup];
    setElements(next);
    setSelectedId(dup.id);
    pushHistory(next);
  }, [elements, pushHistory]);

  const moveElementOrder = useCallback((id, direction) => {
    const idx = elements.findIndex((e) => e.id === id);
    if (idx === -1) return;
    const next = [...elements];
    if (direction === 'up' && idx < next.length - 1) {
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
    } else if (direction === 'down' && idx > 0) {
      [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
    }
    setElements(next);
    pushHistory(next);
  }, [elements, pushHistory]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'd' && selectedId) {
        e.preventDefault();
        duplicateElement(selectedId);
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          e.preventDefault();
          deleteElement(selectedId);
        }
      }
      if (e.key === 'Escape') {
        setSelectedId(null);
        setActiveTool('select');
      }
      if (e.key === 'v') setActiveTool('select');
      if (e.key === 'r') setActiveTool('rectangle');
      if (e.key === 'o') setActiveTool('circle');
      if (e.key === 't') setActiveTool('text');
      if (e.key === 'h') setActiveTool('hand');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, undo, redo, duplicateElement, deleteElement]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#1e1e2e] text-[#cdd6f4]">
      <DesignTopBar
        fileName={fileName}
        setFileName={setFileName}
        undo={undo}
        redo={redo}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        zoom={zoom}
        setZoom={setZoom}
      />
      <div className="flex flex-1 overflow-hidden">
        <DesignToolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          addElement={addElement}
        />
        <div className="flex flex-1 overflow-hidden">
          <LayersPanel
            elements={elements}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            updateElement={updateElement}
            moveElementOrder={moveElementOrder}
            deleteElement={deleteElement}
          />
          <DesignCanvas
            elements={elements}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            updateElement={updateElement}
            addElement={addElement}
            zoom={zoom}
            setZoom={setZoom}
            canvasOffset={canvasOffset}
            setCanvasOffset={setCanvasOffset}
          />
          <PropertiesPanel
            selectedElement={selectedElement}
            updateElement={updateElement}
            deleteElement={deleteElement}
            duplicateElement={duplicateElement}
          />
        </div>
      </div>
    </div>
  );
}
