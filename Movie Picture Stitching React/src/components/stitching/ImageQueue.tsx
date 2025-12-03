/**
 * ImageQueue Component
 *
 * Displays a sortable list of selected images with drag-and-drop reordering.
 * Shows thumbnails, names, and dimensions for each image.
 */

import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GripVertical, ImageIcon, AlertCircle } from 'lucide-react';
import type { Item } from '@/types/eagle';
import { cn } from '@/lib/utils';

// ============================================================================
// Types
// ============================================================================

interface ImageQueueProps {
  /** List of images to display */
  images: Item[];
  /** Callback when images are reordered */
  onReorder: (fromIndex: number, toIndex: number) => void;
  /** Whether a preview is currently being generated */
  isProcessing?: boolean;
  /** Additional className */
  className?: string;
}

interface DragState {
  /** Index of the item being dragged */
  dragIndex: number | null;
  /** Index of the current drop target */
  dropIndex: number | null;
}

// ============================================================================
// Image Item Component
// ============================================================================

interface ImageItemProps {
  item: Item;
  index: number;
  isDragging: boolean;
  isDropTarget: boolean;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
}

function ImageItem({
  item,
  index,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragOver,
  onDragEnd,
}: ImageItemProps) {
  const { t } = useTranslation();

  // Get thumbnail URL - use thumbnailURL or fileURL for local files
  const thumbnailUrl = item.thumbnailURL || item.fileURL || '';
  const hasError = !thumbnailUrl;

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(index));
        onDragStart(index);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        onDragOver(index);
      }}
      onDragEnd={onDragEnd}
      className={cn(
        'group flex items-center gap-2 p-2 rounded-lg cursor-grab',
        'border border-transparent transition-all duration-200',
        'hover:bg-muted/50 hover:border-border',
        isDragging && 'opacity-50 cursor-grabbing bg-muted/30',
        isDropTarget && 'border-primary border-dashed bg-primary/10'
      )}
    >
      {/* Drag Handle */}
      <div className="flex-shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Index Badge */}
      <div className="flex-shrink-0 w-6 h-6 rounded bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
        {index + 1}
      </div>

      {/* Thumbnail */}
      <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden bg-muted border border-border">
        {hasError ? (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <AlertCircle className="w-5 h-5" />
          </div>
        ) : (
          <img
            src={thumbnailUrl}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              // Replace with fallback icon on error
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement?.classList.add('flex', 'items-center', 'justify-center');
              const icon = document.createElement('div');
              icon.innerHTML = '<svg class="w-5 h-5 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
              target.parentElement?.appendChild(icon);
            }}
          />
        )}
      </div>

      {/* Image Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" title={item.name}>
          {item.name || t('ui.interface.imageName', { index: index + 1 })}
        </p>
        <p className="text-xs text-muted-foreground">
          {item.width && item.height ? (
            `${item.width}×${item.height}`
          ) : (
            <span className="italic">{t('ui.status.loading')}</span>
          )}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Empty State Component
// ============================================================================

function EmptyState() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-full py-8 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        <ImageIcon className="w-8 h-8 text-muted-foreground" />
      </div>
      <p
        className="text-sm text-muted-foreground"
        dangerouslySetInnerHTML={{
          __html: t('ui.interface.noImagesSelected'),
        }}
      />
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function ImageQueue({
  images,
  onReorder,
  isProcessing = false,
  className,
}: ImageQueueProps) {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<DragState>({
    dragIndex: null,
    dropIndex: null,
  });

  // Handle drag start
  const handleDragStart = useCallback((index: number) => {
    setDragState({ dragIndex: index, dropIndex: null });
  }, []);

  // Handle drag over item
  const handleDragOver = useCallback((index: number) => {
    setDragState((prev) => ({
      ...prev,
      dropIndex: index,
    }));
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback(() => {
    const { dragIndex, dropIndex } = dragState;

    if (dragIndex !== null && dropIndex !== null && dragIndex !== dropIndex) {
      onReorder(dragIndex, dropIndex);
    }

    setDragState({ dragIndex: null, dropIndex: null });
  }, [dragState, onReorder]);

  // Handle drop on container (for dropping at end)
  const handleContainerDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleDragEnd();
    },
    [handleDragEnd]
  );

  // Handle drag over container
  const handleContainerDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  // Empty state
  if (images.length === 0) {
    return (
      <div className={cn('h-full', className)}>
        <EmptyState />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('h-full overflow-hidden flex flex-col', className)}
      onDrop={handleContainerDrop}
      onDragOver={handleContainerDragOver}
    >
      {/* Header */}
      <div className="flex-shrink-0 px-3 py-2 border-b border-border">
        <p className="text-sm text-muted-foreground text-center">
          {t('ui.interface.imagesSelected', { count: images.length })}
        </p>
      </div>

      {/* Image List */}
      <div
        className={cn(
          'flex-1 overflow-y-auto overflow-x-hidden p-2 space-y-1',
          isProcessing && 'pointer-events-none opacity-60'
        )}
      >
        {images.map((item, index) => (
          <ImageItem
            key={item.id}
            item={item}
            index={index}
            isDragging={dragState.dragIndex === index}
            isDropTarget={
              dragState.dropIndex === index && dragState.dragIndex !== index
            }
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>

      {/* Drag hint */}
      {images.length > 1 && !isProcessing && (
        <div className="flex-shrink-0 px-3 py-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center italic">
            {t('ui.tooltips.dragToReorder', 'Drag to reorder images')}
          </p>
        </div>
      )}
    </div>
  );
}

export default ImageQueue;

