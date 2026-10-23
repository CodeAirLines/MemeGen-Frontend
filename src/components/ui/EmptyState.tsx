import React from 'react';
import { SearchX } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  className,
  icon,
  title,
  description,
  action,
  compact = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'w-full flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60',
        compact ? 'p-6 sm:p-8' : 'p-8 sm:p-14 lg:p-16',
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-center text-slate-400 mb-3.5">
        {icon || <SearchX className="w-6 h-6 text-slate-400" />}
      </div>

      <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mt-1 mb-4 leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};
