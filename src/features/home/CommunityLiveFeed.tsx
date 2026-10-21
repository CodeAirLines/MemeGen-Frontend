import React from 'react';
import { Users } from 'lucide-react';

const LIVE_EVENTS = [
  { user: '@alex_dev', action: 'generated AI meme', detail: '"When code runs on first try"', time: '4s ago', color: 'text-cyan-600' },
  { user: '@mimi_cat', action: 'customized template', detail: 'Woman Yelling at Cat', time: '18s ago', color: 'text-blue-600' },
  { user: '@crypto_dan', action: 'exported 4K meme', detail: 'Two Buttons Dilemma', time: '35s ago', color: 'text-purple-600' },
  { user: '@sarah_agency', action: 'shared to Discord', detail: '9:16 Story Format', time: '52s ago', color: 'text-emerald-600' },
  { user: '@pixel_jedi', action: 'upvoted contest entry', detail: 'Week #42 Contest', time: '1m ago', color: 'text-amber-600' },
];

export const CommunityLiveFeed: React.FC = () => {
  return (
    <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs shadow-2xs">
      {/* Live Badge & Counter */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase tracking-wider text-[10px]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
          Live Pulse
        </span>
        <div className="flex items-center gap-1.5 text-slate-600 font-semibold">
          <Users className="w-3.5 h-3.5 text-blue-600" />
          <span><strong>14,280</strong> creators online</span>
        </div>
      </div>

      {/* Activity Strip */}
      <div className="overflow-x-auto w-full md:w-auto scrollbar-none py-1">
        <div className="flex items-center gap-3 whitespace-nowrap">
          {LIVE_EVENTS.map((event, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 text-slate-600 bg-white border border-slate-200/80 hover:border-blue-400 hover:scale-105 hover:shadow-sm active:scale-95 transition-all duration-200 px-3 py-1.5 rounded-xl shadow-3xs cursor-pointer"
            >
              <span className="font-bold text-slate-800">{event.user}</span>
              <span className="text-slate-400">{event.action}</span>
              <span className={`font-semibold ${event.color}`}>{event.detail}</span>
              <span className="text-[10px] text-slate-400">({event.time})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
