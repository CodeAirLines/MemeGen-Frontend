import React from 'react';
import { ArrowRight, MessageSquare, ShieldCheck, Flame } from 'lucide-react';
import { useTemplateStore } from '../../stores/useTemplateStore';
import { POPULAR_TEMPLATES } from '../../constants/templates';

export const CommunityBanner: React.FC = () => {
  const setSelectedTemplate = useTemplateStore((state) => state.setSelectedTemplate);
  const openPreview = useTemplateStore((state) => state.openPreview);

  const handleStartNow = () => {
    if (POPULAR_TEMPLATES.length > 0) {
      setSelectedTemplate(POPULAR_TEMPLATES[0]);
      openPreview(POPULAR_TEMPLATES[0]);
    }
  };

  return (
    <section className="relative rounded-3xl bg-gradient-to-r from-[#061841] via-[#092972] to-[#0c399e] text-white p-8 sm:p-14 lg:p-16 overflow-hidden shadow-2xl text-center" aria-label="Join MemeHub Community">
      {/* Ambient glowing radial effects */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-400/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/25 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
          <Flame className="w-3.5 h-3.5 text-cyan-300" />
          <span>Join 2,000,000+ Active Memers</span>
        </div>

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Ready to Make the Entire Internet Laugh?
        </h2>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto font-normal leading-relaxed">
          Create classic memes, generate witty AI punchlines, and export in razor-sharp 4K in seconds. Completely free with zero signup friction.
        </p>

        {/* Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={handleStartNow}
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm px-7 py-4 rounded-xl shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-400/50 hover:-translate-y-1 hover:scale-105 flex items-center gap-2 transition-all duration-200 cursor-pointer active:scale-95 group"
          >
            <Flame className="w-4 h-4 text-cyan-200" />
            <span>Launch Meme Editor Now</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>

          <a
            href="#discord"
            className="bg-white/10 hover:bg-[#5865F2] hover:border-[#5865F2] text-white border border-white/20 font-bold text-sm px-6 py-4 rounded-xl transition-all duration-200 flex items-center gap-2 backdrop-blur-xs hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:shadow-[#5865F2]/40 active:scale-95 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-[#5865F2] group-hover:text-white" />
            <span>Join 150K+ Member Discord</span>
          </a>
        </div>

        {/* Guarantee badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-blue-200">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-300" />
            No credit card required
          </span>
          <span>•</span>
          <span>Unlimited free exports</span>
          <span>•</span>
          <span>Instant browser rendering</span>
        </div>
      </div>
    </section>
  );
};
