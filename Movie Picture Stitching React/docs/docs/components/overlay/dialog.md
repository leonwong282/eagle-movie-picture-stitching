---
sidebar_position: 1
title: Dialog
description: Modal dialog component with focus trap and accessible overlay
---

# Dialog

A modal dialog component built on [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) providing accessible overlays with focus management, keyboard navigation, and customizable animations.

## Import

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components';
```

## Basic Usage

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here. Click save when you're done.
      </DialogDescription>
    </DialogHeader>
    <div className="py-4">
      <Input placeholder="Enter your name" />
    </div>
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline">Cancel</Button>
      </DialogClose>
      <Button>Save Changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Components

The Dialog system uses compound components for maximum flexibility:

| Component | Description |
|-----------|-------------|
| `Dialog` | Root component that manages open state |
| `DialogTrigger` | Button that opens the dialog |
| `DialogPortal` | Portals content to document body |
| `DialogOverlay` | Semi-transparent backdrop |
| `DialogContent` | Main content container with focus trap |
| `DialogHeader` | Container for title and description |
| `DialogFooter` | Container for action buttons |
| `DialogTitle` | Accessible dialog title |
| `DialogDescription` | Accessible dialog description |
| `DialogClose` | Button that closes the dialog |

## Props

### Dialog

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `defaultOpen` | `boolean` | `false` | Initial open state (uncontrolled) |
| `modal` | `boolean` | `true` | Whether to render as modal |

### DialogContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `onEscapeKeyDown` | `(event: KeyboardEvent) => void` | - | Called when Escape is pressed |
| `onPointerDownOutside` | `(event: PointerDownOutsideEvent) => void` | - | Called when clicking outside |
| `onInteractOutside` | `(event: Event) => void` | - | Called on any outside interaction |

### DialogTrigger / DialogClose

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge props onto child element |

## Examples

### Controlled Dialog

```tsx
function ControlledDialog() {
  const [open, setOpen] = useState(false);

  const handleSave = async () => {
    await saveData();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Open Settings</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {/* Settings form */}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Confirmation Dialog

```tsx
function DeleteConfirmation({ onConfirm }: { onConfirm: () => void }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Item</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            item from your library.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="destructive" onClick={onConfirm}>
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Form Dialog

```tsx
function CreateFolderDialog() {
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create folder logic
    setOpen(false);
    setName('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>New Folder</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Enter a name for your new folder.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="folder-name">Folder Name</Label>
            <Input
              id="folder-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Folder"
              autoFocus
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!name.trim()}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### Prevent Close on Outside Click

```tsx
<DialogContent
  onPointerDownOutside={(e) => e.preventDefault()}
  onEscapeKeyDown={(e) => e.preventDefault()}
>
  {/* Content that requires explicit close action */}
</DialogContent>
```

### Custom Overlay

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogPortal>
    <DialogOverlay className="bg-black/80" />
    <DialogContent>
      {/* Content */}
    </DialogContent>
  </DialogPortal>
</Dialog>
```

## Styling

The dialog uses semantic color tokens for theming:

```tsx
// DialogOverlay default styling
"fixed inset-0 z-50 bg-black/80"
"data-[state=open]:animate-in data-[state=closed]:animate-out"
"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"

// DialogContent default styling
"fixed left-[50%] top-[50%] z-50"
"translate-x-[-50%] translate-y-[-50%]"
"bg-background border rounded-lg shadow-lg"
"duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out"
```

### Size Variants

```tsx
// Small dialog
<DialogContent className="sm:max-w-[425px]">

// Medium dialog (default)
<DialogContent className="sm:max-w-lg">

// Large dialog
<DialogContent className="sm:max-w-2xl">

// Full width
<DialogContent className="sm:max-w-[90vw]">
```

## Accessibility

The Dialog component implements comprehensive accessibility features:

- **Focus Management**: Focus is trapped within the dialog when open
- **Focus Restoration**: Focus returns to trigger element on close
- **Escape Key**: Closes the dialog (can be prevented)
- **Click Outside**: Closes the dialog (can be prevented)
- **ARIA Attributes**: Proper `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby`
- **Screen Readers**: DialogTitle and DialogDescription are announced

### Required Elements

For proper accessibility, always include:

```tsx
<Dialog>
  <DialogContent>
    <DialogHeader>
      {/* Required: Provides aria-labelledby */}
      <DialogTitle>Title</DialogTitle>
      
      {/* Recommended: Provides aria-describedby */}
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
```

### Hiding Title Visually

If you need to hide the title visually but keep it accessible:

```tsx
<DialogTitle className="sr-only">Hidden Title</DialogTitle>
```

## Best Practices

### Do

- ✅ Always provide a `DialogTitle` for accessibility
- ✅ Use `DialogDescription` to explain the dialog's purpose
- ✅ Place primary action on the right in `DialogFooter`
- ✅ Use `DialogClose` with `asChild` for cancel buttons
- ✅ Keep dialog content focused and concise
- ✅ Use controlled mode when you need to prevent closing

### Don't

- ❌ Nest dialogs within dialogs
- ❌ Use for simple confirmations (consider inline confirmation)
- ❌ Put excessive content that requires scrolling
- ❌ Forget to handle form submission properly
- ❌ Prevent close without providing alternative exit

## Animation

The dialog includes built-in animations using Tailwind's animate utilities:

```css
/* Enter animation */
data-[state=open]:animate-in
data-[state=open]:fade-in-0
data-[state=open]:zoom-in-95

/* Exit animation */
data-[state=closed]:animate-out
data-[state=closed]:fade-out-0
data-[state=closed]:zoom-out-95
```

## Related Components

- [Button](../ui/button) - Commonly used for triggers and actions
- [DropdownMenu](./dropdown-menu) - For contextual menus instead of dialogs
- [Toast](../ui/toast) - For non-blocking notifications
