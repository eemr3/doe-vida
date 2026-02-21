import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { Label } from '@/shared/ui/atoms/Label';
import { Input } from '@/shared/ui/atoms/Input';
import { cn } from '@/shared/ui/utils/cn';

export interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, success, id, className, ...props }, ref) => {
    const inputId = id ?? `input-${Math.random().toString(36).substring(2, 11)}`;

    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={inputId} className="mb-2 block">
            {label}
          </Label>
        )}
        <Input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(
            error && 'border-destructive focus:ring-destructive',
            success && !error && 'border-success focus:ring-success',
            className,
          )}
          {...props}
        />
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1.5 text-sm text-destructive"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

FormField.displayName = 'FormField';
