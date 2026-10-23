import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'subtle' | 'dark';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

    const variants = {
      primary:
        'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/25 border border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/30 active:bg-blue-700',
      secondary:
        'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 shadow-xs hover:border-slate-300 hover:text-slate-900 active:bg-slate-100',
      outline:
        'bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200/60',
      ghost:
        'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200/60',
      danger:
        'bg-rose-600 text-white hover:bg-rose-500 shadow-md shadow-rose-600/20 active:bg-rose-700',
      subtle:
        'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60 hover:border-blue-300 active:bg-blue-200/70',
      dark:
        'bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-md shadow-sm active:bg-white/5',
    };

    const sizes = {
      xs: 'text-xs px-2.5 py-1 gap-1 h-7 rounded-lg',
      sm: 'text-xs px-3 py-1.5 gap-1.5 h-8.5 rounded-xl',
      md: 'text-sm px-4 py-2.5 gap-2 h-10 rounded-xl',
      lg: 'text-base px-6 py-3.5 gap-2.5 h-12 rounded-xl font-semibold',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0"
            role="status"
            aria-label="Loading"
          />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children && <span>{children}</span>}
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
