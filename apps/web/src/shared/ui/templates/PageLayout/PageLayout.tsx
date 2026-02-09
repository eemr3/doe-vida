import type { ReactNode } from 'react';
import { cn } from '@/shared/ui/utils/cn';

export interface PageLayoutProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl';
}

const maxWidthClasses = {
  sm: 'max-w-3xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
  '7xl': 'max-w-7xl',
};

export function PageLayout({ children, className, maxWidth = '7xl' }: PageLayoutProps) {
  return (
    <div
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8 py-8',
        maxWidthClasses[maxWidth],
        className,
      )}
    >
      {children}
    </div>
  );
}
