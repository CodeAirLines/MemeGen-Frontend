import React from 'react';
import { RefreshCw } from 'lucide-react';

export interface PageLoadingFallbackProps {
  dark?: boolean;
  label?: string;
}

export const PageLoadingFallback: React.FC<PageLoadingFallbackProps> = ({
  dark = false,
  label = 'Loading workspace...',
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`min-h-[60vh] flex flex-col items-center justify-center gap-3.5 transition-opacity animate-in fade-in duration-150 ${
        dark ? 'bg-[#070d1e] text-slate-200' : 'bg-slate-50/70 text-slate-600'
      }`}
    >
      <div className="relative">
        <RefreshCw
          className={`w-9 h-9 animate-spin ${dark ? 'text-cyan-400' : 'text-blue-600'}`}
        />
        <div
          className={`absolute inset-0 rounded-full blur-md opacity-30 ${
            dark ? 'bg-cyan-400' : 'bg-blue-600'
          }`}
        />
      </div>
      <p className="text-xs sm:text-sm font-semibold tracking-wide">{label}</p>
      <span className="sr-only">Please wait, loading view</span>
    </div>
  );
};

export default PageLoadingFallback;

