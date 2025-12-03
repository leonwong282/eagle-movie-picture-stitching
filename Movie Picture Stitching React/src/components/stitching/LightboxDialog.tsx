/**
 * LightboxDialog Component
 *
 * Full-screen dialog for viewing the stitched image with:
 * - Zoom in/out controls
 * - Pan (drag to move when zoomed)
 * - Keyboard navigation
 * - Mouse wheel zoom
 */

import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface LightboxDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Canvas to display */
  canvas: HTMLCanvasElement | null;
  /** Current zoom level */
  zoom: number;
  /** Current pan offset */
  offset: { x: number; y: number };
  /** Callback to close the dialog */
  onClose: () => void;
  /** Callback when zoom changes */
  onZoomChange: (zoom: number) => void;
  /** Callback when offset changes */
  onOffsetChange: (offset: { x: number; y: number }) => void;
  /** Callback to reset view */
  onResetView: () => void;
}

// ============================================================================
// Constants
// ============================================================================

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5.0;
const ZOOM_STEP = 0.1;
const WHEEL_ZOOM_FACTOR = 0.001;

// ============================================================================
// Zoom Controls Component
// ============================================================================

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  canZoomIn: boolean;
  canZoomOut: boolean;
}

function ZoomControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  canZoomIn,
  canZoomOut,
}: ZoomControlsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-background/80 backdrop-blur-sm border border-border">
      <Button
        variant="ghost"
        size="icon"
        onClick={onZoomOut}
        disabled={!canZoomOut}
        title={`${t('ui.lightbox.zoomOut')} (-)`}
        className="h-8 w-8"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onReset}
        title={`${t('ui.lightbox.resetZoom')} (0)`}
        className="h-8 w-8"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={onZoomIn}
        disabled={!canZoomIn}
        title={`${t('ui.lightbox.zoomIn')} (+)`}
        className="h-8 w-8"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>

      <span className="ml-2 text-xs font-medium tabular-nums min-w-[4ch] text-center">
        {Math.round(zoom * 100)}%
      </span>
    </div>
  );
}

// ============================================================================
// Info Display Component
// ============================================================================

interface InfoDisplayProps {
  width: number;
  height: number;
  zoom: number;
}

function InfoDisplay({ width, height, zoom }: InfoDisplayProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4 px-3 py-1.5 rounded-lg bg-background/80 backdrop-blur-sm border border-border text-xs text-muted-foreground">
      <span>{t('ui.lightbox.dimensions', { width, height })}</span>
      <span>{t('ui.lightbox.zoomLevel', { zoom: Math.round(zoom * 100) })}</span>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function LightboxDialog({
  isOpen,
  canvas,
  zoom,
  offset,
  onClose,
  onZoomChange,
  onOffsetChange,
  onResetView,
}: LightboxDialogProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Convert canvas to data URL for img src
  const imageSrc = useMemo(() => {
    if (!canvas) return null;
    try {
      return canvas.toDataURL('image/png');
    } catch (e) {
      console.error('[LightboxDialog] Failed to convert canvas to data URL:', e);
      return null;
    }
  }, [canvas]);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoom + ZOOM_STEP, MAX_ZOOM);
    onZoomChange(newZoom);
  }, [zoom, onZoomChange]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoom - ZOOM_STEP, MIN_ZOOM);
    onZoomChange(newZoom);
  }, [zoom, onZoomChange]);

  // Calculate fit zoom
  const calculateFitZoom = useCallback(() => {
    if (!canvas || !containerRef.current) return 1;

    const containerWidth = containerRef.current.clientWidth - 64; // padding
    const containerHeight = containerRef.current.clientHeight - 128; // padding + controls

    const scaleX = containerWidth / canvas.width;
    const scaleY = containerHeight / canvas.height;

    return Math.min(scaleX, scaleY, 1);
  }, [canvas]);

  // Reset view handler
  const handleResetView = useCallback(() => {
    const fitZoom = calculateFitZoom();
    onZoomChange(fitZoom);
    onOffsetChange({ x: 0, y: 0 });
    onResetView();
  }, [calculateFitZoom, onZoomChange, onOffsetChange, onResetView]);

  // Mouse wheel zoom
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY * WHEEL_ZOOM_FACTOR;
      const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom + delta * zoom));
      onZoomChange(newZoom);
    },
    [zoom, onZoomChange]
  );

  // Drag handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (zoom > 1) {
        setIsDragging(true);
        setDragStart({
          x: e.clientX - offset.x,
          y: e.clientY - offset.y,
        });
      }
    },
    [zoom, offset]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;

      onOffsetChange({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart, onOffsetChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Keyboard handlers
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
        case '_':
          e.preventDefault();
          handleZoomOut();
          break;
        case '0':
          e.preventDefault();
          handleResetView();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handleZoomIn, handleZoomOut, handleResetView]);

  // Wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!isOpen || !container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [isOpen, handleWheel]);

  // Set initial fit zoom when dialog opens
  useEffect(() => {
    if (!isOpen || !canvas) return;

    // Use double requestAnimationFrame to ensure container is fully laid out
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!containerRef.current || !canvas) return;
        
        const fitZoom = calculateFitZoom();
        // Always set initial zoom when dialog first opens (if zoom is 1.0 or invalid)
        if (zoom === 1.0 || zoom <= 0 || !isFinite(zoom)) {
          onZoomChange(Math.max(0.1, Math.min(1, fitZoom))); // Ensure zoom is between 0.1 and 1
        }
      });
    });
  }, [isOpen, canvas, calculateFitZoom, zoom, onZoomChange]);

  if (!canvas) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-background/95 backdrop-blur-md"
        aria-describedby={undefined}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{t('ui.lightbox.clickToEnlarge')}</DialogTitle>
        </DialogHeader>

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4 z-50 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background"
          aria-label={t('ui.lightbox.close')}
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Main Content */}
        <div
          ref={containerRef}
          className={cn(
            'flex-1 flex items-center justify-center p-8 overflow-hidden',
            zoom > 1 ? 'cursor-grab' : 'cursor-default',
            isDragging && 'cursor-grabbing'
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {/* Image Container */}
          {imageSrc && (
            <div
              style={{
                transform: `scale(${Math.max(0.1, Math.min(5, zoom))}) translate(${offset.x / Math.max(0.1, zoom)}px, ${offset.y / Math.max(0.1, zoom)}px)`,
                transformOrigin: 'center center',
                transition: isDragging ? 'none' : 'transform 0.1s ease-out',
              }}
            >
              <img
                src={imageSrc}
                alt="Stitched preview"
                className="max-w-none rounded-lg shadow-2xl"
                style={{
                  width: `${canvas.width}px`,
                  height: `${canvas.height}px`,
                  display: 'block',
                }}
              />
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <ZoomControls
            zoom={zoom}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={handleResetView}
            canZoomIn={zoom < MAX_ZOOM}
            canZoomOut={zoom > MIN_ZOOM}
          />

          <InfoDisplay
            width={canvas.width}
            height={canvas.height}
            zoom={zoom}
          />
        </div>

        {/* Instructions */}
        <div className="absolute bottom-4 right-4">
          <p className="text-xs text-muted-foreground/60 bg-background/50 px-2 py-1 rounded">
            {t('ui.lightbox.instructions')}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default LightboxDialog;

