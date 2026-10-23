import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  compact?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  className,
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  compact = false,
  ...props
}) => {
  return (
    <div
      role="alert"
      className={cn(
        'w-full flex flex-col items-center justify-center text-center rounded-2xl border border-rose-200 bg-rose-50/50',
        compact ? 'p-4 sm:p-6' : 'p-6 sm:p-10',
        className
      )}
      {...props}
    >
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white border border-rose-200 text-rose-500 shadow-2xs flex items-center justify-center mb-3">
        <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>

      <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
        {title}
      </h4>

      <p className="text-xs sm:text-sm text-slate-600 max-w-sm mt-1 mb-4 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          className="bg-white hover:bg-slate-50 border-rose-200 text-slate-800"
        >
          {retryLabel}
        </Button>
      )}
    </div>
  );
};
