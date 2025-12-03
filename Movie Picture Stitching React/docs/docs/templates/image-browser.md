---
sidebar_position: 6
title: ImageBrowserTemplate
description: Grid-based image browser with filtering and selection
---

# ImageBrowserTemplate

A responsive image grid browser with search, filtering, sorting, and multi-select capabilities. Designed for asset browsing, image picking, and gallery views.

## Import

```tsx
import { ImageBrowserTemplate } from '@/templates';
```

## Basic Usage

```tsx
import { ImageBrowserTemplate } from '@/templates';

function AssetBrowser() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <ImageBrowserTemplate
      items={images}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
    />
  );
}
```

## Layout Structure

```
┌─────────────────────────────────────┐
│  🔍 Search...    [Grid▼] [Sort▼]   │  ← Toolbar
├─────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │ img │ │ img │ │ img │ │ img │   │
│ │  ✓  │ │     │ │  ✓  │ │     │   │  ← Responsive grid
│ └─────┘ └─────┘ └─────┘ └─────┘   │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │ img │ │ img │ │ img │ │ img │   │
│ └─────┘ └─────┘ └─────┘ └─────┘   │
├─────────────────────────────────────┤
│  Selected: 2 items    [Clear]      │  ← Status bar
└─────────────────────────────────────┘
```

## Types

### BrowserItem

```tsx
interface BrowserItem {
  id: string;
  name: string;
  thumbnail: string;
  width?: number;
  height?: number;
  size?: number;
  ext?: string;
  tags?: string[];
  folders?: string[];
  modificationTime?: number;
  star?: number;
}
```

### FilterOptions

```tsx
interface FilterOptions {
  search?: string;
  extensions?: string[];
  tags?: string[];
  folders?: string[];
  starred?: boolean;
  minWidth?: number;
  maxWidth?: number;
}
```

### SortOptions

```tsx
interface SortOptions {
  field: 'name' | 'size' | 'modificationTime' | 'width' | 'star';
  direction: 'asc' | 'desc';
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `BrowserItem[]` | **required** | Items to display |
| `selectedIds` | `string[]` | `[]` | Currently selected item IDs |
| `onSelectionChange` | `(ids: string[]) => void` | `undefined` | Selection change handler |
| `onItemClick` | `(item: BrowserItem) => void` | `undefined` | Single click handler |
| `onItemDoubleClick` | `(item: BrowserItem) => void` | `undefined` | Double click handler |
| `multiSelect` | `boolean` | `true` | Allow multiple selection |
| `columns` | `number` | `4` | Grid columns (2-6) |
| `showToolbar` | `boolean` | `true` | Show search/filter toolbar |
| `showStatusBar` | `boolean` | `true` | Show selection status bar |
| `filters` | `FilterOptions` | `undefined` | Active filters |
| `onFiltersChange` | `(filters: FilterOptions) => void` | `undefined` | Filter change handler |
| `sort` | `SortOptions` | `undefined` | Active sort |
| `onSortChange` | `(sort: SortOptions) => void` | `undefined` | Sort change handler |
| `emptyMessage` | `string` | `'No items'` | Empty state message |
| `isLoading` | `boolean` | `false` | Show loading state |

## Examples

### With Eagle Selection

```tsx
import { ImageBrowserTemplate } from '@/templates';
import { useEagleSelection } from '@/hooks';

function EagleBrowser() {
  const { items, isLoading } = useEagleSelection();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const browserItems = items.map(item => ({
    id: item.id,
    name: item.name,
    thumbnail: item.thumbnail,
    width: item.width,
    height: item.height,
    ext: item.ext,
    tags: item.tags,
  }));

  return (
    <ImageBrowserTemplate
      items={browserItems}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      isLoading={isLoading}
    />
  );
}
```

### With Filtering

```tsx
function FilteredBrowser() {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    extensions: [],
  });

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.extensions?.length && !filters.extensions.includes(item.ext)) {
        return false;
      }
      if (filters.starred && !item.star) {
        return false;
      }
      return true;
    });
  }, [items, filters]);

  return (
    <ImageBrowserTemplate
      items={filteredItems}
      filters={filters}
      onFiltersChange={setFilters}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
    />
  );
}
```

### With Sorting

```tsx
function SortableBrowser() {
  const [sort, setSort] = useState<SortOptions>({
    field: 'name',
    direction: 'asc',
  });

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aVal = a[sort.field] ?? 0;
      const bVal = b[sort.field] ?? 0;
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }, [items, sort]);

  return (
    <ImageBrowserTemplate
      items={sortedItems}
      sort={sort}
      onSortChange={setSort}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
    />
  );
}
```

### Single Select Mode

```tsx
function ImagePicker({ onSelect }: { onSelect: (item: BrowserItem) => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <ImageBrowserTemplate
      items={images}
      selectedIds={selectedId ? [selectedId] : []}
      onSelectionChange={(ids) => setSelectedId(ids[0] ?? null)}
      multiSelect={false}
      onItemDoubleClick={(item) => {
        onSelect(item);
      }}
    />
  );
}
```

### Custom Columns

```tsx
function ResponsiveBrowser() {
  const [columns, setColumns] = useState(4);

  return (
    <ImageBrowserTemplate
      items={images}
      columns={columns}
      headerActions={
        <div className="flex gap-1">
          {[2, 3, 4, 5, 6].map(n => (
            <Button
              key={n}
              variant={columns === n ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setColumns(n)}
            >
              {n}
            </Button>
          ))}
        </div>
      }
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
    />
  );
}
```

### With Context Menu

```tsx
function BrowserWithContextMenu() {
  const handleItemContextMenu = (item: BrowserItem, event: React.MouseEvent) => {
    event.preventDefault();
    showContextMenu({
      x: event.clientX,
      y: event.clientY,
      items: [
        { label: 'Open', onClick: () => openItem(item) },
        { label: 'Copy', onClick: () => copyItem(item) },
        { label: 'Delete', onClick: () => deleteItem(item) },
      ],
    });
  };

  return (
    <ImageBrowserTemplate
      items={images}
      onItemContextMenu={handleItemContextMenu}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
    />
  );
}
```

### Loading State

```tsx
function LoadingBrowser() {
  const { items, isLoading, error } = useAsyncItems();

  if (error) {
    return <ErrorFallback error={error} />;
  }

  return (
    <ImageBrowserTemplate
      items={items}
      isLoading={isLoading}
      emptyMessage="No images found"
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
    />
  );
}
```

### Custom Empty State

```tsx
function CustomEmptyBrowser() {
  return (
    <ImageBrowserTemplate
      items={[]}
      emptyContent={
        <div className="flex flex-col items-center gap-4 py-12">
          <ImageIcon className="w-16 h-16 text-gray-400" />
          <p className="text-gray-500">No images selected</p>
          <Button onClick={openSelector}>Select Images</Button>
        </div>
      }
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
    />
  );
}
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Arrow Keys` | Navigate grid |
| `Space` | Toggle selection |
| `Ctrl/Cmd + A` | Select all |
| `Ctrl/Cmd + Click` | Add to selection |
| `Shift + Click` | Range select |
| `Escape` | Clear selection |
| `Enter` | Open selected |

## Selection Behavior

### Multi-Select (default)

- Click: Select single, clear others
- Ctrl/Cmd + Click: Toggle item in selection
- Shift + Click: Select range from last selected

### Single-Select

- Click: Select single item only
- No range or multi-select

## Best Practices

### ✅ Do

```tsx
// Memoize filtered/sorted items
const filteredItems = useMemo(() => {
  return items.filter(item => matchesFilters(item, filters));
}, [items, filters]);

// Handle loading states
<ImageBrowserTemplate
  items={items}
  isLoading={isLoading}
  emptyMessage="Loading..."
/>

// Provide clear empty states
<ImageBrowserTemplate
  emptyContent={<HelpfulEmptyState />}
/>
```

### ❌ Don't

```tsx
// Don't filter inline (causes re-filter on every render)
<ImageBrowserTemplate
  items={items.filter(i => i.name.includes(search))}  // Wrong!
/>

// Don't forget to handle selection
<ImageBrowserTemplate
  items={items}
  // Missing onSelectionChange = no interaction
/>
```

## When to Use

**Use ImageBrowserTemplate when:**
- Displaying image/asset grids
- Need multi-select functionality
- Want search and filtering
- Building image pickers

**Consider other templates when:**
- Single image preview → [`SinglePanelTemplate`](./single-panel)
- Batch processing → [`BatchProcessTemplate`](./batch-process)
- Three-panel editing → [`ThreeColumnTemplate`](./three-column)

## Related

- [Templates Overview](./overview) - All available templates
- [useEagleSelection](../hooks/use-eagle-selection) - Get Eagle items
