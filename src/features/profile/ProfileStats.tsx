import React from 'react';
import { Bookmark, Flame, Send, HardDrive } from 'lucide-react';

export interface ProfileStatsProps {
  draftsCount: number;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ draftsCount }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Saved Drafts */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Saved Drafts
          </span>
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Bookmark className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-slate-900">
          {draftsCount}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Active drafts in browser storage
        </p>
      </div>

      {/* 2. Total Memes Created */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Memes
          </span>
          <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <Flame className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-slate-900">
          {draftsCount}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Drafts & remix creations
        </p>
      </div>

      {/* 3. Published Memes */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Published
          </span>
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Send className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black text-slate-900">
          0
        </div>
        <p className="text-[11px] text-amber-600 font-semibold mt-1">
          Publishing API coming soon
        </p>
      </div>

      {/* 4. Persistence Mode */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Sync Status
          </span>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <HardDrive className="w-4 h-4" />
          </div>
        </div>
        <div className="text-sm sm:text-base font-extrabold text-emerald-600 mt-1.5">
          Local Storage
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Data preserved in browser
        </p>
      </div>
    </div>
  );
};
