import React from 'react';
import { cn } from '../../lib/utils';
import { Badge } from './Badge';

export interface SectionHeadingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  badge?: React.ReactNode | string;
  title: React.ReactNode | string;
  subtitle?: React.ReactNode | string;
  align?: 'left' | 'center' | 'right';
  action?: React.ReactNode;
  dark?: boolean;
  titleSize?: 'sm' | 'md' | 'lg';
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  className,
  badge,
  title,
  subtitle,
  align = 'left',
  action,
  dark = false,
  titleSize = 'md',
  ...props
}) => {
  const alignmentStyles = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  const titleSizes = {
    sm: 'text-xl sm:text-2xl font-bold',
    md: 'text-2xl sm:text-3xl lg:text-4xl font-extrabold',
    lg: 'text-3xl sm:text-4xl md:text-5xl font-extrabold',
  };

  return (
    <div
      className={cn(
        'w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8',
        align === 'center' && 'sm:flex-col sm:items-center',
        className
      )}
      {...props}
    >
      <div className={cn('flex flex-col space-y-2 max-w-2xl', alignmentStyles[align])}>
        {badge && (
          <div>
            {typeof badge === 'string' ? (
              <Badge variant={dark ? 'dark' : 'primary'} size="sm">
                {badge}
              </Badge>
            ) : (
              badge
            )}
          </div>
        )}

        <h2
          className={cn(
            'tracking-tight leading-tight',
            titleSizes[titleSize],
            dark ? 'text-white' : 'text-slate-900'
          )}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className={cn(
              'text-sm sm:text-base leading-relaxed',
              dark ? 'text-slate-300' : 'text-slate-600'
            )}
          >
            {subtitle}
          </p>
        )}
      </div>

      {action && <div className="shrink-0 pt-1 sm:pt-0">{action}</div>}
    </div>
  );
};
