import React from 'react';
import { cn } from '../../lib/utils';

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'cyan' | 'white' | 'muted' | 'current';
  label?: string;
  center?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className,
  size = 'md',
  color = 'primary',
  label,
  center = false,
  ...props
}) => {
  const sizeStyles = {
    xs: 'w-3.5 h-3.5 border-[1.5px]',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  const colorStyles = {
    primary: 'border-blue-600 border-t-transparent',
    cyan: 'border-cyan-400 border-t-transparent',
    white: 'border-white border-t-transparent',
    muted: 'border-slate-400 border-t-transparent',
    current: 'border-current border-t-transparent',
  };

  return (
    <div
      role="status"
      className={cn(
        'inline-flex items-center gap-2.5',
        center && 'w-full justify-center py-6',
        className
      )}
      {...props}
    >
      <span
        className={cn(
          'rounded-full animate-spin shrink-0',
          sizeStyles[size],
          colorStyles[color]
        )}
      />
      <span className={cn('text-xs font-medium', color === 'white' ? 'text-white' : 'text-slate-600')}>
        {label || <span className="sr-only">Loading...</span>}
      </span>
    </div>
  );
};
