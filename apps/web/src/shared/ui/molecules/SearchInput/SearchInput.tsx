import { Search } from 'lucide-react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '@/shared/ui/utils/cn';

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {}

export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none"
        aria-hidden
      />
      <input
        type="search"
        className={cn(
          'w-full pl-10 pr-4 py-2.5 rounded-lg bg-input-background border border-border',
          'focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all',
          className
        )}
        {...props}
      />
    </div>
  );
}
