---
sidebar_position: 3
title: EagleImage
description: Image component optimized for displaying Eagle library assets with thumbnail support
---

# EagleImage

An optimized image component for displaying Eagle library assets with automatic thumbnail loading, lazy loading, error handling, and retry capabilities.

## Import

```tsx
import { EagleImage, ImagePlaceholder } from '@/components';
```

## Basic Usage

```tsx
import { useEagleSelection } from '@/hooks';

function ImagePreview() {
  const { items } = useEagleSelection();
  const firstItem = items[0];

  if (!firstItem) return <ImagePlaceholder />;

  return (
    <EagleImage
      item={firstItem}
      className="w-full max-w-md rounded-lg"
    />
  );
}
```

## Props

### EagleImage

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `item` | `EagleItem` | Required | Eagle item object to display |
| `useThumbnail` | `boolean` | `true` | Use Eagle thumbnail vs original |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Thumbnail size preference |
| `lazy` | `boolean` | `true` | Enable lazy loading |
| `fallback` | `ReactNode` | `<ImagePlaceholder />` | Fallback on error |
| `retryCount` | `number` | `3` | Number of retry attempts |
| `retryDelay` | `number` | `1000` | Delay between retries (ms) |
| `onLoad` | `() => void` | - | Callback when image loads |
| `onError` | `(error: Error) => void` | - | Callback on load error |
| `className` | `string` | - | Additional CSS classes |
| `style` | `CSSProperties` | - | Inline styles |
| `alt` | `string` | `item.name` | Alt text override |

### ImagePlaceholder

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `icon` | `ReactNode` | `<ImageIcon />` | Custom icon |
| `text` | `string` | - | Optional text below icon |

## Thumbnail Sizes

```tsx
// Small (150px) - for grids with many items
<EagleImage item={item} size="sm" />

// Medium (300px) - default, good balance
<EagleImage item={item} size="md" />

// Large (600px) - for detailed previews
<EagleImage item={item} size="lg" />

// Extra large (1200px) - for full-size display
<EagleImage item={item} size="xl" />
```

## Examples

### Basic Preview

```tsx
function Preview({ item }: { item: EagleItem }) {
  return (
    <div className="aspect-video overflow-hidden rounded-lg">
      <EagleImage
        item={item}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
```

### With Loading State

```tsx
function LoadingImage({ item }: { item: EagleItem }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <EagleImage
        item={item}
        onLoad={() => setIsLoading(false)}
        className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity'}
      />
    </div>
  );
}
```

### Error Handling

```tsx
function RobustImage({ item }: { item: EagleItem }) {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-destructive/10 rounded-lg">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-destructive mt-2">Failed to load image</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => setError(null)}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <EagleImage
      item={item}
      onError={setError}
      retryCount={5}
      retryDelay={2000}
    />
  );
}
```

### Custom Fallback

```tsx
<EagleImage
  item={item}
  fallback={
    <div className="flex flex-col items-center justify-center h-full bg-muted">
      <FileQuestion className="h-12 w-12 text-muted-foreground" />
      <span className="text-sm text-muted-foreground mt-2">
        Preview unavailable
      </span>
    </div>
  }
/>
```

### Original vs Thumbnail

```tsx
function QualityComparison({ item }: { item: EagleItem }) {
  const [useOriginal, setUseOriginal] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          id="original"
          checked={useOriginal}
          onCheckedChange={setUseOriginal}
        />
        <Label htmlFor="original">Use original quality</Label>
      </div>
      <EagleImage
        item={item}
        useThumbnail={!useOriginal}
        size={useOriginal ? 'xl' : 'lg'}
        className="max-w-full rounded-lg"
      />
    </div>
  );
}
```

### Lazy Loading Gallery

```tsx
function LazyGallery({ items }: { items: EagleItem[] }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map((item) => (
        <EagleImage
          key={item.id}
          item={item}
          lazy
          size="sm"
          className="w-full aspect-square object-cover rounded-md"
        />
      ))}
    </div>
  );
}
```

### Image Comparison

```tsx
function ImageComparison({ item }: { item: EagleItem }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Thumbnail</h4>
        <EagleImage
          item={item}
          useThumbnail
          size="md"
          className="w-full rounded-lg"
        />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Original</h4>
        <EagleImage
          item={item}
          useThumbnail={false}
          className="w-full rounded-lg"
        />
      </div>
    </div>
  );
}
```

### With Overlay Info

```tsx
function ImageWithInfo({ item }: { item: EagleItem }) {
  return (
    <div className="relative group">
      <EagleImage
        item={item}
        className="w-full rounded-lg"
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end">
        <div className="p-4 text-white">
          <p className="font-medium truncate">{item.name}</p>
          <p className="text-sm text-white/80">
            {item.width} × {item.height}
          </p>
          <p className="text-xs text-white/60">
            {(item.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </div>
    </div>
  );
}
```

## ImagePlaceholder

A placeholder component for empty or loading states:

```tsx
// Basic placeholder
<ImagePlaceholder />

// With custom icon
<ImagePlaceholder icon={<FileImage className="h-12 w-12" />} />

// With text
<ImagePlaceholder text="No image selected" />

// Custom styling
<ImagePlaceholder className="h-64 bg-muted/50" />
```

### Placeholder Examples

```tsx
// Empty selection
function EmptyState() {
  return (
    <ImagePlaceholder
      icon={<MousePointer className="h-12 w-12" />}
      text="Select an image in Eagle"
      className="h-96"
    />
  );
}

// Loading state
function LoadingState() {
  return (
    <ImagePlaceholder
      icon={<Loader2 className="h-12 w-12 animate-spin" />}
      text="Loading..."
      className="h-96"
    />
  );
}

// Error state
function ErrorState() {
  return (
    <ImagePlaceholder
      icon={<AlertCircle className="h-12 w-12 text-destructive" />}
      text="Failed to load image"
      className="h-96 border-destructive"
    />
  );
}
```

## Performance Optimization

### Thumbnail Sizing Strategy

```tsx
// For grid views (many images)
<EagleImage item={item} size="sm" />  // 150px - fastest

// For preview panels
<EagleImage item={item} size="md" />  // 300px - balanced

// For detail views
<EagleImage item={item} size="lg" />  // 600px - detailed

// For full-screen/export preview
<EagleImage item={item} useThumbnail={false} />  // Original
```

### Lazy Loading Best Practices

```tsx
// Always lazy load for lists/grids
<div className="grid grid-cols-4">
  {items.map(item => (
    <EagleImage key={item.id} item={item} lazy />
  ))}
</div>

// Eager load for above-the-fold content
<EagleImage item={heroItem} lazy={false} />
```

## Error Retry Logic

The component includes automatic retry with exponential backoff:

```tsx
<EagleImage
  item={item}
  retryCount={3}      // Attempt 3 retries
  retryDelay={1000}   // Start with 1s delay
  // Actual delays: 1s, 2s, 4s (exponential backoff)
/>
```

## Integration with Eagle API

### Using Item Properties

```tsx
function ImageDetails({ item }: { item: EagleItem }) {
  return (
    <div className="space-y-4">
      <EagleImage item={item} size="lg" />
      <dl className="text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Name</dt>
          <dd>{item.name}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Dimensions</dt>
          <dd>{item.width} × {item.height}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Format</dt>
          <dd>{item.ext.toUpperCase()}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Size</dt>
          <dd>{(item.size / 1024).toFixed(1)} KB</dd>
        </div>
      </dl>
    </div>
  );
}
```

## Best Practices

### Do

- ✅ Use thumbnails for grids and lists
- ✅ Match thumbnail size to display size
- ✅ Enable lazy loading for off-screen images
- ✅ Provide meaningful alt text
- ✅ Handle loading and error states
- ✅ Use appropriate retry settings

### Don't

- ❌ Load original images when thumbnails suffice
- ❌ Disable lazy loading for large galleries
- ❌ Ignore error handling
- ❌ Set excessive retry counts
- ❌ Forget to set dimensions/aspect-ratio

## Accessibility

```tsx
// Good: Descriptive alt text
<EagleImage
  item={item}
  alt={`${item.name} - ${item.width}×${item.height} ${item.ext.toUpperCase()}`}
/>

// Good: Decorative image
<EagleImage
  item={item}
  alt=""
  role="presentation"
/>

// Good: With figcaption
<figure>
  <EagleImage item={item} />
  <figcaption className="text-sm text-muted-foreground mt-2">
    {item.name}
  </figcaption>
</figure>
```

## Related Components

- [ImageGrid](./image-grid) - Grid layout using EagleImage
- [Dialog](../overlay/dialog) - For full-screen image previews
- [Card](../ui/card) - Container for image with metadata
