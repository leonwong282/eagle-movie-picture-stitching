---
sidebar_position: 4
title: Popover
description: Floating content panel for interactive overlays and forms
---

# Popover

A floating content panel built on [Radix UI Popover](https://www.radix-ui.com/primitives/docs/components/popover) providing accessible overlays for interactive content, forms, and supplementary information.

## Import

```tsx
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
  PopoverClose,
} from '@/components';
```

## Basic Usage

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div className="space-y-2">
      <h4 className="font-medium">Popover Title</h4>
      <p className="text-sm text-muted-foreground">
        This is some popover content.
      </p>
    </div>
  </PopoverContent>
</Popover>
```

## Components

| Component | Description |
|-----------|-------------|
| `Popover` | Root component managing popover state |
| `PopoverTrigger` | Element that opens the popover |
| `PopoverContent` | The floating content container |
| `PopoverAnchor` | Optional custom anchor point |
| `PopoverClose` | Button to close the popover |

## Props

### Popover

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `modal` | `boolean` | `false` | Whether to render as modal |

### PopoverContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment relative to anchor |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side |
| `sideOffset` | `number` | `4` | Distance from anchor |
| `alignOffset` | `number` | `0` | Offset from alignment |
| `avoidCollisions` | `boolean` | `true` | Flip to avoid viewport edges |
| `collisionPadding` | `number \| Partial<Record<Side, number>>` | `0` | Padding from viewport edge |
| `sticky` | `'partial' \| 'always'` | `'partial'` | Sticky behavior during scroll |
| `hideWhenDetached` | `boolean` | `false` | Hide when anchor is off-screen |

### PopoverTrigger / PopoverClose

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge props onto child element |

## Examples

### Settings Popover

```tsx
function SettingsPopover() {
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(false);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Settings</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Notifications</Label>
              <Checkbox
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="autosave">Auto-save</Label>
              <Checkbox
                id="autosave"
                checked={autoSave}
                onCheckedChange={setAutoSave}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

### Form Popover

```tsx
function QuickAddPopover() {
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submission
    setOpen(false);
    setName('');
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Quick Add
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Add New Item</h4>
            <p className="text-sm text-muted-foreground">
              Enter a name for the new item.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Item name..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <PopoverClose asChild>
              <Button type="button" variant="outline" size="sm">
                Cancel
              </Button>
            </PopoverClose>
            <Button type="submit" size="sm">
              Add
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
```

### Color Picker Popover

```tsx
function ColorPickerPopover() {
  const [color, setColor] = useState('#3b82f6');
  const colors = [
    '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280',
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[140px] justify-start">
          <div
            className="mr-2 h-4 w-4 rounded"
            style={{ backgroundColor: color }}
          />
          Pick Color
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <div className="grid grid-cols-4 gap-2">
          {colors.map((c) => (
            <button
              key={c}
              className="h-8 w-8 rounded-md border-2 transition-all hover:scale-110"
              style={{
                backgroundColor: c,
                borderColor: c === color ? 'white' : 'transparent',
              }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

### With Custom Anchor

```tsx
function AnchoredPopover() {
  return (
    <Popover>
      <PopoverAnchor asChild>
        <div className="w-full border-b p-4">
          Popover will anchor to this area
        </div>
      </PopoverAnchor>
      <PopoverTrigger asChild>
        <Button>Show Info</Button>
      </PopoverTrigger>
      <PopoverContent>
        <p>Content positioned relative to the anchor, not the trigger</p>
      </PopoverContent>
    </Popover>
  );
}
```

### Positioning Examples

```tsx
<div className="flex gap-4">
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">Bottom (Default)</Button>
    </PopoverTrigger>
    <PopoverContent side="bottom">
      <p>Below the trigger</p>
    </PopoverContent>
  </Popover>

  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">Top</Button>
    </PopoverTrigger>
    <PopoverContent side="top">
      <p>Above the trigger</p>
    </PopoverContent>
  </Popover>

  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">Right</Button>
    </PopoverTrigger>
    <PopoverContent side="right">
      <p>To the right</p>
    </PopoverContent>
  </Popover>

  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">Left</Button>
    </PopoverTrigger>
    <PopoverContent side="left">
      <p>To the left</p>
    </PopoverContent>
  </Popover>
</div>
```

### Controlled Popover

```tsx
function ControlledPopover() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');

  const handleSave = () => {
    // Save logic
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button>Edit Value</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-4">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter value..."
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

### Profile Card Popover

```tsx
function UserPopover({ user }: { user: User }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-8 w-8 rounded-full"
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-16 w-16 rounded-full"
          />
          <div className="space-y-1">
            <h4 className="font-semibold">{user.name}</h4>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">
              Member since {user.joinDate}
            </p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Profile
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Message
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
```

## Styling

### Default Styles

```tsx
// PopoverContent default styling
"z-50 w-72 rounded-md border bg-popover p-4"
"text-popover-foreground shadow-md outline-none"
"data-[state=open]:animate-in data-[state=closed]:animate-out"
"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
"data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
```

### Custom Sizes

```tsx
// Small popover
<PopoverContent className="w-48 p-2">
  <p className="text-sm">Small content</p>
</PopoverContent>

// Large popover
<PopoverContent className="w-96 p-6">
  <div className="space-y-4">
    {/* More content */}
  </div>
</PopoverContent>

// Auto width
<PopoverContent className="w-auto">
  <div>Content determines width</div>
</PopoverContent>
```

### Custom Styling

```tsx
// Themed popover
<PopoverContent className="bg-primary text-primary-foreground">
  <p>Primary themed content</p>
</PopoverContent>

// Minimal popover
<PopoverContent className="border-0 shadow-lg">
  <p>No border, strong shadow</p>
</PopoverContent>
```

## Accessibility

Popover implements comprehensive accessibility:

- **Focus Management**: Focus moves to content when opened
- **Focus Restoration**: Focus returns to trigger on close
- **Escape Key**: Closes the popover
- **Click Outside**: Closes the popover
- **ARIA**: Proper `aria-haspopup`, `aria-expanded`, `aria-controls`

### Modal Mode

```tsx
// Modal popovers block interaction with rest of page
<Popover modal>
  <PopoverTrigger asChild>
    <Button>Open Modal Popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    {/* Focus is trapped within */}
  </PopoverContent>
</Popover>
```

## Popover vs Dialog vs Tooltip

| Feature | Popover | Dialog | Tooltip |
|---------|---------|--------|---------|
| Interaction | Click to open | Click to open | Hover to show |
| Focus trap | Optional (modal) | Yes | No |
| Blocking | No (default) | Yes | No |
| Content | Interactive | Interactive | Informational |
| Persistence | Stays open | Stays open | Disappears on leave |
| Use case | Forms, options | Confirmations | Hints, labels |

## Best Practices

### Do

- ✅ Use for interactive content that doesn't need full modal
- ✅ Keep content focused and relevant
- ✅ Provide clear close mechanism
- ✅ Use controlled mode for form submissions
- ✅ Consider mobile touch targets
- ✅ Position to avoid covering important content

### Don't

- ❌ Use for simple text hints (use Tooltip)
- ❌ Put complex multi-step forms (use Dialog)
- ❌ Nest popovers within popovers
- ❌ Make content too large
- ❌ Forget to handle outside clicks appropriately
- ❌ Use for navigation menus (use DropdownMenu)

## Animation

Popover includes smooth enter/exit animations:

```css
/* Enter animation */
data-[state=open]:animate-in
data-[state=open]:fade-in-0
data-[state=open]:zoom-in-95

/* Exit animation */
data-[state=closed]:animate-out
data-[state=closed]:fade-out-0
data-[state=closed]:zoom-out-95

/* Slide based on side */
data-[side=bottom]:slide-in-from-top-2
data-[side=left]:slide-in-from-right-2
data-[side=right]:slide-in-from-left-2
data-[side=top]:slide-in-from-bottom-2
```

## Related Components

- [Tooltip](./tooltip) - For non-interactive hints
- [Dialog](./dialog) - For modal interactions
- [DropdownMenu](./dropdown-menu) - For action menus
