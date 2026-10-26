import React, { forwardRef, useId } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'light' | 'dark';
  inputSize?: 'sm' | 'md' | 'lg';
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      wrapperClassName,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      variant = 'light',
      inputSize = 'md',
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const variantStyles = {
      light: cn(
        'bg-white text-slate-900 placeholder:text-slate-400 border-slate-200',
        'hover:border-slate-300',
        'focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
      ),
      dark: cn(
        'bg-white/5 text-white placeholder:text-slate-400 border-white/10 backdrop-blur-md',
        'hover:border-white/20',
        'focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20'
      ),
    };

    const sizeStyles = {
      sm: 'h-9 text-xs rounded-lg py-1.5',
      md: 'h-10 text-base sm:text-sm rounded-xl py-2',
      lg: 'h-12 text-base rounded-xl py-2.5',
    };

    const paddingStyles = cn(
      leftIcon ? (inputSize === 'sm' ? 'pl-8' : 'pl-10') : (inputSize === 'sm' ? 'pl-3' : 'pl-3.5'),
      rightIcon ? (inputSize === 'sm' ? 'pr-8' : 'pr-10') : (inputSize === 'sm' ? 'pr-3' : 'pr-3.5')
    );

    return (
      <div className={cn('w-full space-y-1.5 text-left', wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'block text-xs font-semibold select-none',
              variant === 'dark' ? 'text-slate-200' : 'text-slate-700'
            )}
          >
            {label}
          </label>
        )}

        <div className="relative w-full">
          {leftIcon && (
            <div
              className={cn(
                'absolute inset-y-0 left-0 flex items-center pointer-events-none',
                inputSize === 'sm' ? 'pl-2.5' : 'pl-3.5',
                variant === 'dark' ? 'text-slate-400' : 'text-slate-400'
              )}
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            className={cn(
              'w-full border transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:bg-slate-50 disabled:cursor-not-allowed',
              variantStyles[variant],
              sizeStyles[inputSize],
              paddingStyles,
              error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20 text-rose-900',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div
              className={cn(
                'absolute inset-y-0 right-0 flex items-center',
                inputSize === 'sm' ? 'pr-2.5' : 'pr-3.5',
                variant === 'dark' ? 'text-slate-400' : 'text-slate-400'
              )}
            >
              {rightIcon}
            </div>
          )}
        </div>

        {error ? (
          <p id={errorId} className="text-xs text-rose-500 font-medium animate-in fade-in duration-150">
            {error}
          </p>
        ) : helperText ? (
          <p
            id={helperId}
            className={cn(
              'text-xs',
              variant === 'dark' ? 'text-slate-400' : 'text-slate-500'
            )}
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
