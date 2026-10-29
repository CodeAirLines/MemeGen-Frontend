import React from 'react';
import type { BillingCycle } from '../../types/subscription';
import { Sparkles } from 'lucide-react';

export interface BillingToggleProps {
  cycle: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
}

export const BillingToggle: React.FC<BillingToggleProps> = ({ cycle, onChange }) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      <div
        role="group"
        aria-label="Billing cycle selection"
        className="inline-flex items-center p-1.5 bg-slate-100 rounded-2xl border border-slate-200/80 shadow-inner"
      >
        <button
          type="button"
          onClick={() => onChange('monthly')}
          aria-pressed={cycle === 'monthly'}
          className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            cycle === 'monthly'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          Monthly Billing
        </button>

        <button
          type="button"
          onClick={() => onChange('yearly')}
          aria-pressed={cycle === 'yearly'}
          className={`relative px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            cycle === 'yearly'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <span>Yearly Billing</span>
          <span
            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full transition-colors ${
              cycle === 'yearly'
                ? 'bg-white/20 text-white'
                : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            Save ~20%
          </span>
        </button>
      </div>

      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200/60">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Get 2 Months Free with Annual Billing</span>
      </div>
    </div>
  );
};

