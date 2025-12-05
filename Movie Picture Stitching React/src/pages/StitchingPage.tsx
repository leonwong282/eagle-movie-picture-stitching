/**
 * StitchingPage
 *
 * Main page for Movie Picture Stitching plugin.
 * Uses ThreeColumnTemplate with:
 * - Left: Image queue with drag-drop reordering
 * - Center: Preview canvas
 * - Right: Parameter controls
 * - Footer: Action buttons
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle } from 'lucide-react';
import { ThreeColumnTemplate, ThreeColumnFooter } from '@/templates';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { ImageQueue, ParameterPanel, PreviewCanvas, LightboxDialog, ShortcutsDialog } from '@/components/stitching';
import { useSelection, useStitching, useSettings } from '@/stores';
import { useKeyboardShortcuts } from '@/hooks';
import { eagleApi } from '@/lib/eagle-api';
import {
  stitchImages,
  canvasToBlobWithFormat,
  generateFilename,
  type StitchingImageData,
} from '@/lib';
import type { ExportFormat } from '@/stores';

// ============================================================================
// Types
// ============================================================================

interface ProcessingState {
  isGenerating: boolean;
  isSaving: boolean;
  error: string | null;
  processingTime?: number;
}

// ============================================================================
// Main Component
// ============================================================================

export function StitchingPage() {
  const { t } = useTranslation();
  const { addToast } = useToast();

  // Store hooks
  const { items: selectedItems, startPolling, stopPolling } = useSelection();
  const { autoPreview } = useSettings();
  const {
    reorderedImages,
    cropTopPercent,
    cropBottomPercent,
    maxCropTop,
    maxCropBottom,
    exportFormat,
    exportQuality,
    hasPreviewGenerated,
    previewCanvas,
    isAlwaysOnTop,
    isLightboxOpen,
    lightboxZoom,
    lightboxOffset,
    setReorderedImages,
    reorderImages,
    setCropTopPercent,
    setCropBottomPercent,
    setExportFormat,
    setExportQuality,
    setPreviewCanvas,
    setHasPreviewGenerated,
    setIsAlwaysOnTop,
    openLightbox,
    closeLightbox,
    setLightboxZoom,
    setLightboxOffset,
    resetLightboxView,
    clearCaches,
  } = useStitching();

  // Local state
  const [processing, setProcessing] = useState<ProcessingState>({
    isGenerating: false,
    isSaving: false,
    error: null,
  });
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);

  // Refs
  const lastSelectionRef = useRef<string>('');
  const cropTopRef = useRef<HTMLInputElement>(null);
  const cropBottomRef = useRef<HTMLInputElement>(null);

  // Get current images (reordered or from selection)
  const currentImages = reorderedImages || selectedItems;

  // Update reordered images when selection changes
  useEffect(() => {
    const selectionHash = selectedItems.map((i) => i.id).join(',');

    if (selectionHash !== lastSelectionRef.current) {
      lastSelectionRef.current = selectionHash;
      // Reset reordered images to use new selection
      setReorderedImages(selectedItems.length > 0 ? [...selectedItems] : null);
      // Clear preview when selection changes
      clearCaches();
    }
  }, [selectedItems, setReorderedImages, clearCaches]);

  // Start polling on mount
  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, [startPolling, stopPolling]);

  // Handle image reorder
  const handleReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (!reorderedImages) {
        // Initialize reordered images from selection
        const newImages = [...selectedItems];
        const [movedItem] = newImages.splice(fromIndex, 1);
        newImages.splice(toIndex, 0, movedItem);
        setReorderedImages(newImages);
      } else {
        reorderImages(fromIndex, toIndex);
      }

      addToast({
        title: t('ui.messages.imagesReordered'),
        type: 'success',
      });
    },
    [reorderedImages, selectedItems, setReorderedImages, reorderImages, addToast, t]
  );

  // Handle preview generation
  const handlePreview = useCallback(async () => {
    if (currentImages.length === 0) {
      addToast({
        title: t('ui.messages.selectImages'),
        type: 'error',
      });
      return;
    }

    setProcessing({ isGenerating: true, isSaving: false, error: null });

    try {
      // Convert Item[] to StitchingImageData[]
      // Use fileURL (file:// URL) for proper browser image loading, not filePath
      const imageData: StitchingImageData[] = currentImages.map((item, index) => ({
        url: item.fileURL || item.thumbnailURL || '',
        width: item.width || 0,
        height: item.height || 0,
        name: item.name || `Image ${index + 1}`,
      }));

      // Generate stitched image
      const result = await stitchImages(imageData, {
        cropTopPercent,
        cropBottomPercent,
      });

      setPreviewCanvas(result.canvas);
      setHasPreviewGenerated(true);
      setProcessing({
        isGenerating: false,
        isSaving: false,
        error: null,
        processingTime: result.processingTime,
      });

      console.log(`[Stitching] Preview generated: ${result.imageCount} images, ${result.width}x${result.height}, ${result.processingTime.toFixed(0)}ms`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('ui.interface.unknownError');
      setProcessing({
        isGenerating: false,
        isSaving: false,
        error: errorMessage,
      });
      addToast({
        title: t('ui.interface.previewGenerationFailed', { error: errorMessage }),
        type: 'error',
      });
    }
  }, [currentImages, cropTopPercent, cropBottomPercent, setPreviewCanvas, setHasPreviewGenerated, addToast, t]);

  // Auto-update preview when images are reordered (if autoPreview is enabled)
  const reorderedImagesRef = useRef<string>('');
  useEffect(() => {
    if (!autoPreview || !hasPreviewGenerated) return;

    const currentImageIds = (reorderedImages || selectedItems).map((i) => i.id).join(',');

    // Only trigger if the order actually changed (not just on mount)
    if (reorderedImagesRef.current && reorderedImagesRef.current !== currentImageIds) {
      // Debounce the preview update
      const timeoutId = setTimeout(() => {
        handlePreview();
      }, 300);

      return () => clearTimeout(timeoutId);
    }

    reorderedImagesRef.current = currentImageIds;
  }, [reorderedImages, selectedItems, autoPreview, hasPreviewGenerated, handlePreview]);

  // Handle save
  const handleSave = useCallback(async () => {
    if (!previewCanvas) {
      addToast({
        title: t('ui.messages.generatePreview'),
        type: 'error',
      });
      return;
    }

    setProcessing((prev) => ({ ...prev, isSaving: true, error: null }));

    try {
      // Get current folder
      const folder = await eagleApi.getSelectedFolder();

      // Convert canvas to blob
      const blob = await canvasToBlobWithFormat(previewCanvas, {
        format: exportFormat,
        quality: exportQuality,
      });

      if (!blob) {
        throw new Error('Failed to convert canvas to blob');
      }

      // Generate filename
      const filename = generateFilename(exportFormat);

      // Create a temporary file and add to Eagle
      // In Eagle environment, we use the file system
      if (!eagleApi.isMock) {
        // Use Eagle's native file saving
        const fs = (window as Window & { require: (m: string) => typeof import('fs') }).require('fs');
        const path = (window as Window & { require: (m: string) => typeof import('path') }).require('path');
        const os = (window as Window & { require: (m: string) => typeof import('os') }).require('os');

        const tempDir = os.tmpdir();
        const tempPath = path.join(tempDir, filename);

        // Convert blob to buffer and write
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        fs.writeFileSync(tempPath, buffer);

        // Add to Eagle
        await eagleApi.addImageFromPath(tempPath, {
          name: filename.replace(/\.[^/.]+$/, ''), // Remove extension
          folders: folder?.id ? [folder.id] : [],
        });

        // Clean up temp file after a delay
        setTimeout(() => {
          try {
            fs.unlinkSync(tempPath);
          } catch (e) {
            console.warn('[Stitching] Failed to delete temp file:', e);
          }
        }, 1000);
      } else {
        // Mock mode - just download the file
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      setProcessing((prev) => ({ ...prev, isSaving: false }));
      addToast({
        title: t('ui.messages.success'),
        type: 'success',
      });

      console.log(`[Stitching] Image saved: ${filename}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('ui.interface.unknownError');
      setProcessing((prev) => ({ ...prev, isSaving: false, error: errorMessage }));
      addToast({
        title: t('ui.messages.saveError', { error: errorMessage }),
        type: 'error',
      });
    }
  }, [previewCanvas, exportFormat, exportQuality, addToast, t]);

  // Handle pin toggle
  const handlePinToggle = useCallback(() => {
    const newState = !isAlwaysOnTop;
    setIsAlwaysOnTop(newState);
    eagleApi.setAlwaysOnTop(newState);
  }, [isAlwaysOnTop, setIsAlwaysOnTop]);

  // Handle close
  const handleClose = useCallback(() => {
    eagleApi.closeWindow();
  }, []);

  // Handle help
  const handleHelp = useCallback(() => {
    setShowShortcutsModal(true);
  }, []);

  // Handle focus crop top
  const handleFocusCropTop = useCallback(() => {
    cropTopRef.current?.focus();
  }, []);

  // Handle focus crop bottom
  const handleFocusCropBottom = useCallback(() => {
    cropBottomRef.current?.focus();
  }, []);

  // Handle cycle format
  const handleCycleFormat = useCallback(() => {
    const formats: ExportFormat[] = ['jpg', 'webp', 'png'];
    const currentIndex = formats.indexOf(exportFormat);
    const nextIndex = (currentIndex + 1) % formats.length;
    setExportFormat(formats[nextIndex]);
  }, [exportFormat, setExportFormat]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    enabled: !isLightboxOpen, // Disable when lightbox is open
    handlers: {
      onPreview: handlePreview,
      onSave: handleSave,
      onPin: handlePinToggle,
      onClose: handleClose,
      onHelp: handleHelp,
      onFocusCropTop: handleFocusCropTop,
      onFocusCropBottom: handleFocusCropBottom,
      onCycleFormat: handleCycleFormat,
    },
  });

  // Header actions
  const headerActions = (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleHelp}
        title={t('ui.header.helpButton')}
        className="h-8 w-8"
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
    </>
  );

  // Footer content
  const footer = (
    <ThreeColumnFooter
      status={
        <div className="text-sm text-muted-foreground">
          {processing.isGenerating ? t('ui.status.processing') :
           processing.isSaving ? t('ui.status.loading') :
           processing.error ? t('ui.status.error') :
           hasPreviewGenerated ? t('ui.status.success') :
           t('ui.status.ready')}
        </div>
      }
      actions={
        <div className="flex items-center gap-2">
          <Button
            onClick={handlePreview}
            disabled={processing.isGenerating || processing.isSaving || currentImages.length === 0}
            variant="default"
          >
            {processing.isGenerating ? t('ui.buttons.processing') : t('ui.buttons.preview')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={processing.isGenerating || processing.isSaving || !hasPreviewGenerated}
            variant="default"
            className="bg-green-600 hover:bg-green-700"
          >
            {processing.isSaving ? t('ui.buttons.saving') : t('ui.buttons.save')}
          </Button>
        </div>
      }
    />
  );

  return (
    <>
      <ThreeColumnTemplate
        title={t('ui.header.title')}
        headerActions={headerActions}
        showThemeToggle
        showClose
        onCloseClick={handleClose}
        leftPanel={
          <ImageQueue
            images={currentImages}
            onReorder={handleReorder}
            isProcessing={processing.isGenerating}
          />
        }
        leftTitle={t('ui.panels.imageList')}
        leftWidth="w-64"
        centerTitle={t('ui.panels.preview')}
        rightPanel={
          <ParameterPanel
            cropTopPercent={cropTopPercent}
            cropBottomPercent={cropBottomPercent}
            maxCropTop={maxCropTop}
            maxCropBottom={maxCropBottom}
            exportFormat={exportFormat}
            exportQuality={exportQuality}
            onCropTopChange={setCropTopPercent}
            onCropBottomChange={setCropBottomPercent}
            onFormatChange={setExportFormat}
            onQualityChange={setExportQuality}
            disabled={processing.isGenerating || processing.isSaving}
            cropTopInputRef={cropTopRef}
            cropBottomInputRef={cropBottomRef}
          />
        }
        rightTitle={t('ui.panels.settings')}
        rightWidth="w-72"
        footer={footer}
      >
        <PreviewCanvas
          canvas={previewCanvas}
          isLoading={processing.isGenerating}
          error={processing.error}
          hasImages={currentImages.length > 0}
          width={previewCanvas?.width}
          height={previewCanvas?.height}
          imageCount={currentImages.length}
          processingTime={processing.processingTime}
          onCanvasClick={openLightbox}
        />
      </ThreeColumnTemplate>

      {/* Lightbox Dialog */}
      <LightboxDialog
        isOpen={isLightboxOpen}
        canvas={previewCanvas}
        zoom={lightboxZoom}
        offset={lightboxOffset}
        onClose={closeLightbox}
        onZoomChange={setLightboxZoom}
        onOffsetChange={setLightboxOffset}
        onResetView={resetLightboxView}
      />

      {/* Shortcuts Help Dialog */}
      <ShortcutsDialog
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
      />
    </>
  );
}

export default StitchingPage;

