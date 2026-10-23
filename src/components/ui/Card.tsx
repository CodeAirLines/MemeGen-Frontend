import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'subtle' | 'dark' | 'outline';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  className,
  variant = 'default',
  padding = 'md',
  hoverEffect = false,
  children,
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border-slate-200 text-slate-900 shadow-xs hover:border-slate-300',
    subtle: 'bg-slate-50/90 border-slate-200/80 text-slate-900',
    dark: 'bg-[#071330]/85 border-white/10 text-white backdrop-blur-xl shadow-xl hover:border-cyan-400/30',
    outline: 'bg-transparent border-slate-200 text-slate-900',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3.5 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-300 overflow-hidden',
        variantStyles[variant],
        paddingStyles[padding],
        hoverEffect && 'hover:-translate-y-1 hover:shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export const CardHeader: React.FC<CardHeaderProps> = ({ className, children, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 pb-4', className)} {...props}>
    {children}
  </div>
);

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h2' | 'h3' | 'h4';
}
export const CardTitle: React.FC<CardTitleProps> = ({
  as: Component = 'h3',
  className,
  children,
  ...props
}) => (
  <Component
    className={cn('text-lg font-bold tracking-tight text-inherit', className)}
    {...props}
  >
    {children}
  </Component>
);

export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;
export const CardDescription: React.FC<CardDescriptionProps> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn('text-xs sm:text-sm text-slate-500', className)} {...props}>
    {children}
  </p>
);

export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;
export const CardContent: React.FC<CardContentProps> = ({ className, children, ...props }) => (
  <div className={cn('pt-0', className)} {...props}>
    {children}
  </div>
);

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;
export const CardFooter: React.FC<CardFooterProps> = ({ className, children, ...props }) => (
  <div className={cn('flex items-center pt-4 border-t border-slate-100/80', className)} {...props}>
    {children}
  </div>
);
