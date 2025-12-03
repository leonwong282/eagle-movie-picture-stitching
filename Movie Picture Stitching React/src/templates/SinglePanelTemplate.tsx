/**
 * Single Panel Template
 *
 * A simple single-panel plugin layout suitable for:
 * - Quick actions and tools
 * - Simple image processing
 * - Single-purpose utilities
 *
 * Features:
 * - Header with title and actions
 * - Main content area
 * - Optional footer with status/actions
 */
import { ReactNode } from 'react';
import { Header, Button } from '@/components';
import { cn } from '@/lib/utils';

interface SinglePanelTemplateProps {
  /** Plugin title */
  title: string;
  /** Header actions (rendered before settings/close buttons) */
  headerActions?: ReactNode;
  /** Show settings button */
  showSettings?: boolean;
  /** Settings click handler */
  onSettingsClick?: () => void;
  /** Show close button */
  showClose?: boolean;
  /** Close click handler */
  onCloseClick?: () => void;
  /** Main content */
  children: ReactNode;
  /** Footer content */
  footer?: ReactNode;
  /** Additional className for main content area */
  className?: string;
}

export function SinglePanelTemplate({
  title,
  headerActions,
  showSettings = false,
  onSettingsClick,
  showClose = true,
  onCloseClick,
  children,
  footer,
  className,
}: SinglePanelTemplateProps) {
  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <Header
        title={title}
        showThemeToggle
        showSettings={showSettings}
        onSettingsClick={onSettingsClick}
        showClose={showClose}
        onCloseClick={onCloseClick}
        actions={headerActions}
      />

      {/* Main Content */}
      <main className={cn('flex-1 overflow-auto p-4', className)}>{children}</main>

      {/* Optional Footer */}
      {footer && <footer className="border-t border-border bg-card/30 px-4 py-3">{footer}</footer>}
    </div>
  );
}

// ============================================
// Example Usage Component
// ============================================

import { useState } from 'react';
import { Wand2, Download, Loader2 } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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

export function SinglePanelExample() {
  const { items } = useEagleSelection();
  const { addToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState([85]);
  const [preserveMetadata, setPreserveMetadata] = useState(true);

  const handleProcess = async () => {
    if (items.length === 0) {
      addToast(toast.warning('No Selection', 'Please select images in Eagle first'));
      return;
    }

    setIsProcessing(true);
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    addToast(toast.success('Complete', `Processed ${items.length} images`));
  };

  return (
    <SinglePanelTemplate
      title="Image Processor"
      showSettings
      onSettingsClick={() => addToast(toast.info('Settings clicked'))}
      footer={
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {items.length} image{items.length !== 1 ? 's' : ''} selected
          </span>
          <Button variant="primary" onClick={handleProcess} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Process Images
              </>
            )}
          </Button>
        </div>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Export Settings
          </CardTitle>
          <CardDescription>Configure output format and quality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Output Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG - Lossless</SelectItem>
                <SelectItem value="jpg">JPG - Compressed</SelectItem>
                <SelectItem value="webp">WebP - Modern</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Quality</Label>
              <span className="text-sm font-medium">{quality[0]}%</span>
            </div>
            <Slider value={quality} onValueChange={setQuality} min={10} max={100} step={5} />
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox
              id="metadata"
              checked={preserveMetadata}
              onCheckedChange={(checked) => setPreserveMetadata(checked as boolean)}
            />
            <Label htmlFor="metadata">Preserve metadata</Label>
          </div>
        </CardContent>
      </Card>
    </SinglePanelTemplate>
  );
}

export default SinglePanelTemplate;
