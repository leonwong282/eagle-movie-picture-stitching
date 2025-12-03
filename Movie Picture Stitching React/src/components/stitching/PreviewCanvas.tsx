/**
 * PreviewCanvas Component
 *
 * Displays the stitched image preview with:
 * - Loading states
 * - Error states
 * - Click to open lightbox
 * - Canvas statistics display
 */

import { useCallback, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, ImageIcon, ZoomIn, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface PreviewCanvasProps {
  /** Preview canvas element */
  canvas: HTMLCanvasElement | null;
  /** Whether preview is being generated */
  isLoading?: boolean;
  /** Error message if preview failed */
  error?: string | null;
  /** Whether there are images selected */
  hasImages?: boolean;
  /** Canvas width */
  width?: number;
  /** Canvas height */
  height?: number;
  /** Number of images processed */
  imageCount?: number;
  /** Processing time in ms */
  processingTime?: number;
  /** Callback when canvas is clicked (to open lightbox) */
  onCanvasClick?: () => void;
  /** Additional className */
  className?: string;
}

// ============================================================================
// Stats Display Component
// ============================================================================

interface StatsDisplayProps {
  width: number;
  height: number;
  imageCount: number;
  processingTime?: number;
}

function StatsDisplay({ width, height, imageCount, processingTime }: StatsDisplayProps) {
  const { t } = useTranslation();

  return (
    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
      <div className="px-2 py-1 rounded bg-background/80 backdrop-blur-sm border border-border text-xs text-muted-foreground">
        {t('ui.interface.imagesProcessed', { count: imageCount, width, height })}
      </div>
      {processingTime && (
        <div className="px-2 py-1 rounded bg-background/80 backdrop-blur-sm border border-border text-xs text-muted-foreground">
          {processingTime.toFixed(0)}ms
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Empty State Component
// ============================================================================

function EmptyState() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        <ImageIcon className="w-10 h-10 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground max-w-xs">
        {t('ui.tooltips.preview')}
      </p>
    </div>
  );
}

// ============================================================================
// Loading State Component
// ============================================================================

function LoadingState() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
      <p className="text-sm text-muted-foreground">
        {t('ui.status.processing')}
      </p>
    </div>
  );
}

// ============================================================================
// Error State Component
// ============================================================================

interface ErrorStateProps {
  error: string;
}

function ErrorState({ error }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-destructive" />
      </div>
      <p className="text-sm font-medium text-destructive mb-2">
        {t('ui.status.error')}
      </p>
      <p className="text-xs text-muted-foreground max-w-xs">{error}</p>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function PreviewCanvas({
  canvas,
  isLoading = false,
  error = null,
  hasImages = false,
  width,
  height,
  imageCount = 0,
  processingTime,
  onCanvasClick,
  className,
}: PreviewCanvasProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Convert canvas to data URL for img src
  const imageSrc = useMemo(() => {
    if (!canvas) return null;
    try {
      return canvas.toDataURL('image/png');
    } catch (e) {
      console.error('[PreviewCanvas] Failed to convert canvas to data URL:', e);
      return null;
    }
  }, [canvas]);

  // Handle canvas click
  const handleClick = useCallback(() => {
    if (canvas && onCanvasClick) {
      onCanvasClick();
    }
  }, [canvas, onCanvasClick]);

  // Handle keyboard interaction
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && canvas && onCanvasClick) {
        e.preventDefault();
        onCanvasClick();
      }
    },
    [canvas, onCanvasClick]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className={cn('relative h-full', className)}>
        <LoadingState />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cn('relative h-full', className)}>
        <ErrorState error={error} />
      </div>
    );
  }

  // Empty state (no canvas and no images)
  if (!canvas && !hasImages) {
    return (
      <div className={cn('relative h-full', className)}>
        <EmptyState />
      </div>
    );
  }

  // Waiting for preview generation (has images but no canvas)
  if (!canvas && hasImages) {
    return (
      <div className={cn('relative h-full', className)}>
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            {t('ui.messages.generatePreview')}
          </p>
        </div>
      </div>
    );
  }

  // Canvas preview
  return (
    <div
      ref={containerRef}
      className={cn(
        'relative h-full flex flex-col p-4',
        className
      )}
    >
      {/* Canvas Container */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative group cursor-pointer flex-1',
          'flex items-center justify-center',
          'min-h-0 min-w-0 w-full max-w-full overflow-auto',
          'rounded-lg border border-border',
          'transition-all duration-200',
          'hover:border-primary/50 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50'
        )}
        aria-label={t('ui.lightbox.clickToEnlarge')}
        title={t('ui.lightbox.clickToEnlarge')}
      >
        {/* Preview Image */}
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Stitched preview"
            className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-lg"
            style={{ display: 'block', margin: '0 auto' }}
          />
        )}

        {/* Zoom Indicator Overlay */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'bg-background/60 backdrop-blur-sm',
            'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
            'pointer-events-none'
          )}
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground">
            <ZoomIn className="w-4 h-4" />
            <span className="text-sm font-medium">
              {t('ui.lightbox.clickToEnlarge')}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Display */}
      {width && height && imageCount > 0 && (
        <StatsDisplay
          width={width}
          height={height}
          imageCount={imageCount}
          processingTime={processingTime}
        />
      )}
    </div>
  );
}

export default PreviewCanvas;

