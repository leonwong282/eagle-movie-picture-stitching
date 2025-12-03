---
sidebar_position: 4
title: SettingsPanelTemplate
description: Settings layout with section navigation and action buttons
---

# SettingsPanelTemplate

A specialized layout for plugin settings pages with section navigation, save/reset actions, and form validation support.

## Import

```tsx
import { SettingsPanelTemplate } from '@/templates';
```

## Basic Usage

```tsx
import { SettingsPanelTemplate } from '@/templates';

const sections = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'export', label: 'Export', icon: Download },
  { id: 'advanced', label: 'Advanced', icon: Sliders },
];

function PluginSettings() {
  const [activeSection, setActiveSection] = useState('general');

  return (
    <SettingsPanelTemplate
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onSave={handleSave}
      onReset={handleReset}
    >
      <SettingsContent section={activeSection} />
    </SettingsPanelTemplate>
  );
}
```

## Layout Structure

```
┌─────────────────────────────────────┐
│  Settings              [Save][Reset]│  ← Header with actions
├──────────┬──────────────────────────┤
│          │                          │
│ General  │  Section Title           │
│ Export   │  ┌─────────────────────┐ │
│ Advanced │  │ Setting Item 1      │ │
│          │  │ Setting Item 2      │ │
│          │  │ Setting Item 3      │ │
│          │  └─────────────────────┘ │
│          │                          │
└──────────┴──────────────────────────┘
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **required** | Settings content |
| `sections` | `Section[]` | **required** | Navigation sections array |
| `activeSection` | `string` | `undefined` | Currently active section ID |
| `onSectionChange` | `(id: string) => void` | `undefined` | Section change handler |
| `onSave` | `() => void \| Promise<void>` | `undefined` | Save button handler |
| `onReset` | `() => void` | `undefined` | Reset button handler |
| `isSaving` | `boolean` | `false` | Show loading state on save |
| `hasChanges` | `boolean` | `false` | Enable save button when true |
| `showNav` | `boolean` | `true` | Show section navigation |
| `title` | `string` | `'Settings'` | Header title |
| `saveLabel` | `string` | `'Save'` | Save button text |
| `resetLabel` | `string` | `'Reset'` | Reset button text |

### Section Type

```tsx
interface Section {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}
```

## Examples

### Full Settings Page

```tsx
import { SettingsPanelTemplate } from '@/templates';
import { Settings, Download, Palette, Bell } from 'lucide-react';

const sections = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'export', label: 'Export', icon: Download },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: 3 },
];

function FullSettings() {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState(defaultSettings);
  const [originalSettings] = useState(defaultSettings);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSettings(settings);
      toast.success('Settings saved');
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(originalSettings);
  };

  return (
    <SettingsPanelTemplate
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onSave={handleSave}
      onReset={handleReset}
      isSaving={isSaving}
      hasChanges={hasChanges}
    >
      {activeSection === 'general' && (
        <GeneralSettings settings={settings} onChange={setSettings} />
      )}
      {activeSection === 'export' && (
        <ExportSettings settings={settings} onChange={setSettings} />
      )}
      {activeSection === 'appearance' && (
        <AppearanceSettings settings={settings} onChange={setSettings} />
      )}
      {activeSection === 'notifications' && (
        <NotificationSettings settings={settings} onChange={setSettings} />
      )}
    </SettingsPanelTemplate>
  );
}
```

### Section Content Component

```tsx
function GeneralSettings({ settings, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">General Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium">Auto-save</label>
              <p className="text-sm text-gray-500">
                Automatically save changes
              </p>
            </div>
            <Switch
              checked={settings.autoSave}
              onCheckedChange={(checked) => 
                onChange({ ...settings, autoSave: checked })
              }
            />
          </div>

          <div>
            <label className="font-medium block mb-2">Default Format</label>
            <Select
              value={settings.defaultFormat}
              onValueChange={(value) =>
                onChange({ ...settings, defaultFormat: value })
              }
            >
              <SelectItem value="png">PNG</SelectItem>
              <SelectItem value="jpg">JPEG</SelectItem>
              <SelectItem value="webp">WebP</SelectItem>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Without Navigation

```tsx
function SimpleSettings() {
  return (
    <SettingsPanelTemplate
      showNav={false}
      onSave={handleSave}
      onReset={handleReset}
      hasChanges={true}
    >
      <div className="space-y-4 p-4">
        <SettingItem label="Quality" />
        <SettingItem label="Format" />
        <SettingItem label="Output Path" />
      </div>
    </SettingsPanelTemplate>
  );
}
```

### With Form Validation

```tsx
import { useForm } from 'react-hook-form';

function ValidatedSettings() {
  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues: loadSettings(),
  });

  return (
    <SettingsPanelTemplate
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onSave={handleSubmit(onSubmit)}
      onReset={() => reset()}
      hasChanges={formState.isDirty}
      isSaving={formState.isSubmitting}
    >
      <form className="space-y-4">
        <Input
          {...register('name', { required: true })}
          error={formState.errors.name?.message}
        />
        <Input
          {...register('email', { 
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ 
          })}
          error={formState.errors.email?.message}
        />
      </form>
    </SettingsPanelTemplate>
  );
}
```

### With Section Badges

```tsx
const sections = [
  { id: 'general', label: 'General', icon: Settings },
  { id: 'updates', label: 'Updates', icon: RefreshCw, badge: 2 },
  { id: 'issues', label: 'Issues', icon: AlertCircle, badge: '!' },
];

function SettingsWithBadges() {
  return (
    <SettingsPanelTemplate
      sections={sections}
      activeSection={activeSection}
      onSectionChange={setActiveSection}
    >
      {/* Badge shows notification count or status */}
    </SettingsPanelTemplate>
  );
}
```

## Action Button States

### Save Button

| State | `hasChanges` | `isSaving` | Button State |
|-------|--------------|------------|--------------|
| No changes | `false` | `false` | Disabled |
| Has changes | `true` | `false` | Enabled |
| Saving | `true` | `true` | Loading spinner |

### Reset Button

| State | `hasChanges` | Button State |
|-------|--------------|--------------|
| No changes | `false` | Disabled |
| Has changes | `true` | Enabled |

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Ctrl/Cmd + S` | Trigger save (when hasChanges) |
| `Escape` | Trigger reset confirmation |
| `Arrow Up/Down` | Navigate sections |

## Best Practices

### ✅ Do

```tsx
// Group related settings
<SettingsPanelTemplate sections={[
  { id: 'general', label: 'General' },
  { id: 'export', label: 'Export' },
]}>
  <SettingsGroup title="Output">
    <Setting label="Format" />
    <Setting label="Quality" />
  </SettingsGroup>
</SettingsPanelTemplate>

// Track changes properly
const hasChanges = useMemo(
  () => JSON.stringify(current) !== JSON.stringify(original),
  [current, original]
);
```

### ❌ Don't

```tsx
// Don't put unrelated content
<SettingsPanelTemplate>
  <ImageEditor />  {/* Not settings-related */}
</SettingsPanelTemplate>

// Don't enable save without changes
<SettingsPanelTemplate
  hasChanges={true}  // Always true = confusing UX
>
```

## When to Use

**Use SettingsPanelTemplate when:**
- Building plugin preferences/settings
- Need section-based navigation
- Require save/reset functionality
- Have multiple setting categories

**Consider other templates when:**
- Simple form without sections → [`SinglePanelTemplate`](./single-panel)
- File/folder navigation → [`SplitPanelTemplate`](./split-panel)
- Processing operations → [`BatchProcessTemplate`](./batch-process)

## Related

- [Templates Overview](./overview) - All available templates
- [Form Components](../components/form/input) - Form inputs
- [useLocalStorage](../hooks/use-local-storage) - Persist settings
