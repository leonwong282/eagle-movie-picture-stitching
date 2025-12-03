---
sidebar_position: 2
title: ImageGrid
description: Responsive grid component for displaying image thumbnails with selection support
---

# ImageGrid

A responsive grid component designed for displaying Eagle image thumbnails with configurable columns, gaps, and selection support.

## Import

```tsx
import { ImageGrid } from '@/components';
```

## Basic Usage

```tsx
import { useEagleSelection } from '@/hooks';

function Gallery() {
  const { items } = useEagleSelection();

  return (
    <ImageGrid
      items={items}
      columns={4}
      gap="md"
      onItemClick={(item) => console.log('Clicked:', item.name)}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `EagleItem[]` | Required | Array of Eagle items to display |
| `columns` | `number \| ResponsiveColumns` | `4` | Number of grid columns |
| `gap` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Gap between grid items |
| `onItemClick` | `(item: EagleItem) => void` | - | Callback when item is clicked |
| `onItemDoubleClick` | `(item: EagleItem) => void` | - | Callback on double-click |
| `selectedIds` | `Set<string> \| string[]` | - | Currently selected item IDs |
| `onSelectionChange` | `(ids: string[]) => void` | - | Callback when selection changes |
| `showName` | `boolean` | `true` | Show item names below thumbnails |
| `showExtension` | `boolean` | `false` | Show file extensions |
| `aspectRatio` | `'square' \| 'original' \| number` | `'square'` | Thumbnail aspect ratio |
| `useThumbnail` | `boolean` | `true` | Use Eagle thumbnails vs original |
| `className` | `string` | - | Additional CSS classes |
| `emptyMessage` | `string` | `'No items'` | Message when items array is empty |

## Column Options

### Fixed Columns

```tsx
// Always 4 columns
<ImageGrid items={items} columns={4} />

// Always 6 columns
<ImageGrid items={items} columns={6} />
```

### Responsive Columns

```tsx
// Different columns at different breakpoints
<ImageGrid
  items={items}
  columns={{
    default: 2,  // Mobile
    sm: 3,       // ≥640px
    md: 4,       // ≥768px
    lg: 5,       // ≥1024px
    xl: 6,       // ≥1280px
  }}
/>
```

## Gap Options

```tsx
// No gap
<ImageGrid items={items} gap="none" />

// Small gap (0.25rem)
<ImageGrid items={items} gap="sm" />

// Medium gap (0.5rem) - default
<ImageGrid items={items} gap="md" />

// Large gap (1rem)
<ImageGrid items={items} gap="lg" />
```

## Examples

### Basic Gallery

```tsx
function BasicGallery() {
  const { items, isLoading } = useEagleSelection();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <ImageGrid
      items={items}
      columns={4}
      gap="md"
      showName
      showExtension
    />
  );
}
```

### With Selection

```tsx
function SelectableGallery() {
  const { items } = useEagleSelection();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectionChange = (ids: string[]) => {
    setSelectedIds(ids);
    console.log('Selected:', ids.length, 'items');
  };

  return (
    <div>
      <div className="mb-4 text-sm text-muted-foreground">
        {selectedIds.length} items selected
      </div>
      <ImageGrid
        items={items}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
        columns={5}
      />
    </div>
  );
}
```

### Custom Click Handlers

```tsx
function ClickableGallery() {
  const { items } = useEagleSelection();
  const [preview, setPreview] = useState<EagleItem | null>(null);

  return (
    <>
      <ImageGrid
        items={items}
        onItemClick={(item) => console.log('Single click:', item.name)}
        onItemDoubleClick={(item) => setPreview(item)}
        columns={4}
      />
      {preview && (
        <Dialog open onOpenChange={() => setPreview(null)}>
          <DialogContent>
            <EagleImage item={preview} className="w-full" />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
```

### Different Aspect Ratios

```tsx
// Square thumbnails (default)
<ImageGrid items={items} aspectRatio="square" />

// Original aspect ratio
<ImageGrid items={items} aspectRatio="original" />

// Custom aspect ratio (16:9)
<ImageGrid items={items} aspectRatio={16/9} />

// Custom aspect ratio (4:3)
<ImageGrid items={items} aspectRatio={4/3} />
```

### Empty State

```tsx
<ImageGrid
  items={[]}
  emptyMessage="No images selected. Select images in Eagle to get started."
  className="min-h-[200px]"
/>
```

### With Loading State

```tsx
function LoadingGallery() {
  const { items, isLoading } = useEagleSelection();

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <ImageGrid
        items={items}
        columns={4}
        className={isLoading ? 'opacity-50' : ''}
      />
    </div>
  );
}
```

### Compact Mode

```tsx
<ImageGrid
  items={items}
  columns={8}
  gap="sm"
  showName={false}
  aspectRatio="square"
  useThumbnail
/>
```

### Full-Featured Example

```tsx
function AdvancedGallery() {
  const { items, isLoading, refresh } = useEagleSelection();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [columns, setColumns] = useState(4);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gallery ({items.length} items)</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Select
              value={columns.toString()}
              onValueChange={(v) => setColumns(parseInt(v))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="8">8</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {selectedIds.length > 0 && (
          <div className="mb-4 p-2 bg-muted rounded-md flex items-center justify-between">
            <span>{selectedIds.length} items selected</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds([])}
            >
              Clear
            </Button>
          </div>
        )}
        <ImageGrid
          items={items}
          columns={columns}
          gap="md"
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          showName
          showExtension
          aspectRatio="square"
          emptyMessage="Select images in Eagle to view them here"
        />
      </CardContent>
    </Card>
  );
}
```

## Styling

### Default Styles

The grid uses CSS Grid for layout:

```css
/* Grid container */
display: grid;
grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
gap: var(--gap);

/* Grid items */
aspect-ratio: var(--aspect-ratio);
border-radius: 0.5rem;
overflow: hidden;
cursor: pointer;
transition: transform 0.2s, box-shadow 0.2s;
```

### Hover Effects

```css
/* Default hover */
.grid-item:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Selected state */
.grid-item[data-selected="true"] {
  ring: 2px solid var(--primary);
}
```

### Custom Styling

```tsx
// Add custom container styles
<ImageGrid
  items={items}
  className="bg-muted/50 p-4 rounded-lg"
/>

// Dark theme optimized
<ImageGrid
  items={items}
  className="bg-gray-900"
  gap="sm"
/>
```

## Performance

### Thumbnail Optimization

```tsx
// Use thumbnails for performance (default)
<ImageGrid items={items} useThumbnail />

// Use original images for quality
<ImageGrid items={items} useThumbnail={false} />
```

### Virtualization Note

For very large item counts (100+), consider using a virtualized grid:

```tsx
// For large datasets, implement virtualization
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualizedGrid({ items }: { items: EagleItem[] }) {
  // Custom virtualized implementation
  // ImageGrid is optimized for typical selection sizes (< 100 items)
}
```

## Integration with Eagle

### Using with useEagleSelection

```tsx
function EagleGallery() {
  const {
    items,
    isLoading,
    isPaused,
    refresh,
    startPolling,
    stopPolling,
  } = useEagleSelection({
    pollingInterval: 500,
    pauseOnHidden: true,
  });

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-muted-foreground">
          {items.length} items selected
          {isPaused && ' (paused)'}
        </span>
        <Button variant="ghost" size="sm" onClick={refresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <ImageGrid items={items} columns={4} />
    </div>
  );
}
```

## Best Practices

### Do

- ✅ Use `useThumbnail` for grid views
- ✅ Provide meaningful `emptyMessage`
- ✅ Use responsive columns for different screen sizes
- ✅ Show loading state while items are being fetched
- ✅ Consider aspect ratio based on content type

### Don't

- ❌ Display more than 100 items without virtualization
- ❌ Use original images when thumbnails suffice
- ❌ Forget to handle empty state
- ❌ Set columns too high for container width
- ❌ Ignore selection state for interactive grids

## Related Components

- [EagleImage](./eagle-image) - Individual image component used in grid
- [Card](../ui/card) - Container for grid with header/footer
- [Select](../form/select) - For column count selection
