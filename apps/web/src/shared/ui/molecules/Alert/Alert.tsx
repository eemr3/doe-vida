import {
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  X,
} from 'lucide-react';
import { cn } from '@/shared/ui/utils/cn';

export type AlertVariant = 'success' | 'warning' | 'error' | 'info';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

const variantConfig: Record<
  AlertVariant,
  { container: string; icon: typeof CheckCircle }
> = {
  success: {
    container:
      'bg-[var(--success)]/10 border-[var(--success)] text-[var(--success)]',
    icon: CheckCircle,
  },
  warning: {
    container:
      'bg-[var(--warning)]/10 border-[var(--warning)] text-[var(--warning)]',
    icon: AlertTriangle,
  },
  error: {
    container: 'bg-destructive/10 border-destructive text-destructive',
    icon: AlertCircle,
  },
  info: {
    container: 'bg-[var(--info)]/10 border-[var(--info)] text-[var(--info)]',
    icon: Info,
  },
};

export function Alert({
  variant = 'info',
  title,
  message,
  onClose,
  className,
}: AlertProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border-l-4',
        config.container,
        className
      )}
      role="alert"
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden />
      <div className="flex-1 min-w-0">
        {title != null && (
          <h4 className="font-semibold mb-1">{title}</h4>
        )}
        <p className="text-sm opacity-90">{message}</p>
      </div>
      {onClose != null && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded hover:bg-black/10 transition-colors"
          aria-label="Fechar alerta"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export interface ToastProps extends AlertProps {
  id: string;
  duration?: number;
}

export interface ToastContainerProps {
  toasts: ToastProps[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md"
      role="region"
      aria-label="Notificações"
    >
      {toasts.map((toast) => (
        <Alert
          key={toast.id}
          variant={toast.variant}
          title={toast.title}
          message={toast.message}
          onClose={() => onRemove(toast.id)}
          className="animate-in slide-in-from-right"
        />
      ))}
    </div>
  );
}
