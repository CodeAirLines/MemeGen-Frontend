import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  hoverEffect = false,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(
        'bg-slate-900/60 border border-slate-800/80 rounded-2xl backdrop-blur-md overflow-hidden transition-all duration-300',
        hoverEffect &&
          'hover:border-slate-700 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
