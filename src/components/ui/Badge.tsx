import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'success' | 'accent';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full transition-colors select-none';

  const variants = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200/90 hover:bg-slate-200/80',
    primary: 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100',
    secondary: 'bg-purple-50 text-purple-700 border border-purple-200',
    outline: 'bg-transparent text-slate-700 border border-slate-300',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    accent: 'bg-pink-50 text-pink-700 border border-pink-200',
    light: 'bg-white text-slate-700 border border-slate-200 shadow-2xs',
  };

  const sizes = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};
