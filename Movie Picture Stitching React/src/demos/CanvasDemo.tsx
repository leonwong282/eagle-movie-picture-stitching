/**
 * Canvas Demo
 *
 * Demonstrates Canvas API usage for image processing:
 * - Canvas rendering basics
 * - Image loading and display
 * - Simple image transformations
 * - Export to different formats
 *
 * This serves as a starting point for image processing plugins.
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Image,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Download,
  RefreshCw,
  Palette,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  useToast,
  toast,
} from '@/components';

// Demo image (placeholder)
const DEMO_IMAGE_URL = 'https://picsum.photos/400/300';

interface Transform {
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  brightness: number;
  contrast: number;
  saturation: number;
}

const DEFAULT_TRANSFORM: Transform = {
  rotation: 0,
  flipH: false,
  flipV: false,
  brightness: 100,
  contrast: 100,
  saturation: 100,
};

export function CanvasDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const [transform, setTransform] = useState<Transform>(DEFAULT_TRANSFORM);
  const [exportFormat, setExportFormat] = useState('png');
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  // Load the demo image
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      setIsLoading(false);
    };
    img.onerror = () => {
      setIsLoading(false);
      addToast(toast.error('Load Error', 'Failed to load demo image'));
    };
    img.src = DEMO_IMAGE_URL;
  }, [addToast]);

  // Render the canvas with current transformations
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imageRef.current;

    if (!canvas || !ctx || !img) return;

    // Set canvas size
    canvas.width = 400;
    canvas.height = 300;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context state
    ctx.save();

    // Apply transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((transform.rotation * Math.PI) / 180);
    ctx.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1);

    // Apply filters
    ctx.filter = `brightness(${transform.brightness}%) contrast(${transform.contrast}%) saturate(${transform.saturation}%)`;

    // Draw image centered
    ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);

    // Restore context state
    ctx.restore();
  }, [transform]);

  // Re-render when transform changes
  useEffect(() => {
    if (!isLoading) {
      renderCanvas();
    }
  }, [isLoading, renderCanvas]);

  const handleRotateLeft = () => {
    setTransform((t) => ({ ...t, rotation: (t.rotation - 90) % 360 }));
  };

  const handleRotateRight = () => {
    setTransform((t) => ({ ...t, rotation: (t.rotation + 90) % 360 }));
  };

  const handleFlipH = () => {
    setTransform((t) => ({ ...t, flipH: !t.flipH }));
  };

  const handleFlipV = () => {
    setTransform((t) => ({ ...t, flipV: !t.flipV }));
  };

  const handleReset = () => {
    setTransform(DEFAULT_TRANSFORM);
  };

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const mimeType = exportFormat === 'jpg' ? 'image/jpeg' : `image/${exportFormat}`;
    const quality = exportFormat === 'png' ? undefined : 0.92;

    try {
      const dataUrl = canvas.toDataURL(mimeType, quality);

      // Create download link
      const link = document.createElement('a');
      link.download = `canvas-export.${exportFormat}`;
      link.href = dataUrl;
      link.click();

      addToast(toast.success('Exported!', `Image saved as ${exportFormat.toUpperCase()}`));
    } catch (_error) {
      addToast(toast.error('Export Failed', 'Could not export canvas'));
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Canvas Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" />
            Canvas Preview
          </CardTitle>
          <CardDescription>Real-time preview with transformations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4 flex items-center justify-center">
            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Loading image...
              </div>
            ) : (
              <canvas
                ref={canvasRef}
                className="rounded-lg shadow-lg max-w-full"
                style={{ maxHeight: '300px' }}
              />
            )}
          </div>

          {/* Transformation Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={handleRotateLeft}>
              <RotateCcw className="w-4 h-4 mr-1" />
              -90°
            </Button>
            <Button variant="outline" size="sm" onClick={handleRotateRight}>
              <RotateCw className="w-4 h-4 mr-1" />
              +90°
            </Button>
            <Button variant="outline" size="sm" onClick={handleFlipH}>
              <FlipHorizontal className="w-4 h-4 mr-1" />
              Flip H
            </Button>
            <Button variant="outline" size="sm" onClick={handleFlipV}>
              <FlipVertical className="w-4 h-4 mr-1" />
              Flip V
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RefreshCw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Adjustments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-chart-4" />
            Adjustments
          </CardTitle>
          <CardDescription>Image color and filter controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Brightness</Label>
              <span className="text-sm font-medium">{transform.brightness}%</span>
            </div>
            <Slider
              value={[transform.brightness]}
              onValueChange={([v]) => setTransform((t) => ({ ...t, brightness: v }))}
              min={0}
              max={200}
              step={5}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Contrast</Label>
              <span className="text-sm font-medium">{transform.contrast}%</span>
            </div>
            <Slider
              value={[transform.contrast]}
              onValueChange={([v]) => setTransform((t) => ({ ...t, contrast: v }))}
              min={0}
              max={200}
              step={5}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Saturation</Label>
              <span className="text-sm font-medium">{transform.saturation}%</span>
            </div>
            <Slider
              value={[transform.saturation]}
              onValueChange={([v]) => setTransform((t) => ({ ...t, saturation: v }))}
              min={0}
              max={200}
              step={5}
            />
          </div>

          <div className="pt-4 border-t border-border space-y-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
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

            <Button variant="primary" className="w-full" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export Image
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Canvas Info */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Canvas API Tips</CardTitle>
          <CardDescription>Key considerations for image processing plugins</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Size Limits</h4>
              <p className="text-sm text-muted-foreground">
                Browser canvas max size is{' '}
                <code className="bg-background px-1 rounded">32767×32767</code> pixels. Always
                validate dimensions before rendering.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Memory Management</h4>
              <p className="text-sm text-muted-foreground">
                Set canvas dimensions to <code className="bg-background px-1 rounded">0×0</code>{' '}
                when done to release GPU memory.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">CORS Images</h4>
              <p className="text-sm text-muted-foreground">
                Use <code className="bg-background px-1 rounded">crossOrigin="anonymous"</code> when
                loading external images for canvas export.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CanvasDemo;
