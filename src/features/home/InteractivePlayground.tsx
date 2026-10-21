import React, { useState } from 'react';
import { Sparkles, Download, Copy, Check, ArrowRight, Wand2, RefreshCw } from 'lucide-react';
import { POPULAR_TEMPLATES } from '../../constants/templates';
import { useTemplateStore } from '../../stores/useTemplateStore';

const PRESET_IDEAS = [
  { top: 'When someone compliments my meme', bottom: "I'm not really that special..." },
  { top: 'When code runs with 0 errors', bottom: 'On the very first try' },
  { top: 'Me pretending to understand', bottom: 'What the senior dev just explained' },
  { top: 'Deploying on a Friday at 4:55 PM', bottom: 'What could possibly go wrong?' },
  { top: 'Just 5 minutes of scrolling', bottom: '3 hours later' },
];

export const InteractivePlayground: React.FC = () => {
  const openPreview = useTemplateStore((state) => state.openPreview);
  const setSelectedTemplate = useTemplateStore((state) => state.setSelectedTemplate);

  const starterTemplates = POPULAR_TEMPLATES.slice(0, 5);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [topText, setTopText] = useState('When someone compliments my meme');
  const [bottomText, setBottomText] = useState("I'm not really that special...");
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isUppercase, setIsUppercase] = useState(true);

  const activeTemplate = starterTemplates[selectedTemplateIndex] || starterTemplates[0];

  const handleCopy = () => {
    setCopied(true);
    navigator.clipboard?.writeText?.(
      `Meme created with MemeHub: "${topText}" / "${bottomText}" (${activeTemplate.name})`
    );
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    setDownloaded(true);
    // Create an invisible canvas to export image with text
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = activeTemplate.imageUrl;

    img.onload = () => {
      canvas.width = img.width || 800;
      canvas.height = img.height || 800;
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(4, canvas.width / 80);
        ctx.textAlign = 'center';
        ctx.font = `900 ${Math.max(28, canvas.width / 16)}px sans-serif`;

        const renderText = (t: string) => (isUppercase ? t.toUpperCase() : t);

        if (topText) {
          ctx.strokeText(renderText(topText), canvas.width / 2, canvas.height * 0.12);
          ctx.fillText(renderText(topText), canvas.width / 2, canvas.height * 0.12);
        }
        if (bottomText) {
          ctx.strokeText(renderText(bottomText), canvas.width / 2, canvas.height * 0.92);
          ctx.fillText(renderText(bottomText), canvas.width / 2, canvas.height * 0.92);
        }

        const link = document.createElement('a');
        link.download = `${activeTemplate.id}-meme.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
      setTimeout(() => setDownloaded(false), 2000);
    };

    img.onerror = () => {
      setTimeout(() => setDownloaded(false), 1500);
    };
  };

  const handleRandomPreset = () => {
    const random = PRESET_IDEAS[Math.floor(Math.random() * PRESET_IDEAS.length)];
    setTopText(random.top);
    setBottomText(random.bottom);
  };

  const handleOpenStudio = () => {
    setSelectedTemplate(activeTemplate);
    openPreview(activeTemplate);
  };

  return (
    <section className="bg-slate-50/70 border border-slate-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-sm" aria-label="Interactive Meme Playground">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <Wand2 className="w-3.5 h-3.5" />
          <span>Quick Studio</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Instant Meme Playground
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Customize captions in real-time right here, or open any template in the full studio.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-5xl mx-auto">
        {/* Left Column: Live Canvas Preview */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-3 shadow-xl hover:shadow-2xl border border-slate-200 transition-shadow duration-300 group">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-900">
              <img
                src={activeTemplate.imageUrl}
                alt={activeTemplate.name}
                className="w-full h-full object-cover select-none group-hover:scale-103 transition-transform duration-500"
              />

              {/* Live Top Text */}
              {topText && (
                <div
                  className="absolute top-4 inset-x-3 text-center font-extrabold text-white text-base sm:text-xl tracking-wide uppercase select-none pointer-events-none transition-all leading-tight drop-shadow-md"
                  style={{
                    textShadow:
                      '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000',
                  }}
                >
                  {isUppercase ? topText.toUpperCase() : topText}
                </div>
              )}

              {/* Live Bottom Text */}
              {bottomText && (
                <div
                  className="absolute bottom-4 inset-x-3 text-center font-extrabold text-white text-base sm:text-xl tracking-wide uppercase select-none pointer-events-none transition-all leading-tight drop-shadow-md"
                  style={{
                    textShadow:
                      '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0 2px 0 #000',
                  }}
                >
                  {isUppercase ? bottomText.toUpperCase() : bottomText}
                </div>
              )}

              {/* Watermark Tag */}
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-[9px] font-bold text-white/80 backdrop-blur-xs select-none">
                MemeHub
              </div>
            </div>

            {/* Canvas Actions Bar */}
            <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Link' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={handleDownload}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/40 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                {downloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                <span>{downloaded ? 'Saved!' : 'Download'}</span>
              </button>

              <button
                type="button"
                onClick={handleOpenStudio}
                className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer group/studio"
                title="Open in full studio"
              >
                <span>Studio</span>
                <ArrowRight className="w-3 h-3 group-hover/studio:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Controls & Presets */}
        <div className="lg:col-span-6 space-y-5 text-left">
          {/* Template Switcher */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              1. Choose Starter Template
            </label>
            <div className="flex flex-wrap gap-2">
              {starterTemplates.map((template, idx) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => setSelectedTemplateIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer ${
                    selectedTemplateIndex === idx
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 ring-2 ring-blue-600/20'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {template.name}
                </button>
              ))}
            </div>
          </div>

          {/* Caption Inputs */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Top Caption
                </label>
                <button
                  type="button"
                  onClick={handleRandomPreset}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Random Joke Idea</span>
                </button>
              </div>
              <input
                type="text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="TOP CAPTION GOES HERE..."
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-xs"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Bottom Caption
              </label>
              <input
                type="text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="BOTTOM CAPTION GOES HERE..."
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-xs"
              />
            </div>
          </div>

          {/* Quick Style Options */}
          <div className="flex items-center gap-4 pt-1">
            <button
              type="button"
              onClick={() => setIsUppercase(!isUppercase)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isUppercase
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              ALL CAPS: {isUppercase ? 'ON' : 'OFF'}
            </button>

            <span className="text-xs text-slate-400">
              Live preview updates instantly
            </span>
          </div>

          {/* Helper hint */}
          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100/80 text-xs text-blue-800 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              Want to add custom stickers, drawings, multiple text layers, or upload your own photo? Click <strong>Studio</strong> to launch the advanced multi-track editor.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
