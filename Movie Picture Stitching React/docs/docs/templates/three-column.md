---
sidebar_position: 7
title: ThreeColumnTemplate
description: Classic three-column layout for complex workflows
---

# ThreeColumnTemplate

A sophisticated three-column layout for complex editing workflows, mirroring Eagle's native interface. Features queue management, central preview, and parameter panels.

## Import

```tsx
import { ThreeColumnTemplate } from '@/templates';
```

## Basic Usage

```tsx
import { ThreeColumnTemplate } from '@/templates';

function ImageEditor() {
  return (
    <ThreeColumnTemplate
      leftColumn={<ItemQueue />}
      centerColumn={<PreviewCanvas />}
      rightColumn={<ParameterPanel />}
    />
  );
}
```

## Layout Structure

```
┌─────────────────────────────────────┐
│            Header                   │
├─────────┬───────────────┬───────────┤
│  Left   │    Center     │   Right   │
│ Column  │    Column     │  Column   │
│         │               │           │
│  Queue  │   Preview     │  Params   │
│  List   │   Canvas      │  Panel    │
│ (250px) │   (flex-1)    │  (300px)  │
│         │               │           │
└─────────┴───────────────┴───────────┘
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `leftColumn` | `ReactNode` | `undefined` | Left panel content (queue, list) |
| `centerColumn` | `ReactNode` | `undefined` | Center panel content (preview, canvas) |
| `rightColumn` | `ReactNode` | `undefined` | Right panel content (params, info) |
| `leftWidth` | `number` | `250` | Left column width in pixels |
| `rightWidth` | `number` | `300` | Right column width in pixels |
| `title` | `string` | `undefined` | Header title |
| `headerActions` | `ReactNode` | `undefined` | Header right-side content |
| `leftCollapsible` | `boolean` | `true` | Allow left column collapse |
| `rightCollapsible` | `boolean` | `true` | Allow right column collapse |
| `defaultLeftCollapsed` | `boolean` | `false` | Start with left collapsed |
| `defaultRightCollapsed` | `boolean` | `false` | Start with right collapsed |
| `showDividers` | `boolean` | `true` | Show column dividers |

## Examples

### Image Editor Workflow

```tsx
import { ThreeColumnTemplate } from '@/templates';

function ImageEditor() {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [params, setParams] = useState(defaultParams);
  const { items } = useEagleSelection();

  return (
    <ThreeColumnTemplate
      title="Image Editor"
      headerActions={
        <Button variant="primary" onClick={handleExport}>
          Export
        </Button>
      }
      leftColumn={
        <div className="h-full flex flex-col">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium">Queue ({items.length})</h3>
          </div>
          <div className="flex-1 overflow-auto p-2">
            {items.map(item => (
              <QueueItem
                key={item.id}
                item={item}
                selected={item.id === selectedImage?.id}
                onClick={() => setSelectedImage(item)}
              />
            ))}
          </div>
        </div>
      }
      centerColumn={
        <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          {selectedImage ? (
            <PreviewCanvas image={selectedImage} params={params} />
          ) : (
            <EmptyState message="Select an image to edit" />
          )}
        </div>
      }
      rightColumn={
        <div className="h-full flex flex-col">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-medium">Parameters</h3>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <ParameterControls
              params={params}
              onChange={setParams}
              disabled={!selectedImage}
            />
          </div>
        </div>
      }
    />
  );
}
```

### Movie Stitching Layout

```tsx
function MovieStitching() {
  const [images, setImages] = useState<StitchImage[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    cropTop: 0,
    cropBottom: 0,
    format: 'png',
    quality: 90,
  });

  return (
    <ThreeColumnTemplate
      title="Movie Picture Stitching"
      leftWidth={280}
      rightWidth={320}
      leftColumn={
        <ImageList
          images={images}
          onReorder={(newOrder) => setImages(newOrder)}
          onRemove={(id) => setImages(prev => prev.filter(i => i.id !== id))}
        />
      }
      centerColumn={
        <PreviewPanel
          preview={preview}
          onRefresh={() => generatePreview(images, settings)}
        />
      }
      rightColumn={
        <SettingsPanel
          settings={settings}
          onChange={setSettings}
          onGenerate={() => generatePreview(images, settings)}
          onExport={() => exportStitched(images, settings)}
        />
      }
    />
  );
}
```

### With Collapsible Panels

```tsx
function CollapsibleLayout() {
  return (
    <ThreeColumnTemplate
      title="Compact Editor"
      leftCollapsible={true}
      rightCollapsible={true}
      defaultRightCollapsed={true}
      leftColumn={<NavigationPanel />}
      centerColumn={<MainEditor />}
      rightColumn={<PropertiesPanel />}
    />
  );
}
```

### Custom Column Widths

```tsx
function WidePreview() {
  return (
    <ThreeColumnTemplate
      leftWidth={200}   // Narrow queue
      rightWidth={350}  // Wide params
      leftColumn={<CompactQueue />}
      centerColumn={<LargePreview />}  // Gets remaining space
      rightColumn={<DetailedParams />}
    />
  );
}
```

### With Column Headers

```tsx
function HeaderedColumns() {
  return (
    <ThreeColumnTemplate
      leftColumn={
        <Column title="Source Files" icon={<FolderIcon />}>
          <FileList />
        </Column>
      }
      centerColumn={
        <Column title="Preview" actions={<ZoomControls />}>
          <Canvas />
        </Column>
      }
      rightColumn={
        <Column title="Export Settings" icon={<SettingsIcon />}>
          <ExportForm />
        </Column>
      }
    />
  );
}

// Helper component
function Column({ title, icon, actions, children }) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="font-medium">{title}</h3>
        </div>
        {actions}
      </div>
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
```

### Resizable Columns

```tsx
function ResizableLayout() {
  const [leftWidth, setLeftWidth] = useState(250);
  const [rightWidth, setRightWidth] = useState(300);

  return (
    <ThreeColumnTemplate
      leftWidth={leftWidth}
      rightWidth={rightWidth}
      onLeftResize={setLeftWidth}
      onRightResize={setRightWidth}
      leftColumn={<Queue />}
      centerColumn={<Preview />}
      rightColumn={<Params />}
    />
  );
}
```

### Two Columns Only

```tsx
// Use only left + center
function LeftAndCenter() {
  return (
    <ThreeColumnTemplate
      leftColumn={<Sidebar />}
      centerColumn={<MainContent />}
      rightColumn={null}  // No right column
    />
  );
}

// Use only center + right
function CenterAndRight() {
  return (
    <ThreeColumnTemplate
      leftColumn={null}  // No left column
      centerColumn={<Editor />}
      rightColumn={<Properties />}
    />
  );
}
```

## Column Responsibilities

### Left Column (Queue/Navigation)
- Item list or queue
- Folder/category navigation
- Drag-and-drop reordering
- Selection management

### Center Column (Preview/Canvas)
- Main content area
- Image/video preview
- Interactive canvas
- WYSIWYG editor

### Right Column (Parameters/Properties)
- Settings and controls
- Property inspector
- Export options
- Metadata display

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `[` | Collapse left panel |
| `]` | Collapse right panel |
| `Ctrl/Cmd + [` | Toggle left panel |
| `Ctrl/Cmd + ]` | Toggle right panel |
| `Escape` | Focus center panel |

## Best Practices

### ✅ Do

```tsx
// Clear column purposes
<ThreeColumnTemplate
  leftColumn={<InputQueue />}      // Source items
  centerColumn={<Preview />}       // Result preview
  rightColumn={<OutputSettings />} // Configuration
/>

// Handle empty states
<ThreeColumnTemplate
  centerColumn={
    items.length === 0 
      ? <EmptyState /> 
      : <Preview items={items} />
  }
/>

// Responsive column widths
<ThreeColumnTemplate
  leftWidth={Math.min(280, windowWidth * 0.2)}
  rightWidth={Math.min(320, windowWidth * 0.25)}
/>
```

### ❌ Don't

```tsx
// Don't duplicate functionality across columns
<ThreeColumnTemplate
  leftColumn={<ImageList />}
  rightColumn={<ImageList />}  // Confusing duplication
/>

// Don't make columns too narrow
<ThreeColumnTemplate
  leftWidth={100}   // Too narrow for content
  rightWidth={100}  // Too narrow for controls
/>
```

## Column Width Guidelines

| Content Type | Recommended Width |
|--------------|-------------------|
| Minimal queue/list | 180-220px |
| Standard queue | 240-280px |
| Detailed list with thumbnails | 280-320px |
| Simple controls | 250-300px |
| Complex form | 320-380px |
| Property inspector | 300-350px |

## When to Use

**Use ThreeColumnTemplate when:**
- Building image/video editors
- Need queue + preview + params pattern
- Complex multi-step workflows
- Eagle-native style interfaces

**Consider other templates when:**
- Simple utilities → [`SinglePanelTemplate`](./single-panel)
- Two-column layout → [`SplitPanelTemplate`](./split-panel)
- Settings pages → [`SettingsPanelTemplate`](./settings-panel)
- Batch processing → [`BatchProcessTemplate`](./batch-process)

## Related

- [Templates Overview](./overview) - All available templates
- [SplitPanelTemplate](./split-panel) - Simpler two-column layout
- [BatchProcessTemplate](./batch-process) - Processing workflows
