---
sidebar_position: 2
title: DropdownMenu
description: Contextual menu component with submenus, checkboxes, and radio groups
---

# DropdownMenu

A feature-rich dropdown menu component built on [Radix UI DropdownMenu](https://www.radix-ui.com/primitives/docs/components/dropdown-menu) providing accessible menus with keyboard navigation, submenus, checkbox items, and radio groups.

## Import

```tsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from '@/components';
```

## Basic Usage

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Components

The DropdownMenu system provides 15 compound components:

| Component | Description |
|-----------|-------------|
| `DropdownMenu` | Root component managing menu state |
| `DropdownMenuTrigger` | Element that opens the menu |
| `DropdownMenuContent` | Container for menu items |
| `DropdownMenuItem` | Clickable menu item |
| `DropdownMenuCheckboxItem` | Menu item with checkbox |
| `DropdownMenuRadioItem` | Menu item in radio group |
| `DropdownMenuLabel` | Non-interactive label |
| `DropdownMenuSeparator` | Visual divider |
| `DropdownMenuShortcut` | Keyboard shortcut hint |
| `DropdownMenuGroup` | Groups related items |
| `DropdownMenuPortal` | Portals content to body |
| `DropdownMenuSub` | Submenu container |
| `DropdownMenuSubTrigger` | Triggers submenu |
| `DropdownMenuSubContent` | Submenu content |
| `DropdownMenuRadioGroup` | Groups radio items |

## Props

### DropdownMenu

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `modal` | `boolean` | `true` | Whether to render as modal |
| `dir` | `'ltr' \| 'rtl'` | - | Reading direction |

### DropdownMenuContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `sideOffset` | `number` | `4` | Distance from trigger |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment relative to trigger |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side |
| `alignOffset` | `number` | `0` | Offset from alignment |
| `avoidCollisions` | `boolean` | `true` | Flip to avoid viewport edges |

### DropdownMenuItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inset` | `boolean` | `false` | Add left padding for icon alignment |
| `disabled` | `boolean` | `false` | Disable the item |
| `onSelect` | `(event: Event) => void` | - | Called when item is selected |

### DropdownMenuCheckboxItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean \| 'indeterminate'` | - | Checked state |
| `onCheckedChange` | `(checked: boolean) => void` | - | Callback when checked changes |
| `disabled` | `boolean` | `false` | Disable the item |

### DropdownMenuRadioItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | Required | Value for radio group |
| `disabled` | `boolean` | `false` | Disable the item |

## Examples

### With Icons and Shortcuts

```tsx
import { Settings, User, LogOut, Plus, Folder } from 'lucide-react';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <Settings className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <User className="mr-2 h-4 w-4" />
      Profile
      <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Folder className="mr-2 h-4 w-4" />
      New Folder
      <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-destructive">
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Checkbox Items

```tsx
function ViewOptions() {
  const [showGrid, setShowGrid] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">View Options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Display</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={showGrid}
          onCheckedChange={setShowGrid}
        >
          Show Grid
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={showPreview}
          onCheckedChange={setShowPreview}
        >
          Show Preview
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Radio Group

```tsx
function SortOptions() {
  const [sortBy, setSortBy] = useState('date');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Sort By</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
          <DropdownMenuRadioItem value="date">
            Date Modified
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="name">
            Name
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="size">
            File Size
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="type">
            File Type
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Submenus

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuItem>New File</DropdownMenuItem>
    <DropdownMenuItem>New Folder</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        Export As
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem>PNG</DropdownMenuItem>
          <DropdownMenuItem>JPEG</DropdownMenuItem>
          <DropdownMenuItem>WebP</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Original Format</DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        Move To
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem>Folder A</DropdownMenuItem>
          <DropdownMenuItem>Folder B</DropdownMenuItem>
          <DropdownMenuItem>Folder C</DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  </DropdownMenuContent>
</DropdownMenu>
```

### Grouped Items

```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuGroup>
      <DropdownMenuLabel>File</DropdownMenuLabel>
      <DropdownMenuItem>New</DropdownMenuItem>
      <DropdownMenuItem>Open</DropdownMenuItem>
      <DropdownMenuItem>Save</DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuLabel>Edit</DropdownMenuLabel>
      <DropdownMenuItem>Undo</DropdownMenuItem>
      <DropdownMenuItem>Redo</DropdownMenuItem>
      <DropdownMenuItem>Cut</DropdownMenuItem>
      <DropdownMenuItem>Copy</DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
```

### Context Menu Pattern

```tsx
function ImageContextMenu({ children }: { children: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          Open
          <DropdownMenuShortcut>⏎</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Open in New Window
          <DropdownMenuShortcut>⇧⏎</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Copy
          <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Cut
          <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Add to Favorites</DropdownMenuItem>
        <DropdownMenuItem>Add Tags...</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### Disabled Items

```tsx
<DropdownMenuContent>
  <DropdownMenuItem>Enabled</DropdownMenuItem>
  <DropdownMenuItem disabled>
    Disabled Item
  </DropdownMenuItem>
  <DropdownMenuCheckboxItem disabled checked>
    Disabled Checkbox
  </DropdownMenuCheckboxItem>
</DropdownMenuContent>
```

## Styling

### Default Styles

```tsx
// DropdownMenuContent
"z-50 min-w-[8rem] overflow-hidden rounded-md border"
"bg-popover p-1 text-popover-foreground shadow-md"

// DropdownMenuItem
"relative flex cursor-default select-none items-center"
"gap-2 rounded-sm px-2 py-1.5 text-sm outline-none"
"focus:bg-accent focus:text-accent-foreground"
"data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
```

### Custom Width

```tsx
<DropdownMenuContent className="w-56">
  {/* Fixed width content */}
</DropdownMenuContent>

<DropdownMenuContent className="w-[300px]">
  {/* Custom width */}
</DropdownMenuContent>
```

### Inset Items

Use `inset` prop to align items without icons with those that have icons:

```tsx
<DropdownMenuContent>
  <DropdownMenuItem>
    <Settings className="mr-2 h-4 w-4" />
    With Icon
  </DropdownMenuItem>
  <DropdownMenuItem inset>
    Without Icon (aligned)
  </DropdownMenuItem>
</DropdownMenuContent>
```

## Accessibility

The DropdownMenu implements full keyboard navigation:

- **Enter / Space**: Open menu or select item
- **Arrow Down**: Move to next item
- **Arrow Up**: Move to previous item
- **Arrow Right**: Open submenu
- **Arrow Left**: Close submenu
- **Escape**: Close menu
- **Home**: Move to first item
- **End**: Move to last item
- **Type-ahead**: Jump to item starting with typed character

### ARIA Attributes

- `role="menu"` on content
- `role="menuitem"` on items
- `role="menuitemcheckbox"` on checkbox items
- `role="menuitemradio"` on radio items
- `aria-checked` state for checkbox/radio items
- `aria-disabled` for disabled items

## Best Practices

### Do

- ✅ Use `asChild` on trigger to compose with buttons
- ✅ Group related items with `DropdownMenuGroup`
- ✅ Show keyboard shortcuts with `DropdownMenuShortcut`
- ✅ Use separators to divide logical sections
- ✅ Keep menu items concise and scannable
- ✅ Use icons consistently (all items or none)

### Don't

- ❌ Nest more than 2 levels of submenus
- ❌ Put too many items without grouping
- ❌ Use for navigation (use proper nav components)
- ❌ Forget to handle the `onSelect` callback
- ❌ Mix different item types without separators

## Animation

Menu items include subtle animations:

```css
/* Content animation */
data-[state=open]:animate-in
data-[state=closed]:animate-out
data-[state=closed]:fade-out-0
data-[state=open]:fade-in-0
data-[state=closed]:zoom-out-95
data-[state=open]:zoom-in-95

/* Slide based on side */
data-[side=bottom]:slide-in-from-top-2
data-[side=left]:slide-in-from-right-2
data-[side=right]:slide-in-from-left-2
data-[side=top]:slide-in-from-bottom-2
```

## Related Components

- [Dialog](./dialog) - For modal interactions requiring user response
- [Popover](./popover) - For non-menu overlay content
- [Select](../form/select) - For form selection inputs
- [Button](../ui/button) - Commonly used as menu trigger
