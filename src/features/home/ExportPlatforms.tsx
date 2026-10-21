import React from 'react';
import { Smartphone, Monitor, Square, Check, Share2, Zap } from 'lucide-react';

const ASPECT_RATIOS = [
  {
    id: 'square',
    title: '1:1 Square Feed',
    platforms: 'Instagram, Reddit, Discord',
    dimensions: '1080 × 1080 px',
    icon: <Square className="w-5 h-5 text-blue-600" />,
    badge: 'Most Popular',
    aspectClass: 'aspect-square',
    caption: 'Classic meme format',
  },
  {
    id: 'story',
    title: '9:16 Vertical Story',
    platforms: 'TikTok, Reels, Shorts',
    dimensions: '1080 × 1920 px',
    icon: <Smartphone className="w-5 h-5 text-purple-600" />,
    badge: 'Viral Video Presets',
    aspectClass: 'aspect-[9/16]',
    caption: 'Full-screen mobile punchlines',
  },
  {
    id: 'landscape',
    title: '16:9 Landscape',
    platforms: 'Twitter / X, YouTube, LinkedIn',
    dimensions: '1920 × 1080 px',
    icon: <Monitor className="w-5 h-5 text-cyan-600" />,
    badge: 'Desktop & Social',
    aspectClass: 'aspect-[16/9]',
    caption: 'Cinema & widescreen formats',
  },
];

const PLATFORMS = [
  { name: 'Discord', color: 'hover:text-[#5865F2]' },
  { name: 'Reddit', color: 'hover:text-[#FF4500]' },
  { name: 'Twitter / X', color: 'hover:text-slate-900' },
  { name: 'Instagram', color: 'hover:text-[#E4405F]' },
  { name: 'TikTok', color: 'hover:text-black' },
  { name: 'Telegram', color: 'hover:text-[#229ED9]' },
  { name: 'WhatsApp', color: 'hover:text-[#25D366]' },
];

export const ExportPlatforms: React.FC = () => {
  return (
    <section className="space-y-10" aria-label="Export and Sharing">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold uppercase tracking-wider">
          <Share2 className="w-3.5 h-3.5" />
          <span>Multi-Format Output</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Export in Any Ratio. Share Anywhere Instantly.
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Zero pixelation, zero compression blur. One-click preset dimensions ready for the algorithm.
        </p>
      </div>

      {/* 3 Aspect Ratio Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ASPECT_RATIOS.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-2 hover:border-cyan-400 transition-all duration-300 text-left group cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:scale-115 group-hover:rotate-6 transition-transform duration-300">
                  {item.icon}
                </div>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full group-hover:bg-cyan-50 group-hover:text-cyan-700 transition-colors">
                  {item.dimensions}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                  {item.badge}
                </span>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Best for {item.platforms}.
                </p>
              </div>

              {/* Wireframe Aspect Ratio Preview Box */}
              <div className="py-2 flex items-center justify-center">
                <div className={`w-28 bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center p-2 text-center group-hover:scale-108 group-hover:border-cyan-400 group-hover:bg-cyan-50/50 transition-all duration-300 ${item.aspectClass}`}>
                  <span className="text-[10px] font-semibold text-slate-400 group-hover:text-cyan-700">
                    {item.id === 'story' ? '9:16' : item.id === 'square' ? '1:1' : '16:9'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1 text-emerald-600 font-bold">
                <Check className="w-3.5 h-3.5" />
                HD Ready
              </span>
              <span>PNG / WebP / GIF</span>
            </div>
          </div>
        ))}
      </div>

      {/* Supported Platforms Banner */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-bold text-slate-700">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Direct Community Integrations</span>
          </div>
          <p className="text-xs text-slate-500">
            Copy direct markdown links, paste directly into Discord channels, or download uncompressed files.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {PLATFORMS.map((platform) => (
            <span
              key={platform.name}
              className={`px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:scale-110 hover:-translate-y-1 hover:shadow-md active:scale-95 transition-all duration-150 cursor-pointer shadow-2xs ${platform.color}`}
            >
              {platform.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
