/**
 * Batch Process Template
 *
 * A batch processing layout with progress tracking, suitable for:
 * - Bulk image processing
 * - File conversion
 * - Export operations
 *
 * Features:
 * - Progress indicator
 * - Item queue display
 * - Cancel/Pause support
 * - Results summary
 */
import { ReactNode, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  Square,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { Header, Button, Card, CardHeader, CardTitle, CardContent } from '@/components';
import { cn } from '@/lib/utils';

type ProcessStatus = 'idle' | 'processing' | 'paused' | 'completed' | 'error';

interface ProcessItem {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
}

interface BatchProcessTemplateProps {
  /** Plugin title */
  title: string;
  /** Items to process */
  items: ProcessItem[];
  /** Current processing status */
  status: ProcessStatus;
  /** Progress percentage (0-100) */
  progress: number;
  /** Start processing handler */
  onStart: () => void;
  /** Pause processing handler */
  onPause?: () => void;
  /** Resume processing handler */
  onResume?: () => void;
  /** Cancel processing handler */
  onCancel: () => void;
  /** Reset/retry handler */
  onReset?: () => void;
  /** Settings panel content */
  settings?: ReactNode;
  /** Close click handler */
  onCloseClick?: () => void;
}

export function BatchProcessTemplate({
  title,
  items,
  status,
  progress,
  onStart,
  onPause,
  onResume,
  onCancel,
  onReset,
  settings,
  onCloseClick,
}: BatchProcessTemplateProps) {
  const completedCount = items.filter((i) => i.status === 'completed').length;
  const errorCount = items.filter((i) => i.status === 'error').length;
  const pendingCount = items.filter((i) => i.status === 'pending').length;

  const getStatusIcon = (itemStatus: ProcessItem['status']) => {
    switch (itemStatus) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <Header title={title} showThemeToggle showClose onCloseClick={onCloseClick} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Settings Panel */}
        {settings && (
          <aside className="w-72 border-r border-border bg-card/30 p-4 overflow-auto">
            {settings}
          </aside>
        )}

        {/* Process Queue */}
        <main className="flex-1 flex flex-col overflow-hidden p-4">
          {/* Progress Section */}
          <Card className="mb-4">
            <CardContent className="py-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all duration-300',
                      status === 'error' ? 'bg-destructive' : 'bg-primary'
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span>{completedCount} completed</span>
                </div>
                {errorCount > 0 && (
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-destructive" />
                    <span>{errorCount} failed</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <span>{pendingCount} pending</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Queue List */}
          <Card className="flex-1 overflow-hidden flex flex-col">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Processing Queue ({items.length} items)</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto p-0">
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3',
                      item.status === 'processing' && 'bg-primary/5'
                    )}
                  >
                    {getStatusIcon(item.status)}
                    <span
                      className={cn(
                        'flex-1 text-sm truncate',
                        item.status === 'error' && 'text-destructive'
                      )}
                    >
                      {item.name}
                    </span>
                    {item.error && (
                      <span className="text-xs text-destructive truncate max-w-[200px]">
                        {item.error}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Footer Controls */}
      <footer className="border-t border-border bg-card/30 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {status === 'idle' && `Ready to process ${items.length} items`}
            {status === 'processing' && `Processing... ${completedCount}/${items.length}`}
            {status === 'paused' && 'Paused'}
            {status === 'completed' && `Completed: ${completedCount} success, ${errorCount} failed`}
            {status === 'error' && 'Processing stopped due to error'}
          </div>

          <div className="flex gap-2">
            {(status === 'completed' || status === 'error') && onReset && (
              <Button variant="outline" onClick={onReset}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}

            {status === 'processing' && onPause && (
              <Button variant="outline" onClick={onPause}>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </Button>
            )}

            {status === 'paused' && onResume && (
              <Button variant="outline" onClick={onResume}>
                <Play className="w-4 h-4 mr-2" />
                Resume
              </Button>
            )}

            {(status === 'processing' || status === 'paused') && (
              <Button variant="destructive" onClick={onCancel}>
                <Square className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}

            {status === 'idle' && (
              <Button variant="primary" onClick={onStart} disabled={items.length === 0}>
                <Play className="w-4 h-4 mr-2" />
                Start Processing
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// Example Usage Component
// ============================================

import { Wand2 } from 'lucide-react';
import {
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Slider,
  Checkbox,
  useToast,
  toast,
} from '@/components';
import { useEagleSelection } from '@/hooks';

export function BatchProcessExample() {
  const { items: selectedItems } = useEagleSelection();
  const { addToast } = useToast();
  const [status, setStatus] = useState<ProcessStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [format, setFormat] = useState('webp');
  const [quality, setQuality] = useState([85]);

  const [processItems, setProcessItems] = useState<ProcessItem[]>([]);

  // Initialize process items from selection
  const initializeItems = useCallback(() => {
    setProcessItems(
      selectedItems.map((item) => ({
        id: item.id,
        name: item.name || `Image ${item.id}`,
        status: 'pending',
      }))
    );
    setProgress(0);
  }, [selectedItems]);

  // Simulate processing
  const startProcessing = async () => {
    initializeItems();
    setStatus('processing');

    const items = selectedItems.map((item) => ({
      id: item.id,
      name: item.name || `Image ${item.id}`,
      status: 'pending' as const,
    }));

    for (let i = 0; i < items.length; i++) {
      // Update current item to processing
      setProcessItems((prev) =>
        prev.map((item, idx) => (idx === i ? { ...item, status: 'processing' } : item))
      );

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

      // Randomly fail some items for demo
      const success = Math.random() > 0.1;

      setProcessItems((prev) =>
        prev.map((item, idx) =>
          idx === i
            ? {
                ...item,
                status: success ? 'completed' : 'error',
                error: success ? undefined : 'Conversion failed',
              }
            : item
        )
      );

      setProgress(((i + 1) / items.length) * 100);
    }

    setStatus('completed');
    addToast(toast.success('Complete', `Processed ${items.length} images`));
  };

  const handleCancel = () => {
    setStatus('idle');
    setProgress(0);
    setProcessItems([]);
  };

  const handleReset = () => {
    setStatus('idle');
    setProgress(0);
    initializeItems();
  };

  // Initialize on selection change
  useState(() => {
    initializeItems();
  });

  return (
    <BatchProcessTemplate
      title="Batch Converter"
      items={
        processItems.length > 0
          ? processItems
          : selectedItems.map((item) => ({
              id: item.id,
              name: item.name || `Image ${item.id}`,
              status: 'pending',
            }))
      }
      status={status}
      progress={progress}
      onStart={startProcessing}
      onCancel={handleCancel}
      onReset={handleReset}
      settings={
        <div className="space-y-6">
          <h3 className="font-medium flex items-center gap-2">
            <Wand2 className="w-4 h-4" />
            Conversion Settings
          </h3>

          <div className="space-y-2">
            <Label>Output Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="webp">WebP</SelectItem>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
                <SelectItem value="avif">AVIF</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Quality</Label>
              <span className="text-sm font-medium">{quality[0]}%</span>
            </div>
            <Slider
              value={quality}
              onValueChange={setQuality}
              min={10}
              max={100}
              step={5}
              disabled={format === 'png'}
            />
          </div>

          <div className="space-y-3 pt-4 border-t border-border">
            <Checkbox id="resize" label="Resize images" />
            <Checkbox id="strip" label="Strip metadata" />
            <Checkbox id="overwrite" label="Overwrite existing" />
          </div>
        </div>
      }
    />
  );
}

export default BatchProcessTemplate;
