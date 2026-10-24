import React, { useState, useRef } from 'react';
import {
  Type,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Sliders,
  Layers,
  RotateCw,
  Sparkles,
} from 'lucide-react';
import type { TextLayer } from '../../types/editor';
import { useEditorStore } from '../../stores/useEditorStore';

const FONT_OPTIONS = [
  { label: 'Impact (Classic Meme)', value: 'Impact' },
  { label: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans' },
  { label: 'Inter', value: 'Inter' },
  { label: 'Comic Sans MS', value: 'Comic Sans MS' },
  { label: 'Arvo (Serif)', value: 'Arvo' },
  { label: 'Oleo Script (Cursive)', value: 'Oleo Script' },
  { label: 'Arial Black', value: 'Arial Black' },
  { label: 'Courier New (Mono)', value: 'Courier New' },
];

const PRESET_COLORS = [
  '#FFFFFF',
  '#000000',
  '#FACC15', // Yellow
  '#EF4444', // Red
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#A855F7', // Purple
  '#06B6D4', // Cyan
];

type MobileTab = 'text' | 'style' | 'layers';

export const EditorPropertiesPanel: React.FC = () => {
  const textLayers = useEditorStore((state) => state.textLayers);
  const selectedLayerId = useEditorStore((state) => state.selectedLayerId);
  const memeTitle = useEditorStore((state) => state.memeTitle);
  const selectLayer = useEditorStore((state) => state.selectLayer);
  const addTextLayer = useEditorStore((state) => state.addTextLayer);
  const updateTextLayer = useEditorStore((state) => state.updateTextLayer);
  const pushHistorySnapshot = useEditorStore((state) => state.pushHistorySnapshot);
  const deleteTextLayer = useEditorStore((state) => state.deleteTextLayer);
  const duplicateTextLayer = useEditorStore((state) => state.duplicateTextLayer);
  const moveLayerOrder = useEditorStore((state) => state.moveLayerOrder);

  const [mobileTab, setMobileTab] = useState<MobileTab>('text');

  const selectedLayer = textLayers.find((l) => l.id === selectedLayerId);

  const textInputSnapshotRef = useRef<{ textLayers: TextLayer[]; memeTitle: string } | null>(null);
  const sliderSnapshotRef = useRef<{ textLayers: TextLayer[]; memeTitle: string } | null>(null);

  const handleTextFocus = () => {
    textInputSnapshotRef.current = {
      textLayers: JSON.parse(JSON.stringify(textLayers)),
      memeTitle,
    };
  };

  const handleTextBlur = () => {
    if (textInputSnapshotRef.current) {
      pushHistorySnapshot(textInputSnapshotRef.current);
      textInputSnapshotRef.current = null;
    }
  };

  const handleSliderStart = () => {
    if (!sliderSnapshotRef.current) {
      sliderSnapshotRef.current = {
        textLayers: JSON.parse(JSON.stringify(textLayers)),
        memeTitle,
      };
    }
  };

  const handleSliderEnd = () => {
    if (sliderSnapshotRef.current) {
      pushHistorySnapshot(sliderSnapshotRef.current);
      sliderSnapshotRef.current = null;
    }
  };

  // Quick preset positioning
  const setPositionPreset = (preset: 'top' | 'middle' | 'bottom') => {
    if (!selectedLayer) return;
    let y = 50;
    if (preset === 'top') y = 12;
    if (preset === 'bottom') y = 88;
    updateTextLayer(selectedLayer.id, { xPercent: 50, yPercent: y }, true);
  };

  return (
    <aside
      aria-label="Meme text and layer controls"
      className="w-full lg:w-84 xl:w-96 bg-[#071330] border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col shrink-0 text-slate-100 max-h-[50vh] lg:max-h-none overflow-y-auto"
    >
      {/* Mobile Tab Navigation */}
      <nav
        aria-label="Editor sections"
        className="flex lg:hidden border-b border-white/10 bg-slate-950/40 p-1.5 gap-1 shrink-0"
      >
        <button
          type="button"
          onClick={() => setMobileTab('text')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            mobileTab === 'text'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Text content tab"
        >
          <Type className="w-3.5 h-3.5" />
          <span>Text</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('style')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            mobileTab === 'style'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Text styling tab"
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Style</span>
        </button>

        <button
          type="button"
          onClick={() => setMobileTab('layers')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            mobileTab === 'layers'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
          aria-label="Layers management tab"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Layers ({textLayers.length})</span>
        </button>
      </nav>

      {/* Main Controls Body */}
      <div className="p-4 sm:p-5 space-y-6 flex-1">
        {/* ========================================================= */}
        {/* SECTION 1: LAYERS LIST                                    */}
        {/* ========================================================= */}
        <section
          aria-label="Text layers"
          className={`${mobileTab !== 'layers' ? 'hidden lg:block' : 'block'} space-y-3`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Captions / Layers ({textLayers.length})</span>
            </div>

            <button
              type="button"
              onClick={() => addTextLayer()}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Add Text</span>
            </button>
          </div>

          {/* Layer Cards */}
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {textLayers.map((layer, idx) => {
              const isSelected = layer.id === selectedLayerId;
              return (
                <div
                  key={layer.id}
                  onClick={() => selectLayer(layer.id)}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500/80 text-white ring-1 ring-blue-500/40'
                      : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-white/20 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                      {idx + 1}
                    </span>
                    <span className="font-semibold truncate max-w-[140px] sm:max-w-[180px]">
                      {layer.text || '(Empty caption)'}
                    </span>
                  </div>

                  {/* Quick Layer Reorder & Delete */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLayerOrder(layer.id, 'up');
                      }}
                      disabled={idx === textLayers.length - 1}
                      title="Move up"
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveLayerOrder(layer.id, 'down');
                      }}
                      disabled={idx === 0}
                      title="Move down"
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTextLayer(layer.id);
                      }}
                      title="Delete layer"
                      className="p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 rounded-md cursor-pointer ml-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Selected Layer Contextual Controls */}
        {selectedLayer ? (
          <>
            {/* ========================================================= */}
            {/* SECTION 2: CAPTION TEXT INPUT                             */}
            {/* ========================================================= */}
            <div
              className={`${mobileTab !== 'text' ? 'hidden lg:block' : 'block'} space-y-3.5`}
            >
              <div className="flex items-center justify-between">
                <label
                  htmlFor="editor-caption-input"
                  className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5"
                >
                  <Type className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Caption Text</span>
                </label>

                {/* Quick Preset Positions */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPositionPreset('top')}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
                  >
                    Top
                  </button>
                  <button
                    type="button"
                    onClick={() => setPositionPreset('middle')}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    onClick={() => setPositionPreset('bottom')}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
                  >
                    Bottom
                  </button>
                </div>
              </div>

              <textarea
                id="editor-caption-input"
                rows={3}
                value={selectedLayer.text}
                onFocus={handleTextFocus}
                onChange={(e) =>
                  updateTextLayer(selectedLayer.id, { text: e.target.value }, false)
                }
                onBlur={handleTextBlur}
                placeholder="Enter caption text..."
                className="w-full bg-slate-900 text-slate-100 placeholder:text-slate-600 rounded-xl border border-white/15 p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-bold resize-none"
              />

              {/* Action buttons under text: Duplicate / Delete */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => duplicateTextLayer(selectedLayer.id)}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Duplicate Layer</span>
                </button>

                <button
                  type="button"
                  onClick={() => deleteTextLayer(selectedLayer.id)}
                  className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 px-2.5 py-1.5 rounded-lg hover:bg-rose-500/15 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Layer</span>
                </button>
              </div>
            </div>

            {/* ========================================================= */}
            {/* SECTION 3: TYPOGRAPHY & STYLING                          */}
            {/* ========================================================= */}
            <div
              className={`${mobileTab !== 'style' ? 'hidden lg:block' : 'block'} space-y-4 pt-2 border-t border-white/10`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>Typography & Style</span>
              </div>

              {/* Font Family Selector */}
              <div className="space-y-1.5">
                <label
                  htmlFor="editor-font-family"
                  className="text-xs text-slate-300 font-medium"
                >
                  Font Family
                </label>
                <select
                  id="editor-font-family"
                  value={selectedLayer.fontFamily}
                  onChange={(e) =>
                    updateTextLayer(selectedLayer.id, { fontFamily: e.target.value }, true)
                  }
                  className="w-full bg-slate-900 text-slate-100 rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {FONT_OPTIONS.map((font) => (
                    <option key={font.value} value={font.value} className="bg-slate-900 text-white">
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Font Size Slider & Number */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="editor-font-size-slider" className="text-slate-300 font-medium">
                    Font Size
                  </label>
                  <span className="font-mono text-cyan-400 font-semibold">
                    {selectedLayer.fontSize}px
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    id="editor-font-size-slider"
                    type="range"
                    min={14}
                    max={96}
                    value={selectedLayer.fontSize}
                    onPointerDown={handleSliderStart}
                    onPointerUp={handleSliderEnd}
                    onTouchStart={handleSliderStart}
                    onTouchEnd={handleSliderEnd}
                    onBlur={handleSliderEnd}
                    onChange={(e) =>
                      updateTextLayer(
                        selectedLayer.id,
                        { fontSize: Number(e.target.value) },
                        false
                      )
                    }
                    className="flex-1 accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <input
                    type="number"
                    min={12}
                    max={120}
                    value={selectedLayer.fontSize}
                    onChange={(e) => {
                      const val = Math.max(12, Math.min(120, parseInt(e.target.value, 10) || 12));
                      updateTextLayer(selectedLayer.id, { fontSize: val }, true);
                    }}
                    className="w-14 bg-slate-900 text-slate-100 text-xs font-mono px-2 py-1 rounded-lg border border-white/15 text-center focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Toggles: Bold, Italic, Uppercase, Alignment */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                {/* Format buttons */}
                <div className="flex items-center rounded-xl bg-slate-900 border border-white/15 p-1 gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      updateTextLayer(
                        selectedLayer.id,
                        { isBold: !selectedLayer.isBold },
                        true
                      )
                    }
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      selectedLayer.isBold
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Bold"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateTextLayer(
                        selectedLayer.id,
                        { isItalic: !selectedLayer.isItalic },
                        true
                      )
                    }
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      selectedLayer.isItalic
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Italic"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      updateTextLayer(
                        selectedLayer.id,
                        { isUppercase: !selectedLayer.isUppercase },
                        true
                      )
                    }
                    className={`px-2 py-1 rounded-lg text-xs font-black transition-colors cursor-pointer ${
                      selectedLayer.isUppercase
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="ALL CAPS"
                  >
                    TT
                  </button>
                </div>

                {/* Alignment buttons */}
                <div className="flex items-center rounded-xl bg-slate-900 border border-white/15 p-1 gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      updateTextLayer(selectedLayer.id, { alignment: 'left' }, true)
                    }
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      selectedLayer.alignment === 'left'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Align Left"
                  >
                    <AlignLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateTextLayer(selectedLayer.id, { alignment: 'center' }, true)
                    }
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      selectedLayer.alignment === 'center'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Align Center"
                  >
                    <AlignCenter className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateTextLayer(selectedLayer.id, { alignment: 'right' }, true)
                    }
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      selectedLayer.alignment === 'right'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                    title="Align Right"
                  >
                    <AlignRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* ========================================================= */}
              {/* SECTION 4: COLORS & OUTLINE STROKE                        */}
              {/* ========================================================= */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                {/* Text Color */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Text Fill Color</span>
                    <span className="font-mono text-slate-400 uppercase">
                      {selectedLayer.color}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() =>
                          updateTextLayer(selectedLayer.id, { color: c }, true)
                        }
                        className={`w-6 h-6 rounded-md border transition-transform cursor-pointer hover:scale-110 ${
                          selectedLayer.color.toLowerCase() === c.toLowerCase()
                            ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-105'
                            : 'border-white/20'
                        }`}
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                    <input
                      type="color"
                      value={selectedLayer.color}
                      onChange={(e) =>
                        updateTextLayer(selectedLayer.id, { color: e.target.value }, true)
                      }
                      className="w-6 h-6 rounded-md border border-white/20 bg-transparent cursor-pointer"
                      title="Custom text color"
                    />
                  </div>
                </div>

                {/* Stroke Outline Color */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">Outline / Stroke Color</span>
                    <span className="font-mono text-slate-400 uppercase">
                      {selectedLayer.strokeColor}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {PRESET_COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() =>
                          updateTextLayer(selectedLayer.id, { strokeColor: c }, true)
                        }
                        className={`w-6 h-6 rounded-md border transition-transform cursor-pointer hover:scale-110 ${
                          selectedLayer.strokeColor.toLowerCase() === c.toLowerCase()
                            ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-105'
                            : 'border-white/20'
                        }`}
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                    <input
                      type="color"
                      value={selectedLayer.strokeColor}
                      onChange={(e) =>
                        updateTextLayer(
                          selectedLayer.id,
                          { strokeColor: e.target.value },
                          true
                        )
                      }
                      className="w-6 h-6 rounded-md border border-white/20 bg-transparent cursor-pointer"
                      title="Custom stroke color"
                    />
                  </div>
                </div>

                {/* Stroke Width Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="editor-stroke-width-slider" className="text-slate-300 font-medium">
                      Stroke Width
                    </label>
                    <span className="font-mono text-cyan-400 font-semibold">
                      {selectedLayer.strokeWidth}px
                    </span>
                  </div>
                  <input
                    id="editor-stroke-width-slider"
                    type="range"
                    min={0}
                    max={10}
                    value={selectedLayer.strokeWidth}
                    onPointerDown={handleSliderStart}
                    onPointerUp={handleSliderEnd}
                    onTouchStart={handleSliderStart}
                    onTouchEnd={handleSliderEnd}
                    onBlur={handleSliderEnd}
                    onChange={(e) =>
                      updateTextLayer(
                        selectedLayer.id,
                        { strokeWidth: Number(e.target.value) },
                        false
                      )
                    }
                    className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Rotation Slider */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="editor-rotation-slider" className="text-slate-300 font-medium flex items-center gap-1">
                      <RotateCw className="w-3 h-3 text-slate-400" />
                      <span>Rotation</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-cyan-400 font-semibold">
                        {selectedLayer.rotation}°
                      </span>
                      {selectedLayer.rotation !== 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            updateTextLayer(selectedLayer.id, { rotation: 0 }, true)
                          }
                          className="text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                  <input
                    id="editor-rotation-slider"
                    type="range"
                    min={-180}
                    max={180}
                    value={selectedLayer.rotation}
                    onPointerDown={handleSliderStart}
                    onPointerUp={handleSliderEnd}
                    onTouchStart={handleSliderStart}
                    onTouchEnd={handleSliderEnd}
                    onBlur={handleSliderEnd}
                    onChange={(e) =>
                      updateTextLayer(
                        selectedLayer.id,
                        { rotation: Number(e.target.value) },
                        false
                      )
                    }
                    className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty selection placeholder */
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-dashed border-white/10 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-blue-400 mx-auto" />
            <p className="text-xs text-slate-300 font-medium">
              Click any text on the meme canvas or layer list above to edit fonts, colors, and positioning.
            </p>
            <button
              type="button"
              onClick={() => addTextLayer()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Caption Layer</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
