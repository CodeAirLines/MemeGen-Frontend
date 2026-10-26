import React, { useRef, useState, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  Trash2,
  Copy,
  ImageOff,
} from 'lucide-react';
import type { TextLayer } from '../../types/editor';
import { useEditorStore } from '../../stores/useEditorStore';

interface MemeCanvasProps {
  onCanvasSizeChange?: (width: number, height: number) => void;
}

export const MemeCanvas: React.FC<MemeCanvasProps> = ({ onCanvasSizeChange }) => {
  const activeTemplate = useEditorStore((state) => state.activeTemplate);
  const textLayers = useEditorStore((state) => state.textLayers);
  const selectedLayerId = useEditorStore((state) => state.selectedLayerId);
  const canvasSettings = useEditorStore((state) => state.canvasSettings);

  const selectLayer = useEditorStore((state) => state.selectLayer);
  const updateTextLayer = useEditorStore((state) => state.updateTextLayer);
  const deleteTextLayer = useEditorStore((state) => state.deleteTextLayer);
  const duplicateTextLayer = useEditorStore((state) => state.duplicateTextLayer);
  const zoomIn = useEditorStore((state) => state.zoomIn);
  const zoomOut = useEditorStore((state) => state.zoomOut);
  const resetZoom = useEditorStore((state) => state.resetZoom);
  const toggleFitToScreen = useEditorStore((state) => state.toggleFitToScreen);
  const toggleGrid = useEditorStore((state) => state.toggleGrid);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [prevTemplateId, setPrevTemplateId] = useState<string | null>(activeTemplate?.id || null);

  // Sync image error/loaded state during render when template changes
  if (activeTemplate && activeTemplate.id !== prevTemplateId) {
    setPrevTemplateId(activeTemplate.id);
    setImageError(false);
    setImageLoaded(false);
  }

  // Notify parent of actual rendered image dimensions for export reference
  useEffect(() => {
    if (imageRef.current && imageLoaded) {
      const w = imageRef.current.clientWidth;
      const h = imageRef.current.clientHeight;
      if (w > 0 && h > 0 && onCanvasSizeChange) {
        onCanvasSizeChange(w, h);
      }
    }
  }, [imageLoaded, activeTemplate, onCanvasSizeChange]);

  // Handle window resize to keep export scale accurate
  useEffect(() => {
    const handleResize = () => {
      if (imageRef.current && onCanvasSizeChange) {
        onCanvasSizeChange(imageRef.current.clientWidth, imageRef.current.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [onCanvasSizeChange]);

  const memeTitle = useEditorStore((state) => state.memeTitle);
  const pushHistorySnapshot = useEditorStore((state) => state.pushHistorySnapshot);

  // -------------------------------------------------------------
  // Dragging logic with Pointer Events (Mouse, Touch, Pen)
  // -------------------------------------------------------------
  const [isDragging, setIsDragging] = useState(false);
  const dragStartSnapshotRef = useRef<{
    textLayers: TextLayer[];
    memeTitle: string;
  } | null>(null);
  const dragInfoRef = useRef<{
    layerId: string;
    startX: number;
    startY: number;
    startLayerX: number;
    startLayerY: number;
    rect: DOMRect;
  } | null>(null);
  const capturedElementRef = useRef<HTMLElement | null>(null);
  const activePointerIdRef = useRef<number | null>(null);

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    layer: TextLayer
  ) => {
    e.stopPropagation();
    e.preventDefault();
    selectLayer(layer.id);

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    dragStartSnapshotRef.current = {
      textLayers: JSON.parse(JSON.stringify(textLayers)),
      memeTitle,
    };

    dragInfoRef.current = {
      layerId: layer.id,
      startX: e.clientX,
      startY: e.clientY,
      startLayerX: layer.xPercent,
      startLayerY: layer.yPercent,
      rect,
    };
    setIsDragging(true);

    const targetEl = e.currentTarget as HTMLElement;
    try {
      targetEl.setPointerCapture(e.pointerId);
      capturedElementRef.current = targetEl;
      activePointerIdRef.current = e.pointerId;
    } catch {
      // Browser pointer capture fallback
    }

    const onPointerMove = (moveEvent: PointerEvent) => {
      if (!dragInfoRef.current) return;
      const { layerId, startX, startY, startLayerX, startLayerY, rect } =
        dragInfoRef.current;

      const deltaXPercent = ((moveEvent.clientX - startX) / rect.width) * 100;
      const deltaYPercent = ((moveEvent.clientY - startY) / rect.height) * 100;

      const newX = Math.max(2, Math.min(98, Number((startLayerX + deltaXPercent).toFixed(1))));
      const newY = Math.max(2, Math.min(98, Number((startLayerY + deltaYPercent).toFixed(1))));

      updateTextLayer(layerId, { xPercent: newX, yPercent: newY }, false);
    };

    const onPointerUp = () => {
      setIsDragging(false);
      dragInfoRef.current = null;
      if (dragStartSnapshotRef.current) {
        pushHistorySnapshot(dragStartSnapshotRef.current);
        dragStartSnapshotRef.current = null;
      }

      if (capturedElementRef.current && activePointerIdRef.current !== null) {
        try {
          capturedElementRef.current.releasePointerCapture(activePointerIdRef.current);
        } catch {
          // Already released
        }
        capturedElementRef.current = null;
        activePointerIdRef.current = null;
      }

      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };

  const handleWorkspaceClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectLayer(null);
    }
  };

  if (!activeTemplate) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <ImageOff className="w-12 h-12 text-slate-600 mb-3" />
        <h3 className="text-lg font-semibold text-slate-200">No Template Selected</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">
          Please select a template from the template library to begin creating your meme.
        </p>
      </div>
    );
  }

  const zoomFactor = canvasSettings.zoom;

  return (
    <div
      className={`relative w-full h-full flex-1 flex flex-col items-center justify-center overflow-auto p-2 sm:p-8 select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-default'
      }`}
      onClick={handleWorkspaceClick}
      style={{
        backgroundColor: '#070d1e',
        backgroundImage: canvasSettings.showGrid
          ? 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)'
          : undefined,
        backgroundSize: '24px 24px',
      }}
    >
      {/* Centered Scalable Workspace */}
      <div
        className="transition-transform duration-150 ease-out origin-center flex items-center justify-center"
        style={{
          transform: `scale(${zoomFactor})`,
        }}
      >
        <div
          ref={containerRef}
          className="relative inline-block rounded-xl overflow-hidden shadow-2xl border border-slate-700/60 bg-slate-950 transition-all"
          style={{
            maxWidth: canvasSettings.fitToScreen ? 'min(86vw, 680px)' : 'none',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget || e.target === imageRef.current) {
              selectLayer(null);
            }
          }}
        >
          {/* Base Template Image */}
          {!imageError ? (
            <img
              ref={imageRef}
              src={activeTemplate.imageUrl}
              alt={activeTemplate.name}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              crossOrigin="anonymous"
              className="w-auto h-auto max-h-[36vh] xs:max-h-[42vh] sm:max-h-[50vh] lg:max-h-[62vh] min-h-[160px] sm:min-h-[220px] max-w-full object-contain pointer-events-auto select-none block"
              draggable={false}
            />
          ) : (
            <div className="w-[480px] max-w-full h-[360px] bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
              <ImageOff className="w-10 h-10 text-slate-500 mb-2" />
              <p className="text-sm font-semibold text-slate-300">{activeTemplate.name}</p>
              <p className="text-xs text-slate-500 mt-1">Image preview could not be loaded</p>
            </div>
          )}

          {/* Render Text Layers */}
          {textLayers.map((layer) => {
            const isSelected = selectedLayerId === layer.id;
            const displayText = layer.isUppercase
              ? layer.text.toUpperCase()
              : layer.text;

            return (
              <div
                key={layer.id}
                onPointerDown={(e) => handlePointerDown(e, layer)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move group touch-none select-none transition-shadow ${
                  isSelected
                    ? 'ring-2 ring-blue-500/90 ring-offset-2 ring-offset-black/50 z-30'
                    : 'hover:ring-1 hover:ring-blue-400/50 z-20'
                }`}
                style={{
                  left: `${layer.xPercent}%`,
                  top: `${layer.yPercent}%`,
                  transform: `translate(-50%, -50%) rotate(${layer.rotation}deg)`,
                  maxWidth: '94%',
                }}
              >
                {/* Text Display */}
                <div
                  className="px-2 py-0.5 whitespace-pre-wrap break-words font-extrabold tracking-wide"
                  style={{
                    fontFamily: `${layer.fontFamily}, Impact, 'Space Grotesk', sans-serif`,
                    fontSize: `${layer.fontSize}px`,
                    fontWeight: layer.isBold ? 800 : 500,
                    fontStyle: layer.isItalic ? 'italic' : 'normal',
                    textAlign: layer.alignment,
                    color: layer.color,
                    opacity: layer.opacity ?? 1,
                    WebkitTextStroke:
                      layer.strokeWidth > 0
                        ? `${layer.strokeWidth}px ${layer.strokeColor}`
                        : undefined,
                    paintOrder: 'stroke fill',
                    textShadow:
                      layer.strokeWidth === 0
                        ? '0 2px 8px rgba(0,0,0,0.85)'
                        : undefined,
                    lineHeight: 1.15,
                  }}
                >
                  {displayText || (
                    <span className="italic opacity-40 text-xs font-normal">
                      (Empty caption)
                    </span>
                  )}
                </div>

                {/* Selection Badges & Controls Overlay */}
                {isSelected && (
                  <>
                    {/* Top / Bottom floating mini quick-action toolbar */}
                    <div
                      className={`absolute ${layer.yPercent < 18 ? 'top-full mt-2' : '-top-9'} left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-900/95 border border-blue-500/40 rounded-lg px-1.5 py-1 shadow-lg backdrop-blur-md pointer-events-auto z-30`}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          duplicateTextLayer(layer.id);
                        }}
                        title="Duplicate layer"
                        className="p-1.5 sm:p-1 min-w-[28px] min-h-[28px] flex items-center justify-center rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                        aria-label="Duplicate layer"
                      >
                        <Copy className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTextLayer(layer.id);
                        }}
                        title="Delete layer"
                        className="p-1.5 sm:p-1 min-w-[28px] min-h-[28px] flex items-center justify-center rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 transition-colors cursor-pointer"
                        aria-label="Delete layer"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                      </button>
                      <div className="w-[1px] h-3 bg-white/20 mx-0.5" />
                      <span className="text-[10px] text-blue-300 font-mono px-0.5">
                        {Math.round(layer.xPercent)}%, {Math.round(layer.yPercent)}%
                      </span>
                    </div>

                    {/* Corner Handle Indicators */}
                    <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-blue-500 border border-white rounded-xs pointer-events-none" />
                    <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-blue-500 border border-white rounded-xs pointer-events-none" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-blue-500 border border-white rounded-xs pointer-events-none" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-500 border border-white rounded-xs pointer-events-none" />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Canvas Controls Overlay (Bottom Center) */}
      <nav
        aria-label="Canvas zoom and view controls"
        className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 backdrop-blur-xl border border-white/10 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full shadow-2xl flex items-center gap-1 sm:gap-2 text-xs text-slate-300"
      >
        <button
          type="button"
          onClick={zoomOut}
          title="Zoom Out (Ctrl -)"
          className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
          disabled={canvasSettings.zoom <= 0.3}
          aria-label="Zoom out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={resetZoom}
          title="Reset Zoom to 100%"
          className="px-2 py-1 min-h-[32px] flex items-center justify-center rounded-md hover:bg-white/10 text-[11px] font-mono font-semibold text-slate-200 transition-colors cursor-pointer"
          aria-label={`Current zoom ${Math.round(canvasSettings.zoom * 100)} percent. Click to reset to 100 percent.`}
        >
          {Math.round(canvasSettings.zoom * 100)}%
        </button>

        <button
          type="button"
          onClick={zoomIn}
          title="Zoom In (Ctrl +)"
          className="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full hover:bg-white/10 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
          disabled={canvasSettings.zoom >= 2.5}
          aria-label="Zoom in"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-white/15 mx-0.5" />

        <button
          type="button"
          onClick={toggleFitToScreen}
          title={canvasSettings.fitToScreen ? 'Disable Fit to Screen' : 'Fit to Screen'}
          className={`p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full transition-colors cursor-pointer ${
            canvasSettings.fitToScreen
              ? 'bg-blue-600/30 text-cyan-300'
              : 'hover:bg-white/10 hover:text-white'
          }`}
          aria-label="Toggle fit to screen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={toggleGrid}
          title={canvasSettings.showGrid ? 'Hide Dot Grid' : 'Show Dot Grid'}
          className={`p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-full transition-colors cursor-pointer ${
            canvasSettings.showGrid
              ? 'bg-blue-600/30 text-cyan-300'
              : 'hover:bg-white/10 hover:text-white'
          }`}
          aria-label="Toggle workspace grid"
        >
          <Grid className="w-3.5 h-3.5" />
        </button>
      </nav>
    </div>
  );
};
