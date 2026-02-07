import { useState } from 'react';
import type { ImgHTMLAttributes } from 'react';
import { cn } from '@/shared/ui/utils/cn';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpva249InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4=';

export interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {}

export function ImageWithFallback({
  src,
  alt,
  className,
  ...rest
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);

  if (didError) {
    return (
      <div
        className={cn(
          'inline-flex items-center justify-center bg-muted min-h-[120px]',
          className
        )}
      >
        <img
          src={ERROR_IMG_SRC}
          alt={alt ?? 'Erro ao carregar imagem'}
          {...rest}
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt ?? ''}
      className={className}
      onError={() => setDidError(true)}
      {...rest}
    />
  );
}
