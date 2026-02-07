import { cn } from '@/shared/ui/utils/cn';

export interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between mb-4',
        className
      )}
    >
      <div>
        <h3 className="text-xl font-semibold text-card-foreground">{title}</h3>
        {subtitle != null && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
      {action != null && <div>{action}</div>}
    </div>
  );
}
