/**
 * Demo Page
 *
 * Main showcase page with tabbed navigation between demos.
 * Demonstrates the eagle-react-template capabilities.
 */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Images,
  Blocks,
  FormInput,
  MessageSquare,
  Paintbrush,
  Database,
  LayoutTemplate,
  Moon,
  Sun,
  Monitor,
  Info,
  LayoutPanelTop,
  Columns2,
  Settings,
  Layers,
  Grid3X3,
} from 'lucide-react';
import {
  Header,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components';
import { useTheme } from '@/hooks';
import { eagleApi } from '@/lib/eagle-api';
import {
  SelectionDemo,
  ComponentsDemo,
  FormsDemo,
  DialogsDemo,
  CanvasDemo,
  StorageDemo,
  TemplatesDemo,
  ThreeColumnDemo,
} from '@/demos';

import { SinglePanelExample } from '@/templates';
import { SplitPanelExample } from '@/templates';
import { SettingsPanelExample } from '@/templates';
import { BatchProcessExample } from '@/templates';
import { ImageBrowserExample } from '@/templates';

const DEMO_TABS = [
  { id: 'selection', label: 'Selection', icon: Images },
  { id: 'components', label: 'Components', icon: Blocks },
  { id: 'forms', label: 'Forms', icon: FormInput },
  { id: 'dialogs', label: 'Dialogs', icon: MessageSquare },
  { id: 'canvas', label: 'Canvas', icon: Paintbrush },
  { id: 'storage', label: 'Storage', icon: Database },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
  { id: 'three-column', label: 'ThreeColumn', icon: Columns2 },
  { id: 'single-panel', label: 'SinglePanel', icon: LayoutPanelTop },
  { id: 'split-panel', label: 'SplitPanel', icon: Columns2 },
  { id: 'settings-panel', label: 'SettingsPanel', icon: Settings },
  { id: 'batch-process', label: 'BatchProcess', icon: Layers },
  { id: 'image-browser', label: 'ImageBrowser', icon: Grid3X3 },
] as const;

type DemoTabId = (typeof DEMO_TABS)[number]['id'];

export function DemoPage() {
  const { t } = useTranslation();
  const { theme, setTheme, isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<DemoTabId>('selection');

  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  const cycleTheme = () => {
    const themes = ['light', 'dark', 'auto'] as const;
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Header */}
        <Header
          title={t('app.title')}
          actions={
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={cycleTheme}>
                    <ThemeIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Theme: {theme}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      window.open('https://github.com/AoiYamada/eagle-react-template', '_blank')
                    }
                  >
                    <Info className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View on GitHub</p>
                </TooltipContent>
              </Tooltip>
            </div>
          }
        />

        {/* Main Content with Tabs */}
        <main className="flex-1 overflow-hidden">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as DemoTabId)}
            className="h-full flex flex-col"
          >
            {/* Tab Navigation */}
            {/* Handle Tab Navigation overflow problem to make sliding available */}
            <div className="border-b border-border bg-card/50 px-4 py-2 overflow-x-auto">
              <TabsList className="h-12 bg-transparent gap-1">
                {DEMO_TABS.map(({ id, label, icon: Icon }) => (
                  <TabsTrigger
                    key={id}
                    value={id}
                    className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-auto p-4 md:p-6">
              <TabsContent value="selection" className="mt-0 h-full">
                <SelectionDemo />
              </TabsContent>

              <TabsContent value="components" className="mt-0 h-full">
                <ComponentsDemo />
              </TabsContent>

              <TabsContent value="forms" className="mt-0 h-full">
                <FormsDemo />
              </TabsContent>

              <TabsContent value="dialogs" className="mt-0 h-full">
                <DialogsDemo />
              </TabsContent>

              <TabsContent value="canvas" className="mt-0 h-full">
                <CanvasDemo />
              </TabsContent>

              <TabsContent value="storage" className="mt-0 h-full">
                <StorageDemo />
              </TabsContent>

              <TabsContent value="templates" className="mt-0 h-full">
                <TemplatesDemo />
              </TabsContent>

              <TabsContent value="three-column" className="mt-0 h-full">
                <ThreeColumnDemo />
              </TabsContent>

              <TabsContent value="single-panel" className="mt-0 h-full">
                <SinglePanelExample />
              </TabsContent>
              <TabsContent value="split-panel" className="mt-0 h-full">
                <SplitPanelExample />
              </TabsContent>
              <TabsContent value="settings-panel" className="mt-0 h-full">
                <SettingsPanelExample />
              </TabsContent>
              <TabsContent value="batch-process" className="mt-0 h-full">
                <BatchProcessExample />
              </TabsContent>
              <TabsContent value="image-browser" className="mt-0 h-full">
                <ImageBrowserExample />
              </TabsContent>
            </div>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="border-t border-border bg-card/30 px-4 py-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Eagle React Template • React 18 + TypeScript + Tailwind CSS + shadcn/ui</span>
            <span>
              {isDarkMode ? 'Dark' : 'Light'} Mode • {eagleApi.locale}
            </span>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}

export default DemoPage;
