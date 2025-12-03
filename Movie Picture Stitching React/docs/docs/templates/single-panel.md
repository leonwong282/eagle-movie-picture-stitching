---
sidebar_position: 2
title: SinglePanelTemplate
description: Simple single-panel layout for focused utilities
---

# SinglePanelTemplate

The simplest template for single-purpose utilities and focused tasks. Provides a clean header, scrollable content area, and optional footer.

## Import

```tsx
import { SinglePanelTemplate } from '@/templates';
```

## Basic Usage

```tsx
function MyPlugin() {
  return (
    <SinglePanelTemplate title="Image Converter">
      <div className="p-4">
        <p>Your content here</p>
      </div>
    </SinglePanelTemplate>
  );
}
```

## Layout Structure

```
┌─────────────────────────────────────┐
│  Title              [Header Actions]│  ← Header (drag region)
├─────────────────────────────────────┤
│                                     │
│           children                  │  ← Scrollable content
│                                     │
├─────────────────────────────────────┤
│            footer                   │  ← Optional footer
└─────────────────────────────────────┘
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `undefined` | Header title text |
| `children` | `ReactNode` | **required** | Main content |
| `headerActions` | `ReactNode` | `undefined` | Buttons/icons in header right side |
| `footer` | `ReactNode` | `undefined` | Fixed footer content |
| `showSettings` | `boolean` | `false` | Show settings icon in header |
| `onSettingsClick` | `() => void` | `undefined` | Settings button handler |
| `contentClassName` | `string` | `''` | Additional classes for content area |
| `className` | `string` | `''` | Additional classes for root container |

## Examples

### With Header Actions

```tsx
import { SinglePanelTemplate } from '@/templates';
import { Button } from '@/components/ui';
import { Settings, HelpCircle } from 'lucide-react';

function ConverterPlugin() {
  return (
    <SinglePanelTemplate
      title="Format Converter"
      headerActions={
        <div className="flex gap-1">
          <Button variant="ghost" size="icon">
            <HelpCircle className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      }
    >
      <ConversionForm />
    </SinglePanelTemplate>
  );
}
```

### With Footer

```tsx
function ExportPlugin() {
  const [isExporting, setIsExporting] = useState(false);

  return (
    <SinglePanelTemplate
      title="Quick Export"
      footer={
        <div className="flex justify-end gap-2 p-3 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline">Cancel</Button>
          <Button 
            variant="primary" 
            isLoading={isExporting}
            onClick={() => setIsExporting(true)}
          >
            Export
          </Button>
        </div>
      }
    >
      <ExportOptions />
    </SinglePanelTemplate>
  );
}
```

### With Settings Button

```tsx
function ToolPlugin() {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <SinglePanelTemplate
      title="Image Tool"
      showSettings
      onSettingsClick={() => setShowSettings(true)}
    >
      {showSettings ? (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      ) : (
        <MainTool />
      )}
    </SinglePanelTemplate>
  );
}
```

### Full-Height Content

```tsx
function PreviewPlugin() {
  return (
    <SinglePanelTemplate
      title="Preview"
      contentClassName="flex flex-col"
    >
      <div className="flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <img src={imageUrl} alt="Preview" className="max-w-full max-h-full" />
      </div>
    </SinglePanelTemplate>
  );
}
```

### Minimal (No Header)

```tsx
function MinimalPlugin() {
  return (
    <SinglePanelTemplate contentClassName="p-0">
      <div className="h-full flex flex-col">
        <CustomHeader />
        <MainContent />
      </div>
    </SinglePanelTemplate>
  );
}
```

## Styling

### Content Area

The content area is scrollable by default. Use `contentClassName` for custom styling:

```tsx
<SinglePanelTemplate
  contentClassName="p-6 bg-gray-50 dark:bg-gray-900"
>
  {/* Content with custom padding and background */}
</SinglePanelTemplate>
```

### Dark Mode

The template automatically supports dark mode:

```tsx
// Background colors adapt automatically
<SinglePanelTemplate title="My Tool">
  <div className="text-gray-900 dark:text-gray-100">
    Auto-themed content
  </div>
</SinglePanelTemplate>
```

## Best Practices

### ✅ Do

```tsx
// Clear, focused purpose
<SinglePanelTemplate title="Resize Image">
  <ResizeForm />
</SinglePanelTemplate>

// Use footer for primary actions
<SinglePanelTemplate
  title="Export"
  footer={<ActionButtons />}
>
  <Options />
</SinglePanelTemplate>
```

### ❌ Don't

```tsx
// Don't use for complex multi-panel UIs
<SinglePanelTemplate>
  <div className="grid grid-cols-3"> {/* Use ThreeColumnTemplate instead */}
    <Sidebar />
    <Main />
    <Panel />
  </div>
</SinglePanelTemplate>

// Don't nest templates
<SinglePanelTemplate>
  <SinglePanelTemplate> {/* Never nest templates */}
    <Content />
  </SinglePanelTemplate>
</SinglePanelTemplate>
```

## When to Use

**Use SinglePanelTemplate when:**
- Building simple, focused utilities
- Content fits in a single scrollable area
- No sidebar navigation needed
- Quick actions with minimal UI

**Consider other templates when:**
- Need sidebar navigation → [`SplitPanelTemplate`](./split-panel)
- Building settings pages → [`SettingsPanelTemplate`](./settings-panel)
- Processing multiple items → [`BatchProcessTemplate`](./batch-process)

## Related

- [Templates Overview](./overview) - All available templates
- [Button Component](../components/ui/button) - Action buttons
