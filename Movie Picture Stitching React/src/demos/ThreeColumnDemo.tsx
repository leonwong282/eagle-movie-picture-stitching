/**
 * Three-Column Layout Demo
 *
 * Demonstrates the ThreeColumnTemplate with:
 * - Left: Image queue from Eagle selection
 * - Center: Large preview of selected image
 * - Right: Parameter controls (sliders, selects, checkboxes)
 * - Footer: Action buttons and processing status
 */
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Play,
  Square,
  RotateCcw,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {
  ThreeColumnTemplate,
  ThreeColumnFooter,
  QueueItem,
  ParameterSection,
  StatusBadge,
} from '@/templates/ThreeColumnTemplate';
import {
  Button,
  Card,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Slider,
  Checkbox,
  EagleImage,
  ImagePlaceholder,
} from '@/components';
import { useEagleSelection } from '@/hooks';
import { cn } from '@/lib/utils';
import type { Item } from '@/types/eagle';

// ============================================================================
// Types
// ============================================================================

type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'error';

interface QueueItemState {
  item: Item;
  status: ProcessingStatus;
}

// ============================================================================
// Demo Component
// ============================================================================

export function ThreeColumnDemo() {
  const { t } = useTranslation();
  const { items: selectedItems, isLoading } = useEagleSelection();

  // State
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedItems, setProcessedItems] = useState<Set<string>>(new Set());
  const [errorItems, setErrorItems] = useState<Set<string>>(new Set());

  // Parameters
  const [outputFormat, setOutputFormat] = useState('png');
  const [quality, setQuality] = useState([85]);
  const [scale, setScale] = useState([100]);
  const [preserveMetadata, setPreserveMetadata] = useState(true);
  const [autoProcess, setAutoProcess] = useState(false);

  // Derived state
  const queueItems: QueueItemState[] = useMemo(() => {
    return selectedItems.map((item) => ({
      item,
      status: errorItems.has(item.id)
        ? 'error'
        : processedItems.has(item.id)
          ? 'completed'
          : isProcessing && selectedItems[selectedIndex]?.id === item.id
            ? 'processing'
            : 'idle',
    }));
  }, [selectedItems, processedItems, errorItems, isProcessing, selectedIndex]);

  const currentItem = selectedItems[selectedIndex];
  const completedCount = processedItems.size;
  const totalCount = selectedItems.length;

  // Handlers
  const handleProcess = async () => {
    if (!currentItem || isProcessing) return;

    setIsProcessing(true);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Randomly succeed or fail for demo purposes
    if (Math.random() > 0.2) {
      setProcessedItems((prev) => new Set([...prev, currentItem.id]));
    } else {
      setErrorItems((prev) => new Set([...prev, currentItem.id]));
    }

    setIsProcessing(false);

    // Auto-advance to next unprocessed item
    if (autoProcess) {
      const nextIndex = selectedItems.findIndex(
        (item, i) => i > selectedIndex && !processedItems.has(item.id) && !errorItems.has(item.id)
      );
      if (nextIndex !== -1) {
        setSelectedIndex(nextIndex);
        // Continue processing
        setTimeout(() => handleProcess(), 100);
      }
    }
  };

  const handleProcessAll = async () => {
    setIsProcessing(true);

    for (let i = 0; i < selectedItems.length; i++) {
      const item = selectedItems[i];
      if (processedItems.has(item.id) || errorItems.has(item.id)) continue;

      setSelectedIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (Math.random() > 0.15) {
        setProcessedItems((prev) => new Set([...prev, item.id]));
      } else {
        setErrorItems((prev) => new Set([...prev, item.id]));
      }
    }

    setIsProcessing(false);
  };

  const handleReset = () => {
    setProcessedItems(new Set());
    setErrorItems(new Set());
    setSelectedIndex(0);
    setIsProcessing(false);
  };

  const handleStop = () => {
    setIsProcessing(false);
  };

  // ========================================
  // Render
  // ========================================

  return (
    <ThreeColumnTemplate
      title={t('demos.threeColumn.title', 'Image Processor')}
      showThemeToggle
      leftTitle={t('demos.threeColumn.inputQueue', 'Input Queue')}
      leftWidth="w-56"
      centerTitle={t('demos.threeColumn.preview', 'Preview')}
      rightTitle={t('demos.threeColumn.parameters', 'Parameters')}
      rightWidth="w-64"
      // ========================================
      // Left Panel - Image Queue
      // ========================================
      leftPanel={
        <div className="space-y-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : queueItems.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="w-10 h-10 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {t('demos.threeColumn.noImages', 'Select images in Eagle')}
              </p>
            </div>
          ) : (
            queueItems.map(({ item, status }, index) => (
              <QueueItem
                key={item.id}
                thumbnail={item.thumbnailURL || item.fileURL}
                title={item.name}
                subtitle={`${item.width}×${item.height} • ${item.ext.toUpperCase()}`}
                isSelected={index === selectedIndex}
                isProcessing={status === 'processing'}
                isCompleted={status === 'completed'}
                hasError={status === 'error'}
                onClick={() => setSelectedIndex(index)}
              />
            ))
          )}
        </div>
      }
      // ========================================
      // Right Panel - Parameters
      // ========================================
      rightPanel={
        <div className="space-y-6">
          {/* Output Settings */}
          <ParameterSection title={t('demos.threeColumn.outputSettings', 'Output Settings')}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{t('demos.threeColumn.format', 'Format')}</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpg">JPEG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                    <SelectItem value="avif">AVIF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>{t('demos.threeColumn.quality', 'Quality')}</Label>
                  <span className="text-sm font-medium">{quality[0]}%</span>
                </div>
                <Slider
                  value={quality}
                  onValueChange={setQuality}
                  min={1}
                  max={100}
                  step={1}
                  disabled={outputFormat === 'png'}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>{t('demos.threeColumn.scale', 'Scale')}</Label>
                  <span className="text-sm font-medium">{scale[0]}%</span>
                </div>
                <Slider value={scale} onValueChange={setScale} min={10} max={200} step={5} />
              </div>
            </div>
          </ParameterSection>

          {/* Processing Options */}
          <ParameterSection title={t('demos.threeColumn.options', 'Options')}>
            <div className="space-y-3">
              <Checkbox
                id="preserve-metadata"
                label={t('demos.threeColumn.preserveMetadata', 'Preserve metadata')}
                checked={preserveMetadata}
                onCheckedChange={(checked) => setPreserveMetadata(checked as boolean)}
              />
              <Checkbox
                id="auto-process"
                label={t('demos.threeColumn.autoProcess', 'Auto-process next')}
                checked={autoProcess}
                onCheckedChange={(checked) => setAutoProcess(checked as boolean)}
              />
            </div>
          </ParameterSection>

          {/* Statistics */}
          <ParameterSection title={t('demos.threeColumn.statistics', 'Statistics')}>
            <div className="grid grid-cols-2 gap-3 text-center">
              <Card className="p-3">
                <div className="text-2xl font-bold text-success">{completedCount}</div>
                <div className="text-xs text-muted-foreground">
                  {t('demos.threeColumn.completed', 'Completed')}
                </div>
              </Card>
              <Card className="p-3">
                <div className="text-2xl font-bold text-destructive">{errorItems.size}</div>
                <div className="text-xs text-muted-foreground">
                  {t('demos.threeColumn.errors', 'Errors')}
                </div>
              </Card>
            </div>
          </ParameterSection>
        </div>
      }
      // ========================================
      // Footer - Actions & Status
      // ========================================
      footer={
        <ThreeColumnFooter
          status={
            <>
              <StatusBadge
                status={isProcessing ? 'processing' : completedCount > 0 ? 'success' : 'idle'}
                text={
                  isProcessing
                    ? t('demos.threeColumn.processing', 'Processing...')
                    : `${completedCount}/${totalCount} ${t('demos.threeColumn.processed', 'processed')}`
                }
              />
              {currentItem && (
                <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                  {currentItem.name}.{currentItem.ext}
                </span>
              )}
            </>
          }
          center={
            totalCount > 0 && (
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-300',
                    errorItems.size > 0 ? 'bg-warning' : 'bg-success'
                  )}
                  style={{ width: `${((completedCount + errorItems.size) / totalCount) * 100}%` }}
                />
              </div>
            )
          }
          actions={
            <>
              <Button variant="outline" size="sm" onClick={handleReset} disabled={isProcessing}>
                <RotateCcw className="w-4 h-4 mr-1" />
                {t('demos.threeColumn.reset', 'Reset')}
              </Button>

              {isProcessing ? (
                <Button variant="destructive" size="sm" onClick={handleStop}>
                  <Square className="w-4 h-4 mr-1" />
                  {t('demos.threeColumn.stop', 'Stop')}
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleProcess}
                    disabled={!currentItem || processedItems.has(currentItem?.id)}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    {t('demos.threeColumn.processOne', 'Process')}
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleProcessAll}
                    disabled={totalCount === 0 || completedCount === totalCount}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    {t('demos.threeColumn.processAll', 'Process All')}
                  </Button>
                </>
              )}
            </>
          }
        />
      }
    >
      {/* ========================================
          Center Panel - Preview
          ======================================== */}
      <div className="h-full flex flex-col">
        {currentItem ? (
          <Card className="flex-1 flex flex-col overflow-hidden">
            {/* Image Preview */}
            <div className="flex-1 flex items-center justify-center p-4 bg-muted/30">
              <EagleImage
                item={currentItem}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                fallback={
                  <ImagePlaceholder
                    icon={<ImageIcon className="w-full h-full" />}
                    text={currentItem.ext.toUpperCase()}
                    aspectRatio="16/9"
                    className="w-64"
                  />
                }
              />
            </div>

            {/* Image Info Bar */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-card/50">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {currentItem.name}.{currentItem.ext}
                </span>
                <span>
                  {currentItem.width} × {currentItem.height}
                </span>
                <span>{(currentItem.size / 1024).toFixed(1)} KB</span>
              </div>

              <div className="flex items-center gap-2">
                {processedItems.has(currentItem.id) && (
                  <span className="flex items-center gap-1 text-sm text-success">
                    <CheckCircle2 className="w-4 h-4" />
                    {t('demos.threeColumn.done', 'Done')}
                  </span>
                )}
                {errorItems.has(currentItem.id) && (
                  <span className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    {t('demos.threeColumn.failed', 'Failed')}
                  </span>
                )}
                {isProcessing && selectedItems[selectedIndex]?.id === currentItem.id && (
                  <span className="flex items-center gap-1 text-sm text-warning">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('demos.threeColumn.processing', 'Processing...')}
                  </span>
                )}
              </div>
            </div>
          </Card>
        ) : (
          <Card className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-lg font-medium mb-1">
                {t('demos.threeColumn.noSelection', 'No Image Selected')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('demos.threeColumn.selectPrompt', 'Select images in Eagle to get started')}
              </p>
            </div>
          </Card>
        )}
      </div>
    </ThreeColumnTemplate>
  );
}

export default ThreeColumnDemo;
