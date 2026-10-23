import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string; // Mandatory for accessibility
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = 'ghost',
      size = 'md',
      isLoading = false,
      children,
      disabled,
      type = 'button',
      'aria-label': ariaLabel,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-xl transition-all duration-200 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-95 shrink-0';

    const variants = {
      primary:
        'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 border border-blue-500/20 active:bg-blue-700',
      secondary:
        'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-2xs hover:border-slate-300 hover:text-slate-900 active:bg-slate-100',
      outline:
        'bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200/60',
      ghost:
        'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200/60',
      danger:
        'bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 border border-rose-200/80 active:bg-rose-200',
      dark:
        'bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md active:bg-white/5',
    };

    const sizes = {
      xs: 'w-7 h-7 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-label={ariaLabel}
        aria-busy={isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"
            role="status"
            aria-label="Loading"
          />
        ) : (
          children
        )}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
