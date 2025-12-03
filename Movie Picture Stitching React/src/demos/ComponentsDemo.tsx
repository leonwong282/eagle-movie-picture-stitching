/**
 * Components Demo
 *
 * Showcases all UI components with their variants:
 * - Button variants (8) and sizes (4)
 * - Card variants (default, outline, glass)
 * - Toast notifications (4 types)
 * - Loading states
 */
import { Plus, CheckCircle2, AlertCircle, Info, Palette, Zap, Loader2 } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  useToast,
  toast,
} from '@/components';

export function ComponentsDemo() {
  const { addToast } = useToast();

  const handleSuccessToast = () => {
    addToast(toast.success('Success!', 'Operation completed successfully'));
  };

  const handleErrorToast = () => {
    addToast(toast.error('Error!', 'Something went wrong'));
  };

  const handleWarningToast = () => {
    addToast(toast.warning('Warning', 'Please review before proceeding'));
  };

  const handleInfoToast = () => {
    addToast(toast.info('Info', 'Here is some useful information'));
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Button Variants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Button Variants
          </CardTitle>
          <CardDescription>8 variants using HSL semantic tokens</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="default">Default</Button>
            <Button variant="primary">Primary</Button>
            <Button variant="success">Success</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </CardContent>
      </Card>

      {/* Button Sizes */}
      <Card>
        <CardHeader>
          <CardTitle>Button Sizes</CardTitle>
          <CardDescription>4 size options for different contexts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button isLoading size="sm">
              Loading
            </Button>
            <Button isLoading>Loading</Button>
            <Button disabled>Disabled</Button>
          </div>
        </CardContent>
      </Card>

      {/* Toast Demo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-chart-4" />
            Toast Notifications
          </CardTitle>
          <CardDescription>4 semantic notification types</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="justify-start gap-2" onClick={handleSuccessToast}>
            <CheckCircle2 className="w-4 h-4 text-success" />
            Success
          </Button>
          <Button variant="outline" className="justify-start gap-2" onClick={handleErrorToast}>
            <AlertCircle className="w-4 h-4 text-destructive" />
            Error
          </Button>
          <Button variant="outline" className="justify-start gap-2" onClick={handleWarningToast}>
            <AlertCircle className="w-4 h-4 text-warning" />
            Warning
          </Button>
          <Button variant="outline" className="justify-start gap-2" onClick={handleInfoToast}>
            <Info className="w-4 h-4 text-info" />
            Info
          </Button>
        </CardContent>
      </Card>

      {/* Card Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Card Variants</CardTitle>
          <CardDescription>Default, outline, and glass effects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card className="p-3">
            <p className="text-sm">Default card with shadow</p>
          </Card>
          <Card variant="outline" className="p-3">
            <p className="text-sm">Outline card without shadow</p>
          </Card>
          <Card variant="glass" className="p-3">
            <p className="text-sm">Glass card with blur effect</p>
          </Card>
        </CardContent>
      </Card>

      {/* Loading States */}
      <Card>
        <CardHeader>
          <CardTitle>Loading States</CardTitle>
          <CardDescription>Various loading indicators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button isLoading variant="primary">
              Submitting
            </Button>
            <Button isLoading variant="outline">
              Loading
            </Button>
            <Button isLoading variant="ghost" size="icon">
              <Loader2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Processing your request...</span>
          </div>
        </CardContent>
      </Card>

      {/* Color System */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>HSL Color System</CardTitle>
          <CardDescription>Semantic color tokens with shadcn/ui compatibility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            <div className="space-y-2">
              <div className="h-12 rounded-lg bg-primary" />
              <p className="text-xs text-center">Primary</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-lg bg-secondary" />
              <p className="text-xs text-center">Secondary</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-lg bg-success" />
              <p className="text-xs text-center">Success</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-lg bg-destructive" />
              <p className="text-xs text-center">Destructive</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-lg bg-warning" />
              <p className="text-xs text-center">Warning</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-lg bg-info" />
              <p className="text-xs text-center">Info</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-lg bg-muted" />
              <p className="text-xs text-center">Muted</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-lg bg-accent" />
              <p className="text-xs text-center">Accent</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-lg bg-card border border-border" />
              <p className="text-xs text-center">Card</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-lg bg-popover border border-border" />
              <p className="text-xs text-center">Popover</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-lg border-2 border-input" />
              <p className="text-xs text-center">Input</p>
            </div>
            <div className="space-y-2">
              <div className="h-12 rounded-lg border-2 border-ring" />
              <p className="text-xs text-center">Ring</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ComponentsDemo;
