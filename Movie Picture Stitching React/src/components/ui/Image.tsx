import * as React from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { Item } from '@/types/eagle';

/**
 * Image loading states for tracking component lifecycle
 */
type ImageState = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * Props for the EagleImage component
 */
export interface EagleImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Eagle Item object containing image URLs */
  item?: Item;
  /** Direct source URL (alternative to item) */
  src?: string;
  /** Use Eagle's pre-generated thumbnail instead of full image */
  useThumbnail?: boolean;
  /** Fallback element to show on error */
  fallback?: React.ReactNode;
  /** Show loading skeleton while image loads */
  showSkeleton?: boolean;
  /** Aspect ratio for skeleton (e.g., "16/9", "1/1", "4/3") */
  aspectRatio?: string;
  /** Callback when image loads successfully */
  onLoadSuccess?: () => void;
  /** Callback when image fails to load */
  onLoadError?: (error: Error) => void;
}

/**
 * EagleImage - Optimized image component for Eagle plugins
 *
 * Features:
 * - Automatic thumbnail support via Eagle's pre-generated thumbnails
 * - Native lazy loading (loading="lazy")
 * - Async decoding (decoding="async") for non-blocking rendering
 * - Loading skeleton state
 * - Error fallback with retry capability
 * - Memory-efficient cleanup on unmount
 *
 * @example
 * ```tsx
 * // With Eagle Item
 * <EagleImage item={item} useThumbnail />
 *
 * // With direct URL
 * <EagleImage src="/path/to/image.jpg" showSkeleton />
 *
 * // With fallback
 * <EagleImage
 *   item={item}
 *   fallback={<div>Image not available</div>}
 * />
 * ```
 */
export const EagleImage = React.forwardRef<HTMLImageElement, EagleImageProps>(
  (
    {
      item,
      src: directSrc,
      useThumbnail = false,
      fallback,
      showSkeleton = true,
      aspectRatio,
      className,
      onLoadSuccess,
      onLoadError,
      onLoad,
      onError,
      alt,
      ...props
    },
    ref
  ) => {
    const [state, setState] = useState<ImageState>('idle');
    const [retryCount, setRetryCount] = useState(0);
    const imgRef = useRef<HTMLImageElement | null>(null);

    // Determine source URL
    const src = React.useMemo(() => {
      if (directSrc) return directSrc;
      if (!item) return undefined;

      // Use thumbnail URL for previews (faster, lower memory)
      if (useThumbnail && item.thumbnailURL) {
        return item.thumbnailURL;
      }

      // Fall back to full image URL
      return item.fileURL || item.filePath;
    }, [directSrc, item, useThumbnail]);

    // Reset state when source changes
    useEffect(() => {
      if (src) {
        setState('loading');
      } else {
        setState('idle');
      }
    }, [src, retryCount]);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        // Clear the image source to help garbage collection
        if (imgRef.current) {
          imgRef.current.src = '';
        }
      };
    }, []);

    const handleLoad = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement>) => {
        setState('loaded');
        onLoad?.(e);
        onLoadSuccess?.();
      },
      [onLoad, onLoadSuccess]
    );

    const handleError = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement>) => {
        setState('error');
        const error = new Error(`Failed to load image: ${src}`);
        onError?.(e);
        onLoadError?.(error);
      },
      [src, onError, onLoadError]
    );

    const handleRetry = useCallback(() => {
      setRetryCount((c) => c + 1);
    }, []);

    // Set ref
    const setRefs = useCallback(
      (node: HTMLImageElement | null) => {
        imgRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref]
    );

    // No source provided
    if (!src) {
      if (fallback) return <>{fallback}</>;
      return null;
    }

    // Error state with fallback
    if (state === 'error') {
      if (fallback) {
        return <>{fallback}</>;
      }

      return (
        <div
          className={cn(
            'flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground',
            className
          )}
          style={aspectRatio ? { aspectRatio } : undefined}
        >
          <span className="text-xs">Failed to load</span>
          <button
            onClick={handleRetry}
            className="text-xs text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
          >
            Retry
          </button>
        </div>
      );
    }

    return (
      <div
        className={cn('relative overflow-hidden', className)}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        {/* Loading skeleton */}
        {showSkeleton && state === 'loading' && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        {/* Actual image */}
        <img
          ref={setRefs}
          src={src}
          alt={alt || item?.name || 'Image'}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-200',
            state === 'loaded' ? 'opacity-100' : 'opacity-0'
          )}
          {...props}
        />
      </div>
    );
  }
);

EagleImage.displayName = 'EagleImage';

/**
 * ImageGrid - Grid container for displaying multiple Eagle images
 *
 * @example
 * ```tsx
 * <ImageGrid columns={4} gap={2}>
 *   {items.map(item => (
 *     <EagleImage key={item.id} item={item} useThumbnail aspectRatio="1/1" />
 *   ))}
 * </ImageGrid>
 * ```
 */
export interface ImageGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Number of columns (responsive: default 2, md:3, lg:4) */
  columns?: 2 | 3 | 4 | 5 | 6;
  /** Gap between items (Tailwind spacing scale) */
  gap?: 1 | 2 | 3 | 4;
}

const columnClasses = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  6: 'grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
} as const;

const gapClasses = {
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
} as const;

export const ImageGrid = React.forwardRef<HTMLDivElement, ImageGridProps>(
  ({ columns = 4, gap = 2, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('grid', columnClasses[columns], gapClasses[gap], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ImageGrid.displayName = 'ImageGrid';

/**
 * ImagePlaceholder - Placeholder for when no image is available
 */
export interface ImagePlaceholderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon to show (as React node) */
  icon?: React.ReactNode;
  /** Text to display */
  text?: string;
  /** Aspect ratio */
  aspectRatio?: string;
}

export const ImagePlaceholder = React.forwardRef<HTMLDivElement, ImagePlaceholderProps>(
  ({ icon, text = 'No image', aspectRatio = '1/1', className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center gap-2',
          'bg-muted text-muted-foreground rounded-lg',
          className
        )}
        style={{ aspectRatio }}
        {...props}
      >
        {icon && <div className="w-8 h-8 opacity-50">{icon}</div>}
        {text && <span className="text-xs">{text}</span>}
      </div>
    );
  }
);

ImagePlaceholder.displayName = 'ImagePlaceholder';

export default EagleImage;
