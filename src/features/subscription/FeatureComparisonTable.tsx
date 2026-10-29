import React from 'react';
import { Check, X } from 'lucide-react';
import { FEATURE_COMPARISONS } from '../../constants/subscription';

export const FeatureComparisonTable: React.FC = () => {
  // Group features by category
  const categories = Array.from(new Set(FEATURE_COMPARISONS.map((item) => item.category)));

  const renderValue = (val: string | boolean) => {
    if (typeof val === 'boolean') {
      return val ? (
        <span className="inline-flex w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </span>
      ) : (
        <span className="inline-flex w-5 h-5 rounded-full bg-slate-100 text-slate-300 items-center justify-center">
          <X className="w-3.5 h-3.5 stroke-[2]" />
        </span>
      );
    }
    return <span className="text-xs sm:text-sm font-semibold text-slate-700">{val}</span>;
  };

  return (
    <div className="w-full space-y-4">
      <div className="text-center max-w-xl mx-auto space-y-2 mb-6">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Compare All Plan Features
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Detailed side-by-side feature breakdown to help you choose the right tier for your workflow.
        </p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-200/90 bg-white shadow-sm">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="py-4 px-6 text-xs sm:text-sm font-black text-slate-800 uppercase tracking-wider w-2/5">
                Feature
              </th>
              <th className="py-4 px-4 text-center text-xs sm:text-sm font-black text-slate-700 w-1/5">
                Free
              </th>
              <th className="py-4 px-4 text-center text-xs sm:text-sm font-black text-blue-600 bg-blue-50/50 w-1/5">
                Pro
              </th>
              <th className="py-4 px-4 text-center text-xs sm:text-sm font-black text-purple-600 w-1/5">
                Premium
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => {
              const categoryItems = FEATURE_COMPARISONS.filter((item) => item.category === category);
              return (
                <React.Fragment key={category}>
                  {/* Category Header Row */}
                  <tr className="bg-slate-100/60 border-t border-b border-slate-200/70">
                    <td
                      colSpan={4}
                      className="py-2.5 px-6 text-[11px] font-black uppercase tracking-wider text-slate-500"
                    >
                      {category}
                    </td>
                  </tr>

                  {/* Items Rows */}
                  {categoryItems.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="py-3.5 px-6 text-xs sm:text-sm font-medium text-slate-900">
                        {item.feature}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {renderValue(item.free)}
                      </td>
                      <td className="py-3.5 px-4 text-center bg-blue-50/30">
                        {renderValue(item.pro)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {renderValue(item.premium)}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

