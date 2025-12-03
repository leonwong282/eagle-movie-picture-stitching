/**
 * Storage Demo
 *
 * Demonstrates localStorage persistence patterns:
 * - useLocalStorage hook usage
 * - Settings persistence
 * - Theme preferences
 * - Form data auto-save
 */
import { useState } from 'react';
import { Database, Settings, Save, Trash2, RefreshCw, Moon, Sun, Monitor } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Checkbox,
  Slider,
  useToast,
  toast,
} from '@/components';
import { useLocalStorage } from '@/hooks';
import { useTheme } from '@/hooks';

interface PluginSettings {
  autoPreview: boolean;
  quality: number;
  format: string;
  lastProject: string;
}

const DEFAULT_SETTINGS: PluginSettings = {
  autoPreview: true,
  quality: 85,
  format: 'png',
  lastProject: '',
};

export function StorageDemo() {
  const [settings, setSettings] = useLocalStorage<PluginSettings>('demo-plugin-settings', {
    defaultValue: DEFAULT_SETTINGS,
  });
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();
  const [projectName, setProjectName] = useState(settings.lastProject);

  const handleSaveProject = () => {
    setSettings((prev) => ({ ...prev, lastProject: projectName }));
    addToast(toast.success('Saved!', 'Project name saved to localStorage'));
  };

  const handleClearSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    setProjectName('');
    addToast(toast.info('Cleared', 'Settings reset to defaults'));
  };

  const updateSetting = <K extends keyof PluginSettings>(key: K, value: PluginSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Settings Persistence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Persisted Settings
          </CardTitle>
          <CardDescription>Auto-saved to localStorage on change</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <Checkbox
              id="auto-preview"
              checked={settings.autoPreview}
              onCheckedChange={(checked) => updateSetting('autoPreview', checked as boolean)}
            />
            <Label htmlFor="auto-preview">Enable auto-preview</Label>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Output Quality</Label>
              <span className="text-sm font-medium">{settings.quality}%</span>
            </div>
            <Slider
              value={[settings.quality]}
              onValueChange={([v]) => updateSetting('quality', v)}
              min={10}
              max={100}
              step={5}
            />
          </div>

          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select value={settings.format} onValueChange={(v) => updateSetting('format', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpg">JPG</SelectItem>
                <SelectItem value="webp">WebP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 border-t border-border">
            <Button variant="outline" size="sm" onClick={handleClearSettings} className="w-full">
              <Trash2 className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Theme Persistence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-chart-2" />
            Theme Persistence
          </CardTitle>
          <CardDescription>Theme preference saved across sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Current theme: <span className="font-medium text-foreground">{theme}</span>
          </p>

          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={theme === 'light' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTheme('light')}
              className="flex-col h-auto py-4"
            >
              <Sun className="w-5 h-5 mb-1" />
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTheme('dark')}
              className="flex-col h-auto py-4"
            >
              <Moon className="w-5 h-5 mb-1" />
              Dark
            </Button>
            <Button
              variant={theme === 'auto' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTheme('auto')}
              className="flex-col h-auto py-4"
            >
              <Monitor className="w-5 h-5 mb-1" />
              Auto
            </Button>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Theme is stored in{' '}
              <code className="bg-background px-1 rounded text-xs">
                localStorage['eagle-react-template:theme']
              </code>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Manual Save Pattern */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="w-5 h-5 text-success" />
            Manual Save Pattern
          </CardTitle>
          <CardDescription>Save on explicit action (for larger data)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name..."
            />
          </div>

          <Button variant="primary" onClick={handleSaveProject} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Project Name
          </Button>

          {settings.lastProject && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">
                <span className="text-muted-foreground">Last saved:</span>{' '}
                <span className="font-medium">{settings.lastProject}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Storage Debug */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-chart-4" />
            Storage Debugging
          </CardTitle>
          <CardDescription>View current localStorage state</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg font-mono text-xs overflow-auto max-h-48">
            <pre>{JSON.stringify(settings, null, 2)}</pre>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Storage Key:</strong>{' '}
              <code className="bg-background px-1 rounded">
                eagle-react-template:demo-plugin-settings
              </code>
            </p>
            <p className="text-sm text-muted-foreground">
              The <code className="bg-background px-1 rounded">useLocalStorage</code> hook
              automatically handles JSON serialization and namespacing.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>localStorage Best Practices</CardTitle>
          <CardDescription>Guidelines for persistent storage in Eagle plugins</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Namespace Keys</h4>
              <p className="text-sm text-muted-foreground">
                Prefix all keys with plugin ID to avoid conflicts:
                <code className="block mt-1 bg-background px-1 rounded text-xs">
                  eagle-plugin-name:setting-key
                </code>
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Validate on Load</h4>
              <p className="text-sm text-muted-foreground">
                Always provide defaults and validate loaded data. Handle corrupted or missing values
                gracefully.
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Size Limits</h4>
              <p className="text-sm text-muted-foreground">
                localStorage has ~5MB limit. For large data, consider using Eagle's file system
                APIs.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default StorageDemo;
