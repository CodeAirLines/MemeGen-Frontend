import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  Edit2,
  Check,
  Sparkles,
  Layers,
  Loader2,
} from 'lucide-react';
import { useEditorStore } from '../../stores/useEditorStore';

interface EditorToolbarProps {
  onBack: () => void;
  onExport: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ onBack, onExport }) => {
  const memeTitle = useEditorStore((state) => state.memeTitle);
  const setMemeTitle = useEditorStore((state) => state.setMemeTitle);
  const activeTemplate = useEditorStore((state) => state.activeTemplate);
  const canUndo = useEditorStore((state) => state.history.past.length > 0);
  const canRedo = useEditorStore((state) => state.history.future.length > 0);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const setIsResetModalOpen = useEditorStore((state) => state.setIsResetModalOpen);
  const setIsTemplatePickerOpen = useEditorStore((state) => state.setIsTemplatePickerOpen);
  const isExporting = useEditorStore((state) => state.isExporting);

  // Inline editing state for Meme Title
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [localTitle, setLocalTitle] = useState(memeTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleSaveTitle = () => {
    const trimmed = localTitle.trim();
    if (trimmed) {
      setMemeTitle(trimmed);
    } else {
      setLocalTitle(memeTitle);
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setLocalTitle(memeTitle);
      setIsEditingTitle(false);
    }
  };

  return (
    <header className="w-full bg-[#071330] border-b border-white/10 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 text-white z-30 shrink-0">
      {/* Left: Back & Title */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {/* Back Button */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-xs sm:text-sm font-semibold cursor-pointer shrink-0"
          title="Back to Gallery / Home"
          aria-label="Back to Gallery"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden md:inline">Back</span>
        </button>

        <div className="h-5 w-[1px] bg-white/15 hidden sm:block shrink-0" />

        {/* Meme Title (Inline Editable) */}
        <div className="flex items-center gap-2 min-w-0">
          {isEditingTitle ? (
            <div className="flex items-center gap-1">
              <input
                ref={inputRef}
                type="text"
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                onBlur={handleSaveTitle}
                onKeyDown={handleKeyDown}
                className="bg-slate-900 text-white text-xs sm:text-sm font-bold px-2 py-1 rounded-lg border border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-400 w-36 sm:w-56"
                maxLength={60}
              />
              <button
                type="button"
                onClick={handleSaveTitle}
                className="p-1 text-emerald-400 hover:bg-emerald-500/20 rounded-md cursor-pointer"
                title="Save title"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => {
                setLocalTitle(memeTitle);
                setIsEditingTitle(true);
              }}
              className="group flex items-center gap-1.5 cursor-pointer px-2 py-1 rounded-lg hover:bg-white/5 transition-colors min-w-0"
              title="Click to rename meme"
            >
              <h1 className="text-xs sm:text-sm md:text-base font-extrabold text-white truncate max-w-[130px] sm:max-w-[240px] md:max-w-[320px]">
                {memeTitle || 'Untitled Meme'}
              </h1>
              <Edit2 className="w-3 h-3 text-slate-400 group-hover:text-cyan-300 shrink-0 transition-colors" />
            </div>
          )}

          {/* Active Template Badge / Switcher */}
          {activeTemplate && (
            <button
              type="button"
              onClick={() => setIsTemplatePickerOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 hover:border-blue-400/60 hover:bg-blue-600/30 text-blue-300 text-xs font-medium transition-colors cursor-pointer truncate max-w-[200px]"
              title="Change Meme Template"
            >
              <Layers className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="truncate">{activeTemplate.name}</span>
            </button>
          )}
        </div>
      </div>

      {/* Right: History, Reset, Template Switch & Export Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Undo Button */}
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1 text-xs font-medium"
          title="Undo (Ctrl+Z)"
          aria-label="Undo last change"
        >
          <Undo2 className="w-4 h-4" />
          <span className="hidden xl:inline">Undo</span>
        </button>

        {/* Redo Button */}
        <button
          type="button"
          onClick={redo}
          disabled={!canRedo}
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer flex items-center gap-1 text-xs font-medium"
          title="Redo (Ctrl+Y)"
          aria-label="Redo last change"
        >
          <Redo2 className="w-4 h-4" />
          <span className="hidden xl:inline">Redo</span>
        </button>

        {/* Reset Button */}
        <button
          type="button"
          onClick={() => setIsResetModalOpen(true)}
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl border border-white/10 text-slate-300 hover:text-rose-300 hover:border-rose-500/40 hover:bg-rose-500/10 transition-all cursor-pointer flex items-center gap-1 text-xs font-medium"
          title="Reset Meme to Default"
          aria-label="Reset meme to template defaults"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden lg:inline">Reset</span>
        </button>

        {/* Change Template Button (Tablet / Mobile) */}
        <button
          type="button"
          onClick={() => setIsTemplatePickerOpen(true)}
          className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-blue-500/30 bg-blue-600/15 text-blue-200 hover:bg-blue-600/25 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          title="Change Template"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Templates</span>
        </button>

        {/* Download / Export Primary Button */}
        <button
          type="button"
          onClick={onExport}
          disabled={isExporting}
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/30 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-95 disabled:opacity-60 transition-all duration-200 flex items-center gap-1.5 sm:gap-2 cursor-pointer ml-1"
          aria-label="Export meme as PNG image"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
