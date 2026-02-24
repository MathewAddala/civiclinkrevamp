import React, { useRef, useState, useCallback, useEffect } from 'react';

export default function DesignCanvas({
  elements,
  selectedId,
  setSelectedId,
  activeTool,
  setActiveTool,
  updateElement,
  addElement,
  zoom,
  setZoom,
  canvasOffset,
  setCanvasOffset,
}) {
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [elementStart, setElementStart] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [resizing, setResizing] = useState(null);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0, ex: 0, ey: 0 });
  const [editingTextId, setEditingTextId] = useState(null);

  const CANVAS_W = 1200;
  const CANVAS_H = 800;

  const getCanvasPoint = useCallback((e) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: (e.clientX - rect.left - canvasOffset.x) / zoom,
      y: (e.clientY - rect.top - canvasOffset.y) / zoom,
    };
  }, [zoom, canvasOffset]);

  // Mouse down on canvas
  const handleCanvasMouseDown = useCallback((e) => {
    if (e.target !== canvasRef.current && !e.target.classList.contains('canvas-bg')) return;
    
    if (activeTool === 'hand') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y });
      return;
    }
    setSelectedId(null);
  }, [activeTool, canvasOffset, setSelectedId]);

  // Element drag start
  const handleElementMouseDown = useCallback((e, elementId) => {
    e.stopPropagation();
    const el = elements.find((e) => e.id === elementId);
    if (!el || el.locked) return;

    setSelectedId(elementId);

    if (activeTool === 'select') {
      setIsDragging(true);
      const point = getCanvasPoint(e);
      setDragStart(point);
      setElementStart({ x: el.x, y: el.y });
    }
  }, [elements, activeTool, setSelectedId, getCanvasPoint]);

  // Resize handle start
  const handleResizeMouseDown = useCallback((e, handle) => {
    e.stopPropagation();
    const el = elements.find((e) => e.id === selectedId);
    if (!el) return;
    setResizing(handle);
    const point = getCanvasPoint(e);
    setResizeStart({ x: point.x, y: point.y, w: el.width, h: el.height, ex: el.x, ey: el.y });
  }, [elements, selectedId, getCanvasPoint]);

  // Mouse move
  const handleMouseMove = useCallback((e) => {
    if (isPanning) {
      setCanvasOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    if (isDragging && selectedId) {
      const point = getCanvasPoint(e);
      const dx = point.x - dragStart.x;
      const dy = point.y - dragStart.y;
      updateElement(selectedId, {
        x: Math.round(elementStart.x + dx),
        y: Math.round(elementStart.y + dy),
      });
    }

    if (resizing && selectedId) {
      const point = getCanvasPoint(e);
      const dx = point.x - resizeStart.x;
      const dy = point.y - resizeStart.y;
      const el = elements.find((e) => e.id === selectedId);
      if (!el) return;

      let updates = {};
      if (resizing.includes('e')) {
        updates.width = Math.max(20, resizeStart.w + dx);
      }
      if (resizing.includes('w')) {
        const newW = Math.max(20, resizeStart.w - dx);
        updates.width = newW;
        updates.x = resizeStart.ex + (resizeStart.w - newW);
      }
      if (resizing.includes('s')) {
        updates.height = Math.max(20, resizeStart.h + dy);
      }
      if (resizing.includes('n')) {
        const newH = Math.max(20, resizeStart.h - dy);
        updates.height = newH;
        updates.y = resizeStart.ey + (resizeStart.h - newH);
      }
      updateElement(selectedId, updates);
    }
  }, [isPanning, isDragging, resizing, selectedId, panStart, dragStart, elementStart, resizeStart, getCanvasPoint, updateElement, elements, setCanvasOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsPanning(false);
    setResizing(null);
  }, []);

  // Zoom with wheel
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom((prev) => Math.min(3, Math.max(0.1, prev + delta)));
    } else {
      setCanvasOffset((prev) => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  }, [setZoom, setCanvasOffset]);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Double click text to edit
  const handleElementDoubleClick = useCallback((e, elementId) => {
    const el = elements.find((e) => e.id === elementId);
    if (el?.type === 'text') {
      setEditingTextId(elementId);
    }
  }, [elements]);

  const renderElement = (el) => {
    const isSelected = el.id === selectedId;
    const isEditing = editingTextId === el.id;

    if (!el.visible) return null;

    const commonStyle = {
      position: 'absolute',
      left: el.x,
      top: el.y,
      width: el.width,
      height: el.height,
      opacity: el.opacity,
      transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
      cursor: el.locked ? 'default' : (activeTool === 'select' ? 'move' : 'default'),
    };

    return (
      <div key={el.id} style={commonStyle}>
        {el.type === 'text' ? (
          isEditing ? (
            <textarea
              autoFocus
              value={el.text}
              onChange={(e) => updateElement(el.id, { text: e.target.value })}
              onBlur={() => setEditingTextId(null)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setEditingTextId(null);
              }}
              className="w-full h-full bg-transparent border-2 border-[#3b82f6] rounded resize-none outline-none p-1"
              style={{
                color: el.fill,
                fontSize: el.fontSize,
                fontWeight: el.fontWeight,
                fontFamily: 'Inter, sans-serif',
              }}
            />
          ) : (
            <div
              onMouseDown={(e) => handleElementMouseDown(e, el.id)}
              onDoubleClick={(e) => handleElementDoubleClick(e, el.id)}
              className="w-full h-full select-none"
              style={{
                color: el.fill,
                fontSize: el.fontSize,
                fontWeight: el.fontWeight,
                fontFamily: 'Inter, sans-serif',
                lineHeight: 1.4,
              }}
            >
              {el.text}
            </div>
          )
        ) : (
          <div
            onMouseDown={(e) => handleElementMouseDown(e, el.id)}
            onDoubleClick={(e) => handleElementDoubleClick(e, el.id)}
            className="w-full h-full"
            style={{
              backgroundColor: el.fill,
              borderRadius: el.borderRadius || 0,
              border: el.strokeWidth > 0 ? `${el.strokeWidth}px solid ${el.stroke}` : 'none',
            }}
          />
        )}

        {/* Selection handles */}
        {isSelected && !el.locked && (
          <>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                border: '2px solid #3b82f6',
                borderRadius: el.type === 'text' ? 2 : el.borderRadius || 0,
              }}
            />
            {/* Corner handles */}
            {['nw', 'ne', 'sw', 'se'].map((handle) => (
              <div
                key={handle}
                onMouseDown={(e) => handleResizeMouseDown(e, handle)}
                className="absolute w-3 h-3 bg-white border-2 border-[#3b82f6] rounded-sm"
                style={{
                  cursor: handle === 'nw' || handle === 'se' ? 'nwse-resize' : 'nesw-resize',
                  ...(handle.includes('n') ? { top: -6 } : { bottom: -6 }),
                  ...(handle.includes('w') ? { left: -6 } : { right: -6 }),
                }}
              />
            ))}
            {/* Edge handles */}
            {['n', 's', 'e', 'w'].map((handle) => (
              <div
                key={handle}
                onMouseDown={(e) => handleResizeMouseDown(e, handle)}
                className="absolute bg-white border-2 border-[#3b82f6] rounded-sm"
                style={{
                  cursor: handle === 'n' || handle === 's' ? 'ns-resize' : 'ew-resize',
                  ...(handle === 'n' && { top: -4, left: '50%', transform: 'translateX(-50%)', width: 10, height: 6 }),
                  ...(handle === 's' && { bottom: -4, left: '50%', transform: 'translateX(-50%)', width: 10, height: 6 }),
                  ...(handle === 'e' && { right: -4, top: '50%', transform: 'translateY(-50%)', width: 6, height: 10 }),
                  ...(handle === 'w' && { left: -4, top: '50%', transform: 'translateY(-50%)', width: 6, height: 10 }),
                }}
              />
            ))}
          </>
        )}
      </div>
    );
  };

  const cursorClass =
    activeTool === 'hand'
      ? isPanning ? 'cursor-grabbing' : 'cursor-grab'
      : activeTool === 'select'
      ? 'cursor-default'
      : 'cursor-crosshair';

  return (
    <div
      ref={canvasRef}
      className={`flex-1 relative overflow-hidden bg-[#11111b] ${cursorClass}`}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle, #313244 1px, transparent 1px)
          `,
          backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
          backgroundPosition: `${canvasOffset.x % (24 * zoom)}px ${canvasOffset.y % (24 * zoom)}px`,
          opacity: 0.4,
        }}
      />

      {/* Canvas artboard */}
      <div
        className="canvas-bg absolute"
        style={{
          left: canvasOffset.x,
          top: canvasOffset.y,
          width: CANVAS_W * zoom,
          height: CANVAS_H * zoom,
          transform: `scale(1)`,
          transformOrigin: 'top left',
        }}
      >
        <div
          className="canvas-bg relative bg-[#1e1e2e] shadow-2xl"
          style={{
            width: CANVAS_W,
            height: CANVAS_H,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            boxShadow: '0 0 0 1px rgba(49,50,68,0.6), 0 25px 50px rgba(0,0,0,0.5)',
          }}
          onMouseDown={handleCanvasMouseDown}
        >
          {elements.map(renderElement)}
        </div>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-[#181825]/90 backdrop-blur border border-[#313244] rounded-lg px-3 py-1.5 text-xs text-[#a6adc8]">
        <span>{Math.round(zoom * 100)}%</span>
      </div>

      {/* Coordinates */}
      {selectedId && (
        <div className="absolute bottom-4 right-4 flex items-center gap-3 bg-[#181825]/90 backdrop-blur border border-[#313244] rounded-lg px-3 py-1.5 text-xs text-[#a6adc8]">
          {(() => {
            const el = elements.find((e) => e.id === selectedId);
            if (!el) return null;
            return (
              <>
                <span>X: {Math.round(el.x)}</span>
                <span>Y: {Math.round(el.y)}</span>
                <span>W: {Math.round(el.width)}</span>
                <span>H: {Math.round(el.height)}</span>
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
