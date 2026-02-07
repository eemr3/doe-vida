import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';
import { Label } from '@/shared/ui/atoms/Label';
import { cn } from '@/shared/ui/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectFieldProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, options, id, className, ...props }, ref) => {
    const selectId =
      id ?? `select-${Math.random().toString(36).substring(2, 11)}`;

    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={selectId} className="mb-2 block">
            {label}
          </Label>
        )}
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg bg-input-background border border-border',
            'focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200',
            error && 'border-destructive focus:ring-destructive',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p
            id={`${selectId}-error`}
            className="mt-1.5 text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';
