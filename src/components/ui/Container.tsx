import React from 'react';
import { cn } from '../../lib/utils';
import { LAYOUT_TOKENS } from '../../constants/theme';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'article' | 'main' | 'header' | 'footer';
  size?: 'sm' | 'md' | 'lg' | 'full';
  cleanPadding?: boolean;
}

export const Container: React.FC<ContainerProps> = ({
  as: Component = 'div',
  size = 'lg',
  cleanPadding = false,
  className,
  children,
  ...props
}) => {
  return (
    <Component
      className={cn(
        'w-full mx-auto',
        LAYOUT_TOKENS.container[size],
        !cleanPadding && LAYOUT_TOKENS.containerPadding,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
