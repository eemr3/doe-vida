import type { LabelHTMLAttributes } from 'react';
import { cn } from '@/shared/ui/utils/cn';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <label className={cn('block text-sm font-medium text-foreground', className)} {...props}>
      {children}
    </label>
  );
}
