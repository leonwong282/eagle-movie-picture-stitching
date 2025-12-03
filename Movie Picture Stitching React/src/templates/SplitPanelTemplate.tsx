/**
 * Split Panel Template
 *
 * A two-column layout with sidebar and main content, suitable for:
 * - Settings + Preview layouts
 * - Navigation + Content patterns
 * - Sidebar tools + Canvas
 *
 * Features:
 * - Resizable sidebar (optional)
 * - Collapsible sidebar
 * - Header with title and actions
 * - Flexible content areas
 */
import { ReactNode, useState } from 'react';
import { PanelLeftClose, PanelLeft } from 'lucide-react';
import { Header, Button } from '@/components';
import { cn } from '@/lib/utils';

interface SplitPanelTemplateProps {
  /** Plugin title */
  title: string;
  /** Header actions */
  headerActions?: ReactNode;
  /** Show theme toggle in header */
  showThemeToggle?: boolean;
  /** Show close button */
  showClose?: boolean;
  /** Close click handler */
  onCloseClick?: () => void;
  /** Sidebar content */
  sidebar: ReactNode;
  /** Sidebar title */
  sidebarTitle?: string;
  /** Sidebar width (default: 280px) */
  sidebarWidth?: number;
  /** Allow sidebar to be collapsed */
  collapsible?: boolean;
  /** Initial collapsed state */
  defaultCollapsed?: boolean;
  /** Main content */
  children: ReactNode;
  /** Footer content */
  footer?: ReactNode;
}

export function SplitPanelTemplate({
  title,
  headerActions,
  showThemeToggle = true,
  showClose = true,
  onCloseClick,
  sidebar,
  sidebarTitle,
  sidebarWidth = 280,
  collapsible = true,
  defaultCollapsed = false,
  children,
  footer,
}: SplitPanelTemplateProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <Header
        title={title}
        showThemeToggle={showThemeToggle}
        showClose={showClose}
        onCloseClick={onCloseClick}
        actions={headerActions}
      />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            'border-r border-border bg-card/30 flex flex-col transition-all duration-300',
            isCollapsed ? 'w-0 overflow-hidden' : ''
          )}
          style={{ width: isCollapsed ? 0 : sidebarWidth }}
        >
          {/* Sidebar Header */}
          {sidebarTitle && (
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h2 className="font-medium text-sm">{sidebarTitle}</h2>
              {collapsible && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setIsCollapsed(true)}
                >
                  <PanelLeftClose className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}

          {/* Sidebar Content */}
          <div className="flex-1 overflow-auto p-4">{sidebar}</div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Collapsed sidebar toggle */}
          {collapsible && isCollapsed && (
            <div className="p-2 border-b border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(false)}
                className="gap-2"
              >
                <PanelLeft className="w-4 h-4" />
                Show Sidebar
              </Button>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-auto p-4">{children}</div>
        </main>
      </div>

      {/* Optional Footer */}
      {footer && <footer className="border-t border-border bg-card/30 px-4 py-3">{footer}</footer>}
    </div>
  );
}

// ============================================
// Example Usage Component
// ============================================

import { Wand2, Image, Layers, Sparkles } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Slider,
  Checkbox,
  EagleImage,
  ImageGrid,
  ImagePlaceholder,
} from '@/components';
import { useEagleSelection } from '@/hooks';

export function SplitPanelExample() {
  const { items } = useEagleSelection();
  const [effect, setEffect] = useState('none');
  const [intensity, setIntensity] = useState([50]);

  return (
    <SplitPanelTemplate
      title="Image Editor"
      sidebarTitle="Effects"
      sidebar={
        <div className="space-y-6">
          {/* Effect Selection */}
          <div className="space-y-2">
            <Label>Effect Type</Label>
            <Select value={effect} onValueChange={setEffect}>
              <SelectTrigger>
                <SelectValue placeholder="Select effect..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="blur">Blur</SelectItem>
                <SelectItem value="sharpen">Sharpen</SelectItem>
                <SelectItem value="grayscale">Grayscale</SelectItem>
                <SelectItem value="sepia">Sepia</SelectItem>
                <SelectItem value="invert">Invert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Intensity Slider */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Intensity</Label>
              <span className="text-sm font-medium">{intensity[0]}%</span>
            </div>
            <Slider
              value={intensity}
              onValueChange={setIntensity}
              min={0}
              max={100}
              step={5}
              disabled={effect === 'none'}
            />
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <Label>Quick Presets</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="justify-start gap-2">
                <Sparkles className="w-3 h-3" />
                Vivid
              </Button>
              <Button variant="outline" size="sm" className="justify-start gap-2">
                <Layers className="w-3 h-3" />
                Matte
              </Button>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-4 border-t border-border">
            <Checkbox id="preview" label="Auto-preview" defaultChecked />
            <Checkbox id="original" label="Keep original" />
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {items.length} image{items.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <Button variant="outline">Reset</Button>
            <Button variant="primary">
              <Wand2 className="w-4 h-4 mr-2" />
              Apply Effect
            </Button>
          </div>
        </div>
      }
    >
      {/* Preview Area */}
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="w-5 h-5 text-primary" />
            Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {items.length > 0 ? (
            <ImageGrid columns={3} gap={3}>
              {items.slice(0, 9).map((item) => (
                <EagleImage
                  key={item.id}
                  item={item}
                  useThumbnail
                  aspectRatio="1/1"
                  className="rounded-lg"
                  fallback={
                    <ImagePlaceholder
                      icon={<Image className="w-full h-full" />}
                      text={item.ext?.toUpperCase() || 'IMG'}
                      aspectRatio="1/1"
                    />
                  }
                />
              ))}
            </ImageGrid>
          ) : (
            <div className="flex items-center justify-center h-64">
              <ImagePlaceholder
                icon={<Image className="w-full h-full" />}
                text="Select images in Eagle"
                aspectRatio="16/9"
                className="max-w-xs"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </SplitPanelTemplate>
  );
}

export default SplitPanelTemplate;
