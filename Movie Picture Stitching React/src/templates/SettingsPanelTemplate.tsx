/**
 * Settings Panel Template
 *
 * A full settings/preferences panel layout suitable for:
 * - Plugin configuration
 * - User preferences
 * - Advanced settings
 *
 * Features:
 * - Grouped settings with sections
 * - Save/Reset actions
 * - Scrollable content
 * - Keyboard shortcuts info
 */
import { ReactNode, useState } from 'react';
import { RotateCcw, Save, ChevronRight } from 'lucide-react';
import { Header, Button, Card, CardHeader, CardTitle, CardContent } from '@/components';
import { cn } from '@/lib/utils';

interface SettingsSection {
  id: string;
  title: string;
  icon?: ReactNode;
  content: ReactNode;
}

interface SettingsPanelTemplateProps {
  /** Plugin title */
  title?: string;
  /** Settings sections */
  sections: SettingsSection[];
  /** Save handler */
  onSave?: () => void;
  /** Reset handler */
  onReset?: () => void;
  /** Show navigation sidebar */
  showNavigation?: boolean;
  /** Is saving in progress */
  isSaving?: boolean;
  /** Has unsaved changes */
  hasChanges?: boolean;
  /** Close click handler */
  onCloseClick?: () => void;
}

export function SettingsPanelTemplate({
  title = 'Settings',
  sections,
  onSave,
  onReset,
  showNavigation = true,
  isSaving = false,
  hasChanges = false,
  onCloseClick,
}: SettingsPanelTemplateProps) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(`settings-${id}`)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <Header
        title={title}
        showThemeToggle
        showClose
        onCloseClick={onCloseClick}
        actions={
          <div className="flex items-center gap-2">
            {hasChanges && <span className="text-xs text-warning">Unsaved changes</span>}
          </div>
        }
      />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        {showNavigation && sections.length > 1 && (
          <nav className="w-48 border-r border-border bg-card/30 p-2">
            <ul className="space-y-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
                      'hover:bg-accent hover:text-accent-foreground',
                      activeSection === section.id
                        ? 'bg-accent text-accent-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {section.icon}
                    <span className="flex-1 text-left">{section.title}</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Settings Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto space-y-8">
            {sections.map((section) => (
              <Card key={section.id} id={`settings-${section.id}`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {section.icon}
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>{section.content}</CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={onReset} disabled={!hasChanges}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button variant="primary" onClick={onSave} isLoading={isSaving} disabled={!hasChanges}>
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// Example Usage Component
// ============================================

import { Palette, Globe, Bell, Shield, HardDrive } from 'lucide-react';
import {
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Checkbox,
  Slider,
  useToast,
  toast,
} from '@/components';
import { useLocalStorage, useTheme } from '@/hooks';

interface PluginSettings {
  language: string;
  autoSave: boolean;
  saveInterval: number;
  notifications: boolean;
  soundEffects: boolean;
  cacheSize: number;
  debugMode: boolean;
}

const DEFAULT_SETTINGS: PluginSettings = {
  language: 'en',
  autoSave: true,
  saveInterval: 30,
  notifications: true,
  soundEffects: false,
  cacheSize: 500,
  debugMode: false,
};

export function SettingsPanelExample() {
  const { addToast } = useToast();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useLocalStorage<PluginSettings>('plugin-settings', {
    defaultValue: DEFAULT_SETTINGS,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = <K extends keyof PluginSettings>(key: K, value: PluginSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setHasChanges(false);
    addToast(toast.success('Saved', 'Settings saved successfully'));
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    setHasChanges(true);
    addToast(toast.info('Reset', 'Settings reset to defaults'));
  };

  const sections: SettingsSection[] = [
    {
      id: 'appearance',
      title: 'Appearance',
      icon: <Palette className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Theme</Label>
            <Select value={theme} onValueChange={(v) => setTheme(v as 'light' | 'dark' | 'auto')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="auto">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
    },
    {
      id: 'language',
      title: 'Language & Region',
      icon: <Globe className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Language</Label>
            <Select value={settings.language} onValueChange={(v) => updateSetting('language', v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="zh_CN">简体中文</SelectItem>
                <SelectItem value="zh_TW">繁體中文</SelectItem>
                <SelectItem value="ja_JP">日本語</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <Checkbox
            id="notifications"
            label="Enable notifications"
            checked={settings.notifications}
            onCheckedChange={(v) => updateSetting('notifications', v as boolean)}
          />
          <Checkbox
            id="sounds"
            label="Sound effects"
            checked={settings.soundEffects}
            onCheckedChange={(v) => updateSetting('soundEffects', v as boolean)}
          />
        </div>
      ),
    },
    {
      id: 'storage',
      title: 'Storage',
      icon: <HardDrive className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Cache Size</Label>
              <span className="text-sm font-medium">{settings.cacheSize} MB</span>
            </div>
            <Slider
              value={[settings.cacheSize]}
              onValueChange={([v]) => updateSetting('cacheSize', v)}
              min={100}
              max={2000}
              step={100}
            />
          </div>
          <Checkbox
            id="autosave"
            label="Auto-save changes"
            checked={settings.autoSave}
            onCheckedChange={(v) => updateSetting('autoSave', v as boolean)}
          />
        </div>
      ),
    },
    {
      id: 'advanced',
      title: 'Advanced',
      icon: <Shield className="w-4 h-4" />,
      content: (
        <div className="space-y-4">
          <Checkbox
            id="debug"
            label="Enable debug mode"
            checked={settings.debugMode}
            onCheckedChange={(v) => updateSetting('debugMode', v as boolean)}
          />
          <p className="text-xs text-muted-foreground">
            Debug mode enables additional logging and development tools.
          </p>
        </div>
      ),
    },
  ];

  return (
    <SettingsPanelTemplate
      title="Plugin Settings"
      sections={sections}
      onSave={handleSave}
      onReset={handleReset}
      isSaving={isSaving}
      hasChanges={hasChanges}
    />
  );
}

export default SettingsPanelTemplate;
