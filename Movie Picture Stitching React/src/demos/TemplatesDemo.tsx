/**
 * Templates Demo
 *
 * Showcases the 5 plugin templates:
 * - SinglePanel - Simple single-panel layout
 * - SplitPanel - Two-column sidebar + content
 * - SettingsPanel - Full settings page
 * - BatchProcess - Batch processing with progress
 * - ImageBrowser - Image grid with filtering
 */
import {
  LayoutPanelTop,
  Columns2,
  Settings,
  Layers,
  Grid3X3,
  ExternalLink,
  Code2,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
} from '@/components';

interface TemplateInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  useCases: string[];
  features: string[];
}

const TEMPLATES: TemplateInfo[] = [
  {
    id: 'single-panel',
    name: 'SinglePanel',
    description: 'A simple single-panel plugin layout for quick actions and tools.',
    icon: LayoutPanelTop,
    useCases: ['Quick actions', 'Simple image processing', 'Single-purpose utilities'],
    features: ['Header with title and actions', 'Main content area', 'Optional footer'],
  },
  {
    id: 'split-panel',
    name: 'SplitPanel',
    description: 'Two-column layout with collapsible sidebar for settings + preview.',
    icon: Columns2,
    useCases: ['Settings + Preview', 'Navigation + Content', 'Sidebar tools + Canvas'],
    features: ['Collapsible sidebar', 'Customizable width', 'Responsive layout'],
  },
  {
    id: 'settings-panel',
    name: 'SettingsPanel',
    description: 'Full settings/preferences panel with grouped sections.',
    icon: Settings,
    useCases: ['Plugin configuration', 'User preferences', 'Advanced settings'],
    features: ['Section navigation', 'Save/Reset actions', 'Unsaved changes indicator'],
  },
  {
    id: 'batch-process',
    name: 'BatchProcess',
    description: 'Batch processing layout with progress tracking and queue display.',
    icon: Layers,
    useCases: ['Bulk image processing', 'File conversion', 'Export operations'],
    features: ['Progress indicator', 'Item queue', 'Cancel/Pause support'],
  },
  {
    id: 'image-browser',
    name: 'ImageBrowser',
    description: 'Image browsing layout with search, filter, and grid/list views.',
    icon: Grid3X3,
    useCases: ['Image galleries', 'Asset browsers', 'Search interfaces'],
    features: ['Grid/List toggle', 'Search & filter', 'Multi-select support'],
  },
];

export function TemplatesDemo() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 pb-4 border-b border-border">
        <h2 className="text-2xl font-bold">Plugin Templates</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Ready-to-use layout templates for common Eagle plugin patterns. Each template includes the
          layout structure and an example implementation.
        </p>
      </div>

      {/* Template Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATES.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {/* Usage Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            How to Use Templates
          </CardTitle>
          <CardDescription>Import and customize templates for your plugin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg font-mono text-sm overflow-x-auto">
              <pre>{`// Import the template
import { SinglePanelTemplate } from '@/templates';

// Use in your App
function MyPlugin() {
  return (
    <SinglePanelTemplate
      title="My Plugin"
      showSettings
      onSettingsClick={() => {}}
      footer={<Button>Process</Button>}
    >
      {/* Your content here */}
    </SinglePanelTemplate>
  );
}`}</pre>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Template Files</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>
                    <code>src/templates/SinglePanelTemplate.tsx</code>
                  </li>
                  <li>
                    <code>src/templates/SplitPanelTemplate.tsx</code>
                  </li>
                  <li>
                    <code>src/templates/SettingsPanelTemplate.tsx</code>
                  </li>
                  <li>
                    <code>src/templates/BatchProcessTemplate.tsx</code>
                  </li>
                  <li>
                    <code>src/templates/ImageBrowserTemplate.tsx</code>
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">Each Template Includes</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>✓ TypeScript types and props</li>
                  <li>✓ Example usage component</li>
                  <li>✓ Header with theme toggle</li>
                  <li>✓ Responsive layout</li>
                  <li>✓ Dark mode support</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function TemplateCard({ template }: { template: TemplateInfo }) {
  const Icon = template.icon;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <CardDescription className="mt-1">{template.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Use Cases
          </h4>
          <ul className="space-y-1">
            {template.useCases.map((useCase) => (
              <li key={useCase} className="text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                {useCase}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Features
          </h4>
          <ul className="space-y-1">
            {template.features.map((feature) => (
              <li key={feature} className="text-sm text-muted-foreground">
                • {feature}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full gap-2" disabled>
          <ExternalLink className="w-3 h-3" />
          View Example
        </Button>
      </CardFooter>
    </Card>
  );
}

export default TemplatesDemo;
